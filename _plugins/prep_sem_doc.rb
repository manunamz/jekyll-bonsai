# frozen_string_literal: true
require 'time'

class SemTagVerificationGenerator < Jekyll::Generator
  safe true
  priority :highest
  
  def generate(site)
     #  
    # init jekyll vars
     #
     all_sem_docs = site.collections['sem_docs'].docs
     # all_pages = site.pages
     all_docs = all_sem_docs # + all_pages
     
     link_extension = site.config["permalink"] != "pretty" ? '.html' : ''
    
    all_docs.each do |cur_sem_doc|
      # validation and sanitization
      prep_sem_docs(site, cur_sem_doc, link_extension)
    end
  end

  # verify all sem_docs end with a "\n" so sidenotes works 
  #   (sidenotes don't detect the last definition if there is no ending "\n").
  def prep_sem_docs(site, sem_doc, link_extension)
    # from: https://stackoverflow.com/questions/16235601/what-are-the-steps-to-getting-this-custom-permalink-scheme-in-jekyll
    # Until Jekyll allows me to use :id, I have to resort to this
    sem_doc.data['permalink'] = '/sem/' + sem_doc.data['id'] + '/' + link_extension
    # sanitize timestamps: remove milliseconds from epoch time
    sem_doc.data['created'] = Time.at(sem_doc.data['created'].to_s[0..-4].to_i)
    sem_doc.data['updated'] = Time.at(sem_doc.data['updated'].to_s[0..-4].to_i)
  end
end
