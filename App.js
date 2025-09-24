import React from 'react';
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
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Line } from 'react-chartjs-2';

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

// --- Embedded CSS Styles ---
// By placing styles here, we remove the need for an external .css file.
const GlobalStyles = () => (
  <style>{`
    /* Basic Reset & Body Styles */
    body {
      margin: 0;
      font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen',
        'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue',
        sans-serif;
      -webkit-font-smoothing: antialiased;
      -moz-osx-font-smoothing: grayscale;
      background-color: #f9fafb;
      color: #1f2937;
    }

    /* App Layout */
    .app-container {
      display: flex;
      min-height: 100vh;
    }

    .sidebar {
      width: 250px;
      background-color: #ffffff;
      border-right: 1px solid #e5e7eb;
      display: flex;
      flex-direction: column;
      position: fixed;
      height: 100%;
    }

    .main-content {
      flex-grow: 1;
      margin-left: 250px; /* Same as sidebar width */
    }

    .page-content {
      padding: 2rem;
    }

    /* Header */
    .header {
      padding: 1.5rem 2rem;
      background-color: #ffffff;
      border-bottom: 1px solid #e5e7eb;
    }

    h1, h2, h3 {
      margin: 0 0 0.5rem 0;
      font-weight: 700;
    }

    .subtitle {
      color: #6b7280;
      margin: 0;
      font-size: 0.9rem;
    }

    /* Sidebar Navigation */
    .sidebar-header {
      padding: 1.5rem;
      border-bottom: 1px solid #e5e7eb;
    }

    .sidebar-nav {
      padding: 1.5rem;
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
    }

    .nav-link {
      display: flex;
      align-items: center;
      gap: 0.75rem;
      padding: 0.75rem 1rem;
      border-radius: 0.5rem;
      text-decoration: none;
      color: #374151;
      font-weight: 500;
      transition: background-color 0.2s;
    }

    .nav-link:hover {
      background-color: #f3f4f6;
    }

    .nav-link.active {
      background-color: #f3f4f6;
      color: #111827;
    }

    /* Cards */
    .card {
      background-color: #ffffff;
      border: 1px solid #e5e7eb;
      border-radius: 0.75rem;
      padding: 1.5rem;
      box-shadow: 0 1px 3px 0 rgb(0 0 0 / 0.05);
    }

    /* Grids */
    .grid-container {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
      gap: 2rem;
    }

    .dashboard-grid {
      display: grid;
      grid-template-columns: 2fr 1fr;
      gap: 2rem;
    }

    .main-column, .side-column {
      display: flex;
      flex-direction: column;
      gap: 2rem;
    }

    .cards-grid {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 1.5rem;
    }

    .insights-grid {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 1rem;
    }

    /* Chart Container */
    .chart-container {
      height: 300px;
      margin-top: 1rem;
    }

    /* Transaction & Category Lists */
    .transaction-list, .category-list, .transaction-list-simple {
      display: flex;
      flex-direction: column;
      gap: 1rem;
    }
    .transaction-item, .category-item {
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
    .transaction-details, .category-details {
      display: flex;
      align-items: center;
      gap: 0.75rem;
    }
    .transaction-icon {
      width: 40px;
      height: 40px;
      border-radius: 0.5rem;
      display: flex;
      align-items: center;
      justify-content: center;
      color: white;
    }
    .transaction-icon.income { background-color: #10b981; }
    .transaction-icon.expense { background-color: #ef4444; }

    .transaction-name, .category-name { font-weight: 500; }
    .transaction-meta, .category-meta { font-size: 0.8rem; color: #6b7280; }
    .transaction-amount.positive, .positive, .positive-change { color: #10b981; font-weight: 600; }
    .transaction-amount.negative, .negative, .negative-change { color: #ef4444; font-weight: 600; }
    .category-value { text-align: right; }
    .category-item-simple, .transaction-item-simple {
      display: flex;
      justify-content: space-between;
      font-size: 0.9rem;
    }

    /* Insight Cards */
    .insight-card {
      padding: 1rem;
      border-radius: 0.5rem;
      font-size: 0.9rem;
    }
    .insight-card.warning {
      background-color: #fef2f2;
      border: 1px solid #fecaca;
      color: #991b1b;
    }
    .insight-card.success {
      background-color: #f0fdf4;
      border: 1px solid #bbf7d0;
      color: #166534;
    }
  `}</style>
);

// --- Reusable LineChart Component ---
const LineChart = ({ chartData }) => {
  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      title: { display: false },
      tooltip: { mode: 'index', intersect: false },
    },
    scales: {
      x: { display: true, grid: { display: false } },
      y: { display: true, grid: { color: 'rgba(200, 200, 200, 0.2)' } },
    },
  };
  return <Line data={chartData} options={options} />;
};

// --- Page Components ---
const TransactionsPage = ({ transactions }) => (
  <div className="page-content">
    <div className="card">
      <div className="transaction-list">
        {transactions.length > 0 ? (
          transactions.map((transaction, index) => (
            <div key={index} className="transaction-item">
              <div className="transaction-details">
                <div className={`transaction-icon ${transaction.amount > 0 ? 'income' : 'expense'}`}>
                  {transaction.amount > 0 ? '💰' : '💳'}
                </div>
                <div>
                  <div className="transaction-name">{transaction.name}</div>
                  <div className="transaction-meta">
                    {transaction.date} • {transaction.time}
                  </div>
                </div>
              </div>
              <div className={`transaction-amount ${transaction.amount > 0 ? 'positive' : 'negative'}`}>
                {transaction.amount > 0 ? '+ ' : ''}$
                {Math.abs(transaction.amount).toLocaleString()}
              </div>
            </div>
          ))
        ) : (
          <p>No transactions to display.</p>
        )}
      </div>
    </div>
  </div>
);

const AnalyticsPage = ({ financialHeartbeatData, spendingData }) => (
  <div className="page-content">
    <div className="grid-container">
      <div className="card">
        <h3>Financial Heartbeat</h3>
        <p className="subtitle">Your spending rhythm over time</p>
        <div className="chart-container">
          <LineChart chartData={financialHeartbeatData} />
        </div>
      </div>
      <div className="card">
        <h3>Spending by Category</h3>
        <p className="subtitle">Your spending breakdown this month</p>
        <div className="category-list">
          {spendingData.map((category, index) => (
            <div key={index} className="category-item">
              <div className="category-details">
                <div className="category-icon">{category.icon}</div>
                <div>
                  <div className="category-name">{category.name}</div>
                  <div className="category-meta">{category.transactions} transactions</div>
                </div>
              </div>
              <div className="category-value">
                <div>${category.value.toLocaleString()}</div>
                <div className="category-meta">{category.percentage}%</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  </div>
);

const ProjectionsPage = ({ projectionData }) => (
  <div className="page-content">
    <div className="card">
      <h3>30-Day Balance Projection</h3>
      <p className="subtitle">Projected Balance (30 days)</p>
      <div className="chart-container">
        <LineChart chartData={projectionData} />
      </div>
    </div>
  </div>
);

const DashboardPage = ({ spendingData, transactions, smartInsights, financialHeartbeatData }) => (
    <div className="page-content">
        <div className="dashboard-grid">
            <div className="main-column">
                <div className="cards-grid">
                    <div className="card">
                        <p className="subtitle">Primary Checking</p>
                        <h2>$2,455.29</h2>
                        <p className="positive-change">+$125.30 today</p>
                    </div>
                    <div className="card">
                        <p className="subtitle">Emergency Fund</p>
                        <h2>$8,950.15</h2>
                        <p className="subtitle">No change</p>
                    </div>
                    <div className="card">
                        <p className="subtitle">Rewards Card</p>
                        <h2>$1,250.75</h2>
                        <p className="negative-change">+$85.40 today</p>
                    </div>
                </div>

                <div className="card">
                    <h3>Financial Heartbeat</h3>
                    <div className="chart-container"><LineChart chartData={financialHeartbeatData} /></div>
                </div>

                <div className="card">
                    <h3>Smart Insights</h3>
                    <div className="insights-grid">
                        {smartInsights.map((insight, index) => (
                            <div key={index} className={`insight-card ${insight.type}`}>
                                <p>{insight.title}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            <div className="side-column">
                <div className="card">
                    <h3>Spending by Category</h3>
                    <div className="category-list">
                        {spendingData.map((category, index) => (
                            <div key={index} className="category-item-simple">
                                <span>{category.icon} {category.name}</span>
                                <span>${category.value.toLocaleString()}</span>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="card">
                    <h3>Recent Transactions</h3>
                    <div className="transaction-list-simple">
                        {transactions.slice(0, 5).map((transaction, index) => (
                            <div key={index} className="transaction-item-simple">
                                <div>
                                    <div>{transaction.name}</div>
                                    <div className="subtitle">{transaction.date}</div>
                                </div>
                                <div className={transaction.amount > 0 ? 'positive' : 'negative'}>
                                    {transaction.amount > 0 ? '+' : '-'}${Math.abs(transaction.amount).toLocaleString()}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    </div>
);

const MainApp = () => {
    const location = useLocation();

    const getPageInfo = () => {
        switch (location.pathname) {
            case '/transactions': return { title: 'Transactions', subtitle: 'Manage your recent financial activities.' };
            case '/analytics': return { title: 'Analytics', subtitle: 'Analyze your spending patterns.' };
            case '/projections': return { title: 'Projections', subtitle: 'See your future financial outlook.' };
            case '/': default: return { title: 'Dashboard', subtitle: "Welcome back! Here's your financial overview." };
        }
    };

    const { title, subtitle } = getPageInfo();
    
    // Mock data from the original component
    const spendingData = [
        { name: 'Dining', value: 320.45, percentage: 28.5, transactions: 15, icon: '🍽️' },
        { name: 'Shopping', value: 245.2, percentage: 21.8, transactions: 8, icon: '🛍️' },
        { name: 'Transportation', value: 180.3, percentage: 16.0, transactions: 12, icon: '🚗' },
        { name: 'Utilities', value: 150.0, percentage: 13.3, transactions: 4, icon: '🏠' },
        { name: 'Entertainment', value: 125.75, percentage: 11.2, transactions: 6, icon: '🎬' },
    ];
    const transactions = [
        { name: 'Whole Foods Market', category: 'dining', amount: -85.45, date: 'Sep 24, 2024', time: '2:30 PM' },
        { name: 'Payroll Deposit', category: 'income', amount: 2500.0, date: 'Sep 24, 2024', time: '9:00 AM' },
        { name: 'Uber Ride', category: 'transportation', amount: -45.2, date: 'Sep 23, 2024', time: '6:45 PM' },
    ];
    const smartInsights = [
        { type: 'warning', title: "You've spent 25% more on dining out this week." },
        { type: 'success', title: 'Your transportation costs are down 15% this month.' },
    ];
    const financialHeartbeatData = {
        labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul'],
        datasets: [
            { label: 'Balance', data: [10000, 10500, 11200, 10800, 11500, 12000, 12656], borderColor: '#3B82F6', tension: 0.4 },
            { label: 'Spending', data: [1500, 1700, 1600, 1900, 1400, 1800, 1750], borderColor: '#6B7280', tension: 0.4 },
        ],
    };
    const projectionData = {
        labels: Array.from({ length: 30 }, (_, i) => `Day ${i + 1}`),
        datasets: [{ label: 'Projected Balance', data: Array.from({ length: 30 }, (_, i) => 12656 - i * 150), borderColor: '#7C3AED', tension: 0.4 }],
    };

    return (
        <div className="app-container">
            <aside className="sidebar">
                <div className="sidebar-header">
                    <h1>Cash Current</h1>
                </div>
                <nav className="sidebar-nav">
                    <NavLink to="/" className={({ isActive }) => "nav-link" + (isActive ? " active" : "")}>
                        <span>📊</span><span>Dashboard</span>
                    </NavLink>
                    <NavLink to="/transactions" className={({ isActive }) => "nav-link" + (isActive ? " active" : "")}>
                        <span>💳</span><span>Transactions</span>
                    </NavLink>
                    <NavLink to="/analytics" className={({ isActive }) => "nav-link" + (isActive ? " active" : "")}>
                        <span>📈</span><span>Analytics</span>
                    </NavLink>
                    <NavLink to="/projections" className={({ isActive }) => "nav-link" + (isActive ? " active" : "")}>
                        <span>🎯</span><span>Projections</span>
                    </NavLink>
                </nav>
            </aside>
            <main className="main-content">
                <header className="header">
                    <h2>{title}</h2>
                    <p className="subtitle">{subtitle}</p>
                </header>
                <Routes>
                    <Route path="/" element={<DashboardPage spendingData={spendingData} transactions={transactions} smartInsights={smartInsights} financialHeartbeatData={financialHeartbeatData} />} />
                    <Route path="/transactions" element={<TransactionsPage transactions={transactions} />} />
                    <Route path="/analytics" element={<AnalyticsPage financialHeartbeatData={financialHeartbeatData} spendingData={spendingData} />} />
                    <Route path="/projections" element={<ProjectionsPage projectionData={projectionData} />} />
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

