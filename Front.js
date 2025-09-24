// Renders the Smart Insights grid (converted from Front.html)
// Usage: include with <script type="module" src="./Front.js"></script>
// or: import { renderSmartInsights } from './Front.js'; renderSmartInsights();

export function renderSmartInsights(target = document.body, insights = defaultInsights()) {
  injectStyles();

  const root = document.createElement('div');
  root.className = 'container';
  root.innerHTML = `
    <div class="header">
      <div class="icon">⚡</div>
      <div>
        <div class="title">Smart Insights</div>
        <div class="subtitle">AI‑powered analysis of your spending patterns</div>
      </div>
    </div>
    <div id="insights" class="grid"></div>
  `;
  target.appendChild(root);

  const container = root.querySelector('#insights');
  container.innerHTML = '';
  insights.forEach(item => container.appendChild(createCard(item)));
}

function createCard(item) {
  const card = document.createElement('div');
  card.className = `card ${item.severity}`;

  const head = document.createElement('div');
  head.className = 'card-head';

  const chip = document.createElement('div');
  chip.className = 'chip';
  chip.innerHTML = `
    <span class="logo">🧠</span>
    <span>${item.title}</span>
  `;

  const warn = document.createElement('div');
  warn.className = 'delta';
  warn.textContent = item.delta;

  head.appendChild(chip);
  head.appendChild(warn);

  const body = document.createElement('div');
  body.className = 'body';
  body.textContent = item.message;

  const tags = document.createElement('div');
  tags.className = 'tags';

  const cat = document.createElement('span');
  cat.className = 'tag';
  cat.textContent = item.category;

  const trend = document.createElement('span');
  trend.className = `trend ${item.trend}`;
  trend.textContent = item.trend === 'up' ? '↑ Up' : item.trend === 'down' ? '↓ Down' : '○ Stable';

  tags.appendChild(cat);
  tags.appendChild(trend);

  card.appendChild(head);
  card.appendChild(body);
  card.appendChild(tags);
  return card;
}

function injectStyles() {
  if (document.getElementById('smart-insights-styles')) return;
  const style = document.createElement('style');
  style.id = 'smart-insights-styles';
  style.textContent = `
    :root { --bg:#f7f8fb; --card:#ffffff; --text:#1f2a37; --muted:#6b7280; --border:#e5e7eb; --danger-bg:#fde8e8; --danger:#dc2626; --success-bg:#e7f6ee; --success:#16a34a; --stable-bg:#fff4e5; --stable:#f59e0b; --chip:#eef2f7; --chip-text:#334155; }
    *{box-sizing:border-box}
    body{margin:0;font-family:system-ui,-apple-system,Segoe UI,Roboto,Arial,sans-serif;background:var(--bg);color:var(--text)}
    .container{max-width:1100px;margin:24px auto;padding:0 16px}
    .header{display:flex;align-items:center;gap:10px;margin-bottom:16px}
    .header .icon{width:28px;height:28px;display:grid;place-items:center;border-radius:6px;background:#eef2ff;color:#4f46e5;font-weight:700}
    .title{font-size:24px;font-weight:700}
    .subtitle{color:var(--muted);margin-top:2px}
    .grid{display:grid;grid-template-columns:1fr 1fr;gap:16px}
    @media (max-width:900px){.grid{grid-template-columns:1fr}}
    .card{background:var(--card);border:1px solid var(--border);border-radius:14px;padding:16px 16px 12px 16px;display:flex;flex-direction:column;gap:10px}
    .card.danger{background:var(--danger-bg)}
    .card.success{background:var(--success-bg)}
    .card.stable{background:var(--stable-bg)}
    .card-head{display:flex;align-items:center;justify-content:space-between}
    .chip{display:inline-flex;align-items:center;gap:8px;padding:8px 10px;border-radius:10px;background:var(--chip);color:var(--chip-text);font-weight:600;font-size:14px}
    .chip .logo{width:22px;height:22px;display:grid;place-items:center;background:#eaf2ff;color:#3b82f6;border-radius:6px;font-weight:700}
    .body{color:var(--text);line-height:1.5}
    .tags{display:flex;flex-wrap:wrap;gap:8px;margin-top:6px}
    .tag{display:inline-flex;align-items:center;gap:6px;font-size:12px;padding:6px 8px;border-radius:999px;background:#eef2f7;color:#334155}
    .trend{padding:6px 8px;border-radius:999px;font-size:12px}
    .trend.up{background:#fde8e8;color:var(--danger)}
    .trend.down{background:#e7f6ee;color:var(--success)}
    .trend.stable{background:#fff4e5;color:var(--stable)}
    .delta{margin-left:auto;font-weight:700;color:#ffffff;background:#ef4444;border-radius:10px;padding:8px 12px;min-width:72px;text-align:center}
    .card.success .delta{background:#10b981}
    .card.stable .delta{background:#f59e0b}
  `;
  document.head.appendChild(style);
}

function defaultInsights() {
  return [
    {
      title: 'Smart Insight on Dining',
      severity: 'danger',
      message: "You've spent 25% more on dining out this week compared to your average. Consider cooking at home to save money.",
      category: 'Dining',
      trend: 'up',
      delta: '+25.3%'
    },
    {
      title: 'Smart Insight on shopping',
      severity: 'success',
      message: 'Great job! Your transportation costs are down 15% this month thanks to using public transit more often.',
      category: 'Transportation',
      trend: 'down',
      delta: '-15.2%'
    },
    {
      title: 'Smart Insight on transportation',
      severity: 'danger',
      message: 'Shopping expenses have increased by 30% this week. Most purchases were at Target and Amazon.',
      category: 'Shopping',
      trend: 'up',
      delta: '+30.7%'
    },
    {
      title: 'Smart Insight on entertantment',
      severity: 'stable',
      message: "Your entertainment spending is within your normal range. You're maintaining good balance between fun and savings.",
      category: 'Entertainment',
      trend: 'stable',
      delta: '+2.1%'
    }
  ];
}

// Auto-mount if loaded directly in the browser
if (typeof window !== 'undefined' && !window.__SMART_INSIGHTS_LOADED__) {
  window.__SMART_INSIGHTS_LOADED__ = true;
  renderSmartInsights();
}


