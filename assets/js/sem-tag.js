---
---
// this file is a monstrosity!
export default class SemTag {
  constructor() {
    // head
    // this.semTagHeadStatus set in initNoteStatus();
    this.semTagHeadCheckbox = document.getElementById('sem-tag-head-checkbox');
    
    // foot
    // this.semTagFootLinksStatus set in initNoteStatus();
    this.semTagFootLinksCheckbox = document.getElementById('sem-tag-foot-links-checkbox');
    // this.semTagFootPostsStatus set in initNoteStatus();
    this.semTagFootPostsCheckbox = document.getElementById('sem-tag-foot-posts-checkbox');
    // this.semTagFootWebmentionsStatus set in initNoteStatus();
    this.semTagFootWebmentionsCheckbox = document.getElementById('sem-tag-foot-webmentions-checkbox');

    this.init();
  }

  init() {
    this.initNoteStatus();
    this.bindEvents();
  }

  bindEvents() {
    // head
    this.semTagHeadCheckbox.addEventListener('click', () => {
      this.toggleNoteHeadCollapse();
    });
    // foot
    this.semTagFootLinksCheckbox.addEventListener('click', () => {
      this.toggleNoteFootLinksCollapse();
    });
    this.semTagFootPostsCheckbox.addEventListener('click', () => {
      this.toggleNoteFootPostsCollapse();
    });
    this.semTagFootWebmentionsCheckbox.addEventListener('click', () => {
      this.toggleNoteFootWebmentionsCollapse();
    });
  }

  initNoteStatus() {
    // head
    this.semTagHeadStatus = localStorage.getItem('sem-tag-head-status');
    if (this.semTagHeadStatus !== "open" && this.semTagHeadStatus !== "closed") {
      this.semTagHeadStatus = '{{ site.sem_tag_head_status }}';	
    }
    this.semTagHeadCheckbox.checked = (this.semTagHeadStatus === "closed"); 
    this.toggleNoteHeadCollapse();

    // foot
    this.semTagFootLinksStatus = localStorage.getItem('sem-tag-foot-links-status');
    if (this.semTagFootLinksStatus !== "open" && this.semTagFootLinksStatus !== "closed") {
      this.semTagFootLinksStatus = '{{ site.sem_tag_foot_links_status }}';	
    }
    this.semTagFootLinksCheckbox.checked = (this.semTagFootLinksStatus === "closed"); 
    this.toggleNoteFootLinksCollapse();

    this.semTagFootPostsStatus = localStorage.getItem('sem-tag-foot-posts-status');
    if (this.semTagFootPostsStatus !== "open" && this.semTagFootPostsStatus !== "closed") {
      this.semTagFootPostsStatus = '{{ site.sem_tag_foot_posts_status }}';	
    }
    this.semTagFootPostsCheckbox.checked = (this.semTagFootPostsStatus === "closed"); 
    this.toggleNoteFootPostsCollapse();

    this.semTagFootWebmentionsStatus = localStorage.getItem('sem-tag-foot-webmentions-status');
    if (this.semTagFootWebmentionsStatus !== "open" && this.semTagFootWebmentionsStatus !== "closed") {
      this.semTagFootWebmentionsStatus = '{{ site.sem_tag_foot_webmentions_status }}';	
    }
    this.semTagFootWebmentionsCheckbox.checked = (this.semTagFootWebmentionsStatus === "closed");
    this.toggleNoteFootWebmentionsCollapse();
  }

  toggleNoteHeadCollapse () {
    // from: https://www.w3schools.com/howto/tryit.asp?filename=tryhow_js_collapsible
    var collapsibleEl = document.getElementsByClassName('sem-tag-head-breadcrumbs')[0];
    if (this.semTagHeadCheckbox.checked) {
      collapsibleEl.style.display = "none";
      this.semTagHeadStatus = "closed";
    } else {
      collapsibleEl.style.display = "flex";
      this.semTagHeadStatus = "open";
    }
    localStorage.setItem('sem-tag-head-status', this.semTagHeadStatus);
  } 

  toggleNoteFootLinksCollapse () {
    // from: https://www.w3schools.com/howto/tryit.asp?filename=tryhow_js_collapsible
    var collapsibleEl = document.getElementById('sem-tag-foot-links-nav');
    if (this.semTagFootLinksCheckbox.checked) {
      collapsibleEl.style.display = "none";
      this.semTagFootLinksStatus = "closed";
    } else {
      collapsibleEl.style.display = "flex";
      this.semTagFootLinksStatus = "open";
    }
    localStorage.setItem('sem-tag-foot-links-status', this.semTagFootLinksStatus);
  }

  toggleNoteFootPostsCollapse () {
    // from: https://www.w3schools.com/howto/tryit.asp?filename=tryhow_js_collapsible
    var collapsibleEl = document.getElementById('sem-tag-foot-posts-nav');
    if (this.semTagFootPostsCheckbox.checked) {
      collapsibleEl.style.display = "none";
      this.semTagFootPostsStatus = "closed";
    } else {
      collapsibleEl.style.display = "flex";
      this.semTagFootPostsStatus = "open";
    }
    localStorage.setItem('sem-tag-foot-posts-status', this.semTagFootPostsStatus);
  } 

  toggleNoteFootWebmentionsCollapse () {
    // from: https://www.w3schools.com/howto/tryit.asp?filename=tryhow_js_collapsible
    var collapsibleEl = document.getElementById("sem-tag-foot-webmentions-nav");
    var streamStatus = '{{ site.stream_status }}';
    if (this.semTagFootWebmentionsCheckbox.checked) {
      collapsibleEl.style.display = "none";
      this.semTagFootWebmentionsStatus = "closed";
    } else {
      collapsibleEl.style.display = "flex";
      this.semTagFootWebmentionsStatus = "open";
    }
    localStorage.setItem('sem-tag-foot-webmentions-status', streamStatus);
  } 
}
