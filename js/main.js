// js/main.js — 导航高亮 + 手机端菜单
(function () {
  // 1 · 当前页面对应的导航链接高亮
  var current = window.location.pathname.split('/').pop() || 'index.html';
  var links = document.querySelectorAll('.nav-links a');

  links.forEach(function (link) {
    if (link.getAttribute('href') === current) {
      link.classList.add('is-active');
      link.setAttribute('aria-current', 'page');
    }
  });

  // 2 · 窄屏下点击按钮展开/收起菜单
  var toggle = document.querySelector('.nav-toggle');
  var list = document.getElementById('nav-links');

  if (toggle && list) {
    toggle.addEventListener('click', function () {
      var isOpen = list.classList.toggle('is-open');
      toggle.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
    });
  }
})();
