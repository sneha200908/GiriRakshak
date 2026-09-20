import React from 'react';
import { 
  Clock, 
  AlertTriangle, 
  TrendingUp, 
  Droplets, 
  MapPin, 
  Sparkles, 
  X, 
  ChevronRight,
  ShieldAlert,
  Info
} from 'lucide-react';
import { MapEventItem } from '../../types';

interface MapEventStreamProps {
  events: MapEventItem[];
  onSelectEventLocation: (zoneId?: string, locationName?: string) => void;
  onSummarizeEventsWithAI: () => void;
  onClose: () => void;
}

export const MapEventStream: React.FC<MapEventStreamProps> = ({
  events,
  onSelectEventLocation,
  onSummarizeEventsWithAI,
  onClose
}) => {
  return (
    <div className="absolute bottom-16 left-4 z-30 w-80 sm:w-96 max-h-[50vh] rounded-2xl bg-[#091326]/95 dark:bg-[#091326]/95 border border-slate-700/80 shadow-2xl backdrop-blur-md overflow-hidden flex flex-col animate-in fade-in slide-in-from-bottom-2 duration-150 text-xs">
      {/* Stream Header */}
      <div className="p-3 bg-slate-950/90 border-b border-slate-800 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
          <h4 className="font-bold text-white text-xs">Real-Time Event Stream</h4>
          <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-cyan-950 text-cyan-300 border border-cyan-800">
            {events.length} Live
          </span>
        </div>

        <div className="flex items-center gap-1">
          <button
            onClick={onSummarizeEventsWithAI}
            className="px-2 py-0.5 rounded bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-300 border border-cyan-500/40 text-[10px] font-semibold flex items-center gap-1 transition-colors"
            title="Summarize recent events with AI"
          >
            <Sparkles className="w-3 h-3" />
            <span>AI Summary</span>
          </button>

          <button
            onClick={onClose}
            className="p-1 rounded text-slate-400 hover:text-white"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Events List */}
      <div className="flex-1 overflow-y-auto p-2 space-y-1.5 no-scrollbar">
        {events.map((evt) => {
          const isCritical = evt.severity === 'CRITICAL';
          const isWarning = evt.severity === 'WARNING';
          const isWatch = evt.severity === 'WATCH';

          const dotColor = isCritical 
            ? 'bg-red-500' 
            : isWarning 
            ? 'bg-amber-500' 
            : isWatch 
            ? 'bg-yellow-500' 
            : 'bg-cyan-500';

          return (
            <div
              key={evt.id}
              onClick={() => onSelectEventLocation(evt.zoneId, evt.location)}
              className="p-2 rounded-xl bg-slate-900/70 hover:bg-slate-800/80 border border-slate-800 hover:border-slate-700 cursor-pointer transition-all group"
            >
              <div className="flex items-center justify-between text-[10px] font-mono text-slate-400 mb-1">
                <div className="flex items-center gap-1.5">
                  <span className={`w-1.5 h-1.5 rounded-full ${dotColor}`} />
                  <span>{evt.timestamp}</span>
                </div>
                <span className="px-1.5 py-0.2 rounded bg-slate-800 text-slate-300">
                  {evt.source}
                </span>
              </div>

              <div className="flex items-start justify-between gap-2">
                <div>
                  <h5 className="font-semibold text-slate-200 group-hover:text-cyan-300 transition-colors">
                    {evt.title}
                  </h5>
                  <p className="text-[11px] text-slate-400 line-clamp-1 mt-0.5">
                    {evt.description}
                  </p>
                </div>
                <ChevronRight className="w-3.5 h-3.5 text-slate-500 group-hover:text-cyan-400 group-hover:translate-x-0.5 transition-all flex-shrink-0 mt-1" />
              </div>

              {evt.metricDelta && (
                <div className="mt-1.5 pt-1 border-t border-slate-800/60 flex items-center justify-between text-[10px]">
                  <span className="text-slate-500">{evt.district}, {evt.state}</span>
                  <span className="font-mono font-bold text-cyan-400">{evt.metricDelta}</span>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
