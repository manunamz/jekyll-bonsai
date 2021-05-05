---
---

export default class ForkController {
  constructor() {
    // this.forkStatus set in initForkStatus();
    this.forkCheckbox = document.getElementById('fork-checkbox');
    this.init();
  }

  init() {
    this.initForkStatus();
    this.bindEvents();
  }

  bindEvents() {
    this.forkCheckbox.addEventListener('click', () => {
      this.toggleForkCollapse();
    });
  }

  initForkStatus() {
    this.forkStatus = localStorage.getItem('fork-status');
    if (this.forkStatus !== "open" && this.forkStatus !== "closed") {
      this.forkStatus = '{{ site.fork_status }}';	
    }
    this.forkCheckbox.checked = (this.forkStatus === "closed"); 
    this.toggleForkCollapse();
  }

  toggleForkCollapse () {
    // from: https://www.w3schools.com/howto/tryit.asp?filename=tryhow_js_collapsible
    var collapsibleEl = document.getElementsByClassName("fork-nav")[0];
    if (this.forkCheckbox.checked) {
      collapsibleEl.style.display = "none";
      this.forkStatus = "closed";
    } else {
      collapsibleEl.style.display = "flex";
      this.forkStatus = "open";
    }
    window.localStorage.setItem('fork-status', this.forkStatus);
  } 
}
