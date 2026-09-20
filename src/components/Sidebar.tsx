import React from 'react';
import { 
  Activity, 
  Siren, 
  MapPin, 
  AlertTriangle, 
  Layers, 
  Clock, 
  SlidersHorizontal, 
  Bot, 
  Cpu, 
  BarChart3, 
  FileText, 
  Radio, 
  Settings, 
  ChevronLeft, 
  ChevronRight, 
  Sparkles,
  Mountain,
  Users,
  Database
} from 'lucide-react';
import { NavigationTab } from '../types';

interface SidebarProps {
  currentTab: NavigationTab;
  onSelectTab: (tab: NavigationTab) => void;
  isCollapsed: boolean;
  onToggleCollapse: () => void;
  criticalAlertCount: number;
}

interface NavGroup {
  label: string;
  items: {
    id: NavigationTab;
    label: string;
    icon: React.ComponentType<{ className?: string }>;
    badge?: number;
    badgeColor?: string;
  }[];
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentTab,
  onSelectTab,
  isCollapsed,
  onToggleCollapse,
  criticalAlertCount
}) => {
  const navGroups: NavGroup[] = [
    {
      label: 'OVERVIEW',
      items: [
        { id: 'dashboard', label: 'Dashboard', icon: Activity },
        { 
          id: 'situation-room', 
          label: 'Situation Room', 
          icon: Siren, 
          badge: criticalAlertCount > 0 ? criticalAlertCount : undefined,
          badgeColor: 'bg-red-500 text-white'
        },
      ]
    },
    {
      label: 'MONITOR',
      items: [
        { id: 'map', label: 'Risk Map', icon: MapPin },
        { 
          id: 'warnings', 
          label: 'Early Warnings', 
          icon: AlertTriangle,
          badge: criticalAlertCount > 0 ? criticalAlertCount : undefined,
          badgeColor: 'bg-red-500 text-white'
        },
        { id: 'infrastructure', label: 'Infrastructure', icon: Layers },
        { id: 'historical', label: 'Historical Data', icon: Clock },
      ]
    },
    {
      label: 'INTELLIGENCE',
      items: [
        { id: 'data-intelligence', label: 'Data Intelligence', icon: Database },
        { id: 'assessment', label: 'AI Risk Analyst', icon: Mountain },
        { id: 'assistant', label: 'AI Assistant', icon: Bot },
        { id: 'scenario', label: 'Scenario Simulator', icon: SlidersHorizontal },
        { id: 'analytics', label: 'Analytics', icon: BarChart3 },
      ]
    },
    {
      label: 'REPORTING',
      items: [
        { id: 'reports', label: 'Reports & SitRep', icon: FileText },
        { id: 'stakeholder', label: 'Stakeholder Views', icon: Users },
      ]
    },
    {
      label: 'SYSTEM',
      items: [
        { id: 'monitoring', label: 'Data Sources & IoT', icon: Radio },
        { id: 'model-performance', label: 'Model & AI Trust', icon: Cpu },
      ]
    }
  ];

  return (
    <aside 
      className={`hidden lg:flex flex-col border-r border-[var(--border-app)] bg-[var(--bg-surface)] transition-all duration-300 z-30 select-none flex-shrink-0 ${
        isCollapsed ? 'w-16' : 'w-64'
      }`}
      aria-label="Platform Sidebar Navigation"
    >
      {/* Collapse/Expand Toggle Header */}
      <div className="flex items-center justify-between h-12 px-3 border-b border-[var(--border-subtle)]">
        {!isCollapsed && (
          <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-[var(--text-muted)]">
            Operations Console
          </span>
        )}
        <button
          onClick={onToggleCollapse}
          className={`p-1.5 rounded-lg text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:bg-[var(--border-subtle)] transition-colors ${
            isCollapsed ? 'mx-auto' : ''
          }`}
          title={isCollapsed ? 'Expand Sidebar' : 'Collapse Sidebar'}
          aria-label={isCollapsed ? 'Expand Sidebar' : 'Collapse Sidebar'}
        >
          {isCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
        </button>
      </div>

      {/* Nav Groups Container */}
      <div className="flex-1 overflow-y-auto py-3 px-2 space-y-5 no-scrollbar">
        {navGroups.map((group) => (
          <div key={group.label} className="space-y-1">
            {!isCollapsed && (
              <div className="px-2.5 pb-1 text-[10px] font-mono font-bold uppercase tracking-wider text-[var(--text-muted)]">
                {group.label}
              </div>
            )}

            {group.items.map((item) => {
              const Icon = item.icon;
              const isActive = currentTab === item.id;

              return (
                <button
                  key={item.id}
                  id={`sidebar-nav-${item.id}`}
                  onClick={() => onSelectTab(item.id)}
                  title={isCollapsed ? item.label : undefined}
                  className={`w-full flex items-center gap-2.5 px-2.5 py-2 rounded-xl text-xs font-medium transition-all group ${
                    isActive
                      ? 'bg-cyan-500/15 text-cyan-700 dark:text-cyan-300 font-semibold border border-cyan-500/30 shadow-sm'
                      : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--border-subtle)]'
                  } ${isCollapsed ? 'justify-center px-0' : ''}`}
                >
                  <Icon className={`w-4 h-4 flex-shrink-0 transition-colors ${
                    isActive ? 'text-cyan-600 dark:text-cyan-400' : 'text-[var(--text-muted)] group-hover:text-[var(--text-primary)]'
                  }`} />

                  {!isCollapsed && (
                    <span className="truncate flex-1 text-left">{item.label}</span>
                  )}

                  {!isCollapsed && item.badge !== undefined && (
                    <span className={`px-1.5 py-0.5 rounded-full text-[10px] font-bold font-mono ${item.badgeColor || 'bg-slate-700 text-white'}`}>
                      {item.badge}
                    </span>
                  )}

                  {isCollapsed && item.badge !== undefined && (
                    <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-red-500 ring-2 ring-[var(--bg-surface)]" />
                  )}
                </button>
              );
            })}
          </div>
        ))}
      </div>

      {/* Sidebar Footer Info */}
      {!isCollapsed && (
        <div className="p-3 border-t border-[var(--border-subtle)] bg-[var(--bg-surface-secondary)]">
          <div className="flex items-center gap-2 text-xs">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <div className="text-[11px] font-mono text-[var(--text-muted)] leading-tight">
              <span>NER Grid: </span>
              <strong className="text-emerald-600 dark:text-emerald-400">Connected</strong>
            </div>
          </div>
          <div className="text-[10px] font-mono text-[var(--text-muted)] mt-0.5">
            Model: Physics-Informed Ensemble
          </div>
        </div>
      )}
    </aside>
  );
};
