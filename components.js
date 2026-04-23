/**
 * ConnAgri — Shared Components JS
 * Drawer, Confirm Delete, Toast, Detail View
 * Folosit de TOATE modulele — aceleasi piese lego.
 */

(function () {
  // ===== DRAWER SYSTEM =====
  let drawerBackdrop = null;
  let drawerContainer = null;

  window.openDrawer = function (title, contentHTML, buttons) {
    closeDrawer();
    const screen = document.querySelector('.phone-screen');
    if (!screen) return;

    // Backdrop
    drawerBackdrop = document.createElement('div');
    drawerBackdrop.className = 'drawer-backdrop';
    drawerBackdrop.style.display = 'block';
    drawerBackdrop.onclick = function (e) { if (e.target === drawerBackdrop) closeDrawer(); };

    // Container
    drawerContainer = document.createElement('div');
    drawerContainer.className = 'drawer-container';
    drawerContainer.onclick = function (e) { e.stopPropagation(); };

    // Header
    const header = document.createElement('div');
    header.className = 'drawer-header';
    header.innerHTML = `
      <div class="drawer-header-title">${title}</div>
      <button class="drawer-close" onclick="closeDrawer()">&times;</button>
    `;

    // Content
    const content = document.createElement('div');
    content.className = 'drawer-content';
    content.innerHTML = contentHTML;

    // Footer
    const footer = document.createElement('div');
    footer.className = 'drawer-footer';
    if (buttons && buttons.length) {
      buttons.forEach(function (b) {
        const btn = document.createElement('button');
        btn.className = 'btn ' + (b.class || 'btn-secondary');
        btn.textContent = b.label;
        btn.onclick = b.action || closeDrawer;
        footer.appendChild(btn);
      });
    }

    drawerContainer.appendChild(header);
    drawerContainer.appendChild(content);
    drawerContainer.appendChild(footer);
    drawerBackdrop.appendChild(drawerContainer);
    screen.appendChild(drawerBackdrop);
  };

  window.closeDrawer = function () {
    if (drawerBackdrop && drawerBackdrop.parentNode) {
      drawerBackdrop.parentNode.removeChild(drawerBackdrop);
    }
    drawerBackdrop = null;
    drawerContainer = null;
  };

  // ===== CONFIRM DELETE (mereu 2 pasi) =====
  window.confirmDelete = function (itemName, onConfirm) {
    const content = `
      <div style="text-align:center; padding:16px 0;">
        <div style="font-size:49px; margin-bottom:12px;">&#9888;&#65039;</div>
        <div style="font-size:17px; font-weight:700; color:var(--brand-text-primary); margin-bottom:8px;">Esti sigur?</div>
        <div style="font-size:14px; color:var(--brand-text-muted);">Vrei sa stergi <strong>${itemName}</strong>? Aceasta actiune nu poate fi anulata.</div>
      </div>
    `;
    openDrawer('Confirmare stergere', content, [
      { label: 'Anuleaza', class: 'btn-secondary', action: closeDrawer },
      {
        label: 'Da, sterge', class: 'btn-danger', action: function () {
          closeDrawer();
          if (onConfirm) onConfirm();
          showToast('success', itemName + ' a fost sters.');
        }
      }
    ]);
  };

  // ===== FORM BUILDER =====
  window.buildForm = function (fields) {
    let html = '';
    fields.forEach(function (f) {
      html += '<div class="form-group">';
      html += '<label class="form-label">' + f.label + (f.required ? ' *' : '') + '</label>';
      switch (f.type) {
        case 'select':
          html += '<select class="form-select">';
          html += '<option value="">Selecteaza...</option>';
          (f.options || []).forEach(function (o) { html += '<option>' + o + '</option>'; });
          html += '</select>';
          break;
        case 'textarea':
          html += '<textarea class="form-textarea" placeholder="' + (f.placeholder || '') + '"></textarea>';
          break;
        case 'date':
          html += '<input type="date" class="form-input">';
          break;
        default:
          html += '<input type="text" class="form-input" placeholder="' + (f.placeholder || '') + '" value="' + (f.value || '') + '">';
      }
      html += '</div>';
    });
    return html;
  };

  // ===== TOAST NOTIFICATIONS =====
  window.showToast = function (type, message) {
    const screen = document.querySelector('.phone-screen');
    if (!screen) return;

    // Remove existing
    var old = screen.querySelector('.toast');
    if (old) old.parentNode.removeChild(old);

    var toast = document.createElement('div');
    toast.className = 'toast toast-' + type;
    toast.textContent = message;
    toast.style.display = 'block';
    screen.appendChild(toast);

    setTimeout(function () {
      if (toast.parentNode) toast.parentNode.removeChild(toast);
    }, 3000);
  };

  // ===== FILTER & SORT SYSTEM (exact ca OLDAPP) =====
  window.activeFilters = {};

  window.initFilterDropdown = function (sections) {
    var dd = document.getElementById('filter-dd');
    var trigger = document.querySelector('.toolbar-search');
    if (!dd || !trigger) return;

    // Init activeFilters keys
    sections.forEach(function (sec) { window.activeFilters[sec.key] = []; });

    // Build filter dropdown HTML
    var html = '';
    html += '<div id="active-filters" style="display:none;margin-bottom:8px;">';
    html += '<div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:4px;">';
    html += '<span style="font-size:13px;font-weight:700;color:var(--brand-text-muted);text-transform:uppercase;">Filtre active</span>';
    html += '<span onclick="resetFilters()" style="font-size:13px;color:#0369A1;font-weight:600;cursor:pointer;">Reseteaza</span>';
    html += '</div>';
    html += '<div id="active-pills" class="filter-pills" style="margin-bottom:6px;"></div>';
    html += '<div style="height:1px;background:var(--brand-border);"></div>';
    html += '</div>';

    sections.forEach(function (sec) {
      html += '<div class="filter-section">';
      html += '<div class="filter-section-label">' + sec.label + '</div>';
      html += '<div class="filter-pills">';
      sec.pills.forEach(function (p) {
        var icon = p.icon ? p.icon + ' ' : '';
        html += '<div class="filter-pill" data-filter="' + sec.key + '" data-val="' + p.text.toLowerCase() + '" onclick="toggleFilter(this)">' + icon + p.text + '</div>';
      });
      html += '</div></div>';
    });
    dd.innerHTML = html;

    // Show/hide on search bar click
    trigger.addEventListener('click', function (e) {
      e.stopPropagation();
      showFilterDD();
    });

    // Close on outside click
    document.addEventListener('click', function (e) {
      if (dd && !dd.contains(e.target) && !trigger.contains(e.target)) {
        dd.classList.remove('open');
      }
    });

    // Show active filter count on toolbar-search text
    window.updateFilterBadge = function () {
      var total = 0;
      for (var k in window.activeFilters) total += window.activeFilters[k].length;
      var textEl = trigger.querySelector('.toolbar-search-text');
      if (textEl) {
        textEl.textContent = total > 0 ? total + ' filtr' + (total === 1 ? 'u' : 'e') + ' activ' + (total === 1 ? '' : 'e') : 'Cauta / filtreaza';
        textEl.style.color = total > 0 ? 'var(--brand-primary)' : '';
        textEl.style.fontWeight = total > 0 ? '700' : '';
      }
    };
  };

  window.showFilterDD = function () {
    var dd = document.getElementById('filter-dd');
    if (dd) dd.classList.toggle('open');
  };

  window.toggleFilter = function (el) {
    var f = el.dataset.filter, v = el.dataset.val;
    var arr = window.activeFilters[f];
    var idx = arr.indexOf(v);
    if (idx > -1) {
      arr.splice(idx, 1);
      el.classList.remove('active');
    } else {
      arr.push(v);
      el.classList.add('active');
    }
    updateActivePills();
    applyCardFilters();
    if (window.updateFilterBadge) updateFilterBadge();
  };

  function applyCardFilters() {
    var cards = document.querySelectorAll('.ucard, .ucard-v2, .ucard-arenda, .ucard-echipa, .ucard-fb');
    if (!cards.length) return;
    // Check if any filter is active
    var hasFilters = false;
    for (var k in window.activeFilters) { if (window.activeFilters[k].length) hasFilters = true; }
    cards.forEach(function (card) {
      if (!hasFilters) { card.style.display = 'flex'; return; }
      var searchData = (card.getAttribute('data-search') || '').toLowerCase();
      var match = true;
      for (var key in window.activeFilters) {
        var vals = window.activeFilters[key];
        if (vals.length === 0) continue;
        var found = false;
        vals.forEach(function (v) {
          if (searchData.indexOf(v.toLowerCase()) !== -1) found = true;
        });
        if (!found) match = false;
      }
      card.style.display = match ? 'flex' : 'none';
    });
  }

  // ========== TAB SWITCHING (toate modulele) ==========
  // Face tab-urile de sus clickable — toggle .active intre tab-uri surori.
  document.addEventListener('click', function (e) {
    var tab = e.target.closest && e.target.closest('.view-tab');
    if (!tab) return;
    var siblings = tab.parentElement.querySelectorAll('.view-tab');
    siblings.forEach(function (t) { t.classList.remove('active'); });
    tab.classList.add('active');
  });

  window.removeFilter = function (f, v) {
    var arr = window.activeFilters[f];
    var idx = arr.indexOf(v);
    if (idx > -1) arr.splice(idx, 1);
    document.querySelectorAll('.filter-pill[data-filter="' + f + '"][data-val="' + v + '"]').forEach(function (p) {
      p.classList.remove('active');
    });
    updateActivePills();
    applyCardFilters();
    if (window.updateFilterBadge) updateFilterBadge();
  };

  window.resetFilters = function () {
    for (var k in window.activeFilters) window.activeFilters[k] = [];
    document.querySelectorAll('.filter-pill').forEach(function (p) { p.classList.remove('active'); });
    var input = document.querySelector('.search-bar-input input');
    if (input) input.value = '';
    updateActivePills();
    applyCardFilters();
    if (window.updateFilterBadge) updateFilterBadge();
  };

  function updateActivePills() {
    var cont = document.getElementById('active-pills');
    var wrap = document.getElementById('active-filters');
    if (!cont || !wrap) return;
    var total = 0;
    for (var k in window.activeFilters) total += window.activeFilters[k].length;
    if (total === 0) { wrap.style.display = 'none'; return; }
    wrap.style.display = 'block';
    var html = '';
    for (var key in window.activeFilters) {
      window.activeFilters[key].forEach(function (v) {
        html += '<div class="filter-pill active" style="font-size:13px;" onclick="removeFilter(\'' + key + '\',\'' + v + '\')">' + v + ' &#10005;</div>';
      });
    }
    cont.innerHTML = html;
  }

  // Sort dropdown toggle
  window.toggleSortDD = function () {
    var dd = document.getElementById('sort-dd');
    if (dd) dd.classList.toggle('open');
  };

  // Sort cards by field (toggle asc/desc on same field)
  var currentSortField = null;
  var currentSortDir = 'asc';

  window.sortCards = function (field) {
    // Toggle direction if same field
    if (currentSortField === field) {
      currentSortDir = currentSortDir === 'asc' ? 'desc' : 'asc';
    } else {
      currentSortField = field;
      currentSortDir = 'asc';
    }
    var dir = currentSortDir;

    // Update arrows in dropdown
    document.querySelectorAll('.sort-option').forEach(function (opt) {
      var arrow = opt.querySelector('.sort-arrow');
      if (!arrow) return;
      var f = opt.getAttribute('data-field');
      if (f === field) {
        arrow.textContent = dir === 'asc' ? '\u2191' : '\u2193';
        opt.style.background = 'var(--brand-hover-bg)';
        opt.style.fontWeight = '700';
      } else {
        arrow.textContent = '\u2195';
        opt.style.background = '';
        opt.style.fontWeight = '';
      }
    });

    var list = document.getElementById('card-list');
    if (!list) return;
    var cards = Array.from(list.querySelectorAll('.ucard'));
    cards.sort(function (a, b) {
      var valA = '', valB = '';
      if (field === 'name') {
        valA = (a.querySelector('.ucard-name') || {}).textContent || '';
        valB = (b.querySelector('.ucard-name') || {}).textContent || '';
      } else if (field === 'type') {
        valA = (a.querySelector('.ucard-type') || {}).textContent || '';
        valB = (b.querySelector('.ucard-type') || {}).textContent || '';
      } else if (field === 'status') {
        // Sort by first detail date (ex: "Iun 2026", "Dec 2027")
        var months = {ian:1,feb:2,mar:3,apr:4,mai:5,iun:6,iul:7,aug:8,sep:9,oct:10,nov:11,dec:12};
        var dA = (a.querySelector('.ucard-detail') || {}).textContent || '';
        var dB = (b.querySelector('.ucard-detail') || {}).textContent || '';
        function parseExpDate(s) {
          s = s.trim().toLowerCase();
          var parts = s.split(/\s+/);
          if (parts.length === 2) {
            var m = months[parts[0].substring(0,3)] || 0;
            var y = parseInt(parts[1]) || 9999;
            return y * 100 + m;
          }
          return 999999;
        }
        valA = parseExpDate(dA);
        valB = parseExpDate(dB);
        return dir === 'asc' ? valA - valB : valB - valA;
      } else if (field === 'updated') {
        valA = (a.querySelector('.ucard-updated') || {}).textContent || '';
        valB = (b.querySelector('.ucard-updated') || {}).textContent || '';
      } else if (field === 'number') {
        valA = (a.querySelector('.ucard-number') || {}).textContent || '';
        valB = (b.querySelector('.ucard-number') || {}).textContent || '';
      } else if (field === 'value') {
        valA = parseFloat((a.querySelector('.ucard-value') || {}).textContent) || 0;
        valB = parseFloat((b.querySelector('.ucard-value') || {}).textContent) || 0;
        return dir === 'asc' ? valA - valB : valB - valA;
      }
      var cmp = valA.localeCompare(valB);
      return dir === 'asc' ? cmp : -cmp;
    });
    cards.forEach(function (c) { list.appendChild(c); });
  };

  // Close sort dropdown on outside click
  document.addEventListener('click', function (e) {
    var dd = document.getElementById('sort-dd');
    var btn = document.getElementById('sort-btn');
    if (dd && !dd.contains(e.target) && e.target !== btn) dd.classList.remove('open');
  });

  // ===== UNIVERSAL CARD =====
  // Usage: buildCard({ name, value, unit, number, type, icons:[], updated, status, statusColor, details:[], thumbIcon, thumbBg, onClick })
  // Campuri lipsa nu se afiseaza. Toate sunt string.
  window.buildCard = function (cfg) {
    var searchText = [cfg.name||'', cfg.number||'', cfg.type||'', cfg.status||'', cfg.tags||''].join(' ').replace(/<[^>]*>/g, '').toLowerCase();
    var html = '<div class="ucard" data-search="' + searchText + '"' + (cfg.onClick ? ' onclick="' + cfg.onClick + '"' : '') + '>';

    // Thumbnail
    var hasThumb = cfg.thumbIcon && !cfg.thumbSmall;
    html += '<div class="ucard-thumb" style="' + (cfg.thumbBg ? 'background:' + cfg.thumbBg + ';' : '') + (!hasThumb ? 'width:36px;min-height:auto;' : '') + (!cfg.thumbBg && !hasThumb ? 'background:var(--brand-primary);' : '') + '">';
    if (cfg.thumbIcon) html += '<div class="ucard-thumb-icon">' + cfg.thumbIcon + '</div>';
    html += '<div class="ucard-thumb-check" onclick="event.stopPropagation();toggleCardCheck(this)">&#10003;</div>';
    html += '</div>';

    // Body
    html += '<div class="ucard-body">';
    // Row 1: workPoint + icons (doar daca exista)
    var iconList = (cfg.icons || []).filter(function(i){ return !!i; }).slice(0, 2);
    if (cfg.workPoint || iconList.length) {
      html += '<div class="ucard-row1">';
      html += '<div class="ucard-workpoint">' + (cfg.workPoint || '') + '</div>';
      html += '<div class="ucard-icons">';
      for (var i = 0; i < iconList.length; i++) {
        html += '<div class="ucard-icon">' + iconList[i] + '</div>';
      }
      html += '</div>';
      html += '</div>';
    }
    // Row 2: name (full width)
    html += '<div class="ucard-name">' + (cfg.name || '&nbsp;') + '</div>';
    // Row 3: left stack (number, type, value, updated) | right stack (status, details)
    html += '<div class="ucard-row4">';
    html += '<div class="ucard-bl">';
    html += '<div class="ucard-number">' + (cfg.number || '&nbsp;') + '</div>';
    html += '<div class="ucard-type">' + (cfg.type || '&nbsp;') + '</div>';
    html += '<div class="ucard-value">' + (cfg.value ? cfg.value + (cfg.unit ? ' <small>' + cfg.unit + '</small>' : '') : '&nbsp;') + '</div>';
    html += '<div class="ucard-updated">' + (cfg.updated || '&nbsp;') + '</div>';
    html += '</div>';
    html += '<div class="ucard-right">';
    html += '<div class="ucard-status"' + (cfg.status ? (cfg.statusColor ? ' style="background:' + cfg.statusColor + ';"' : '') : ' style="visibility:hidden;"') + '>' + (cfg.status || '&nbsp;') + '</div>';
    if (cfg.details && cfg.details[0]) html += '<div class="ucard-detail">' + cfg.details[0] + '</div>';
    if (cfg.details && cfg.details[1]) html += '<div class="ucard-detail">' + cfg.details[1] + '</div>';
    if (cfg.details && cfg.details[2]) html += '<div class="ucard-detail">' + cfg.details[2] + '</div>';
    html += '</div>';
    html += '</div>';
    html += '</div>';

    html += '</div>';
    return html;
  };

  // ===== UNIVERSAL CARD V2 (Lista Terenuri — stil OLDAPP tc) =====
  // Layout horizontal: img(90px) | body(flex) | risk(60px cu 4 indicatori)
  var UCARD_V2_SHAPES = [
    '20,5 100,10 110,50 30,55 10,30',
    '30,5 95,8 105,55 15,50',
    '10,15 70,5 110,25 100,55 20,50',
    '25,10 100,5 95,50 15,55',
    '15,10 55,5 110,20 100,55 40,50 10,35',
    '15,8 90,5 110,40 95,55 20,55',
    '12,20 80,8 105,45 40,55 15,45',
    '25,15 105,10 100,50 20,55 10,35',
    '15,5 95,10 108,45 85,55 15,50',
    '20,8 75,5 108,30 90,55 30,55',
    '10,25 65,8 100,18 110,50 45,55 15,48',
    '30,10 90,5 108,45 70,55 12,40'
  ];
  var ucardV2Index = 0;

  // 4 icoane SVG de risc reutilizabile (daunatori, cultura, apa, meteo)
  var UCARD_V2_RISK_ICONS = [
    '<svg width="20" height="20" viewBox="0 0 24 24"><path d="M17,8C8,10 5.9,16.17 3.82,21.34L5.71,22L6.66,19.7C7.14,19.87 7.64,20 8,20C19,20 22,3 22,3C21,5 14,5.25 9,6.25C4,7.25 2,11.5 2,13.5C2,15.5 3.75,17.25 3.75,17.25C7,8 17,8 17,8Z" fill="#8B4513"/></svg>',
    '<svg width="20" height="20" viewBox="0 0 24 24"><path d="M12,2C12,2 7,4 7,8C7,10 8,11 8,11L5,14L6,15L8,13C8,13 9,14 10,14L7,19L9,20L12,15L15,20L17,19L14,14C15,14 16,13 16,13L18,15L19,14L16,11C16,11 17,10 17,8C17,4 12,2 12,2Z" fill="#2D5A1E" stroke="#1a1a1a" stroke-width="0.5"/><circle cx="10" cy="7" r="1" fill="#1a1a1a"/><circle cx="14" cy="7" r="1" fill="#1a1a1a"/></svg>',
    '<svg width="20" height="20" viewBox="0 0 24 24"><path d="M12,22L12,14" stroke="#2E7D32" stroke-width="2" fill="none"/><path d="M12,14C12,14 8,10 6,6" stroke="#2E7D32" stroke-width="2" fill="none" stroke-linecap="round"/><path d="M12,14C12,14 16,10 18,6" stroke="#2E7D32" stroke-width="2" fill="none" stroke-linecap="round"/><path d="M12,18C12,18 9,14 7,12" stroke="#4CAF50" stroke-width="2" fill="none" stroke-linecap="round"/><path d="M12,18C12,18 15,14 17,12" stroke="#4CAF50" stroke-width="2" fill="none" stroke-linecap="round"/></svg>',
    '<svg width="20" height="20" viewBox="0 0 24 24"><path d="M12,2C12,2 5,10 5,15C5,18.87 8.13,22 12,22C15.87,22 19,18.87 19,15C19,10 12,2 12,2Z" fill="#0369A1"/></svg>'
  ];
  var UCARD_V2_SEVERITY = [
    { arrow: '&#9660;', color: '#2E7D32' }, // jos verde = ok
    { arrow: '&#9654;', color: '#F59E0B' }, // dreapta portocaliu = atentie
    { arrow: '&#9650;', color: '#C0392B' }  // sus rosu = alert
  ];

  window.buildCardV2 = function (cfg) {
    var searchText = [cfg.name||'', cfg.number||'', cfg.type||'', cfg.status||'', cfg.tags||''].join(' ').toLowerCase();
    var clickAttr = cfg.onClick ? ' onclick="' + cfg.onClick + '"' : '';
    var html = '<div class="ucard-v2" data-search="' + searchText + '"' + clickAttr + '>';

    // Checkbox absolut top-left
    html += '<div class="ucard-v2-check" onclick="event.stopPropagation();this.parentElement.classList.toggle(\'selected\');">&#10003;</div>';

    // IMG: verde degrade + poligon cultura (forma per card)
    var shape = UCARD_V2_SHAPES[ucardV2Index % UCARD_V2_SHAPES.length];
    var shapeIdx = ucardV2Index;
    ucardV2Index++;
    html += '<div class="ucard-v2-img">';
    html += '<svg class="ucard-v2-shape" width="60" height="50" viewBox="0 0 120 60"><polygon points="' + shape + '" fill="' + (cfg.thumbBg || '#1B5E20') + '" opacity="0.7"/></svg>';
    if (cfg.value) html += '<div class="ucard-v2-img-area">' + cfg.value + (cfg.unit ? ' <small>' + cfg.unit + '</small>' : '') + '</div>';
    if (cfg.alert) {
      html += '<div class="ucard-v2-alert-badge" style="background:' + (cfg.alertColor || '#C0392B') + ';">!</div>';
    }
    html += '</div>';

    // BODY: nume + numar + cultura + suprafata·proprietate + status
    html += '<div class="ucard-v2-body">';
    // Grup cu fundal palid: name + number + punct lucru
    html += '<div class="ucard-v2-cs">';
    html += '<div class="ucard-v2-name">' + (cfg.name || '&nbsp;') + '</div>';
    if (cfg.number) html += '<div class="ucard-v2-apia">' + cfg.number + '</div>';
    if (cfg.details && cfg.details[0]) html += '<div class="ucard-v2-PL">' + cfg.details[0] + '</div>';
    html += '</div>';
    if (cfg.type) {
      // Toata cultura uppercase; daca exista "de X" (de toamnă, de primăvară), acea parte ramane lowercase
      var typeFmt = cfg.type.toUpperCase();
      typeFmt = typeFmt.replace(/\sDE\s(\S+)/g, function(_, w) { return ' de ' + w.toLowerCase(); });
      html += '<div class="ucard-v2-culture" style="color:' + (cfg.typeColor || '#F59E0B') + ';">' + typeFmt + '</div>';
    }
    if (cfg.soi) {
      // Separa soi (bold) de norma (regular, 14p) — norma = "NNk/ha" sau "NN unit/..."
      var m = cfg.soi.match(/^(.+?)\s(\d[^\/\s]*\/\S+|\d+\s[a-zA-Z]+\/\S+)$/);
      if (m) {
        html += '<div class="ucard-v2-soi">' + m[1] + ' - <span class="ucard-v2-norm">' + m[2] + '</span></div>';
      } else {
        html += '<div class="ucard-v2-soi">' + cfg.soi + '</div>';
      }
    }
    if (cfg.status || cfg.updated) {
      html += '<div class="ucard-v2-work-row">';
      if (cfg.status) html += '<div class="ucard-v2-work">' + cfg.status + '</div>';
      if (cfg.status && cfg.updated) html += '<span class="ucard-v2-sep">-</span>';
      if (cfg.updated) html += '<div class="ucard-v2-upd">' + cfg.updated + '</div>';
      html += '</div>';
    }
    html += '</div>';

    // Stripe dreapta (culoarea culturii, 15px latime, toata inaltimea cardului)
    html += '<div class="ucard-v2-stripe" style="background:' + (cfg.thumbBg || 'var(--brand-primary)') + ';"></div>';

    html += '</div>'; // end ucard
    return html;
  };

  // ===== UCARD ARENDA (layout vertical cu stripe + bell + expira) =====
  window.buildCardArenda = function (cfg) {
    var searchText = [cfg.name||'', cfg.number||'', cfg.type||'', cfg.status||'', cfg.tags||''].join(' ').toLowerCase();
    var clickAttr = cfg.onClick ? ' onclick="' + cfg.onClick + '"' : '';
    var html = '<div class="ucard-arenda" data-search="' + searchText + '"' + clickAttr + '>';

    // Stripe cu checkbox — gradient diferit per tip de contract (tonuri subtile)
    var typeGradients = {
      'Arenda':     'linear-gradient(180deg, #338687 0%, #00686A 50%, #005557 100%)',  // verde brand
      'Concesiune': 'linear-gradient(180deg, #4A90B8 0%, #2E6B91 50%, #1A4F72 100%)',  // albastru teal
      'Comodat':    'linear-gradient(180deg, #8B6FB8 0%, #6D4F99 50%, #523373 100%)',  // mov mat
      'Schimb':     'linear-gradient(180deg, #C9A057 0%, #A37A3A 50%, #7D5922 100%)'   // auriu/bronze
    };
    var stripeBg = typeGradients[cfg.type] || typeGradients['Arenda'];
    html += '<div class="ua-stripe" style="background:' + stripeBg + ';">';
    html += '<div class="ua-check" onclick="event.stopPropagation();this.parentElement.parentElement.classList.toggle(\'selected\');">&#10003;</div>';
    html += '</div>';

    // Calcul stare pe baza datei de expirare (din details[0])
    var hasValidDate = cfg.details && cfg.details[0];
    var arendaExpDate = hasValidDate ? parseExpiryDate(cfg.details[0]) : null;
    var aStatusText, aStatusBg, aIsExpired = false, aIsWarning = false;
    if (!hasValidDate) {
      aStatusBg = '#888'; aStatusText = cfg.status || 'Activ';
    } else if (arendaExpDate) {
      var aToday = new Date();
      var aDiff = (arendaExpDate.getFullYear() - aToday.getFullYear()) * 12 + (arendaExpDate.getMonth() - aToday.getMonth());
      if (aDiff < 0) {
        aStatusBg = '#C0392B'; aStatusText = 'Expirat'; aIsExpired = true;
      } else if (aDiff < 3) {
        aStatusBg = '#F57C00'; aStatusText = 'Scadent'; aIsWarning = true;
      } else {
        aStatusBg = '#27AE60'; aStatusText = 'Activ';
      }
    } else {
      aStatusBg = cfg.statusColor || '#27AE60';
      aStatusText = cfg.status || 'Activ';
      aIsExpired = cfg.statusColor === '#C0392B';
      aIsWarning = cfg.statusColor === '#B7791F' || cfg.statusColor === '#F57C00';
    }
    // Curata prefixul "Expira:" din data afisata
    var aDateText = hasValidDate ? cfg.details[0].replace(/^expira[t]?\s*:\s*/i, '') : 'necunoscut';

    // Body
    html += '<div class="ua-body">';

    // Top: name + bell (alert rosu daca expirat, clopotel daca warning)
    html += '<div class="ua-top">';
    html += '<div class="ua-name">' + (cfg.name || '&nbsp;') + '</div>';
    if (aIsExpired || aIsWarning || cfg.alert) {
      html += '<div class="ua-bell' + (aIsExpired ? ' ua-bell-alert' : '') + '">' + (aIsExpired ? '!' : '&#128276;') + '</div>';
    }
    html += '</div>';

    // Sub label + sub (number — ex: "Împuternicit: / Ion Popescu" sau array cu mai multi)
    if (cfg.number) {
      var names = Array.isArray(cfg.number) ? cfg.number : [cfg.number];
      html += '<div class="ua-sub-label">&Icirc;mputernicit' + (names.length > 1 ? 'i' : '') + ':</div>';
      names.forEach(function (n) {
        html += '<div class="ua-sub">' + n + '</div>';
      });
    }

    // Bottom — 2 coloane: stanga (type + value), dreapta (status + date pill)
    html += '<div class="ua-bottom">';
    html += '<div class="ua-bl">';
    if (cfg.type) html += '<div class="ua-type">' + cfg.type + '</div>';
    html += '<div class="ua-value">' + (cfg.value || '') + (cfg.unit ? ' <small>' + cfg.unit + '</small>' : '') + '</div>';
    html += '</div>';
    html += '<div class="ua-br">';
    html += '<div class="ua-status" style="background:' + aStatusBg + ';">' + aStatusText + '</div>';
    html += '<div class="ua-expira">' + aDateText + '</div>';
    html += '</div>';
    html += '</div>';

    html += '</div>'; // end body
    html += '</div>'; // end ucard-arenda
    return html;
  };

  // ===== UCARD STOCURI (aceeasi structura ca arenda) =====
  var ROM_MONTHS = { ian:0, feb:1, mar:2, apr:3, mai:4, iun:5, iul:6, aug:7, sep:8, oct:9, nov:10, dec:11 };
  function parseExpiryDate(s) {
    if (!s) return null;
    // Strip "Expira:" / "Expirat:" prefix daca exista
    var cleaned = s.trim().toLowerCase().replace(/^expira[t]?\s*:\s*/, '');
    // Accepta "iun 2026", "iun.2026", "iun-2026"
    var m = cleaned.match(/^([a-z]+)[\s.\-]+(\d{4})$/);
    if (!m) return null;
    var monthKey = m[1].substring(0, 3);
    var month = ROM_MONTHS[monthKey];
    var year = parseInt(m[2], 10);
    if (month === undefined || isNaN(year)) return null;
    return new Date(year, month + 1, 0); // ultima zi din acea luna
  }

  var STOCURI_GRADIENTS = {
    'Pesticide':    'linear-gradient(180deg, #6B7BAF 0%, #4A5B8F 50%, #2E3A6B 100%)',  // navy / albastru inchis
    'Combustibil':  'linear-gradient(180deg, #9B6FAA 0%, #7B4F8A 50%, #5A3670 100%)',  // mov / indigo
    'Seminte':      'linear-gradient(180deg, #6AA8B5 0%, #4A8E9B 50%, #2E6B78 100%)',  // teal / cyan-mat
    'Ingrasaminte': 'linear-gradient(180deg, #7A8FA2 0%, #5A6F82 50%, #3D5164 100%)',  // slate / albastru gri
    'Piese':        'linear-gradient(180deg, #A8825E 0%, #8B6548 50%, #6B4A2E 100%)',  // maro / taupe
    'Altele':       'linear-gradient(180deg, #8B8273 0%, #6B6357 50%, #4D453B 100%)'   // gri-maron neutru
  };

  window.buildCardStocuri = function (cfg) {
    var searchText = [cfg.name||'', cfg.number||'', cfg.type||'', cfg.status||'', cfg.tags||''].join(' ').toLowerCase();
    var clickAttr = cfg.onClick ? ' onclick="' + cfg.onClick + '"' : '';
    var html = '<div class="ucard-arenda ucard-stocuri" data-search="' + searchText + '"' + clickAttr + '>';

    // Stripe cu gradient pe tip de produs
    var stripeBg = STOCURI_GRADIENTS[cfg.type] || 'linear-gradient(180deg, #338687 0%, #00686A 50%, #005557 100%)';
    html += '<div class="ua-stripe" style="background:' + stripeBg + ';">';
    html += '<div class="ua-check" onclick="event.stopPropagation();this.parentElement.parentElement.classList.toggle(\'selected\');">&#10003;</div>';
    html += '</div>';

    // Body
    html += '<div class="ua-body">';

    // Calcul stare pe baza stocului si datei de expirare
    var stockNum = parseFloat(cfg.value);
    var hasValidStock = !isNaN(stockNum) && stockNum > 0;
    var hasValidDate = cfg.details && cfg.details[0];
    var isUnknown = !hasValidDate || !hasValidStock;
    var statusText, statusBg, isExpired = false, isWarning = false;
    if (isUnknown) {
      statusBg = '#888';
      statusText = 'Expira';
    } else {
      var expDate = parseExpiryDate(cfg.details[0]);
      if (expDate) {
        var today = new Date();
        var diffMonths = (expDate.getFullYear() - today.getFullYear()) * 12 + (expDate.getMonth() - today.getMonth());
        if (diffMonths < 0) {
          statusBg = '#C0392B'; statusText = 'Expirat'; isExpired = true;
        } else if (diffMonths < 3) {
          statusBg = '#F57C00'; statusText = 'Expira'; isWarning = true;
        } else {
          statusBg = '#27AE60'; statusText = 'Expira';
        }
      } else {
        statusBg = cfg.statusColor || '#27AE60';
        statusText = cfg.statusColor === '#C0392B' ? 'Expirat' : (cfg.status || 'Expira');
        isExpired = cfg.statusColor === '#C0392B';
        isWarning = cfg.statusColor === '#B7791F' || cfg.statusColor === '#F57C00';
      }
    }
    var dateText = hasValidDate ? cfg.details[0] : 'necunoscut';

    // Top: nume + bell (alert rosu daca e expirat, clopotel daca e warning/alert)
    html += '<div class="ua-top">';
    html += '<div class="ua-name">' + (cfg.name || '&nbsp;') + '</div>';
    if (isExpired || isWarning || cfg.alert) {
      html += '<div class="ua-bell' + (isExpired ? ' ua-bell-alert' : '') + '">' + (isExpired ? '!' : '&#128276;') + '</div>';
    }
    html += '</div>';

    // Sub (number = tip — ex: Erbicid, Insecticid, Fungicid, Combustibil, Porumb)
    if (cfg.number) html += '<div class="ua-sub">' + cfg.number + '</div>';

    html += '<div class="ua-bottom">';
    html += '<div class="ua-bl">';
    if (cfg.type) html += '<div class="ua-type">' + cfg.type + '</div>';
    html += '<div class="ua-value">' + (cfg.value || '') + (cfg.unit ? ' <small>' + cfg.unit + '</small>' : '') + '</div>';
    html += '</div>';
    html += '<div class="ua-br">';
    html += '<div class="ua-status" style="background:' + statusBg + ';">' + statusText + '</div>';
    html += '<div class="ua-expira">' + dateText + '</div>';
    html += '</div>';
    html += '</div>';

    html += '</div>'; // end body
    html += '</div>'; // end ucard-arenda
    return html;
  };

  // Helper: formatare lista "Bravo" — "Ion, Maria si 2 altii"
  window.formatBravosText = function (names) {
    if (!names || names.length === 0) return '';
    if (names.length === 1) return names[0];
    if (names.length === 2) return names[0] + ' si ' + names[1];
    return names[0] + ', ' + names[1] + ' si ' + (names.length - 2) + ' alt' + (names.length - 2 === 1 ? 'ul' : 'ii');
  };

  // ===== UCARD AGENDA 2026 (foto-hero cu overlay pills, expanduri functionale) =====
  // cfg: { itemId, kind, date, author, title, alert, alertMsg,
  //        soles:[{name,ha}], ha, inputuri:[{name,value,color}], operators:[names],
  //        photos:N, comments:N, commentsPreview:[{author,txt}],
  //        conditions:{tmin,tmax,vUtilaj,vVant,tSol,precip}, notes, onClick }
  window.buildCardAgenda = function (cfg) {
    var soles = cfg.soles || [];
    var inputuri = cfg.inputuri || [];
    var operators = cfg.operators || [];
    var photos = cfg.photos || 0;
    var comments = cfg.comments || 0;
    var commentsPreview = cfg.commentsPreview || [];
    var conditions = cfg.conditions;
    var isEvaluare = cfg.kind === 'evaluare';
    var kindClass = isEvaluare ? 'evaluare' : 'lucrare';
    var soleNames = soles.map(function(s){ return typeof s === 'object' ? s.name : s; });
    var searchText = [cfg.title||'', cfg.author||'', cfg.date||'', cfg.kind||'', cfg.culture||'', soleNames.join(' ')].join(' ').toLowerCase();
    var clickAttr = cfg.onClick ? ' onclick="' + cfg.onClick + '"' : '';
    var authorInit = cfg.authorInit || ((cfg.author || 'U').split(' ').map(function(w){return w[0];}).join('').substring(0,2).toUpperCase());

    var id = cfg.itemId || 0;
    var hasPhotos = photos > 0;
    var noPhotoCls = hasPhotos ? '' : ' no-photo';
    var html = '<div class="ucard-fb' + noPhotoCls + '" data-id="' + id + '" data-search="' + searchText + '" data-kind="' + kindClass + '" data-ha="' + (cfg.ha||0) + '"' + clickAttr + '>';

    // HERO: doar daca exista foto (fara pill tip - s-a mutat sub parcele)
    if (hasPhotos) {
      html += '<div class="ufb-hero" onclick="event.stopPropagation();openPhotoGallery(' + id + ')">';
      var heroIcon = isEvaluare ? '&#128269;' : (cfg.title === 'Recoltat' ? '&#127806;' : '&#127793;');
      html += '<div class="ufb-hero-ph">' + heroIcon + '</div>';
      if (cfg.alert) html += '<div class="ufb-hero-alert" title="' + (cfg.alertMsg||'') + '">!</div>';
      html += '<div class="ufb-hero-photos-count">&#128247; ' + photos + '</div>';
      if (photos > 1) {
        html += '<div class="ufb-hero-dots">';
        var maxDots = Math.min(photos, 5);
        for (var i = 0; i < maxDots; i++) html += '<div class="ufb-dot' + (i===0?' active':'') + '"></div>';
        html += '</div>';
      }
      html += '</div>';
    }

    // META: avatar + nume + data (+ alert inline daca nu-i foto) + kebab
    html += '<div class="ufb-meta">';
    html += '<div class="ufb-avatar">' + authorInit + '</div>';
    html += '<div class="ufb-meta-txt">';
    html += '<div class="ufb-author-line">' + (cfg.author||'') + '</div>';
    html += '<div class="ufb-when">' + (cfg.date||'') + '</div>';
    html += '</div>';
    if (!hasPhotos && cfg.alert) {
      html += '<div class="ufb-meta-alert" title="' + (cfg.alertMsg||'') + '">!</div>';
    }
    html += '<button class="ufb-more-btn" onclick="event.stopPropagation();openCardMenu(' + id + ')">&#8942;</button>';
    html += '</div>';

    // 2 linii: (1) titlu lucrare/evaluare + pastila ha    (2) parcela + "+N" + Vezi toate
    if (soles.length) {
      var primary = typeof soles[0] === 'object' ? soles[0] : { name: soles[0], ha: null };
      var more = soles.length - 1;
      var totalHa = cfg.ha;
      if (!totalHa) {
        totalHa = 0;
        soles.forEach(function(s) { if (typeof s === 'object' && s.ha) totalHa += s.ha; });
      }
      // Rand 1: titlu lucrare/evaluare  +  pastila suprafata (DEASUPRA)
      html += '<div class="ufb-title-row">';
      html += '<div class="ufb-title-pill ' + kindClass + '">' + (cfg.title || (isEvaluare?'Evaluare':'Lucrare')) + '</div>';
      if (totalHa) html += '<div class="ufb-ha-pill">' + totalHa.toFixed(1).replace('.0','').replace('.', ',') + ' ha</div>';
      html += '</div>';
      // Rand 2: parcela + +N + Vezi toate
      html += '<div class="ufb-sole-line">';
      html += '<div class="ufb-sole-primary">' + primary.name + '</div>';
      if (more > 0) html += '<div class="ufb-sole-more">+' + more + '</div>';
      if (soles.length > 1) html += '<button class="ufb-sole-seeall" onclick="event.stopPropagation();openSolesList(' + id + ')">Vezi toate</button>';
      html += '</div>';
    }

    // INPUTURI (doar lucrare)
    if (!isEvaluare && inputuri.length) {
      html += '<div class="ufb-inputs-inline">';
      inputuri.forEach(function(inp) {
        html += '<div class="ufb-input-chip">';
        html += '<span class="ufb-input-dot-c" style="background:' + (inp.color||'#888') + ';"></span>';
        html += inp.name + ' <strong>' + inp.value + '</strong>';
        html += '</div>';
      });
      html += '</div>';
    }

    // NOTES / observatii (pentru orice tip - lucrare sau evaluare)
    if (cfg.notes) {
      html += '<div class="ufb-notes">' + cfg.notes + '</div>';
    }

    // FACTS: operator + conditii (doar lucrare)
    if (!isEvaluare && (operators.length || conditions)) {
      html += '<div class="ufb-facts">';
      if (operators.length) {
        html += '<div class="ufb-operator-inline">';
        operators.forEach(function(op) {
          html += '<div class="ufb-op-badge">&#128100; ' + op + '</div>';
        });
        html += '</div>';
      }
      // Conditii: afisez DOAR daca exista alerta sau o conditie e warn/bad
      if (conditions) {
        var c = conditions;
        var vVantNum = parseInt(c.vVant) || 0;
        var precipNum = parseInt(c.precip) || 999;
        var vVantCls = vVantNum >= 7 ? 'warn' : '';
        var precipCls = precipNum < 12 ? 'bad' : (precipNum < 24 ? 'warn' : '');
        var hasIssue = cfg.alert || vVantCls || precipCls;
        if (hasIssue) {
          html += '<div class="ufb-cond-inline">';
          html += '<span class="ufb-cond-inline-item">&#127777; ' + c.tmin + '-' + c.tmax + '</span>';
          html += '<span class="ufb-cond-inline-item">&#128668; ' + c.vUtilaj + '</span>';
          html += '<span class="ufb-cond-inline-item ' + vVantCls + '">&#127788; ' + c.vVant + '</span>';
          html += '<span class="ufb-cond-inline-item ' + precipCls + '">&#127783; ' + c.precip + '</span>';
          html += '</div>';
        }
      }
      html += '</div>';
    }

    // BRAVOS preview (nume celor care au dat bravo) - deasupra barei de actiuni
    var bravos = cfg.bravos || [];
    if (bravos.length > 0) {
      html += '<div class="ufb-bravos" onclick="event.stopPropagation();openBravos(' + id + ')">';
      html += '<span class="ufb-bravos-ico">&#10084;&#65039;</span>';
      html += '<span class="ufb-bravos-txt">' + formatBravosText(bravos) + '</span>';
      html += '</div>';
    }

    // ACTIONS bar: Bravo (cu count) + Comenteaza - mereu thumbs-up, liked = background colorat
    var likedCls = cfg.liked ? ' liked' : '';
    html += '<div class="ufb-actions">';
    html += '<button class="ufb-action-btn' + likedCls + '" onclick="event.stopPropagation();toggleLike(this,' + id + ')"><span class="ufb-action-btn-ico">&#128077;</span> ' + (bravos.length > 0 ? bravos.length + ' ' : '') + 'Bravo</button>';
    html += '<button class="ufb-action-btn" onclick="event.stopPropagation();openComments(' + id + ')"><span class="ufb-action-btn-ico">&#128172;</span> Comenteaza</button>';
    html += '</div>';

    // COMMENTS preview
    if (commentsPreview.length > 0) {
      html += '<div class="ufb-cc-preview">';
      commentsPreview.slice(0, 2).forEach(function(cc) {
        var cInit = cc.author.split(' ').map(function(w){return w[0];}).join('').substring(0,2).toUpperCase();
        html += '<div class="ufb-cc">';
        html += '<div class="ufb-cc-ava">' + cInit + '</div>';
        html += '<div class="ufb-cc-bd"><strong>' + cc.author.split(' ')[0] + '</strong>' + cc.txt + '</div>';
        html += '</div>';
      });
      if (comments > commentsPreview.length) {
        html += '<button class="ufb-cc-more" onclick="event.stopPropagation();openComments(' + id + ')">Vezi toate ' + comments + ' comentarii &rarr;</button>';
      }
      html += '</div>';
    }

    html += '</div>';
    return html;
  };

  // ===== UCARD ECHIPA (layout: panou avatar stanga + body 2×2) =====
  window.buildCardEchipa = function (cfg) {
    var searchText = [cfg.name||'', cfg.number||'', cfg.type||'', cfg.status||'', cfg.tags||''].join(' ').toLowerCase();
    var clickAttr = cfg.onClick ? ' onclick="' + cfg.onClick + '"' : '';
    var html = '<div class="ucard-echipa" data-search="' + searchText + '"' + clickAttr + '>';

    // Panou avatar (stanga): checkbox + emoji persoana
    html += '<div class="uec-avatar-col">';
    html += '<div class="uec-check" onclick="event.stopPropagation();this.parentElement.parentElement.classList.toggle(\'selected\');">&#10003;</div>';
    html += '<div class="uec-avatar">' + (cfg.thumbIcon || '&#128100;') + '</div>';
    html += '</div>';

    // Status logic
    var eStatusText = cfg.status || 'Activ';
    var eStatusBg, eIsAlert = false, eIsWarning = false;
    if (cfg.statusColor) {
      eStatusBg = cfg.statusColor;
      eIsAlert = cfg.statusColor === '#C0392B';
      eIsWarning = cfg.statusColor === '#B7791F' || cfg.statusColor === '#F57C00';
    } else if (cfg.status === 'Concediu') {
      eStatusBg = '#F57C00'; eIsWarning = true;
    } else if (cfg.status === 'Suspendat') {
      eStatusBg = '#C0392B'; eIsAlert = true;
    } else if (cfg.status === 'Inactiv') {
      eStatusBg = '#888';
    } else {
      eStatusBg = '#27AE60'; // Activ default
    }

    // Body
    html += '<div class="uec-body">';

    // Row top: titles (nume + rol) stanga + icons (bell + alert) dreapta
    html += '<div class="uec-row-top">';
    html += '<div class="uec-titles">';
    html += '<div class="uec-name">' + (cfg.name || '&nbsp;') + '</div>';
    if (cfg.type) html += '<div class="uec-role">' + cfg.type + '</div>';
    html += '</div>';
    html += '<div class="uec-icons">';
    if (eIsWarning || eIsAlert || cfg.alert) html += '<div class="uec-bell">&#128276;</div>';
    if (eIsAlert) html += '<div class="uec-alert">!</div>';
    html += '</div>';
    html += '</div>';

    // Row bottom: punct lucru stanga + status + hours dreapta
    html += '<div class="uec-row-bot">';
    html += '<div class="uec-punct">' + (cfg.number || '&nbsp;') + '</div>';
    html += '<div class="uec-pills">';
    html += '<div class="uec-status" style="background:' + eStatusBg + ';">' + eStatusText + '</div>';
    if (cfg.details && cfg.details[0]) html += '<div class="uec-hours">' + cfg.details[0] + '</div>';
    html += '</div>';
    html += '</div>';

    html += '</div>'; // end body
    html += '</div>'; // end ucard-echipa
    return html;
  };

  // ===== FAB ACTIONS MENU =====
  // Usage: initFabActions([ { icon: '&#11014;', label: 'Importa', action: function(){...} }, ... ])
  window.initFabActions = function (actions) {
    var fab = document.querySelector('.fab');
    if (!fab) return;

    // Create menu
    var menu = document.createElement('div');
    menu.className = 'fab-actions';
    menu.id = 'fab-actions-menu';
    actions.forEach(function (a) {
      var item = document.createElement('div');
      item.className = 'fab-action';
      item.innerHTML = '<span style="font-size:17px;">' + (a.icon || '') + '</span> ' + a.label;
      item.onclick = function () { toggleFabActions(); if (a.action) a.action(); };
      menu.appendChild(item);
    });
    fab.parentNode.insertBefore(menu, fab);

    // Override FAB click
    fab.onclick = function (e) { e.stopPropagation(); toggleFabActions(); };

    // Close on outside click
    document.addEventListener('click', function (e) {
      if (menu.classList.contains('open') && !menu.contains(e.target) && !fab.contains(e.target)) {
        menu.classList.remove('open');
        fab.style.transform = 'rotate(0deg)';
      }
    });
  };

  window.toggleFabActions = function () {
    var menu = document.getElementById('fab-actions-menu');
    var fab = document.querySelector('.fab');
    if (!menu || !fab) return;
    var open = !menu.classList.contains('open');
    menu.classList.toggle('open');
    fab.style.transform = open ? 'rotate(45deg)' : 'rotate(0deg)';
  };

  // ===== CARD CHECK TOGGLE =====
  window.toggleCardCheck = function (el) {
    el.classList.toggle('checked');
  };

  // ===== SELECT ALL (butonul Toate) =====
  window.selectAllVisible = function () {
    var checks = document.querySelectorAll('.ucard-thumb-check');
    var allChecked = true;
    checks.forEach(function (c) { if (!c.classList.contains('checked')) allChecked = false; });
    checks.forEach(function (c) {
      if (allChecked) c.classList.remove('checked');
      else c.classList.add('checked');
    });
  };

  // ===== SHARED FAB DELETE (inactiv cand nimic bifat + confirmare prin tastare) =====
  // Modulele apeleaza setupFabDelete({ cardSel, entityLabel, entityLabelPl, labelText })
  // dupa initFabActions. Actiunea Sterge din FAB trebuie sa invoce tryFabDelete().
  window._fabDeleteConfig = null;

  window.setupFabDelete = function (config) {
    window._fabDeleteConfig = config || {};
    // Intarziere minima — asteapta ca FAB sa fie renderat
    setTimeout(function () {
      var fabBtn = document.querySelector('.fab');
      if (fabBtn && !fabBtn._fabDelHooked) {
        fabBtn._fabDelHooked = true;
        var orig = fabBtn.onclick;
        fabBtn.onclick = function (e) {
          window.refreshFabDeleteState();
          if (orig) return orig.call(this, e);
        };
      }
      if (!document._fabDelCheckHooked) {
        document._fabDelCheckHooked = true;
        document.addEventListener('click', function (e) {
          if (!e.target || !e.target.classList) return;
          var cl = e.target.classList;
          var isCheck = cl.contains('uec-check') || cl.contains('ucard-v2-check') ||
                        cl.contains('ucard-thumb-check') || cl.contains('ua-check');
          if (!isCheck && e.target.closest) {
            isCheck = !!e.target.closest('.uec-check, .ucard-v2-check, .ucard-thumb-check, .ua-check');
          }
          if (isCheck) setTimeout(window.refreshFabDeleteState, 30);
        });
      }
      window.refreshFabDeleteState();
    }, 60);
  };

  function _fabDelFindSelected() {
    var cfg = window._fabDeleteConfig;
    if (!cfg || !cfg.cardSel) return [];
    // Pattern 1: .cardSel.selected
    var direct = document.querySelectorAll(cfg.cardSel + '.selected');
    if (direct.length) return direct;
    // Pattern 2: .cardSel contine .ucard-thumb-check.checked (old .ucard)
    var all = document.querySelectorAll(cfg.cardSel);
    var result = [];
    all.forEach(function (c) {
      if (c.querySelector('.ucard-thumb-check.checked')) result.push(c);
    });
    return result;
  }

  window.refreshFabDeleteState = function () {
    var cfg = window._fabDeleteConfig;
    if (!cfg) return;
    var items = document.querySelectorAll('#fab-actions-menu .fab-action');
    var target = null;
    items.forEach(function (item) {
      var t = item.textContent.toLowerCase();
      if (t.indexOf('\u0219terge') !== -1 || t.indexOf('sterge') !== -1) target = item;
    });
    if (!target) return;
    var sel = _fabDelFindSelected();
    var n = sel.length;
    var labelText = cfg.labelText || ('Sterge ' + (cfg.entityLabel || 'element'));
    target.innerHTML = '<span style="font-size:17px;">\uD83D\uDDD1</span> ' + labelText +
      (n ? ' <span style="background:#DC2626;color:#fff;padding:1px 8px;border-radius:100px;font-size:11px;font-weight:800;margin-left:4px;">' + n + '</span>' : '');
    if (n === 0) {
      target.style.opacity = '0.45';
      target.style.cursor = 'not-allowed';
      target.style.color = 'var(--brand-text-muted)';
    } else {
      target.style.opacity = '';
      target.style.cursor = '';
      target.style.color = '';
    }
  };

  window.tryFabDelete = function () {
    var cfg = window._fabDeleteConfig;
    if (!cfg) { if (typeof showToast === 'function') showToast('warning', 'Delete nu e configurat.'); return; }
    var sel = _fabDelFindSelected();
    if (!sel.length) {
      if (typeof showToast === 'function') {
        showToast('warning', 'Selecteaz\u0103 ' + (cfg.entityLabelPl || (cfg.entityLabel + 'e')) + ' din list\u0103 (bif\u0103 pe card).');
      }
      return;
    }
    window.openFabDeleteConfirm(sel);
  };

  window.openFabDeleteConfirm = function (selCards) {
    var cfg = window._fabDeleteConfig || {};
    var getName = cfg.getName || function (c) {
      // Incearca selectori comuni de nume din carduri
      var n = c.querySelector('.ucard-name, .uec-name, .ucard-v2-name, .ucard-arenda-name, [class*="name"], [class*="title"], strong, b, h3');
      return n ? n.textContent.trim() : null;
    };
    var nume = [];
    selCards.forEach(function (c) {
      var name = getName(c);
      nume.push(name || '(element)');
    });
    var n = selCards.length;
    var entS = cfg.entityLabel || 'element';
    var entP = cfg.entityLabelPl || (entS + 'e');

    var html = '';
    html += '<div style="padding:6px 0 10px;text-align:center;">';
    html += '<div style="width:72px;height:72px;border-radius:50%;background:rgba(220,38,38,0.12);color:#DC2626;display:flex;align-items:center;justify-content:center;font-size:34px;margin:0 auto 14px;">\u26A0</div>';
    html += '<div style="font-size:17px;font-weight:800;color:var(--brand-text-primary);margin-bottom:6px;">E\u0219ti sigur?</div>';
    html += '<div style="font-size:13px;color:var(--brand-text-muted);line-height:1.5;">Vei \u0219terge <strong style="color:#DC2626;">' + n + ' ' + (n === 1 ? entS : entP) + '</strong>. Ac\u021Biunea nu poate fi anulat\u0103.</div>';
    html += '</div>';
    // Lista
    html += '<div style="max-height:180px;overflow-y:auto;padding:10px;background:var(--brand-surface);border:1px solid var(--brand-border);border-radius:10px;margin:10px 0 12px;">';
    html += '<div style="font-size:10px;font-weight:800;color:var(--brand-text-muted);text-transform:uppercase;letter-spacing:0.4px;margin-bottom:6px;">Selectate</div>';
    nume.forEach(function (name, i) {
      var disp = name.length > 50 ? name.slice(0, 50) + '\u2026' : name;
      html += '<div style="display:flex;align-items:center;gap:8px;padding:6px 0;' + (i < nume.length - 1 ? 'border-bottom:1px solid #f0f0f0;' : '') + 'font-size:13px;color:var(--brand-text-primary);">';
      html += '<span style="color:#DC2626;">\u25CF</span><span>' + disp + '</span>';
      html += '</div>';
    });
    html += '</div>';
    // Confirmare prin tastare
    html += '<div style="padding:12px 14px;background:rgba(220,38,38,0.06);border:1.5px solid rgba(220,38,38,0.35);border-radius:10px;margin-bottom:8px;">';
    html += '<div style="font-size:12px;color:var(--brand-text-primary);margin-bottom:8px;line-height:1.4;">Pentru confirmare, scrie num\u0103rul: <strong style="color:#DC2626;font-size:16px;">' + n + '</strong></div>';
    html += '<input id="fab-del-input" type="text" inputmode="numeric" maxlength="4" autocomplete="off" placeholder="scrie ' + n + '" oninput="_fabDelCheck(' + n + ')" style="width:100%;padding:10px 12px;font-size:16px;font-weight:700;font-family:inherit;letter-spacing:2px;text-align:center;border:2px solid #DC2626;border-radius:8px;background:#fff;color:var(--brand-text-primary);outline:none;box-sizing:border-box;">';
    html += '</div>';

    openDrawer('Confirmare \u0219tergere', html, [
      { label: 'Nu, anuleaz\u0103', class: 'btn-secondary', action: closeDrawer },
      { label: 'Da, \u0219terge definitiv', class: 'btn-danger', action: function () {
          var inp = document.getElementById('fab-del-input');
          if (!inp || inp.value.trim() !== String(n)) {
            if (typeof showToast === 'function') showToast('error', 'Scrie num\u0103rul ' + n + ' pentru a confirma.');
            if (inp) inp.focus();
            return;
          }
          selCards.forEach(function (c) { c.remove(); });
          closeDrawer();
          window.refreshFabDeleteState();
          if (typeof showToast === 'function') {
            showToast('success', n + ' ' + (n === 1 ? entS + ' \u0219ters' : entP + ' \u0219terse') + '.');
          }
      } }
    ]);
    setTimeout(function () {
      _fabDelCheck(n);
      var inp = document.getElementById('fab-del-input');
      if (inp) inp.focus();
    }, 50);
  };

  window._fabDelCheck = function (expected) {
    var inp = document.getElementById('fab-del-input');
    var btns = document.querySelectorAll('.btn-danger');
    var btn = btns.length ? btns[btns.length - 1] : null;
    if (!inp || !btn) return;
    var val = (inp.value || '').trim();
    var ok = (val === String(expected));
    if (ok) {
      btn.style.opacity = '';
      btn.style.cursor = '';
      btn.disabled = false;
      inp.style.borderColor = 'var(--brand-success)';
      inp.style.background = 'rgba(40,202,65,0.06)';
    } else {
      btn.style.opacity = '0.45';
      btn.style.cursor = 'not-allowed';
      btn.disabled = true;
      inp.style.borderColor = '#DC2626';
      inp.style.background = '#fff';
    }
  };

  // ===== DETAIL VIEW =====
  window.showDetail = function (detailEl) {
    if (detailEl) {
      detailEl.classList.add('active');
      detailEl.style.display = 'flex';
    }
  };

  window.hideDetail = function (detailEl) {
    if (detailEl) {
      detailEl.classList.remove('active');
      detailEl.style.display = 'none';
    }
  };
})();
