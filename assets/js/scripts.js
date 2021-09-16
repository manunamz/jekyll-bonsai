---
---
import GraphNav from './graph.js';
import ThemeColors from './theme-colors.js';
import Entry from './entry.js';
import SiteNav from './site-nav.js';

 //
// go
 //
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

 //
// init
 //
function initListeners () {
  // open external links in new window; wiki-links in current window.
  document.querySelectorAll("a.web-link").forEach(setupLinkOpen);
  // init hover-preview.html listeners.
  document.querySelectorAll('{{ include.wrapperQuerySelector }} a.wiki-link').forEach(setupListeners);

  document.getElementById('wiki-link-nav-checkbox')
    .addEventListener('click', function(event) {
      expandGraphNav();
      document.getElementById('jekyll-graph').dispatchEvent(new Event('draw')); // tell graph to redraw itself
    }, false);

  // apply pencil-filter to all svg images
  let imgElements = document.getElementsByClassName('embed-image-wrapper');
  Array.prototype.forEach.call(imgElements, (img) => {
    if (img.firstElementChild.tagName === "svg" && !isSafari) {
      if ('{{ site.svg.filter }}') {
        // attach filter to svg element's parent because of safari/mobile bug
        // bug from: https://github.com/Fyrd/caniuse/issues/3803
        // workaround from: https://newbedev.com/why-is-filter-drop-shadow-causing-my-svg-to-disappear-in-safari
        img.style.filter = "url(#PencilTexture)";
      }
    }
  });
}

 //
// helpers
 //
function goTo (location) {
  window.location.href = location;
}

function setupLinkOpen (link) {
  link.setAttribute("target", "_blank");
  link.setAttribute("rel", "noopener");  // for security: https://css-tricks.com/use-target_blank/#correct-html
}

function expandGraphNav() {
  var siteNav = document.getElementById('site-nav');
  var wikiBonsai = document.getElementById('nav-bonsai');
  
  if (document.getElementById('wiki-link-nav-checkbox').checked) {
    siteNav.classList.add('nav-open');
    wikiBonsai.hidden = false;
  } else {
    siteNav.classList.remove('nav-open');
    wikiBonsai.hidden = true;
  }
}
