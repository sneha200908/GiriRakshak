import React from 'react';
import { 
  Mountain, 
  ShieldAlert, 
  MapPin, 
  Radio, 
  Cpu, 
  Activity, 
  FileCheck, 
  AlertTriangle, 
  ArrowRight, 
  Layers, 
  Users, 
  CheckCircle2, 
  Sparkles,
  ExternalLink,
  BookOpen,
  Server,
  CloudRain,
  Compass,
  PhoneCall
} from 'lucide-react';

interface LandingPageProps {
  onOpenDashboard: () => void;
  onOpenMap: () => void;
  onOpenWarnings: () => void;
  onOpenAssessment: () => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({
  onOpenDashboard,
  onOpenMap,
  onOpenWarnings,
  onOpenAssessment,
}) => {
  return (
    <div className="min-h-screen bg-[#070d1e] text-slate-100 selection:bg-cyan-500/30">
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-12 pb-20 border-b border-slate-800/80">
        {/* Background Decorative Tech Grid & Gradients */}
        <div className="absolute inset-0 bg-[radial-gradient(#1e293b_1px,transparent_1px)] [background-size:24px_24px] opacity-25" />
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[350px] bg-gradient-to-tr from-cyan-600/15 via-blue-600/10 to-indigo-600/15 blur-[120px] pointer-events-none rounded-full" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Platform Operational Pipeline Badge */}
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-900/90 border border-cyan-500/30 text-cyan-300 text-xs font-semibold mb-6 shadow-lg shadow-cyan-950/40">
            <span className="flex h-2 w-2 rounded-full bg-cyan-400 animate-ping" />
            <span>AI-POWERED LANDSLIDE RISK MONITORING & EARLY WARNING PLATFORM</span>
            <span className="text-slate-500">|</span>
            <span className="text-amber-300 font-mono">NORTH EASTERN REGION (NER)</span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Left Headline Column */}
            <div className="lg:col-span-7 space-y-6 text-left">
              <div className="space-y-3">
                <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white leading-tight">
                  GiriRakshak <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-sky-300 to-blue-500">AI</span>
                </h1>
                <p className="text-lg sm:text-xl font-semibold text-cyan-200/90 tracking-wide">
                  AI-Powered Landslide Risk Monitoring & Early Warning Platform
                </p>
                <div className="inline-flex items-center gap-1.5 py-1 px-2.5 rounded-lg bg-slate-900/80 border border-cyan-500/20 text-[11px] text-cyan-300 font-mono font-medium">
                  MONITOR → DETECT → ANALYZE → PREDICT → EXPLAIN → WARN → ASSESS IMPACT → SUPPORT RESPONSE
                </div>
                <p className="text-sm sm:text-base text-slate-300 max-w-2xl font-normal leading-relaxed">
                  Intelligent disaster-risk monitoring and early-warning decision support for landslide-prone terrains across the North Eastern Region of India. Fusing multi-source IMD precipitation, satellite imagery, geological DEM, and real-time IoT sensors.
                </p>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap gap-4 pt-2">
                <button
                  id="hero-open-dashboard-btn"
                  onClick={onOpenDashboard}
                  className="flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-bold text-sm shadow-lg shadow-cyan-500/25 transition-all transform hover:-translate-y-0.5 active:translate-y-0"
                >
                  <Activity className="w-4 h-4 text-slate-950" />
                  <span>Open Risk Dashboard</span>
                  <ArrowRight className="w-4 h-4 text-slate-950" />
                </button>

                <button
                  id="hero-explore-map-btn"
                  onClick={onOpenMap}
                  className="flex items-center gap-2 px-6 py-3 rounded-xl bg-slate-900/90 hover:bg-slate-800 text-white font-semibold text-sm border border-slate-700 shadow-md transition-all hover:border-cyan-500/40"
                >
                  <MapPin className="w-4 h-4 text-cyan-400" />
                  <span>Explore Interactive Risk Map</span>
                </button>

                <button
                  id="hero-ai-assessment-btn"
                  onClick={onOpenAssessment}
                  className="flex items-center gap-2 px-5 py-3 rounded-xl bg-slate-900/60 hover:bg-slate-800/80 text-cyan-300 font-medium text-sm border border-cyan-900/50 transition-colors"
                >
                  <Cpu className="w-4 h-4 text-cyan-400" />
                  <span>AI Risk Engine</span>
                </button>
              </div>

              {/* Quick Hero Telemetry Highlights */}
              <div className="grid grid-cols-3 gap-3 pt-6 border-t border-slate-800/80 max-w-lg">
                <div className="bg-slate-900/60 border border-slate-800 rounded-lg p-3">
                  <div className="text-2xl font-bold font-mono text-cyan-400">8</div>
                  <div className="text-[11px] text-slate-400 font-medium">NER States Covered</div>
                </div>
                <div className="bg-slate-900/60 border border-slate-800 rounded-lg p-3">
                  <div className="text-2xl font-bold font-mono text-amber-400">103</div>
                  <div className="text-[11px] text-slate-400 font-medium">Active Sensor Zones</div>
                </div>
                <div className="bg-slate-900/60 border border-slate-800 rounded-lg p-3">
                  <div className="text-2xl font-bold font-mono text-emerald-400">89%</div>
                  <div className="text-[11px] text-slate-400 font-medium">Model Confidence</div>
                </div>
              </div>
            </div>

            {/* Right Graphic: Command Center Terrain & Radar Graphic */}
            <div className="lg:col-span-5 relative">
              <div className="relative rounded-2xl bg-gradient-to-b from-slate-900 to-slate-950 border border-cyan-500/30 p-5 shadow-2xl shadow-cyan-950/50 overflow-hidden">
                {/* Header ribbon inside widget */}
                <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-4 text-xs font-mono">
                  <div className="flex items-center gap-2 text-cyan-400">
                    <Radio className="w-4 h-4 animate-spin" style={{ animationDuration: '8s' }} />
                    <span>NER SECTOR GEORADAR LIVE</span>
                  </div>
                  <span className="px-2 py-0.5 rounded bg-red-500/20 text-red-400 font-bold border border-red-500/30">
                    CRITICAL WATCH
                  </span>
                </div>

                {/* SVG Mountain Terrain Graphic with Contour Layers & Pulsing Hazards */}
                <div className="relative w-full h-64 rounded-xl bg-[#0b162f] border border-slate-800 flex items-center justify-center overflow-hidden">
                  <svg viewBox="0 0 400 220" className="w-full h-full">
                    <defs>
                      <linearGradient id="skyGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#0b1736" />
                        <stop offset="100%" stopColor="#081024" />
                      </linearGradient>
                      <linearGradient id="mountainFar" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#1e293b" />
                        <stop offset="100%" stopColor="#0f172a" />
                      </linearGradient>
                      <linearGradient id="mountainMid" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#0e3054" />
                        <stop offset="100%" stopColor="#091c34" />
                      </linearGradient>
                      <linearGradient id="mountainFront" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#0c4a6e" />
                        <stop offset="100%" stopColor="#042f2e" />
                      </linearGradient>
                    </defs>

                    {/* Sky Background */}
                    <rect width="400" height="220" fill="url(#skyGrad)" />

                    {/* Topographic Elevation Contour Rings */}
                    <ellipse cx="200" cy="110" rx="170" ry="85" fill="none" stroke="#1e293b" strokeWidth="0.75" strokeDasharray="3,3" />
                    <ellipse cx="200" cy="110" rx="120" ry="60" fill="none" stroke="#1e293b" strokeWidth="0.75" />
                    <ellipse cx="200" cy="110" rx="70" ry="35" fill="none" stroke="#1e293b" strokeWidth="0.75" strokeDasharray="2,2" />

                    {/* Mountain Ridge Layers (Simulating Himalayan / Barail / Khasi Hill Terrain) */}
                    <path d="M0 160 L60 110 L130 145 L200 80 L280 140 L350 95 L400 130 L400 220 L0 220 Z" fill="url(#mountainFar)" opacity="0.6" />
                    <path d="M0 175 L80 125 L150 160 L230 115 L310 165 L370 135 L400 155 L400 220 L0 220 Z" fill="url(#mountainMid)" opacity="0.8" />
                    <path d="M0 195 L100 150 L180 180 L260 140 L340 185 L400 165 L400 220 L0 220 Z" fill="url(#mountainFront)" />

                    {/* Highway Line (e.g. NH-6 / NH-29) winding through mountains */}
                    <path d="M20 210 Q 120 180 190 195 T 380 170" fill="none" stroke="#38bdf8" strokeWidth="2.5" strokeDasharray="4,2" />

                    {/* Radar Scanning Line */}
                    <line x1="200" y1="0" x2="200" y2="220" stroke="#38bdf8" strokeWidth="1" opacity="0.4">
                      <animate attributeName="x1" values="40;360;40" dur="8s" repeatCount="indefinite" />
                      <animate attributeName="x2" values="40;360;40" dur="8s" repeatCount="indefinite" />
                    </line>

                    {/* Critical Hazard Point 1 (Sohra-Shella Escarpment) */}
                    <g transform="translate(140, 130)">
                      <circle r="16" fill="#ef4444" opacity="0.2">
                        <animate attributeName="r" values="8;20;8" dur="2s" repeatCount="indefinite" />
                        <animate attributeName="opacity" values="0.4;0;0.4" dur="2s" repeatCount="indefinite" />
                      </circle>
                      <circle r="6" fill="#ef4444" stroke="#ffffff" strokeWidth="1.5" />
                      <text x="10" y="4" fill="#fecaca" fontSize="9" fontWeight="bold" fontFamily="monospace">HIGH RISK: Sohra (88)</text>
                    </g>

                    {/* Critical Hazard Point 2 (Haflong Dima Hasao) */}
                    <g transform="translate(260, 120)">
                      <circle r="14" fill="#ef4444" opacity="0.2">
                        <animate attributeName="r" values="6;18;6" dur="2.4s" repeatCount="indefinite" />
                        <animate attributeName="opacity" values="0.4;0;0.4" dur="2.4s" repeatCount="indefinite" />
                      </circle>
                      <circle r="5" fill="#ef4444" stroke="#ffffff" strokeWidth="1.5" />
                      <text x="10" y="4" fill="#fecaca" fontSize="9" fontWeight="bold" fontFamily="monospace">HIGH RISK: Haflong (84)</text>
                    </g>

                    {/* Medium Hazard Point (Tawang) */}
                    <g transform="translate(80, 100)">
                      <circle r="4" fill="#f59e0b" stroke="#ffffff" strokeWidth="1" />
                      <text x="8" y="4" fill="#fde68a" fontSize="8" fontFamily="monospace">MED: Tawang (58)</text>
                    </g>
                  </svg>
                </div>

                {/* Sub-card Telemetry Info */}
                <div className="mt-4 p-3 rounded-lg bg-slate-950/80 border border-slate-800 space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-slate-400 font-medium">Model Pipeline:</span>
                    <span className="text-cyan-300 font-mono font-semibold">Random Forest + XGBoost + LSTM</span>
                  </div>
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-slate-400 font-medium">IMD Rainfall Gridded Sync:</span>
                    <span className="text-emerald-400 font-mono font-semibold">Live (0.25° Resolution)</span>
                  </div>
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-slate-400 font-medium">Human DM Officer Desk:</span>
                    <span className="text-amber-300 font-mono font-semibold">Review Pending (4 Alerts)</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Why GiriRakshak AI? Section */}
      <section className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <span className="text-cyan-400 text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full bg-cyan-950/60 border border-cyan-800">
            Strategic Value
          </span>
          <h2 className="text-3xl font-bold text-white mt-3">
            Why GiriRakshak AI?
          </h2>
          <p className="text-slate-300 text-sm mt-2">
            Engineered specifically to solve the fragile geological challenges, high rainfall intensities, and critical lifeline vulnerabilities across India's North Eastern Region.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="p-6 rounded-xl bg-slate-900/60 border border-slate-800 hover:border-cyan-500/40 transition-colors">
            <div className="w-10 h-10 rounded-lg bg-red-500/10 border border-red-500/30 flex items-center justify-center text-red-400 mb-4">
              <ShieldAlert className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-white mb-2">Early Warning & Rapid Detection</h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              Cuts the lag between environmental risk onset and emergency advisory dissemination from hours to minutes, giving vulnerable mountain communities vital evacuation lead time.
            </p>
          </div>

          <div className="p-6 rounded-xl bg-slate-900/60 border border-slate-800 hover:border-cyan-500/40 transition-colors">
            <div className="w-10 h-10 rounded-lg bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400 mb-4">
              <Cpu className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-white mb-2">AI-Based Multi-Source Fusion</h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              Fuses high-frequency IMD precipitation, soil moisture IoT telemetry, satellite radar (ISRO Bhuvan), and DEM slope angles into hybrid predictive models.
            </p>
          </div>

          <div className="p-6 rounded-xl bg-slate-900/60 border border-slate-800 hover:border-cyan-500/40 transition-colors">
            <div className="w-10 h-10 rounded-lg bg-indigo-500/10 border border-indigo-500/30 flex items-center justify-center text-indigo-400 mb-4">
              <Sparkles className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-white mb-2">Explainable Predictions (XAI)</h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              No black-box ambiguity. The system isolates the exact driving factors—such as extreme cumulative rain or pore pressure spikes—with SHAP contribution scores for accountable decisions.
            </p>
          </div>

          <div className="p-6 rounded-xl bg-slate-900/60 border border-slate-800 hover:border-cyan-500/40 transition-colors">
            <div className="w-10 h-10 rounded-lg bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 mb-4">
              <Compass className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-white mb-2">High-Resolution GIS Mapping</h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              Interactive slope-wise susceptibility mapping covering all 8 NER states with geological fault lines, river basin toe erosion, and settlement layers.
            </p>
          </div>

          <div className="p-6 rounded-xl bg-slate-900/60 border border-slate-800 hover:border-cyan-500/40 transition-colors">
            <div className="w-10 h-10 rounded-lg bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 mb-4">
              <Layers className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-white mb-2">Critical Infrastructure Lifelines</h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              Automated proximity alerts for arterial highways (NH-6, NH-29, NH-10), railway links, bridges, and mountain district hospitals to prevent regional blockades.
            </p>
          </div>

          <div className="p-6 rounded-xl bg-slate-900/60 border border-slate-800 hover:border-cyan-500/40 transition-colors">
            <div className="w-10 h-10 rounded-lg bg-blue-500/10 border border-blue-500/30 flex items-center justify-center text-blue-400 mb-4">
              <PhoneCall className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-white mb-2">Multilingual & Offline Alerting</h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              Dispatches alerts via SMS, IVR automated voice calls in local languages (Assamese, Hindi, English), app push notifications, and community sirens with offline resilience.
            </p>
          </div>
        </div>
      </section>

      {/* How It Works: 5-Stage Technical Pipeline */}
      <section className="py-16 bg-slate-950/60 border-y border-slate-800/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-14">
            <span className="text-cyan-400 text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full bg-cyan-950/60 border border-cyan-800">
              Technical Architecture
            </span>
            <h2 className="text-3xl font-bold text-white mt-3">
              How GiriRakshak AI Works
            </h2>
            <p className="text-slate-300 text-sm mt-2">
              An end-to-end pipeline: Raw multi-source hazard data → AI predicts slope risk & confidence → Officer validates & issues alert → Integrated system drives response & governance.
            </p>
          </div>

          {/* 5-Step Pipeline Cards */}
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            {/* Step 1 */}
            <div className="relative p-5 rounded-xl bg-slate-900/80 border border-slate-800 space-y-3">
              <div className="text-xs font-bold text-cyan-400 uppercase tracking-wider font-mono">Stage 01</div>
              <h4 className="text-sm font-bold text-white">Multi-Source Ingestion</h4>
              <p className="text-[11px] text-slate-400 leading-relaxed">
                Ingests IMD rainfall intensity, IoT soil moisture sensors, Sentinel/Bhuvan satellite imagery, DEM terrain, and GSI landslide inventory.
              </p>
              <div className="pt-2 text-[10px] text-slate-500 font-mono">IMD • ISRO • GSI</div>
            </div>

            {/* Step 2 */}
            <div className="relative p-5 rounded-xl bg-slate-900/80 border border-slate-800 space-y-3">
              <div className="text-xs font-bold text-blue-400 uppercase tracking-wider font-mono">Stage 02</div>
              <h4 className="text-sm font-bold text-white">AI Modeling & Prediction</h4>
              <p className="text-[11px] text-slate-400 leading-relaxed">
                Rainfall-threshold rules combined with Random Forest, XGBoost, and LSTM time-series to calculate slope susceptibility and factor of safety.
              </p>
              <div className="pt-2 text-[10px] text-slate-500 font-mono">ML / DL Ensemble</div>
            </div>

            {/* Step 3 */}
            <div className="relative p-5 rounded-xl bg-slate-900/80 border border-cyan-500/40 bg-cyan-950/10 space-y-3 shadow-lg shadow-cyan-950/30">
              <div className="text-xs font-bold text-amber-400 uppercase tracking-wider font-mono">Stage 03</div>
              <h4 className="text-sm font-bold text-white">Human Validation Desk</h4>
              <p className="text-[11px] text-slate-400 leading-relaxed">
                Presents risk evidence, SHAP explainability, and sensor reports to District Disaster Management Officers for Approve / Hold / Escalate decisions.
              </p>
              <div className="pt-2 text-[10px] text-amber-400/80 font-mono">DM Officer In-The-Loop</div>
            </div>

            {/* Step 4 */}
            <div className="relative p-5 rounded-xl bg-slate-900/80 border border-slate-800 space-y-3">
              <div className="text-xs font-bold text-emerald-400 uppercase tracking-wider font-mono">Stage 04</div>
              <h4 className="text-sm font-bold text-white">Multi-Channel Warning</h4>
              <p className="text-[11px] text-slate-400 leading-relaxed">
                Disseminates multilingual, offline-resilient alerts via SMS, IVR automated voice calls, mobile app push, community sirens, and CAP-India.
              </p>
              <div className="pt-2 text-[10px] text-slate-500 font-mono">SMS • IVR • Siren • CAP</div>
            </div>

            {/* Step 5 */}
            <div className="relative p-5 rounded-xl bg-slate-900/80 border border-slate-800 space-y-3">
              <div className="text-xs font-bold text-indigo-400 uppercase tracking-wider font-mono">Stage 05</div>
              <h4 className="text-sm font-bold text-white">GIS & Governance Sync</h4>
              <p className="text-[11px] text-slate-400 leading-relaxed">
                SDMA/NDMA control-room integration, PWD infrastructure prioritization, crowd-sourced ground verification, and model retraining audit trails.
              </p>
              <div className="pt-2 text-[10px] text-slate-500 font-mono">SDMA • NDMA • PWD</div>
            </div>
          </div>
        </div>
      </section>

      {/* Stakeholders Section (from slide 5) */}
      <section className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <span className="text-cyan-400 text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full bg-cyan-950/60 border border-cyan-800">
            Tailored Perspectives
          </span>
          <h2 className="text-3xl font-bold text-white mt-3">
            Designed for Real Stakeholder Workflows
          </h2>
          <p className="text-slate-300 text-sm mt-2">
            Every disaster management agency receives role-optimized interfaces, actionable metrics, and clear decision support.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          <div className="p-5 rounded-xl bg-slate-900/60 border border-slate-800 flex flex-col justify-between">
            <div>
              <div className="text-xs font-bold text-cyan-400 font-mono mb-1">STAKEHOLDER 01</div>
              <h4 className="text-sm font-bold text-white mb-2">District Administration</h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                Local high-risk zones, active alerts, district infrastructure, evacuation shelter capacities, and administrative advisory issuance.
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-slate-800 text-[11px] text-cyan-400 font-medium">
              DDMA / Deputy Commissioner
            </div>
          </div>

          <div className="p-5 rounded-xl bg-slate-900/60 border border-slate-800 flex flex-col justify-between">
            <div>
              <div className="text-xs font-bold text-blue-400 font-mono mb-1">STAKEHOLDER 02</div>
              <h4 className="text-sm font-bold text-white mb-2">SDMA / NDMA</h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                Inter-state regional risk overview, cross-district comparison, statewide resource allocation, and macro disaster trend forecasts.
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-slate-800 text-[11px] text-blue-400 font-medium">
              State & National Command
            </div>
          </div>

          <div className="p-5 rounded-xl bg-slate-900/60 border border-slate-800 flex flex-col justify-between">
            <div>
              <div className="text-xs font-bold text-amber-400 font-mono mb-1">STAKEHOLDER 03</div>
              <h4 className="text-sm font-bold text-white mb-2">PWD / Infrastructure</h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                Infrastructure near high-risk slopes, highway blockage alerts, bridge scour health, and clearing equipment staging priorities.
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-slate-800 text-[11px] text-amber-400 font-medium">
              PWD • NHIDCL • BRO
            </div>
          </div>

          <div className="p-5 rounded-xl bg-slate-900/60 border border-slate-800 flex flex-col justify-between">
            <div>
              <div className="text-xs font-bold text-red-400 font-mono mb-1">STAKEHOLDER 04</div>
              <h4 className="text-sm font-bold text-white mb-2">Emergency Responders</h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                Critical warning coordinates, search and rescue staging areas, viable access corridors, and field team deployment status.
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-slate-800 text-[11px] text-red-400 font-medium">
              NDRF • SDRF • Fire Services
            </div>
          </div>

          <div className="p-5 rounded-xl bg-slate-900/60 border border-slate-800 flex flex-col justify-between">
            <div>
              <div className="text-xs font-bold text-emerald-400 font-mono mb-1">STAKEHOLDER 05</div>
              <h4 className="text-sm font-bold text-white mb-2">Policy Makers</h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                Long-term risk mitigation ROI, regional hazard mapping, zoning regulations, climate resilience funding, and infrastructure master planning.
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-slate-800 text-[11px] text-emerald-400 font-medium">
              MDoNER • Planning Boards
            </div>
          </div>
        </div>
      </section>

      {/* Research & References Section (from slide 6) */}
      <section className="py-12 bg-slate-950/80 border-t border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 pb-8 border-b border-slate-800">
            <div>
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-cyan-400" />
                <span>Authoritative Research Grounding & Datasets</span>
              </h3>
              <p className="text-xs text-slate-400 mt-1">
                Grounded in official National Disaster Management Authority (NDMA) guidelines and Geological Survey of India frameworks.
              </p>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={onOpenDashboard}
                className="px-4 py-2 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-slate-950 text-xs font-bold shadow transition-colors"
              >
                Access Command Dashboard
              </button>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 pt-6 text-xs text-slate-400">
            <div>
              <div className="font-semibold text-slate-200 mb-1">Operational Mandate</div>
              <p className="text-[11px]">Landslide Risk Monitoring & Early Warning</p>
              <p className="text-[10px] text-slate-500">North Eastern Region (NER)</p>
            </div>
            <div>
              <div className="font-semibold text-slate-200 mb-1">Precipitation Inputs</div>
              <p className="text-[11px]">IMD Gridded & Station Data</p>
              <p className="text-[10px] text-slate-500">Hourly & 24h Telemetry</p>
            </div>
            <div>
              <div className="font-semibold text-slate-200 mb-1">Landslide Inventory</div>
              <p className="text-[11px]">Geological Survey of India</p>
              <p className="text-[10px] text-slate-500">NLSM 1:50k Mapping</p>
            </div>
            <div>
              <div className="font-semibold text-slate-200 mb-1">Satellite Feeds</div>
              <p className="text-[11px]">ISRO Bhuvan Geoportal</p>
              <p className="text-[10px] text-slate-500">Sentinel-1/2 & Cartosat</p>
            </div>
            <div>
              <div className="font-semibold text-slate-200 mb-1">Disaster Framework</div>
              <p className="text-[11px]">NDMA Guidelines</p>
              <p className="text-[10px] text-slate-500">Landslide Risk Mgmt</p>
            </div>
            <div>
              <div className="font-semibold text-slate-200 mb-1">AI Decision Architecture</div>
              <p className="text-[11px] text-cyan-300 font-semibold">GiriRakshak Intelligence Core</p>
              <p className="text-[10px] text-slate-500">Multi-Model Ensemble + LLM</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
