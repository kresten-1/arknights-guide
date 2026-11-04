// js/modal.js — operator detail dialog
// Data is inlined in the page (#operator-data), so this works without a server.
(function () {
  var dataEl = document.getElementById('operator-data');
  var modal = document.getElementById('op-modal');
  var inner = document.getElementById('op-modal-inner');
  var closeBtn = document.getElementById('op-modal-close');
  if (!dataEl || !modal || !inner || !closeBtn) return;

  var operators = [];
  try {
    operators = (JSON.parse(dataEl.textContent) || {}).operators || [];
  } catch (e) {
    return;
  }

  var byName = {};
  operators.forEach(function (op) { byName[op.name] = op; });

  var lastFocus = null;

  function esc(value) {
    return String(value == null ? '' : value)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }

  function statCell(label, value) {
    return '<div><dt>' + esc(label) + '</dt><dd>' + esc(value == null ? '—' : value) + '</dd></div>';
  }

  function itemBlock(name, meta, body) {
    return '<div class="opm-item">' +
      '<div class="opm-item-head">' +
        '<span class="opm-item-name">' + esc(name) + '</span>' +
        (meta ? '<span class="opm-item-meta">' + esc(meta) + '</span>' : '') +
      '</div>' +
      '<p class="opm-item-body">' + esc(body) + '</p>' +
    '</div>';
  }

  function skillMeta(sk) {
    var parts = [];
    if (sk.unlockStage) parts.push(sk.unlockStage);
    if (sk.recovery) parts.push(sk.recovery);
    if (sk.trigger) parts.push(sk.trigger);
    if (sk.spCost !== null && sk.spCost !== undefined) parts.push('SP ' + sk.spCost);
    if (sk.initialSp) parts.push('初动 ' + sk.initialSp);
    if (sk.duration) parts.push('持续 ' + sk.duration);
    return parts.join(' · ');
  }

  function build(op) {
    var s = op.stats || {};
    var html = '';

    html += '<div class="opm-head">';
    html += '<h2 class="opm-name" id="opm-title">' + esc(op.name) +
            '<span class="opm-en">' + esc(op.nameEn) + '</span></h2>';
    html += '<ul class="opm-tags">';
    html += '<li class="is-accent">' + new Array((op.rarity || 0) + 1).join('★') + '</li>';
    html += '<li>' + esc(op.class) + ' · ' + esc(op.branch) + '</li>';
    if (op.position) html += '<li>' + esc(op.position) + '</li>';
    (op.tags || []).forEach(function (tag) {
      html += '<li>' + esc(tag) + '</li>';
    });
    html += '</ul></div>';

    html += '<dl class="opm-stats">';
    html += statCell('HP', s.hp);
    html += statCell('ATK', s.atk);
    html += statCell('DEF', s.def);
    html += statCell('RES', s.res);
    html += statCell('Cost', s.cost);
    html += statCell('Block', s.block);
    html += statCell('Interval', s.attackInterval);
    html += statCell('Redeploy', s.redeploy);
    html += '</dl>';

    if (op.trait) {
      html += '<section class="opm-section"><h3>Trait</h3>' +
              '<p class="opm-text">' + esc(op.trait) + '</p></section>';
    }

    if (op.talents && op.talents.length) {
      html += '<section class="opm-section"><h3>Talents</h3>';
      op.talents.forEach(function (t) {
        html += itemBlock(t.name, t.unlock, t.effect);
      });
      html += '</section>';
    }

    if (op.skills && op.skills.length) {
      html += '<section class="opm-section"><h3>Skills</h3>';
      op.skills.forEach(function (sk) {
        html += itemBlock(sk.name, skillMeta(sk), sk.description);
      });
      html += '</section>';
    }

    if (op.modules && op.modules.length) {
      html += '<section class="opm-section"><h3>Modules</h3>';
      op.modules.forEach(function (m) {
        var parts = (m.levels || []).map(function (lv) {
          return 'Lv.' + lv.level + '：' + (lv.effect || '');
        });
        html += itemBlock(m.name, m.code, parts.join(' / ') || '—');
      });
      html += '</section>';
    }

    return html;
  }

  function onKeydown(e) {
    if (e.key === 'Escape') {
      e.preventDefault();
      close();
      return;
    }

    if (e.key === 'Tab') {
      var focusables = modal.querySelectorAll('button, [href], input, [tabindex]:not([tabindex="-1"])');
      if (!focusables.length) return;
      var first = focusables[0];
      var last = focusables[focusables.length - 1];

      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    }
  }

  function open(card) {
    var nameNode = card.querySelector('.op-name');
    var name = nameNode ? nameNode.childNodes[0].textContent.trim() : '';
    var op = byName[name];
    if (!op) return;

    inner.innerHTML = build(op);
    inner.scrollTop = 0;
    modal.hidden = false;
    document.body.classList.add('is-locked');
    lastFocus = card;
    closeBtn.focus();
    document.addEventListener('keydown', onKeydown);
  }

  function close() {
    modal.hidden = true;
    document.body.classList.remove('is-locked');
    document.removeEventListener('keydown', onKeydown);
    if (lastFocus) lastFocus.focus();
  }

  Array.prototype.forEach.call(document.querySelectorAll('.op-card'), function (card) {
    card.setAttribute('tabindex', '0');
    card.setAttribute('role', 'button');
    card.setAttribute('aria-haspopup', 'dialog');
    card.addEventListener('click', function () { open(card); });
    card.addEventListener('keydown', function (e) {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        open(card);
      }
    });
  });

  closeBtn.addEventListener('click', close);

  var backdrop = modal.querySelector('[data-close]');
  if (backdrop) backdrop.addEventListener('click', close);
})();
