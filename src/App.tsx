import React, { useState } from 'react';
import { Header } from './components/Header';
import { Sidebar } from './components/Sidebar';
import { LandingPage } from './components/LandingPage';
import { DashboardOverview } from './components/DashboardOverview';
import { RiskMap } from './components/RiskMap';
import { AIRiskAssessment } from './components/AIRiskAssessment';
import { EarlyWarningCenter } from './components/EarlyWarningCenter';
import { MonitoringCenter } from './components/MonitoringCenter';
import { InfrastructureMonitoring } from './components/InfrastructureMonitoring';
import { HistoricalAnalysis } from './components/HistoricalAnalysis';
import { ReportsCenter } from './components/ReportsCenter';
import { AIAssistant } from './components/AIAssistant';
import { NotificationSimulation } from './components/NotificationSimulation';
import { StakeholderViews } from './components/StakeholderViews';
import { SettingsModal } from './components/SettingsModal';
import { SituationRoom } from './components/SituationRoom';
import { ScenarioSimulator } from './components/ScenarioSimulator';
import { AIModelPerformance } from './components/AIModelPerformance';
import { GuidedDemoModal } from './components/GuidedDemoModal';
import { DemoModeModal } from './components/DemoModeModal';
import { DataIntelligenceView } from './components/DataIntelligenceView';
import { CommandPalette } from './components/CommandPalette';

import { ThemeProvider } from './context/ThemeContext';
import { DisasterProvider, useDisaster } from './context/DisasterContext';
import { 
  NavigationTab, 
  StakeholderRole, 
  LocationZone, 
  AlertStatus 
} from './types';
import { 
  Radio, 
  ShieldAlert, 
  Sparkles, 
  ChevronRight,
  MapPin,
  Building2,
  Layers,
  Activity,
  Sliders,
  BellRing,
  Play,
  Siren,
  SlidersHorizontal,
  Cpu,
  Bot,
  AlertTriangle,
  Database
} from 'lucide-react';

const InnerApp: React.FC = () => {
  const [currentTab, setCurrentTab] = useState<NavigationTab>('situation-room');
  const [assessmentInitialZone, setAssessmentInitialZone] = useState<LocationZone | null>(null);
  const [isSettingsOpen, setIsSettingsOpen] = useState<boolean>(false);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState<boolean>(false);
  const [isCommandPaletteOpen, setIsCommandPaletteOpen] = useState<boolean>(false);

  const {
    zones,
    alerts,
    infrastructure,
    selectedZone,
    setSelectedZoneId,
    currentRole,
    setCurrentRole,
    systemSettings,
    setSystemSettings,
    criticalAlertCount,
    updateAlertStatus,
    guidedDemo,
    demoMode,
    demoIntroVisible,
    setDemoIntroVisible,
    enterDemo
  } = useDisaster();

  // Global keyboard shortcut for Command Palette (Cmd/Ctrl + K)
  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setIsCommandPaletteOpen(prev => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleOpenAssessment = (zone?: LocationZone) => {
    if (zone) {
      setSelectedZoneId(zone.id);
      setAssessmentInitialZone(zone);
    }
    setCurrentTab('assessment');
  };

  const handleOpenAlerts = (zone?: LocationZone) => {
    if (zone) {
      setSelectedZoneId(zone.id);
    }
    setCurrentTab('warnings');
  };

  return (
    <div className="min-h-screen bg-[var(--bg-app)] text-[var(--text-primary)] flex flex-col font-sans selection:bg-cyan-500 selection:text-slate-950 transition-colors duration-200">
      {/* Top Emergency Flash Marquee (When Critical Alerts Exist) */}
      {criticalAlertCount > 0 && (
        <div className="bg-gradient-to-r from-red-600 via-rose-600 to-red-700 px-4 py-1.5 text-xs text-white font-bold flex items-center justify-between shadow-md select-none z-50">
          <div className="flex items-center gap-2 overflow-hidden whitespace-nowrap">
            <span className="w-2.5 h-2.5 rounded-full bg-white animate-ping flex-shrink-0" />
            <span className="uppercase tracking-widest text-[10px] bg-red-950/80 px-2 py-0.5 rounded font-black border border-white/20">
              URGENT GEOTECHNICAL ADVISORY
            </span>
            <span className="truncate">
              {criticalAlertCount} Critical Landslide Hazard Warning(s) Active in NER (Sohra Escarpment & NH-6 Lifeline). Convective precipitation exceeding threshold.
            </span>
          </div>

          <button
            onClick={() => setCurrentTab('warnings')}
            className="flex items-center gap-1 text-[11px] bg-white/20 hover:bg-white text-white hover:text-red-700 px-2.5 py-0.5 rounded font-black uppercase tracking-wider transition-colors flex-shrink-0 ml-4"
          >
            <span>Dispatch Desk</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* Main Navigation Header */}
      <Header
        activeTab={currentTab}
        setActiveTab={(tab: string) => setCurrentTab(tab as NavigationTab)}
        unreadCount={criticalAlertCount}
        onOpenNotifications={() => setCurrentTab('notifications')}
        onOpenSettings={() => setIsSettingsOpen(true)}
        onOpenAIAssistant={() => setCurrentTab('assistant')}
        selectedStakeholder={currentRole}
        onSelectStakeholder={setCurrentRole}
        criticalAlertCount={criticalAlertCount}
        onStartDemo={() => guidedDemo.start()}
        onToggleSidebar={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
        onOpenCommandPalette={() => setIsCommandPaletteOpen(true)}
      />

      {/* Sub-Navigation Secondary Strip (Quick Shortcut Bar when not on Landing) */}
      {currentTab !== 'landing' && (
        <div className="bg-[var(--bg-surface-secondary)] border-b border-[var(--border-app)] px-4 sm:px-8 py-2 flex flex-wrap items-center justify-between gap-3 text-xs transition-colors">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-[11px] text-[var(--text-muted)] font-medium">Quick Workspaces:</span>
            
            <button
              onClick={() => setCurrentTab('situation-room')}
              className={`px-2.5 py-1 rounded-lg text-xs font-semibold flex items-center gap-1 transition-colors ${
                currentTab === 'situation-room' ? 'bg-red-500/20 text-red-600 dark:text-red-300 border border-red-500/40 font-bold' : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--border-subtle)]'
              }`}
            >
              <Siren className="w-3.5 h-3.5 text-red-500" />
              <span>Situation Room</span>
            </button>

            <button
              onClick={() => setCurrentTab('dashboard')}
              className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-colors ${
                currentTab === 'dashboard' ? 'bg-cyan-500/20 text-cyan-700 dark:text-cyan-300 border border-cyan-500/40 font-bold' : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--border-subtle)]'
              }`}
            >
              Overview Dashboard
            </button>

            <button
              onClick={() => setCurrentTab('map')}
              className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-colors ${
                currentTab === 'map' ? 'bg-cyan-500/20 text-cyan-700 dark:text-cyan-300 border border-cyan-500/40 font-bold' : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--border-subtle)]'
              }`}
            >
              Interactive GIS Map
            </button>

            <button
              onClick={() => setCurrentTab('data-intelligence')}
              className={`px-2.5 py-1 rounded-lg text-xs font-semibold flex items-center gap-1 transition-colors ${
                currentTab === 'data-intelligence' ? 'bg-cyan-500/20 text-cyan-700 dark:text-cyan-300 border border-cyan-500/40 font-bold' : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--border-subtle)]'
              }`}
            >
              <Database className="w-3.5 h-3.5 text-cyan-500" />
              <span>Data Intelligence</span>
            </button>

            <button
              onClick={() => setCurrentTab('scenario')}
              className={`px-2.5 py-1 rounded-lg text-xs font-semibold flex items-center gap-1 transition-colors ${
                currentTab === 'scenario' ? 'bg-amber-500/20 text-amber-700 dark:text-amber-300 border border-amber-500/40 font-bold' : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--border-subtle)]'
              }`}
            >
              <SlidersHorizontal className="w-3.5 h-3.5 text-amber-500" />
              <span>Scenario Simulator</span>
            </button>

            <button
              onClick={() => setCurrentTab('assessment')}
              className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-colors ${
                currentTab === 'assessment' ? 'bg-cyan-500/20 text-cyan-700 dark:text-cyan-300 border border-cyan-500/40 font-bold' : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--border-subtle)]'
              }`}
            >
              AI Risk Engine (XAI)
            </button>

            <button
              onClick={() => setCurrentTab('warnings')}
              className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-colors ${
                currentTab === 'warnings' ? 'bg-red-500/20 text-red-600 dark:text-red-300 border border-red-500/40 font-bold' : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--border-subtle)]'
              }`}
            >
              Early Warnings ({criticalAlertCount})
            </button>

            <button
              onClick={() => setCurrentTab('infrastructure')}
              className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-colors ${
                currentTab === 'infrastructure' ? 'bg-amber-500/20 text-amber-700 dark:text-amber-300 border border-amber-500/40 font-bold' : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--border-subtle)]'
              }`}
            >
              NH-6 / Rail Lifelines
            </button>

            <button
              onClick={() => setCurrentTab('model-performance')}
              className={`px-2.5 py-1 rounded-lg text-xs font-semibold flex items-center gap-1 transition-colors ${
                currentTab === 'model-performance' ? 'bg-purple-500/20 text-purple-700 dark:text-purple-300 border border-purple-500/40 font-bold' : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--border-subtle)]'
              }`}
            >
              <Cpu className="w-3.5 h-3.5 text-purple-500" />
              <span>AI Evaluation & Trust</span>
            </button>
          </div>

          <div className="flex items-center gap-3 text-[11px] text-[var(--text-muted)] font-mono">
            <button
              onClick={() => guidedDemo.start()}
              className="flex items-center gap-1 text-amber-600 dark:text-amber-400 hover:underline font-bold"
            >
              <Play className="w-3 h-3 fill-current" />
              <span>Walkthrough Demo</span>
            </button>
            <span className="hidden md:inline text-[var(--border-app)]">|</span>
            <span className="hidden md:inline text-[var(--text-secondary)]">
              Role: <strong className="text-cyan-600 dark:text-cyan-400">{currentRole}</strong>
            </span>
          </div>
        </div>
      )}

      {/* Primary Workspace Layout with Collapsible Command Sidebar */}
      <div className="flex-1 flex w-full overflow-hidden">
        {currentTab !== 'landing' && (
          <Sidebar
            currentTab={currentTab}
            onSelectTab={(tab) => setCurrentTab(tab)}
            isCollapsed={isSidebarCollapsed}
            onToggleCollapse={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
            criticalAlertCount={criticalAlertCount}
          />
        )}

        {/* Primary Application View Routing */}
        <main className="flex-1 overflow-y-auto overflow-x-hidden min-h-[calc(100vh-140px)] pb-16 md:pb-6">
          {currentTab === 'situation-room' && (
            <SituationRoom
              onOpenMap={() => setCurrentTab('map')}
              onOpenWarnings={() => setCurrentTab('warnings')}
              onOpenAssessment={handleOpenAssessment}
              onOpenInfrastructure={() => setCurrentTab('infrastructure')}
              onOpenReports={() => setCurrentTab('reports')}
            />
          )}

          {currentTab === 'landing' && (
            <LandingPage
              onOpenDashboard={() => setCurrentTab('dashboard')}
              onOpenMap={() => setCurrentTab('map')}
              onOpenWarnings={() => setCurrentTab('warnings')}
              onOpenAssessment={() => setCurrentTab('assessment')}
            />
          )}

          {currentTab === 'dashboard' && (
            <DashboardOverview
              zones={zones}
              alerts={alerts}
              onSelectZone={(zone) => {
                setSelectedZoneId(zone.id);
                setCurrentTab('map');
              }}
              onOpenMap={() => setCurrentTab('map')}
              onOpenWarnings={() => setCurrentTab('warnings')}
              onOpenAssessment={handleOpenAssessment}
              onOpenInfrastructure={() => setCurrentTab('infrastructure')}
              onOpenReports={() => setCurrentTab('reports')}
            />
          )}

          {currentTab === 'map' && (
            <RiskMap
              zones={zones}
              selectedZone={selectedZone}
              onSelectZone={(z) => setSelectedZoneId(z ? z.id : null)}
              onOpenAssessment={handleOpenAssessment}
              onOpenAlerts={handleOpenAlerts}
              onOpenAIAssistantWithPrompt={(prompt, zone) => {
                if (zone) setSelectedZoneId(zone.id);
                setCurrentTab('assistant');
              }}
            />
          )}

          {currentTab === 'data-intelligence' && (
            <DataIntelligenceView
              zones={zones}
              selectedZone={selectedZone}
              onSelectZone={(zoneId) => setSelectedZoneId(zoneId)}
              onNavigateToMap={() => setCurrentTab('map')}
            />
          )}

          {currentTab === 'scenario' && (
            <ScenarioSimulator 
              onNavigateToMap={() => setCurrentTab('map')}
            />
          )}

          {currentTab === 'assessment' && (
            <AIRiskAssessment
              zones={zones}
              initialZone={assessmentInitialZone || selectedZone}
              onOpenAlerts={handleOpenAlerts}
            />
          )}

          {currentTab === 'warnings' && (
            <EarlyWarningCenter
              alerts={alerts}
              onUpdateAlertStatus={updateAlertStatus}
              onSelectZoneId={(zoneId) => {
                setSelectedZoneId(zoneId);
                setCurrentTab('map');
              }}
            />
          )}

          {currentTab === 'monitoring' && (
            <MonitoringCenter />
          )}

          {currentTab === 'infrastructure' && (
            <InfrastructureMonitoring
              infrastructure={infrastructure}
              onSelectZoneId={(zoneId) => {
                setSelectedZoneId(zoneId);
                setCurrentTab('map');
              }}
            />
          )}

          {currentTab === 'model-performance' && (
            <AIModelPerformance />
          )}

          {(currentTab === 'historical' || currentTab === 'analytics') && (
            <HistoricalAnalysis />
          )}

          {currentTab === 'reports' && (
            <ReportsCenter
              zones={zones}
              alerts={alerts}
            />
          )}

          {currentTab === 'assistant' && (
            <AIAssistant
              zones={zones}
              alerts={alerts}
              infrastructure={infrastructure}
              onNavigateToView={(tab: string) => setCurrentTab(tab as NavigationTab)}
            />
          )}

          {currentTab === 'notifications' && (
            <NotificationSimulation />
          )}

          {(currentTab === 'stakeholder' || currentTab === 'district') && (
            <StakeholderViews
              currentRole={currentRole}
              onSelectRole={setCurrentRole}
              zones={zones}
              alerts={alerts}
              infrastructure={infrastructure}
            />
          )}
        </main>
      </div>

      {/* Mobile Bottom Quick Navigation Bar */}
      {currentTab !== 'landing' && (
        <div className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-[var(--bg-surface)]/95 border-t border-[var(--border-app)] backdrop-blur-md px-2 py-1.5 flex items-center justify-around text-[10px] transition-colors">
          <button
            onClick={() => setCurrentTab('situation-room')}
            className={`flex flex-col items-center gap-0.5 p-1 rounded-lg transition-colors ${
              currentTab === 'situation-room' ? 'text-red-500 font-bold' : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
            }`}
          >
            <Siren className="w-4 h-4" />
            <span>Situation</span>
          </button>
          <button
            onClick={() => setCurrentTab('dashboard')}
            className={`flex flex-col items-center gap-0.5 p-1 rounded-lg transition-colors ${
              currentTab === 'dashboard' ? 'text-cyan-600 dark:text-cyan-400 font-bold' : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
            }`}
          >
            <Activity className="w-4 h-4" />
            <span>Dashboard</span>
          </button>
          <button
            onClick={() => setCurrentTab('map')}
            className={`flex flex-col items-center gap-0.5 p-1 rounded-lg transition-colors ${
              currentTab === 'map' ? 'text-cyan-600 dark:text-cyan-400 font-bold' : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
            }`}
          >
            <MapPin className="w-4 h-4" />
            <span>GIS Map</span>
          </button>
          <button
            onClick={() => setCurrentTab('warnings')}
            className={`flex flex-col items-center gap-0.5 p-1 rounded-lg transition-colors relative ${
              currentTab === 'warnings' ? 'text-red-500 font-bold' : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
            }`}
          >
            <AlertTriangle className="w-4 h-4" />
            {criticalAlertCount > 0 && (
              <span className="absolute top-0 right-1 w-2 h-2 rounded-full bg-red-500 animate-ping" />
            )}
            <span>Alerts</span>
          </button>
          <button
            onClick={() => setCurrentTab('assistant')}
            className={`flex flex-col items-center gap-0.5 p-1 rounded-lg transition-colors ${
              currentTab === 'assistant' ? 'text-purple-600 dark:text-purple-400 font-bold' : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
            }`}
          >
            <Bot className="w-4 h-4" />
            <span>Co-Pilot</span>
          </button>
        </div>
      )}

      {/* Global Command Palette (Ctrl/Cmd + K) */}
      <CommandPalette
        isOpen={isCommandPaletteOpen}
        onClose={() => setIsCommandPaletteOpen(false)}
        onNavigate={(tab) => {
          setCurrentTab(tab);
          setIsCommandPaletteOpen(false);
        }}
        onOpenAI={() => {
          setCurrentTab('assistant');
          setIsCommandPaletteOpen(false);
        }}
        onSelectZone={(zone) => {
          setSelectedZoneId(zone.id);
          setCurrentTab('map');
          setIsCommandPaletteOpen(false);
        }}
        zones={zones}
      />

      {/* Guided Demonstration Modal */}
      <GuidedDemoModal
        onNavigateTab={(tab) => setCurrentTab(tab)}
      />

      {/* Operational Demo Mode Modal Over Viewport */}
      <DemoModeModal
        isOpen={demoIntroVisible}
        onEnterDemo={enterDemo}
        onClose={() => setDemoIntroVisible(false)}
      />

      {/* System Settings & Algorithm Configuration Modal */}
      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        settings={systemSettings}
        onSaveSettings={setSystemSettings}
      />

      {/* Professional Footer */}
      <footer className="bg-[var(--bg-surface-secondary)] border-t border-[var(--border-app)] py-8 px-4 sm:px-8 text-xs text-[var(--text-secondary)] transition-colors">
        <div className="max-w-7xl mx-auto space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 pb-6 border-b border-[var(--border-subtle)]">
            {/* Project identity */}
            <div className="space-y-2 md:col-span-2">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-cyan-500" />
                <span className="text-sm font-extrabold text-[var(--text-primary)] tracking-wide">
                  GiriRakshak AI (गिरिरक्षक)
                </span>
                <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-cyan-500/10 text-cyan-700 dark:text-cyan-300 border border-cyan-500/30 font-bold">
                  NER Multi-Hazard Engine
                </span>
              </div>
              <p className="text-[var(--text-secondary)] text-xs leading-relaxed max-w-md">
                AI-Powered Landslide Risk Monitoring & Early Warning Platform for the North Eastern Region (NER) of India. Built for proactive disaster mitigation, critical infrastructure safeguarding, and multi-channel early warning.
              </p>
            </div>

            {/* Operational Framework */}
            <div className="space-y-1.5">
              <div className="text-[11px] font-bold uppercase tracking-wider text-[var(--text-primary)]">
                Operational Framework
              </div>
              <div className="text-[var(--text-secondary)] text-xs space-y-1">
                <div><strong>System:</strong> Decision Support System (DSS)</div>
                <div><strong>Scope:</strong> 8 North Eastern States (NER)</div>
                <div><strong>Workflow:</strong> MONITOR → DETECT → ANALYZE → PREDICT → EXPLAIN → WARN</div>
                <div><strong>Standard:</strong> NDMA / CAP-India Interoperable</div>
              </div>
            </div>

            {/* Regulatory Note */}
            <div className="space-y-1.5">
              <div className="text-[11px] font-bold uppercase tracking-wider text-[var(--text-primary)]">
                Decision Support Protocol
              </div>
              <p className="text-[var(--text-muted)] text-[11px] leading-relaxed">
                All early-warning predictions, risk explanations, and hazard score weightings provided by GiriRakshak AI are advisory decision-support computations for authorized SDMA, DEOC, and NDRF authorities. Human review is required before issuing official public directives.
              </p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 text-[11px] text-[var(--text-muted)]">
            <div>
              © 2026 GiriRakshak AI • AI-Powered Landslide Risk Monitoring & Early Warning Platform
            </div>
            <div className="flex items-center gap-4">
              <span className="flex items-center gap-1 text-[var(--text-secondary)]">
                <ShieldAlert className="w-3.5 h-3.5 text-cyan-600 dark:text-cyan-400" />
                <span>NER GIS Grid v2.4 (Simulated Demo Mode)</span>
              </span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export const App: React.FC = () => {
  return (
    <ThemeProvider>
      <DisasterProvider>
        <InnerApp />
      </DisasterProvider>
    </ThemeProvider>
  );
};

export default App;
