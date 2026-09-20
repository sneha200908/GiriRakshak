import React, { useState } from 'react';
import { 
  X, 
  ShieldAlert, 
  AlertTriangle, 
  MapPin, 
  Droplets, 
  Mountain, 
  Cpu, 
  TrendingUp, 
  Layers, 
  Radio, 
  History, 
  ExternalLink, 
  CheckCircle2, 
  Truck, 
  Sparkles,
  Database,
  ArrowRight,
  Activity,
  FileText
} from 'lucide-react';
import { EarlyWarningAlert, LocationZone } from '../../types';
import { DataQualityBadge } from '../SourceProvenanceModal';
import { AlertInvestigationWorkflow } from '../AlertInvestigationWorkflow';

interface AlertDetailDrawerProps {
  alert: EarlyWarningAlert | null;
  zone?: LocationZone | null;
  onClose: () => void;
  onAnalyzeWithAI: (alert: EarlyWarningAlert) => void;
  onDispatchAction?: (alert: EarlyWarningAlert) => void;
  onOpenSourceModal: (sourceKey: string) => void;
  onNavigateToLayer?: (layerKey: 'rainfall' | 'infrastructure' | 'historicalLandslides') => void;
  onFocusCoordinates?: (lat: number, lng: number) => void;
}

export const AlertDetailDrawer: React.FC<AlertDetailDrawerProps> = ({
  alert,
  zone,
  onClose,
  onAnalyzeWithAI,
  onDispatchAction,
  onOpenSourceModal,
  onNavigateToLayer,
  onFocusCoordinates
}) => {
  const [activeTab, setActiveTab] = useState<'workflow' | 'quick'>('workflow');

  if (!alert) return null;

  const isCritical = alert.alertState === 'Critical' || alert.riskLevel === 'HIGH';
  const isWarning = alert.alertState === 'Warning' || alert.riskLevel === 'MEDIUM';

  const badgeBg = isCritical 
    ? 'bg-red-500 text-white' 
    : isWarning 
    ? 'bg-amber-500 text-slate-950' 
    : 'bg-emerald-500 text-slate-950';

  return (
    <div className="absolute top-0 right-0 z-40 w-full sm:w-[480px] h-full bg-[#081124] dark:bg-[#081124] border-l border-slate-700/80 shadow-2xl flex flex-col animate-in slide-in-from-right duration-200 text-xs">
      
      {/* Top Mode Selector Header */}
      <div className="p-2.5 bg-slate-950 border-b border-slate-800 flex items-center justify-between">
        <div className="flex items-center gap-1.5 p-1 rounded-xl bg-slate-900 border border-slate-800">
          <button
            onClick={() => setActiveTab('workflow')}
            className={`px-3 py-1 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
              activeTab === 'workflow'
                ? 'bg-cyan-500 text-slate-950 shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Activity className="w-3.5 h-3.5" />
            <span>Interactive Workflow</span>
          </button>
          
          <button
            onClick={() => setActiveTab('quick')}
            className={`px-3 py-1 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
              activeTab === 'quick'
                ? 'bg-cyan-500 text-slate-950 shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <FileText className="w-3.5 h-3.5" />
            <span>Quick Summary</span>
          </button>
        </div>

        <button
          onClick={onClose}
          className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors"
          title="Close Panel"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Render Active View */}
      {activeTab === 'workflow' ? (
        <AlertInvestigationWorkflow
          alert={alert}
          zone={zone}
          initialStep={2}
          onClose={onClose}
          onNavigateToLayer={onNavigateToLayer}
          onFocusCoordinates={onFocusCoordinates}
          onOpenAIAssistant={(prompt) => {
            onAnalyzeWithAI(alert);
          }}
        />
      ) : (
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Drawer Header */}
          <div className="p-4 bg-slate-950/90 border-b border-slate-800 flex items-start justify-between">
            <div>
              <div className="flex items-center gap-2 flex-wrap mb-1">
                <span className={`px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-wider ${badgeBg}`}>
                  {alert.alertState.toUpperCase()} ALERT
                </span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-800 text-cyan-300 border border-slate-700">
                  Score: {alert.riskScore}/100
                </span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-cyan-950 text-cyan-300 border border-cyan-800">
                  Source: {alert.source || 'GiriRakshak Risk Model'}
                </span>
              </div>
              <h2 className="text-base font-bold text-white leading-tight">
                {alert.location}
              </h2>
              <p className="text-slate-400 text-xs mt-0.5">
                {alert.district}, {alert.state} • {alert.timestamp}
              </p>
            </div>
          </div>

          {/* Drawer Scrollable Body */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 no-scrollbar">
            {/* Quick Action to Workflow */}
            <div className="p-3 rounded-xl bg-gradient-to-r from-cyan-950/40 to-blue-950/40 border border-cyan-500/40 flex items-center justify-between">
              <div>
                <span className="font-bold text-cyan-300 block text-xs">Run Decision Support Workflow</span>
                <span className="text-[11px] text-slate-300">View evidence, causal chain & situation report</span>
              </div>
              <button
                onClick={() => setActiveTab('workflow')}
                className="px-3 py-1.5 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs flex items-center gap-1 shadow-md transition-colors"
              >
                <span>Start</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Why Triggered Box */}
            <div className="p-3 rounded-xl bg-red-950/20 border border-red-800/40 space-y-1.5">
              <div className="flex items-center gap-1.5 text-red-300 font-bold text-[11px] uppercase tracking-wider">
                <AlertTriangle className="w-3.5 h-3.5 text-red-400" />
                <span>Why This Alert Was Triggered</span>
              </div>
              <p className="text-slate-200 leading-relaxed text-xs">
                {alert.trigger}
              </p>
            </div>

            {/* AI Geotechnical Analysis */}
            <div className="p-3.5 rounded-xl bg-[#0a1b38] border border-cyan-500/30 space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5 text-cyan-400 font-bold">
                  <Cpu className="w-4 h-4" />
                  <span>AI Hazard Analysis</span>
                </div>
                <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-cyan-950 text-cyan-300 border border-cyan-800">
                  Confidence: {alert.aiConfidence}%
                </span>
              </div>
              <p className="text-slate-200 text-xs leading-relaxed font-medium">
                {zone?.aiPrediction || 'Factor of Safety critically reduced due to sustained antecedent monsoon precipitation and high pore water pressures exceeding resisting shear strength along interface.'}
              </p>
              <button
                onClick={() => onAnalyzeWithAI(alert)}
                className="w-full py-2 rounded-lg bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-300 border border-cyan-500/40 font-semibold flex items-center justify-center gap-1.5 transition-colors"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>Deep Dive with AI Co-Pilot</span>
              </button>
            </div>

            {/* Environmental Triggers Matrix */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-bold uppercase tracking-wider text-slate-400 text-[11px]">
                  Environmental Conditions
                </span>
                <DataQualityBadge type="OBSERVED" size="sm" />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div className="p-2.5 rounded-xl bg-slate-900/80 border border-slate-800">
                  <span className="text-[10px] text-slate-400 block flex items-center gap-1">
                    <Droplets className="w-3 h-3 text-cyan-400" /> IMD Rainfall Rate
                  </span>
                  <span className="text-xs font-bold text-slate-100 mt-0.5 block">
                    {alert.environmentalTriggers.rainfallRate}
                  </span>
                </div>

                <div className="p-2.5 rounded-xl bg-slate-900/80 border border-slate-800">
                  <span className="text-[10px] text-slate-400 block flex items-center gap-1">
                    <Radio className="w-3 h-3 text-purple-400" /> SMAP Soil Saturation
                  </span>
                  <span className="text-xs font-bold text-slate-100 mt-0.5 block">
                    {alert.environmentalTriggers.soilSaturation}
                  </span>
                </div>

                <div className="p-2.5 rounded-xl bg-slate-900/80 border border-slate-800">
                  <span className="text-[10px] text-slate-400 block flex items-center gap-1">
                    <Mountain className="w-3 h-3 text-emerald-400" /> InSAR GPS Velocity
                  </span>
                  <span className="text-xs font-bold text-slate-100 mt-0.5 block">
                    {alert.environmentalTriggers.slopeDisplacement}
                  </span>
                </div>

                <div className="p-2.5 rounded-xl bg-slate-900/80 border border-slate-800">
                  <span className="text-[10px] text-slate-400 block flex items-center gap-1">
                    <TrendingUp className="w-3 h-3 text-amber-400" /> Shear Stress Ratio
                  </span>
                  <span className="text-xs font-bold text-slate-100 mt-0.5 block">
                    {alert.environmentalTriggers.shearStressRatio}
                  </span>
                </div>
              </div>
            </div>

            {/* Infrastructure Exposure */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-bold uppercase tracking-wider text-slate-400 text-[11px]">
                  Critical Infrastructure Exposed
                </span>
                <span className="text-[10px] font-mono text-amber-400">
                  {alert.criticalInfrastructure.length} Assets
                </span>
              </div>
              <div className="space-y-1.5">
                {alert.criticalInfrastructure.map((infra, idx) => (
                  <div key={idx} className="p-2 rounded-xl bg-slate-900/70 border border-slate-800 flex items-center justify-between">
                    <span className="font-semibold text-slate-200">{infra}</span>
                    <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-amber-950 text-amber-300 border border-amber-800">
                      Priority Route
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Recommended Actions */}
            <div className="space-y-2">
              <span className="font-bold uppercase tracking-wider text-slate-400 text-[11px]">
                Recommended SOP Actions
              </span>
              <div className="space-y-1.5">
                {alert.recommendedActions.map((action, idx) => (
                  <div key={idx} className="flex items-start gap-2 p-2 rounded-xl bg-slate-900/60 border border-slate-800 text-slate-200">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0 mt-0.5" />
                    <span className="leading-snug">{action}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Multilingual Dissemination Preview */}
            <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800 space-y-1.5">
              <span className="font-bold uppercase tracking-wider text-slate-400 text-[10px]">
                Multilingual Warning Dissemination (CAP-India)
              </span>
              <div className="text-slate-300 text-xs italic">
                "{alert.multilingualAlert.en}"
              </div>
              <div className="text-slate-400 text-[11px]">
                Hindi: "{alert.multilingualAlert.hi}"
              </div>
            </div>
          </div>

          {/* Drawer Action Bar */}
          <div className="p-3.5 bg-slate-950 border-t border-slate-800 flex items-center gap-2">
            <button
              onClick={() => setActiveTab('workflow')}
              className="flex-1 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold flex items-center justify-center gap-1.5 transition-colors"
            >
              <Activity className="w-3.5 h-3.5" />
              <span>Full Investigation Workflow</span>
            </button>

            <button
              onClick={() => onOpenSourceModal('GSI')}
              className="px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 flex items-center gap-1"
              title="Inspect Data Source Provenance"
            >
              <Database className="w-3.5 h-3.5 text-cyan-400" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
