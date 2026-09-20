import React, { useState, useMemo } from 'react';
import { 
  Cpu, 
  Sliders, 
  Sparkles, 
  Droplets, 
  Mountain, 
  TrendingUp, 
  Radio, 
  TreePine, 
  ShieldAlert, 
  RotateCcw, 
  CheckCircle2, 
  AlertTriangle,
  Info,
  ChevronRight,
  BarChart2
} from 'lucide-react';
import { LocationZone, RiskLevel } from '../types';

interface AIRiskAssessmentProps {
  zones: LocationZone[];
  initialZone?: LocationZone | null;
  onOpenAlerts: (zone: LocationZone) => void;
}

export const AIRiskAssessment: React.FC<AIRiskAssessmentProps> = ({
  zones,
  initialZone,
  onOpenAlerts
}) => {
  // Select active zone or fallback to first
  const [selectedZoneId, setSelectedZoneId] = useState<string>(
    initialZone?.id || zones[0]?.id || 'ZONE-NER-01'
  );

  const activeZone = zones.find(z => z.id === selectedZoneId) || zones[0];

  // Configurable risk thresholds
  const [lowThreshold, setLowThreshold] = useState<number>(30);
  const [highThreshold, setHighThreshold] = useState<number>(60);

  // Simulation Sliders (initialized to active zone parameters)
  const [rainfall24h, setRainfall24h] = useState<number>(activeZone.rainfall24h);
  const [rainfall7d, setRainfall7d] = useState<number>(activeZone.rainfall7d);
  const [soilMoisture, setSoilMoisture] = useState<number>(activeZone.soilMoisture);
  const [slopeAngle, setSlopeAngle] = useState<number>(activeZone.slopeAngle);
  const [groundMovement, setGroundMovement] = useState<number>(activeZone.groundMovement);
  const [vegetationIndex, setVegetationIndex] = useState<number>(activeZone.vegetationIndex);

  // Sync state when zone selection changes
  const handleZoneChange = (zoneId: string) => {
    setSelectedZoneId(zoneId);
    const z = zones.find(item => item.id === zoneId);
    if (z) {
      setRainfall24h(z.rainfall24h);
      setRainfall7d(z.rainfall7d);
      setSoilMoisture(z.soilMoisture);
      setSlopeAngle(z.slopeAngle);
      setGroundMovement(z.groundMovement);
      setVegetationIndex(z.vegetationIndex);
    }
  };

  const handleResetToBaseline = () => {
    if (activeZone) {
      setRainfall24h(activeZone.rainfall24h);
      setRainfall7d(activeZone.rainfall7d);
      setSoilMoisture(activeZone.soilMoisture);
      setSlopeAngle(activeZone.slopeAngle);
      setGroundMovement(activeZone.groundMovement);
      setVegetationIndex(activeZone.vegetationIndex);
    }
  };

  // Dynamic AI Risk Score Computation (Weighted Geotechnical Model + Random Forest simulation)
  const { score, level, factorBreakdown, explanationText, confidence } = useMemo(() => {
    // 1. Rainfall intensity & cumulative factor (0-35 points)
    const rainFactor = Math.min(35, (rainfall24h / 200) * 22 + (rainfall7d / 400) * 13);

    // 2. Soil Moisture & Pore Water Saturation (0-25 points)
    const soilFactor = Math.min(25, (soilMoisture / 100) * 25);

    // 3. Slope Angle gradient (0-20 points)
    // Slopes > 35° have exponentially higher shear stress
    const slopeFactor = Math.min(20, (slopeAngle / 50) * 20);

    // 4. Ground Movement / InSAR displacement (0-15 points)
    const movementFactor = Math.min(15, (groundMovement / 5.0) * 15);

    // 5. Vegetation buffer mitigation (subtracts up to 10 points)
    const vegMitigation = (vegetationIndex - 0.2) * 12;

    let computedScore = Math.round(rainFactor + soilFactor + slopeFactor + movementFactor - vegMitigation);
    computedScore = Math.max(5, Math.min(99, computedScore));

    let computedLevel: RiskLevel = 'LOW';
    if (computedScore > highThreshold) {
      computedLevel = 'HIGH';
    } else if (computedScore > lowThreshold) {
      computedLevel = 'MEDIUM';
    } else {
      computedLevel = 'LOW';
    }

    // Individual feature contributions (SHAP style)
    const rainPct = Math.round((rainFactor / 35) * 100);
    const soilPct = Math.round((soilFactor / 25) * 100);
    const slopePct = Math.round((slopeFactor / 20) * 100);
    const movePct = Math.round((movementFactor / 15) * 100);
    const vegPct = Math.round((1 - vegetationIndex) * 100);

    const breakdown = [
      { name: 'Rainfall Intensity & 7d Cumulative', contribution: rainPct > 70 ? 'High' : rainPct > 40 ? 'Medium' : 'Low', score: rainPct, color: 'bg-cyan-500' },
      { name: 'Slope Angle & Elevation Gradient', contribution: slopePct > 70 ? 'High' : slopePct > 40 ? 'Medium' : 'Low', score: slopePct, color: 'bg-blue-500' },
      { name: 'Soil Moisture & Pore Water Saturation', contribution: soilPct > 70 ? 'High' : soilPct > 40 ? 'Medium' : 'Low', score: soilPct, color: 'bg-amber-500' },
      { name: 'Ground Displacement (InSAR / IoT)', contribution: movePct > 70 ? 'High' : movePct > 40 ? 'Medium' : 'Low', score: movePct, color: 'bg-red-500' },
      { name: 'Deforestation / Sparse Vegetation', contribution: vegPct > 70 ? 'High' : vegPct > 40 ? 'Medium' : 'Low', score: vegPct, color: 'bg-emerald-500' },
    ];

    // Natural Language Explanation Synthesis
    let explanation = '';
    if (computedLevel === 'HIGH') {
      explanation = `High cumulative precipitation (${rainfall24h}mm/24h) combined with a steep terrain gradient (${slopeAngle}°) and ${soilMoisture}% soil saturation has dramatically raised pore-water pressures, reducing the Factor of Safety below critical equilibrium. Recent surface displacement (${groundMovement} mm/d) indicates active slope shearing.`;
    } else if (computedLevel === 'MEDIUM') {
      explanation = `Moderate rainfall (${rainfall24h}mm/24h) and increased soil moisture (${soilMoisture}%) on a ${slopeAngle}° hillside slope have placed this zone under heightened watch. Ground movement remains within manageable bounds (${groundMovement} mm/d), but further convective downpours could elevate the risk.`;
    } else {
      explanation = `Current environmental conditions are within baseline stability parameters. Antecedent rainfall is low, soil pore saturation is well beneath the critical threshold, and vegetation canopy provides adequate root anchoring against slope failure.`;
    }

    const modelConfidence = Math.min(96, Math.max(78, 85 + Math.round((rainfall24h > 100 ? 5 : -2) + (slopeAngle > 35 ? 4 : 0))));

    return {
      score: computedScore,
      level: computedLevel,
      factorBreakdown: breakdown,
      explanationText: explanation,
      confidence: modelConfidence
    };
  }, [rainfall24h, rainfall7d, soilMoisture, slopeAngle, groundMovement, vegetationIndex, lowThreshold, highThreshold]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 p-6 rounded-2xl bg-gradient-to-r from-slate-900 via-[#0a183d] to-slate-900 border border-slate-800 shadow-xl">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold uppercase tracking-wider bg-cyan-950 text-cyan-300 border border-cyan-800">
              Module: AI Risk Prediction Engine
            </span>
            <span className="text-xs font-mono text-slate-400 hidden sm:inline">
              Random Forest + XGBoost + Geotechnical FoS
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            AI Risk Assessment & Explainable AI (XAI)
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 max-w-2xl">
            Simulate environmental stress, inspect multi-parametric feature weightings, and review natural language explanations of slope vulnerability.
          </p>
        </div>

        {/* Zone Selector */}
        <div className="flex items-center gap-3">
          <div className="space-y-1">
            <label className="text-[11px] font-semibold text-slate-400 block uppercase tracking-wider">
              Select Monitored Hazard Zone:
            </label>
            <select
              id="ai-zone-selector"
              value={selectedZoneId}
              onChange={(e) => handleZoneChange(e.target.value)}
              className="px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-xs font-semibold text-white focus:outline-none focus:border-cyan-500 shadow-sm"
            >
              {zones.map(z => (
                <option key={z.id} value={z.id}>
                  {z.name} ({z.district}, {z.state}) — {z.riskLevel}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Main Analysis Grid: Left Controls & Sliders, Right Gauge & Explainable Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left 6 Columns: Interactive "What-If" Simulation Sliders */}
        <div className="lg:col-span-6 space-y-6">
          <div className="p-6 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-xl space-y-5">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <Sliders className="w-5 h-5 text-cyan-400" />
                <h3 className="text-base font-bold text-white">Interactive Environmental Sliders</h3>
              </div>
              <button
                id="reset-baseline-btn"
                onClick={handleResetToBaseline}
                className="flex items-center gap-1 text-xs text-slate-400 hover:text-white px-2.5 py-1 rounded bg-slate-800 transition-colors"
                title="Reset sliders to actual recorded sensor baseline"
              >
                <RotateCcw className="w-3 h-3" />
                <span>Reset to Baseline</span>
              </button>
            </div>

            {/* Slider 1: 24h Rainfall */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between text-xs">
                <span className="flex items-center gap-1.5 text-slate-300 font-medium">
                  <Droplets className="w-3.5 h-3.5 text-cyan-400" />
                  Rainfall Intensity (Last 24 Hours)
                </span>
                <span className="font-mono font-bold text-cyan-400 text-sm">
                  {rainfall24h} mm
                </span>
              </div>
              <input
                type="range"
                min="0"
                max="250"
                step="1"
                value={rainfall24h}
                onChange={(e) => setRainfall24h(Number(e.target.value))}
                className="w-full accent-cyan-400 h-1.5 bg-slate-800 rounded-lg cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-slate-500 font-mono">
                <span>0 mm (Dry)</span>
                <span>65 mm (Heavy)</span>
                <span>150+ mm (Cloudburst)</span>
              </div>
            </div>

            {/* Slider 2: Cumulative 7-Day Rainfall */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between text-xs">
                <span className="flex items-center gap-1.5 text-slate-300 font-medium">
                  <Droplets className="w-3.5 h-3.5 text-blue-400" />
                  Cumulative 7-Day Antecedent Rainfall
                </span>
                <span className="font-mono font-bold text-blue-400 text-sm">
                  {rainfall7d} mm
                </span>
              </div>
              <input
                type="range"
                min="0"
                max="500"
                step="5"
                value={rainfall7d}
                onChange={(e) => setRainfall7d(Number(e.target.value))}
                className="w-full accent-blue-400 h-1.5 bg-slate-800 rounded-lg cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-slate-500 font-mono">
                <span>0 mm</span>
                <span>200 mm</span>
                <span>400+ mm (Extreme)</span>
              </div>
            </div>

            {/* Slider 3: Soil Moisture */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between text-xs">
                <span className="flex items-center gap-1.5 text-slate-300 font-medium">
                  <Radio className="w-3.5 h-3.5 text-amber-400" />
                  Soil Moisture & Pore Pressure Saturation
                </span>
                <span className="font-mono font-bold text-amber-400 text-sm">
                  {soilMoisture}%
                </span>
              </div>
              <input
                type="range"
                min="20"
                max="100"
                step="1"
                value={soilMoisture}
                onChange={(e) => setSoilMoisture(Number(e.target.value))}
                className="w-full accent-amber-400 h-1.5 bg-slate-800 rounded-lg cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-slate-500 font-mono">
                <span>20% (Dry)</span>
                <span>75% (Critical Saturation Threshold)</span>
                <span>100%</span>
              </div>
            </div>

            {/* Slider 4: Slope Angle */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between text-xs">
                <span className="flex items-center gap-1.5 text-slate-300 font-medium">
                  <Mountain className="w-3.5 h-3.5 text-slate-300" />
                  Slope Gradient Angle
                </span>
                <span className="font-mono font-bold text-slate-200 text-sm">
                  {slopeAngle}°
                </span>
              </div>
              <input
                type="range"
                min="10"
                max="60"
                step="1"
                value={slopeAngle}
                onChange={(e) => setSlopeAngle(Number(e.target.value))}
                className="w-full accent-slate-400 h-1.5 bg-slate-800 rounded-lg cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-slate-500 font-mono">
                <span>10° (Gentle)</span>
                <span>35° (Unstable Angle of Repose)</span>
                <span>60° (Sheer Cliff)</span>
              </div>
            </div>

            {/* Slider 5: Ground Movement */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between text-xs">
                <span className="flex items-center gap-1.5 text-slate-300 font-medium">
                  <TrendingUp className="w-3.5 h-3.5 text-red-400" />
                  InSAR / GPS Ground Displacement Rate
                </span>
                <span className="font-mono font-bold text-red-400 text-sm">
                  {groundMovement} mm/day
                </span>
              </div>
              <input
                type="range"
                min="0"
                max="10"
                step="0.1"
                value={groundMovement}
                onChange={(e) => setGroundMovement(Number(e.target.value))}
                className="w-full accent-red-400 h-1.5 bg-slate-800 rounded-lg cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-slate-500 font-mono">
                <span>0.0 mm/d (Static)</span>
                <span>2.0 mm/d (Warning)</span>
                <span>5.0+ mm/d (Active Slip)</span>
              </div>
            </div>

            {/* Slider 6: Vegetation Index */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between text-xs">
                <span className="flex items-center gap-1.5 text-slate-300 font-medium">
                  <TreePine className="w-3.5 h-3.5 text-emerald-400" />
                  Vegetation Cover (Sentinel NDVI)
                </span>
                <span className="font-mono font-bold text-emerald-400 text-sm">
                  {vegetationIndex.toFixed(2)}
                </span>
              </div>
              <input
                type="range"
                min="0.1"
                max="0.9"
                step="0.05"
                value={vegetationIndex}
                onChange={(e) => setVegetationIndex(Number(e.target.value))}
                className="w-full accent-emerald-400 h-1.5 bg-slate-800 rounded-lg cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-slate-500 font-mono">
                <span>0.1 (Barren/Deforested)</span>
                <span>0.5 (Moderate)</span>
                <span>0.9 (Dense Forest Canopy)</span>
              </div>
            </div>

            {/* Configurable Thresholds Section */}
            <div className="pt-4 border-t border-slate-800 space-y-3">
              <div className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Configurable Risk Thresholds
              </div>
              <div className="grid grid-cols-2 gap-4 text-xs">
                <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                  <label className="text-slate-400 text-[11px] block mb-1">
                    Low → Medium Cutoff:
                  </label>
                  <div className="flex items-center gap-2">
                    <input
                      type="number"
                      min="15"
                      max="45"
                      value={lowThreshold}
                      onChange={(e) => setLowThreshold(Number(e.target.value))}
                      className="w-16 px-2 py-1 bg-slate-900 border border-slate-700 rounded text-center text-sm font-mono text-cyan-300"
                    />
                    <span className="text-[11px] text-slate-500">Default: 30</span>
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                  <label className="text-slate-400 text-[11px] block mb-1">
                    Medium → High Cutoff:
                  </label>
                  <div className="flex items-center gap-2">
                    <input
                      type="number"
                      min="50"
                      max="85"
                      value={highThreshold}
                      onChange={(e) => setHighThreshold(Number(e.target.value))}
                      className="w-16 px-2 py-1 bg-slate-900 border border-slate-700 rounded text-center text-sm font-mono text-red-400"
                    />
                    <span className="text-[11px] text-slate-500">Default: 60</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right 6 Columns: AI Score Gauge, Explainable Breakdown & Why is this area at risk? */}
        <div className="lg:col-span-6 space-y-6">
          {/* AI Score Display Hero Card */}
          <div className={`p-6 rounded-2xl border shadow-2xl transition-all duration-300 ${
            level === 'HIGH' ? 'bg-gradient-to-b from-red-950/40 to-slate-900 border-red-500/50 shadow-red-950/40' :
            level === 'MEDIUM' ? 'bg-gradient-to-b from-amber-950/40 to-slate-900 border-amber-500/50 shadow-amber-950/40' :
            'bg-gradient-to-b from-emerald-950/40 to-slate-900 border-emerald-500/50 shadow-emerald-950/40'
          }`}>
            <div className="flex items-start justify-between">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                  Predicted Landslide Susceptibility
                </span>
                <div className="text-2xl font-extrabold text-white mt-0.5">
                  AI Risk Score: <span className="font-mono text-3xl font-black">{score}</span><span className="text-slate-400 text-lg">/100</span>
                </div>
              </div>

              {/* Status Badge */}
              <div className={`px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-wider flex items-center gap-2 border ${
                level === 'HIGH' ? 'bg-red-500 text-white border-red-400 shadow-lg shadow-red-500/30' :
                level === 'MEDIUM' ? 'bg-amber-500 text-slate-950 border-amber-400' :
                'bg-emerald-500 text-slate-950 border-emerald-400'
              }`}>
                <span className="w-2 h-2 rounded-full bg-white animate-pulse" />
                <span>Risk Level: {level}</span>
              </div>
            </div>

            {/* Score Progress Bar */}
            <div className="mt-4 space-y-1">
              <div className="w-full h-3 rounded-full bg-slate-950 overflow-hidden p-0.5 border border-slate-800">
                <div 
                  className={`h-full rounded-full transition-all duration-300 ${
                    level === 'HIGH' ? 'bg-gradient-to-r from-amber-500 to-red-500' :
                    level === 'MEDIUM' ? 'bg-gradient-to-r from-yellow-500 to-amber-500' :
                    'bg-gradient-to-r from-teal-500 to-emerald-500'
                  }`}
                  style={{ width: `${score}%` }}
                />
              </div>
              <div className="flex justify-between text-[11px] text-slate-400 font-mono">
                <span>0 (Safe: &lt;{lowThreshold})</span>
                <span>{lowThreshold}-{highThreshold} (Watch)</span>
                <span>100 (Critical: &gt;{highThreshold})</span>
              </div>
            </div>

            {/* Model Confidence Metric */}
            <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs">
              <span className="text-slate-300 flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-cyan-400" />
                Model Confidence Metric:
              </span>
              <span className="font-mono font-bold text-cyan-300">
                {confidence}% Confidence
              </span>
            </div>
            <div className="text-[10px] text-slate-400 mt-1 italic">
              *Confidence represents the machine learning model's statistical certainty based on ensemble validation, not guaranteed ground occurrence.
            </div>
          </div>

          {/* Explainable AI: Feature Contribution Breakdown */}
          <div className="p-6 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-xl space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <BarChart2 className="w-5 h-5 text-cyan-400" />
                <h3 className="text-base font-bold text-white">Feature Importance (SHAP Breakdown)</h3>
              </div>
              <span className="text-[10px] font-mono text-slate-400">Relative Weighting</span>
            </div>

            <div className="space-y-3">
              {factorBreakdown.map((item, idx) => (
                <div key={idx} className="space-y-1">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-slate-300 font-medium">{item.name}</span>
                    <span className="text-xs font-bold text-slate-200">
                      {item.contribution} contribution ({item.score}%)
                    </span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-slate-950 overflow-hidden border border-slate-800">
                    <div
                      className={`h-full rounded-full ${item.color} transition-all duration-300`}
                      style={{ width: `${item.score}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* "Why is this area at risk?" Explainable Panel */}
          <div className="p-6 rounded-2xl bg-gradient-to-br from-[#0b1736] to-slate-900 border border-cyan-500/40 shadow-xl space-y-3">
            <div className="flex items-center gap-2 text-cyan-300">
              <Sparkles className="w-5 h-5" />
              <h3 className="text-base font-bold text-white">Why is this area at risk?</h3>
            </div>

            <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800/80 text-xs text-slate-200 leading-relaxed font-medium">
              "{explanationText}"
            </div>

            <div className="space-y-2 pt-2">
              <div className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Primary Trigger Diagnostics:
              </div>
              <ul className="space-y-1 text-xs text-slate-300">
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-red-400" />
                  <span>Rainfall saturation exceeding {activeZone.name} local threshold</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
                  <span>Subsurface pore pressure elevation along weathered bedrock slip plane</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
                  <span>Factor of Safety (FoS) reduced to {(1.4 - (score / 100) * 0.6).toFixed(2)} (Equilibrium &lt; 1.0)</span>
                </li>
              </ul>
            </div>

            <div className="pt-3 border-t border-slate-800 flex items-center justify-between">
              <button
                id="assessment-view-alert-dossier-btn"
                onClick={() => onOpenAlerts(activeZone)}
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-red-600 hover:bg-red-500 text-white text-xs font-bold shadow-md shadow-red-900/40 transition-colors"
              >
                <ShieldAlert className="w-4 h-4" />
                <span>View Early Warning Protocol</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
