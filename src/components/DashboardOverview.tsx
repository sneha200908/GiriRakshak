import React, { useState } from 'react';
import { 
  ShieldAlert, 
  AlertTriangle, 
  MapPin, 
  Radio, 
  Layers, 
  RefreshCw, 
  Clock, 
  ArrowUpRight, 
  CheckCircle2, 
  Activity, 
  TrendingUp,
  Cpu,
  Droplets,
  Wind,
  Compass,
  FileText,
  ChevronRight,
  Eye,
  SlidersHorizontal,
  Sparkles,
  Mountain,
  ArrowRight,
  Info,
  TrendingDown
} from 'lucide-react';
import { LocationZone, EarlyWarningAlert, RiskLevel } from '../types';
import { getRiskColor, getAlertStateBadge } from '../utils/formatters';
import { RiskGauge } from './RiskGauge';
import { WhatChangedCard } from './WhatChangedCard';
import { useDisaster } from '../context/DisasterContext';
import { useTheme } from '../context/ThemeContext';
import { DataQualityBadge, SourceInfoButton, SourceProvenanceModal } from './SourceProvenanceModal';

interface DashboardOverviewProps {
  zones: LocationZone[];
  alerts: EarlyWarningAlert[];
  onSelectZone: (zone: LocationZone) => void;
  onOpenMap: () => void;
  onOpenWarnings: () => void;
  onOpenAssessment: (zone?: LocationZone) => void;
  onOpenInfrastructure: () => void;
  onOpenReports: () => void;
}

export const DashboardOverview: React.FC<DashboardOverviewProps> = ({
  zones,
  alerts,
  onSelectZone,
  onOpenMap,
  onOpenWarnings,
  onOpenAssessment,
  onOpenInfrastructure,
  onOpenReports
}) => {
  const { 
    regionalRiskStatus, 
    riskTrend, 
    whatChanged, 
    criticalAlertCount,
    activeAlertCount,
    highRiskZoneCount,
    mediumRiskZoneCount,
    lowRiskZoneCount,
    exposedInfrastructureCount,
    riskForecast
  } = useDisaster();

  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme === 'dark';

  const [isRefreshing, setIsRefreshing] = useState(false);
  const [lastRefreshedTime, setLastRefreshedTime] = useState('Just now');
  const [selectedStateFilter, setSelectedStateFilter] = useState<string>('All');
  const [activeMapLayer, setActiveMapLayer] = useState<'risk' | 'rain' | 'infra'>('risk');

  // Provenance modal state
  const [modalOpen, setModalOpen] = useState(false);
  const [modalSourceKey, setModalSourceKey] = useState('IMD');

  const openSource = (key: string) => {
    setModalSourceKey(key);
    setModalOpen(true);
  };

  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      setIsRefreshing(false);
      setLastRefreshedTime('Just now (Live IoT sync)');
    }, 600);
  };

  const states = ['All', 'Assam', 'Meghalaya', 'Sikkim', 'Nagaland', 'Mizoram', 'Arunachal Pradesh', 'Manipur', 'Tripura'];

  const filteredZones = selectedStateFilter === 'All' 
    ? zones 
    : zones.filter(z => z.state === selectedStateFilter);

  // Highest priority zone
  const highestRiskZone = [...zones].sort((a, b) => b.riskScore - a.riskScore)[0];

  return (
    <div className="space-y-6 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      {/* COMMAND CENTER OPERATIONAL STATUS STRIP */}
      <div className="flex flex-wrap items-center justify-between gap-2.5 px-4 py-2.5 rounded-xl bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 shadow-sm text-xs">
        <div className="flex items-center gap-3 flex-wrap font-mono">
          <div className="flex items-center gap-1.5 text-emerald-700 dark:text-emerald-400 font-bold">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>LIVE CONNECTED</span>
          </div>
          <span className="text-slate-300 dark:text-slate-600">|</span>
          <button 
            onClick={onOpenWarnings}
            className="flex items-center gap-1 text-red-700 dark:text-red-400 font-bold hover:underline"
          >
            <span>🔴 {criticalAlertCount.toString().padStart(2, '0')} Critical</span>
          </button>
          <span className="text-slate-300 dark:text-slate-600">•</span>
          <button 
            onClick={onOpenWarnings}
            className="flex items-center gap-1 text-amber-700 dark:text-amber-400 font-bold hover:underline"
          >
            <span>🟠 12 Warning</span>
          </button>
          <span className="text-slate-300 dark:text-slate-600">•</span>
          <button 
            onClick={onOpenWarnings}
            className="flex items-center gap-1 text-yellow-700 dark:text-yellow-400 font-bold hover:underline"
          >
            <span>🟡 27 Watch</span>
          </button>
          <span className="text-slate-300 dark:text-slate-600">•</span>
          <div className="flex items-center gap-1 text-cyan-800 dark:text-cyan-300 font-medium">
            <Droplets className="w-3.5 h-3.5 text-cyan-600 dark:text-cyan-400" />
            <span>18 High Rainfall Sectors</span>
          </div>
          <span className="text-slate-300 dark:text-slate-600">•</span>
          <div className="flex items-center gap-1 text-purple-800 dark:text-purple-300 font-medium">
            <Mountain className="w-3.5 h-3.5 text-purple-600 dark:text-purple-400" />
            <span>{highRiskZoneCount} High-Risk Zones</span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={onOpenMap}
            className="px-3 py-1 rounded-lg bg-cyan-600 dark:bg-cyan-500 hover:bg-cyan-500 text-white dark:text-slate-950 font-bold flex items-center gap-1 transition-colors shadow-sm"
          >
            <MapPin className="w-3.5 h-3.5" />
            <span>Open Live Risk Map →</span>
          </button>
        </div>
      </div>

      {/* 1. HERO REGIONAL RISK STATUS & ACTION HEADER */}
      <div className="rounded-2xl bg-gradient-to-r from-blue-50/80 via-white to-slate-50 dark:from-slate-900 dark:via-[#07132e] dark:to-slate-900 border border-slate-200 dark:border-slate-800/80 shadow-md dark:shadow-2xl p-6 relative overflow-hidden">
        {/* Subtle background grid */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#0e1e3f_1px,transparent_1px),linear-gradient(to_bottom,#0e1e3f_1px,transparent_1px)] bg-[size:24px_24px] opacity-5 dark:opacity-15 pointer-events-none" />

        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
          {/* Left: Title, Scope, Live Status */}
          <div className="space-y-2 max-w-2xl">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="px-2.5 py-0.5 rounded-full text-xs font-bold uppercase tracking-wider bg-red-100 dark:bg-red-500/20 text-red-800 dark:text-red-300 border border-red-300 dark:border-red-500/40 flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-red-500 animate-ping" />
                <span>REGIONAL STATUS: {regionalRiskStatus}</span>
              </span>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-mono bg-cyan-100 dark:bg-cyan-950 text-cyan-900 dark:text-cyan-300 border border-cyan-300 dark:border-cyan-800 font-semibold">
                8 NER States Monitored
              </span>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-mono bg-emerald-100 dark:bg-emerald-500/10 text-emerald-900 dark:text-emerald-400 border border-emerald-300 dark:border-emerald-500/30 font-semibold">
                AI Confidence: 94.2%
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
              North Eastern Disaster Intelligence Command
            </h1>
            <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
              Multi-source real-time early warning fusing high-frequency Doppler radar precipitation, in-situ piezometric pore pressure, and InSAR satellite interferometric slope kinematic displacement.
            </p>

            <div className="flex items-center gap-2 pt-1 text-xs text-slate-600 dark:text-slate-400 font-mono">
              <Clock className="w-3.5 h-3.5 text-slate-500" />
              <span>Telemetry sync: <strong className="text-slate-900 dark:text-slate-200 font-bold">{lastRefreshedTime}</strong></span>
              <span>•</span>
              <span>Active Sector: <strong className="text-cyan-700 dark:text-cyan-300 font-bold">{highestRiskZone ? `${highestRiskZone.name} (${highestRiskZone.riskScore}/100)` : 'NER Grid'}</strong></span>
            </div>
          </div>

          {/* Center/Right: Hero Circular Regional Risk Gauge */}
          <div className="flex items-center gap-6 bg-white dark:bg-slate-950/60 p-4 rounded-2xl border border-slate-200 dark:border-slate-800/80 shadow-md dark:shadow-inner flex-shrink-0">
            <div className="flex flex-col items-center">
              <div className="text-[11px] font-mono uppercase tracking-wider text-slate-600 dark:text-slate-400 font-bold mb-1">
                Regional Risk Index
              </div>
              <RiskGauge
                score={74}
                confidence={94}
                trend={riskTrend}
                size="md"
                showDetails={true}
              />
              <div className="mt-1 flex items-center gap-1.5 text-xs font-bold text-red-600 dark:text-red-400">
                <TrendingUp className="w-3.5 h-3.5" />
                <span>↑ 13 from previous period • Risk is increasing</span>
              </div>
            </div>

            <div className="hidden sm:flex flex-col gap-2 border-l border-slate-200 dark:border-slate-800/80 pl-4 text-xs">
              <div className="space-y-0.5">
                <div className="text-slate-600 dark:text-slate-400 text-[11px] font-medium">Primary Driver</div>
                <div className="font-bold text-slate-900 dark:text-white">Precipitation Surge</div>
              </div>
              <div className="space-y-0.5">
                <div className="text-slate-600 dark:text-slate-400 text-[11px] font-medium">Critical Lifeline</div>
                <div className="font-bold text-amber-700 dark:text-amber-300">NH-6 Meghalaya Sector</div>
              </div>
              <button
                onClick={onOpenWarnings}
                className="mt-1 px-3 py-1.5 rounded-lg bg-red-600 hover:bg-red-500 text-white font-bold text-xs shadow-md shadow-red-900/40 flex items-center justify-center gap-1 transition-colors"
              >
                <span>Dispatch Advisory</span>
                <ChevronRight className="w-3 h-3" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* 2. FIVE HIGH-VALUE KEY METRIC CARDS */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3.5">
        {/* Active Alerts */}
        <div 
          onClick={onOpenWarnings}
          className="p-4 rounded-2xl bg-white dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 hover:border-amber-500/50 transition-all cursor-pointer group shadow-sm dark:shadow-lg"
        >
          <div className="flex items-center justify-between text-xs text-slate-600 dark:text-slate-400">
            <span className="font-bold uppercase tracking-wider text-[11px]">Active Alerts</span>
            <AlertTriangle className="w-4 h-4 text-amber-600 dark:text-amber-400 group-hover:scale-110 transition-transform" />
          </div>
          <div className="text-3xl font-black font-mono text-amber-700 dark:text-amber-300 mt-2">
            {activeAlertCount}
          </div>
          <div className="flex items-center justify-between text-[11px] text-slate-600 dark:text-slate-400 mt-1">
            <span>+3 new alerts (6h)</span>
            <span className="text-cyan-700 dark:text-cyan-400 font-semibold group-hover:underline">Review ↗</span>
          </div>
        </div>

        {/* Critical Zones */}
        <div 
          onClick={onOpenMap}
          className="p-4 rounded-2xl bg-red-50/70 dark:bg-red-950/20 border border-red-200 dark:border-red-500/40 hover:border-red-400 dark:hover:border-red-500/60 transition-all cursor-pointer group shadow-sm dark:shadow-lg"
        >
          <div className="flex items-center justify-between text-xs text-red-700 dark:text-red-400">
            <span className="font-bold uppercase tracking-wider text-[11px]">Critical Zones</span>
            <span className="w-2.5 h-2.5 rounded-full bg-red-600 animate-ping" />
          </div>
          <div className="text-3xl font-black font-mono text-red-700 dark:text-red-400 mt-2">
            {highRiskZoneCount}
          </div>
          <div className="flex items-center justify-between text-[11px] text-red-800 dark:text-red-300/80 mt-1">
            <span className="truncate">Sohra, Haflong, Chungthang</span>
            <span className="text-red-700 dark:text-red-400 font-semibold group-hover:underline">Map ↗</span>
          </div>
        </div>

        {/* Monitored Zones */}
        <div 
          onClick={onOpenMap}
          className="p-4 rounded-2xl bg-white dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 hover:border-cyan-500/50 transition-all cursor-pointer group shadow-sm dark:shadow-lg"
        >
          <div className="flex items-center justify-between text-xs text-slate-600 dark:text-slate-400">
            <span className="font-bold uppercase tracking-wider text-[11px]">Monitored Zones</span>
            <MapPin className="w-4 h-4 text-cyan-600 dark:text-cyan-400 group-hover:scale-110 transition-transform" />
          </div>
          <div className="text-3xl font-black font-mono text-slate-900 dark:text-white mt-2">
            103
          </div>
          <div className="flex items-center justify-between text-[11px] text-slate-600 dark:text-slate-400 mt-1">
            <span>Across 8 NER States</span>
            <span className="text-cyan-700 dark:text-cyan-400 font-semibold">100% Online</span>
          </div>
        </div>

        {/* Infrastructure Exposed */}
        <div 
          onClick={onOpenInfrastructure}
          className="p-4 rounded-2xl bg-white dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 hover:border-amber-500/50 transition-all cursor-pointer group shadow-sm dark:shadow-lg"
        >
          <div className="flex items-center justify-between text-xs text-slate-600 dark:text-slate-400">
            <span className="font-bold uppercase tracking-wider text-[11px]">Infrastructure Exposed</span>
            <Layers className="w-4 h-4 text-amber-600 dark:text-amber-400 group-hover:scale-110 transition-transform" />
          </div>
          <div className="text-3xl font-black font-mono text-amber-700 dark:text-amber-400 mt-2">
            {exposedInfrastructureCount} Lifelines
          </div>
          <div className="flex items-center justify-between text-[11px] text-slate-600 dark:text-slate-400 mt-1">
            <span>NH-6, NH-27, NFR Rail</span>
            <span className="text-amber-700 dark:text-amber-400 font-semibold group-hover:underline">Lifelines ↗</span>
          </div>
        </div>

        {/* Average Regional Risk */}
        <div 
          onClick={() => onOpenAssessment()}
          className="p-4 rounded-2xl bg-white dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 hover:border-purple-500/50 transition-all cursor-pointer group shadow-sm dark:shadow-lg"
        >
          <div className="flex items-center justify-between text-xs text-slate-600 dark:text-slate-400">
            <span className="font-bold uppercase tracking-wider text-[11px]">Average Risk</span>
            <Cpu className="w-4 h-4 text-purple-600 dark:text-purple-400 group-hover:scale-110 transition-transform" />
          </div>
          <div className="text-3xl font-black font-mono text-purple-800 dark:text-purple-300 mt-2">
            64 <span className="text-sm font-normal text-slate-500 dark:text-slate-400">/ 100</span>
          </div>
          <div className="flex items-center justify-between text-[11px] text-slate-600 dark:text-slate-400 mt-1">
            <span className="text-orange-700 dark:text-orange-400 font-medium">Elevated (Monsoon)</span>
            <span className="text-purple-700 dark:text-purple-400 font-semibold group-hover:underline">Analyst ↗</span>
          </div>
        </div>
      </div>

      {/* 3. MAIN WORKSPACE GRID: Left (Map Centerpiece & Grouped Environmental) + Right (What Changed & AI Summary) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* LEFT COLUMN (7 COLS): Interactive GIS Map Centerpiece + Grouped Conditions */}
        <div className="lg:col-span-7 space-y-6">
          {/* Interactive GIS Map Centerpiece */}
          <div className="p-5 rounded-2xl bg-white dark:bg-slate-900/90 border border-slate-200 dark:border-slate-800 shadow-md dark:shadow-xl space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
              <div>
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-cyan-600 dark:text-cyan-400" />
                  <h2 className="text-base font-bold text-slate-900 dark:text-white">Interactive Regional Risk Map</h2>
                  <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-cyan-100 dark:bg-cyan-950 text-cyan-800 dark:text-cyan-300 border border-cyan-300 dark:border-cyan-800 font-semibold">
                    NER GIS
                  </span>
                </div>
                <p className="text-xs text-slate-600 dark:text-slate-400 mt-0.5">
                  Click on any monitored hazard sector node to view granular telemetry and trigger AI synthesis.
                </p>
              </div>

              {/* State Filter Pills */}
              <div className="flex items-center gap-1 overflow-x-auto pb-1 max-w-full no-scrollbar">
                {states.slice(0, 5).map(st => (
                  <button
                    key={st}
                    onClick={() => setSelectedStateFilter(st)}
                    className={`px-2.5 py-1 rounded-lg text-xs font-bold whitespace-nowrap transition-colors ${
                      selectedStateFilter === st
                        ? 'bg-cyan-600 dark:bg-cyan-500 text-white dark:text-slate-950 shadow-sm'
                        : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 border border-slate-200 dark:border-transparent'
                    }`}
                  >
                    {st}
                  </button>
                ))}
              </div>
            </div>

            {/* Interactive GIS Preview Canvas */}
            <div className="relative w-full h-80 sm:h-96 rounded-xl bg-slate-100 dark:bg-[#060c1d] border border-slate-200 dark:border-slate-800 overflow-hidden select-none">
              {/* Floating Layer Controls */}
              <div className="absolute top-3 left-3 z-10 flex items-center gap-1.5 bg-white/95 dark:bg-slate-950/90 p-1 rounded-xl border border-slate-200 dark:border-slate-800/80 backdrop-blur-sm shadow-sm">
                <button
                  onClick={() => setActiveMapLayer('risk')}
                  className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-colors ${
                    activeMapLayer === 'risk' ? 'bg-cyan-600 dark:bg-cyan-500 text-white dark:text-slate-950 shadow' : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  Risk Susceptibility
                </button>
                <button
                  onClick={() => setActiveMapLayer('rain')}
                  className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-colors ${
                    activeMapLayer === 'rain' ? 'bg-blue-600 text-white shadow' : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  Isohyet Rainfall
                </button>
                <button
                  onClick={() => setActiveMapLayer('infra')}
                  className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-colors ${
                    activeMapLayer === 'infra' ? 'bg-amber-600 dark:bg-amber-500 text-white dark:text-slate-950 shadow' : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  Arterial Lifelines
                </button>
              </div>

              {/* Floating Expand Full GIS Button */}
              <button
                onClick={onOpenMap}
                className="absolute top-3 right-3 z-10 flex items-center gap-1 px-3 py-1.5 rounded-xl bg-white/95 dark:bg-slate-900/90 hover:bg-slate-100 dark:hover:bg-slate-800 text-cyan-800 dark:text-cyan-300 text-xs font-bold border border-cyan-300 dark:border-cyan-500/30 backdrop-blur-sm shadow-md transition-all"
              >
                <span>Full Map Console</span>
                <ArrowUpRight className="w-3.5 h-3.5" />
              </button>

              {/* SVG Vector Map Rendering */}
              <svg viewBox="0 0 1000 650" className="w-full h-full">
                {/* State Polygons */}
                <path d="M 120 180 Q 220 120 380 150 Q 520 130 680 160 Q 720 220 620 260 Q 420 250 280 280 Q 180 260 120 180 Z" fill={isDark ? "#0f1933" : "#f1f5f9"} stroke={isDark ? "#1e2c4f" : "#cbd5e1"} strokeWidth="2" />
                <path d="M 280 280 Q 400 270 480 290 Q 490 350 420 380 Q 340 370 280 340 Z" fill={isDark ? "#0c234a" : "#e2e8f0"} stroke={isDark ? "#2563eb" : "#94a3b8"} strokeWidth="1.5" />
                <path d="M 80 120 Q 140 100 160 140 Q 140 200 90 190 Q 70 150 80 120 Z" fill={isDark ? "#0f1933" : "#f1f5f9"} stroke={isDark ? "#1e2c4f" : "#cbd5e1"} strokeWidth="1.5" />
                <path d="M 520 280 Q 590 270 610 320 Q 580 370 530 350 Z" fill={isDark ? "#0f1933" : "#f1f5f9"} stroke={isDark ? "#1e2c4f" : "#cbd5e1"} strokeWidth="1.5" />
                <path d="M 480 360 Q 540 360 550 430 Q 510 460 470 430 Z" fill={isDark ? "#0f1933" : "#f1f5f9"} stroke={isDark ? "#1e2c4f" : "#cbd5e1"} strokeWidth="1.5" />
                <path d="M 430 420 Q 480 430 470 510 Q 430 520 420 470 Z" fill={isDark ? "#0f1933" : "#f1f5f9"} stroke={isDark ? "#1e2c4f" : "#cbd5e1"} strokeWidth="1.5" />

                {/* State Labels */}
                <text x="240" y="220" fill={isDark ? "#64748b" : "#475569"} fontSize="13" fontWeight="bold">ASSAM</text>
                <text x="350" y="330" fill={isDark ? "#38bdf8" : "#0284c7"} fontSize="13" fontWeight="bold">MEGHALAYA</text>
                <text x="110" y="160" fill={isDark ? "#64748b" : "#475569"} fontSize="11" fontWeight="bold">SIKKIM</text>
                <text x="545" y="320" fill={isDark ? "#64748b" : "#475569"} fontSize="12" fontWeight="bold">NAGALAND</text>
                <text x="500" y="400" fill={isDark ? "#64748b" : "#475569"} fontSize="12" fontWeight="bold">MANIPUR</text>
                <text x="440" y="470" fill={isDark ? "#64748b" : "#475569"} fontSize="12" fontWeight="bold">MIZORAM</text>
                <text x="550" y="180" fill={isDark ? "#64748b" : "#475569"} fontSize="12" fontWeight="bold">ARUNACHAL</text>

                {/* Rainfall Overlay if active */}
                {activeMapLayer === 'rain' && (
                  <>
                    <circle cx="360" cy="330" r="70" fill="#38bdf8" fillOpacity={isDark ? "0.25" : "0.35"} />
                    <circle cx="490" cy="370" r="55" fill="#38bdf8" fillOpacity={isDark ? "0.2" : "0.3"} />
                  </>
                )}

                {/* Arterial Lifeline if active */}
                {(activeMapLayer === 'infra' || activeMapLayer === 'risk') && (
                  <>
                    <path d="M 330 250 L 360 300 L 410 340 L 490 380 L 530 450" fill="none" stroke="#d97706" strokeWidth="3" strokeDasharray="6,3" />
                    <text x="420" y="350" fill="#b45309" fontSize="10" fontWeight="bold" fontFamily="monospace">NH-6 Lifeline</text>
                  </>
                )}

                {/* Zone Markers */}
                {filteredZones.map(zone => {
                  const cx = zone.coordinates.x * 10;
                  const cy = zone.coordinates.y * 6.5;
                  const isHigh = zone.riskLevel === 'HIGH';
                  let pinColor = isDark ? '#10b981' : '#15803d';
                  if (zone.riskScore > 80) pinColor = isDark ? '#ef4444' : '#b91c1c';
                  else if (zone.riskLevel === 'HIGH') pinColor = isDark ? '#f97316' : '#c2410c';
                  else if (zone.riskLevel === 'MEDIUM') pinColor = isDark ? '#eab308' : '#b45309';

                  return (
                    <g
                      key={zone.id}
                      onClick={() => onSelectZone(zone)}
                      className="cursor-pointer transition-transform hover:scale-125"
                    >
                      {isHigh && (
                        <circle cx={cx} cy={cy} r="14" fill={pinColor} fillOpacity={isDark ? "0.3" : "0.25"} className="animate-ping" />
                      )}
                      <circle cx={cx} cy={cy} r="8" fill={pinColor} stroke="#ffffff" strokeWidth="1.5" />
                      <text 
                        x={cx + 10} 
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

              {/* Floating Compact Map Legend */}
              <div className="absolute bottom-3 right-3 p-2.5 rounded-xl bg-white/95 dark:bg-slate-900/90 border border-slate-200 dark:border-slate-800 text-[11px] font-mono space-y-1 backdrop-blur-sm shadow-md">
                <div className="flex items-center gap-1.5 text-red-700 dark:text-red-400 font-bold">
                  <span className="w-2.5 h-2.5 rounded-full bg-red-600 animate-pulse" />
                  <span>Critical (80+)</span>
                </div>
                <div className="flex items-center gap-1.5 text-orange-700 dark:text-orange-400 font-bold">
                  <span className="w-2.5 h-2.5 rounded-full bg-orange-500" />
                  <span>High Risk (61-79)</span>
                </div>
                <div className="flex items-center gap-1.5 text-amber-700 dark:text-amber-300 font-bold">
                  <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
                  <span>Medium Risk (31-60)</span>
                </div>
                <div className="flex items-center gap-1.5 text-emerald-700 dark:text-emerald-400 font-bold">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-600" />
                  <span>Normal (0-30)</span>
                </div>
              </div>
            </div>
          </div>

          {/* Grouped Environmental Conditions Block with Source-Aware Data Cards */}
          <div className="p-5 rounded-2xl bg-white dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 shadow-md dark:shadow-xl space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Activity className="w-4 h-4 text-cyan-600 dark:text-cyan-400" />
                <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider">Authoritative Environmental Indicators</h3>
              </div>
              <div className="flex items-center gap-2">
                <DataQualityBadge type="OBSERVED" size="sm" />
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-100 dark:bg-emerald-500/10 text-emerald-800 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-500/30 font-semibold">
                  IMD, NASA & GSI Feeds
                </span>
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
              <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-[#071126] border border-slate-200 dark:border-slate-800 space-y-1 relative group">
                <div className="flex items-center justify-between text-slate-600 dark:text-slate-400 text-[11px]">
                  <span className="flex items-center gap-1 font-medium">
                    <Droplets className="w-3.5 h-3.5 text-cyan-600 dark:text-cyan-400" />
                    <span>Rainfall (IMD AWS)</span>
                  </span>
                  <SourceInfoButton onClick={() => openSource('IMD')} />
                </div>
                <div className="text-xl font-bold font-mono text-cyan-700 dark:text-cyan-400">184.6 mm</div>
                <div className="text-[10px] text-red-700 dark:text-red-400 font-semibold">Exceeds 150mm Threshold</div>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-[#071126] border border-slate-200 dark:border-slate-800 space-y-1 relative group">
                <div className="flex items-center justify-between text-slate-600 dark:text-slate-400 text-[11px]">
                  <span className="flex items-center gap-1 font-medium">
                    <Radio className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
                    <span>SMAP Soil Moisture</span>
                  </span>
                  <SourceInfoButton onClick={() => openSource('NASA')} label="SMAP" />
                </div>
                <div className="text-xl font-bold font-mono text-amber-700 dark:text-amber-400">89.4%</div>
                <div className="text-[10px] text-amber-700 dark:text-amber-300 font-semibold">Pore Pressure Saturated</div>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-[#071126] border border-slate-200 dark:border-slate-800 space-y-1 relative group">
                <div className="flex items-center justify-between text-slate-600 dark:text-slate-400 text-[11px]">
                  <span className="flex items-center gap-1 font-medium">
                    <TrendingUp className="w-3.5 h-3.5 text-red-600 dark:text-red-400" />
                    <span>Kinematic Movement</span>
                  </span>
                  <SourceInfoButton onClick={() => openSource('GSI')} label="InSAR" />
                </div>
                <div className="text-xl font-bold font-mono text-red-700 dark:text-red-400">4.8 mm/d</div>
                <div className="text-[10px] text-slate-600 dark:text-slate-400 font-medium">InSAR Kinematic Shear</div>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-[#071126] border border-slate-200 dark:border-slate-800 space-y-1 relative group">
                <div className="flex items-center justify-between text-slate-600 dark:text-slate-400 text-[11px]">
                  <span className="flex items-center gap-1 font-medium">
                    <Mountain className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
                    <span>NASA DEM Stability</span>
                  </span>
                  <SourceInfoButton onClick={() => openSource('NASA')} label="DEM" />
                </div>
                <div className="text-xl font-bold font-mono text-slate-900 dark:text-white">FoS: 0.94</div>
                <div className="text-[10px] text-red-700 dark:text-red-400 font-semibold">Slope 38° • Unstable (&lt; 1.0)</div>
              </div>
            </div>
          </div>

          {/* AI RISK FORECAST HORIZONS (+6h, +12h, +24h) */}
          <div className="p-5 rounded-2xl bg-white dark:bg-slate-900/90 border border-slate-200 dark:border-slate-800 shadow-md dark:shadow-xl space-y-3.5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-cyan-600 dark:text-cyan-400" />
                <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider">
                  Predictive Landslide Risk Forecast
                </h3>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-cyan-100 dark:bg-cyan-950 text-cyan-800 dark:text-cyan-300 border border-cyan-300 dark:border-cyan-800 font-semibold">
                  NUMERICAL MODEL FORECAST
                </span>
              </div>
              <span className="text-[10px] text-slate-500 dark:text-slate-400 font-mono">
                IMD GFS Ensemble + Limit Equilibrium
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {riskForecast.map((item, idx) => {
                const isCrit = item.projectedRiskScore >= 80;
                const isWarn = item.projectedRiskScore >= 60 && item.projectedRiskScore < 80;
                return (
                  <div 
                    key={idx}
                    className={`p-3.5 rounded-xl border space-y-2 relative overflow-hidden ${
                      isCrit 
                        ? 'bg-red-50/70 dark:bg-red-950/20 border-red-200 dark:border-red-500/40' 
                        : isWarn 
                        ? 'bg-amber-50/70 dark:bg-amber-950/20 border-amber-200 dark:border-amber-500/40' 
                        : 'bg-slate-50/70 dark:bg-slate-950/50 border-slate-200 dark:border-slate-800'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-mono font-extrabold text-sm text-cyan-700 dark:text-cyan-300">
                        {item.offset} Horizon
                      </span>
                      <span className={`px-2 py-0.5 rounded text-[10px] font-black uppercase ${
                        isCrit 
                          ? 'bg-red-100 dark:bg-red-500/30 text-red-800 dark:text-red-300' 
                          : isWarn 
                          ? 'bg-amber-100 dark:bg-amber-500/30 text-amber-800 dark:text-amber-300' 
                          : 'bg-emerald-100 dark:bg-emerald-500/30 text-emerald-800 dark:text-emerald-300'
                      }`}>
                        {isCrit ? 'CRITICAL' : isWarn ? 'WARNING' : 'WATCH'}
                      </span>
                    </div>

                    <div className="flex items-baseline justify-between">
                      <div>
                        <span className="text-[10px] text-slate-500 dark:text-slate-400 block font-medium">Projected Risk</span>
                        <span className="text-2xl font-black font-mono text-slate-900 dark:text-white">
                          {item.projectedRiskScore}
                          <span className="text-xs text-slate-500 dark:text-slate-400 font-normal">/100</span>
                        </span>
                      </div>
                      <span className="text-[10px] font-mono text-slate-500 dark:text-slate-400">
                        Uncertainty: {item.uncertainty}
                      </span>
                    </div>

                    <div className="space-y-1 text-[11px] pt-1 border-t border-slate-200 dark:border-slate-800/80">
                      <div className="flex justify-between text-slate-700 dark:text-slate-300">
                        <span className="text-slate-500 dark:text-slate-400 font-medium">Rainfall:</span>
                        <span className="font-mono text-cyan-700 dark:text-cyan-300 font-semibold">+{item.projectedRainfallMm.toFixed(1)} mm</span>
                      </div>
                      <div className="flex justify-between text-slate-700 dark:text-slate-300">
                        <span className="text-slate-500 dark:text-slate-400 font-medium">Soil Moisture:</span>
                        <span className="font-mono text-amber-700 dark:text-amber-300 font-semibold">{item.projectedSoilMoisturePct.toFixed(1)}%</span>
                      </div>
                      <div className="flex justify-between text-slate-700 dark:text-slate-300">
                        <span className="text-slate-500 dark:text-slate-400 font-medium">Kinematic Creep:</span>
                        <span className="font-mono text-red-700 dark:text-red-400 font-semibold">{item.projectedGroundMovementMm.toFixed(1)} mm/d</span>
                      </div>
                    </div>

                    <div className="p-2 rounded bg-white dark:bg-slate-950/80 border border-slate-200 dark:border-slate-800/60 text-[10px] text-slate-700 dark:text-slate-300 leading-snug">
                      <strong>Confidence:</strong> {item.modelConfidence}% • Projected for {item.time}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN (5 COLS): What Changed? + Distinctive AI Summary + Priority Alerts */}
        <div className="lg:col-span-5 space-y-6">
          {/* Prominent "What Changed?" Card */}
          <WhatChangedCard
            data={whatChanged}
            onOpenAssessment={() => onOpenAssessment(highestRiskZone)}
          />

          {/* Distinctive ✦ AI Summary Card */}
          <div className="p-5 rounded-2xl bg-gradient-to-br from-cyan-50/80 via-blue-50/50 to-white dark:from-[#0c1f44] dark:via-[#091530] dark:to-slate-900 border border-cyan-200 dark:border-cyan-500/40 shadow-md dark:shadow-xl space-y-3.5">
            <div className="flex items-center justify-between pb-2 border-b border-cyan-200 dark:border-cyan-500/20">
              <div className="flex items-center gap-2">
                <div className="p-1.5 rounded-lg bg-cyan-100 dark:bg-cyan-500/20 text-cyan-700 dark:text-cyan-300">
                  <Sparkles className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                    <span>AI Regional Intelligence Summary</span>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-cyan-100 dark:bg-cyan-950 text-cyan-800 dark:text-cyan-300 border border-cyan-300 dark:border-cyan-800 font-semibold">
                      GiriRakshak LLM
                    </span>
                  </h3>
                </div>
              </div>
              <span className="text-[10px] font-mono text-cyan-700 dark:text-cyan-400 font-bold">Real-time</span>
            </div>

            <div className="space-y-2 text-xs leading-relaxed text-slate-700 dark:text-slate-200">
              <p>
                <strong className="text-slate-900 dark:text-white">Why is this area at risk?</strong> Heavy orographic precipitation (184.6mm/24h) coupled with high antecedent saturation (89.4%) has driven pore water pressures past the critical threshold in the Sohra Escarpment and Dima Hasao corridors.
              </p>
              <p>
                <strong className="text-slate-900 dark:text-white">Infrastructure Impact:</strong> NH-6 Shillong–Silchar Lifeline is at heightened risk of debris flows along KM 124–138. Sonapur Tunnel flank shows 4.8 mm/d slope creep.
              </p>
            </div>

            <div className="p-3 rounded-xl bg-cyan-100/60 dark:bg-slate-950/80 border border-cyan-300 dark:border-cyan-500/30 text-xs text-slate-900 dark:text-cyan-300 flex items-start gap-2">
              <ShieldAlert className="w-4 h-4 text-cyan-700 dark:text-cyan-400 flex-shrink-0 mt-0.5" />
              <div>
                <strong className="text-cyan-900 dark:text-cyan-200">Immediate Decision-Support Protocol:</strong> Pre-alert East Khasi Hills DEOC; station BRO heavy earthmovers at Sonapur; enforce one-way convoy restrictions for heavy freight during night hours.
              </div>
            </div>

            <div className="pt-1 flex items-center justify-between">
              <span className="text-[10px] text-slate-600 dark:text-slate-400 italic font-medium">
                *Advisory decision support for authorized Disaster Management Officers.
              </span>
              <button
                onClick={() => onOpenAssessment(highestRiskZone)}
                className="text-xs font-bold text-cyan-700 dark:text-cyan-400 hover:text-cyan-800 dark:hover:text-cyan-300 flex items-center gap-1"
              >
                <span>Deep XAI Attribution</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Active Priority Alerts List */}
          <div className="p-5 rounded-2xl bg-white dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 shadow-md dark:shadow-xl space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-amber-600 dark:text-amber-400" />
                <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider">Priority Early Warnings</h3>
                <span className="px-2 py-0.5 rounded-full text-xs font-mono font-bold bg-amber-100 dark:bg-amber-500/20 text-amber-800 dark:text-amber-300 border border-amber-200 dark:border-transparent">
                  {alerts.length}
                </span>
              </div>
              <button
                onClick={onOpenWarnings}
                className="text-xs font-bold text-cyan-700 dark:text-cyan-400 hover:text-cyan-800 dark:hover:text-cyan-300 flex items-center gap-1"
              >
                <span>All Alerts</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="space-y-2.5">
              {alerts.slice(0, 3).map((alert) => {
                const badge = getAlertStateBadge(alert.alertState);
                return (
                  <div
                    key={alert.id}
                    onClick={onOpenWarnings}
                    className="p-3 rounded-xl bg-slate-50 dark:bg-[#071126] border border-slate-200 dark:border-slate-800 hover:border-cyan-500/50 transition-all cursor-pointer group shadow-sm"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${badge.bg}`}>
                          {alert.alertState}
                        </span>
                        <span className="text-xs font-bold text-slate-900 dark:text-white group-hover:text-cyan-700 dark:group-hover:text-cyan-300 transition-colors">
                          {alert.location}
                        </span>
                      </div>
                      <span className="text-xs font-mono font-bold text-red-700 dark:text-red-400">
                        {alert.riskScore}/100
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-700 dark:text-slate-300 mt-1 line-clamp-1 font-medium">
                      {alert.trigger}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Authoritative Source Provenance Inspection Modal */}
      <SourceProvenanceModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        sourceKey={modalSourceKey}
      />
    </div>
  );
};
