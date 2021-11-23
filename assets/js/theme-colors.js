---
---

export default class ThemeColors {
  constructor() {
    // this.theme set in initThemeColors();
    this.favicon = document.querySelector('[rel="icon"]');
    this.navBonsai = document.getElementById('nav-bonsai');
    this.navBase = document.getElementById('nav-base');
    this.themeColorBtns = document.querySelectorAll('a[data-theme-id]');
    // logo
    this.homeLogo = document.getElementById('home-logo');
    this.rootLogo = document.getElementById('root-logo');
    this.init();
  }

  init() {
    this.initThemeColors();
    this.bindEvents();
  }

  bindEvents() {
    Array.prototype.forEach.call(this.themeColorBtns, (btn) => {
      btn.addEventListener('click', (event) => {
        this.updateThemeColors(event);
      });
    });
  }

  initThemeColors() {
    this.theme = localStorage.getItem("theme-colors");
    if (!this.theme) {
      this.theme = '{{ site.bonsai.default_theme }}' !== "" ? '{{ site.bonsai.default_theme }}' : '{{ site.data.themes[0].id }}';
    }
    this.updateThemeColors();
  }

  updateThemeColors (event) {
    if (event) {
      this.theme = event.target.dataset.themeId;
    }
    // update theme color data
    document.documentElement.setAttribute('data-theme', this.theme);
    // update icons and images
    this.favicon.setAttribute('href', `{{site.baseurl}}${getComputedStyle(document.documentElement).getPropertyValue('--favicon-src')}`.replaceAll(/\s/g,''));
    this.navBase.setAttribute('src', `{{site.baseurl}}${getComputedStyle(document.documentElement).getPropertyValue('--nav-burger-base')}`.replaceAll(/\s/g,''));
    this.navBonsai.setAttribute('src', `{{site.baseurl}}${getComputedStyle(document.documentElement).getPropertyValue('--nav-burger-bonsai')}`.replaceAll(/\s/g,''));
    if (this.homeLogo) {
      this.homeLogo.setAttribute('src', `{{site.baseurl}}${getComputedStyle(document.documentElement).getPropertyValue('--logo-src')}`.replaceAll(/\s/g,''));
    }
    if (this.rootLogo) {
      this.rootLogo.setAttribute('src', `{{site.baseurl}}${getComputedStyle(document.documentElement).getPropertyValue('--logo-src')}`.replaceAll(/\s/g,''));
    }
    // save to local storage
    window.localStorage.setItem('theme-colors', this.theme);
  }
}
