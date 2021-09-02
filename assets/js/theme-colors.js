---
---

export default class ThemeColors {
  constructor() {
    // this.theme set in initThemeColors();
    this.favicon = document.querySelector('[rel="icon"]');
    this.navBonsai = document.getElementById('nav-bonsai');
    this.navBase = document.getElementById('nav-base');
    this.themeColorsCheckbox = document.getElementById('theme-colors-checkbox');
    this.themeColorsEmojiSpan = document.getElementById('theme-colors-emoji-span');
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
    this.themeColorsCheckbox.addEventListener('click', () => {
      this.updateThemeColors();
      document.getElementById('graph').dispatchEvent(new Event('draw')); // tell graph to redraw itself
    });
  }

  initThemeColors() {
    this.theme = localStorage.getItem("theme-colors");
    if (this.theme !== "dark" && this.theme !== "light") {
      this.theme = getComputedStyle(document.documentElement).getPropertyValue('content');	
    }
    this.themeColorsCheckbox.checked = (this.theme === "dark");
    this.updateThemeColors();
  }

  updateThemeColors () {
    // toggle theme colors
    if (this.themeColorsCheckbox.checked) {
      this.themeColorsEmojiSpan.innerHTML = "{{ site.data.emoji.light }}";
      this.theme = "dark";
    } else {
      this.themeColorsEmojiSpan.innerHTML = "{{ site.data.emoji.dark }}";
      this.theme = "light";
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
