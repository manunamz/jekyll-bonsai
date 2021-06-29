# liquid template to filter between semantic and status tags
module Jekyll
  module TagFilters
    def semantic_tags(tags)
      return if tags.nil?
      site = @context.registers[:site]
      semantic_tags = []
      site.collections['sem_tags'].docs.each do |n|
        tags.each do |t|
          if n['namespace'] == t
            semantic_tags << { 
              'tag' => n['title'], 
              # 'namespace' => n['namespace'], 
              'url' => n.url 
            }
          end
        end
      end
      return semantic_tags
    end

    def semantic_tagged_posts(namespace)
      return if namespace.nil?
      site = @context.registers[:site]
      semantic_tagged_posts = []
      site.collections['sem_tags'].docs.each do |n|
        site.posts.docs.each do |post|
          if namespace == n['namespace'] && post['tags'].include?(n['namespace'])
            semantic_tagged_posts << post
          end
        end
      end
      return semantic_tagged_posts
    end

    def stat_tags(tags)
      return if tags.nil?
      site = @context.registers[:site]
      stat_tags = []
      site.collections['stat_tags'].docs.each do |st|
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
