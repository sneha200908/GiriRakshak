import React, { useState, useMemo } from 'react';
import { 
  Database, 
  Layers, 
  Clock, 
  ExternalLink, 
  CheckCircle2, 
  AlertTriangle, 
  Search, 
  Filter, 
  SlidersHorizontal, 
  Droplets, 
  Mountain, 
  Compass, 
  Radio, 
  TrendingUp, 
  FileText, 
  Download, 
  ShieldCheck, 
  ChevronRight, 
  Info,
  Calendar,
  Sparkles,
  RefreshCw,
  BarChart2,
  ArrowRight
} from 'lucide-react';
import { 
  DATA_SOURCES_REGISTRY, 
  IMD_RAINFALL_RECORDS, 
  GSI_LANDSLIDE_INVENTORY, 
  NASA_DEM_PROFILES, 
  SOIL_MOISTURE_OBSERVATIONS, 
  RESEARCH_FRAMEWORKS, 
  DATA_LIMITATIONS_RECORD 
} from '../data/authoritativeData';
import { DataPipelineService } from '../services/dataPipeline';
import { DataQualityBadge, SourceInfoButton, SourceProvenanceModal } from './SourceProvenanceModal';
import { LocationZone, RiskLevel } from '../types';
import { GSILandslideEvent, IMDRainfallRecord } from '../types/dataIntelligence';

interface DataIntelligenceViewProps {
  zones: LocationZone[];
  selectedZone: LocationZone | null;
  onSelectZone: (zoneId: string) => void;
  onNavigateToMap: () => void;
}

type SubTab = 'catalog' | 'explorer' | 'cross-source' | 'research' | 'limitations';

export const DataIntelligenceView: React.FC<DataIntelligenceViewProps> = ({
  zones,
  selectedZone,
  onSelectZone,
  onNavigateToMap
}) => {
  const [activeSubTab, setActiveSubTab] = useState<SubTab>('catalog');
  const [searchCatalog, setSearchCatalog] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  
  // Historical Explorer Filters
  const [selectedYear, setSelectedYear] = useState<number | 'ALL'>('ALL');
  const [selectedState, setSelectedState] = useState<string>('All');
  const [selectedDataType, setSelectedDataType] = useState<'All' | 'Rainfall' | 'Landslides' | 'DEM' | 'Soil'>('All');
  const [selectedLandslideEvent, setSelectedLandslideEvent] = useState<GSILandslideEvent | null>(null);

  // Compare Years Mode
  const [compareMode, setCompareMode] = useState<boolean>(false);
  const [compareYearA, setCompareYearA] = useState<number>(2022);
  const [compareYearB, setCompareYearB] = useState<number>(2026);

  // Modal State for ⓘ Source inspections
  const [modalOpen, setModalOpen] = useState<boolean>(false);
  const [modalSourceKey, setModalSourceKey] = useState<string>('IMD');
  const [customModalDetails, setCustomModalDetails] = useState<any>(null);

  const openSourceModal = (sourceKey: string, custom?: any) => {
    setModalSourceKey(sourceKey);
    setCustomModalDetails(custom || null);
    setModalOpen(true);
  };

  const years: (number | 'ALL')[] = ['ALL', 2019, 2020, 2021, 2022, 2023, 2024, 2025, 2026];
  const states = ['All', 'Assam', 'Meghalaya', 'Sikkim', 'Nagaland', 'Mizoram', 'Arunachal Pradesh', 'Manipur', 'Tripura'];

  // Filtered Catalog
  const filteredCatalog = useMemo(() => {
    return DATA_SOURCES_REGISTRY.filter(item => {
      const matchesSearch = item.datasetName.toLowerCase().includes(searchCatalog.toLowerCase()) ||
        item.source.toLowerCase().includes(searchCatalog.toLowerCase()) ||
        item.organization.toLowerCase().includes(searchCatalog.toLowerCase());
      const matchesCategory = selectedCategory === 'All' || item.category === selectedCategory;
      return matchesSearch && matchesCategory;
    });
  }, [searchCatalog, selectedCategory]);

  // Filtered Landslides for Explorer
  const filteredLandslides = useMemo(() => {
    return DataPipelineService.filterHistoricalLandslides(selectedYear, selectedState);
  }, [selectedYear, selectedState]);

  // Filtered IMD Rainfall for Explorer
  const filteredRainfall = useMemo(() => {
    return DataPipelineService.filterIMDRainfall(selectedYear, selectedState);
  }, [selectedYear, selectedState]);

  // Rainfall vs Landslides Association
  const associationData = useMemo(() => {
    return DataPipelineService.getRainfallVsLandslideAssociation(selectedYear, selectedState);
  }, [selectedYear, selectedState]);

  // Recurring Hotspots
  const hotspots = useMemo(() => {
    return DataPipelineService.getHistoricalHotspots(selectedState);
  }, [selectedState]);

  // Cross-Source Evidence for Active Zone
  const activeZoneToAnalyze = selectedZone || zones[0];
  const evidenceBundle = useMemo(() => {
    return DataPipelineService.evaluateRiskWithProvenance(activeZoneToAnalyze);
  }, [activeZoneToAnalyze]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Top Banner */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-slate-900 via-[#071330] to-slate-900 border border-slate-800 shadow-xl space-y-4">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div className="space-y-1.5">
            <div className="flex flex-wrap items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full text-xs font-bold uppercase tracking-wider bg-cyan-950 text-cyan-300 border border-cyan-800">
                Authoritative Data Layer
              </span>
              <DataQualityBadge type="OBSERVED" size="sm" />
              <DataQualityBadge type="HISTORICAL" size="sm" />
              <DataQualityBadge type="MODEL OUTPUT" size="sm" />
              <span className="text-xs text-slate-400 font-mono">Temporal: 2019 – 2026</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight flex items-center gap-2.5">
              <Database className="w-7 h-7 text-cyan-400" />
              <span>GiriRakshak Data Intelligence & Provenance Engine</span>
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 max-w-3xl leading-relaxed">
              Fusing authoritative meteorological (IMD), historical landslide records (GSI/Bharat Atlas), high-resolution DEM topography (NASA), satellite soil moisture (SMAP/MOSDAC), and peer-reviewed research frameworks. Every metric is rigorously traceable to its primary source.
            </p>
          </div>

          {/* Quick Integrity Badges */}
          <div className="flex flex-col sm:flex-row lg:flex-col gap-2 shrink-0">
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-950/70 border border-slate-800 text-xs">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span className="text-slate-300">Data Integrity: <strong className="text-white">Strict Provenance</strong></span>
            </div>
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-950/70 border border-slate-800 text-xs">
              <Layers className="w-4 h-4 text-cyan-400" />
              <span className="text-slate-300">Active Sources: <strong className="text-white">6 Authoritative</strong></span>
            </div>
          </div>
        </div>

        {/* Sub-Navigation Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto pt-2 border-t border-slate-800/80 text-xs font-semibold">
          {[
            { id: 'catalog', label: 'Data Catalog & Source Registry', icon: Database },
            { id: 'explorer', label: 'Historical Data Explorer (2019–2026)', icon: Clock },
            { id: 'cross-source', label: 'Multi-Source Risk Analysis', icon: SlidersHorizontal },
            { id: 'research', label: 'Research & Methodology References', icon: FileText },
            { id: 'limitations', label: 'Data Limitations & Audit', icon: AlertTriangle }
          ].map(tab => {
            const Icon = tab.icon;
            const active = activeSubTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveSubTab(tab.id as SubTab)}
                className={`px-3.5 py-2 rounded-xl flex items-center gap-2 whitespace-nowrap transition-colors ${
                  active 
                    ? 'bg-cyan-500 text-slate-950 font-bold shadow-md shadow-cyan-500/20' 
                    : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* ──────────────────────────────────────────────────────────
          TAB 1: DATA CATALOG & SOURCE REGISTRY
          ────────────────────────────────────────────────────────── */}
      {activeSubTab === 'catalog' && (
        <div className="space-y-5 animate-in fade-in duration-150">
          {/* Controls / Filter Bar */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 p-4 rounded-xl bg-slate-900/60 border border-slate-800">
            <div className="relative w-full sm:w-80">
              <Search className="absolute left-3 top-2.5 w-4 h-4 text-slate-500" />
              <input
                type="text"
                placeholder="Search datasets, publishers, variables..."
                value={searchCatalog}
                onChange={(e) => setSearchCatalog(e.target.value)}
                className="w-full pl-9 pr-3 py-1.5 rounded-lg bg-slate-950 border border-slate-800 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500"
              />
            </div>

            <div className="flex items-center gap-2 w-full sm:w-auto overflow-x-auto text-xs">
              <span className="text-slate-400 text-[11px] shrink-0">Category:</span>
              {['All', 'Meteorological', 'Landslide Inventory', 'Terrain & DEM', 'Soil Moisture', 'Research & Methodology'].map(cat => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-2.5 py-1 rounded-lg shrink-0 transition-colors ${
                    selectedCategory === cat 
                      ? 'bg-slate-700 text-white font-bold' 
                      : 'bg-slate-950 text-slate-400 hover:text-white border border-slate-800'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Dataset Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredCatalog.map((item) => (
              <div 
                key={item.id}
                className="p-5 rounded-2xl bg-slate-900/40 border border-slate-800 hover:border-slate-700 transition-all flex flex-col justify-between space-y-4"
              >
                <div className="space-y-3">
                  <div className="flex items-start justify-between gap-2">
                    <span className="px-2 py-0.5 rounded text-[11px] font-mono font-bold uppercase bg-slate-800 text-cyan-300 border border-slate-700">
                      {item.source}
                    </span>
                    <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase ${
                      item.status === 'Connected' 
                        ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30'
                        : item.status === 'Methodology Reference'
                        ? 'bg-indigo-500/15 text-indigo-400 border border-indigo-500/30'
                        : 'bg-blue-500/15 text-blue-400 border border-blue-500/30'
                    }`}>
                      {item.status}
                    </span>
                  </div>

                  <div>
                    <h3 className="text-sm font-bold text-white tracking-tight">{item.datasetName}</h3>
                    <p className="text-xs text-slate-400 mt-0.5 leading-snug">{item.organization}</p>
                  </div>

                  <p className="text-xs text-slate-300 leading-relaxed">
                    {item.description}
                  </p>

                  <div className="grid grid-cols-2 gap-2 text-[11px] font-mono p-2.5 rounded-lg bg-slate-950/60 border border-slate-800/80">
                    <div>
                      <span className="text-slate-500 block">Years</span>
                      <span className="text-cyan-300">{item.yearsAvailable}</span>
                    </div>
                    <div>
                      <span className="text-slate-500 block">Spatial Res</span>
                      <span className="text-slate-300 truncate block">{item.spatialResolution}</span>
                    </div>
                    <div>
                      <span className="text-slate-500 block">Temporal</span>
                      <span className="text-slate-300">{item.temporalResolution}</span>
                    </div>
                    <div>
                      <span className="text-slate-500 block">Role</span>
                      <span className="text-slate-300">{item.usageRole}</span>
                    </div>
                  </div>

                  {item.downloadFormats && (
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <span className="text-[10px] font-mono text-slate-500">Formats:</span>
                      {item.downloadFormats.map(fmt => (
                        <span key={fmt} className="px-1.5 py-0.5 rounded text-[10px] font-mono bg-slate-800/90 text-slate-300 border border-slate-700/60">
                          {fmt}
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between gap-2">
                  <button
                    onClick={() => openSourceModal(item.source)}
                    className="inline-flex items-center gap-1 text-xs text-cyan-400 hover:text-cyan-300 font-semibold"
                  >
                    <Info className="w-3.5 h-3.5" />
                    <span>View Provenance</span>
                  </button>

                  <a
                    href={item.officialUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-xs text-slate-400 hover:text-white px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 transition-colors"
                  >
                    <span>Visit Official</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ──────────────────────────────────────────────────────────
          TAB 2: HISTORICAL DATA EXPLORER (2019 – 2026)
          ────────────────────────────────────────────────────────── */}
      {activeSubTab === 'explorer' && (
        <div className="space-y-6 animate-in fade-in duration-150">
          {/* Synchronized Year Scrubber Timeline */}
          <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <span className="text-[11px] font-mono text-cyan-400 uppercase tracking-wider block font-bold">
                  Synchronized Temporal Scrubber
                </span>
                <h3 className="text-base font-bold text-white">Select Historical Period (2019 – 2026)</h3>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setCompareMode(!compareMode)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors ${
                    compareMode 
                      ? 'bg-amber-500 text-slate-950 font-bold' 
                      : 'bg-slate-800 text-slate-300 hover:text-white'
                  }`}
                >
                  <BarChart2 className="w-3.5 h-3.5" />
                  <span>{compareMode ? 'Exit Compare Mode' : 'Compare 2 Periods'}</span>
                </button>
              </div>
            </div>

            {/* Timeline Buttons */}
            <div className="grid grid-cols-3 sm:grid-cols-9 gap-1.5 bg-slate-950 p-1.5 rounded-xl border border-slate-800 text-xs">
              {years.map(yr => (
                <button
                  key={yr}
                  onClick={() => {
                    setSelectedYear(yr);
                    setCompareMode(false);
                  }}
                  className={`py-2 px-1 rounded-lg font-mono font-bold transition-all text-center ${
                    selectedYear === yr && !compareMode
                      ? 'bg-cyan-500 text-slate-950 shadow'
                      : 'text-slate-400 hover:text-white hover:bg-slate-900'
                  }`}
                >
                  {yr === 'ALL' ? 'ALL YEARS' : yr}
                </button>
              ))}
            </div>

            {/* Sub-Filters: State & Data Type */}
            <div className="flex flex-wrap items-center justify-between gap-3 pt-2 text-xs">
              <div className="flex items-center gap-2">
                <span className="text-slate-400 text-[11px] font-mono">State:</span>
                <select
                  value={selectedState}
                  onChange={(e) => setSelectedState(e.target.value)}
                  className="bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-1 text-xs text-white focus:outline-none focus:border-cyan-500"
                >
                  {states.map(st => (
                    <option key={st} value={st}>{st === 'All' ? 'All NER States' : st}</option>
                  ))}
                </select>
              </div>

              <div className="flex items-center gap-1.5">
                <span className="text-slate-400 text-[11px] font-mono">Filter Type:</span>
                {(['All', 'Rainfall', 'Landslides', 'DEM', 'Soil'] as const).map(dt => (
                  <button
                    key={dt}
                    onClick={() => setSelectedDataType(dt)}
                    className={`px-2 py-0.5 rounded text-[11px] font-mono ${
                      selectedDataType === dt
                        ? 'bg-slate-700 text-white font-bold'
                        : 'bg-slate-950 text-slate-400 hover:text-white border border-slate-800'
                    }`}
                  >
                    {dt}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Compare Two Years Mode */}
          {compareMode && (
            <div className="p-5 rounded-2xl bg-amber-950/20 border border-amber-800/40 space-y-4">
              <div className="flex items-center justify-between">
                <h4 className="text-sm font-bold text-amber-300 font-mono flex items-center gap-2">
                  <BarChart2 className="w-4 h-4" />
                  <span>Historical Cross-Period Comparison</span>
                </h4>
                <div className="flex items-center gap-2 text-xs font-mono">
                  <span>Year A:</span>
                  <select 
                    value={compareYearA} 
                    onChange={(e) => setCompareYearA(Number(e.target.value))}
                    className="bg-slate-950 border border-amber-700/50 rounded px-2 py-0.5 text-white"
                  >
                    {[2019, 2020, 2021, 2022, 2023, 2024, 2025, 2026].map(y => (
                      <option key={y} value={y}>{y}</option>
                    ))}
                  </select>
                  <span>vs Year B:</span>
                  <select 
                    value={compareYearB} 
                    onChange={(e) => setCompareYearB(Number(e.target.value))}
                    className="bg-slate-950 border border-amber-700/50 rounded px-2 py-0.5 text-white"
                  >
                    {[2019, 2020, 2021, 2022, 2023, 2024, 2025, 2026].map(y => (
                      <option key={y} value={y}>{y}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-sans">
                {/* Year A Summary */}
                <div className="p-4 rounded-xl bg-slate-950/70 border border-slate-800 space-y-3">
                  <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                    <span className="text-base font-bold text-cyan-300 font-mono">{compareYearA} Records</span>
                    <DataQualityBadge type="HISTORICAL" size="sm" />
                  </div>
                  {(() => {
                    const rainA = IMD_RAINFALL_RECORDS.filter(r => r.year === compareYearA);
                    const slidesA = GSI_LANDSLIDE_INVENTORY.filter(l => l.year === compareYearA);
                    return (
                      <div className="space-y-2 text-slate-300">
                        <p>• <strong>IMD Rainfall Events Cataloged:</strong> {rainA.length}</p>
                        <p>• <strong>GSI Documented Landslides:</strong> {slidesA.length}</p>
                        <p>• <strong>Fatalities Documented:</strong> {slidesA.reduce((a, b) => a + b.fatalities, 0)}</p>
                        <p>• <strong>Key Lifelines Severed:</strong> {slidesA.map(s => s.affectedInfrastructure).join(', ') || 'None recorded'}</p>
                      </div>
                    );
                  })()}
                </div>

                {/* Year B Summary */}
                <div className="p-4 rounded-xl bg-slate-950/70 border border-slate-800 space-y-3">
                  <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                    <span className="text-base font-bold text-amber-300 font-mono">{compareYearB} Records</span>
                    <DataQualityBadge type={compareYearB === 2026 ? 'OBSERVED' : 'HISTORICAL'} size="sm" />
                  </div>
                  {(() => {
                    const rainB = IMD_RAINFALL_RECORDS.filter(r => r.year === compareYearB);
                    const slidesB = GSI_LANDSLIDE_INVENTORY.filter(l => l.year === compareYearB);
                    return (
                      <div className="space-y-2 text-slate-300">
                        <p>• <strong>IMD Rainfall Events Cataloged:</strong> {rainB.length}</p>
                        <p>• <strong>GSI Documented Landslides:</strong> {slidesB.length}</p>
                        <p>• <strong>Fatalities Documented:</strong> {slidesB.reduce((a, b) => a + b.fatalities, 0)}</p>
                        <p>• <strong>Key Lifelines Severed:</strong> {slidesB.map(s => s.affectedInfrastructure).join(', ') || 'None recorded'}</p>
                      </div>
                    );
                  })()}
                </div>
              </div>
            </div>
          )}

          {/* Section 46: Rainfall vs Landslide Events Visualization */}
          <div className="p-5 rounded-2xl bg-slate-900/40 border border-slate-800 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-[11px] font-mono uppercase tracking-wider text-cyan-400 font-bold block">
                  Multi-Source Correlation (IMD + GSI)
                </span>
                <h3 className="text-base font-bold text-white">Rainfall Intensity vs Landslide Occurrences</h3>
                <p className="text-xs text-slate-400">
                  Visualizing temporal association between extreme precipitation and slope failure events without unproven causal claims.
                </p>
              </div>
              <SourceInfoButton onClick={() => openSourceModal('IMD')} label="IMD & GSI" />
            </div>

            <div className="space-y-3 pt-2">
              {associationData.map(row => (
                <div key={row.year} className="p-3 rounded-xl bg-slate-950/60 border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                  <div className="flex items-center gap-3">
                    <span className="w-12 font-mono font-bold text-sm text-cyan-300">{row.year}</span>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-slate-300 font-semibold">Peak Rainfall:</span>
                        <span className="font-mono text-white">{row.avgRainfallMm} mm</span>
                        <span className="text-slate-500 font-mono">({row.extremeRainfallEvents} extreme events &gt;100mm)</span>
                      </div>
                      <div className="text-[11px] text-slate-400 mt-0.5">
                        Impacted: {row.majorLifelinesImpacted.join(' • ') || 'Local slope habitations'}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 shrink-0 font-mono">
                    <div className="text-right">
                      <span className="text-slate-500 text-[10px] block">GSI Events</span>
                      <span className="font-bold text-amber-400">{row.landslideCount}</span>
                    </div>
                    <div className="text-right">
                      <span className="text-slate-500 text-[10px] block">Casualties</span>
                      <span className={`font-bold ${row.fatalities > 0 ? 'text-red-400' : 'text-slate-400'}`}>
                        {row.fatalities}
                      </span>
                    </div>
                    <div className="text-right">
                      <span className="text-slate-500 text-[10px] block">Displaced</span>
                      <span className="text-slate-300">{row.displaced}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Section 47: Hotspot / Cluster Analysis from GSI Bharat Atlas */}
          <div className="p-5 rounded-2xl bg-slate-900/40 border border-slate-800 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-[11px] font-mono uppercase tracking-wider text-amber-400 font-bold block">
                  Statistical Recurrence (Bharat Atlas NLID)
                </span>
                <h3 className="text-base font-bold text-white">Historical Landslide Hotspot & Cluster Registry</h3>
                <p className="text-xs text-slate-400">
                  Identified solely from validated multi-year failure counts in the national GSI inventory.
                </p>
              </div>
              <SourceInfoButton onClick={() => openSourceModal('GSI')} label="GSI Atlas" />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {hotspots.map(spot => (
                <div key={`${spot.district}-${spot.state}`} className="p-4 rounded-xl bg-slate-950/70 border border-slate-800 space-y-2">
                  <div className="flex items-start justify-between gap-1">
                    <div>
                      <h4 className="font-bold text-sm text-white">{spot.district}</h4>
                      <span className="text-xs text-slate-400">{spot.state}</span>
                    </div>
                    <span className="px-2 py-0.5 rounded text-[11px] font-mono font-bold bg-amber-500/15 text-amber-400 border border-amber-500/30">
                      {spot.eventsCount} Events
                    </span>
                  </div>

                  <div className="text-xs text-slate-300 space-y-1">
                    <p>• <strong>Primary Failure Mode:</strong> {spot.commonType}</p>
                    <p>• <strong>Vulnerable Lifeline:</strong> {spot.topLifeline}</p>
                    <p>• <strong>Critical Years:</strong> {spot.criticalYears.join(', ')}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Landslide Events Drilldown Table */}
          <div className="p-5 rounded-2xl bg-slate-900/40 border border-slate-800 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-white">
                Historical Landslide Inventory Events ({filteredLandslides.length} cataloged)
              </h3>
              <span className="text-xs text-slate-400 font-mono">Source: GSI Bharat Atlas</span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-slate-800 text-slate-400 font-mono text-[11px]">
                    <th className="pb-2">Event ID</th>
                    <th className="pb-2">Date / Year</th>
                    <th className="pb-2">Location & State</th>
                    <th className="pb-2">Type</th>
                    <th className="pb-2">Associated Rain</th>
                    <th className="pb-2">Slope / Elev</th>
                    <th className="pb-2">Impact</th>
                    <th className="pb-2 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60 font-sans">
                  {filteredLandslides.map(ev => (
                    <tr key={ev.id} className="hover:bg-slate-800/30 transition-colors">
                      <td className="py-2.5 font-mono text-cyan-400">{ev.eventId}</td>
                      <td className="py-2.5 font-mono text-slate-300">{ev.date}</td>
                      <td className="py-2.5">
                        <div className="font-semibold text-white">{ev.location}</div>
                        <div className="text-slate-400 text-[11px]">{ev.district}, {ev.state}</div>
                      </td>
                      <td className="py-2.5 font-mono text-amber-300">{ev.landslideType}</td>
                      <td className="py-2.5 font-mono text-slate-300">
                        {ev.associatedRainfallMm ? `${ev.associatedRainfallMm} mm` : 'Station gap'}
                      </td>
                      <td className="py-2.5 font-mono text-slate-300">
                        {ev.slopeDegrees}° / {ev.elevationM}m
                      </td>
                      <td className="py-2.5 text-slate-300">
                        {ev.fatalities > 0 ? (
                          <span className="text-red-400 font-bold">{ev.fatalities} fatal</span>
                        ) : (
                          <span className="text-slate-400">Zero fatal</span>
                        )}
                        <div className="text-[11px] text-slate-400 truncate max-w-xs">{ev.affectedInfrastructure}</div>
                      </td>
                      <td className="py-2.5 text-right">
                        <button
                          onClick={() => setSelectedLandslideEvent(ev)}
                          className="px-2 py-1 rounded bg-slate-800 hover:bg-slate-700 text-cyan-300 font-semibold text-[11px]"
                        >
                          Context
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Section 12: Event Detail & Environmental Context Modal / Box */}
          {selectedLandslideEvent && (
            <div className="p-5 rounded-2xl bg-slate-950 border border-cyan-800/60 shadow-2xl space-y-4">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <div className="flex items-center gap-2">
                  <h4 className="text-sm font-bold text-white font-mono">
                    EVENT DETAILS: {selectedLandslideEvent.eventId}
                  </h4>
                  <DataQualityBadge type="HISTORICAL" size="sm" />
                </div>
                <button
                  onClick={() => setSelectedLandslideEvent(null)}
                  className="text-slate-400 hover:text-white text-xs font-mono"
                >
                  ✕ Close
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                {/* Historical Event Characteristics */}
                <div className="p-4 rounded-xl bg-slate-900/50 border border-slate-800 space-y-2">
                  <h5 className="font-bold text-cyan-300 uppercase tracking-wider font-mono text-[11px]">
                    HISTORICAL EVENT RECORD
                  </h5>
                  <p>• <strong>Location:</strong> {selectedLandslideEvent.location}</p>
                  <p>• <strong>State & District:</strong> {selectedLandslideEvent.state}, {selectedLandslideEvent.district}</p>
                  <p>• <strong>Date of Occurrence:</strong> {selectedLandslideEvent.date}</p>
                  <p>• <strong>Morphometric Type:</strong> {selectedLandslideEvent.landslideType}</p>
                  <p>• <strong>Reported Trigger Mechanics:</strong> {selectedLandslideEvent.triggerMechanism}</p>
                  <p>• <strong>Casualties & Displacement:</strong> {selectedLandslideEvent.fatalities} fatalities, {selectedLandslideEvent.displaced} displaced</p>
                  <p>• <strong>Affected Infrastructure:</strong> {selectedLandslideEvent.affectedInfrastructure}</p>
                </div>

                {/* Associated Environmental Conditions */}
                <div className="p-4 rounded-xl bg-slate-900/50 border border-slate-800 space-y-2">
                  <h5 className="font-bold text-emerald-300 uppercase tracking-wider font-mono text-[11px]">
                    ASSOCIATED ENVIRONMENTAL CONDITIONS
                  </h5>
                  <p>• <strong>Rainfall around event:</strong> {selectedLandslideEvent.associatedRainfallMm} mm (IMD AWS record)</p>
                  <p>• <strong>Estimated Soil Pore Saturation:</strong> {selectedLandslideEvent.soilSaturationAtEvent}% capacity</p>
                  <p>• <strong>Topographic Slope:</strong> {selectedLandslideEvent.slopeDegrees}° gradient</p>
                  <p>• <strong>Elevation MSL:</strong> {selectedLandslideEvent.elevationM} meters (NASA SRTM DEM)</p>
                  <p>• <strong>Field Report ID:</strong> {selectedLandslideEvent.metadata.gsiReportId}</p>
                  <div className="p-2.5 rounded bg-blue-950/30 border border-blue-900/40 text-[11px] text-blue-200 mt-2">
                    Note: Environmental parameters represent recorded conditions temporally associated with the event; causality is validated through geotechnical back-analysis.
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ──────────────────────────────────────────────────────────
          TAB 3: MULTI-SOURCE RISK ANALYSIS (CROSS-SOURCE PIPELINE)
          ────────────────────────────────────────────────────────── */}
      {activeSubTab === 'cross-source' && (
        <div className="space-y-6 animate-in fade-in duration-150">
          {/* Active Sector Selector */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 rounded-xl bg-slate-900/60 border border-slate-800">
            <div>
              <span className="text-[11px] font-mono text-cyan-400 uppercase tracking-wider block font-bold">
                Multi-Parametric Synthesis
              </span>
              <h3 className="text-base font-bold text-white">Cross-Source Provenance Pipeline</h3>
            </div>

            <div className="flex items-center gap-2 text-xs">
              <span className="text-slate-400 font-mono">Sector:</span>
              <select
                value={activeZoneToAnalyze.id}
                onChange={(e) => onSelectZone(e.target.value)}
                className="bg-slate-950 border border-slate-800 rounded-lg px-3 py-1.5 text-xs text-white font-semibold focus:outline-none focus:border-cyan-500"
              >
                {zones.map(z => (
                  <option key={z.id} value={z.id}>
                    {z.name} ({z.district}, {z.state}) — Score: {z.riskScore}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Flow Diagram (Section 32 Architecture) */}
          <div className="p-5 rounded-2xl bg-slate-950 border border-slate-800 text-center space-y-4">
            <div className="text-xs font-mono text-slate-400 uppercase tracking-wider font-bold">
              Deterministic Ingestion Architecture
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-xs">
              <div className="p-3 rounded-xl bg-slate-900 border border-blue-900/50 space-y-1">
                <span className="text-[10px] font-mono text-cyan-400 uppercase">Precipitation Feed</span>
                <div className="font-bold text-white text-sm">IMD AWS / Radar</div>
                <div className="text-slate-400">{activeZoneToAnalyze.rainfall24h} mm (24h)</div>
                <DataQualityBadge type="OBSERVED" size="sm" />
              </div>

              <div className="p-3 rounded-xl bg-slate-900 border border-emerald-900/50 space-y-1">
                <span className="text-[10px] font-mono text-emerald-400 uppercase">Terrain Model</span>
                <div className="font-bold text-white text-sm">NASA 30m DEM</div>
                <div className="text-slate-400">{activeZoneToAnalyze.slopeAngle}° / {activeZoneToAnalyze.elevation}m</div>
                <DataQualityBadge type="DERIVED" size="sm" />
              </div>

              <div className="p-3 rounded-xl bg-slate-900 border border-purple-900/50 space-y-1">
                <span className="text-[10px] font-mono text-purple-400 uppercase">Subsurface Moisture</span>
                <div className="font-bold text-white text-sm">SMAP / MOSDAC</div>
                <div className="text-slate-400">{activeZoneToAnalyze.soilMoisture}% Saturation</div>
                <DataQualityBadge type="OBSERVED" size="sm" />
              </div>

              <div className="p-3 rounded-xl bg-slate-900 border border-amber-900/50 space-y-1">
                <span className="text-[10px] font-mono text-amber-400 uppercase">Historical Record</span>
                <div className="font-bold text-white text-sm">GSI Bharat Atlas</div>
                <div className="text-slate-400">{activeZoneToAnalyze.historyCount} Prior Incidents</div>
                <DataQualityBadge type="HISTORICAL" size="sm" />
              </div>
            </div>

            <div className="flex items-center justify-center gap-2 py-1 text-slate-500">
              <ArrowRight className="w-4 h-4 rotate-90 sm:rotate-0 text-cyan-400" />
              <span className="text-xs font-mono text-cyan-300">
                Processed via GiriRakshak Risk Engine v1.2
              </span>
              <ArrowRight className="w-4 h-4 rotate-90 sm:rotate-0 text-cyan-400" />
            </div>

            <div className="p-4 rounded-xl bg-slate-900/80 border border-cyan-800/80 max-w-xl mx-auto flex items-center justify-between">
              <div className="text-left">
                <span className="text-[10px] font-mono text-slate-400 uppercase block">Deterministic Evaluation</span>
                <span className="text-lg font-black text-white">{evidenceBundle.modelVersion}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-2xl font-black text-cyan-400">{evidenceBundle.computedScore} / 100</span>
                <DataQualityBadge type="MODEL OUTPUT" size="sm" />
              </div>
            </div>
          </div>

          {/* Evidence Breakdown Table (Section 36 & 37) */}
          <div className="p-5 rounded-2xl bg-slate-900/40 border border-slate-800 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-white">Factor Evidence & Weight Attribution</h3>
                <p className="text-xs text-slate-400">
                  Detailed provenance for each parameter fed into the deterministic model.
                </p>
              </div>
              <span className="text-xs text-slate-400 font-mono">Timestamp: {evidenceBundle.timestamp}</span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-slate-800 text-slate-400 font-mono text-[11px]">
                    <th className="pb-2">Factor / Predictor</th>
                    <th className="pb-2">Observed / Derived Value</th>
                    <th className="pb-2">Primary Source Agency</th>
                    <th className="pb-2">Data Quality Badge</th>
                    <th className="pb-2 text-right">Model Weight</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60">
                  {evidenceBundle.evidence.map((item, idx) => (
                    <tr key={idx} className="hover:bg-slate-800/30">
                      <td className="py-2.5 font-semibold text-white">{item.factorName}</td>
                      <td className="py-2.5 font-mono text-cyan-300 font-bold">{item.value}</td>
                      <td className="py-2.5 text-slate-400">{item.source}</td>
                      <td className="py-2.5">
                        <DataQualityBadge type={item.badge} size="sm" />
                      </td>
                      <td className="py-2.5 text-right font-mono text-slate-300">
                        {item.weightInModelPct > 0 ? `+${item.weightInModelPct}%` : `${item.weightInModelPct}%`}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* AI Decision Support & Attribution (Fact vs Inference) */}
          <div className="p-5 rounded-2xl bg-slate-900/40 border border-slate-800 space-y-4">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-cyan-400" />
              <h3 className="text-base font-bold text-white">AI Decision-Support Attribution Matrix</h3>
              <DataQualityBadge type="AI INTERPRETATION" size="sm" />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs font-sans">
              <div className="p-4 rounded-xl bg-slate-950/70 border border-slate-800 space-y-2">
                <span className="text-[11px] font-mono text-emerald-400 uppercase font-bold block">
                  1. OBSERVED GROUND FACTS
                </span>
                <ul className="space-y-1.5 text-slate-300">
                  {evidenceBundle.aiAttribution.observedFacts.map((fact, idx) => (
                    <li key={idx}>• {fact}</li>
                  ))}
                </ul>
              </div>

              <div className="p-4 rounded-xl bg-slate-950/70 border border-slate-800 space-y-2">
                <span className="text-[11px] font-mono text-teal-400 uppercase font-bold block">
                  2. DERIVED METRICS
                </span>
                <ul className="space-y-1.5 text-slate-300">
                  {evidenceBundle.aiAttribution.derivedMetrics.map((met, idx) => (
                    <li key={idx}>• {met}</li>
                  ))}
                </ul>
              </div>

              <div className="p-4 rounded-xl bg-slate-950/70 border border-slate-800 space-y-2">
                <span className="text-[11px] font-mono text-purple-400 uppercase font-bold block">
                  3. MODEL INFERENCES
                </span>
                <ul className="space-y-1.5 text-slate-300">
                  {evidenceBundle.aiAttribution.modelInferences.map((inf, idx) => (
                    <li key={idx}>• {inf}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ──────────────────────────────────────────────────────────
          TAB 4: RESEARCH & METHODOLOGY REFERENCES
          ────────────────────────────────────────────────────────── */}
      {activeSubTab === 'research' && (
        <div className="space-y-6 animate-in fade-in duration-150">
          <div className="p-4 rounded-xl bg-blue-950/30 border border-blue-800/40 text-xs text-blue-200 space-y-1 leading-relaxed">
            <strong className="font-mono uppercase text-cyan-300 block">Scientific Integrity Requirement</strong>
            GiriRakshak AI references peer-reviewed scientific studies to establish predictor frameworks and in-situ sensor calibration. As mandated by Section 14 and 22, these papers are strictly documented as external academic research references and are not claimed as our operational model or live observational feeds.
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {RESEARCH_FRAMEWORKS.map(ref => (
              <div key={ref.id} className="p-6 rounded-2xl bg-slate-900/40 border border-slate-800 space-y-4 flex flex-col justify-between">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase bg-indigo-500/20 text-indigo-300 border border-indigo-500/40">
                      Research Reference
                    </span>
                    <span className="text-xs font-mono text-slate-400">{ref.year}</span>
                  </div>

                  <h3 className="text-base font-bold text-white leading-snug">{ref.title}</h3>
                  <p className="text-xs text-slate-400">{ref.authors} • <em className="text-slate-300">{ref.journal}</em></p>

                  <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-300 space-y-1">
                    <strong className="text-cyan-300 font-mono uppercase text-[11px] block">Role in GiriRakshak AI:</strong>
                    <p>{ref.roleInGiriRakshak}</p>
                  </div>

                  <div className="p-3 rounded-xl bg-amber-950/20 border border-amber-900/40 text-xs text-amber-200/90 space-y-1">
                    <strong className="text-amber-400 font-mono uppercase text-[11px] block">Critical Boundary:</strong>
                    <p>{ref.criticalDistinction}</p>
                  </div>

                  <div className="space-y-2 pt-2">
                    <h4 className="text-xs font-bold text-white uppercase tracking-wider font-mono">
                      Informed Predictor Categories:
                    </h4>
                    {ref.keyPredictors.map((p, idx) => (
                      <div key={idx} className="p-2.5 rounded-lg bg-slate-950/60 border border-slate-800/80 text-xs">
                        <div className="font-bold text-cyan-300 font-mono">{p.category}: {p.factors.join(', ')}</div>
                        <div className="text-slate-400 text-[11px] mt-0.5">{p.description}</div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-800 flex justify-end">
                  <a
                    href={ref.doiUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 text-xs text-cyan-400 hover:text-cyan-300 font-semibold bg-cyan-950/40 px-3 py-1.5 rounded-lg border border-cyan-800/60"
                  >
                    <span>Read Published Study</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ──────────────────────────────────────────────────────────
          TAB 5: DATA LIMITATIONS & AUDIT RECORD
          ────────────────────────────────────────────────────────── */}
      {activeSubTab === 'limitations' && (
        <div className="space-y-6 animate-in fade-in duration-150">
          <div className="p-5 rounded-2xl bg-slate-900/40 border border-slate-800 space-y-4">
            <div>
              <span className="text-[11px] font-mono text-amber-400 uppercase tracking-wider font-bold block">
                Transparency & Reliability Audit
              </span>
              <h3 className="text-base font-bold text-white">Systemic Data Limitations & Sensor Coverage Gaps</h3>
              <p className="text-xs text-slate-400">
                In compliance with Section 49 and 50, all observational constraints, sensor spatial gaps, and model uncertainties are declared transparently without simulation masquerading as live feeds.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-sans pt-2">
              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-3">
                <h4 className="font-bold text-amber-300 font-mono uppercase text-[11px] flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5" />
                  <span>Temporal Coverage Gaps</span>
                </h4>
                <div className="space-y-2">
                  {DATA_LIMITATIONS_RECORD.temporalGaps.map((tg, idx) => (
                    <div key={idx} className="p-2.5 rounded-lg bg-slate-900/60 border border-slate-800">
                      <strong className="text-white font-mono block">{tg.source}</strong>
                      <p className="text-slate-300 text-[11px] mt-0.5">{tg.coverage}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-3">
                <h4 className="font-bold text-cyan-300 font-mono uppercase text-[11px] flex items-center gap-1.5">
                  <Compass className="w-3.5 h-3.5" />
                  <span>Spatial Instrumentation Gaps</span>
                </h4>
                <div className="space-y-2">
                  {DATA_LIMITATIONS_RECORD.spatialGaps.map((sg, idx) => (
                    <div key={idx} className="p-2.5 rounded-lg bg-slate-900/60 border border-slate-800">
                      <strong className="text-white font-mono block">{sg.parameter}</strong>
                      <p className="text-slate-300 text-[11px] mt-0.5">{sg.note}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 text-xs font-mono space-y-2">
              <span className="text-slate-400 uppercase text-[11px] block font-bold">Model Confidence & Error Bounds:</span>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <span className="text-slate-500 block">Engine Version</span>
                  <span className="text-white font-bold">{DATA_LIMITATIONS_RECORD.modelUncertainty.engineVersion}</span>
                </div>
                <div>
                  <span className="text-slate-500 block">Confidence Interval</span>
                  <span className="text-emerald-400 font-bold">{DATA_LIMITATIONS_RECORD.modelUncertainty.confidenceBounds}</span>
                </div>
                <div>
                  <span className="text-slate-500 block">False Trigger Rate</span>
                  <span className="text-cyan-400 font-bold">{DATA_LIMITATIONS_RECORD.modelUncertainty.falseAlarmRate}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Reusable Provenance Modal */}
      <SourceProvenanceModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        sourceKey={modalSourceKey}
        customDetails={customModalDetails}
      />
    </div>
  );
};
