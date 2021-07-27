# frozen_string_literal: true
require 'nanoid'
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
    # make sure ids are proper nano id format
    if !(entry.data['id'] =~ /^[1234567890abcdef]{10}$/)
      entry.data['id'] = Nanoid.generate(size: 10, alphabet: '1234567890abcdef')
    end
    # from: https://stackoverflow.com/questions/16235601/what-are-the-steps-to-getting-this-custom-permalink-scheme-in-jekyll
    # Until Jekyll allows me to use :id, I have to resort to this
    if link_extension.empty?
      entry.data['permalink'] = '/entry/' + entry.data['id'] + '/'
    else
      entry.data['permalink'] = '/entry/' + entry.data['id'] + link_extension
    end
    # sanitize timestamps: remove milliseconds from epoch time
    entry.data['created'] = Time.at(entry.data['created'].to_s[0..-4].to_i)
    entry.data['updated'] = Time.at(entry.data['updated'].to_s[0..-4].to_i)
  end
end
