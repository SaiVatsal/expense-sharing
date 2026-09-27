import React, { useState } from 'react';
import {
  Users,
  Receipt,
  ArrowRightLeft,
  PlusCircle,
  TrendingUp,
  DollarSign,
  CheckCircle2,
  Bell,
  Clock,
  Send,
  Plus,
  ArrowRight,
  ShieldCheck,
  Sparkles,
  PieChart
} from 'lucide-react';
import { useStore } from './store/useStore';

export default function App() {
  const {
    currentUser,
    activeTab,
    setActiveTab,
    groups,
    expenses,
    simplifiedDebts,
    addExpense,
    settleDebt,
    addGroup
  } = useStore();

  const [showAddExpenseModal, setShowAddExpenseModal] = useState(false);
  const [showAddGroupModal, setShowAddGroupModal] = useState(false);

  const [expenseForm, setExpenseForm] = useState({
    title: '',
    groupId: groups[0]?.id || '',
    amount: '',
    paidBy: 'You (Alex)',
    category: 'Dining',
    splitType: 'Equal Split'
  });

  const [groupForm, setGroupForm] = useState({
    name: '',
    category: 'Trip',
    friendName: 'Taylor Morgan'
  });

  const totalOwedToYou = simplifiedDebts
    .filter(d => d.to === 'You (Alex)' && d.status === 'Pending')
    .reduce((acc, d) => acc + d.amount, 0);

  const totalYouOwe = simplifiedDebts
    .filter(d => d.from === 'You (Alex)' && d.status === 'Pending')
    .reduce((acc, d) => acc + d.amount, 0);

  const netBalance = totalOwedToYou - totalYouOwe;

  const handleCreateExpense = (e) => {
    e.preventDefault();
    if (!expenseForm.title || !expenseForm.amount) return;
    addExpense(expenseForm);
    setShowAddExpenseModal(false);
    setExpenseForm({
      title: '',
      groupId: groups[0]?.id || '',
      amount: '',
      paidBy: 'You (Alex)',
      category: 'Dining',
      splitType: 'Equal Split'
    });
  };

  const handleCreateGroup = (e) => {
    e.preventDefault();
    if (!groupForm.name) return;
    addGroup(groupForm);
    setShowAddGroupModal(false);
    setGroupForm({
      name: '',
      category: 'Trip',
      friendName: 'Taylor Morgan'
    });
  };

  return (
    <div className="min-h-screen bg-[#f0fdf4] text-slate-800 flex flex-col font-rounded selection:bg-emerald-200">
      {/* Friendly Mint Header */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur border-b border-emerald-100 px-6 py-3.5 shadow-sm">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-emerald-600 flex items-center justify-center text-white shadow-md shadow-emerald-500/30">
              <Receipt className="w-5 h-5" />
            </div>
            <div>
              <span className="font-extrabold text-lg text-emerald-950 tracking-tight block leading-tight">
                SPLITMINT // SHARED EXPENSES
              </span>
              <span className="text-[10px] uppercase font-bold text-emerald-600 tracking-wider">
                Fair Group Splits • Debt Graph Simplification
              </span>
            </div>
          </div>

          {/* Navigation */}
          <div className="hidden md:flex items-center gap-1 bg-emerald-50/80 p-1.5 rounded-2xl border border-emerald-100 text-xs font-bold text-emerald-800">
            {[
              { id: 'groups', label: 'Group Hubs', icon: Users },
              { id: 'activity', label: 'Expense Ledger', icon: Receipt },
              { id: 'simplify', label: 'Debt Simplifier', icon: ArrowRightLeft }
            ].map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`px-3.5 py-1.5 rounded-xl flex items-center gap-1.5 transition ${
                    activeTab === tab.id
                      ? 'bg-emerald-600 text-white shadow-sm shadow-emerald-500/20'
                      : 'hover:bg-emerald-100/60'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  {tab.label}
                </button>
              );
            })}
          </div>

          {/* Quick Action Button */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowAddExpenseModal(true)}
              className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-md shadow-emerald-600/20 transition"
            >
              <PlusCircle className="w-3.5 h-3.5" />
              <span>Add Expense</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-6 py-8 w-full flex-1 space-y-6">
        {/* Net Balance Overview Strip */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-white p-5 rounded-3xl border border-emerald-100 shadow-sm space-y-1">
            <span className="text-xs font-bold text-slate-500 uppercase">Your Net Balance</span>
            <div className={`text-2xl font-extrabold ${netBalance >= 0 ? 'text-emerald-600' : 'text-rose-600'}`}>
              {netBalance >= 0 ? `+$${netBalance}` : `-$${Math.abs(netBalance)}`}
            </div>
            <p className="text-[11px] text-slate-400 font-semibold">Across all active shared groups</p>
          </div>

          <div className="bg-white p-5 rounded-3xl border border-emerald-100 shadow-sm space-y-1">
            <span className="text-xs font-bold text-slate-500 uppercase">You Are Owed</span>
            <div className="text-2xl font-extrabold text-emerald-600">+${totalOwedToYou}</div>
            <p className="text-[11px] text-slate-400 font-semibold">From friends & flatmates</p>
          </div>

          <div className="bg-white p-5 rounded-3xl border border-emerald-100 shadow-sm space-y-1">
            <span className="text-xs font-bold text-slate-500 uppercase">You Owe Others</span>
            <div className="text-2xl font-extrabold text-rose-600">-${totalYouOwe}</div>
            <p className="text-[11px] text-slate-400 font-semibold">Ready to settle up</p>
          </div>
        </div>

        {/* VIEW 1: GROUPS */}
        {activeTab === 'groups' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold text-slate-900">Your Active Circles & Trips</h2>
                <p className="text-xs text-slate-500">Coordinate shared meals, tickets, accommodation, and utility bills.</p>
              </div>
              <button
                onClick={() => setShowAddGroupModal(true)}
                className="px-3.5 py-1.5 bg-emerald-100 hover:bg-emerald-200 text-emerald-800 rounded-xl text-xs font-bold transition flex items-center gap-1"
              >
                <Plus className="w-3.5 h-3.5" /> Create Circle
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {groups.map((grp) => (
                <div
                  key={grp.id}
                  className="bg-white border border-emerald-100 rounded-3xl overflow-hidden shadow-sm hover:shadow-md transition space-y-4 flex flex-col justify-between"
                >
                  <div className="h-40 relative overflow-hidden">
                    <img src={grp.banner} alt={grp.name} className="w-full h-full object-cover" />
                    <div className="absolute top-3 right-3 bg-white/90 backdrop-blur px-3 py-1 rounded-full text-xs font-bold text-emerald-800 border border-emerald-200">
                      ${grp.totalSpent} Total Spent
                    </div>
                  </div>

                  <div className="px-6 space-y-3">
                    <div className="flex items-center justify-between">
                      <h3 className="text-lg font-bold text-slate-900">{grp.name}</h3>
                      <span className="text-[10px] uppercase font-bold bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded">
                        {grp.category}
                      </span>
                    </div>

                    {/* Member Avatars */}
                    <div className="space-y-1">
                      <span className="text-[11px] font-bold text-slate-400 block">Circle Members:</span>
                      <div className="flex items-center gap-2">
                        {grp.members.map((m) => (
                          <div key={m.id} className="flex items-center gap-1.5 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-100 text-xs font-bold text-emerald-900">
                            <img src={m.avatar} alt={m.name} className="w-5 h-5 rounded-full object-cover" />
                            <span>{m.name}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="p-6 pt-0">
                    <button
                      onClick={() => {
                        setExpenseForm({ ...expenseForm, groupId: grp.id });
                        setShowAddExpenseModal(true);
                      }}
                      className="w-full py-2.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 rounded-2xl text-xs font-bold transition flex items-center justify-center gap-1"
                    >
                      <Plus className="w-3.5 h-3.5" /> Split a New Bill Here
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* VIEW 2: EXPENSE LEDGER */}
        {activeTab === 'activity' && (
          <div className="bg-white border border-emerald-100 rounded-3xl p-6 shadow-sm space-y-4">
            <h3 className="font-bold text-base text-slate-900">Comprehensive Expense Transaction Log</h3>
            <div className="divide-y divide-emerald-50">
              {expenses.map((exp) => (
                <div key={exp.id} className="py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="space-y-1">
                    <span className="text-[10px] uppercase font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded">
                      {exp.category}
                    </span>
                    <h4 className="font-bold text-slate-900 text-base">{exp.title}</h4>
                    <p className="text-xs text-slate-500">Paid by <strong>{exp.paidBy}</strong> • {exp.date} • {exp.splitType}</p>
                  </div>
                  <div className="text-right">
                    <span className="text-xl font-bold text-slate-900">${exp.amount}</span>
                    <span className="text-[10px] text-slate-400 block">Total Receipt</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* VIEW 3: DEBT SIMPLIFICATION */}
        {activeTab === 'simplify' && (
          <div className="max-w-2xl mx-auto space-y-6">
            <div className="bg-white border border-emerald-100 rounded-3xl p-6 shadow-sm space-y-4">
              <div className="space-y-1">
                <span className="text-xs font-bold text-emerald-600 uppercase tracking-wider">Algorithmic Minimization</span>
                <h3 className="font-bold text-xl text-slate-900">Optimal "Who Owes Whom" Settlements</h3>
                <p className="text-xs text-slate-500">
                  Reduced net balances across all multi-party purchases into the minimum possible number of wire transfers.
                </p>
              </div>

              <div className="space-y-3 pt-2">
                {simplifiedDebts.map((debt, idx) => (
                  <div key={idx} className="p-4 bg-emerald-50/60 border border-emerald-100 rounded-2xl flex items-center justify-between gap-4">
                    <div className="flex items-center gap-3 text-xs font-bold text-slate-800">
                      <span className="text-slate-900">{debt.from}</span>
                      <ArrowRight className="w-4 h-4 text-emerald-600" />
                      <span className="text-slate-900">{debt.to}</span>
                    </div>

                    <div className="flex items-center gap-3">
                      <span className="text-base font-extrabold text-emerald-700">${debt.amount}</span>
                      {debt.status === 'Pending' ? (
                        <button
                          onClick={() => settleDebt(idx)}
                          className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition"
                        >
                          Settle Up
                        </button>
                      ) : (
                        <span className="text-xs font-bold text-emerald-700 bg-emerald-100 px-2 py-1 rounded-lg">
                          {debt.status}
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </main>

      {/* ADD EXPENSE MODAL */}
      {showAddExpenseModal && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 max-w-md w-full shadow-2xl border border-emerald-100 space-y-4">
            <div className="flex items-center justify-between border-b border-emerald-50 pb-3">
              <h3 className="font-bold text-base text-slate-900">Record Shared Expense</h3>
              <button onClick={() => setShowAddExpenseModal(false)} className="text-slate-400">✕</button>
            </div>
            <form onSubmit={handleCreateExpense} className="space-y-3 text-xs">
              <div className="space-y-1">
                <label className="font-bold text-slate-700">Expense Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Izakaya Dinner with Sake"
                  value={expenseForm.title}
                  onChange={(e) => setExpenseForm({ ...expenseForm, title: e.target.value })}
                  className="w-full p-2.5 bg-emerald-50/50 border border-emerald-100 rounded-xl"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-bold text-slate-700">Amount ($ USD)</label>
                  <input
                    type="number"
                    required
                    value={expenseForm.amount}
                    onChange={(e) => setExpenseForm({ ...expenseForm, amount: e.target.value })}
                    className="w-full p-2.5 bg-emerald-50/50 border border-emerald-100 rounded-xl font-bold"
                  />
                </div>
                <div className="space-y-1">
                  <label className="font-bold text-slate-700">Circle / Group</label>
                  <select
                    value={expenseForm.groupId}
                    onChange={(e) => setExpenseForm({ ...expenseForm, groupId: e.target.value })}
                    className="w-full p-2.5 bg-emerald-50/50 border border-emerald-100 rounded-xl"
                  >
                    {groups.map((g) => (
                      <option key={g.id} value={g.id}>{g.name}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-bold text-slate-700">Category</label>
                  <select
                    value={expenseForm.category}
                    onChange={(e) => setExpenseForm({ ...expenseForm, category: e.target.value })}
                    className="w-full p-2.5 bg-emerald-50/50 border border-emerald-100 rounded-xl"
                  >
                    <option>Dining</option>
                    <option>Transport</option>
                    <option>Accommodation</option>
                    <option>Utilities</option>
                    <option>Groceries</option>
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="font-bold text-slate-700">Split Rule</label>
                  <select
                    value={expenseForm.splitType}
                    onChange={(e) => setExpenseForm({ ...expenseForm, splitType: e.target.value })}
                    className="w-full p-2.5 bg-emerald-50/50 border border-emerald-100 rounded-xl"
                  >
                    <option>Equal Split</option>
                    <option>By Percentage (50/50)</option>
                    <option>Exact Custom Amounts</option>
                  </select>
                </div>
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddExpenseModal(false)}
                  className="w-1/2 py-2.5 bg-slate-100 text-slate-700 rounded-xl font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="w-1/2 py-2.5 bg-emerald-600 text-white rounded-xl font-bold shadow-md shadow-emerald-600/20"
                >
                  Save & Split
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* CREATE GROUP MODAL */}
      {showAddGroupModal && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 max-w-md w-full shadow-2xl border border-emerald-100 space-y-4">
            <div className="flex items-center justify-between border-b border-emerald-50 pb-3">
              <h3 className="font-bold text-base text-slate-900">Create New Circle</h3>
              <button onClick={() => setShowAddGroupModal(false)} className="text-slate-400">✕</button>
            </div>
            <form onSubmit={handleCreateGroup} className="space-y-3 text-xs">
              <div className="space-y-1">
                <label className="font-bold text-slate-700">Group Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Barcelona Summer Villa"
                  value={groupForm.name}
                  onChange={(e) => setGroupForm({ ...groupForm, name: e.target.value })}
                  className="w-full p-2.5 bg-emerald-50/50 border border-emerald-100 rounded-xl"
                />
              </div>
              <div className="space-y-1">
                <label className="font-bold text-slate-700">Category</label>
                <select
                  value={groupForm.category}
                  onChange={(e) => setGroupForm({ ...groupForm, category: e.target.value })}
                  className="w-full p-2.5 bg-emerald-50/50 border border-emerald-100 rounded-xl"
                >
                  <option>Trip</option>
                  <option>Home & Utilities</option>
                  <option>Event & Party</option>
                  <option>Project Team</option>
                </select>
              </div>
              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddGroupModal(false)}
                  className="w-1/2 py-2.5 bg-slate-100 text-slate-700 rounded-xl font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="w-1/2 py-2.5 bg-emerald-600 text-white rounded-xl font-bold"
                >
                  Create Circle
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Footer */}
      <footer className="border-t border-emerald-100 bg-white py-6 text-center text-xs text-emerald-700 font-bold">
        © 2026 SPLITMINT • ZERO-FEE CRYPTO & FIAT EXPENSE SIMPLIFICATION ENGINE
      </footer>
    </div>
  );
}
