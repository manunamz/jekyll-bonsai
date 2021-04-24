# frozen_string_literal: true

# from: https://github.com/maximevaillancourt/digital-garden-jekyll-template/blob/master/_plugins/bidirectional_links_generator.rb
# build graph data: 
#   - net-web: from [[bidirectional, wiki links]].
#   - tree: dendron flavored dot.style.notation.md or directory structure.
require 'json'
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
  attr_accessor :id, :children, :namespace, :title

  def initialize(id, namespace, title)
    @id = id
    @children = []
    @namespace = namespace
    @title = title
  end

  def to_s
    "namespace: #{@namespace}"
  end
end


class GraphDataGenerator < Jekyll::Generator
    def generate(site)
      # from: https://stackoverflow.com/questions/16235601/what-are-the-steps-to-getting-this-custom-permalink-scheme-in-jekyll
      # Until Jekyll allows me to use :id, I have to resort to this
      site.collections['notes'].docs.each do |note|
        note.data['permalink'] = '/note/' + note.data['id'] + '/'
      end

      graph_nodes = []
      graph_links = []
  
      all_notes = site.collections['notes'].docs
      # all_pages = site.pages
  
      all_docs = all_notes # + all_pages
  
      link_extension = !!site.config["use_html_extension"] ? '.html' : ''

      all_docs.each do |cur_note|
        # note prep
        prep_notes(cur_note)
        # extra parsing
        parse_sidenote(cur_note, "right")
        parse_sidenote(cur_note, "left")
        parse_wiki_links(site, all_docs, cur_note, link_extension)
      end

      # !!!!!!!!!!!! #
      #  build tree  #
      # !!!!!!!!!!!! #
      
      root = Node.new('', 'root', 'Root')
      
      # set root node
      root_note = all_docs.detect {|note| note.data['slug'] == 'root' }
      root.id = root_note.data['id']

      # build tree
      all_docs.each do |cur_note|
        if cur_note.data['slug'].nil? or cur_note.data['slug'] == 'root'
          next
        else
          add_path(root, cur_note)
        end
      end

      json_formatted_tree, missing_children = tree_to_json(root)
      puts "***** There are missing nodes *****"
      puts missing_children
      File.open('assets/notes_tree.json', 'w') do |f|
        f.puts json_formatted_tree.to_json
      end
  
      # !!!!!!!!!!! #
      # Build graph #
      # !!!!!!!!!!! #
      
      # Identify note backlinks and add them to each note
      all_notes.each do |current_note|
        # Nodes: Jekyll
        notes_linking_to_current_note = all_notes.filter do |e|
          e.content.include?(current_note.data['id'])
        end
  
        # ADD CHILDREN TO graph_node HERE! (access from tree)

        # Nodes: Graph
        graph_nodes << {
          id: current_note.data['id'],
          label: current_note.data['title'],
        } unless current_note.path.include?('_notes/index.html')

        # Links: Jekyll
        current_note.data['backlinks'] = notes_linking_to_current_note
  
        # Links: Graph
        notes_linking_to_current_note.each do |n|
          graph_links << {
            source: n.data['id'],
            target: current_note.data['id'],
          }
        end
      end
  
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
      # check for newlines @ eof.
      #   (kramdown can handle footnotes with no newline, but the regex i'm getting requires a newline after the last footnote to find it.)
      if note.content[-1] != "\n"
        puts "WARN: " + note.data['title'] + " missing newline at end of file -- this could break the weather page."
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
        
        # Replace double-bracketed links using note filename
        # [[feline.cats]]
        # ⬜️ vscode-markdown-notes version: (\[\[)([^\|\]]+)(\]\])
        note.content = note.content.gsub(
          /\[\[#{namespace_from_filename}\]\]/i,
          "<a class='wiki-link' href='#{site.baseurl}#{note_potentially_linked_to.data['permalink']}#{link_extension}'>#{name_from_namespace}</a>"
        )

      end

      # At this point, all remaining double-bracket-wrapped words are
      # pointing to non-existing pages, so let's turn them into disabled
      # links by greying them out and changing the cursor
      note.content = note.content.gsub(
        /\[\[(.*)\]\]/i, # match on the remaining double-bracket links
        <<~HTML.chomp    # replace with this HTML (\\1 is what was inside the brackets)
          <span title='There is no note that matches this link.' class='invalid-link'>
            <span class='invalid-wiki-link'>[[</span>
            \\1
            <span class='invalid-wiki-link'>]]</span></span>
        HTML
      )
    end

    #########
    # graph #
    #########

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
          new_node = Node.new(cur_nd_id, cur_nd_namespace, cur_nd_title)
          node.children << new_node
        # if one already exists, fill-in node
        else
          cur_node = node.children.detect {|c| c.namespace == cur_nd_namespace }
          cur_node.id = cur_nd_id
          cur_node.title = cur_nd_title
        end
        return
      # create temp node and recurse
      else
        cur_namespace = 'root' + '.' + chunked_namespace[0..(depth - 1)].join('.')
        unless node.children.any?{ |c| c.namespace == cur_namespace }
          new_node = Node.new('', cur_namespace, '')
          node.children << new_node
        else
          new_node = node.children.detect {|c| c.namespace == cur_namespace }
        end
      end
      add_path(new_node, note, depth + 1)
    end

    # convert tree-class to json
    def tree_to_json(node, json_node={}, missing=[])
      if node.id.empty?
        missing << node.namespace
      end
      json_children = []
      missing_children = []
      node.children.each do |child|
        new_child, new_missing_children = tree_to_json(child, missing)
        json_children.append(new_child)
        missing_children += new_missing_children
      end
      json_node = {
        "id": node.id,
        "namespace": node.namespace,
        "label": node.title,
        "children": json_children
      }
      return json_node, missing + missing_children
    end

  end
  