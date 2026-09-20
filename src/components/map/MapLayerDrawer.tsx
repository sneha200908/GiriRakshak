import React from 'react';
import { 
  X, 
  Layers, 
  Droplets, 
  Mountain, 
  AlertTriangle, 
  History, 
  Radio, 
  Sliders, 
  Info,
  CheckSquare,
  Square,
  ExternalLink,
  Database
} from 'lucide-react';
import { MapLayerConfig, LAYER_ATTRIBUTION } from '../../services/mapStateService';

interface MapLayerDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  layers: MapLayerConfig;
  onToggleLayer: (key: keyof MapLayerConfig) => void;
  onChangeRainfallOpacity: (val: number) => void;
  historicalYear: number | 'ALL';
  onChangeHistoricalYear: (year: number | 'ALL') => void;
  onOpenSourceModal: (sourceKey: string) => void;
}

export const MapLayerDrawer: React.FC<MapLayerDrawerProps> = ({
  isOpen,
  onClose,
  layers,
  onToggleLayer,
  onChangeRainfallOpacity,
  historicalYear,
  onChangeHistoricalYear,
  onOpenSourceModal
}) => {
  if (!isOpen) return null;

  return (
    <div className="absolute top-14 right-4 z-40 w-80 sm:w-96 max-h-[85vh] rounded-2xl bg-[#091326]/95 dark:bg-[#091326]/95 border border-slate-700/90 shadow-2xl backdrop-blur-md overflow-hidden flex flex-col animate-in fade-in slide-in-from-top-2 duration-150 text-xs">
      {/* Drawer Header */}
      <div className="p-3.5 bg-slate-950/90 border-b border-slate-800 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Layers className="w-4 h-4 text-cyan-400" />
          <h3 className="font-bold text-white text-sm">GIS Geospatial Layers</h3>
        </div>
        <button
          onClick={onClose}
          className="p-1 rounded-lg bg-slate-800/80 hover:bg-slate-700 text-slate-400 hover:text-white"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Layer Groups Container */}
      <div className="flex-1 overflow-y-auto p-3.5 space-y-4 no-scrollbar">
        {/* 1. RISK GROUP */}
        <div className="space-y-2">
          <div className="flex items-center justify-between pb-1 border-b border-slate-800 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
            <span>Landslide Risk Layers</span>
            <button 
              onClick={() => onOpenSourceModal('GSI')}
              className="text-[10px] text-cyan-400 hover:underline flex items-center gap-0.5"
            >
              <Info className="w-3 h-3" /> Model Info
            </button>
          </div>
          <div className="space-y-1.5">
            <label className="flex items-center justify-between p-2 rounded-xl bg-slate-900/60 hover:bg-slate-800/50 cursor-pointer border border-slate-800">
              <div className="flex items-center gap-2.5">
                <input
                  type="checkbox"
                  checked={layers.currentRisk}
                  onChange={() => onToggleLayer('currentRisk')}
                  className="rounded border-slate-700 text-cyan-500 focus:ring-0"
                />
                <div>
                  <span className="font-semibold text-slate-200 block">Current Hazard Markers</span>
                  <span className="text-[10px] text-slate-400">GiriRakshak Geotechnical Index (0-100)</span>
                </div>
              </div>
              <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-cyan-950 text-cyan-300 border border-cyan-800">
                MODEL
              </span>
            </label>

            <label className="flex items-center justify-between p-2 rounded-xl bg-slate-900/60 hover:bg-slate-800/50 cursor-pointer border border-slate-800">
              <div className="flex items-center gap-2.5">
                <input
                  type="checkbox"
                  checked={layers.riskHeatmap}
                  onChange={() => onToggleLayer('riskHeatmap')}
                  className="rounded border-slate-700 text-cyan-500 focus:ring-0"
                />
                <div>
                  <span className="font-semibold text-slate-200 block">Regional Risk Heatmap</span>
                  <span className="text-[10px] text-slate-400">Continuous surface interpolated hazard density</span>
                </div>
              </div>
              <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-slate-800 text-slate-400">
                DERIVED
              </span>
            </label>
          </div>
        </div>

        {/* 2. ALERTS GROUP */}
        <div className="space-y-2">
          <div className="flex items-center justify-between pb-1 border-b border-slate-800 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
            <span>Early Warning Alerts</span>
            <span className="text-[10px] text-slate-500">Live Active</span>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <label className="flex items-center gap-2 p-2 rounded-xl bg-red-950/30 border border-red-800/40 cursor-pointer">
              <input
                type="checkbox"
                checked={layers.criticalAlerts}
                onChange={() => onToggleLayer('criticalAlerts')}
                className="rounded border-slate-700 text-red-500 focus:ring-0"
              />
              <div>
                <span className="font-bold text-red-300 block">🔴 Critical</span>
                <span className="text-[10px] text-red-400/80">Immediate review</span>
              </div>
            </label>

            <label className="flex items-center gap-2 p-2 rounded-xl bg-amber-950/30 border border-amber-800/40 cursor-pointer">
              <input
                type="checkbox"
                checked={layers.warningAlerts}
                onChange={() => onToggleLayer('warningAlerts')}
                className="rounded border-slate-700 text-amber-500 focus:ring-0"
              />
              <div>
                <span className="font-bold text-amber-300 block">🟠 Warning</span>
                <span className="text-[10px] text-amber-400/80">Elevated danger</span>
              </div>
            </label>
          </div>
        </div>

        {/* 3. WEATHER GROUP (IMD) */}
        <div className="space-y-2">
          <div className="flex items-center justify-between pb-1 border-b border-slate-800 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
            <span>Weather & Precipitation</span>
            <button 
              onClick={() => onOpenSourceModal('IMD')}
              className="text-[10px] text-cyan-400 hover:underline flex items-center gap-0.5"
            >
              <Info className="w-3 h-3" /> IMD AWS Source
            </button>
          </div>
          <div className="space-y-2">
            <label className="flex items-center justify-between p-2 rounded-xl bg-slate-900/60 hover:bg-slate-800/50 cursor-pointer border border-slate-800">
              <div className="flex items-center gap-2.5">
                <input
                  type="checkbox"
                  checked={layers.rainfallOverlay}
                  onChange={() => onToggleLayer('rainfallOverlay')}
                  className="rounded border-slate-700 text-cyan-500 focus:ring-0"
                />
                <div>
                  <span className="font-semibold text-slate-200 block">IMD Rainfall Isohyets</span>
                  <span className="text-[10px] text-slate-400">Doppler radar & automatic weather stations</span>
                </div>
              </div>
              <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-blue-950 text-cyan-300 border border-blue-800">
                OBSERVED
              </span>
            </label>

            {/* Opacity Slider */}
            {layers.rainfallOverlay && (
              <div className="px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
                <div className="flex items-center justify-between text-[11px]">
                  <span className="text-slate-400">Rainfall Overlay Opacity</span>
                  <span className="font-mono font-bold text-cyan-400">{Math.round(layers.rainfallOpacity * 100)}%</span>
                </div>
                <input
                  type="range"
                  min="0.1"
                  max="1.0"
                  step="0.05"
                  value={layers.rainfallOpacity}
                  onChange={(e) => onChangeRainfallOpacity(parseFloat(e.target.value))}
                  className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-cyan-400"
                />
              </div>
            )}
          </div>
        </div>

        {/* 4. LANDSLIDES (GSI & ISRO Bhuvan) */}
        <div className="space-y-2">
          <div className="flex items-center justify-between pb-1 border-b border-slate-800 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
            <span>Landslide Databases</span>
            <button 
              onClick={() => onOpenSourceModal('GSI')}
              className="text-[10px] text-amber-400 hover:underline flex items-center gap-0.5"
            >
              <Info className="w-3 h-3" /> GSI Registry
            </button>
          </div>
          <div className="space-y-2">
            <label className="flex items-center justify-between p-2 rounded-xl bg-slate-900/60 hover:bg-slate-800/50 cursor-pointer border border-slate-800">
              <div className="flex items-center gap-2.5">
                <input
                  type="checkbox"
                  checked={layers.historicalLandslides}
                  onChange={() => onToggleLayer('historicalLandslides')}
                  className="rounded border-slate-700 text-amber-500 focus:ring-0"
                />
                <div>
                  <span className="font-semibold text-slate-200 block">GSI Historical Inventory</span>
                  <span className="text-[10px] text-slate-400">National Landslide Susceptibility Mapping</span>
                </div>
              </div>
              <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-amber-950 text-amber-300 border border-amber-800">
                HISTORICAL
              </span>
            </label>

            {/* Year Selector */}
            {layers.historicalLandslides && (
              <div className="flex items-center justify-between px-3 py-2 rounded-xl bg-slate-950 border border-slate-800">
                <span className="text-[11px] text-slate-400">Filter Incident Year:</span>
                <select
                  value={historicalYear}
                  onChange={(e) => onChangeHistoricalYear(e.target.value === 'ALL' ? 'ALL' : Number(e.target.value))}
                  className="px-2 py-1 rounded bg-slate-900 border border-slate-700 text-amber-300 font-mono text-[11px] focus:outline-none"
                >
                  <option value="ALL">All Years (2019-2026)</option>
                  {[2019, 2020, 2021, 2022, 2023, 2024, 2025, 2026].map(y => (
                    <option key={y} value={y}>{y}</option>
                  ))}
                </select>
              </div>
            )}

            {/* Bhuvan Early Warning */}
            <label className="flex items-center justify-between p-2 rounded-xl bg-slate-900/60 hover:bg-slate-800/50 cursor-pointer border border-slate-800">
              <div className="flex items-center gap-2.5">
                <input
                  type="checkbox"
                  checked={layers.bhuvanEarlyWarning}
                  onChange={() => onToggleLayer('bhuvanEarlyWarning')}
                  className="rounded border-slate-700 text-indigo-500 focus:ring-0"
                />
                <div>
                  <span className="font-semibold text-slate-200 block">ISRO Bhuvan Early Warning</span>
                  <span className="text-[10px] text-slate-400">NRSC seasonal landslide hazard corridors</span>
                </div>
              </div>
              <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-indigo-950 text-indigo-300 border border-indigo-800">
                OFFICIAL
              </span>
            </label>
          </div>
        </div>

        {/* 5. TOPOGRAPHY & TERRAIN (NASA SRTM DEM) */}
        <div className="space-y-2">
          <div className="flex items-center justify-between pb-1 border-b border-slate-800 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
            <span>Terrain & Elevation</span>
            <button 
              onClick={() => onOpenSourceModal('NASA_DEM')}
              className="text-[10px] text-emerald-400 hover:underline flex items-center gap-0.5"
            >
              <Info className="w-3 h-3" /> NASA SRTM
            </button>
          </div>
          <div className="space-y-1.5">
            <label className="flex items-center justify-between p-2 rounded-xl bg-slate-900/60 hover:bg-slate-800/50 cursor-pointer border border-slate-800">
              <div className="flex items-center gap-2.5">
                <input
                  type="checkbox"
                  checked={layers.elevationContours}
                  onChange={() => onToggleLayer('elevationContours')}
                  className="rounded border-slate-700 text-emerald-500 focus:ring-0"
                />
                <div>
                  <span className="font-semibold text-slate-200 block">Elevation Contours (30m)</span>
                  <span className="text-[10px] text-slate-400">NASA SRTM Topographic Relief</span>
                </div>
              </div>
              <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-800">
                STATIC
              </span>
            </label>

            {/* Soil Moisture */}
            <label className="flex items-center justify-between p-2 rounded-xl bg-slate-900/60 hover:bg-slate-800/50 cursor-pointer border border-slate-800">
              <div className="flex items-center gap-2.5">
                <input
                  type="checkbox"
                  checked={layers.soilMoisture}
                  onChange={() => onToggleLayer('soilMoisture')}
                  className="rounded border-slate-700 text-purple-500 focus:ring-0"
                />
                <div>
                  <span className="font-semibold text-slate-200 block">NASA SMAP Soil Saturation</span>
                  <span className="text-[10px] text-slate-400">L4 Geophysical subsurface pore pressure</span>
                </div>
              </div>
              <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-purple-950 text-purple-300 border border-purple-800">
                NEAR-LIVE
              </span>
            </label>
          </div>
        </div>

        {/* 6. INFRASTRUCTURE & LIFELINES */}
        <div className="space-y-2">
          <div className="flex items-center justify-between pb-1 border-b border-slate-800 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
            <span>Critical Lifelines</span>
            <span className="text-[10px] text-slate-500">NHAI / BRO</span>
          </div>
          <div className="space-y-1.5">
            <label className="flex items-center justify-between p-2 rounded-xl bg-slate-900/60 hover:bg-slate-800/50 cursor-pointer border border-slate-800">
              <div className="flex items-center gap-2.5">
                <input
                  type="checkbox"
                  checked={layers.highways}
                  onChange={() => onToggleLayer('highways')}
                  className="rounded border-slate-700 text-amber-500 focus:ring-0"
                />
                <div>
                  <span className="font-semibold text-slate-200 block">Strategic Highways (NH-6, NH-10, NH-29)</span>
                  <span className="text-[10px] text-slate-400">Emergency logistics & arterial supply routes</span>
                </div>
              </div>
              <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-amber-950 text-amber-300 border border-amber-800">
                INFRA
              </span>
            </label>
          </div>
        </div>
      </div>

      {/* Footer Notice */}
      <div className="p-3 bg-slate-950 border-t border-slate-800 text-[10px] text-slate-400 flex items-center justify-between">
        <span>GiriRakshak Multi-Agency GIS</span>
        <button
          onClick={() => onOpenSourceModal('ALL')}
          className="text-cyan-400 hover:underline flex items-center gap-1 font-mono"
        >
          <Database className="w-3 h-3" /> Source Provenance
        </button>
      </div>
    </div>
  );
};
