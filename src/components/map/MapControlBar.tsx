import React from 'react';
import { 
  Layers, 
  Droplets, 
  Mountain, 
  AlertTriangle, 
  History, 
  Radio, 
  Search, 
  Maximize2, 
  Minimize2, 
  Columns, 
  Bot, 
  Clock, 
  Crosshair, 
  Sliders,
  RotateCcw,
  Sparkles
} from 'lucide-react';
import { MapMode } from '../../types';
import { useTheme } from '../../context/ThemeContext';

interface MapControlBarProps {
  activeMode: MapMode;
  onModeChange: (mode: MapMode) => void;
  onToggleLayerDrawer: () => void;
  onToggleEventStream: () => void;
  showEventStream: boolean;
  onToggleCompare: () => void;
  isCompareActive: boolean;
  onOpenAskAI: () => void;
  isFullscreen: boolean;
  onToggleFullscreen: () => void;
  onResetView: () => void;
  onQuickFocus: () => void;
}

export const MapControlBar: React.FC<MapControlBarProps> = ({
  activeMode,
  onModeChange,
  onToggleLayerDrawer,
  onToggleEventStream,
  showEventStream,
  onToggleCompare,
  isCompareActive,
  onOpenAskAI,
  isFullscreen,
  onToggleFullscreen,
  onResetView,
  onQuickFocus
}) => {
  const { resolvedTheme } = useTheme();

  return (
    <div className="flex items-center gap-1.5 p-1.5 rounded-xl bg-slate-900/90 dark:bg-slate-900/95 border border-slate-700/80 shadow-xl backdrop-blur-md text-xs select-none">
      {/* 3 Map Modes Selector */}
      <div className="flex items-center bg-slate-950/80 p-0.5 rounded-lg border border-slate-800 text-[11px] font-semibold">
        <button
          onClick={() => onModeChange('LIVE')}
          className={`px-2.5 py-1 rounded-md flex items-center gap-1.5 transition-all ${
            activeMode === 'LIVE'
              ? 'bg-emerald-500 text-slate-950 font-bold shadow-sm'
              : 'text-slate-400 hover:text-white'
          }`}
          title="Live connected telemetry and near-real-time sensor feeds"
        >
          <span className={`w-2 h-2 rounded-full ${activeMode === 'LIVE' ? 'bg-slate-950 animate-ping' : 'bg-emerald-500'}`} />
          <span>LIVE</span>
        </button>

        <button
          onClick={() => onModeChange('HISTORICAL')}
          className={`px-2.5 py-1 rounded-md flex items-center gap-1.5 transition-all ${
            activeMode === 'HISTORICAL'
              ? 'bg-amber-500 text-slate-950 font-bold shadow-sm'
              : 'text-slate-400 hover:text-white'
          }`}
          title="Historical GSI landslide events and past monsoon datasets (2019-2026)"
        >
          <History className="w-3 h-3" />
          <span>HISTORICAL</span>
        </button>

        <button
          onClick={() => onModeChange('SIMULATION')}
          className={`px-2.5 py-1 rounded-md flex items-center gap-1.5 transition-all ${
            activeMode === 'SIMULATION'
              ? 'bg-purple-500 text-white font-bold shadow-sm'
              : 'text-slate-400 hover:text-white'
          }`}
          title="Scenario simulation mode for geotechnical stress testing"
        >
          <Sliders className="w-3 h-3" />
          <span>SIMULATION</span>
        </button>
      </div>

      <div className="h-4 w-px bg-slate-700/60 mx-0.5" />

      {/* Layers Toggle Button */}
      <button
        onClick={onToggleLayerDrawer}
        className="px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 flex items-center gap-1.5 font-medium transition-colors"
        title="Toggle GIS Map Layers & Source Attribution"
      >
        <Layers className="w-3.5 h-3.5 text-cyan-400" />
        <span className="hidden sm:inline">Layers</span>
      </button>

      {/* Live Event Stream Toggle */}
      <button
        onClick={onToggleEventStream}
        className={`px-2.5 py-1.5 rounded-lg border flex items-center gap-1.5 font-medium transition-colors ${
          showEventStream 
            ? 'bg-cyan-500/20 border-cyan-500/40 text-cyan-300' 
            : 'bg-slate-800 hover:bg-slate-700 text-slate-200 border-slate-700'
        }`}
        title="Toggle Real-Time Event Stream"
      >
        <Clock className="w-3.5 h-3.5 text-cyan-400" />
        <span className="hidden sm:inline">Event Feed</span>
      </button>

      {/* Compare Split Screen */}
      <button
        onClick={onToggleCompare}
        className={`px-2.5 py-1.5 rounded-lg border flex items-center gap-1.5 font-medium transition-colors ${
          isCompareActive 
            ? 'bg-amber-500/20 border-amber-500/40 text-amber-300' 
            : 'bg-slate-800 hover:bg-slate-700 text-slate-200 border-slate-700'
        }`}
        title="Compare Before vs Now (Historical Baseline vs Current Isohyet)"
      >
        <Columns className="w-3.5 h-3.5 text-amber-400" />
        <span className="hidden sm:inline">Compare</span>
      </button>

      {/* Ask AI About Map */}
      <button
        onClick={onOpenAskAI}
        className="px-2.5 py-1.5 rounded-lg bg-gradient-to-r from-cyan-600/30 to-indigo-600/30 hover:from-cyan-600/40 hover:to-indigo-600/40 border border-cyan-500/40 text-cyan-300 font-semibold flex items-center gap-1.5 shadow-sm transition-all active:scale-95"
        title="Ask GiriRakshak AI About Current Map View & Hazard Factors"
      >
        <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
        <span>Ask AI</span>
      </button>

      <div className="h-4 w-px bg-slate-700/60 mx-0.5" />

      {/* Reset Center */}
      <button
        onClick={onResetView}
        className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700 transition-colors"
        title="Reset Map Zoom & View"
      >
        <RotateCcw className="w-3.5 h-3.5" />
      </button>

      {/* Fullscreen Map */}
      <button
        onClick={onToggleFullscreen}
        className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700 transition-colors"
        title={isFullscreen ? 'Exit Fullscreen' : 'Expand Map to Fullscreen'}
      >
        {isFullscreen ? <Minimize2 className="w-3.5 h-3.5 text-cyan-400" /> : <Maximize2 className="w-3.5 h-3.5" />}
      </button>
    </div>
  );
};
