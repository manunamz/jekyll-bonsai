# # from: https://stackoverflow.com/questions/16235601/what-are-the-steps-to-getting-this-custom-permalink-scheme-in-jekyll

# module Jekyll
#     class NoteInsertPermalink < Generator
#         safe true
#         priority :low

#         def generate(site)
#             # Until Jekyll allows me to use :id, I have to resort to this
#             site.collections['notes'].docs.each do |note|
#                 note.data['permalink'] = '/' + note.data['id'] + '/'
#             end
#         end
#     end
# end
