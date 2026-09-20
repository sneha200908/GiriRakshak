import React from 'react';
import { Play, Pause, RotateCcw, Clock, Calendar, AlertTriangle, ShieldCheck } from 'lucide-react';
import { useDisaster } from '../context/DisasterContext';

export const HistoricalPlayback: React.FC = () => {
  const { historicalPlayback } = useDisaster();
  const { isPlaying, currentIndex, dates, setIndex, togglePlay } = historicalPlayback;

  return (
    <div className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-xl space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-xl bg-slate-950 border border-slate-800 text-cyan-400">
            <Clock className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <span>Historical Monsoonal Playback</span>
              <span className="px-2 py-0.2 rounded-full text-[10px] font-mono font-bold bg-amber-500/10 text-amber-300 border border-amber-500/30">
                🟡 DEMO HISTORICAL DATA
              </span>
            </h3>
            <p className="text-[11px] text-slate-400">
              Scrub or auto-play through multi-day rainfall surges and observe real-time map, alert, and infrastructure response.
            </p>
          </div>
        </div>

        {/* Play / Pause Button */}
        <div className="flex items-center gap-2">
          <button
            id="hist-play-toggle-btn"
            onClick={togglePlay}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all shadow-md ${
              isPlaying
                ? 'bg-amber-500 hover:bg-amber-400 text-slate-950 shadow-amber-500/20'
                : 'bg-cyan-600 hover:bg-cyan-500 text-white shadow-cyan-600/20'
            }`}
          >
            {isPlaying ? (
              <>
                <Pause className="w-3.5 h-3.5 fill-current" />
                <span>Pause Replay</span>
              </>
            ) : (
              <>
                <Play className="w-3.5 h-3.5 fill-current" />
                <span>Play Timeline</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Timeline Scrubbing Bar */}
      <div className="space-y-3 pt-2">
        <div className="flex items-center justify-between text-xs font-mono text-slate-300">
          <span className="text-slate-400">Current Historical Slice:</span>
          <span className="font-bold text-cyan-300 px-2.5 py-0.5 rounded bg-slate-950 border border-slate-800">
            {dates[currentIndex]}
          </span>
        </div>

        <input
          id="hist-timeline-slider"
          type="range"
          min="0"
          max={dates.length - 1}
          value={currentIndex}
          onChange={(e) => setIndex(parseInt(e.target.value))}
          className="w-full h-2 bg-slate-950 rounded-lg appearance-none cursor-pointer accent-cyan-400 border border-slate-800"
        />

        {/* Step Markers */}
        <div className="grid grid-cols-5 gap-1 text-center">
          {dates.map((d, idx) => (
            <button
              key={idx}
              onClick={() => setIndex(idx)}
              className={`p-1.5 rounded-lg text-[10px] font-mono transition-colors text-left sm:text-center ${
                currentIndex === idx
                  ? 'bg-cyan-950 text-cyan-300 border border-cyan-700 font-bold'
                  : 'text-slate-500 hover:text-slate-300 hover:bg-slate-950'
              }`}
            >
              {d.split(' ')[0]} {d.split(' ')[1]}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
