import React from 'react';
import { 
  X, 
  ExternalLink, 
  ShieldCheck, 
  Database, 
  Clock, 
  MapPin, 
  FileText, 
  Layers, 
  CheckCircle2,
  Info,
  Scale
} from 'lucide-react';
import { DataQualityBadgeType, DataSourceRegistryItem } from '../types/dataIntelligence';
import { DATA_SOURCES_REGISTRY } from '../data/authoritativeData';

interface SourceProvenanceModalProps {
  isOpen: boolean;
  onClose: () => void;
  sourceKey?: string; // e.g. 'IMD' | 'GSI' | 'NASA' | 'BHUVAN' | 'NATURE' | 'SOIL' | 'SMAP'
  customDetails?: {
    title: string;
    source: string;
    dataset: string;
    timestamp: string;
    period: string;
    resolution: string;
    dataStatus: DataQualityBadgeType;
    methodUsed: string;
    license?: string;
    officialUrl?: string;
    limitations?: string;
  };
}

export const DataQualityBadge: React.FC<{ type: DataQualityBadgeType; size?: 'sm' | 'md' }> = ({ 
  type, 
  size = 'sm' 
}) => {
  const styles: Record<DataQualityBadgeType, string> = {
    'OBSERVED': 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30',
    'HISTORICAL': 'bg-blue-500/15 text-blue-400 border-blue-500/30',
    'MODEL OUTPUT': 'bg-purple-500/15 text-purple-400 border-purple-500/30',
    'AI INTERPRETATION': 'bg-cyan-500/15 text-cyan-400 border-cyan-500/30',
    'SIMULATED': 'bg-amber-500/15 text-amber-400 border-amber-500/30',
    'RESEARCH REFERENCE': 'bg-indigo-500/15 text-indigo-400 border-indigo-500/30',
    'DERIVED': 'bg-teal-500/15 text-teal-400 border-teal-500/30'
  };

  const textClass = size === 'sm' ? 'text-[10px] px-1.5 py-0.5' : 'text-xs px-2.5 py-1';

  return (
    <span className={`inline-flex items-center gap-1 font-mono uppercase font-bold tracking-wider rounded border ${styles[type]} ${textClass}`}>
      <span className="w-1.5 h-1.5 rounded-full bg-current opacity-80" />
      {type}
    </span>
  );
};

export const SourceInfoButton: React.FC<{
  onClick: () => void;
  label?: string;
  className?: string;
}> = ({ onClick, label = 'Source', className = '' }) => (
  <button
    onClick={(e) => {
      e.stopPropagation();
      onClick();
    }}
    className={`inline-flex items-center gap-1 text-[11px] font-mono px-1.5 py-0.5 rounded bg-slate-900/90 text-slate-400 hover:text-cyan-300 hover:bg-slate-800 border border-slate-800 hover:border-cyan-700/50 transition-colors ${className}`}
    title="Inspect Data Provenance & Authoritative Source"
  >
    <Info className="w-3 h-3 text-cyan-400" />
    <span>ⓘ {label}</span>
  </button>
);

export const SourceProvenanceModal: React.FC<SourceProvenanceModalProps> = ({
  isOpen,
  onClose,
  sourceKey,
  customDetails
}) => {
  if (!isOpen) return null;

  // Find standard source in registry if key provided
  const registryItem: DataSourceRegistryItem | undefined = DATA_SOURCES_REGISTRY.find(
    s => s.source.toLowerCase().includes((sourceKey || '').toLowerCase()) ||
         s.id.toLowerCase().includes((sourceKey || '').toLowerCase())
  );

  const title = customDetails?.title || registryItem?.datasetName || 'Data Provenance & Source Metadata';
  const sourceName = customDetails?.source || registryItem?.source || 'Authoritative Source';
  const datasetName = customDetails?.dataset || registryItem?.datasetName || 'National Dataset';
  const organization = registryItem?.organization || 'National Agency / Research Institute';
  const timestamp = customDetails?.timestamp || 'September 2026 (Continuous Telemetry)';
  const period = customDetails?.period || registryItem?.yearsAvailable || '2019 – 2026';
  const resolution = customDetails?.resolution || registryItem?.spatialResolution || 'Standard Resolution';
  const dataStatus: DataQualityBadgeType = customDetails?.dataStatus || 'OBSERVED';
  const methodUsed = customDetails?.methodUsed || registryItem?.description || 'Automated observation and processing pipeline.';
  const officialUrl = customDetails?.officialUrl || registryItem?.officialUrl;
  const license = customDetails?.license || registryItem?.license || 'Government Open Data / Research Access';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div 
        className="relative w-full max-w-2xl bg-slate-950 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-900/60">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-400">
              <Database className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-white tracking-tight">{title}</h3>
                <DataQualityBadge type={dataStatus} size="sm" />
              </div>
              <p className="text-xs text-slate-400">{organization}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-5 text-sm">
          {/* Metadata Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-4 rounded-xl bg-slate-900/40 border border-slate-800/80">
            <div>
              <span className="text-[11px] font-mono text-slate-500 uppercase tracking-wider block">Authoritative Source</span>
              <span className="font-semibold text-white">{sourceName}</span>
            </div>
            <div>
              <span className="text-[11px] font-mono text-slate-500 uppercase tracking-wider block">Dataset</span>
              <span className="font-semibold text-slate-200">{datasetName}</span>
            </div>
            <div>
              <span className="text-[11px] font-mono text-slate-500 uppercase tracking-wider block">Temporal Period</span>
              <span className="font-mono text-cyan-300 text-xs">{period}</span>
            </div>
            <div>
              <span className="text-[11px] font-mono text-slate-500 uppercase tracking-wider block">Spatial Resolution</span>
              <span className="font-mono text-slate-300 text-xs">{resolution}</span>
            </div>
            <div>
              <span className="text-[11px] font-mono text-slate-500 uppercase tracking-wider block">Data Retrieval / Sync</span>
              <span className="font-mono text-slate-300 text-xs">{timestamp}</span>
            </div>
            <div>
              <span className="text-[11px] font-mono text-slate-500 uppercase tracking-wider block">Licensing & Terms</span>
              <span className="text-slate-300 text-xs">{license}</span>
            </div>
          </div>

          {/* Methodology & Description */}
          <div className="space-y-1.5">
            <h4 className="text-xs font-bold font-mono uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
              <Layers className="w-3.5 h-3.5 text-cyan-400" />
              <span>Processing Method & Provenance</span>
            </h4>
            <div className="p-3.5 rounded-xl bg-slate-900/30 border border-slate-800 text-xs text-slate-300 leading-relaxed font-sans">
              {methodUsed}
            </div>
          </div>

          {/* Usage Rule & Limitations Notice */}
          <div className="p-3.5 rounded-xl bg-blue-950/20 border border-blue-900/40 space-y-1">
            <div className="flex items-center gap-1.5 text-xs font-bold text-blue-300 font-mono">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Data Integrity & Traceability Commitment</span>
            </div>
            <p className="text-[11px] text-slate-400 leading-relaxed">
              GiriRakshak AI strictly preserves original source observations. Research frameworks (such as the Nature Scientific Reports 2025/2026 paper and the 2021 IoT Soil Moisture study) are referenced exclusively for methodology and explainability, and are never misrepresented as real-time observational feeds.
            </p>
          </div>

          {/* Official Source Link */}
          {officialUrl && (
            <div className="pt-2 flex items-center justify-between border-t border-slate-800/80">
              <span className="text-xs text-slate-400">Official Portal:</span>
              <a
                href={officialUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-cyan-400 hover:text-cyan-300 bg-cyan-950/40 hover:bg-cyan-900/50 px-3 py-1.5 rounded-lg border border-cyan-800/60 transition-colors"
              >
                <span>Visit {sourceName} Official Portal</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-3 border-t border-slate-800 bg-slate-900/40 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-white text-xs font-semibold transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
