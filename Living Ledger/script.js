/* Living Ledger — client-only demo
   Paste this into script.js, included by index.html.
   No backend required for demo.
*/
// Heartbeat Animation
const heart = document.getElementById("heart");
heart.addEventListener("click", () => {
  heart.classList.add("beat");
  setTimeout(() => heart.classList.remove("beat"), 200);
});

const startingBalance = 20000; // ₹ starting demo balance
let transactions = []; // will hold generated demo transactions
let chart = null;

// small keyword -> category mapping
const CATEGORY_KEYWORDS = {
  "Food": ["starbucks","cafe","restaurant","mcdonald","domino","dine","curry","pizza","burger","dining","restaurant"],
  "Transport": ["uber","ola","taxi","bus","metro","train","flight","cab"],
  "Shopping": ["amazon","flipkart","store","zara","h&m","shopping","mall"],
  "Entertainment": ["netflix","spotify","prime","movie","cinema"],
  "Bills": ["electricity","water","bill","internet","mobile","phone"],
  "Salary": ["salary","payroll","credit"],
  "Other": []
};

// Helper: format currency for India
function fmt(n) {
  try{
    return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits:0 }).format(n);
  } catch(e){
    return "₹" + Math.round(n);
  }
}

// date helpers
function daysAgoDate(n){
  const d = new Date();
  d.setDate(d.getDate() - n);
  return d.toISOString().slice(0,10);
}

// create some realistic fake transactions across last 40 days
function generateSampleTransactions(){
  const list = [];
  const descriptions = [
    "Starbucks", "Uber", "Flipkart", "Netflix", "Salary", "Grocery Store", "Dominos",
    "Restaurant", "Electricity Bill", "Mobile Recharge", "Cinema", "Amazon", "Metro"
  ];
  for(let d=40; d>=0; d--){
    // 30% chance of income (salary) on day 25 and day 55 simulated
    if(d === 30 && Math.random() > 0.6){
      list.push({date: daysAgoDate(d), desc: "Salary", amount: +40000});
    }
    // 1-3 purchases per day
    const count = Math.random() < 0.6 ? Math.floor(Math.random()*2)+1 : 0;
    for(let i=0;i<count;i++){
      const desc = descriptions[Math.floor(Math.random()*descriptions.length)];
      // amount rules: salary positive else negative small/medium
      let amt = 0;
      if(desc.toLowerCase().includes("salary")){
        amt = +[30000,35000,40000][Math.floor(Math.random()*3)];
      } else if(desc.toLowerCase().includes("grocery") || desc.toLowerCase().includes("flipkart") || desc.toLowerCase().includes("amazon")){
        amt = - (Math.floor(Math.random()*1500) + 200);
      } else if(desc.toLowerCase().includes("starbucks") || desc.toLowerCase().includes("dominos") || desc.toLowerCase().includes("restaurant")){
        amt = - (Math.floor(Math.random()*700) + 100);
      } else if(desc.toLowerCase().includes("uber") || desc.toLowerCase().includes("metro") || desc.toLowerCase().includes("taxi")){
        amt = - (Math.floor(Math.random()*600) + 50);
      } else if(desc.toLowerCase().includes("netflix") || desc.toLowerCase().includes("cinema")){
        amt = - (Math.floor(Math.random()*700) + 50);
      } else if(desc.toLowerCase().includes("electricity") || desc.toLowerCase().includes("mobile")){
        amt = - (Math.floor(Math.random()*3000) + 300);
      } else {
        amt = - (Math.floor(Math.random()*1000) + 50);
      }
      list.push({date: daysAgoDate(d), desc, amount: amt});
    }
  }
  // sort ascending by date (oldest first)
  list.sort((a,b)=> a.date.localeCompare(b.date));
  return list;
}

function categorize(description){
  const d = description.toLowerCase();
  for(const [cat, keywords] of Object.entries(CATEGORY_KEYWORDS)){
    for(const kw of keywords){
      if(d.includes(kw)) return cat;
    }
  }
  return "Other";
}

// build transactions table
function renderTransactions(txs){
  const tbody = document.querySelector("#transactionsTable tbody");
  tbody.innerHTML = "";
  // latest first in table
  const copy = [...txs].reverse();
  for(const t of copy){
    const tr = document.createElement("tr");
    tr.innerHTML = `<td>${t.date}</td><td>${t.desc}</td><td>${t.category || categorize(t.desc)}</td><td>${fmt(t.amount)}</td>`;
    tbody.appendChild(tr);
  }
}

// compute daily sums for last N days (N = 30)
function computeDailySums(txs, days=30){
  const map = {};
  for(let i=days-1;i>=0;i--){
    map[daysAgoDate(i)] = 0;
  }
  for(const t of txs){
    if(map.hasOwnProperty(t.date)){
      map[t.date] += t.amount;
    }
  }
  return map; // {date: sum}
}

// compute historical balances: array of {date, balance}
function computeHistoricalBalances(startBal, dailySums){
  const dates = Object.keys(dailySums); // ascending from oldest to newest
  const balances = [];
  let bal = startBal;
  for(const dt of dates){
    bal = bal + dailySums[dt]; // apply daily net change
    balances.push({date: dt, balance: Math.round(bal)});
  }
  return balances;
}

// compute average daily spend (consider only negative amounts)
function computeAverageDailySpend(txs, days=30){
  // sum negative amounts in last `days`
  let sumNeg = 0;
  for(const t of txs){
    // count only last N days
    const cutoff = daysAgoDate(days-1);
    if(t.date >= cutoff && t.amount < 0) sumNeg += Math.abs(t.amount);
  }
  return sumNeg / days;
}

// project balance for next N days using avg spend
function projectBalances(lastBalance, avgSpendPerDay, days=30){
  const arr = [];
  let b = lastBalance;
  for(let i=1;i<=days;i++){
    b = b - avgSpendPerDay;
    arr.push({date: daysAgoDate(-i), balance: Math.round(b)}); // daysAgo negative -> future
  }
  return arr;
}

// produce a clear single insight: dining this week vs average
function computeInsight(txs){
  // classify txs by category
  const today = new Date().toISOString().slice(0,10);
  // sum dining (Food) for last 7 days
  let sumLast7 = 0;
  let sumPrevWeeks = 0;
  for(const t of txs){
    const cat = categorize(t.desc);
    const daysDiff = (new Date(today) - new Date(t.date)) / (1000*60*60*24);
    if(cat === "Food"){
      if(daysDiff >=0 && daysDiff < 7) sumLast7 += Math.abs(t.amount);
      else if(daysDiff >=7 && daysDiff < 28) sumPrevWeeks += Math.abs(t.amount);
    }
  }
  const avgPrevWeek = (sumPrevWeeks/3) || 0; // average weekly food spend for previous 3 weeks
  let text = "";
  if(avgPrevWeek === 0 && sumLast7 === 0) text = "No dining transactions in the sample data.";
  else if(avgPrevWeek === 0) text = `You spent ${fmt(sumLast7)} on dining this week.`;
  else {
    const pct = Math.round(((sumLast7 - avgPrevWeek) / avgPrevWeek) * 100);
    const sign = pct > 0 ? "more" : (pct < 0 ? "less" : "the same");
    text = `You spent ${fmt(sumLast7)} on dining this week — ${Math.abs(pct)}% ${sign} than your recent weekly average (${fmt(Math.round(avgPrevWeek))}).`;
  }
  return text;
}

// build chart with Chart.js
function buildChart(historical, forecast){
  const labels = historical.map(x=>x.date).concat(forecast.map(x=>x.date));
  const histVals = historical.map(x=>x.balance);
  const forecastVals = Array(historical.length-1).fill(null).concat([historical[historical.length-1].balance]).concat(forecast.map(x=>x.balance));
  // remove existing
  const ctx = document.getElementById('balanceChart').getContext('2d');
  if(chart) chart.destroy();
  chart = new Chart(ctx, {
    type: 'line',
    data: {
      labels,
      datasets: [
        {
          label: 'Balance (past + projected)',
          data: forecastVals,
          fill: true,
          tension: 0.35,
          borderWidth: 2,
          pointRadius: 0,
          backgroundColor: 'rgba(6,182,212,0.08)',
          borderColor: 'rgba(6,182,212,0.9)',
          segment: {
            borderDash: ctx => {
              // use dashed line for forecast area (after historic last index)
              return (ctx.p0DataIndex >= historical.length-1) ? [6,6] : [];
            }
          }
        }
      ]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      scales: {
        x: { ticks: { maxRotation: 45, minRotation: 0 } },
        y: { beginAtZero: false }
      },
      plugins: { legend: { display: false } }
    }
  });
}
// Auto Projection Function
function addProjection() {
  let lastBalance = data[data.length - 1];
  let projection = lastBalance - 50; // assume average spend of 50/day
  labels.push(`Future ${labels.length + 1}`);
  data.push(projection);
  financeChart.update();

  document.getElementById("insightText").innerText += 
    ` | Projection: ₹${projection} tomorrow.`;
}

// Add projections every 5 seconds
setInterval(addProjection, 5000);


// main render/update flow
function updateUI(){
  renderTransactions(transactions);
  const dailySums = computeDailySums(transactions, 30);
  const historical = computeHistoricalBalances(startingBalance, dailySums);
  const avgSpend = computeAverageDailySpend(transactions, 30);
  const forecast = projectBalances(historical[historical.length-1].balance, avgSpend, 30);
  buildChart(historical, forecast);

  // update balances
  const currentBal = historical[historical.length-1].balance;
  const projectedBal = forecast[forecast.length-1].balance;
  document.getElementById('currentBalance').innerText = fmt(currentBal);
  document.getElementById('projectedBalance').innerText = fmt(projectedBal);

  // insight
  document.getElementById('insightText').innerText = computeInsight(transactions);
}

// button handlers
document.getElementById('connectBtn').addEventListener('click', ()=>{
  // Simulate connecting to bank: just (re)generate data and refresh UI
  transactions = generateSampleTransactions();
  // add category fields
  transactions = transactions.map(t => ({...t, category: categorize(t.desc)}));
  updateUI();
  alert("Demo bank connected: sample transactions loaded!");
});

// simulate extra transactions (helps judges see dynamic changes)
document.getElementById('addNoiseBtn').addEventListener('click', ()=>{
  // add 5 random transactions in last 5 days
  for(let i=0;i<5;i++){
    const day = Math.floor(Math.random()*5);
    const desc = ["Starbucks","Uber","Grocery Store","Dominos","Electricity Bill","Netflix"][Math.floor(Math.random()*6)];
    let amt = 0;
    if(desc === "Starbucks") amt = - (Math.floor(Math.random()*600)+50);
    else if(desc === "Uber") amt = - (Math.floor(Math.random()*500)+30);
    else if(desc === "Grocery Store") amt = - (Math.floor(Math.random()*1200)+200);
    else if(desc === "Dominos") amt = - (Math.floor(Math.random()*700)+100);
    else if(desc === "Electricity Bill") amt = - (Math.floor(Math.random()*2500)+200);
    else amt = - (Math.floor(Math.random()*700)+50);
    transactions.push({date: daysAgoDate(day), desc, amount: amt, category: categorize(desc)});
  }
  // ensure sort
  transactions.sort((a,b)=> a.date.localeCompare(b.date));
  updateUI();
});

// load initial tiny demo so page isn't empty
transactions = generateSampleTransactions();
transactions = transactions.map(t => ({...t, category: categorize(t.desc)}));
updateUI();
// Transaction Form
const form = document.getElementById("transactionForm");
form.addEventListener("submit", (e) => {
  e.preventDefault();

  const date = document.getElementById("date").value;
  const desc = document.getElementById("desc").value;
  const amount = parseFloat(document.getElementById("amount").value);

  // Update data
  labels.push(date || `Day ${labels.length + 1}`);
  let newBalance = data[data.length - 1] + amount;
  data.push(newBalance);

  // Update chart
  financeChart.update();

  // Update insight
  document.getElementById("insightText").innerText = 
    `Last transaction: ${desc} (${amount > 0 ? "+" : ""}${amount}). 
     Projected balance: ₹${newBalance}`;
  
  form.reset();
});

