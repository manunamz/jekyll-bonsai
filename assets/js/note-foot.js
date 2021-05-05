---
---

export default class NoteFootController {
  constructor() {
    // this.noteFootStatus set in initNoteFootStatus();
    this.noteFootCheckbox = document.getElementById('note-foot-checkbox');
    this.init();
  }

  init() {
    this.initNoteFootStatus();
    this.bindEvents();
  }

  bindEvents() {
    this.noteFootCheckbox.addEventListener('click', () => {
      this.toggleNoteFootCollapse();
    });
  }

  initNoteFootStatus() {
    this.noteFootStatus = localStorage.getItem('note-foot-status');
    if (this.noteFootStatus !== "open" && this.noteFootStatus !== "closed") {
      this.noteFootStatus = '{{ site.note_foot_status }}';	
    }
    this.noteFootCheckbox.checked = (this.noteFootStatus === "closed"); 
    this.toggleNoteFootCollapse();
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
}
