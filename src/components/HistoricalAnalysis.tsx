import React, { useState } from 'react';
import { 
  History, 
  Calendar, 
  MapPin, 
  TrendingUp, 
  BarChart2, 
  Droplets, 
  CheckCircle2, 
  AlertCircle,
  Filter,
  Search
} from 'lucide-react';
import { HISTORICAL_LANDSLIDES, NER_STATES_SUMMARY } from '../data/mockData';
import { HistoricalPlayback } from './HistoricalPlayback';

interface HistoricalIncidentView {
  id: string;
  year: number;
  date: string;
  location: string;
  state: string;
  trigger: string;
  impact: string;
  recoveryStatus: string;
}

export const HistoricalAnalysis: React.FC = () => {
  const [selectedState, setSelectedState] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const detailedIncidents: HistoricalIncidentView[] = [
    {
      id: 'HIST-01',
      year: 2024,
      date: 'May 28, 2024',
      location: 'Melthum & Aibawk, Aizawl, Mizoram',
      state: 'Mizoram',
      trigger: 'Cyclone Remal extreme rainfall (298mm in 24h) oversaturating shale slopes',
      impact: '34 fatalities, stone quarry collapse, NH-54 severed for 11 days',
      recoveryStatus: 'Fully Stabilized'
    },
    {
      id: 'HIST-02',
      year: 2023,
      date: 'Oct 4, 2023',
      location: 'Chungthang & Dikchu, Mangan, Sikkim',
      state: 'Sikkim',
      trigger: 'GLOF flash surge inducing severe toe scouring & rotational debris failure',
      impact: '42 fatalities, Teesta-III dam breached, NH-10 washed out in 28 spots',
      recoveryStatus: 'Reconstruction Ongoing'
    },
    {
      id: 'HIST-03',
      year: 2022,
      date: 'June 30, 2022',
      location: 'Tupul Railway Yard, Noney, Manipur',
      state: 'Manipur',
      trigger: 'Continuous monsoon downpours on deforested hill cutting',
      impact: '58 fatalities, Ijai river dammed forming hazardous artificial reservoir',
      recoveryStatus: 'Geotechnical Retaining Active'
    },
    {
      id: 'HIST-04',
      year: 2022,
      date: 'May 14, 2022',
      location: 'New Haflong Railway Section, Dima Hasao, Assam',
      state: 'Assam',
      trigger: 'Disang shale pore pressure saturation (312mm pre-monsoon rain)',
      impact: '9 fatalities, railway station submerged, hill railway offline for 2 months',
      recoveryStatus: 'Retaining Wall & Inclinometers Deployed'
    },
    {
      id: 'HIST-05',
      year: 2020,
      date: 'Sept 22, 2020',
      location: 'Nongstoin-Mairang Road KM 32, Meghalaya',
      state: 'Meghalaya',
      trigger: 'Continuous 5-day rain surge triggering planar debris slip',
      impact: '3 casualties, optic fiber severed, state highway blocked for 72h',
      recoveryStatus: 'Terraced Cut Slope Completed'
    },
    {
      id: 'HIST-06',
      year: 2018,
      date: 'July 18, 2018',
      location: 'Kohima Zubza KM 149 Sinking Zone, Nagaland',
      state: 'Nagaland',
      trigger: 'Tectonic shear zone creep exacerbated by unlined hillside road drainage',
      impact: '200m roadway section subsided 4 meters, Dimapur transit severed',
      recoveryStatus: 'Micropile Reinforced'
    }
  ];

  const stateDistribution = [
    { state: 'Assam', incidents: 384, highRiskZones: 3 },
    { state: 'Meghalaya', incidents: 326, highRiskZones: 4 },
    { state: 'Sikkim', incidents: 290, highRiskZones: 2 },
    { state: 'Mizoram', incidents: 215, highRiskZones: 1 },
    { state: 'Nagaland', incidents: 198, highRiskZones: 2 },
    { state: 'Manipur', incidents: 164, highRiskZones: 0 },
    { state: 'Arunachal Pradesh', incidents: 142, highRiskZones: 0 },
    { state: 'Tripura', incidents: 48, highRiskZones: 0 },
  ];

  const monthlyIncidents = [
    { month: 'Jan', count: 12, rain: 25 },
    { month: 'Feb', count: 18, rain: 35 },
    { month: 'Mar', count: 32, rain: 60 },
    { month: 'Apr', count: 58, rain: 110 },
    { month: 'May', count: 142, rain: 240 },
    { month: 'Jun', count: 384, rain: 520 },
    { month: 'Jul', count: 462, rain: 610 },
    { month: 'Aug', count: 410, rain: 550 },
    { month: 'Sep', count: 295, rain: 420 },
    { month: 'Oct', count: 110, rain: 160 },
    { month: 'Nov', count: 24, rain: 40 },
    { month: 'Dec', count: 14, rain: 20 },
  ];

  const filteredIncidents = detailedIncidents.filter((inc: HistoricalIncidentView) => {
    const matchesState = selectedState === 'All' || inc.state === selectedState;
    const matchesSearch = searchQuery === '' || 
      inc.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
      inc.trigger.toLowerCase().includes(searchQuery.toLowerCase()) ||
      inc.year.toString().includes(searchQuery);
    return matchesState && matchesSearch;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Header */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-slate-900 via-[#0a183d] to-slate-900 border border-slate-800 shadow-xl space-y-2">
        <div className="flex items-center gap-2">
          <span className="px-2.5 py-0.5 rounded-full text-xs font-bold uppercase tracking-wider bg-cyan-950 text-cyan-300 border border-cyan-800">
            Retrospective Geological Intelligence
          </span>
          <span className="text-xs font-mono text-slate-400">
            10-Year NER Landslide Registry (2015 – 2025)
          </span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
          Historical Landslide Database & Seasonality Analysis
        </h1>
        <p className="text-xs sm:text-sm text-slate-300 max-w-3xl leading-relaxed">
          Examining historical landslide catalogs, triggering rainfall thresholds, and recurring slope failures across the North Eastern Region to train and validate GiriRakshak AI predictive neural networks.
        </p>
      </div>

      {/* Historical Playback Interactive Scrubber */}
      <HistoricalPlayback />

      {/* Summary Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-1">
          <div className="text-xs text-slate-400 font-semibold">Catalogued Incidents</div>
          <div className="text-2xl font-black font-mono text-cyan-300">1,781</div>
          <div className="text-[10px] text-slate-500">Across 8 North Eastern States</div>
        </div>

        <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-1">
          <div className="text-xs text-slate-400 font-semibold">Rainfall Trigger Index</div>
          <div className="text-2xl font-black font-mono text-amber-400">82.4%</div>
          <div className="text-[10px] text-slate-500">Precipitation-driven slope failures</div>
        </div>

        <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-1">
          <div className="text-xs text-slate-400 font-semibold">Peak Monsoon Clustering</div>
          <div className="text-2xl font-black font-mono text-red-400">June – August</div>
          <div className="text-[10px] text-slate-500">71% of all historical events</div>
        </div>

        <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-1">
          <div className="text-xs text-slate-400 font-semibold">Corridor Vulnerability</div>
          <div className="text-2xl font-black font-mono text-emerald-400">NH-6 & NH-10</div>
          <div className="text-[10px] text-slate-500">Highest frequency road lifelines</div>
        </div>
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Chart 1: State-wise Landslide Incidents */}
        <div className="p-6 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-xl space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <BarChart2 className="w-5 h-5 text-cyan-400" />
              <h3 className="text-base font-bold text-white">Historical Landslide Density by State</h3>
            </div>
            <span className="text-xs font-mono text-slate-400">Recorded Incidents</span>
          </div>

          <div className="space-y-3">
            {stateDistribution.map((st) => (
              <div key={st.state} className="space-y-1">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-slate-200">{st.state}</span>
                  <span className="font-mono text-slate-400">
                    <strong className="text-cyan-300">{st.incidents}</strong> incidents ({st.highRiskZones} high-risk zones)
                  </span>
                </div>
                <div className="w-full h-2 rounded-full bg-slate-950 overflow-hidden border border-slate-800">
                  <div 
                    className="h-full rounded-full bg-gradient-to-r from-blue-500 to-cyan-400"
                    style={{ width: `${(st.incidents / 500) * 100}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Chart 2: Monthly Seasonality & Rainfall Correlation */}
        <div className="p-6 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-xl space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-amber-400" />
              <div>
                <h3 className="text-base font-bold text-white">Rainfall vs. Landslide Correlation (Annual)</h3>
                <p className="text-[11px] text-slate-400">Heavy clustering during South-West Monsoon (June – Sept)</p>
              </div>
            </div>
            <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-red-950 text-red-300 border border-red-800">
              Peak: July
            </span>
          </div>

          <div className="w-full h-64 bg-slate-950/80 rounded-xl border border-slate-800/80 p-4 flex flex-col justify-between">
            <svg viewBox="0 0 500 180" className="w-full h-full">
              {/* Highlight Monsoon Window */}
              <rect x="200" y="20" width="180" height="130" fill="#38bdf8" fillOpacity="0.08" rx="6" />
              <text x="290" y="36" fill="#38bdf8" fontSize="9" textAnchor="middle" fontWeight="bold">Monsoon Surge Window</text>

              {/* Rainfall bars */}
              {monthlyIncidents.map((m, i) => {
                const x = 30 + i * 38;
                const barHeight = (m.rain / 650) * 100;
                const y = 150 - barHeight;

                return (
                  <g key={i}>
                    <rect x={x - 8} y={y} width="16" height={barHeight} rx="3" fill="#0284c7" opacity="0.6" />
                    <text x={x} y="165" fill="#94a3b8" fontSize="9" textAnchor="middle" fontFamily="monospace">
                      {m.month}
                    </text>
                  </g>
                );
              })}

              {/* Incidents line */}
              <path
                d="M 30 145 L 68 142 L 106 135 L 144 125 L 182 95 L 220 45 L 258 35 L 296 42 L 334 68 L 372 108 L 410 138 L 448 144"
                fill="none"
                stroke="#ef4444"
                strokeWidth="2.5"
              />
              {monthlyIncidents.map((m, i) => {
                const x = 30 + i * 38;
                const y = 150 - (m.count / 500) * 120;
                return (
                  <circle key={i} cx={x} cy={y} r="3" fill="#ef4444" stroke="#ffffff" strokeWidth="1" />
                );
              })}
            </svg>

            <div className="flex items-center justify-between text-[11px] text-slate-400 pt-2 border-t border-slate-800">
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded bg-sky-600" />
                Average Rainfall (mm)
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-red-500" />
                Recorded Landslides (Count)
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Historical Major Incidents Table */}
      <div className="p-6 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-xl space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div className="flex items-center gap-2">
            <History className="w-5 h-5 text-cyan-400" />
            <h3 className="text-base font-bold text-white">Major Recorded Landslide Events in NER</h3>
          </div>

          <div className="flex items-center gap-2">
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search incident..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-8 pr-3 py-1.5 rounded-lg bg-slate-950 border border-slate-700 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-cyan-500 w-44"
              />
            </div>

            <select
              value={selectedState}
              onChange={(e) => setSelectedState(e.target.value)}
              className="px-2.5 py-1.5 rounded-lg bg-slate-950 border border-slate-700 text-xs text-slate-200 focus:outline-none"
            >
              <option value="All">All States</option>
              <option value="Assam">Assam</option>
              <option value="Meghalaya">Meghalaya</option>
              <option value="Sikkim">Sikkim</option>
              <option value="Nagaland">Nagaland</option>
              <option value="Manipur">Manipur</option>
              <option value="Mizoram">Mizoram</option>
            </select>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400 font-semibold uppercase tracking-wider text-[10px]">
                <th className="py-2.5 px-3">Year</th>
                <th className="py-2.5 px-3">Location & District</th>
                <th className="py-2.5 px-3">Primary Trigger</th>
                <th className="py-2.5 px-3">Impact & Casualties</th>
                <th className="py-2.5 px-3 text-right">Recovery Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/50">
              {filteredIncidents.map((inc: HistoricalIncidentView) => (
                <tr key={inc.id} className="hover:bg-slate-800/40 transition-colors">
                  <td className="py-3 px-3 font-mono font-bold text-cyan-300">
                    {inc.year}
                  </td>
                  <td className="py-3 px-3 font-medium text-white">
                    {inc.location}
                  </td>
                  <td className="py-3 px-3 text-amber-300 font-medium">
                    {inc.trigger}
                  </td>
                  <td className="py-3 px-3 text-slate-300">
                    {inc.impact}
                  </td>
                  <td className="py-3 px-3 text-right">
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-800 text-slate-300 border border-slate-700">
                      {inc.recoveryStatus}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
