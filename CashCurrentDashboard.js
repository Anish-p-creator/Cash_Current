import React, { useState, useEffect } from 'react';
import { TrendingUp, TrendingDown, DollarSign, CreditCard, PieChart, BarChart3, Wallet, Target, ArrowUpRight, ArrowDownRight } from 'lucide-react';

const CashCurrentDashboard = () => {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [selectedPeriod, setSelectedPeriod] = useState('month');

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  // Sample data - in real app, this would come from your backend
  const portfolioData = [
    { symbol: 'AAPL', name: 'Apple Inc.', price: 178.25, change: 2.45, changePercent: 1.39, shares: 50 },
    { symbol: 'GOOGL', name: 'Alphabet Inc.', price: 142.56, change: -1.23, changePercent: -0.85, shares: 25 },
    { symbol: 'MSFT', name: 'Microsoft Corp.', price: 415.89, change: 5.67, changePercent: 1.38, shares: 30 },
    { symbol: 'TSLA', name: 'Tesla Inc.', price: 248.42, change: -8.34, changePercent: -3.25, shares: 20 }
  ];

  const spendingCategories = [
    { name: 'Food & Dining', amount: 1245, percent: 35, color: 'bg-blue-500' },
    { name: 'Transportation', amount: 680, percent: 19, color: 'bg-green-500' },
    { name: 'Shopping', amount: 520, percent: 15, color: 'bg-purple-500' },
    { name: 'Entertainment', amount: 380, percent: 11, color: 'bg-yellow-500' },
    { name: 'Bills & Utilities', amount: 720, percent: 20, color: 'bg-red-500' }
  ];

  const totalPortfolioValue = portfolioData.reduce((sum, stock) => sum + (stock.price * stock.shares), 0);
  const totalSpending = spendingCategories.reduce((sum, cat) => sum + cat.amount, 0);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Header */}
      <header className="bg-black/20 backdrop-blur-sm border-b border-white/10">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-blue-500 rounded-xl flex items-center justify-center">
                <DollarSign className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-white">Cash Current</h1>
                <p className="text-purple-300 text-sm">Your Financial Story</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-white font-semibold">{currentTime.toLocaleDateString()}</p>
              <p className="text-purple-300 text-sm">{currentTime.toLocaleTimeString()}</p>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Overview Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-purple-300 text-sm">Total Balance</p>
                <p className="text-3xl font-bold text-white">${(totalPortfolioValue + 5420).toLocaleString()}</p>
              </div>
              <Wallet className="w-8 h-8 text-purple-400" />
            </div>
            <div className="flex items-center mt-2">
              <ArrowUpRight className="w-4 h-4 text-green-400 mr-1" />
              <span className="text-green-400 text-sm">+12.5% this month</span>
            </div>
          </div>

          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-purple-300 text-sm">Portfolio Value</p>
                <p className="text-3xl font-bold text-white">${totalPortfolioValue.toLocaleString()}</p>
              </div>
              <TrendingUp className="w-8 h-8 text-green-400" />
            </div>
            <div className="flex items-center mt-2">
              <ArrowUpRight className="w-4 h-4 text-green-400 mr-1" />
              <span className="text-green-400 text-sm">+8.7% today</span>
            </div>
          </div>

          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-purple-300 text-sm">Monthly Spending</p>
                <p className="text-3xl font-bold text-white">${totalSpending.toLocaleString()}</p>
              </div>
              <CreditCard className="w-8 h-8 text-red-400" />
            </div>
            <div className="flex items-center mt-2">
              <ArrowDownRight className="w-4 h-4 text-red-400 mr-1" />
              <span className="text-red-400 text-sm">-5.2% vs last month</span>
            </div>
          </div>

          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-purple-300 text-sm">Savings Goal</p>
                <p className="text-3xl font-bold text-white">68%</p>
              </div>
              <Target className="w-8 h-8 text-blue-400" />
            </div>
            <div className="w-full bg-gray-700 rounded-full h-2 mt-3">
              <div className="bg-blue-400 h-2 rounded-full" style={{ width: '68%' }}></div>
            </div>
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Stock Portfolio */}
          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-white flex items-center">
                <BarChart3 className="w-6 h-6 mr-2 text-green-400" />
                Stock Portfolio
              </h2>
              <span className="text-green-400 text-sm font-semibold">Live</span>
            </div>
            
            <div className="space-y-4">
              {portfolioData.map((stock, index) => (
                <div key={index} className="flex items-center justify-between p-4 bg-black/20 rounded-xl">
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-xl flex items-center justify-center">
                      <span className="text-white font-bold text-sm">{stock.symbol.substring(0, 2)}</span>
                    </div>
                    <div>
                      <p className="text-white font-semibold">{stock.symbol}</p>
                      <p className="text-gray-400 text-sm">{stock.shares} shares</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-white font-semibold">${stock.price}</p>
                    <div className={`flex items-center ${stock.change > 0 ? 'text-green-400' : 'text-red-400'}`}>
                      {stock.change > 0 ? (
                        <ArrowUpRight className="w-4 h-4 mr-1" />
                      ) : (
                        <ArrowDownRight className="w-4 h-4 mr-1" />
                      )}
                      <span className="text-sm">{stock.changePercent}%</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Spending Analysis */}
          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-white flex items-center">
                <PieChart className="w-6 h-6 mr-2 text-purple-400" />
                Spending Analysis
              </h2>
              <select 
                className="bg-black/30 text-white rounded-lg px-3 py-1 text-sm border border-white/20"
                value={selectedPeriod}
                onChange={(e) => setSelectedPeriod(e.target.value)}
              >
                <option value="week">This Week</option>
                <option value="month">This Month</option>
                <option value="year">This Year</option>
              </select>
            </div>

            <div className="space-y-4">
              {spendingCategories.map((category, index) => (
                <div key={index} className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-white">{category.name}</span>
                    <span className="text-purple-300">${category.amount}</span>
                  </div>
                  <div className="w-full bg-gray-700 rounded-full h-3">
                    <div 
                      className={`h-3 rounded-full ${category.color}`}
                      style={{ width: `${category.percent}%` }}
                    ></div>
                  </div>
                  <div className="text-right">
                    <span className="text-gray-400 text-sm">{category.percent}%</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Financial Insights */}
        <div className="mt-8 bg-gradient-to-r from-purple-500/20 to-blue-500/20 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
          <h2 className="text-xl font-bold text-white mb-4">💡 Your Financial Story</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="text-3xl mb-2">📈</div>
              <h3 className="text-white font-semibold mb-2">Growing Wealth</h3>
              <p className="text-gray-300 text-sm">Your portfolio is up 8.7% today. Tech stocks are performing well!</p>
            </div>
            <div className="text-center">
              <div className="text-3xl mb-2">🎯</div>
              <h3 className="text-white font-semibold mb-2">On Track</h3>
              <p className="text-gray-300 text-sm">You're 68% toward your savings goal. Keep up the momentum!</p>
            </div>
            <div className="text-center">
              <div className="text-3xl mb-2">💰</div>
              <h3 className="text-white font-semibold mb-2">Smart Spending</h3>
              <p className="text-gray-300 text-sm">Spending is down 5.2% this month. Great job controlling costs!</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CashCurrentDashboard;