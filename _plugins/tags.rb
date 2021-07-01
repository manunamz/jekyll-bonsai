# liquid template to filter between semantic and status tags
module Jekyll
  module TagFilters
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

    def sem_tagged_posts(namespace)
      return if namespace.nil?
      site = @context.registers[:site]
      sem_tagged_posts = []
      site.collections['entries'].docs.each do |n|
        site.posts.docs.each do |post|
          if namespace == n['namespace'] && post['tags'].include?(n['namespace'])
            sem_tagged_posts << post
          end
        end
      end
      return sem_tagged_posts
    end

    def stat_tags(tags)
      return if tags.nil?
      site = @context.registers[:site]
      stat_tags = []
      site.collections['states'].docs.each do |st|
        tags.each do |t|
          if st['emoji'] == t
            stat_tags << { 'emoji' => st['emoji'], 'url' => st.url }
          end
        end
      end
      return stat_tags
    end
  end
end
  
Liquid::Template.register_filter(Jekyll::TagFilters)
