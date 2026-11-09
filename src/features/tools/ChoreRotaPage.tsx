import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  CalendarCheck,
  CheckCircle2,
  Circle,
  Plus,
  RefreshCw,
  Sparkles,
  User,
  ArrowRightLeft,
  Calendar,
} from 'lucide-react';
import { useAppStore } from '../../store/useAppStore';
import { Button } from '../../components/ui/Button';
import { Modal } from '../../components/ui/Modal';
import { ChoreItem } from '../../types';

export const ChoreRotaPage: React.FC = () => {
  const { chores, toggleChore, addChore, addToast } = useAppStore();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [taskName, setTaskName] = useState('');
  const [assignedTo, setAssignedTo] = useState('Rishabh (You)');
  const [day, setDay] = useState<ChoreItem['day']>('Mon');

  const flatmates = ['Rishabh (You)', 'Kabir Mehta', 'Aarav Patel'];
  const days: ChoreItem['day'][] = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

  const completedCount = chores.filter((c) => c.completed).length;
  const progressPercent = Math.round((completedCount / Math.max(1, chores.length)) * 100);

  const handleCreate = () => {
    if (!taskName.trim()) return;
    addChore({
      task: taskName,
      assignedTo,
      day,
      completed: false,
    });
    setIsModalOpen(false);
    setTaskName('');
    addToast({
      type: 'success',
      title: 'Chore Added to Rota',
      description: `Assigned "${taskName}" to ${assignedTo} for ${day}.`,
    });
  };

  const handleShuffleRota = () => {
    // Rotate assignments
    const state = useAppStore.getState();
    const updated = state.chores.map((chore, idx) => {
      const nextPerson = flatmates[(idx + 1) % flatmates.length];
      return { ...chore, assignedTo: nextPerson, completed: false };
    });
    useAppStore.setState({ chores: updated });
    addToast({
      type: 'info',
      title: 'Weekly Rota Rotated!',
      description: 'Responsibilities swapped for the new week.',
    });
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8 pb-24 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-heading font-black tracking-tight text-white flex items-center gap-2">
            <CalendarCheck className="text-mint" size={24} />
            <span>Weekly Chore Rota</span>
          </h1>
          <p className="text-xs text-muted font-mono uppercase tracking-micro mt-0.5">
            Automated flatmate chore rotation • Tick off tasks, rotate weekly
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button variant="outline" size="md" onClick={handleShuffleRota} icon={<RefreshCw size={14} />}>
            Rotate Next Week
          </Button>
          <Button variant="primary" size="md" onClick={() => setIsModalOpen(true)} icon={<Plus size={16} />}>
            Add Chore
          </Button>
        </div>
      </div>

      {/* WEEKLY PROGRESS BAR */}
      <div className="p-5 rounded-3xl bg-surface border border-white/10 space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sparkles size={16} className="text-mint" />
            <h3 className="text-sm font-heading font-black text-white uppercase tracking-micro">
              THIS WEEK'S FLAT HYGIENE SCORE
            </h3>
          </div>
          <span className="font-mono text-xs text-mint font-bold">
            {completedCount} / {chores.length} TASKS DONE ({progressPercent}%)
          </span>
        </div>

        <div className="w-full h-2.5 rounded-full bg-white/10 overflow-hidden">
          <motion.div
            className="h-full bg-mint shadow-mint-glow"
            initial={{ width: 0 }}
            animate={{ width: `${progressPercent}%` }}
            transition={{ duration: 0.5 }}
          />
        </div>
      </div>

      {/* DAYS ROTA LIST */}
      <div className="space-y-3">
        {chores.map((chore) => {
          return (
            <motion.div
              key={chore.id}
              layout
              className={`p-4 rounded-2xl border transition-all flex items-center justify-between gap-4 ${
                chore.completed
                  ? 'border-white/5 bg-white/5 opacity-70'
                  : 'border-white/10 bg-surface hover:border-mint/40 shadow-sm'
              }`}
            >
              <div className="flex items-center gap-3.5">
                <button
                  onClick={() => toggleChore(chore.id)}
                  className={`w-7 h-7 rounded-full flex items-center justify-center transition-all ${
                    chore.completed
                      ? 'bg-mint text-bg font-bold shadow-mint-glow'
                      : 'border-2 border-white/20 hover:border-mint'
                  }`}
                >
                  {chore.completed && <CheckCircle2 size={18} strokeWidth={2.8} />}
                </button>

                <div>
                  <h4
                    className={`text-sm font-heading font-bold text-white ${
                      chore.completed ? 'line-through text-muted' : ''
                    }`}
                  >
                    {chore.task}
                  </h4>
                  <div className="flex items-center gap-2 mt-0.5 text-xs font-mono text-muted">
                    <span className="px-2 py-0.2 rounded bg-surface-2 border border-white/10 text-white font-bold">
                      {chore.day}
                    </span>
                    <span>Assigned to <strong className="text-white">{chore.assignedTo}</strong></span>
                  </div>
                </div>
              </div>

              {/* Swap assignee button */}
              <button
                onClick={() => {
                  const currIdx = flatmates.indexOf(chore.assignedTo);
                  const nextPerson = flatmates[(currIdx + 1) % flatmates.length];
                  const state = useAppStore.getState();
                  const updated = state.chores.map((c) =>
                    c.id === chore.id ? { ...c, assignedTo: nextPerson } : c
                  );
                  useAppStore.setState({ chores: updated });
                }}
                className="text-[11px] font-mono text-muted hover:text-white px-2.5 py-1 rounded-lg border border-white/10 bg-surface-2 flex items-center gap-1.5 shrink-0"
                title="Swap assignee"
              >
                <ArrowRightLeft size={12} />
                <span className="hidden sm:inline">Swap</span>
              </button>
            </motion.div>
          );
        })}
      </div>

      {/* Add Chore Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Add Chore to Weekly Rota"
        subtitle="Keep shared responsibilities crystal clear."
      >
        <div className="space-y-4">
          <div>
            <label className="text-xs font-mono text-muted uppercase block mb-1">Task Name</label>
            <input
              type="text"
              placeholder="E.g. Clean kitchen counters, take out trash, deep clean fridge"
              value={taskName}
              onChange={(e) => setTaskName(e.target.value)}
              className="w-full p-3 rounded-xl bg-surface-2 border border-white/15 text-white text-xs outline-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-mono text-muted uppercase block mb-1">Day of Week</label>
              <select
                value={day}
                onChange={(e) => setDay(e.target.value as any)}
                className="w-full p-3 rounded-xl bg-surface-2 border border-white/15 text-white text-xs outline-none"
              >
                {days.map((d) => (
                  <option key={d} value={d}>
                    {d}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="text-xs font-mono text-muted uppercase block mb-1">Assigned Person</label>
              <select
                value={assignedTo}
                onChange={(e) => setAssignedTo(e.target.value)}
                className="w-full p-3 rounded-xl bg-surface-2 border border-white/15 text-white text-xs outline-none"
              >
                {flatmates.map((f) => (
                  <option key={f} value={f}>
                    {f}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="pt-2">
            <Button variant="primary" size="lg" fullWidth onClick={handleCreate}>
              Save Chore
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

