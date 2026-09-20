import React from 'react';
import { 
  ShieldAlert, 
  Sparkles, 
  CheckCircle2, 
  X, 
  ArrowRight,
  Database,
  Radio,
  Layers
} from 'lucide-react';

interface DemoModeModalProps {
  isOpen: boolean;
  onEnterDemo: () => void;
  onClose: () => void;
}

export const DemoModeModal: React.FC<DemoModeModalProps> = ({
  isOpen,
  onEnterDemo,
  onClose
}) => {
  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200"
      role="dialog"
      aria-modal="true"
      aria-labelledby="demo-modal-title"
    >
      <div 
        className="relative w-full max-w-lg rounded-2xl bg-[var(--bg-surface)] border border-[var(--border-app)] shadow-2xl overflow-hidden p-6 sm:p-7 space-y-5"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button Top Right */}
        <button
          onClick={onClose}
          id="demo-modal-close-btn"
          className="absolute top-4 right-4 p-1.5 rounded-lg text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:bg-[var(--border-subtle)] transition-colors"
          title="Close dialog"
          aria-label="Close dialog"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="space-y-1.5 pr-8">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-700 dark:text-amber-400 font-mono text-xs font-bold">
            <span className="w-2 h-2 rounded-full bg-amber-500 animate-ping" />
            <span>OPERATIONAL DEMO ENVIRONMENT</span>
          </div>

          <h2 
            id="demo-modal-title"
            className="text-2xl font-black tracking-tight text-[var(--text-primary)] uppercase font-sans"
          >
            DEMO MODE
          </h2>

          <p className="text-sm font-semibold text-cyan-600 dark:text-cyan-400">
            Simulated Data Environment
          </p>
        </div>

        {/* Primary Explanation Notice */}
        <div className="p-4 rounded-xl bg-[var(--bg-surface-secondary)] border border-[var(--border-app)] text-xs sm:text-sm text-[var(--text-secondary)] leading-relaxed space-y-2.5">
          <p className="font-normal">
            This session is running with <strong>simulated demonstration data</strong>. The platform interface, map engine, decision-support workflows, and early warning disseminations are fully functional, but displayed environmental, alert, infrastructure and risk values are not live operational measurements.
          </p>
        </div>

        {/* Active Simulation Features */}
        <div className="space-y-2 text-xs">
          <div className="text-[11px] font-bold uppercase tracking-wider text-[var(--text-muted)] font-mono">
            Included Demonstration Assets
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[var(--text-secondary)]">
            <div className="flex items-center gap-2 p-2 rounded-lg bg-[var(--bg-surface-secondary)] border border-[var(--border-subtle)]">
              <Radio className="w-4 h-4 text-cyan-500 flex-shrink-0" />
              <span>4 Northeast Warning Alerts</span>
            </div>
            <div className="flex items-center gap-2 p-2 rounded-lg bg-[var(--bg-surface-secondary)] border border-[var(--border-subtle)]">
              <Layers className="w-4 h-4 text-amber-500 flex-shrink-0" />
              <span>Lifeline NH-6 Infrastructure</span>
            </div>
            <div className="flex items-center gap-2 p-2 rounded-lg bg-[var(--bg-surface-secondary)] border border-[var(--border-subtle)]">
              <Database className="w-4 h-4 text-emerald-500 flex-shrink-0" />
              <span>Physics-Informed XAI Model</span>
            </div>
            <div className="flex items-center gap-2 p-2 rounded-lg bg-[var(--bg-surface-secondary)] border border-[var(--border-subtle)]">
              <Sparkles className="w-4 h-4 text-purple-500 flex-shrink-0" />
              <span>Scenario Cloudburst Engine</span>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row items-center justify-end gap-2.5 pt-3 border-t border-[var(--border-subtle)]">
          <button
            id="demo-modal-continue-btn"
            onClick={onClose}
            className="w-full sm:w-auto px-4 py-2.5 rounded-xl border border-[var(--border-app)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--border-subtle)] text-xs font-semibold transition-colors"
          >
            CONTINUE / CLOSE
          </button>

          <button
            id="demo-modal-enter-btn"
            onClick={onEnterDemo}
            className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold text-xs shadow-md shadow-amber-500/20 transition-all transform hover:scale-[1.02] active:scale-[0.98]"
          >
            <span>ENTER DEMO</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
