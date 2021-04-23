# liquid template to filter for most recently created/edited notes
require 'time'

module Jekyll
    module CustomFilters
      def recent(notes, num=10)
        return if notes.nil?
        num = self.to_integer(num)
        # sort notes by most recently updated
        recent_notes = notes.sort_by { |note| note.data['updated'] }.reverse[0..(num - 1)]
        # assign weather attribute: if 'created' and 'updated' happened on the same day, presume creation status.
        recent_notes.each do |note|
          day_created = Time.at(note.data['created']).to_date
          day_updated = Time.at(note.data['updated']).to_date
          note.data['weather'] = day_created === day_updated ? "🌤" : "🌧"
        end
        return recent_notes
      end

    # from: https://github.com/Shopify/liquid/blob/eab13a07d9861a38d993d2749ae25f06ff76426b/lib/liquid/utils.rb#L38
    def to_integer(num)
      return num if num.is_a?(Integer)
      num = num.to_s
      begin
        Integer(num)
      rescue ::ArgumentError
        raise ArgumentError, "invalid integer"
      end
    end

   end
  end
  
  Liquid::Template.register_filter(Jekyll::CustomFilters)
