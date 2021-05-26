---
---

export default class VisitedNavController extends Stimulus.Controller {
  // static targets = [ "title" ];
  // static values = { tags: URL };

  connect() {
    // make the curent controller accessible in the DOM tree
    // from: 
    //  - discussion: https://github.com/hotwired/stimulus/issues/35
    //  - blog: https://leastbad.com/stimulus-power-move
    //  - docs: https://www.betterstimulus.com/interaction/controller-dom-mapper.html
    // this.element[this.identifier] = this;
    // camelCaseIt
    // this.element[
    //   (str => {
    //     return str
    //       .split('--')
    //       .slice(-1)[0]
    //       .split(/[-_]/)
    //       .map(w => w.replace(/./, m => m.toUpperCase()))
    //       .join('')
    //       .replace(/^\w/, c => c.toLowerCase())
    //   })(this.identifier)
    // ] = this

    // console.log(this.element.visitedNav);
    console.log("Hello, Stimulus VisitedNav!", this.element);

    // listen for update event
    this.element.addEventListener('update-visited', (e) => {
      this.updateVisited(e);
    });
    // this.updateVisited();

    // document.getElementsByClassName("visited-tab").forEach().addEventListener("click", function (el) {
    //   this.openTab(el);
    // });
    // document.getElementById("clear-tabs").addEventListener("click", function(el) {
    //   this.clearTabs(el);
    // });
    // document.getElementsByClassName("delete-tab").forEach().addEventListener("click", function(el) {
    //   this.deleteTab(el);
    // });
    // document.addEventListener("turbo:render", function(page) {
    //   this.newTab(page);
    // });
  }

  // static get targets() {
  //   return this.titleTarget.value;
  // }

  // on turbo:visit (https://turbo.hotwire.dev/reference/events)
  // register these functions as event listeners
  // 
  // History.go(delta): https://developer.mozilla.org/en-US/docs/Web/API/History/go

  clearTabs() {

  }

  deleteTab() {
    // 
  }

  newTab(page) {
    history.pushState(obj, '', [url]);
    // add tab
  }

  openTab(el) {
    Turbo.visit("/edit", { action: "replace" });
    // activate tab
  }

  updateVisited (e) {
    console.log('updatedVisited()');
    console.log(e);
    console.log(e.title);
    var visited = JSON.parse(localStorage.getItem('visited'));
    if (!visited) {
      visited = [];
    } else {
      visited.push({ title: e.title, url: window.location.pathname });
      this.buildBreadcrumbs(visited);
    }
    localStorage.setItem('visited', JSON.stringify(visited));
    console.log(visited);
  }

  buildBreadcrumbs (visited) {
    var visitedNav = document.getElementById('visited-nav');
    visitedNav.innerHTML = "";
    var visitedNavList = document.createElement('ol');
    visitedNavList.classList.add('visited-nav-list');
    visitedNav.appendChild(visitedNavList);
    for (var i = 0; i < visited.length; i++) {
      const step = visited[i];
      var visitedNavListItem = document.createElement('li');
      visitedNavListItem.classList.add('visited-nav-list-item');
      var visitedNavTabLink = document.createElement('a');
      visitedNavTabLink.setAttribute('href', step['url']);
      visitedNavTabLink.classList.add('wiki-link');
      visitedNavTabLink.innerHTML = step['title'];
      visitedNavList.appendChild(visitedNavListItem);
    }
  }
}
