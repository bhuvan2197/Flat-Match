import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2, AlertTriangle, Info, X } from 'lucide-react';
import { useAppStore } from '../../store/useAppStore';

export const ToastContainer: React.FC = () => {
  const { toasts, removeToast } = useAppStore();

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-2.5 max-w-sm w-full pointer-events-none px-4 sm:px-0">
      <AnimatePresence>
        {toasts.map((toast) => {
          const icon =
            toast.type === 'success' ? (
              <CheckCircle2 className="text-mint shrink-0" size={20} />
            ) : toast.type === 'warning' ? (
              <AlertTriangle className="text-yellow shrink-0" size={20} />
            ) : (
              <Info className="text-blue shrink-0" size={20} />
            );

          const borderClass =
            toast.type === 'success'
              ? 'border-mint/50 bg-surface-2'
              : toast.type === 'warning'
              ? 'border-yellow/50 bg-surface-2'
              : 'border-blue/50 bg-surface-2';

          return (
            <motion.div
              key={toast.id}
              initial={{ opacity: 0, y: 20, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 10, scale: 0.9 }}
              transition={{ type: 'spring', stiffness: 350, damping: 25 }}
              className={`pointer-events-auto flex items-start gap-3 p-4 rounded-2xl border shadow-xl ${borderClass} text-white`}
            >
              {icon}
              <div className="flex-1 min-w-0">
                <p className="text-xs font-heading font-black tracking-tight">{toast.title}</p>
                {toast.description && (
                  <p className="text-[11px] text-muted mt-0.5 leading-snug">
                    {toast.description}
                  </p>
                )}
              </div>
              <button
                onClick={() => removeToast(toast.id)}
                className="text-muted hover:text-white transition-colors p-0.5"
              >
                <X size={14} />
              </button>
            </motion.div>
          );
        })}
      </AnimatePresence>
    </div>
  );
};

