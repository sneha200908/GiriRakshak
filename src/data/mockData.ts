import { LocationZone, EarlyWarningAlert, InfrastructureItem, HistoricalLandslide, NotificationItem, SensorTelemetry, SystemSettings } from '../types';

export const INITIAL_ZONES: LocationZone[] = [
  {
    id: 'ZONE-NER-01',
    name: 'Sohra-Shella Escarpment',
    district: 'East Khasi Hills',
    state: 'Meghalaya',
    coordinates: { lat: 25.29, lng: 91.72, x: 44, y: 56 },
    riskLevel: 'HIGH',
    riskScore: 88,
    rainfall24h: 184.6,
    rainfall7d: 412.0,
    soilMoisture: 89.4,
    slopeAngle: 42,
    elevation: 1430,
    groundMovement: 4.8,
    vegetationIndex: 0.48,
    geology: 'Sandstone & fractured limestone over shale basement',
    infrastructureNearby: ['State Highway 5', 'Wahkaba Valley Habitations', 'Eco-Tourism Corridor'],
    lastUpdated: '10 mins ago',
    aiPrediction: 'High shear failure imminent along overburden soil layers within 6-12 hours under sustained cloudburst conditions.',
    aiConfidence: 91,
    primaryRiskFactors: [
      'Extreme rainfall intensity (184.6mm / 24h exceeding IMD red threshold)',
      'Soil saturation reaching 89.4% pore pressure threshold',
      'Steep slope gradient (42°) with weak shale underbed',
      'InSAR GPS surface displacement velocity of 4.8 mm/day'
    ],
    recommendedAction: 'Immediate issuance of Level-3 Critical Alert. Pre-position SDRF units at Sohra junction. Restrict heavy commercial traffic on SH-5.',
    historyCount: 14
  },
  {
    id: 'ZONE-NER-02',
    name: 'Haflong Hill Cut Section',
    district: 'Dima Hasao',
    state: 'Assam',
    coordinates: { lat: 25.18, lng: 93.02, x: 57, y: 58 },
    riskLevel: 'HIGH',
    riskScore: 84,
    rainfall24h: 142.2,
    rainfall7d: 360.5,
    soilMoisture: 86.1,
    slopeAngle: 38,
    elevation: 680,
    groundMovement: 3.9,
    vegetationIndex: 0.39,
    geology: 'Disang Group crumpled shale with high clay expansion',
    infrastructureNearby: ['Lumding-Badarpur Hill Railway Line', 'NH-27 East-West Corridor', 'Haflong Town Substation'],
    lastUpdated: '14 mins ago',
    aiPrediction: 'Rotational debris flow likely along exposed railway cut banks due to water table saturation.',
    aiConfidence: 89,
    primaryRiskFactors: [
      'Unconsolidated cut slope overburden with clay swelling',
      'Cumulative 7-day rainfall over 360mm',
      'Subsurface pore-pressure sensor alert triggered at Ch. 44+200',
      'High proximity to vital arterial rail lifeline'
    ],
    recommendedAction: 'Speed restriction (15 km/h) for railway transit. Deploy PWD geotechnical crews for emergency drainage clearing.',
    historyCount: 22
  },
  {
    id: 'ZONE-NER-03',
    name: 'Gangtok 9th Mile Ridge',
    district: 'East Sikkim',
    state: 'Sikkim',
    coordinates: { lat: 27.34, lng: 88.61, x: 22, y: 38 },
    riskLevel: 'HIGH',
    riskScore: 79,
    rainfall24h: 118.0,
    rainfall7d: 285.4,
    soilMoisture: 82.5,
    slopeAngle: 44,
    elevation: 1750,
    groundMovement: 3.4,
    vegetationIndex: 0.52,
    geology: 'Gneissic rocks with weathered phyllites and mica schists',
    infrastructureNearby: ['NH-10 Lifeline Arterial Road', 'Ranipool Power Feeder', 'Residential Ward 9'],
    lastUpdated: '22 mins ago',
    aiPrediction: 'Planar slip hazard aggravated by lateral toe erosion from seasonal mountain torrents.',
    aiConfidence: 86,
    primaryRiskFactors: [
      'Toe scouring by swollen local streams',
      'Steep slope (44°) with vulnerable overburden',
      'Continuous antecedent precipitation over 72 hours'
    ],
    recommendedAction: 'Alert Border Roads Organisation (BRO / Project Swastik). Divert heavy vehicle transit via alternative Pakyong route.',
    historyCount: 18
  },
  {
    id: 'ZONE-NER-04',
    name: 'Kohima South Ridge (Zubza)',
    district: 'Kohima',
    state: 'Nagaland',
    coordinates: { lat: 25.67, lng: 94.11, x: 67, y: 52 },
    riskLevel: 'HIGH',
    riskScore: 76,
    rainfall24h: 96.5,
    rainfall7d: 240.0,
    soilMoisture: 78.9,
    slopeAngle: 36,
    elevation: 1440,
    groundMovement: 2.7,
    vegetationIndex: 0.44,
    geology: 'Tertiary sedimentary shale and siltstone with high fracturing',
    infrastructureNearby: ['NH-29 Dimapur-Kohima Highway', 'Zubza New Rail Head', 'High Tension Power Pylon #42'],
    lastUpdated: '18 mins ago',
    aiPrediction: 'Creep acceleration observed on active sinking zone between KM 148 and KM 152.',
    aiConfidence: 84,
    primaryRiskFactors: [
      'Known historic sinking zone re-activated by monsoon surge',
      'Tiltmeter sensor divergence of +1.4 degrees over 48 hours',
      'Pore-pressure build up in slope sub-drainage'
    ],
    recommendedAction: 'Place JCB earthmovers on standby. Issue one-way pilot vehicle convoy advisory on NH-29.',
    historyCount: 16
  },
  {
    id: 'ZONE-NER-05',
    name: 'Tawang Sela Approach Slopes',
    district: 'Tawang',
    state: 'Arunachal Pradesh',
    coordinates: { lat: 27.58, lng: 91.86, x: 45, y: 28 },
    riskLevel: 'MEDIUM',
    riskScore: 58,
    rainfall24h: 62.4,
    rainfall7d: 145.0,
    soilMoisture: 64.2,
    slopeAngle: 40,
    elevation: 2850,
    groundMovement: 1.2,
    vegetationIndex: 0.35,
    geology: 'High-altitude moraine debris over granitic gneiss bedrock',
    infrastructureNearby: ['Trans-Arunachal Highway / BCT Road', 'Military Logistics Corridor', 'Sela Tunnel North Portal'],
    lastUpdated: '35 mins ago',
    aiPrediction: 'Moderate risk of freeze-thaw rockfall and localized slope slips under localized convective downpours.',
    aiConfidence: 78,
    primaryRiskFactors: [
      'Steep glacial moraine deposits with unstable boulders',
      'Moderate 24h precipitation in high altitude catchment',
      'Freeze-thaw expansion of rock fissures'
    ],
    recommendedAction: 'Deploy Project Vartak road patrols. Routine slope clearance during daylight hours only.',
    historyCount: 9
  },
  {
    id: 'ZONE-NER-06',
    name: 'Aizawl Hunthar Sinking Valley',
    district: 'Aizawl',
    state: 'Mizoram',
    coordinates: { lat: 23.73, lng: 92.71, x: 53, y: 74 },
    riskLevel: 'HIGH',
    riskScore: 82,
    rainfall24h: 135.0,
    rainfall7d: 310.2,
    soilMoisture: 84.8,
    slopeAngle: 39,
    elevation: 890,
    groundMovement: 3.8,
    vegetationIndex: 0.41,
    geology: 'Surma group argillaceous rocks with heavy anthropogenic cut slopes',
    infrastructureNearby: ['NH-54 Supply Corridor', 'Hunthar Settlement Houses', 'District Water Pumping Station'],
    lastUpdated: '25 mins ago',
    aiPrediction: 'High probability of translational slope failure impacting residential clusters along hillside terraces.',
    aiConfidence: 88,
    primaryRiskFactors: [
      'Heavy urban surcharge loading on 39° natural slope',
      'Impaired storm-water runoff drainage',
      'Continuous ground creep of 3.8 mm/day detected by IoT nodes'
    ],
    recommendedAction: 'Activate Aizawl District Emergency Operations Centre (DEOC). Order temporary shifting of 32 vulnerable families to community hall.',
    historyCount: 25
  },
  {
    id: 'ZONE-NER-07',
    name: 'Noney Tupul Railway Viaduct',
    district: 'Noney',
    state: 'Manipur',
    coordinates: { lat: 24.81, lng: 93.65, x: 63, y: 64 },
    riskLevel: 'MEDIUM',
    riskScore: 54,
    rainfall24h: 58.0,
    rainfall7d: 132.0,
    soilMoisture: 61.5,
    slopeAngle: 34,
    elevation: 520,
    groundMovement: 1.1,
    vegetationIndex: 0.58,
    geology: 'Weathered siltstone and shale in Ijai River basin',
    infrastructureNearby: ['Jiribam-Imphal Railway Project', 'NH-37 Imphal-Silchar', 'Ijai River Temporary Barrage'],
    lastUpdated: '40 mins ago',
    aiPrediction: 'Catchment riverbank erosion monitored; slope stable under current threshold but watchful of rainfall spikes.',
    aiConfidence: 81,
    primaryRiskFactors: [
      'Riverbank toe-erosion dynamics during flash discharge',
      'Re-vegetated slope stabilization working adequately'
    ],
    recommendedAction: 'Keep ultrasonic water-level sensors in continuous live sync. Regular hourly telemetry check.',
    historyCount: 11
  },
  {
    id: 'ZONE-NER-08',
    name: 'Guwahati Kamakhya Hill Foot',
    district: 'Kamrup Metropolitan',
    state: 'Assam',
    coordinates: { lat: 26.16, lng: 91.70, x: 43, y: 47 },
    riskLevel: 'MEDIUM',
    riskScore: 47,
    rainfall24h: 52.0,
    rainfall7d: 110.0,
    soilMoisture: 56.4,
    slopeAngle: 31,
    elevation: 240,
    groundMovement: 0.8,
    vegetationIndex: 0.62,
    geology: 'Precambrian granitic rocks with red residual lateritic soil',
    infrastructureNearby: ['Kamakhya Temple Access Road', 'Brahmaputra Riverside Highway', 'Pandu Port Road'],
    lastUpdated: '50 mins ago',
    aiPrediction: 'Minor debris slumps possible on unprotected earth-cut road margins.',
    aiConfidence: 76,
    primaryRiskFactors: [
      'Unscientific earth cutting on private hillside plots',
      'Moderate monsoon showers'
    ],
    recommendedAction: 'District administration municipal warning issued against unauthorized hillside excavation.',
    historyCount: 8
  },
  {
    id: 'ZONE-NER-09',
    name: 'Jampui Hills Foothill Strip',
    district: 'North Tripura',
    state: 'Tripura',
    coordinates: { lat: 23.95, lng: 92.28, x: 49, y: 72 },
    riskLevel: 'LOW',
    riskScore: 26,
    rainfall24h: 18.5,
    rainfall7d: 48.0,
    soilMoisture: 38.0,
    slopeAngle: 24,
    elevation: 740,
    groundMovement: 0.2,
    vegetationIndex: 0.74,
    geology: 'Sub-Himalayan anticline folded sandstone with dense canopy',
    infrastructureNearby: ['Kanchanpur-Vanghmun Rural Road', 'Horticulture Research Centre'],
    lastUpdated: '1 hour ago',
    aiPrediction: 'Slope conditions within normal baseline stability factors. Vegetation buffer holding topsoil securely.',
    aiConfidence: 94,
    primaryRiskFactors: ['Normal baseline conditions', 'Low antecedent rainfall'],
    recommendedAction: 'Standard routine monitoring schedule (Level-0 Normal).',
    historyCount: 4
  },
  {
    id: 'ZONE-NER-10',
    name: 'Papum Pare Hilly Escarpment',
    district: 'Papum Pare',
    state: 'Arunachal Pradesh',
    coordinates: { lat: 27.10, lng: 93.61, x: 62, y: 34 },
    riskLevel: 'MEDIUM',
    riskScore: 52,
    rainfall24h: 68.0,
    rainfall7d: 154.0,
    soilMoisture: 58.9,
    slopeAngle: 33,
    elevation: 620,
    groundMovement: 0.9,
    vegetationIndex: 0.66,
    geology: 'Siwalik sandstone and pebble beds with high friability',
    infrastructureNearby: ['Itanagar-Naharlagun Twin City Expressway', 'Pachin River Bund'],
    lastUpdated: '45 mins ago',
    aiPrediction: 'Isolated mudslides likely on slope faces with sparse tree coverage during continuous showers.',
    aiConfidence: 80,
    primaryRiskFactors: ['Friable Siwalik pebble beds prone to water liquefaction', 'Urban roadway slopes'],
    recommendedAction: 'Deploy highway maintenance sweepers. Monitor retaining wall drain weep-holes.',
    historyCount: 7
  },
  {
    id: 'ZONE-NER-11',
    name: 'Mangan North District Ridge',
    district: 'Mangan',
    state: 'Sikkim',
    coordinates: { lat: 27.50, lng: 88.52, x: 21, y: 33 },
    riskLevel: 'HIGH',
    riskScore: 85,
    rainfall24h: 158.4,
    rainfall7d: 380.0,
    soilMoisture: 88.0,
    slopeAngle: 45,
    elevation: 1980,
    groundMovement: 4.2,
    vegetationIndex: 0.45,
    geology: 'Chungthang Formation crystalline gneiss with shear zones',
    infrastructureNearby: ['Chungthang-Lachen Highway', 'Teesta Stage III Hydro Facility', 'Local Bailey Bridge'],
    lastUpdated: '8 mins ago',
    aiPrediction: 'Critical debris flow danger; river valley slope toe saturation triggering upslope regolith slippage.',
    aiConfidence: 92,
    primaryRiskFactors: [
      'High cumulative rainfall (380mm)',
      'Steep 45° slope in seismically fragile shear zone',
      'Telemetry alert on acoustic emission sensor node SN-SKM-04'
    ],
    recommendedAction: 'Sound local community siren at Mangan bazaar. BRO quick-response squad mobilised.',
    historyCount: 20
  },
  {
    id: 'ZONE-NER-12',
    name: 'Umiam Lake Basin Slopes',
    district: 'Ri-Bhoi',
    state: 'Meghalaya',
    coordinates: { lat: 25.66, lng: 91.90, x: 46, y: 53 },
    riskLevel: 'LOW',
    riskScore: 28,
    rainfall24h: 24.0,
    rainfall7d: 62.0,
    soilMoisture: 42.1,
    slopeAngle: 22,
    elevation: 990,
    groundMovement: 0.3,
    vegetationIndex: 0.79,
    geology: 'Stable Shillong Group quartzite formation',
    infrastructureNearby: ['Guwahati-Shillong 4-Lane NH-6', 'Umiam Dam Spillway Road'],
    lastUpdated: '1 hour ago',
    aiPrediction: 'Stable structural condition; geotextile and reinforced shotcrete slope protection functioning normally.',
    aiConfidence: 95,
    primaryRiskFactors: ['Normal rainfall levels', 'Reinforced engineering stabilization'],
    recommendedAction: 'Standard biometric and sensor telemetry logging.',
    historyCount: 3
  }
];

export const INITIAL_ALERTS: EarlyWarningAlert[] = [
  {
    id: 'ALT-NER-2026-001',
    zoneId: 'ZONE-NER-01',
    location: 'Sohra-Shella Escarpment, East Khasi Hills',
    district: 'East Khasi Hills',
    state: 'Meghalaya',
    riskLevel: 'HIGH',
    alertState: 'Critical',
    riskScore: 88,
    timestamp: 'Today, 08:42 IST',
    trigger: 'Cloudburst Rainfall (184.6mm) + Soil Pore Pressure Saturation (89.4%)',
    aiConfidence: 91,
    status: 'Active',
    environmentalTriggers: {
      rainfallRate: '28.4 mm/hr (Extreme)',
      soilSaturation: '89.4% (Threshold: 75%)',
      slopeDisplacement: '4.8 mm/day (Velocity Accel.)',
      shearStressRatio: '1.42 (Factor of Safety < 0.92)'
    },
    recommendedActions: [
      'Dispatch automated Multilingual SMS/IVR warnings to 14,200 registered village residents',
      'Mobilize SDRF & NDRF 1st Battalion standby units at Sohra',
      'Restricted vehicular access on State Highway 5; establish police checkpoints',
      'Notify District Magistrate & District Disaster Management Authority (DDMA)'
    ],
    multilingualAlert: {
      en: 'CRITICAL EARLY WARNING: High risk of landslide detected along Sohra-Shella escarpment. Avoid valley routes. Move to designated shelters if instructed by authorities.',
      as: 'জৰুৰী সতৰ্কবাণী: চোহৰা-শ্বেলা অঞ্চলত ভূমিস্খলনৰ প্ৰচণ্ড সম্ভাৱনা। উপত্যকা পথ ত্যাগ কৰক আৰু প্ৰশাসনে নিৰ্দেশ দিলে সুৰক্ষিত স্থানলৈ যাওক।',
      hi: 'गंभीर पूर्व चेतावनी: सोहरा-शेल्ला क्षेत्र में भारी भूस्खलन का उच्च जोखिम। घाटी के रास्तों से बचें और प्रशासन के निर्देशानुसार सुरक्षित आश्रयों में जाएं।'
    },
    disseminationChannels: ['SMS', 'IVR', 'Mobile App', 'Siren', 'CAP-India'],
    affectedPopulationEst: 14200,
    criticalInfrastructure: ['State Highway 5', 'Wahkaba Bridge', 'Sohra Grid Feeder']
  },
  {
    id: 'ALT-NER-2026-002',
    zoneId: 'ZONE-NER-02',
    location: 'Haflong Hill Cut Section, Dima Hasao',
    district: 'Dima Hasao',
    state: 'Assam',
    riskLevel: 'HIGH',
    alertState: 'Critical',
    riskScore: 84,
    timestamp: 'Today, 07:15 IST',
    trigger: 'Subsurface Shear Strain Spike + Continuous Antecedent Rainfall (360mm / 7d)',
    aiConfidence: 89,
    status: 'Monitoring',
    environmentalTriggers: {
      rainfallRate: '19.8 mm/hr (Heavy)',
      soilSaturation: '86.1% (Threshold: 75%)',
      slopeDisplacement: '3.9 mm/day (Rapid creep)',
      shearStressRatio: '1.35 (Factor of Safety 0.96)'
    },
    recommendedActions: [
      'Halt railway freight operations between Lumding and Badarpur hill sector',
      'Station emergency breakdown crane and PWD earthmovers at Haflong yard',
      'Alert Assam SDMA and Northeast Frontier Railway (NFR) control room'
    ],
    multilingualAlert: {
      en: 'CRITICAL ALERT: Slope instability detected along Haflong hill rail corridor. Precautionary rail speed restrictions enforced.',
      as: 'গুৰুত্বপূৰ্ণ সতৰ্কবাণী: হাফলং পাহাৰীয়া ৰে’ল কৰিডৰত মাটিত বিপজ্জনক স্থানচ্যুতিৰ সংকেত। ৰে’ল যাতায়ত নিয়ন্ত্ৰিত কৰা হৈছে।',
      hi: 'महत्वपूर्ण चेतावनी: हाफलोंग पहाड़ी रेल मार्ग पर ढलान अस्थिरता के संकेत। ट्रेनों की गति नियंत्रित की गई है।'
    },
    disseminationChannels: ['SMS', 'Mobile App', 'CAP-India'],
    affectedPopulationEst: 8500,
    criticalInfrastructure: ['Lumding-Badarpur Railway', 'NH-27 East-West Corridor']
  },
  {
    id: 'ALT-NER-2026-003',
    zoneId: 'ZONE-NER-03',
    location: 'Gangtok 9th Mile Ridge, East Sikkim',
    district: 'East Sikkim',
    state: 'Sikkim',
    riskLevel: 'HIGH',
    alertState: 'Warning',
    riskScore: 79,
    timestamp: 'Today, 06:30 IST',
    trigger: 'Toe Scouring by Swollen Mountain Streams + Saturated Colluvium',
    aiConfidence: 86,
    status: 'Watch',
    environmentalTriggers: {
      rainfallRate: '14.2 mm/hr (Moderate-Heavy)',
      soilSaturation: '82.5% (Threshold: 75%)',
      slopeDisplacement: '3.4 mm/day',
      shearStressRatio: '1.24 (Factor of Safety 1.04)'
    },
    recommendedActions: [
      'BRO Project Swastik to commence controlled boulder clearing',
      'Deploy traffic marshals on NH-10 near Ranipool',
      'Sikkim State Disaster Management Authority review meeting convened'
    ],
    multilingualAlert: {
      en: 'LANDSLIDE WARNING: Elevated landslide probability on NH-10 Gangtok approach. Commuters advised caution.',
      as: 'ভূমিস্খলন সতৰ্কতা: গেংটকৰ এন এইচ ১০ পথত সম্ভাব্য ভূমিস্খলনৰ বাবে সতৰ্ক থাকক।',
      hi: 'भूस्खलन चेतावनी: गंगटोक के एनएच-10 पर भूस्खलन की संभावना। यात्रियों को सावधानी बरतने की सलाह दी जाती है।'
    },
    disseminationChannels: ['SMS', 'Mobile App'],
    affectedPopulationEst: 6200,
    criticalInfrastructure: ['NH-10 Lifeline Highway', 'Ranipool Substation']
  },
  {
    id: 'ALT-NER-2026-004',
    zoneId: 'ZONE-NER-04',
    location: 'Kohima South Ridge (Zubza Bypass), Kohima',
    district: 'Kohima',
    state: 'Nagaland',
    riskLevel: 'HIGH',
    alertState: 'Warning',
    riskScore: 76,
    timestamp: 'Today, 05:45 IST',
    trigger: 'Tiltmeter Angle Divergence (+1.4°) on NH-29 Intersecting Sinking Formation',
    aiConfidence: 84,
    status: 'Acknowledged',
    environmentalTriggers: {
      rainfallRate: '11.5 mm/hr',
      soilSaturation: '78.9%',
      slopeDisplacement: '2.7 mm/day',
      shearStressRatio: '1.18 (Factor of Safety 1.12)'
    },
    recommendedActions: [
      'Highway patrol to regulate single-lane passage on NH-29',
      'Alert PWD (Roads) maintenance wing for culvert desilting and tension crack sealing',
      'Station standby recovery tow vehicles at Zubza junction'
    ],
    multilingualAlert: {
      en: 'ADVISORY: Slow movement on NH-29 Kohima bypass due to active ground settling. Heavy vehicles held at Dimapur.',
      as: 'কহিমা বাইপাছৰ এন এইচ ২৯ পথত সতৰ্কবাণী। গধূৰ বাহন চলাচল সীমিত।',
      hi: 'कोहिमा बाईपास पर एनएच-29 पर सावधानी बरतें। भारी वाहनों को नियंत्रित किया गया।'
    },
    disseminationChannels: ['Mobile App', 'CAP-India'],
    affectedPopulationEst: 4500,
    criticalInfrastructure: ['NH-29 4-Lane Arterial', 'Zubza Rail Terminal Link']
  },
  {
    id: 'ALT-NER-2026-005',
    zoneId: 'ZONE-NER-05',
    location: 'Tawang Sela Approach Slopes, Tawang',
    district: 'Tawang',
    state: 'Arunachal Pradesh',
    riskLevel: 'MEDIUM',
    alertState: 'Monitoring',
    riskScore: 58,
    timestamp: 'Yesterday, 22:30 IST',
    trigger: 'High Altitude Snow-Melt Runoff + Rockfall Trajectory Shift',
    aiConfidence: 78,
    status: 'Resolved',
    environmentalTriggers: {
      rainfallRate: '6.4 mm/hr',
      soilSaturation: '64.2%',
      slopeDisplacement: '1.2 mm/day',
      shearStressRatio: '1.05'
    },
    recommendedActions: [
      'Continue passive sensor telemetry logging',
      'Debris nets cleared by BRO Project Vartak'
    ],
    multilingualAlert: {
      en: 'INFO: Sela approach cleared. Normal traffic resumed under vigilance.',
      as: 'চেলা পাছ পথ মুকলি কৰা হৈছে। সাৱধানে গাড়ী চলাওক।',
      hi: 'सेला दर्रा मार्ग साफ। सामान्य यातायात सतर्कता के साथ शुरू।'
    },
    disseminationChannels: ['Mobile App'],
    affectedPopulationEst: 1800,
    criticalInfrastructure: ['Trans-Arunachal Highway']
  }
];

export const INITIAL_INFRASTRUCTURE: InfrastructureItem[] = [
  {
    id: 'INFRA-01',
    name: 'National Highway 6 (Shillong-Silchar)',
    category: 'Road',
    state: 'Meghalaya',
    district: 'East Jaintia Hills / East Khasi Hills',
    nearestRiskZone: 'Sohra-Shella Escarpment',
    distanceFromRiskZoneKm: 1.4,
    riskLevel: 'HIGH',
    vulnerabilityScore: 89,
    inspectionStatus: 'Requires Mitigation',
    lastInspectionDate: '2026-09-14',
    recommendedAction: 'Erect flexible rockfall catch fences and install horizontal drains at KM 118.',
    dailyTrafficOrCapacity: '18,500 PCU / day'
  },
  {
    id: 'INFRA-02',
    name: 'Lumding-Badarpur Hill Railway Section',
    category: 'Rail',
    state: 'Assam',
    district: 'Dima Hasao',
    nearestRiskZone: 'Haflong Hill Cut Section',
    distanceFromRiskZoneKm: 0.6,
    riskLevel: 'HIGH',
    vulnerabilityScore: 92,
    inspectionStatus: 'Immediate Hazard',
    lastInspectionDate: '2026-09-17',
    recommendedAction: 'Deploy continuous radar gauge sensor on Tunnel #7 cutting; restrict night trains.',
    dailyTrafficOrCapacity: '32 Trains / day (Strategic cargo & passenger)'
  },
  {
    id: 'INFRA-03',
    name: 'NH-10 Teesta River Corridor',
    category: 'Road',
    state: 'Sikkim',
    district: 'East Sikkim',
    nearestRiskZone: 'Gangtok 9th Mile Ridge',
    distanceFromRiskZoneKm: 0.8,
    riskLevel: 'HIGH',
    vulnerabilityScore: 86,
    inspectionStatus: 'Requires Mitigation',
    lastInspectionDate: '2026-09-15',
    recommendedAction: 'Anchor retaining gabion baskets at slope toe; deploy automated drone LiDAR scan.',
    dailyTrafficOrCapacity: '12,000 Vehicles / day'
  },
  {
    id: 'INFRA-04',
    name: 'Wahkaba Gorge Arch Bridge',
    category: 'Bridge',
    state: 'Meghalaya',
    district: 'East Khasi Hills',
    nearestRiskZone: 'Sohra-Shella Escarpment',
    distanceFromRiskZoneKm: 0.4,
    riskLevel: 'HIGH',
    vulnerabilityScore: 81,
    inspectionStatus: 'Requires Mitigation',
    lastInspectionDate: '2026-09-12',
    recommendedAction: 'Inspect abutment scour and anchor bolts against dynamic debris impact.',
    dailyTrafficOrCapacity: '6,400 Vehicles / day'
  },
  {
    id: 'INFRA-05',
    name: 'NH-29 Kohima-Dimapur 4-Lane Arterial',
    category: 'Road',
    state: 'Nagaland',
    district: 'Kohima',
    nearestRiskZone: 'Kohima South Ridge (Zubza)',
    distanceFromRiskZoneKm: 1.1,
    riskLevel: 'HIGH',
    vulnerabilityScore: 78,
    inspectionStatus: 'Requires Mitigation',
    lastInspectionDate: '2026-09-16',
    recommendedAction: 'Re-align surface storm drains away from tensile ground fissures.',
    dailyTrafficOrCapacity: '22,000 PCU / day'
  },
  {
    id: 'INFRA-06',
    name: 'Aizawl District Civil Hospital',
    category: 'Critical Facility',
    state: 'Mizoram',
    district: 'Aizawl',
    nearestRiskZone: 'Hunthar Sinking Valley',
    distanceFromRiskZoneKm: 2.3,
    riskLevel: 'MEDIUM',
    vulnerabilityScore: 56,
    inspectionStatus: 'Inspected - Safe',
    lastInspectionDate: '2026-09-10',
    recommendedAction: 'Emergency power backup fuel tanks secured; emergency exit routes clear.',
    dailyTrafficOrCapacity: '350 Inpatient Beds / 1,200 Outpatients'
  },
  {
    id: 'INFRA-07',
    name: 'Sela Tunnel North Portal & Approach',
    category: 'Road',
    state: 'Arunachal Pradesh',
    district: 'Tawang',
    nearestRiskZone: 'Tawang Sela Approach Slopes',
    distanceFromRiskZoneKm: 1.8,
    riskLevel: 'MEDIUM',
    vulnerabilityScore: 49,
    inspectionStatus: 'Inspected - Safe',
    lastInspectionDate: '2026-09-11',
    recommendedAction: 'Monitor electronic avalanche & debris warning sensors at tunnel portals.',
    dailyTrafficOrCapacity: '4,500 Strategic Vehicles / day'
  },
  {
    id: 'INFRA-08',
    name: 'Umiam Hydroelectric Dam Spillway Bridge',
    category: 'Bridge',
    state: 'Meghalaya',
    district: 'Ri-Bhoi',
    nearestRiskZone: 'Umiam Lake Basin Slopes',
    distanceFromRiskZoneKm: 3.2,
    riskLevel: 'LOW',
    vulnerabilityScore: 24,
    inspectionStatus: 'Inspected - Safe',
    lastInspectionDate: '2026-09-08',
    recommendedAction: 'Routine biannual structural vibration testing completed.',
    dailyTrafficOrCapacity: '15,000 Vehicles / day'
  }
];

export const HISTORICAL_LANDSLIDES: HistoricalLandslide[] = [
  {
    id: 'HIST-2024-MZ',
    location: 'Melthum & Aibawk Clusters',
    district: 'Aizawl',
    state: 'Mizoram',
    date: 'May 28, 2024',
    severity: 'Severe',
    rainfallTriggerMm: 298,
    fatalities: 34,
    displaced: 1850,
    affectedInfrastructure: 'Stone quarry collapse, 14 residential buildings, NH-54 blockage for 11 days',
    geologicalTrigger: 'Cyclone Remal extreme cloudburst on steep uncompacted shale slopes',
    mitigationTaken: 'Comprehensive slope stabilization with deep soil nails, mandatory building setback laws'
  },
  {
    id: 'HIST-2022-AS',
    location: 'New Haflong Railway Station Cut',
    district: 'Dima Hasao',
    state: 'Assam',
    date: 'May 14, 2022',
    severity: 'Severe',
    rainfallTriggerMm: 312,
    fatalities: 9,
    displaced: 4200,
    affectedInfrastructure: 'Entire railway station submerged in mud, passenger train stranded, NH-27 breached',
    geologicalTrigger: 'Pre-monsoon deluge oversaturating fragile Disang shale formation cut slopes',
    mitigationTaken: 'Retaining walls with geocells, real-time inclinometer array installed'
  },
  {
    id: 'HIST-2023-SK',
    location: 'Chungthang & Dikchu Valleys',
    district: 'Mangan',
    state: 'Sikkim',
    date: 'October 4, 2023',
    severity: 'Severe',
    rainfallTriggerMm: 240,
    fatalities: 42,
    displaced: 5100,
    affectedInfrastructure: 'Teesta III Dam breach, 14 bridges washed away, NH-10 severed in 28 spots',
    geologicalTrigger: 'GLOF (Glacial Lake Outburst Flood) from South Lhonak lake inducing massive toe-undercutting landslides',
    mitigationTaken: 'Integrated early warning network with automatic satellite lake monitoring'
  },
  {
    id: 'HIST-2020-ML',
    location: 'Nongstoin-Mairang Highway KM 32',
    district: 'West Khasi Hills',
    state: 'Meghalaya',
    date: 'September 22, 2020',
    severity: 'Moderate',
    rainfallTriggerMm: 215,
    fatalities: 3,
    displaced: 350,
    affectedInfrastructure: 'State Highway severed, optical fiber cables disrupted',
    geologicalTrigger: 'Prolonged 5-day continuous rain causing rotational debris slump',
    mitigationTaken: 'Terraced cut slope with French drains and vetiver grass planting'
  },
  {
    id: 'HIST-2022-MN',
    location: 'Tupul Railway Yard & Camp',
    district: 'Noney',
    state: 'Manipur',
    date: 'June 30, 2022',
    severity: 'Severe',
    rainfallTriggerMm: 280,
    fatalities: 58,
    displaced: 900,
    affectedInfrastructure: 'Territorial Army camp buried, Ijai river dammed creating artificial reservoir',
    geologicalTrigger: 'Huge debris avalanche down steep deforested slope during heavy southwest monsoon',
    mitigationTaken: 'EWS sensor network installation, compulsory geotechnical survey for hill railway works'
  }
];

export const DEMO_NOTIFICATIONS: NotificationItem[] = [
  {
    id: 'NOTIF-01',
    title: 'Critical Risk Escalation: Sohra-Shella Escarpment',
    message: 'AI Risk Score reached 88/100 following 184.6mm rainfall. Automated alert Level-3 triggered.',
    timestamp: '8 mins ago',
    type: 'critical',
    read: false,
    linkTo: 'alerts'
  },
  {
    id: 'NOTIF-02',
    title: 'Pore Pressure Warning: Dima Hasao Ch. 44',
    message: 'Soil saturation reached 86.1%, exceeding safe threshold. Rail transit speed restriction suggested.',
    timestamp: '25 mins ago',
    type: 'warning',
    read: false,
    linkTo: 'monitoring'
  },
  {
    id: 'NOTIF-03',
    title: 'Automated Weather Sync: IMD Grid Updated',
    message: 'Monsoon depression over Bay of Bengal pushing active rain band into South Assam and Meghalaya.',
    timestamp: '42 mins ago',
    type: 'info',
    read: true,
    linkTo: 'monitoring'
  },
  {
    id: 'NOTIF-04',
    title: 'Alert Resolved: Tawang Sela Approach',
    message: 'Project Vartak completed boulder clearance; slope sensor stability restored to safe threshold.',
    timestamp: '2 hours ago',
    type: 'success',
    read: true,
    linkTo: 'alerts'
  }
];

export const HOURLY_SENSOR_DATA: SensorTelemetry[] = [
  { timestamp: '00:00', rainfall: 8.2, soilMoisture: 68.0, groundMovement: 0.8, slopeFactorOfSafety: 1.35, temperature: 19.4 },
  { timestamp: '02:00', rainfall: 12.5, soilMoisture: 71.2, groundMovement: 1.0, slopeFactorOfSafety: 1.30, temperature: 18.8 },
  { timestamp: '04:00', rainfall: 22.0, soilMoisture: 75.4, groundMovement: 1.4, slopeFactorOfSafety: 1.22, temperature: 18.2 },
  { timestamp: '06:00', rainfall: 38.6, soilMoisture: 80.1, groundMovement: 2.1, slopeFactorOfSafety: 1.11, temperature: 18.0 },
  { timestamp: '08:00', rainfall: 54.2, soilMoisture: 85.8, groundMovement: 3.5, slopeFactorOfSafety: 0.98, temperature: 18.6 },
  { timestamp: '10:00', rainfall: 34.0, soilMoisture: 87.2, groundMovement: 4.2, slopeFactorOfSafety: 0.94, temperature: 19.2 },
  { timestamp: '12:00', rainfall: 15.1, soilMoisture: 88.5, groundMovement: 4.8, slopeFactorOfSafety: 0.91, temperature: 20.1 }
];

export const DAILY_TREND_DATA = [
  { day: 'Day -6', rainfall: 32, riskAvg: 38, alerts: 1 },
  { day: 'Day -5', rainfall: 45, riskAvg: 42, alerts: 2 },
  { day: 'Day -4', rainfall: 78, riskAvg: 54, alerts: 3 },
  { day: 'Day -3', rainfall: 110, riskAvg: 68, alerts: 5 },
  { day: 'Day -2', rainfall: 145, riskAvg: 77, alerts: 8 },
  { day: 'Yesterday', rainfall: 168, riskAvg: 82, alerts: 11 },
  { day: 'Today', rainfall: 184, riskAvg: 85, alerts: 12 }
];

export const NER_STATES_SUMMARY = [
  { state: 'Meghalaya', totalZones: 18, highRisk: 4, mediumRisk: 6, lowRisk: 8, avgRainfall: 142.5, status: 'HIGH RISK' },
  { state: 'Assam', totalZones: 24, highRisk: 3, mediumRisk: 7, lowRisk: 14, avgRainfall: 98.2, status: 'HIGH RISK' },
  { state: 'Sikkim', totalZones: 14, highRisk: 2, mediumRisk: 5, lowRisk: 7, avgRainfall: 112.0, status: 'HIGH RISK' },
  { state: 'Nagaland', totalZones: 12, highRisk: 2, mediumRisk: 3, lowRisk: 7, avgRainfall: 86.4, status: 'MEDIUM RISK' },
  { state: 'Mizoram', totalZones: 11, highRisk: 1, mediumRisk: 4, lowRisk: 6, avgRainfall: 104.1, status: 'MEDIUM RISK' },
  { state: 'Arunachal Pradesh', totalZones: 16, highRisk: 0, mediumRisk: 5, lowRisk: 11, avgRainfall: 64.0, status: 'MEDIUM RISK' },
  { state: 'Manipur', totalZones: 10, highRisk: 0, mediumRisk: 3, lowRisk: 7, avgRainfall: 52.8, status: 'LOW RISK' },
  { state: 'Tripura', totalZones: 8, highRisk: 0, mediumRisk: 1, lowRisk: 7, avgRainfall: 28.5, status: 'LOW RISK' }
];

export const MOCK_ZONES = INITIAL_ZONES;
export const MOCK_ALERTS = INITIAL_ALERTS;
export const MOCK_INFRASTRUCTURE = INITIAL_INFRASTRUCTURE;
export const HISTORICAL_INCIDENTS = HISTORICAL_LANDSLIDES;
export const STATE_RISK_DISTRIBUTION = NER_STATES_SUMMARY;

export const INITIAL_SETTINGS: SystemSettings = {
  thresholds: {
    lowMax: 30,
    mediumMax: 60,
    highMin: 61,
  },
  alertSensitivity: 'Balanced',
  notifications: {
    smsEnabled: true,
    ivrEnabled: true,
    pushEnabled: true,
    sirenEnabled: true,
  },
  dataSources: {
    imdRainfall: true,
    satelliteMoisture: true,
    groundSensors: true,
    seismicData: true,
  },
};

export const INITIAL_NOTIFICATIONS = [
  {
    id: 'NOTIF-01',
    title: 'CRITICAL EARLY WARNING: Sohra Escarpment',
    message: 'Precipitation exceeded 214mm/24h. Slope shear stress reached 1.42 with 89% saturation. Evacuation advisory dispatched.',
    timestamp: '10 mins ago',
    type: 'critical' as const,
    read: false,
    linkTo: 'warnings'
  },
  {
    id: 'NOTIF-02',
    title: 'INFRASTRUCTURE ADVISORY: NH-6 Sonapur Tunnel Approach',
    message: 'Active debris flow triggered partial carriageway restriction. BRO equipment in transit.',
    timestamp: '25 mins ago',
    type: 'warning' as const,
    read: false,
    linkTo: 'infrastructure'
  },
  {
    id: 'NOTIF-03',
    title: 'RADAR GRID UPDATE: IMD Cherrapunji Doppler Synced',
    message: 'Rainfall nowcasting feed updated with 1km resolution radar reflectivity grid.',
    timestamp: '1 hour ago',
    type: 'info' as const,
    read: true,
    linkTo: 'monitoring'
  },
  {
    id: 'NOTIF-04',
    title: 'SYSTEM TELEMETRY: 48 Ground IoT Inclinometers Online',
    message: 'Telemetry network health optimal at 99.4% packet delivery rate.',
    timestamp: '2 hours ago',
    type: 'success' as const,
    read: true,
    linkTo: 'monitoring'
  }
];


