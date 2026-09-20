import React, { useState } from 'react';
import { 
  Siren, 
  ShieldAlert, 
  AlertTriangle, 
  MapPin, 
  TrendingUp, 
  Activity, 
  Layers, 
  Truck, 
  Download, 
  Play, 
  RotateCcw, 
  FileText, 
  ExternalLink,
  ChevronRight,
  Droplets,
  Radio,
  Clock,
  Sparkles,
  CheckCircle2,
  X
} from 'lucide-react';
import { useDisaster } from '../context/DisasterContext';
import { useTheme } from '../context/ThemeContext';
import { RiskGauge } from './RiskGauge';
import { WhatChangedCard } from './WhatChangedCard';
import { MobileEmergencyView } from './MobileEmergencyView';
import { LocationZone } from '../types';

interface SituationRoomProps {
  onOpenMap: () => void;
  onOpenWarnings: () => void;
  onOpenAssessment: (zone?: LocationZone) => void;
  onOpenInfrastructure: () => void;
  onOpenReports: () => void;
}

export const SituationRoom: React.FC<SituationRoomProps> = ({
  onOpenMap,
  onOpenWarnings,
  onOpenAssessment,
  onOpenInfrastructure,
  onOpenReports
}) => {
  const { 
    zones, 
    alerts, 
    infrastructure, 
    selectedZone, 
    setSelectedZoneId, 
    regionalRiskStatus, 
    riskTrend,
    criticalAlertCount, 
    activeAlertCount, 
    highRiskZoneCount, 
    mediumRiskZoneCount, 
    lowRiskZoneCount, 
    exposedInfrastructureCount,
    whatChanged,
    runScenario,
    currentScenario
  } = useDisaster();

  // Dynamically sorted priority zones based on riskScore
  const priorityZones = [...zones].sort((a, b) => b.riskScore - a.riskScore);

  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme === 'dark';

  const getStatusBadge = () => {
    switch (regionalRiskStatus) {
      case 'CRITICAL':
        return {
          bg: isDark ? 'bg-red-500/20 text-red-300 border-red-500/50' : 'bg-red-100 text-red-800 border-red-300 font-bold',
          dot: 'bg-red-500 animate-ping',
          text: '🔴 REGIONAL STATUS: CRITICAL RISK'
        };
      case 'ELEVATED':
        return {
          bg: isDark ? 'bg-orange-500/20 text-orange-300 border-orange-500/50' : 'bg-orange-100 text-orange-800 border-orange-300 font-bold',
          dot: 'bg-orange-500 animate-pulse',
          text: '🟠 REGIONAL STATUS: ELEVATED RISK'
        };
      case 'WATCH':
        return {
          bg: isDark ? 'bg-amber-500/20 text-amber-300 border-amber-500/50' : 'bg-amber-100 text-amber-800 border-amber-300 font-bold',
          dot: 'bg-amber-500',
          text: '🟡 REGIONAL STATUS: MONSOON WATCH'
        };
      default:
        return {
          bg: isDark ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/50' : 'bg-emerald-100 text-emerald-800 border-emerald-300 font-bold',
          dot: 'bg-emerald-500',
          text: '🟢 REGIONAL STATUS: NORMAL BASELINE'
        };
    }
  };

  const status = getStatusBadge();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      {/* Top Situation Room Command Banner */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-red-50/90 via-white to-rose-50/90 dark:from-slate-900 dark:via-[#120924] dark:to-slate-900 border border-red-200 dark:border-red-500/30 shadow-md dark:shadow-2xl space-y-4">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2 flex-wrap">
              <span className={`px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider border flex items-center gap-1.5 ${status.bg}`}>
                <span className={`w-2 h-2 rounded-full ${status.dot}`} />
                <span>{status.text}</span>
              </span>
              <span className="text-xs font-mono text-slate-600 dark:text-slate-400 font-medium">
                GiriRakshak NER Situation Room • Multi-Agency Ops
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight flex items-center gap-2">
              <Siren className="w-7 h-7 text-red-600 dark:text-red-400 animate-pulse" />
              <span>North Eastern Landslide Situation Room</span>
            </h1>
            <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 max-w-3xl leading-relaxed">
              Real-time regional intelligence aggregating high-frequency meteorological radar, satellite InSAR ground displacement, and geotechnical piezometer telemetry across 8 North Eastern States.
            </p>
          </div>

          {/* Quick Scenario Controls inside Situation Room */}
          <div className="flex flex-wrap items-center gap-2 flex-shrink-0">
            <button
              id="sitroom-cloudburst-btn"
              onClick={() => runScenario('heavy_rainfall')}
              className="px-3.5 py-2 rounded-xl bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 text-white text-xs font-bold shadow-lg shadow-red-600/30 flex items-center gap-1.5 transition-all hover:scale-105 active:scale-95"
            >
              <Play className="w-3.5 h-3.5 fill-current" />
              <span>Simulate Cloudburst</span>
            </button>

            <button
              id="sitroom-recovery-btn"
              onClick={() => runScenario('recovery')}
              className="px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold shadow-md shadow-emerald-600/20 flex items-center gap-1.5 transition-all"
            >
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Simulate Recovery</span>
            </button>

            <button
              id="sitroom-report-btn"
              onClick={onOpenReports}
              className="px-3.5 py-2 rounded-xl bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 text-xs font-bold border border-slate-300 dark:border-slate-700 flex items-center gap-1.5 transition-colors shadow-xs"
            >
              <FileText className="w-3.5 h-3.5 text-cyan-600 dark:text-cyan-400" />
              <span>Situation Report</span>
            </button>
          </div>
        </div>

        {/* Real-time KPI Metric Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-7 gap-3 pt-2 border-t border-slate-200 dark:border-slate-800/80">
          <div className="p-3 rounded-xl bg-white dark:bg-slate-950/80 border border-slate-200 dark:border-slate-800 shadow-xs">
            <div className="text-[11px] text-slate-700 dark:text-slate-400 font-bold">Active Alerts</div>
            <div className="text-xl font-black font-mono text-cyan-700 dark:text-cyan-300 mt-0.5">{activeAlertCount}</div>
            <div className="text-[10px] text-slate-500 font-mono">CAP-India Sync</div>
          </div>

          <div className="p-3 rounded-xl bg-white dark:bg-slate-950/80 border border-slate-200 dark:border-slate-800 shadow-xs">
            <div className="text-[11px] text-slate-700 dark:text-slate-400 font-bold">Critical Alerts</div>
            <div className="text-xl font-black font-mono text-red-700 dark:text-red-400 mt-0.5">{criticalAlertCount}</div>
            <div className="text-[10px] text-red-600 dark:text-red-400/80 font-mono font-bold">Immediate Action</div>
          </div>

          <div className="p-3 rounded-xl bg-white dark:bg-slate-950/80 border border-slate-200 dark:border-slate-800 shadow-xs">
            <div className="text-[11px] text-slate-700 dark:text-slate-400 font-bold">High-Risk Zones</div>
            <div className="text-xl font-black font-mono text-orange-700 dark:text-orange-400 mt-0.5">{highRiskZoneCount}</div>
            <div className="text-[10px] text-slate-500 font-mono">Score &gt; 60</div>
          </div>

          <div className="p-3 rounded-xl bg-white dark:bg-slate-950/80 border border-slate-200 dark:border-slate-800 shadow-xs">
            <div className="text-[11px] text-slate-700 dark:text-slate-400 font-bold">Medium-Risk Zones</div>
            <div className="text-xl font-black font-mono text-amber-700 dark:text-amber-300 mt-0.5">{mediumRiskZoneCount}</div>
            <div className="text-[10px] text-slate-500 font-mono">Score 31-60</div>
          </div>

          <div className="p-3 rounded-xl bg-white dark:bg-slate-950/80 border border-slate-200 dark:border-slate-800 shadow-xs">
            <div className="text-[11px] text-slate-700 dark:text-slate-400 font-bold">Low-Risk Zones</div>
            <div className="text-xl font-black font-mono text-emerald-700 dark:text-emerald-400 mt-0.5">{lowRiskZoneCount}</div>
            <div className="text-[10px] text-slate-500 font-mono">Score 0-30</div>
          </div>

          <div className="p-3 rounded-xl bg-white dark:bg-slate-950/80 border border-slate-200 dark:border-slate-800 shadow-xs">
            <div className="text-[11px] text-slate-700 dark:text-slate-400 font-bold">Exposed Arteries</div>
            <div className="text-xl font-black font-mono text-amber-700 dark:text-amber-400 mt-0.5">{exposedInfrastructureCount}</div>
            <div className="text-[10px] text-slate-500 font-mono">Roads & Bridges</div>
          </div>

          <div className="p-3 rounded-xl bg-white dark:bg-slate-950/80 border border-slate-200 dark:border-slate-800 shadow-xs">
            <div className="text-[11px] text-slate-700 dark:text-slate-400 font-bold">Risk Trend</div>
            <div className={`text-base font-black font-mono mt-0.5 ${
              riskTrend === 'INCREASING' ? 'text-red-700 dark:text-red-400' : riskTrend === 'DECREASING' ? 'text-emerald-700 dark:text-emerald-400' : 'text-slate-800 dark:text-slate-300'
            }`}>
              {riskTrend === 'INCREASING' ? '↑ RISING' : riskTrend === 'DECREASING' ? '↓ FALLING' : '→ STABLE'}
            </div>
            <div className="text-[10px] text-slate-500 font-mono">Slope Saturation</div>
          </div>
        </div>
      </div>

      {/* Mobile Emergency Quick View (Displayed exclusively on mobile viewports) */}
      <div className="block lg:hidden">
        <MobileEmergencyView
          onOpenMap={onOpenMap}
          onOpenAlerts={onOpenWarnings}
          onOpenReports={onOpenReports}
        />
      </div>

      {/* Main 2-Column Command Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Live Risk Map & What Changed (7 Cols) */}
        <div className="lg:col-span-7 space-y-6">
          {/* Situation Room Interactive GIS Overview Map */}
          <div className="p-5 rounded-2xl bg-white dark:bg-slate-900/90 border border-slate-200 dark:border-slate-800 shadow-md dark:shadow-xl space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <MapPin className="w-5 h-5 text-cyan-600 dark:text-cyan-400" />
                <h3 className="text-base font-bold text-slate-900 dark:text-white">Live Regional GIS Risk Map</h3>
              </div>
              <button
                onClick={onOpenMap}
                className="text-xs font-bold text-cyan-700 dark:text-cyan-400 hover:text-cyan-900 dark:hover:text-cyan-300 flex items-center gap-1"
              >
                <span>Full Map Console</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Interactive Vector GIS Canvas */}
            <div className="relative w-full h-80 sm:h-96 rounded-xl bg-slate-100 dark:bg-[#050b1a] border border-slate-200 dark:border-slate-800 overflow-hidden flex items-center justify-center">
              <svg viewBox="0 0 1000 650" className="w-full h-full select-none">
                {/* State Outlines */}
                <path d="M 120 180 Q 220 120 380 150 Q 520 130 680 160 Q 720 220 620 260 Q 420 250 280 280 Q 180 260 120 180 Z" fill={isDark ? "#0f172a" : "#f1f5f9"} stroke={isDark ? "#1e293b" : "#cbd5e1"} strokeWidth="2" />
                <path d="M 280 280 Q 400 270 480 290 Q 490 350 420 380 Q 340 370 280 340 Z" fill={isDark ? "#0c1a36" : "#e2e8f0"} stroke={isDark ? "#334155" : "#94a3b8"} strokeWidth="1.5" />
                <path d="M 80 120 Q 140 100 160 140 Q 140 200 90 190 Q 70 150 80 120 Z" fill={isDark ? "#0f172a" : "#f1f5f9"} stroke={isDark ? "#334155" : "#cbd5e1"} strokeWidth="1.5" />
                <path d="M 520 280 Q 590 270 610 320 Q 580 370 530 350 Z" fill={isDark ? "#0f172a" : "#f1f5f9"} stroke={isDark ? "#334155" : "#cbd5e1"} strokeWidth="1.5" />
                <path d="M 480 360 Q 540 360 550 430 Q 510 460 470 430 Z" fill={isDark ? "#0f172a" : "#f1f5f9"} stroke={isDark ? "#334155" : "#cbd5e1"} strokeWidth="1.5" />
                <path d="M 430 420 Q 480 430 470 510 Q 430 520 420 470 Z" fill={isDark ? "#0f172a" : "#f1f5f9"} stroke={isDark ? "#334155" : "#cbd5e1"} strokeWidth="1.5" />

                {/* State Label Callouts */}
                <text x="240" y="220" fill={isDark ? "#64748b" : "#475569"} fontSize="13" fontWeight="bold">ASSAM</text>
                <text x="350" y="330" fill={isDark ? "#38bdf8" : "#0284c7"} fontSize="13" fontWeight="bold">MEGHALAYA</text>
                <text x="110" y="160" fill={isDark ? "#64748b" : "#475569"} fontSize="11" fontWeight="bold">SIKKIM</text>
                <text x="545" y="320" fill={isDark ? "#64748b" : "#475569"} fontSize="12" fontWeight="bold">NAGALAND</text>
                <text x="500" y="400" fill={isDark ? "#64748b" : "#475569"} fontSize="12" fontWeight="bold">MANIPUR</text>
                <text x="440" y="470" fill={isDark ? "#64748b" : "#475569"} fontSize="12" fontWeight="bold">MIZORAM</text>
                <text x="550" y="180" fill={isDark ? "#64748b" : "#475569"} fontSize="12" fontWeight="bold">ARUNACHAL</text>

                {/* Major Arterial Roads */}
                <path d="M 330 250 L 360 300 L 410 340 L 490 380 L 530 450" fill="none" stroke="#d97706" strokeWidth="3" strokeDasharray="6,3" />
                <text x="430" y="355" fill="#b45309" fontSize="10" fontWeight="bold" fontFamily="monospace">NH-6 Lifeline</text>

                {/* Zone Points */}
                {zones.map((zone) => {
                  const cx = zone.coordinates.x * 10;
                  const cy = zone.coordinates.y * 6.5;
                  const isSelected = selectedZone?.id === zone.id;
                  const isHigh = zone.riskLevel === 'HIGH';

                  let pinColor = isDark ? '#10b981' : '#15803d';
                  if (zone.riskScore > 80) pinColor = isDark ? '#ef4444' : '#b91c1c';
                  else if (zone.riskLevel === 'HIGH') pinColor = isDark ? '#f97316' : '#c2410c';
                  else if (zone.riskLevel === 'MEDIUM') pinColor = isDark ? '#eab308' : '#b45309';

                  return (
                    <g 
                      key={zone.id}
                      onClick={() => setSelectedZoneId(zone.id)}
                      className="cursor-pointer transition-transform hover:scale-125"
                    >
                      {/* Pulse circle for high risk */}
                      {isHigh && (
                        <circle cx={cx} cy={cy} r={isSelected ? "22" : "15"} fill={pinColor} fillOpacity="0.25" className="animate-ping" />
                      )}

                      {/* Main node */}
                      <circle 
                        cx={cx} 
                        cy={cy} 
                        r={isSelected ? "11" : "8"} 
                        fill={pinColor} 
                        stroke="#ffffff" 
                        strokeWidth={isSelected ? "3" : "1.5"} 
                      />

                      {/* Label */}
                      <text 
                        x={cx + 12} 
                        y={cy + 4} 
                        fill={isDark ? "#ffffff" : "#0f172a"} 
                        fontSize="11" 
                        fontWeight="bold" 
                        fontFamily="monospace"
                        filter={isDark ? "drop-shadow(0 2px 4px rgba(0,0,0,0.8))" : "drop-shadow(0 1px 2px rgba(255,255,255,0.9))"}
                      >
                        {zone.name.split(' ')[0]} ({zone.riskScore})
                      </text>
                    </g>
                  );
                })}
              </svg>

              {/* Map Legend */}
              <div className="absolute bottom-3 right-3 p-2.5 rounded-xl bg-white/95 dark:bg-slate-900/90 border border-slate-200 dark:border-slate-800 text-[11px] font-mono space-y-1 backdrop-blur-sm shadow-md">
                <div className="flex items-center gap-1.5 text-red-700 dark:text-red-400 font-bold">
                  <span className="w-2.5 h-2.5 rounded-full bg-red-600 animate-pulse" />
                  <span>High Risk (&gt;60)</span>
                </div>
                <div className="flex items-center gap-1.5 text-amber-700 dark:text-amber-300 font-bold">
                  <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
                  <span>Medium Risk (31-60)</span>
                </div>
                <div className="flex items-center gap-1.5 text-emerald-700 dark:text-emerald-400 font-bold">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-600" />
                  <span>Low Risk (0-30)</span>
                </div>
              </div>
            </div>
          </div>

          {/* Live "What Changed?" Card Component */}
          <WhatChangedCard 
            data={whatChanged} 
            onOpenAssessment={() => onOpenAssessment(selectedZone || undefined)} 
          />
        </div>

        {/* Right Column: Top Priority Areas & Zone Profile (5 Cols) */}
        <div className="lg:col-span-5 space-y-6">
          {/* Selected Zone Deep Profile Card */}
          {selectedZone && (
            <div className="p-5 rounded-2xl bg-white dark:bg-slate-900/95 border border-slate-200 dark:border-slate-800 shadow-md dark:shadow-xl space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800">
                <div>
                  <div className="text-[10px] font-mono uppercase tracking-wider text-cyan-700 dark:text-cyan-400 font-bold">
                    Zone Risk Profile • {selectedZone.id}
                  </div>
                  <h3 className="text-base font-bold text-slate-900 dark:text-white mt-0.5">
                    {selectedZone.name}
                  </h3>
                  <div className="text-xs text-slate-600 dark:text-slate-400">
                    {selectedZone.district}, {selectedZone.state}
                  </div>
                </div>

                <button
                  onClick={() => onOpenAssessment(selectedZone)}
                  className="px-2.5 py-1 rounded-lg bg-cyan-100 dark:bg-cyan-950 text-cyan-800 dark:text-cyan-300 border border-cyan-300 dark:border-cyan-800 text-xs font-semibold hover:bg-cyan-200 dark:hover:bg-cyan-900"
                >
                  View Full XAI
                </button>
              </div>

              {/* Gauge Display */}
              <div className="py-2">
                <RiskGauge 
                  score={selectedZone.riskScore}
                  confidence={selectedZone.aiConfidence}
                  trend={riskTrend}
                  size="md"
                />
              </div>

              {/* Why is this area at risk? */}
              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-950/80 border border-slate-200 dark:border-slate-800/80 space-y-1">
                <div className="text-[11px] font-bold uppercase tracking-wider text-slate-700 dark:text-slate-400 flex items-center gap-1">
                  <Sparkles className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
                  <span>Why is this area at risk?</span>
                </div>
                <p className="text-xs text-slate-800 dark:text-slate-200 leading-relaxed">
                  {selectedZone.aiPrediction}
                </p>
              </div>

              {/* Primary Risk Contributors */}
              <div className="space-y-1.5 text-xs">
                <div className="text-[11px] font-bold text-slate-700 dark:text-slate-400 uppercase tracking-wider">
                  Primary Hydro-Geological Contributors:
                </div>
                <div className="space-y-1">
                  {selectedZone.primaryRiskFactors.map((factor, i) => (
                    <div key={i} className="flex items-start gap-1.5 text-slate-700 dark:text-slate-300">
                      <span className="text-red-600 dark:text-red-400 font-bold">•</span>
                      <span className="text-[11px] leading-relaxed">{factor}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Critical Infrastructure Exposure */}
              <div className="p-3 rounded-xl bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-500/30 text-xs text-amber-900 dark:text-amber-200 space-y-1">
                <span className="text-[10px] font-bold uppercase tracking-wider text-amber-800 dark:text-amber-400 block">
                  Exposed Infrastructure Corridor:
                </span>
                <p className="text-[11px] font-medium text-amber-950 dark:text-amber-200">{selectedZone.infrastructureNearby.join(' • ')}</p>
                <div className="text-[10px] text-slate-600 dark:text-slate-400 pt-1">
                  Action: {selectedZone.recommendedAction}
                </div>
              </div>
            </div>
          )}

          {/* Top Priority Monitored Sectors (Ranked Dynamically) */}
          <div className="p-5 rounded-2xl bg-white dark:bg-slate-900/90 border border-slate-200 dark:border-slate-800 shadow-md dark:shadow-xl space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <ShieldAlert className="w-4 h-4 text-red-600 dark:text-red-400" />
                <h3 className="text-sm font-bold text-slate-900 dark:text-white">Top Priority Hazard Sectors</h3>
              </div>
              <span className="text-[10px] font-mono text-slate-600 dark:text-slate-400">
                Sorted by AI Hazard Score
              </span>
            </div>

            <div className="space-y-2 max-h-80 overflow-y-auto pr-1">
              {priorityZones.map((zone, idx) => {
                const isSelected = selectedZone?.id === zone.id;
                const isCritical = zone.riskScore > 80;

                return (
                  <div
                    key={zone.id}
                    onClick={() => setSelectedZoneId(zone.id)}
                    className={`p-3 rounded-xl border transition-all cursor-pointer flex items-center justify-between ${
                      isSelected
                        ? 'bg-cyan-50 dark:bg-cyan-950/40 border-cyan-500 dark:border-cyan-500/70 shadow-xs'
                        : isCritical
                        ? 'bg-red-50/70 dark:bg-red-950/20 border-red-200 dark:border-red-500/30 hover:border-red-400 dark:hover:border-red-500/60'
                        : 'bg-slate-50 dark:bg-slate-950/60 border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-6 h-6 rounded-lg flex items-center justify-center text-xs font-mono font-bold ${
                        idx === 0 ? 'bg-red-600 text-white' : idx === 1 ? 'bg-amber-600 text-white' : 'bg-slate-200 dark:bg-slate-800 text-slate-800 dark:text-slate-300'
                      }`}>
                        #{idx + 1}
                      </div>
                      <div>
                        <div className="text-xs font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                          <span>{zone.name}</span>
                          {isCritical && (
                            <span className="px-1.5 py-0.2 rounded text-[9px] font-bold bg-red-100 dark:bg-red-950 text-red-800 dark:text-red-300 border border-red-300 dark:border-red-800">
                              CRITICAL
                            </span>
                          )}
                        </div>
                        <div className="text-[10px] text-slate-600 dark:text-slate-400">
                          {zone.district}, {zone.state}
                        </div>
                      </div>
                    </div>

                    <div className="text-right">
                      <div className={`text-sm font-black font-mono ${
                        isCritical ? 'text-red-700 dark:text-red-400' : zone.riskLevel === 'HIGH' ? 'text-orange-700 dark:text-orange-400' : 'text-amber-700 dark:text-amber-400'
                      }`}>
                        {zone.riskScore}
                        <span className="text-[10px] text-slate-500 font-normal">/100</span>
                      </div>
                      <div className="text-[10px] text-slate-600 dark:text-slate-400 font-mono">
                        Rain: {zone.rainfall24h} mm
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
