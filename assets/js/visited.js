---
---
export default class VisitedNav {

  constructor() {
    // this.visitedURLs set in initVisited();
    this.nav = document.getElementById('visited-nav');
    this.deleteVisitedBtn = document.getElementById('delete-btn');
    this.init();
  }

  init() {
    this.initData();
    this.bindEvents();
    this.initPop();
  }

  bindEvents() {
    this.deleteVisitedBtn.addEventListener('click', () => {
      this.deleteVisitedHistory();
    });
  }

  initData() {
    this.visitedURLs = JSON.parse(localStorage.getItem('visited'));
    if (!this.visitedURLs) this.visitedURLs = [];
  }

  // url-data

  initPop() {
    if (this.visitedURLs) {
      // remove duplicates to current (since json and !SortedSet)
      // step backward so splicing doesn't change indeces as tabs are removed
      for (var i = this.visitedURLs.length - 1; i > -1; i--) {
        let aTab = this.visitedURLs[i];
        if ((aTab['title'] == window.document.title) 
          && (aTab['url'] == window.location.pathname)) {
            this.visitedURLs.splice(i, 1);
        }
      }
      this.visitedURLs.push({ title: window.document.title, url: window.location.pathname }); 
      localStorage.setItem('visited', JSON.stringify(this.visitedURLs));
    }
    this.buildVisitedTabs();
  }

  deleteVisitedHistory() {
    // reset visited data
    this.visitedURLs = [];
    localStorage.setItem('visited', JSON.stringify([]));
    // reset visible elements
    // (there used to be a graph redraw here -- in case that is needed again)
    this.nav.innerHTML = "";
    this.buildVisitedTabs();
  }

  // display

  hide() {
    this.nav.classList.remove("show");
    this.nav.classList.add("hide");
  }

  show() {
    this.nav.classList.remove("hide");
    this.nav.classList.add("show");
  }

  // dynamically built elements

  buildNavLink(title, url) {
    var visitedNavLink = document.createElement('a');
    visitedNavLink.setAttribute('href', url);
    visitedNavLink.classList.add('wiki-link');
    visitedNavLink.innerText = title;
    return visitedNavLink;
  }

  buildNavList() {
    var visitedNavList = document.createElement('ul');
    return visitedNavList;
  }

  buildNavListItem(i, o) {
    var visitedNavListItem = document.createElement('li');
    var visitedNavListItemBullet = document.createElement('span');
    visitedNavListItemBullet.innerText = '{{ site.data.emoji.visited }}';
    visitedNavListItem.appendChild(visitedNavListItemBullet);
    // visitedNavListItem.setAttribute('style', `--animation-show-order: ${i};`);
    // visitedNavListItem.setAttribute('style', `--animation-hide-order: ${o};`);
    return visitedNavListItem;
  }

  buildVisitedTabs() {
    var visitedNavList = this.buildNavList();
    this.nav.appendChild(visitedNavList);
    for (var i = this.visitedURLs.length - 1; i > -1; i--) {
      const visitedDoc = this.visitedURLs[i];
      var visitedNavListItem = this.buildNavListItem(this.visitedURLs.length - i, i);
      var visitedNavLink = this.buildNavLink(visitedDoc['title'], visitedDoc['url']);
      visitedNavListItem.appendChild(visitedNavLink);
      visitedNavList.appendChild(visitedNavListItem);
    }
  }
}