---
---
export default class VisitedNav {

  constructor() {
    // visitedURLs set in initVisited();
    this.nav = document.getElementById('visited-nav');
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

  // build

  build(visitedURLs) {
    var visitedNavList = this.buildNavList();
    this.nav.appendChild(visitedNavList);
    for (var i = visitedURLs.length - 1; i > -1; i--) {
      const visitedDoc = visitedURLs[i];
      var visitedNavListItem = this.buildNavListItem(visitedURLs.length - i, i);
      var visitedNavLink = this.buildNavLink(visitedDoc['title'], visitedDoc['url']);
      visitedNavListItem.appendChild(visitedNavLink);
      visitedNavList.appendChild(visitedNavListItem);
    }
  }

  rebuild(visitedURLs) {
    // reset visible elements
    // (there used to be a graph redraw here -- in case that is needed again)
    this.nav.innerHTML = "";
    this.build(visitedURLs);
  }

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
}