# from: https://github.com/maximevaillancourt/digital-garden-jekyll-template/blob/master/_plugins/bidirectional_links_generator.rb
# build graph data: 
#   - network: from [[bidirectional, wiki links]].
#   - tree: dendron flavored dot.style.notation.md or directory structure.
require 'json'

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

# frozen_string_literal: true
class GraphDataGenerator < Jekyll::Generator
    def generate(site)
      # from: https://stackoverflow.com/questions/16235601/what-are-the-steps-to-getting-this-custom-permalink-scheme-in-jekyll
      # Until Jekyll allows me to use :id, I have to resort to this
      site.collections['notes'].docs.each do |note|
        note.data['permalink'] = '/' + note.data['id'] + '/'
      end

      graph_nodes = []
      graph_links = []
  
      all_notes = site.collections['notes'].docs
      # all_pages = site.pages
  
      all_docs = all_notes # + all_pages
  
      link_extension = !!site.config["use_html_extension"] ? '.html' : ''

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

      # !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!! #
      #  Convert [[internal links]] to <a class='ineternal-link' href='note.data['id']'>\\1</a> #
      # !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!! #

      # Convert all Wiki/Roam-style double-bracket link syntax to plain HTML
      # anchor tag elements (<a>) with "internal-link" CSS class
      all_docs.each do |current_note|
        all_docs.each do |note_potentially_linked_to|
          namespace_from_filename = File.basename(
            note_potentially_linked_to.basename,
            File.extname(note_potentially_linked_to.basename)
          )
          # regex: extract note name from the end of the string to the first occurring '.'
          # ex: 'garden.lifecycle.bamboo' -> 'bamboo'
          name_from_namespace = namespace_from_filename.match('([^.]*$)')

          # # Replace double-bracketed links with label using note title
          # # [[A note about cats|this is a link to the note about cats]]
          # current_note.content = current_note.content.gsub(
          #   /\[\[#{namespace_from_filename}\|(.+?)(?=\])\]\]/i,
          #   "<a class='internal-link' href='#{site.baseurl}#{note_potentially_linked_to.data['permalink']}#{link_extension}'>#{name_from_namespace}</a>"
          # )
  
          # # Replace double-bracketed links with label using note filename
          # # [[cats|this is a link to the note about cats]]
          # current_note.content = current_note.content.gsub(
          #   /\[\[#{note_potentially_linked_to.data['title']}\|(.+?)(?=\])\]\]/i,
          #   "<a class='internal-link' href='#{site.baseurl}#{note_potentially_linked_to.data['permalink']}#{link_extension}'>#{name_from_namespace}</a>"
          # )
  
          # # Replace double-bracketed links using note title
          # # [[a note about cats]]
          # current_note.content = current_note.content.gsub(
          #   /\[\[(#{note_potentially_linked_to.data['title']})\]\]/i,
          #   "<a class='internal-link' href='#{site.baseurl}#{note_potentially_linked_to.data['permalink']}#{link_extension}'>#{name_from_namespace}</a>"
          # )
  
          # Replace double-bracketed links using note filename
          # [[cats]]
          current_note.content = current_note.content.gsub(
            /\[\[(#{namespace_from_filename})\]\]/i,
            "<a class='internal-link' href='#{site.baseurl}#{note_potentially_linked_to.data['permalink']}#{link_extension}'>#{name_from_namespace}</a>"
          )

        end
  
        # At this point, all remaining double-bracket-wrapped words are
        # pointing to non-existing pages, so let's turn them into disabled
        # links by greying them out and changing the cursor
        current_note.content = current_note.content.gsub(
          /\[\[(.*)\]\]/i, # match on the remaining double-bracket links
          <<~HTML.chomp    # replace with this HTML (\\1 is what was inside the brackets)
            <span title='There is no note that matches this link.' class='invalid-link'>
              <span class='invalid-link-brackets'>[[</span>
              \\1
              <span class='invalid-link-brackets'>]]</span></span>
          HTML
        )
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
          # id: note_id_from_note(current_note),
          # path: "#{site.baseurl}#{current_note.data['id']}#{link_extension}",
          id: current_note.data['id'],
          # permalink: "#{site.baseurl}#{current_note.data['id']}#{link_extension}",
          # path: current_note.data['id'],
          label: current_note.data['title'],
        } unless current_note.path.include?('_notes/index.html')

        # Links: Jekyll
        current_note.data['backlinks'] = notes_linking_to_current_note
  
        # Links: Graph
        notes_linking_to_current_note.each do |n|
          graph_links << {
            # source: note_id_from_note(n),
            # target: note_id_from_note(current_note),
            source: n.data['id'],
            target: current_note.data['id'],
          }
        end
      end
  
      File.write('assets/notes_graph.json', JSON.dump({
        links: graph_links,
        nodes: graph_nodes,
      }))
    end

    # !!!!!!!!!!!!!!!! #
    # Helper functions #
    # !!!!!!!!!!!!!!!! #

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
  