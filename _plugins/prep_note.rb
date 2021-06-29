# frozen_string_literal: true
require 'time'

class NoteVerificationGenerator < Jekyll::Generator
  safe true
  priority :highest
  
  def generate(site)
     #  
    # init jekyll vars
     #
     all_notes = site.collections['sem_tags'].docs
     # all_pages = site.pages
     all_docs = all_notes # + all_pages
     
     link_extension = site.config["permalink"] != "pretty" ? '.html' : ''
    
    all_docs.each do |cur_note|
      # validation and sanitization
      prep_notes(site, cur_note, site.config['index_note_title'], link_extension)
    end
  end

  # verify all notes end with a "\n" so sidenotes works 
  #   (sidenotes don't detect the last definition if there is no ending "\n").
  def prep_notes(site, note, index_note_title, link_extension)
    # from: https://stackoverflow.com/questions/16235601/what-are-the-steps-to-getting-this-custom-permalink-scheme-in-jekyll
    # Until Jekyll allows me to use :id, I have to resort to this
    note.data['permalink'] = '/note/' + note.data['id'] + '/' + link_extension
    # sanitize timestamps: remove milliseconds from epoch time
    note.data['created'] = Time.at(note.data['created'].to_s[0..-4].to_i)
    note.data['updated'] = Time.at(note.data['updated'].to_s[0..-4].to_i)
  end
end
