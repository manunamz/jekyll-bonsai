# frozen_string_literal: true
require 'time'

class EntryVerificationGenerator < Jekyll::Generator
  safe true
  priority :highest
  
  def generate(site)
     #  
    # init jekyll vars
     #
     all_entries = site.collections['entries'].docs
     # all_pages = site.pages
     all_docs = all_entries # + all_pages
     
     link_extension = site.config["permalink"] != "pretty" ? '.html' : ''
    
    all_docs.each do |cur_entry|
      # validation and sanitization
      prep_entries(site, cur_entry, link_extension)
    end
  end

  # verify all entries end with a "\n" so sidenotes works 
  #   (sidenotes don't detect the last definition if there is no ending "\n").
  def prep_entries(site, entry, link_extension)
    # from: https://stackoverflow.com/questions/16235601/what-are-the-steps-to-getting-this-custom-permalink-scheme-in-jekyll
    # Until Jekyll allows me to use :id, I have to resort to this
    entry.data['permalink'] = '/entry/' + entry.data['id'] + '/' + link_extension
    # sanitize timestamps: remove milliseconds from epoch time
    entry.data['created'] = Time.at(entry.data['created'].to_s[0..-4].to_i)
    entry.data['updated'] = Time.at(entry.data['updated'].to_s[0..-4].to_i)
  end
end