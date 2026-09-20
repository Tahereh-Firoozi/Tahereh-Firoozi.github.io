/* Progressive enhancement: every page and citation remains readable without JavaScript. */
(() => {
  'use strict';
  document.documentElement.classList.add('js');

  const menuButton = document.querySelector('.menu-toggle');
  const nav = document.getElementById('main-nav');
  if (menuButton && nav) {
    menuButton.hidden = false;
    const setMenu = (open) => {
      menuButton.setAttribute('aria-expanded', String(open));
      nav.classList.toggle('is-open', open);
      const symbol = menuButton.querySelector('.menu-symbol');
      if (symbol) symbol.textContent = open ? '×' : '☰';
    };
    menuButton.addEventListener('click', () => setMenu(menuButton.getAttribute('aria-expanded') !== 'true'));
    document.addEventListener('keydown', (event) => {
      if (event.key === 'Escape' && menuButton.getAttribute('aria-expanded') === 'true') {
        setMenu(false);
        menuButton.focus();
      }
    });
    nav.querySelectorAll('a').forEach(link => link.addEventListener('click', () => setMenu(false)));
    const desktop = window.matchMedia('(min-width: 1001px)');
    desktop.addEventListener('change', event => { if (event.matches) setMenu(false); });
  }

  const normalize = (text) => text.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();
  document.querySelectorAll('[data-filter-scope]').forEach(scope => {
    const bar = scope.querySelector('[data-filterbar]');
    const search = scope.querySelector('[data-search]');
    const selectors = Array.from(scope.querySelectorAll('[data-filter]'));
    const entries = Array.from(scope.querySelectorAll('[data-result]'));
    const groups = Array.from(scope.querySelectorAll('[data-result-group]'));
    const counter = scope.querySelector('[data-count]');
    const empty = scope.querySelector('[data-empty]');
    const cache = new Map(entries.map(row => [row, normalize(row.textContent || '')]));
    if (!bar || !search) return;
    bar.hidden = false;
    const countBar = scope.querySelector('[data-results-bar]');
    if (countBar) countBar.hidden = false;

    const update = () => {
      const words = normalize(search.value.trim()).split(/\s+/).filter(Boolean);
      let visible = 0;
      entries.forEach(row => {
        const textMatch = words.every(word => cache.get(row).includes(word));
        const filterMatch = selectors.every(select => !select.value || row.dataset[select.dataset.filter] === select.value);
        row.hidden = !(textMatch && filterMatch);
        if (!row.hidden) visible += 1;
      });
      groups.forEach(group => {
        group.hidden = !Array.from(group.querySelectorAll('[data-result]')).some(row => !row.hidden);
      });
      if (counter) counter.textContent = `${visible} of ${entries.length} entries`;
      if (empty) empty.hidden = visible !== 0;
    };
    search.addEventListener('input', update);
    selectors.forEach(select => select.addEventListener('change', update));
    scope.querySelectorAll('[data-reset]').forEach(button => button.addEventListener('click', () => {
      search.value = '';
      selectors.forEach(select => { select.value = ''; });
      update();
      search.focus();
    }));
    update();
  });

  let toastTimeout;
  const notify = (message) => {
    const toast = document.getElementById('toast');
    if (!toast) return;
    clearTimeout(toastTimeout);
    toast.textContent = message;
    toast.hidden = false;
    toastTimeout = setTimeout(() => { toast.hidden = true; }, 3500);
  };
  const copyText = async (text) => {
    try {
      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(text);
        return true;
      }
    } catch (_) { /* Fall back for local files or restricted browser permissions. */ }
    const field = document.createElement('textarea');
    field.value = text;
    field.setAttribute('readonly', '');
    field.style.position = 'fixed';
    field.style.left = '-9999px';
    document.body.appendChild(field);
    field.select();
    let copied = false;
    try { copied = document.execCommand('copy'); } catch (_) { copied = false; }
    field.remove();
    return copied;
  };
  document.querySelectorAll('[data-copy]').forEach(button => {
    button.hidden = false;
    button.addEventListener('click', async () => {
      const ok = await copyText(button.dataset.copy || '');
      button.focus();
      notify(ok ? 'Copied to clipboard.' : 'Your browser blocked copying. Please select and copy the text manually.');
    });
  });
})();
