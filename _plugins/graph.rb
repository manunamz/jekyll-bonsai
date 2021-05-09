# frozen_string_literal: true

# from: https://github.com/maximevaillancourt/digital-garden-jekyll-template/blob/master/_plugins/bidirectional_links_generator.rb
# build graph data: 
#   - net-web: from [[bidirectional, wiki links]].
#   - tree: dendron flavored dot.style.notation.md or directory structure.


# helper class for tree-building.
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
  priority :lowest

  def generate(site)
     #  
    # init jekyll vars
     #
    all_notes = site.collections['notes'].docs
    # all_pages = site.pages
    all_docs = all_notes # + all_pages
    link_extension = !!site.config["use_html_extension"] ? '.html' : ''

    # 
    # graph:init
    # 
    # for tree: set root node
    root_note = all_docs.detect {|note| note.data['slug'] == 'root' }
    root = Node.new(root_note.data['id'], 'root', site.config['index_note_title'], root_note)
    # for net-web: set nodes'n'links
    graph_nodes, graph_links = [], []

    # 
    # graph:build
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
      cur_note.data['ancestors'], cur_note.data['children'] = find_note_immediate_relatives(cur_note, root, all_docs)
    end
    json_formatted_tree = tree_to_json(root)
 
    #
    # graph:generate
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

  # add unique path for the given note to tree (node-class).
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

  # convert tree (node-class) to json
  def tree_to_json(node, json_node={})
    if node.id.empty?
      Jekyll.logger.warn "Tree node missing: ", node.namespace
      label = ""
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

  # find the parent and children of the 'target_note'.
  def find_note_immediate_relatives(target_note, node, all_notes, ancestors=[])
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
        results.concat find_note_immediate_relatives(target_note, child_node, all_notes, ancestors.clone)
      end
      return results.select { |r| !r.nil? }
    end
  end

  # ...for testing
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
