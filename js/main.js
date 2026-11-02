// js/main.js — nav highlighting + mobile menu
(function () {
  // 1 · Highlight the nav link that matches the current page
  var current = window.location.pathname.split('/').pop() || 'index.html';
  var links = document.querySelectorAll('.nav-links a');

  links.forEach(function (link) {
    if (link.getAttribute('href') === current) {
      link.classList.add('is-active');
      link.setAttribute('aria-current', 'page');
    }
  });

  // 2 · On narrow screens, the button opens and closes the menu
  var toggle = document.querySelector('.nav-toggle');
  var list = document.getElementById('nav-links');

  if (toggle && list) {
    toggle.addEventListener('click', function () {
      var isOpen = list.classList.toggle('is-open');
      toggle.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
    });
  }
})();
