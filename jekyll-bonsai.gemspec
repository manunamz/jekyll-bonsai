Gem::Specification.new do |spec|
  spec.name          = "jekyll-bonsai"
  spec.version       = "0.0.1"
  spec.authors       = ["manunamz"]
  spec.email         = ["manunamz@pm.me"]

  spec.summary       = "A modern jekyll theme for semantically inclined digital gardeners."
  spec.homepage      = "https://manunamz.github.io/jekyll-bonsai/"
  spec.license       = "GPL3"

  spec.metadata["plugin_type"] = "theme"

  spec.files         = `git ls-files -z`.split("\x0").select do |f| 
    f.match(%r!^(index\.html|assets|_pages|_layouts|_includes|_sass|LICENSE|README|CHANGELOG|_config\.yml)!i)
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