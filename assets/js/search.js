---
---

window.store = {
  {% for doc in site.documents %}
    {% unless site.bonsai.nav.search.exclude contains doc.type %}
      "{{ doc.url | slugify }}": {
        "title": "{{ doc.title | xml_escape }}",
        "content": {{ doc.content | strip_html | strip_newlines | jsonify }},
        "status": "{{ doc.status | xml_escape }}",
        "tags": "{{ doc.tags | xml_escape }}",
        "emoji": "{{ doc.emoji | xml_escape }}",
        "url": "{{ doc.url | xml_escape }}",
      }
      {% unless forloop.last %},{% endunless %}
    {% endunless %}
  {% endfor %}
};
export default class Search {

  constructor() {
    this.searchBtn = document.getElementById('search-btn');
    this.search = document.getElementById('search');
    this.searchInput = document.getElementById('search-input');
    this.searchResults = document.getElementById('search-results');
    this.navContent = document.getElementById('site-nav-content');
    this.init();
  }

  init() {
    this.searchInput.classList.add('hide');
    this.searchResults.classList.add('hide');
    this.initIndex();
    this.bindEvents();
  }

  bindEvents() {
    // keys
    /// cmd/ctrl + k
    document.addEventListener('keydown', (event) => {
      const macKeys = (event.metaKey && (event.key === 'k'));
      const winKeys = (event.ctrlKey && (event.key === 'k'));
      if (macKeys || winKeys) {
        event.preventDefault();
        this.toggleSearch();
      }
    });
    // enter
    document.addEventListener('keydown', (event) => {
      if (event.key === 'Enter') {
        this.doSearch();
      }
    });
    /// esc
    document.addEventListener('keydown', (event) => {
      if (event.key === 'Escape') {
        this.hideSearch();
      }
    });
    // btn
    this.searchBtn.addEventListener('click', () => {
      this.toggleSearch();
    });
    // unfocus
    this.searchInput.addEventListener('focusout', (event) => {
      // click on a search result: 
      //   if (event.relatedTarget.nodeName !== 'A')
      if (!event.relatedTarget) {
        this.hideSearch();
      }
    });
  }

  initIndex() {
    // lunr: https://lunrjs.com/
    // from: https://learn.cloudcannon.com/jekyll/jekyll-search-using-lunr-js/
    // Initalize lunr with the fields it will be searching on. I've given title
    // a boost of 10 to indicate matches on this field are more important.
    this.idx = lunr(function () {
      this.field('id');
      this.field('title', { boost: 10 });
      this.field('status');
      // this.field('tags');
      this.field('emoji');
      this.field('content');

      for (var key in window.store) { // Add the data to lunr
        this.add({
          'id': key,
          'title': window.store[key].title,
          'status': window.store[key].status,
          // 'tags': window.store[key].tags,
          'emoji': window.store[key].emoji,
          'content': window.store[key].content
        });
      }
    });
  }

  toggleSearch() {
    if (this.searchInput.classList.contains('hide')) {
      this.showSearch();
    } else {
      this.hideSearch();
    }
  }

  showSearch() {
    this.searchInput.classList.remove('hide');
    this.searchInput.focus();
    this.navContent.style.filter = "blur(4px)";
  }

  hideSearch() {
    this.searchInput.classList.add('hide');
    this.searchResults.classList.add('hide');
    this.navContent.style.filter = "";
  }

  doSearch() {
    // from: https://learn.cloudcannon.com/jekyll/jekyll-search-using-lunr-js/
    var results = this.idx.search(this.searchInput.value);
    this.displayResults(results, window.store);
  }

  displayResults(results, store) {
    if (results.length) {
      var appendString = '<ul>';
  
      for (var i = 0; i < results.length; i++) {
        var item = store[results[i].ref];
        appendString += '<li>'
        appendString +=   '<a href="' + '{{ site.baseurl }}' + item.url + '">';
        if (item.status) {
          appendString +=     '<h6> ' + item.status + ' ' + item.title + '</h6>';
        } else if (item.emoji) {
          appendString +=     '<h6> ' + item.emoji + ' ' + item.title + '</h6>';
        } else {
          appendString +=     '<h6> ' + item.title + '</h6>';
        }
        appendString +=     '<p>' + item.content.substring(0, 150) + '...</p>';
        appendString +=   '</a>';
        appendString += '</li>';
      }
    } else {
      var appendString = '<ul><li>No results found</li></ul>';
    }
    this.searchResults.innerHTML = appendString + '</ul>';
    this.searchResults.classList.remove('hide');
  }

  // getQueryVariable(variable) {
  //   // from: https://learn.cloudcannon.com/jekyll/jekyll-search-using-lunr-js/
  //   var query = window.location.search.substring(1);
  //   var vars = query.split('&');

  //   for (var i = 0; i < vars.length; i++) {
  //     var pair = vars[i].split('=');

  //     if (pair[0] === variable) {
  //       return decodeURIComponent(pair[1].replace(/\+/g, '%20'));
  //     }
  //   }
  // }
}
