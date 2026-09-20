import React, { useState } from 'react';
import { 
  ShieldAlert, 
  AlertTriangle, 
  Sparkles, 
  Cpu, 
  Layers, 
  Droplets, 
  Mountain, 
  Radio, 
  TrendingUp, 
  Clock, 
  ArrowRight, 
  ArrowLeft, 
  Download, 
  Share2, 
  FileText, 
  Printer, 
  Copy, 
  X, 
  CheckCircle2, 
  Eye, 
  Activity, 
  Database, 
  MapPin, 
  Truck, 
  Building2,
  ChevronRight,
  Send,
  AlertCircle
} from 'lucide-react';
import { EarlyWarningAlert, LocationZone, AlertState } from '../types';
import { useDisaster } from '../context/DisasterContext';
import { DataQualityBadge } from './SourceProvenanceModal';

interface AlertInvestigationWorkflowProps {
  alert: EarlyWarningAlert;
  zone?: LocationZone | null;
  initialStep?: number;
  onClose: () => void;
  onNavigateToLayer?: (layerKey: 'rainfall' | 'infrastructure' | 'historicalLandslides') => void;
  onFocusCoordinates?: (lat: number, lng: number) => void;
  onOpenAIAssistant?: (prompt: string) => void;
}

const WORKFLOW_STEPS = [
  { step: 1, id: 'detect', label: '1. Detect', short: 'Detect' },
  { step: 2, id: 'investigate', label: '2. Investigate', short: 'Investigate' },
  { step: 3, id: 'evidence', label: '3. Evidence', short: 'Evidence' },
  { step: 4, id: 'explain', label: '4. AI Explains', short: 'AI Explains' },
  { step: 5, id: 'exposure', label: '5. Exposure', short: 'Exposure' },
  { step: 6, id: 'rainfall', label: '6. Rainfall', short: 'Rainfall' },
  { step: 7, id: 'history', label: '7. History', short: 'History' },
  { step: 8, id: 'report', label: '8. Situation Report', short: 'Report' }
];

export const AlertInvestigationWorkflow: React.FC<AlertInvestigationWorkflowProps> = ({
  alert,
  zone,
  initialStep = 2,
  onClose,
  onNavigateToLayer,
  onFocusCoordinates,
  onOpenAIAssistant
}) => {
  const { 
    currentRole, 
    escalateAlert, 
    acknowledgeAlert, 
    resolveAlert, 
    reopenAlert,
    whatChanged 
  } = useDisaster();

  const [currentStep, setCurrentStep] = useState<number>(initialStep);
  const [escalateModalOpen, setEscalateModalOpen] = useState<boolean>(false);
  const [escalateTargetState, setEscalateTargetState] = useState<AlertState>('Critical');
  const [escalateReason, setEscalateReason] = useState<string>('Sustained cloudburst precipitation exceeding threshold with active shear displacement');
  const [resolveReason, setResolveReason] = useState<string>('Pore water pressures stabilized, weather clearing');
  const [resolveModalOpen, setResolveModalOpen] = useState<boolean>(false);
  const [copiedReport, setCopiedReport] = useState<boolean>(false);

  // Fallback values from zone if available
  const riskScore = alert.riskScore;
  const locationName = alert.location;
  const districtName = alert.district;
  const stateName = alert.state;
  const rainfall24h = zone?.rainfall24h || 184.6;
  const rainfall7d = zone?.rainfall7d || 412.0;
  const soilSaturation = zone?.soilMoisture || 89.4;
  const groundMovement = zone?.groundMovement || 4.8;
  const slopeAngle = zone?.slopeAngle || 42;
  const elevation = zone?.elevation || 1430;
  const historyCount = zone?.historyCount || 14;

  const isCritical = alert.alertState === 'Critical' || alert.riskLevel === 'HIGH';

  const handleNext = () => {
    if (currentStep < 8) {
      const next = currentStep + 1;
      setCurrentStep(next);

      // Trigger map side-effects based on target step
      if (next === 5 && onNavigateToLayer) {
        onNavigateToLayer('infrastructure');
      } else if (next === 6 && onNavigateToLayer) {
        onNavigateToLayer('rainfall');
      } else if (next === 7 && onNavigateToLayer) {
        onNavigateToLayer('historicalLandslides');
      }
    }
  };

  const handlePrev = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleCopyReport = () => {
    const text = `GIRIRAKSHAK AI - SITUATION REPORT\nAlert ID: ${alert.id}\nLocation: ${locationName} (${districtName}, ${stateName})\nRisk Score: ${riskScore}/100 [${alert.alertState.toUpperCase()}]\n24h Rainfall: ${rainfall24h} mm\nSoil Saturation: ${soilSaturation}%\nInSAR Displacement: ${groundMovement} mm/day\nTrigger: ${alert.trigger}\nAction: ${alert.recommendedActions[0] || 'Initiate tactical monitoring countermeasures'}.`;
    navigator.clipboard.writeText(text);
    setCopiedReport(true);
    setTimeout(() => setCopiedReport(false), 2500);
  };

  return (
    <div className="flex flex-col h-full bg-[#081124] text-slate-100 border-l border-slate-700/80 shadow-2xl animate-in slide-in-from-right duration-200">
      
      {/* 1. WORKFLOW STEPPER HEADER */}
      <div className="p-3.5 bg-slate-950 border-b border-slate-800 space-y-2.5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="p-1 rounded bg-cyan-500/20 text-cyan-400">
              <Activity className="w-4 h-4" />
            </span>
            <span className="text-xs font-black uppercase tracking-wider text-slate-200">
              Live Risk Response Workflow
            </span>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-900 text-slate-400 border border-slate-800">
              Step {currentStep} of 8
            </span>
            <button
              onClick={onClose}
              className="p-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors"
              title="Close Workflow"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Workflow Horizontal Stepper Bar */}
        <div className="flex items-center gap-1 overflow-x-auto pb-1 no-scrollbar text-[11px]">
          {WORKFLOW_STEPS.map((s) => {
            const isActive = currentStep === s.step;
            const isCompleted = currentStep > s.step;

            return (
              <button
                key={s.id}
                onClick={() => {
                  setCurrentStep(s.step);
                  if (s.step === 5 && onNavigateToLayer) onNavigateToLayer('infrastructure');
                  if (s.step === 6 && onNavigateToLayer) onNavigateToLayer('rainfall');
                  if (s.step === 7 && onNavigateToLayer) onNavigateToLayer('historicalLandslides');
                }}
                className={`flex items-center gap-1 px-2.5 py-1 rounded-lg whitespace-nowrap transition-all font-semibold ${
                  isActive 
                    ? 'bg-cyan-500 text-slate-950 shadow-md font-bold' 
                    : isCompleted 
                    ? 'bg-cyan-950/60 text-cyan-300 border border-cyan-800/40 hover:bg-cyan-900/50' 
                    : 'bg-slate-900/80 text-slate-400 border border-slate-800 hover:bg-slate-850 hover:text-slate-200'
                }`}
              >
                {isCompleted ? (
                  <CheckCircle2 className="w-3 h-3 text-cyan-300" />
                ) : (
                  <span className="text-[9px] opacity-75 font-mono">{s.step}</span>
                )}
                <span>{s.short}</span>
              </button>
            );
          })}
        </div>

        {/* Selected Event Context Bar */}
        <div className="p-2 rounded-xl bg-slate-900/90 border border-slate-800 flex items-center justify-between text-xs">
          <div className="flex items-center gap-2 truncate">
            <span className={`w-2.5 h-2.5 rounded-full ${isCritical ? 'bg-red-500 animate-pulse' : 'bg-amber-500'}`} />
            <div className="truncate">
              <span className="font-bold text-white block truncate">{locationName}</span>
              <span className="text-[10px] text-slate-400">{districtName}, {stateName} • Alert #{alert.id}</span>
            </div>
          </div>

          <div className="flex items-center gap-1.5 flex-shrink-0">
            <span className={`px-2 py-0.5 rounded text-[10px] font-black uppercase ${
              isCritical ? 'bg-red-500/20 text-red-400 border border-red-500/40' : 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
            }`}>
              {alert.alertState}
            </span>
            <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-cyan-950 text-cyan-300 border border-cyan-800">
              Score: {riskScore}/100
            </span>
          </div>
        </div>
      </div>

      {/* 2. WORKFLOW STEP BODY */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 no-scrollbar text-xs">

        {/* STEP 1 & 2: DETECT & INVESTIGATE */}
        {(currentStep === 1 || currentStep === 2) && (
          <div className="space-y-4 animate-in fade-in duration-200">
            
            {/* Detection Telemetry Banner */}
            <div className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800 space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-bold uppercase tracking-wider text-slate-400 text-[10px]">
                  Alert Metadata & Provenance
                </span>
                <DataQualityBadge type="OBSERVED" size="sm" />
              </div>

              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="p-2 rounded-lg bg-slate-950/60 border border-slate-800">
                  <span className="text-[10px] text-slate-400 block">Alert ID</span>
                  <span className="font-mono font-bold text-slate-200">{alert.id}</span>
                </div>
                <div className="p-2 rounded-lg bg-slate-950/60 border border-slate-800">
                  <span className="text-[10px] text-slate-400 block">Detection Time</span>
                  <span className="font-mono font-bold text-slate-200">{alert.timestamp}</span>
                </div>
                <div className="p-2 rounded-lg bg-slate-950/60 border border-slate-800">
                  <span className="text-[10px] text-slate-400 block">Coordinates</span>
                  <span className="font-mono font-bold text-cyan-300">
                    {zone?.coordinates.lat.toFixed(2)}°N, {zone?.coordinates.lng.toFixed(2)}°E
                  </span>
                </div>
                <div className="p-2 rounded-lg bg-slate-950/60 border border-slate-800">
                  <span className="text-[10px] text-slate-400 block">Data Source</span>
                  <span className="font-mono font-bold text-slate-200">IMD AWS + InSAR</span>
                </div>
              </div>
            </div>

            {/* Alert Lifecycle Progress */}
            <div className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800 space-y-2">
              <span className="font-bold uppercase tracking-wider text-slate-400 text-[10px] block">
                Lifecycle State Management
              </span>

              <div className="flex items-center justify-between p-2 rounded-lg bg-slate-950 border border-slate-800 text-[10px] font-mono">
                {['DETECTED', 'MONITORING', 'WATCH', 'WARNING', 'CRITICAL', 'RESOLVED'].map((stateName, idx) => {
                  const isCurrent = alert.status === 'Resolved' 
                    ? stateName === 'RESOLVED' 
                    : alert.alertState.toUpperCase() === stateName;
                  return (
                    <div key={idx} className="flex flex-col items-center gap-1 text-center">
                      <span className={`w-2.5 h-2.5 rounded-full ${
                        isCurrent 
                          ? 'bg-red-500 ring-2 ring-red-400 animate-pulse' 
                          : 'bg-slate-700'
                      }`} />
                      <span className={`${isCurrent ? 'text-white font-bold' : 'text-slate-500'}`}>
                        {stateName}
                      </span>
                    </div>
                  );
                })}
              </div>

              {/* Operational Action Buttons */}
              <div className="flex flex-wrap items-center gap-2 pt-1">
                {alert.status !== 'Under Review' && alert.status !== 'Resolved' && (
                  <button
                    onClick={() => acknowledgeAlert(alert.id)}
                    className="flex-1 py-1.5 px-3 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 font-semibold flex items-center justify-center gap-1 transition-colors"
                  >
                    <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400" />
                    <span>Acknowledge</span>
                  </button>
                )}

                <button
                  onClick={() => setEscalateModalOpen(true)}
                  className="flex-1 py-1.5 px-3 rounded-lg bg-red-500/20 hover:bg-red-500/30 text-red-300 border border-red-500/40 font-semibold flex items-center justify-center gap-1 transition-colors"
                >
                  <ShieldAlert className="w-3.5 h-3.5" />
                  <span>Escalate</span>
                </button>

                {alert.status !== 'Resolved' ? (
                  <button
                    onClick={() => setResolveModalOpen(true)}
                    className="py-1.5 px-3 rounded-lg bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 border border-emerald-500/40 font-semibold flex items-center gap-1 transition-colors"
                  >
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Resolve</span>
                  </button>
                ) : (
                  <button
                    onClick={() => reopenAlert(alert.id, 'New rainfall surge detected')}
                    className="py-1.5 px-3 rounded-lg bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/40 font-semibold flex items-center gap-1 transition-colors"
                  >
                    <span>Reopen</span>
                  </button>
                )}
              </div>
            </div>

            {/* Environmental Triggers Box */}
            <div className="p-3.5 rounded-xl bg-red-950/20 border border-red-500/30 space-y-1.5">
              <div className="flex items-center gap-1.5 text-red-300 font-bold text-[11px]">
                <AlertTriangle className="w-4 h-4 text-red-400" />
                <span>Active Environmental Triggers</span>
              </div>
              <p className="text-slate-200 leading-relaxed">
                {alert.trigger}
              </p>
            </div>

            {/* Next Step Action */}
            <button
              onClick={() => setCurrentStep(3)}
              className="w-full py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold flex items-center justify-center gap-2 shadow-lg shadow-cyan-950/50 transition-all text-xs"
            >
              <span>View Evidence & Contributing Factors</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* STEP 3: VIEW EVIDENCE */}
        {currentStep === 3 && (
          <div className="space-y-4 animate-in fade-in duration-200">
            
            {/* Why Did Risk Change Banner */}
            <div className="p-3.5 rounded-xl bg-[#0a162d] border border-cyan-500/30 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Activity className="w-4 h-4 text-cyan-400" />
                  <span className="font-bold text-white text-xs">Why Did Risk Change?</span>
                </div>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-300">
                  vs Previous 6h Window
                </span>
              </div>

              {/* Score Shift */}
              <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-950 border border-slate-800">
                <div className="flex items-center gap-2">
                  <div className="flex items-center text-red-400 font-black font-mono text-lg">
                    <TrendingUp className="w-4 h-4 mr-0.5" />
                    <span>+26</span>
                  </div>
                  <span className="text-xs text-slate-300 font-semibold">Risk Delta Escalation</span>
                </div>
                <div className="text-right text-xs font-mono text-slate-400">
                  <span>62</span> → <strong className="text-red-400 font-bold">{riskScore}</strong> / 100
                </div>
              </div>

              {/* Contributing Factor Contribution Bars */}
              <div className="space-y-2 pt-1">
                <span className="font-bold uppercase tracking-wider text-slate-400 text-[10px] block">
                  Contributing Parameter Contribution
                </span>

                <div className="space-y-2 text-xs">
                  <div>
                    <div className="flex justify-between text-slate-300 mb-1">
                      <span className="flex items-center gap-1">
                        <Droplets className="w-3 h-3 text-cyan-400" /> Rainfall Intensity
                      </span>
                      <span className="font-mono text-red-400 font-bold">HIGH (95%)</span>
                    </div>
                    <div className="h-2 rounded-full bg-slate-800 overflow-hidden">
                      <div className="h-full bg-gradient-to-r from-red-500 to-rose-400 w-[95%]" />
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between text-slate-300 mb-1">
                      <span className="flex items-center gap-1">
                        <Radio className="w-3 h-3 text-purple-400" /> Soil Pore Water Saturation
                      </span>
                      <span className="font-mono text-red-400 font-bold">HIGH (89%)</span>
                    </div>
                    <div className="h-2 rounded-full bg-slate-800 overflow-hidden">
                      <div className="h-full bg-gradient-to-r from-amber-500 to-red-500 w-[89%]" />
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between text-slate-300 mb-1">
                      <span className="flex items-center gap-1">
                        <Mountain className="w-3 h-3 text-emerald-400" /> Ground Creep Velocity
                      </span>
                      <span className="font-mono text-amber-400 font-bold">MODERATE (65%)</span>
                    </div>
                    <div className="h-2 rounded-full bg-slate-800 overflow-hidden">
                      <div className="h-full bg-gradient-to-r from-yellow-500 to-amber-500 w-[65%]" />
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between text-slate-300 mb-1">
                      <span className="flex items-center gap-1">
                        <TrendingUp className="w-3 h-3 text-blue-400" /> Terrain Incline Gradient (42°)
                      </span>
                      <span className="font-mono text-slate-300 font-bold">MODERATE (55%)</span>
                    </div>
                    <div className="h-2 rounded-full bg-slate-800 overflow-hidden">
                      <div className="h-full bg-cyan-600 w-[55%]" />
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between text-slate-300 mb-1">
                      <span className="flex items-center gap-1">
                        <Database className="w-3 h-3 text-indigo-400" /> Historical Landslide Frequency
                      </span>
                      <span className="font-mono text-amber-400 font-bold">HIGH (74%)</span>
                    </div>
                    <div className="h-2 rounded-full bg-slate-800 overflow-hidden">
                      <div className="h-full bg-indigo-500 w-[74%]" />
                    </div>
                  </div>
                </div>
              </div>

              {/* Threshold Comparison Matrix */}
              <div className="space-y-1.5 pt-2 border-t border-slate-800">
                <span className="font-bold uppercase tracking-wider text-slate-400 text-[10px] block">
                  Current Telemetry vs Critical Threshold
                </span>

                <div className="p-2 rounded-lg bg-slate-950 border border-slate-800 space-y-1 font-mono text-[11px]">
                  <div className="flex justify-between py-0.5 border-b border-slate-900">
                    <span className="text-slate-400">Rainfall (24h):</span>
                    <span><strong className="text-red-400">{rainfall24h} mm</strong> (Threshold: 75 mm)</span>
                  </div>
                  <div className="flex justify-between py-0.5 border-b border-slate-900">
                    <span className="text-slate-400">Soil Moisture:</span>
                    <span><strong className="text-red-400">{soilSaturation}%</strong> (Threshold: 70%)</span>
                  </div>
                  <div className="flex justify-between py-0.5">
                    <span className="text-slate-400">InSAR Surface Creep:</span>
                    <span><strong className="text-amber-400">{groundMovement} mm/d</strong> (Threshold: 1.5 mm/d)</span>
                  </div>
                </div>
              </div>

              {/* Causal Flow Diagram */}
              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
                <span className="font-bold uppercase tracking-wider text-slate-400 text-[10px] block">
                  Physical Landslide Trigger Chain
                </span>
                <div className="flex items-center justify-between text-center gap-1 font-mono text-[10px]">
                  <div className="p-1.5 rounded bg-blue-950 text-blue-300 border border-blue-800 flex-1">
                    🌧 Rain 185mm
                  </div>
                  <ChevronRight className="w-3 h-3 text-slate-500" />
                  <div className="p-1.5 rounded bg-amber-950 text-amber-300 border border-amber-800 flex-1">
                    💧 Moisture 89%
                  </div>
                  <ChevronRight className="w-3 h-3 text-slate-500" />
                  <div className="p-1.5 rounded bg-purple-950 text-purple-300 border border-purple-800 flex-1">
                    ⛰ Shear Stress 1.4
                  </div>
                  <ChevronRight className="w-3 h-3 text-slate-500" />
                  <div className="p-1.5 rounded bg-red-950 text-red-300 border border-red-800 flex-1">
                    🚨 Hazard Peak
                  </div>
                </div>
              </div>
            </div>

            {/* Next Step Action */}
            <div className="flex items-center gap-2">
              <button
                onClick={handlePrev}
                className="py-2.5 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold flex items-center gap-1 transition-colors text-xs"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Back</span>
              </button>

              <button
                onClick={() => setCurrentStep(4)}
                className="flex-1 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold flex items-center justify-center gap-2 shadow-lg shadow-cyan-950/50 transition-all text-xs"
              >
                <span>AI Explains Alert →</span>
              </button>
            </div>
          </div>
        )}

        {/* STEP 4: AI EXPLAINS ALERT */}
        {currentStep === 4 && (
          <div className="space-y-4 animate-in fade-in duration-200">
            <div className="p-4 rounded-2xl bg-gradient-to-br from-[#0a1b38] via-slate-900 to-slate-900 border border-cyan-500/40 space-y-3.5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-cyan-400 font-bold">
                  <Sparkles className="w-4 h-4" />
                  <span className="text-xs">GiriRakshak AI — Geotechnical Reasoning</span>
                </div>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-cyan-950 text-cyan-300 border border-cyan-800">
                  Confidence: {alert.aiConfidence}%
                </span>
              </div>

              {/* Executive Plain Language Assessment */}
              <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800 text-slate-200 leading-relaxed text-xs">
                {zone?.aiPrediction || 'Factor of Safety critically reduced to < 0.92 due to sustained cloudburst precipitation exceeding 180mm. Pore water pressure has overwhelmed resisting shear friction along the sandstone-shale lithological contact.'}
              </div>

              {/* Key Drivers */}
              <div className="space-y-1.5">
                <span className="font-bold uppercase tracking-wider text-slate-400 text-[10px] block">
                  Primary Risk Drivers
                </span>
                <div className="space-y-1 text-slate-300">
                  <div className="flex items-start gap-2 p-2 rounded-lg bg-slate-950/50 border border-slate-800/80">
                    <span className="w-4 h-4 rounded-full bg-red-500/20 text-red-400 flex items-center justify-center font-bold text-[10px] mt-0.5">1</span>
                    <span><strong>Heavy Rainfall Intensity:</strong> 184.6mm in 24h exceeds IMD threshold by 146%.</span>
                  </div>
                  <div className="flex items-start gap-2 p-2 rounded-lg bg-slate-950/50 border border-slate-800/80">
                    <span className="w-4 h-4 rounded-full bg-red-500/20 text-red-400 flex items-center justify-center font-bold text-[10px] mt-0.5">2</span>
                    <span><strong>Soil Pore Saturation:</strong> Moisture level at 89.4% has liquefied overburden matrix.</span>
                  </div>
                  <div className="flex items-start gap-2 p-2 rounded-lg bg-slate-950/50 border border-slate-800/80">
                    <span className="w-4 h-4 rounded-full bg-amber-500/20 text-amber-400 flex items-center justify-center font-bold text-[10px] mt-0.5">3</span>
                    <span><strong>Steep Incline Geometry:</strong> 42° slope with weak sandstone over fractured shale.</span>
                  </div>
                  <div className="flex items-start gap-2 p-2 rounded-lg bg-slate-950/50 border border-slate-800/80">
                    <span className="w-4 h-4 rounded-full bg-amber-500/20 text-amber-400 flex items-center justify-center font-bold text-[10px] mt-0.5">4</span>
                    <span><strong>Historical Slide Footprint:</strong> 14 verified GSI historical events in this corridor.</span>
                  </div>
                </div>
              </div>

              {/* What to Monitor */}
              <div className="space-y-1.5">
                <span className="font-bold uppercase tracking-wider text-slate-400 text-[10px] block">
                  Tactical Monitoring Priorities
                </span>
                <div className="p-2.5 rounded-xl bg-slate-950/80 border border-slate-800 space-y-1 text-slate-300">
                  <div className="flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 text-cyan-400" />
                    <span>Monitor next 6h Doppler rainfall rates (&gt;25 mm/h threshold).</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Activity className="w-3.5 h-3.5 text-purple-400" />
                    <span>Watch inclinometer GNSS displacement acceleration (&gt;5.0 mm/day).</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Truck className="w-3.5 h-3.5 text-amber-400" />
                    <span>Inspect State Highway 5 culvert drainage for toe washout.</span>
                  </div>
                </div>
              </div>

              {/* Authoritative Sources & Provenance Tags */}
              <div className="pt-2 border-t border-slate-800 space-y-1.5">
                <span className="font-bold uppercase tracking-wider text-slate-400 text-[10px] block">
                  Verified Data Sources & Provenance
                </span>
                <div className="flex flex-wrap gap-1.5">
                  <span className="px-2 py-0.5 rounded bg-blue-950 text-blue-300 border border-blue-800 text-[10px] font-mono">
                    [OBSERVED] IMD Doppler AWS
                  </span>
                  <span className="px-2 py-0.5 rounded bg-purple-950 text-purple-300 border border-purple-800 text-[10px] font-mono">
                    [OBSERVED] Sentinel-1 InSAR
                  </span>
                  <span className="px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-800 text-[10px] font-mono">
                    [MODEL] NASA SRTM 30m DEM
                  </span>
                  <span className="px-2 py-0.5 rounded bg-indigo-950 text-indigo-300 border border-indigo-800 text-[10px] font-mono">
                    [HISTORICAL] GSI Landslide Atlas
                  </span>
                </div>
              </div>
            </div>

            {/* Next Step Action */}
            <div className="flex items-center gap-2">
              <button
                onClick={handlePrev}
                className="py-2.5 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold flex items-center gap-1 transition-colors text-xs"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Back</span>
              </button>

              <button
                onClick={() => {
                  setCurrentStep(5);
                  if (onNavigateToLayer) onNavigateToLayer('infrastructure');
                }}
                className="flex-1 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold flex items-center justify-center gap-2 shadow-lg shadow-cyan-950/50 transition-all text-xs"
              >
                <span>Inspect Exposed Infrastructure →</span>
              </button>
            </div>
          </div>
        )}

        {/* STEP 5: INSPECT EXPOSED INFRASTRUCTURE */}
        {currentStep === 5 && (
          <div className="space-y-4 animate-in fade-in duration-200">
            <div className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Building2 className="w-4 h-4 text-amber-400" />
                  <span className="font-bold text-white text-xs">Exposed Lifeline Infrastructure</span>
                </div>
                <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-red-500/20 text-red-300 border border-red-500/40">
                  Critical Exposure
                </span>
              </div>

              {/* Exposure Metric Grid */}
              <div className="grid grid-cols-4 gap-2 text-center">
                <div className="p-2 rounded-xl bg-slate-950 border border-slate-800">
                  <span className="text-[10px] text-slate-400 block">Roads</span>
                  <span className="font-mono font-bold text-base text-amber-400">1</span>
                  <span className="text-[9px] text-slate-500 block truncate" title={alert.criticalInfrastructure[0] || 'Highway Corridor'}>
                    {alert.criticalInfrastructure[0] || 'Highway Corridor'}
                  </span>
                </div>
                <div className="p-2 rounded-xl bg-slate-950 border border-slate-800">
                  <span className="text-[10px] text-slate-400 block">Bridges</span>
                  <span className="font-mono font-bold text-base text-cyan-400">1</span>
                  <span className="text-[9px] text-slate-500 block truncate" title={alert.criticalInfrastructure[1] || 'Bridge Span'}>
                    {alert.criticalInfrastructure[1] || 'Bridge Span'}
                  </span>
                </div>
                <div className="p-2 rounded-xl bg-slate-950 border border-slate-800">
                  <span className="text-[10px] text-slate-400 block">Facilities</span>
                  <span className="font-mono font-bold text-base text-purple-400">1</span>
                  <span className="text-[9px] text-slate-500 block truncate" title={alert.criticalInfrastructure[2] || 'Utility Grid'}>
                    {alert.criticalInfrastructure[2] || 'Utility Grid'}
                  </span>
                </div>
                <div className="p-2 rounded-xl bg-slate-950 border border-slate-800">
                  <span className="text-[10px] text-slate-400 block">Population</span>
                  <span className="font-mono font-bold text-base text-red-400">
                    {alert.affectedPopulationEst ? `${(alert.affectedPopulationEst / 1000).toFixed(1)}k` : '12.5k'}
                  </span>
                  <span className="text-[9px] text-slate-500 block">At Risk</span>
                </div>
              </div>

              {/* Asset Details */}
              <div className="space-y-1.5 pt-1">
                <span className="font-bold uppercase tracking-wider text-slate-400 text-[10px] block">
                  Detailed Vulnerable Asset Inventory
                </span>

                {alert.criticalInfrastructure.map((infra, idx) => (
                  <div key={idx} className="p-2.5 rounded-xl bg-slate-950/80 border border-slate-800/80 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Truck className="w-4 h-4 text-cyan-400 flex-shrink-0" />
                      <div>
                        <span className="font-semibold text-slate-200 block text-xs">{infra}</span>
                        <span className="text-[10px] text-slate-400">Directly situated within 500m downslope hazard runout path</span>
                      </div>
                    </div>
                    <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-red-950 text-red-300 border border-red-800 flex-shrink-0">
                      High Impact
                    </span>
                  </div>
                ))}
              </div>

              {/* Tactical Actions */}
              <div className="p-3 rounded-xl bg-amber-950/20 border border-amber-500/30 space-y-1.5 text-slate-200">
                <span className="font-bold text-amber-300 text-xs flex items-center gap-1.5">
                  <ShieldAlert className="w-3.5 h-3.5" />
                  <span>Tactical Infrastructure Mitigation Directive</span>
                </span>
                <p className="leading-relaxed">
                  {alert.recommendedActions[0] || 'Institute safety precautions and alert relevant field divisions.'} {alert.recommendedActions[1] || ''}
                </p>
              </div>
            </div>

            {/* Next Step Action */}
            <div className="flex items-center gap-2">
              <button
                onClick={handlePrev}
                className="py-2.5 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold flex items-center gap-1 transition-colors text-xs"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Back</span>
              </button>

              <button
                onClick={() => {
                  setCurrentStep(6);
                  if (onNavigateToLayer) onNavigateToLayer('rainfall');
                }}
                className="flex-1 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold flex items-center justify-center gap-2 shadow-lg shadow-cyan-950/50 transition-all text-xs"
              >
                <span>Switch to Rainfall Layer →</span>
              </button>
            </div>
          </div>
        )}

        {/* STEP 6: SWITCH TO RAINFALL LAYER */}
        {currentStep === 6 && (
          <div className="space-y-4 animate-in fade-in duration-200">
            <div className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Droplets className="w-4 h-4 text-cyan-400" />
                  <span className="font-bold text-white text-xs">Live Hydrological Conditions</span>
                </div>
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-cyan-950 text-cyan-300 border border-cyan-800">
                  IMD AWS Sync Active
                </span>
              </div>

              {/* Rainfall Metrics */}
              <div className="grid grid-cols-3 gap-2 text-center font-mono">
                <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800">
                  <span className="text-[10px] text-slate-400 block">Current Rate</span>
                  <span className="font-bold text-sm text-cyan-400">28.4 mm/h</span>
                  <span className="text-[9px] text-red-400 block font-sans">Cloudburst</span>
                </div>
                <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800">
                  <span className="text-[10px] text-slate-400 block">24h Rainfall</span>
                  <span className="font-bold text-sm text-red-400">{rainfall24h} mm</span>
                  <span className="text-[9px] text-red-400 block font-sans">&gt; IMD Red Limit</span>
                </div>
                <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800">
                  <span className="text-[10px] text-slate-400 block">7-Day Antecedent</span>
                  <span className="font-bold text-sm text-amber-400">{rainfall7d} mm</span>
                  <span className="text-[9px] text-amber-400 block font-sans">Extreme Saturation</span>
                </div>
              </div>

              {/* Dynamic Hydrology Analysis */}
              <div className="p-3 rounded-xl bg-cyan-950/20 border border-cyan-800/40 space-y-1.5 text-slate-200">
                <span className="font-bold text-cyan-300 text-xs flex items-center gap-1.5">
                  <TrendingUp className="w-3.5 h-3.5" />
                  <span>Rainfall Trend: INCREASING</span>
                </span>
                <p className="leading-relaxed">
                  Convective cell radar reflections show cloudburst persistence for the next 4-6 hours. Infiltration capacity has dropped to 0%, resulting in 100% surface runoff and hydraulic pore-pressure surges on slopes &gt;35°.
                </p>
              </div>

              {/* Data Freshness Indicator */}
              <div className="flex items-center justify-between text-[11px] p-2 rounded-lg bg-slate-950 border border-slate-800">
                <span className="text-slate-400">Source: IMD {districtName} AWS Telemetry Station</span>
                <span className="text-emerald-400 font-mono">● LIVE (Updated 4 mins ago)</span>
              </div>
            </div>

            {/* Next Step Action */}
            <div className="flex items-center gap-2">
              <button
                onClick={handlePrev}
                className="py-2.5 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold flex items-center gap-1 transition-colors text-xs"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Back</span>
              </button>

              <button
                onClick={() => {
                  setCurrentStep(7);
                  if (onNavigateToLayer) onNavigateToLayer('historicalLandslides');
                }}
                className="flex-1 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold flex items-center justify-center gap-2 shadow-lg shadow-cyan-950/50 transition-all text-xs"
              >
                <span>Compare Historical Landslides →</span>
              </button>
            </div>
          </div>
        )}

        {/* STEP 7: COMPARE HISTORICAL LANDSLIDES */}
        {currentStep === 7 && (
          <div className="space-y-4 animate-in fade-in duration-200">
            <div className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Database className="w-4 h-4 text-purple-400" />
                  <span className="font-bold text-white text-xs">GSI Historical Landslide Inventory</span>
                </div>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-purple-950 text-purple-300 border border-purple-800">
                  {historyCount} Regional Events
                </span>
              </div>

              {/* Comparison Card: Current Event vs Most Severe Historic Slide */}
              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
                <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                  <span className="font-bold text-white">Current Event vs July 2022 Slide</span>
                  <span className="text-[10px] font-mono text-slate-400">GSI-EVT-2022-094</span>
                </div>

                <div className="grid grid-cols-2 gap-2 text-[11px]">
                  <div className="p-2 rounded-lg bg-red-950/20 border border-red-800/30">
                    <span className="text-red-400 font-bold block mb-1">What is Similar?</span>
                    <ul className="space-y-1 text-slate-300 list-disc list-inside">
                      <li>Triggered by intense cloudburst (&gt;175mm / 24h)</li>
                      <li>Identical sandstone over fractured shale interface</li>
                      <li>Vulnerable curve along State Highway 5 corridor</li>
                    </ul>
                  </div>

                  <div className="p-2 rounded-lg bg-emerald-950/20 border border-emerald-800/30">
                    <span className="text-emerald-400 font-bold block mb-1">What is Different?</span>
                    <ul className="space-y-1 text-slate-300 list-disc list-inside">
                      <li><strong>Early Warning:</strong> 6h advance lead time (vs 0h in 2022)</li>
                      <li><strong>IoT Sensors:</strong> Active GNSS & pore pressure telemetry</li>
                      <li><strong>Mitigation:</strong> Reinforced gabion wall at toe (built 2024)</li>
                    </ul>
                  </div>
                </div>
              </div>

              {/* Historical Timeline Archive */}
              <div className="space-y-1.5">
                <span className="font-bold uppercase tracking-wider text-slate-400 text-[10px] block">
                  Past Landslides in Same Catchment (GSI Verified)
                </span>

                <div className="space-y-1 text-xs">
                  <div className="p-2 rounded-lg bg-slate-950/80 border border-slate-800 flex items-center justify-between">
                    <div>
                      <span className="font-semibold text-slate-200">18 June 2022 • Major Debris Slide</span>
                      <span className="text-[10px] text-slate-400 block">
                        {alert.criticalInfrastructure[0] || 'Corridor'} toe scouring | Rainfall: {Math.round(rainfall24h * 1.15)}mm
                      </span>
                    </div>
                    <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-slate-800 text-slate-300">
                      GSI Confirmed
                    </span>
                  </div>

                  <div className="p-2 rounded-lg bg-slate-950/80 border border-slate-800 flex items-center justify-between">
                    <div>
                      <span className="font-semibold text-slate-200">12 August 2020 • Translational Rockfall</span>
                      <span className="text-[10px] text-slate-400 block">
                        {alert.criticalInfrastructure[0] || 'Corridor'} shoulder failure | Rainfall: {Math.round(rainfall24h * 0.85)}mm
                      </span>
                    </div>
                    <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-slate-800 text-slate-300">
                      GSI Confirmed
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Next Step Action */}
            <div className="flex items-center gap-2">
              <button
                onClick={handlePrev}
                className="py-2.5 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold flex items-center gap-1 transition-colors text-xs"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Back</span>
              </button>

              <button
                onClick={() => setCurrentStep(8)}
                className="flex-1 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold flex items-center justify-center gap-2 shadow-lg shadow-cyan-950/50 transition-all text-xs"
              >
                <FileText className="w-4 h-4" />
                <span>Generate Official Situation Report →</span>
              </button>
            </div>
          </div>
        )}

        {/* STEP 8: GENERATE SITUATION REPORT */}
        {currentStep === 8 && (
          <div className="space-y-4 animate-in fade-in duration-200">
            
            {/* Situation Report Container */}
            <div className="p-4 rounded-2xl bg-[#09152b] border border-cyan-500/40 space-y-4">
              {/* Header */}
              <div className="flex items-start justify-between border-b border-slate-800 pb-3">
                <div>
                  <div className="flex items-center gap-1.5">
                    <span className="text-cyan-400 font-bold text-xs uppercase tracking-wider">
                      GiriRakshak AI Decision Support Platform
                    </span>
                  </div>
                  <h3 className="text-base font-extrabold text-white mt-0.5">
                    INCIDENT SITUATION REPORT (SITREP)
                  </h3>
                  <p className="text-slate-400 text-[11px]">
                    Generated for SDMA / NDMA / District Magistrate • {new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}
                  </p>
                </div>

                <span className="px-2.5 py-1 rounded text-xs font-black uppercase bg-red-500 text-white shadow-md">
                  LEVEL-3 CRITICAL
                </span>
              </div>

              {/* 10 Required Sections */}
              <div className="space-y-3 text-xs leading-relaxed">
                
                {/* 1. Incident Overview */}
                <div className="space-y-1">
                  <span className="font-bold text-cyan-300 uppercase tracking-wider text-[10px]">
                    1. Incident Overview
                  </span>
                  <p className="text-slate-300">
                    High landslide hazard acceleration detected at <strong>{locationName}</strong>, District {districtName}, {stateName}. Current hazard rating is <strong>{riskScore}/100</strong>, with failure probability exceeding 88% under continuous cloudburst loading.
                  </p>
                </div>

                {/* 2. Current Risk Assessment */}
                <div className="space-y-1">
                  <span className="font-bold text-cyan-300 uppercase tracking-wider text-[10px]">
                    2. Current Risk Assessment
                  </span>
                  <p className="text-slate-300">
                    Geotechnical stability factor of safety has decreased from 1.18 to 0.88. Active rotational and translational shear planes are mobilized across the 42° escarpment slope.
                  </p>
                </div>

                {/* 3. Evidence Summary */}
                <div className="space-y-1">
                  <span className="font-bold text-cyan-300 uppercase tracking-wider text-[10px]">
                    3. Multi-Sensor Evidence Summary
                  </span>
                  <div className="grid grid-cols-2 gap-1.5 font-mono text-[11px] p-2 rounded-lg bg-slate-950 border border-slate-800">
                    <div>Rainfall 24h: <strong className="text-cyan-300">{rainfall24h} mm</strong></div>
                    <div>Moisture: <strong className="text-amber-300">{soilSaturation}%</strong></div>
                    <div>InSAR Creep: <strong className="text-purple-300">{groundMovement} mm/d</strong></div>
                    <div>Slope: <strong className="text-slate-200">{slopeAngle}°</strong></div>
                  </div>
                </div>

                {/* 4. Infrastructure Exposure */}
                <div className="space-y-1">
                  <span className="font-bold text-cyan-300 uppercase tracking-wider text-[10px]">
                    4. Infrastructure & Settlement Exposure
                  </span>
                  <p className="text-slate-300">
                    {alert.criticalInfrastructure.join(', ')} directly situated within the potential runout hazard fan. An estimated {alert.affectedPopulationEst.toLocaleString()} residents in nearby habitations are within the precautionary watch perimeter.
                  </p>
                </div>

                {/* 5. Historical Context */}
                <div className="space-y-1">
                  <span className="font-bold text-cyan-300 uppercase tracking-wider text-[10px]">
                    5. Historical Landslide Context
                  </span>
                  <p className="text-slate-300">
                    Catchment in {districtName} has recorded {historyCount} past landslide events in the GSI Landslide Atlas. The current hydrological loading ({rainfall24h} mm) combined with displacement velocity ({groundMovement} mm/day) indicates elevated pre-failure instability.
                  </p>
                </div>

                {/* 6. AI Interpretation */}
                <div className="space-y-1">
                  <span className="font-bold text-cyan-300 uppercase tracking-wider text-[10px]">
                    6. Geotechnical Decision-Support Reasoning
                  </span>
                  <p className="text-slate-300">
                    {alert.aiReasoning || 'Continuous precipitation has led to complete matrix saturation. Deep pore pressures along bedding planes have reduced effective normal stress below critical frictional resistance.'}
                  </p>
                </div>

                {/* 7. Monitoring Priorities & Recommended Action */}
                <div className="space-y-1">
                  <span className="font-bold text-cyan-300 uppercase tracking-wider text-[10px]">
                    7. Monitoring Priorities & Recommended Actions
                  </span>
                  <ul className="list-disc list-inside space-y-0.5 text-slate-300">
                    {alert.recommendedActions.map((act, i) => (
                      <li key={i}>{act}</li>
                    ))}
                  </ul>
                </div>

                {/* 8. Data Sources */}
                <div className="space-y-1">
                  <span className="font-bold text-cyan-300 uppercase tracking-wider text-[10px]">
                    8. Authoritative Data Sources
                  </span>
                  <p className="text-slate-400 font-mono text-[10px]">
                    IMD AWS Doppler Radar • NASA SRTM 30m • Copernicus Sentinel-1 InSAR • Geological Survey of India (GSI) 1:50k Atlas.
                  </p>
                </div>

                {/* 9. Data Quality & Freshness */}
                <div className="space-y-1">
                  <span className="font-bold text-cyan-300 uppercase tracking-wider text-[10px]">
                    9. Data Freshness & Model Confidence
                  </span>
                  <p className="text-slate-400 font-mono text-[10px]">
                    Observed ground telemetry updated within 10 minutes. AI model confidence index: 91%.
                  </p>
                </div>

                {/* 10. Scientific Disclaimer */}
                <div className="p-2.5 rounded-lg bg-slate-950 border border-slate-800 text-[10px] text-slate-400 leading-relaxed">
                  <strong>DISCLAIMER:</strong> This report is generated by GiriRakshak AI for disaster decision support. Final evacuation and civil directives must be sanctioned by the designated State Disaster Management Authority (SDMA) or District Magistrate.
                </div>
              </div>
            </div>

            {/* Action Bar */}
            <div className="flex flex-wrap items-center gap-2">
              <button
                onClick={handleCopyReport}
                className="flex-1 py-2 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 font-semibold flex items-center justify-center gap-1.5 transition-colors text-xs"
              >
                {copiedReport ? (
                  <>
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Copied to Clipboard!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5 text-cyan-400" />
                    <span>Copy Summary</span>
                  </>
                )}
              </button>

              <button
                onClick={() => window.print()}
                className="py-2 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 font-semibold flex items-center gap-1.5 transition-colors text-xs"
                title="Print Situation Report"
              >
                <Printer className="w-3.5 h-3.5 text-slate-300" />
                <span>Print</span>
              </button>

              <button
                onClick={handleCopyReport}
                className="flex-1 py-2 px-3 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold flex items-center justify-center gap-1.5 shadow-lg shadow-cyan-950/50 transition-all text-xs"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Download Official SITREP</span>
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Escalate Dialog Modal */}
      {escalateModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="max-w-md w-full p-5 rounded-2xl bg-slate-900 border border-red-500/50 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-red-400 font-bold text-sm">
                <ShieldAlert className="w-5 h-5" />
                <span>Escalate Operational Alert</span>
              </div>
              <button onClick={() => setEscalateModalOpen(false)} className="text-slate-400 hover:text-white">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-semibold text-slate-300">Target Escalation Level</label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setEscalateTargetState('Warning')}
                  className={`py-2 rounded-lg font-bold text-xs border ${
                    escalateTargetState === 'Warning' ? 'bg-amber-500 text-slate-950 border-amber-400' : 'bg-slate-800 text-slate-300 border-slate-700'
                  }`}
                >
                  WARNING (Level 2)
                </button>
                <button
                  type="button"
                  onClick={() => setEscalateTargetState('Critical')}
                  className={`py-2 rounded-lg font-bold text-xs border ${
                    escalateTargetState === 'Critical' ? 'bg-red-500 text-white border-red-400' : 'bg-slate-800 text-slate-300 border-slate-700'
                  }`}
                >
                  CRITICAL (Level 3)
                </button>
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-300">Operational Escalation Reason</label>
              <textarea
                value={escalateReason}
                onChange={(e) => setEscalateReason(e.target.value)}
                rows={3}
                className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-100 text-xs focus:border-red-500 focus:outline-none"
                placeholder="Specify rainfall threshold breach, field observation, or sensor telemetry..."
              />
            </div>

            <div className="flex items-center gap-2 pt-2">
              <button
                onClick={() => setEscalateModalOpen(false)}
                className="flex-1 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  escalateAlert(alert.id, escalateTargetState, escalateReason);
                  setEscalateModalOpen(false);
                }}
                className="flex-1 py-2 rounded-xl bg-red-500 hover:bg-red-400 text-white text-xs font-bold shadow-lg shadow-red-950/50"
              >
                Confirm Escalation
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Resolve Dialog Modal */}
      {resolveModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="max-w-md w-full p-5 rounded-2xl bg-slate-900 border border-emerald-500/50 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-emerald-400 font-bold text-sm">
                <CheckCircle2 className="w-5 h-5" />
                <span>Mark Alert Resolved</span>
              </div>
              <button onClick={() => setResolveModalOpen(false)} className="text-slate-400 hover:text-white">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-300">Resolution Justification</label>
              <textarea
                value={resolveReason}
                onChange={(e) => setResolveReason(e.target.value)}
                rows={3}
                className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-100 text-xs focus:border-emerald-500 focus:outline-none"
                placeholder="Document stabilizing sensor readings, receding rainfall..."
              />
            </div>

            <div className="flex items-center gap-2 pt-2">
              <button
                onClick={() => setResolveModalOpen(false)}
                className="flex-1 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  resolveAlert(alert.id, resolveReason);
                  setResolveModalOpen(false);
                }}
                className="flex-1 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs font-bold"
              >
                Confirm Resolution
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
