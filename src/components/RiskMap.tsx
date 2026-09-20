import React, { useState, useEffect, useMemo, useRef } from 'react';
import { 
  MapPin, 
  Layers, 
  Search, 
  ZoomIn, 
  ZoomOut, 
  RotateCcw, 
  ShieldAlert, 
  Droplets, 
  TrendingUp, 
  Mountain, 
  Radio, 
  X, 
  AlertTriangle, 
  CheckCircle2, 
  ChevronRight, 
  Info, 
  ExternalLink, 
  Cpu, 
  Database, 
  History,
  Sparkles,
  Play,
  Pause,
  RefreshCw,
  Columns,
  Maximize2,
  Minimize2,
  Clock,
  Navigation,
  Eye
} from 'lucide-react';
import { LocationZone, EarlyWarningAlert, MapMode, MapRefreshInterval, AIControlledAction } from '../types';
import { useTheme } from '../context/ThemeContext';
import { useDisaster } from '../context/DisasterContext';
import { GSI_LANDSLIDE_INVENTORY, NASA_DEM_PROFILES } from '../data/authoritativeData';
import { GSILandslideEvent } from '../types/dataIntelligence';
import { DataQualityBadge, SourceInfoButton, SourceProvenanceModal } from './SourceProvenanceModal';
import { 
  DEFAULT_MAP_LAYERS, 
  MapLayerConfig, 
  INITIAL_MAP_EVENTS, 
  clusterAlerts, 
  MapCluster 
} from '../services/mapStateService';
import { MapControlBar } from './map/MapControlBar';
import { MapLayerDrawer } from './map/MapLayerDrawer';
import { AlertDetailDrawer } from './map/AlertDetailDrawer';
import { MapEventStream } from './map/MapEventStream';
import { AskAIModal } from './map/AskAIModal';

interface RiskMapProps {
  zones: LocationZone[];
  selectedZone: LocationZone | null;
  onSelectZone: (zone: LocationZone | null) => void;
  onOpenAssessment: (zone: LocationZone) => void;
  onOpenAlerts: (zone: LocationZone) => void;
  onOpenAIAssistantWithPrompt?: (prompt: string, zone?: LocationZone) => void;
  isCompact?: boolean;
}

export const RiskMap: React.FC<RiskMapProps> = ({
  zones,
  selectedZone,
  onSelectZone,
  onOpenAssessment,
  onOpenAlerts,
  onOpenAIAssistantWithPrompt,
  isCompact = false
}) => {
  const { resolvedTheme } = useTheme();
  const { alerts, currentScenario } = useDisaster();

  // Map Mode: LIVE, HISTORICAL, SIMULATION
  const [mapMode, setMapMode] = useState<MapMode>('LIVE');
  const [refreshInterval, setRefreshInterval] = useState<MapRefreshInterval>('30s');
  const [lastUpdatedTime, setLastUpdatedTime] = useState<string>('12:42:18 IST');
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);
  const [refreshCountdown, setRefreshCountdown] = useState<number>(30);

  // Filters & Zoom
  const [filterState, setFilterState] = useState<string>('All');
  const [filterRisk, setFilterRisk] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [zoomLevel, setZoomLevel] = useState<number>(1);
  const [panOffset, setPanOffset] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);

  // GIS Layers State
  const [layers, setLayers] = useState<MapLayerConfig>(DEFAULT_MAP_LAYERS);

  // Drawers & Modals
  const [isLayerDrawerOpen, setIsLayerDrawerOpen] = useState<boolean>(false);
  const [isEventStreamOpen, setIsEventStreamOpen] = useState<boolean>(false);
  const [isAskAIOpen, setIsAskAIOpen] = useState<boolean>(false);
  const [selectedAlertForDrawer, setSelectedAlertForDrawer] = useState<EarlyWarningAlert | null>(null);

  // Compare Mode
  const [isCompareActive, setIsCompareActive] = useState<boolean>(false);
  const [compareSplitPosition, setCompareSplitPosition] = useState<number>(50); // %

  // Historical Timeline (2019-2026)
  const [historicalYear, setHistoricalYear] = useState<number | 'ALL'>('ALL');
  const [isHistoryPlaying, setIsHistoryPlaying] = useState<boolean>(false);
  const [selectedHistoricalEvent, setSelectedHistoricalEvent] = useState<GSILandslideEvent | null>(null);

  // Alert Marker Popup State
  const [activeAlertPopup, setActiveAlertPopup] = useState<EarlyWarningAlert | null>(null);

  // Authoritative Source Modal
  const [modalOpen, setModalOpen] = useState<boolean>(false);
  const [modalSourceKey, setModalSourceKey] = useState<string>('GSI');

  // Real-time Event Stream
  const [eventStream, setEventStream] = useState(INITIAL_MAP_EVENTS);

  // Refresh interval timer
  useEffect(() => {
    if (mapMode !== 'LIVE' || refreshInterval === 'manual') return;

    const intervalSeconds = refreshInterval === '30s' ? 30 : refreshInterval === '1m' ? 60 : 300;
    setRefreshCountdown(intervalSeconds);

    const timer = setInterval(() => {
      setRefreshCountdown(prev => {
        if (prev <= 1) {
          triggerRefresh();
          return intervalSeconds;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [mapMode, refreshInterval]);

  // Historical scrubber player
  useEffect(() => {
    if (!isHistoryPlaying || mapMode !== 'HISTORICAL') return;

    const years = [2019, 2020, 2021, 2022, 2023, 2024, 2025, 2026];
    const timer = setInterval(() => {
      setHistoricalYear(prev => {
        if (prev === 'ALL' || prev >= 2026) return 2019;
        return (prev + 1) as number;
      });
    }, 1800);

    return () => clearInterval(timer);
  }, [isHistoryPlaying, mapMode]);

  const triggerRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      const now = new Date();
      const timeStr = now.toTimeString().split(' ')[0] + ' IST';
      setLastUpdatedTime(timeStr);
      setIsRefreshing(false);
    }, 600);
  };

  const handleToggleLayer = (key: keyof MapLayerConfig) => {
    setLayers(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  const handleChangeRainfallOpacity = (val: number) => {
    setLayers(prev => ({
      ...prev,
      rainfallOpacity: val
    }));
  };

  const openSourceModal = (key: string) => {
    setModalSourceKey(key);
    setModalOpen(true);
  };

  // Controlled AI Action Executor
  const handleExecuteControlledAction = (action: AIControlledAction) => {
    switch (action.type) {
      case 'FOCUS_LOCATION': {
        const targetZone = zones.find(z => z.id === action.payload.zoneId);
        if (targetZone) {
          onSelectZone(targetZone);
          setZoomLevel(1.5);
          // Center on target zone
          const targetX = (targetZone.coordinates.x / 100) * 1000;
          const targetY = (targetZone.coordinates.y / 100) * 700;
          setPanOffset({ x: 500 - targetX, y: 350 - targetY });
        }
        break;
      }
      case 'SHOW_LAYER': {
        if (action.payload.layer in layers) {
          setLayers(prev => ({ ...prev, [action.payload.layer]: true }));
        }
        break;
      }
      case 'HIDE_LAYER': {
        if (action.payload.layer in layers) {
          setLayers(prev => ({ ...prev, [action.payload.layer]: false }));
        }
        break;
      }
      case 'FILTER_RISK_LEVEL': {
        setFilterRisk(action.payload.riskLevel);
        break;
      }
      case 'COMPARE_LOCATIONS': {
        setIsCompareActive(true);
        break;
      }
      default:
        break;
    }
  };

  // Convert lat/long to SVG 1000x700
  const projectCoordinates = (lat: number, lng: number) => {
    const x = ((lng - 88.0) / (97.5 - 88.0)) * 880 + 60;
    const y = ((29.5 - lat) / (29.5 - 21.5)) * 580 + 60;
    return { x, y };
  };

  const states = ['All', 'Assam', 'Meghalaya', 'Sikkim', 'Nagaland', 'Mizoram', 'Arunachal Pradesh', 'Manipur', 'Tripura'];

  // Filtered zones
  const filteredZones = useMemo(() => {
    return zones.filter(z => {
      const matchesState = filterState === 'All' || z.state === filterState;
      const matchesRisk = filterRisk === 'All' || z.riskLevel === filterRisk;
      const matchesSearch = searchQuery === '' || 
        z.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
        z.district.toLowerCase().includes(searchQuery.toLowerCase()) ||
        z.state.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesState && matchesRisk && matchesSearch;
    });
  }, [zones, filterState, filterRisk, searchQuery]);

  // Filtered GSI Historical Events
  const displayedLandslides = useMemo(() => {
    return GSI_LANDSLIDE_INVENTORY.filter(ev => {
      const matchesYear = historicalYear === 'ALL' || ev.year === historicalYear;
      const matchesState = filterState === 'All' || ev.state === filterState;
      return matchesYear && matchesState;
    });
  }, [historicalYear, filterState]);

  // Filtered Alerts & Clustering
  const filteredAlerts = useMemo(() => {
    return alerts.filter(a => {
      if (a.status === 'Resolved' && !layers.resolvedAlerts) return false;
      if (a.alertState === 'Critical' && !layers.criticalAlerts) return false;
      if (a.alertState === 'Warning' && !layers.warningAlerts) return false;
      if (a.alertState === 'Watch' && !layers.watchAlerts) return false;
      if (filterState !== 'All' && a.state !== filterState) return false;
      return true;
    });
  }, [alerts, layers, filterState]);

  // Clusters computation (threshold 45px)
  const { clusters, singleAlerts } = useMemo(() => {
    if (zoomLevel > 1.4) {
      // Unfold all clusters when zoomed in
      return { clusters: [], singleAlerts: filteredAlerts };
    }
    return clusterAlerts(filteredAlerts, zones, 45);
  }, [filteredAlerts, zones, zoomLevel]);

  // Reset View
  const handleResetView = () => {
    setZoomLevel(1);
    setPanOffset({ x: 0, y: 0 });
    onSelectZone(null);
    setActiveAlertPopup(null);
  };

  // Colors based on theme
  const isDark = resolvedTheme === 'dark';
  const mapBgColor = isDark ? '#070e22' : '#eaf0f8';
  const gridColor = isDark ? '#101e40' : '#cbd5e1';
  const stateStrokeColor = isDark ? '#1e3a8a' : '#94a3b8';
  const stateTextColor = isDark ? '#93c5fd' : '#1e3a8a';
  const contourColor = isDark ? '#38bdf8' : '#64748b';

  return (
    <div className={`relative w-full ${isFullscreen ? 'fixed inset-0 z-50 h-screen' : isCompact ? 'h-[500px]' : 'h-[calc(100vh-115px)] min-h-[680px]'} bg-[var(--bg-app)] overflow-hidden flex flex-col select-none`}>
      
      {/* 1. TOP REAL-TIME DATA TELEMETRY & CONTROL BAR */}
      <div className="z-30 px-3 py-2 bg-slate-900/90 dark:bg-slate-900/95 border-b border-slate-800 backdrop-blur-md flex flex-wrap items-center justify-between gap-2.5 text-xs">
        
        {/* Left: Search & State Filter */}
        <div className="flex items-center gap-2 flex-wrap">
          {/* Search Input */}
          <div className="relative">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search zone, district, hill, or alert..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-8 pr-3 py-1 rounded-lg bg-slate-950 border border-slate-700 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-cyan-500 w-44 sm:w-56"
            />
            {searchQuery && (
              <button 
                onClick={() => setSearchQuery('')}
                className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
              >
                <X className="w-3 h-3" />
              </button>
            )}
          </div>

          {/* State Filter Dropdown */}
          <select
            value={filterState}
            onChange={(e) => setFilterState(e.target.value)}
            className="px-2.5 py-1 rounded-lg bg-slate-950 border border-slate-700 text-xs text-slate-200 focus:outline-none focus:border-cyan-500"
          >
            {states.map(st => (
              <option key={st} value={st}>{st === 'All' ? 'All 8 NER States' : st}</option>
            ))}
          </select>

          {/* Risk Filter Pill */}
          <select
            value={filterRisk}
            onChange={(e) => setFilterRisk(e.target.value)}
            className="px-2.5 py-1 rounded-lg bg-slate-950 border border-slate-700 text-xs text-slate-200 focus:outline-none focus:border-cyan-500"
          >
            <option value="All">All Risk Levels</option>
            <option value="HIGH">🔴 High Risk Only</option>
            <option value="MEDIUM">🟠 Medium Risk</option>
            <option value="LOW">🟢 Low Risk</option>
          </select>
        </div>

        {/* Center: Real-Time Data Status Indicator */}
        <div className="flex items-center gap-2 px-3 py-1 rounded-xl bg-slate-950/80 border border-slate-800 text-[11px] font-mono">
          {mapMode === 'LIVE' ? (
            <div className="flex items-center gap-1.5 text-emerald-400 font-bold">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
              <span>DATA LIVE</span>
            </div>
          ) : mapMode === 'HISTORICAL' ? (
            <div className="flex items-center gap-1.5 text-amber-400 font-bold">
              <History className="w-3.5 h-3.5" />
              <span>HISTORICAL ARCHIVE ({historicalYear === 'ALL' ? '2019-2026' : historicalYear})</span>
            </div>
          ) : (
            <div className="flex items-center gap-1.5 text-purple-400 font-bold">
              <Sparkles className="w-3.5 h-3.5" />
              <span>SIMULATION RUN</span>
            </div>
          )}

          <span className="text-slate-600">|</span>

          <span className="text-slate-400">Sync: <strong className="text-slate-200">{lastUpdatedTime}</strong></span>

          {mapMode === 'LIVE' && (
            <>
              <span className="text-slate-600">|</span>
              <span className="text-slate-400 hidden sm:inline">Refresh: <strong className="text-cyan-400">{refreshCountdown}s</strong></span>
              <select
                value={refreshInterval}
                onChange={(e) => setRefreshInterval(e.target.value as MapRefreshInterval)}
                className="bg-transparent border-none text-[11px] text-slate-400 hover:text-white cursor-pointer focus:outline-none"
                title="Telemetry refresh interval"
              >
                <option value="30s" className="bg-slate-900">30s</option>
                <option value="1m" className="bg-slate-900">1m</option>
                <option value="5m" className="bg-slate-900">5m</option>
                <option value="manual" className="bg-slate-900">Manual</option>
              </select>
            </>
          )}

          <button
            onClick={triggerRefresh}
            className={`p-1 rounded hover:bg-slate-800 text-slate-400 hover:text-white transition-transform ${isRefreshing ? 'animate-spin text-cyan-400' : ''}`}
            title="Force refresh authoritative telemetry"
          >
            <RefreshCw className="w-3 h-3" />
          </button>
        </div>

        {/* Right: Floating Control Bar Toolbar */}
        <MapControlBar
          activeMode={mapMode}
          onModeChange={setMapMode}
          onToggleLayerDrawer={() => setIsLayerDrawerOpen(prev => !prev)}
          onToggleEventStream={() => setIsEventStreamOpen(prev => !prev)}
          showEventStream={isEventStreamOpen}
          onToggleCompare={() => setIsCompareActive(prev => !prev)}
          isCompareActive={isCompareActive}
          onOpenAskAI={() => setIsAskAIOpen(true)}
          isFullscreen={isFullscreen}
          onToggleFullscreen={() => setIsFullscreen(prev => !prev)}
          onResetView={handleResetView}
          onQuickFocus={() => {
            if (zones[0]) {
              onSelectZone(zones[0]);
              setZoomLevel(1.4);
            }
          }}
        />
      </div>

      {/* 2. MAIN MAP CANVAS & COMPARISON CONTAINER */}
      <div className="relative flex-1 w-full h-full overflow-hidden flex">
        
        {/* SVG GIS Map View */}
        <div 
          className="relative flex-1 h-full w-full flex items-center justify-center p-2 select-none overflow-hidden"
          style={{ backgroundColor: mapBgColor }}
        >
          {/* Subtle Grid Background */}
          <div 
            className="absolute inset-0 opacity-25 pointer-events-none" 
            style={{ 
              backgroundImage: `linear-gradient(to right, ${gridColor} 1px, transparent 1px), linear-gradient(to bottom, ${gridColor} 1px, transparent 1px)`,
              backgroundSize: '32px 32px'
            }}
          />

          {/* Active Mode Notice Overlay (Watermark Badge) */}
          <div className="absolute top-4 left-4 z-10 p-2 rounded-xl bg-slate-900/90 dark:bg-slate-900/90 border border-slate-800 text-[11px] text-slate-300 shadow-xl backdrop-blur-sm pointer-events-none flex items-center gap-2">
            <Navigation className="w-3.5 h-3.5 text-cyan-400" />
            <span className="font-semibold text-white">NER Geospatial Grid (EPSG:4326)</span>
            <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-cyan-950 text-cyan-300 border border-cyan-800">
              {mapMode}
            </span>
          </div>

          {/* SVG Map Canvas with Zoom and Pan Transform */}
          <div 
            className="w-full h-full max-w-6xl max-h-[740px] transition-transform duration-300 flex items-center justify-center"
            style={{ 
              transform: `scale(${zoomLevel}) translate(${panOffset.x / zoomLevel}px, ${panOffset.y / zoomLevel}px)` 
            }}
          >
            <svg 
              viewBox="0 0 1000 700" 
              className="w-full h-full drop-shadow-2xl"
              preserveAspectRatio="xMidYMid meet"
              onClick={() => setActiveAlertPopup(null)}
            >
              <defs>
                {/* State Gradients */}
                <linearGradient id="arunachalGrad" x1="0" y1="0" x2="1" y2="1">
                  <stop offset="0%" stopColor={isDark ? "#0f2648" : "#dbeafe"} />
                  <stop offset="100%" stopColor={isDark ? "#0a1a33" : "#bfdbfe"} />
                </linearGradient>
                <linearGradient id="assamGrad" x1="0" y1="0" x2="1" y2="1">
                  <stop offset="0%" stopColor={isDark ? "#0c2e50" : "#e0f2fe"} />
                  <stop offset="100%" stopColor={isDark ? "#081e36" : "#bae6fd"} />
                </linearGradient>
                <linearGradient id="meghalayaGrad" x1="0" y1="0" x2="1" y2="1">
                  <stop offset="0%" stopColor={isDark ? "#142c54" : "#e0e7ff"} />
                  <stop offset="100%" stopColor={isDark ? "#0e1f3d" : "#c7d2fe"} />
                </linearGradient>
                <linearGradient id="sikkimGrad" x1="0" y1="0" x2="1" y2="1">
                  <stop offset="0%" stopColor={isDark ? "#122549" : "#dbeafe"} />
                  <stop offset="100%" stopColor={isDark ? "#0b172f" : "#bfdbfe"} />
                </linearGradient>
                <linearGradient id="nagalandGrad" x1="0" y1="0" x2="1" y2="1">
                  <stop offset="0%" stopColor={isDark ? "#132746" : "#e0f2fe"} />
                  <stop offset="100%" stopColor={isDark ? "#0b192e" : "#bae6fd"} />
                </linearGradient>
                <linearGradient id="manipurGrad" x1="0" y1="0" x2="1" y2="1">
                  <stop offset="0%" stopColor={isDark ? "#132545" : "#e0f2fe"} />
                  <stop offset="100%" stopColor={isDark ? "#0a162b" : "#bae6fd"} />
                </linearGradient>
                <linearGradient id="mizoramGrad" x1="0" y1="0" x2="1" y2="1">
                  <stop offset="0%" stopColor={isDark ? "#13294c" : "#dbeafe"} />
                  <stop offset="100%" stopColor={isDark ? "#091b35" : "#bfdbfe"} />
                </linearGradient>
                <linearGradient id="tripuraGrad" x1="0" y1="0" x2="1" y2="1">
                  <stop offset="0%" stopColor={isDark ? "#112745" : "#e0f2fe"} />
                  <stop offset="100%" stopColor={isDark ? "#0a182d" : "#bae6fd"} />
                </linearGradient>

                {/* Rainfall Isohyet Gradients */}
                <radialGradient id="rainHeavyMeghalaya" cx="44%" cy="56%" r="22%">
                  <stop offset="0%" stopColor="#38bdf8" stopOpacity={layers.rainfallOpacity * 0.7} />
                  <stop offset="60%" stopColor="#0284c7" stopOpacity={layers.rainfallOpacity * 0.4} />
                  <stop offset="100%" stopColor="#0284c7" stopOpacity="0" />
                </radialGradient>
                <radialGradient id="rainHeavyAssam" cx="57%" cy="58%" r="18%">
                  <stop offset="0%" stopColor="#38bdf8" stopOpacity={layers.rainfallOpacity * 0.6} />
                  <stop offset="60%" stopColor="#0284c7" stopOpacity={layers.rainfallOpacity * 0.3} />
                  <stop offset="100%" stopColor="#0284c7" stopOpacity="0" />
                </radialGradient>
                <radialGradient id="rainHeavySikkim" cx="22%" cy="38%" r="14%">
                  <stop offset="0%" stopColor="#38bdf8" stopOpacity={layers.rainfallOpacity * 0.65} />
                  <stop offset="100%" stopColor="#0284c7" stopOpacity="0" />
                </radialGradient>

                {/* Drop shadow filter */}
                <filter id="shadowFilter" x="-25%" y="-25%" width="150%" height="150%">
                  <feDropShadow dx="0" dy="2" stdDeviation="3" floodColor="#000000" floodOpacity={isDark ? "0.8" : "0.3"} />
                </filter>
              </defs>

              {/* 1. ELEVATION CONTOUR RELIEF LINES (NASA SRTM 30m) */}
              {layers.elevationContours && (
                <g opacity={isDark ? "0.18" : "0.35"} stroke={contourColor} strokeWidth="0.75" fill="none">
                  <path d="M 120 220 C 180 200, 220 250, 300 240 C 400 230, 500 180, 650 160 C 750 150, 850 180, 920 220" />
                  <path d="M 130 250 C 220 240, 310 280, 420 260 C 520 240, 620 200, 780 190 C 860 190, 910 250, 950 260" />
                  <path d="M 280 320 C 360 300, 440 330, 550 310 C 650 290, 720 260, 820 280 C 880 300, 920 340, 960 350" />
                  <path d="M 320 380 C 400 370, 490 410, 580 390 C 660 370, 720 350, 800 380 C 850 400, 880 440, 900 460" />
                  <path d="M 330 460 C 420 440, 510 470, 610 450 C 690 430, 750 440, 800 480 C 840 510, 860 560, 870 590" />
                </g>
              )}

              {/* 2. STATE POLYGONS (NER 8 States) */}
              
              {/* Sikkim */}
              <path 
                d="M 140 220 L 260 210 L 280 280 L 230 350 L 160 340 L 130 270 Z" 
                fill="url(#sikkimGrad)" 
                stroke={stateStrokeColor} 
                strokeWidth="1.5" 
                className="hover:opacity-90 transition-opacity cursor-pointer"
                onClick={() => setFilterState('Sikkim')}
              />
              <text x="180" y="275" fill={stateTextColor} fontSize="14" fontWeight="bold" opacity="0.75">SIKKIM</text>

              {/* Arunachal Pradesh */}
              <path 
                d="M 290 190 L 460 150 L 680 120 L 880 140 L 960 230 L 940 310 L 850 300 L 760 270 L 640 280 L 520 290 L 400 310 L 320 280 Z" 
                fill="url(#arunachalGrad)" 
                stroke={stateStrokeColor} 
                strokeWidth="1.5" 
                className="hover:opacity-90 transition-opacity cursor-pointer"
                onClick={() => setFilterState('Arunachal Pradesh')}
              />
              <text x="620" y="210" fill={stateTextColor} fontSize="18" fontWeight="bold" opacity="0.75">ARUNACHAL PRADESH</text>

              {/* Assam */}
              <path 
                d="M 290 320 L 400 320 L 520 300 L 640 290 L 760 280 L 840 310 L 780 390 L 680 390 L 660 460 L 580 480 L 530 430 L 440 430 L 330 420 L 280 370 Z" 
                fill="url(#assamGrad)" 
                stroke={stateStrokeColor} 
                strokeWidth="1.5" 
                className="hover:opacity-90 transition-opacity cursor-pointer"
                onClick={() => setFilterState('Assam')}
              />
              <text x="490" y="360" fill={stateTextColor} fontSize="20" fontWeight="bold" opacity="0.8">ASSAM</text>

              {/* Meghalaya */}
              <path 
                d="M 330 430 L 530 440 L 520 520 L 340 510 Z" 
                fill="url(#meghalayaGrad)" 
                stroke={stateStrokeColor} 
                strokeWidth="1.5" 
                className="hover:opacity-90 transition-opacity cursor-pointer"
                onClick={() => setFilterState('Meghalaya')}
              />
              <text x="400" y="480" fill={stateTextColor} fontSize="16" fontWeight="bold" opacity="0.85">MEGHALAYA</text>

              {/* Nagaland */}
              <path 
                d="M 680 370 L 780 340 L 800 440 L 720 470 L 670 420 Z" 
                fill="url(#nagalandGrad)" 
                stroke={stateStrokeColor} 
                strokeWidth="1.5" 
                className="hover:opacity-90 transition-opacity cursor-pointer"
                onClick={() => setFilterState('Nagaland')}
              />
              <text x="710" y="415" fill={stateTextColor} fontSize="14" fontWeight="bold" opacity="0.8">NAGALAND</text>

              {/* Manipur */}
              <path 
                d="M 660 470 L 760 460 L 740 570 L 640 560 L 635 500 Z" 
                fill="url(#manipurGrad)" 
                stroke={stateStrokeColor} 
                strokeWidth="1.5" 
                className="hover:opacity-90 transition-opacity cursor-pointer"
                onClick={() => setFilterState('Manipur')}
              />
              <text x="670" y="525" fill={stateTextColor} fontSize="14" fontWeight="bold" opacity="0.8">MANIPUR</text>

              {/* Mizoram */}
              <path 
                d="M 520 530 L 620 520 L 600 680 L 510 660 L 510 570 Z" 
                fill="url(#mizoramGrad)" 
                stroke={stateStrokeColor} 
                strokeWidth="1.5" 
                className="hover:opacity-90 transition-opacity cursor-pointer"
                onClick={() => setFilterState('Mizoram')}
              />
              <text x="535" y="615" fill={stateTextColor} fontSize="15" fontWeight="bold" opacity="0.8">MIZORAM</text>

              {/* Tripura */}
              <path 
                d="M 420 520 L 500 520 L 490 640 L 410 620 Z" 
                fill="url(#tripuraGrad)" 
                stroke={stateStrokeColor} 
                strokeWidth="1.5" 
                className="hover:opacity-90 transition-opacity cursor-pointer"
                onClick={() => setFilterState('Tripura')}
              />
              <text x="435" y="580" fill={stateTextColor} fontSize="13" fontWeight="bold" opacity="0.8">TRIPURA</text>

              {/* 3. IMD RAINFALL ISOHYETS OVERLAYS */}
              {layers.rainfallOverlay && (
                <g className="transition-opacity duration-300 pointer-events-none">
                  <circle cx="440" cy="500" r="140" fill="url(#rainHeavyMeghalaya)" />
                  <circle cx="570" cy="460" r="120" fill="url(#rainHeavyAssam)" />
                  <circle cx="220" cy="270" r="90" fill="url(#rainHeavySikkim)" />
                  {layers.rainfallIntensity && (
                    <text x="350" y="535" fill="#38bdf8" fontSize="10" fontFamily="monospace" fontWeight="bold">
                      🌧 IMD Cloudburst Cell: 184.6 mm / 24h
                    </text>
                  )}
                </g>
              )}

              {/* 4. STRATEGIC HIGHWAYS & LIFELINES */}
              {layers.highways && (
                <g className="transition-opacity duration-300 pointer-events-none">
                  {/* NH-6 Lifeline */}
                  <path d="M 430 380 L 460 460 L 510 490 L 580 480" fill="none" stroke="#f59e0b" strokeWidth="3.5" strokeDasharray="6,3" />
                  <text x="470" y="475" fill="#fde68a" fontSize="9" fontWeight="bold" fontFamily="monospace">NH-6 Corridor</text>

                  {/* NH-29 Lifeline */}
                  <path d="M 640 400 L 670 420 L 720 440" fill="none" stroke="#f59e0b" strokeWidth="3" strokeDasharray="5,2" />
                  <text x="675" y="435" fill="#fde68a" fontSize="9" fontWeight="bold" fontFamily="monospace">NH-29</text>

                  {/* Lumding-Badarpur Railway */}
                  {layers.railways && (
                    <>
                      <path d="M 540 410 L 570 440 L 580 480" fill="none" stroke="#ec4899" strokeWidth="2.5" strokeDasharray="3,2" />
                      <text x="585" y="445" fill="#fbcfe8" fontSize="8" fontWeight="bold" fontFamily="monospace">Hill Railway</text>
                    </>
                  )}

                  {/* NH-10 Sikkim */}
                  <path d="M 170 340 L 220 280" fill="none" stroke="#f59e0b" strokeWidth="3" strokeDasharray="5,2" />
                  <text x="185" y="305" fill="#fde68a" fontSize="9" fontWeight="bold" fontFamily="monospace">NH-10</text>
                </g>
              )}

              {/* 5. NASA SMAP SOIL MOISTURE OVERLAY */}
              {layers.soilMoisture && (
                <g className="transition-opacity duration-300 pointer-events-none opacity-30">
                  <ellipse cx="460" cy="490" rx="160" ry="110" fill="#a855f7" />
                  <ellipse cx="580" cy="480" rx="130" ry="90" fill="#9333ea" />
                  <ellipse cx="230" cy="280" rx="90" ry="70" fill="#7e22ce" />
                </g>
              )}

              {/* 6. GSI HISTORICAL LANDSLIDE INVENTORY (2019-2026) */}
              {layers.historicalLandslides && (
                <g className="transition-opacity duration-300">
                  {displayedLandslides.map((event) => {
                    const pos = projectCoordinates(event.latitude, event.longitude);
                    const isSelected = selectedHistoricalEvent?.id === event.id;
                    return (
                      <g 
                        key={event.id}
                        transform={`translate(${pos.x}, ${pos.y})`}
                        className="cursor-pointer group"
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedHistoricalEvent(event);
                        }}
                      >
                        <polygon
                          points="0,-6 6,0 0,6 -6,0"
                          fill={isSelected ? "#f59e0b" : "#fbbf24"}
                          stroke="#78350f"
                          strokeWidth="1.5"
                          className="hover:scale-150 transition-transform"
                        />
                        {event.fatalities > 0 && (
                          <circle r="9" fill="none" stroke="#ef4444" strokeWidth="1" opacity="0.6" strokeDasharray="2,2" />
                        )}
                        <text
                          x="8"
                          y="3"
                          fill="#fde68a"
                          fontSize="9"
                          fontFamily="monospace"
                          fontWeight="bold"
                          className="opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          {event.eventId} ({event.year})
                        </text>
                      </g>
                    );
                  })}
                </g>
              )}

              {/* 7. ALERT CLUSTERS (When multiple alerts are close) */}
              {clusters.map((cluster) => (
                <g
                  key={cluster.id}
                  transform={`translate(${cluster.x * 10}, ${cluster.y * 7})`}
                  className="cursor-pointer hover:scale-110 transition-transform"
                  onClick={(e) => {
                    e.stopPropagation();
                    // Zoom into cluster area
                    setZoomLevel(prev => Math.min(prev + 0.5, 2.0));
                    setPanOffset({ x: 500 - cluster.x * 10, y: 350 - cluster.y * 7 });
                  }}
                >
                  <circle
                    r="18"
                    fill={cluster.highestSeverity === 'CRITICAL' ? '#ef4444' : '#f59e0b'}
                    stroke="#ffffff"
                    strokeWidth="2.5"
                    filter="url(#shadowFilter)"
                  />
                  <text
                    x="0"
                    y="4"
                    textAnchor="middle"
                    fill="#ffffff"
                    fontSize="11"
                    fontWeight="bold"
                    fontFamily="monospace"
                  >
                    {cluster.count}
                  </text>
                  <text
                    x="0"
                    y="28"
                    textAnchor="middle"
                    fill="#ffffff"
                    fontSize="9"
                    fontWeight="bold"
                    fontFamily="monospace"
                    className="bg-slate-950/80 px-1 py-0.5 rounded"
                  >
                    {cluster.district}
                  </text>
                </g>
              ))}

              {/* 8. SINGLE ALERT MARKERS (Distinct Shapes & Pulsing Ring) */}
              {singleAlerts.map((alert) => {
                const zone = zones.find(z => z.id === alert.zoneId);
                if (!zone) return null;

                const cx = (zone.coordinates.x / 100) * 1000;
                const cy = (zone.coordinates.y / 100) * 700;
                const isCritical = alert.alertState === 'Critical' || alert.riskLevel === 'HIGH';
                const isWarning = alert.alertState === 'Warning';
                const isSelected = selectedZone?.id === zone.id || activeAlertPopup?.id === alert.id;

                return (
                  <g
                    key={`alert-marker-${alert.id}`}
                    transform={`translate(${cx}, ${cy})`}
                    className="cursor-pointer transition-transform duration-200"
                    onClick={(e) => {
                      e.stopPropagation();
                      onSelectZone(zone);
                      setActiveAlertPopup(alert);
                      setSelectedAlertForDrawer(alert);
                    }}
                  >
                    {/* Pulsing Active Ring for Critical Alerts */}
                    {isCritical && (
                      <circle r="22" fill="#ef4444" opacity="0.3" className="alert-ring-active" />
                    )}

                    {/* Selection Crosshair */}
                    {isSelected && (
                      <circle r="18" fill="none" stroke="#38bdf8" strokeWidth="2.5" strokeDasharray="3,2" />
                    )}

                    {/* Marker Shape: Diamond for Critical, Hexagon for Warning, Circle for Watch */}
                    {isCritical ? (
                      <polygon
                        points="0,-12 12,0 0,12 -12,0"
                        fill="#ef4444"
                        stroke="#ffffff"
                        strokeWidth="2"
                        filter="url(#shadowFilter)"
                        className="hover:scale-125 transition-transform"
                      />
                    ) : isWarning ? (
                      <polygon
                        points="-6,-10 6,-10 11,0 6,10 -6,10 -11,0"
                        fill="#f97316"
                        stroke="#ffffff"
                        strokeWidth="2"
                        filter="url(#shadowFilter)"
                        className="hover:scale-125 transition-transform"
                      />
                    ) : (
                      <rect
                        x="-9"
                        y="-9"
                        width="18"
                        height="18"
                        rx="4"
                        fill="#f59e0b"
                        stroke="#ffffff"
                        strokeWidth="2"
                        filter="url(#shadowFilter)"
                        className="hover:scale-125 transition-transform"
                      />
                    )}

                    {/* Exclamation or center indicator */}
                    <circle r="3" fill="#ffffff" />

                    {/* Accessible text label badge */}
                    <g transform="translate(14, 4)">
                      <rect 
                        x="-4" 
                        y="-12" 
                        width={alert.location.split(',')[0].length * 6.5 + 40} 
                        height="18" 
                        rx="4" 
                        fill={isDark ? "#070d1e" : "#ffffff"} 
                        fillOpacity="0.9" 
                        stroke={isSelected ? "#38bdf8" : isDark ? "#1e293b" : "#cbd5e1"} 
                        strokeWidth="1" 
                      />
                      <text 
                        x="2" 
                        y="0" 
                        fill={isCritical ? "#ef4444" : isWarning ? "#f97316" : isDark ? "#f1f5f9" : "#0f172a"} 
                        fontSize="10" 
                        fontWeight="bold" 
                        fontFamily="monospace"
                      >
                        {alert.location.split(',')[0]} ({alert.riskScore})
                      </text>
                    </g>
                  </g>
                );
              })}
            </svg>
          </div>

          {/* 9. FLOATING ALERT POPUP ON MAP */}
          {activeAlertPopup && (
            <div 
              className="absolute z-40 p-3.5 rounded-2xl bg-slate-950/95 dark:bg-slate-950/95 border border-cyan-500/50 shadow-2xl backdrop-blur-md max-w-xs sm:max-w-sm w-full animate-in zoom-in-95 duration-150 text-xs text-slate-200"
              style={{
                top: '20%',
                left: '25%'
              }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-start justify-between border-b border-slate-800 pb-2 mb-2">
                <div>
                  <div className="flex items-center gap-1.5 flex-wrap mb-1">
                    <span className={`px-2 py-0.2 rounded text-[10px] font-black uppercase tracking-wider ${
                      activeAlertPopup.alertState === 'Critical' ? 'bg-red-500 text-white' : 'bg-amber-500 text-slate-950'
                    }`}>
                      {activeAlertPopup.alertState} ALERT
                    </span>
                    <span className="text-[10px] font-mono text-cyan-300 font-bold">
                      Score: {activeAlertPopup.riskScore}/100
                    </span>
                  </div>
                  <h4 className="font-bold text-white text-sm leading-tight">
                    {activeAlertPopup.location}
                  </h4>
                  <p className="text-[11px] text-slate-400">
                    {activeAlertPopup.district}, {activeAlertPopup.state}
                  </p>
                </div>

                <button
                  onClick={() => setActiveAlertPopup(null)}
                  className="p-1 rounded-lg bg-slate-800 text-slate-400 hover:text-white"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Main Trigger */}
              <div className="space-y-1 mb-3">
                <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">
                  Trigger Factor
                </span>
                <p className="text-slate-300 text-xs leading-snug">
                  {activeAlertPopup.trigger}
                </p>
              </div>

              {/* Exposed Lifelines */}
              <div className="space-y-1 mb-3">
                <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">
                  Exposed Infrastructure
                </span>
                <div className="flex flex-wrap gap-1">
                  {activeAlertPopup.criticalInfrastructure.map((infra, idx) => (
                    <span key={idx} className="px-1.5 py-0.5 rounded bg-slate-900 border border-slate-800 text-[10px] text-amber-300 font-mono">
                      {infra}
                    </span>
                  ))}
                </div>
              </div>

              {/* Buttons */}
              <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-800">
                <button
                  onClick={() => {
                    setSelectedAlertForDrawer(activeAlertPopup);
                    setActiveAlertPopup(null);
                  }}
                  className="py-1.5 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-center transition-colors"
                >
                  View Details
                </button>

                <button
                  onClick={() => {
                    if (onOpenAIAssistantWithPrompt) {
                      onOpenAIAssistantWithPrompt(
                        `Perform deep geotechnical risk reasoning for alert at ${activeAlertPopup.location} (${activeAlertPopup.trigger}).`
                      );
                    } else {
                      setIsAskAIOpen(true);
                    }
                    setActiveAlertPopup(null);
                  }}
                  className="py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-cyan-300 border border-slate-700 font-bold flex items-center justify-center gap-1 transition-colors"
                >
                  <Sparkles className="w-3 h-3" />
                  <span>Analyze AI</span>
                </button>
              </div>
            </div>
          )}

          {/* 10. MAP STATUS LEGEND (Bottom Right) */}
          <div className="absolute bottom-4 right-4 z-20 p-3 rounded-2xl bg-slate-900/90 dark:bg-slate-900/90 border border-slate-800 text-xs shadow-xl backdrop-blur-sm space-y-2 select-none">
            <div className="text-[11px] font-bold text-slate-300 uppercase tracking-wider flex items-center justify-between gap-4">
              <span>Map Legend</span>
              <button 
                onClick={() => openSourceModal('ALL')}
                className="text-cyan-400 hover:underline font-mono text-[10px]"
              >
                Sources
              </button>
            </div>
            <div className="space-y-1.5 text-[11px]">
              <div className="flex items-center gap-2">
                <polygon points="0,-4 4,0 0,4 -4,0" className="w-3 h-3 fill-red-500 stroke-white" />
                <span className="text-red-400 font-semibold">Critical Alert (Pulsing)</span>
              </div>
              <div className="flex items-center gap-2">
                <polygon points="-3,-5 3,-5 5,0 3,5 -3,5 -5,0" className="w-3 h-3 fill-amber-500 stroke-white" />
                <span className="text-amber-400 font-semibold">Warning Alert</span>
              </div>
              <div className="flex items-center gap-2">
                <polygon points="0,-4 4,0 0,4 -4,0" className="w-3 h-3 fill-amber-300 stroke-amber-900" />
                <span className="text-amber-300">GSI Historical Landslide</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-4 h-0.5 border-t-2 border-dashed border-amber-400" />
                <span className="text-slate-300">NH-6 / Lifeline Highway</span>
              </div>
            </div>
          </div>

          {/* 11. HISTORICAL INTERACTIVE TIME SCRUBBER (When in Historical Mode) */}
          {mapMode === 'HISTORICAL' && (
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20 w-11/12 max-w-xl p-3 rounded-2xl bg-slate-950/95 border border-amber-500/40 shadow-2xl backdrop-blur-md flex flex-col gap-2 animate-in slide-in-from-bottom-3 duration-200">
              <div className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setIsHistoryPlaying(prev => !prev)}
                    className="p-1.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold transition-colors"
                    title={isHistoryPlaying ? 'Pause Playback' : 'Play Historical Evolution'}
                  >
                    {isHistoryPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                  </button>
                  <span className="font-bold text-amber-300">
                    Historical Timeline: <strong className="text-white font-mono">{historicalYear === 'ALL' ? 'All Incidents (2019-2026)' : `Year ${historicalYear}`}</strong>
                  </span>
                </div>
                <span className="text-[10px] font-mono text-slate-400">
                  {displayedLandslides.length} Recorded GSI Events
                </span>
              </div>

              {/* Scrubber slider */}
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setHistoricalYear('ALL')}
                  className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold transition-colors ${
                    historicalYear === 'ALL' ? 'bg-amber-500 text-slate-950' : 'bg-slate-800 text-slate-300 hover:text-white'
                  }`}
                >
                  ALL
                </button>
                <div className="flex-1 flex items-center justify-between gap-1">
                  {[2019, 2020, 2021, 2022, 2023, 2024, 2025, 2026].map((yr) => (
                    <button
                      key={yr}
                      onClick={() => {
                        setHistoricalYear(yr);
                        setIsHistoryPlaying(false);
                      }}
                      className={`flex-1 py-1 rounded text-[10px] font-mono font-semibold transition-all ${
                        historicalYear === yr
                          ? 'bg-amber-500 text-slate-950 font-bold shadow-md'
                          : 'bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-slate-200'
                      }`}
                    >
                      {yr}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* 12. ZOOM & RESET FLOATING BUTTONS (Top Right) */}
          <div className="absolute top-4 right-4 z-20 flex flex-col gap-1 bg-slate-950/80 p-1 rounded-xl border border-slate-800 shadow-xl backdrop-blur-sm">
            <button
              onClick={() => setZoomLevel(prev => Math.min(prev + 0.25, 2.5))}
              className="p-2 rounded-lg text-slate-300 hover:text-white hover:bg-slate-800 transition-colors"
              title="Zoom In"
            >
              <ZoomIn className="w-4 h-4" />
            </button>
            <button
              onClick={() => setZoomLevel(prev => Math.max(prev - 0.25, 0.75))}
              className="p-2 rounded-lg text-slate-300 hover:text-white hover:bg-slate-800 transition-colors"
              title="Zoom Out"
            >
              <ZoomOut className="w-4 h-4" />
            </button>
            <button
              onClick={handleResetView}
              className="p-2 rounded-lg text-slate-300 hover:text-white hover:bg-slate-800 transition-colors"
              title="Reset View to Region"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* 13. SIDE INSPECTOR DRAWER (When a zone is selected) */}
        {selectedZone && !selectedAlertForDrawer && (
          <div className="w-full sm:w-96 lg:w-[420px] h-full bg-[#081124] dark:bg-[#081124] border-l border-slate-700/80 shadow-2xl overflow-y-auto z-30 flex flex-col animate-in slide-in-from-right duration-200 text-xs">
            {/* Header with Close */}
            <div className="p-4 bg-slate-950/90 border-b border-slate-800 flex items-start justify-between">
              <div>
                <div className="flex items-center gap-2">
                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                    selectedZone.riskLevel === 'HIGH' ? 'bg-red-500 text-white' :
                    selectedZone.riskLevel === 'MEDIUM' ? 'bg-amber-500 text-slate-950' :
                    'bg-emerald-500 text-slate-950'
                  }`}>
                    {selectedZone.riskLevel} RISK
                  </span>
                  <span className="text-xs font-mono text-cyan-400 font-bold">
                    Score: {selectedZone.riskScore}/100
                  </span>
                </div>
                <h3 className="text-base font-bold text-white mt-1">
                  {selectedZone.name}
                </h3>
                <p className="text-xs text-slate-400">
                  {selectedZone.district}, {selectedZone.state}
                </p>
              </div>

              <button 
                onClick={() => onSelectZone(null)}
                className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Content Body */}
            <div className="p-4 space-y-4 flex-1">
              {/* AI Prediction Summary */}
              <div className="p-3.5 rounded-xl bg-[#09142b] border border-cyan-500/30 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-1.5 text-xs font-bold text-cyan-400">
                    <Cpu className="w-4 h-4" />
                    AI Hazard Forecast
                  </span>
                  <span className="text-xs font-mono font-semibold px-2 py-0.5 rounded bg-cyan-950 text-cyan-300 border border-cyan-800">
                    Confidence: {selectedZone.aiConfidence}%
                  </span>
                </div>
                <p className="text-xs text-slate-200 leading-relaxed font-medium">
                  {selectedZone.aiPrediction}
                </p>
              </div>

              {/* Environmental Indicators Grid */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                    Observed Telemetry
                  </span>
                  <DataQualityBadge type="OBSERVED" size="sm" />
                </div>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800">
                    <div className="text-[11px] text-slate-400 flex items-center justify-between">
                      <span className="flex items-center gap-1">
                        <Droplets className="w-3 h-3 text-cyan-400" />
                        <span>Rainfall (24h)</span>
                      </span>
                    </div>
                    <div className="text-base font-bold font-mono text-white mt-0.5">
                      {selectedZone.rainfall24h} mm
                    </div>
                    <div className="text-[10px] text-slate-500">7-Day: {selectedZone.rainfall7d} mm (IMD)</div>
                  </div>

                  <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800">
                    <div className="text-[11px] text-slate-400 flex items-center justify-between">
                      <span className="flex items-center gap-1">
                        <Radio className="w-3 h-3 text-amber-400" />
                        <span>Soil Saturation</span>
                      </span>
                    </div>
                    <div className="text-base font-bold font-mono text-amber-300 mt-0.5">
                      {selectedZone.soilMoisture}%
                    </div>
                    <div className="text-[10px] text-slate-500">SMAP/MOSDAC Model</div>
                  </div>

                  <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800">
                    <div className="text-[11px] text-slate-400 flex items-center justify-between">
                      <span className="flex items-center gap-1">
                        <Mountain className="w-3 h-3 text-blue-400" />
                        <span>DEM Slope</span>
                      </span>
                    </div>
                    <div className="text-base font-bold font-mono text-white mt-0.5">
                      {selectedZone.slopeAngle}°
                    </div>
                    <div className="text-[10px] text-slate-500">Elev: {selectedZone.elevation}m (SRTM)</div>
                  </div>

                  <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800">
                    <div className="text-[11px] text-slate-400 flex items-center justify-between">
                      <span className="flex items-center gap-1">
                        <TrendingUp className="w-3 h-3 text-red-400" />
                        <span>Displacement</span>
                      </span>
                    </div>
                    <div className="text-base font-bold font-mono text-red-400 mt-0.5">
                      {selectedZone.groundMovement} mm/d
                    </div>
                    <div className="text-[10px] text-slate-500">InSAR Sentinel-1</div>
                  </div>
                </div>
              </div>

              {/* Primary Risk Factors */}
              <div className="space-y-1.5">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                  Primary Geotechnical Triggers
                </span>
                <div className="space-y-1">
                  {selectedZone.primaryRiskFactors.map((factor, idx) => (
                    <div key={idx} className="flex items-start gap-2 p-1.5 rounded bg-slate-950 border border-slate-800/80 text-xs text-slate-300">
                      <span className="w-1.5 h-1.5 rounded-full bg-red-400 mt-1.5 flex-shrink-0" />
                      <span>{factor}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Recommended Action */}
              <div className="p-3.5 rounded-xl bg-amber-950/20 border border-amber-500/40 space-y-1.5">
                <div className="flex items-center gap-1.5 text-xs font-bold text-amber-300">
                  <ShieldAlert className="w-4 h-4" />
                  <span>SOP Action Recommendation</span>
                </div>
                <p className="text-xs text-slate-200 leading-relaxed">
                  {selectedZone.recommendedAction}
                </p>
              </div>
            </div>

            {/* Footer Actions inside Drawer */}
            <div className="p-4 bg-slate-950 border-t border-slate-800 grid grid-cols-2 gap-2">
              <button
                onClick={() => onOpenAssessment(selectedZone)}
                className="flex items-center justify-center gap-1.5 px-3 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold border border-slate-700 transition-colors"
              >
                <span>Scenario Test</span>
              </button>

              <button
                onClick={() => onOpenAlerts(selectedZone)}
                className="flex items-center justify-center gap-1.5 px-3 py-2.5 rounded-xl bg-red-600 hover:bg-red-500 text-white text-xs font-bold shadow-lg shadow-red-900/40 transition-colors"
              >
                <AlertTriangle className="w-3.5 h-3.5" />
                <span>View Alert Dossier</span>
              </button>
            </div>
          </div>
        )}

        {/* 14. ALERT DETAIL RIGHT DRAWER (When user examines a specific alert) */}
        <AlertDetailDrawer
          alert={selectedAlertForDrawer}
          zone={selectedAlertForDrawer ? zones.find(z => z.id === selectedAlertForDrawer.zoneId) : null}
          onClose={() => setSelectedAlertForDrawer(null)}
          onAnalyzeWithAI={(alert) => {
            if (onOpenAIAssistantWithPrompt) {
              onOpenAIAssistantWithPrompt(
                `Perform geotechnical risk reasoning for alert ${alert.id} at ${alert.location}. Environmental triggers: ${alert.trigger}.`
              );
            } else {
              setIsAskAIOpen(true);
            }
          }}
          onOpenSourceModal={openSourceModal}
          onNavigateToLayer={(layerKey) => {
            setLayers(prev => ({
              ...prev,
              [layerKey]: true,
              ...(layerKey === 'rainfall' ? { rainfallRadar: true } : {})
            }));
          }}
        />

        {/* 15. GIS MAP LAYERS DRAWER */}
        <MapLayerDrawer
          isOpen={isLayerDrawerOpen}
          onClose={() => setIsLayerDrawerOpen(false)}
          layers={layers}
          onToggleLayer={handleToggleLayer}
          onChangeRainfallOpacity={handleChangeRainfallOpacity}
          historicalYear={historicalYear}
          onChangeHistoricalYear={setHistoricalYear}
          onOpenSourceModal={openSourceModal}
        />

        {/* 16. REAL-TIME EVENT STREAM PANEL */}
        {isEventStreamOpen && (
          <MapEventStream
            events={eventStream}
            onSelectEventLocation={(zoneId) => {
              if (zoneId) {
                const z = zones.find(item => item.id === zoneId);
                if (z) {
                  onSelectZone(z);
                  setZoomLevel(1.4);
                  const targetX = (z.coordinates.x / 100) * 1000;
                  const targetY = (z.coordinates.y / 100) * 700;
                  setPanOffset({ x: 500 - targetX, y: 350 - targetY });
                }
              }
            }}
            onSummarizeEventsWithAI={() => {
              setIsAskAIOpen(true);
            }}
            onClose={() => setIsEventStreamOpen(false)}
          />
        )}

        {/* 17. ASK AI ABOUT MAP MODAL */}
        <AskAIModal
          isOpen={isAskAIOpen}
          onClose={() => setIsAskAIOpen(false)}
          selectedZone={selectedZone}
          zones={zones}
          alerts={alerts}
          onExecuteControlledAction={handleExecuteControlledAction}
          onOpenFullAssistant={(prompt) => {
            if (onOpenAIAssistantWithPrompt) {
              onOpenAIAssistantWithPrompt(prompt, selectedZone || undefined);
            }
          }}
        />

        {/* 18. GSI HISTORICAL INCIDENT DETAIL DIALOG */}
        {selectedHistoricalEvent && (
          <div className="absolute top-16 left-4 z-40 max-w-sm w-full p-4 rounded-2xl bg-slate-950/95 border border-amber-500/50 shadow-2xl backdrop-blur-md space-y-3 animate-in fade-in zoom-in-95 text-xs">
            <div className="flex items-center justify-between border-b border-slate-800 pb-2">
              <div className="flex items-center gap-2">
                <History className="w-4 h-4 text-amber-400" />
                <span className="text-xs font-mono font-bold text-white">
                  {selectedHistoricalEvent.eventId}
                </span>
                <DataQualityBadge type="HISTORICAL" size="sm" />
              </div>
              <button
                onClick={() => setSelectedHistoricalEvent(null)}
                className="text-slate-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-1.5 text-slate-300">
              <p className="font-bold text-white text-sm">{selectedHistoricalEvent.location}</p>
              <p className="text-slate-400">{selectedHistoricalEvent.district}, {selectedHistoricalEvent.state} • {selectedHistoricalEvent.date}</p>
              
              <div className="p-2 rounded-xl bg-slate-900 border border-slate-800 space-y-1 mt-2">
                <div className="flex justify-between">
                  <span className="text-slate-400">Type:</span>
                  <span className="font-mono text-amber-300">{selectedHistoricalEvent.landslideType}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Rainfall at event:</span>
                  <span className="font-mono text-cyan-300">{selectedHistoricalEvent.associatedRainfallMm} mm</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Soil Saturation:</span>
                  <span className="font-mono text-slate-200">{selectedHistoricalEvent.soilSaturationAtEvent}%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Slope / Elevation:</span>
                  <span className="font-mono text-slate-200">{selectedHistoricalEvent.slopeDegrees}° / {selectedHistoricalEvent.elevationM}m</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Casualties:</span>
                  <span className="font-mono text-red-400 font-bold">{selectedHistoricalEvent.fatalities}</span>
                </div>
              </div>
            </div>

            <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between">
              <span className="text-[10px] font-mono text-slate-500">Source: GSI Bharat Atlas</span>
              <button
                onClick={() => openSourceModal('GSI')}
                className="text-[11px] text-cyan-400 hover:underline font-semibold"
              >
                Inspect Provenance →
              </button>
            </div>
          </div>
        )}
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
