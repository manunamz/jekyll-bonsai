Gem::Specification.new do |spec|
  spec.name          = "jekyll-bonsai"
  spec.version       = "0.0.3"
  spec.authors       = ["manunamz"]
  spec.email         = ["manunamz@pm.me"]

  spec.summary       = "These are not the gems you're looking for -- just grabbing the gem name for now."
  # spec.summary       = "A modern jekyll theme for semantically inclined digital gardeners."
  spec.homepage      = "https://manunamz.github.io/jekyll-bonsai/"
  spec.license       = "GPL3"

  spec.metadata["plugin_type"] = "theme"

  spec.files         = `git ls-files -z`.split("\x0").select do |f| 
    f.match(%r!^(_states|_entries|assets|_layouts|_pages|_includes|_sass|_plugins|LICENSE|README|CHANGELOG|_config\.yml|index\.html)!i)
  end

  spec.add_runtime_dependency "jekyll", "~> 4.2"
  spec.add_runtime_dependency "nanoid"
  spec.add_runtime_dependency "jekyll-sitemap"
  spec.add_runtime_dependency "jekyll-feed"
  spec.add_runtime_dependency "jekyll-seo-tag"

  spec.add_runtime_dependency "jekyll-namespaces", "~> 0.0.2"
  spec.add_runtime_dependency "jekyll-wikilinks", "~> 0.0.6"

  spec.add_runtime_dependency "webrick", "~> 1.7"

  spec.add_development_dependency "rake"
  spec.add_development_dependency "rspec"
end