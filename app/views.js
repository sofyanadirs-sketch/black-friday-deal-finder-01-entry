// DealHound — HTML for every page, built from the deal data in data.js.
// Every value that came from the data is escaped before it goes into the page.

import { CHECKED_LABEL, deals } from './data.js';
import { boardStats, checkedLabel, dealScore, discountPct, groupListings, money, savedUsd, verdict } from './filters.js';

const escape = (s) => String(s).replace(/[&<>"']/g, (c) => `&#${c.charCodeAt(0)};`);

// One deal card: verdict badge, price block, evidence line, store link and,
// where the same product is sold elsewhere, a link to compare the stores.
export function dealCard(d) {
  const v = verdict(d);
  const pct = discountPct(d);
  const saved = savedUsd(d);
  const others = d.group ? groupListings(deals, d.group).filter((x) => x.id !== d.id) : [];
  const cheapest = others.length > 0 && others.every((x) => x.price >= d.price);
  return `<article class="card">
  <div class="card-top"><span class="badge badge-${v.key}">${escape(v.label)}</span><span class="score" title="Deal score out of 100">Score ${dealScore(d)}</span></div>
  <h3><a href="#/deal/${encodeURIComponent(d.id)}">${escape(d.title)}</a></h3>
  <p class="meta"><span class="store">${escape(d.store)}</span> · ${escape(d.category)}</p>
  <p class="price"><strong>${money(d.price)}</strong> <s>${money(d.was)}</s> <span class="pct">−${pct}%</span></p>
  <p class="saved">You save ${money(saved)}</p>
  <div class="meter" aria-hidden="true"><span style="width:${dealScore(d)}%"></span></div>
  <p class="evidence">${escape(d.evidence)}</p>
  <p class="checked">Checked ${checkedLabel(d.checked)} · ${escape(d.source)}</p>
  <p class="actions"><a class="btn" href="${escape(d.url)}" target="_blank" rel="noopener">View at ${escape(d.store)} →</a>${
    d.group
      ? ` <a class="compare-link" href="#/compare/${encodeURIComponent(d.group)}">Compare ${others.length + 1} stores</a>`
      : ''
  }${cheapest && others.length > 0 ? ' <span class="cheapest">Cheapest here</span>' : ''}</p>
</article>`;
}

export function cardGrid(list) {
  if (list.length === 0) {
    return '<p class="empty">No deal matches those filters. Loosen the filters or clear the search.</p>';
  }
  return `<div class="grid">${list.map(dealCard).join('')}</div>`;
}

// The filter bar: search, category, store, minimum discount, sort, new-lows
// toggle. main.js wires the controls; this only renders them.
export function filterBar(categories, stores, f) {
  const opt = (list, current) =>
    list.map((x) => `<option value="${escape(x)}"${x === current ? ' selected' : ''}>${escape(x)}</option>`).join('');
  return `<section class="filters" aria-label="Search and filter deals">
  <label class="search-label">Search <input id="q" type="search" placeholder="Try “AirPods”, “TV”, “LEGO”…" value="${escape(f.q || '')}"></label>
  <label>Category <select id="f-category">${opt(['All', ...categories], f.category)}</select></label>
  <label>Store <select id="f-store">${opt(['All', ...stores], f.store)}</select></label>
  <label>Min. discount <select id="f-minpct">
    ${[0, 20, 30, 40, 50].map((n) => `<option value="${n}"${f.minPct === n ? ' selected' : ''}>${n === 0 ? 'Any' : n + '% off or more'}</option>`).join('')}
  </select></label>
  <label>Sort <select id="f-sort">
    <option value="score"${f.sort === 'score' ? ' selected' : ''}>Best deal first</option>
    <option value="saved"${f.sort === 'saved' ? ' selected' : ''}>Biggest $ saved</option>
    <option value="pct"${f.sort === 'pct' ? ' selected' : ''}>Biggest % off</option>
    <option value="price"${f.sort === 'price' ? ' selected' : ''}>Lowest price</option>
    <option value="az"${f.sort === 'az' ? ' selected' : ''}>A to Z</option>
  </select></label>
  <label class="check-label"><input id="f-newlow" type="checkbox"${f.newLowOnly ? ' checked' : ''}> New lows only</label>
</section>`;
}

// Header strip: the board at a glance.
export function statsStrip() {
  const s = boardStats(deals);
  return `<section class="stats" aria-label="Board totals">
  <div><strong>${s.deals}</strong><span>verified deals</span></div>
  <div><strong>${s.stores}</strong><span>stores</span></div>
  <div><strong>${s.categories}</strong><span>categories</span></div>
  <div><strong>${money(s.totalSaved)}</strong><span>total savings</span></div>
  <div><strong>${s.newLows}</strong><span>record lows</span></div>
  <div><strong>${s.groups}</strong><span>products compared across stores</span></div>
</section>`;
}

export function listPage(f, shown) {
  return `<h1>Black Friday 2026, checked deal by deal</h1>
<p class="lede">Every price below was read on ${escape(CHECKED_LABEL)} from a deals source that names the store — no made-up prices, no inflated “was” prices. The best bargains sit first; each card says plainly whether it is really a deal.</p>
${statsStrip()}
${filterBar([...new Set(deals.map((d) => d.category))], [...new Set(deals.map((d) => d.store))], f)}
<p class="count"><strong>${shown.length}</strong> of ${deals.length} deals shown</p>
${cardGrid(shown)}`;
}

// One deal, full detail: price block, verdict with its evidence, the source
// and check time, and the same product at every other store that sells it.
export function dealPage(d) {
  const v = verdict(d);
  const pct = discountPct(d);
  const saved = savedUsd(d);
  const group = groupListings(deals, d.group);
  return `<p class="crumb"><a href="#/">← All deals</a>${d.group ? ` · <a href="#/compare/${encodeURIComponent(d.group)}">Compare this product across stores</a>` : ''}</p>
<h1>${escape(d.title)}</h1>
<p class="meta"><span class="store">${escape(d.store)}</span> · ${escape(d.category)}</p>
<section class="detail">
  <p class="price big"><strong>${money(d.price)}</strong> <s>${money(d.was)}</s> <span class="pct">−${pct}%</span></p>
  <p class="saved">You save ${money(saved)} · Deal score ${dealScore(d)}/100</p>
  <p><span class="badge badge-${v.key}">${escape(v.label)}</span></p>
  <p class="verdict-note">${escape(v.note)}</p>
  <p class="evidence">${escape(d.evidence)}</p>
  <dl>
    <dt>Store</dt><dd>${escape(d.store)}</dd>
    <dt>Category</dt><dd>${escape(d.category)}</dd>
    <dt>Sale price</dt><dd>${money(d.price)}</dd>
    <dt>Usual price</dt><dd>${money(d.was)}</dd>
    <dt>Discount</dt><dd>${pct}% off, ${money(saved)} saved</dd>
    <dt>Price checked</dt><dd>${checkedLabel(d.checked)}</dd>
    <dt>Read in</dt><dd>${escape(d.source)}</dd>
  </dl>
  <p><a class="btn" href="${escape(d.url)}" target="_blank" rel="noopener">Buy it at ${escape(d.store)} →</a></p>
  <p class="fineprint">Prices move all day on Black Friday — confirm the price at checkout before you order.</p>
</section>
${group.length > 1 ? `<section class="compare-mini"><h2>Same product, other stores</h2>${compareTable(group, group[0].id)}</section>` : ''}`;
}

// Cross-store table for one product: every store's price side by side, the
// cheapest row marked, so a shopper sees at a glance where to buy.
export function compareTable(listings, highlightId) {
  const rows = listings
    .map(
      (d) => `<tr${d.id === highlightId ? ' class="best"' : ''}>
  <td>${escape(d.store)}${d.id === highlightId ? ' ★ cheapest' : ''}</td>
  <td><strong>${money(d.price)}</strong></td>
  <td><s>${money(d.was)}</s></td>
  <td>−${discountPct(d)}%</td>
  <td>${money(savedUsd(d))} saved</td>
  <td><a href="${escape(d.url)}" target="_blank" rel="noopener">View →</a></td>
</tr>`,
    )
    .join('');
  return `<table class="compare">
  <thead><tr><th>Store</th><th>Sale price</th><th>Usual</th><th>Off</th><th>Saved</th><th></th></tr></thead>
  <tbody>${rows}</tbody>
</table>`;
}

export function comparePage(group, listings) {
  const title = listings[0].title;
  return `<p class="crumb"><a href="#/">← All deals</a></p>
<h1>${escape(title)} — price at every store</h1>
<p class="lede">The same product, checked at ${listings.length} stores on ${escape(CHECKED_LABEL)}. The cheapest row is marked; every price below was read the same day from a source that names its store.</p>
${compareTable(listings, listings[0].id)}
<p class="fineprint">Usual prices can differ by store — each “was” is the price that store’s own listing showed. Check the price at checkout before you order.</p>
<h2>All listings</h2>
${cardGrid(listings)}`;
}

export function missingPage() {
  return `<h1>Not found</h1>
<p>There is no deal or comparison at this address. <a href="#/">See all deals</a>.</p>`;
}

export function methodFooter() {
  return `<h2>How these deals were checked</h2>
<p>Each price on this board was read on ${escape(CHECKED_LABEL)} by the agent that built this site, from a deals roundup or store page that names the store — RedmondPie, BuzzFeed, Walmart.com, YayaNews, Montgomery Daily News, TrendThread, Mashable, DealNews and Topsave. Every card shows the source and the check time, and the discount is always computed from the two prices shown. A deal is labelled <strong>NEW LOW</strong> only when its source calls the price a record low; the rest are graded on the discount alone, so thin cuts are labelled routine sales instead of dressed up as bargains. Prices move during Black Friday — always confirm at checkout.</p>
<p>DealHound is an independent roundup. Store names belong to their owners; links go to the stores’ own search pages for each product.</p>`;
}
