import React from 'react';
import { 
  X, 
  ChevronRight, 
  ChevronLeft, 
  Play, 
  CheckCircle2, 
  Sparkles, 
  MapPin, 
  CloudRain, 
  Cpu, 
  AlertTriangle, 
  Layers, 
  FileText,
  ShieldCheck
} from 'lucide-react';
import { useDisaster } from '../context/DisasterContext';

interface GuidedDemoModalProps {
  onNavigateTab: (tab: any) => void;
}

export const GuidedDemoModal: React.FC<GuidedDemoModalProps> = ({ onNavigateTab }) => {
  const { guidedDemo, runScenario, setSelectedZoneId } = useDisaster();
  const { isOpen, step, next, prev, close, goToStep } = guidedDemo;

  if (!isOpen) return null;

  const steps = [
    {
      num: 1,
      title: '01 — Regional Overview (NER Multi-Hazard Scope)',
      desc: 'GiriRakshak AI continuously monitors all 8 North Eastern States (Assam, Meghalaya, Sikkim, Nagaland, Mizoram, Arunachal Pradesh, Manipur, Tripura) using synthetic aperture radar, IMD rainfall grids, and geological telemetry.',
      tab: 'situation-room',
      action: () => onNavigateTab('situation-room'),
      actionLabel: 'View Situation Room'
    },
    {
      num: 2,
      title: '02 — Interactive GIS Risk Map & Zone Selection',
      desc: 'High-risk mountain terrain is gridded into monitoring polygons. Notice Sohra-Shella (Meghalaya) and Haflong Hill (Assam) highlighted with real-time hazard markers.',
      tab: 'map',
      action: () => {
        setSelectedZoneId('ZONE-NER-01');
        onNavigateTab('map');
      },
      actionLabel: 'Inspect Sohra Escarpment on Map'
    },
    {
      num: 3,
      title: '03 — Environmental & Geotechnical Telemetry',
      desc: 'GiriRakshak ingests real-time sensor streams: 24h rainfall rate, 7-day antecedent saturation, piezometer pore-water pressure, and GNSS slope shear creep velocity.',
      tab: 'monitoring',
      action: () => onNavigateTab('monitoring'),
      actionLabel: 'Open Telemetry Dashboard'
    },
    {
      num: 4,
      title: '04 — Trigger Cloudburst Scenario Simulation',
      desc: 'Simulate an extreme orographic precipitation event (250mm/24h cloudburst). Watch the animated 12-step pipeline propagate across the system in real time!',
      tab: 'scenario',
      action: () => {
        runScenario('heavy_rainfall');
        onNavigateTab('scenario');
      },
      actionLabel: 'Trigger Cloudburst Scenario Now'
    },
    {
      num: 5,
      title: '05 — AI Risk Recalculation & Gauge Escalation',
      desc: 'The Physics-Informed XGBoost model recalculates the safety factor. The AI Risk Score surges from 74 to 98/100 (CRITICAL HAZARD) with 94% model confidence.',
      tab: 'situation-room',
      action: () => onNavigateTab('situation-room'),
      actionLabel: 'View Recalculated Risk Score'
    },
    {
      num: 6,
      title: '06 — Explainable AI (SHAP & Factor Contribution)',
      desc: 'Black-box AI is unacceptable for disaster management. GiriRakshak provides transparent SHAP explanations: Rainfall (42%), Pore Saturation (31%), and Slope Curvature (18%).',
      tab: 'assessment',
      action: () => onNavigateTab('assessment'),
      actionLabel: 'Open Explainable AI Engine'
    },
    {
      num: 7,
      title: '07 — Multi-Channel Early Warning & CAP Dissemination',
      desc: 'Level-3 Red Early Warning generated automatically with multilingual support (Assamese, Hindi, English). Broadcast simulation via SMS, sirens, IVR, and Common Alerting Protocol.',
      tab: 'warnings',
      action: () => onNavigateTab('warnings'),
      actionLabel: 'Review Early Warning Broadcast'
    },
    {
      num: 8,
      title: '08 — Infrastructure Exposure & Lifeline Arteries',
      desc: 'Geospatial failure cones map directly to vulnerable assets. NH-6 Lifeline, Haflong railway cutting, and Umtyngar bridges flagged with pre-positioned heavy equipment orders.',
      tab: 'infrastructure',
      action: () => onNavigateTab('infrastructure'),
      actionLabel: 'Inspect Exposed Infrastructure'
    },
    {
      num: 9,
      title: '09 — Role-Based Decision Support Protocols',
      desc: 'Tailored action checklists for District Magistrates, SDMA, Border Roads Organisation (BRO), and NDRF rescue battalions with dual-authorization verification.',
      tab: 'stakeholder',
      action: () => onNavigateTab('stakeholder'),
      actionLabel: 'View Stakeholder Views'
    },
    {
      num: 10,
      title: '10 — One-Click Situation Report Generation',
      desc: 'Generate executive incident reports and daily situation bulletins ready for disaster management authorities with complete meteorological and structural data.',
      tab: 'reports',
      action: () => onNavigateTab('reports'),
      actionLabel: 'Open Report Center'
    }
  ];

  const currentStepData = steps[step - 1];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in">
      <div className="w-full max-w-2xl bg-slate-900 border border-amber-500/40 rounded-3xl shadow-2xl overflow-hidden flex flex-col">
        {/* Modal Top Banner */}
        <div className="p-4 bg-gradient-to-r from-amber-950/60 via-slate-900 to-amber-950/60 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-amber-500/20 text-amber-400">
              <Sparkles className="w-4 h-4" />
            </span>
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-amber-300 font-mono">
                Interactive Guided Walkthrough
              </span>
              <div className="text-[10px] text-slate-400">Step {step} of 10</div>
            </div>
          </div>

          <button
            onClick={close}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Step Progress Indicators */}
        <div className="px-6 pt-4 flex items-center gap-1.5 overflow-x-auto">
          {steps.map((s) => (
            <button
              key={s.num}
              onClick={() => {
                goToStep(s.num);
                s.action();
              }}
              className={`h-1.5 flex-1 rounded-full transition-all ${
                s.num === step
                  ? 'bg-amber-400'
                  : s.num < step
                  ? 'bg-cyan-500'
                  : 'bg-slate-800'
              }`}
              title={s.title}
            />
          ))}
        </div>

        {/* Content Body */}
        <div className="p-6 space-y-4">
          <h2 className="text-xl font-black text-white tracking-tight">
            {currentStepData.title}
          </h2>

          <p className="text-sm text-slate-300 leading-relaxed">
            {currentStepData.desc}
          </p>

          <div className="pt-2">
            <button
              onClick={currentStepData.action}
              className="py-2.5 px-4 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-bold text-xs shadow-md shadow-cyan-600/20 flex items-center gap-2 transition-all"
            >
              <span>{currentStepData.actionLabel}</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Footer Navigation Controls */}
        <div className="p-4 bg-slate-950/80 border-t border-slate-800 flex items-center justify-between">
          <button
            onClick={close}
            className="text-xs font-semibold text-slate-400 hover:text-slate-200"
          >
            Exit Guided Walkthrough
          </button>

          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                prev();
                if (step > 1) steps[step - 2].action();
              }}
              disabled={step === 1}
              className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 disabled:opacity-40 text-xs font-semibold text-slate-200 flex items-center gap-1"
            >
              <ChevronLeft className="w-4 h-4" />
              <span>Previous</span>
            </button>

            {step < 10 ? (
              <button
                onClick={() => {
                  next();
                  if (step < 10) steps[step].action();
                }}
                className="px-4 py-1.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold text-xs flex items-center gap-1 shadow-md shadow-amber-500/20"
              >
                <span>Next Step</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            ) : (
              <button
                onClick={close}
                className="px-4 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center gap-1"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>Complete Demonstration</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
