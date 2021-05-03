# ##
# # external constants
# ##
# #
# # from: https://github.com/ruby/rexml/blob/master/lib/rexml/parsers/baseparser.rb#L36
# #
# LETTER = '[:alpha:]'
# # DIGIT = '[:digit:]'
# COMBININGCHAR = '' # TODO
# EXTENDER = ''      # TODO
# NCNAME_STR= "[#{LETTER}_][-[:alnum:]._#{COMBININGCHAR}#{EXTENDER}]*"
# UNAME_STR= "(?:#{NCNAME_STR}:)?#{NCNAME_STR}"
# ##
# # from kramdown: https://github.com/gettalong/kramdown
# ##
# # from blank_line.rb
# BLANK_LINE = /(?>^\s*\n)+/
# # from eob.rb
# EOB_MARKER = /^\^\s*?\n/
# # from kramdown.rb
# OPT_SPACE = / {0,3}/
# # Regexp for matching indentation (one tab or four spaces)
# INDENT = /^(?:\t| {4})/
# # from extensions.rb
# ALD_ID_CHARS = /[\w-]/
# ALD_ANY_CHARS = /\\\}|[^\}]/
# ALD_ID_NAME = /\w#{ALD_ID_CHARS}*/
# IAL_BLOCK = /\{:(?!:|\/)(#{ALD_ANY_CHARS}+)\}\s*?\n/
# IAL_BLOCK_START = /^#{OPT_SPACE}#{IAL_BLOCK}/
# # from html.rb
# # Some HTML elements like script belong to both categories (i.e. are valid in block and
# # span HTML) and don't appear therefore!
# # script, textarea
# HTML_SPAN_ELEMENTS = %w[a abbr acronym b big bdo br button cite code del dfn em i img input
#                         ins kbd label mark option q rb rbc rp rt rtc ruby samp select small
#                         span strong sub sup tt u var]
# # from paragraph.rb
# LAZY_END_HTML_SPAN_ELEMENTS = HTML_SPAN_ELEMENTS + %w[script]
# LAZY_END_HTML_START = /<(?>(?!(?:#{LAZY_END_HTML_SPAN_ELEMENTS.join('|')})\b)#{REXML::Parsers::BaseParser::UNAME_STR})/
# LAZY_END_HTML_STOP = /<\/(?!(?:#{LAZY_END_HTML_SPAN_ELEMENTS.join('|')})\b)#{REXML::Parsers::BaseParser::UNAME_STR}\s*>/m
# # from markdown.rb
# # CODEBLOCK_MATCH = /(?:#{BLANK_LINE}?(?:#{INDENT}[ \t]*\S.*\n)+)*/
# # because `.gsub(INDENT, '')` in footnote.rb
# # CODEBLOCK_MATCH = /(?:#{BLANK_LINE}?(?:s[ \t]*\S.*\n)+)*/
# # from codeblock.rb
# CODEBLOCK_MATCH = /(?:#{BLANK_LINE}?(?:#{INDENT}[ \t]*\S.*\n)+(?:(?!#{IAL_BLOCK_START}|#{EOB_MARKER}|^#{OPT_SPACE}#{LAZY_END_HTML_STOP}|^#{OPT_SPACE}#{LAZY_END_HTML_START})^[ \t]*\S.*\n)*)*/
# # footnotes (for reference)
# # FOOTNOTE_DEFINITION_START = /^#{OPT_SPACE}\[\^(#{ALD_ID_NAME})\]:\s*?(.*?\n#{CODEBLOCK_MATCH})/
# # FOOTNOTE_MARKER_START = /\[\^(#{ALD_ID_NAME})\]/
# ##
# # constants for local use
# ##

# RIGHT_SIDENOTE_DEFINITION_START = /^#{OPT_SPACE}\[\<(#{ALD_ID_NAME})\]:\s*?(.*?\n#{CODEBLOCK_MATCH})/
# RIGHT_SIDENOTE_MARKER_START = /\[\<(#{ALD_ID_NAME})\]/

# LEFT_SIDENOTE_DEFINITION_START = /^#{OPT_SPACE}\[\>(#{ALD_ID_NAME})\]:\s*?(.*?\n#{CODEBLOCK_MATCH})/
# LEFT_SIDENOTE_MARKER_START = /\[\>(#{ALD_ID_NAME})\]/

# class CheckNote < Jekyll::Converter
#   priority :highest

#   def matches(ext)
#     ext.downcase == ".md"
#   end

#   def convert(content)
#     self.prep_notes(content)
#   end

#   def prep_notes(note)
#     Jekyll.logger.warn "processing note: ", note.data['title']
#     if note.content.nil?
#       return
#     end
#     # from: https://stackoverflow.com/questions/16235601/what-are-the-steps-to-getting-this-custom-permalink-scheme-in-jekyll
#     # Until Jekyll allows me to use :id, I have to resort to this
#     note.data['permalink'] = '/note/' + note.data['id'] + '/'
#     # check for newlines @ eof.
#     #   (kramdown can handle footnotes with no newline, but the regex i'm getting requires a newline after the last footnote to find it.)
#     if note.content[-1] != "\n"
#       Jekyll.logger.warn "Missing newline at end of file -- this could break sidenotes: ", note.data['title']
#     end
#     # sanitize timestamps: remove milliseconds from epoch time
#     note.data['created'] = Time.at(note.data['created'].to_s[0..-4].to_i)
#     note.data['updated'] = Time.at(note.data['updated'].to_s[0..-4].to_i)
#   end
# end


# class ExtraMarkdownParsing < Jekyll::Converter
#   priority :high

#   def matches(ext)
#     ext.downcase == ".md"
#   end

#   def convert(content)
#     # extra parsing
#     self.parse_sidenote(content, "right")
#     self.parse_sidenote(content, "left")
#     self.parse_wiki_links(site, all_docs, content, link_extension)
#   end

#   # just get tufte-style sidenotes working for now...
#   # if there's time, emulate gwern's method: https://github.com/gwern/gwern.net/blob/9e6893033ec63248b1f0b29df119c40d39a7dcef/css/default.css#L1223
  
#   # tag -> [<right-sidenote], [<right-sidenote]:
#   # def -> [>left-sidenote], [>left-sidenote]:
#   # `side` is 'right' or 'left'
#   def parse_sidenote(note, side)
#     # left v right setup
#     if side == "right"
#       sidenote_def_regex = RIGHT_SIDENOTE_DEFINITION_START
#       sidenote_mark_regex = RIGHT_SIDENOTE_MARKER_START
#       css_class = "rsn"
#       sn_regex = /\</
#     elsif side == "left"
#       sidenote_def_regex = LEFT_SIDENOTE_DEFINITION_START
#       sidenote_mark_regex = LEFT_SIDENOTE_MARKER_START
#       css_class = "lsn"
#       sn_regex = /\>/
#     else
#         puts "ERROR: Can't process sidenote that is not either 'right' or 'left'."
#         return
#     end
#     # process sidenotes
#     sidenotes = note.content.scan(sidenote_def_regex)
#     note.content.gsub!(sidenote_def_regex, '') # rm sidenote defs from original note.
#     i = 0
#     sidenotes.each do |sidenote|
#       i += 1
#       mark = sidenote[0]
#       definition = sidenote[1]
#       note.content = note.content.gsub(
#         /\[#{sn_regex}(#{mark})\]/i,
#         "<label for=\"#{css_class}-#{i}\" class=\"sidenote-toggle sidenote-number\"></label><input type=\"checkbox\" id=\"#{css_class}-#{i}\" class=\"sidenote-toggle\"><span class=\"#{css_class}\">#{definition}</span>"
#       )
#     end
#   end
  
#   def parse_wiki_links(site, all_notes, note, link_extension)
#     # some regex taken from vscode-markdown-notes: https://github.com/kortina/vscode-markdown-notes/blob/master/syntaxes/notes.tmLanguage.json   
#     # Convert all Wiki/Roam-style double-bracket link syntax to plain HTML
#     # anchor tag elements (<a>) with "internal-link" CSS class
#     all_notes.each do |note_potentially_linked_to|
#       namespace_from_filename = File.basename(
#         note_potentially_linked_to.basename,
#         File.extname(note_potentially_linked_to.basename)
#       )
#       # regex: extract note name from the end of the string to the first occurring '.'
#       # ex: 'garden.lifecycle.bamboo-shoot' -> 'bamboo shoot'
#       name_from_namespace = namespace_from_filename.match('([^.]*$)')[0].gsub('-', ' ')

#       # Replace double-bracketed links with alias (right) using note title
#       # [[feline.cats|this is a link to the note about cats]]
#       # ✅ vscode-markdown-notes version: (\[\[)([^\]\|]+)(\|)([^\]]+)(\]\])
#       note.content = note.content.gsub(
#         /(\[\[)(#{namespace_from_filename})(\|)([^\]]+)(\]\])/i,
#         "<a class='wiki-link' href='#{site.baseurl}#{note_potentially_linked_to.data['permalink']}#{link_extension}'>\\4</a>"
#       )

#       # Replace double-bracketed links with alias (left) using note title
#       # [[this is a link to the note about cats|feline.cats]]
#       # ✅ vscode-markdown-notes version: (\[\[)([^\]\|]+)(\|)([^\]]+)(\]\])
#       note.content = note.content.gsub(
#         /(\[\[)([^\]\|]+)(\|)(#{namespace_from_filename})(\]\])/i,
#         "<a class='wiki-link' href='#{site.baseurl}#{note_potentially_linked_to.data['permalink']}#{link_extension}'>\\2</a>"
#       )
      
#       # Replace double-bracketed links using note filename
#       # [[feline.cats]]
#       # ⬜️ vscode-markdown-notes version: (\[\[)([^\|\]]+)(\]\])
#       note.content = note.content.gsub(
#         /\[\[#{namespace_from_filename}\]\]/i,
#         "<a class='wiki-link' href='#{site.baseurl}#{note_potentially_linked_to.data['permalink']}#{link_extension}'>#{name_from_namespace}</a>"
#       )
#     end

#     # At this point, all remaining double-bracket-wrapped words are
#     # pointing to non-existing pages, so let's turn them into disabled
#     # links by greying them out and changing the cursor
#     note.content = note.content.gsub(
#       /\[\[(.*)\]\]/i, # match on the remaining double-bracket links
#       <<~HTML.chomp    # replace with this HTML (\\1 is what was inside the brackets)
#         <span title='There is no note that matches this link.' class='invalid-link'>
#           <span class='invalid-wiki-link'>[[</span>
#           \\1
#           <span class='invalid-wiki-link'>]]</span></span>
#       HTML
#     )
#   end
# end
