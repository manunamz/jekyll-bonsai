---
---

export default class ThemeColors {
  constructor() {
    // this.theme set in initThemeColors();
    this.cssFile = document.querySelector('[rel="stylesheet"]');
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
      this.themeColorsEmojiSpan.innerHTML = "{{ site.emoji.light }}";
      this.theme = "dark";
    } else {
      this.themeColorsEmojiSpan.innerHTML = "{{ site.emoji.dark }}";
      this.theme = "light";
    }
    // update css file
    const yesThisReallyIsSupposedToBeCSSNotSCSS = '.css'
    this.cssFile.setAttribute('href', "{{site.baseurl}}/assets/css/styles-" + this.theme + yesThisReallyIsSupposedToBeCSSNotSCSS);
    // update icons and images
    this.favicon.setAttribute('href', "{{site.baseurl}}/assets/img/favicon-" + this.theme + ".png");
    this.navBonsai.setAttribute('src', "{{site.baseurl}}/assets/img/nav-bonsai-" + this.theme + ".svg");
    this.navBase.setAttribute('src', "{{site.baseurl}}/assets/img/nav-base-" + this.theme + ".svg");
    if (this.rootLogo) {
      if (this.theme === "dark") {
        this.rootLogo.setAttribute('src', "{{ site.logo-dark | relative_url }}");
      } else {
        this.rootLogo.setAttribute('src', "{{ site.logo-light | relative_url }}");
      }
    }
    if (this.homeLogo) {
      if (this.theme === "dark") {
        this.homeLogo.setAttribute('src', "{{ site.logo-dark | relative_url }}");
      } else {
        this.homeLogo.setAttribute('src', "{{ site.logo-light | relative_url }}");
      }
    }
    // update bullet icon colors
    let bulletLinks = document.getElementsByClassName('bullet-link');
    Array.prototype.forEach.call(bulletLinks, (bl) => {
      if (this.theme == 'dark') {
        bl.style.stroke = '#5c5962'; // $grey-dk-200
      } else {
        bl.style.stroke = '#8C6239'; // $brown-02
      }
    });
    // update svg-image pencil color
    let pencils = document.getElementsByClassName('pencil-default');
    Array.prototype.forEach.call(pencils, (p) => {
      if (this.theme == 'dark') {
        p.style.stroke = '#e6e1e8'; // => $body-text-color => $grey-lt-300
        p.style.fill = '#e6e1e8';
      } else {
        p.style.stroke = '#5c5962'; // => $body-text-color => $grey-dk-100
        p.style.fill = '#5c5962';
      }
    });
    // save to local storage
    window.localStorage.setItem('theme-colors', this.theme);
  }
}
