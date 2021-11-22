---
---

// this file is a monstrosity!
export default class Entry {
  constructor() {
    // head
    // this.entryHeadStatus set in initEntryStatus();
    this.entryHeadCheckbox = document.getElementById('entry-head-checkbox');
    // head links (box)
    // this.entryHeadLinksStatus set in initEntryStatus();
    this.entryHeadLinksCheckbox = document.getElementById('entry-head-links-checkbox');

    // foot
    // this.entryFootLinksStatus set in initEntryStatus();
    this.entryFootLinksCheckbox = document.getElementById('entry-foot-links-checkbox');
    // this.entryFootPostsStatus set in initEntryStatus();
    this.entryFootPostsCheckbox = document.getElementById('entry-foot-posts-checkbox');

    this.init();
  }

  init() {
    this.initEntryStatus();
    this.bindEvents();
  }

  bindEvents() {
    // head
    this.entryHeadCheckbox.addEventListener('click', () => {
      this.toggleEntryHeadCollapse();
    });
    // head links (box)
    this.entryHeadLinksCheckbox.addEventListener('click', () => {
      this.toggleEntryHeadLinksCollapse();
    });
    // foot
    this.entryFootLinksCheckbox.addEventListener('click', () => {
      this.toggleEntryFootLinksCollapse();
    });
    this.entryFootPostsCheckbox.addEventListener('click', () => {
      this.toggleEntryFootPostsCollapse();
    });
  }

  initEntryStatus() {
    // head
    this.entryHeadStatus = localStorage.getItem('entry-head-status');
    if (this.entryHeadStatus !== "open" && this.entryHeadStatus !== "closed") {
      this.entryHeadStatus = '{{ site.bonsai.entries.toggles.breadcrumbs }}';	
    }
    this.entryHeadCheckbox.checked = (this.entryHeadStatus === "closed"); 
    this.toggleEntryHeadCollapse();

    // head links (box)
    this.entryHeadLinksStatus = localStorage.getItem('entry-head-links-status');
    if (this.entryHeadLinksStatus !== "open" && this.entryHeadLinksStatus !== "closed") {
      this.entryHeadLinksStatus = '{{ site.bonsai.entries.toggles.attr_box }}';	
    }
    this.entryHeadLinksCheckbox.checked = (this.entryHeadLinksStatus === "closed"); 
    this.toggleEntryHeadLinksCollapse();

    // foot
    this.entryFootLinksStatus = localStorage.getItem('entry-foot-links-status');
    if (this.entryFootLinksStatus !== "open" && this.entryFootLinksStatus !== "closed") {
      this.entryFootLinksStatus = '{{ site.bonsai.entries.toggles.foot_links }}';	
    }
    this.entryFootLinksCheckbox.checked = (this.entryFootLinksStatus === "closed"); 
    this.toggleEntryFootLinksCollapse();

    this.entryFootPostsStatus = localStorage.getItem('entry-foot-posts-status');
    if (this.entryFootPostsStatus !== "open" && this.entryFootPostsStatus !== "closed") {
      this.entryFootPostsStatus = '{{ site.bonsai.entries.toggles.foot_tagged }}';	
    }
    this.entryFootPostsCheckbox.checked = (this.entryFootPostsStatus === "closed"); 
    this.toggleEntryFootPostsCollapse();
  }

  toggleEntryHeadCollapse () {
    // from: https://www.w3schools.com/howto/tryit.asp?filename=tryhow_js_collapsible
    var collapsibleEl = document.getElementById('entry-head-nav');
    if (this.entryHeadCheckbox.checked) {
      collapsibleEl.style.display = "none";
      this.entryHeadStatus = "closed";
    } else {
      collapsibleEl.style.display = "flex";
      this.entryHeadStatus = "open";
    }
    localStorage.setItem('entry-head-status', this.entryHeadStatus);
  } 

  toggleEntryHeadLinksCollapse () {
    // from: https://www.w3schools.com/howto/tryit.asp?filename=tryhow_js_collapsible
    var collapsibleEl = document.getElementById('attr-box-link-nav');
    if (this.entryHeadLinksCheckbox.checked) {
      collapsibleEl.style.display = "none";
      this.entryHeadLinksStatus = "closed";
    } else {
      collapsibleEl.style.display = "flex";
      this.entryHeadLinksStatus = "open";
    }
    localStorage.setItem('entry-head-links-status', this.entryHeadLinksStatus);
  }

  toggleEntryFootLinksCollapse () {
    // from: https://www.w3schools.com/howto/tryit.asp?filename=tryhow_js_collapsible
    var collapsibleEl = document.getElementById('entry-foot-links-nav');
    if (this.entryFootLinksCheckbox.checked) {
      collapsibleEl.style.display = "none";
      this.entryFootLinksStatus = "closed";
    } else {
      collapsibleEl.style.display = "flex";
      this.entryFootLinksStatus = "open";
    }
    localStorage.setItem('entry-foot-links-status', this.entryFootLinksStatus);
  }

  toggleEntryFootPostsCollapse () {
    // from: https://www.w3schools.com/howto/tryit.asp?filename=tryhow_js_collapsible
    var collapsibleEl = document.getElementById('entry-foot-posts-nav');
    if (this.entryFootPostsCheckbox.checked) {
      collapsibleEl.style.display = "none";
      this.entryFootPostsStatus = "closed";
    } else {
      collapsibleEl.style.display = "flex";
      this.entryFootPostsStatus = "open";
    }
    localStorage.setItem('entry-foot-posts-status', this.entryFootPostsStatus);
  } 
}
