# liquid template to filter between semantic and status tags
module Jekyll
  module TagFilters
    def semantic_tags(tags)
      return if tags.nil?
      site = @context.registers[:site]
      semantic_tags = []
      site.collections['notes'].docs.each do |n|
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
      site.collections['notes'].docs.each do |n|
        site.posts.docs.each do |post|
          if namespace == n['namespace'] && post['tags'].include?(n['namespace'])
            semantic_tagged_posts << post
          end
        end
      end
      return semantic_tagged_posts
    end

    def status_tags(tags)
      return if tags.nil?
      site = @context.registers[:site]
      status_tags = []
      site.collections['status_tags'].docs.each do |st|
        tags.each do |t|
          if st['emoji'] == t
            status_tags << { 'emoji' => st['emoji'], 'url' => st.url }
          end
        end
      end
      return status_tags
    end
  end
end
  
Liquid::Template.register_filter(Jekyll::TagFilters)
