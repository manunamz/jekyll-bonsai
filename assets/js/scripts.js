---
---
import GraphNav from './graph.js';
import ThemeColors from './theme-colors.js';
import NoteController from './note.js';
import PageNavController from './page-nav-controller.js';

 //
// go
 //
// from: https://stackoverflow.com/questions/9899372/pure-javascript-equivalent-of-jquerys-ready-how-to-call-a-function-when-t
(() => {
  const application = Stimulus.Application.start();
  application.register("page-nav", PageNavController);

  // your page initialization code here
  // the DOM will be available here
  initListeners();
  new ThemeColors();
  new GraphNav();
  if (document.getElementById('note')) {
    new NoteController();
  }
  updateVisitedNotes();
})();

 function updateVisitedNotes () {
  var visited = JSON.parse(localStorage.getItem('visited-notes'));
  if (!visited) {
    visited = [];
  } else {
    console.log('{{ site }}');
    visited.push({ title: '{{ page.title }}', url: '{{ page.url }}' });
    buildTrail(visited);
  }
  localStorage.setItem('visited-notes', JSON.stringify(visited));
  console.log(visited);
}

function buildTrail (trail) {
  var userTrailNav = document.getElementById('user-trail-nav');
  var userTrailList = document.createElement('ol');
  userTrailList.classList.add('user-trail-nav-list');
  userTrailNav.appendChild(userTrailList);
  for (var i = 0; i < trail.length; i++) {
    const step = trail[i];
    var trailStepListItem = document.createElement('li');
    trailStepListItem.classList.add('user-trail-nav-list-item');
    var trailStepLink = document.createElement('a');
    trailStepLink.setAttribute('href', step['url']);
    trailStepLink.classList.add('wiki-link');
    trailStepLink.innerHTML = step['title'];
    userTrailList.appendChild(trailStepListItem);
  }
}
 //
// init
 //
function initListeners () {
  // open external links in new window; wiki-links in current window.
  document.querySelectorAll("a:not(.wiki-link):not(.tags-list-item):not(.footnote):not(.reversefootnote)").forEach(setupLinkOpen);
  // init note-preview.html listeners.
  document.querySelectorAll('{{ include.wrapperQuerySelector }} a:not(.tags-list-item)').forEach(setupListeners);

  document.getElementById('wiki-link-nav-checkbox')
    .addEventListener('click', function(event) {
      expandGraphNav();
      document.getElementById('svg-graph').dispatchEvent(new Event('draw')); // tell graph to redraw itself
    }, false);
}

 //
// helpers
 //

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
