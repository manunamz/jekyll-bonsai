# 
# ATTEMPT 1
# 

# # spec_helper.rb
# # from: https://ayastreb.me/writing-a-jekyll-plugin/
# $LOAD_PATH.unshift File.expand_path("../../lib", __FILE__)
# require "jekyll"

# Jekyll.logger.log_level = :error

# RSpec.configure do |config|
#   config.run_all_when_everything_filtered = true
#   config.filter_run :focus
#   config.order = "random"

#   SOURCE_DIR = File.expand_path("md_notes", __FILE__)
#   DEST_DIR   = File.expand_path("dest", __FILE__)

#   def source_dir(*files)
#     File.join(SOURCE_DIR, *files)
#   end

#   def dest_dir(*files)
#     File.join(DEST_DIR, *files)
#   end

#   CONFIG_DEFAULTS = {
#     "source"      => source_dir,
#     "destination" => dest_dir,
#   }.freeze

#   def make_page(options = {})
#     page      = Jekyll::Page.new(site, CONFIG_DEFAULTS["source"], "", "page.md")
#     page.data = options
#     page
#   end

#   def make_site(options = {})
#     site_config = Jekyll.configuration(CONFIG_DEFAULTS.merge(options))
#     Jekyll::Site.new(site_config)
#   end

#   def make_context(registers = {}, environments = {})
#     Liquid::Context.new(environments, {}, 
#       { :site => site, :page => page }.merge(registers))
#   end
# end

# 
# ATTEMPT 2
# 

# require 'bundler/setup'
# require 'jekyll'

# RSpec.configure do |config|
#   # Enable flags like --only-failures and --next-failure
#   # config.example_status_persistence_file_path = ".rspec_status"

#   # Disable RSpec exposing methods globally on `Module` and `main`
#   config.disable_monkey_patching!

#   config.expect_with :rspec do |c|
#     c.syntax = :expect
#   end
# end

# 
# ATTEMPT 3
# 
# frozen_string_literal: true
require 'jekyll'

Jekyll.logger.log_level = :error

RSpec.configure do |config|
  config.run_all_when_everything_filtered = true
  config.filter_run :focus
  config.order = "random"

  SOURCE_DIR = File.expand_path("fixtures", __dir__)
  DEST_DIR   = File.expand_path("dest",     __dir__)

  def source_dir(*files)
    File.join(SOURCE_DIR, *files)
  end

  def dest_dir(*files)
    File.join(DEST_DIR, *files)
  end

  # CONFIG_DEFAULTS = {
  #   "source"      => source_dir,
  #   "destination" => dest_dir,
  #   "gems"        => ["jekyll-maps"]
  # }.freeze

  def make_context(registers = {})
    Liquid::Context.new({}, {}, { :site => site }.merge(registers))
  end

  def make_site(options = {})
    site_config = Jekyll.configuration(CONFIG_DEFAULTS.merge(options))
    Jekyll::Site.new(site_config)
  end

end
