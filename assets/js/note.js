---
---
export default class NoteController {
  constructor() {
    // this.noteFootStatus set in initNoteFootStatus();
    this.noteFootCheckbox = document.getElementById('note-foot-checkbox');
    // this.noteHeadStatus set in initNoteFootStatus();
    this.noteHeadCheckbox = document.getElementById('note-head-checkbox');
    this.init();
  }

  init() {
    this.initNoteStatus();
    this.bindEvents();
  }

  bindEvents() {
    this.noteFootCheckbox.addEventListener('click', () => {
      this.toggleNoteFootCollapse();
    });
    this.noteHeadCheckbox.addEventListener('click', () => {
      this.toggleNoteHeadCollapse();
    });
  }

  initNoteStatus() {
    // foot
    this.noteFootStatus = localStorage.getItem('note-foot-status');
    if (this.noteFootStatus !== "open" && this.noteFootStatus !== "closed") {
      this.noteFootStatus = '{{ site.note_foot_status }}';	
    }
    this.noteFootCheckbox.checked = (this.noteFootStatus === "closed"); 
    this.toggleNoteFootCollapse();
    // head
    this.noteHeadStatus = localStorage.getItem('note-head-status');
    if (this.noteHeadStatus !== "open" && this.noteHeadStatus !== "closed") {
      this.noteHeadStatus = '{{ site.note_head_status }}';	
    }
    this.noteHeadCheckbox.checked = (this.noteHeadStatus === "closed"); 
    this.toggleNoteHeadCollapse();
  }

  toggleNoteFootCollapse () {
    // from: https://www.w3schools.com/howto/tryit.asp?filename=tryhow_js_collapsible
    var collapsibleEl = document.getElementsByClassName('note-foot-nav')[0];
    if (this.noteFootCheckbox.checked) {
      collapsibleEl.style.display = "none";
      this.noteFootStatus = "closed";
    } else {
      collapsibleEl.style.display = "flex";
      this.noteFootStatus = "open";
    }
    window.localStorage.setItem('note-foot-status', this.noteFootStatus);
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
}
