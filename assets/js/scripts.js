---
---
import GraphNav from './graph.js';
import ThemeColors from './theme-colors.js';
import Note from './note.js';
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
  if (document.getElementById('note')) {
    new Note();
  }
})();

 //
// init
 //
function initListeners () {
  // open external links in new window; wiki-links in current window.
  document.querySelectorAll("a:not(.wiki-link):not(.status-tag):not(.anchor-heading):not(.footnote):not(.reversefootnote)").forEach(setupLinkOpen);
  // init note-preview.html listeners.
  document.querySelectorAll('{{ include.wrapperQuerySelector }} a:not(.status-tag):not(.anchor-heading)').forEach(setupListeners);

  document.getElementById('status-tags-btn')
    .addEventListener('click', function(event) {
      goTo('{{ site.baseurl }}/status-tag/tags');
    }, false);
  document.getElementById('posts-btn')
    .addEventListener('click', function(event) {
      goTo('{{ site.baseurl }}/posts');
    }, false);
  document.getElementById('recent-btn')
    .addEventListener('click', function(event) {
      goTo('{{ site.baseurl }}/recent');
    }, false);

  document.getElementById('wiki-link-nav-checkbox')
    .addEventListener('click', function(event) {
      expandGraphNav();
      document.getElementById('svg-graph').dispatchEvent(new Event('draw')); // tell graph to redraw itself
    }, false);
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
  var wikiBonsai = document.getElementById('wiki-link-nav-bonsai');
  
  if (document.getElementById('wiki-link-nav-checkbox').checked) {
    siteNav.classList.add('nav-open');
    wikiBonsai.hidden = false;
  } else {
    siteNav.classList.remove('nav-open');
    wikiBonsai.hidden = true;
  }
}
