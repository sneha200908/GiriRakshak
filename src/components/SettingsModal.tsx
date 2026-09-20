import React, { useState } from 'react';
import { 
  Settings, 
  X, 
  Sliders, 
  BellRing, 
  Cpu, 
  Radio, 
  Database, 
  CheckCircle2, 
  RotateCcw,
  Sparkles
} from 'lucide-react';
import { SystemSettings } from '../types';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  settings: SystemSettings;
  onSaveSettings: (newSettings: SystemSettings) => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  isOpen,
  onClose,
  settings,
  onSaveSettings
}) => {
  const [localSettings, setLocalSettings] = useState<SystemSettings>(settings);
  const [saveSuccess, setSaveSuccess] = useState<boolean>(false);

  if (!isOpen) return null;

  const handleSave = () => {
    onSaveSettings(localSettings);
    setSaveSuccess(true);
    setTimeout(() => {
      setSaveSuccess(false);
      onClose();
    }, 1200);
  };

  const handleResetDefaults = () => {
    setLocalSettings({
      thresholds: {
        lowMax: 30,
        mediumMax: 60,
        highMin: 61,
      },
      alertSensitivity: 'Balanced',
      notifications: {
        smsEnabled: true,
        ivrEnabled: true,
        pushEnabled: true,
        sirenEnabled: true,
      },
      dataSources: {
        imdRainfall: true,
        satelliteMoisture: true,
        groundSensors: true,
        seismicData: true,
      },
    });
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
      <div className="relative w-full max-w-2xl rounded-2xl bg-slate-900 border border-slate-700 shadow-2xl overflow-hidden my-8 animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="p-5 bg-slate-950 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Settings className="w-5 h-5 text-cyan-400" />
            <h2 className="text-lg font-bold text-white">System Settings & Algorithm Configuration</h2>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6 max-h-[75vh] overflow-y-auto text-xs">
          {saveSuccess && (
            <div className="p-3 rounded-xl bg-emerald-950 border border-emerald-500/50 text-emerald-300 font-semibold flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>Settings successfully updated across GiriRakshak AI algorithms.</span>
            </div>
          )}

          {/* Section 1: Risk Threshold Cutoffs */}
          <div className="space-y-3">
            <div className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-1.5">
              <Sliders className="w-4 h-4 text-cyan-400" />
              <span>Configurable Hazard Thresholds (0 - 100 Index)</span>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
                <label className="text-slate-400 font-medium">Low → Medium Cutoff</label>
                <div className="flex items-center gap-2 mt-1">
                  <input
                    type="number"
                    min="15"
                    max="45"
                    value={localSettings.thresholds.lowMax}
                    onChange={(e) => setLocalSettings({
                      ...localSettings,
                      thresholds: {
                        ...localSettings.thresholds,
                        lowMax: Number(e.target.value),
                        mediumMax: Math.max(Number(e.target.value) + 10, localSettings.thresholds.mediumMax)
                      }
                    })}
                    className="w-20 px-2 py-1 bg-slate-900 border border-slate-700 rounded text-center text-sm font-mono text-cyan-300"
                  />
                  <span className="text-slate-500 font-mono text-[11px]">Points</span>
                </div>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
                <label className="text-slate-400 font-medium">Medium → High Cutoff</label>
                <div className="flex items-center gap-2 mt-1">
                  <input
                    type="number"
                    min="50"
                    max="85"
                    value={localSettings.thresholds.mediumMax}
                    onChange={(e) => setLocalSettings({
                      ...localSettings,
                      thresholds: {
                        ...localSettings.thresholds,
                        mediumMax: Number(e.target.value),
                        highMin: Number(e.target.value) + 1
                      }
                    })}
                    className="w-20 px-2 py-1 bg-slate-900 border border-slate-700 rounded text-center text-sm font-mono text-red-400"
                  />
                  <span className="text-slate-500 font-mono text-[11px]">Points</span>
                </div>
              </div>
            </div>
          </div>

          {/* Section 2: Alert Sensitivity */}
          <div className="space-y-3">
            <div className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-1.5">
              <Cpu className="w-4 h-4 text-purple-400" />
              <span>Algorithmic Alert Sensitivity Policy</span>
            </div>
            <div className="grid grid-cols-3 gap-3">
              {(['Conservative', 'Balanced', 'Aggressive'] as const).map(mode => (
                <button
                  key={mode}
                  onClick={() => setLocalSettings({ ...localSettings, alertSensitivity: mode })}
                  className={`p-3 rounded-xl border text-left transition-all ${
                    localSettings.alertSensitivity === mode
                      ? 'bg-purple-950/60 border-purple-500 text-white font-bold'
                      : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <div className="text-xs">{mode}</div>
                  <div className="text-[10px] text-slate-500 font-normal mt-0.5">
                    {mode === 'Conservative' ? 'Minimizes false alarms' : mode === 'Balanced' ? 'Recommended standard' : 'Maximum early detection'}
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Section 3: Data Source Feeds */}
          <div className="space-y-3">
            <div className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-1.5">
              <Database className="w-4 h-4 text-emerald-400" />
              <span>Multi-Sensor Data Source Feeds</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {[
                { key: 'imdRainfall', label: 'IMD Gridded Rainfall Radar', desc: 'Precipitation intensity & cloudburst alerts' },
                { key: 'satelliteMoisture', label: 'Sentinel-1 & SMAP Soil Moisture', desc: 'Remote-sensed pore pressure estimates' },
                { key: 'groundSensors', label: 'IoT Slope Inclinometers & Extensometers', desc: 'Direct in-situ subsurface slip detection' },
                { key: 'seismicData', label: 'NCS Micro-Seismic Shaking Feed', desc: 'Tectonic tremor & fault triggering' },
              ].map(source => {
                const isEnabled = localSettings.dataSources[source.key as keyof typeof localSettings.dataSources];
                return (
                  <div
                    key={source.key}
                    onClick={() => setLocalSettings({
                      ...localSettings,
                      dataSources: {
                        ...localSettings.dataSources,
                        [source.key]: !isEnabled
                      }
                    })}
                    className="p-3 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between cursor-pointer hover:border-slate-700 transition-colors"
                  >
                    <div>
                      <div className="font-semibold text-white">{source.label}</div>
                      <div className="text-[10px] text-slate-400">{source.desc}</div>
                    </div>
                    <div className={`w-8 h-4 rounded-full p-0.5 transition-colors ${isEnabled ? 'bg-cyan-500' : 'bg-slate-800'}`}>
                      <div className={`w-3 h-3 rounded-full bg-white transition-transform ${isEnabled ? 'translate-x-4' : 'translate-x-0'}`} />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Section 4: Notification Channels */}
          <div className="space-y-3">
            <div className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-1.5">
              <BellRing className="w-4 h-4 text-amber-400" />
              <span>Active Dissemination Channels</span>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {[
                { key: 'smsEnabled', label: 'SMS Gateway' },
                { key: 'ivrEnabled', label: 'IVR Voice Calls' },
                { key: 'pushEnabled', label: 'Push Notifications' },
                { key: 'sirenEnabled', label: 'Highway Sirens' },
              ].map(item => {
                const isEnabled = localSettings.notifications[item.key as keyof typeof localSettings.notifications];
                return (
                  <button
                    key={item.key}
                    onClick={() => setLocalSettings({
                      ...localSettings,
                      notifications: {
                        ...localSettings.notifications,
                        [item.key]: !isEnabled
                      }
                    })}
                    className={`p-2.5 rounded-xl border text-center font-bold text-xs transition-colors ${
                      isEnabled
                        ? 'bg-amber-500/20 border-amber-500/50 text-amber-300'
                        : 'bg-slate-950 border-slate-800 text-slate-500'
                    }`}
                  >
                    {item.label}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-950 border-t border-slate-800 flex items-center justify-between">
          <button
            onClick={handleResetDefaults}
            className="flex items-center gap-1.5 text-xs text-slate-400 hover:text-white"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset to Factory Defaults</span>
          </button>

          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              className="px-5 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 text-xs font-bold shadow-md shadow-cyan-950/50"
            >
              Save Changes
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
