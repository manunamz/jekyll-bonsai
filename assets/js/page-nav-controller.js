---
---
export default class PageNavController extends Stimulus.Controller {
  // static targets = [ "lifecycletags" ];
  // static values = { tags: URL };

  connect() {
    console.log("Hello, Stimulus PageNav!", this.element);
  }

  goToTags() {
    window.location.href = "{{ '/tag/tags' | relative_url }}";
  }
  goToPosts() {
    window.location.href = "{{ '/posts' | relative_url }}";
  }
  goToRecent() {
    window.location.href = "{{ '/recent' | relative_url }}";
  }
  // static get targets() {
  //   return this.lifecycletagsTarget.value;
  // }
}
