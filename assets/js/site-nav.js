---
---

import GraphNav from './graph.js';
import Search from './search.js';
import ThemeColors from './theme-colors.js';
import VisitedNav from './visited.js';
export default class SiteNav {

  constructor() {
    // bonsai-burger --> [[.]]
    this.bonsaiBurger = document.getElementById('bonsai-burger-nav-checkbox');
    this.sideBar = document.getElementById('side-bar');
    this.mainView = document.getElementById('main');
    this.bonsai = document.getElementById('nav-bonsai');
    // this.navType set in initNavType();
    this.navTypeCheckBox = document.getElementById('nav-type-checkbox');
    this.navTypeEmojiSpan = document.getElementById('nav-type-emoji-span');
    
    new ThemeColors();
    this.graph = new GraphNav();
    {% if site.bonsai.nav.search.enabled %}
      this.search = new Search();
    {% endif %}
    this.visited = new VisitedNav();

    this.init();
  }

  init() {
    this.initNavType();
    this.bindEvents();
  }

  bindEvents() {
    this.bonsaiBurger.addEventListener('click', () => {
      this.toggleSiteNav();
      this.graph.redraw();
    });
    this.navTypeCheckBox.addEventListener('click', () => {
      this.updateNavType();
    });
  }

  initNavType() {
    this.navType = localStorage.getItem('nav-type');
    if (this.navType !== "graph" && this.navType !== "visited") {
      this.navType = '{{ site.bonsai.nav.type }}';	
    }
    this.navTypeCheckBox.checked = (this.navType === "graph");
    this.updateNavType();
  }

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
}
