export default class ThemeColors {
  constructor() {
    // this.theme set in initThemeColors();
    this.cssFile = document.querySelector('[rel="stylesheet"]');
    this.favicon = document.querySelector('[rel="icon"]');
    this.navBonsai = document.getElementById('nav-bonsai');
    this.navBase = document.getElementById('nav-base');
    this.themeColorsCheckbox = document.getElementById('theme-colors-checkbox');
    this.themeColorsEmojiSpan = document.getElementById('theme-colors-emoji-span');
    // home-page logo
    this.homeBonsaiLogo = document.getElementById('home-bonsai');
    this.init();
  }

  init() {
    this.initThemeColors();
    this.bindEvents();
  }

  bindEvents() {
    this.themeColorsCheckbox.addEventListener('click', () => {
      this.updateThemeColors();
      document.getElementById('svg-graph').dispatchEvent(new Event('draw')); // tell graph to redraw itself
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
      this.themeColorsEmojiSpan.innerHTML = "☀️";
      this.theme = "dark";
    } else {
      this.themeColorsEmojiSpan.innerHTML = "🌘";
      this.theme = "light";
    }
    // update css file
    const yesThisReallyIsSupposedToBeCSSNotSCSS = '.css'
    this.cssFile.setAttribute('href', "/jekyll-bonsai/assets/css/styles-" + this.theme + yesThisReallyIsSupposedToBeCSSNotSCSS);
    // update icons and images
    this.favicon.setAttribute('href', "/jekyll-bonsai/assets/img/favicon-" + this.theme + ".png");
    this.navBonsai.setAttribute('src', "/jekyll-bonsai/assets/img/nav-bonsai-" + this.theme + ".svg");
    this.navBase.setAttribute('src', "/jekyll-bonsai/assets/img/nav-base-" + this.theme + ".svg");
    if (this.homeBonsaiLogo) {
      if (this.theme === "dark") {
        this.homeBonsaiLogo.setAttribute('src', "/jekyll-bonsai/assets/img/bonsai-dark.svg");
      } else {
        this.homeBonsaiLogo.setAttribute('src', "/jekyll-bonsai/assets/img/bonsai-light.svg");
      }
    }
    // update bullet icon colors
    let bulletLinks = document.getElementsByClassName('bullet-link');
    Array.prototype.forEach.call(bulletLinks, (bl) => {
      // using $link-line-stroke-color
      if (this.theme == 'dark') {
        bl.style.stroke = '#5c5962'; // $grey-dk-200
      } else {
        bl.style.stroke = '#8C6239'; // $brown-02
      }
    });
    // save to local storage
    window.localStorage.setItem('theme-colors', this.theme);
  }
}
