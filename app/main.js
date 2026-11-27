// DealHound — the router. Hash routes, no network: the deals live in data.js.
//
//   #/                  the board: search + filters + deal cards
//   #/deal/<id>         one deal, full detail
//   #/compare/<group>   one product at every store that sells it
//
// window.__shotReady is false while a page renders and true once it is on
// screen, so a screenshot script knows when to capture.

import { deals } from './data.js';
import { applyFilters, groupListings } from './filters.js';
import { comparePage, dealPage, listPage, methodFooter, missingPage } from './views.js';

const app = document.getElementById('app');

// Filter state for the board. Defaults show the best deals first.
const filters = { q: '', category: 'All', store: 'All', minPct: 0, sort: 'score', newLowOnly: false };

function renderBoard() {
  const shown = applyFilters(deals, filters);
  document.title = 'DealHound — Black Friday 2026 deal finder';
  app.innerHTML = listPage(filters, shown) + `<footer>${methodFooter()}</footer>`;
  wireBoard();
}

function wireBoard() {
  const q = app.querySelector('#q');
  const category = app.querySelector('#f-category');
  const store = app.querySelector('#f-store');
  const minPct = app.querySelector('#f-minpct');
  const sort = app.querySelector('#f-sort');
  const newLow = app.querySelector('#f-newlow');
  // Typing in search re-renders the board but keeps the cursor in the box.
  q.addEventListener('input', () => {
    filters.q = q.value;
    const pos = q.selectionStart;
    renderBoard();
    const next = app.querySelector('#q');
    next.focus();
    next.setSelectionRange(pos, pos);
  });
  const rerender = () => renderBoard();
  category.addEventListener('change', () => { filters.category = category.value; rerender(); });
  store.addEventListener('change', () => { filters.store = store.value; rerender(); });
  minPct.addEventListener('change', () => { filters.minPct = Number(minPct.value); rerender(); });
  sort.addEventListener('change', () => { filters.sort = sort.value; rerender(); });
  newLow.addEventListener('change', () => { filters.newLowOnly = newLow.checked; rerender(); });
}

function render() {
  window.__shotReady = false;
  const hash = location.hash || '#/';
  const dealMatch = hash.match(/^#\/deal\/([^/?]+)/);
  const compareMatch = hash.match(/^#\/compare\/([^/?]+)/);
  if (dealMatch) {
    const found = deals.find((d) => d.id === decodeURIComponent(dealMatch[1]));
    document.title = `${found ? found.title : 'Not found'} | DealHound`;
    app.innerHTML = found ? dealPage(found) + `<footer>${methodFooter()}</footer>` : missingPage();
  } else if (compareMatch) {
    const group = decodeURIComponent(compareMatch[1]);
    const listings = groupListings(deals, group);
    document.title = listings.length ? `${listings[0].title} — compare prices | DealHound` : 'Not found | DealHound';
    app.innerHTML = listings.length
      ? comparePage(group, listings) + `<footer>${methodFooter()}</footer>`
      : missingPage();
  } else {
    renderBoard();
  }
  window.scrollTo(0, 0);
  window.__shotReady = true;
}

window.addEventListener('hashchange', render);
render();
