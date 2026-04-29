/**
 * ConnAgri — Shared Bars (Top bar, Burger menu, Bottom nav, Android bar)
 * Usage: add in phone-screen:
 *   <div id="app-topbar" data-title="Titlu Pagina"></div>
 *   ... content ...
 *   <div id="app-bottombar"></div>
 *   <script src="../bars.js"></script>
 */

(function () {
  var topbar = document.getElementById('app-topbar');
  var bottombar = document.getElementById('app-bottombar');
  if (!bottombar) return;

  var title = topbar ? (topbar.getAttribute('data-title') || 'ConnAgri') : 'ConnAgri';
  var isLogo = topbar ? topbar.getAttribute('data-logo') === 'true' : false;
  var backUrl = topbar ? topbar.getAttribute('data-back') : null;
  var titleHTML = isLogo
    ? '<div style="display:flex; align-items:center; gap:2px; color:#fff; font-size:16px; font-weight:700; letter-spacing:3px;">CONN<span style="display:inline-flex; align-items:center; justify-content:center; width:22px; height:22px; background:#fff; color:var(--brand-primary); font-weight:900; font-size:15px; border-radius:3px; margin:0 1px;">N</span>AGRI</div>'
    : '<div style="font-size:18px; font-weight:600; color:#fff;">' + title + '</div>';
  var leftBtn = backUrl
    ? '<a href="' + backUrl + '" style="width:32px; height:32px; display:flex; align-items:center; justify-content:center; color:#fff; font-size:21px; text-decoration:none;"><i data-lucide="chevron-left"></i></a>'
    : isLogo
      ? '<div style="background:#F57C00; color:#1a1a1a; font-size:13px; font-weight:700; padding:6px 14px; border-radius:8px; cursor:pointer; letter-spacing:0.5px;">INF</div>'
      : '<a href="newdash.html" style="width:32px; height:32px; display:flex; align-items:center; justify-content:center; cursor:pointer; color:#fff; font-size:19px; text-decoration:none;"><i data-lucide="home"></i></a>';

  // ===== TOP BAR =====
  if (topbar) topbar.outerHTML = `
    <div class="app-topbar" style="background:var(--brand-primary); display:flex; align-items:center; justify-content:space-between; padding:7px 16px; flex-shrink:0;">
      ${leftBtn}
      ${titleHTML}
      <div onclick="toggleBurgerMenu()" style="width:32px; height:32px; display:flex; align-items:center; justify-content:center; cursor:pointer; color:#fff; font-size:19px;"><i data-lucide="circle-user-round"></i></div>
    </div>`;

  // ===== BOTTOM BAR (FAB + nav + overlays) — copied from OLDAPP =====
  bottombar.outerHTML = `
    <!-- FAB Shortcuts Overlay -->
    <div id="fab-overlay" style="display:none; position:absolute; bottom:0; left:0; right:0; top:0; z-index:50;">
      <div onclick="toggleFab()" style="position:absolute; inset:0; background:rgba(0,0,0,0.4);"></div>
      <div style="position:absolute; bottom:125px; left:50%; transform:translateX(-50%); display:flex; gap:16px;">
        <div style="display:flex; flex-direction:column; align-items:center; gap:4px; animation:fabPop 0.2s ease-out;">
          <div onclick="quickStocIntrare()" style="width:52px; height:52px; border-radius:50%; background:var(--brand-primary); color:#fff; display:flex; align-items:center; justify-content:center; font-size:23px; box-shadow:0 4px 12px rgba(0,0,0,0.2); cursor:pointer;"><i data-lucide="package"></i></div>
          <span style="font-size:13px; color:#fff; font-weight:600; text-align:center; line-height:1.3;">Intrare<br>stoc</span>
        </div>
        <div style="display:flex; flex-direction:column; align-items:center; gap:4px; animation:fabPop 0.25s ease-out;">
          <div onclick="quickEvaluare()" style="width:52px; height:52px; border-radius:50%; background:#E6853D; color:#fff; display:flex; align-items:center; justify-content:center; font-size:23px; box-shadow:0 4px 12px rgba(0,0,0,0.2); cursor:pointer;"><i data-lucide="search"></i></div>
          <span style="font-size:13px; color:#fff; font-weight:600; text-align:center; line-height:1.3;">Evaluare<br>cultura</span>
        </div>
        <div style="display:flex; flex-direction:column; align-items:center; gap:4px; animation:fabPop 0.3s ease-out;">
          <div onclick="quickLucrare()" style="width:52px; height:52px; border-radius:50%; background:var(--brand-primary); color:#fff; display:flex; align-items:center; justify-content:center; font-size:23px; box-shadow:0 4px 12px rgba(0,0,0,0.2); cursor:pointer;"><i data-lucide="wheat"></i></div>
          <span style="font-size:13px; color:#fff; font-weight:600; text-align:center; line-height:1.3;">Lucrare<br>agricola</span>
        </div>
        <div style="display:flex; flex-direction:column; align-items:center; gap:4px; animation:fabPop 0.35s ease-out;">
          <div onclick="quickArendaPickup()" style="width:52px; height:52px; border-radius:50%; background:var(--brand-primary); color:#fff; display:flex; align-items:center; justify-content:center; font-size:23px; box-shadow:0 4px 12px rgba(0,0,0,0.2); cursor:pointer;"><i data-lucide="file-text"></i></div>
          <span style="font-size:13px; color:#fff; font-weight:600; text-align:center; line-height:1.3;">Ridicare<br>arenda</span>
        </div>
        <div style="display:flex; flex-direction:column; align-items:center; gap:4px; animation:fabPop 0.4s ease-out;">
          <div onclick="quickAlimentare()" style="width:52px; height:52px; border-radius:50%; background:var(--brand-primary); color:#fff; display:flex; align-items:center; justify-content:center; font-size:23px; box-shadow:0 4px 12px rgba(0,0,0,0.2); cursor:pointer;"><i data-lucide="fuel"></i></div>
          <span style="font-size:13px; color:#fff; font-weight:600; text-align:center; line-height:1.3;">Alimentare<br>utilaj</span>
        </div>
      </div>
    </div>

    <!-- Custom Picker Drawer -->
    <div id="custom-picker" style="display:none; position:absolute; bottom:0; left:0; right:0; top:0; z-index:60;">
      <div onclick="closeCustomPicker()" style="position:absolute; inset:0; background:rgba(0,0,0,0.5);"></div>
      <div style="position:absolute; bottom:0; left:0; right:0; background:#fff; border-radius:16px 16px 0 0; padding:0 0 56px; animation:slideUp 0.25s ease-out;">
        <div style="display:flex; align-items:center; justify-content:space-between; padding:16px 20px 12px;">
          <div style="font-size:17px; font-weight:700; color:var(--brand-text-primary);">Alege Shortcut</div>
          <div onclick="closeCustomPicker()" style="width:28px; height:28px; border-radius:50%; background:#f0f0f0; display:flex; align-items:center; justify-content:center; cursor:pointer; font-size:15px; color:#888;">&times;</div>
        </div>
        <div style="height:1px; background:var(--brand-border);"></div>
        <div style="max-height:350px; overflow-y:auto;">
          <div class="picker-item" onclick="closeCustomPicker();toggleFab();openQuickNote();" style="display:flex; align-items:center; gap:12px; padding:18px 20px; cursor:pointer; border-bottom:1px solid #f0f0f0;">
            <span style="font-size:21px;"><i data-lucide="file-pen"></i></span>
            <div><div style="font-size:15px; font-weight:500;">Notita noua</div><div style="font-size:13px; color:var(--brand-text-muted);">Memoreaza rapid o idee</div></div>
          </div>
          <div class="picker-item" onclick="closeCustomPicker();toggleFab();openQuickReport();" style="display:flex; align-items:center; gap:12px; padding:18px 20px; cursor:pointer; border-bottom:1px solid #f0f0f0;">
            <span style="font-size:21px;"><i data-lucide="clipboard-list"></i></span>
            <div><div style="font-size:15px; font-weight:500;">Cere raport de la echipa</div><div style="font-size:13px; color:var(--brand-text-muted);">Solicita update sau status</div></div>
          </div>
          <div class="picker-item" onclick="closeCustomPicker();toggleFab();openQuickReminder();" style="display:flex; align-items:center; gap:12px; padding:18px 20px; cursor:pointer; border-bottom:1px solid #f0f0f0;">
            <span style="font-size:21px;"><i data-lucide="alarm-clock"></i></span>
            <div><div style="font-size:15px; font-weight:500;">Reminder</div><div style="font-size:13px; color:var(--brand-text-muted);">Programeaza o notificare</div></div>
          </div>
          <div class="picker-item" onclick="closeCustomPicker();toggleFab();openQuickSOS();" style="display:flex; align-items:center; gap:12px; padding:18px 20px; cursor:pointer;">
            <span style="font-size:21px;"><i data-lucide="alert-octagon"></i></span>
            <div><div style="font-size:15px; font-weight:500;">SOS / Urgenta</div><div style="font-size:13px; color:var(--brand-text-muted);">Alerteaza toata echipa</div></div>
          </div>
        </div>
      </div>
    </div>

    <!-- Left Menu Overlay -->
    <div id="left-menu-overlay" style="display:none; position:absolute; top:0; left:0; right:0; bottom:0; z-index:55;">
      <div onclick="toggleLeftMenu()" style="position:absolute; inset:0; background:rgba(0,0,0,0.4);"></div>
      <div style="position:absolute; top:0; left:0; width:260px; height:100%; background:#fff; box-shadow:4px 0 20px rgba(0,0,0,0.15); display:flex; flex-direction:column; overflow-y:auto; scrollbar-width:none; -ms-overflow-style:none;">
        <div style="padding:28px 16px 8px; background:var(--brand-primary);">
          <div style="font-size:13px; color:rgba(255,255,255,0.7);">ConnAgri &middot; Navigare rapida</div>
        </div>
        <div style="padding:6px 0 0;"><div style="padding:2px 14px; font-size:11px; font-weight:700; color:var(--brand-text-muted); text-transform:uppercase; letter-spacing:0.5px;">Principal</div>
          <a href="newdash.html" style="display:flex; align-items:center; gap:10px; padding:8px 14px; text-decoration:none; color:var(--brand-text-primary); font-size:13px;"><span style="font-size:20px; width:20px; height:20px; display:flex; align-items:center; justify-content:center; flex-shrink:0;"><i data-lucide="bar-chart-2"></i></span> Dash Admin</a>
          <a href="dash_ops.html" style="display:flex; align-items:center; gap:10px; padding:8px 14px; text-decoration:none; color:var(--brand-text-primary); font-size:13px;"><span style="font-size:20px; width:20px; height:20px; display:flex; align-items:center; justify-content:center; flex-shrink:0;"><i data-lucide="flame"></i></span> Dash Ops</a>
          <a href="operator.html" style="display:flex; align-items:center; gap:10px; padding:8px 14px; text-decoration:none; color:var(--brand-text-primary); font-size:13px;"><span style="font-size:20px; width:20px; height:20px; display:flex; align-items:center; justify-content:center; flex-shrink:0;"><i data-lucide="wrench"></i></span> Ecran operator</a>
          <a href="firme.html" style="display:flex; align-items:center; gap:10px; padding:8px 14px; text-decoration:none; color:var(--brand-text-primary); font-size:13px;"><span style="font-size:20px; width:20px; height:20px; display:flex; align-items:center; justify-content:center; flex-shrink:0;"><i data-lucide="settings"></i></span> Configurare firme</a>
        </div>
        <div style="height:1px; background:var(--brand-border); margin:4px 14px;"></div>
        <div style="padding:2px 0 0;"><div style="padding:2px 14px; font-size:11px; font-weight:700; color:var(--brand-text-muted); text-transform:uppercase; letter-spacing:0.5px;">Resurse</div>
          <a href="angajati.html" style="display:flex; align-items:center; gap:10px; padding:8px 14px; text-decoration:none; color:var(--brand-text-primary); font-size:13px;"><span style="font-size:20px; width:20px; height:20px; display:flex; align-items:center; justify-content:center; flex-shrink:0;"><i data-lucide="users"></i></span> Echipa</a>
          <a href="stocuri.html" style="display:flex; align-items:center; gap:10px; padding:8px 14px; text-decoration:none; color:var(--brand-text-primary); font-size:13px;"><span style="font-size:20px; width:20px; height:20px; display:flex; align-items:center; justify-content:center; flex-shrink:0;"><i data-lucide="package"></i></span> Stocuri</a>
          <a href="utilaje.html" style="display:flex; align-items:center; gap:10px; padding:8px 14px; text-decoration:none; color:var(--brand-text-primary); font-size:13px;"><span style="font-size:20px; width:20px; height:20px; display:flex; align-items:center; justify-content:center; flex-shrink:0;"><i data-lucide="tractor"></i></span> Utilaje</a>
          <a href="terenuri.html" style="display:flex; align-items:center; gap:10px; padding:8px 14px; text-decoration:none; color:var(--brand-text-primary); font-size:13px;"><span style="font-size:20px; width:20px; height:20px; display:flex; align-items:center; justify-content:center; flex-shrink:0;"><i data-lucide="sprout"></i></span> Terenuri lista</a>
          <a href="harta-terenuri.html" style="display:flex; align-items:center; gap:10px; padding:8px 14px; text-decoration:none; color:var(--brand-text-primary); font-size:13px;"><span style="font-size:20px; width:20px; height:20px; display:flex; align-items:center; justify-content:center; flex-shrink:0;"><i data-lucide="globe"></i></span> Harta Terenuri</a>
        </div>
        <div style="height:1px; background:var(--brand-border); margin:4px 14px;"></div>
        <div style="padding:2px 0 0;"><div style="padding:2px 14px; font-size:11px; font-weight:700; color:var(--brand-text-muted); text-transform:uppercase; letter-spacing:0.5px;">Organizare</div>
          <a href="agenda.html" style="display:flex; align-items:center; gap:10px; padding:8px 14px; text-decoration:none; color:var(--brand-text-primary); font-size:13px;"><span style="font-size:20px; width:20px; height:20px; display:flex; align-items:center; justify-content:center; flex-shrink:0;"><i data-lucide="wheat"></i></span> Jurnal de c&acirc;mp</a>
          <a href="arenda.html" style="display:flex; align-items:center; gap:10px; padding:8px 14px; text-decoration:none; color:var(--brand-text-primary); font-size:13px;"><span style="font-size:20px; width:20px; height:20px; display:flex; align-items:center; justify-content:center; flex-shrink:0;"><i data-lucide="file-text"></i></span> Arenda</a>
        </div>
        <div style="height:1px; background:var(--brand-border); margin:4px 14px;"></div>
        <div style="padding:2px 0 8px;"><div style="padding:2px 14px; font-size:11px; font-weight:700; color:var(--brand-text-muted); text-transform:uppercase; letter-spacing:0.5px;">Media</div>
          <a href="mesagerie.html" style="display:flex; align-items:center; gap:10px; padding:8px 14px; text-decoration:none; color:var(--brand-text-primary); font-size:13px;"><span style="font-size:20px; width:20px; height:20px; display:flex; align-items:center; justify-content:center; flex-shrink:0;"><i data-lucide="message-circle"></i></span> Mesagerie <span style="margin-left:auto; min-width:18px; height:18px; border-radius:9px; background:var(--brand-danger); color:#fff; font-size:12px; font-weight:700; display:flex; align-items:center; justify-content:center; padding:0 5px;">3</span></a>
          <a href="fotografii.html" style="display:flex; align-items:center; gap:10px; padding:8px 14px; text-decoration:none; color:var(--brand-text-primary); font-size:13px;"><span style="font-size:20px; width:20px; height:20px; display:flex; align-items:center; justify-content:center; flex-shrink:0;"><i data-lucide="camera"></i></span> Galerie foto</a>
        </div>
      </div>
    </div>

    <!-- Shortcuts Toggle (visible only when bar is closed) -->
    <div class="shortcuts-toggle" id="shortcuts-toggle" style="display:flex;" onclick="event.stopPropagation(); toggleShortcuts();">
      <span class="chevron" id="shortcuts-chevron"><i data-lucide="chevron-up"></i></span>
      <span class="trigger-label">Navigare rapida</span>
    </div>

    <!-- Bottom Navigation (hidden by default) -->
    <div class="phone-bottom-nav" style="background:#fff; border-top:1px solid var(--brand-border); display:none; align-items:flex-end; padding:10px 0 12px; position:relative; z-index:51;">
      <!-- Pin button -->
      <div id="pin-btn" onclick="togglePin(event)" style="position:absolute; top:-12px; left:8px; width:24px; height:24px; border-radius:50%; display:flex; align-items:center; justify-content:center; cursor:pointer; font-size:13px; z-index:52;" title="Fixeaza bara"><i data-lucide="pin"></i></div>
      <div onclick="toggleLeftMenu()" style="flex:1; text-align:center; padding:6px 0; font-size:13px; color:var(--brand-text-muted); cursor:pointer;">
        <div style="font-size:19px; margin-bottom:2px;"><i data-lucide="menu"></i></div>Meniu
      </div>
      <div onclick="openTaskAlert()" style="flex:1; text-align:center; padding:6px 0; font-size:13px; color:var(--brand-text-muted); cursor:pointer;">
        <div style="font-size:19px; margin-bottom:2px;"><i data-lucide="bell"></i></div>Planifica
      </div>
      <div style="flex:1; display:flex; justify-content:center; position:relative;">
        <div id="fab-btn" onclick="toggleFab()" style="width:52px; height:52px; border-radius:50%; background:#fff; color:var(--brand-primary); border:2px solid var(--brand-primary); display:flex; align-items:center; justify-content:center; font-size:23px; font-weight:700; box-shadow:0 2px 8px rgba(0,104,106,0.2); cursor:pointer; position:absolute; bottom:4px; transition:transform 0.3s ease;"><i data-lucide="zap"></i></div>
      </div>
      <a href="mesaje.html" style="flex:1; text-align:center; padding:6px 0; font-size:13px; color:var(--brand-text-muted); cursor:pointer; text-decoration:none; position:relative;">
        <div style="font-size:19px; margin-bottom:2px;"><i data-lucide="message-circle"></i></div>Mesaje
        <span style="position:absolute; top:2px; right:calc(50% - 24px); min-width:16px; height:16px; border-radius:8px; background:var(--brand-danger); color:#fff; font-size:13px; font-weight:700; display:flex; align-items:center; justify-content:center; padding:0 4px;">4</span>
      </a>
      <div onclick="openCameraPopup()" style="flex:1; text-align:center; padding:6px 0; font-size:13px; color:var(--brand-text-muted); cursor:pointer;">
        <div style="font-size:19px; margin-bottom:2px;"><i data-lucide="camera"></i></div>Camera
      </div>
    </div>
    `;

  // ===== JavaScript functions =====
  window.fabOpen = false;
  window.toggleFab = function() {
    window.fabOpen = !window.fabOpen;
    document.getElementById('fab-overlay').style.display = window.fabOpen ? 'block' : 'none';
    document.getElementById('fab-btn').style.transform = window.fabOpen ? 'rotate(45deg)' : 'rotate(0deg)';
    updateFabPosition();
  };

  window.toggleBurgerMenu = function () {
    window.location.href = 'my-profile.html';
  };

  window.menuOpen = false;
  window.toggleMenu = function() {
    window.menuOpen = !window.menuOpen;
    document.getElementById('menu-overlay').style.display = window.menuOpen ? 'block' : 'none';
  };

  window.openCustomPicker = function(e) {
    e.stopPropagation();
    document.getElementById('custom-picker').style.display = 'block';
  };
  window.closeCustomPicker = function() {
    document.getElementById('custom-picker').style.display = 'none';
  };
  window.selectCustom = function(el) {
    var name = el.querySelector('div > div:first-child').textContent;
    alert('Shortcut selectat: ' + name);
    window.closeCustomPicker();
    window.toggleFab();
  };

  window.leftMenuOpen = false;
  window.toggleLeftMenu = function() {
    window.leftMenuOpen = !window.leftMenuOpen;
    document.getElementById('left-menu-overlay').style.display = window.leftMenuOpen ? 'block' : 'none';
  };

  window.shortcutsPinned = localStorage.getItem('connagri-shortcuts-pinned') === 'true';
  window.shortcutsVisible = window.shortcutsPinned;

  if (window.shortcutsPinned) {
    var navInit = document.querySelector('.phone-bottom-nav');
    var toggleInit = document.getElementById('shortcuts-toggle');
    var pinInit = document.getElementById('pin-btn');
    if (navInit) navInit.style.display = 'flex';
    if (toggleInit) toggleInit.classList.add('hidden');
    if (pinInit) {
      pinInit.classList.add('pinned');
      var pinIcon = pinInit.querySelector('i[data-lucide]');
      if (pinIcon) { pinIcon.setAttribute('data-lucide', 'pin-off'); lucide.createIcons({ nodes: [pinIcon] }); }
    }
    var addInit = document.getElementById('add-btn');
    if (addInit) addInit.style.bottom = '140px';
    var addMenuInit = document.getElementById('add-menu');
    if (addMenuInit) addMenuInit.style.bottom = '200px';
    setTimeout(updateFabPosition, 200);
  }
  // Always update FAB on load
  setTimeout(updateFabPosition, 300);

  function updateFabPosition() {
    var fab = document.querySelector('.fab');
    var viewTabs = document.querySelector('.view-tabs');
    var toggle = document.getElementById('shortcuts-toggle');
    var nav = document.querySelector('.phone-bottom-nav');
    var navOpen = nav && nav.style.display === 'flex';
    var navHeight = 0;
    if (toggle && !toggle.classList.contains('hidden')) navHeight += toggle.offsetHeight;
    if (navOpen) navHeight += nav.offsetHeight;

    // View-tabs (daca exista si sunt vizibile) stau exact deasupra autohide nav
    var tabsHeight = 0;
    if (viewTabs) {
      var tabsVisible = (viewTabs.style.display !== 'none') && !!viewTabs.offsetParent;
      if (tabsVisible) {
        viewTabs.style.bottom = navHeight + 'px';
        tabsHeight = viewTabs.offsetHeight || 44;
      }
    }

    if (fab) {
      fab.style.display = 'flex';
      // FAB la 15px deasupra taburilor (sau 10px direct deasupra nav daca nu sunt taburi)
      fab.style.bottom = (navHeight + (tabsHeight ? tabsHeight + 15 : 10)) + 'px';
      // Hide FAB only when FAB overlay shortcuts (from bottom nav) are showing
      var fabOverlay = document.getElementById('fab-overlay');
      if (fabOverlay && fabOverlay.style.display === 'block') fab.style.display = 'none';
    }

    // Move fab actions menu above FAB
    var fabMenu = document.getElementById('fab-actions-menu') || document.getElementById('map-actions');
    if (fabMenu) fabMenu.style.bottom = (navHeight + (tabsHeight ? tabsHeight + 75 : 70)) + 'px';
  }
  // Expose pentru modulele care vor sa forteze un refresh (ex: dupa show/hide tabs)
  window.updateFabPosition = updateFabPosition;

  window.toggleShortcuts = function() {
    window.shortcutsVisible = !window.shortcutsVisible;
    var nav = document.querySelector('.phone-bottom-nav');
    var toggle = document.getElementById('shortcuts-toggle');
    if (nav) nav.style.display = window.shortcutsVisible ? 'flex' : 'none';
    if (toggle) {
      if (window.shortcutsVisible) toggle.classList.add('hidden');
      else toggle.classList.remove('hidden');
    }
    var addBtn = document.getElementById('add-btn');
    if (addBtn) addBtn.style.bottom = window.shortcutsVisible ? '140px' : '80px';
    var addMenu = document.getElementById('add-menu');
    if (addMenu) addMenu.style.bottom = window.shortcutsVisible ? '200px' : '140px';
    updateFabPosition();
  };

  window.togglePin = function(e) {
    e.stopPropagation();
    window.shortcutsPinned = !window.shortcutsPinned;
    localStorage.setItem('connagri-shortcuts-pinned', window.shortcutsPinned);
    var pinBtn = document.getElementById('pin-btn');
    if (pinBtn) {
      pinBtn.classList.toggle('pinned', window.shortcutsPinned);
      pinBtn.title = window.shortcutsPinned ? 'Deblocheaza bara' : 'Fixeaza bara';
      var icon = pinBtn.querySelector('i[data-lucide]');
      if (icon) {
        icon.setAttribute('data-lucide', window.shortcutsPinned ? 'pin-off' : 'pin');
        lucide.createIcons({ nodes: [icon] });
      }
    }
  };

  // Auto-close shortcuts when clicking outside (only if not pinned, FAB/picker not active)
  document.addEventListener('click', function(e) {
    if (!window.shortcutsVisible) return;
    if (window.shortcutsPinned) return;
    if (window.fabOpen) return;
    var customPicker = document.getElementById('custom-picker');
    if (customPicker && customPicker.style.display === 'block') return;
    var nav = document.querySelector('.phone-bottom-nav');
    var toggle = document.getElementById('shortcuts-toggle');
    if (nav && !nav.contains(e.target)) {
      window.shortcutsVisible = false;
      nav.style.display = 'none';
      if (toggle) toggle.classList.remove('hidden');
      var addBtn2 = document.getElementById('add-btn');
      if (addBtn2) addBtn2.style.bottom = '80px';
      var addMenu2 = document.getElementById('add-menu');
      if (addMenu2) addMenu2.style.bottom = '140px';
      updateFabPosition();
    }
  });

  // ===== TEXT SIZE (3 pasi: -2 / 0 / +2) =====
  // Adauga un offset la font-size-ul continutului, EXCEPT meniuri/bare/chrome.
  var TEXT_SIZE_OFFSET = 0; // -2, 0 sau +2
  var SKIP_TAGS = { SCRIPT: 1, STYLE: 1, LINK: 1, META: 1, HEAD: 1, BR: 1 };
  // Zonele excluse: topbar, toolbar, summary-bar, bottom bar/nav, taburi
  var SKIP_SELECTORS = '.app-topbar, .toolbar, .summary-bar, .phone-bottom-nav, .shortcuts-toggle, .view-tabs, .detail-tabs, .msg-tabs, #left-menu-overlay, #burger-menu';

  function applyBump(el) {
    if (!el || el.nodeType !== 1 || SKIP_TAGS[el.tagName]) return;
    if (el.dataset.cfsApplied === '1') return;
    if (el.closest && el.closest(SKIP_SELECTORS)) return;
    var cs = window.getComputedStyle(el).fontSize;
    var px = parseFloat(cs);
    if (isNaN(px) || px <= 0) return;
    var newSize = px + TEXT_SIZE_OFFSET;
    if (newSize < 8) newSize = 8; // prag minim de siguranta
    el.dataset.cfsInline = el.style.fontSize || '';
    el.dataset.cfsApplied = '1';
    el.style.setProperty('font-size', newSize + 'px', 'important');
  }

  function removeBump(el) {
    if (!el || el.nodeType !== 1 || el.dataset.cfsApplied !== '1') return;
    var orig = el.dataset.cfsInline || '';
    el.style.removeProperty('font-size');
    if (orig) el.style.fontSize = orig;
    delete el.dataset.cfsApplied;
    delete el.dataset.cfsInline;
  }

  // Walk bottom-up ca sa evitam dubla-aplicare prin mostenire
  function walkTextSize(turnOn) {
    var all = Array.prototype.slice.call(document.body.querySelectorAll('*'));
    if (turnOn) {
      for (var i = all.length - 1; i >= 0; i--) applyBump(all[i]);
      applyBump(document.body);
    } else {
      removeBump(document.body);
      for (var j = 0; j < all.length; j++) removeBump(all[j]);
    }
  }

  // Re-walk: proceseaza orice element nou care inca nu a primit bump (idempotent)
  function reWalkTextSize() {
    if (TEXT_SIZE_OFFSET === 0) return;
    var all = Array.prototype.slice.call(document.body.querySelectorAll('*'));
    for (var i = all.length - 1; i >= 0; i--) applyBump(all[i]);
    applyBump(document.body);
  }
  window.reWalkTextSize = reWalkTextSize;

  // Observer pentru continut adaugat dinamic (buildCard, drawer, toast, burger)
  var textSizeObserver = null;
  function ensureTextSizeObserver() {
    if (textSizeObserver) return;
    textSizeObserver = new MutationObserver(function (mutations) {
      if (TEXT_SIZE_OFFSET === 0) return;
      mutations.forEach(function (m) {
        m.addedNodes.forEach(function (node) {
          if (node.nodeType !== 1) return;
          var sub = Array.prototype.slice.call(node.querySelectorAll('*'));
          for (var i = sub.length - 1; i >= 0; i--) applyBump(sub[i]);
          applyBump(node);
        });
      });
    });
    textSizeObserver.observe(document.body, { childList: true, subtree: true });
  }

  function updateTextSizeButtons(offset) {
    var btns = [
      { id: 'ts-small', val: -2 },
      { id: 'ts-normal', val: 0 },
      { id: 'ts-large', val: 2 }
    ];
    btns.forEach(function (b) {
      var el = document.getElementById(b.id);
      if (!el) return;
      var active = (b.val === offset);
      el.style.background = active ? 'var(--brand-primary)' : '#fff';
      el.style.color = active ? '#fff' : 'var(--brand-text-primary)';
    });
  }

  window.setTextSize = function (offset) {
    // Curata bump-urile existente
    walkTextSize(false);
    TEXT_SIZE_OFFSET = offset;
    if (offset !== 0) {
      walkTextSize(true);
      ensureTextSizeObserver();
      setTimeout(reWalkTextSize, 100);
      setTimeout(reWalkTextSize, 500);
    }
    localStorage.setItem('connagri-text-size', String(offset));
    updateTextSizeButtons(offset);
  };

  // Backward-compat: toggleLargeMode cicleaza intre -2 / 0 / +2
  window.toggleLargeMode = function () {
    var next = TEXT_SIZE_OFFSET === 0 ? 2 : (TEXT_SIZE_OFFSET === 2 ? -2 : 0);
    window.setTextSize(next);
  };

  window.toggleDarkMode = function () {
    var isDark = document.body.classList.toggle('dark-mode');
    localStorage.setItem('connagri-dark-mode', isDark);
    var t = document.getElementById('dark-toggle'), k = document.getElementById('dark-knob');
    if (t && k) { t.style.background = isDark ? 'var(--brand-primary)' : '#ccc'; k.style.left = isDark ? '20px' : '2px'; }
  };

  // Restore la load (amanat ca modulele sa insereze cardurile intai)
  var savedTextSize = localStorage.getItem('connagri-text-size');
  if (savedTextSize === null && localStorage.getItem('connagri-large-mode') === 'true') {
    savedTextSize = '2'; // migreaza din vechiul setting
  }
  var savedOffset = parseInt(savedTextSize, 10);
  if (isNaN(savedOffset)) savedOffset = 0;
  TEXT_SIZE_OFFSET = savedOffset;
  setTimeout(function () {
    if (savedOffset !== 0) {
      walkTextSize(true);
      ensureTextSizeObserver();
    }
    updateTextSizeButtons(savedOffset);
  }, 50);
  if (savedOffset !== 0) {
    setTimeout(reWalkTextSize, 300);
    setTimeout(reWalkTextSize, 800);
    if (document.readyState !== 'complete') {
      window.addEventListener('load', function () { setTimeout(reWalkTextSize, 100); });
    }
  }
  if (localStorage.getItem('connagri-dark-mode') === 'true') {
    document.body.classList.add('dark-mode');
    var dt = document.getElementById('dark-toggle'), dk = document.getElementById('dark-knob');
    if (dt && dk) { dt.style.background = 'var(--brand-primary)'; dk.style.left = '20px'; }
  }

  // ===== QUICK ACTIONS (FAB shortcuts + bottom bar Task nou) =====
  function qf(fields) { return typeof buildForm === 'function' ? buildForm(fields) : ''; }
  function qdrawer(title, fields, okLabel, toastMsg) {
    if (typeof openDrawer !== 'function') return;
    openDrawer(title, qf(fields), [
      { label: 'Anuleaza', class: 'btn-secondary', action: closeDrawer },
      { label: okLabel || 'Salveaza', class: 'btn-primary', action: function(){ closeDrawer(); if (typeof showToast === 'function') showToast('success', toastMsg || 'Salvat.'); } }
    ]);
  }
  function closeFabSafe() { if (window.fabOpen) { window.fabOpen = false; var ov = document.getElementById('fab-overlay'); if (ov) ov.style.display = 'none'; var btn = document.getElementById('fab-btn'); if (btn) btn.style.transform = 'rotate(0deg)'; } }

  window.quickStocIntrare = function () {
    closeFabSafe();
    if (typeof openDrawer !== 'function') return;
    var html = '';
    // TABS: Manual / Automat
    html += '<div style="display:flex;gap:6px;margin-bottom:16px;padding:4px;background:var(--brand-surface);border-radius:12px;">';
    html += '<button type="button" id="stoc-tab-manual-btn" onclick="stocTab(\'manual\')" style="flex:1;padding:10px 12px;background:var(--brand-primary);color:#fff;border:none;border-radius:8px;font-size:14px;font-weight:700;cursor:pointer;font-family:inherit;"><i data-lucide="settings"></i> Manual</button>';
    html += '<button type="button" id="stoc-tab-automat-btn" onclick="stocTab(\'automat\')" style="flex:1;padding:10px 12px;background:transparent;color:var(--brand-text-muted);border:none;border-radius:8px;font-size:14px;font-weight:700;cursor:pointer;font-family:inherit;"><i data-lucide="camera"></i> Automat</button>';
    html += '</div>';

    // TAB AUTOMAT (ascuns initial)
    html += '<div id="stoc-tab-automat" style="display:none;">';
    html += '<div style="padding:20px;text-align:center;background:linear-gradient(135deg,var(--brand-hover-bg),#fff);border:2px dashed var(--brand-primary);border-radius:12px;margin-bottom:14px;">';
    html += '<div style="font-size:44px;margin-bottom:10px;"><i data-lucide="camera"></i></div>';
    html += '<div style="font-size:15px;font-weight:700;color:var(--brand-text-primary);margin-bottom:6px;">Fa o poza la factura / aviz</div>';
    html += '<div style="font-size:13px;color:var(--brand-text-muted);margin-bottom:14px;line-height:1.4;">Datele se extrag automat<br>(produs, cantitate, pret, furnizor...)</div>';
    html += '<button type="button" onclick="scanInvoice()" style="width:100%;padding:14px;background:var(--brand-primary);color:#fff;border:none;border-radius:10px;font-size:15px;font-weight:800;cursor:pointer;display:flex;align-items:center;justify-content:center;gap:10px;font-family:inherit;box-shadow:0 2px 8px rgba(0,104,106,0.25);">';
    html += '<span style="font-size:20px;"><i data-lucide="camera"></i></span> Deschide camera';
    html += '</button>';
    html += '<div style="display:flex;align-items:center;gap:8px;margin:14px 0 8px;">';
    html += '<div style="flex:1;height:1px;background:var(--brand-border);"></div>';
    html += '<span style="font-size:11px;color:var(--brand-text-muted);font-weight:700;letter-spacing:0.5px;">SAU</span>';
    html += '<div style="flex:1;height:1px;background:var(--brand-border);"></div>';
    html += '</div>';
    html += '<button type="button" onclick="scanInvoice()" style="width:100%;padding:12px;background:#fff;color:var(--brand-primary);border:2px solid var(--brand-primary);border-radius:10px;font-size:14px;font-weight:700;cursor:pointer;display:flex;align-items:center;justify-content:center;gap:8px;font-family:inherit;">';
    html += '<span style="font-size:18px;"><i data-lucide="paperclip"></i></span> Incarca din galerie (PDF/foto)';
    html += '</button>';
    html += '</div>';
    html += '<div style="font-size:12px;color:var(--brand-text-muted);padding:10px 14px;background:var(--brand-warning-bg);border-left:3px solid var(--brand-warning);border-radius:6px;line-height:1.45;">';
    html += '<strong>Atentie:</strong> Dupa scanare, verifica datele extrase inainte de a inregistra.';
    html += '</div>';
    html += '</div>';

    // TAB MANUAL (visible initial)
    html += '<div id="stoc-tab-manual">';
    // 1. Denumire produs (search 3+ litere, auto-completare din DB)
    html += '<div class="form-group"><label class="form-label">Denumire produs *</label>';
    html += '<div style="position:relative;">';
    html += '<input id="stoc-nume" class="form-input" placeholder="Scrie min. 3 litere..." oninput="stocNameSearch(this.value)" autocomplete="off">';
    html += '<div id="stoc-results" style="display:none;position:absolute;top:100%;left:0;right:0;background:#fff;border:1px solid var(--brand-border);border-radius:8px;max-height:220px;overflow-y:auto;overflow-x:hidden;z-index:5;box-shadow:0 4px 14px rgba(0,0,0,0.12);margin-top:2px;"></div>';
    html += '</div></div>';
    // 2. Categorie
    html += '<div class="form-group"><label class="form-label">Categorie *</label>';
    html += '<select id="stoc-cat" class="form-select" onchange="stocCatChange(this.value)"><option value="">Selecteaza...</option><option>Seminte</option><option>Pesticide</option><option>Ingrasaminte</option><option>Combustibil</option><option>Adjuvanti</option><option>Piese schimb</option><option>Altele</option></select></div>';
    // 3. Tip (dropdown dinamic)
    html += '<div class="form-group"><label class="form-label">Tip</label>';
    html += '<select id="stoc-tip" class="form-select"><option value="">Selecteaza categorie mai intai...</option></select></div>';
    // 4. Cantitate + UM (split in 2 coloane)
    html += '<div style="display:flex;gap:8px;">';
    html += '<div class="form-group" style="flex:2;"><label class="form-label">Cantitate *</label><input id="stoc-cant" class="form-input" type="number" step="0.01" placeholder="ex: 500" oninput="stocRecalc()"></div>';
    html += '<div class="form-group" style="flex:1;"><label class="form-label">UM *</label><select id="stoc-um" class="form-select"><option>L</option><option>ml</option><option>kg</option><option>g</option><option>to</option><option>buc</option><option>saci</option><option>paleti</option><option>mc</option></select></div>';
    html += '</div>';
    // 5. Lot / Serie
    html += '<div class="form-group"><label class="form-label">Lot / Serie</label><input class="form-input" placeholder="ex: LOT2026-04-18-A"></div>';
    // 6. Data expirare
    html += '<div class="form-group"><label class="form-label">Data expirare</label><input type="date" class="form-input"></div>';
    // 7. Pret cu toggle: total (default) / pe UM
    html += '<div class="form-group"><label class="form-label">Pret (fara TVA) <span id="stoc-pret-hint" style="color:var(--brand-text-muted);font-weight:400;text-transform:none;font-size:12px;margin-left:4px;">&mdash; total</span></label>';
    html += '<div style="display:flex;gap:6px;margin-bottom:6px;">';
    html += '<button type="button" id="stoc-pret-mode-total" onclick="setPretMode(\'total\')" style="flex:1;padding:8px;border:2px solid var(--brand-primary);background:var(--brand-hover-bg);color:var(--brand-primary);border-radius:8px;cursor:pointer;font-size:13px;font-weight:700;font-family:inherit;">Total</button>';
    html += '<button type="button" id="stoc-pret-mode-um" onclick="setPretMode(\'um\')" style="flex:1;padding:8px;border:2px solid var(--brand-border);background:#fff;color:var(--brand-text-muted);border-radius:8px;cursor:pointer;font-size:13px;font-weight:700;font-family:inherit;">Pe UM</button>';
    html += '</div>';
    html += '<input id="stoc-pret" class="form-input" type="number" step="0.01" placeholder="ex: 12500.00" oninput="stocRecalc()">';
    html += '</div>';
    // 8. Valoare totala - auto-calculata
    html += '<div class="form-group"><label class="form-label">Valoare totala (fara TVA)</label><input id="stoc-total" class="form-input" readonly style="background:var(--brand-hover-bg);font-weight:700;color:var(--brand-primary);" value="0,00 RON"></div>';
    // 8. Locatie depozit
    html += '<div class="form-group"><label class="form-label">Locatie depozit</label><select class="form-select"><option value="">Selecteaza...</option><option>Depozit principal</option><option>Depozit ferma 1</option><option>Depozit ferma 2</option><option>Magazie utilaje</option><option>Magazie pesticide</option><option>Rezervor combustibil</option><option>Alt loc...</option></select></div>';
    // 9. Factura / Document
    html += '<div class="form-group"><label class="form-label">Factura / Document nr.</label><input class="form-input" placeholder="ex: FF 12345 / 18-04-2026"></div>';
    // 5. Furnizor cu search + buton + pentru adaugare nou
    html += '<div class="form-group"><label class="form-label">Furnizor</label>';
    html += '<div style="display:flex;gap:6px;">';
    html += '<div style="flex:1;position:relative;">';
    html += '<input id="stoc-furnizor" class="form-input" placeholder="Cauta sau lasa nedefinit..." oninput="furnizorSearch(this.value)" onfocus="furnizorSearch(this.value)" autocomplete="off">';
    html += '<div id="stoc-furnizor-results" style="display:none;position:absolute;top:100%;left:0;right:0;background:#fff;border:1px solid var(--brand-border);border-radius:8px;max-height:220px;overflow-y:auto;overflow-x:hidden;z-index:5;box-shadow:0 4px 14px rgba(0,0,0,0.12);margin-top:2px;"></div>';
    html += '</div>';
    html += '<button type="button" onclick="openAddFurnizor()" title="Adauga furnizor nou" style="min-height:48px;min-width:48px;padding:0;border:none;background:var(--brand-primary);color:#fff;border-radius:8px;cursor:pointer;font-size:24px;font-weight:700;line-height:1;">+</button>';
    html += '</div></div>';
    // 6. Observatii
    html += '<div class="form-group"><label class="form-label">Observatii</label><textarea class="form-textarea" placeholder="Note, chitanta..."></textarea></div>';
    html += '</div>'; // end tab-manual

    openDrawer('Intrare stoc (rapid)', html, [
      { label: 'Anuleaza', class: 'btn-secondary', action: closeDrawer },
      { label: 'Inregistreaza', class: 'btn-primary', action: function(){ closeDrawer(); if (typeof showToast === 'function') showToast('success', 'Intrare stoc inregistrata.'); } }
    ]);
  };

  // ===== PRODUSE DB + helpers (cu UM implicit per produs) =====
  var PRODUSE_DB = [
    { name: 'Adengo', cat: 'Pesticide', tip: 'Erbicid', um: 'L' },
    { name: 'Roundup', cat: 'Pesticide', tip: 'Erbicid', um: 'L' },
    { name: 'Gardoprim Plus', cat: 'Pesticide', tip: 'Erbicid', um: 'L' },
    { name: 'Lumax', cat: 'Pesticide', tip: 'Erbicid', um: 'L' },
    { name: 'Falcon Pro', cat: 'Pesticide', tip: 'Fungicid', um: 'L' },
    { name: 'Falcon Mix', cat: 'Pesticide', tip: 'Fungicid', um: 'L' },
    { name: 'Delaro', cat: 'Pesticide', tip: 'Fungicid', um: 'L' },
    { name: 'Biscaya', cat: 'Pesticide', tip: 'Insecticid', um: 'L' },
    { name: 'Decis Forte', cat: 'Pesticide', tip: 'Insecticid', um: 'L' },
    { name: 'Motorina Diesel', cat: 'Combustibil', tip: 'Diesel', um: 'L' },
    { name: 'Benzina 95', cat: 'Combustibil', tip: 'Benzina', um: 'L' },
    { name: 'AdBlue', cat: 'Combustibil', tip: 'AdBlue', um: 'L' },
    { name: 'Ulei motor', cat: 'Combustibil', tip: 'Ulei', um: 'L' },
    { name: 'P9074', cat: 'Seminte', tip: 'Porumb', um: 'kg' },
    { name: 'P0710', cat: 'Seminte', tip: 'Porumb', um: 'kg' },
    { name: 'DKC 5143', cat: 'Seminte', tip: 'Porumb', um: 'kg' },
    { name: 'Genesi', cat: 'Seminte', tip: 'Grau', um: 'kg' },
    { name: 'ES Neptune', cat: 'Seminte', tip: 'Rapita', um: 'kg' },
    { name: 'PX131', cat: 'Seminte', tip: 'Rapita', um: 'kg' },
    { name: 'LG 5411', cat: 'Seminte', tip: 'Floarea soarelui', um: 'kg' },
    { name: 'P64LE99', cat: 'Seminte', tip: 'Floarea soarelui', um: 'kg' },
    { name: 'Montague', cat: 'Seminte', tip: 'Orz', um: 'kg' },
    { name: 'Enigma', cat: 'Seminte', tip: 'Soia', um: 'kg' },
    { name: 'NPK 20-20-0', cat: 'Ingrasaminte', tip: 'Complex', um: 'kg' },
    { name: 'NPK 15-15-15', cat: 'Ingrasaminte', tip: 'Complex', um: 'kg' },
    { name: 'Azotat de amoniu', cat: 'Ingrasaminte', tip: 'Azotat', um: 'kg' },
    { name: 'Sulfat de amoniu', cat: 'Ingrasaminte', tip: 'Azotat', um: 'kg' },
    { name: 'Uree', cat: 'Ingrasaminte', tip: 'Azotat', um: 'kg' },
    { name: 'Superfosfat', cat: 'Ingrasaminte', tip: 'Fosforit', um: 'kg' },
    { name: 'Adjuvant Wetting', cat: 'Adjuvanti', tip: 'Umectant', um: 'L' },
    { name: 'Antispumant Silicon', cat: 'Adjuvanti', tip: 'Antispumant', um: 'L' }
  ];

  var TIPURI_PER_CAT = {
    'Seminte':      ['Grau', 'Porumb', 'Rapita', 'Floarea soarelui', 'Soia', 'Orz', 'Secara', 'Altele'],
    'Pesticide':    ['Erbicid', 'Fungicid', 'Insecticid', 'Acaricid', 'Molluscicid', 'Altele'],
    'Ingrasaminte': ['Azotat', 'Fosforit', 'Potasic', 'Complex', 'Foliar', 'Altele'],
    'Combustibil':  ['Diesel', 'Benzina', 'AdBlue', 'Ulei', 'Lubrifiant', 'Altele'],
    'Adjuvanti':    ['Umectant', 'Antispumant', 'Antigel', 'Adherent', 'Altele'],
    'Piese schimb': ['Motor', 'Transmisie', 'Roti', 'Hidraulica', 'Electrica', 'Altele'],
    'Altele':       ['Altele']
  };

  // ===== STOCURI_DB (sincron cu stocuri.html) + doza recomandată din Fisa Tehnică =====
  // Folosit în Creează lucrare ca sursă pentru Inputuri — arată doar produsele reale din fermă
  var STOCURI_DB = [
    { name: 'Karate Zeon 5CS',      cat: 'Pesticide',    tip: 'Insecticid', um: 'L',    stoc: 48,   dozaRec: 0.15 },
    { name: 'Motorina',             cat: 'Combustibil',  tip: 'Diesel',     um: 'L',    stoc: 1250, dozaRec: null, pret: 7.50 },
    { name: 'Benzina 95',           cat: 'Combustibil',  tip: 'Benzină',    um: 'L',    stoc: 200,  dozaRec: null, pret: 7.20 },
    { name: 'Pioneer P225',         cat: 'Seminte',      tip: 'Grau',       um: 'kg',   stoc: 3200, dozaRec: 180 },
    { name: 'Amonio Nitrat 34.4%',  cat: 'Ingrasaminte', tip: 'Azotat',     um: 'kg',   stoc: 8500, dozaRec: 250 },
    { name: 'Folicur Solo 250 EW',  cat: 'Pesticide',    tip: 'Fungicid',   um: 'L',    stoc: 0,    dozaRec: 1.0 },
    { name: 'Roundup Classic',      cat: 'Pesticide',    tip: 'Erbicid',    um: 'L',    stoc: 0,    dozaRec: 3.0 },
    { name: 'Ulei hidraulic H46',   cat: 'Piese',        tip: 'Lubrifiant', um: 'L',    stoc: 0,    dozaRec: null },
    { name: 'Mustang 306 SE',       cat: 'Pesticide',    tip: 'Erbicid',    um: 'L',    stoc: 120,  dozaRec: 0.6 },
    { name: 'P9911',                cat: 'Seminte',      tip: 'Porumb',     um: 'kg',   stoc: 1800, dozaRec: 22 },
    { name: 'NPK 20-20-0',          cat: 'Ingrasaminte', tip: 'Complex',    um: 'kg',   stoc: 4200, dozaRec: 250 },
    { name: 'Filtru ulei motor JD', cat: 'Piese',        tip: 'Piesa',      um: 'buc',  stoc: 6,    dozaRec: null },
    { name: 'Cruiser 350 FS',       cat: 'Pesticide',    tip: 'Fungicid',   um: 'L',    stoc: 25,   dozaRec: 0.5 },
    { name: 'AdBlue',               cat: 'Combustibil',  tip: 'AdBlue',     um: 'L',    stoc: 450,  dozaRec: null, pret: 5.00 },
    { name: 'Ata de balotat',       cat: 'Altele',       tip: 'Consumabile', um: 'kg',  stoc: 80,   dozaRec: null },
    { name: 'Folie silozare',       cat: 'Altele',       tip: 'Consumabile', um: 'role', stoc: 12,  dozaRec: null }
  ];

  window.stocNameSearch = function (q) {
    var results = document.getElementById('stoc-results');
    if (!results) return;
    if (!q || q.length < 3) { results.style.display = 'none'; return; }
    var qLow = q.toLowerCase();
    var matches = PRODUSE_DB.filter(function (p) { return p.name.toLowerCase().indexOf(qLow) >= 0; });
    if (matches.length === 0) {
      results.innerHTML = '<div style="padding:12px;font-size:14px;"><span style="color:var(--brand-warning);font-weight:700;"><i data-lucide="settings"></i> Produs nou</span> <span style="color:var(--brand-text-muted);">&mdash; completeaza categoria si tipul manual</span></div>';
      results.style.display = 'block';
      return;
    }
    var html = '';
    matches.slice(0, 8).forEach(function (p) {
      html += '<div onclick="stocPickProduct(\'' + p.name + '\')" style="padding:10px 12px;cursor:pointer;border-bottom:1px solid #f0f0f0;">';
      html += '<div style="font-size:14px;font-weight:600;color:var(--brand-text-primary);">' + p.name + '</div>';
      html += '<div style="font-size:12px;color:var(--brand-text-muted);margin-top:2px;">' + p.cat + ' &middot; ' + p.tip + '</div>';
      html += '</div>';
    });
    results.innerHTML = html;
    results.style.display = 'block';
  };

  window.stocPickProduct = function (name) {
    var prod = PRODUSE_DB.find(function (p) { return p.name === name; });
    if (!prod) return;
    var inp = document.getElementById('stoc-nume');
    var res = document.getElementById('stoc-results');
    var cat = document.getElementById('stoc-cat');
    if (inp) inp.value = prod.name;
    if (res) res.style.display = 'none';
    if (cat) { cat.value = prod.cat; stocCatChange(prod.cat); }
    setTimeout(function () {
      var tip = document.getElementById('stoc-tip');
      if (tip) tip.value = prod.tip;
      // UM-ul implicit din sistem
      var um = document.getElementById('stoc-um');
      if (um && prod.um) um.value = prod.um;
    }, 30);
  };

  window.stocTab = function (tab) {
    var manualBtn = document.getElementById('stoc-tab-manual-btn');
    var automatBtn = document.getElementById('stoc-tab-automat-btn');
    var manualTab = document.getElementById('stoc-tab-manual');
    var automatTab = document.getElementById('stoc-tab-automat');
    if (tab === 'manual') {
      if (manualBtn) { manualBtn.style.background = 'var(--brand-primary)'; manualBtn.style.color = '#fff'; }
      if (automatBtn) { automatBtn.style.background = 'transparent'; automatBtn.style.color = 'var(--brand-text-muted)'; }
      if (manualTab) manualTab.style.display = '';
      if (automatTab) automatTab.style.display = 'none';
    } else {
      if (automatBtn) { automatBtn.style.background = 'var(--brand-primary)'; automatBtn.style.color = '#fff'; }
      if (manualBtn) { manualBtn.style.background = 'transparent'; manualBtn.style.color = 'var(--brand-text-muted)'; }
      if (manualTab) manualTab.style.display = 'none';
      if (automatTab) automatTab.style.display = '';
    }
  };

  window.scanInvoice = function () {
    if (typeof showToast === 'function') showToast('success', 'Scanare factura... (demo)');
    // Simuleaza OCR: dupa 1.5s completeaza formular si comuta pe tab Manual
    setTimeout(function () {
      stocTab('manual');
      var nameInp = document.getElementById('stoc-nume');
      if (nameInp) nameInp.value = 'Roundup';
      window.stocPickProduct && window.stocPickProduct('Roundup');
      setTimeout(function () {
        var cant = document.getElementById('stoc-cant');
        if (cant) cant.value = 500;
        var pret = document.getElementById('stoc-pret');
        if (pret) pret.value = 12500;
        var furn = document.getElementById('stoc-furnizor');
        if (furn) furn.value = 'Agrimatco';
        window.stocRecalc && window.stocRecalc();
        if (typeof showToast === 'function') showToast('success', 'Date extrase! Verifica si salveaza.');
      }, 100);
    }, 1400);
  };

  window._pretMode = 'total'; // 'total' sau 'um'

  window.setPretMode = function (mode) {
    window._pretMode = mode;
    var bTotal = document.getElementById('stoc-pret-mode-total');
    var bUm = document.getElementById('stoc-pret-mode-um');
    var hint = document.getElementById('stoc-pret-hint');
    var inp = document.getElementById('stoc-pret');
    if (mode === 'total') {
      if (bTotal) { bTotal.style.border = '2px solid var(--brand-primary)'; bTotal.style.background = 'var(--brand-hover-bg)'; bTotal.style.color = 'var(--brand-primary)'; }
      if (bUm) { bUm.style.border = '2px solid var(--brand-border)'; bUm.style.background = '#fff'; bUm.style.color = 'var(--brand-text-muted)'; }
      if (hint) hint.textContent = '— total';
      if (inp) inp.placeholder = 'ex: 12500.00';
    } else {
      if (bUm) { bUm.style.border = '2px solid var(--brand-primary)'; bUm.style.background = 'var(--brand-hover-bg)'; bUm.style.color = 'var(--brand-primary)'; }
      if (bTotal) { bTotal.style.border = '2px solid var(--brand-border)'; bTotal.style.background = '#fff'; bTotal.style.color = 'var(--brand-text-muted)'; }
      if (hint) hint.textContent = '— pe UM';
      if (inp) inp.placeholder = 'ex: 25.50';
    }
    stocRecalc();
  };

  window.stocRecalc = function () {
    var cant = parseFloat(document.getElementById('stoc-cant') ? document.getElementById('stoc-cant').value : 0) || 0;
    var pret = parseFloat(document.getElementById('stoc-pret') ? document.getElementById('stoc-pret').value : 0) || 0;
    var total = window._pretMode === 'um' ? (cant * pret) : pret;
    var totalEl = document.getElementById('stoc-total');
    if (totalEl) totalEl.value = total.toLocaleString('ro-RO', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + ' RON';
  };

  window.stocCatChange = function (cat) {
    var tipSel = document.getElementById('stoc-tip');
    if (!tipSel) return;
    var tipuri = TIPURI_PER_CAT[cat] || [];
    var html = '<option value="">Selecteaza...</option>';
    tipuri.forEach(function (t) { html += '<option>' + t + '</option>'; });
    tipSel.innerHTML = html;
  };

  // ===== FURNIZORI DB + helpers =====
  var FURNIZORI_DB = [
    'Agrimatco', 'Syngenta Romania', 'Bayer CropScience', 'BASF Agro',
    'Corteva Agriscience', 'Pioneer Seeds', 'Limagrain', 'KWS Seeds',
    'Yara Agri', 'OMV Petrom', 'Rompetrol', 'MOL Romania',
    'Alpha Farm', 'Sano Agrar', 'Adama Agriculture', 'Carmistin',
    'Amtech Agro', 'Chimcomplex', 'Azomures'
  ];

  window.furnizorSearch = function (q) {
    var results = document.getElementById('stoc-furnizor-results');
    if (!results) return;
    var qLow = (q || '').toLowerCase();
    var html = '';
    // Prima optiune mereu: Nedefinit
    html += '<div onclick="furnizorPick(\'\')" style="padding:12px;cursor:pointer;border-bottom:1px solid #f0f0f0;color:var(--brand-text-muted);font-style:italic;font-size:14px;">&mdash; Nedefinit &mdash;</div>';
    var matches = FURNIZORI_DB.filter(function (f) { return !qLow || f.toLowerCase().indexOf(qLow) >= 0; });
    matches.slice(0, 10).forEach(function (f) {
      html += '<div onclick="furnizorPick(\'' + f.replace(/'/g, "\\'") + '\')" style="padding:10px 12px;cursor:pointer;border-bottom:1px solid #f0f0f0;font-size:14px;display:flex;align-items:center;gap:8px;"><i data-lucide="building-2"></i> ' + f + '</div>';
    });
    if (qLow && matches.length === 0) {
      html += '<div style="padding:12px;font-size:13px;color:var(--brand-text-muted);"><span style="color:var(--brand-warning);font-weight:700;">Nu exista.</span> Apasa + pentru a adauga.</div>';
    }
    results.innerHTML = html;
    results.style.display = 'block';
  };

  window.furnizorPick = function (name) {
    var inp = document.getElementById('stoc-furnizor');
    var res = document.getElementById('stoc-furnizor-results');
    if (inp) inp.value = name;
    if (res) res.style.display = 'none';
  };

  window.openAddFurnizor = function () {
    var screen = document.querySelector('.phone-screen');
    if (!screen) return;
    var existing = document.getElementById('furnizor-add-overlay');
    if (existing) existing.remove();
    var overlay = document.createElement('div');
    overlay.id = 'furnizor-add-overlay';
    overlay.style.cssText = 'position:absolute;inset:0;background:rgba(0,0,0,0.55);z-index:100;display:flex;align-items:center;justify-content:center;padding:16px;';
    overlay.onclick = function (e) { if (e.target === overlay) overlay.remove(); };
    overlay.innerHTML =
      '<div style="background:#fff;width:100%;max-width:320px;border-radius:16px;padding:18px;display:flex;flex-direction:column;gap:10px;">' +
        '<div style="font-size:17px;font-weight:700;color:var(--brand-text-primary);">Adauga furnizor nou</div>' +
        '<div class="form-group" style="margin-bottom:0;"><label class="form-label">Denumire *</label><input id="new-furnizor-name" class="form-input" placeholder="Ex: Agri Plus SRL"></div>' +
        '<div class="form-group" style="margin-bottom:0;"><label class="form-label">CUI (optional)</label><input class="form-input" placeholder="RO12345678"></div>' +
        '<div class="form-group" style="margin-bottom:0;"><label class="form-label">Contact (optional)</label><input class="form-input" placeholder="Telefon / email"></div>' +
        '<div style="display:flex;gap:8px;margin-top:8px;">' +
          '<button onclick="document.getElementById(\'furnizor-add-overlay\').remove()" style="flex:1;min-height:48px;background:#fff;border:1px solid var(--brand-border);border-radius:8px;font-size:14px;font-weight:700;cursor:pointer;font-family:inherit;">Anuleaza</button>' +
          '<button onclick="saveNewFurnizor()" style="flex:1;min-height:48px;background:var(--brand-primary);color:#fff;border:none;border-radius:8px;font-size:14px;font-weight:700;cursor:pointer;font-family:inherit;">Salveaza</button>' +
        '</div>' +
      '</div>';
    screen.appendChild(overlay);
    setTimeout(function () { var i = document.getElementById('new-furnizor-name'); if (i) i.focus(); }, 100);
  };

  // Inchide dropdown-urile de search cand se da click in afara lor
  document.addEventListener('click', function (e) {
    var closers = [
      { res: 'stoc-results', inp: 'stoc-nume' },
      { res: 'stoc-furnizor-results', inp: 'stoc-furnizor' }
      // tf-teren e handled de componenta shared (psXXX)
    ];
    closers.forEach(function (c) {
      var res = document.getElementById(c.res);
      if (!res || res.style.display !== 'block') return;
      if (res.contains(e.target)) return;
      if (e.target.id === c.inp) return;
      res.style.display = 'none';
    });
  });

  window.saveNewFurnizor = function () {
    var inp = document.getElementById('new-furnizor-name');
    if (!inp || !inp.value.trim()) return;
    var name = inp.value.trim();
    FURNIZORI_DB.unshift(name);
    var ov = document.getElementById('furnizor-add-overlay');
    if (ov) ov.remove();
    furnizorPick(name);
    if (typeof showToast === 'function') showToast('success', 'Furnizor adaugat: ' + name);
  };

  window.quickEvaluare = function () {
    closeFabSafe();
    if (typeof openDrawer !== 'function') return;
    var html = '';
    // Parcele — componenta reutilizabila (acelasi ca la Creează lucrare)
    html += parcelaSelectorHTML('eval-terene', { label: 'Parcele', hint: '(una sau mai multe)', required: true });
    // Stare generala
    html += '<div class="form-group"><label class="form-label">Stare generala *</label>';
    html += '<select class="form-select"><option>Selecteaza...</option><option>Excelenta</option><option>Buna</option><option>Atentionare</option><option>Probleme</option></select></div>';
    // Fotografii (camera + galerie)
    html += '<div class="form-group"><label class="form-label">Fotografii</label>';
    html += '<div style="display:flex;gap:6px;">';
    html += '<label for="eval-camera" style="flex:1;display:flex;align-items:center;justify-content:center;gap:6px;padding:14px;border:1.5px dashed var(--brand-primary);background:var(--brand-hover-bg);color:var(--brand-primary);border-radius:10px;cursor:pointer;font-size:13px;font-weight:700;"><span style="font-size:18px;"><i data-lucide="camera"></i></span> Fa poza</label>';
    html += '<input id="eval-camera" type="file" accept="image/*" capture="environment" multiple style="display:none;" onchange="evalFotoAdd(this)">';
    html += '<label for="eval-gallery" style="flex:1;display:flex;align-items:center;justify-content:center;gap:6px;padding:14px;border:1.5px dashed var(--brand-border);background:#fff;color:var(--brand-text-primary);border-radius:10px;cursor:pointer;font-size:13px;font-weight:700;"><span style="font-size:18px;"><i data-lucide="image"></i></span> Din galerie</label>';
    html += '<input id="eval-gallery" type="file" accept="image/*" multiple style="display:none;" onchange="evalFotoAdd(this)">';
    html += '</div>';
    html += '<div id="eval-foto-preview" style="display:none;margin-top:8px;display:flex;flex-wrap:wrap;gap:6px;"></div>';
    html += '</div>';
    // Observatii
    html += '<div class="form-group"><label class="form-label">Observatii</label><textarea class="form-textarea" placeholder="Ce ai observat (daunatori, boli, rasariri, etc.)"></textarea></div>';

    openDrawer('Evaluare cultura (rapid)', html, [
      { label: 'Anuleaza', class: 'btn-secondary', action: closeDrawer },
      { label: 'Salveaza', class: 'btn-primary', action: function(){ closeDrawer(); if (typeof showToast === 'function') showToast('success', 'Evaluare inregistrata.'); } }
    ]);
  };

  // === EVAL: teren search & map — acum via componenta shared (psSearch/psPick/psOpenMap) ===

  // Cache GPS pt a nu cere permisiuni la fiecare foto
  window._evalGpsCache = null;
  function evalGetGps(cb) {
    if (window._evalGpsCache) { cb(window._evalGpsCache); return; }
    if (!navigator.geolocation) { cb(null); return; }
    navigator.geolocation.getCurrentPosition(function(pos) {
      window._evalGpsCache = { lat: pos.coords.latitude, lng: pos.coords.longitude, acc: pos.coords.accuracy };
      cb(window._evalGpsCache);
    }, function() { cb({ lat: 45.74894, lng: 21.20866, acc: 12, demo: true }); }, { timeout: 5000 });
  }
  function evalGetOrientation() {
    if (screen.orientation && screen.orientation.angle !== undefined) return screen.orientation.angle + '°';
    if (typeof window.orientation === 'number') return window.orientation + '°';
    return '—';
  }

  window.evalFotoAdd = function (inp) {
    if (!inp.files || !inp.files.length) return;
    var preview = document.getElementById('eval-foto-preview');
    if (!preview) return;
    preview.style.display = 'flex';
    evalGetGps(function(gps) {
      var now = new Date();
      var ts = ('0'+now.getDate()).slice(-2) + '.' + ('0'+(now.getMonth()+1)).slice(-2) + ' ' + ('0'+now.getHours()).slice(-2) + ':' + ('0'+now.getMinutes()).slice(-2);
      var orient = evalGetOrientation();
      Array.from(inp.files).forEach(function(f) {
        var url = URL.createObjectURL(f);
        var meta = { ts: ts, gps: gps, orient: orient, name: f.name };
        var chip = document.createElement('div');
        chip.style.cssText = 'position:relative;width:90px;border-radius:8px;overflow:hidden;border:2px solid var(--brand-border);background:#fff;';
        var gpsText = gps ? (gps.lat.toFixed(4) + ', ' + gps.lng.toFixed(4) + (gps.demo ? ' (demo)' : '')) : 'GPS indisponibil';
        chip.innerHTML =
          '<div style="width:100%;height:70px;background:url(\'' + url + '\') center/cover;"></div>' +
          '<div style="padding:3px 4px;font-size:9px;line-height:1.3;background:var(--brand-hover-bg);">' +
            '<div style="font-weight:700;color:var(--brand-primary);"><i data-lucide="map-pin"></i> ' + (gps ? gps.lat.toFixed(3) + ',' + gps.lng.toFixed(3) : '—') + '</div>' +
            '<div style="color:var(--brand-text-muted);"><i data-lucide="clock"></i> ' + ts + ' &middot; <i data-lucide="repeat"></i> ' + orient + '</div>' +
          '</div>' +
          '<span onclick="this.parentElement.remove()" style="position:absolute;top:2px;right:2px;width:20px;height:20px;background:rgba(0,0,0,0.7);color:#fff;border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:12px;cursor:pointer;font-weight:700;">&times;</span>' +
          '<span onclick="evalFotoInfo(this)" data-meta=\'' + JSON.stringify(meta).replace(/"/g,'&quot;') + '\' style="position:absolute;top:2px;left:2px;width:20px;height:20px;background:rgba(0,0,0,0.7);color:#fff;border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:11px;cursor:pointer;font-weight:700;">i</span>';
        preview.appendChild(chip);
      });
    });
    inp.value = '';
  };

  window.evalFotoInfo = function(btn) {
    var meta; try { meta = JSON.parse(btn.getAttribute('data-meta').replace(/&quot;/g,'"')); } catch(e) { return; }
    var gps = meta.gps || {};
    var html =
      '<div style="display:grid;grid-template-columns:auto 1fr;gap:8px 14px;padding:4px 0;font-size:13px;">' +
      '<span style="color:var(--brand-text-muted);"><i data-lucide="camera"></i> Fisier</span><span style="font-weight:700;word-break:break-all;">' + (meta.name || '—') + '</span>' +
      '<span style="color:var(--brand-text-muted);"><i data-lucide="clock"></i> Data / ora</span><span style="font-weight:700;">' + (meta.ts || '—') + '</span>' +
      '<span style="color:var(--brand-text-muted);"><i data-lucide="map-pin"></i> Latitudine</span><span style="font-weight:700;">' + (gps.lat !== undefined ? gps.lat.toFixed(5) : '—') + '</span>' +
      '<span style="color:var(--brand-text-muted);"><i data-lucide="map-pin"></i> Longitudine</span><span style="font-weight:700;">' + (gps.lng !== undefined ? gps.lng.toFixed(5) : '—') + '</span>' +
      '<span style="color:var(--brand-text-muted);"><i data-lucide="target"></i> Acuratete</span><span style="font-weight:700;">' + (gps.acc !== undefined ? '±' + Math.round(gps.acc) + ' m' : '—') + '</span>' +
      '<span style="color:var(--brand-text-muted);"><i data-lucide="repeat"></i> Orientare</span><span style="font-weight:700;">' + (meta.orient || '—') + '</span>' +
      (gps.demo ? '<span style="grid-column:1/-1;color:var(--brand-warning);font-size:11px;">(coordonate demo - in productie se iau din EXIF / GPS real)</span>' : '') +
      '</div>';
    if (typeof openDrawer === 'function') openDrawer('Metadata foto', html, []);
  };

  // ===== PARCELA SELECTOR (componentă reutilizabilă — folosită în Creează lucrare, Evaluare, Planifică) =====
  window._parcelaSelectors = window._parcelaSelectors || {};
  window._psCallbacks = window._psCallbacks || {};

  window.psGetSelected = function (id) {
    var names = window._parcelaSelectors[id] || [];
    var source = (typeof PARCELE_LIST !== 'undefined' && PARCELE_LIST.length) ? PARCELE_LIST : [];
    return names.map(function (n) {
      return source.find(function (p) { return p.name === n; }) || { name: n, ha: 0, cultura: '' };
    });
  };

  window.parcelaSelectorHTML = function (id, opts) {
    opts = opts || {};
    var label = opts.label || 'Parcele';
    var hint = opts.hint || '';
    var required = opts.required !== false;
    window._parcelaSelectors[id] = opts.initial || [];
    var html = '';
    html += '<div class="form-group"><label class="form-label">' + label + (required ? ' *' : '') + (hint ? ' <span style="font-size:11px;color:var(--brand-text-muted);font-weight:400;text-transform:none;">' + hint + '</span>' : '') + '</label>';
    html += '<div id="' + id + '-chips" style="display:flex;flex-wrap:wrap;gap:6px;margin-bottom:6px;"></div>';
    html += '<div style="display:flex;gap:6px;align-items:stretch;">';
    html += '<div style="flex:1;position:relative;">';
    html += '<input id="' + id + '-search" class="form-input" placeholder="Tap pentru listă sau scrie..." oninput="psSearch(\'' + id + '\', this.value)" onfocus="psSearch(\'' + id + '\', this.value)" autocomplete="off">';
    html += '<div id="' + id + '-results" style="display:none;position:absolute;top:100%;left:0;right:0;background:#fff;border:1px solid var(--brand-border);border-radius:8px;max-height:220px;overflow-y:auto;overflow-x:hidden;z-index:6;box-shadow:0 4px 14px rgba(0,0,0,0.12);margin-top:2px;"></div>';
    html += '</div>';
    html += '<button type="button" onclick="psOpenMap(\'' + id + '\')" title="Selectează de pe hartă" style="min-height:48px;min-width:48px;padding:0 12px;border:1px solid var(--brand-primary);background:var(--brand-hover-bg);color:var(--brand-primary);border-radius:8px;cursor:pointer;font-size:20px;flex-shrink:0;"><i data-lucide="globe"></i></button>';
    html += '</div>';
    html += '</div>';
    return html;
  };

  window.psSearch = function (id, q) {
    var res = document.getElementById(id + '-results');
    if (!res) return;
    var used = window._parcelaSelectors[id] || [];
    var source = (typeof PARCELE_LIST !== 'undefined' && PARCELE_LIST.length) ? PARCELE_LIST : [];
    var matches;
    if (!q || q.length < 3) {
      matches = source.filter(function (p) { return used.indexOf(p.name) < 0; }).slice().sort(function (a, b) { return a.name.localeCompare(b.name); });
    } else {
      var qLow = q.toLowerCase();
      matches = source.filter(function (p) { return p.name.toLowerCase().indexOf(qLow) >= 0 && used.indexOf(p.name) < 0; }).sort(function (a, b) { return a.name.localeCompare(b.name); });
    }
    if (!matches.length) { res.innerHTML = '<div style="padding:12px;color:var(--brand-text-muted);font-size:14px;">Nicio parcela disponibila</div>'; res.style.display = 'block'; return; }
    var html = '';
    matches.forEach(function (p) {
      html += '<div onclick="psPick(\'' + id + '\', \'' + p.name.replace(/'/g, "\\'") + '\')" style="padding:10px 12px;cursor:pointer;border-bottom:1px solid #f0f0f0;display:flex;justify-content:space-between;align-items:center;">';
      html += '<div><div style="font-size:14px;font-weight:600;color:var(--brand-text-primary);"><i data-lucide="wheat"></i> ' + p.name + '</div>' + (p.cultura ? '<div style="font-size:12px;color:var(--brand-text-muted);margin-top:2px;">' + p.cultura + '</div>' : '') + '</div>';
      if (p.ha) html += '<div style="font-size:13px;font-weight:700;color:#E6853D;">' + p.ha + ' ha</div>';
      html += '</div>';
    });
    res.innerHTML = html;
    res.style.display = 'block';
  };

  window.psPick = function (id, name) {
    window._parcelaSelectors[id] = window._parcelaSelectors[id] || [];
    if (window._parcelaSelectors[id].indexOf(name) < 0) window._parcelaSelectors[id].push(name);
    var inp = document.getElementById(id + '-search');
    var res = document.getElementById(id + '-results');
    if (inp) inp.value = '';
    if (res) res.style.display = 'none';
    psRender(id);
    if (window._psCallbacks[id]) window._psCallbacks[id]();
  };

  window.psRemove = function (id, name) {
    if (!window._parcelaSelectors[id]) return;
    window._parcelaSelectors[id] = window._parcelaSelectors[id].filter(function (n) { return n !== name; });
    psRender(id);
    if (window._psCallbacks[id]) window._psCallbacks[id]();
  };

  window.psRender = function (id) {
    var wrap = document.getElementById(id + '-chips');
    if (!wrap) return;
    var names = window._parcelaSelectors[id] || [];
    var source = (typeof PARCELE_LIST !== 'undefined' && PARCELE_LIST.length) ? PARCELE_LIST : [];
    wrap.innerHTML = names.map(function (name) {
      var p = source.find(function (x) { return x.name === name; });
      var label = name + (p && p.ha ? ' &middot; ' + p.ha + ' ha' : '');
      return '<div style="display:inline-flex;align-items:center;gap:6px;padding:6px 12px;background:#FFF0E6;color:#E6853D;border-radius:100px;font-size:13px;font-weight:700;"><i data-lucide="wheat"></i> ' + label + ' <span onclick="psRemove(\'' + id + '\', \'' + name.replace(/'/g, "\\'") + '\')" style="cursor:pointer;font-weight:900;opacity:0.7;">&times;</span></div>';
    }).join('');
  };
  function psRender(id) { window.psRender(id); }

  window.psOpenMap = function (id) {
    var screen = document.querySelector('.phone-screen');
    if (!screen) return;
    var existing = document.getElementById('ps-map-overlay');
    if (existing) existing.remove();
    var source = (typeof PARCELE_LIST !== 'undefined' && PARCELE_LIST.length) ? PARCELE_LIST : [];
    var used = window._parcelaSelectors[id] || [];
    var grid = '';
    source.forEach(function (p, i) {
      var bgs = ['#1B5E20','#2E7D32','#558B2F','#689F38','#7CB342','#8B6B47','#6B8E6B','#4A6B33'];
      var bg = bgs[i % bgs.length];
      var isUsed = used.indexOf(p.name) >= 0;
      var short = p.name.replace('Parcela ','P').replace('Lotul ','L').replace('Tarlaua ','T').replace('Sola ','S');
      grid += '<div onclick="psMapToggle(\'' + id + '\', \'' + p.name.replace(/'/g, "\\'") + '\', this)" title="' + p.name + (p.ha ? ' · ' + p.ha + ' ha' : '') + (p.cultura ? ' · ' + p.cultura : '') + '" style="aspect-ratio:1;background:' + bg + ';color:#fff;display:flex;flex-direction:column;align-items:center;justify-content:center;font-size:11px;font-weight:700;text-align:center;padding:6px 4px;border-radius:6px;cursor:pointer;line-height:1.2;border:3px solid ' + (isUsed ? '#E6853D' : 'rgba(255,255,255,0.3)') + ';position:relative;">' + short + (p.ha ? '<span style="font-size:10px;font-weight:500;opacity:0.9;margin-top:2px;">' + p.ha + ' ha</span>' : '') + (isUsed ? '<span style="position:absolute;top:3px;right:3px;background:#E6853D;color:#fff;width:16px;height:16px;border-radius:50%;font-size:10px;display:flex;align-items:center;justify-content:center;"><i data-lucide="check"></i></span>' : '') + '</div>';
    });
    var overlay = document.createElement('div');
    overlay.id = 'ps-map-overlay';
    overlay.style.cssText = 'position:absolute;inset:0;background:rgba(0,0,0,0.55);z-index:100;display:flex;align-items:center;justify-content:center;padding:16px;';
    overlay.onclick = function (e) { if (e.target === overlay) overlay.remove(); };
    overlay.innerHTML =
      '<div style="background:#fff;width:100%;max-width:330px;max-height:90%;overflow:hidden;border-radius:16px;display:flex;flex-direction:column;">' +
        '<div style="display:flex;justify-content:space-between;align-items:center;padding:14px 16px;border-bottom:1px solid var(--brand-border);flex-shrink:0;">' +
          '<div style="font-size:16px;font-weight:700;">Alege de pe hartă</div>' +
          '<button onclick="document.getElementById(\'ps-map-overlay\').remove()" style="width:34px;height:34px;border:none;background:var(--brand-primary);color:#fff;border-radius:50%;cursor:pointer;font-size:16px;">&times;</button>' +
        '</div>' +
        '<div style="padding:10px 14px 0;font-size:12px;color:var(--brand-text-muted);text-align:center;">Apasă pe parcele ca să le adaugi (bifă portocalie = selectată)</div>' +
        '<div style="padding:12px;overflow-y:auto;">' +
          '<div style="display:grid;grid-template-columns:repeat(4,1fr);gap:6px;background:linear-gradient(135deg,#B5D896,#8FBC8F);padding:14px;border-radius:10px;">' + grid + '</div>' +
        '</div>' +
        '<div style="padding:10px 16px 14px;border-top:1px solid var(--brand-border);">' +
          '<button onclick="document.getElementById(\'ps-map-overlay\').remove()" style="width:100%;padding:14px;background:var(--brand-primary);color:#fff;border:none;border-radius:10px;font-size:15px;font-weight:800;cursor:pointer;font-family:inherit;">Gata</button>' +
        '</div>' +
      '</div>';
    screen.appendChild(overlay);
  };

  window.psMapToggle = function (id, name, el) {
    window._parcelaSelectors[id] = window._parcelaSelectors[id] || [];
    var idx = window._parcelaSelectors[id].indexOf(name);
    if (idx >= 0) {
      window._parcelaSelectors[id].splice(idx, 1);
      el.style.border = '3px solid rgba(255,255,255,0.3)';
      var check = el.querySelector('span[style*="position:absolute"]');
      if (check) check.remove();
    } else {
      window._parcelaSelectors[id].push(name);
      el.style.border = '3px solid #E6853D';
      var c = document.createElement('span');
      c.style.cssText = 'position:absolute;top:3px;right:3px;background:#E6853D;color:#fff;width:16px;height:16px;border-radius:50%;font-size:10px;display:flex;align-items:center;justify-content:center;';
      c.innerHTML = '<i data-lucide="check"></i>';
      el.appendChild(c);
    }
    psRender(id);
    if (window._psCallbacks[id]) window._psCallbacks[id]();
  };

  // Inchide dropdown-urile parcela-selector la click outside
  document.addEventListener('click', function (e) {
    Object.keys(window._parcelaSelectors || {}).forEach(function (id) {
      var res = document.getElementById(id + '-results');
      if (!res || res.style.display !== 'block') return;
      if (res.contains(e.target)) return;
      if (e.target.id === id + '-search') return;
      res.style.display = 'none';
    });
  });

  // ===== CREEAZA LUCRARE (form unificat) =====
  var PARCELE_LIST = [
    { name: 'Parcela 12 Nord', ha: 25.5, cultura: 'Grau' },
    { name: 'Parcela 9 Centru', ha: 42.3, cultura: 'Grau' },
    { name: 'Parcela 22 Nord', ha: 55.0, cultura: 'Porumb' },
    { name: 'Parcela 7 Vest', ha: 18.2, cultura: 'Porumb' },
    { name: 'Parcela 15 Est', ha: 14.8, cultura: 'Rapita' },
    { name: 'Parcela 3 Sud', ha: 32.0, cultura: 'Floarea soarelui' },
    { name: 'Parcela 4 Est', ha: 19.6, cultura: 'Soia' },
    { name: 'Parcela 6 Vest', ha: 12.1, cultura: 'Porumb' },
    { name: 'Parcela 11 Centru', ha: 21.8, cultura: 'Rapita' },
    { name: 'Parcela 18 Sud', ha: 28.4, cultura: 'Grau' },
    { name: 'Lotul 3 Vest', ha: 8.7, cultura: 'Orz' }
  ];

  // DATE din modulul Echipa
  var MECANIZATORI = ['Ion Popescu', 'Maria Ionescu', 'Vasile Lungu', 'Andrei Popa', 'Elena Vasile', 'Gheorghe Marin', 'Alexandru Romanescu', 'Cristinel Parvulescu'];

  // DATE din modulul Utilaje (cu mecanizator implicit per utilaj + combustibil din fisa tehnica)
  var UTILAJE_DB = [
    { name: 'Tractor JD 6130R',      tip: 'Tractor',    mec: 'Ion Popescu',     combustibil: 'Motorină' },
    { name: 'Tractor Case Puma 165', tip: 'Tractor',    mec: 'Gheorghe Marin',  combustibil: 'Motorină' },
    { name: 'John Deere 6120M',      tip: 'Tractor',    mec: 'Vasile Lungu',    combustibil: 'Motorină' },
    { name: 'New Holland T7',        tip: 'Tractor',    mec: 'Andrei Popa',     combustibil: 'Motorină' },
    { name: 'Combina CR9.80',        tip: 'Combina',    mec: 'Ion Popescu',     combustibil: 'Motorină' },
    { name: 'DJI Agras T40',         tip: 'Drona',      mec: 'Elena Vasile',    combustibil: 'Electric' }
  ];
  // Autovehicule (masini de serviciu) — pot fi alocate oricui
  var MASINI_DB = [
    { name: 'Dacia Duster 4x4',      tip: 'Autoturism SUV',     sofer: 'Maria Ionescu',       combustibil: 'Motorină' },
    { name: 'Iveco Daily Basculant', tip: 'Camion basculant',   sofer: 'Andrei Popa',         combustibil: 'Motorină' },
    { name: 'VW Transporter',        tip: 'Duba',               sofer: null,                  combustibil: 'Motorină' },
    { name: 'Renault Master',        tip: 'Duba',               sofer: 'Alexandru Romanescu', combustibil: 'Motorină' },
    { name: 'Ford Ranger',           tip: 'Pick-up',            sofer: null,                  combustibil: 'Benzină' }
  ];
  // Expose to window pentru cross-module sync (angajati ↔ utilaje)
  window.UTILAJE_DB = UTILAJE_DB;
  window.MASINI_DB = MASINI_DB;
  window.MECANIZATORI = MECANIZATORI;
  // Helper: salveaza alocari in localStorage + actualizeaza in-memory
  window.setUtilajForMec = function(mecName, utilajName) {
    // Elibereaza utilajul curent al acestui mec
    UTILAJE_DB.forEach(function(u){ if (u.mec === mecName) u.mec = null; });
    // Aloca noul utilaj (si deplaseaza alt mec daca era)
    if (utilajName) {
      var u = UTILAJE_DB.find(function(x){ return x.name === utilajName; });
      if (u) u.mec = mecName;
    }
    _persistAssignments();
  };
  window.setMasinaForPerson = function(personName, masinaName) {
    MASINI_DB.forEach(function(m){ if (m.sofer === personName) m.sofer = null; });
    if (masinaName) {
      var m = MASINI_DB.find(function(x){ return x.name === masinaName; });
      if (m) m.sofer = personName;
    }
    _persistAssignments();
  };
  function _persistAssignments() {
    try {
      localStorage.setItem('utilaj-assignments', JSON.stringify({
        utilaje: UTILAJE_DB.map(function(u){ return { name: u.name, mec: u.mec }; }),
        masini:  MASINI_DB.map(function(m){ return { name: m.name, sofer: m.sofer }; })
      }));
    } catch(e) {}
  }
  // Restore persisted assignments (daca exista) peste defaults
  try {
    var saved = JSON.parse(localStorage.getItem('utilaj-assignments') || 'null');
    if (saved) {
      if (saved.utilaje) saved.utilaje.forEach(function(s){
        var u = UTILAJE_DB.find(function(x){ return x.name === s.name; });
        if (u) u.mec = s.mec;
      });
      if (saved.masini) saved.masini.forEach(function(s){
        var m = MASINI_DB.find(function(x){ return x.name === s.name; });
        if (m) m.sofer = s.sofer;
      });
    }
  } catch(e) {}

  // Agregate cu utilaj implicit + tip lucrare + normativ motorina/ha + mecanizator default
  var AGREGATE_LIST = [
    { name: 'Plug Lemken Juwel 7', utilaj: 'Tractor Case Puma 165', tip: 'Arat',          norm: 22, mec: 'Vasile Lungu' },
    { name: 'Grapa cu discuri',    utilaj: 'Tractor Case Puma 165', tip: 'Pregatire sol', norm: 14, mec: 'Vasile Lungu' },
    { name: 'Tavalug',             utilaj: 'Tractor Case Puma 165', tip: 'Pregatire sol', norm: 6,  mec: 'Vasile Lungu' },
    { name: 'Semanatoare ED 6000', utilaj: 'Tractor Case Puma 165', tip: 'Semanat',       norm: 8,  mec: 'Gheorghe Marin' },
    { name: 'Sprayer UF2002',      utilaj: 'Tractor JD 6130R',      tip: 'Erbicidare',    norm: 9,  mec: 'Ion Popescu' },
    { name: 'Sprayer UX5200',      utilaj: 'Tractor Case Puma 165', tip: 'Tratament',     norm: 10, mec: 'Gheorghe Marin' },
    { name: 'Distribuitor ZA-M',   utilaj: 'Tractor JD 6130R',      tip: 'Fertilizare',   norm: 6,  mec: 'Ion Popescu' },
    { name: 'Header grau 7m',      utilaj: 'Combina CR9.80',        tip: 'Recoltat',      norm: 18, mec: 'Ion Popescu' }
  ];

  var TIPURI_LUCRARE = ['Arat', 'Pregatire sol', 'Semanat', 'Erbicidare', 'Fertilizare', 'Fungicid', 'Insecticid', 'Tratament', 'Recoltat', 'Irigat', 'Altele'];

  window.quickLucrare = function () {
    closeFabSafe();
    if (typeof openDrawer !== 'function') return;

    // Reset state
    window._parcelaSelectors['cl-parcele'] = [];
    window._psCallbacks['cl-parcele'] = clOnParceleChange;
    window._clGrupuri = [{ agregate: [], utilaj: '', mec: '' }];
    window._clInputuri = [];
    window._clMode = 'viitoare';

    var html = '';
    // TABS: Lucrare viitoare / Lucrare efectuată
    html += '<div style="display:flex;gap:6px;margin-bottom:16px;padding:4px;background:var(--brand-surface);border-radius:12px;">';
    html += '<button type="button" id="cl-tab-viitoare-btn" onclick="clSetMode(\'viitoare\')" style="flex:1;padding:10px 10px;background:var(--brand-primary);color:#fff;border:none;border-radius:8px;font-size:13px;font-weight:700;cursor:pointer;font-family:inherit;line-height:1.3;"><i data-lucide="calendar"></i> Lucrare viitoare</button>';
    html += '<button type="button" id="cl-tab-efectuata-btn" onclick="clSetMode(\'efectuata\')" style="flex:1;padding:10px 10px;background:transparent;color:var(--brand-text-muted);border:none;border-radius:8px;font-size:13px;font-weight:700;cursor:pointer;font-family:inherit;line-height:1.3;"><i data-lucide="check"></i> Lucrare efectuată</button>';
    html += '</div>';

    // PARCELE (componentă reutilizabilă)
    html += parcelaSelectorHTML('cl-parcele', { label: 'Parcele', required: true });

    // TIP LUCRARE (auto-populated din agregat, editable)
    html += '<div class="form-group"><label class="form-label">Tip lucrare *</label>';
    html += '<select id="cl-tip-lucrare" class="form-select" onchange="this.dataset.manualOverride=\'1\'">';
    html += '<option value="">Se completează automat din agregat...</option>';
    TIPURI_LUCRARE.forEach(function(t){ html += '<option>' + t + '</option>'; });
    html += '</select></div>';

    // GRUPURI DE LUCRU (agregat + utilaj + mecanizator, multi)
    html += '<div class="form-group"><label class="form-label">Grupuri de lucru *</label>';
    html += '<div style="font-size:11px;color:var(--brand-text-muted);margin-bottom:6px;">Agregat &rarr; utilaj &rarr; mecanizator (se auto-completează)</div>';
    html += '<div id="cl-grupuri-rows"></div>';
    html += '<button type="button" onclick="clAddGrup()" style="width:100%;padding:10px;background:var(--brand-hover-bg);border:1.5px dashed var(--brand-primary);color:var(--brand-primary);border-radius:10px;font-size:14px;font-weight:700;cursor:pointer;font-family:inherit;">+ Adaugă grup</button>';
    html += '</div>';

    // AUTO-CALC box (suprafață + motorină total)
    html += '<div id="cl-auto-box" style="display:none;padding:12px;background:var(--brand-hover-bg);border-left:3px solid var(--brand-primary);border-radius:8px;margin-bottom:14px;">';
    html += '<div style="font-size:11px;font-weight:800;color:var(--brand-primary);text-transform:uppercase;letter-spacing:0.5px;margin-bottom:8px;">Calcul automat</div>';
    html += '<div id="cl-auto-content" style="font-size:13px;line-height:1.6;"></div>';
    html += '</div>';

    // INPUTURI (motorină auto + search manual)
    html += '<div class="form-group"><label class="form-label">Inputuri</label>';
    html += '<div id="cl-inputuri-rows"></div>';
    html += '<div style="position:relative;">';
    html += '<input id="cl-input-search" class="form-input" placeholder="Tap pentru listă stoc sau scrie..." oninput="clInputSearch(this.value)" onfocus="clInputSearch(this.value)" autocomplete="off">';
    html += '<div id="cl-input-results" style="display:none;position:absolute;top:100%;left:0;right:0;background:#fff;border:1px solid var(--brand-border);border-radius:8px;max-height:220px;overflow-y:auto;overflow-x:hidden;z-index:4;box-shadow:0 4px 14px rgba(0,0,0,0.12);margin-top:2px;"></div>';
    html += '</div></div>';

    // DATA lucrării (doar pentru efectuată)
    html += '<div id="cl-date-section" class="form-group" style="display:none;"><label class="form-label">Data lucrării *</label><input type="date" class="form-input" value="2026-04-20"></div>';

    // FOTO / VIDEO (doar pentru efectuată)
    html += '<div id="cl-photo-section" class="form-group" style="display:none;"><label class="form-label">Foto / Video</label>';
    html += '<label for="cl-media" style="display:flex;align-items:center;gap:8px;padding:12px;border:1.5px dashed var(--brand-border);border-radius:10px;cursor:pointer;font-size:14px;color:var(--brand-text-muted);justify-content:center;"><span style="font-size:18px;"><i data-lucide="camera"></i></span> <span id="cl-media-lbl">Adaugă foto / video</span></label>';
    html += '<input id="cl-media" type="file" accept="image/*,video/*" multiple style="display:none;" onchange="clMediaChange(this)">';
    html += '</div>';

    // OBSERVATII (doar pentru efectuată)
    html += '<div id="cl-text-section" class="form-group" style="display:none;"><label class="form-label">Observații</label><textarea class="form-textarea" placeholder="Note..."></textarea></div>';

    openDrawer('Creează lucrare', html, [
      { label: 'Anulează', class: 'btn-secondary', action: closeDrawer },
      { label: 'Salvează', class: 'btn-primary', action: clSave }
    ]);

    renderClGrupuri();
    updateClAutoBox();
  };

  function clOnParceleChange() {
    updateClAutoBox();
    ensureMotorineInput();
  }

  window.clSetMode = function (mode) {
    window._clMode = mode;
    var vb = document.getElementById('cl-tab-viitoare-btn');
    var eb = document.getElementById('cl-tab-efectuata-btn');
    if (mode === 'viitoare') {
      if (vb) { vb.style.background = 'var(--brand-primary)'; vb.style.color = '#fff'; }
      if (eb) { eb.style.background = 'transparent'; eb.style.color = 'var(--brand-text-muted)'; }
    } else {
      if (eb) { eb.style.background = 'var(--brand-primary)'; eb.style.color = '#fff'; }
      if (vb) { vb.style.background = 'transparent'; vb.style.color = 'var(--brand-text-muted)'; }
    }
    // Toggle secțiuni (foto + text + date doar pt efectuată)
    ['cl-photo-section', 'cl-date-section', 'cl-text-section'].forEach(function(id) {
      var el = document.getElementById(id);
      if (el) el.style.display = mode === 'efectuata' ? '' : 'none';
    });
  };

  window.clSave = function () {
    closeDrawer();
    var mode = window._clMode;
    if (mode === 'viitoare') {
      var mecs = (window._clGrupuri || []).map(function(g){ return g.mec; }).filter(function(m){ return m; });
      var uniqueMecs = Array.from(new Set(mecs));
      if (typeof showToast === 'function') showToast('success', uniqueMecs.length ? 'Task trimis către: ' + uniqueMecs.join(', ') : 'Lucrare creată.');
    } else {
      if (typeof showToast === 'function') showToast('success', 'Lucrare salvată (istoric).');
    }
  };

  // ===== GRUPURI (agregate MULTI + utilaj + mecanizator) =====
  function renderClGrupuri() {
    var wrap = document.getElementById('cl-grupuri-rows');
    if (!wrap) return;
    var grupuri = window._clGrupuri || [];
    var html = '';
    grupuri.forEach(function(g, i) {
      var agregate = g.agregate || [];
      html += '<div style="background:#fff;border:1px solid var(--brand-border);border-radius:10px;padding:10px;margin-bottom:8px;">';
      html += '<div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:8px;">';
      html += '<span style="font-size:12px;font-weight:800;color:var(--brand-primary);text-transform:uppercase;letter-spacing:0.3px;">Grup ' + (i+1) + '</span>';
      if (grupuri.length > 1) {
        html += '<button type="button" onclick="clRemoveGrup(' + i + ')" style="width:28px;height:28px;background:transparent;border:1px solid var(--brand-border);border-radius:6px;cursor:pointer;color:var(--brand-danger);font-size:14px;font-family:inherit;">&times;</button>';
      } else { html += '<span></span>'; }
      html += '</div>';
      // AGREGATE (chips + select pentru adăugare)
      html += '<label style="display:block;font-size:10px;font-weight:700;color:var(--brand-text-muted);text-transform:uppercase;letter-spacing:0.3px;margin-bottom:4px;">Agregate (se pot combina)</label>';
      if (agregate.length) {
        html += '<div style="display:flex;flex-wrap:wrap;gap:4px;margin-bottom:6px;">';
        agregate.forEach(function(aName, aIdx) {
          var primaryBadge = aIdx === 0 ? '<span style="background:var(--brand-primary);color:#fff;padding:1px 5px;border-radius:6px;font-size:9px;font-weight:800;margin-right:4px;">1</span>' : '';
          html += '<div style="display:inline-flex;align-items:center;gap:4px;padding:5px 10px;background:var(--brand-primary-20);color:var(--brand-primary);border-radius:100px;font-size:12px;font-weight:700;">' + primaryBadge + aName + ' <span onclick="clGrupRemoveAgregat(' + i + ', \'' + aName.replace(/'/g, "\\'") + '\')" style="cursor:pointer;font-weight:900;opacity:0.7;margin-left:2px;">&times;</span></div>';
        });
        html += '</div>';
      }
      // Select pentru a adăuga agregat (exclude cele deja adăugate)
      var availableAgg = AGREGATE_LIST.filter(function(a){ return agregate.indexOf(a.name) < 0; });
      if (availableAgg.length) {
        html += '<select onchange="clGrupAddAgregat(' + i + ', this.value); this.value=\'\';" class="form-select" style="margin-bottom:8px;">';
        html += '<option value="">' + (agregate.length ? '+ Adaugă agregat...' : 'Selectează agregat...') + '</option>';
        availableAgg.forEach(function(a){ html += '<option value="' + a.name + '">' + a.name + ' (' + a.tip + ')</option>'; });
        html += '</select>';
      }
      // Utilaj (auto din primul agregat, editable)
      html += '<label style="display:block;font-size:10px;font-weight:700;color:var(--brand-text-muted);text-transform:uppercase;letter-spacing:0.3px;margin-bottom:2px;">Utilaj <span style="color:var(--brand-primary);">(auto din primul agregat)</span></label>';
      html += '<select onchange="clGrupChange(' + i + ', \'utilaj\', this.value)" class="form-select" style="margin-bottom:8px;">';
      html += '<option value="">Selectează...</option>';
      UTILAJE_DB.forEach(function(u){ html += '<option' + (g.utilaj === u.name ? ' selected' : '') + '>' + u.name + '</option>'; });
      html += '</select>';
      // Mecanizator
      html += '<label style="display:block;font-size:10px;font-weight:700;color:var(--brand-text-muted);text-transform:uppercase;letter-spacing:0.3px;margin-bottom:2px;">Mecanizator</label>';
      html += '<select onchange="clGrupChange(' + i + ', \'mec\', this.value)" class="form-select">';
      html += '<option value="">Selectează...</option>';
      MECANIZATORI.forEach(function(m){ html += '<option' + (g.mec === m ? ' selected' : '') + '>' + m + '</option>'; });
      html += '</select>';
      html += '</div>';
    });
    wrap.innerHTML = html;
  }

  window.clAddGrup = function () {
    window._clGrupuri = window._clGrupuri || [];
    window._clGrupuri.push({ agregate: [], utilaj: '', mec: '' });
    renderClGrupuri();
    updateClAutoBox();
  };

  window.clRemoveGrup = function (i) {
    if (!window._clGrupuri) return;
    window._clGrupuri.splice(i, 1);
    if (!window._clGrupuri.length) window._clGrupuri.push({ agregate: [], utilaj: '', mec: '' });
    renderClGrupuri();
    updateClAutoBox();
    ensureMotorineInput();
  };

  // Adaugă agregat în grup + auto-set utilaj/mec/tip lucrare din primul agregat
  window.clGrupAddAgregat = function (i, agregatName) {
    if (!agregatName) return;
    if (!window._clGrupuri || !window._clGrupuri[i]) return;
    var g = window._clGrupuri[i];
    g.agregate = g.agregate || [];
    if (g.agregate.indexOf(agregatName) >= 0) return;
    g.agregate.push(agregatName);
    // Dacă a devenit primul agregat (sau deja era primul adăugat) → setează utilaj + mec
    clAutoFromFirstAgregat(i);
    renderClGrupuri();
    updateClAutoBox();
    ensureMotorineInput();
  };

  window.clGrupRemoveAgregat = function (i, agregatName) {
    if (!window._clGrupuri || !window._clGrupuri[i]) return;
    var g = window._clGrupuri[i];
    g.agregate = (g.agregate || []).filter(function(n){ return n !== agregatName; });
    // Reauto-fill utilaj din noul primul agregat (dacă exista)
    clAutoFromFirstAgregat(i);
    renderClGrupuri();
    updateClAutoBox();
    ensureMotorineInput();
  };

  // Setează utilaj + mec + tip lucrare din primul agregat al grupului (mereu, override)
  function clAutoFromFirstAgregat(i) {
    var g = window._clGrupuri[i];
    if (!g) return;
    if (!g.agregate || !g.agregate.length) {
      g.utilaj = '';
      g.mec = '';
      return;
    }
    var a = AGREGATE_LIST.find(function(x){ return x.name === g.agregate[0]; });
    if (!a) return;
    g.utilaj = a.utilaj || '';
    g.mec = a.mec || '';
    // Tip lucrare global (doar din primul grup, cu override manual respectat)
    if (i === 0) {
      var tipSel = document.getElementById('cl-tip-lucrare');
      if (tipSel && !tipSel.dataset.manualOverride) tipSel.value = a.tip;
    }
  }

  window.clGrupChange = function (i, field, val) {
    if (!window._clGrupuri || !window._clGrupuri[i]) return;
    var g = window._clGrupuri[i];
    g[field] = val;
    // Schimbare manuala utilaj → update mec din UTILAJE_DB
    if (field === 'utilaj' && val) {
      var u = UTILAJE_DB.find(function(x){ return x.name === val; });
      if (u && u.mec) g.mec = u.mec;
    }
    renderClGrupuri();
    updateClAutoBox();
    ensureMotorineInput();
  };

  function updateClAutoBox() {
    var box = document.getElementById('cl-auto-box');
    var content = document.getElementById('cl-auto-content');
    if (!box || !content) return;
    var grupuri = window._clGrupuri || [];
    var parcele = psGetSelected('cl-parcele');
    var firstG = grupuri.find(function(g){ return g.agregate && g.agregate.length; });
    if (!firstG || !parcele.length) { box.style.display = 'none'; return; }
    var a = AGREGATE_LIST.find(function(x){ return x.name === firstG.agregate[0]; });
    if (!a) { box.style.display = 'none'; return; }
    var totalHa = parcele.reduce(function(s, p){ return s + (p.ha || 0); }, 0);
    var motorina = Math.round(totalHa * a.norm);
    box.style.display = 'block';
    content.innerHTML =
      '<div style="display:flex;justify-content:space-between;padding:2px 0;"><span style="color:var(--brand-text-muted);">Suprafață totală</span><span style="font-weight:700;">' + totalHa.toFixed(1) + ' ha</span></div>' +
      '<div style="display:flex;justify-content:space-between;padding:2px 0;"><span style="color:var(--brand-text-muted);">Motorină (' + a.norm + ' L/ha &middot; primul agregat)</span><span style="font-weight:700;color:#8B4789;">' + motorina + ' L total</span></div>';
  }

  function ensureMotorineInput() {
    var grupuri = window._clGrupuri || [];
    var firstG = grupuri.find(function(g){ return g.agregate && g.agregate.length; });
    window._clInputuri = window._clInputuri || [];
    if (!firstG) {
      window._clInputuri = window._clInputuri.filter(function(x){ return !x.auto; });
      renderClInputuri();
      return;
    }
    var a = AGREGATE_LIST.find(function(x){ return x.name === firstG.agregate[0]; });
    if (!a) return;
    var idx = window._clInputuri.findIndex(function(x){ return x.auto; });
    var motorinaInput = { name: 'Motorină', doza: a.norm, um: 'L/ha', auto: true };
    if (idx >= 0) {
      window._clInputuri[idx] = motorinaInput;
    } else {
      window._clInputuri.unshift(motorinaInput);
    }
    renderClInputuri();
  }

  function renderClInputuri() {
    var wrap = document.getElementById('cl-inputuri-rows');
    if (!wrap) return;
    var inputuri = window._clInputuri || [];
    var html = '';
    inputuri.forEach(function(inp, i) {
      var bgColor = inp.auto ? 'var(--brand-hover-bg)' : '#fff';
      var autoBadge = inp.auto ? '<span style="background:var(--brand-primary);color:#fff;padding:1px 6px;border-radius:6px;font-size:9px;font-weight:800;margin-right:6px;">AUTO</span>' : '';
      html += '<div style="display:flex;gap:6px;margin-bottom:6px;align-items:center;padding:8px 10px;background:' + bgColor + ';border:1px solid var(--brand-border);border-radius:8px;">';
      html += '<div style="flex:2;font-size:14px;font-weight:600;color:var(--brand-text-primary);display:flex;align-items:center;">' + autoBadge + inp.name + '</div>';
      html += '<input class="form-input" type="number" step="0.01" style="flex:1;min-height:36px;padding:6px 8px;font-size:13px;" value="' + (inp.doza||'') + '" oninput="clUpdateInput(' + i + ', \'doza\', this.value)">';
      html += '<select class="form-select" style="flex:0 0 78px;min-height:36px;padding:4px 6px;font-size:13px;" onchange="clUpdateInput(' + i + ', \'um\', this.value)">';
      ['L/ha','ml/ha','kg/ha','g/ha','buc/ha','sem/m²'].forEach(function(u){ html += '<option' + (inp.um === u ? ' selected' : '') + '>' + u + '</option>'; });
      html += '</select>';
      if (!inp.auto) {
        html += '<button type="button" onclick="clRemoveInput(' + i + ')" style="width:32px;height:36px;background:transparent;border:1px solid var(--brand-border);border-radius:6px;cursor:pointer;color:var(--brand-danger);font-family:inherit;">&times;</button>';
      }
      html += '</div>';
    });
    wrap.innerHTML = html;
  }

  // Inputuri: sursa = STOCURI_DB (produse reale din ferma, cu doza recomandata)
  window.clInputSearch = function (q) {
    var res = document.getElementById('cl-input-results');
    if (!res) return;
    var src = (typeof STOCURI_DB !== 'undefined' && STOCURI_DB.length) ? STOCURI_DB : PRODUSE_DB;
    var matches;
    if (!q || q.length < 3) {
      // Tap = toate produsele din stoc, sortate: stoc > 0 primele, apoi alfabetic
      matches = src.slice().sort(function(a, b) {
        var aStoc = (a.stoc && a.stoc > 0) ? 1 : 0;
        var bStoc = (b.stoc && b.stoc > 0) ? 1 : 0;
        if (aStoc !== bStoc) return bStoc - aStoc;
        return a.name.localeCompare(b.name);
      });
    } else {
      var qLow = q.toLowerCase();
      matches = src.filter(function(p){ return p.name.toLowerCase().indexOf(qLow) >= 0; });
    }
    if (!matches.length) {
      res.innerHTML = '<div onclick="clPickInput(\'' + (q||'').replace(/'/g, "\\'") + '\',\'L\',null)" style="padding:12px;cursor:pointer;"><span style="color:var(--brand-warning);font-weight:700;">+ Adaugă produs nou:</span> <strong>' + (q||'') + '</strong></div>';
      res.style.display = 'block';
      return;
    }
    var html = '';
    matches.slice(0, 12).forEach(function(p) {
      var stocTxt = (p.stoc !== undefined) ? (p.stoc > 0 ? '<span style="color:var(--brand-success);font-weight:700;">' + p.stoc + ' ' + p.um + ' in stoc</span>' : '<span style="color:var(--brand-danger);font-weight:700;">stoc 0</span>') : '';
      var dozaRec = p.dozaRec ? '<span style="background:var(--brand-primary-20);color:var(--brand-primary);padding:1px 6px;border-radius:4px;font-size:10px;font-weight:700;margin-left:6px;">recom. ' + p.dozaRec + ' ' + p.um + '/ha</span>' : '';
      html += '<div onclick="clPickInput(\'' + p.name.replace(/'/g, "\\'") + '\',\'' + p.um + '\',' + (p.dozaRec || 'null') + ')" style="padding:10px 12px;cursor:pointer;border-bottom:1px solid #f0f0f0;">';
      html += '<div style="display:flex;justify-content:space-between;align-items:center;gap:6px;">';
      html += '<div style="font-size:14px;font-weight:600;color:var(--brand-text-primary);flex:1;">' + p.name + dozaRec + '</div>';
      html += '</div>';
      html += '<div style="font-size:12px;color:var(--brand-text-muted);margin-top:2px;display:flex;justify-content:space-between;gap:6px;"><span>' + p.cat + ' &middot; ' + p.tip + '</span>' + stocTxt + '</div>';
      html += '</div>';
    });
    res.innerHTML = html;
    res.style.display = 'block';
  };

  window.clPickInput = function (name, um, dozaRec) {
    window._clInputuri = window._clInputuri || [];
    var doza = (dozaRec !== null && dozaRec !== undefined && !isNaN(dozaRec)) ? dozaRec : '';
    window._clInputuri.push({ name: name, doza: doza, um: (um || 'L') + '/ha' });
    var inp = document.getElementById('cl-input-search');
    if (inp) inp.value = '';
    var res = document.getElementById('cl-input-results');
    if (res) res.style.display = 'none';
    renderClInputuri();
  };

  window.clRemoveInput = function (i) {
    if (window._clInputuri) window._clInputuri.splice(i, 1);
    renderClInputuri();
  };

  window.clUpdateInput = function (i, key, val) {
    if (!window._clInputuri || !window._clInputuri[i]) return;
    window._clInputuri[i][key] = val;
  };

  // Inchide dropdown input-search la click outside
  document.addEventListener('click', function (e) {
    var res = document.getElementById('cl-input-results');
    if (!res || res.style.display !== 'block') return;
    if (res.contains(e.target)) return;
    if (e.target.id === 'cl-input-search') return;
    res.style.display = 'none';
  });

  window.clMediaChange = function (inp) {
    if (!inp.files || !inp.files.length) return;
    var lbl = document.getElementById('cl-media-lbl');
    if (lbl) lbl.innerHTML = '<i data-lucide="check"></i> ' + inp.files.length + ' fișier' + (inp.files.length === 1 ? '' : 'e') + ' atașat' + (inp.files.length === 1 ? '' : 'e');
    var label = inp.previousElementSibling;
    if (label && label.tagName === 'LABEL') {
      label.style.borderStyle = 'solid';
      label.style.borderColor = 'var(--brand-primary)';
      label.style.background = 'var(--brand-hover-bg)';
      label.style.color = 'var(--brand-primary)';
    }
  };

  // ===== ARENDA DB (sursa: cardurile din arenda.html) =====
  var ARENDA_CARDS = [
    { name: 'Maria Ionescu',         ha: 15.0, imputerniciti: ['Ion Popescu', 'Vasile Lungu'], type: 'Arenda', status: 'Activ' },
    { name: 'Gheorghe Stanescu',     ha: 32.5, imputerniciti: ['Vasile Lungu'], type: 'Arenda', status: 'Activ' },
    { name: 'Elena Dragomir',        ha: 8.0,  imputerniciti: ['Ion Popescu'], type: 'Concesiune', status: 'Activ' },
    { name: 'Nicolae Barbu',         ha: 22.3, imputerniciti: ['Andrei Popa'], type: 'Arenda', status: 'Scadent' },
    { name: 'Primaria Timisoara',    ha: 45.0, imputerniciti: ['Ion Popescu', 'Andrei Popa', 'Vasile Lungu'], type: 'Concesiune', status: 'Activ' },
    { name: 'Ioana Marin',           ha: 12.7, imputerniciti: ['Vasile Lungu'], type: 'Arenda', status: 'Expirat' },
    { name: 'Dan Gheorghe',          ha: 5.5,  imputerniciti: ['Ion Popescu'], type: 'Schimb', status: 'Activ' },
    { name: 'Petru Moldovan',        ha: 18.9, imputerniciti: ['Andrei Popa', 'Ion Popescu'], type: 'Arenda', status: 'Scadent' },
    { name: 'Ana Popescu',           ha: 27.0, imputerniciti: ['Ion Popescu'], type: 'Arenda', status: 'Activ' },
    { name: 'Consiliul Local Lugoj', ha: 60.0, imputerniciti: ['Vasile Lungu'], type: 'Concesiune', status: 'Activ' },
    { name: 'Mihai Constantinescu',  ha: 9.3,  imputerniciti: ['Andrei Popa'], type: 'Comodat', status: 'Expirat' }
  ];

  // Construire automata a contractelor + persoanelor din ARENDA_CARDS
  var ARENDA_CONTRACTS = {};
  var ARENDA_PERSOANE = [];
  (function buildArendaData() {
    var propMap = {}, impMap = {};
    ARENDA_CARDS.forEach(function (card, idx) {
      var cid = 'c' + (idx + 1);
      var normaKgPerHa = 800;
      var totalKg = Math.round(card.ha * normaKgPerHa);
      var platitKg = 0;
      if (card.status === 'Scadent') platitKg = Math.round(totalKg * 0.3);
      ARENDA_CONTRACTS[cid] = {
        nr: 'AR-2025-' + String(idx + 1).padStart(3, '0'),
        ha: card.ha,
        norma: normaKgPerHa + ' kg grau/ha',
        terenuri: card.name + ' - parcele',
        proprietar: card.name,
        type: card.type,
        sezoane: { '2025-2026': { totalKg: totalKg, platitKg: platitKg, closed: card.status === 'Expirat' } }
      };
      // Proprietar
      if (!propMap[card.name]) {
        propMap[card.name] = { id: 'p_' + idx, name: card.name, type: 'proprietar', contracts: [] };
        ARENDA_PERSOANE.push(propMap[card.name]);
      }
      propMap[card.name].contracts.push(cid);
      // Imputerniciti
      (card.imputerniciti || []).forEach(function (imp) {
        if (!impMap[imp]) {
          impMap[imp] = { id: 'i_' + imp.replace(/\s+/g, '_'), name: imp, type: 'imputernicit', contracts: [], proprietari: [] };
          ARENDA_PERSOANE.push(impMap[imp]);
        }
        impMap[imp].contracts.push(cid);
        if (impMap[imp].proprietari.indexOf(card.name) < 0) impMap[imp].proprietari.push(card.name);
      });
    });
  })();
  var ARENDA_SEZOANE_ORDER = ['2025-2026', '2024-2025', '2023-2024'];
  var ARENDA_CURRENT_SEZON = '2025-2026';
  var PRODUSE_PRET_KG = { 'Grau': 1.25, 'Porumb': 1.05, 'Floarea soarelui': 2.80, 'Rapita': 2.40, 'Orz': 0.95, 'Soia': 3.10 };

  window.quickArendaPickup = function () {
    closeFabSafe();
    if (typeof openDrawer !== 'function') return;
    var html = '';
    // 1. Proprietar / Imputernicit - search
    html += '<div class="form-group"><label class="form-label">Proprietar / &Icirc;mputernicit *</label>';
    html += '<div style="position:relative;">';
    html += '<input id="ar-persoana" class="form-input" placeholder="Scrie min. 3 litere..." oninput="arPersoanaSearch(this.value)" autocomplete="off">';
    html += '<div id="ar-persoana-results" style="display:none;position:absolute;top:100%;left:0;right:0;background:#fff;border:1px solid var(--brand-border);border-radius:8px;max-height:220px;overflow-y:auto;overflow-x:hidden;z-index:5;box-shadow:0 4px 14px rgba(0,0,0,0.12);margin-top:2px;"></div>';
    html += '</div></div>';
    // 2. Contract (dropdown dinamic dupa selectie persoana)
    html += '<div class="form-group"><label class="form-label">Contract *</label>';
    html += '<select id="ar-contract" class="form-select" onchange="arContractChange()"><option value="">Selecteaza persoana mai intai...</option></select></div>';
    // 3. Sezon
    html += '<div class="form-group"><label class="form-label">Sezon *</label>';
    html += '<select id="ar-sezon" class="form-select" onchange="arRecalcSuma()"><option value="">Selecteaza contract...</option></select></div>';
    // 4. Suma ramasa (afisaj)
    html += '<div id="ar-suma-box" style="display:none;padding:14px;background:var(--brand-hover-bg);border-radius:12px;margin-bottom:14px;border-left:4px solid var(--brand-primary);">';
    html += '<div style="font-size:11px;font-weight:700;color:var(--brand-text-muted);text-transform:uppercase;letter-spacing:0.5px;margin-bottom:4px;">Ramas de incasat</div>';
    html += '<div id="ar-suma-val" style="font-size:24px;font-weight:800;color:var(--brand-primary);line-height:1;">0,00 RON</div>';
    html += '<div id="ar-suma-kg" style="font-size:13px;color:var(--brand-text-muted);margin-top:4px;font-weight:600;">&mdash; kg grau echivalent</div>';
    html += '</div>';
    // 5. Produs + cantitate + pret
    html += '<div style="display:flex;gap:8px;">';
    html += '<div class="form-group" style="flex:2;"><label class="form-label">Produs *</label>';
    html += '<select id="ar-produs" class="form-select" onchange="arProdusChange()"><option value="">Selecteaza...</option><option>Grau</option><option>Porumb</option><option>Floarea soarelui</option><option>Rapita</option><option>Orz</option><option>Soia</option></select></div>';
    html += '<div class="form-group" style="flex:1;"><label class="form-label">Pret/kg</label>';
    html += '<input id="ar-pret" class="form-input" readonly style="background:var(--brand-hover-bg);font-weight:700;color:var(--brand-primary);" value="&mdash;"></div>';
    html += '</div>';
    html += '<div class="form-group"><label class="form-label">Cantitate (kg) *</label>';
    html += '<input id="ar-cantitate" class="form-input" type="number" step="0.01" placeholder="Se completeaza dupa produs" oninput="arCantitateChange()"></div>';
    // 6. Valoare platita (live calc)
    html += '<div class="form-group"><label class="form-label">Valoare platita (echivalent)</label>';
    html += '<input id="ar-valoare" class="form-input" readonly style="background:var(--brand-hover-bg);font-weight:700;color:var(--brand-primary);" value="0,00 RON"></div>';
    // 6b. FISCALITATE (auto-calculat din Cod Fiscal art. 84)
    html += '<div id="ar-fiscal" style="display:none;padding:14px;background:var(--brand-surface);border-radius:12px;margin-bottom:14px;border:1px solid var(--brand-border);">';
    html += '<div style="font-size:11px;font-weight:800;color:var(--brand-text-muted);text-transform:uppercase;letter-spacing:0.6px;margin-bottom:10px;">Fiscalitate (Cod Fiscal art. 84)</div>';
    html += '<div style="display:flex;justify-content:space-between;padding:4px 0;font-size:14px;"><span style="color:var(--brand-text-muted);">Venit brut</span><span id="ar-f-brut" style="font-weight:700;color:var(--brand-text-primary);">0,00 RON</span></div>';
    html += '<div style="display:flex;justify-content:space-between;padding:4px 0;font-size:14px;"><span style="color:var(--brand-text-muted);">Cheltuieli forfetare 40%</span><span id="ar-f-chelt" style="font-weight:600;color:var(--brand-text-primary);">&minus;0,00</span></div>';
    html += '<div style="display:flex;justify-content:space-between;padding:4px 0;font-size:14px;border-top:1px solid var(--brand-border);margin-top:4px;padding-top:8px;"><span style="color:var(--brand-text-primary);font-weight:600;">Venit net impozabil</span><span id="ar-f-net" style="font-weight:700;color:var(--brand-text-primary);">0,00 RON</span></div>';
    html += '<div style="display:flex;justify-content:space-between;padding:4px 0;font-size:14px;"><span style="color:var(--brand-text-muted);">Impozit 10% (retinut la sursa)</span><span id="ar-f-imp" style="font-weight:600;color:var(--brand-danger);">&minus;0,00</span></div>';
    html += '<label style="display:flex;align-items:center;gap:8px;padding:8px 0;font-size:13px;cursor:pointer;border-top:1px solid var(--brand-border);margin-top:4px;"><input type="checkbox" id="ar-cass-check" onchange="arRecalcFiscal()" style="width:18px;height:18px;cursor:pointer;accent-color:var(--brand-primary);"><span>Peste plafon CASS (6 salarii minime/an)</span></label>';
    html += '<div id="ar-cass-row" style="display:none;justify-content:space-between;padding:4px 0;font-size:14px;"><span style="color:var(--brand-text-muted);">CASS 10%</span><span id="ar-f-cass" style="font-weight:600;color:var(--brand-danger);">&minus;0,00</span></div>';
    html += '<div style="display:flex;justify-content:space-between;padding:10px 12px;font-size:15px;background:var(--brand-primary);color:#fff;border-radius:8px;margin-top:8px;"><span style="font-weight:600;">Venit net de plata</span><span id="ar-f-total" style="font-weight:800;">0,00 RON</span></div>';
    html += '</div>';
    // 7. Data platii
    html += '<div class="form-group"><label class="form-label">Data platii *</label><input id="ar-data" type="date" class="form-input" value="2026-04-19"></div>';
    // 7b. Nr inmatriculare vehicul
    html += '<div class="form-group"><label class="form-label">Nr. &icirc;nmatriculare vehicul</label><input id="ar-vehicul" class="form-input" placeholder="ex: TM 12 ABC" style="text-transform:uppercase;"></div>';
    // 7c. Foto vehicul + placuta (optional)
    html += '<div class="form-group"><label class="form-label">Foto vehicul + placuta <span style="color:var(--brand-text-muted);font-weight:400;text-transform:none;">(optional)</span></label>';
    html += '<label for="ar-foto-vehicul" style="display:flex;align-items:center;gap:8px;padding:14px;border:1.5px dashed var(--brand-border);border-radius:10px;cursor:pointer;font-size:14px;color:var(--brand-text-muted);justify-content:center;"><span style="font-size:20px;"><i data-lucide="camera"></i></span> <span id="ar-foto-vehicul-lbl">Fa o poza la vehicul</span></label>';
    html += '<input id="ar-foto-vehicul" type="file" accept="image/*" capture="environment" style="display:none;" onchange="arFotoChange(this,\'vehicul\')">';
    html += '</div>';
    // 7d. Foto tichet cantar (optional)
    html += '<div class="form-group"><label class="form-label">Foto tichet cantar <span style="color:var(--brand-text-muted);font-weight:400;text-transform:none;">(optional)</span></label>';
    html += '<label for="ar-foto-tichet" style="display:flex;align-items:center;gap:8px;padding:14px;border:1.5px dashed var(--brand-border);border-radius:10px;cursor:pointer;font-size:14px;color:var(--brand-text-muted);justify-content:center;"><span style="font-size:20px;"><i data-lucide="camera"></i></span> <span id="ar-foto-tichet-lbl">Fa o poza la tichetul de cantar</span></label>';
    html += '<input id="ar-foto-tichet" type="file" accept="image/*" capture="environment" style="display:none;" onchange="arFotoChange(this,\'tichet\')">';
    html += '</div>';
    // 9. Observatii
    html += '<div class="form-group"><label class="form-label">Observatii</label><textarea class="form-textarea" placeholder="Note..."></textarea></div>';
    // 10. Bifa GDPR
    html += '<div class="form-group"><label style="display:flex;align-items:flex-start;gap:10px;cursor:pointer;padding:10px 12px;background:var(--brand-surface);border-radius:10px;font-size:13px;line-height:1.45;"><input type="checkbox" id="ar-gdpr" style="margin-top:2px;width:20px;height:20px;cursor:pointer;flex-shrink:0;accent-color:var(--brand-primary);"><span>Sunt de acord cu prelucrarea datelor cu caracter personal (CNP, semnatura, foto, GPS) conform <strong>GDPR</strong>, in scopul inregistrarii platii arendei.</span></label></div>';
    // 11. Semnatura digitala + GPS info (ULTIMUL)
    html += '<div class="form-group" style="margin-bottom:0;"><label class="form-label">Semnatura *</label>';
    html += '<div style="display:flex;align-items:center;gap:6px;padding:8px 12px;background:var(--brand-hover-bg);border-radius:8px;font-size:12px;color:var(--brand-primary);margin-bottom:8px;font-weight:600;"><span style="font-size:14px;"><i data-lucide="map-pin"></i></span> <span id="ar-gps">Locatia se capteaza automat la semnare</span></div>';
    html += '<div style="position:relative;">';
    html += '<canvas id="ar-signature" width="280" height="120" style="display:block;width:100%;height:120px;background:#fff;border:2px dashed var(--brand-border);border-radius:10px;touch-action:none;cursor:crosshair;"></canvas>';
    html += '<div id="ar-sig-placeholder" style="position:absolute;inset:0;display:flex;align-items:center;justify-content:center;color:var(--brand-text-muted);font-size:13px;pointer-events:none;">Semneaza cu degetul aici</div>';
    html += '</div>';
    html += '<button type="button" onclick="arClearSignature()" style="margin-top:6px;padding:6px 14px;background:transparent;border:1px solid var(--brand-border);border-radius:8px;font-size:13px;font-weight:600;cursor:pointer;color:var(--brand-text-muted);font-family:inherit;"><i data-lucide="refresh-ccw"></i> Sterge semnatura</button>';
    html += '</div>';

    openDrawer('Ridicare arenda (produse)', html, [
      { label: 'Preview doc.', class: 'btn-secondary', action: arPreviewDoc },
      { label: 'Salveaza', class: 'btn-primary', action: function(){ closeDrawer(); if (typeof showToast === 'function') showToast('success', 'Inregistrat. Document trimis la birou pentru FF + aviz.'); } }
    ]);
    window._arGpsCaptured = false; // reset GPS la fiecare deschidere
    window._arSignTimestamp = null;
    window._arSignLat = null; window._arSignLng = null;
    setTimeout(arInitSignature, 100);
  };

  // Preview document pre-generat (baza pt FF + aviz la birou)
  window.arPreviewDoc = function () {
    var persoana = document.getElementById('ar-persoana').value || '—';
    var contractSel = document.getElementById('ar-contract');
    var cid = contractSel && contractSel.value;
    var contract = cid ? ARENDA_CONTRACTS[cid] : null;
    var sezon = (document.getElementById('ar-sezon') || {}).value || '—';
    var prod = (document.getElementById('ar-produs') || {}).value || '—';
    var cant = (document.getElementById('ar-cantitate') || {}).value || '0';
    var pret = prod ? (PRODUSE_PRET_KG[prod] || 0) : 0;
    var venitBrut = (parseFloat(cant) || 0) * pret;
    var cheltuieli = venitBrut * 0.4;
    var netImp = venitBrut - cheltuieli;
    var impozit = netImp * 0.10;
    var cass = (document.getElementById('ar-cass-check') && document.getElementById('ar-cass-check').checked) ? netImp * 0.10 : 0;
    var netPlata = venitBrut - impozit - cass;
    var data = (document.getElementById('ar-data') || {}).value || '';
    var vehicul = (document.getElementById('ar-vehicul') || {}).value || '—';
    var gpsCoords = (window._arSignLat && window._arSignLng) ? (window._arSignLat + ', ' + window._arSignLng) : 'necaptat';
    var gpsTime = window._arSignTimestamp ? new Date(window._arSignTimestamp).toLocaleString('ro-RO') : 'necaptat';

    var screen = document.querySelector('.phone-screen');
    if (!screen) return;
    var ex = document.getElementById('ar-preview-overlay');
    if (ex) ex.remove();
    var ov = document.createElement('div');
    ov.id = 'ar-preview-overlay';
    ov.style.cssText = 'position:absolute;inset:0;background:rgba(0,0,0,0.6);z-index:100;display:flex;align-items:center;justify-content:center;padding:16px;';
    ov.onclick = function(e){ if (e.target === ov) ov.remove(); };
    var rowStyle = 'display:flex;justify-content:space-between;padding:5px 0;font-size:13px;gap:10px;';
    var labelS = 'color:var(--brand-text-muted);flex-shrink:0;';
    var valS = 'font-weight:700;color:var(--brand-text-primary);text-align:right;';
    ov.innerHTML =
      '<div style="background:#fff;width:100%;max-width:340px;max-height:90%;border-radius:16px;overflow:hidden;display:flex;flex-direction:column;">' +
        '<div style="padding:14px 16px;background:var(--brand-primary);color:#fff;display:flex;justify-content:space-between;align-items:center;flex-shrink:0;">' +
          '<div><div style="font-size:11px;opacity:0.8;text-transform:uppercase;letter-spacing:0.5px;">Document ridicare arenda</div><div style="font-size:15px;font-weight:700;margin-top:2px;">Preview</div></div>' +
          '<button onclick="document.getElementById(\'ar-preview-overlay\').remove()" style="width:32px;height:32px;background:rgba(255,255,255,0.2);border:none;color:#fff;border-radius:50%;cursor:pointer;font-size:16px;">&times;</button>' +
        '</div>' +
        '<div style="padding:16px;overflow-y:auto;flex:1;">' +
          '<div style="font-size:11px;font-weight:800;color:var(--brand-text-muted);text-transform:uppercase;letter-spacing:0.5px;margin-bottom:6px;">Parti</div>' +
          '<div style="' + rowStyle + '"><span style="' + labelS + '">Proprietar/imp.</span><span style="' + valS + '">' + persoana + '</span></div>' +
          '<div style="' + rowStyle + '"><span style="' + labelS + '">Contract</span><span style="' + valS + '">' + (contract ? contract.nr : '—') + '</span></div>' +
          '<div style="' + rowStyle + '"><span style="' + labelS + '">Teren</span><span style="' + valS + '">' + (contract ? contract.ha + ' ha' : '—') + '</span></div>' +
          '<div style="' + rowStyle + '"><span style="' + labelS + '">Sezon</span><span style="' + valS + '">' + sezon + '</span></div>' +
          '<div style="height:1px;background:var(--brand-border);margin:10px 0;"></div>' +
          '<div style="font-size:11px;font-weight:800;color:var(--brand-text-muted);text-transform:uppercase;letter-spacing:0.5px;margin-bottom:6px;">Produs predat</div>' +
          '<div style="' + rowStyle + '"><span style="' + labelS + '">Produs</span><span style="' + valS + '">' + prod + '</span></div>' +
          '<div style="' + rowStyle + '"><span style="' + labelS + '">Cantitate</span><span style="' + valS + '">' + cant + ' kg</span></div>' +
          '<div style="' + rowStyle + '"><span style="' + labelS + '">Pret/kg</span><span style="' + valS + '">' + fmt(pret) + ' RON</span></div>' +
          '<div style="height:1px;background:var(--brand-border);margin:10px 0;"></div>' +
          '<div style="font-size:11px;font-weight:800;color:var(--brand-text-muted);text-transform:uppercase;letter-spacing:0.5px;margin-bottom:6px;">Fiscalitate (auto)</div>' +
          '<div style="' + rowStyle + '"><span style="' + labelS + '">Venit brut</span><span style="' + valS + '">' + fmt(venitBrut) + ' RON</span></div>' +
          '<div style="' + rowStyle + '"><span style="' + labelS + '">Chelt. forfetare 40%</span><span style="' + valS + '">&minus;' + fmt(cheltuieli) + '</span></div>' +
          '<div style="' + rowStyle + '"><span style="' + labelS + '">Venit net impozabil</span><span style="' + valS + '">' + fmt(netImp) + ' RON</span></div>' +
          '<div style="' + rowStyle + '"><span style="' + labelS + '">Impozit 10%</span><span style="' + valS + 'color:var(--brand-danger);">&minus;' + fmt(impozit) + '</span></div>' +
          (cass > 0 ? '<div style="' + rowStyle + '"><span style="' + labelS + '">CASS 10%</span><span style="' + valS + 'color:var(--brand-danger);">&minus;' + fmt(cass) + '</span></div>' : '') +
          '<div style="' + rowStyle + 'background:var(--brand-primary);color:#fff;padding:10px 12px;border-radius:8px;margin-top:8px;"><span style="color:#fff;font-weight:600;">Venit net de plata</span><span style="font-weight:800;color:#fff;">' + fmt(netPlata) + ' RON</span></div>' +
          '<div style="height:1px;background:var(--brand-border);margin:10px 0;"></div>' +
          '<div style="font-size:11px;font-weight:800;color:var(--brand-text-muted);text-transform:uppercase;letter-spacing:0.5px;margin-bottom:6px;">Ridicare</div>' +
          '<div style="' + rowStyle + '"><span style="' + labelS + '">Data</span><span style="' + valS + '">' + data + '</span></div>' +
          '<div style="' + rowStyle + '"><span style="' + labelS + '">Vehicul</span><span style="' + valS + '">' + vehicul + '</span></div>' +
          '<div style="' + rowStyle + '"><span style="' + labelS + '">Semnat la</span><span style="' + valS + 'font-size:12px;">' + gpsTime + '</span></div>' +
          '<div style="' + rowStyle + '"><span style="' + labelS + '">Locatie GPS</span><span style="' + valS + 'font-size:11px;">' + gpsCoords + '</span></div>' +
          '<div style="margin-top:14px;padding:10px 12px;background:var(--brand-warning-bg);border-left:3px solid var(--brand-warning);border-radius:6px;font-size:12px;line-height:1.45;color:var(--brand-text-primary);">Acest document sta la baza emiterii <strong>Facturii Fiscale</strong> si a <strong>Avizului de insotire</strong> la birou.</div>' +
        '</div>' +
      '</div>';
    screen.appendChild(ov);
  };

  // ===== ARENDA helpers =====
  window.arPersoanaSearch = function (q) {
    var results = document.getElementById('ar-persoana-results');
    if (!results) return;
    if (!q || q.length < 3) { results.style.display = 'none'; return; }
    var qLow = q.toLowerCase();
    var matches = ARENDA_PERSOANE.filter(function (p) { return p.name.toLowerCase().indexOf(qLow) >= 0; });
    if (matches.length === 0) {
      results.innerHTML = '<div style="padding:12px;color:var(--brand-text-muted);font-size:14px;">Nicio persoana gasita</div>';
      results.style.display = 'block';
      return;
    }
    var html = '';
    matches.slice(0, 10).forEach(function (p) {
      var roleBadge = p.type === 'imputernicit' ? '<span style="font-size:10px;background:var(--brand-warning-bg);color:var(--brand-warning);padding:2px 6px;border-radius:6px;font-weight:700;margin-left:6px;">&Icirc;MPUTERNICIT</span>' : '';
      var subtext;
      if (p.type === 'imputernicit') {
        var props = p.proprietari || [];
        subtext = props.length === 1 ? 'pt. ' + props[0] : 'pt. ' + props.length + ' proprietari (' + props.slice(0,2).join(', ') + (props.length > 2 ? '...' : '') + ')';
      } else {
        subtext = p.contracts.length + ' contract' + (p.contracts.length === 1 ? '' : 'e');
      }
      html += '<div onclick="arPersoanaPick(\'' + p.id + '\')" style="padding:10px 12px;cursor:pointer;border-bottom:1px solid #f0f0f0;">';
      html += '<div style="font-size:14px;font-weight:600;color:var(--brand-text-primary);display:flex;align-items:center;"><i data-lucide="user"></i> ' + p.name + roleBadge + '</div>';
      html += '<div style="font-size:12px;color:var(--brand-text-muted);margin-top:2px;">' + subtext + '</div>';
      html += '</div>';
    });
    results.innerHTML = html;
    results.style.display = 'block';
  };

  window.arPersoanaPick = function (id) {
    var persoana = ARENDA_PERSOANE.find(function (p) { return p.id === id; });
    if (!persoana) return;
    var inp = document.getElementById('ar-persoana');
    var res = document.getElementById('ar-persoana-results');
    if (inp) inp.value = persoana.name;
    if (res) res.style.display = 'none';
    // Popule contract dropdown
    var contractSel = document.getElementById('ar-contract');
    if (contractSel) {
      var html = '<option value="">Selecteaza contract...</option>';
      persoana.contracts.forEach(function (cid) {
        var c = ARENDA_CONTRACTS[cid];
        if (!c) return;
        var label = c.proprietar + ' &middot; ' + c.nr + ' &middot; ' + c.ha + ' ha';
        html += '<option value="' + cid + '">' + label + '</option>';
      });
      contractSel.innerHTML = html;
    }
    var sezSel = document.getElementById('ar-sezon');
    if (sezSel) sezSel.innerHTML = '<option value="">Selecteaza contract...</option>';
    document.getElementById('ar-suma-box').style.display = 'none';
  };

  window.arContractChange = function () {
    var cid = document.getElementById('ar-contract').value;
    var sezSel = document.getElementById('ar-sezon');
    if (!sezSel) return;
    if (!cid) { sezSel.innerHTML = '<option value="">Selecteaza contract...</option>'; return; }
    var contract = ARENDA_CONTRACTS[cid];
    if (!contract) return;
    // Doar sezoanele neinchise
    var html = '';
    var foundCurrent = false;
    ARENDA_SEZOANE_ORDER.forEach(function (s) {
      var sezData = contract.sezoane[s];
      if (!sezData || sezData.closed) return;
      var lbl = s + (s === ARENDA_CURRENT_SEZON ? ' (curent)' : '');
      var sel = s === ARENDA_CURRENT_SEZON ? ' selected' : '';
      if (s === ARENDA_CURRENT_SEZON) foundCurrent = true;
      html += '<option value="' + s + '"' + sel + '>' + lbl + '</option>';
    });
    if (!html) html = '<option value="">Niciun sezon neinchis</option>';
    sezSel.innerHTML = html;
    arRecalcSuma();
  };

  window.arRecalcSuma = function () {
    var cid = document.getElementById('ar-contract').value;
    var sezon = document.getElementById('ar-sezon').value;
    var box = document.getElementById('ar-suma-box');
    if (!cid || !sezon) { if (box) box.style.display = 'none'; return; }
    var contract = ARENDA_CONTRACTS[cid];
    if (!contract) return;
    var sezData = contract.sezoane[sezon];
    if (!sezData) return;
    var ramasKg = sezData.totalKg - sezData.platitKg;
    var pretGrau = PRODUSE_PRET_KG['Grau'];
    var ramasRON = ramasKg * pretGrau;
    document.getElementById('ar-suma-val').textContent = ramasRON.toLocaleString('ro-RO', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + ' RON';
    document.getElementById('ar-suma-kg').textContent = ramasKg.toLocaleString('ro-RO') + ' kg grau echivalent';
    if (box) box.style.display = 'block';
    // Recalculeaza cantitate daca e produs selectat
    arProdusChange();
  };

  window.arProdusChange = function () {
    var prod = document.getElementById('ar-produs').value;
    var pretEl = document.getElementById('ar-pret');
    var cantEl = document.getElementById('ar-cantitate');
    if (!prod) { if (pretEl) pretEl.value = '—'; return; }
    var pret = PRODUSE_PRET_KG[prod] || 0;
    if (pretEl) pretEl.value = pret.toFixed(2).replace('.', ',') + ' RON';
    // Auto-cantitate = suma ramasa / pret produs
    var cid = document.getElementById('ar-contract').value;
    var sezon = document.getElementById('ar-sezon').value;
    if (cid && sezon) {
      var c = ARENDA_CONTRACTS[cid];
      var sezData = c && c.sezoane[sezon];
      if (sezData) {
        var ramasKgGrau = sezData.totalKg - sezData.platitKg;
        var ramasRON = ramasKgGrau * PRODUSE_PRET_KG['Grau'];
        var cantitate = ramasRON / pret;
        if (cantEl) cantEl.value = cantitate.toFixed(2);
      }
    }
    arCantitateChange();
  };

  window.arCantitateChange = function () {
    var prod = document.getElementById('ar-produs').value;
    var cant = parseFloat(document.getElementById('ar-cantitate').value) || 0;
    var pret = PRODUSE_PRET_KG[prod] || 0;
    var val = cant * pret;
    var valEl = document.getElementById('ar-valoare');
    if (valEl) valEl.value = val.toLocaleString('ro-RO', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + ' RON';
    arRecalcFiscal();
  };

  function fmt(n) { return n.toLocaleString('ro-RO', { minimumFractionDigits: 2, maximumFractionDigits: 2 }); }

  window.arRecalcFiscal = function () {
    var prod = document.getElementById('ar-produs').value;
    var cant = parseFloat(document.getElementById('ar-cantitate').value) || 0;
    var pret = PRODUSE_PRET_KG[prod] || 0;
    var venitBrut = cant * pret;
    var box = document.getElementById('ar-fiscal');
    if (!box) return;
    if (venitBrut <= 0) { box.style.display = 'none'; return; }
    box.style.display = 'block';
    var cheltuieli = venitBrut * 0.4;
    var netImpozabil = venitBrut - cheltuieli;
    var impozit = netImpozabil * 0.10;
    var cassCheck = document.getElementById('ar-cass-check');
    var cassRow = document.getElementById('ar-cass-row');
    var cass = 0;
    if (cassCheck && cassCheck.checked) {
      cass = netImpozabil * 0.10;
      if (cassRow) cassRow.style.display = 'flex';
    } else {
      if (cassRow) cassRow.style.display = 'none';
    }
    var netPlata = venitBrut - impozit - cass;

    document.getElementById('ar-f-brut').textContent = fmt(venitBrut) + ' RON';
    document.getElementById('ar-f-chelt').textContent = '\u2212' + fmt(cheltuieli);
    document.getElementById('ar-f-net').textContent = fmt(netImpozabil) + ' RON';
    document.getElementById('ar-f-imp').textContent = '\u2212' + fmt(impozit);
    document.getElementById('ar-f-cass').textContent = '\u2212' + fmt(cass);
    document.getElementById('ar-f-total').textContent = fmt(netPlata) + ' RON';
  };

  // ===== SIGNATURE canvas =====
  var _sigState = { drawing: false, lastX: 0, lastY: 0, ctx: null, canvas: null };

  window.arInitSignature = function () {
    var canvas = document.getElementById('ar-signature');
    if (!canvas) return;
    // Scale for retina
    var dpr = window.devicePixelRatio || 1;
    var rect = canvas.getBoundingClientRect();
    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    var ctx = canvas.getContext('2d');
    ctx.scale(dpr, dpr);
    ctx.strokeStyle = '#0D2626';
    ctx.lineWidth = 2.2;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    _sigState.ctx = ctx;
    _sigState.canvas = canvas;

    function getPos(e) {
      var r = canvas.getBoundingClientRect();
      if (e.touches && e.touches[0]) return { x: e.touches[0].clientX - r.left, y: e.touches[0].clientY - r.top };
      return { x: e.clientX - r.left, y: e.clientY - r.top };
    }
    function start(e) {
      e.preventDefault();
      _sigState.drawing = true;
      var p = getPos(e);
      _sigState.lastX = p.x; _sigState.lastY = p.y;
      var ph = document.getElementById('ar-sig-placeholder');
      if (ph) ph.style.display = 'none';
      canvas.style.borderStyle = 'solid';
      canvas.style.borderColor = 'var(--brand-primary)';
      // Captura GPS + timestamp la primul touch (daca nu s-a captat deja)
      if (!window._arGpsCaptured) {
        window._arGpsCaptured = true;
        var now = new Date();
        var ts = ('0'+now.getDate()).slice(-2) + '.' + ('0'+(now.getMonth()+1)).slice(-2) + '.' + now.getFullYear() + ' ' + ('0'+now.getHours()).slice(-2) + ':' + ('0'+now.getMinutes()).slice(-2) + ':' + ('0'+now.getSeconds()).slice(-2);
        window._arSignTimestamp = now.toISOString();
        var gpsEl = document.getElementById('ar-gps');
        if (gpsEl) gpsEl.textContent = 'Locatie: se incarca...';
        var setGps = function (lat, lng, demo) {
          if (!gpsEl) return;
          window._arSignLat = lat; window._arSignLng = lng;
          gpsEl.innerHTML = '<strong>' + lat + ', ' + lng + '</strong><br><span style="font-size:11px;font-weight:500;">' + ts + (demo ? ' &middot; demo' : '') + '</span>';
        };
        if (navigator.geolocation) {
          navigator.geolocation.getCurrentPosition(function (pos) {
            setGps(pos.coords.latitude.toFixed(5), pos.coords.longitude.toFixed(5), false);
          }, function () {
            setGps('45.74894', '21.20866', true);
          }, { timeout: 5000 });
        } else {
          setGps('45.74894', '21.20866', true);
        }
      }
    }
    function move(e) {
      if (!_sigState.drawing) return;
      e.preventDefault();
      var p = getPos(e);
      ctx.beginPath();
      ctx.moveTo(_sigState.lastX, _sigState.lastY);
      ctx.lineTo(p.x, p.y);
      ctx.stroke();
      _sigState.lastX = p.x; _sigState.lastY = p.y;
    }
    function stop() { _sigState.drawing = false; }

    canvas.addEventListener('mousedown', start);
    canvas.addEventListener('mousemove', move);
    canvas.addEventListener('mouseup', stop);
    canvas.addEventListener('mouseleave', stop);
    canvas.addEventListener('touchstart', start);
    canvas.addEventListener('touchmove', move);
    canvas.addEventListener('touchend', stop);
  };

  window.arFotoChange = function (inp, tip) {
    if (!inp || !inp.files || !inp.files[0]) return;
    var lbl = document.getElementById('ar-foto-' + tip + '-lbl');
    var name = inp.files[0].name;
    if (lbl) lbl.innerHTML = '<i data-lucide="check"></i> ' + name;
    var container = inp.previousElementSibling;
    if (container && container.tagName === 'LABEL') {
      container.style.borderStyle = 'solid';
      container.style.borderColor = 'var(--brand-primary)';
      container.style.background = 'var(--brand-hover-bg)';
      container.style.color = 'var(--brand-primary)';
    }
  };

  window.arClearSignature = function () {
    if (_sigState.ctx && _sigState.canvas) {
      var r = _sigState.canvas.getBoundingClientRect();
      _sigState.ctx.clearRect(0, 0, r.width, r.height);
    }
    var ph = document.getElementById('ar-sig-placeholder');
    if (ph) ph.style.display = 'flex';
    if (_sigState.canvas) {
      _sigState.canvas.style.borderStyle = 'dashed';
      _sigState.canvas.style.borderColor = 'var(--brand-border)';
    }
  };

  // Inchide ar-persoana-results la click outside
  document.addEventListener('click', function (e) {
    var res = document.getElementById('ar-persoana-results');
    if (!res || res.style.display !== 'block') return;
    if (res.contains(e.target)) return;
    if (e.target.id === 'ar-persoana') return;
    res.style.display = 'none';
  });

  window.openTaskAlert = function () {
    if (typeof openDrawer !== 'function') return;
    var html = '';
    // Segmented: Task / Reminder / Alarma
    html += '<div style="display:flex;gap:6px;margin-bottom:16px;">';
    html += '<div class="tf-seg-btn" data-type="task" onclick="tfSelectType(\'task\')" style="flex:1;padding:12px 6px;border:2px solid var(--brand-primary);background:var(--brand-hover-bg);border-radius:10px;cursor:pointer;text-align:center;font-weight:700;font-size:12px;color:var(--brand-primary);line-height:1.3;"><div style="font-size:22px;margin-bottom:4px;"><i data-lucide="file-pen"></i></div>Task</div>';
    html += '<div class="tf-seg-btn" data-type="reminder" onclick="tfSelectType(\'reminder\')" style="flex:1;padding:12px 6px;border:2px solid var(--brand-border);background:#fff;border-radius:10px;cursor:pointer;text-align:center;font-weight:700;font-size:12px;color:var(--brand-text-muted);line-height:1.3;"><div style="font-size:22px;margin-bottom:4px;"><i data-lucide="alarm-clock"></i></div>Reminder</div>';
    html += '<div class="tf-seg-btn" data-type="alarm" onclick="tfSelectType(\'alarm\')" style="flex:1;padding:12px 6px;border:2px solid var(--brand-border);background:#fff;border-radius:10px;cursor:pointer;text-align:center;font-weight:700;font-size:12px;color:var(--brand-text-muted);line-height:1.3;"><div style="font-size:22px;margin-bottom:4px;"><i data-lucide="bell"></i></div>Alarma</div>';
    html += '</div>';

    // Titlu + descriere
    html += '<div class="form-group"><label class="form-label">Titlu *</label><input class="form-input" placeholder="Ce trebuie facut / amintit"></div>';
    html += '<div class="form-group"><label class="form-label">Descriere</label><textarea class="form-textarea" placeholder="Detalii suplimentare..."></textarea></div>';

    // Asignat - doar pentru task (single person)
    html += '<div class="form-group" id="tf-asignat-group"><label class="form-label">Asignat catre *</label><select class="form-select"><option>Selecteaza persoana...</option><option>Ion Popescu</option><option>Gheorghe Marin</option><option>Vasile Lungu</option><option>Maria Ionescu</option><option>Andrei Popa</option><option>Elena Vasile</option><option>Alexandru Romanescu</option><option>Cristinel Parvulescu</option></select></div>';

    // Viewers (cu toggle pentru lista persoane specifice)
    html += '<div class="form-group"><label class="form-label">Viewers (cine mai vede)</label>';
    html += '<select class="form-select" onchange="tfViewersChange(this)"><option>Doar asignatul</option><option>Managerii</option><option>Toata echipa</option><option value="specific">Persoane specifice...</option></select>';
    html += '<div id="tf-viewers-list" style="display:none;margin-top:8px;padding:4px 12px;border:1px solid var(--brand-border);border-radius:8px;max-height:200px;overflow-y:auto;background:var(--brand-surface);">';
    ['Ion Popescu','Maria Ionescu','Vasile Lungu','Andrei Popa','Elena Vasile','Gheorghe Marin','Alexandru Romanescu','Cristinel Parvulescu'].forEach(function(n){
      var init = n.split(' ').map(function(w){return w[0];}).join('').substring(0,2).toUpperCase();
      html += '<label style="display:flex;align-items:center;gap:10px;padding:10px 4px;font-size:14px;cursor:pointer;border-bottom:1px solid var(--brand-border);">';
      html += '<input type="checkbox" style="width:20px;height:20px;cursor:pointer;">';
      html += '<div style="width:30px;height:30px;border-radius:50%;background:var(--brand-primary-60);color:#fff;display:flex;align-items:center;justify-content:center;font-size:11px;font-weight:700;">' + init + '</div>';
      html += '<span>' + n + '</span>';
      html += '</label>';
    });
    html += '</div></div>';

    // Data / ora
    html += '<div class="form-group"><label class="form-label" id="tf-date-label">Data limita *</label><input type="datetime-local" class="form-input" value="2026-04-20T08:00"></div>';

    // Prioritate (task + alarm)
    html += '<div class="form-group" id="tf-prioritate"><label class="form-label">Prioritate</label><select class="form-select"><option>Normala</option><option>Urgent</option><option>Critic</option></select></div>';

    // Recurenta (doar reminder)
    html += '<div class="form-group" id="tf-recurenta" style="display:none;"><label class="form-label">Repetare</label><select class="form-select"><option>O data</option><option>Zilnic</option><option>Saptamanal</option><option>Lunar</option><option>Anual</option></select></div>';

    // Legat de teren (optional) — componenta reutilizabila
    html += parcelaSelectorHTML('tf-teren', { label: 'Legat de teren', hint: '(optional)', required: false });

    // Atasamente
    html += '<div class="form-group"><label class="form-label">Atasamente</label><div style="padding:12px;border:1px dashed var(--brand-border);border-radius:8px;text-align:center;color:var(--brand-text-muted);font-size:13px;cursor:pointer;"><i data-lucide="paperclip"></i> Adauga foto / document</div></div>';

    openDrawer('Planifica &mdash; Task / Reminder / Alarma', html, [
      { label: 'Anuleaza', class: 'btn-secondary', action: closeDrawer },
      { label: 'Trimite', class: 'btn-primary', action: function(){ closeDrawer(); if (typeof showToast === 'function') showToast('success', 'Trimis catre echipa.'); } }
    ]);
  };

  // ===== TEREN SEARCH / MAP PICKER =====
  var TERENURI_LIST = ['Parcela 12 Nord', 'Parcela 9 Centru', 'Parcela 18 Sud', 'Parcela 22 Nord',
    'Parcela 11 Centru', 'Parcela 3 Sud', 'Parcela 7 Vest', 'Parcela 4 Est',
    'Parcela 6 Vest', 'Parcela 15 Est', 'Lotul 3 Vest', 'Lotul 7 Nord',
    'Lotul 12 Sud', 'Tarlaua A1', 'Tarlaua A2', 'Tarlaua B3',
    'Sola 14 Vest', 'Sola 21 Nord', 'Sola 28 Est', 'Sola 33 Sud'];

  // tf-teren handlers — acum via componenta shared (psSearch/psPick/psOpenMap)

  window.tfViewersChange = function (sel) {
    var list = document.getElementById('tf-viewers-list');
    if (!list) return;
    list.style.display = sel.value === 'specific' ? 'block' : 'none';
  };

  window.tfSelectType = function (type) {
    document.querySelectorAll('.tf-seg-btn').forEach(function(b) {
      var active = b.dataset.type === type;
      b.style.border = '2px solid ' + (active ? 'var(--brand-primary)' : 'var(--brand-border)');
      b.style.background = active ? 'var(--brand-hover-bg)' : '#fff';
      b.style.color = active ? 'var(--brand-primary)' : 'var(--brand-text-muted)';
    });
    var dateLabel = document.getElementById('tf-date-label');
    var prioritate = document.getElementById('tf-prioritate');
    var recurenta = document.getElementById('tf-recurenta');
    var asignatGroup = document.getElementById('tf-asignat-group');
    if (type === 'task') {
      if (dateLabel) dateLabel.textContent = 'Data limita *';
      if (prioritate) prioritate.style.display = '';
      if (recurenta) recurenta.style.display = 'none';
      if (asignatGroup) asignatGroup.style.display = '';
    } else if (type === 'reminder') {
      if (dateLabel) dateLabel.textContent = 'Data si ora *';
      if (prioritate) prioritate.style.display = 'none';
      if (recurenta) recurenta.style.display = '';
      if (asignatGroup) asignatGroup.style.display = 'none';
    } else if (type === 'alarm') {
      if (dateLabel) dateLabel.textContent = 'Declanseaza la *';
      if (prioritate) prioritate.style.display = '';
      if (recurenta) recurenta.style.display = 'none';
      if (asignatGroup) asignatGroup.style.display = 'none';
    }
  };

  window.openQuickNote = function () {
    qdrawer('Notita noua', [
      { label: 'Titlu', type: 'text', placeholder: 'Ex: idee tratament' },
      { label: 'Continut', type: 'textarea', placeholder: 'Scrie rapid ideea...' }
    ], 'Salveaza', 'Notita salvata.');
  };

  window.openQuickReport = function () {
    qdrawer('Cere raport de la echipa', [
      { label: 'De la cine', type: 'select', options: ['Toti operatorii', 'Ion Popescu', 'Gheorghe Marin', 'Vasile Lungu'], required: true },
      { label: 'Ce raportati', type: 'select', options: ['Status lucrare in curs', 'Ore lucrate azi', 'Consum utilaj', 'Probleme intalnite'], required: true },
      { label: 'Mesaj optional', type: 'textarea' }
    ], 'Trimite cererea', 'Cererea a fost trimisa.');
  };

  window.openQuickReminder = function () {
    qdrawer('Programeaza reminder', [
      { label: 'Titlu reminder', type: 'text', required: true, placeholder: 'Ex: Verifica cultura peste 5 zile' },
      { label: 'Data', type: 'date', required: true },
      { label: 'Pentru cine', type: 'select', options: ['Doar pentru mine', 'Toata echipa', 'O persoana...'] }
    ], 'Programeaza', 'Reminder setat.');
  };

  window.openCameraPopup = function () {
    var screen = document.querySelector('.phone-screen');
    if (!screen) return;
    var existing = document.getElementById('camera-overlay');
    if (existing) existing.remove();

    window._camCulturaManual = false;
    var now = new Date();
    var dateStr = ('0'+now.getDate()).slice(-2) + '.' + ('0'+(now.getMonth()+1)).slice(-2) + '.' + now.getFullYear();
    var timeStr = ('0'+now.getHours()).slice(-2) + ':' + ('0'+now.getMinutes()).slice(-2) + ':' + ('0'+now.getSeconds()).slice(-2);
    // Mock metadate (in productie → senzori reali + API meteo)
    var mockTemp = (Math.round((15 + Math.random() * 8) * 10) / 10) + '°C';
    var compassDegs = [0, 45, 90, 135, 180, 225, 270, 315];
    var compassLabels = ['N', 'NE', 'E', 'SE', 'S', 'SV', 'V', 'NV'];
    var cIdx = Math.floor(Math.random() * 8);
    var mockOrient = compassLabels[cIdx] + ' &middot; ' + compassDegs[cIdx] + '°';
    var currentUser = 'Ion Popescu';

    // Parcela auto-detectata din GPS (mock: prima parcela din lista)
    var parceleSrc = (typeof PARCELE_LIST !== 'undefined' && PARCELE_LIST.length) ? PARCELE_LIST : [{name:'Parcela 12 Nord', ha:25.5, cultura:'Grau'}];
    var autoParcela = parceleSrc[0];

    var overlay = document.createElement('div');
    overlay.id = 'camera-overlay';
    overlay.style.cssText = 'position:absolute;inset:0;background:var(--brand-background);z-index:80;display:flex;flex-direction:column;animation:slideUp 0.25s ease-out;';
    overlay.innerHTML =
      '<div style="padding:12px 16px;background:var(--brand-primary);color:#fff;display:flex;align-items:center;justify-content:space-between;flex-shrink:0;">' +
        '<div style="font-size:16px;font-weight:700;"><i data-lucide="camera"></i> Foto nouă</div>' +
        '<button onclick="closeCameraPopup()" style="width:34px;height:34px;background:rgba(255,255,255,0.2);border:none;color:#fff;border-radius:50%;cursor:pointer;font-size:18px;line-height:1;">&times;</button>' +
      '</div>' +
      '<div style="flex:1;overflow-y:auto;padding:14px;">' +
        '<div id="cam-photo" onclick="alert(\'In producție: deschide camera foto nativă\')" style="aspect-ratio:4/3;background:linear-gradient(135deg,#334,#556);border-radius:12px;display:flex;flex-direction:column;align-items:center;justify-content:center;color:rgba(255,255,255,0.6);margin-bottom:14px;cursor:pointer;border:2px dashed rgba(255,255,255,0.25);">' +
          '<div style="font-size:64px;"><i data-lucide="camera"></i></div>' +
          '<div style="font-size:13px;font-weight:600;margin-top:6px;">Apasă pentru a face poza</div>' +
        '</div>' +
        '<div style="margin-bottom:14px;padding:12px;background:var(--brand-hover-bg);border-radius:10px;border-left:3px solid var(--brand-primary);">' +
          '<div style="font-size:10px;font-weight:800;color:var(--brand-primary);text-transform:uppercase;letter-spacing:0.5px;margin-bottom:8px;">Metadate auto (captate cu poza)</div>' +
          '<div style="display:grid;grid-template-columns:1fr 1fr;gap:6px 10px;font-size:12px;">' +
            '<div style="display:flex;align-items:center;gap:4px;"><span><i data-lucide="map-pin"></i></span><span id="cam-gps" style="font-weight:700;color:var(--brand-text-primary);">se încarcă...</span></div>' +
            '<div style="display:flex;align-items:center;gap:4px;"><span><i data-lucide="calendar"></i></span><span style="font-weight:700;color:var(--brand-text-primary);">' + dateStr + '</span></div>' +
            '<div style="display:flex;align-items:center;gap:4px;"><span><i data-lucide="clock"></i></span><span style="font-weight:700;color:var(--brand-text-primary);">' + timeStr + '</span></div>' +
            '<div style="display:flex;align-items:center;gap:4px;"><span><i data-lucide="compass"></i></span><span style="font-weight:700;color:var(--brand-text-primary);">' + mockOrient + '</span></div>' +
            '<div style="display:flex;align-items:center;gap:4px;"><span><i data-lucide="thermometer"></i></span><span style="font-weight:700;color:var(--brand-text-primary);">' + mockTemp + '</span></div>' +
            '<div style="display:flex;align-items:center;gap:4px;"><span><i data-lucide="user"></i></span><span style="font-weight:700;color:var(--brand-text-primary);">' + currentUser + '</span></div>' +
          '</div>' +
        '</div>' +
        '<div id="cam-parcela-hint" style="margin-bottom:-4px;font-size:11px;font-weight:700;color:var(--brand-success);text-transform:uppercase;letter-spacing:0.3px;padding:0 2px;"><i data-lucide="check"></i> Auto-detectată din GPS</div>' +
        parcelaSelectorHTML('cam-parcela', { label: 'Parcelă', required: true, initial: [autoParcela.name] }) +
        '<div class="form-group">' +
          '<label class="form-label">Cultură <span style="color:var(--brand-danger);">*</span></label>' +
          '<select id="cam-cultura" class="form-select" onchange="_camCulturaChanged()">' +
            (function(){
              var opts = ['Grau', 'Porumb', 'Rapita', 'Floarea soarelui', 'Soia', 'Orz', 'Secara', 'Lucerna', 'Altele'];
              var cur = (autoParcela && autoParcela.cultura) || '';
              // Include cultura curentă chiar dacă nu e în listă
              if (cur && opts.indexOf(cur) === -1) opts.unshift(cur);
              return opts.map(function(o){
                return '<option value="' + o + '"' + (o === cur ? ' selected' : '') + '>' + o + '</option>';
              }).join('');
            })() +
          '</select>' +
          '<div id="cam-cultura-hint" style="margin-top:4px;font-size:11px;font-weight:700;color:var(--brand-success);text-transform:uppercase;letter-spacing:0.3px;"><i data-lucide="check"></i> Auto (din parcelă)</div>' +
        '</div>' +
        '<div class="form-group" style="margin-bottom:0;">' +
          '<label class="form-label">Comentariu</label>' +
          '<textarea class="form-textarea" placeholder="Ce arată poza... (opțional)"></textarea>' +
        '</div>' +
      '</div>' +
      '<div style="padding:12px 16px;border-top:1px solid var(--brand-border);display:flex;gap:8px;flex-shrink:0;">' +
        '<button onclick="closeCameraPopup()" style="flex:1;min-height:48px;padding:12px;background:#fff;border:1px solid var(--brand-border);border-radius:10px;font-size:14px;font-weight:700;cursor:pointer;font-family:inherit;">Anulează</button>' +
        '<button onclick="saveCameraPhoto()" style="flex:2;min-height:48px;padding:12px;background:var(--brand-primary);color:#fff;border:none;border-radius:10px;font-size:14px;font-weight:800;cursor:pointer;font-family:inherit;"><i data-lucide="check"></i> Salvează foto</button>' +
      '</div>';
    screen.appendChild(overlay);

    // Captură GPS real (fallback la mock)
    var gpsEl = document.getElementById('cam-gps');
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(function(pos) {
        if (gpsEl) gpsEl.textContent = pos.coords.latitude.toFixed(5) + ', ' + pos.coords.longitude.toFixed(5);
      }, function() {
        if (gpsEl) gpsEl.textContent = '45.74894, 21.20866 (demo)';
      }, { timeout: 5000 });
    } else {
      if (gpsEl) gpsEl.textContent = '45.74894, 21.20866 (demo)';
    }

    // Flag intern: cultura a fost modificată manual de user
    window._camCulturaManual = false;
    // Handler schimbare cultură (apelat din select)
    window._camCulturaChanged = function () {
      window._camCulturaManual = true;
      var h = document.getElementById('cam-cultura-hint');
      if (h) { h.innerHTML = '<i data-lucide="pencil"></i> Modificată manual'; h.style.color = 'var(--brand-warning)'; }
    };
    // Helper: aplică cultura din parcela selectată (doar dacă userul n-a modificat manual)
    function _applyCulturaFromParcela() {
      if (window._camCulturaManual) return;
      var sel = window._parcelaSelectors['cam-parcela'] || [];
      if (!sel.length) return;
      var parc = (typeof PARCELE_LIST !== 'undefined') ? PARCELE_LIST.find(function(p){ return p.name === sel[0]; }) : null;
      if (!parc || !parc.cultura) return;
      var selEl = document.getElementById('cam-cultura');
      if (!selEl) return;
      // Adaugă opțiunea dacă nu există
      var exists = false;
      for (var i = 0; i < selEl.options.length; i++) {
        if (selEl.options[i].value === parc.cultura) { exists = true; break; }
      }
      if (!exists) {
        var opt = document.createElement('option');
        opt.value = parc.cultura; opt.textContent = parc.cultura;
        selEl.insertBefore(opt, selEl.firstChild);
      }
      selEl.value = parc.cultura;
      var h = document.getElementById('cam-cultura-hint');
      if (h) { h.innerHTML = '<i data-lucide="check"></i> Auto (din parcelă)'; h.style.color = 'var(--brand-success)'; }
    }
    // Callback la schimbare parcelă → actualizează hint-ul (auto vs manual) + auto-fill cultură
    window._psCallbacks['cam-parcela'] = function () {
      var hint = document.getElementById('cam-parcela-hint');
      var sel = window._parcelaSelectors['cam-parcela'] || [];
      if (!hint) return;
      if (sel.length === 1 && sel[0] === autoParcela.name) {
        hint.innerHTML = '<i data-lucide="check"></i> Auto-detectată din GPS';
        hint.style.color = 'var(--brand-success)';
      } else {
        hint.innerHTML = '<i data-lucide="pencil"></i> Modificată manual';
        hint.style.color = 'var(--brand-warning)';
      }
      // Auto-fill cultură (dacă user n-a modificat manual deja)
      _applyCulturaFromParcela();
    };
    // Render chips initial
    setTimeout(function(){ if (window.psRender) psRender('cam-parcela'); else if (document.getElementById('cam-parcela-chips')) window._psCallbacks['cam-parcela'](); }, 10);
  };

  window.closeCameraPopup = function () {
    var ov = document.getElementById('camera-overlay');
    if (ov) ov.remove();
  };

  window.saveCameraPhoto = function () {
    // Colectez datele
    var overlay = document.getElementById('camera-overlay');
    if (!overlay) return;
    var gpsEl = document.getElementById('cam-gps');
    var hint = document.getElementById('cam-parcela-hint');
    var commentEl = overlay.querySelector('textarea');
    var parcele = (window._parcelaSelectors && window._parcelaSelectors['cam-parcela']) || [];
    var autoDetected = hint && hint.innerHTML.indexOf('Auto-detect') >= 0;

    // Caut iconuri metadate (orientare + temperatura)
    var metaRows = overlay.querySelectorAll('[style*="grid-template-columns"]');
    var orient = '', temp = '', dateStr = '', timeStr = '';
    var metaBox = overlay.querySelector('[style*="grid-template-columns:1fr 1fr"]');
    if (metaBox) {
      var vals = metaBox.querySelectorAll('span[style*="font-weight:700"]');
      // Ordine: GPS(id=cam-gps) / DATA / ORA / ORIENT / TEMP / USER
      if (vals[1]) dateStr = vals[1].textContent;
      if (vals[2]) timeStr = vals[2].textContent;
      if (vals[3]) orient = vals[3].innerHTML;
      if (vals[4]) temp = vals[4].textContent;
    }

    // Cultura selectată (prioritar de la user, fallback la parcelă)
    var culturaEl = document.getElementById('cam-cultura');
    var cultura = culturaEl ? culturaEl.value : '';
    // Mock AI detections pe baza culturii (explicită) + parcelei + comment
    function _computeAIDetections() {
      var hay = (parcele.join(' ') + ' ' + (commentEl ? commentEl.value : '') + ' ' + cultura).toLowerCase();
      if (hay.indexOf('grau') >= 0) return [
        { level: 'danger', icon: '<i data-lucide="bug"></i>', name: 'Rugină galbenă', conf: 91, desc: 'Pete galbene pe 3 zone identificate — tratament recomandat în 48h.' },
        { level: 'ok', icon: '<i data-lucide="sprout"></i>', name: 'Densitate cultură', conf: 88, desc: 'Uniformă — ~450 plante/m² (peste pragul minim).' }
      ];
      if (hay.indexOf('porumb') >= 0) return [
        { level: 'warning', icon: '<i data-lucide="bug"></i>', name: 'Sfredelitor porumb', conf: 76, desc: 'Ouă detectate pe 2 frunze — monitorizare activă.' },
        { level: 'ok', icon: '<i data-lucide="flower-2"></i>', name: 'Înălțime medie', conf: 95, desc: 'V6-V7 (optim pentru sezon).' }
      ];
      if (hay.indexOf('rapit') >= 0) return [
        { level: 'warning', icon: '<i data-lucide="bug"></i>', name: 'Gărgăriță siliconică', conf: 82, desc: '5-7 exemplare / m² — aproape de prag.' }
      ];
      if (hay.indexOf('floarea') >= 0) return [
        { level: 'ok', icon: '<i data-lucide="flower-2"></i>', name: 'Fenofază R3', conf: 93, desc: 'Optim pentru tratament.' }
      ];
      if (hay.indexOf('soia') >= 0) return [
        { level: 'ok', icon: '<i data-lucide="sprout"></i>', name: 'Nodozități active', conf: 87, desc: 'Fixare azot corespunzătoare.' }
      ];
      return [
        { level: 'ok', icon: '<i data-lucide="leaf"></i>', name: 'Cultură sănătoasă', conf: 84, desc: 'Nu s-au detectat boli sau dăunători la scanare.' }
      ];
    }

    var photo = {
      id: Date.now(),
      createdAt: new Date().toISOString(),
      displayDate: dateStr,
      displayTime: timeStr,
      dateGroup: 'Azi',
      gps: gpsEl ? gpsEl.textContent : '',
      parcele: parcele.slice(),
      parcelaAuto: !!autoDetected,
      cultura: cultura,
      culturaAuto: !window._camCulturaManual,
      orientation: orient,
      temperature: temp,
      author: 'Ion Popescu',
      comment: commentEl ? commentEl.value.trim() : '',
      aiDetections: _computeAIDetections()
    };

    try {
      var saved = JSON.parse(localStorage.getItem('camphotos') || '[]');
      saved.unshift(photo);
      localStorage.setItem('camphotos', JSON.stringify(saved));
    } catch (e) { /* ignore quota */ }

    if (overlay) overlay.remove();
    if (typeof showToast === 'function') showToast('success', 'Foto salvată — apare în Jurnal de câmp și Media.');
  };

  window.openQuickSOS = function () {
    qdrawer('SOS / Urgenta', [
      { label: 'Tip urgenta', type: 'select', options: ['Accident', 'Defectiune utilaj', 'Vreme severa', 'Incendiu', 'Altul'], required: true },
      { label: 'Localizare', type: 'text', placeholder: 'Parcela / punct GPS', required: true },
      { label: 'Descriere', type: 'textarea', required: true }
    ], 'ALERTEAZA TOATA ECHIPA', 'SOS trimis - toti primesc notificare.');
  };

  // Furnizori default (combustibil propriu din incintă) — always present, imutabili
  var FURNIZORI_IMPLICITI = ['Rezervor incintă'];

  window._getAlSuppliers = function () {
    var saved = [];
    try { saved = JSON.parse(localStorage.getItem('al-suppliers') || '[]'); } catch(e) {}
    return saved;
  };
  window._setAlSuppliers = function (list) {
    try { localStorage.setItem('al-suppliers', JSON.stringify(list)); } catch(e) {}
  };

  function _alGetFuelFromStoc(tip) {
    // Gaseste produsul de tip combustibil in STOCURI_DB
    var src = (typeof STOCURI_DB !== 'undefined') ? STOCURI_DB : [];
    return src.find(function(s){
      if (!s.cat || s.cat !== 'Combustibil') return false;
      if (tip === 'Motorină') return s.tip === 'Diesel' || s.name.toLowerCase().indexOf('motorin') >= 0;
      if (tip === 'Benzină') return s.tip === 'Benzină' || s.name.toLowerCase().indexOf('benzin') >= 0;
      if (tip === 'AdBlue')  return s.tip === 'AdBlue' || s.name.toLowerCase().indexOf('adblue') >= 0;
      return false;
    });
  }

  window._alVehicleChanged = function () {
    var vSel = document.getElementById('al-vehicle');
    if (!vSel || !vSel.value) return;
    var veh = null;
    if (window.UTILAJE_DB) veh = window.UTILAJE_DB.find(function(u){ return u.name === vSel.value; });
    if (!veh && window.MASINI_DB) veh = window.MASINI_DB.find(function(m){ return m.name === vSel.value; });
    if (!veh) return;
    // Auto-fill fuel type from fisa utilajului
    var fSel = document.getElementById('al-fuel');
    if (fSel && veh.combustibil && veh.combustibil !== 'Electric') {
      fSel.value = veh.combustibil;
      // Trigger fuel change → pret
      window._alFuelChanged();
    }
    // Badge fisa tehnica info
    var info = document.getElementById('al-vehicle-info');
    if (info) {
      info.style.display = '';
      info.innerHTML = '<i data-lucide="file-text"></i> Din fișa tehnică: combustibil <strong>' + (veh.combustibil || '—') + '</strong>';
    }
  };

  window._alFuelChanged = function () {
    var fSel = document.getElementById('al-fuel');
    if (!fSel) return;
    var priceEl = document.getElementById('al-price');
    var priceInfo = document.getElementById('al-price-info');
    var fuel = _alGetFuelFromStoc(fSel.value);
    if (priceEl && fuel && typeof fuel.pret !== 'undefined') {
      priceEl.value = fuel.pret;
      if (priceInfo) {
        priceInfo.style.display = '';
        priceInfo.innerHTML = '<i data-lucide="bar-chart-2"></i> Preț curent din stoc: <strong>' + fuel.pret.toFixed(2) + ' lei/L</strong> &middot; stoc disponibil: ' + fuel.stoc + ' L';
      }
    } else if (priceInfo) {
      priceInfo.style.display = 'none';
    }
    window._alRecalcTotal();
  };

  window._alRecalcTotal = function () {
    var q = parseFloat(document.getElementById('al-qty') ? document.getElementById('al-qty').value : 0) || 0;
    var p = parseFloat(document.getElementById('al-price') ? document.getElementById('al-price').value : 0) || 0;
    var total = q * p;
    var tEl = document.getElementById('al-total');
    if (tEl) tEl.textContent = total.toFixed(2) + ' lei';
  };

  window._alSupplierChanged = function () {
    var sel = document.getElementById('al-supplier-select');
    if (!sel) return;
    var customBox = document.getElementById('al-supplier-custom-box');
    if (sel.value === '__new__') {
      if (customBox) customBox.style.display = '';
      var inp = document.getElementById('al-supplier-custom');
      if (inp) setTimeout(function(){ inp.focus(); }, 50);
    } else {
      if (customBox) customBox.style.display = 'none';
    }
  };

  window._alSupplierEdit = function (idx) {
    var saved = window._getAlSuppliers();
    var cur = saved[idx] || '';
    var nv = prompt('Editează furnizor:', cur);
    if (nv === null) return;
    nv = nv.trim();
    if (!nv) return;
    saved[idx] = nv;
    window._setAlSuppliers(saved);
    _alRefreshSupplierList();
  };
  window._alSupplierDel = function (idx) {
    var saved = window._getAlSuppliers();
    var cur = saved[idx] || '';
    if (!confirm('Șterge furnizorul "' + cur + '"?')) return;
    saved.splice(idx, 1);
    window._setAlSuppliers(saved);
    _alRefreshSupplierList();
  };

  function _alRefreshSupplierList() {
    var sel = document.getElementById('al-supplier-select');
    var listEl = document.getElementById('al-supplier-list');
    if (!sel || !listEl) return;
    var saved = window._getAlSuppliers();
    var currentValue = sel.value;
    var html = '';
    FURNIZORI_IMPLICITI.forEach(function(f){ html += '<option value="' + f + '">' + f + '</option>'; });
    saved.forEach(function(f){ html += '<option value="' + f + '">' + f + '</option>'; });
    html += '<option value="__new__">+ Adaugă furnizor nou...</option>';
    sel.innerHTML = html;
    if (currentValue && currentValue !== '__new__') sel.value = currentValue;
    // Render edit/delete list pentru furnizori salvati
    var lh = '';
    if (saved.length) {
      lh += '<div style="font-size:10px;font-weight:800;color:var(--brand-text-muted);text-transform:uppercase;letter-spacing:0.4px;margin:10px 0 6px;">Furnizori salvați</div>';
      saved.forEach(function(f, i){
        lh += '<div style="display:flex;align-items:center;gap:8px;padding:8px 10px;background:var(--brand-surface);border:1px solid var(--brand-border);border-radius:8px;margin-bottom:4px;">';
        lh += '<span style="flex:1;font-size:13px;font-weight:600;color:var(--brand-text-primary);"><i data-lucide="map-pin"></i> ' + f + '</span>';
        lh += '<button type="button" onclick="_alSupplierEdit(' + i + ')" style="width:28px;height:28px;border:none;background:rgba(0,104,106,0.12);color:var(--brand-primary);border-radius:6px;cursor:pointer;font-size:13px;" title="Editează"><i data-lucide="pencil"></i></button>';
        lh += '<button type="button" onclick="_alSupplierDel(' + i + ')" style="width:28px;height:28px;border:none;background:rgba(220,38,38,0.12);color:#DC2626;border-radius:6px;cursor:pointer;font-size:13px;" title="Șterge"><i data-lucide="trash-2"></i></button>';
        lh += '</div>';
      });
    }
    listEl.innerHTML = lh;
  }

  window.scanBonAlimentare = function () {
    if (typeof showToast === 'function') showToast('success', 'Scanare bon fiscal... (demo)');
    // Mock: simulam OCR pe bon fiscal. Randomizare usoara ca sa para dinamic.
    var mockData = [
      { statie: 'OMV Arad', cant: 98.50, pret: 7.49, bon: 'BF-2026/00247', km: 48230 },
      { statie: 'Petrom Timișoara', cant: 120.00, pret: 7.52, bon: 'BF-2026/01892', km: 2420 },
      { statie: 'Rompetrol Deva', cant: 75.30, pret: 7.45, bon: 'BF-2026/00531', km: 85420 },
      { statie: 'MOL Lugoj', cant: 150.75, pret: 7.48, bon: 'BF-2026/04127', km: null }
    ];
    var d = mockData[Math.floor(Math.random() * mockData.length)];

    setTimeout(function () {
      // Cantitate + Pret
      var qEl = document.getElementById('al-qty'); if (qEl) qEl.value = d.cant;
      var pEl = document.getElementById('al-price'); if (pEl) pEl.value = d.pret;
      // Bon fiscal
      var bonEl = document.getElementById('al-bon'); if (bonEl) bonEl.value = d.bon;
      // Km daca avem
      if (d.km !== null) { var kmEl = document.getElementById('al-km'); if (kmEl) kmEl.value = d.km; }
      // Statie / Furnizor — adauga in lista salvata daca nu exista, apoi selecteaza
      var saved = window._getAlSuppliers();
      if (saved.indexOf(d.statie) === -1 && FURNIZORI_IMPLICITI.indexOf(d.statie) === -1) {
        saved.push(d.statie);
        window._setAlSuppliers(saved);
      }
      _alRefreshSupplierList();
      var supSel = document.getElementById('al-supplier-select');
      if (supSel) supSel.value = d.statie;
      // Daca sheet-ul era deschis pe __new__, ascunde custom box
      var customBox = document.getElementById('al-supplier-custom-box');
      if (customBox) customBox.style.display = 'none';
      // Recalculeaza total
      window._alRecalcTotal();
      // Badge mic de confirmare OCR peste Cantitate field
      if (typeof showToast === 'function') {
        showToast('success', 'Date extrase din bon: ' + d.cant + 'L × ' + d.pret + ' lei/L la ' + d.statie + '. Verifică și salvează.');
      }
    }, 1400);
  };

  window.quickAlimentare = function () {
    closeFabSafe();
    if (typeof openDrawer !== 'function') return;
    var utilaje = (window.UTILAJE_DB || []).filter(function(u){ return u.combustibil !== 'Electric'; });
    var masini  = (window.MASINI_DB  || []);
    var vHtml = '<option value="">Selectează vehicul...</option>';
    if (utilaje.length) {
      vHtml += '<optgroup label="Utilaje">';
      utilaje.forEach(function(u){ vHtml += '<option value="' + u.name + '">' + u.name + '</option>'; });
      vHtml += '</optgroup>';
    }
    if (masini.length) {
      vHtml += '<optgroup label="Mașini">';
      masini.forEach(function(m){ vHtml += '<option value="' + m.name + '">' + m.name + '</option>'; });
      vHtml += '</optgroup>';
    }
    var savedSuppliers = window._getAlSuppliers();
    var supHtml = '';
    FURNIZORI_IMPLICITI.forEach(function(f){ supHtml += '<option value="' + f + '">' + f + '</option>'; });
    savedSuppliers.forEach(function(f){ supHtml += '<option value="' + f + '">' + f + '</option>'; });
    supHtml += '<option value="__new__">+ Adaugă furnizor nou...</option>';

    var today = new Date();
    var todayISO = today.getFullYear() + '-' + ('0'+(today.getMonth()+1)).slice(-2) + '-' + ('0'+today.getDate()).slice(-2);
    var nowHHMM = ('0'+today.getHours()).slice(-2) + ':' + ('0'+today.getMinutes()).slice(-2);

    var html = '';
    // SCAN BON FISCAL — buton mare sus
    html += '<div style="padding:14px;margin-bottom:14px;background:linear-gradient(135deg,var(--brand-hover-bg),#fff);border:2px dashed var(--brand-primary);border-radius:12px;text-align:center;">';
    html += '<div style="font-size:34px;margin-bottom:6px;"><i data-lucide="camera"></i></div>';
    html += '<div style="font-size:13px;font-weight:700;color:var(--brand-text-primary);margin-bottom:10px;">Fa o poză la bonul fiscal <span style="font-weight:500;color:var(--brand-text-muted);">— datele se extrag automat</span></div>';
    html += '<button type="button" onclick="scanBonAlimentare()" style="width:100%;padding:12px;background:var(--brand-primary);color:#fff;border:none;border-radius:10px;font-size:14px;font-weight:800;cursor:pointer;display:flex;align-items:center;justify-content:center;gap:8px;font-family:inherit;box-shadow:0 2px 8px rgba(0,104,106,0.25);">';
    html += '<span style="font-size:18px;"><i data-lucide="camera"></i></span> Scanează bonul fiscal';
    html += '</button>';
    html += '<div style="margin-top:8px;font-size:11px;color:var(--brand-text-muted);">Cantitate, preț, stație, nr. bon &mdash; toate completate automat</div>';
    html += '</div>';
    html += '<div style="display:flex;align-items:center;gap:8px;margin:12px 0 14px;">';
    html += '<div style="flex:1;height:1px;background:var(--brand-border);"></div>';
    html += '<div style="font-size:11px;font-weight:700;color:var(--brand-text-muted);text-transform:uppercase;letter-spacing:0.5px;">sau completează manual</div>';
    html += '<div style="flex:1;height:1px;background:var(--brand-border);"></div>';
    html += '</div>';
    // Data + Ora (split 2 col)
    html += '<div style="display:grid;grid-template-columns:1.2fr 1fr;gap:10px;">';
    html += '<div class="form-group"><label class="form-label">Data <span style="color:var(--brand-danger);">*</span></label><input id="al-date" type="date" class="form-input" value="' + todayISO + '"></div>';
    html += '<div class="form-group"><label class="form-label">Ora</label><input id="al-time" type="time" class="form-input" value="' + nowHHMM + '"></div>';
    html += '</div>';
    // Vehicul
    html += '<div class="form-group">';
    html += '<label class="form-label">Utilaj / Mașină <span style="color:var(--brand-danger);">*</span></label>';
    html += '<select id="al-vehicle" class="form-select" onchange="_alVehicleChanged()">' + vHtml + '</select>';
    html += '<div id="al-vehicle-info" style="display:none;margin-top:6px;font-size:11px;color:var(--brand-primary);font-weight:600;"></div>';
    html += '</div>';
    // Combustibil
    html += '<div class="form-group">';
    html += '<label class="form-label">Tip carburant <span style="color:var(--brand-danger);">*</span></label>';
    html += '<select id="al-fuel" class="form-select" onchange="_alFuelChanged()">';
    html += '<option value="Motorină">Motorină</option>';
    html += '<option value="Benzină">Benzină</option>';
    html += '<option value="AdBlue">AdBlue</option>';
    html += '</select>';
    html += '</div>';
    // Cantitate + Pret (split 2 col)
    html += '<div style="display:grid;grid-template-columns:1fr 1fr;gap:10px;">';
    html += '<div class="form-group"><label class="form-label">Cantitate (L) <span style="color:var(--brand-danger);">*</span></label><input id="al-qty" type="number" step="0.1" class="form-input" placeholder="ex: 120" oninput="_alRecalcTotal()"></div>';
    html += '<div class="form-group"><label class="form-label">Preț (lei/L)</label><input id="al-price" type="number" step="0.01" class="form-input" placeholder="ex: 7.50 (opțional)" oninput="_alRecalcTotal()"></div>';
    html += '</div>';
    html += '<div id="al-price-info" style="display:none;margin-top:-6px;margin-bottom:12px;font-size:11px;color:var(--brand-primary);font-weight:600;"></div>';
    // Total calculat
    html += '<div style="padding:12px 14px;background:linear-gradient(135deg,var(--brand-primary-20),#fff);border:1.5px solid var(--brand-primary);border-radius:10px;margin-bottom:14px;display:flex;align-items:center;justify-content:space-between;">';
    html += '<div><div style="font-size:10px;font-weight:800;color:var(--brand-text-muted);text-transform:uppercase;letter-spacing:0.4px;">Total alimentare</div><div style="font-size:11px;color:var(--brand-text-muted);margin-top:2px;">cantitate × preț</div></div>';
    html += '<div id="al-total" style="font-size:19px;font-weight:800;color:var(--brand-primary);">0.00 lei</div>';
    html += '</div>';
    // Kilometraj + Ore funcționare (split 2 col, ambele optionale)
    html += '<div style="display:grid;grid-template-columns:1fr 1fr;gap:10px;">';
    html += '<div class="form-group"><label class="form-label">Kilometraj (km)</label><input id="al-km" type="number" class="form-input" placeholder="ex: 48230"></div>';
    html += '<div class="form-group"><label class="form-label">Ore funcționare (h)</label><input id="al-ore" type="number" step="0.1" class="form-input" placeholder="ex: 2450"></div>';
    html += '</div>';
    // Statie / Furnizor
    html += '<div class="form-group">';
    html += '<label class="form-label">Stație / Furnizor <span style="color:var(--brand-danger);">*</span></label>';
    html += '<select id="al-supplier-select" class="form-select" onchange="_alSupplierChanged()">' + supHtml + '</select>';
    html += '<div id="al-supplier-custom-box" style="display:none;margin-top:8px;">';
    html += '<input id="al-supplier-custom" type="text" class="form-input" placeholder="Nume furnizor nou (ex: OMV Timișoara)">';
    html += '<div style="margin-top:6px;font-size:12px;color:var(--brand-text-muted);display:flex;align-items:center;gap:6px;"><span><i data-lucide="save"></i></span> <span>Se salvează automat pentru data viitoare</span></div>';
    html += '</div>';
    html += '<div id="al-supplier-list"></div>';
    html += '</div>';
    // Bon fiscal + Obs
    html += '<div class="form-group"><label class="form-label">Nr. bon fiscal</label><input type="text" class="form-input" placeholder="opțional" id="al-bon"></div>';
    html += '<div class="form-group"><label class="form-label">Observații</label><textarea class="form-textarea" placeholder="opțional" id="al-obs"></textarea></div>';

    openDrawer('Alimentare utilaj / mașină', html, [
      { label: 'Anuleaza', class: 'btn-secondary', action: closeDrawer },
      { label: 'Salvează alimentarea', class: 'btn-primary', action: function(){
          var sel = document.getElementById('al-supplier-select');
          var custom = document.getElementById('al-supplier-custom');
          var supplierVal = '';
          if (sel && sel.value === '__new__') {
            supplierVal = (custom && custom.value || '').trim();
            if (supplierVal) {
              // Persista (dacă nu exista deja)
              var saved = window._getAlSuppliers();
              if (saved.indexOf(supplierVal) === -1 && FURNIZORI_IMPLICITI.indexOf(supplierVal) === -1) {
                saved.push(supplierVal);
                window._setAlSuppliers(saved);
              }
            }
          } else if (sel) {
            supplierVal = sel.value;
          }
          closeDrawer();
          if (typeof showToast === 'function') {
            showToast('success', 'Alimentare înregistrată' + (supplierVal ? ' la ' + supplierVal : '') + '.');
          }
      } }
    ]);
    // Populeaza lista furnizori editabili imediat dupa deschidere
    setTimeout(_alRefreshSupplierList, 30);
  };

  // ============ ANDROID NAV BUTTONS (Back / Home / Recent) ============
  function _visibleEl(selector) {
    var els = document.querySelectorAll(selector);
    for (var i = 0; i < els.length; i++) {
      var el = els[i];
      var cs = window.getComputedStyle(el);
      if (cs.display !== 'none' && cs.visibility !== 'hidden' && el.offsetParent) return el;
    }
    return null;
  }

  window.androidBack = function () {
    // 1. Drawer global
    var drawerOv = document.getElementById('drawer-overlay');
    if (drawerOv && window.getComputedStyle(drawerOv).display !== 'none') {
      if (typeof closeDrawer === 'function') closeDrawer();
      return;
    }
    // 2. Fullscreen foto
    var fs = document.getElementById('foto-fs');
    if (fs && fs.offsetParent) {
      if (typeof closeFullscreen === 'function') closeFullscreen();
      else fs.remove();
      return;
    }
    // 3. Bottom sheets (share, tag, attach, pdf, confirm, fab sheet — toate cu .on)
    var sheets = document.querySelectorAll('.foto-share-sheet.on, .foto-bs.on, .foto-confirm.on, .foto-fab-sheet.on, .foto-tag-sheet.on, .foto-attach-sheet.on, .foto-pdf-sheet.on');
    if (sheets.length) {
      // Close the last-opened (topmost)
      sheets[sheets.length - 1].classList.remove('on');
      return;
    }
    // 4. Compare viewer
    var cmp = document.getElementById('foto-compare');
    if (cmp && cmp.classList.contains('on')) { cmp.classList.remove('on'); return; }
    // 5. FAB overlay (shortcuts picker din bottom nav)
    var fabOv = document.getElementById('fab-overlay');
    if (fabOv && fabOv.style.display === 'block') {
      if (typeof closeFabSafe === 'function') closeFabSafe();
      else fabOv.style.display = 'none';
      return;
    }
    // 6. Custom picker (scurtaturi personalizate)
    var cp = document.getElementById('custom-picker');
    if (cp && cp.style.display === 'block') {
      if (typeof closeCustomPicker === 'function') closeCustomPicker();
      else cp.style.display = 'none';
      return;
    }
    // 7. FAB actions menu (open state)
    var fabMenu = document.getElementById('fab-actions-menu');
    if (fabMenu && fabMenu.classList.contains('open')) {
      fabMenu.classList.remove('open');
      var fabBtn = document.querySelector('.fab');
      if (fabBtn) fabBtn.style.transform = 'rotate(0deg)';
      return;
    }
    // 8. Camera overlay
    var cam = document.getElementById('camera-overlay');
    if (cam) {
      if (typeof closeCameraPopup === 'function') closeCameraPopup();
      else cam.remove();
      return;
    }
    // 9. Left menu / sidebar overlay (bars.js)
    var leftMenu = document.getElementById('left-menu-overlay');
    if (leftMenu && leftMenu.style.display === 'block') {
      if (typeof toggleLeftMenu === 'function') toggleLeftMenu();
      else leftMenu.style.display = 'none';
      return;
    }
    // 10. Detail foto (fotografii)
    var fotoDet = document.getElementById('foto-detail');
    if (fotoDet && window.getComputedStyle(fotoDet).display !== 'none') {
      if (typeof closeFoto === 'function') { closeFoto(); return; }
    }
    // 11. Sub-page vizibila (clase diverse per modul: .sub-page, .sp)
    var subPage = _visibleEl('.sub-page, .sp');
    if (subPage) {
      if (typeof closeSP === 'function') { closeSP(); return; }
      if (typeof closeSubPage === 'function') { closeSubPage(); return; }
      subPage.style.display = 'none';
      // Re-show detail parent daca exista
      var parent = _visibleEl('.detail-view, .dv, #detail-view');
      return;
    }
    // 12. Detail view vizibil (clase diverse per modul)
    var det = _visibleEl('.detail-view, .dv, #detail-view');
    if (det) {
      if (typeof closePD === 'function') { closePD(); return; }
      if (typeof closeProd === 'function') { closeProd(); return; }
      if (typeof closeDetail === 'function') { closeDetail(); return; }
      det.style.display = 'none';
      // Fallback: re-show common list UI
      ['.view-tabs', '.toolbar', '#card-list', '.phone-scroll', '.fab'].forEach(function(sel){
        var el = document.querySelector(sel); if (el) el.style.display = '';
      });
      return;
    }
    // 13. Nimic de inchis → Dashops = home-ul operational.
    // Dacă suntem deja pe Dashops → back nu face nimic.
    if (_isOnDashOps()) return;
    _goToDashOps();
  };

  function _isOnDashOps() {
    try {
      var path = (window.location.pathname || '').toLowerCase();
      if (path.indexOf('dash_ops') !== -1) return true;
    } catch (e) {}
    return false;
  }

  function _goToDashOps() {
    try {
      if (window.parent && window.parent !== window && window.parent.document) {
        var pDoc = window.parent.document;
        var pWin = window.parent;
        var item = pDoc.querySelector('[data-feature="dash_ops"]');
        // Update sidebar active state manual (asigura actualizarea chiar daca load() nu ruleaza corect)
        pDoc.querySelectorAll('.sidebar-item').forEach(function(i){ i.classList.remove('active'); });
        if (item) item.classList.add('active');
        // Incearca sa apelezi load() din parent direct
        if (typeof pWin.load === 'function' && item) {
          pWin.load(item);
        } else {
          // Fallback: seteaza hash + iframe src + topbar manual
          pWin.location.hash = 'dash_ops';
          var frame = pDoc.getElementById('preview-frame');
          if (frame) { frame.style.display = 'block'; frame.src = 'modules/dash_ops.html'; }
          var emptyState = pDoc.getElementById('empty-state');
          if (emptyState) emptyState.style.display = 'none';
          var tTitle = pDoc.getElementById('topbar-title');
          var tSection = pDoc.getElementById('topbar-section');
          if (tTitle) tTitle.textContent = 'Dash Ops';
          if (tSection) tSection.textContent = 'Principal';
        }
        return;
      }
    } catch (e) {}
    // Standalone fallback
    try { window.location.href = 'dash_ops.html'; } catch (e) {}
  }

  window.androidHome = function () {
    // Home = Dashops (dashboard operational). Daca deja acolo → nu facem nimic.
    if (_isOnDashOps()) return;
    _goToDashOps();
  };

  window.androidRecent = function () {
    if (typeof showToast === 'function') {
      showToast('info', 'Aplicații recente — vizualizare demo.');
    }
  };

  // Activate Lucide icons in injected HTML
  if (typeof lucide !== 'undefined') lucide.createIcons();
})();
