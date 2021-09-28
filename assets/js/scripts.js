---
---
import GraphNav from './graph.js';
import ThemeColors from './theme-colors.js';
import Entry from './entry.js';
import SiteNav from './site-nav.js';

// go
// from: https://stackoverflow.com/questions/9899372/pure-javascript-equivalent-of-jquerys-ready-how-to-call-a-function-when-t
(() => {
  // your page initialization code here
  // the DOM will be available here
  initListeners();
  new ThemeColors();
  new SiteNav();
  new GraphNav();
  if (document.getElementById('entry')) {
    new Entry();
  }
})();

// init
function initListeners () {
  // link handling //

  // web
  // open external links in new window; wiki-links in current window.
  document.querySelectorAll('a.web-link').forEach(setupLinkOpen);
  // wiki
  //  init hp-tooltip.html listeners.
  document.querySelectorAll('{{ include.wrapperQuerySelector }} a.wiki-link').forEach(setupListeners);
  //  add microdata to wiki links
  document.querySelectorAll('a.wiki-link').forEach((wikiLink) => wikiLink.classList.add('u-url'));

  document.getElementById('bonsai-burger-nav-checkbox')
    .addEventListener('click', function(event) {
      expandSiteNav();
      document.getElementById('jekyll-graph').dispatchEvent(new Event('draw')); // tell graph to redraw itself
    }, false);

  // apply pencil-filter to all svg images
  let imgElements = document.getElementsByClassName('embed-image-wrapper');
  Array.prototype.forEach.call(imgElements, (img) => {
    // Safari 3.0+ "[object HTMLElementConstructor]" 
    var isSafari = /constructor/i.test(window.HTMLElement) || (function (p) { return p.toString() === "[object SafariRemoteNotification]"; })(!window['safari'] || (typeof safari !== 'undefined' && window['safari'].pushNotification));
    if (img.firstElementChild.tagName === "svg" && !isSafari) {
      if ('{{ site.bonsai.svg.filter }}') {
        // attach filter to svg element's parent because of safari/mobile bug
        // bug from: https://github.com/Fyrd/caniuse/issues/3803
        // workaround from: https://newbedev.com/why-is-filter-drop-shadow-causing-my-svg-to-disappear-in-safari
        img.style.filter = "url(#PencilTexture)";
      }
    }
  });
}

// helpers

function setupLinkOpen (link) {
  link.setAttribute("target", "_blank");
  link.setAttribute("rel", "noopener");  // for security: https://css-tricks.com/use-target_blank/#correct-html
}

function expandSiteNav() {
  var sideBar = document.getElementById('side-bar');
  var mainView = document.getElementById('main');
  var bonsai = document.getElementById('nav-bonsai');
  
  if (document.getElementById('bonsai-burger-nav-checkbox').checked) {
    sideBar.classList.add('nav-open');
    mainView.classList.add('hide');
    bonsai.hidden = false;
  } else {
    sideBar.classList.remove('nav-open');
    mainView.classList.remove('hide');
    bonsai.hidden = true;
  }
}
