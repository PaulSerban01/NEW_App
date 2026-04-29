/* Device frame HTML helpers — injected on pages that use [data-render-frames] */
(function () {
  const STATUS_IOS = `
    <div class="rf-status">
      <span>9:41</span>
      <div class="rf-indicators">
        <svg width="18" height="10" viewBox="0 0 18 10" fill="currentColor"><path d="M1 4.5h2v4H1zm4-1h2v5H5zm4-1h2v6H9zm4-1h2v7h-2z"/></svg>
        <svg width="15" height="11" viewBox="0 0 15 11" fill="currentColor"><path d="M7.5 2.5a6 6 0 0 1 4.24 1.76.5.5 0 0 0 .71-.71 7 7 0 0 0-9.9 0 .5.5 0 0 0 .71.71A6 6 0 0 1 7.5 2.5zm0-3a9 9 0 0 1 6.36 2.64.5.5 0 0 0 .71-.71 10 10 0 0 0-14.14 0 .5.5 0 0 0 .71.71A9 9 0 0 1 7.5-.5zm0 6a3 3 0 0 1 2.12.88.5.5 0 0 0 .71-.71 4 4 0 0 0-5.66 0 .5.5 0 0 0 .71.71A3 3 0 0 1 7.5 5.5zm0 2.5a1.5 1.5 0 1 0 0 3 1.5 1.5 0 0 0 0-3z"/></svg>
        <svg width="24" height="11" viewBox="0 0 24 11" fill="none"><rect x="0.5" y="0.5" width="20" height="10" rx="2.5" stroke="currentColor" opacity="0.4"/><rect x="2" y="2" width="17" height="7" rx="1.5" fill="currentColor"/><rect x="21" y="3.5" width="1.5" height="4" rx="0.5" fill="currentColor" opacity="0.4"/></svg>
      </div>
    </div>
    <div class="rf-notch"></div>
  `;

  const STATUS_ANDROID = `
    <div class="rf-status">
      <span>9:41</span>
      <div class="rf-indicators">
        <svg width="14" height="10" viewBox="0 0 14 10" fill="currentColor"><path d="M0 8h2v2H0zm4-2h2v4H4zm4-2h2v6H8zm4-2h2v8h-2z"/></svg>
        <svg width="15" height="10" viewBox="0 0 15 10" fill="currentColor"><path d="M7.5 2a5 5 0 0 1 3.54 1.46.5.5 0 0 0 .71-.71 6 6 0 0 0-8.49 0 .5.5 0 0 0 .71.71A5 5 0 0 1 7.5 2zm0 3a2 2 0 0 1 1.41.59.5.5 0 1 0 .71-.71 3 3 0 0 0-4.24 0 .5.5 0 0 0 .71.71A2 2 0 0 1 7.5 5zm0 2a1.5 1.5 0 1 0 0 3 1.5 1.5 0 0 0 0-3z"/></svg>
        <svg width="22" height="10" viewBox="0 0 22 10" fill="none"><rect x="0.5" y="0.5" width="19" height="9" rx="1.5" stroke="currentColor" opacity="0.4"/><rect x="2" y="2" width="16" height="6" rx="0.5" fill="currentColor"/><rect x="20" y="3" width="1.2" height="4" rx="0.3" fill="currentColor" opacity="0.4"/></svg>
      </div>
    </div>
    <div class="rf-punchhole"></div>
  `;

  window.RurioFrames = {
    render(targetElId, innerHtml) {
      const el = document.getElementById(targetElId);
      if (!el) return;
      el.innerHTML = `
        <div class="rf-frame rf-ios">
          ${STATUS_IOS}
          <div class="rf-body">
            <div class="rf-screen">${innerHtml}</div>
          </div>
          <div class="rf-home"></div>
        </div>
        <div class="rf-frame rf-android">
          ${STATUS_ANDROID}
          <div class="rf-body">
            <div class="rf-screen">${innerHtml}</div>
          </div>
          <div class="rf-nav"><div class="rf-nav-bar"></div></div>
        </div>
      `;
    }
  };
})();
