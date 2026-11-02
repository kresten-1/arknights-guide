// js/filter.js — search operator cards by name, filter them by class
// Starts only when the page has both .filter-bar and .op-grid,
// so including it on other pages has no side effects.
(function () {
  var bar = document.querySelector('.filter-bar');
  var grid = document.querySelector('.op-grid');
  if (!bar || !grid) return;

  var cards = Array.prototype.slice.call(grid.querySelectorAll('.op-card'));
  var search = document.getElementById('search');
  var toggle = document.getElementById('filter-toggle');
  var panel = document.getElementById('filter-panel');
  var count = document.getElementById('op-count');
  var empty = document.getElementById('empty');
  var clear = document.getElementById('clear');
  var badge = document.getElementById('filter-count');

  var query = '';      // search term, lowercased
  var selected = [];   // selected classes

  // 1 · Classes come from the cards themselves, de-duplicated in first-seen order
  var jobs = [];
  cards.forEach(function (card) {
    var job = card.querySelector('.op-class').textContent.trim();
    if (job && jobs.indexOf(job) === -1) jobs.push(job);
  });

  // 2 · One button per class — generated, not hard-coded in the HTML
  jobs.forEach(function (job) {
    var btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'filter-btn';
    btn.textContent = job;
    btn.setAttribute('aria-pressed', 'false');

    btn.addEventListener('click', function () {
      var i = selected.indexOf(job);
      if (i === -1) {
        selected.push(job);
      } else {
        selected.splice(i, 1);
      }
      btn.setAttribute('aria-pressed', selected.indexOf(job) === -1 ? 'false' : 'true');
      updateBadge();
      render();
    });

    panel.appendChild(btn);
  });

  // 3 · Selected count on the toggle, so it stays visible once the panel is closed
  function updateBadge() {
    badge.textContent = selected.length ? ' · ' + selected.length : '';
    toggle.classList.toggle('is-active', selected.length > 0);
  }

  // 4 · The single render function: only toggles `hidden` on non-matching cards
  function render() {
    var shown = 0;

    cards.forEach(function (card) {
      var name = card.querySelector('.op-name').textContent.toLowerCase();
      var job = card.querySelector('.op-class').textContent.trim();
      var okName = name.indexOf(query) !== -1;
      var okJob = selected.length === 0 || selected.indexOf(job) !== -1;
      var ok = okName && okJob;

      card.hidden = !ok;
      if (ok) shown++;
    });

    count.textContent = 'Showing ' + shown + ' / ' + cards.length + ' operators';
    empty.hidden = shown !== 0;
  }

  // 5 · Events
  search.addEventListener('input', function () {
    query = search.value.trim().toLowerCase();
    render();
  });

  toggle.addEventListener('click', function () {
    var open = panel.classList.toggle('is-open');
    toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
  });

  clear.addEventListener('click', function () {
    search.value = '';
    query = '';
    selected = [];
    Array.prototype.forEach.call(panel.querySelectorAll('.filter-btn'), function (b) {
      b.setAttribute('aria-pressed', 'false');
    });
    updateBadge();
    render();
  });

  // 6 · Esc closes the panel and hands focus back to the toggle
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && panel.classList.contains('is-open')) {
      panel.classList.remove('is-open');
      toggle.setAttribute('aria-expanded', 'false');
      toggle.focus();
    }
  });

  render();
})();
