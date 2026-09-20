import React, { createContext, useContext, useState, useEffect, useMemo, ReactNode } from 'react';
import { 
  LocationZone, 
  EarlyWarningAlert, 
  InfrastructureItem, 
  NotificationItem, 
  StakeholderRole, 
  SystemSettings, 
  AlertStatus,
  AlertState,
  ScenarioType,
  WhatChangedData,
  AuditLogEvent,
  RiskForecastItem,
  TimelineEventItem,
  SelectedAlertContext
} from '../types';
import { 
  INITIAL_ZONES, 
  INITIAL_ALERTS, 
  INITIAL_INFRASTRUCTURE, 
  INITIAL_NOTIFICATIONS, 
  INITIAL_SETTINGS 
} from '../data/mockData';

export interface SimulationProgress {
  isRunning: boolean;
  stepName: string;
  stepNumber: number;
  totalSteps: number;
  log: string[];
}

export interface HistoricalPlaybackState {
  isPlaying: boolean;
  currentIndex: number;
  dates: string[];
  setIndex: (index: number) => void;
  togglePlay: () => void;
}

export interface GuidedDemoState {
  isOpen: boolean;
  step: number;
  start: () => void;
  next: () => void;
  prev: () => void;
  close: () => void;
  goToStep: (step: number) => void;
}

export interface DisasterContextType {
  // Data
  zones: LocationZone[];
  alerts: EarlyWarningAlert[];
  infrastructure: InfrastructureItem[];
  notifications: NotificationItem[];
  selectedZone: LocationZone | null;
  selectedZoneId: string | null;
  selectedAlert: EarlyWarningAlert | null;
  selectedState: string;
  selectedDistrict: string;
  currentRole: StakeholderRole;
  systemSettings: SystemSettings;
  
  // Emergency Mode & Audit
  emergencyMode: boolean;
  auditLog: AuditLogEvent[];
  riskForecast: RiskForecastItem[];
  timelineEvents: TimelineEventItem[];
  connectionStatus: 'LIVE' | 'DELAYED' | 'DISCONNECTED';
  lastUpdateTimestamp: string;

  // Interactive Investigation Workflow State
  investigationStep: number;
  investigationWorkflowOpen: boolean;

  // Scenarios & State
  currentScenario: ScenarioType;
  simulationProgress: SimulationProgress;
  whatChanged: WhatChangedData;
  historicalPlayback: HistoricalPlaybackState;
  guidedDemo: GuidedDemoState;

  // Operational Demo Mode States (Part 3 & Part 10)
  demoMode: boolean;
  demoIntroVisible: boolean;
  setDemoMode: (mode: boolean) => void;
  setDemoIntroVisible: (visible: boolean) => void;
  enterDemo: () => void;

  // Regional Calculated Stats
  regionalRiskStatus: 'CRITICAL' | 'ELEVATED' | 'WATCH' | 'NORMAL';
  riskTrend: 'INCREASING' | 'STABLE' | 'DECREASING';
  criticalAlertCount: number;
  activeAlertCount: number;
  highRiskZoneCount: number;
  mediumRiskZoneCount: number;
  lowRiskZoneCount: number;
  exposedInfrastructureCount: number;

  // Actions
  setSelectedZoneId: (id: string | null) => void;
  setSelectedAlert: (alert: EarlyWarningAlert | null) => void;
  setSelectedState: (state: string) => void;
  setSelectedDistrict: (district: string) => void;
  setCurrentRole: (role: StakeholderRole) => void;
  setSystemSettings: (settings: SystemSettings) => void;
  setEmergencyMode: (mode: boolean) => void;
  setInvestigationStep: (step: number) => void;
  setInvestigationWorkflowOpen: (open: boolean) => void;
  startInvestigation: (alert: EarlyWarningAlert) => void;
  runScenario: (scenario: ScenarioType) => void;
  updateAlertStatus: (alertId: string, status: AlertStatus) => void;
  escalateAlert: (alertId: string, targetState: AlertState, reason: string) => void;
  acknowledgeAlert: (alertId: string) => void;
  resolveAlert: (alertId: string, reason: string) => void;
  reopenAlert: (alertId: string, reason: string) => void;
  addAuditLog: (event: Omit<AuditLogEvent, 'id' | 'timestamp'>) => void;
  dispatchMachinery: (infraId: string) => void;
  addNotification: (notification: Omit<NotificationItem, 'id' | 'timestamp'>) => void;
  markAllNotificationsRead: () => void;
  resetToBaseline: () => void;
}

const DisasterContext = createContext<DisasterContextType | undefined>(undefined);

const HISTORICAL_DATES = [
  '15 Sept 2026 (Pre-Monsoon)',
  '16 Sept 2026 (Rainfall Surge)',
  '17 Sept 2026 (Peak Cloudburst)',
  '18 Sept 2026 (Current State)',
  '19 Sept 2026 (48h AI Forecast)'
];

export const DisasterProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [zones, setZones] = useState<LocationZone[]>(INITIAL_ZONES);
  const [alerts, setAlerts] = useState<EarlyWarningAlert[]>(INITIAL_ALERTS);
  const [infrastructure, setInfrastructure] = useState<InfrastructureItem[]>(INITIAL_INFRASTRUCTURE);
  const [notifications, setNotifications] = useState<NotificationItem[]>(INITIAL_NOTIFICATIONS);
  
  const [selectedZoneId, setSelectedZoneId] = useState<string | null>('ZONE-NER-01');
  const [selectedAlert, setSelectedAlertState] = useState<EarlyWarningAlert | null>(INITIAL_ALERTS[0]);
  const [selectedState, setSelectedState] = useState<string>('All');
  const [selectedDistrict, setSelectedDistrict] = useState<string>('All');
  const [currentRole, setCurrentRole] = useState<StakeholderRole>('SDMA / NDMA');
  const [systemSettings, setSystemSettings] = useState<SystemSettings>(INITIAL_SETTINGS);

  // Emergency Mode & Audit
  const [emergencyMode, setEmergencyMode] = useState<boolean>(false);
  const [connectionStatus, setConnectionStatus] = useState<'LIVE' | 'DELAYED' | 'DISCONNECTED'>('LIVE');
  const [lastUpdateTimestamp] = useState<string>('Today, 12:42:18 IST');

  // Investigation Workflow State
  const [investigationStep, setInvestigationStep] = useState<number>(1);
  const [investigationWorkflowOpen, setInvestigationWorkflowOpen] = useState<boolean>(false);

  // System Audit Log
  const [auditLog, setAuditLog] = useState<AuditLogEvent[]>([
    {
      id: 'LOG-001',
      timestamp: 'Today, 08:42 IST',
      action: 'Alert Generated (Critical)',
      category: 'ALERT',
      details: 'Triggered by IMD cloudburst threshold (184.6mm) + InSAR creep velocity',
      user: 'Automated Risk Engine'
    },
    {
      id: 'LOG-002',
      timestamp: 'Today, 08:50 IST',
      action: 'Multi-lingual CAP Broadcast',
      category: 'SYSTEM',
      details: 'Disseminated warnings in English, Assamese, and Hindi to East Khasi Hills',
      user: 'SDMA Operations Officer'
    },
    {
      id: 'LOG-003',
      timestamp: 'Today, 09:15 IST',
      action: 'Ground IoT Telemetry Sync',
      category: 'SYSTEM',
      details: 'Sync completed for 12 inclinometer and piezometer nodes across NER',
      user: 'IoT Gateway Connector'
    }
  ]);

  // Timeline Events
  const [timelineEvents, setTimelineEvents] = useState<TimelineEventItem[]>([
    {
      id: 'EVT-1',
      timestamp: '2026-09-19T08:20:00Z',
      timeDisplay: '08:20 IST',
      title: 'Heavy Rainfall Detected',
      description: 'IMD Doppler Radar detected convective rain cell delivering 28.4 mm/hr precipitation over Sohra escarpment.',
      category: 'Weather',
      severity: 'WARNING',
      location: 'Sohra-Shella Escarpment, East Khasi Hills',
      source: 'IMD AWS Radar',
      delta: '+28.4 mm/h'
    },
    {
      id: 'EVT-2',
      timestamp: '2026-09-19T10:15:00Z',
      timeDisplay: '10:15 IST',
      title: 'Soil Moisture Saturation Escalated',
      description: 'Subsurface capacitive probe recorded volumetric water content exceeding 89% saturation threshold.',
      category: 'Sensor',
      severity: 'WARNING',
      location: 'Sohra-Shella Escarpment',
      source: 'NASA SMAP / In-situ IoT',
      delta: '+14% saturation'
    },
    {
      id: 'EVT-3',
      timestamp: '2026-09-19T11:40:00Z',
      timeDisplay: '11:40 IST',
      title: 'Geotechnical Hazard Score Increased',
      description: 'Multi-parameter slope stability model updated safety factor from 1.18 to 0.88 (Failure Imminent).',
      category: 'Risk',
      severity: 'CRITICAL',
      location: 'Sohra-Shella Escarpment',
      source: 'GiriRakshak Risk Engine',
      delta: '62 → 88 (+26)'
    },
    {
      id: 'EVT-4',
      timestamp: '2026-09-19T12:05:00Z',
      timeDisplay: '12:05 IST',
      title: 'Critical Failure Threshold Exceeded',
      description: 'GNSS surface inclinometer registered 4.8 mm/day shear plane acceleration.',
      category: 'Sensor',
      severity: 'CRITICAL',
      location: 'Sohra-Shella Escarpment',
      source: 'InSAR Sentinel-1 / GNSS',
      delta: '+4.8 mm/day'
    },
    {
      id: 'EVT-5',
      timestamp: '2026-09-19T12:10:00Z',
      timeDisplay: '12:10 IST',
      title: 'Red Level-3 Alert Dispatched',
      description: 'Critical evacuation notice and road access restrictions generated for State Highway 5.',
      category: 'Alert',
      severity: 'CRITICAL',
      location: 'Sohra-Shella Escarpment',
      source: 'GiriRakshak Alert Engine',
      delta: 'Level 3 Critical'
    }
  ]);

  const setSelectedAlert = (alert: EarlyWarningAlert | null) => {
    setSelectedAlertState(alert);
    if (alert && alert.zoneId) {
      setSelectedZoneId(alert.zoneId);
    }
  };

  const handleSetSelectedZoneId = (id: string | null) => {
    setSelectedZoneId(id);
    if (id) {
      const matchingAlert = alerts.find(a => a.zoneId === id);
      if (matchingAlert) {
        setSelectedAlertState(matchingAlert);
      }
    }
  };

  const startInvestigation = (alert: EarlyWarningAlert) => {
    setSelectedAlert(alert);
    setInvestigationStep(2);
    setInvestigationWorkflowOpen(true);
  };

  const addAuditLog = (event: Omit<AuditLogEvent, 'id' | 'timestamp'>) => {
    const newLog: AuditLogEvent = {
      ...event,
      id: `LOG-${Date.now().toString().slice(-4)}`,
      timestamp: 'Just now'
    };
    setAuditLog(prev => [newLog, ...prev]);
  };

  const escalateAlert = (alertId: string, targetState: AlertState, reason: string) => {
    setAlerts(prev => prev.map(a => {
      if (a.id === alertId) {
        const newScore = targetState === 'Critical' ? Math.max(85, a.riskScore + 10) : a.riskScore;
        const newLevel = targetState === 'Critical' ? 'HIGH' : a.riskLevel;
        return {
          ...a,
          alertState: targetState,
          riskLevel: newLevel,
          riskScore: newScore,
          status: 'Active',
          trigger: `${a.trigger} | Escalated to ${targetState}: ${reason}`
        };
      }
      return a;
    }));

    addAuditLog({
      action: `Alert Escalated to ${targetState}`,
      category: 'ALERT',
      details: `Alert ${alertId}: ${reason}`,
      user: currentRole
    });

    setTimelineEvents(prev => [
      {
        id: `EVT-${Date.now()}`,
        timestamp: new Date().toISOString(),
        timeDisplay: 'Just now',
        title: `Alert Escalation: ${targetState}`,
        description: `Operational status escalated by ${currentRole}. Reason: ${reason}`,
        category: 'Alert',
        severity: targetState === 'Critical' ? 'CRITICAL' : 'WARNING',
        location: selectedZone ? selectedZone.name : 'NER Zone',
        source: 'Operations Command'
      },
      ...prev
    ]);

    addNotification({
      title: `🚨 Alert Escalated to ${targetState}`,
      message: `Alert ${alertId} escalated by ${currentRole}: ${reason}`,
      type: targetState === 'Critical' ? 'critical' : 'warning',
      read: false,
      linkTo: 'map'
    });
  };

  const acknowledgeAlert = (alertId: string) => {
    setAlerts(prev => prev.map(a => a.id === alertId ? { ...a, status: 'Under Review' } : a));
    addAuditLog({
      action: 'Alert Acknowledged',
      category: 'ALERT',
      details: `Alert ${alertId} marked Under Review by ${currentRole}`,
      user: currentRole
    });
    setTimelineEvents(prev => [
      {
        id: `EVT-${Date.now()}`,
        timestamp: new Date().toISOString(),
        timeDisplay: 'Just now',
        title: 'Alert Acknowledged',
        description: `Alert ${alertId} taken under active review by ${currentRole}`,
        category: 'Alert',
        severity: 'INFO',
        location: selectedZone ? selectedZone.name : 'NER Zone',
        source: 'Operations Command'
      },
      ...prev
    ]);
  };

  const resolveAlert = (alertId: string, reason: string) => {
    setAlerts(prev => prev.map(a => a.id === alertId ? { ...a, status: 'Resolved', alertState: 'Monitoring' } : a));
    addAuditLog({
      action: 'Alert Resolved',
      category: 'ALERT',
      details: `Alert ${alertId} marked Resolved: ${reason}`,
      user: currentRole
    });
    setTimelineEvents(prev => [
      {
        id: `EVT-${Date.now()}`,
        timestamp: new Date().toISOString(),
        timeDisplay: 'Just now',
        title: 'Alert Resolved',
        description: `Alert ${alertId} deactivated. Resolution reason: ${reason}`,
        category: 'Alert',
        severity: 'INFO',
        location: selectedZone ? selectedZone.name : 'NER Zone',
        source: 'Operations Command'
      },
      ...prev
    ]);
  };

  const reopenAlert = (alertId: string, reason: string) => {
    setAlerts(prev => prev.map(a => a.id === alertId ? { ...a, status: 'Active', alertState: 'Warning' } : a));
    addAuditLog({
      action: 'Alert Reopened',
      category: 'ALERT',
      details: `Alert ${alertId} reopened: ${reason}`,
      user: currentRole
    });
  };

  const [currentScenario, setCurrentScenario] = useState<ScenarioType>('none');
  const [simulationProgress, setSimulationProgress] = useState<SimulationProgress>({
    isRunning: false,
    stepName: 'Ready',
    stepNumber: 0,
    totalSteps: 12,
    log: []
  });

  const [whatChanged, setWhatChanged] = useState<WhatChangedData>({
    hasChange: false,
    scoreDelta: 0,
    rainfallDeltaPct: 0,
    moistureDeltaPct: 0,
    movementDeltaPct: 0,
    previousScore: 88,
    currentScore: 88,
    summary: 'Current geotechnical conditions reflect standard 24h monitoring cycle. No anomalous delta detected.',
    timestamp: 'Baseline'
  });

  // Historical Playback
  const [historyIndex, setHistoryIndex] = useState<number>(3); // default index 3 (Current)
  const [isHistoryPlaying, setIsHistoryPlaying] = useState<boolean>(false);

  // Guided Demo Modal
  const [guidedDemoOpen, setGuidedDemoOpen] = useState<boolean>(false);
  const [guidedDemoStep, setGuidedDemoStep] = useState<number>(1);

  // Operational Demo Mode States (Part 3 & Part 10)
  const [demoMode, setDemoMode] = useState<boolean>(true);
  const [demoIntroVisible, setDemoIntroVisible] = useState<boolean>(() => {
    try {
      return sessionStorage.getItem('girirakshak-demo-dismissed') !== 'true';
    } catch {
      return true;
    }
  });

  const enterDemo = () => {
    setDemoMode(true);
    setDemoIntroVisible(false);
    try {
      sessionStorage.setItem('girirakshak-demo-dismissed', 'true');
    } catch {
      // ignore
    }
  };

  // Computed Selected Zone
  const selectedZone = useMemo(() => {
    return zones.find(z => z.id === selectedZoneId) || zones[0] || null;
  }, [zones, selectedZoneId]);

  // Calculated Stats
  const criticalAlertCount = useMemo(() => {
    return alerts.filter(a => a.alertState === 'Critical' && a.status !== 'Resolved').length;
  }, [alerts]);

  const activeAlertCount = useMemo(() => {
    return alerts.filter(a => a.status !== 'Resolved').length;
  }, [alerts]);

  const highRiskZoneCount = useMemo(() => {
    return zones.filter(z => z.riskLevel === 'HIGH').length;
  }, [zones]);

  const mediumRiskZoneCount = useMemo(() => {
    return zones.filter(z => z.riskLevel === 'MEDIUM').length;
  }, [zones]);

  const lowRiskZoneCount = useMemo(() => {
    return zones.filter(z => z.riskLevel === 'LOW').length;
  }, [zones]);

  const exposedInfrastructureCount = useMemo(() => {
    return infrastructure.filter(i => i.riskLevel === 'HIGH' || i.inspectionStatus === 'Immediate Hazard').length;
  }, [infrastructure]);

  const regionalRiskStatus = useMemo(() => {
    if (criticalAlertCount >= 2 || highRiskZoneCount >= 3) return 'CRITICAL';
    if (highRiskZoneCount >= 1 || criticalAlertCount >= 1) return 'ELEVATED';
    if (mediumRiskZoneCount >= 3) return 'WATCH';
    return 'NORMAL';
  }, [criticalAlertCount, highRiskZoneCount, mediumRiskZoneCount]);

  const riskTrend = useMemo(() => {
    if (whatChanged.scoreDelta > 0) return 'INCREASING';
    if (whatChanged.scoreDelta < 0) return 'DECREASING';
    return 'STABLE';
  }, [whatChanged.scoreDelta]);

  // Historical Playback Timer Effect
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isHistoryPlaying) {
      timer = setInterval(() => {
        setHistoryIndex(prev => {
          const next = (prev + 1) % HISTORICAL_DATES.length;
          applyHistoricalIndex(next);
          return next;
        });
      }, 2500);
    }
    return () => clearInterval(timer);
  }, [isHistoryPlaying]);

  const applyHistoricalIndex = (idx: number) => {
    // 0: Pre-monsoon, 1: Rain Surge, 2: Peak Cloudburst, 3: Current, 4: Forecast
    if (idx === 0) {
      setZones(prev => prev.map(z => ({
        ...z,
        riskScore: Math.max(15, z.riskScore - 35),
        riskLevel: 'LOW',
        rainfall24h: Math.round(z.rainfall24h * 0.2),
        soilMoisture: Math.round(z.soilMoisture * 0.6),
        groundMovement: 0.5
      })));
      setAlerts(prev => prev.map(a => ({ ...a, status: 'Resolved', alertState: 'Monitoring' })));
    } else if (idx === 1) {
      setZones(prev => prev.map(z => ({
        ...z,
        riskScore: Math.min(65, Math.max(30, z.riskScore - 15)),
        riskLevel: 'MEDIUM',
        rainfall24h: Math.round(z.rainfall24h * 0.6),
        soilMoisture: Math.round(z.soilMoisture * 0.8),
        groundMovement: 1.8
      })));
    } else if (idx === 2) {
      setZones(prev => prev.map(z => ({
        ...z,
        riskScore: Math.min(98, z.riskScore + 10),
        riskLevel: 'HIGH',
        rainfall24h: Math.round(z.rainfall24h * 1.4),
        soilMoisture: 93,
        groundMovement: 6.2
      })));
      setAlerts(prev => prev.map(a => ({ ...a, alertState: 'Critical', status: 'Active' })));
    } else if (idx === 3) {
      setZones(INITIAL_ZONES);
      setAlerts(INITIAL_ALERTS);
    } else if (idx === 4) {
      // 48h AI Forecast
      setZones(prev => prev.map(z => ({
        ...z,
        riskScore: Math.min(95, z.riskScore + 6),
        rainfall24h: Math.round(z.rainfall24h * 1.15),
        aiPrediction: 'DEMO FORECAST: Convective monsoon trough lingering over Southern Meghalaya & Dima Hasao.'
      })));
    }
  };

  // Add Notification
  const addNotification = (notif: Omit<NotificationItem, 'id' | 'timestamp'>) => {
    const newItem: NotificationItem = {
      ...notif,
      id: `NOTIF-${Date.now()}`,
      timestamp: 'Just now',
    };
    setNotifications(prev => [newItem, ...prev]);
  };

  const markAllNotificationsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  const updateAlertStatus = (alertId: string, status: AlertStatus) => {
    setAlerts(prev => prev.map(a => a.id === alertId ? { ...a, status } : a));
    addNotification({
      title: `Alert Status Updated (${status})`,
      message: `Alert ID ${alertId} status changed to ${status}.`,
      type: status === 'Resolved' ? 'success' : 'info',
      read: false,
      linkTo: 'warnings'
    });
  };

  const dispatchMachinery = (infraId: string) => {
    setInfrastructure(prev => prev.map(i => {
      if (i.id === infraId) {
        return {
          ...i,
          inspectionStatus: 'Inspected - Safe',
          recommendedAction: 'BRO Excavator / Dozer Pre-Positioned. Culverts cleared and rockfall netting anchored.'
        };
      }
      return i;
    }));
    addNotification({
      title: 'BRO Heavy Machinery Dispatched',
      message: `Emergency slope clearing unit mobilized to Infrastructure Corridor ${infraId}.`,
      type: 'success',
      read: false,
      linkTo: 'infrastructure'
    });
  };

  const resetToBaseline = () => {
    setZones(INITIAL_ZONES);
    setAlerts(INITIAL_ALERTS);
    setInfrastructure(INITIAL_INFRASTRUCTURE);
    setCurrentScenario('none');
    setSimulationProgress({
      isRunning: false,
      stepName: 'Reset to Baseline',
      stepNumber: 0,
      totalSteps: 12,
      log: ['System restored to standard NER baseline data.']
    });
    setWhatChanged({
      hasChange: false,
      scoreDelta: 0,
      rainfallDeltaPct: 0,
      moistureDeltaPct: 0,
      movementDeltaPct: 0,
      previousScore: 88,
      currentScore: 88,
      summary: 'Data returned to default initial monitoring state.',
      timestamp: 'Just now'
    });
    addNotification({
      title: 'Simulation Reset',
      message: 'Monitoring telemetry returned to baseline data.',
      type: 'info',
      read: false
    });
  };

  // Run Scenario Engine
  const runScenario = (scenario: ScenarioType) => {
    if (scenario === 'reset') {
      resetToBaseline();
      return;
    }

    setCurrentScenario(scenario);
    setSimulationProgress({
      isRunning: true,
      stepName: 'Initiating Simulation Event...',
      stepNumber: 1,
      totalSteps: 12,
      log: [`[0s] Starting scenario: ${scenario}`]
    });

    if (scenario === 'heavy_rainfall') {
      // Step-by-step state propagation
      const steps = [
        { num: 1, name: 'Cloudburst Inflow Detected (IMD Doppler)', log: 'Rainfall intensity surged +38% across East Khasi Hills & Dima Hasao.' },
        { num: 2, name: 'Soil Moisture Response', log: 'Pore pressure sensors reached 94.8% critical saturation limit.' },
        { num: 3, name: 'AI Risk Score Recalculation', log: 'Factor of Safety dropped below 0.88; Risk score recalculated: +24 points.' },
        { num: 4, name: 'Hazard Threshold Crossed: MEDIUM → HIGH', log: 'Zonal classification escalated to CRITICAL.' },
        { num: 5, name: 'GIS Risk Map Layer Synchronization', log: 'Geospatial hazard polygons updated with red flashing perimeter.' },
        { num: 6, name: 'Risk Contributor Matrix Updated', log: 'Precipitation weight: 42%, Pore Pressure: 31%, Slope: 18%.' },
        { num: 7, name: 'Early Warning Generation & Escalation', log: 'Alert LEVEL-3 RED issued for Sohra Escarpment & NH-6 Lifeline.' },
        { num: 8, name: 'Infrastructure Exposure Recalculation', log: '5 roads and 2 bridges identified within immediate failure cone.' },
        { num: 9, name: 'Multi-Channel Push Notification Broadcast', log: 'Cell Broadcast & CAP-India payload pushed to SDMA & DEOC.' },
        { num: 10, name: 'Situation Room Intelligence Sync', log: 'Executive Dashboard flagged regional hazard as CRITICAL.' },
        { num: 11, name: 'Analytics Trend Recomputation', log: '24h forecast model projected 89% probability of debris movement.' },
        { num: 12, name: 'AI Assistant State Knowledge Updated', log: 'Assistant contextual memory armed with updated hazard metrics.' }
      ];

      // Execute simulation progress sequence
      steps.forEach((st, idx) => {
        setTimeout(() => {
          setSimulationProgress(prev => ({
            ...prev,
            stepNumber: st.num,
            stepName: st.name,
            log: [...prev.log, `[+${(idx * 0.25).toFixed(1)}s] ${st.log}`]
          }));

          if (idx === steps.length - 1) {
            setSimulationProgress(prev => ({ ...prev, isRunning: false }));
          }
        }, idx * 250);
      });

      // Update Zones
      setZones(prev => prev.map(z => {
        if (z.id === 'ZONE-NER-01' || z.id === 'ZONE-NER-02') {
          return {
            ...z,
            riskScore: Math.min(98, z.riskScore + 10),
            riskLevel: 'HIGH',
            rainfall24h: +(z.rainfall24h * 1.38).toFixed(1),
            soilMoisture: 94.8,
            groundMovement: 7.4,
            lastUpdated: 'Just now',
            aiPrediction: 'CRITICAL FAILURE IMMINENT: Heavy rainfall cloudburst oversaturated shale slip surface. Immediate road closures mandated.'
          };
        }
        return {
          ...z,
          riskScore: Math.min(92, z.riskScore + 6),
          rainfall24h: +(z.rainfall24h * 1.2).toFixed(1),
          soilMoisture: Math.min(95, z.soilMoisture + 4)
        };
      }));

      // Update Alerts
      setAlerts(prev => [
        {
          id: `ALERT-NER-EMERG-${Date.now().toString().slice(-4)}`,
          zoneId: 'ZONE-NER-01',
          location: 'Sohra-Shella Escarpment & SH-5',
          district: 'East Khasi Hills',
          state: 'Meghalaya',
          riskLevel: 'HIGH',
          alertState: 'Critical',
          riskScore: 98,
          timestamp: 'Just now',
          trigger: 'Heavy rainfall cloudburst (254.8mm / 24h) and pore pressure surge >94%',
          aiConfidence: 94,
          status: 'Active',
          environmentalTriggers: {
            rainfallRate: '48.2 mm/hr peak intensity',
            soilSaturation: '94.8% pore-water saturation limit',
            slopeDisplacement: '7.4 mm/day shear slip',
            shearStressRatio: '0.84 (Failure imminent)'
          },
          recommendedActions: [
            'Immediate shutdown of SH-5 and Lumshnong pass',
            'Activate 1st Battalion NDRF staging post at Mawphlang',
            'Trigger acoustic hillside sirens in Shella and Wahkaba habitations'
          ],
          multilingualAlert: {
            en: 'EMERGENCY LANDSLIDE WARNING: Extreme rainfall has saturated Sohra slopes. Evacuate valley bottoms immediately.',
            as: 'জৰুৰী ভূমিস্খলন সতৰ্কবাৰ্তা: প্ৰচণ্ড বৰষুণৰ ফলত সোহৰা পাহাৰীয়া অঞ্চলত বিপদজনক অৱস্থা সৃষ্টি হৈছে।',
            hi: 'आपातकालीन भूस्खलन चेतावनी: सोहरा क्षेत्र में मूसलाधार बारिश से ढलान विफलता का भारी खतरा है। सुरक्षित स्थानों पर जाएं।'
          },
          disseminationChannels: ['SMS', 'IVR', 'Mobile App', 'Siren', 'CAP-India'],
          affectedPopulationEst: 14200,
          criticalInfrastructure: ['SH-5 Lifeline', 'Wahkaba Habitations', 'Haflong Railway Cutting']
        },
        ...prev
      ]);

      // Update Infrastructure
      setInfrastructure(prev => prev.map(i => {
        if (i.id === 'INF-01' || i.id === 'INF-03') {
          return {
            ...i,
            riskLevel: 'HIGH',
            inspectionStatus: 'Immediate Hazard',
            vulnerabilityScore: 96,
            recommendedAction: 'Halt all vehicular traffic immediately. BRO heavy dozers standing by.'
          };
        }
        return i;
      }));

      // Update What Changed
      setWhatChanged({
        hasChange: true,
        scoreDelta: 24,
        rainfallDeltaPct: 38,
        moistureDeltaPct: 21,
        movementDeltaPct: 45,
        previousScore: 74,
        currentScore: 98,
        summary: 'Cloudburst simulation increased rainfall (+38%) and soil pore saturation (+21%), causing geotechnical safety factor to collapse below unity.',
        timestamp: 'Just now'
      });

      // Add Notification
      addNotification({
        title: '🔴 CRITICAL HAZARD: Heavy Rainfall Trigger',
        message: 'Precipitation in Sohra Escarpment reached 254.8mm. Level-3 Red Warning dispatched.',
        type: 'critical',
        read: false,
        linkTo: 'warnings'
      });
    } else if (scenario === 'recovery') {
      // Recovery Sequence
      const steps = [
        { num: 1, name: 'Precipitation Subsidence', log: 'Rainfall dropped below 15mm/24h baseline.' },
        { num: 2, name: 'Pore-Water Dissipation', log: 'Piezometer pressure decreased from 94% to 54%.' },
        { num: 3, name: 'Slope Factor of Safety Restored', log: 'Geotechnical factor of safety rose above 1.42.' },
        { num: 4, name: 'Risk Score De-escalation', log: 'Risk score reduced to 24/100 (LOW RISK).' },
        { num: 5, name: 'Active Alerts Resolved', log: 'Critical alert downgraded through Watch to Resolved.' },
        { num: 6, name: 'Infrastructure De-restriction', log: 'BRO and PWD cleared debris; highways declared safe.' }
      ];

      steps.forEach((st, idx) => {
        setTimeout(() => {
          setSimulationProgress(prev => ({
            ...prev,
            stepNumber: st.num,
            stepName: st.name,
            log: [...prev.log, `[+${(idx * 0.3).toFixed(1)}s] ${st.log}`]
          }));
          if (idx === steps.length - 1) {
            setSimulationProgress(prev => ({ ...prev, isRunning: false }));
          }
        }, idx * 300);
      });

      setZones(prev => prev.map(z => ({
        ...z,
        riskScore: Math.max(18, Math.round(z.riskScore * 0.35)),
        riskLevel: 'LOW',
        rainfall24h: 12.4,
        soilMoisture: 54.0,
        groundMovement: 0.4,
        lastUpdated: 'Just now',
        aiPrediction: 'STABLE GEOTECHNICAL CONDITIONS: Pore-water pressures dissipated below threshold. No anomalous slope displacement.'
      })));

      setAlerts(prev => prev.map(a => ({
        ...a,
        alertState: 'Monitoring',
        status: 'Resolved',
        riskLevel: 'LOW',
        riskScore: 24
      })));

      setInfrastructure(prev => prev.map(i => ({
        ...i,
        riskLevel: 'LOW',
        inspectionStatus: 'Inspected - Safe',
        recommendedAction: 'All lanes reopened. Routine geotechnical sensor monitoring active.'
      })));

      setWhatChanged({
        hasChange: true,
        scoreDelta: -48,
        rainfallDeltaPct: -78,
        moistureDeltaPct: -42,
        movementDeltaPct: -68,
        previousScore: 88,
        currentScore: 24,
        summary: 'Precipitation subsided (-78%) and subsurface pore pressure drained (-42%). Slope stability restored.',
        timestamp: 'Just now'
      });

      addNotification({
        title: '✅ Slope Stabilization & All-Clear',
        message: 'Recovery confirmed. Arterial corridors cleared and all alerts marked Resolved.',
        type: 'success',
        read: false,
        linkTo: 'dashboard'
      });
    } else if (scenario === 'rising_moisture') {
      setZones(prev => prev.map(z => ({
        ...z,
        soilMoisture: Math.min(96, z.soilMoisture + 15),
        riskScore: Math.min(94, z.riskScore + 8),
        riskLevel: z.riskScore + 8 > 60 ? 'HIGH' : 'MEDIUM'
      })));
      setWhatChanged({
        hasChange: true,
        scoreDelta: 8,
        rainfallDeltaPct: 5,
        moistureDeltaPct: 28,
        movementDeltaPct: 12,
        previousScore: 82,
        currentScore: 90,
        summary: 'Prolonged antecedent moisture caused water-table rise and shale liquefaction risk.',
        timestamp: 'Just now'
      });
      setSimulationProgress(prev => ({ ...prev, isRunning: false, stepName: 'Moisture Saturation Elevated' }));
    } else if (scenario === 'ground_movement') {
      setZones(prev => prev.map(z => ({
        ...z,
        groundMovement: +(z.groundMovement + 3.2).toFixed(1),
        riskScore: Math.min(95, z.riskScore + 12),
        riskLevel: 'HIGH'
      })));
      setWhatChanged({
        hasChange: true,
        scoreDelta: 12,
        rainfallDeltaPct: 0,
        moistureDeltaPct: 8,
        movementDeltaPct: 55,
        previousScore: 80,
        currentScore: 92,
        summary: 'InSAR satellite and GNSS displacement sensors detected rapid shear slip acceleration (+55%).',
        timestamp: 'Just now'
      });
      setSimulationProgress(prev => ({ ...prev, isRunning: false, stepName: 'Ground Displacement Spike' }));
    } else if (scenario === 'combined_risk') {
      setZones(prev => prev.map(z => ({
        ...z,
        rainfall24h: +(z.rainfall24h * 1.5).toFixed(1),
        soilMoisture: 95.5,
        groundMovement: 8.2,
        riskScore: Math.min(99, z.riskScore + 16),
        riskLevel: 'HIGH'
      })));
      setWhatChanged({
        hasChange: true,
        scoreDelta: 16,
        rainfallDeltaPct: 50,
        moistureDeltaPct: 35,
        movementDeltaPct: 65,
        previousScore: 83,
        currentScore: 99,
        summary: 'Combined cloudburst and seismic micro-tremor event triggered extreme hazard state across NER.',
        timestamp: 'Just now'
      });
      setSimulationProgress(prev => ({ ...prev, isRunning: false, stepName: 'Combined Risk Event Triggered' }));
    }
  };

  const historicalPlayback: HistoricalPlaybackState = {
    isPlaying: isHistoryPlaying,
    currentIndex: historyIndex,
    dates: HISTORICAL_DATES,
    setIndex: (idx: number) => {
      setHistoryIndex(idx);
      applyHistoricalIndex(idx);
    },
    togglePlay: () => setIsHistoryPlaying(prev => !prev)
  };

  const riskForecast: RiskForecastItem[] = useMemo(() => {
    const baseScore = selectedZone ? selectedZone.riskScore : 88;
    const baseRain = selectedZone ? selectedZone.rainfall24h : 184.6;
    const baseMoist = selectedZone ? selectedZone.soilMoisture : 89.4;
    const baseMove = selectedZone ? selectedZone.groundMovement : 4.8;

    return [
      {
        offset: '+6H',
        time: '18:00 IST Today',
        projectedRiskScore: Math.min(100, Math.round(baseScore * 1.05)),
        projectedRainfallMm: Math.round(baseRain + 42),
        projectedSoilMoisturePct: Math.min(99, +(baseMoist + 4.2).toFixed(1)),
        projectedGroundMovementMm: +(baseMove + 1.8).toFixed(1),
        uncertainty: 'Low',
        modelConfidence: 92
      },
      {
        offset: '+12H',
        time: '00:00 IST Midnight',
        projectedRiskScore: Math.min(100, Math.round(baseScore * 1.1)),
        projectedRainfallMm: Math.round(baseRain + 78),
        projectedSoilMoisturePct: Math.min(100, +(baseMoist + 7.5).toFixed(1)),
        projectedGroundMovementMm: +(baseMove + 3.2).toFixed(1),
        uncertainty: 'Moderate',
        modelConfidence: 86
      },
      {
        offset: '+24H',
        time: '12:00 IST Tomorrow',
        projectedRiskScore: Math.min(100, Math.round(baseScore * 0.95)),
        projectedRainfallMm: Math.round(baseRain + 110),
        projectedSoilMoisturePct: Math.min(98, +(baseMoist + 5.0).toFixed(1)),
        projectedGroundMovementMm: +(baseMove + 4.1).toFixed(1),
        uncertainty: 'Moderate',
        modelConfidence: 79
      }
    ];
  }, [selectedZone]);

  const guidedDemo: GuidedDemoState = {
    isOpen: guidedDemoOpen,
    step: guidedDemoStep,
    start: () => {
      setGuidedDemoStep(1);
      setGuidedDemoOpen(true);
    },
    next: () => setGuidedDemoStep(prev => Math.min(10, prev + 1)),
    prev: () => setGuidedDemoStep(prev => Math.max(1, prev - 1)),
    close: () => setGuidedDemoOpen(false),
    goToStep: (s: number) => setGuidedDemoStep(s)
  };

  return (
    <DisasterContext.Provider
      value={{
        zones,
        alerts,
        infrastructure,
        notifications,
        selectedZone,
        selectedZoneId,
        selectedAlert,
        selectedState,
        selectedDistrict,
        currentRole,
        systemSettings,
        emergencyMode,
        auditLog,
        riskForecast,
        timelineEvents,
        connectionStatus,
        lastUpdateTimestamp,
        investigationStep,
        investigationWorkflowOpen,
        currentScenario,
        simulationProgress,
        whatChanged,
        historicalPlayback,
        guidedDemo,
        demoMode,
        demoIntroVisible,
        setDemoMode,
        setDemoIntroVisible,
        enterDemo,
        regionalRiskStatus,
        riskTrend,
        criticalAlertCount,
        activeAlertCount,
        highRiskZoneCount,
        mediumRiskZoneCount,
        lowRiskZoneCount,
        exposedInfrastructureCount,
        setSelectedZoneId: handleSetSelectedZoneId,
        setSelectedAlert,
        setSelectedState,
        setSelectedDistrict,
        setCurrentRole,
        setSystemSettings,
        setEmergencyMode,
        setInvestigationStep,
        setInvestigationWorkflowOpen,
        startInvestigation,
        runScenario,
        updateAlertStatus,
        escalateAlert,
        acknowledgeAlert,
        resolveAlert,
        reopenAlert,
        addAuditLog,
        dispatchMachinery,
        addNotification,
        markAllNotificationsRead,
        resetToBaseline
      }}
    >
      {children}
    </DisasterContext.Provider>
  );
};

export const useDisaster = () => {
  const context = useContext(DisasterContext);
  if (!context) {
    throw new Error('useDisaster must be used within a DisasterProvider');
  }
  return context;
};
