// DealHound — deal math: discount, verdict, score, filter and sort.
// Everything here is computed from the two prices in data.js, so the numbers
// on the page always add up with the prices shown.

export function discountPct(d) {
  return Math.round((1 - d.price / d.was) * 100);
}

export function savedUsd(d) {
  return Math.round((d.was - d.price) * 100) / 100;
}

// Deal score, 0-100: discount first, then dollars saved, then a bonus when a
// source calls the price a record low. Drives the default "Best deal first"
// order, so the strongest bargains sit at the top of the list.
export function dealScore(d) {
  const pct = discountPct(d);
  const dollars = Math.min(savedUsd(d) / 10, 25);
  const low = d.newLow ? 25 : 0;
  return Math.min(100, Math.round(pct + dollars + low));
}

// The honest "is it really a deal" verdict. A new low is its own tier; the
// rest grade on the discount alone, so a thin cut is labelled a routine sale
// instead of dressed up as a bargain.
export function verdict(d) {
  if (d.newLow) return { key: 'new-low', label: 'NEW LOW', note: 'Lowest price the source has seen for this product.' };
  const pct = discountPct(d);
  if (pct >= 50) return { key: 'real', label: 'REAL DEAL', note: 'Half price or better — a genuine Black Friday cut.' };
  if (pct >= 30) return { key: 'strong', label: 'STRONG DEAL', note: 'A solid cut, well above a normal sale.' };
  if (pct >= 20) return { key: 'good', label: 'GOOD DEAL', note: 'Worth it if you already wanted one.' };
  return { key: 'routine', label: 'ROUTINE SALE', note: 'A small cut — a normal sale price, not a standout.' };
}

export function money(n) {
  return '$' + n.toLocaleString('en-US', { minimumFractionDigits: Number.isInteger(n) ? 0 : 2, maximumFractionDigits: 2 });
}

export function checkedLabel(iso) {
  const d = new Date(iso);
  return d.toLocaleString('en-US', { month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit', timeZone: 'UTC' }) + ' UTC';
}

// Distinct values for the filter controls, in first-seen order.
export function categoriesOf(list) {
  return [...new Set(list.map((d) => d.category))];
}

export function storesOf(list) {
  return [...new Set(list.map((d) => d.store))];
}

// One pass over the deals: text search, category, store, minimum discount,
// new-lows-only, then the chosen sort. Returns a fresh array.
export function applyFilters(list, f) {
  const q = (f.q || '').trim().toLowerCase();
  let out = list.filter((d) => {
    if (q && !`${d.title} ${d.store} ${d.category}`.toLowerCase().includes(q)) return false;
    if (f.category !== 'All' && d.category !== f.category) return false;
    if (f.store !== 'All' && d.store !== f.store) return false;
    if (discountPct(d) < f.minPct) return false;
    if (f.newLowOnly && !d.newLow) return false;
    return true;
  });
  const by = {
    score: (a, b) => dealScore(b) - dealScore(a) || discountPct(b) - discountPct(a),
    saved: (a, b) => savedUsd(b) - savedUsd(a),
    pct: (a, b) => discountPct(b) - discountPct(a),
    price: (a, b) => a.price - b.price,
    az: (a, b) => a.title.localeCompare(b.title),
  }[f.sort] || ((a, b) => dealScore(b) - dealScore(a));
  return [...out].sort(by);
}

// All listings of one product group, cheapest first.
export function groupListings(list, group) {
  if (!group) return [];
  return list.filter((d) => d.group === group).sort((a, b) => a.price - b.price);
}

// Board totals for the header strip.
export function boardStats(list) {
  const totalSaved = list.reduce((s, d) => s + savedUsd(d), 0);
  const newLows = list.filter((d) => d.newLow).length;
  return {
    deals: list.length,
    stores: storesOf(list).length,
    categories: categoriesOf(list).length,
    totalSaved: Math.round(totalSaved),
    newLows,
    groups: new Set(list.map((d) => d.group).filter(Boolean)).size,
  };
}
