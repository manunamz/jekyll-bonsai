# frozen_string_literal: true
require 'time'

class SemTagVerificationGenerator < Jekyll::Generator
  safe true
  priority :highest
  
  def generate(site)
     #  
    # init jekyll vars
     #
     all_sem_tags = site.collections['sem_tags'].docs
     # all_pages = site.pages
     all_docs = all_sem_tags # + all_pages
     
     link_extension = site.config["permalink"] != "pretty" ? '.html' : ''
    
    all_docs.each do |cur_sem_tag|
      # validation and sanitization
      prep_sem_tags(site, cur_sem_tag, link_extension)
    end
  end

  # verify all sem_tags end with a "\n" so sidenotes works 
  #   (sidenotes don't detect the last definition if there is no ending "\n").
  def prep_sem_tags(site, sem_tag, link_extension)
    # from: https://stackoverflow.com/questions/16235601/what-are-the-steps-to-getting-this-custom-permalink-scheme-in-jekyll
    # Until Jekyll allows me to use :id, I have to resort to this
    sem_tag.data['permalink'] = '/sem-tag/' + sem_tag.data['id'] + '/' + link_extension
    # sanitize timestamps: remove milliseconds from epoch time
    sem_tag.data['created'] = Time.at(sem_tag.data['created'].to_s[0..-4].to_i)
    sem_tag.data['updated'] = Time.at(sem_tag.data['updated'].to_s[0..-4].to_i)
  end
end
