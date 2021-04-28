# frozen_string_literal: true

# from: https://github.com/maximevaillancourt/digital-garden-jekyll-template/blob/master/_plugins/bidirectional_links_generator.rb
# build graph data: 
#   - net-web: from [[bidirectional, wiki links]].
#   - tree: dendron flavored dot.style.notation.md or directory structure.
require 'time'

##
# external constants
##
#
# from: https://github.com/ruby/rexml/blob/master/lib/rexml/parsers/baseparser.rb#L36
#
LETTER = '[:alpha:]'
# DIGIT = '[:digit:]'
COMBININGCHAR = '' # TODO
EXTENDER = ''      # TODO
NCNAME_STR= "[#{LETTER}_][-[:alnum:]._#{COMBININGCHAR}#{EXTENDER}]*"
UNAME_STR= "(?:#{NCNAME_STR}:)?#{NCNAME_STR}"
##
# from kramdown: https://github.com/gettalong/kramdown
##
# from blank_line.rb
BLANK_LINE = /(?>^\s*\n)+/
# from eob.rb
EOB_MARKER = /^\^\s*?\n/
# from kramdown.rb
OPT_SPACE = / {0,3}/
# Regexp for matching indentation (one tab or four spaces)
INDENT = /^(?:\t| {4})/
# from extensions.rb
ALD_ID_CHARS = /[\w-]/
ALD_ANY_CHARS = /\\\}|[^\}]/
ALD_ID_NAME = /\w#{ALD_ID_CHARS}*/
IAL_BLOCK = /\{:(?!:|\/)(#{ALD_ANY_CHARS}+)\}\s*?\n/
IAL_BLOCK_START = /^#{OPT_SPACE}#{IAL_BLOCK}/
# from html.rb
# Some HTML elements like script belong to both categories (i.e. are valid in block and
# span HTML) and don't appear therefore!
# script, textarea
HTML_SPAN_ELEMENTS = %w[a abbr acronym b big bdo br button cite code del dfn em i img input
                        ins kbd label mark option q rb rbc rp rt rtc ruby samp select small
                        span strong sub sup tt u var]
# from paragraph.rb
LAZY_END_HTML_SPAN_ELEMENTS = HTML_SPAN_ELEMENTS + %w[script]
LAZY_END_HTML_START = /<(?>(?!(?:#{LAZY_END_HTML_SPAN_ELEMENTS.join('|')})\b)#{REXML::Parsers::BaseParser::UNAME_STR})/
LAZY_END_HTML_STOP = /<\/(?!(?:#{LAZY_END_HTML_SPAN_ELEMENTS.join('|')})\b)#{REXML::Parsers::BaseParser::UNAME_STR}\s*>/m
# from markdown.rb
# CODEBLOCK_MATCH = /(?:#{BLANK_LINE}?(?:#{INDENT}[ \t]*\S.*\n)+)*/
# because `.gsub(INDENT, '')` in footnote.rb
# CODEBLOCK_MATCH = /(?:#{BLANK_LINE}?(?:s[ \t]*\S.*\n)+)*/
# from codeblock.rb
CODEBLOCK_MATCH = /(?:#{BLANK_LINE}?(?:#{INDENT}[ \t]*\S.*\n)+(?:(?!#{IAL_BLOCK_START}|#{EOB_MARKER}|^#{OPT_SPACE}#{LAZY_END_HTML_STOP}|^#{OPT_SPACE}#{LAZY_END_HTML_START})^[ \t]*\S.*\n)*)*/
# footnotes (for reference)
# FOOTNOTE_DEFINITION_START = /^#{OPT_SPACE}\[\^(#{ALD_ID_NAME})\]:\s*?(.*?\n#{CODEBLOCK_MATCH})/
# FOOTNOTE_MARKER_START = /\[\^(#{ALD_ID_NAME})\]/
##
# constants for local use
##

RIGHT_SIDENOTE_DEFINITION_START = /^#{OPT_SPACE}\[\<(#{ALD_ID_NAME})\]:\s*?(.*?\n#{CODEBLOCK_MATCH})/
RIGHT_SIDENOTE_MARKER_START = /\[\<(#{ALD_ID_NAME})\]/

LEFT_SIDENOTE_DEFINITION_START = /^#{OPT_SPACE}\[\>(#{ALD_ID_NAME})\]:\s*?(.*?\n#{CODEBLOCK_MATCH})/
LEFT_SIDENOTE_MARKER_START = /\[\>(#{ALD_ID_NAME})\]/

class Node
  attr_accessor :id, :namespace, :title, :children, :note

  def initialize(id, namespace, title, note)
    @id = id
    @children = []
    @namespace = namespace
    @title = title
    @note = note
  end

  def to_s
    "namespace: #{@namespace}"
  end
end


class GraphDataGenerator < Jekyll::Generator
  def generate(site)
     #  
    # init jekyll vars
     #
    all_notes = site.collections['notes'].docs
    # all_pages = site.pages
    all_docs = all_notes # + all_pages
    link_extension = !!site.config["use_html_extension"] ? '.html' : ''
    
     #
    # note prep
     #
    all_docs.each do |cur_note|
      # validation and sanitization
      prep_notes(cur_note)
    end

     #
    # extra parsing
     #
    all_docs.each do |cur_note|
      # extra parsing
      parse_sidenote(cur_note, "right")
      parse_sidenote(cur_note, "left")
      parse_wiki_links(site, all_docs, cur_note, link_extension)
    end

     #
    # init graphs
     #
    # for tree: set root node
    root_note = all_docs.detect {|note| note.data['slug'] == 'root' }
    root = Node.new(root_note.data['id'], 'root', 'Root', root_note)
    # for net-web: set nodes'n'links
    graph_nodes, graph_links = [], []

     #
    # build graphs
     #
    all_docs.each do |cur_note|
      # add path to tree
      if !cur_note.data['slug'].nil? and cur_note.data['slug'] != 'root'
        add_path(root, cur_note)
      end
      # add backlinks for net-web
      # add data to graph_nodes and graph_links
      # set backlinks metadata for note
      cur_note.data['backlinks'] = add_backlinks_json(all_docs, cur_note, graph_nodes, graph_links)
    end
    # print_tree(root)
    # once tree is finished building, attach metadata to each note
    all_docs.each do |cur_note|
      cur_note.data['ancestors'], cur_note.data['children'] = find_note_family_tree(cur_note, root, all_docs)
    end
    json_formatted_tree = tree_to_json(root)
     #
    # generate graphs
     #
    File.write('assets/notes_tree.json', JSON.dump(
      json_formatted_tree
    ))
    File.write('assets/notes_net_web.json', JSON.dump({
      links: graph_links,
      nodes: graph_nodes,
    }))
  end

  # !!!!!!!!!!!!!!!! #
  # Helper functions #
  # !!!!!!!!!!!!!!!! #

  ##############
  # prep notes #
  ##############

  # verify all notes end with a "\n" so sidenotes works 
  #   (sidenotes don't detect the last definition if there is no ending "\n").
  def prep_notes(note)
    # from: https://stackoverflow.com/questions/16235601/what-are-the-steps-to-getting-this-custom-permalink-scheme-in-jekyll
    # Until Jekyll allows me to use :id, I have to resort to this
    note.data['permalink'] = '/note/' + note.data['id'] + '/'
    # check for newlines @ eof.
    #   (kramdown can handle footnotes with no newline, but the regex i'm getting requires a newline after the last footnote to find it.)
    if note.content[-1] != "\n"
      Jekyll.logger.warn "Missing newline at end of file -- this could break sidenotes: ", note.data['title']
    end
    # sanitize timestamps: remove milliseconds from epoch time
    note.data['created'] = Time.at(note.data['created'].to_s[0..-4].to_i)
    note.data['updated'] = Time.at(note.data['updated'].to_s[0..-4].to_i)
  end

  #################
  # extra parsing #
  #################
  
  # just get tufte-style sidenotes working for now...
  # if there's time, emulate gwern's method: https://github.com/gwern/gwern.net/blob/9e6893033ec63248b1f0b29df119c40d39a7dcef/css/default.css#L1223
  
  # tag -> [<right-sidenote], [<right-sidenote]:
  # def -> [>left-sidenote], [>left-sidenote]:
  # `side` is 'right' or 'left'
  def parse_sidenote(note, side)
    # left v right setup
    if side == "right"
      sidenote_def_regex = RIGHT_SIDENOTE_DEFINITION_START
      sidenote_mark_regex = RIGHT_SIDENOTE_MARKER_START
      css_class = "rsn"
      sn_regex = /\</
    elsif side == "left"
      sidenote_def_regex = LEFT_SIDENOTE_DEFINITION_START
      sidenote_mark_regex = LEFT_SIDENOTE_MARKER_START
      css_class = "lsn"
      sn_regex = /\>/
    else
        puts "ERROR: Can't process sidenote that is not either 'right' or 'left'."
        return
    end
    # process sidenotes
    sidenotes = note.content.scan(sidenote_def_regex)
    note.content.gsub!(sidenote_def_regex, '') # rm sidenote defs from original note.
    i = 0
    sidenotes.each do |sidenote|
      i += 1
      mark = sidenote[0]
      definition = sidenote[1]
      note.content = note.content.gsub(
        /\[#{sn_regex}(#{mark})\]/i,
        "<label for=\"#{css_class}-#{i}\" class=\"sidenote-toggle sidenote-number\"></label><input type=\"checkbox\" id=\"#{css_class}-#{i}\" class=\"sidenote-toggle\"><span class=\"#{css_class}\">#{definition}</span>"
      )
    end
  end
  
  def parse_wiki_links(site, all_notes, note, link_extension)
    missing = []
    # some regex taken from vscode-markdown-notes: https://github.com/kortina/vscode-markdown-notes/blob/master/syntaxes/notes.tmLanguage.json   
    # Convert all Wiki/Roam-style double-bracket link syntax to plain HTML
    # anchor tag elements (<a>) with "internal-link" CSS class
    all_notes.each do |note_potentially_linked_to|
      namespace_from_filename = File.basename(
        note_potentially_linked_to.basename,
        File.extname(note_potentially_linked_to.basename)
      )

      # regex: extract note name from the end of the string to the first occurring '.'
      # ex: 'garden.lifecycle.bamboo-shoot' -> 'bamboo shoot'
      name_from_namespace = namespace_from_filename.match('([^.]*$)')[0].gsub('-', ' ')
      # Replace double-bracketed links using note filename
      # [[feline.cats]]
      # ⬜️ vscode-markdown-notes version: (\[\[)([^\|\]]+)(\]\])
      note.content = note.content.gsub(
        /\[\[#{namespace_from_filename}\]\]/i,
        "<a class='wiki-link' href='#{site.baseurl}#{note_potentially_linked_to.data['permalink']}#{link_extension}'>#{name_from_namespace}</a>"
      )

      # Replace double-bracketed links with alias (right) using note title
      # [[feline.cats|this is a link to the note about cats]]
      # ✅ vscode-markdown-notes version: (\[\[)([^\]\|]+)(\|)([^\]]+)(\]\])
      note.content = note.content.gsub(
        /(\[\[)(#{namespace_from_filename})(\|)([^\]]+)(\]\])/i,
        "<a class='wiki-link' href='#{site.baseurl}#{note_potentially_linked_to.data['permalink']}#{link_extension}'>\\4</a>"
      )

      # Replace double-bracketed links with alias (left) using note title
      # [[this is a link to the note about cats|feline.cats]]
      # ✅ vscode-markdown-notes version: (\[\[)([^\]\|]+)(\|)([^\]]+)(\]\])
      note.content = note.content.gsub(
        /(\[\[)([^\]\|]+)(\|)(#{namespace_from_filename})(\]\])/i,
        "<a class='wiki-link' href='#{site.baseurl}#{note_potentially_linked_to.data['permalink']}#{link_extension}'>\\2</a>"
      )
    end

    # At this point, all remaining double-bracket-wrapped words are
    # pointing to non-existing pages, so let's turn them into disabled
    # links by greying them out and changing the cursor
    note.content = note.content.gsub(
      /\[\[(.*)\]\]/i, # match on the remaining double-bracket links
      <<~HTML.chomp    # replace with this HTML (\\1 is what was inside the brackets)
        <span title='There is no note that matches this link.' class='invalid-wiki-link'>
          [[\\1]]
        </span>
      HTML
    )
  end

  #########
  # graph #
  #########
  def add_backlinks_json(all_notes, note, graph_nodes, graph_links)
    # net-web: Identify note backlinks and add them to each note
    # Jekyll
    #   nodes 
    backlinks = []
    all_notes.each do |backlinked_note|
      if backlinked_note.content.include?(note.data['id'])
        backlinks << backlinked_note
      end
      # identify missing links by .invalid-wiki-link class and nested note-name.
      missing_node_names = note.content.match(/invalid-wiki-link[^\]]+\[\[([^\]]+)\]\]/i)
      if !missing_node_names.nil?
        missing_no_namespace = missing_node_names[1]
        # add missing nodes
        if graph_nodes.none? { |node| node[:id] == missing_no_namespace }
          Jekyll.logger.warn "Net-Web node missing: ", missing_no_namespace
          Jekyll.logger.warn " in: ", note.data['slug']  
          graph_nodes << {
            id: missing_no_namespace,
            label: missing_no_namespace,
          }
        end
          # add missing links
          graph_links << {
            source: note.data['id'],
            target: missing_no_namespace,
          }
      end
    end
    # graph
    #   nodes
    graph_nodes << {
      id: note.data['id'],
      label: note.data['title'],
    } unless note.path.include?('_notes/index.html')
    #   links
    backlinks.each do |b|
      graph_links << {
        source: b.data['id'],
        target: note.data['id'],
      }
    end
    return backlinks
  end 

  # add unique path for the given note 
  def add_path(node, note, depth=1)
    chunked_namespace = note.data['slug'].split(/\s|\./)
    # if the given node was not root and we are at depth, handle note
    if depth == chunked_namespace.length
      cur_nd_namespace = 'root' + '.' + note.data['slug']
      cur_nd_id = note.data['id']
      cur_nd_title = note.data['title']
      # if one does not exist, create node
      unless node.children.any?{ |c| c.namespace == cur_nd_namespace }
        new_node = Node.new(cur_nd_id, cur_nd_namespace, cur_nd_title, note)
        node.children << new_node
      # if one already exists, fill-in node
      else
        cur_node = node.children.detect {|c| c.namespace == cur_nd_namespace }
        cur_node.id = cur_nd_id
        cur_node.title = cur_nd_title
        cur_node.note = note
      end
      return
    # create temp node and recurse
    else
      cur_namespace = 'root' + '.' + chunked_namespace[0..(depth - 1)].join('.')
      unless node.children.any?{ |c| c.namespace == cur_namespace }
        new_node = Node.new('', cur_namespace, '', '')
        node.children << new_node
      else
        new_node = node.children.detect {|c| c.namespace == cur_namespace }
      end
    end
    add_path(new_node, note, depth + 1)
  end

  # convert tree-class to json
  def tree_to_json(node, json_node={})
    if node.id.empty?
      Jekyll.logger.warn "Tree node missing: ", node.namespace
      label = node.namespace.match('([^.]*$)')[0].gsub('-', ' ')
    else
      label = node.title
    end
    json_children = []
    node.children.each do |child|
      new_child = tree_to_json(child)
      json_children.append(new_child)
    end
    json_node = {
      "id": node.id,
      "namespace": node.namespace,
      "label": label,
      "children": json_children
    }
    return json_node
  end

  def find_note_family_tree(target_note, node, all_notes, ancestors=[])
    if target_note.data['id'] == node.id
      children = []
      node.children.each do |child|
        children << child.note
      end
      return ancestors, children
    else
      if node.id == ''
        ancestors << node.namespace.match('([^.]*$)')[0].gsub('-', ' ')
      else
        ancestors << node.note
      end
      results = []
      node.children.each do |child_node|
        results.concat find_note_family_tree(target_note, child_node, all_notes, ancestors.clone)
      end
      return results.select { |r| !r.nil? }
    end
  end

  # helper function for testing
  def print_tree(node, ancestors=[])
    Jekyll.logger.warn "Ancestors: ", ancestors.length
    Jekyll.logger.warn node
    Jekyll.logger.warn "Children: ", node.children
    ancestors.append(node.id)
    node.children.each do |child_node|
      print_tree(child_node, ancestors.clone)
    end
  end
end
  