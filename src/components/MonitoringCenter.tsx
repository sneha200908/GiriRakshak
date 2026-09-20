import React, { useState } from 'react';
import { 
  Radio, 
  Droplets, 
  Activity, 
  TrendingUp, 
  Mountain, 
  Thermometer, 
  Wind, 
  RefreshCw, 
  Clock, 
  ShieldCheck, 
  AlertCircle,
  CloudRain,
  Sliders,
  CheckCircle2,
  Info
} from 'lucide-react';
import { HOURLY_SENSOR_DATA, DAILY_TREND_DATA } from '../data/mockData';

export const MonitoringCenter: React.FC = () => {
  const [timeRange, setTimeRange] = useState<'6h' | '24h' | '7d'>('24h');
  const [selectedMetric, setSelectedMetric] = useState<'rainfall' | 'soil' | 'movement' | 'safety'>('rainfall');
  const [hoveredPoint, setHoveredPoint] = useState<number | null>(null);

  const sensorStations = [
    { id: 'IOT-ML-01', location: 'Sohra Escarpment, Meghalaya', type: 'Pore Pressure + Rain Gauge', battery: '96%', signal: '-68 dBm', status: 'Optimal' },
    { id: 'IOT-AS-04', location: 'Haflong Railway Cut, Assam', type: 'Inclinometer + Acoustic Emission', battery: '91%', signal: '-72 dBm', status: 'Optimal' },
    { id: 'IOT-SK-02', location: 'Gangtok 9th Mile, Sikkim', type: 'Tiltmeter + Ultrasonic Level', battery: '88%', signal: '-75 dBm', status: 'Optimal' },
    { id: 'IOT-NL-05', location: 'Kohima Bypass, Nagaland', type: 'InSAR Corner Reflector Node', battery: '94%', signal: '-70 dBm', status: 'Optimal' },
    { id: 'IOT-MZ-03', location: 'Hunthar Ridge, Aizawl', type: 'Ground Displacement Wire Extensometer', battery: '84%', signal: '-80 dBm', status: 'Warning' }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 p-6 rounded-2xl bg-gradient-to-r from-slate-900 via-[#0a183d] to-slate-900 border border-slate-800 shadow-xl">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold uppercase tracking-wider bg-cyan-950 text-cyan-300 border border-cyan-800">
              Live Environmental Telemetry
            </span>
            <span className="px-2 py-0.5 rounded text-[11px] font-mono bg-emerald-500/10 text-emerald-300 border border-emerald-500/30">
              DEMO DATA
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            NER Slope Sensor Monitoring Center
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 max-w-2xl">
            Real-time multi-parametric streaming of rainfall intensity, pore saturation, geotechnical shear strain, and slope displacement across the North Eastern Region.
          </p>
        </div>

        {/* Time-Range Selector */}
        <div className="flex items-center gap-2">
          <div className="flex items-center bg-slate-950 p-1 rounded-xl border border-slate-800 text-xs font-semibold">
            {(['6h', '24h', '7d'] as const).map(tr => (
              <button
                key={tr}
                onClick={() => setTimeRange(tr)}
                className={`px-3 py-1.5 rounded-lg transition-colors ${
                  timeRange === tr
                    ? 'bg-cyan-500 text-slate-950 shadow'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                {tr === '6h' ? 'Last 6 Hours' : tr === '24h' ? 'Last 24 Hours' : 'Last 7 Days'}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Environmental Indicator Cards (6 Cards) */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
        {/* 1. Rainfall */}
        <div 
          onClick={() => setSelectedMetric('rainfall')}
          className={`p-4 rounded-2xl border transition-all cursor-pointer ${
            selectedMetric === 'rainfall' 
              ? 'bg-[#0a1c3d] border-cyan-500 shadow-lg shadow-cyan-950/50' 
              : 'bg-slate-900/80 border-slate-800 hover:border-slate-700'
          }`}
        >
          <div className="flex items-center justify-between text-slate-400 text-xs">
            <span className="font-semibold">Rainfall (24h)</span>
            <Droplets className="w-4 h-4 text-cyan-400" />
          </div>
          <div className="text-2xl font-black font-mono text-cyan-400 mt-2">184.6 <span className="text-xs font-normal text-slate-400">mm</span></div>
          <div className="text-[10px] text-red-400 font-medium mt-1">Extreme (IMD Red)</div>
        </div>

        {/* 2. Soil Moisture */}
        <div 
          onClick={() => setSelectedMetric('soil')}
          className={`p-4 rounded-2xl border transition-all cursor-pointer ${
            selectedMetric === 'soil' 
              ? 'bg-[#1c1a0a] border-amber-500 shadow-lg shadow-amber-950/50' 
              : 'bg-slate-900/80 border-slate-800 hover:border-slate-700'
          }`}
        >
          <div className="flex items-center justify-between text-slate-400 text-xs">
            <span className="font-semibold">Soil Moisture</span>
            <Activity className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-2xl font-black font-mono text-amber-400 mt-2">89.4 <span className="text-xs font-normal text-slate-400">%</span></div>
          <div className="text-[10px] text-amber-300 font-medium mt-1">Exceeds 75% Limit</div>
        </div>

        {/* 3. Ground Movement */}
        <div 
          onClick={() => setSelectedMetric('movement')}
          className={`p-4 rounded-2xl border transition-all cursor-pointer ${
            selectedMetric === 'movement' 
              ? 'bg-[#240a14] border-red-500 shadow-lg shadow-red-950/50' 
              : 'bg-slate-900/80 border-slate-800 hover:border-slate-700'
          }`}
        >
          <div className="flex items-center justify-between text-slate-400 text-xs">
            <span className="font-semibold">Displacement</span>
            <TrendingUp className="w-4 h-4 text-red-400" />
          </div>
          <div className="text-2xl font-black font-mono text-red-400 mt-2">4.8 <span className="text-xs font-normal text-slate-400">mm/d</span></div>
          <div className="text-[10px] text-red-300 font-medium mt-1">Accelerating Creep</div>
        </div>

        {/* 4. Slope Stability */}
        <div 
          onClick={() => setSelectedMetric('safety')}
          className={`p-4 rounded-2xl border transition-all cursor-pointer ${
            selectedMetric === 'safety' 
              ? 'bg-[#140b2b] border-indigo-500 shadow-lg shadow-indigo-950/50' 
              : 'bg-slate-900/80 border-slate-800 hover:border-slate-700'
          }`}
        >
          <div className="flex items-center justify-between text-slate-400 text-xs">
            <span className="font-semibold">Slope Stability</span>
            <Mountain className="w-4 h-4 text-indigo-400" />
          </div>
          <div className="text-2xl font-black font-mono text-white mt-2">0.91 <span className="text-xs font-normal text-slate-400">FoS</span></div>
          <div className="text-[10px] text-red-400 font-medium mt-1">Critical (FoS &lt; 1.0)</div>
        </div>

        {/* 5. Temperature & Humidity */}
        <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800">
          <div className="flex items-center justify-between text-slate-400 text-xs">
            <span className="font-semibold">Ambient Temp</span>
            <Thermometer className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-2xl font-black font-mono text-emerald-400 mt-2">18.6 <span className="text-xs font-normal text-slate-400">°C</span></div>
          <div className="text-[10px] text-slate-400 font-medium mt-1">Humidity: 94%</div>
        </div>

        {/* 6. Radar & Weather */}
        <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800">
          <div className="flex items-center justify-between text-slate-400 text-xs">
            <span className="font-semibold">Weather Radar</span>
            <CloudRain className="w-4 h-4 text-sky-400" />
          </div>
          <div className="text-2xl font-black font-mono text-sky-300 mt-2">Overcast</div>
          <div className="text-[10px] text-cyan-400 font-medium mt-1">Bay of Bengal surge</div>
        </div>
      </div>

      {/* Main Interactive Time-Series Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Chart 1: Rainfall Trend (Last 24h) */}
        <div className="p-6 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-xl space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Droplets className="w-5 h-5 text-cyan-400" />
              <div>
                <h3 className="text-base font-bold text-white">Rainfall Trend – Last 24 Hours</h3>
                <p className="text-[11px] text-slate-400">Precipitation intensity recorded by automated rain gauges (mm/2h)</p>
              </div>
            </div>
            <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-cyan-950 text-cyan-300 border border-cyan-800">
              Peak: 54.2 mm/2h
            </span>
          </div>

          {/* Interactive SVG Bar Chart */}
          <div className="w-full h-56 bg-slate-950/80 rounded-xl border border-slate-800/80 p-4 flex flex-col justify-between">
            <svg viewBox="0 0 500 160" className="w-full h-full">
              {/* Threshold Redline (35mm/2h) */}
              <line x1="40" y1="50" x2="480" y2="50" stroke="#ef4444" strokeWidth="1" strokeDasharray="4,4" />
              <text x="485" y="53" fill="#f87171" fontSize="9" fontFamily="monospace">Danger (35mm)</text>

              {/* Grid Lines */}
              <line x1="40" y1="120" x2="480" y2="120" stroke="#1e293b" strokeWidth="1" />
              <line x1="40" y1="85" x2="480" y2="85" stroke="#1e293b" strokeWidth="1" />

              {/* Bars */}
              {HOURLY_SENSOR_DATA.map((d, i) => {
                const x = 55 + i * 60;
                const barHeight = (d.rainfall / 60) * 90;
                const y = 120 - barHeight;
                const isHovered = hoveredPoint === i;

                return (
                  <g key={i} onMouseEnter={() => setHoveredPoint(i)} onMouseLeave={() => setHoveredPoint(null)} className="cursor-pointer">
                    <rect
                      x={x - 14}
                      y={y}
                      width="28"
                      height={barHeight}
                      rx="4"
                      fill={d.rainfall > 35 ? '#ef4444' : '#38bdf8'}
                      opacity={isHovered ? 1 : 0.85}
                      className="transition-all hover:brightness-125"
                    />
                    <text x={x} y="138" fill="#94a3b8" fontSize="10" textAnchor="middle" fontFamily="monospace">
                      {d.timestamp}
                    </text>
                    {isHovered && (
                      <g>
                        <rect x={x - 30} y={y - 24} width="60" height="18" rx="4" fill="#070d1e" stroke="#38bdf8" strokeWidth="1" />
                        <text x={x} y={y - 12} fill="#38bdf8" fontSize="10" fontWeight="bold" textAnchor="middle" fontFamily="monospace">
                          {d.rainfall} mm
                        </text>
                      </g>
                    )}
                  </g>
                );
              })}
            </svg>
          </div>
        </div>

        {/* Chart 2: Soil Moisture & Saturation Curve */}
        <div className="p-6 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-xl space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Activity className="w-5 h-5 text-amber-400" />
              <div>
                <h3 className="text-base font-bold text-white">Soil Moisture Saturation – Last 24 Hours</h3>
                <p className="text-[11px] text-slate-400">Capacitive sensor readings against pore-water failure threshold</p>
              </div>
            </div>
            <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-amber-950 text-amber-300 border border-amber-800">
              Current: 88.5%
            </span>
          </div>

          {/* Line Chart */}
          <div className="w-full h-56 bg-slate-950/80 rounded-xl border border-slate-800/80 p-4 flex flex-col justify-between">
            <svg viewBox="0 0 500 160" className="w-full h-full">
              {/* Threshold Redline (75% Saturation) */}
              <line x1="40" y1="70" x2="480" y2="70" stroke="#f59e0b" strokeWidth="1" strokeDasharray="4,4" />
              <text x="485" y="73" fill="#fbbf24" fontSize="9" fontFamily="monospace">Threshold 75%</text>

              {/* Curve connecting points */}
              <path
                d="M 55 105 L 115 95 L 175 82 L 235 68 L 295 48 L 355 42 L 415 38"
                fill="none"
                stroke="#f59e0b"
                strokeWidth="3"
              />

              {/* Points */}
              {HOURLY_SENSOR_DATA.map((d, i) => {
                const x = 55 + i * 60;
                const y = 160 - (d.soilMoisture / 100) * 140;

                return (
                  <g key={i}>
                    <circle cx={x} cy={y} r="4.5" fill="#f59e0b" stroke="#ffffff" strokeWidth="1.5" />
                    <text x={x} y="148" fill="#94a3b8" fontSize="10" textAnchor="middle" fontFamily="monospace">
                      {d.timestamp}
                    </text>
                  </g>
                );
              })}
            </svg>
          </div>
        </div>

        {/* Chart 3: Ground Movement Velocity (Last 7 Days) */}
        <div className="p-6 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-xl space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-red-400" />
              <div>
                <h3 className="text-base font-bold text-white">Ground Movement Velocity – Last 7 Days</h3>
                <p className="text-[11px] text-slate-400">InSAR & Inclinometer shear plane displacement (mm/day)</p>
              </div>
            </div>
            <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-red-950 text-red-300 border border-red-800">
              Acceleration: +3.2 mm/d
            </span>
          </div>

          <div className="w-full h-56 bg-slate-950/80 rounded-xl border border-slate-800/80 p-4">
            <svg viewBox="0 0 500 160" className="w-full h-full">
              <path
                d="M 50 125 L 115 120 L 180 110 L 245 92 L 310 70 L 375 52 L 440 38"
                fill="none"
                stroke="#ef4444"
                strokeWidth="3"
              />
              {DAILY_TREND_DATA.map((d, i) => {
                const x = 50 + i * 65;
                const y = 140 - (d.rainfall / 200) * 110;
                return (
                  <g key={i}>
                    <circle cx={x} cy={y} r="4.5" fill="#ef4444" stroke="#ffffff" strokeWidth="1.5" />
                    <text x={x} y="152" fill="#94a3b8" fontSize="9" textAnchor="middle" fontFamily="monospace">
                      {d.day}
                    </text>
                  </g>
                );
              })}
            </svg>
          </div>
        </div>

        {/* Chart 4: Slope Stability Factor of Safety (FoS) */}
        <div className="p-6 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-xl space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Mountain className="w-5 h-5 text-indigo-400" />
              <div>
                <h3 className="text-base font-bold text-white">Factor of Safety (FoS) Slope Stability</h3>
                <p className="text-[11px] text-slate-400">Bishop's simplified geotechnical limit equilibrium index</p>
              </div>
            </div>
            <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-red-950 text-red-400 border border-red-800">
              FoS &lt; 1.0 (Critical)
            </span>
          </div>

          <div className="w-full h-56 bg-slate-950/80 rounded-xl border border-slate-800/80 p-4">
            <svg viewBox="0 0 500 160" className="w-full h-full">
              {/* Equilibrium baseline (FoS = 1.0) */}
              <line x1="40" y1="85" x2="480" y2="85" stroke="#ef4444" strokeWidth="1.5" strokeDasharray="5,3" />
              <text x="485" y="88" fill="#f87171" fontSize="9" fontFamily="monospace">Equilibrium (1.0)</text>

              {/* FoS curve descending */}
              <path
                d="M 55 45 L 115 52 L 175 62 L 235 75 L 295 90 L 355 96 L 415 102"
                fill="none"
                stroke="#6366f1"
                strokeWidth="3"
              />
              {HOURLY_SENSOR_DATA.map((d, i) => {
                const x = 55 + i * 60;
                const y = 160 - (d.slopeFactorOfSafety / 1.5) * 130;
                return (
                  <g key={i}>
                    <circle cx={x} cy={y} r="4" fill="#6366f1" stroke="#ffffff" strokeWidth="1.5" />
                    <text x={x} y="148" fill="#94a3b8" fontSize="10" textAnchor="middle" fontFamily="monospace">
                      {d.timestamp}
                    </text>
                  </g>
                );
              })}
            </svg>
          </div>
        </div>
      </div>

      {/* IoT Ground Sensor Health & Battery Grid */}
      <div className="p-6 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-xl space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Radio className="w-5 h-5 text-cyan-400" />
            <h3 className="text-base font-bold text-white">Active NER IoT Field Stations</h3>
          </div>
          <span className="text-xs font-mono text-emerald-400 flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            98.4% Telemetry Uptime
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400 font-semibold uppercase tracking-wider text-[10px]">
                <th className="py-2.5 px-3">Station Node ID</th>
                <th className="py-2.5 px-3">Location & Region</th>
                <th className="py-2.5 px-3">Payload Sensor Array</th>
                <th className="py-2.5 px-3">Battery</th>
                <th className="py-2.5 px-3">Signal (4G/LoRa)</th>
                <th className="py-2.5 px-3 text-right">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/50">
              {sensorStations.map(station => (
                <tr key={station.id} className="hover:bg-slate-800/40 transition-colors">
                  <td className="py-3 px-3 font-mono font-bold text-cyan-300">
                    {station.id}
                  </td>
                  <td className="py-3 px-3 font-medium text-white">
                    {station.location}
                  </td>
                  <td className="py-3 px-3 text-slate-300">
                    {station.type}
                  </td>
                  <td className="py-3 px-3 font-mono text-emerald-400">
                    {station.battery}
                  </td>
                  <td className="py-3 px-3 font-mono text-slate-400">
                    {station.signal}
                  </td>
                  <td className="py-3 px-3 text-right">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                      station.status === 'Optimal' 
                        ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' 
                        : 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                    }`}>
                      {station.status}
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
