# # frozen_string_literal: true

# require 'jekyll'
# # require_relative 'utils.rb'

# module Jekyll
#   class PrepNotes
#     class << self
#       # def prepare(note)
#       #   # self.last_char_is_newline(note)
#       #   # self.sanitize_timestamps(note)
#       #   puts note
#       #   if note.content.nil?
#       #     return
#       #   # verify last char is newline
#       #   elsif note.content[-1] != "\n"
#       #     puts note.title + " missing newline at end of file."
#       #   end
#       #   # verify timestamps
#       #   # assert_nothing_raised { Utils.to_date(note.data['created']) }
#       #   # assert_nothing_raised { Utils.to_date(note.data['updated']) }
        
#       #   # verify timestamps
#       #   note.data['created'] = Time.at(note.data['created'].to_s[0..-4].to_i)
#       #   note.data['updated'] = Time.at(note.data['updated'].to_s[0..-4].to_i)
#       # end
#         # verify all notes end with a "\n" so sidenotes works 
#       #   (sidenotes don't detect the last definition if there is no ending "\n").
#       def prep_notes(note)
#         Jekyll.logger.warn "processing note: ", note.data['title']
#         if note.content.nil?
#           return
#         end
#         # from: https://stackoverflow.com/questions/16235601/what-are-the-steps-to-getting-this-custom-permalink-scheme-in-jekyll
#         # Until Jekyll allows me to use :id, I have to resort to this
#         note.data['permalink'] = '/note/' + note.data['id'] + '/'
#         # check for newlines @ eof.
#         #   (kramdown can handle footnotes with no newline, but the regex i'm getting requires a newline after the last footnote to find it.)
#         if note.content[-1] != "\n"
#           Jekyll.logger.warn "Missing newline at end of file -- this could break sidenotes: ", note.data['title']
#         end
#         # sanitize timestamps: remove milliseconds from epoch time
#         note.data['created'] = Time.at(note.data['created'].to_s[0..-4].to_i)
#         note.data['updated'] = Time.at(note.data['updated'].to_s[0..-4].to_i)
#       end
#     end
#   end
# end

# Jekyll::Hooks.register :notes, :pre_render do |note|
#   Jekyll::PrepNotes.prep_notes(note)
# end
