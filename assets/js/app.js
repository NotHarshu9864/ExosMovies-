// Shared UI utilities and drawer logic
(function(){
  // escape html for injection into templates
  window.escapeHtml = function (str) {
    if (!str) return '';
    return String(str)
      .replaceAll('&','&amp;')
      .replaceAll('<','&lt;')
      .replaceAll('>','&gt;')
      .replaceAll('"','&quot;')
      .replaceAll("'",'&#039;');
  };

  // Simple drawer toggles
  function setupDrawer(btnId, drawerId, closeId) {
    const btn = document.getElementById(btnId);
    const drawer = document.getElementById(drawerId);
    const close = document.getElementById(closeId);
    if (!btn || !drawer) return;
    btn.addEventListener('click', ()=> {
      drawer.classList.remove('-translate-x-full');
    });
    if (close) close.addEventListener('click', ()=> {
      drawer.classList.add('-translate-x-full');
    });
    // close when clicking outside
    document.addEventListener('click', (e) => {
      if (!drawer) return;
      if (!drawer.classList.contains('-translate-x-full') && !drawer.contains(e.target) && !btn.contains(e.target)) {
        drawer.classList.add('-translate-x-full');
      }
    });
  }

  setupDrawer('hamburgerBtn','drawer','drawerClose');
  setupDrawer('hamburgerBtn2','drawer2','drawerClose2');
  setupDrawer('hamburgerBtn3','drawer','drawerClose');

  // year in footer
  const y = new Date().getFullYear();
  document.getElementById('year') && (document.getElementById('year').textContent = y);
  document.getElementById('year2') && (document.getElementById('year2').textContent = y);
  document.getElementById('year3') && (document.getElementById('year3').textContent = y);
})();