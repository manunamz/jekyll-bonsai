# frozen_string_literal: true

module Jekyll
  class SideNoteGenerator < Generator
    safe true

    ##
    # parser constants
    ##
    # constants are taken from kramdown and baseparser.
    # (for easier kramdown integration)
    
    # from baseparser: https://github.com/ruby/rexml/blob/master/lib/rexml/parsers/baseparser.rb#L36    
    LETTER = '[:alpha:]'
    COMBININGCHAR = '' # TODO
    EXTENDER = ''      # TODO
    NCNAME_STR= "[#{LETTER}_][-[:alnum:]._#{COMBININGCHAR}#{EXTENDER}]*"
    UNAME_STR= "(?:#{NCNAME_STR}:)?#{NCNAME_STR}"
    
    # from kramdown: https://github.com/gettalong/kramdown
    # from blank_line.rb
    BLANK_LINE = /(?>^\s*\n)+/
    # from eob.rb
    EOB_MARKER = /^\^\s*?\n/
    # from kramdown.rb
    OPT_SPACE = / {0,3}/
    # Regexp for matching indentation (one tab or four spaces)
    INDENT = /^(?:\t| {4})/
    # from extensions.rb
    ALD_ID_CHARS = /[\w-]/
    ALD_ANY_CHARS = /\\\}|[^\}]/
    ALD_ID_NAME = /\w#{ALD_ID_CHARS}*/
    IAL_BLOCK = /\{:(?!:|\/)(#{ALD_ANY_CHARS}+)\}\s*?\n/
    IAL_BLOCK_START = /^#{OPT_SPACE}#{IAL_BLOCK}/
    # from html.rb
    # Some HTML elements like script belong to both categories (i.e. are valid in block and
    # span HTML) and don't appear therefore!
    # script, textarea
    HTML_SPAN_ELEMENTS = %w[a abbr acronym b big bdo br button cite code del dfn em i img input
                            ins kbd label mark option q rb rbc rp rt rtc ruby samp select small
                            span strong sub sup tt u var]
    # from paragraph.rb
    LAZY_END_HTML_SPAN_ELEMENTS = HTML_SPAN_ELEMENTS + %w[script]
    LAZY_END_HTML_START = /<(?>(?!(?:#{LAZY_END_HTML_SPAN_ELEMENTS.join('|')})\b)#{REXML::Parsers::BaseParser::UNAME_STR})/
    LAZY_END_HTML_STOP = /<\/(?!(?:#{LAZY_END_HTML_SPAN_ELEMENTS.join('|')})\b)#{REXML::Parsers::BaseParser::UNAME_STR}\s*>/m
    # from markdown.rb
    # CODEBLOCK_MATCH = /(?:#{BLANK_LINE}?(?:#{INDENT}[ \t]*\S.*\n)+)*/
    # because `.gsub(INDENT, '')` in footnote.rb
    # CODEBLOCK_MATCH = /(?:#{BLANK_LINE}?(?:s[ \t]*\S.*\n)+)*/
    # from codeblock.rb
    CODEBLOCK_MATCH = /(?:#{BLANK_LINE}?(?:#{INDENT}[ \t]*\S.*\n)+(?:(?!#{IAL_BLOCK_START}|#{EOB_MARKER}|^#{OPT_SPACE}#{LAZY_END_HTML_STOP}|^#{OPT_SPACE}#{LAZY_END_HTML_START})^[ \t]*\S.*\n)*)*/

    # footnotes (for reference)
    # FOOTNOTE_DEFINITION_START = /^#{OPT_SPACE}\[\^(#{ALD_ID_NAME})\]:\s*?(.*?\n#{CODEBLOCK_MATCH})/
    # FOOTNOTE_MARKER_START = /\[\^(#{ALD_ID_NAME})\]/
    ##
    # constants for local use
    ##
    # right
    RIGHT_SIDENOTE_DEFINITION_START = /^#{OPT_SPACE}\[\>(#{ALD_ID_NAME})\]:\s*?(.*?\n#{CODEBLOCK_MATCH})/
    RIGHT_SIDENOTE_MARKER_START = /\[\>(#{ALD_ID_NAME})\]/
    # left
    LEFT_SIDENOTE_DEFINITION_START = /^#{OPT_SPACE}\[\<(#{ALD_ID_NAME})\]:\s*?(.*?\n#{CODEBLOCK_MATCH})/
    LEFT_SIDENOTE_MARKER_START = /\[\<(#{ALD_ID_NAME})\]/

    def generate(site)
       #  
      # init jekyll vars
       #
      all_notes = site.collections['notes'].docs
      # all_pages = site.pages
      all_docs = all_notes # + all_pages

      link_extension = !!site.config["use_html_extension"] ? '.html' : ''
   
      all_docs.each do |cur_note|
        # check for newlines @ eof.
        #   (kramdown can handle footnotes with no newline, but the regex i'm getting requires a newline after the last footnote to find it.)
        if cur_note.content[-1] != "\n"
          Jekyll.logger.warn "Missing newline at end of file -- this could break sidenotes: ", cur_note.data['title']
        end    
        parse_sidenote(cur_note, "left")
        parse_sidenote(cur_note, "right")
      end
    end

    # just get tufte-style sidenotes working for now...
    # if there's time, emulate gwern's method: https://github.com/gwern/gwern.net/blob/9e6893033ec63248b1f0b29df119c40d39a7dcef/css/default.css#L1223

    # mark -> [<left-sidenote], [>right-sidenote]
    # def -> [<left-sidenote]:, [>right-sidenote]:
    # `side` should be 'right' or 'left'
    def parse_sidenote(note, side)
      # left v right setup
      if side == "right"
        sidenote_def_regex = RIGHT_SIDENOTE_DEFINITION_START
        # sidenote_mark_regex = RIGHT_SIDENOTE_MARKER_START
        css_class = "rsn"
        sn_regex = /\>/
      elsif side == "left"
        sidenote_def_regex = LEFT_SIDENOTE_DEFINITION_START
        # sidenote_mark_regex = LEFT_SIDENOTE_MARKER_START
        css_class = "lsn"
        sn_regex = /\</
      else
          puts "ERROR: Can't process sidenote that is not either 'right' or 'left'."
          return
      end
      # process sidenotes
      sidenotes = note.content.scan(sidenote_def_regex)
      note.content.gsub!(sidenote_def_regex, '') # rm sidenote defs from original note.
      i = 0
      sidenotes.each do |sidenote|
        i += 1
        mark = sidenote[0]
        definition = sidenote[1]
        note.content = note.content.gsub(
          /\[#{sn_regex}(#{mark})\]/i,
          "<label for=\"#{css_class}-#{i}\" class=\"sidenote-toggle sidenote-number\"></label><input type=\"checkbox\" id=\"#{css_class}-#{i}\" class=\"sidenote-toggle\"><span class=\"#{css_class}\">#{definition}</span>"
        )
      end
    end
  end
end
