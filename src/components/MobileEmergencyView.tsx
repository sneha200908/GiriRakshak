import React from 'react';
import { 
  AlertTriangle, 
  MapPin, 
  FileText, 
  PhoneCall, 
  ChevronRight, 
  Droplets, 
  Layers, 
  ShieldAlert,
  ArrowRight
} from 'lucide-react';
import { useDisaster } from '../context/DisasterContext';
import { RiskGauge } from './RiskGauge';

interface MobileEmergencyViewProps {
  onOpenMap: () => void;
  onOpenAlerts: () => void;
  onOpenReports: () => void;
}

export const MobileEmergencyView: React.FC<MobileEmergencyViewProps> = ({
  onOpenMap,
  onOpenAlerts,
  onOpenReports
}) => {
  const { selectedZone, criticalAlertCount, regionalRiskStatus } = useDisaster();

  if (!selectedZone) return null;

  return (
    <div className="block lg:hidden space-y-4 text-white">
      {/* Critical Alert Header */}
      <div className="p-4 rounded-2xl bg-gradient-to-r from-red-950 via-slate-900 to-red-950 border border-red-500/50 shadow-xl space-y-3">
        <div className="flex items-center justify-between">
          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-red-500 text-white flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-white animate-ping" />
            CRITICAL EARLY WARNING
          </span>
          <span className="text-[10px] font-mono text-red-300">
            {criticalAlertCount} Active Alert(s)
          </span>
        </div>

        <div>
          <h2 className="text-lg font-black text-white">
            {selectedZone.name}
          </h2>
          <div className="text-xs text-slate-300">
            {selectedZone.district}, {selectedZone.state}
          </div>
        </div>

        {/* Big Emergency Gauge */}
        <div className="py-2 flex justify-center">
          <RiskGauge 
            score={selectedZone.riskScore}
            confidence={selectedZone.aiConfidence}
            size="md"
          />
        </div>

        <div className="p-3 rounded-xl bg-slate-950/80 border border-red-500/30 text-xs text-slate-200">
          <strong>Immediate Threat: </strong>
          {selectedZone.aiPrediction}
        </div>
      </div>

      {/* Emergency Telemetry Indicators */}
      <div className="grid grid-cols-2 gap-2 text-xs">
        <div className="p-3 rounded-xl bg-slate-900 border border-slate-800">
          <div className="text-[10px] text-slate-400 flex items-center gap-1">
            <Droplets className="w-3 h-3 text-cyan-400" />
            <span>24h Rainfall</span>
          </div>
          <div className="text-base font-bold font-mono text-white mt-0.5">
            {selectedZone.rainfall24h} mm
          </div>
        </div>

        <div className="p-3 rounded-xl bg-slate-900 border border-slate-800">
          <div className="text-[10px] text-slate-400 flex items-center gap-1">
            <Layers className="w-3 h-3 text-amber-400" />
            <span>Soil Saturation</span>
          </div>
          <div className="text-base font-bold font-mono text-amber-300 mt-0.5">
            {selectedZone.soilMoisture}%
          </div>
        </div>
      </div>

      {/* Nearby Vulnerable Arteries */}
      <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-2 text-xs">
        <div className="font-bold text-slate-300 uppercase tracking-wider text-[11px]">
          Exposed Lifelines & Evacuation Routes:
        </div>
        <div className="space-y-1">
          {selectedZone.infrastructureNearby.map((item, i) => (
            <div key={i} className="p-2 rounded-lg bg-slate-950 border border-slate-800/80 flex items-center justify-between">
              <span className="text-slate-200">{item}</span>
              <span className="text-[10px] font-mono text-amber-400 font-bold">HAZARD CONE</span>
            </div>
          ))}
        </div>
      </div>

      {/* Fast Action Buttons */}
      <div className="space-y-2 pt-2">
        <button
          onClick={onOpenMap}
          className="w-full py-3 px-4 rounded-xl bg-cyan-600 hover:bg-cyan-500 font-bold text-xs text-white shadow-lg flex items-center justify-center gap-2"
        >
          <MapPin className="w-4 h-4" />
          <span>VIEW FULL RISK MAP</span>
        </button>

        <button
          onClick={onOpenAlerts}
          className="w-full py-3 px-4 rounded-xl bg-red-600 hover:bg-red-500 font-bold text-xs text-white shadow-lg flex items-center justify-center gap-2"
        >
          <AlertTriangle className="w-4 h-4" />
          <span>VIEW ALERT DETAILS & DISSEMINATION</span>
        </button>

        <button
          onClick={onOpenReports}
          className="w-full py-3 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 font-bold text-xs text-slate-200 flex items-center justify-center gap-2"
        >
          <FileText className="w-4 h-4 text-cyan-400" />
          <span>GENERATE EMERGENCY SITUATION REPORT</span>
        </button>
      </div>
    </div>
  );
};
