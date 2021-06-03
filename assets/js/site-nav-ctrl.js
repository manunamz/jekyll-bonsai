---
---

export default class SiteNavCtrl extends Stimulus.Controller {
  static targets = [ "navTypeCheckbox", "navTypeEmojiSpan", "visitedNav", "title" ];

  connect() {
    // console.log("Hello, Stimulus SiteNavCtrl!", this.element);
    // this.navType set in initNavType();
    // this.visited set in initVisited();
    this.initNavType();
    this.initVisited();
  }

  initNavType() {
    this.navType = localStorage.getItem('nav-type');
    if (this.navType !== "graph" && this.navType !== "tabs") {
      this.navType = '{{ site.nav_type }}';	
    }
    this.navTypeCheckboxTarget.checked = (this.navType === "graph");
    this.syncNavType();
  }

  syncNavType() {
    // show bonsai graph
    if (this.navTypeCheckboxTarget.checked) {
      this.navTypeEmojiSpanTarget.innerText = "🥾";
      this.navType = "graph";
      // this.visitedNavTarget.classList.remove("show");
      this.visitedNavTarget.classList.add("hide");
      document.getElementById("svg-graph").classList.remove("hide");
    // show visited path tabs
    } else {
      this.navTypeEmojiSpanTarget.innerText = "🪴";
      this.navType = "tabs";
      document.getElementById("svg-graph").classList.add("hide");
      this.visitedNavTarget.classList.remove("hide");
      // this.visitedNavTarget.classList.add("show");
    }
    localStorage.setItem('nav-type', this.navType);
  }

  // 
  // visited
  // 

  initVisited() {
    this.visited = JSON.parse(localStorage.getItem('visited'));
    if (!this.visited) this.visited = [];
    this.addVisit();
  }

  addVisitFromEvent(e) {
    // this is here to capture the 'e' event -- in case we need it and to make it explicitly clear it exists
    this.addVisit();
  }

  addVisit() {
    if (this.visited) {
      // noguchi filing system + set behavior (since json and !SortedSet)
      // step backward so splicing doesn't change indeces as tabs are removed
      for (var i = this.visited.length - 1; i > -1; i--) {
        let aTab = this.visited[i];
        if ((aTab['title'] == window.document.title) 
          && (aTab['url'] == window.location.pathname)) {

            this.visited.splice(i, 1);
        }
      }
      this.visited.push({ title: this.titleTarget.innerText, url: window.location.pathname }); 
      localStorage.setItem('visited', JSON.stringify(this.visited));
    }
    this.buildVisitedTabs();
  }

  deleteVisitedHistory() {
    // reset visited data
    this.visited = [];
    localStorage.setItem('visited', JSON.stringify([]));
    // reset visible elements
    document.getElementById('svg-graph').dispatchEvent(new Event('draw')); // tell graph to redraw itself
    this.visitedNavTarget.innerHTML = "";
    this.buildVisitedTabs();
  }

  // 
  // dynamically built elements 
  // 

  buildNavLink(title, url) {
    var visitedNavLink = document.createElement('a');
    visitedNavLink.setAttribute('href', url);
    visitedNavLink.classList.add('wiki-link');
    visitedNavLink.innerText = title;
    return visitedNavLink;
  }

  buildNavList() {
    var visitedNavList = document.createElement('ul');
    visitedNavList.classList.add('visited-nav-list');
    return visitedNavList;
  }

  buildNavListItem(i, o) {
    var visitedNavListItem = document.createElement('li');
    visitedNavListItem.classList.add('visited-nav-list-item');
    visitedNavListItem.classList.add('show');
    // visitedNavListItem.setAttribute('style', `--animation-show-order: ${i};`);
    // visitedNavListItem.setAttribute('style', `--animation-hide-order: ${o};`);
    return visitedNavListItem;
  }

  buildVisitedTabs() {
    // reset
    this.visitedNavTarget.innerHTML = "";
    // build
    var visitedNavList = this.buildNavList();
    this.visitedNavTarget.appendChild(visitedNavList);
    for (var i = this.visited.length - 1; i > -1; i--) {
      const visitedDoc = this.visited[i];
      var visitedNavListItem = this.buildNavListItem(this.visited.length - i, i);
      var visitedNavLink = this.buildNavLink(visitedDoc['title'], visitedDoc['url']);
      visitedNavListItem.appendChild(visitedNavLink);
      visitedNavList.appendChild(visitedNavListItem);
    }
  }
}
