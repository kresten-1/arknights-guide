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

  // 4 · Theme switch: dark by default, light remembered in localStorage
  var root = document.documentElement;
  var themeBtn = document.createElement('button');
  themeBtn.type = 'button';
  themeBtn.className = 'theme-toggle';

  function paintTheme(theme) {
    if (theme === 'light') {
      root.setAttribute('data-theme', 'light');
      themeBtn.textContent = '\u263E';
      themeBtn.setAttribute('aria-label', 'Switch to dark theme');
      themeBtn.title = 'Switch to dark theme';
    } else {
      root.removeAttribute('data-theme');
      themeBtn.textContent = '\u2600';
      themeBtn.setAttribute('aria-label', 'Switch to light theme');
      themeBtn.title = 'Switch to light theme';
    }
  }

  // 首屏已经由各页 <head> 里的内联脚本设好，这里只同步按钮外观
  paintTheme(root.getAttribute('data-theme') === 'light' ? 'light' : 'dark');

  themeBtn.addEventListener('click', function () {
    var next = root.getAttribute('data-theme') === 'light' ? 'dark' : 'light';
    try { localStorage.setItem('theme', next); } catch (err) { }
    paintTheme(next);
  });

  var navBar = document.querySelector('.nav');
  if (navBar) navBar.appendChild(themeBtn);

  // 5 · Hero carousel: only on the home page, so guard on the element
  var hero = document.getElementById('hero');
  var track = document.getElementById('hero-track');

  if (hero && track) {
    var slides = hero.querySelectorAll('.hero-slide');
    var dots = hero.querySelectorAll('.hero-dot');
    var pauseBtn = hero.querySelector('.hero-pause');
    var current = 0;
    var timer = null;
    var playing = !reduceMotion.matches;
    var INTERVAL = 6000;

    function show(next) {
      if (!slides.length) return;
      current = (next + slides.length) % slides.length;
      track.style.transform = 'translateX(-' + (current * 100) + '%)';

      Array.prototype.forEach.call(dots, function (dot, i) {
        var on = i === current;
        dot.classList.toggle('is-active', on);
        dot.setAttribute('aria-selected', on ? 'true' : 'false');
      });

      Array.prototype.forEach.call(slides, function (slide, i) {
        var on = i === current;
        slide.setAttribute('aria-hidden', on ? 'false' : 'true');
        slide.inert = !on;
      });
    }

    function stop() {
      if (timer) {
        window.clearInterval(timer);
        timer = null;
      }
    }

    function start() {
      stop();
      if (!playing || document.hidden || slides.length < 2) return;
      timer = window.setInterval(function () { show(current + 1); }, INTERVAL);
    }

    Array.prototype.forEach.call(dots, function (dot, i) {
      dot.addEventListener('click', function () {
        show(i);
        start();
      });
    });

    if (pauseBtn) {
      var paintPause = function () {
        pauseBtn.textContent = playing ? '\u275A\u275A' : '\u25B6';
        pauseBtn.setAttribute('aria-label', playing ? 'Pause the slideshow' : 'Play the slideshow');
      };

      pauseBtn.addEventListener('click', function () {
        playing = !playing;
        paintPause();
        if (playing) { start(); } else { stop(); }
      });

      paintPause();
    }

    // Hovering or focusing the banner holds it still
    hero.addEventListener('mouseenter', stop);
    hero.addEventListener('mouseleave', start);
    hero.addEventListener('focusin', stop);
    hero.addEventListener('focusout', start);

    // Swipe on touch screens
    var swipeFrom = 0;
    hero.addEventListener('touchstart', function (e) {
      swipeFrom = e.touches[0].clientX;
      stop();
    }, { passive: true });
    hero.addEventListener('touchend', function (e) {
      var dx = e.changedTouches[0].clientX - swipeFrom;
      if (Math.abs(dx) > 40) show(current + (dx < 0 ? 1 : -1));
      start();
    }, { passive: true });

    document.addEventListener('visibilitychange', function () {
      if (document.hidden) { stop(); } else { start(); }
    });

    show(0);
    start();
  }
})();
