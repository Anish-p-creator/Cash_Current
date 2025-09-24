import React, { useState, useEffect } from 'react';

const CashCurrentDashboard = () => {
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  // Mock data
  const spendingData = [
    { name: 'Dining', value: 320.45, percentage: 28.5, transactions: 15 },
    { name: 'Shopping', value: 245.20, percentage: 21.8, transactions: 8 },
    { name: 'Transportation', value: 180.30, percentage: 16.0, transactions: 12 },
    { name: 'Utilities', value: 150.00, percentage: 13.3, transactions: 4 },
    { name: 'Entertainment', value: 125.75, percentage: 11.2, transactions: 6 },
    { name: 'Healthcare', value: 85.40, percentage: 7.6, transactions: 3 },
    { name: 'Other', value: 18.90, percentage: 1.6, transactions: 2 }
  ];

  const transactions = [
    { name: 'Whole Foods Market', category: 'dining', amount: -85.45, date: 'Sep 24, 2024', time: '2:30 PM' },
    { name: 'Payroll Deposit', category: 'income', amount: 2500.00, date: 'Sep 24, 2024', time: '9:00 AM' },
    { name: 'Uber Ride', category: 'transportation', amount: -45.20, date: 'Sep 23, 2024', time: '6:45 PM' },
    { name: 'Electric Bill', category: 'utilities', amount: -150.00, date: 'Sep 22, 2024', time: '12:00 PM' },
    { name: 'Netflix Subscription', category: 'entertainment', amount: -15.99, date: 'Sep 21, 2024', time: '8:00 AM' }
  ];

  const smartInsights = [
    { type: 'warning', title: "You've spent 25% more on dining out this week compared to your average.", subtitle: "Consider cooking at home to save money.", category: 'Dining', trend: 'Up', percentage: '+25.3%' },
    { type: 'success', title: "Great job! Your transportation costs are down 15% this month thanks to using public transit more often.", category: 'Transportation', trend: 'Down', percentage: '-15.2%' },
    { type: 'warning', title: "Shopping expenses have increased by 30% this week. Most purchases were at Target and Amazon.", category: 'Shopping', trend: 'Up', percentage: '+30.7%' },
    { type: 'info', title: "Your entertainment spending is within your normal range. You're maintaining good balance between fun and savings.", category: 'Entertainment', trend: 'Stable', percentage: '+2.1%' }
  ];

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <aside className="fixed left-0 top-0 w-64 h-full bg-white shadow-lg flex flex-col">
        <div className="p-6">
          <div className="flex items-center space-x-3 mb-8">
            <div className="w-10 h-10 bg-blue-500 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold">💰</span>
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900">Cash Current</h1>
              <p className="text-xs text-gray-500">Your Financial Heartbeat</p>
            </div>
          </div>
          <nav className="space-y-2 mb-8">
            <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">Overview</h3>
            <a href="#" className="flex items-center space-x-3 bg-gray-100 text-gray-900 px-3 py-2 rounded-lg">
              <span>📊</span>
              <span className="font-medium">Dashboard</span>
            </a>
            <a href="#" className="flex items-center space-x-3 text-gray-600 hover:bg-gray-50 px-3 py-2 rounded-lg">
              <span>💳</span>
              <span>Transactions</span>
            </a>
            <a href="#" className="flex items-center space-x-3 text-gray-600 hover:bg-gray-50 px-3 py-2 rounded-lg">
              <span>📈</span>
              <span>Analytics</span>
            </a>
            <a href="#" className="flex items-center space-x-3 text-gray-600 hover:bg-gray-50 px-3 py-2 rounded-lg">
              <span>🎯</span>
              <span>Projections</span>
            </a>
          </nav>
          <div className="mb-6">
            <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">Account Status</h3>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-gray-700 text-sm">Total Balance</span>
                <span className="text-lg font-bold">$12,656.19</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-700 text-sm">This Month</span>
                <span className="text-lg font-semibold text-red-600">-$1,245.30</span>
              </div>
            </div>
          </div>
          <div className="space-y-3">
            <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Quick Insights</h3>
            <div className="bg-red-50 border border-red-200 rounded-lg p-3">
              <div className="flex items-start">
                <span className="text-red-500 mr-2">⚠️</span>
                <div>
                  <h4 className="text-sm font-medium text-red-800">Alert</h4>
                  <p className="text-xs text-red-700">Dining spending up 25% this week</p>
                </div>
              </div>
            </div>
            <div className="bg-green-50 border border-green-200 rounded-lg p-3">
              <div className="flex items-start">
                <span className="text-green-500 mr-2">👍</span>
                <div>
                  <h4 className="text-sm font-medium text-green-800">Good Job!</h4>
                  <p className="text-xs text-green-700">Transportation costs down 15%</p>
                </div>
              </div>
            </div>
          </div>
          <div className="absolute bottom-6 left-6 right-6">
            <div className="space-y-2">
              <a href="#" className="flex items-center space-x-3 text-gray-600 hover:bg-gray-50 px-3 py-2 rounded-lg">
                <span>⚙️</span>
                <span>Settings</span>
              </a>
              <a href="#" className="flex items-center space-x-3 text-gray-600 hover:bg-gray-50 px-3 py-2 rounded-lg">
                <span>❓</span>
                <span>Help</span>
              </a>
            </div>
          </div>
        </div>
      </aside>
      {/* Main Content */}
      <main className="ml-64 flex-1 bg-gray-50 min-h-screen">
        {/* Header */}
        <div className="bg-white shadow-sm border-b border-gray-200 px-8 py-4">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
              <p className="text-gray-600">Welcome back! Here's your financial overview.</p>
            </div>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                <span className="text-sm text-gray-600">Live data</span>
              </div>
              <button className="bg-white border border-gray-300 rounded-lg px-4 py-2 text-sm hover:bg-gray-50">Export</button>
            </div>
          </div>
        </div>
        <div className="p-8">
          {/* Account Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                    <span className="text-blue-600">💳</span>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Primary Checking</p>
                    <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">checking</span>
                  </div>
                </div>
              </div>
              <div className="text-3xl font-bold text-gray-900 mb-2">$2,455.29</div>
              <div className="flex items-center text-sm">
                <span className="text-green-600 flex items-center">↗ +$125.30 (+5.4%)</span>
                <span className="text-gray-500 ml-2">vs. last week</span>
              </div>
            </div>
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                    <span className="text-green-600">💰</span>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Emergency Fund</p>
                    <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">savings</span>
                  </div>
                </div>
              </div>
              <div className="text-3xl font-bold text-gray-900 mb-2">$8,950.15</div>
              <div className="flex items-center text-sm">
                <span className="text-red-600 flex items-center">↘ $-45.20 (-0.5%)</span>
                <span className="text-gray-500 ml-2">vs. last week</span>
              </div>
            </div>
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
                    <span className="text-purple-600">💎</span>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Rewards Card</p>
                    <span className="text-xs bg-red-100 text-red-800 px-2 py-1 rounded">credit</span>
                  </div>
                </div>
              </div>
              <div className="text-3xl font-bold text-gray-900 mb-2">$1,250.75</div>
              <div className="flex items-center text-sm">
                <span className="text-green-600 flex items-center">↗ +$85.40 (+7.3%)</span>
                <span className="text-gray-500 ml-2">vs. last week</span>
              </div>
            </div>
          </div>
          {/* Financial Heartbeat Chart */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-lg font-semibold flex items-center">
                  <span className="mr-2">📈</span> Financial Heartbeat
                </h3>
                <p className="text-sm text-gray-600">Your spending rhythm over time</p>
              </div>
              <div className="flex items-center space-x-4 text-sm">
                <div className="flex items-center">
                  <div className="w-3 h-3 bg-gray-800 rounded-full mr-2"></div>
                  <span>Account Balance</span>
                </div>
                <div className="flex items-center">
                  <div className="w-3 h-3 bg-gray-400 rounded-full mr-2"></div>
                  <span>Daily Spending</span>
                </div>
              </div>
            </div>
            <div className="h-48 bg-gray-50 rounded-lg flex items-center justify-center">
              <p className="text-gray-500">Chart visualization would go here</p>
            </div>
          </div>
          {/* Smart Insights */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
            <div className="mb-6">
              <h3 className="text-lg font-semibold flex items-center">
                <span className="mr-2">📈</span> Smart Insights
              </h3>
              <p className="text-sm text-gray-600">AI-powered analysis of your spending patterns</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {smartInsights.map((insight, index) => (
                <div
                  key={index}
                  className={`border rounded-lg p-4 ${
                    insight.type === 'warning'
                      ? 'bg-red-50 border-red-200'
                      : insight.type === 'success'
                      ? 'bg-green-50 border-green-200'
                      : 'bg-blue-50 border-blue-200'
                  }`}
                >
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center">
                      <span className="text-blue-500 mr-2">💡</span>
                      <span className="text-sm font-medium">Smart Insight</span>
                    </div>
                    {insight.type === 'warning' && <span className="text-red-500">⚠️</span>}
                  </div>
                  <p className="text-sm text-gray-800 mb-3">{insight.title}</p>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center text-sm">
                      <span className="text-gray-600">{insight.category}</span>
                      <span
                        className={`ml-2 px-2 py-1 rounded text-xs ${
                          insight.trend === 'Up'
                            ? 'bg-red-100 text-red-800'
                            : insight.trend === 'Down'
                            ? 'bg-green-100 text-green-800'
                            : 'bg-gray-100 text-gray-800'
                        }`}
                      >
                        {insight.trend === 'Up' && '📈 '}
                        {insight.trend === 'Down' && '📉 '}
                        {insight.trend === 'Stable' && '📊 '}
                        {insight.trend}
                      </span>
                    </div>
                    <span
                      className={`text-sm font-semibold ${
                        insight.percentage.startsWith('+') && insight.trend === 'Up'
                          ? 'text-red-600'
                          : insight.percentage.startsWith('-')
                          ? 'text-green-600'
                          : 'text-gray-600'
                      }`}
                    >
                      {insight.percentage}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
          {/* Bottom Row */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Spending by Category */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="text-lg font-semibold flex items-center">
                    <span className="mr-2">⏰</span> Spending by Category
                  </h3>
                  <p className="text-sm text-gray-600">Your spending breakdown this month</p>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold">$1,126.00</div>
                  <div className="text-sm text-gray-600">Total spent</div>
                </div>
              </div>
              <div className="space-y-4">
                {spendingData.map((category, index) => (
                  <div key={index} className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center text-sm">
                        {category.name === 'Dining' && '🍽️'}
                        {category.name === 'Shopping' && '🛍️'}
                        {category.name === 'Transportation' && '🚗'}
                        {category.name === 'Utilities' && '🏠'}
                        {category.name === 'Entertainment' && '🎬'}
                        {category.name === 'Healthcare' && '⚕️'}
                        {category.name === 'Other' && '💳'}
                      </div>
                      <div>
                        <div className="font-medium">{category.name}</div>
                        <div className="text-sm text-gray-500">{category.transactions} transactions</div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-semibold">${category.value}</div>
                      <div className="text-sm text-gray-500">{category.percentage}%</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            {/* Recent Transactions */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="text-lg font-semibold flex items-center">
                    <span className="mr-2">🕐</span> Recent Transactions
                  </h3>
                  <p className="text-sm text-gray-600">Your latest activity</p>
                </div>
                <div className="text-sm text-gray-500">{transactions.length} transactions</div>
              </div>
              <div className="space-y-4">
                {transactions.map((transaction, index) => (
                  <div key={index} className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <div
                        className={`w-8 h-8 rounded-lg flex items-center justify-center text-white text-sm ${
                          transaction.category === 'dining'
                            ? 'bg-blue-500'
                            : transaction.category === 'income'
                            ? 'bg-green-500'
                            : transaction.category === 'transportation'
                            ? 'bg-yellow-500'
                            : transaction.category === 'utilities'
                            ? 'bg-red-500'
                            : 'bg-gray-500'
                        }`}
                      >
                        {transaction.category === 'dining' && '🍽️'}
                        {transaction.category === 'income' && '💰'}
                        {transaction.category === 'transportation' && '🚗'}
                        {transaction.category === 'utilities' && '⚡'}
                        {transaction.category === 'entertainment' && '🎬'}
                      </div>
                      <div>
                        <div className="font-medium">{transaction.name}</div>
                        <div className="text-sm text-gray-500">
                          {transaction.date} • {transaction.time}
                        </div>
                      </div>
                    </div>
                    <div className={`font-semibold ${transaction.amount > 0 ? 'text-green-600' : 'text-gray-900'}`}>
                      {transaction.amount > 0 ? '✓ +' : '↙ -'}${Math.abs(transaction.amount).toLocaleString()}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
          {/* 30-Day Balance Projection */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 mt-8 p-6">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-lg font-semibold flex items-center">
                  <span className="mr-2">📈</span> 30-Day Balance Projection
                </h3>
                <p className="text-sm text-gray-600">Projected Balance (30 days)</p>
              </div>
              <div className="text-right">
                <div className="text-3xl font-bold text-gray-900">$952.35</div>
                <div className="flex items-center text-sm">
                  <span className="bg-red-500 text-white px-2 py-1 rounded text-xs">$-1502.94</span>
                  <span className="text-gray-500 ml-2">80% confidence</span>
                </div>
              </div>
            </div>
            <div className="h-48 bg-gray-50 rounded-lg flex items-center justify-center">
              <p className="text-gray-500">Projection chart would go here</p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default CashCurrentDashboard;
