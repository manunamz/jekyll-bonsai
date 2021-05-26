---
---
// this file is a monstrosity!
export default class Note {
  constructor() {
    // head
    // this.noteHeadStatus set in initNoteStatus();
    this.noteHeadCheckbox = document.getElementById('note-head-checkbox');
    
    // foot
    // this.noteFootLinksStatus set in initNoteStatus();
    this.noteFootLinksCheckbox = document.getElementById('note-foot-links-checkbox');
    // this.noteFootPostsStatus set in initNoteStatus();
    this.noteFootPostsCheckbox = document.getElementById('note-foot-posts-checkbox');
    // this.noteFootWebmentionsStatus set in initNoteStatus();
    this.noteFootWebmentionsCheckbox = document.getElementById('note-foot-webmentions-checkbox');

    this.init();
  }

  init() {
    this.initNoteStatus();
    this.bindEvents();
  }

  bindEvents() {
    // head
    this.noteHeadCheckbox.addEventListener('click', () => {
      this.toggleNoteHeadCollapse();
    });
    // foot
    this.noteFootLinksCheckbox.addEventListener('click', () => {
      this.toggleNoteFootLinksCollapse();
    });
    this.noteFootPostsCheckbox.addEventListener('click', () => {
      this.toggleNoteFootPostsCollapse();
    });
    this.noteFootWebmentionsCheckbox.addEventListener('click', () => {
      this.toggleNoteFootWebmentionsCollapse();
    });
  }

  initNoteStatus() {
    // head
    this.noteHeadStatus = localStorage.getItem('note-head-status');
    if (this.noteHeadStatus !== "open" && this.noteHeadStatus !== "closed") {
      this.noteHeadStatus = '{{ site.note_head_status }}';	
    }
    this.noteHeadCheckbox.checked = (this.noteHeadStatus === "closed"); 
    this.toggleNoteHeadCollapse();

    // foot
    this.noteFootLinksStatus = localStorage.getItem('note-foot-links-status');
    if (this.noteFootLinksStatus !== "open" && this.noteFootLinksStatus !== "closed") {
      this.noteFootLinksStatus = '{{ site.note_foot_links_status }}';	
    }
    this.noteFootLinksCheckbox.checked = (this.noteFootLinksStatus === "closed"); 
    this.toggleNoteFootLinksCollapse();

    this.noteFootPostsStatus = localStorage.getItem('note-foot-posts-status');
    if (this.noteFootPostsStatus !== "open" && this.noteFootPostsStatus !== "closed") {
      this.noteFootPostsStatus = '{{ site.note_foot_posts_status }}';	
    }
    this.noteFootPostsCheckbox.checked = (this.noteFootPostsStatus === "closed"); 
    this.toggleNoteFootPostsCollapse();

    this.noteFootWebmentionsStatus = localStorage.getItem('note-foot-webmentions-status');
    if (this.noteFootWebmentionsStatus !== "open" && this.noteFootWebmentionsStatus !== "closed") {
      this.noteFootWebmentionsStatus = '{{ site.note_foot_webmentions_status }}';	
    }
    this.noteFootWebmentionsCheckbox.checked = (this.noteFootWebmentionsStatus === "closed");
    this.toggleNoteFootWebmentionsCollapse();
  }

  toggleNoteHeadCollapse () {
    // from: https://www.w3schools.com/howto/tryit.asp?filename=tryhow_js_collapsible
    var collapsibleEl = document.getElementsByClassName('note-head-breadcrumbs')[0];
    if (this.noteHeadCheckbox.checked) {
      collapsibleEl.style.display = "none";
      this.noteHeadStatus = "closed";
    } else {
      collapsibleEl.style.display = "flex";
      this.noteHeadStatus = "open";
    }
    window.localStorage.setItem('note-head-status', this.noteHeadStatus);
  } 

  toggleNoteFootLinksCollapse () {
    // from: https://www.w3schools.com/howto/tryit.asp?filename=tryhow_js_collapsible
    var collapsibleEl = document.getElementById('note-foot-links-nav');
    if (this.noteFootLinksCheckbox.checked) {
      collapsibleEl.style.display = "none";
      this.noteFootLinksStatus = "closed";
    } else {
      collapsibleEl.style.display = "flex";
      this.noteFootLinksStatus = "open";
    }
    window.localStorage.setItem('note-foot-links-status', this.noteFootLinksStatus);
  }

  toggleNoteFootPostsCollapse () {
    // from: https://www.w3schools.com/howto/tryit.asp?filename=tryhow_js_collapsible
    var collapsibleEl = document.getElementById('note-foot-posts-nav');
    if (this.noteFootPostsCheckbox.checked) {
      collapsibleEl.style.display = "none";
      this.noteFootPostsStatus = "closed";
    } else {
      collapsibleEl.style.display = "flex";
      this.noteFootPostsStatus = "open";
    }
    window.localStorage.setItem('note-foot-posts-status', this.noteFootPostsStatus);
  } 

  toggleNoteFootWebmentionsCollapse () {
    // from: https://www.w3schools.com/howto/tryit.asp?filename=tryhow_js_collapsible
    var collapsibleEl = document.getElementById("note-foot-webmentions-nav");
    var streamStatus = '{{ site.stream_status }}';
    if (this.noteFootWebmentionsCheckbox.checked) {
      collapsibleEl.style.display = "none";
      this.noteFootWebmentionsStatus = "closed";
    } else {
      collapsibleEl.style.display = "flex";
      this.noteFootWebmentionsStatus = "open";
    }
    window.localStorage.setItem('note-foot-webmentions-status', streamStatus);
  } 
}
