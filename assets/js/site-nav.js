export default class SiteNav {

  constructor() {
    // this.navType set in initNavType();
    // this.visited set in initVisited();
    this.visitedNav = document.getElementById('visited-nav');
    this.navTypeCheckBox = document.getElementById('nav-type-checkbox');
    this.navTypeEmojiSpan = document.getElementById('nav-type-emoji-span');
    this.deleteVisitedBtn = document.getElementById('delete-btn');
    this.init();
  }

  init() {
    this.initNavType();
    this.initVisited();
    this.bindEvents();
    this.addVisited();
  }

  bindEvents() {
    this.navTypeCheckBox.addEventListener('click', () => {
      this.updateNavType();
    });
    this.deleteVisitedBtn.addEventListener('click', () => {
      this.deleteVisitedHistory();
    });
  }

  initNavType() {
    this.navType = localStorage.getItem('nav-type');
    if (this.navType !== "graph" && this.navType !== "tabs") {
      this.navType = 'graph';	
    }
    this.navTypeCheckBox.checked = (this.navType === "graph");
    this.updateNavType();
  }

  initVisited() {
    this.visited = JSON.parse(localStorage.getItem('visited'));
    if (!this.visited) this.visited = [];
  }

  updateNavType() {
    if (this.navTypeCheckBox.checked) {
      this.navTypeEmojiSpan.innerText = "🥾";
      this.navType = "graph";
      this.visitedNav.classList.remove("show");
      this.visitedNav.classList.add("hide");
      document.getElementById("svg-graph").classList.remove("hide");
    } else {
      this.navTypeEmojiSpan.innerText = "🪴";
      this.navType = "tabs";
      document.getElementById("svg-graph").classList.add("hide");
      this.visitedNav.classList.remove("hide");
      this.visitedNav.classList.add("show");
    }
    localStorage.setItem('nav-type', this.navType);
  }

  //
  // visited
  //

  addVisited() {
    if (this.visited) {
      // remove duplicates to current (since json and !SortedSet)
      // step backward so splicing doesn't change indeces as tabs are removed
      for (var i = this.visited.length - 1; i > -1; i--) {
        let aTab = this.visited[i];
        if ((aTab['title'] == window.document.title) 
          && (aTab['url'] == window.location.pathname)) {
            this.visited.splice(i, 1);
        }
      }
      this.visited.push({ title: window.document.title, url: window.location.pathname }); 
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
    this.visitedNav.innerHTML = "";
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
    visitedNavListItem.setAttribute('style', `--animation-show-order: ${i};`);
    // visitedNavListItem.setAttribute('style', `--animation-hide-order: ${o};`);
    return visitedNavListItem;
  }

  buildVisitedTabs() {
    var visitedNavList = this.buildNavList();
    this.visitedNav.appendChild(visitedNavList);
    for (var i = this.visited.length - 1; i > -1; i--) {
      const visitedDoc = this.visited[i];
      var visitedNavListItem = this.buildNavListItem(this.visited.length - i, i);
      var visitedNavLink = this.buildNavLink(visitedDoc['title'], visitedDoc['url']);
      visitedNavListItem.appendChild(visitedNavLink);
      visitedNavList.appendChild(visitedNavListItem);
    }
  }
}
