import React, { useState } from 'react';
import { 
  Truck, 
  Train, 
  Home, 
  Layers, 
  Construction, 
  AlertTriangle, 
  ShieldAlert, 
  CheckCircle2, 
  ArrowUpRight, 
  Filter, 
  Search, 
  MapPin, 
  Clock, 
  ExternalLink 
} from 'lucide-react';
import { InfrastructureItem } from '../types';
import { getRiskColor } from '../utils/formatters';

interface InfrastructureMonitoringProps {
  infrastructure: InfrastructureItem[];
  onSelectZoneId: (zoneId: string) => void;
}

export const InfrastructureMonitoring: React.FC<InfrastructureMonitoringProps> = ({
  infrastructure,
  onSelectZoneId,
}) => {
  const [filterType, setFilterType] = useState<string>('All');
  const [filterRisk, setFilterRisk] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedAsset, setSelectedAsset] = useState<InfrastructureItem | null>(null);
  const [dispatchedAssetId, setDispatchedAssetId] = useState<string | null>(null);

  const categories = ['All', 'Road', 'Rail', 'Bridge', 'Critical Facility'];

  const filteredAssets = infrastructure.filter(item => {
    const matchesType = filterType === 'All' || item.category === filterType;
    const matchesRisk = filterRisk === 'All' || item.riskLevel === filterRisk;
    const matchesSearch = searchQuery === '' || 
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
      item.district.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.state.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.dailyTrafficOrCapacity.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesType && matchesRisk && matchesSearch;
  });

  const getAssetIcon = (category: string) => {
    switch (category) {
      case 'Road': return <Truck className="w-4 h-4 text-amber-400" />;
      case 'Rail': return <Train className="w-4 h-4 text-red-400" />;
      case 'Bridge': return <Layers className="w-4 h-4 text-cyan-400" />;
      case 'Critical Facility': return <Home className="w-4 h-4 text-emerald-400" />;
      default: return <Construction className="w-4 h-4 text-slate-400" />;
    }
  };

  const handleDispatchMachinery = (assetId: string) => {
    setDispatchedAssetId(assetId);
    setTimeout(() => {
      setDispatchedAssetId(null);
    }, 4000);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Banner */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 p-6 rounded-2xl bg-gradient-to-r from-slate-900 via-[#181a0b] to-slate-900 border border-amber-500/30 shadow-xl">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold uppercase tracking-wider bg-amber-500 text-slate-950">
              Lifeline Vulnerability Grid
            </span>
            <span className="text-xs font-mono text-slate-400 hidden sm:inline">
              Border Roads Organisation (BRO) + NHIDCL + NFR Rail Interface
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Infrastructure & Highway Risk Monitoring
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 max-w-2xl">
            Proactive hazard detection along critical transportation arteries, hillside bridges, railway lifelines, and populated valleys across North East India.
          </p>
        </div>

        {/* Quick KPI Count */}
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800 text-center">
            <div className="text-xl font-bold font-mono text-red-400">
              {infrastructure.filter(i => i.riskLevel === 'HIGH').length}
            </div>
            <div className="text-[10px] text-slate-400 font-medium">High Risk Corridors</div>
          </div>
          <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800 text-center">
            <div className="text-xl font-bold font-mono text-amber-400">
              {infrastructure.filter(i => i.inspectionStatus === 'Immediate Hazard' || i.inspectionStatus === 'Requires Mitigation').length}
            </div>
            <div className="text-[10px] text-slate-400 font-medium">Under Restriction</div>
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3 flex-wrap">
          {/* Search */}
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search highway, bridge, railway..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 pr-3 py-1.5 rounded-xl bg-slate-950 border border-slate-700 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-amber-400 w-64"
            />
          </div>

          {/* Category Tabs */}
          <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-xl border border-slate-800 text-xs">
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => setFilterType(cat)}
                className={`px-3 py-1 rounded-lg font-semibold transition-colors ${
                  filterType === cat ? 'bg-amber-500 text-slate-950' : 'text-slate-400 hover:text-white'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Risk Level Filter */}
        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-400 font-medium flex items-center gap-1">
            <Filter className="w-3.5 h-3.5" />
            Risk Filter:
          </span>
          <select
            value={filterRisk}
            onChange={(e) => setFilterRisk(e.target.value)}
            className="px-3 py-1.5 rounded-xl bg-slate-950 border border-slate-700 text-xs text-slate-200 focus:outline-none focus:border-amber-400"
          >
            <option value="All">All Levels</option>
            <option value="HIGH">High Risk</option>
            <option value="MEDIUM">Medium Risk</option>
            <option value="LOW">Low Risk</option>
          </select>
        </div>
      </div>

      {/* Asset Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredAssets.map(asset => {
          const riskColor = getRiskColor(asset.riskLevel);
          const isHigh = asset.riskLevel === 'HIGH';

          return (
            <div
              key={asset.id}
              onClick={() => setSelectedAsset(asset)}
              className={`p-5 rounded-2xl border transition-all cursor-pointer group flex flex-col justify-between ${
                isHigh 
                  ? 'bg-gradient-to-b from-red-950/20 to-slate-900 border-red-500/40 hover:border-red-500/70 shadow-lg shadow-red-950/20' 
                  : 'bg-slate-900/80 border-slate-800 hover:border-slate-700'
              }`}
            >
              <div className="space-y-3">
                {/* Header Badge */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-950 border border-slate-800 text-xs font-medium text-slate-300">
                    {getAssetIcon(asset.category)}
                    <span>{asset.category}</span>
                  </div>

                  <span className={`px-2.5 py-0.5 rounded text-[10px] font-black uppercase tracking-wider ${riskColor.badgeBg} ${riskColor.badgeText} border ${riskColor.badgeBorder}`}>
                    {asset.riskLevel} RISK
                  </span>
                </div>

                <div>
                  <h3 className="text-base font-bold text-white group-hover:text-amber-300 transition-colors">
                    {asset.name}
                  </h3>
                  <div className="text-xs text-slate-400 flex items-center gap-1 mt-0.5">
                    <MapPin className="w-3 h-3 text-slate-500" />
                    <span>{asset.district}, {asset.state}</span>
                  </div>
                </div>

                <div className="p-2.5 rounded-xl bg-slate-950/80 border border-slate-800/80 text-xs text-slate-300">
                  <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider block mb-0.5">
                    Traffic / Capacity:
                  </span>
                  {asset.dailyTrafficOrCapacity}
                </div>

                <div className="space-y-1 text-xs">
                  <div className="flex items-center justify-between text-slate-400">
                    <span>Nearest Hazard Zone:</span>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onSelectZoneId(asset.nearestRiskZone);
                      }}
                      className="font-mono text-cyan-300 font-semibold hover:underline"
                    >
                      {asset.nearestRiskZone} ({asset.distanceFromRiskZoneKm} km)
                    </button>
                  </div>
                  <div className="flex items-center justify-between text-slate-400">
                    <span>Inspection Status:</span>
                    <span className="font-semibold text-white">{asset.inspectionStatus}</span>
                  </div>
                </div>
              </div>

              {/* Action Button & Recommended Directive */}
              <div className="pt-4 mt-4 border-t border-slate-800/80 space-y-2.5">
                <div className="p-2.5 rounded-lg bg-amber-950/20 border border-amber-500/30 text-xs text-amber-200">
                  <strong className="text-amber-400 font-semibold block text-[10px] uppercase">
                    Clearance & Traffic Directive:
                  </strong>
                  {asset.recommendedAction}
                </div>

                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDispatchMachinery(asset.id);
                  }}
                  className={`w-full py-2 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
                    dispatchedAssetId === asset.id
                      ? 'bg-emerald-600 text-white'
                      : 'bg-slate-800 hover:bg-amber-500 text-slate-200 hover:text-slate-950'
                  }`}
                >
                  {dispatchedAssetId === asset.id ? (
                    <>
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>BRO Bulldozer / Team Deployed!</span>
                    </>
                  ) : (
                    <>
                      <Truck className="w-3.5 h-3.5" />
                      <span>Pre-position BRO Clearance Equipment</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
