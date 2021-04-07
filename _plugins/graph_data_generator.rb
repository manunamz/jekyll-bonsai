# from: https://github.com/maximevaillancourt/digital-garden-jekyll-template/blob/master/_plugins/bidirectional_links_generator.rb
# build graph data: 
#   - network: from [[bidirectional, wiki links]].
#   - tree: dendron flavored dot.style.notation.md or directory structure.

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
      all_pages = site.pages
  
      all_docs = all_notes + all_pages
  
      link_extension = !!site.config["use_html_extension"] ? '.html' : ''

      # !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!! #
      # Convert [[internal links]] to <a class='ineternal-link' href='note.data['id']'>\\1</a> #
      # !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!! #

      # Convert all Wiki/Roam-style double-bracket link syntax to plain HTML
      # anchor tag elements (<a>) with "internal-link" CSS class
      all_docs.each do |current_note|
        all_docs.each do |note_potentially_linked_to|
          title_from_filename = File.basename(
            note_potentially_linked_to.basename,
            File.extname(note_potentially_linked_to.basename)
          ).gsub('_', ' ').gsub('-', ' ').capitalize
  
          # # Replace double-bracketed links with label using note title
          # # [[A note about cats|this is a link to the note about cats]]
          # current_note.content = current_note.content.gsub(
          #   /\[\[#{title_from_filename}\|(.+?)(?=\])\]\]/i,
          #   "<a class='internal-link' href='#{site.baseurl}#{note_potentially_linked_to.data['permalink']}#{link_extension}'>\\1</a>"
          # )
  
          # # Replace double-bracketed links with label using note filename
          # # [[cats|this is a link to the note about cats]]
          # current_note.content = current_note.content.gsub(
          #   /\[\[#{note_potentially_linked_to.data['title']}\|(.+?)(?=\])\]\]/i,
          #   "<a class='internal-link' href='#{site.baseurl}#{note_potentially_linked_to.data['permalink']}#{link_extension}'>\\1</a>"
          # )
  
          # # Replace double-bracketed links using note title
          # # [[a note about cats]]
          # current_note.content = current_note.content.gsub(
          #   /\[\[(#{note_potentially_linked_to.data['title']})\]\]/i,
          #   "<a class='internal-link' href='#{site.baseurl}#{note_potentially_linked_to.data['permalink']}#{link_extension}'>\\1</a>"
          # )
  
          # Replace double-bracketed links using note filename
          # [[cats]]
          current_note.content = current_note.content.gsub(
            /\[\[(#{title_from_filename})\]\]/i,
            "<a class='internal-link' href='#{site.baseurl}#{note_potentially_linked_to.data['permalink']}#{link_extension}'>\\1</a>"
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
  
        # Nodes: Graph
        graph_nodes << {
          id: note_id_from_note(current_note),
          path: "#{site.baseurl}#{current_note.data['id']}#{link_extension}",
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
  
      File.write('_includes/notes_graph.json', JSON.dump({
        links: graph_links,
        nodes: graph_nodes,
      }))
    end
  
    def note_id_from_note(note)
      note.data['title']
        .dup
        .gsub(/\W+/, ' ')
        .delete(' ')
        .to_i(36)
        .to_s
    end

  end
  