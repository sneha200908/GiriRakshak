import { LocationZone, EarlyWarningAlert } from '../../types';

export interface DailyBulletinData {
  reportType: 'daily';
  refNumber: string;
  generatedDate: string;
  reportingPeriod: string;
  region: string;
  executiveSummary: string;
  operationalStatus: string;
  activeWarningCount: number;
  criticalWarningCount: number;
  rainfallOverview: {
    zoneName: string;
    district: string;
    state: string;
    rain24h: number;
    rainRate: string;
    trend: 'Rising' | 'Steady' | 'Receding';
    station: string;
  }[];
  riskTable: {
    zoneId: string;
    zoneName: string;
    district: string;
    state: string;
    riskLevel: string;
    riskScore: number;
    rain24h: number;
    soilSaturation: number;
    groundMovement: number;
    primaryVulnerability: string;
    status: string;
  }[];
  activeWarnings: EarlyWarningAlert[];
  keyChangesLast24h: string[];
  monitoringPriorities: string[];
  dataSources: {
    source: string;
    type: string;
    lastPing: string;
    status: string;
  }[];
}

export interface WeeklyAssessmentData {
  reportType: 'weekly';
  refNumber: string;
  generatedDate: string;
  reportingPeriod: string;
  region: string;
  executiveSummary: string;
  weeklyTrend: {
    day: string;
    date: string;
    avgRiskScore: number;
    maxRain24h: number;
    activeWarnings: number;
    criticalWarnings: number;
    roadIncidents: number;
  }[];
  stateRainfallDistribution: {
    state: string;
    rain7d: number;
    historicalMean: number;
    anomalyPercent: string;
    saturationLevel: string;
  }[];
  topRiskCorridors: {
    name: string;
    corridorLength: string;
    vulnerabilityIndex: number;
    primaryFailureMechanism: string;
    exposureLevel: 'Critical' | 'High' | 'Moderate';
    infrastructureImpact: string;
  }[];
  historicalComparison: {
    metric: string;
    currentWeek: string;
    comparativeMonsoon2022: string;
    historicalBaseline: string;
    interpretation: string;
  }[];
  weeklyInfrastructureImpact: {
    sector: string;
    disruptions: string;
    mitigationAction: string;
    operationalStatus: string;
  }[];
  warningLifecycle: {
    category: string;
    count: number;
    details: string;
  }[];
  nextWeekOutlook: string[];
}

export interface EmergencyBriefingData {
  reportType: 'emergency';
  refNumber: string;
  generatedDate: string;
  briefingTime: string;
  operationalLevel: string;
  situationSummary: string;
  criticalIncidents: {
    alert: EarlyWarningAlert;
    zone?: LocationZone;
    responseStatus: 'Active Response' | 'Monitoring & Patrol' | 'Traffic Regulated' | 'Acknowledged';
    fieldCommand: string;
    evacuationStatus: string;
  }[];
  infrastructureImpactMatrix: {
    assetName: string;
    type: 'Highway' | 'Rail Link' | 'Bridge' | 'Facility';
    status: 'Traffic Restricted' | 'Speed Reduced' | 'Reinforced / Standby' | 'Patrol Deployed';
    impactDetails: string;
    agencyLead: string;
  }[];
  sensorDiagnostics: {
    location: string;
    porePressure: string;
    velocityAccel: string;
    factorOfSafety: string;
    triggerStatus: string;
  }[];
  agencyMobilization: {
    agency: string;
    resources: string;
    location: string;
    status: string;
  }[];
  dataGapsAndLimitations: string[];
  communicationLog: {
    channel: string;
    recipientCount: string;
    timestamp: string;
    status: string;
  }[];
}

export function generateDailyBulletin(zones: LocationZone[], alerts: EarlyWarningAlert[]): DailyBulletinData {
  const today = new Date();
  const dateStr = today.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
  const refNum = `GR-NER-DLB-${today.getFullYear()}${(today.getMonth() + 1).toString().padStart(2, '0')}${today.getDate().toString().padStart(2, '0')}-01`;
  
  const activeAlerts = alerts.filter(a => a.status !== 'Resolved');
  const criticalAlerts = activeAlerts.filter(a => a.alertState === 'Critical');

  const rainfallOverview = zones.slice(0, 6).map(z => ({
    zoneName: z.name,
    district: z.district,
    state: z.state,
    rain24h: z.rainfall24h,
    rainRate: z.rainfall24h > 100 ? '28.4 mm/hr (Heavy)' : z.rainfall24h > 50 ? '14.2 mm/hr (Moderate)' : '5.8 mm/hr (Light)',
    trend: z.rainfall24h > 100 ? 'Rising' as const : z.rainfall24h > 60 ? 'Steady' as const : 'Receding' as const,
    station: `IMD AWS #${z.district.slice(0, 3).toUpperCase()}-402`
  }));

  const riskTable = zones.map(z => ({
    zoneId: z.id,
    zoneName: z.name,
    district: z.district,
    state: z.state,
    riskLevel: z.riskLevel,
    riskScore: z.riskScore,
    rain24h: z.rainfall24h,
    soilSaturation: z.soilMoisture,
    groundMovement: z.groundMovement,
    primaryVulnerability: z.infrastructureNearby[0] || 'Hill Habitations',
    status: z.riskScore >= 80 ? 'Active Alert' : z.riskScore >= 65 ? 'Elevated Watch' : 'Normal Vigilance'
  }));

  return {
    reportType: 'daily',
    refNumber: refNum,
    generatedDate: `${dateStr}, 08:30 IST`,
    reportingPeriod: '24-Hour Operational Cycle (06:00 IST to 06:00 IST Next Day)',
    region: 'North Eastern Region (NER — 8 Himalayan & Sub-Himalayan States)',
    operationalStatus: criticalAlerts.length > 0 ? 'ALERT ELEVATED — CRITICAL WARNING ACTIVE' : 'ELEVATED MONITORING',
    activeWarningCount: activeAlerts.length,
    criticalWarningCount: criticalAlerts.length,
    executiveSummary: `Persistent orographic rainfall across Meghalaya, southern Assam (Dima Hasao), and Sikkim has elevated soil pore pressure across multiple steep slopes. A total of ${activeAlerts.length} distinct early warning locations are actively tracked, with ${criticalAlerts.length} classified as Critical. Micro-displacement sensors along State Highway 5 and Lumding-Badarpur rail sections indicate active slope creep. Field mitigation teams are deployed.`,
    rainfallOverview,
    riskTable,
    activeWarnings: activeAlerts,
    keyChangesLast24h: [
      'Precipitation intensity spiked to 28.4 mm/hr over Sohra-Shella escarpment, surpassing the 75mm IMD convective red threshold.',
      'Surface displacement velocity at Haflong rail cutting accelerated from 2.8 to 3.9 mm/day under sustained moisture surcharge.',
      'NH-10 Gangtok-Ranipool sector experienced minor rockfalls; BRO Project Swastik deployed single-lane convoy control.',
      'Tawang Sela Pass approach cleared of debris spillover; downgraded to Resolved status with continuous passive logging.'
    ],
    monitoringPriorities: [
      'Maintain continuous pore pressure telemetry on SH-5 (Wahkaba section) and NH-27.',
      'Monitor Lumding-Badarpur hill railway alignment for ballast displacement during nighttime freight windows.',
      'Validate satellite InSAR differential interferometry pass scheduled at 14:15 IST.',
      'Coordinate with District Disaster Management Authorities (DDMAs) in East Khasi Hills and Dima Hasao for precautionary shelter readiness.'
    ],
    dataSources: [
      { source: 'IMD Automated Weather Stations (AWS)', type: 'Ground Telemetry', lastPing: '6 mins ago', status: 'Optimal' },
      { source: 'NASA GPM & SMAP Soil Moisture', type: 'Satellite Remote Sensing', lastPing: '42 mins ago', status: 'Optimal' },
      { source: 'Copernicus Sentinel-1 InSAR', type: 'SAR Interferometry', lastPing: '2.5 hours ago', status: 'Verified' },
      { source: 'Geological Survey of India (GSI) NLSM', type: 'Geological Atlas', lastPing: 'Static Baseline', status: 'Authoritative' }
    ]
  };
}

export function generateWeeklyAssessment(zones: LocationZone[], alerts: EarlyWarningAlert[]): WeeklyAssessmentData {
  const today = new Date();
  const dateStr = today.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
  const weekNum = Math.ceil(today.getDate() / 7);
  const refNum = `GR-NER-WTA-${today.getFullYear()}-WK${weekNum.toString().padStart(2, '0')}`;

  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
  const weeklyTrend = days.map((day, idx) => ({
    day,
    date: `${idx + 13} Sep`,
    avgRiskScore: [58, 62, 69, 78, 84, 81, 77][idx],
    maxRain24h: [42, 68, 110, 165, 184, 142, 98][idx],
    activeWarnings: [1, 2, 3, 4, 4, 4, 4][idx],
    criticalWarnings: [0, 1, 1, 2, 2, 2, 1][idx],
    roadIncidents: [0, 1, 2, 3, 2, 1, 1][idx]
  }));

  const stateRainfallDistribution = [
    { state: 'Meghalaya', rain7d: 412.0, historicalMean: 280.0, anomalyPercent: '+47%', saturationLevel: 'Critical (89.4%)' },
    { state: 'Assam', rain7d: 360.5, historicalMean: 240.0, anomalyPercent: '+50%', saturationLevel: 'High (86.1%)' },
    { state: 'Sikkim', rain7d: 245.2, historicalMean: 195.0, anomalyPercent: '+25%', saturationLevel: 'High (82.5%)' },
    { state: 'Nagaland', rain7d: 185.0, historicalMean: 160.0, anomalyPercent: '+15%', saturationLevel: 'Moderate (78.9%)' },
    { state: 'Mizoram', rain7d: 290.4, historicalMean: 210.0, anomalyPercent: '+38%', saturationLevel: 'High (84.8%)' },
    { state: 'Arunachal Pradesh', rain7d: 160.8, historicalMean: 180.0, anomalyPercent: '-11%', saturationLevel: 'Moderate (64.2%)' }
  ];

  const topRiskCorridors = [
    {
      name: 'Sohra-Shella Escarpment Corridor (SH-5)',
      corridorLength: '24.5 km',
      vulnerabilityIndex: 92,
      primaryFailureMechanism: 'Debris slide over sandstone/limestone unconformity',
      exposureLevel: 'Critical' as const,
      infrastructureImpact: 'Inter-district lifeline highway, 3 villages in runout fan'
    },
    {
      name: 'Haflong-Jatinga Cut Section (Lumding Rail / NH-27)',
      corridorLength: '18.2 km',
      vulnerabilityIndex: 88,
      primaryFailureMechanism: 'Rotational shear slip along weathered shale formation',
      exposureLevel: 'Critical' as const,
      infrastructureImpact: 'Northeast Frontier Railway hill artery, NH-27 freight transit'
    },
    {
      name: 'Gangtok 9th Mile to Ranipool Corridor (NH-10)',
      corridorLength: '14.0 km',
      vulnerabilityIndex: 82,
      primaryFailureMechanism: 'Toe erosion by mountain streams & colluvium creep',
      exposureLevel: 'High' as const,
      infrastructureImpact: 'Single major arterial connecting Sikkim to Silchar/West Bengal'
    },
    {
      name: 'Kohima-Zubza Subsidence Belt (NH-29)',
      corridorLength: '12.8 km',
      vulnerabilityIndex: 79,
      primaryFailureMechanism: 'Progressive creeping displacement and tension crack widening',
      exposureLevel: 'High' as const,
      infrastructureImpact: 'NH-29 4-lane supply line to Manipur; Zubza railway terminal'
    },
    {
      name: 'Hunthar Sinking Valley (NH-54 Approach)',
      corridorLength: '6.5 km',
      vulnerabilityIndex: 75,
      primaryFailureMechanism: 'Urban runoff surcharge & bedrock terrace displacement',
      exposureLevel: 'Moderate' as const,
      infrastructureImpact: 'Municipal roads, water pipeline, high-density residential fringe'
    }
  ];

  const historicalComparison = [
    {
      metric: '7-Day Cumulative Regional Rainfall',
      currentWeek: '412 mm peak',
      comparativeMonsoon2022: '448 mm (July 2022)',
      historicalBaseline: '265 mm (10-yr Mean)',
      interpretation: 'Approaching 2022 flood/slide episode; saturation threshold exceeded in 3 districts.'
    },
    {
      metric: 'Active Surface Displacement Velocity',
      currentWeek: '4.8 mm/day peak',
      comparativeMonsoon2022: '5.2 mm/day peak',
      historicalBaseline: '0.8 mm/day (Dry Season)',
      interpretation: 'InSAR tracking demonstrates active acceleration typical of pre-failure deformation.'
    },
    {
      metric: 'Hazard Corridor Disruption Frequency',
      currentWeek: '4 Major Arterials Affected',
      comparativeMonsoon2022: '6 Major Arterials Blocked',
      historicalBaseline: '1 Arterial per week',
      interpretation: 'Preventive traffic regulation has avoided catastrophic commuter stranding.'
    }
  ];

  const weeklyInfrastructureImpact = [
    {
      sector: 'State Highway 5 (Meghalaya)',
      disruptions: 'Single-lane transit only; heavy trucks halted during 20:00-06:00 window',
      mitigationAction: 'PWD excavators positioned at KM 18 & KM 24; police checkpoints active',
      operationalStatus: 'Regulated Transit'
    },
    {
      sector: 'Lumding-Badarpur Railway (Assam)',
      disruptions: 'Freight train movement restricted; passenger speed capped at 30 km/h',
      mitigationAction: 'Continuous track ballast inspection; vibration monitors active',
      operationalStatus: 'Restricted Speed'
    },
    {
      sector: 'National Highway 10 (Sikkim)',
      disruptions: 'Controlled intermittent closures for boulder scaling near 9th Mile',
      mitigationAction: 'BRO Project Swastik clearing crews deployed with wheel loaders',
      operationalStatus: 'Intermittent Closures'
    },
    {
      sector: 'National Highway 29 (Nagaland)',
      disruptions: 'Slow vehicle movement due to uneven settlement and crack repair',
      mitigationAction: 'Bituminous crack sealing completed on KM 44 stretch',
      operationalStatus: 'Caution Advised'
    }
  ];

  const warningLifecycle = [
    { category: 'New Warnings Issued', count: 4, details: 'Sohra, Haflong, Gangtok 9th Mile, Kohima Zubza' },
    { category: 'Escalated to Critical', count: 2, details: 'Sohra-Shella Escarpment & Haflong Cut Section' },
    { category: 'Active Under Monitoring', count: 4, details: 'Continuous telemetry logging across all 4 zones' },
    { category: 'De-escalated / Resolved', count: 1, details: 'Tawang Sela Approach successfully stabilized' }
  ];

  const nextWeekOutlook = [
    'Synoptic meteorological forecast indicates a gradual reduction in convective cloudburst intensity starting Tuesday.',
    'Pore water dissipation will lag surface rainfall by approximately 48 to 72 hours; slope stability risk will remain high.',
    'Priority engineering intervention recommended: clear blocked side-drains along NH-6 and NH-27 to prevent toe ponding.',
    'Continue weekly InSAR interferometry processing to detect new sub-centimeter displacement trends.'
  ];

  return {
    reportType: 'weekly',
    refNumber: refNum,
    generatedDate: `${dateStr}, 09:00 IST`,
    reportingPeriod: '7-Day Regional Window (Past 7 Days to Current Evaluation)',
    region: 'North Eastern Regional Corridor (NER Geotechnical Monitoring Grid)',
    executiveSummary: 'This 7-Day Regional Threat Assessment synthesizes cumulative precipitation, InSAR displacement velocities, and infrastructure disruptions across the 8 northeastern states. High cumulative rainfall (>400mm) has saturated the overburden layer across the Shillong Plateau and Barail Range. Two priority corridors remain in critical status, while inter-agency pre-positioning has minimized major arterial closures.',
    weeklyTrend,
    stateRainfallDistribution,
    topRiskCorridors,
    historicalComparison,
    weeklyInfrastructureImpact,
    warningLifecycle,
    nextWeekOutlook
  };
}

export function generateEmergencyBriefing(zones: LocationZone[], alerts: EarlyWarningAlert[]): EmergencyBriefingData {
  const today = new Date();
  const dateStr = today.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
  const timeStr = today.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', hour12: false }) + ' IST';
  const refNum = `GR-NER-ESB-CRIT-${today.getFullYear()}${(today.getMonth() + 1).toString().padStart(2, '0')}${today.getDate().toString().padStart(2, '0')}-09`;

  const activeAlerts = alerts.filter(a => a.status !== 'Resolved');

  const criticalIncidents = activeAlerts.map(alert => {
    const zone = zones.find(z => z.id === alert.zoneId) || zones[0];
    const isCrit = alert.alertState === 'Critical';
    return {
      alert,
      zone,
      responseStatus: isCrit ? 'Active Response' as const : 'Monitoring & Patrol' as const,
      fieldCommand: isCrit ? 'District Emergency Operations Center (DEOC) Activated' : 'Sector Patrol Officer On Site',
      evacuationStatus: isCrit ? 'Standby Advisory Issued to 14,200 Residents' : 'No Evacuation Required; Watch Maintained'
    };
  });

  const infrastructureImpactMatrix = [
    {
      assetName: 'State Highway 5 (Sohra-Shella Escarpment)',
      type: 'Highway' as const,
      status: 'Traffic Restricted' as const,
      impactDetails: 'Heavy freight transit prohibited; single-lane escorted convoys for essential supplies.',
      agencyLead: 'Meghalaya PWD (Roads) & District Traffic Police'
    },
    {
      assetName: 'Lumding-Badarpur Railway Hill Section',
      type: 'Rail Link' as const,
      status: 'Speed Reduced' as const,
      impactDetails: 'Freight trains suspended; passenger trains limited to 30 km/h with pilot engine inspection.',
      agencyLead: 'Northeast Frontier Railway (NFR) Geotech Division'
    },
    {
      assetName: 'National Highway 10 (Ranipool - Gangtok Sector)',
      type: 'Highway' as const,
      status: 'Reinforced / Standby' as const,
      impactDetails: 'Spot boulder netting reinforced; wheel loaders on standby at Ranipool depot.',
      agencyLead: 'Border Roads Organisation (BRO Project Swastik)'
    },
    {
      assetName: 'Wahkaba Gorge Arch Bridge Span',
      type: 'Bridge' as const,
      status: 'Patrol Deployed' as const,
      impactDetails: 'Abutment tilt and vibration sensors within normal tolerance; water clearance 4.2m.',
      agencyLead: 'PWD Bridge Cell & State SDRF Engineers'
    }
  ];

  const sensorDiagnostics = activeAlerts.map(alert => ({
    location: alert.location,
    porePressure: alert.environmentalTriggers.soilSaturation,
    velocityAccel: alert.environmentalTriggers.slopeDisplacement,
    factorOfSafety: alert.environmentalTriggers.shearStressRatio,
    triggerStatus: alert.alertState === 'Critical' ? 'CRITICAL (Pore Pressure > 85%)' : 'ELEVATED (Pore Pressure > 75%)'
  }));

  const agencyMobilization = [
    {
      agency: 'State Disaster Response Force (SDRF)',
      resources: '2 Rapid Response Platoons (60 personnel), rescue boats, hydraulic cutters',
      location: 'Sohra Tactical Base & Haflong Civil Station',
      status: 'On Standby / Field Ready'
    },
    {
      agency: 'National Disaster Response Force (NDRF)',
      resources: '1st Battalion Alert Team (45 personnel, canine search units)',
      location: 'Patgaon Base, Guwahati (Forward staging to Silchar)',
      status: 'Alerted / Ready to Move'
    },
    {
      agency: 'Border Roads Organisation (BRO)',
      resources: '4 Wheel Excavators, 2 Bulldozers, 6 Tipper Trucks',
      location: 'Swastik Base Ranipool & Vartak Depot',
      status: 'Actively Clearing Slopes'
    },
    {
      agency: 'District Health Services',
      resources: 'Emergency trauma kits, mobile ambulance units (4 vehicles)',
      location: 'Civil Hospitals at Cherrapunji and Haflong',
      status: 'High Alert'
    }
  ];

  const dataGapsAndLimitations = [
    'Dense stratocumulus cloud deck prevents optical satellite confirmation of crown tension cracks.',
    'Cellular tower battery backup at Sohra South estimated at 6 hours if grid power falters; VHF radio repeaters verified active.',
    'Telemetry ping intervals on extensometers have been dynamically lowered from 30 minutes to 5 minutes to track rapid displacement spikes.'
  ];

  const communicationLog = [
    {
      channel: 'Common Alerting Protocol (CAP-India) SMS',
      recipientCount: '14,200 Registered Citizens',
      timestamp: '08:45 IST',
      status: 'Disseminated (98.4% Delivery)'
    },
    {
      channel: 'Automated Multilingual Voice (IVR)',
      recipientCount: '3,800 Village Headmen & Ward Volunteers',
      timestamp: '08:50 IST',
      status: 'Active Calls in Progress'
    },
    {
      channel: 'Emergency Operations Center Inter-Agency VHF',
      recipientCount: 'District Magistrates, SDRF, PWD, NFR',
      timestamp: 'Continuous',
      status: 'Channel Clear & Monitored'
    }
  ];

  return {
    reportType: 'emergency',
    refNumber: refNum,
    generatedDate: dateStr,
    briefingTime: timeStr,
    operationalLevel: 'LEVEL-3 GEOTECHNICAL EMERGENCY INCIDENT BRIEFING',
    situationSummary: `URGENT OPERATIONAL SITUATION BRIEFING: Rapid pore pressure saturation and displacement velocity spikes have triggered Level-3 Geotechnical Emergency protocols for the Sohra-Shella escarpment (East Khasi Hills, Meghalaya) and the Haflong rail section (Dima Hasao, Assam). Inter-agency coordination is activated across SDMA, SDRF, PWD, and Northeast Frontier Railway. Precautionary transport restrictions and village notification protocols are underway.`,
    criticalIncidents,
    infrastructureImpactMatrix,
    sensorDiagnostics,
    agencyMobilization,
    dataGapsAndLimitations,
    communicationLog
  };
}
