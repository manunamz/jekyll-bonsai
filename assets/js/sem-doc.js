---
---
// this file is a monstrosity!
export default class SemTag {
  constructor() {
    // head
    // this.semTagHeadStatus set in initSemTagStatus();
    this.semTagHeadCheckbox = document.getElementById('sem-doc-head-checkbox');
    
    // foot
    // this.semTagFootLinksStatus set in initSemTagStatus();
    this.semTagFootLinksCheckbox = document.getElementById('sem-doc-foot-links-checkbox');
    // this.semTagFootPostsStatus set in initSemTagStatus();
    this.semTagFootPostsCheckbox = document.getElementById('sem-doc-foot-posts-checkbox');
    // this.semTagFootWebmentionsStatus set in initSemTagStatus();
    this.semTagFootWebmentionsCheckbox = document.getElementById('sem-doc-foot-webmentions-checkbox');

    this.init();
  }

  init() {
    this.initSemTagStatus();
    this.bindEvents();
  }

  bindEvents() {
    // head
    this.semTagHeadCheckbox.addEventListener('click', () => {
      this.toggleSemTagHeadCollapse();
    });
    // foot
    this.semTagFootLinksCheckbox.addEventListener('click', () => {
      this.toggleSemTagFootLinksCollapse();
    });
    this.semTagFootPostsCheckbox.addEventListener('click', () => {
      this.toggleSemTagFootPostsCollapse();
    });
    this.semTagFootWebmentionsCheckbox.addEventListener('click', () => {
      this.toggleSemTagFootWebmentionsCollapse();
    });
  }

  initSemTagStatus() {
    // head
    this.semTagHeadStatus = localStorage.getItem('sem-doc-head-status');
    if (this.semTagHeadStatus !== "open" && this.semTagHeadStatus !== "closed") {
      this.semTagHeadStatus = '{{ site.stat_doc_head_status }}';	
    }
    this.semTagHeadCheckbox.checked = (this.semTagHeadStatus === "closed"); 
    this.toggleSemTagHeadCollapse();

    // foot
    this.semTagFootLinksStatus = localStorage.getItem('sem-doc-foot-links-status');
    if (this.semTagFootLinksStatus !== "open" && this.semTagFootLinksStatus !== "closed") {
      this.semTagFootLinksStatus = '{{ site.stat_doc_foot_links_status }}';	
    }
    this.semTagFootLinksCheckbox.checked = (this.semTagFootLinksStatus === "closed"); 
    this.toggleSemTagFootLinksCollapse();

    this.semTagFootPostsStatus = localStorage.getItem('sem-doc-foot-posts-status');
    if (this.semTagFootPostsStatus !== "open" && this.semTagFootPostsStatus !== "closed") {
      this.semTagFootPostsStatus = '{{ site.stat_doc_foot_posts_status }}';	
    }
    this.semTagFootPostsCheckbox.checked = (this.semTagFootPostsStatus === "closed"); 
    this.toggleSemTagFootPostsCollapse();

    this.semTagFootWebmentionsStatus = localStorage.getItem('sem-doc-foot-webmentions-status');
    if (this.semTagFootWebmentionsStatus !== "open" && this.semTagFootWebmentionsStatus !== "closed") {
      this.semTagFootWebmentionsStatus = '{{ site.stat_doc_foot_webmentions_status }}';	
    }
    this.semTagFootWebmentionsCheckbox.checked = (this.semTagFootWebmentionsStatus === "closed");
    this.toggleSemTagFootWebmentionsCollapse();
  }

  toggleSemTagHeadCollapse () {
    // from: https://www.w3schools.com/howto/tryit.asp?filename=tryhow_js_collapsible
    var collapsibleEl = document.getElementsByClassName('sem-doc-head-breadcrumbs')[0];
    if (this.semTagHeadCheckbox.checked) {
      collapsibleEl.style.display = "none";
      this.semTagHeadStatus = "closed";
    } else {
      collapsibleEl.style.display = "flex";
      this.semTagHeadStatus = "open";
    }
    localStorage.setItem('sem-doc-head-status', this.semTagHeadStatus);
  } 

  toggleSemTagFootLinksCollapse () {
    // from: https://www.w3schools.com/howto/tryit.asp?filename=tryhow_js_collapsible
    var collapsibleEl = document.getElementById('sem-doc-foot-links-nav');
    if (this.semTagFootLinksCheckbox.checked) {
      collapsibleEl.style.display = "none";
      this.semTagFootLinksStatus = "closed";
    } else {
      collapsibleEl.style.display = "flex";
      this.semTagFootLinksStatus = "open";
    }
    localStorage.setItem('sem-doc-foot-links-status', this.semTagFootLinksStatus);
  }

  toggleSemTagFootPostsCollapse () {
    // from: https://www.w3schools.com/howto/tryit.asp?filename=tryhow_js_collapsible
    var collapsibleEl = document.getElementById('sem-doc-foot-posts-nav');
    if (this.semTagFootPostsCheckbox.checked) {
      collapsibleEl.style.display = "none";
      this.semTagFootPostsStatus = "closed";
    } else {
      collapsibleEl.style.display = "flex";
      this.semTagFootPostsStatus = "open";
    }
    localStorage.setItem('sem-doc-foot-posts-status', this.semTagFootPostsStatus);
  } 

  toggleSemTagFootWebmentionsCollapse () {
    // from: https://www.w3schools.com/howto/tryit.asp?filename=tryhow_js_collapsible
    var collapsibleEl = document.getElementById("sem-doc-foot-webmentions-nav");
    if (this.semTagFootWebmentionsCheckbox.checked) {
      collapsibleEl.style.display = "none";
      this.semTagFootWebmentionsStatus = "closed";
    } else {
      collapsibleEl.style.display = "flex";
      this.semTagFootWebmentionsStatus = "open";
    }
    localStorage.setItem('sem-doc-foot-webmentions-status', this.semTagFootWebmentionsStatus);
  } 
}
