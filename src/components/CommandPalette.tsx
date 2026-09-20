import React, { useState, useEffect, useRef } from 'react';
import { 
  Search, 
  Command, 
  MapPin, 
  Activity, 
  Siren, 
  AlertTriangle, 
  Bot, 
  SlidersHorizontal, 
  FileText, 
  Sun, 
  Moon, 
  Monitor, 
  Layers, 
  Mountain, 
  X, 
  ChevronRight,
  Database,
  ArrowRight
} from 'lucide-react';
import { NavigationTab, LocationZone } from '../types';
import { useTheme } from '../context/ThemeContext';

interface CommandPaletteProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigate: (tab: NavigationTab) => void;
  onOpenAI: () => void;
  onSelectZone?: (zone: LocationZone) => void;
  zones: LocationZone[];
}

export const CommandPalette: React.FC<CommandPaletteProps> = ({
  isOpen,
  onClose,
  onNavigate,
  onOpenAI,
  onSelectZone,
  zones
}) => {
  const { theme, setTheme, toggleTheme } = useTheme();
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      setQuery('');
      setSelectedIndex(0);
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [isOpen]);

  // Command items
  const baseCommands = [
    {
      id: 'cmd-dashboard',
      title: 'Go to Dashboard Overview',
      subtitle: 'Regional overview, environmental indicators & telemetry',
      icon: Activity,
      category: 'Navigation',
      action: () => onNavigate('dashboard')
    },
    {
      id: 'cmd-situation-room',
      title: 'Open Situation Room Command Center',
      subtitle: 'Operational priority command console with live map & KPIs',
      icon: Siren,
      category: 'Navigation',
      action: () => onNavigate('situation-room')
    },
    {
      id: 'cmd-map',
      title: 'Open Real-Time Geospatial Map',
      subtitle: 'Interactive NER hazards, live isohyets, DEM topography & alerts',
      icon: MapPin,
      category: 'Navigation',
      action: () => onNavigate('map')
    },
    {
      id: 'cmd-warnings',
      title: 'View Active Early Warnings',
      subtitle: 'Critical alerts, threshold breaches & CAP-India dissemination',
      icon: AlertTriangle,
      category: 'Navigation',
      action: () => onNavigate('warnings')
    },
    {
      id: 'cmd-ai',
      title: 'Open GiriRakshak AI Co-Pilot',
      subtitle: 'Geotechnical LLM reasoning, explainable hazard forecasting',
      icon: Bot,
      category: 'AI Intelligence',
      action: () => onOpenAI()
    },
    {
      id: 'cmd-data-intel',
      title: 'Data Intelligence & Source Traceability',
      subtitle: 'IMD AWS stations, GSI inventory (2019-2026), NASA DEM',
      icon: Database,
      category: 'Data Sources',
      action: () => onNavigate('data-intelligence')
    },
    {
      id: 'cmd-scenario',
      title: 'Run Scenario Simulator',
      subtitle: 'Simulate cloudbursts, shear stress, and cascading debris flows',
      icon: SlidersHorizontal,
      category: 'Simulation',
      action: () => onNavigate('scenario')
    },
    {
      id: 'cmd-infrastructure',
      title: 'Infrastructure Lifeline Monitoring',
      subtitle: 'NH-6, NH-10, NH-29, Lumding-Badarpur railway, bridges',
      icon: Layers,
      category: 'Infrastructure',
      action: () => onNavigate('infrastructure')
    },
    {
      id: 'cmd-reports',
      title: 'Generate Situation Report (SitRep)',
      subtitle: 'Official incident report export for SDMA / NDMA / District Admin',
      icon: FileText,
      category: 'Reporting',
      action: () => onNavigate('reports')
    },
    {
      id: 'cmd-theme-light',
      title: 'Switch to Light Mode',
      subtitle: 'Clean, high-contrast government & enterprise theme',
      icon: Sun,
      category: 'Theme & Display',
      action: () => setTheme('light')
    },
    {
      id: 'cmd-theme-dark',
      title: 'Switch to Dark Mode',
      subtitle: 'Deep disaster command center midnight theme',
      icon: Moon,
      category: 'Theme & Display',
      action: () => setTheme('dark')
    },
    {
      id: 'cmd-theme-system',
      title: 'Use System Theme Preference',
      subtitle: 'Automatically follow your operating system appearance',
      icon: Monitor,
      category: 'Theme & Display',
      action: () => setTheme('system')
    }
  ];

  // Also include matching zones
  const zoneCommands = zones.map(z => ({
    id: `zone-${z.id}`,
    title: `${z.name} (${z.district}, ${z.state})`,
    subtitle: `Risk: ${z.riskLevel} (${z.riskScore}/100) • Rainfall: ${z.rainfall24h}mm • Slope: ${z.slopeAngle}°`,
    icon: Mountain,
    category: 'Monitored Zones',
    action: () => {
      if (onSelectZone) onSelectZone(z);
      onNavigate('map');
    }
  }));

  const allItems = [...baseCommands, ...zoneCommands];

  const filteredItems = allItems.filter(item => {
    if (!query) return true;
    const q = query.toLowerCase();
    return item.title.toLowerCase().includes(q) || 
           item.subtitle.toLowerCase().includes(q) || 
           item.category.toLowerCase().includes(q);
  });

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex(prev => (prev < filteredItems.length - 1 ? prev + 1 : 0));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex(prev => (prev > 0 ? prev - 1 : filteredItems.length - 1));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (filteredItems[selectedIndex]) {
        filteredItems[selectedIndex].action();
        onClose();
      }
    } else if (e.key === 'Escape') {
      e.preventDefault();
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 px-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-150">
      <div 
        className="w-full max-w-2xl rounded-2xl bg-[#0a1428] dark:bg-[#0a1428] border border-slate-700/80 shadow-2xl overflow-hidden flex flex-col max-h-[75vh]"
        onClick={e => e.stopPropagation()}
        onKeyDown={handleKeyDown}
      >
        {/* Search Header */}
        <div className="flex items-center gap-3 px-4 py-3.5 border-b border-slate-700/80 bg-slate-900/90">
          <Command className="w-5 h-5 text-cyan-400" />
          <input
            ref={inputRef}
            type="text"
            placeholder="Type a command, district, zone, or theme action... (ESC to close)"
            value={query}
            onChange={e => {
              setQuery(e.target.value);
              setSelectedIndex(0);
            }}
            className="flex-1 bg-transparent border-none text-sm text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-0"
          />
          {query && (
            <button 
              onClick={() => setQuery('')}
              className="p-1 text-slate-400 hover:text-white"
            >
              <X className="w-4 h-4" />
            </button>
          )}
          <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-400 border border-slate-700">
            ESC
          </span>
        </div>

        {/* Results List */}
        <div className="overflow-y-auto flex-1 p-2 space-y-1">
          {filteredItems.length === 0 ? (
            <div className="py-12 text-center text-slate-400 text-xs">
              No matching commands or zones found for <span className="text-cyan-400 font-semibold">"{query}"</span>
            </div>
          ) : (
            filteredItems.map((item, idx) => {
              const Icon = item.icon;
              const isSelected = idx === selectedIndex;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    item.action();
                    onClose();
                  }}
                  onMouseEnter={() => setSelectedIndex(idx)}
                  className={`w-full text-left px-3 py-2.5 rounded-xl flex items-center gap-3 transition-colors ${
                    isSelected 
                      ? 'bg-cyan-500/20 text-cyan-200 border border-cyan-500/30' 
                      : 'text-slate-200 hover:bg-slate-800/60 border border-transparent'
                  }`}
                >
                  <div className={`p-2 rounded-lg ${isSelected ? 'bg-cyan-500/30 text-cyan-300' : 'bg-slate-800/80 text-slate-400'}`}>
                    <Icon className="w-4 h-4" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-xs font-semibold truncate text-white">
                        {item.title}
                      </span>
                      <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-slate-800/80 text-slate-400">
                        {item.category}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-400 truncate">
                      {item.subtitle}
                    </p>
                  </div>
                  <ChevronRight className={`w-4 h-4 text-slate-500 ${isSelected ? 'text-cyan-400 translate-x-0.5' : ''} transition-transform`} />
                </button>
              );
            })
          )}
        </div>

        {/* Footer shortcuts hint */}
        <div className="px-4 py-2 bg-slate-950 border-t border-slate-800 flex items-center justify-between text-[11px] text-slate-400 font-mono">
          <div className="flex items-center gap-3">
            <span><kbd className="px-1.5 py-0.5 bg-slate-800 rounded border border-slate-700 text-slate-300">↑↓</kbd> Navigate</span>
            <span><kbd className="px-1.5 py-0.5 bg-slate-800 rounded border border-slate-700 text-slate-300">↵</kbd> Select</span>
          </div>
          <div>
            <span>Quick: <kbd className="px-1 bg-slate-800 rounded border border-slate-700 text-slate-300">M</kbd> Map • <kbd className="px-1 bg-slate-800 rounded border border-slate-700 text-slate-300">S</kbd> Situation • <kbd className="px-1 bg-slate-800 rounded border border-slate-700 text-slate-300">A</kbd> Alerts</span>
          </div>
        </div>
      </div>
    </div>
  );
};
