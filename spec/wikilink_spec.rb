# google_map_tag_spec.rb
require_relative "spec_helper"
require_relative "../_plugins/wikilink"

RSpec.describe(WikiLinkGenerator) do
  Jekyll.logger.log_level = :error

  # let(:overrides) { {} }
  # let(:config) do
  #   Jekyll.configuration(Jekyll::Utils.deep_merge_hashes({
  #     "source"       => source_dir,
  #     "destination"  => dest_dir,
  #     "collections"  => {
  #       "notes" => { "output" => true },
  #     },
  #   }, overrides))
  # end
  # let(:site)        { Jekyll::Site.new(config) }
  let(:site)        { make_site }

  # let(:unrendered)  { "test [[link]] test" }
  # let(:result)      { "test <a class='wiki-link' href=''>link</a> test" }
  # let(:notes)       { site.collections['notes'] }

  context "in notes collection, parses wiki [[links]]" do
    # let(:content) { File.read(source_dir("test.note.md")) }

    it "injects html <a href=''>links</a>." do
      # expect(content).to eq("<a href="">links</a>")
      expect(notes).to eq("---\n---\n<a href="">links</a>\n")
    end

    # it "html link's href attribute links to a valid note." do
    #   expect(content).to eq("<a href="">links</a>")
    # end

  end
end
