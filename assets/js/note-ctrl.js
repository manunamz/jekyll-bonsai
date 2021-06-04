---
---
// this file is a monstrosity!
export default class NoteCtrl extends Stimulus.Controller {
  static targets = [ "noteFootLinksCheckbox", "noteFootPostsCheckbox", "noteFootWebmentionsCheckbox", "noteHeadCheckbox" ];

  connect() {
    console.log("Hello, Stimulus NoteCtrl!", this.element);

    this.init();
  }

  init() {
    // head
    this.noteHeadStatus = localStorage.getItem('note-head-status');
    if (this.noteHeadStatus !== "open" && this.noteHeadStatus !== "closed") {
      this.noteHeadStatus = '{{ site.note_head_status }}';	
    }
    this.noteHeadCheckboxTarget.checked = (this.noteHeadStatus === "closed"); 
    this.syncNoteHeadCollapse();

    // foot
    this.noteFootLinksStatus = localStorage.getItem('note-foot-links-status');
    if (this.noteFootLinksStatus !== "open" && this.noteFootLinksStatus !== "closed") {
      this.noteFootLinksStatus = '{{ site.note_foot_links_status }}';	
    }
    this.noteFootLinksCheckboxTarget.checked = (this.noteFootLinksStatus === "closed"); 
    this.syncNoteFootLinksCollapse();

    this.noteFootPostsStatus = localStorage.getItem('note-foot-posts-status');
    if (this.noteFootPostsStatus !== "open" && this.noteFootPostsStatus !== "closed") {
      this.noteFootPostsStatus = '{{ site.note_foot_posts_status }}';	
    }
    this.noteFootPostsCheckboxTarget.checked = (this.noteFootPostsStatus === "closed"); 
    this.syncNoteFootPostsCollapse();

    this.noteFootWebmentionsStatus = localStorage.getItem('note-foot-webmentions-status');
    if (this.noteFootWebmentionsStatus !== "open" && this.noteFootWebmentionsStatus !== "closed") {
      this.noteFootWebmentionsStatus = '{{ site.note_foot_webmentions_status }}';	
    }
    this.noteFootWebmentionsCheckboxTarget.checked = (this.noteFootWebmentionsStatus === "closed");
    this.syncNoteFootWebmentionsCollapse();
  }

  syncNoteHeadCollapse () {
    // from: https://www.w3schools.com/howto/tryit.asp?filename=tryhow_js_collapsible
    var collapsibleEl = document.getElementById('note-head-breadcrumbs');
    if (this.noteHeadCheckboxTarget.checked) {
      collapsibleEl.style.display = "none";
      this.noteHeadStatus = "closed";
    } else {
      collapsibleEl.style.display = "flex";
      this.noteHeadStatus = "open";
    }
    localStorage.setItem('note-head-status', this.noteHeadStatus);
  } 

  syncNoteFootLinksCollapse () {
    // from: https://www.w3schools.com/howto/tryit.asp?filename=tryhow_js_collapsible
    var collapsibleEl = document.getElementById('note-foot-links-nav');
    if (this.noteFootLinksCheckboxTarget.checked) {
      collapsibleEl.style.display = "none";
      this.noteFootLinksStatus = "closed";
    } else {
      collapsibleEl.style.display = "flex";
      this.noteFootLinksStatus = "open";
    }
    localStorage.setItem('note-foot-links-status', this.noteFootLinksStatus);
  }

  syncNoteFootPostsCollapse () {
    // from: https://www.w3schools.com/howto/tryit.asp?filename=tryhow_js_collapsible
    var collapsibleEl = document.getElementById('note-foot-posts-nav');
    if (this.noteFootPostsCheckboxTarget.checked) {
      collapsibleEl.style.display = "none";
      this.noteFootPostsStatus = "closed";
    } else {
      collapsibleEl.style.display = "flex";
      this.noteFootPostsStatus = "open";
    }
    localStorage.setItem('note-foot-posts-status', this.noteFootPostsStatus);
  } 

  syncNoteFootWebmentionsCollapse () {
    // from: https://www.w3schools.com/howto/tryit.asp?filename=tryhow_js_collapsible
    var collapsibleEl = document.getElementById('note-foot-webmentions-nav');
    if (this.noteFootWebmentionsCheckboxTarget.checked) {
      collapsibleEl.style.display = "none";
      this.noteFootWebmentionsStatus = "closed";
    } else {
      collapsibleEl.style.display = "flex";
      this.noteFootWebmentionsStatus = "open";
    }
    localStorage.setItem('note-foot-webmentions-status', this.noteFootWebmentionsStatus);
  } 
}
