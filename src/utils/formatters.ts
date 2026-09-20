import { RiskLevel, AlertState } from '../types';

export function getRiskColor(level: RiskLevel): {
  badgeBg: string;
  badgeText: string;
  badgeBorder: string;
  dotColor: string;
  hex: string;
  bgSubtle: string;
} {
  switch (level) {
    case 'HIGH':
      return {
        badgeBg: 'bg-red-100 dark:bg-red-500/15',
        badgeText: 'text-red-700 dark:text-red-400 font-bold',
        badgeBorder: 'border-red-300 dark:border-red-500/30',
        dotColor: 'bg-red-600 dark:bg-red-500',
        hex: '#ef4444',
        bgSubtle: 'bg-red-50 dark:bg-red-950/30'
      };
    case 'MEDIUM':
      return {
        badgeBg: 'bg-amber-100 dark:bg-amber-500/15',
        badgeText: 'text-amber-800 dark:text-amber-300 font-bold',
        badgeBorder: 'border-amber-300 dark:border-amber-500/30',
        dotColor: 'bg-amber-600 dark:bg-amber-500',
        hex: '#f59e0b',
        bgSubtle: 'bg-amber-50 dark:bg-amber-950/30'
      };
    case 'LOW':
    default:
      return {
        badgeBg: 'bg-emerald-100 dark:bg-emerald-500/15',
        badgeText: 'text-emerald-800 dark:text-emerald-400 font-bold',
        badgeBorder: 'border-emerald-300 dark:border-emerald-500/30',
        dotColor: 'bg-emerald-600 dark:bg-emerald-500',
        hex: '#10b981',
        bgSubtle: 'bg-emerald-50 dark:bg-emerald-950/30'
      };
  }
}

export function getAlertStateBadge(state: AlertState): {
  bg: string;
  text: string;
  border: string;
} {
  switch (state) {
    case 'Critical':
      return { bg: 'bg-red-600 text-white shadow-sm', text: 'text-white', border: 'border-red-600' };
    case 'Warning':
      return { bg: 'bg-amber-100 dark:bg-amber-500/20 text-amber-900 dark:text-amber-300 border border-amber-300 dark:border-amber-500/40 font-bold', text: 'text-amber-900 dark:text-amber-300', border: 'border-amber-300 dark:border-amber-500/40' };
    case 'Watch':
      return { bg: 'bg-sky-100 dark:bg-blue-500/20 text-sky-900 dark:text-blue-300 border border-sky-300 dark:border-blue-500/40 font-bold', text: 'text-sky-900 dark:text-blue-300', border: 'border-sky-300 dark:border-blue-500/40' };
    case 'Monitoring':
    default:
      return { bg: 'bg-slate-100 dark:bg-slate-700/50 text-slate-800 dark:text-slate-300 border border-slate-300 dark:border-slate-600 font-medium', text: 'text-slate-800 dark:text-slate-300', border: 'border-slate-300 dark:border-slate-600' };
  }
}
