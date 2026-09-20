export type RiskLevel = 'HIGH' | 'MEDIUM' | 'LOW';
export type AlertState = 'Critical' | 'Warning' | 'Watch' | 'Monitoring';
export type AlertStatus = 'Active' | 'Under Review' | 'Validated' | 'Dispatched' | 'Acknowledged' | 'Monitoring' | 'Watch' | 'Resolved';

export type AlertSource = 
  | 'IMD' 
  | 'GSI' 
  | 'Bhuvan/NRSC' 
  | 'GiriRakshak Risk Model' 
  | 'Simulated Scenario';

export type AlertCategory = 
  | 'OFFICIAL' 
  | 'MODEL' 
  | 'SIMULATION';

export type MapMode = 'LIVE' | 'HISTORICAL' | 'SIMULATION';
export type MapRefreshInterval = '30s' | '1m' | '5m' | 'manual';

export interface MapEventItem {
  id: string;
  timestamp: string;
  title: string;
  location: string;
  district: string;
  state: string;
  severity: 'CRITICAL' | 'WARNING' | 'WATCH' | 'INFO' | 'NORMAL';
  source: AlertSource;
  category: AlertCategory;
  description: string;
  metricDelta?: string;
  zoneId?: string;
}

export interface AIControlledAction {
  type: 
    | 'FOCUS_LOCATION' 
    | 'FILTER_ALERTS' 
    | 'FILTER_RISK_LEVEL' 
    | 'SHOW_LAYER' 
    | 'HIDE_LAYER' 
    | 'COMPARE_LOCATIONS' 
    | 'RUN_SIMULATION' 
    | 'OPEN_REPORT';
  payload: any;
  explanation: string;
}

export interface LocationZone {
  id: string;
  name: string;
  district: string;
  state: 'Assam' | 'Meghalaya' | 'Mizoram' | 'Sikkim' | 'Arunachal Pradesh' | 'Nagaland' | 'Manipur' | 'Tripura';
  coordinates: { lat: number; lng: number; x: number; y: number }; // x,y for relative SVG map (0-100)
  riskLevel: RiskLevel;
  riskScore: number; // 0 - 100
  rainfall24h: number; // mm
  rainfall7d: number; // mm cumulative
  soilMoisture: number; // %
  slopeAngle: number; // degrees
  elevation: number; // meters MSL
  groundMovement: number; // mm/day
  vegetationIndex: number; // NDVI 0-1
  geology: string;
  infrastructureNearby: string[];
  lastUpdated: string;
  aiPrediction: string;
  aiConfidence: number; // %
  primaryRiskFactors: string[];
  recommendedAction: string;
  historyCount: number;
}

export interface EarlyWarningAlert {
  id: string;
  zoneId: string;
  location: string;
  district: string;
  state: string;
  riskLevel: RiskLevel;
  alertState: AlertState;
  riskScore: number;
  timestamp: string;
  trigger: string;
  aiConfidence: number;
  status: AlertStatus;
  source?: AlertSource;
  category?: AlertCategory;
  coordinates?: { lat: number; lng: number; x: number; y: number };
  deduplicationKey?: string;
  historyTimeline?: {
    timestamp: string;
    note: string;
    status: AlertStatus;
    riskScore?: number;
  }[];
  environmentalTriggers: {
    rainfallRate: string;
    soilSaturation: string;
    slopeDisplacement: string;
    shearStressRatio: string;
  };
  recommendedActions: string[];
  multilingualAlert: {
    en: string;
    as: string; // Assamese
    hi: string; // Hindi
  };
  disseminationChannels: ('SMS' | 'IVR' | 'Mobile App' | 'Siren' | 'CAP-India')[];
  affectedPopulationEst: number;
  criticalInfrastructure: string[];
  aiReasoning?: string;
}

export interface InfrastructureItem {
  id: string;
  name: string;
  category: 'Road' | 'Bridge' | 'Building' | 'Rail' | 'Critical Facility';
  state: string;
  district: string;
  nearestRiskZone: string;
  distanceFromRiskZoneKm: number;
  riskLevel: RiskLevel;
  vulnerabilityScore: number; // 0-100
  inspectionStatus: 'Pending Inspection' | 'Inspected - Safe' | 'Requires Mitigation' | 'Immediate Hazard';
  lastInspectionDate: string;
  recommendedAction: string;
  dailyTrafficOrCapacity: string;
}

export interface SensorTelemetry {
  timestamp: string;
  rainfall: number;
  soilMoisture: number;
  groundMovement: number;
  slopeFactorOfSafety: number;
  temperature: number;
}

export interface HistoricalLandslide {
  id: string;
  location: string;
  district: string;
  state: string;
  date: string;
  severity: 'Severe' | 'Moderate' | 'High';
  rainfallTriggerMm: number;
  fatalities: number;
  displaced: number;
  affectedInfrastructure: string;
  geologicalTrigger: string;
  mitigationTaken: string;
}

export type StakeholderRole = 
  | 'District Administration' 
  | 'SDMA / NDMA' 
  | 'PWD / Infrastructure' 
  | 'Emergency Responders' 
  | 'Policy Makers'
  | 'Citizen & Community';

export type NavigationTab = 
  | 'landing'
  | 'situation-room'
  | 'dashboard'
  | 'map'
  | 'data-intelligence'
  | 'warnings'
  | 'scenario'
  | 'monitoring'
  | 'assessment'
  | 'infrastructure'
  | 'district'
  | 'analytics'
  | 'historical'
  | 'reports'
  | 'stakeholder'
  | 'model-performance'
  | 'assistant'
  | 'notifications'
  | 'settings';

export interface AuditLogEvent {
  id: string;
  timestamp: string;
  action: string;
  category: 'ALERT' | 'SCENARIO' | 'REPORT' | 'SYSTEM' | 'AI';
  details: string;
  user: string;
}

export interface RiskForecastItem {
  offset: '+6H' | '+12H' | '+24H';
  time: string;
  projectedRiskScore: number;
  projectedRainfallMm: number;
  projectedSoilMoisturePct: number;
  projectedGroundMovementMm: number;
  uncertainty: 'Low' | 'Moderate' | 'High';
  modelConfidence: number; // %
}

export interface TimelineEventItem {
  id: string;
  timestamp: string;
  timeDisplay: string;
  title: string;
  description: string;
  category: 'Weather' | 'Risk' | 'Landslide' | 'Sensor' | 'Infrastructure' | 'Alert' | 'AI analysis';
  severity: 'CRITICAL' | 'WARNING' | 'WATCH' | 'INFO';
  location: string;
  source: string;
  delta?: string;
}

export interface SelectedAlertContext {
  alertId: string;
  location: string;
  district: string;
  state: string;
  coordinates: { lat: number; lng: number };
  riskScore: number;
  riskLevel: RiskLevel;
  riskDelta: number;
  rainfall24h: number;
  rainfall7d: number;
  soilMoisture: number;
  groundMovement: number;
  slopeAngle: number;
  elevation: number;
  historicalLandslideCount: number;
  infrastructureCount: number;
  criticalInfrastructure: string[];
  dataSources: string[];
  timestamp: string;
  dataQuality: 'High' | 'Moderate' | 'Degraded';
  isSimulation: boolean;
}

export type ScenarioType = 
  | 'none'
  | 'heavy_rainfall'
  | 'rising_moisture'
  | 'ground_movement'
  | 'combined_risk'
  | 'recovery'
  | 'reset';

export interface WhatChangedData {
  hasChange: boolean;
  scoreDelta: number;
  rainfallDeltaPct: number;
  moistureDeltaPct: number;
  movementDeltaPct: number;
  previousScore: number;
  currentScore: number;
  summary: string;
  timestamp: string;
}

export interface SystemSettings {
  thresholds: {
    lowMax: number;
    mediumMax: number;
    highMin: number;
  };
  alertSensitivity: 'Conservative' | 'Balanced' | 'Aggressive';
  notifications: {
    smsEnabled: boolean;
    ivrEnabled: boolean;
    pushEnabled: boolean;
    sirenEnabled: boolean;
  };
  dataSources: {
    imdRainfall: boolean;
    satelliteMoisture: boolean;
    groundSensors: boolean;
    seismicData: boolean;
  };
}

export interface NotificationItem {
  id: string;
  title: string;
  message: string;
  timestamp: string;
  type: 'critical' | 'warning' | 'info' | 'success';
  read: boolean;
  linkTo?: string;
}
