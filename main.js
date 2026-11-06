/* YANS — comportement du site. Les données (prix, formules, contact) viennent de site-config.js. */
(function () {
  'use strict';

  var C = window.YANS_CONFIG || {};
  var contact = C.contact || {};
  var $ = function (s, r) { return (r || document).querySelector(s); };

  function esc(s) {
    return String(s).replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
  }

  /* ---------- Formules ---------- */
  var offers = C.offers || [];

  function renderOffers() {
    var grid = $('#offers-grid');
    if (!grid) return;
    grid.innerHTML = offers.map(function (o) {
      var badge = o.badge
        ? '<span class="badge' + (o.badgeStyle === 'light' ? ' badge--light' : '') + '">' + esc(o.badge) + '</span>'
        : '';
      var inherits = o.inherits
        ? '<li class="inherits"><svg class="ic" aria-hidden="true"><use href="#i-check"/></svg><span>Tout ce qui est inclus dans ' + esc(o.inherits) + '</span></li>'
        : '';
      var items = (o.features || []).map(function (f) {
        return '<li><svg class="ic" aria-hidden="true"><use href="#i-check"/></svg><span>' + esc(f) + '</span></li>';
      }).join('');
      return '' +
        '<article class="offer reveal' + (o.featured ? ' is-featured' : '') + '" data-offer="' + esc(o.id) + '">' +
          badge +
          '<header><h3>' + esc(o.id) + '</h3><p class="offer-tag">' + esc(o.tagline || '') + '</p></header>' +
          '<p class="price"><span class="amount">' + esc(o.price) + '</span><span class="cur">€</span></p>' +
          '<ul>' + inherits + items + '</ul>' +
          '<a class="btn' + (o.featured ? '' : ' btn-ghost') + '" href="#contact" data-choose="' + esc(o.id) + '">Choisir cette offre</a>' +
        '</article>';
    }).join('');

    var note = $('#price-note');
    if (note && C.priceNote) note.textContent = C.priceNote;
  }

  function fillSelects() {
    var spec = $('#f-spec');
    var offer = $('#f-offer');
    if (spec) {
      spec.innerHTML = '<option value="">Choisis ta spécialité</option>' +
        (C.specialties || []).map(function (s) { return '<option>' + esc(s) + '</option>'; }).join('');
    }
    if (offer) {
      offer.innerHTML = '<option value="">Choisis une formule</option>' +
        offers.map(function (o) { return '<option value="' + esc(o.id) + '">' + esc(o.id) + ' — ' + esc(o.price) + ' €</option>'; }).join('') +
        '<option value="Je ne sais pas encore">Je ne sais pas encore</option>';
    }
  }

  function offerLabel(id) {
    for (var i = 0; i < offers.length; i++) {
      if (offers[i].id === id) return offers[i].id + ' (' + offers[i].price + ' €)';
    }
    return id;
  }

  function updateHint() {
    var sel = $('#f-offer');
    var hint = $('#offer-hint');
    if (!sel || !hint) return;
    if (sel.value && sel.value !== 'Je ne sais pas encore') {
      hint.hidden = false;
      hint.textContent = 'Formule sélectionnée : ' + offerLabel(sel.value);
    } else {
      hint.hidden = true;
    }
  }

  document.addEventListener('click', function (e) {
    var btn = e.target.closest ? e.target.closest('[data-choose]') : null;
    if (!btn) return;
    var sel = $('#f-offer');
    if (sel) {
      sel.value = btn.getAttribute('data-choose');
      sel.dispatchEvent(new Event('change', { bubbles: true }));
    }
    setTimeout(function () {
      var first = $('#f-name');
      if (first) { try { first.focus({ preventScroll: true }); } catch (err) { first.focus(); } }
    }, 650);
  });

  /* ---------- Instagram ---------- */
  function renderInstagram() {
    var slot = $('#insta-slot');
    var note = $('#insta-note');
    if (!slot) return;
    var icon = '<svg class="ic" aria-hidden="true"><use href="#i-insta"/></svg>';
    if (contact.instagramUrl) {
      slot.innerHTML = '<a class="btn btn-ghost" href="' + esc(contact.instagramUrl) + '" target="_blank" rel="noopener noreferrer">' + icon + ' Nous écrire sur Instagram</a>';
    } else {
      slot.innerHTML = '<span class="btn btn-ghost" role="link" aria-disabled="true">' + icon + ' Instagram</span>';
      if (note) note.textContent = 'Le compte Instagram sera bientôt disponible.';
    }
  }

  /* ---------- Formulaire ---------- */
  var form = $('#contact-form');
  var statusBox = $('#form-status');

  function readForm() {
    return {
      nom: $('#f-name').value.trim(),
      email: $('#f-email').value.trim(),
      specialite: $('#f-spec').value,
      offre: $('#f-offer').value,
      projet: $('#f-msg').value.trim()
    };
  }

  function setErr(inputId, errId, msg) {
    var input = $(inputId);
    var err = $(errId);
    if (!input || !err) return;
    err.textContent = msg || '';
    if (msg) input.setAttribute('aria-invalid', 'true'); else input.removeAttribute('aria-invalid');
  }

  function validate(d) {
    var ok = true;
    var emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(d.email);
    setErr('#f-name', '#e-name', d.nom ? '' : 'Indique ton nom ou celui du coach.');
    setErr('#f-email', '#e-email', emailOk ? '' : (d.email ? 'Cette adresse e-mail semble incorrecte.' : 'Indique ton adresse e-mail.'));
    setErr('#f-spec', '#e-spec', d.specialite ? '' : 'Choisis une spécialité.');
    setErr('#f-offer', '#e-offer', d.offre ? '' : 'Choisis une formule.');
    setErr('#f-msg', '#e-msg', d.projet.length >= 10 ? '' : 'Décris ton projet en quelques mots (10 caractères minimum).');
    ['#f-name', '#f-email', '#f-spec', '#f-offer', '#f-msg'].forEach(function (id) {
      if ($(id).getAttribute('aria-invalid') === 'true') ok = false;
    });
    if (!ok) {
      var firstBad = form.querySelector('[aria-invalid="true"]');
      if (firstBad) firstBad.focus();
    }
    return ok;
  }

  function requestText(d) {
    return [
      'Demande de site web — YANS',
      '',
      'Nom : ' + d.nom,
      'E-mail : ' + d.email,
      'Spécialité : ' + d.specialite,
      'Offre souhaitée : ' + d.offre,
      '',
      'Description du projet :',
      d.projet
    ].join('\n');
  }

  function showStatus(kind, title, text, d, withRequest) {
    statusBox.hidden = false;
    statusBox.className = 'status is-' + kind;
    var html = '<p class="status-title">' + esc(title) + '</p><p class="status-text">' + esc(text) + '</p>';
    if (withRequest) {
      var body = requestText(d);
      html += '<textarea id="request-text" readonly aria-label="Ta demande, prête à être copiée">' + esc(body) + '</textarea>';
      html += '<div class="status-actions"><button type="button" class="btn btn-ghost btn-sm" id="copy-btn"><svg class="ic" aria-hidden="true"><use href="#i-copy"/></svg> Copier la demande</button>';
      if (contact.email) {
        var href = 'mailto:' + encodeURIComponent(contact.email).replace('%40', '@') +
          '?subject=' + encodeURIComponent('Demande de site web — ' + d.offre) +
          '&body=' + encodeURIComponent(body);
        html += '<a class="btn btn-sm" href="' + esc(href) + '">Envoyer par e-mail</a>';
      }
      html += '</div>';
      if (contact.email) html += '<p class="status-addr">Adresse : ' + esc(contact.email) + '</p>';
    }
    statusBox.innerHTML = html;
    var copy = $('#copy-btn');
    if (copy) copy.addEventListener('click', function () { copyRequest(copy); });
    statusBox.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
  }

  function copyRequest(btn) {
    var ta = $('#request-text');
    var done = function () { btn.lastChild.textContent = ' Copié'; setTimeout(function () { btn.lastChild.textContent = ' Copier la demande'; }, 2200); };
    var fallback = function () { ta.focus(); ta.select(); btn.lastChild.textContent = ' Sélectionné : copie avec Ctrl/Cmd + C'; };
    try {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(ta.value).then(done, fallback);
      } else { fallback(); }
    } catch (err) { fallback(); }
  }

  function noChannelText() {
    if (contact.email || contact.instagramUrl) {
      return 'Ce site n\'envoie pas encore les demandes tout seul. Ta demande n\'a pas été transmise : copie-la ou envoie-la par e-mail' + (contact.instagramUrl ? ', ou par message Instagram.' : '.');
    }
    return 'Ce site n\'a pas encore de canal de réception configuré. Ta demande n\'a pas été transmise. Tu peux la copier pour la conserver.';
  }

  if (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var d = readForm();
      if (!validate(d)) return;

      if (!contact.formEndpoint) {
        showStatus('error', 'Demande prête, mais pas encore envoyée', noChannelText(), d, true);
        return;
      }

      var btn = $('#submit-btn');
      btn.disabled = true;
      var label = btn.firstChild.textContent;
      btn.firstChild.textContent = 'Envoi en cours… ';

      fetch(contact.formEndpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
        body: JSON.stringify(d)
      }).then(function (res) {
        if (!res.ok) throw new Error('HTTP ' + res.status);
        showStatus('ok', 'Demande envoyée', 'Merci, ta demande a bien été transmise. Tu recevras une réponse par e-mail.', d, false);
        form.reset();
        updateHint();
      }).catch(function () {
        showStatus('error', 'L\'envoi n\'a pas abouti', 'Ta demande n\'a pas été transmise. Vérifie ta connexion et réessaie, ou copie-la pour l\'envoyer autrement.', d, true);
      }).then(function () {
        btn.disabled = false;
        btn.firstChild.textContent = label;
      });
    });

    form.addEventListener('input', function (e) {
      var t = e.target;
      if (t && t.getAttribute && t.getAttribute('aria-invalid') === 'true') {
        t.removeAttribute('aria-invalid');
        var err = document.getElementById('e-' + ({ 'f-name': 'name', 'f-email': 'email', 'f-spec': 'spec', 'f-offer': 'offer', 'f-msg': 'msg' }[t.id] || ''));
        if (err) err.textContent = '';
      }
    });
    form.addEventListener('change', function (e) { if (e.target && e.target.id === 'f-offer') updateHint(); });
  }

  /* ---------- Mentions légales ---------- */
  function fillLegal() {
    var legal = C.legal || {};
    document.querySelectorAll('[data-legal]').forEach(function (el) {
      var v = legal[el.getAttribute('data-legal')];
      if (v) { el.textContent = v; } else { el.textContent = 'à compléter'; el.className = 'todo'; }
    });
  }

  function openLegalIfTargeted() {
    if (location.hash === '#mentions') {
      var d = $('#mentions');
      if (d) d.open = true;
    }
  }
  window.addEventListener('hashchange', openLegalIfTargeted);
  var legalLink = $('#legal-link');
  if (legalLink) legalLink.addEventListener('click', function () { var d = $('#mentions'); if (d) d.open = true; });

  /* ---------- Menu mobile + en-tête ---------- */
  var menuBtn = $('#menu-btn');
  var nav = $('#nav');
  if (menuBtn && nav) {
    var setMenu = function (open) {
      nav.classList.toggle('is-open', open);
      menuBtn.setAttribute('aria-expanded', open ? 'true' : 'false');
      menuBtn.setAttribute('aria-label', open ? 'Fermer le menu' : 'Ouvrir le menu');
    };
    menuBtn.addEventListener('click', function () { setMenu(!nav.classList.contains('is-open')); });
    nav.addEventListener('click', function (e) { if (e.target.tagName === 'A') setMenu(false); });
    document.addEventListener('keydown', function (e) { if (e.key === 'Escape') setMenu(false); });
  }

  var header = $('.site-header');
  var onScroll = function () { if (header) header.classList.toggle('is-stuck', window.scrollY > 8); };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* ---------- Démarrage ---------- */
  renderOffers();
  fillSelects();
  renderInstagram();
  fillLegal();
  openLegalIfTargeted();
  var y = $('#year');
  if (y) y.textContent = new Date().getFullYear();
})();
