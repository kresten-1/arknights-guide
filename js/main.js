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

  // 3 · Back to top: the button is created here so no page markup needs it
  var topBtn = document.createElement('button');
  topBtn.type = 'button';
  topBtn.className = 'to-top';
  topBtn.setAttribute('aria-label', 'Back to top');
  topBtn.textContent = '↑';
  document.body.appendChild(topBtn);

  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

  topBtn.addEventListener('click', function () {
    window.scrollTo({
      top: 0,
      behavior: reduceMotion.matches ? 'auto' : 'smooth'
    });
  });

  // 用 IntersectionObserver 观察页头，比监听 scroll 更省
  var sentinel = document.querySelector('.site-header');
  if (sentinel && 'IntersectionObserver' in window) {
    new IntersectionObserver(function (entries) {
      topBtn.classList.toggle('is-visible', !entries[0].isIntersecting);
    }).observe(sentinel);
  } else {
    window.addEventListener('scroll', function () {
      topBtn.classList.toggle('is-visible', window.scrollY > 400);
    });
  }
})();
