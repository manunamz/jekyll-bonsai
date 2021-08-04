// this file is a monstrosity!
export default class Entry {
  constructor() {
    // head
    // this.entryHeadStatus set in initEntryStatus();
    this.entryHeadCheckbox = document.getElementById('entry-head-checkbox');
    
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
      this.entryHeadStatus = '';	
    }
    this.entryHeadCheckbox.checked = (this.entryHeadStatus === "closed"); 
    this.toggleEntryHeadCollapse();

    // foot
    this.entryFootLinksStatus = localStorage.getItem('entry-foot-links-status');
    if (this.entryFootLinksStatus !== "open" && this.entryFootLinksStatus !== "closed") {
      this.entryFootLinksStatus = '';	
    }
    this.entryFootLinksCheckbox.checked = (this.entryFootLinksStatus === "closed"); 
    this.toggleEntryFootLinksCollapse();

    this.entryFootPostsStatus = localStorage.getItem('entry-foot-posts-status');
    if (this.entryFootPostsStatus !== "open" && this.entryFootPostsStatus !== "closed") {
      this.entryFootPostsStatus = '';	
    }
    this.entryFootPostsCheckbox.checked = (this.entryFootPostsStatus === "closed"); 
    this.toggleEntryFootPostsCollapse();
  }

  toggleEntryHeadCollapse () {
    // from: https://www.w3schools.com/howto/tryit.asp?filename=tryhow_js_collapsible
    var collapsibleEl = document.getElementsByClassName('entry-head-breadcrumbs')[0];
    if (this.entryHeadCheckbox.checked) {
      collapsibleEl.style.display = "none";
      this.entryHeadStatus = "closed";
    } else {
      collapsibleEl.style.display = "flex";
      this.entryHeadStatus = "open";
    }
    localStorage.setItem('entry-head-status', this.entryHeadStatus);
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
