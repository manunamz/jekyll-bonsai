---
---

import GraphNav from './graph.js';
import Search from './search.js';
import ThemeColors from './theme-colors.js';
import VisitedNav from './visited-nav.js';

export default class SiteNav {

  constructor() {
    // bonsai-burger --> [[.]]
    this.bonsaiBurger = document.getElementById('bonsai-burger-nav-checkbox');
    this.sideBar = document.getElementById('side-bar');
    this.mainView = document.getElementById('main');
    this.bonsai = document.getElementById('nav-bonsai');
    
    this.bonsaiBurger.addEventListener('click', () => {
      this.toggleSiteNav();
      this.graph.redraw();
    });

    // themes
    new ThemeColors();
    
    // search
    {% if site.bonsai.nav.search.enabled %}
      this.search = new Search();
    {% endif %}

    // graph
    this.graph = new GraphNav();

    // visited nav
    {% if site.bonsai.nav.visited.enabled %} 
      // attach elements
      // this.navType set in initNavType();
      this.navTypeCheckBox = document.getElementById('nav-type-checkbox');
      this.navTypeEmojiSpan = document.getElementById('nav-type-emoji-span');
      this.visited = new VisitedNav();
      this.initNavType();
      this.navTypeCheckBox.addEventListener('click', () => {
        this.updateNavType();
      });
    {% endif %}

    // visited data
    // visitedURLs set in initVisitedData();
    this.deleteVisitedBtn = document.getElementById('delete-btn');
    this.initVisitedData();
    this.deleteVisitedBtn.addEventListener('click', () => {
      this.deleteVisitedData();
    });
  }

  // bonsai-burger

  toggleSiteNav() {
    if (document.getElementById('bonsai-burger-nav-checkbox').checked) {
      this.sideBar.classList.add('nav-open');
      this.mainView.classList.add('hide');
      this.bonsai.hidden = false;
    } else {
      this.sideBar.classList.remove('nav-open');
      this.mainView.classList.remove('hide');
      this.bonsai.hidden = true;
    }
  }

  // graph <-> visited toggles

  initNavType() {
    this.navType = localStorage.getItem('nav-type');
    if (this.navType !== "graph" && this.navType !== "visited") {
      this.navType = '{{ site.bonsai.nav.type }}';	
    }
    this.navTypeCheckBox.checked = (this.navType === "graph");
    this.updateNavType();
  }

  updateNavType() {
    if (this.navTypeCheckBox.checked) {
      this.navTypeEmojiSpan.innerText = "{{ site.data.emoji.visited }}";
      this.navType = "graph";
      this.visited.hide();
      this.graph.graphDiv.classList.remove("hide");
    } else {
      this.navTypeEmojiSpan.innerText = "{{ site.data.emoji.graph }}";
      this.navType = "visited";
      this.graph.graphDiv.classList.add("hide");
      this.visited.show();
    }
    localStorage.setItem('nav-type', this.navType);
  }

    // visited-data

    initVisitedData() {
      // init
      this.visitedURLs = JSON.parse(localStorage.getItem('visited'));
      if (!this.visitedURLs) this.visitedURLs = [];
      // populate
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
      // draw
      {% if site.bonsai.nav.visited.enabled %} 
        this.visited.build(this.visitedURLs);
      {% endif %}
    }
  
    deleteVisitedData() {
      // reset
      this.visitedURLs = [];
      // store
      localStorage.setItem('visited', JSON.stringify([]));
      // redraw
      {% if site.bonsai.nav.visited.enabled %} 
        this.visited.rebuild(this.visitedURLs);
      {% endif %}
    }
}
