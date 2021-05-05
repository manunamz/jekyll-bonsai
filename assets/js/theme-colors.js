---
---

export default class ThemeColors {
  constructor() {
    // this.theme set in initThemeColors();
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
    if (this.theme !== "dark" && this.theme !== "light") {
      this.theme = getComputedStyle(document.documentElement).getPropertyValue('content');	
    }
    document.documentElement.setAttribute('data-theme', this.theme);
    this.themeColorsCheckbox.checked = (this.theme === "dark");
    this.updateThemeColors();
  }

  updateThemeColors () {
    var theme_colors = localStorage.getItem("theme-colors");
    var wiki_bonsai = document.getElementById('wiki-bonsai');
    if (this.themeColorsCheckbox.checked) {
      this.themeColorsEmojiSpan.innerHTML = "☀️";
      theme_colors = "dark";
      wiki_bonsai.src = "{{site.baseurl}}/assets/img/bonsai-dark.png";
    } else {
      this.themeColorsEmojiSpan.innerHTML = "🌘";
      theme_colors = "light";
      wiki_bonsai.src = "{{site.baseurl}}/assets/img/bonsai-light.png";
    }
    var cssFile = document.querySelector('[rel="stylesheet"]');
    const yesThisReallyIsSupposedToBeCSSNotSCSS = '.css'
    cssFile.setAttribute('href', '{{ "assets/css/styles-" | absolute_url }}' + theme_colors + yesThisReallyIsSupposedToBeCSSNotSCSS);
    window.localStorage.setItem("theme-colors", theme_colors);
  }
}
