# liquid template to filter between semantic and status tags
module Jekyll
  module TagFilters

    # filter tags
    
    def sem_tags(tags)
      return if tags.nil?
      site = @context.registers[:site]
      sem_tags = []
      site.collections['entries'].docs.each do |n|
        tags.each do |t|
          if n['namespace'] == t
            sem_tags << { 
              'tag' => n['title'], 
              # 'namespace' => n['namespace'], 
              'url' => n.url 
            }
          end
        end
      end
      return sem_tags
    end

    def stat_tags(tags)
      return if tags.nil?
      site = @context.registers[:site]
      stat_tags = []
      site.collections['states'].docs.each do |st|
        tags.each do |t|
          if st['emoji'] == t
            stat_tags << {
              'emoji' => st['emoji'],
              'url' => st.url
            }
          end
        end
      end
      return stat_tags
    end

    # filter posts

    def sem_tag_posts(namespace)
      return if namespace.nil?
      site = @context.registers[:site]
      return site.posts.docs.select { |p| p['tags'].include?(namespace) }
    end
  end
end
  
Liquid::Template.register_filter(Jekyll::TagFilters)
