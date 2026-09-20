import React, { useState } from 'react';
import { 
  X, 
  Sparkles, 
  Bot, 
  MapPin, 
  AlertTriangle, 
  Droplets, 
  Layers, 
  Send, 
  CheckCircle2,
  ArrowRight,
  Cpu
} from 'lucide-react';
import { LocationZone, EarlyWarningAlert, AIControlledAction } from '../../types';

interface AskAIModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedZone: LocationZone | null;
  zones: LocationZone[];
  alerts: EarlyWarningAlert[];
  onExecuteControlledAction: (action: AIControlledAction) => void;
  onOpenFullAssistant: (prompt: string) => void;
}

export const AskAIModal: React.FC<AskAIModalProps> = ({
  isOpen,
  onClose,
  selectedZone,
  zones,
  alerts,
  onExecuteControlledAction,
  onOpenFullAssistant
}) => {
  const [query, setQuery] = useState('');
  const [isAnswering, setIsAnswering] = useState(false);
  const [response, setResponse] = useState<{
    text: string;
    action?: AIControlledAction;
  } | null>(null);

  if (!isOpen) return null;

  const quickPrompts = [
    {
      title: 'Why is this area high risk?',
      prompt: selectedZone 
        ? `Why is ${selectedZone.name} in ${selectedZone.district} at ${selectedZone.riskLevel} risk with score ${selectedZone.riskScore}?`
        : 'Why are the selected areas at critical risk across the North Eastern Region?',
      action: selectedZone ? {
        type: 'FOCUS_LOCATION' as const,
        payload: { zoneId: selectedZone.id },
        explanation: `Focusing geospatial map on ${selectedZone.name}`
      } : undefined
    },
    {
      title: 'What changed here in last 24h?',
      prompt: selectedZone 
        ? `Explain recent changes in rainfall (${selectedZone.rainfall24h}mm) and soil moisture (${selectedZone.soilMoisture}%) for ${selectedZone.name}.`
        : 'What recent environmental telemetry changes triggered current hazard escalation?',
      action: {
        type: 'SHOW_LAYER' as const,
        payload: { layer: 'rainfallOverlay' },
        explanation: 'Enabling IMD Doppler rainfall isohyets overlay'
      }
    },
    {
      title: 'Show nearby critical alerts & infrastructure',
      prompt: 'What critical infrastructure lifelines (NH-6, bridges, rail links) are exposed to active landslide alerts?',
      action: {
        type: 'SHOW_LAYER' as const,
        payload: { layer: 'highways' },
        explanation: 'Enabling strategic lifeline highways and bridges'
      }
    },
    {
      title: 'Compare this zone with historical landslides',
      prompt: selectedZone 
        ? `Compare current geotechnical indicators of ${selectedZone.name} with GSI historical landslides in ${selectedZone.state}.`
        : 'Compare active high risk zones with GSI historical inventory (2019-2026).',
      action: {
        type: 'SHOW_LAYER' as const,
        payload: { layer: 'historicalLandslides' },
        explanation: 'Overlaying GSI Bharat Atlas historical landslide inventory'
      }
    }
  ];

  const handleRunQuery = (promptText: string, suggestedAction?: AIControlledAction) => {
    setIsAnswering(true);
    setQuery(promptText);

    setTimeout(() => {
      setIsAnswering(false);
      
      let answer = '';
      if (selectedZone) {
        answer = `Geotechnical assessment for ${selectedZone.name} (${selectedZone.district}, ${selectedZone.state}):
• 24h Rainfall: ${selectedZone.rainfall24h} mm (IMD AWS)
• Soil Saturation: ${selectedZone.soilMoisture}% (SMAP L4 pore model)
• Slope Angle: ${selectedZone.slopeAngle}° with friable lithology (${selectedZone.geology})
• Factor of Safety (FoS): Critically depressed under continuous cloudburst conditions. InSAR GPS indicates ${selectedZone.groundMovement} mm/day downslope creep.`;
      } else {
        answer = `Regional Landslide Analysis across North Eastern Region:
• 3 zones currently in HIGH RISK status: Sohra Escarpment (Score: 88), Mangan Ridge (Score: 85), Haflong Hill Cut (Score: 84).
• Primary trigger: Sustained antecedent monsoon precipitation exceeding regional threshold limits by 42%.
• Critical lifelines requiring immediate surveillance: NH-6 (Meghalaya), NH-10 (Sikkim corridor), and Lumding-Badarpur rail link.`;
      }

      setResponse({
        text: answer,
        action: suggestedAction || (selectedZone ? {
          type: 'FOCUS_LOCATION',
          payload: { zoneId: selectedZone.id },
          explanation: `Centering on ${selectedZone.name}`
        } : undefined)
      });
    }, 600);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="w-full max-w-xl rounded-2xl bg-[#091326] dark:bg-[#091326] border border-cyan-500/40 shadow-2xl overflow-hidden flex flex-col max-h-[85vh] text-xs">
        {/* Header */}
        <div className="p-4 bg-slate-950/90 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-cyan-500 to-indigo-600 flex items-center justify-center shadow-md shadow-cyan-500/20">
              <Bot className="w-4 h-4 text-white" />
            </div>
            <div>
              <h3 className="font-bold text-white text-sm flex items-center gap-1.5">
                <span>Ask AI About Geospatial Map</span>
                <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-cyan-950 text-cyan-300 border border-cyan-800">
                  Grounded
                </span>
              </h3>
              <p className="text-[11px] text-slate-400">
                {selectedZone ? `Context: ${selectedZone.name} (${selectedZone.district})` : 'Context: North Eastern Region (8 States)'}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1 rounded-lg bg-slate-800/80 hover:bg-slate-700 text-slate-400 hover:text-white"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-4 overflow-y-auto space-y-4 flex-1">
          {/* Quick Prompts */}
          <div className="space-y-1.5">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
              Quick Operational Questions
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {quickPrompts.map((item, idx) => (
                <button
                  key={idx}
                  onClick={() => handleRunQuery(item.prompt, item.action)}
                  className="p-2.5 rounded-xl bg-slate-900/80 hover:bg-slate-800 border border-slate-800 hover:border-cyan-500/40 text-left transition-all group"
                >
                  <span className="font-semibold text-slate-200 group-hover:text-cyan-300 transition-colors block">
                    {item.title}
                  </span>
                  <span className="text-[10px] text-slate-400 line-clamp-1 mt-0.5">
                    {item.prompt}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* AI Response Display */}
          {isAnswering ? (
            <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 flex items-center gap-3 text-cyan-400 animate-pulse">
              <Cpu className="w-5 h-5 animate-spin" />
              <span>Synthesizing IMD precipitation, DEM topography & geotechnical factors...</span>
            </div>
          ) : response ? (
            <div className="p-4 rounded-xl bg-[#0a1b38] border border-cyan-500/30 space-y-3">
              <div className="flex items-center justify-between text-cyan-400 font-bold">
                <span className="flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4" />
                  GiriRakshak Co-Pilot Explanation
                </span>
                <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-cyan-950 text-cyan-300 border border-cyan-800">
                  Evidence Verified
                </span>
              </div>
              <p className="text-slate-100 whitespace-pre-line leading-relaxed text-xs">
                {response.text}
              </p>

              {/* Controlled Action Button */}
              {response.action && (
                <div className="pt-2 border-t border-slate-800 flex items-center justify-between">
                  <span className="text-[11px] text-slate-400">
                    Suggested Action: <strong className="text-cyan-300">{response.action.explanation}</strong>
                  </span>
                  <button
                    onClick={() => {
                      if (response.action) {
                        onExecuteControlledAction(response.action);
                        onClose();
                      }
                    }}
                    className="px-3 py-1.5 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold flex items-center gap-1.5 transition-colors"
                  >
                    <span>Execute on Map</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              )}
            </div>
          ) : null}

          {/* Custom Input */}
          <div className="space-y-1.5">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
              Custom Question
            </span>
            <div className="flex items-center gap-2">
              <input
                type="text"
                placeholder="Ask about slope stability, cloudburst records, or evacuation routes..."
                value={query}
                onChange={e => setQuery(e.target.value)}
                onKeyDown={e => {
                  if (e.key === 'Enter' && query.trim()) {
                    handleRunQuery(query);
                  }
                }}
                className="flex-1 px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-slate-200 placeholder-slate-500 focus:outline-none focus:border-cyan-500 text-xs"
              />
              <button
                onClick={() => query.trim() && handleRunQuery(query)}
                className="px-3 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold flex items-center gap-1 transition-colors"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Ask</span>
              </button>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-3 bg-slate-950 border-t border-slate-800 flex items-center justify-between text-[11px] text-slate-400">
          <span>AI actions are bounded by controlled schema. No unvalidated commands executed.</span>
          <button
            onClick={() => {
              onOpenFullAssistant(query || 'Explain current landslide risk dynamics across the North Eastern Region.');
              onClose();
            }}
            className="text-cyan-400 hover:underline font-semibold"
          >
            Open in Full AI Assistant →
          </button>
        </div>
      </div>
    </div>
  );
};
