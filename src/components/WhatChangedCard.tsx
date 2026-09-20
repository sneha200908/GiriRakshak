import React from 'react';
import { TrendingUp, TrendingDown, Activity, Droplets, Radio, Compass, AlertCircle } from 'lucide-react';
import { WhatChangedData } from '../types';

interface WhatChangedCardProps {
  data: WhatChangedData;
  onOpenAssessment?: () => void;
}

export const WhatChangedCard: React.FC<WhatChangedCardProps> = ({ data, onOpenAssessment }) => {
  const isRising = data.scoreDelta > 0;
  const isFalling = data.scoreDelta < 0;

  return (
    <div className={`p-5 rounded-2xl border transition-all shadow-sm ${
      isRising 
        ? 'bg-gradient-to-br from-red-50/80 via-white to-red-50/40 dark:from-red-950/30 dark:via-slate-900 dark:to-slate-900 border-red-300 dark:border-red-500/40' 
        : isFalling 
        ? 'bg-gradient-to-br from-emerald-50/80 via-white to-emerald-50/40 dark:from-emerald-950/30 dark:via-slate-900 dark:to-slate-900 border-emerald-300 dark:border-emerald-500/40' 
        : 'bg-white dark:bg-slate-900/90 border-slate-200 dark:border-slate-800'
    }`}>
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <span className={`p-1.5 rounded-lg ${
            isRising 
              ? 'bg-red-100 text-red-700 dark:bg-red-500/20 dark:text-red-400' 
              : isFalling 
              ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-400' 
              : 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-400'
          }`}>
            <Activity className="w-4 h-4" />
          </span>
          <div>
            <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
              <span>What Changed?</span>
              <span className="text-[10px] font-mono px-2 py-0.2 rounded bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-medium">
                vs Previous Period
              </span>
            </h3>
          </div>
        </div>

        <span className="text-[11px] font-mono text-slate-500 dark:text-slate-400 font-medium">
          {data.timestamp}
        </span>
      </div>

      {/* Main Stat Delta Banner */}
      <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-slate-950/80 border border-slate-200 dark:border-slate-800/80 mb-3 shadow-xs">
        <div className="flex items-center gap-2">
          {isRising ? (
            <div className="flex items-center gap-1 text-red-700 dark:text-red-400 font-black font-mono text-xl">
              <TrendingUp className="w-5 h-5" />
              <span>+{data.scoreDelta}</span>
            </div>
          ) : isFalling ? (
            <div className="flex items-center gap-1 text-emerald-700 dark:text-emerald-400 font-black font-mono text-xl">
              <TrendingDown className="w-5 h-5" />
              <span>{data.scoreDelta}</span>
            </div>
          ) : (
            <div className="text-slate-700 dark:text-slate-400 font-bold font-mono text-lg">
              0 (No Delta)
            </div>
          )}
          <span className="text-xs font-bold text-slate-800 dark:text-slate-300">Hazard Score Delta</span>
        </div>

        <div className="text-right text-xs font-mono text-slate-600 dark:text-slate-400">
          <span>{data.previousScore}</span> → <strong className={`font-black ${isRising ? 'text-red-700 dark:text-red-400' : isFalling ? 'text-emerald-700 dark:text-emerald-400' : 'text-slate-900 dark:text-white'}`}>{data.currentScore}</strong> / 100
        </div>
      </div>

      {/* Contributing Parameter Percentage Bars */}
      <div className="grid grid-cols-3 gap-2 text-xs mb-3">
        <div className="p-2 rounded-lg bg-white dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800/80 text-center shadow-xs">
          <div className="flex items-center justify-center gap-1 text-[11px] text-slate-600 dark:text-slate-400 font-medium">
            <Droplets className="w-3 h-3 text-cyan-600 dark:text-cyan-400" />
            <span>Rainfall</span>
          </div>
          <div className={`text-xs font-black font-mono mt-0.5 ${data.rainfallDeltaPct > 0 ? 'text-red-700 dark:text-red-400' : data.rainfallDeltaPct < 0 ? 'text-emerald-700 dark:text-emerald-400' : 'text-slate-800 dark:text-slate-300'}`}>
            {data.rainfallDeltaPct > 0 ? `+${data.rainfallDeltaPct}%` : `${data.rainfallDeltaPct}%`}
          </div>
        </div>

        <div className="p-2 rounded-lg bg-white dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800/80 text-center shadow-xs">
          <div className="flex items-center justify-center gap-1 text-[11px] text-slate-600 dark:text-slate-400 font-medium">
            <Radio className="w-3 h-3 text-amber-600 dark:text-amber-400" />
            <span>Soil Moisture</span>
          </div>
          <div className={`text-xs font-black font-mono mt-0.5 ${data.moistureDeltaPct > 0 ? 'text-red-700 dark:text-red-400' : data.moistureDeltaPct < 0 ? 'text-emerald-700 dark:text-emerald-400' : 'text-slate-800 dark:text-slate-300'}`}>
            {data.moistureDeltaPct > 0 ? `+${data.moistureDeltaPct}%` : `${data.moistureDeltaPct}%`}
          </div>
        </div>

        <div className="p-2 rounded-lg bg-white dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800/80 text-center shadow-xs">
          <div className="flex items-center justify-center gap-1 text-[11px] text-slate-600 dark:text-slate-400 font-medium">
            <Compass className="w-3 h-3 text-purple-600 dark:text-purple-400" />
            <span>Ground Slip</span>
          </div>
          <div className={`text-xs font-black font-mono mt-0.5 ${data.movementDeltaPct > 0 ? 'text-red-700 dark:text-red-400' : data.movementDeltaPct < 0 ? 'text-emerald-700 dark:text-emerald-400' : 'text-slate-800 dark:text-slate-300'}`}>
            {data.movementDeltaPct > 0 ? `+${data.movementDeltaPct}%` : `${data.movementDeltaPct}%`}
          </div>
        </div>
      </div>

      {/* AI Natural Language Summary */}
      <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-950/90 border border-slate-200 dark:border-slate-800 text-xs text-slate-700 dark:text-slate-300 leading-relaxed font-sans flex items-start gap-2 shadow-xs">
        <AlertCircle className="w-3.5 h-3.5 text-cyan-600 dark:text-cyan-400 flex-shrink-0 mt-0.5" />
        <p className="text-[11px] text-slate-700 dark:text-slate-300 font-medium">{data.summary}</p>
      </div>

      {onOpenAssessment && (
        <button
          onClick={onOpenAssessment}
          className="mt-3 w-full py-1.5 px-3 rounded-lg text-xs font-bold bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-cyan-800 dark:text-cyan-300 hover:text-cyan-900 dark:hover:text-white transition-colors text-center border border-slate-200 dark:border-slate-700"
        >
          View Full AI Feature Attribution (SHAP) →
        </button>
      )}
    </div>
  );
};
