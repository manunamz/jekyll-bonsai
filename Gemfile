# frozen_string_literal: true

source "https://rubygems.org"

git_source(:github) {|repo_name| "https://github.com/#{repo_name}" }

gem 'jekyll'

group :jekyll_plugins do
  gem 'jekyll-wikilinks', '~> 0.0.5'
  gem 'jekyll-sitemap'
  gem 'jekyll-feed'
  gem 'jekyll-seo-tag'
  # from: https://github.com/aarongustafson/jekyll-webmention_io/issues/130#issuecomment-720367626
  gem 'jekyll-webmention_io', :git => 'https://github.com/danielpietzsch/jekyll-webmention_io.git', :branch => 'jekyll4'
  gem 'rspec'
end

gem 'webrick', '~> 1.7'
