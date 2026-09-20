import React, { useState, useEffect } from 'react';
import { 
  Mountain, 
  AlertTriangle, 
  Bell, 
  Settings, 
  Bot, 
  Radio, 
  Menu, 
  X, 
  ChevronDown,
  ShieldAlert,
  Info,
  Layers,
  MapPin,
  Activity,
  BarChart3,
  FileText,
  Clock,
  Users,
  Play,
  Siren,
  Sliders,
  CheckCircle2,
  RefreshCw,
  Sparkles,
  Sun,
  Moon,
  Command
} from 'lucide-react';
import { StakeholderRole } from '../types';
import { useTheme } from '../context/ThemeContext';
import { useDisaster } from '../context/DisasterContext';

interface HeaderProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  unreadCount: number;
  onOpenNotifications: () => void;
  onOpenSettings: () => void;
  onOpenAIAssistant: () => void;
  selectedStakeholder: StakeholderRole;
  onSelectStakeholder: (role: StakeholderRole) => void;
  criticalAlertCount: number;
  onStartDemo?: () => void;
  onToggleSidebar?: () => void;
  onOpenCommandPalette?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  setActiveTab,
  unreadCount,
  onOpenNotifications,
  onOpenSettings,
  onOpenAIAssistant,
  selectedStakeholder,
  onSelectStakeholder,
  criticalAlertCount,
  onStartDemo,
  onToggleSidebar,
  onOpenCommandPalette
}) => {
  const { resolvedTheme, toggleTheme } = useTheme();
  const { setDemoIntroVisible } = useDisaster();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [stakeholderDropdownOpen, setStakeholderDropdownOpen] = useState(false);
  const [currentTime, setCurrentTime] = useState('');
  const [isRefreshingSync, setIsRefreshingSync] = useState(false);
  const [syncSecondsAgo, setSyncSecondsAgo] = useState(48);

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setCurrentTime(
        now.toLocaleTimeString('en-IN', {
          timeZone: 'Asia/Kolkata',
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
          hour12: false
        }) + ' IST'
      );
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const syncInterval = setInterval(() => {
      setSyncSecondsAgo(prev => (prev >= 180 ? 10 : prev + 10));
    }, 10000);
    return () => clearInterval(syncInterval);
  }, []);

  const handleManualSync = () => {
    setIsRefreshingSync(true);
    setTimeout(() => {
      setIsRefreshingSync(false);
      setSyncSecondsAgo(0);
    }, 800);
  };

  const navItems = [
    { id: 'situation-room', label: 'Situation Room', icon: Siren, badge: criticalAlertCount, highlight: true },
    { id: 'dashboard', label: 'Dashboard', icon: Activity },
    { id: 'map', label: 'Risk Map', icon: MapPin },
    { id: 'warnings', label: 'Early Warnings', icon: AlertTriangle, badge: unreadCount },
    { id: 'scenario', label: 'Simulator', icon: Sliders },
    { id: 'assessment', label: 'Risk Analysis', icon: Mountain },
    { id: 'infrastructure', label: 'Infrastructure', icon: Layers },
    { id: 'monitoring', label: 'Telemetry & IoT', icon: Radio },
    { id: 'reports', label: 'Risk Reports', icon: FileText },
  ];

  const stakeholders: StakeholderRole[] = [
    'District Administration',
    'SDMA / NDMA',
    'PWD / Infrastructure',
    'Emergency Responders',
    'Policy Makers',
    'Citizen & Community'
  ];

  return (
    <header className="sticky top-0 z-40 w-full border-b border-[var(--border-app)] bg-[var(--bg-surface)]/95 backdrop-blur-md transition-colors">
      {/* Top Operational Telemetry & Agency Strip */}
      <div className="flex flex-wrap items-center justify-between px-4 py-1.5 bg-[var(--bg-surface-secondary)] border-b border-[var(--border-app)] text-xs transition-colors">
        <div className="flex items-center gap-2.5 flex-wrap">
          <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded bg-cyan-500/10 border border-cyan-500/30 text-cyan-600 dark:text-cyan-400 font-mono text-[11px]">
            <span className="w-2 h-2 rounded-full bg-cyan-500 animate-pulse" />
            <span>REGION: North Eastern Region (8 States)</span>
          </div>

          <div className="hidden sm:inline-flex items-center gap-1 px-2 py-0.5 rounded bg-emerald-500/10 border border-emerald-500/30 text-emerald-600 dark:text-emerald-400 font-mono text-[11px]">
            <Sparkles className="w-3 h-3 text-emerald-500" />
            <span>Decision Support Active • Telemetry Linked</span>
          </div>

          <button 
            type="button"
            onClick={() => setDemoIntroVisible(true)}
            className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-amber-500/15 hover:bg-amber-500/25 border border-amber-500/40 text-amber-700 dark:text-amber-300 text-[11px] font-bold cursor-pointer transition-all active:scale-95 shadow-xs"
            title="Operational demo environment with simulated data. Click to review data specification."
            id="header-demo-mode-badge"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" />
            <span>DEMO MODE — SIMULATED DATA</span>
          </button>

          <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded bg-red-500/10 border border-red-500/30 text-red-600 dark:text-red-400 font-mono text-[11px]">
            <span className="font-bold">{unreadCount} Active Warnings</span>
          </div>
        </div>

        <div className="flex items-center gap-2.5">
          {/* Sync Timestamp with Refresh button */}
          <div className="flex items-center gap-1.5 text-[var(--text-muted)] font-mono text-[11px]">
            <button 
              onClick={handleManualSync}
              className="p-1 hover:text-cyan-500 transition-colors"
              title="Refresh Telemetry Sync"
            >
              <RefreshCw className={`w-3 h-3 ${isRefreshingSync ? 'animate-spin text-cyan-500' : ''}`} />
            </button>
            <span>
              Synced: {syncSecondsAgo < 60 ? `${syncSecondsAgo}s ago` : `${Math.floor(syncSecondsAgo / 60)}m ago`}
            </span>
          </div>

          <div className="hidden lg:flex items-center text-[var(--text-muted)] font-mono text-[11px] gap-1 pl-2 border-l border-[var(--border-app)]">
            <Clock className="w-3 h-3 text-[var(--text-muted)]" />
            <span>{currentTime || '08:30:00 IST'}</span>
          </div>
        </div>
      </div>

      {/* Main Mission Control Bar */}
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Brand Logo & Title */}
          <div className="flex items-center gap-3">
            {onToggleSidebar && (
              <button
                onClick={onToggleSidebar}
                className="hidden lg:flex p-1.5 rounded-lg text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:bg-[var(--border-subtle)] transition-colors"
                title="Toggle Sidebar"
              >
                <Menu className="w-5 h-5" />
              </button>
            )}

            <button 
              onClick={() => setActiveTab('landing')}
              className="flex items-center gap-3 group text-left transition-transform active:scale-98"
              id="brand-logo-btn"
            >
              <div className="relative flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-600 via-blue-600 to-indigo-700 shadow-md shadow-cyan-900/20 ring-1 ring-black/10 dark:ring-white/20">
                <Mountain className="w-5 h-5 text-white" />
                <Radio className="w-3.5 h-3.5 text-amber-300 absolute -bottom-0.5 -right-0.5" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xl font-black tracking-tight text-[var(--text-primary)] group-hover:text-cyan-600 dark:group-hover:text-cyan-400 transition-colors font-sans">
                    GiriRakshak <span className="text-cyan-600 dark:text-cyan-400 font-black">AI</span>
                  </span>
                  <span className="text-[10px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded bg-cyan-500/10 text-cyan-700 dark:text-cyan-300 border border-cyan-500/30">
                    NER Ops
                  </span>
                </div>
                <p className="text-[11px] text-[var(--text-muted)] font-medium hidden sm:block">
                  Landslide Early Warning & Disaster Decision-Support Platform
                </p>
              </div>
            </button>
          </div>

          {/* Desktop Direct Navigation Badges */}
          <nav className="hidden 2xl:flex items-center space-x-1" aria-label="Main Navigation">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  id={`nav-${item.id}`}
                  onClick={() => setActiveTab(item.id)}
                  className={`relative flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                    isActive
                      ? 'bg-cyan-500/15 text-cyan-700 dark:text-cyan-300 border border-cyan-500/30 shadow-sm'
                      : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--border-subtle)]'
                  }`}
                >
                  <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-cyan-600 dark:text-cyan-400' : 'text-[var(--text-muted)]'}`} />
                  <span>{item.label}</span>
                  {item.badge !== undefined && item.badge > 0 && (
                    <span className="ml-1 px-1.5 py-0.2 rounded-full text-[10px] font-bold bg-red-600 text-white animate-pulse">
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>

          {/* Right Header Controls */}
          <div className="flex items-center gap-2">
            {/* Interactive Guided Walkthrough Quick Start Button */}
            {onStartDemo && (
              <button
                id="header-start-demo-btn"
                onClick={onStartDemo}
                className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold text-xs shadow-md shadow-amber-500/20 transition-all hover:scale-105 active:scale-95"
                title="Launch Guided Operational Demonstration Walkthrough"
              >
                <Play className="w-3.5 h-3.5 fill-current" />
                <span>Start Demo</span>
              </button>
            )}

            {/* Stakeholder Perspective Dropdown */}
            <div className="relative hidden md:block">
              <button
                id="stakeholder-dropdown-btn"
                onClick={() => setStakeholderDropdownOpen(!stakeholderDropdownOpen)}
                className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-[var(--bg-surface-secondary)] hover:bg-[var(--border-subtle)] text-[var(--text-primary)] border border-[var(--border-app)] text-xs font-medium transition-colors"
                title="Switch Stakeholder View"
              >
                <Users className="w-3.5 h-3.5 text-cyan-600 dark:text-cyan-400" />
                <span className="max-w-[125px] truncate">{selectedStakeholder}</span>
                <ChevronDown className="w-3 h-3 text-[var(--text-muted)]" />
              </button>

              {stakeholderDropdownOpen && (
                <div 
                  className="absolute right-0 mt-2 w-56 rounded-xl bg-[var(--bg-surface)] border border-[var(--border-app)] shadow-2xl p-1.5 z-50 animate-in fade-in slide-in-from-top-2 duration-150"
                  onMouseLeave={() => setStakeholderDropdownOpen(false)}
                >
                  <div className="px-2 py-1 text-[11px] font-bold uppercase tracking-wider text-[var(--text-muted)] border-b border-[var(--border-app)]">
                    Switch Stakeholder View
                  </div>
                  {stakeholders.map((role) => (
                    <button
                      key={role}
                      onClick={() => {
                        onSelectStakeholder(role);
                        setActiveTab('stakeholder');
                        setStakeholderDropdownOpen(false);
                      }}
                      className={`w-full text-left px-2.5 py-2 rounded-lg text-xs font-medium flex items-center justify-between transition-colors ${
                        selectedStakeholder === role
                          ? 'bg-cyan-500/15 text-cyan-700 dark:text-cyan-300 font-semibold'
                          : 'text-[var(--text-secondary)] hover:bg-[var(--bg-surface-secondary)] hover:text-[var(--text-primary)]'
                      }`}
                    >
                      <span>{role}</span>
                      {selectedStakeholder === role && (
                        <span className="w-1.5 h-1.5 rounded-full bg-cyan-500" />
                      )}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Critical Alert Quick Badge */}
            {criticalAlertCount > 0 && (
              <button
                id="quick-critical-alert-btn"
                onClick={() => setActiveTab('warnings')}
                className="hidden sm:flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-red-500/10 border border-red-500/30 text-red-600 dark:text-red-400 hover:bg-red-500/20 text-xs font-semibold animate-pulse transition-colors"
              >
                <ShieldAlert className="w-3.5 h-3.5 text-red-500" />
                <span>{criticalAlertCount} Critical</span>
              </button>
            )}

            {/* Quick Command Palette Trigger (Ctrl+K) */}
            {onOpenCommandPalette && (
              <button
                id="header-command-palette-btn"
                onClick={onOpenCommandPalette}
                className="hidden lg:flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-[var(--bg-surface-secondary)] hover:bg-[var(--border-subtle)] text-[var(--text-primary)] border border-[var(--border-app)] text-xs transition-colors"
                title="Search and Commands (Ctrl+K)"
              >
                <Command className="w-3.5 h-3.5 text-cyan-600 dark:text-cyan-400" />
                <span className="hidden xl:inline text-[11px] text-[var(--text-muted)]">Search</span>
                <kbd className="px-1.5 py-0.5 rounded text-[10px] font-mono bg-[var(--bg-surface)] border border-[var(--border-app)] text-[var(--text-muted)] font-semibold">
                  ⌘K
                </kbd>
              </button>
            )}

            {/* Dark / Light Theme Toggle */}
            <button
              id="header-theme-toggle-btn"
              onClick={toggleTheme}
              className="p-2 rounded-xl text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:bg-[var(--border-subtle)] border border-[var(--border-app)] transition-colors"
              title={`Switch to ${resolvedTheme === 'dark' ? 'Light' : 'Dark'} Mode`}
              aria-label="Toggle Theme"
            >
              {resolvedTheme === 'dark' ? (
                <Sun className="w-4 h-4 text-amber-400 hover:rotate-45 transition-transform" />
              ) : (
                <Moon className="w-4 h-4 text-cyan-600 hover:-rotate-12 transition-transform" />
              )}
            </button>

            {/* Decision Support Assistant Button */}
            <button
              id="header-ai-assistant-btn"
              onClick={onOpenAIAssistant}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gradient-to-r from-cyan-600/10 to-blue-600/10 hover:from-cyan-600/20 hover:to-blue-600/20 border border-cyan-500/30 text-cyan-700 dark:text-cyan-300 text-xs font-semibold shadow-sm transition-all active:scale-95"
              title="Open Decision Support Assistant"
            >
              <Bot className="w-4 h-4 text-cyan-600 dark:text-cyan-400" />
              <span className="hidden sm:inline">GiriRakshak Assistant</span>
            </button>

            {/* Notification Bell */}
            <button
              id="header-notification-btn"
              onClick={onOpenNotifications}
              className="relative p-2 rounded-xl text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:bg-[var(--border-subtle)] transition-colors"
              title="Notifications"
            >
              <Bell className="w-4 h-4" />
              {unreadCount > 0 && (
                <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-red-600 ring-2 ring-[var(--bg-surface)]" />
              )}
            </button>

            {/* Settings */}
            <button
              id="header-settings-btn"
              onClick={onOpenSettings}
              className="p-2 rounded-xl text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:bg-[var(--border-subtle)] transition-colors"
              title="Settings & Thresholds"
            >
              <Settings className="w-4 h-4" />
            </button>

            {/* Mobile Navigation Toggle */}
            <button
              id="mobile-menu-toggle-btn"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="2xl:hidden p-2 rounded-xl text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:bg-[var(--border-subtle)] transition-colors"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Navigation */}
      {mobileMenuOpen && (
        <div className="2xl:hidden border-t border-slate-800 bg-[#060c1d] px-4 pt-3 pb-5 space-y-2">
          <div className="grid grid-cols-2 gap-2">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    setActiveTab(item.id);
                    setMobileMenuOpen(false);
                  }}
                  className={`flex items-center gap-2 px-3 py-2.5 rounded-xl text-xs font-medium transition-colors ${
                    isActive
                      ? 'bg-cyan-500/20 text-cyan-300 font-semibold border border-cyan-500/30'
                      : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                  }`}
                >
                  <Icon className="w-4 h-4 text-cyan-400" />
                  <span className="truncate">{item.label}</span>
                  {item.badge !== undefined && item.badge > 0 && (
                    <span className="ml-auto px-1.5 py-0.5 rounded-full text-[10px] font-bold bg-red-500 text-white">
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          <div className="pt-3 border-t border-slate-800 mt-2">
            <div className="text-[11px] font-semibold text-slate-400 mb-2">Stakeholder Perspective:</div>
            <div className="flex flex-wrap gap-1.5">
              {stakeholders.map((role) => (
                <button
                  key={role}
                  onClick={() => {
                    onSelectStakeholder(role);
                    setActiveTab('stakeholder');
                    setMobileMenuOpen(false);
                  }}
                  className={`text-[11px] px-2.5 py-1 rounded-lg border transition-colors ${
                    selectedStakeholder === role
                      ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40'
                      : 'bg-slate-800/60 text-slate-300 border-slate-700'
                  }`}
                >
                  {role}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
