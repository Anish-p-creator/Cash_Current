// 30‑Day Balance Projection (converted from front3.html)
// Usage: <script type="module" src="./front3.js"></script>
// or import { renderBalanceProjection } from './front3.js'

export function renderBalanceProjection(target = document.body, opts = {}) {
  injectStyles();

  const wrap = document.createElement('div');
  wrap.className = 'wrap';
  wrap.innerHTML = `
    <div class="panel">
      <div class="head">
        <h2>30‑Day Balance Projection</h2>
        <div class="spacer"></div>
        <span class="loss" id="delta">${opts.delta ?? '$-1502.94'}</span>
      </div>
      <div class="hint">Projected Balance (30 days)</div>
      <div class="balance" id="projected">${opts.projected ?? '$952.35'}</div>
      <div class="conf"><span class="dot">◎</span> <span id="confText">${opts.confidence ?? '80% confidence'}</span></div>
      <div class="chart"><svg id="svg" viewBox="0 0 960 360" preserveAspectRatio="none"></svg></div>
    </div>`;
  target.appendChild(wrap);

  // Data generation
  const days = 30;
  const start = opts.start ?? 2380;
  const end = opts.end ?? 952;
  const points = Array.from({ length: days }, (_, i) => {
    const t = i / (days - 1);
    const base = start + (end - start) * t;
    const noise = (Math.sin(i * 0.9) * 18) + (Math.random() * 8 - 4);
    return Math.max(0, base + noise);
  });

  const svg = wrap.querySelector('#svg');
  const W = 960, H = 360, P = 48;
  const minY = Math.floor(Math.min(...points) / 100) * 100 - 100;
  const maxY = Math.ceil(Math.max(...points) / 200) * 200 + 200;

  const y = v => {
    const k = (v - minY) / (maxY - minY);
    return H - P - k * (H - P - 24);
  };
  const x = i => P + (i * (W - P - 24)) / (days - 1);

  const grid = document.createElementNS('http://www.w3.org/2000/svg', 'g');
  grid.setAttribute('stroke', '#e5e7eb');
  grid.setAttribute('stroke-width', '1');
  for (let h = minY; h <= maxY; h += 200) {
    const gy = y(h);
    const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
    line.setAttribute('x1', String(P));
    line.setAttribute('x2', String(W - 12));
    line.setAttribute('y1', String(gy));
    line.setAttribute('y2', String(gy));
    grid.appendChild(line);

    const label = document.createElementNS('http://www.w3.org/2000/svg', 'text');
    label.setAttribute('x', String(8));
    label.setAttribute('y', String(gy + 4));
    label.setAttribute('class', 'axis');
    label.textContent = `$${h}`;
    svg.appendChild(label);
  }
  svg.appendChild(grid);

  // Area
  const area = document.createElementNS('http://www.w3.org/2000/svg', 'path');
  let d = `M ${x(0)} ${y(points[0])}`;
  for (let i = 1; i < days; i++) d += ` L ${x(i)} ${y(points[i])}`;
  d += ` L ${x(days - 1)} ${H - P} L ${x(0)} ${H - P} Z`;
  area.setAttribute('d', d);
  area.setAttribute('fill', '#000');
  svg.appendChild(area);

  // Line
  const line = document.createElementNS('http://www.w3.org/2000/svg', 'path');
  let dl = `M ${x(0)} ${y(points[0])}`;
  for (let i = 1; i < days; i++) dl += ` L ${x(i)} ${y(points[i])}`;
  line.setAttribute('d', dl);
  line.setAttribute('fill', 'none');
  line.setAttribute('stroke', '#111827');
  line.setAttribute('stroke-width', '2');
  svg.appendChild(line);

  // Dots
  for (let i = 0; i < days; i += 3) {
    const c = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
    c.setAttribute('cx', String(x(i)));
    c.setAttribute('cy', String(y(points[i])));
    c.setAttribute('r', '4');
    c.setAttribute('fill', '#000');
    c.setAttribute('stroke', '#111827');
    svg.appendChild(c);
  }

  // X labels
  const now = new Date();
  for (let i = 0; i < days; i += 4) {
    const dte = new Date(now);
    dte.setDate(now.getDate() + i);
    const label = document.createElementNS('http://www.w3.org/2000/svg', 'text');
    label.setAttribute('x', String(x(i)));
    label.setAttribute('y', String(H - 8));
    label.setAttribute('text-anchor', 'middle');
    label.setAttribute('class', 'axis');
    label.textContent = dte.toLocaleString(undefined, { month: 'short' }) + ' ' + dte.getDate();
    svg.appendChild(label);
  }
}

function injectStyles() {
  if (document.getElementById('balance-proj-styles')) return;
  const s = document.createElement('style');
  s.id = 'balance-proj-styles';
  s.textContent = `
    :root { --bg:#f7f7fb; --card:#ffffff; --text:#111827; --muted:#6b7280; --border:#e5e7eb; --red:#ef4444; --chip:#eef2f7; }
    *{box-sizing:border-box}
    body{margin:0;font-family:system-ui,-apple-system,Segoe UI,Roboto,Arial,sans-serif;color:var(--text);background:var(--bg)}
    .wrap{max-width:1120px;margin:24px auto;padding:0 16px}
    .panel{background:var(--card);border:1px solid var(--border);border-radius:16px;padding:16px}
    .head{display:flex;align-items:center;gap:10px}
    .head h2{margin:0;font-size:22px}
    .spacer{flex:1}
    .loss{background:#fee2e2;color:var(--red);padding:6px 10px;border-radius:999px;font-weight:700}
    .conf{display:inline-flex;align-items:center;gap:6px;color:var(--muted);font-size:14px}
    .conf .dot{width:20px;height:20px;border-radius:999px;display:grid;place-items:center;background:var(--chip)}
    .hint{color:var(--muted);font-size:13px;margin-top:6px}
    .balance{font-size:28px;font-weight:800;letter-spacing:.4px;margin:8px 0 10px 0}
    .chart{width:100%;height:360px;border-radius:12px;overflow:hidden;border:1px solid var(--border);background:#fff}
    .axis{color:var(--muted);font-size:12px}
  `;
  document.head.appendChild(s);
}

// Auto-mount
if (typeof window !== 'undefined' && !window.__BALANCE_PROJECTION_LOADED__) {
  window.__BALANCE_PROJECTION_LOADED__ = true;
  renderBalanceProjection();
}


