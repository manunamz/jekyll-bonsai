# liquid template to filter for most recently created/edited notes
require 'time'

module Jekyll
  module CustomFilters
    # returns most recently created/updated docs (note or post) up to the defined 'num'ber.
    # adds a 'weather' data attribute to render on the page.
    def recent(docs, num=10)
      return if docs.nil?
      num = self.to_integer(num)
      # sort notes by most recently updated
      recent_docs = docs.sort_by { |d| d.data['updated'] }.reverse[0..(num - 1)]
      # assign weather attribute: if 'created' and 'updated' happened on the same day, presume creation status.
      recent_docs.each do |docs|
        day_created = Time.at(docs.data['created']).to_date
        day_updated = Time.at(docs.data['updated']).to_date
      end
      return recent_docs
    end

    def weather(doc)
      day_created = Time.at(doc['created']).to_date
      day_updated = Time.at(doc['updated']).to_date
      return day_created === day_updated ? "🌤" : "🌧"
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
