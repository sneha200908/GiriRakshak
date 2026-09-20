import { RiskLevel } from './index';

export type DataQualityBadgeType = 
  | 'OBSERVED' 
  | 'HISTORICAL' 
  | 'MODEL OUTPUT' 
  | 'AI INTERPRETATION' 
  | 'SIMULATED' 
  | 'RESEARCH REFERENCE' 
  | 'DERIVED';

export type DataSourceStatus = 
  | 'Connected' 
  | 'Source Reference' 
  | 'Dataset Connector' 
  | 'Methodology Reference' 
  | 'Configured' 
  | 'Not Configured';

export interface DataSourceRegistryItem {
  id: string;
  source: string;
  datasetName: string;
  organization: string;
  category: 'Meteorological' | 'Landslide Inventory' | 'Terrain & DEM' | 'Geospatial & LULC' | 'Soil Moisture' | 'Research & Methodology';
  yearsAvailable: string;
  spatialResolution: string;
  temporalResolution: string;
  status: DataSourceStatus;
  license: string;
  officialUrl: string;
  downloadFormats?: ('Parquet' | 'GeoJSON' | 'KML' | 'Shapefile' | 'CSV' | 'TIFF' | 'API')[];
  description: string;
  provenance: string;
  lastVerified: string;
  usageRole: 'Live Monitoring' | 'Historical Analysis' | 'Model Training' | 'Methodology Only' | 'Terrain Derivation';
}

export interface IMDRainfallRecord {
  source: 'IMD';
  location: string;
  district: string;
  state: string;
  latitude: number;
  longitude: number;
  date: string; // YYYY-MM-DD or Month/Year
  year: number;
  rainfall_mm: number;
  normal_rainfall_mm: number;
  departure_pct: number; // rainfall anomaly
  period: 'daily' | 'weekly' | 'monthly' | 'seasonal' | 'annual';
  station_or_grid: string;
  data_status: 'observed';
  retrieved_at: string;
  isExtremeEvent?: boolean;
}

export interface GSILandslideEvent {
  id: string;
  eventId: string;
  latitude: number;
  longitude: number;
  location: string;
  state: string;
  district: string;
  date: string;
  year: number;
  landslideType: 'Debris Flow' | 'Rockfall' | 'Rotational Slide' | 'Planar Slip' | 'Slump' | 'Soil Creep' | 'Complex';
  triggerMechanism: string;
  volumeM3?: number;
  areaM2?: number;
  geometryType: 'Point' | 'Polygon';
  source: 'Geological Survey of India (GSI) via Bharat Atlas';
  datasetUrl: string;
  fatalities: number;
  displaced: number;
  affectedInfrastructure: string;
  associatedRainfallMm?: number;
  soilSaturationAtEvent?: number;
  slopeDegrees?: number;
  elevationM?: number;
  metadata: {
    gsiReportId?: string;
    verifiedByField: boolean;
    confidenceGrade: 'A' | 'B' | 'C';
  };
}

export interface NASADEMProfile {
  source: 'NASA Earthdata SRTM / NASADEM 30m';
  zoneId: string;
  zoneName: string;
  latitude: number;
  longitude: number;
  elevationM: number;
  slopeDegrees: number;
  aspectDegrees: number;
  aspectCardinal: 'N' | 'NE' | 'E' | 'SE' | 'S' | 'SW' | 'W' | 'NW';
  curvature: 'Concave' | 'Convex' | 'Planar';
  reliefM: number;
  drainageDensityKmPerKm2: number;
  dataStatus: 'derived';
  resolution: '30m (1 arc-second)';
  lastProcessed: string;
}

export interface SoilMoistureRecord {
  source: 'NASA SMAP / ISRO MOSDAC Satellite Observation';
  location: string;
  district: string;
  state: string;
  latitude: number;
  longitude: number;
  date: string;
  year: number;
  volumetricMoistureM3PerM3: number; // e.g. 0.38 m³/m³
  saturationPct: number; // 0-100%
  depthCm: string; // e.g. '0-5 cm surface, 5-40 cm rootzone'
  anomalyPct: number;
  dataStatus: 'observed';
  spatialResolution: '9 km / 36 km';
  temporalResolution: 'Daily (2-3 day revisit)';
  retrievalTimestamp: string;
  qualityFlag: 'Optimal' | 'Degraded' | 'Cloud Obscured';
}

export interface ResearchFrameworkReference {
  id: string;
  title: string;
  authors: string;
  journal: string;
  year: number;
  volumeArticle?: string;
  doiUrl: string;
  roleInGiriRakshak: string;
  keyPredictors: {
    category: 'Topographic' | 'Geological' | 'Hydrological' | 'Land-Cover' | 'Seismic' | 'IoT Methodology';
    factors: string[];
    description: string;
  }[];
  criticalDistinction: string;
}

export interface ModelEvidenceBundle {
  zoneId: string;
  zoneName: string;
  modelVersion: string;
  timestamp: string;
  computedScore: number;
  riskLevel: RiskLevel;
  evidence: {
    source: string;
    factorName: string;
    value: string | number;
    units: string;
    badge: DataQualityBadgeType;
    status: 'observed' | 'derived' | 'modelled';
    weightInModelPct: number;
  }[];
  researchBasis: string;
  limitations: string[];
  aiAttribution: {
    observedFacts: string[];
    derivedMetrics: string[];
    modelInferences: string[];
    aiGuidance: string;
  };
}
