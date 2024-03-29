Gem::Specification.new do |spec|
  spec.name          = "jekyll-bonsai"
  spec.version       = "0.0.8"
  spec.authors       = ["manunamz"]
  spec.email         = ["manunamz@pm.me"]

  spec.summary       = "A modern jekyll theme for semantically inclined digital gardeners."
  spec.homepage      = "https://github.com/manunamz/jekyll-bonsai/"
  spec.license       = "GPL3"

  spec.metadata["plugin_type"] = "theme"

  spec.files         = `git ls-files -z`.split("\x0").select do |f| 
    f.match(%r!^(_layouts|_includes|_sass|_plugins|_data|assets|LICENSE|README|CHANGELOG|_config\.yml)!i)
  end
  
  # the main event
  spec.add_runtime_dependency "jekyll", "~> 4.2"
  spec.add_runtime_dependency "rouge", "~> 3.26.1"
  # official plugins
  spec.add_runtime_dependency "jekyll-feed", "~> 0.15.0"
  spec.add_runtime_dependency "jekyll-seo-tag", "~> 2.7.1"
  spec.add_runtime_dependency "jekyll-sitemap", "1.4.0"
  # ashmaroli plugins
  spec.add_runtime_dependency "jekyll-data", "1.1.1"
  # local plugins
  spec.add_runtime_dependency "jekyll-id", "~> 0.0.2"
  spec.add_runtime_dependency "jekyll-namespaces", "~> 0.0.3"
  spec.add_runtime_dependency "jekyll-wikilinks", "~> 0.0.11"
  spec.add_runtime_dependency "jekyll-graph", "~> 0.0.8"
  # dev
  spec.add_development_dependency "rake", "~> 13.0.6"
  spec.add_development_dependency "rspec", "3.10.0"
  # don't crash
  spec.add_runtime_dependency "webrick", "~> 1.7"
end
