import React, { useState, useEffect, useMemo } from 'react';
import {
  HashRouter,
  Routes,
  Route,
  NavLink,
  useLocation,
} from 'react-router-dom';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  ArcElement, // Needed for Doughnut chart
  Title,
  Tooltip,
  Legend,
  Filler, // Needed for filled line charts
} from 'chart.js';
import { Line, Doughnut } from 'react-chartjs-2';

// Register all necessary Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

// --- Embedded CSS Styles ---
const GlobalStyles = () => (
  <style>{`
    /* Basic Reset & Body Styles */
    :root {
      --primary-blue: #3B82F6;
      --background-color: #F9FAFB;
      --sidebar-background: #FFFFFF;
      --card-background: #FFFFFF;
      --text-primary: #111827;
      --text-secondary: #6B7280;
      --border-color: #E5E7EB;
      --green-accent: #10B981;
      --red-accent: #EF4444;
      --search-bg: #F3F4F6;
      --nav-hover-bg: #F3F4F6;
      --nav-active-bg: #F3F4F6;
      --btn-bg: #FFFFFF;
      --timeframe-btn-bg: #F3F4F6;
      --timeframe-btn-active-bg: var(--primary-blue);
      --timeframe-btn-active-color: #FFFFFF;
    }

    body.dark {
      --primary-blue: #60A5FA;
      --background-color: #111827;
      --sidebar-background: #1F2937;
      --card-background: #1F2937;
      --text-primary: #F9FAFB;
      --text-secondary: #9CA3AF;
      --border-color: #374151;
      --green-accent: #34D399;
      --red-accent: #F87171;
      --search-bg: #374151;
      --nav-hover-bg: #374151;
      --nav-active-bg: #374151;
      --btn-bg: #374151;
      --timeframe-btn-bg: #374151;
      --timeframe-btn-active-bg: var(--primary-blue);
      --timeframe-btn-active-color: #1F2937;
    }

    body {
      margin: 0;
      font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto',
        'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue',
        sans-serif;
      -webkit-font-smoothing: antialiased;
      -moz-osx-font-smoothing: grayscale;
      background-color: var(--background-color);
      color: var(--text-primary);
      transition: background-color 0.3s, color 0.3s;
    }

    /* App Layout */
    .app-container { display: flex; min-height: 100vh; }
    .sidebar { width: 260px; background-color: var(--sidebar-background); border-right: 1px solid var(--border-color); display: flex; flex-direction: column; position: fixed; height: 100%; padding: 1rem; transition: background-color 0.3s, border-color 0.3s; }
    .main-content { flex-grow: 1; margin-left: 260px; }
    .page-content { padding: 2.5rem; }

    /* Header */
    .header {
        padding: 1.5rem 2.5rem;
        background-color: var(--card-background);
        border-bottom: 1px solid var(--border-color);
        display: flex;
        justify-content: space-between;
        align-items: center;
        transition: background-color 0.3s, border-color 0.3s;
    }
    .header-left { display: flex; flex-direction: column; }
    .header-right { display: flex; align-items: center; gap: 1rem; }
    .search-bar { display: flex; align-items: center; background-color: var(--search-bg); border-radius: 0.5rem; padding: 0.5rem 0.75rem; transition: background-color 0.3s; }
    .search-bar input { border: none; background: none; outline: none; margin-left: 0.5rem; color: var(--text-primary); }
    .header-icon { font-size: 1.25rem; color: var(--text-secondary); cursor: pointer; background: none; border: none; padding: 0; }
    .user-avatar { width: 32px; height: 32px; border-radius: 50%; background-color: #DBEAFE; }

    h1, h2, h3, h4 { margin: 0; font-weight: 600; }
    .page-title { font-size: 1.5rem; }
    .page-subtitle { color: var(--text-secondary); margin-top: 0.25rem; font-size: 0.9rem; }

    /* Sidebar */
    .sidebar-header { display: flex; align-items: center; gap: 0.75rem; padding: 1rem 0.5rem; margin-bottom: 1.5rem; }
    .logo { width: 40px; height: 40px; border-radius: 0.5rem; background-color: #DBEAFE; color: var(--primary-blue); display: flex; align-items: center; justify-content: center; font-size: 1.5rem; }
    .sidebar-title { font-size: 1.1rem; }
    .sidebar-subtitle { font-size: 0.75rem; color: var(--text-secondary); }

    .sidebar-nav { flex-grow: 1; }
    .nav-section-title { font-size: 0.7rem; text-transform: uppercase; color: var(--text-secondary); padding: 0 0.5rem; margin-bottom: 0.5rem; }
    .nav-link { display: flex; align-items: center; gap: 0.75rem; padding: 0.75rem; border-radius: 0.5rem; text-decoration: none; color: #374151; font-weight: 500; transition: background-color 0.2s, color 0.2s; margin-bottom: 0.25rem; }
    body.light .nav-link { color: #374151; }
    body.dark .nav-link { color: var(--text-primary); }
    .nav-link:hover { background-color: var(--nav-hover-bg); }
    .nav-link.active { background-color: var(--nav-active-bg); color: var(--text-primary); font-weight: 600; }

    .account-status { margin-top: 1.5rem; padding: 0 0.5rem; }
    .status-item { display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.5rem; }
    .status-item span { font-size: 0.9rem; }
    .status-item .amount { font-weight: 600; }
    .status-item .negative { color: var(--red-accent); }

    /* Cards */
    .card { background-color: var(--card-background); border: 1px solid var(--border-color); border-radius: 0.75rem; padding: 1.5rem; box-shadow: 0 1px 2px 0 rgb(0 0 0 / 0.05); transition: background-color 0.3s, border-color 0.3s; }
    .card-header { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 1rem; }
    .card-title { font-size: 1.1rem; }
    .view-all { font-size: 0.8rem; color: var(--primary-blue); text-decoration: none; font-weight: 500; }

    /* Grids */
    .grid { display: grid; gap: 1.5rem; }
    .grid-cols-3 { grid-template-columns: repeat(3, 1fr); }
    .grid-cols-4 { grid-template-columns: repeat(4, 1fr); }
    .grid-cols-5 { grid-template-columns: repeat(5, 1fr); }
    .grid-cols-2-1 { grid-template-columns: 2fr 1fr; }
    .col-span-1 { grid-column: span 1 / span 1; }
    .col-span-2 { grid-column: span 2 / span 2; }
    .col-span-3 { grid-column: span 3 / span 3; }
    .col-span-5 { grid-column: span 5 / span 5; }

    /* Dashboard */
    .account-card-icon { width: 32px; height: 32px; border-radius: 50%; display: flex; align-items: center; justify-content: center; margin-bottom: 1rem; }
    .checking { background-color: #DBEAFE; color: #3B82F6; }
    .savings { background-color: #D1FAE5; color: #059669; }
    .credit { background-color: #FEE2E2; color: #DC2626; }
    .account-card-balance { font-size: 1.75rem; font-weight: 700; margin-bottom: 0.5rem; }
    .account-card-trend { display: flex; align-items: center; font-size: 0.9rem; gap: 0.25rem; }
    .trend-positive { color: var(--green-accent); }
    .trend-negative { color: var(--red-accent); }

    /* Chart Containers */
    .chart-container-line { height: 320px; }
    .chart-container-doughnut { height: 250px; width: 250px; margin: 1.5rem auto; position: relative; }
    .doughnut-center-text { position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); text-align: center; }
    .doughnut-total { font-size: 1.5rem; font-weight: 700; }
    .doughnut-label { font-size: 0.8rem; color: var(--text-secondary); }

    /* Lists */
    .category-list, .transaction-list-condensed { display: flex; flex-direction: column; gap: 1.25rem; }
    .category-item, .transaction-item { display: flex; align-items: center; justify-content: space-between; }
    .category-info, .transaction-info { display: flex; align-items: center; gap: 0.75rem; }
    .category-icon, .transaction-icon { width: 40px; height: 40px; border-radius: 0.5rem; display: flex; align-items: center; justify-content: center; }
    .category-name, .transaction-name { font-weight: 500; }
    .category-meta, .transaction-meta { font-size: 0.8rem; color: var(--text-secondary); }
    .category-values { text-align: right; }
    .category-amount, .transaction-amount { font-weight: 600; font-size: 0.9rem; }

    /* Transactions Page */
    .transaction-page-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 1.5rem; }
    .btn { background-color: var(--btn-bg); border: 1px solid var(--border-color); border-radius: 0.5rem; padding: 0.5rem 1rem; font-weight: 500; cursor: pointer; color: var(--text-primary); transition: background-color 0.3s, border-color 0.3s; }

    /* Analytics & Projections */
    .summary-card p { font-size: 0.9rem; color: var(--text-secondary); margin-bottom: 0.5rem; }
    .summary-card h2 { font-size: 1.75rem; }
    .timeframe-selector { display: flex; gap: 0.5rem; }
    .timeframe-btn { background-color: var(--timeframe-btn-bg); border: none; border-radius: 0.5rem; padding: 0.5rem 1rem; font-weight: 500; cursor: pointer; color: var(--text-primary); transition: background-color 0.3s, color 0.3s; }
    .timeframe-btn.active { background-color: var(--timeframe-btn-active-bg); color: var(--timeframe-btn-active-color); }

    /* Quick Insights */
    .quick-insights { margin-top: 1.5rem; padding: 0 0.5rem; }
    .insight-card {
        border: 1px solid var(--border-color);
        border-radius: 0.5rem;
        padding: 0.75rem;
        display: flex;
        align-items: flex-start;
        gap: 0.5rem;
        margin-top: 0.5rem;
        transition: background-color 0.3s, border-color 0.3s;
    }
    .insight-card.warning { background-color: #FEF2F2; border-color: #FECACA; }
    .insight-card.success { background-color: #F0FDF4; border-color: #BBF7D0; }
    body.dark .insight-card.warning { background-color: #450a0a; border-color: #7f1d1d; }
    body.dark .insight-card.success { background-color: #064e3b; border-color: #065f46; }
    .insight-icon { font-size: 1rem; line-height: 1.2; }
    .insight-text h4 { font-size: 0.8rem; font-weight: 500; color: var(--text-primary); margin: 0 0 0.1rem 0; }
    .insight-text p { font-size: 0.75rem; color: var(--text-secondary); margin: 0; }
  `}</style>
);


// --- Reusable Chart Components ---
const LineChart = ({ chartData, theme }) => {
  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: { legend: { display: false }, tooltip: { mode: 'index', intersect: false } },
    scales: { 
      x: { 
        grid: { display: false },
        ticks: { color: theme === 'dark' ? '#9CA3AF' : '#6B7280' }
      }, 
      y: { 
        grid: { color: theme === 'dark' ? 'rgba(107, 114, 128, 0.2)' : 'rgba(229, 231, 235, 0.5)' },
        ticks: { color: theme === 'dark' ? '#9CA3AF' : '#6B7280' }
      } 
    },
    elements: { line: { tension: 0.4 }, point: { radius: 0 } }
  };
  return <Line data={chartData} options={options} />;
};

const DoughnutChart = ({ chartData }) => {
    const options = {
        responsive: true,
        maintainAspectRatio: false,
        cutout: '75%',
        plugins: { legend: { display: false }, tooltip: { enabled: true, mode: 'index' } },
    };
    return <Doughnut data={chartData} options={options} />;
};


// --- Page Components ---
const DashboardPage = ({ spendingData, transactions, financialHeartbeatData, theme }) => (
    <div className="page-content">
        <div className="grid grid-cols-2-1">
            <div className="col-span-1" style={{display: 'flex', flexDirection: 'column', gap: '1.5rem'}}>
                 <div className="grid grid-cols-3">
                    <div className="card account-card">
                        <div className="account-card-icon checking">$</div>
                        <p className="page-subtitle">Primary Checking</p>
                        <div className="account-card-balance">$2,455.29</div>
                        <div className="account-card-trend trend-positive">↑ +5.4%</div>
                    </div>
                    <div className="card account-card">
                        <div className="account-card-icon savings">💰</div>
                        <p className="page-subtitle">Emergency Fund</p>
                        <div className="account-card-balance">$8,950.15</div>
                        <div className="account-card-trend trend-negative">↓ -0.5%</div>
                    </div>
                    <div className="card account-card">
                        <div className="account-card-icon credit">💳</div>
                        <p className="page-subtitle">Rewards Card</p>
                        <div className="account-card-balance">$1,250.75</div>
                        <div className="account-card-trend trend-positive">↑ +7.3%</div>
                    </div>
                </div>
                <div className="card">
                    <div className="card-header">
                        <div>
                            <h3 className="card-title">Financial Heartbeat</h3>
                            <p className="page-subtitle">Your spending rhythm over time</p>
                        </div>
                    </div>
                    <div className="chart-container-line">
                        <LineChart chartData={financialHeartbeatData} theme={theme}/>
                    </div>
                </div>
            </div>
             <div className="col-span-1" style={{display: 'flex', flexDirection: 'column', gap: '1.5rem'}}>
                <div className="card">
                    <div className="card-header">
                        <h3 className="card-title">Recent Transactions</h3>
                        <a href="#/transactions" className="view-all">View All</a>
                    </div>
                    <div className="transaction-list-condensed">
                        {transactions.slice(0, 4).map((t, i) => (
                          <div key={i} className="transaction-item">
                            <div className="transaction-info">
                              <div className="transaction-icon" style={{backgroundColor: t.bgColor, color: t.color, borderRadius: '50%'}}>{t.icon}</div>
                              <div>
                                <div className="transaction-name">{t.name}</div>
                                <div className="transaction-meta">{t.date}</div>
                              </div>
                            </div>
                            <div className={`transaction-amount ${t.amount < 0 ? 'trend-negative' : ''}`}>
                                {t.amount < 0 ? '-' : '+'} ${Math.abs(t.amount).toFixed(2)}
                            </div>
                          </div>
                        ))}
                    </div>
                </div>
                <div className="card">
                    <div className="card-header">
                        <h3 className="card-title">Spending by Category</h3>
                        <a href="#/analytics" className="view-all">View All</a>
                    </div>
                    <div className="category-list">
                        {spendingData.slice(0, 4).map((cat, i) => (
                            <div key={i} className="category-item">
                                <div className="category-info">
                                    <div className="category-icon" style={{backgroundColor: 'var(--search-bg)'}}>{cat.icon}</div>
                                    <div>
                                        <div className="category-name">{cat.name}</div>
                                        <div className="category-meta">{cat.transactions} transactions</div>
                                    </div>
                                </div>
                                <div className="category-amount">${cat.value.toFixed(2)}</div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    </div>
);


const TransactionsPage = ({ transactions }) => (
  <div className="page-content">
    <div className="transaction-page-header">
        <h2 className="card-title">All Transactions</h2>
        <div style={{display: 'flex', gap: '0.5rem'}}>
            <div className="search-bar">
                <span>🔍</span>
                <input type="text" placeholder="Search transactions..." />
            </div>
            <button className="btn">Sort by ▾</button>
        </div>
    </div>
    <div className="card">
      <div className="transaction-list-condensed">
        {transactions.map((t, i) => (
          <div key={i} className="transaction-item">
            <div className="transaction-info">
              <div className="transaction-icon" style={{backgroundColor: t.bgColor, color: t.color}}>{t.icon}</div>
              <div>
                <div className="transaction-name">{t.name}</div>
                <div className="transaction-meta">{t.date} • {t.time}</div>
              </div>
            </div>
            <div className={`transaction-amount ${t.amount > 0 ? 'trend-positive' : ''}`}>
              {t.amount > 0 ? '+' : '-'} ${Math.abs(t.amount).toLocaleString('en-US', {minimumFractionDigits: 2})}
            </div>
          </div>
        ))}
      </div>
    </div>
  </div>
);

const AnalyticsPage = ({ spendingData, financialHeartbeatData, theme }) => {
    const totalSpent = spendingData.reduce((acc, cat) => acc + cat.value, 0);
    const doughnutData = {
        labels: spendingData.map(cat => cat.name),
        datasets: [{
            data: spendingData.map(cat => cat.value),
            backgroundColor: ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#6366F1'],
            borderColor: theme === 'dark' ? '#1F2937' : '#FFFFFF',
            borderWidth: 4,
        }],
    };

    return (
        <div className="page-content">
            <div className="grid grid-cols-4" style={{marginBottom: '1.5rem'}}>
                <div className="card summary-card">
                    <p>Total Balance</p>
                    <h2>$12,656.19</h2>
                </div>
                <div className="card summary-card">
                    <p>Total Income</p>
                    <h2 className="trend-positive">$2,500.00</h2>
                </div>
                <div className="card summary-card">
                    <p>Total Expense</p>
                    <h2 className="trend-negative">$1,245.30</h2>
                </div>
                <div className="card summary-card">
                    <p>Savings Rate</p>
                    <h2>50.2%</h2>
                </div>
            </div>
            <div className="grid grid-cols-2-1">
                <div className="card col-span-1">
                    <div className="card-header">
                        <h3 className="card-title">Spending by Category</h3>
                    </div>
                    <div className="grid" style={{gridTemplateColumns: '1fr 1fr', alignItems: 'center'}}>
                        <div className="chart-container-doughnut" style={{margin: '0 auto'}}>
                            <DoughnutChart chartData={doughnutData} />
                             <div className="doughnut-center-text">
                                <div className="doughnut-total">${totalSpent.toLocaleString('en-US', {minimumFractionDigits: 2})}</div>
                                <div className="doughnut-label">Total Spent</div>
                            </div>
                        </div>
                        <div>
                            <div className="category-list">
                                {spendingData.map((cat, i) => (
                                <div key={i} className="category-item">
                                    <div className="category-info">
                                        <div style={{width: '10px', height: '10px', backgroundColor: doughnutData.datasets[0].backgroundColor[i], borderRadius: '50%'}}></div>
                                        <div className="category-name">{cat.name}</div>
                                    </div>
                                    <div className="category-amount">${cat.value.toFixed(2)}</div>
                                </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
                <div className="card col-span-1">
                    <div className="card-header">
                        <h3 className="card-title">Financial Heartbeat</h3>
                    </div>
                    <div className="chart-container-line" style={{height: '280px'}}>
                        <LineChart chartData={financialHeartbeatData} theme={theme} />
                    </div>
                </div>
            </div>
        </div>
    );
};

const ProjectionsPage = ({ projectionData, theme }) => (
    <div className="page-content">
        <div className="grid grid-cols-2-1">
            <div className="card">
                <div className="card-header">
                    <div>
                        <h3 className="card-title">Balance Projection</h3>
                        <p className="page-subtitle">Forecasts based on your habits</p>
                    </div>
                    <div className="timeframe-selector">
                        <button className="timeframe-btn active">30D</button>
                        <button className="timeframe-btn">3M</button>
                        <button className="timeframe-btn">1Y</button>
                    </div>
                </div>
                <div className="chart-container-line" style={{height: '400px'}}>
                    <LineChart chartData={projectionData} theme={theme}/>
                </div>
            </div>
            <div className="col-span-1" style={{display: 'flex', flexDirection: 'column', gap: '1.5rem'}}>
                <div className="card summary-card">
                    <p>Projected Balance (30D)</p>
                    <h2>$952.35</h2>
                </div>
                <div className="card summary-card">
                    <p>Est. Monthly Income</p>
                    <h2 className="trend-positive">$5,000.00</h2>
                </div>
                <div className="card summary-card">
                    <p>Est. Monthly Spending</p>
                    <h2 className="trend-negative">$3,502.94</h2>
                </div>
                <div className="card summary-card">
                    <p>Net Projection</p>
                    <h2>+$1,497.06</h2>
                </div>
            </div>
        </div>
    </div>
);


const MainApp = () => {
    const [theme, setTheme] = useState('light');
    const location = useLocation();

    useEffect(() => {
        document.body.className = theme;
    }, [theme]);

    const toggleTheme = () => {
        setTheme(prevTheme => (prevTheme === 'light' ? 'dark' : 'light'));
    };
    
    const { title, subtitle } = {
        '/': { title: 'Dashboard', subtitle: "Welcome back, here's your financial overview." },
        '/transactions': { title: 'Transactions', subtitle: 'Manage your recent financial activities.' },
        '/analytics': { title: 'Analytics', subtitle: 'Analyze your spending patterns in detail.' },
        '/projections': { title: 'Projections', subtitle: 'See your future financial outlook.' },
    }[location.pathname] || { title: 'Dashboard', subtitle: "Welcome back, here's your financial overview." };

    // --- Mock Data ---
    const spendingData = [
        { name: 'Dining', value: 320.45, percentage: 28.5, transactions: 15, icon: '🍽️' },
        { name: 'Shopping', value: 245.20, percentage: 21.8, transactions: 8, icon: '🛍️' },
        { name: 'Transportation', value: 180.30, percentage: 16.0, transactions: 12, icon: '🚗' },
        { name: 'Utilities', value: 150.00, percentage: 13.3, transactions: 4, icon: '🏠' },
        { name: 'Entertainment', value: 125.75, percentage: 11.2, transactions: 6, icon: '🎬' },
    ];
    const transactions = [
        { name: 'Payroll Deposit', amount: 2500.00, date: 'Sep 24, 2024', time: '9:00 AM', icon: '💰', bgColor: '#D1FAE5', color: '#065F46' },
        { name: 'Whole Foods Market', amount: -85.45, date: 'Sep 24, 2024', time: '2:30 PM', icon: '🍽️', bgColor: '#DBEAFE', color: '#1E40AF' },
        { name: 'Uber Ride', amount: -45.20, date: 'Sep 23, 2024', time: '6:45 PM', icon: '🚗', bgColor: '#FEF3C7', color: '#92400E' },
        { name: 'Electric Bill', amount: -150.00, date: 'Sep 22, 2024', time: '12:00 PM', icon: '⚡', bgColor: '#FEE2E2', color: '#991B1B' },
        { name: 'Netflix', amount: -15.99, date: 'Sep 21, 2024', time: '8:00 AM', icon: '🎬', bgColor: '#E0E7FF', color: '#3730A3' },
        { name: 'Amazon Purchase', amount: -128.50, date: 'Sep 20, 2024', time: '10:00 AM', icon: '🛍️', bgColor: '#F3E8FF', color: '#6B21A8' }
    ];

    const financialHeartbeatData = useMemo(() => ({
        labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul'],
        datasets: [{
            label: 'Balance',
            data: [10000, 10500, 11200, 10800, 11500, 12000, 12656],
            borderColor: theme === 'light' ? 'rgb(59, 130, 246)' : 'rgb(96, 165, 250)',
            backgroundColor: theme === 'light' ? 'rgba(59, 130, 246, 0.1)' : 'rgba(96, 165, 250, 0.1)',
            fill: true,
        }],
    }), [theme]);

     const projectionData = useMemo(() => ({
        labels: ['Sep 25', 'Sep 27', 'Sep 30', 'Oct 3', 'Oct 7', 'Oct 10', 'Oct 14', 'Oct 17', 'Oct 21', 'Oct 24'],
        datasets: [{
            label: 'Projected Balance',
            data: [2455, 2200, 2100, 1950, 1800, 1600, 1450, 1300, 1100, 952],
            borderColor: theme === 'light' ? 'rgb(59, 130, 246)' : 'rgb(96, 165, 250)',
            backgroundColor: theme === 'light' ? 'rgba(59, 130, 246, 0.1)' : 'rgba(96, 165, 250, 0.1)',
            fill: true,
        }],
    }), [theme]);

    return (
        <div className="app-container">
            <aside className="sidebar">
                <div className="sidebar-header">
                    <div className="logo">💙</div>
                    <div>
                        <h2 className="sidebar-title">Living Ledger</h2>
                        <p className="sidebar-subtitle">Your Financial Heartbeat</p>
                    </div>
                </div>
                <nav className="sidebar-nav">
                    <div className="nav-section-title">Overview</div>
                    <NavLink to="/" className={({ isActive }) => "nav-link" + (isActive ? " active" : "")}><span>🏠</span><span>Dashboard</span></NavLink>
                    <NavLink to="/transactions" className={({ isActive }) => "nav-link" + (isActive ? " active" : "")}><span>🔄</span><span>Transactions</span></NavLink>
                    <NavLink to="/analytics" className={({ isActive }) => "nav-link" + (isActive ? " active" : "")}><span>📊</span><span>Analytics</span></NavLink>
                    <NavLink to="/projections" className={({ isActive }) => "nav-link" + (isActive ? " active" : "")}><span>🎯</span><span>Projections</span></NavLink>
                </nav>
                 <div className="account-status">
                    <div className="nav-section-title">Account Status</div>
                    <div className="status-item">
                        <span>Total Balance</span>
                        <span className="amount">$12,656.19</span>
                    </div>
                     <div className="status-item">
                        <span>This Month</span>
                        <span className="amount negative">-$1,245.30</span>
                    </div>
                </div>
                <div className="quick-insights">
                    <div className="nav-section-title">Quick Insights</div>
                    <div className="insight-card warning">
                        <span className="insight-icon">⚠️</span>
                        <div className="insight-text">
                            <h4>Alert</h4>
                            <p>Dining spending up 25%</p>
                        </div>
                    </div>
                    <div className="insight-card success">
                        <span className="insight-icon">👍</span>
                        <div className="insight-text">
                            <h4>Good Job!</h4>
                            <p>Transport costs down 15%</p>
                        </div>
                    </div>
                </div>
            </aside>
            <main className="main-content">
                <header className="header">
                    <div className="header-left">
                        <h1 className="page-title">{title}</h1>
                        <p className="page-subtitle">{subtitle}</p>
                    </div>
                    <div className="header-right">
                        <div className="search-bar">
                            <span>🔍</span>
                            <input type="text" placeholder="Search..." />
                        </div>
                        <button onClick={toggleTheme} className="header-icon">
                            {theme === 'light' ? '🌙' : '☀️'}
                        </button>
                        <span className="header-icon">🔔</span>
                        <div className="user-avatar"></div>
                    </div>
                </header>
                <Routes>
                    <Route path="/" element={<DashboardPage spendingData={spendingData} transactions={transactions} financialHeartbeatData={financialHeartbeatData} theme={theme} />} />
                    <Route path="/transactions" element={<TransactionsPage transactions={transactions} />} />
                    <Route path="/analytics" element={<AnalyticsPage spendingData={spendingData} financialHeartbeatData={financialHeartbeatData} theme={theme} />} />
                    <Route path="/projections" element={<ProjectionsPage projectionData={projectionData} theme={theme} />} />
                </Routes>
            </main>
        </div>
    );
};

const App = () => (
  <HashRouter>
    <GlobalStyles />
    <MainApp />
  </HashRouter>
);

export default App;

