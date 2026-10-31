// js/filter.js — 按名字搜索、按职业筛选干员卡片
// 只要页面上同时存在 .filter-bar 和 .op-grid 就启动，其他页面引入也不会有副作用
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

  var query = '';      // 搜索词，已转小写
  var selected = [];   // 已选职业

  // 1 · 职业从卡片自身的 .op-class 收集，按首次出现顺序去重
  var jobs = [];
  cards.forEach(function (card) {
    var job = card.querySelector('.op-class').textContent.trim();
    if (job && jobs.indexOf(job) === -1) jobs.push(job);
  });

  // 2 · 每个职业生成一个独立按钮，按钮不是写死的
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

  // 3 · 筛选按钮上的已选数量，收起面板后也能看到
  function updateBadge() {
    badge.textContent = selected.length ? ' · ' + selected.length : '';
    toggle.classList.toggle('is-active', selected.length > 0);
  }

  // 4 · 唯一的渲染函数：只给不符合的卡片加上 hidden
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

    count.textContent = '显示 ' + shown + ' / ' + cards.length + ' 名干员';
    empty.hidden = shown !== 0;
  }

  // 5 · 事件
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

  // 6 · 按 Esc 收起面板，焦点回到筛选按钮
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && panel.classList.contains('is-open')) {
      panel.classList.remove('is-open');
      toggle.setAttribute('aria-expanded', 'false');
      toggle.focus();
    }
  });

  render();
})();
