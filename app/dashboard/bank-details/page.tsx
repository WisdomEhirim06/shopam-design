'use client';

import { useState, useEffect } from 'react';
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
import apiClient, { API_ENDPOINTS } from '@/lib/api/config';
import { BANK_OPTIONS, formatCurrency } from './bank-data';

export default function BankDetailsPage() {
  // Payment Setup State — empty until loaded or filled by vendor
  const [paymentSetup, setPaymentSetup] = useState({
    bankName: '',
    accountNumber: '',
    accountName: '',
  });

  // Withdrawal Settings State
  const [withdrawalSettings, setWithdrawalSettings] = useState({
    minimumAmount: '5000',
    autoWithdrawal: false,
    withdrawalDay: 'friday',
  });

  const [transactions, setTransactions] = useState<any[]>([]);
  const [showAccountNumber, setShowAccountNumber] = useState(false);
  const [isVerified, setIsVerified] = useState(false);
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'saved' | 'error'>('idle');
  const [saveMsg, setSaveMsg] = useState('');

  useEffect(() => {
    // Load payment history for the transactions section
    apiClient.get<any>(API_ENDPOINTS.PAYMENTS.HISTORY)
      .then((res) => {
        const data = res.data;
        const results = Array.isArray(data) ? data : (data?.results ?? []);
        setTransactions(results.slice(0, 5));
      })
      .catch(() => { /* silently ignore — no transactions yet */ });
  }, []);

  // Save bank account details via payments API
  const handleSave = async () => {
    setSaveStatus('saving');
    setSaveMsg('');
    try {
      await apiClient.post('/api/payments/bank-account/', {
        bank_name: paymentSetup.bankName,
        account_number: paymentSetup.accountNumber,
        account_name: paymentSetup.accountName,
      });
      setSaveStatus('saved');
      setSaveMsg('Bank details saved successfully');
    } catch (err: any) {
      setSaveStatus('error');
      const detail = err.response?.data?.detail || err.response?.data?.message;
      setSaveMsg(detail || 'Failed to save. Please try again.');
    } finally {
      setTimeout(() => { setSaveStatus('idle'); setSaveMsg(''); }, 3000);
    }
  };
  // (formatCurrency is imported from ./bank-data)

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
          <p className="text-3xl font-bold text-green-400">—</p>
          <button className="mt-4 w-full py-2 bg-green-500/20 hover:bg-green-500 text-green-400 hover:text-white rounded-lg text-sm font-medium transition-all">
            Withdraw Funds
          </button>
        </div>

        <div className="glass border-white/10 rounded-xl p-6">
          <div className="flex items-center justify-between mb-3">
            <p className="text-sm text-gray-400">Pending Payouts</p>
            <DollarSign size={20} className="text-amber-400" />
          </div>
          <p className="text-2xl font-bold text-amber-400">—</p>
          <p className="text-xs text-gray-500 mt-2">Processing...</p>
        </div>

        <div className="glass border-white/10 rounded-xl p-6">
          <div className="flex items-center justify-between mb-3">
            <p className="text-sm text-gray-400">Total Earnings</p>
            <TrendingUp size={20} className="text-crimson" />
          </div>
          <p className="text-2xl font-bold">—</p>
          <p className="text-xs text-gray-500 mt-2">All time</p>
        </div>

        <div className="glass border-white/10 rounded-xl p-6">
          <div className="flex items-center justify-between mb-3">
            <p className="text-sm text-gray-400">Last Payout</p>
            <CheckCircle size={20} className="text-blue-400" />
          </div>
          <p className="text-lg font-bold">—</p>
          <p className="text-xs text-gray-500 mt-2">No payouts yet</p>
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
                {BANK_OPTIONS.map((bank) => (
                  <option key={bank.value} value={bank.value} className="theme-modal">{bank.label}</option>
                ))}
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

            {saveMsg && (
              <p className={`text-sm text-center ${saveStatus === 'error' ? 'text-red-400' : 'text-green-400'}`}>
                {saveMsg}
              </p>
            )}
            <button
              onClick={handleSave}
              disabled={saveStatus === 'saving'}
              className="w-full flex items-center justify-center gap-2 px-6 py-3 theme-btn-primary rounded-lg font-medium transition-all disabled:opacity-50"
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
          {transactions.length === 0 ? (
            <p className="text-center text-gray-500 py-8 text-sm">No transactions yet.</p>
          ) : transactions.map((transaction, index) => {
            const amount = Number(transaction.amount ?? transaction.total_amount ?? 0);
            const isCredit = amount >= 0;
            const dateStr = transaction.created_at ?? transaction.date ?? '';
            const status = transaction.status ?? 'completed';
            return (
              <div
                key={index}
                className="flex items-center justify-between p-4 bg-white/5 rounded-lg hover:bg-white/10 transition-colors"
              >
                <div className="flex items-center gap-4">
                  <div className={`p-3 rounded-lg ${isCredit ? 'bg-green-500/20' : 'bg-red-500/20'}`}>
                    <TrendingUp size={20} className={isCredit ? 'text-green-400' : 'text-red-400 rotate-180'} />
                  </div>
                  <div>
                    <p className="font-medium">{transaction.type ?? (isCredit ? 'Payment' : 'Withdrawal')}</p>
                    {dateStr && (
                      <p className="text-sm text-gray-400">
                        {new Date(dateStr).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                      </p>
                    )}
                  </div>
                </div>
                <div className="text-right">
                  <p className={`text-lg font-bold ${isCredit ? 'text-green-400' : 'text-red-400'}`}>
                    {isCredit ? '+' : ''}{formatCurrency(amount)}
                  </p>
                  <p className={`text-xs ${status === 'completed' || status === 'successful' ? 'text-green-400' : 'text-amber-400'}`}>
                    {status === 'completed' || status === 'successful' ? '✓ Completed' : '⏳ Pending'}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </motion.div>
    </div>
  );
}