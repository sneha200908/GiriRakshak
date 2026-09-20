import React from 'react';
import { 
  Play, 
  RotateCcw, 
  CloudRain, 
  Droplets, 
  Activity, 
  Flame, 
  CheckCircle2, 
  AlertTriangle, 
  Clock, 
  ArrowRight,
  ShieldAlert,
  Sparkles,
  Info
} from 'lucide-react';
import { useDisaster } from '../context/DisasterContext';
import { ScenarioType } from '../types';

export const ScenarioSimulator: React.FC<{ onNavigateToMap?: () => void }> = ({ onNavigateToMap }) => {
  const { currentScenario, simulationProgress, runScenario, resetToBaseline, whatChanged } = useDisaster();

  const scenarios: { id: ScenarioType; title: string; desc: string; icon: React.ReactNode; color: string; badge: string }[] = [
    {
      id: 'heavy_rainfall',
      title: 'Heavy Rainfall (Cloudburst)',
      desc: 'Simulate 250mm/24h convective cloudburst in Sohra & Dima Hasao. Triggers pore pressure saturation and escalates early warnings.',
      icon: <CloudRain className="w-5 h-5 text-cyan-400" />,
      color: 'from-blue-900/40 via-cyan-950/30 to-slate-900 border-cyan-500/40 hover:border-cyan-400',
      badge: 'Escalation Event'
    },
    {
      id: 'rising_moisture',
      title: 'Rising Soil Moisture',
      desc: 'Simulate sustained multi-day infiltration without surface runoff, raising shale pore pressures and reducing shear strength.',
      icon: <Droplets className="w-5 h-5 text-amber-400" />,
      color: 'from-amber-900/40 via-slate-900 to-slate-900 border-amber-500/40 hover:border-amber-400',
      badge: 'Subsurface Creep'
    },
    {
      id: 'ground_movement',
      title: 'Increased Ground Movement',
      desc: 'Simulate InSAR satellite and hillside GNSS inclinometer displacement spike (>7.4 mm/day) along sheared fault zones.',
      icon: <Activity className="w-5 h-5 text-purple-400" />,
      color: 'from-purple-900/40 via-slate-900 to-slate-900 border-purple-500/40 hover:border-purple-400',
      badge: 'Kinematic Slip'
    },
    {
      id: 'combined_risk',
      title: 'Combined Multi-Hazard Event',
      desc: 'Compound scenario: cloudburst storm surge + antecedent saturation + micro-seismic shaking across 4 NER states.',
      icon: <Flame className="w-5 h-5 text-red-400" />,
      color: 'from-red-950/50 via-slate-900 to-slate-900 border-red-500/50 hover:border-red-400',
      badge: 'Extreme Multi-Hazard'
    },
    {
      id: 'recovery',
      title: 'Post-Event Recovery',
      desc: 'Simulate weather clearing, pore-water drainage, slope stabilization, alert de-escalation, and infrastructure reopening.',
      icon: <CheckCircle2 className="w-5 h-5 text-emerald-400" />,
      color: 'from-emerald-950/40 via-slate-900 to-slate-900 border-emerald-500/40 hover:border-emerald-400',
      badge: 'De-escalation'
    },
    {
      id: 'reset',
      title: 'Reset to Baseline',
      desc: 'Restore default initial monitoring telemetry, standard regional hazard indices, and clear simulation logs.',
      icon: <RotateCcw className="w-5 h-5 text-slate-300" />,
      color: 'from-slate-900 via-slate-950 to-slate-900 border-slate-700 hover:border-slate-500',
      badge: 'Normal State'
    }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Header Banner */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-slate-900 via-[#101e3b] to-slate-900 border border-cyan-500/30 shadow-xl space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold uppercase tracking-wider bg-amber-500/20 text-amber-300 border border-amber-500/40">
              🟡 DEMO SIMULATION ENGINE
            </span>
            <span className="text-xs font-mono text-slate-400">
              Deterministic Hydro-Geotechnical Scenario Simulator
            </span>
          </div>

          <button
            onClick={() => runScenario('reset')}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs text-slate-200 font-semibold border border-slate-700 transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset Baseline</span>
          </button>
        </div>

        <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
          Landslide Hazard Scenario Simulator
        </h1>
        <p className="text-xs sm:text-sm text-slate-300 max-w-3xl leading-relaxed">
          Test system resilience, alert propagation, and decision support workflows by triggering simulated weather events, subsurface pore pressure surges, or recovery cycles. Every scenario updates the entire platform state concurrently.
        </p>

        {/* Animated Sequence Pathway Indicator */}
        <div className="pt-3 border-t border-slate-800/80">
          <div className="text-[11px] font-mono text-slate-400 uppercase tracking-wider mb-2 font-semibold">
            System Propagation Pipeline:
          </div>
          <div className="flex items-center gap-1.5 overflow-x-auto text-[11px] font-mono pb-1">
            <span className="px-2 py-1 rounded bg-slate-950 text-cyan-300 border border-slate-800 whitespace-nowrap">
              Rainfall ↑
            </span>
            <ArrowRight className="w-3 h-3 text-slate-600 flex-shrink-0" />
            <span className="px-2 py-1 rounded bg-slate-950 text-amber-300 border border-slate-800 whitespace-nowrap">
              Soil Moisture ↑
            </span>
            <ArrowRight className="w-3 h-3 text-slate-600 flex-shrink-0" />
            <span className="px-2 py-1 rounded bg-slate-950 text-orange-300 border border-slate-800 whitespace-nowrap">
              Risk Score ↑
            </span>
            <ArrowRight className="w-3 h-3 text-slate-600 flex-shrink-0" />
            <span className="px-2 py-1 rounded bg-slate-950 text-red-400 border border-slate-800 whitespace-nowrap font-bold">
              MEDIUM → HIGH
            </span>
            <ArrowRight className="w-3 h-3 text-slate-600 flex-shrink-0" />
            <span className="px-2 py-1 rounded bg-red-950 text-white border border-red-800 whitespace-nowrap font-bold">
              EARLY WARNING GENERATED
            </span>
            <ArrowRight className="w-3 h-3 text-slate-600 flex-shrink-0" />
            <span className="px-2 py-1 rounded bg-slate-950 text-slate-300 border border-slate-800 whitespace-nowrap">
              Infrastructure Exposure
            </span>
            <ArrowRight className="w-3 h-3 text-slate-600 flex-shrink-0" />
            <span className="px-2 py-1 rounded bg-slate-950 text-slate-300 border border-slate-800 whitespace-nowrap">
              Report Updated
            </span>
          </div>
        </div>
      </div>

      {/* Active Simulation Live Progress Box */}
      {simulationProgress.isRunning && (
        <div className="p-5 rounded-2xl bg-[#09152b] border border-cyan-500/60 shadow-xl space-y-3 animate-in fade-in">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-ping" />
              <span className="text-xs font-bold text-cyan-300 uppercase tracking-wider font-mono">
                Executing Scenario Step {simulationProgress.stepNumber} of {simulationProgress.totalSteps}
              </span>
            </div>
            <span className="text-xs font-mono text-slate-400">
              {Math.round((simulationProgress.stepNumber / simulationProgress.totalSteps) * 100)}% Complete
            </span>
          </div>

          <div className="text-sm font-bold text-white">
            {simulationProgress.stepName}
          </div>

          {/* Progress bar */}
          <div className="w-full h-2 rounded-full bg-slate-950 overflow-hidden border border-slate-800">
            <div 
              className="h-full bg-gradient-to-r from-blue-500 via-cyan-400 to-emerald-400 transition-all duration-300"
              style={{ width: `${(simulationProgress.stepNumber / simulationProgress.totalSteps) * 100}%` }}
            />
          </div>

          {/* Live execution log */}
          <div className="max-h-28 overflow-y-auto p-2.5 rounded-xl bg-slate-950 border border-slate-800 font-mono text-[11px] text-slate-300 space-y-1">
            {simulationProgress.log.map((item, idx) => (
              <div key={idx} className="flex items-start gap-1.5">
                <span className="text-cyan-400">›</span>
                <span>{item}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Scenario Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {scenarios.map((sc) => {
          const isActive = currentScenario === sc.id;

          return (
            <div
              key={sc.id}
              className={`p-5 rounded-2xl border bg-gradient-to-b ${sc.color} transition-all flex flex-col justify-between shadow-lg ${
                isActive ? 'ring-2 ring-cyan-400 scale-[1.01]' : ''
              }`}
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="p-2 rounded-xl bg-slate-950 border border-slate-800">
                    {sc.icon}
                  </div>
                  <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase tracking-wider bg-slate-950/80 text-slate-300 border border-slate-800">
                    {sc.badge}
                  </span>
                </div>

                <div>
                  <h3 className="text-base font-bold text-white">
                    {sc.title}
                  </h3>
                  <p className="text-xs text-slate-300 mt-1 leading-relaxed">
                    {sc.desc}
                  </p>
                </div>
              </div>

              <div className="pt-4 mt-4 border-t border-slate-800/80">
                <button
                  id={`btn-run-scenario-${sc.id}`}
                  onClick={() => runScenario(sc.id)}
                  disabled={simulationProgress.isRunning}
                  className={`w-full py-2.5 px-4 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 ${
                    isActive
                      ? 'bg-cyan-500 text-slate-950 shadow-md shadow-cyan-500/30'
                      : 'bg-slate-800 hover:bg-cyan-600 text-white hover:shadow-md'
                  } disabled:opacity-50`}
                >
                  <Play className="w-3.5 h-3.5 fill-current" />
                  <span>{isActive ? 'Scenario Active (Click to Re-run)' : `Run ${sc.title}`}</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Notice on Simulated Data */}
      <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800 flex items-start gap-3 text-xs text-slate-400">
        <Info className="w-4 h-4 text-cyan-400 flex-shrink-0 mt-0.5" />
        <div>
          <strong className="text-slate-300">Simulation Framework Notice:</strong> The scenario simulator executes deterministic physical modeling calculations to demonstrate how GiriRakshak AI dynamically links sensor inputs to early warnings, infrastructure vulnerability assessments, and decision-support bulletins.
        </div>
      </div>
    </div>
  );
};
