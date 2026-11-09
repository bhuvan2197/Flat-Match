import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Calculator,
  Plus,
  CheckCircle2,
  Trash2,
  DollarSign,
  ArrowRight,
  Receipt,
  Users,
} from 'lucide-react';
import { useAppStore } from '../../store/useAppStore';
import { Button } from '../../components/ui/Button';
import { Modal } from '../../components/ui/Modal';
import { ExpenseItem } from '../../types';

export const ExpenseSplitterPage: React.FC = () => {
  const { expenses, addExpense, toggleSettleExpense, deleteExpense, addToast } = useAppStore();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [title, setTitle] = useState('');
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState<ExpenseItem['category']>('rent');
  const [paidBy, setPaidBy] = useState('Rishabh (You)');

  const flatmates = ['Rishabh (You)', 'Kabir Mehta', 'Aarav Patel'];

  const totalSpent = expenses.reduce((acc, curr) => acc + curr.amount, 0);
  const totalSettled = expenses
    .filter((e) => e.settled)
    .reduce((acc, curr) => acc + curr.amount, 0);
  const totalPending = totalSpent - totalSettled;

  // Simple balance ledger calculation
  // Each expense is split equally among 3 flatmates
  const balances: Record<string, number> = {
    'Rishabh (You)': 0,
    'Kabir Mehta': 0,
    'Aarav Patel': 0,
  };

  expenses.forEach((exp) => {
    if (!exp.settled) {
      const share = exp.amount / flatmates.length;
      balances[exp.paidBy] += exp.amount - share;
      flatmates.forEach((member) => {
        if (member !== exp.paidBy) {
          balances[member] -= share;
        }
      });
    }
  });

  const handleCreate = () => {
    if (!title || !amount || isNaN(Number(amount))) {
      addToast({
        type: 'warning',
        title: 'Invalid Input',
        description: 'Please provide a valid title and numeric amount.',
      });
      return;
    }

    addExpense({
      title,
      amount: Number(amount),
      category,
      paidBy,
      splitBetween: flatmates,
      date: new Date().toISOString().split('T')[0],
      settled: false,
    });

    setIsModalOpen(false);
    setTitle('');
    setAmount('');
    addToast({
      type: 'success',
      title: 'Expense Added',
      description: `Split ₹${Number(amount).toLocaleString('en-IN')} equally across flatmates.`,
    });
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8 pb-24 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-heading font-black tracking-tight text-white flex items-center gap-2">
            <Calculator className="text-yellow" size={24} />
            <span>Rent & Expense Splitter</span>
          </h1>
          <p className="text-xs text-muted font-mono uppercase tracking-micro mt-0.5">
            Post-match flatmate ledger • Split rent, maid, WiFi, groceries with zero math drama
          </p>
        </div>

        <Button
          variant="primary"
          size="md"
          onClick={() => setIsModalOpen(true)}
          icon={<Plus size={16} />}
        >
          Add Expense
        </Button>
      </div>

      {/* STATS OVERVIEW */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div className="p-4 rounded-2xl bg-surface border border-white/10">
          <span className="text-[10px] font-mono text-muted uppercase">TOTAL FLAT EXPENSES</span>
          <p className="text-2xl font-heading font-black text-white mt-1">
            ₹{totalSpent.toLocaleString('en-IN')}
          </p>
        </div>
        <div className="p-4 rounded-2xl bg-surface border border-yellow/40">
          <span className="text-[10px] font-mono text-yellow uppercase">PENDING TO SETTLE</span>
          <p className="text-2xl font-heading font-black text-yellow mt-1">
            ₹{totalPending.toLocaleString('en-IN')}
          </p>
        </div>
        <div className="p-4 rounded-2xl bg-surface border border-mint/40">
          <span className="text-[10px] font-mono text-mint uppercase">ALREADY SETTLED</span>
          <p className="text-2xl font-heading font-black text-mint mt-1">
            ₹{totalSettled.toLocaleString('en-IN')}
          </p>
        </div>
      </div>

      {/* WHO OWES WHOM SUMMARY */}
      <div className="p-5 rounded-3xl bg-surface border border-white/10 space-y-3">
        <h3 className="text-sm font-heading font-black text-white uppercase tracking-micro flex items-center gap-2">
          <Users size={16} className="text-mint" />
          <span>WHO OWES WHOM (NET LEDGER BALANCE)</span>
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
          {Object.entries(balances).map(([person, bal]) => {
            const isOwed = bal > 0;
            const isSettled = Math.round(bal) === 0;

            return (
              <div
                key={person}
                className={`p-3.5 rounded-2xl border text-xs space-y-1 ${
                  isSettled
                    ? 'border-white/10 bg-surface-2'
                    : isOwed
                    ? 'border-mint/50 bg-mint/10'
                    : 'border-pink/50 bg-pink/10'
                }`}
              >
                <p className="font-heading font-bold text-white truncate">{person}</p>
                <p className="font-mono text-sm font-bold">
                  {isSettled ? (
                    <span className="text-muted">All settled up</span>
                  ) : isOwed ? (
                    <span className="text-mint">+₹{Math.round(bal).toLocaleString('en-IN')} to receive</span>
                  ) : (
                    <span className="text-pink">-₹{Math.round(Math.abs(bal)).toLocaleString('en-IN')} owes</span>
                  )}
                </p>
              </div>
            );
          })}
        </div>
      </div>

      {/* EXPENSE LEDGER TABLE */}
      <div className="p-5 rounded-3xl bg-surface border border-white/10 space-y-4 shadow-xl">
        <h3 className="text-sm font-heading font-black text-white uppercase tracking-micro">
          RECENT TRANSACTIONS & BILLS
        </h3>

        <div className="space-y-2.5">
          {expenses.map((exp) => (
            <div
              key={exp.id}
              className={`p-3.5 rounded-2xl border transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
                exp.settled ? 'border-white/5 bg-white/5 opacity-70' : 'border-white/10 bg-surface-2'
              }`}
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center shrink-0">
                  <Receipt size={18} className="text-yellow" />
                </div>
                <div>
                  <h4 className="text-sm font-heading font-bold text-white">{exp.title}</h4>
                  <p className="text-xs text-muted font-mono">
                    Paid by <strong className="text-white">{exp.paidBy}</strong> • {exp.date} • Split equally (3 ways)
                  </p>
                </div>
              </div>

              <div className="flex items-center justify-between sm:justify-end gap-3 pt-2 sm:pt-0 border-t sm:border-0 border-white/5">
                <div className="text-right">
                  <span className="text-sm font-heading font-black text-white block">
                    ₹{exp.amount.toLocaleString('en-IN')}
                  </span>
                  <span className="text-[10px] font-mono text-muted uppercase">
                    ₹{Math.round(exp.amount / 3).toLocaleString('en-IN')} / person
                  </span>
                </div>

                <button
                  onClick={() => toggleSettleExpense(exp.id)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-mono uppercase tracking-micro border transition-all ${
                    exp.settled
                      ? 'border-mint bg-mint text-bg font-bold'
                      : 'border-white/20 bg-surface text-muted hover:text-white'
                  }`}
                >
                  {exp.settled ? '✓ Settled' : 'Settle Up'}
                </button>

                <button
                  onClick={() => deleteExpense(exp.id)}
                  className="p-1.5 text-muted hover:text-pink transition-colors"
                >
                  <Trash2 size={15} />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Add Expense Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Add Shared Expense"
        subtitle="Will be automatically divided 3 ways among flatmates."
      >
        <div className="space-y-4">
          <div>
            <label className="text-xs font-mono text-muted uppercase block mb-1">Expense Title</label>
            <input
              type="text"
              placeholder="E.g. Electricity Bill, Groceries (Blinkit), Maid salary"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full p-3 rounded-xl bg-surface-2 border border-white/15 text-white text-xs outline-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-mono text-muted uppercase block mb-1">Amount (₹)</label>
              <input
                type="number"
                placeholder="2400"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="w-full p-3 rounded-xl bg-surface-2 border border-white/15 text-white text-xs outline-none font-mono"
              />
            </div>
            <div>
              <label className="text-xs font-mono text-muted uppercase block mb-1">Category</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as any)}
                className="w-full p-3 rounded-xl bg-surface-2 border border-white/15 text-white text-xs outline-none"
              >
                <option value="rent">Rent</option>
                <option value="electricity">Electricity</option>
                <option value="wifi">WiFi Internet</option>
                <option value="cook">Cook / Maid</option>
                <option value="groceries">Groceries & Pantry</option>
                <option value="other">Other</option>
              </select>
            </div>
          </div>

          <div>
            <label className="text-xs font-mono text-muted uppercase block mb-1">Paid By</label>
            <select
              value={paidBy}
              onChange={(e) => setPaidBy(e.target.value)}
              className="w-full p-3 rounded-xl bg-surface-2 border border-white/15 text-white text-xs outline-none"
            >
              {flatmates.map((f) => (
                <option key={f} value={f}>
                  {f}
                </option>
              ))}
            </select>
          </div>

          <div className="pt-2">
            <Button variant="primary" size="lg" fullWidth onClick={handleCreate}>
              Record & Split Expense
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

