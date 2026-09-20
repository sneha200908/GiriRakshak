import React from 'react';
import { TrendingUp, TrendingDown, Minus, ShieldCheck, AlertTriangle } from 'lucide-react';
import { RiskLevel } from '../types';
import { useTheme } from '../context/ThemeContext';

interface RiskGaugeProps {
  score: number; // 0 - 100
  confidence?: number; // 0 - 100
  trend?: 'INCREASING' | 'STABLE' | 'DECREASING';
  thresholds?: {
    lowMax: number;
    mediumMax: number;
    highMin: number;
  };
  size?: 'sm' | 'md' | 'lg';
  showDetails?: boolean;
}

export const RiskGauge: React.FC<RiskGaugeProps> = ({
  score,
  confidence = 88,
  trend = 'STABLE',
  thresholds = { lowMax: 30, mediumMax: 60, highMin: 61 },
  size = 'md',
  showDetails = true
}) => {
  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme === 'dark';

  // Determine Level and Colors
  let level: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  let color = isDark ? '#10b981' : '#15803d'; // green
  let glowColor = isDark ? 'rgba(16, 185, 129, 0.3)' : 'rgba(21, 128, 61, 0.15)';
  let badgeBg = isDark 
    ? 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30' 
    : 'bg-emerald-100 text-emerald-800 border-emerald-300 font-bold';

  if (score > 80) {
    level = 'CRITICAL';
    color = isDark ? '#ef4444' : '#b91c1c'; // red
    glowColor = isDark ? 'rgba(239, 68, 68, 0.4)' : 'rgba(185, 28, 28, 0.15)';
    badgeBg = isDark 
      ? 'bg-red-500/20 text-red-300 border-red-500/40' 
      : 'bg-red-100 text-red-800 border-red-300 font-bold';
  } else if (score >= thresholds.highMin) {
    level = 'HIGH';
    color = isDark ? '#f97316' : '#c2410c'; // orange
    glowColor = isDark ? 'rgba(249, 115, 22, 0.35)' : 'rgba(194, 65, 12, 0.15)';
    badgeBg = isDark 
      ? 'bg-orange-500/15 text-orange-300 border-orange-500/30' 
      : 'bg-orange-100 text-orange-800 border-orange-300 font-bold';
  } else if (score > thresholds.lowMax) {
    level = 'MEDIUM';
    color = isDark ? '#eab308' : '#b45309'; // yellow/amber
    glowColor = isDark ? 'rgba(234, 179, 8, 0.3)' : 'rgba(180, 83, 9, 0.15)';
    badgeBg = isDark 
      ? 'bg-amber-500/15 text-amber-300 border-amber-500/30' 
      : 'bg-amber-100 text-amber-800 border-amber-300 font-bold';
  } else {
    level = 'LOW';
    color = isDark ? '#10b981' : '#15803d'; // green
    glowColor = isDark ? 'rgba(16, 185, 129, 0.3)' : 'rgba(21, 128, 61, 0.15)';
    badgeBg = isDark 
      ? 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30' 
      : 'bg-emerald-100 text-emerald-800 border-emerald-300 font-bold';
  }

  // Dimensions based on size
  const radius = size === 'sm' ? 36 : size === 'lg' ? 70 : 54;
  const strokeWidth = size === 'sm' ? 7 : size === 'lg' ? 12 : 9;
  const viewBoxSize = (radius + strokeWidth) * 2;
  const center = viewBoxSize / 2;
  
  // Semicircle arc (180 degrees from -180 to 0)
  const circumference = Math.PI * radius;
  const strokeDashoffset = circumference - (score / 100) * circumference;

  const trackStroke = isDark ? '#1e293b' : '#e2e8f0';

  return (
    <div className="flex flex-col items-center justify-center text-center select-none">
      <div className="relative flex items-center justify-center">
        <svg
          width={viewBoxSize}
          height={viewBoxSize * 0.65}
          viewBox={`0 0 ${viewBoxSize} ${viewBoxSize * 0.65}`}
          className="overflow-visible"
        >
          {/* Background track arc */}
          <path
            d={`M ${center - radius} ${center} A ${radius} ${radius} 0 0 1 ${center + radius} ${center}`}
            fill="none"
            stroke={trackStroke}
            strokeWidth={strokeWidth}
            strokeLinecap="round"
          />

          {/* Active progress arc with glow */}
          <path
            d={`M ${center - radius} ${center} A ${radius} ${radius} 0 0 1 ${center + radius} ${center}`}
            fill="none"
            stroke={color}
            strokeWidth={strokeWidth}
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            style={{
              transition: 'stroke-dashoffset 1s ease-out, stroke 0.5s ease',
              filter: `drop-shadow(0 0 8px ${glowColor})`
            }}
          />
        </svg>

        {/* Center Score Numbers */}
        <div className="absolute top-[32%] flex flex-col items-center">
          <div className="flex items-baseline gap-0.5">
            <span 
              className={`font-black font-mono tracking-tight ${
                size === 'sm' ? 'text-2xl' : size === 'lg' ? 'text-4xl' : 'text-3xl'
              }`}
              style={{ color }}
            >
              {score}
            </span>
            <span className="text-xs font-mono text-slate-600 dark:text-slate-500 font-bold">/100</span>
          </div>

          <span className={`px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-wider border mt-0.5 ${badgeBg}`}>
            {level} RISK
          </span>
        </div>
      </div>

      {showDetails && (
        <div className="flex items-center justify-center gap-3 text-xs text-slate-600 dark:text-slate-400 mt-2 font-mono">
          <div className="flex items-center gap-1" title="Estimated AI Model Confidence">
            <ShieldCheck className="w-3.5 h-3.5 text-cyan-600 dark:text-cyan-400" />
            <span>Conf: <strong className="text-slate-900 dark:text-slate-200">{confidence}%</strong></span>
          </div>

          <span className="text-slate-300 dark:text-slate-700">|</span>

          <div className="flex items-center gap-1">
            {trend === 'INCREASING' && (
              <span className="text-red-700 dark:text-red-400 flex items-center gap-0.5">
                <TrendingUp className="w-3.5 h-3.5" />
                <span className="text-[11px] font-semibold">Risk Rising</span>
              </span>
            )}
            {trend === 'DECREASING' && (
              <span className="text-emerald-700 dark:text-emerald-400 flex items-center gap-0.5">
                <TrendingDown className="w-3.5 h-3.5" />
                <span className="text-[11px] font-semibold">Risk Falling</span>
              </span>
            )}
            {trend === 'STABLE' && (
              <span className="text-slate-700 dark:text-slate-400 flex items-center gap-0.5">
                <Minus className="w-3.5 h-3.5" />
                <span className="text-[11px] font-semibold">Stable Trend</span>
              </span>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
