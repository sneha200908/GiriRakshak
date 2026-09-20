import { LocationZone, EarlyWarningAlert, MapEventItem, AlertSource, AlertCategory, MapMode, MapRefreshInterval, AIControlledAction } from '../types';

export interface MapLayerConfig {
  // Risk
  currentRisk: boolean;
  riskHeatmap: boolean;
  riskZones: boolean;
  susceptibility: boolean;

  // Alerts
  criticalAlerts: boolean;
  warningAlerts: boolean;
  watchAlerts: boolean;
  resolvedAlerts: boolean;

  // Weather
  rainfallOverlay: boolean;
  rainfallOpacity: number; // 0 to 1
  rainfallIntensity: boolean;
  rainfallAnomaly: boolean;

  // Terrain
  elevationContours: boolean;
  slopeDEM: boolean;
  aspect: boolean;

  // Landslides
  historicalLandslides: boolean;
  recentLandslides: boolean;
  bhuvanEarlyWarning: boolean;

  // Environment
  soilMoisture: boolean;
  landCover: boolean;

  // Infrastructure
  highways: boolean;
  bridges: boolean;
  railways: boolean;
}

export const DEFAULT_MAP_LAYERS: MapLayerConfig = {
  currentRisk: true,
  riskHeatmap: false,
  riskZones: true,
  susceptibility: false,

  criticalAlerts: true,
  warningAlerts: true,
  watchAlerts: true,
  resolvedAlerts: false,

  rainfallOverlay: true,
  rainfallOpacity: 0.75,
  rainfallIntensity: true,
  rainfallAnomaly: false,

  elevationContours: true,
  slopeDEM: false,
  aspect: false,

  historicalLandslides: true,
  recentLandslides: true,
  bhuvanEarlyWarning: true,

  soilMoisture: false,
  landCover: false,

  highways: true,
  bridges: true,
  railways: true,
};

export interface LayerSourceMeta {
  title: string;
  source: string;
  cadence: string;
  lastUpdated: string;
  status: 'LIVE' | 'NEAR-REAL-TIME' | 'STATIC' | 'HISTORICAL' | 'MODEL';
}

export const LAYER_ATTRIBUTION: Record<string, LayerSourceMeta> = {
  currentRisk: {
    title: 'GiriRakshak Landslide Hazard Index',
    source: 'GiriRakshak Geotechnical Risk Engine',
    cadence: '15 min cycle',
    lastUpdated: '12:42 PM',
    status: 'MODEL'
  },
  rainfallOverlay: {
    title: 'IMD AWS & Doppler Radar Isohyets',
    source: 'India Meteorological Department (IMD)',
    cadence: '15-min / Hourly Telemetry',
    lastUpdated: '12:40 PM',
    status: 'LIVE'
  },
  slopeDEM: {
    title: 'NASA SRTM 30m Digital Elevation Model',
    source: 'NASA Earthdata / USGS',
    cadence: 'Permanent Topographic Reference',
    lastUpdated: '2024 Base Edition',
    status: 'STATIC'
  },
  historicalLandslides: {
    title: 'National Landslide Susceptibility Inventory',
    source: 'Geological Survey of India (GSI Bharat Atlas)',
    cadence: 'Annual Verified Registry (2019-2026)',
    lastUpdated: '2026-06-15',
    status: 'HISTORICAL'
  },
  bhuvanEarlyWarning: {
    title: 'Bhuvan Disaster Early Warning & Hazard',
    source: 'ISRO / National Remote Sensing Centre (NRSC)',
    cadence: 'Daily / 3-Day Seasonal Outlook',
    lastUpdated: 'Today, 06:00 IST',
    status: 'NEAR-REAL-TIME'
  },
  soilMoisture: {
    title: 'SMAP L4 Subsurface Moisture & MOSDAC',
    source: 'NASA SMAP / ISRO MOSDAC',
    cadence: '3-Hourly Geophysical Model',
    lastUpdated: 'Today, 09:30 IST',
    status: 'NEAR-REAL-TIME'
  },
  highways: {
    title: 'Critical NER Highway Corridors',
    source: 'NHAI / BRO / Ministry of MoRTH',
    cadence: 'Quarterly Infrastructure Asset Audit',
    lastUpdated: '2026 Q2',
    status: 'STATIC'
  }
};

export interface MapCluster {
  id: string;
  count: number;
  centerLat: number;
  centerLng: number;
  x: number;
  y: number;
  highestSeverity: 'CRITICAL' | 'WARNING' | 'WATCH' | 'NORMAL';
  alertIds: string[];
  zoneIds: string[];
  district: string;
}

export const INITIAL_MAP_EVENTS: MapEventItem[] = [
  {
    id: 'EVT-001',
    timestamp: '12:42:10 IST',
    title: 'Critical Alert Escalated: Sohra Escarpment',
    location: 'Sohra-Shella Escarpment',
    district: 'East Khasi Hills',
    state: 'Meghalaya',
    severity: 'CRITICAL',
    source: 'GiriRakshak Risk Model',
    category: 'MODEL',
    description: 'Pore saturation reached 89.4% with IMD rainfall exceeding 184.6mm/24h. Factor of Safety dropped to 0.88.',
    metricDelta: '+12 Risk Pts (76 → 88)',
    zoneId: 'ZONE-NER-01'
  },
  {
    id: 'EVT-002',
    timestamp: '12:38:45 IST',
    title: 'IMD AWS Telemetry Ingested: Haflong Station',
    location: 'Haflong Hill Cut Section',
    district: 'Dima Hasao',
    state: 'Assam',
    severity: 'WARNING',
    source: 'IMD',
    category: 'OFFICIAL',
    description: 'IMD Station 42410 registered 32mm in past 60 mins. Cumulative 7-day isohyet crossed 360mm threshold.',
    metricDelta: '+32.4 mm/hr',
    zoneId: 'ZONE-NER-02'
  },
  {
    id: 'EVT-003',
    timestamp: '12:31:20 IST',
    title: 'ISRO Bhuvan Early Warning Bulletin Ingested',
    location: 'Chungthang-Mangan Ridge Corridor',
    district: 'Mangan',
    state: 'Sikkim',
    severity: 'WARNING',
    source: 'Bhuvan/NRSC',
    category: 'OFFICIAL',
    description: 'High debris flow susceptibility warning issued for Teesta basin upstream slopes due to lake level rise.',
    metricDelta: 'Hazard Index 4/5',
    zoneId: 'ZONE-NER-11'
  },
  {
    id: 'EVT-004',
    timestamp: '12:25:05 IST',
    title: 'InSAR Displacement Velocity Warning',
    location: 'Bawngkawn-Chaltlang Ridge',
    district: 'Aizawl',
    state: 'Mizoram',
    severity: 'CRITICAL',
    source: 'GiriRakshak Risk Model',
    category: 'MODEL',
    description: 'Sentinel-1 InSAR differential analysis detected 5.2 mm/day downslope ground movement along urban road benches.',
    metricDelta: '+1.4 mm/day accel.',
    zoneId: 'ZONE-NER-06'
  },
  {
    id: 'EVT-005',
    timestamp: '12:15:30 IST',
    title: 'GSI Field Geomorphology Audit Completed',
    location: 'Lumding-Badarpur Hill Section',
    district: 'Dima Hasao',
    state: 'Assam',
    severity: 'WATCH',
    source: 'GSI',
    category: 'OFFICIAL',
    description: 'GSI North East regional team verified cut slope toe condition. Drainage weep-holes partially silted.',
    zoneId: 'ZONE-NER-02'
  },
  {
    id: 'EVT-006',
    timestamp: '12:02:18 IST',
    title: 'SMAP Soil Moisture Refresh: Subsurface Saturation Surge',
    location: 'Khonsa-Deomali Hills',
    district: 'Tirap',
    state: 'Arunachal Pradesh',
    severity: 'WARNING',
    source: 'GiriRakshak Risk Model',
    category: 'MODEL',
    description: 'NASA SMAP L4 soil moisture assimilation indicates root-zone saturation elevated to 82.3%.',
    metricDelta: '+14% 24h delta',
    zoneId: 'ZONE-NER-04'
  }
];

// Helper to cluster alerts within pixel/coordinate tolerance
export function clusterAlerts(
  alerts: EarlyWarningAlert[], 
  zones: LocationZone[], 
  pixelDistanceThreshold: number = 40
): { clusters: MapCluster[]; singleAlerts: EarlyWarningAlert[] } {
  const zoneMap = new Map(zones.map(z => [z.id, z]));
  const placed: boolean[] = new Array(alerts.length).fill(false);
  const clusters: MapCluster[] = [];
  const singleAlerts: EarlyWarningAlert[] = [];

  for (let i = 0; i < alerts.length; i++) {
    if (placed[i]) continue;
    const a1 = alerts[i];
    const z1 = zoneMap.get(a1.zoneId);
    if (!z1) {
      singleAlerts.push(a1);
      placed[i] = true;
      continue;
    }

    const clusterGroup: EarlyWarningAlert[] = [a1];
    placed[i] = true;

    for (let j = i + 1; j < alerts.length; j++) {
      if (placed[j]) continue;
      const a2 = alerts[j];
      const z2 = zoneMap.get(a2.zoneId);
      if (!z2) continue;

      const dx = (z1.coordinates.x - z2.coordinates.x) * 10;
      const dy = (z1.coordinates.y - z2.coordinates.y) * 7;
      const dist = Math.sqrt(dx * dx + dy * dy);

      if (dist < pixelDistanceThreshold) {
        clusterGroup.push(a2);
        placed[j] = true;
      }
    }

    if (clusterGroup.length > 1) {
      const avgX = clusterGroup.reduce((acc, curr) => {
        const z = zoneMap.get(curr.zoneId);
        return acc + (z ? z.coordinates.x : 50);
      }, 0) / clusterGroup.length;

      const avgY = clusterGroup.reduce((acc, curr) => {
        const z = zoneMap.get(curr.zoneId);
        return acc + (z ? z.coordinates.y : 50);
      }, 0) / clusterGroup.length;

      const hasCritical = clusterGroup.some(a => a.alertState === 'Critical' || a.riskLevel === 'HIGH');
      const hasWarning = clusterGroup.some(a => a.alertState === 'Warning' || a.riskLevel === 'MEDIUM');

      clusters.push({
        id: `cluster-${i}`,
        count: clusterGroup.length,
        centerLat: z1.coordinates.lat,
        centerLng: z1.coordinates.lng,
        x: avgX,
        y: avgY,
        highestSeverity: hasCritical ? 'CRITICAL' : hasWarning ? 'WARNING' : 'WATCH',
        alertIds: clusterGroup.map(a => a.id),
        zoneIds: clusterGroup.map(a => a.zoneId),
        district: z1.district
      });
    } else {
      singleAlerts.push(a1);
    }
  }

  return { clusters, singleAlerts };
}
