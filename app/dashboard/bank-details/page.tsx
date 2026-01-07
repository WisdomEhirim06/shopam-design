'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  CreditCard,
  Building2,
  DollarSign,
  CheckCircle,
  AlertCircle,
  Save,
  Eye,
  EyeOff,
  TrendingUp,
  Wallet,
} from 'lucide-react';

export default function BankDetailsPage() {
  // Payment Setup State
  const [paymentSetup, setPaymentSetup] = useState({
    bankName: 'First Bank of Nigeria',
    accountNumber: '0123456789',
    accountName: 'Sarah Adelewo',
  });

  // Withdrawal Settings State
  const [withdrawalSettings, setWithdrawalSettings] = useState({
    minimumAmount: '5000',
    autoWithdrawal: false,
    withdrawalDay: 'friday',
  });

  // Stats
  const [stats, setStats] = useState({
    availableBalance: 125450.50,
    pendingPayouts: 23500.00,
    totalEarnings: 856300.00,
    lastPayout: '2024-01-10',
  });

  const [showAccountNumber, setShowAccountNumber] = useState(false);
  const [isVerified, setIsVerified] = useState(true);
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'saved'>('idle');

  // Handle Save
  const handleSave = () => {
    setSaveStatus('saving');
    // Simulate API call
    setTimeout(() => {
      setSaveStatus('saved');
      setTimeout(() => setSaveStatus('idle'), 2000);
    }, 1000);
  };

  // Format currency
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: 'NGN',
    }).format(amount);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <h1 className="text-3xl font-bold mb-2">Bank Details & Payments</h1>
        <p className="text-gray-400">Manage your payment and withdrawal settings</p>
      </motion.div>

      {/* Balance Overview */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1, duration: 0.4 }}
        className="grid grid-cols-1 md:grid-cols-4 gap-4"
      >
        <div className="glass border-white/10 rounded-xl p-6 hover:border-crimson/30 transition-all">
          <div className="flex items-center justify-between mb-3">
            <p className="text-sm text-gray-400">Available Balance</p>
            <Wallet size={20} className="text-green-400" />
          </div>
          <p className="text-3xl font-bold text-green-400">
            {formatCurrency(stats.availableBalance)}
          </p>
          <button className="mt-4 w-full py-2 bg-green-500/20 hover:bg-green-500 text-green-400 hover:text-white rounded-lg text-sm font-medium transition-all">
            Withdraw Funds
          </button>
        </div>

        <div className="glass border-white/10 rounded-xl p-6">
          <div className="flex items-center justify-between mb-3">
            <p className="text-sm text-gray-400">Pending Payouts</p>
            <DollarSign size={20} className="text-amber-400" />
          </div>
          <p className="text-2xl font-bold text-amber-400">
            {formatCurrency(stats.pendingPayouts)}
          </p>
          <p className="text-xs text-gray-500 mt-2">Processing...</p>
        </div>

        <div className="glass border-white/10 rounded-xl p-6">
          <div className="flex items-center justify-between mb-3">
            <p className="text-sm text-gray-400">Total Earnings</p>
            <TrendingUp size={20} className="text-crimson" />
          </div>
          <p className="text-2xl font-bold">{formatCurrency(stats.totalEarnings)}</p>
          <p className="text-xs text-gray-500 mt-2">All time</p>
        </div>

        <div className="glass border-white/10 rounded-xl p-6">
          <div className="flex items-center justify-between mb-3">
            <p className="text-sm text-gray-400">Last Payout</p>
            <CheckCircle size={20} className="text-blue-400" />
          </div>
          <p className="text-lg font-bold">
            {new Date(stats.lastPayout).toLocaleDateString('en-US', {
              month: 'short',
              day: 'numeric',
              year: 'numeric',
            })}
          </p>
          <p className="text-xs text-gray-500 mt-2">₦45,300.00</p>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Payment Setup */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2, duration: 0.4 }}
          className="glass border-white/10 rounded-xl p-6"
        >
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2">
              <div className="p-2 bg-crimson/20 rounded-lg">
                <Building2 size={24} className="text-crimson" />
              </div>
              <h3 className="text-lg font-semibold">Payment Setup</h3>
            </div>
            {isVerified && (
              <div className="flex items-center gap-2 px-3 py-1 bg-green-500/20 text-green-400 rounded-full text-xs font-medium">
                <CheckCircle size={14} />
                Verified
              </div>
            )}
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Bank Name</label>
              <select
                value={paymentSetup.bankName}
                onChange={(e) => setPaymentSetup({ ...paymentSetup, bankName: e.target.value })}
                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:border-crimson/50 focus:ring-2 focus:ring-crimson/20 transition-all"
              >
                <option value="First Bank of Nigeria" className="theme-modal">First Bank of Nigeria</option>
                <option value="GTBank" className="theme-modal">Guaranty Trust Bank</option>
                <option value="Access Bank" className="theme-modal">Access Bank</option>
                <option value="Zenith Bank" className="theme-modal">Zenith Bank</option>
                <option value="UBA" className="theme-modal">United Bank for Africa</option>
                <option value="Ecobank" className="theme-modal">Ecobank Nigeria</option>
                <option value="Fidelity Bank" className="theme-modal">Fidelity Bank</option>
                <option value="Union Bank" className="theme-modal">Union Bank</option>
                <option value="Stanbic IBTC" className="theme-modal">Stanbic IBTC Bank</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Account Number</label>
              <div className="relative">
                <input
                  type={showAccountNumber ? 'text' : 'password'}
                  value={paymentSetup.accountNumber}
                  onChange={(e) =>
                    setPaymentSetup({ ...paymentSetup, accountNumber: e.target.value })
                  }
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:border-crimson/50 focus:ring-2 focus:ring-crimson/20 transition-all pr-12"
                  placeholder="0123456789"
                />
                <button
                  onClick={() => setShowAccountNumber(!showAccountNumber)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
                >
                  {showAccountNumber ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Account Name</label>
              <div className="relative">
                <input
                  type="text"
                  value={paymentSetup.accountName}
                  onChange={(e) =>
                    setPaymentSetup({ ...paymentSetup, accountName: e.target.value })
                  }
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:border-crimson/50 focus:ring-2 focus:ring-crimson/20 transition-all pr-10"
                  placeholder="Account holder name"
                />
                {isVerified && (
                  <CheckCircle size={20} className="absolute right-3 top-1/2 -translate-y-1/2 text-green-400" />
                )}
              </div>
              <p className="text-xs text-gray-500 mt-2">
                {isVerified ? '✓ Account verified successfully' : 'Verifying account...'}
              </p>
            </div>

            <div className="p-4 bg-green-500/10 border border-green-500/30 rounded-lg">
              <div className="flex items-start gap-3">
                <CheckCircle size={20} className="text-green-400 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-green-400">Verification Complete</p>
                  <p className="text-xs text-gray-400 mt-1">
                    Your bank account has been verified and is ready to receive payments.
                  </p>
                </div>
              </div>
            </div>

            <button
              onClick={handleSave}
              className="w-full flex items-center justify-center gap-2 px-6 py-3 theme-btn-primary rounded-lg font-medium transition-all"
            >
              <Save size={20} />
              {saveStatus === 'saving' ? 'Saving...' : saveStatus === 'saved' ? 'Saved!' : 'Update Payment Info'}
            </button>
          </div>
        </motion.div>

        {/* Withdrawal Settings */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2, duration: 0.4 }}
          className="theme-card border-white/10 rounded-xl p-6"
        >
          <div className="flex items-center gap-2 mb-6">
            <div className="p-2 bg-crimson/20 rounded-lg">
              <CreditCard size={24} className="text-crimson" />
            </div>
            <h3 className="text-lg font-semibold">Withdrawal Settings</h3>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Minimum Withdrawal Amount</label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">₦</span>
                <input
                  type="number"
                  value={withdrawalSettings.minimumAmount}
                  onChange={(e) =>
                    setWithdrawalSettings({ ...withdrawalSettings, minimumAmount: e.target.value })
                  }
                  className="w-full pl-8 pr-4 py-3 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:border-crimson/50 focus:ring-2 focus:ring-crimson/20 transition-all"
                  placeholder="5000"
                />
              </div>
              <p className="text-xs text-gray-500 mt-2">
                Set the minimum amount required before withdrawals can be made
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Automatic Withdrawal Day</label>
              <select
                value={withdrawalSettings.withdrawalDay}
                onChange={(e) =>
                  setWithdrawalSettings({ ...withdrawalSettings, withdrawalDay: e.target.value })
                }
                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:border-crimson/50 focus:ring-2 focus:ring-crimson/20 transition-all"
              >
                <option value="monday" className="theme-modal">Every Monday</option>
                <option value="tuesday" className="theme-modal">Every Tuesday</option>
                <option value="wednesday" className="theme-modal">Every Wednesday</option>
                <option value="thursday" className="theme-modal">Every Thursday</option>
                <option value="friday" className="theme-modal">Every Friday</option>
              </select>
              <p className="text-xs text-gray-500 mt-2">
                Choose when automatic withdrawals should be processed
              </p>
            </div>

            <div className="flex items-center justify-between p-4 bg-white/5 rounded-lg">
              <div>
                <p className="font-medium">Enable Auto-Withdrawal</p>
                <p className="text-sm text-gray-400">Automatically withdraw funds weekly</p>
              </div>
              <button
                onClick={() =>
                  setWithdrawalSettings({
                    ...withdrawalSettings,
                    autoWithdrawal: !withdrawalSettings.autoWithdrawal,
                  })
                }
                className={`relative w-14 h-7 rounded-full transition-all ${
                  withdrawalSettings.autoWithdrawal ? 'bg-crimson' : 'bg-gray-600'
                }`}
              >
                <div
                  className={`absolute top-1 w-5 h-5 bg-white rounded-full transition-all ${
                    withdrawalSettings.autoWithdrawal ? 'right-1' : 'left-1'
                  }`}
                ></div>
              </button>
            </div>

            <div className="p-4 bg-blue-500/10 border border-blue-500/30 rounded-lg">
              <div className="flex items-start gap-3">
                <AlertCircle size={20} className="text-blue-400 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-blue-400">Withdrawal Schedule</p>
                  <p className="text-xs text-gray-400 mt-1">
                    {withdrawalSettings.autoWithdrawal
                      ? `Funds will be automatically withdrawn every ${withdrawalSettings.withdrawalDay} if the minimum amount is met.`
                      : 'Auto-withdrawal is currently disabled. You can manually request withdrawals anytime.'}
                  </p>
                </div>
              </div>
            </div>

            <button
              onClick={handleSave}
              className="w-full flex items-center justify-center gap-2 px-6 py-3 theme-btn-primary rounded-lg font-medium transition-all"
            >
              <Save size={20} />
              Save Withdrawal Settings
            </button>
          </div>
        </motion.div>
      </div>

      {/* Transaction History Preview */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 0.4 }}
        className="glass border-white/10 rounded-xl p-6"
      >
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold">Recent Transactions</h3>
          <button className="text-crimson hover:text-crimson/80 text-sm font-medium transition-colors">
            View All →
          </button>
        </div>

        <div className="space-y-3">
          {[
            { type: 'Withdrawal', amount: -45300, date: '2024-01-10', status: 'completed' },
            { type: 'Payment', amount: 12500, date: '2024-01-09', status: 'completed' },
            { type: 'Payment', amount: 8750, date: '2024-01-08', status: 'completed' },
            { type: 'Withdrawal', amount: -35000, date: '2024-01-05', status: 'completed' },
            { type: 'Payment', amount: 15200, date: '2024-01-04', status: 'pending' },
          ].map((transaction, index) => (
            <div
              key={index}
              className="flex items-center justify-between p-4 bg-white/5 rounded-lg hover:bg-white/10 transition-colors"
            >
              <div className="flex items-center gap-4">
                <div
                  className={`p-3 rounded-lg ${
                    transaction.type === 'Withdrawal'
                      ? 'bg-red-500/20'
                      : 'bg-green-500/20'
                  }`}
                >
                  {transaction.type === 'Withdrawal' ? (
                    <TrendingUp size={20} className="text-red-400 rotate-180" />
                  ) : (
                    <TrendingUp size={20} className="text-green-400" />
                  )}
                </div>
                <div>
                  <p className="font-medium">{transaction.type}</p>
                  <p className="text-sm text-gray-400">
                    {new Date(transaction.date).toLocaleDateString('en-US', {
                      month: 'short',
                      day: 'numeric',
                      year: 'numeric',
                    })}
                  </p>
                </div>
              </div>
              <div className="text-right">
                <p
                  className={`text-lg font-bold ${
                    transaction.amount > 0 ? 'text-green-400' : 'text-red-400'
                  }`}
                >
                  {transaction.amount > 0 ? '+' : ''}
                  {formatCurrency(transaction.amount)}
                </p>
                <p
                  className={`text-xs ${
                    transaction.status === 'completed'
                      ? 'text-green-400'
                      : 'text-amber-400'
                  }`}
                >
                  {transaction.status === 'completed' ? '✓ Completed' : '⏳ Pending'}
                </p>
              </div>
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}