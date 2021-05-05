---
---

export default class ThemeColors {
  constructor() {
    // this.theme set in initThemeColors();
    this.cssFile = document.querySelector('[rel="stylesheet"]');
    this.favicon = document.querySelector('[rel="icon"]');
    this.wikiBonsai = document.getElementById('wiki-bonsai');
    this.themeColorsCheckbox = document.getElementById('theme-colors-checkbox');
    this.themeColorsEmojiSpan = document.getElementById('colors-emoji-span');
    this.init();
  }

  init() {
    this.initThemeColors();
    this.bindEvents();
  }

  bindEvents() {
    this.themeColorsCheckbox.addEventListener('click', () => {
      this.updateThemeColors();
      // drawD3Nav();
    });
  }

  initThemeColors() {
    this.theme = localStorage.getItem("theme-colors");
    if (this.theme !== "dark" && this.theme !== "light") {
      this.theme = getComputedStyle(document.documentElement).getPropertyValue('content');	
    }
    document.documentElement.setAttribute('data-theme', this.theme);
    this.themeColorsCheckbox.checked = (this.theme === "dark");
    this.updateThemeColors();
  }

  updateThemeColors () {
    // toggle theme colors
    if (this.themeColorsCheckbox.checked) {
      this.themeColorsEmojiSpan.innerHTML = "☀️";
      this.theme = "dark";
    } else {
      this.themeColorsEmojiSpan.innerHTML = "🌘";
      this.theme = "light";
    }
    // update css file
    const yesThisReallyIsSupposedToBeCSSNotSCSS = '.css'
    this.cssFile.setAttribute('href', '{{ "assets/css/styles-" | absolute_url }}' + this.theme + yesThisReallyIsSupposedToBeCSSNotSCSS);
    // update icons and images
    this.favicon.setAttribute('href', "{{site.baseurl}}/assets/img/favicon-" + this.theme + ".png");
    this.wikiBonsai.setAttribute('src', "{{site.baseurl}}/assets/img/bonsai-" + this.theme + ".png");
    window.localStorage.setItem('theme-colors', this.theme);
  }
}
