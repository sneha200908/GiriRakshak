import React, { useState, useMemo } from 'react';
import { 
  FileText, 
  Printer, 
  CheckCircle2, 
  FileSpreadsheet, 
  ShieldAlert, 
  Clock, 
  Layers, 
  MapPin, 
  TrendingUp, 
  AlertTriangle, 
  Building2, 
  Truck, 
  Activity, 
  Info,
  Maximize2,
  X,
  Calendar,
  Share2,
  Database,
  Radio
} from 'lucide-react';
import { LocationZone, EarlyWarningAlert } from '../types';
import { 
  generateDailyBulletin, 
  generateWeeklyAssessment, 
  generateEmergencyBriefing,
  DailyBulletinData,
  WeeklyAssessmentData,
  EmergencyBriefingData
} from './reports/reportGenerators';

interface ReportsCenterProps {
  zones: LocationZone[];
  alerts: EarlyWarningAlert[];
}

export const ReportsCenter: React.FC<ReportsCenterProps> = ({ zones, alerts }) => {
  const [selectedReportType, setSelectedReportType] = useState<'daily' | 'weekly' | 'emergency'>('daily');
  const [downloadSuccess, setDownloadSuccess] = useState<string | null>(null);
  const [isPreviewModalOpen, setIsPreviewModalOpen] = useState(false);

  // Generate distinct report data based on current state
  const dailyData = useMemo(() => generateDailyBulletin(zones, alerts), [zones, alerts]);
  const weeklyData = useMemo(() => generateWeeklyAssessment(zones, alerts), [zones, alerts]);
  const emergencyData = useMemo(() => generateEmergencyBriefing(zones, alerts), [zones, alerts]);

  // Export CSV Handler customized for each distinct report
  const handleDownloadCSV = () => {
    let filename = '';
    let csvRows: string[][] = [];

    if (selectedReportType === 'daily') {
      filename = `GiriRakshak_Daily_Bulletin_${new Date().toISOString().slice(0, 10)}.csv`;
      csvRows = [
        ['GIRIRAKSHAK AI - DAILY LANDSLIDE RISK BULLETIN (SIMULATED DEMO DATA)'],
        ['Reference', dailyData.refNumber],
        ['Generated Date', dailyData.generatedDate],
        ['Region', dailyData.region],
        ['Operational Status', dailyData.operationalStatus],
        [],
        ['Zone ID', 'Zone Name', 'District', 'State', 'Risk Level', 'Risk Score', '24h Rain (mm)', 'Soil Moisture (%)', 'Ground Movement (mm/day)', 'Primary Vulnerability', 'Status'],
        ...dailyData.riskTable.map(r => [
          r.zoneId,
          `"${r.zoneName}"`,
          `"${r.district}"`,
          `"${r.state}"`,
          r.riskLevel,
          r.riskScore.toString(),
          r.rain24h.toString(),
          r.soilSaturation.toString(),
          r.groundMovement.toString(),
          `"${r.primaryVulnerability}"`,
          r.status
        ]),
        [],
        ['Active Early Warnings'],
        ['Alert ID', 'Location', 'District', 'State', 'Severity', 'Risk Score', 'Trigger', 'Status'],
        ...dailyData.activeWarnings.map(a => [
          a.id,
          `"${a.location}"`,
          `"${a.district}"`,
          `"${a.state}"`,
          a.alertState,
          a.riskScore.toString(),
          `"${a.trigger.replace(/"/g, '""')}"`,
          a.status
        ])
      ];
    } else if (selectedReportType === 'weekly') {
      filename = `GiriRakshak_Weekly_Threat_Assessment_${new Date().toISOString().slice(0, 10)}.csv`;
      csvRows = [
        ['GIRIRAKSHAK AI - WEEKLY REGIONAL THREAT ASSESSMENT (SIMULATED DEMO DATA)'],
        ['Reference', weeklyData.refNumber],
        ['Generated Date', weeklyData.generatedDate],
        ['Period', weeklyData.reportingPeriod],
        [],
        ['7-Day Progression Trend'],
        ['Day', 'Date', 'Avg Risk Score', 'Max 24h Rain (mm)', 'Active Warnings', 'Critical Warnings', 'Road Incidents'],
        ...weeklyData.weeklyTrend.map(t => [
          t.day,
          t.date,
          t.avgRiskScore.toString(),
          t.maxRain24h.toString(),
          t.activeWarnings.toString(),
          t.criticalWarnings.toString(),
          t.roadIncidents.toString()
        ]),
        [],
        ['Top Hazard Corridors'],
        ['Corridor Name', 'Length', 'Vulnerability Index', 'Failure Mechanism', 'Exposure Level', 'Infrastructure Impact'],
        ...weeklyData.topRiskCorridors.map(c => [
          `"${c.name}"`,
          c.corridorLength,
          c.vulnerabilityIndex.toString(),
          `"${c.primaryFailureMechanism}"`,
          c.exposureLevel,
          `"${c.infrastructureImpact}"`
        ]),
        [],
        ['State 7-Day Cumulative Rainfall Distribution'],
        ['State', '7-Day Rain (mm)', 'Historical Mean (mm)', 'Anomaly', 'Soil Saturation'],
        ...weeklyData.stateRainfallDistribution.map(s => [
          s.state,
          s.rain7d.toString(),
          s.historicalMean.toString(),
          s.anomalyPercent,
          s.saturationLevel
        ])
      ];
    } else {
      filename = `GiriRakshak_Emergency_Situation_Briefing_${new Date().toISOString().slice(0, 10)}.csv`;
      csvRows = [
        ['GIRIRAKSHAK AI - SDMA EMERGENCY SITUATION BRIEFING (SIMULATED DEMO DATA)'],
        ['Reference', emergencyData.refNumber],
        ['Briefing Time', `${emergencyData.generatedDate} ${emergencyData.briefingTime}`],
        ['Operational Classification', emergencyData.operationalLevel],
        [],
        ['Active Critical Incident Register'],
        ['Alert ID', 'Location', 'District', 'State', 'Severity', 'Risk Score', 'Response Status', 'Field Command', 'Evacuation Status'],
        ...emergencyData.criticalIncidents.map(ci => [
          ci.alert.id,
          `"${ci.alert.location}"`,
          `"${ci.alert.district}"`,
          `"${ci.alert.state}"`,
          ci.alert.alertState,
          ci.alert.riskScore.toString(),
          ci.responseStatus,
          `"${ci.fieldCommand}"`,
          `"${ci.evacuationStatus}"`
        ]),
        [],
        ['Lifeline Infrastructure Impact Matrix'],
        ['Asset Name', 'Type', 'Operational Status', 'Impact Details', 'Agency Lead'],
        ...emergencyData.infrastructureImpactMatrix.map(im => [
          `"${im.assetName}"`,
          im.type,
          im.status,
          `"${im.impactDetails}"`,
          `"${im.agencyLead}"`
        ])
      ];
    }

    const csvContent = 'data:text/csv;charset=utf-8,' + csvRows.map(row => row.join(',')).join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', filename);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    setDownloadSuccess(`CSV file "${filename}" successfully generated and downloaded.`);
    setTimeout(() => setDownloadSuccess(null), 3500);
  };

  const handlePrintPDF = () => {
    window.print();
    setDownloadSuccess('Print and PDF export dialog initialized.');
    setTimeout(() => setDownloadSuccess(null), 3500);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      
      {/* Top Banner Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 p-6 rounded-2xl bg-[var(--bg-surface)] border border-[var(--border-app)] shadow-sm print:hidden">
        <div className="space-y-1">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold uppercase tracking-wider bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20">
              SIMULATED DEMONSTRATION REPORTS
            </span>
            <span className="text-xs font-mono text-[var(--text-muted)] hidden sm:inline">
              Disaster Decision-Support Intelligence
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[var(--text-primary)] tracking-tight">
            Official Landslide Risk Reports & Bulletins
          </h1>
          <p className="text-xs sm:text-sm text-[var(--text-secondary)] max-w-2xl">
            Synthesize situational reports, export geospatial decision matrices for emergency responders, and archive hydro-geological threat dossiers.
          </p>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2 flex-wrap">
          <button
            id="report-preview-btn"
            onClick={() => setIsPreviewModalOpen(true)}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[var(--bg-surface-secondary)] hover:bg-[var(--border-subtle)] text-[var(--text-primary)] text-xs font-bold border border-[var(--border-app)] transition-all shadow-sm"
          >
            <Maximize2 className="w-4 h-4 text-cyan-500" />
            <span>Full Document Preview</span>
          </button>

          <button
            id="export-csv-btn"
            onClick={handleDownloadCSV}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[var(--bg-surface-secondary)] hover:bg-[var(--border-subtle)] text-[var(--text-primary)] text-xs font-bold border border-[var(--border-app)] transition-all shadow-sm"
          >
            <FileSpreadsheet className="w-4 h-4 text-emerald-500" />
            <span>Export CSV</span>
          </button>

          <button
            id="print-pdf-btn"
            onClick={handlePrintPDF}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-bold transition-all shadow-md shadow-cyan-900/20"
          >
            <Printer className="w-4 h-4" />
            <span>Print / Save PDF</span>
          </button>
        </div>
      </div>

      {downloadSuccess && (
        <div className="p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-700 dark:text-emerald-300 text-xs font-semibold flex items-center gap-2 print:hidden">
          <CheckCircle2 className="w-4 h-4 text-emerald-500 flex-shrink-0" />
          <span>{downloadSuccess}</span>
        </div>
      )}

      {/* Report Template Selector Tabs */}
      <div className="flex items-center gap-2 border-b border-[var(--border-app)] pb-3 overflow-x-auto print:hidden">
        <button
          id="tab-daily-bulletin"
          onClick={() => setSelectedReportType('daily')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap flex items-center gap-2 ${
            selectedReportType === 'daily'
              ? 'bg-cyan-600 text-white shadow-md'
              : 'bg-[var(--bg-surface)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] border border-[var(--border-app)]'
          }`}
        >
          <Clock className="w-4 h-4" />
          <span>Daily Landslide Risk Bulletin (24h)</span>
        </button>

        <button
          id="tab-weekly-assessment"
          onClick={() => setSelectedReportType('weekly')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap flex items-center gap-2 ${
            selectedReportType === 'weekly'
              ? 'bg-cyan-600 text-white shadow-md'
              : 'bg-[var(--bg-surface)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] border border-[var(--border-app)]'
          }`}
        >
          <Calendar className="w-4 h-4" />
          <span>Weekly Regional Threat Assessment (7-Day)</span>
        </button>

        <button
          id="tab-emergency-briefing"
          onClick={() => setSelectedReportType('emergency')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap flex items-center gap-2 ${
            selectedReportType === 'emergency'
              ? 'bg-red-600 text-white shadow-md'
              : 'bg-[var(--bg-surface)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] border border-[var(--border-app)]'
          }`}
        >
          <ShieldAlert className="w-4 h-4" />
          <span>SDMA Emergency Situation Briefing</span>
        </button>
      </div>

      {/* Render Document Body */}
      <div className="print-document-container p-6 sm:p-10 rounded-2xl bg-[var(--bg-surface)] border border-[var(--border-app)] shadow-sm space-y-8 text-[var(--text-primary)] transition-colors">
        
        {/* MANDATORY SIMULATED NOTICE BANNER */}
        <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-800 dark:text-amber-200 text-xs flex items-center justify-between">
          <div className="flex items-center gap-2 font-bold">
            <span className="px-2 py-0.5 rounded bg-amber-500/20 uppercase tracking-widest text-[10px]">
              DEMO MODE — SIMULATED REPORT
            </span>
            <span>GiriRakshak AI Decision-Support Platform</span>
          </div>
          <span className="text-[11px] text-amber-700 dark:text-amber-300 hidden sm:inline">
            Non-Official Synthetic Advisory
          </span>
        </div>

        {/* 1. DOCUMENT HEADER */}
        <div className="border-b-2 border-[var(--border-app)] pb-5 flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
          <div className="space-y-1">
            <div className="text-[11px] font-mono uppercase tracking-widest text-cyan-600 dark:text-cyan-400 font-bold">
              GIRIRAKSHAK AI • REGIONAL DISASTER DECISION-SUPPORT REPORT
            </div>
            <h2 className="text-xl sm:text-2xl font-black tracking-tight text-[var(--text-primary)]">
              {selectedReportType === 'daily' && 'Daily Landslide Risk & Hazard Bulletin'}
              {selectedReportType === 'weekly' && 'Weekly Regional Threat & Geotechnical Assessment'}
              {selectedReportType === 'emergency' && 'Emergency Geotechnical Incident Situation Briefing'}
            </h2>
            <p className="text-xs text-[var(--text-secondary)]">
              North Eastern Regional Operational Decision Support Grid • NER Hub
            </p>
          </div>

          <div className="text-left sm:text-right text-xs space-y-1 font-mono text-[var(--text-secondary)]">
            <div className="font-bold text-[var(--text-primary)]">
              Ref: {selectedReportType === 'daily' ? dailyData.refNumber : selectedReportType === 'weekly' ? weeklyData.refNumber : emergencyData.refNumber}
            </div>
            <div>Generated: {selectedReportType === 'daily' ? dailyData.generatedDate : selectedReportType === 'weekly' ? weeklyData.generatedDate : `${emergencyData.generatedDate}, ${emergencyData.briefingTime}`}</div>
            <div>Scope: North Eastern Region (8 States)</div>
          </div>
        </div>

        {/* 2. DYNAMIC CONTENT PER SELECTED REPORT */}

        {/* ================= REPORT 1: DAILY BULLETIN ================= */}
        {selectedReportType === 'daily' && (
          <div className="space-y-8">
            {/* Executive Summary */}
            <div className="space-y-2">
              <h3 className="text-xs font-bold uppercase tracking-wider text-cyan-600 dark:text-cyan-400 flex items-center gap-1.5">
                <Info className="w-4 h-4" />
                <span>1. Daily Operational Overview & Status</span>
              </h3>
              <div className="p-4 rounded-xl bg-[var(--bg-surface-secondary)] border border-[var(--border-app)] space-y-2">
                <div className="flex items-center gap-3 flex-wrap">
                  <span className="px-2.5 py-0.5 rounded text-xs font-bold bg-red-500/10 text-red-600 dark:text-red-400 border border-red-500/30">
                    {dailyData.operationalStatus}
                  </span>
                  <span className="text-xs font-mono text-[var(--text-secondary)]">
                    Period: {dailyData.reportingPeriod}
                  </span>
                </div>
                <p className="text-xs sm:text-sm text-[var(--text-secondary)] leading-relaxed">
                  {dailyData.executiveSummary}
                </p>
              </div>
            </div>

            {/* Weather & Rainfall Observations */}
            <div className="space-y-3">
              <h3 className="text-xs font-bold uppercase tracking-wider text-cyan-600 dark:text-cyan-400 flex items-center gap-1.5">
                <Activity className="w-4 h-4" />
                <span>2. 24-Hour Hydro-Meteorological Observations</span>
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {dailyData.rainfallOverview.map((rf, idx) => (
                  <div key={idx} className="p-3 rounded-xl bg-[var(--bg-surface-secondary)] border border-[var(--border-app)] space-y-1">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-bold text-[var(--text-primary)]">{rf.zoneName}</span>
                      <span className={`px-1.5 py-0.5 rounded text-[10px] font-mono ${
                        rf.trend === 'Rising' ? 'bg-red-500/10 text-red-600 dark:text-red-400' : 'bg-amber-500/10 text-amber-600 dark:text-amber-400'
                      }`}>
                        {rf.trend}
                      </span>
                    </div>
                    <div className="text-[11px] text-[var(--text-muted)]">{rf.district}, {rf.state}</div>
                    <div className="text-lg font-bold font-mono text-cyan-600 dark:text-cyan-400 pt-1">
                      {rf.rain24h} mm <span className="text-xs font-normal text-[var(--text-muted)]">/ 24h</span>
                    </div>
                    <div className="text-[10px] text-[var(--text-muted)] font-mono">{rf.rainRate}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Full Landslide Risk Table */}
            <div className="space-y-3">
              <h3 className="text-xs font-bold uppercase tracking-wider text-cyan-600 dark:text-cyan-400 flex items-center gap-1.5">
                <Layers className="w-4 h-4" />
                <span>3. Current Regional Geotechnical Risk Matrix</span>
              </h3>
              <div className="overflow-x-auto border border-[var(--border-app)] rounded-xl">
                <table className="w-full text-left text-xs">
                  <thead className="bg-[var(--bg-surface-secondary)] text-[var(--text-muted)] text-[10px] font-semibold uppercase tracking-wider">
                    <tr>
                      <th className="py-2.5 px-3">Zone / Corridor</th>
                      <th className="py-2.5 px-3">State</th>
                      <th className="py-2.5 px-3">Risk Level</th>
                      <th className="py-2.5 px-3">Score</th>
                      <th className="py-2.5 px-3">24h Rain</th>
                      <th className="py-2.5 px-3">Soil Sat.</th>
                      <th className="py-2.5 px-3">Movement</th>
                      <th className="py-2.5 px-3">Primary Vulnerability</th>
                      <th className="py-2.5 px-3">Operational Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[var(--border-app)]">
                    {dailyData.riskTable.map(r => (
                      <tr key={r.zoneId} className="hover:bg-[var(--bg-surface-secondary)]/50">
                        <td className="py-2.5 px-3 font-semibold text-[var(--text-primary)]">
                          {r.zoneName} ({r.district})
                        </td>
                        <td className="py-2.5 px-3 text-[var(--text-secondary)]">{r.state}</td>
                        <td className="py-2.5 px-3 font-bold">
                          <span className={`px-2 py-0.5 rounded text-[10px] ${
                            r.riskLevel === 'HIGH' ? 'bg-red-500/10 text-red-600 dark:text-red-400 border border-red-500/20' :
                            r.riskLevel === 'MEDIUM' ? 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20' :
                            'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20'
                          }`}>
                            {r.riskLevel}
                          </span>
                        </td>
                        <td className="py-2.5 px-3 font-mono font-bold">{r.riskScore}/100</td>
                        <td className="py-2.5 px-3 font-mono text-cyan-600 dark:text-cyan-400">{r.rain24h} mm</td>
                        <td className="py-2.5 px-3 font-mono text-amber-600 dark:text-amber-400">{r.soilSaturation}%</td>
                        <td className="py-2.5 px-3 font-mono text-[var(--text-secondary)]">{r.groundMovement} mm/d</td>
                        <td className="py-2.5 px-3 text-[var(--text-secondary)]">{r.primaryVulnerability}</td>
                        <td className="py-2.5 px-3">
                          <span className="font-mono text-[11px] text-[var(--text-secondary)]">{r.status}</span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Active Early Warnings */}
            <div className="space-y-3">
              <h3 className="text-xs font-bold uppercase tracking-wider text-red-600 dark:text-red-400 flex items-center gap-1.5">
                <ShieldAlert className="w-4 h-4" />
                <span>4. Active Early Warning Dispatches ({dailyData.activeWarnings.length} Active)</span>
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {dailyData.activeWarnings.map(w => (
                  <div key={w.id} className="p-4 rounded-xl bg-[var(--bg-surface-secondary)] border border-[var(--border-app)] space-y-2">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-mono font-bold text-cyan-600 dark:text-cyan-400">{w.id}</span>
                      <span className={`px-2 py-0.5 rounded text-[10px] font-black uppercase ${
                        w.alertState === 'Critical' ? 'bg-red-500 text-white' : 'bg-amber-500 text-slate-950'
                      }`}>
                        {w.alertState}
                      </span>
                    </div>
                    <div className="text-sm font-bold text-[var(--text-primary)]">{w.location}</div>
                    <div className="text-xs text-[var(--text-secondary)]">
                      <strong className="text-amber-600 dark:text-amber-400">Trigger:</strong> {w.trigger}
                    </div>
                    <div className="text-[11px] text-[var(--text-muted)] pt-1 border-t border-[var(--border-app)] flex items-center justify-between">
                      <span>Affected Habitations: {w.affectedPopulationEst.toLocaleString()}</span>
                      <span>Confidence: {w.aiConfidence}%</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Key Changes & Monitoring Priorities */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 rounded-xl bg-[var(--bg-surface-secondary)] border border-[var(--border-app)] space-y-2">
                <h4 className="text-xs font-bold uppercase tracking-wider text-[var(--text-primary)] flex items-center gap-1.5">
                  <TrendingUp className="w-4 h-4 text-cyan-500" />
                  <span>Key Changes in Last 24 Hours</span>
                </h4>
                <ul className="list-disc list-inside space-y-1.5 text-xs text-[var(--text-secondary)]">
                  {dailyData.keyChangesLast24h.map((ch, i) => (
                    <li key={i}>{ch}</li>
                  ))}
                </ul>
              </div>

              <div className="p-4 rounded-xl bg-[var(--bg-surface-secondary)] border border-[var(--border-app)] space-y-2">
                <h4 className="text-xs font-bold uppercase tracking-wider text-[var(--text-primary)] flex items-center gap-1.5">
                  <ShieldAlert className="w-4 h-4 text-amber-500" />
                  <span>24-Hour Field Monitoring Priorities</span>
                </h4>
                <ul className="list-disc list-inside space-y-1.5 text-xs text-[var(--text-secondary)]">
                  {dailyData.monitoringPriorities.map((mp, i) => (
                    <li key={i}>{mp}</li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Data Provenance Table */}
            <div className="space-y-2">
              <h4 className="text-xs font-bold uppercase tracking-wider text-[var(--text-muted)]">
                Authoritative Sensor & Remote Sensing Sources
              </h4>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
                {dailyData.dataSources.map((ds, idx) => (
                  <div key={idx} className="p-2.5 rounded-lg bg-[var(--bg-surface-secondary)] border border-[var(--border-app)]">
                    <div className="font-bold text-[var(--text-primary)] truncate">{ds.source}</div>
                    <div className="text-[10px] text-[var(--text-muted)]">{ds.type}</div>
                    <div className="text-[10px] font-mono text-cyan-600 dark:text-cyan-400 mt-1">{ds.lastPing}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ================= REPORT 2: WEEKLY ASSESSMENT ================= */}
        {selectedReportType === 'weekly' && (
          <div className="space-y-8">
            {/* Executive Summary */}
            <div className="space-y-2">
              <h3 className="text-xs font-bold uppercase tracking-wider text-cyan-600 dark:text-cyan-400 flex items-center gap-1.5">
                <Info className="w-4 h-4" />
                <span>1. 7-Day Regional Trend Summary</span>
              </h3>
              <div className="p-4 rounded-xl bg-[var(--bg-surface-secondary)] border border-[var(--border-app)] space-y-2">
                <p className="text-xs sm:text-sm text-[var(--text-secondary)] leading-relaxed">
                  {weeklyData.executiveSummary}
                </p>
              </div>
            </div>

            {/* 7-Day Trend Evolution Table */}
            <div className="space-y-3">
              <h3 className="text-xs font-bold uppercase tracking-wider text-cyan-600 dark:text-cyan-400 flex items-center gap-1.5">
                <TrendingUp className="w-4 h-4" />
                <span>2. Weekly Risk Evolution & Precipitation Progression</span>
              </h3>
              <div className="overflow-x-auto border border-[var(--border-app)] rounded-xl">
                <table className="w-full text-left text-xs">
                  <thead className="bg-[var(--bg-surface-secondary)] text-[var(--text-muted)] text-[10px] font-semibold uppercase tracking-wider">
                    <tr>
                      <th className="py-2.5 px-3">Day / Date</th>
                      <th className="py-2.5 px-3">Regional Avg Risk</th>
                      <th className="py-2.5 px-3">Peak 24h Rain</th>
                      <th className="py-2.5 px-3">Active Warnings</th>
                      <th className="py-2.5 px-3">Critical Warnings</th>
                      <th className="py-2.5 px-3">Road Disruption Events</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[var(--border-app)]">
                    {weeklyData.weeklyTrend.map(t => (
                      <tr key={t.date} className="hover:bg-[var(--bg-surface-secondary)]/50">
                        <td className="py-2.5 px-3 font-semibold text-[var(--text-primary)]">
                          {t.day} ({t.date})
                        </td>
                        <td className="py-2.5 px-3 font-mono font-bold">
                          <span className={`px-2 py-0.5 rounded text-[10px] ${
                            t.avgRiskScore >= 80 ? 'bg-red-500/10 text-red-600 dark:text-red-400' :
                            t.avgRiskScore >= 65 ? 'bg-amber-500/10 text-amber-600 dark:text-amber-400' :
                            'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400'
                          }`}>
                            {t.avgRiskScore}/100
                          </span>
                        </td>
                        <td className="py-2.5 px-3 font-mono text-cyan-600 dark:text-cyan-400">{t.maxRain24h} mm</td>
                        <td className="py-2.5 px-3 font-mono">{t.activeWarnings}</td>
                        <td className="py-2.5 px-3 font-mono text-red-600 dark:text-red-400 font-bold">{t.criticalWarnings}</td>
                        <td className="py-2.5 px-3 font-mono">{t.roadIncidents}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Top 5 Risk Corridors */}
            <div className="space-y-3">
              <h3 className="text-xs font-bold uppercase tracking-wider text-red-600 dark:text-red-400 flex items-center gap-1.5">
                <ShieldAlert className="w-4 h-4" />
                <span>3. Top Regional Threat Corridors (Vulnerability Index Ranking)</span>
              </h3>
              <div className="space-y-2">
                {weeklyData.topRiskCorridors.map((rc, idx) => (
                  <div key={idx} className="p-3.5 rounded-xl bg-[var(--bg-surface-secondary)] border border-[var(--border-app)] flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-bold text-xs text-cyan-600 dark:text-cyan-400">#{idx + 1}</span>
                        <span className="font-bold text-sm text-[var(--text-primary)]">{rc.name}</span>
                        <span className="text-xs font-mono text-[var(--text-muted)]">({rc.corridorLength})</span>
                      </div>
                      <div className="text-xs text-[var(--text-secondary)]">
                        <strong>Mechanism:</strong> {rc.primaryFailureMechanism}
                      </div>
                      <div className="text-[11px] text-[var(--text-muted)]">
                        <strong>Impact:</strong> {rc.infrastructureImpact}
                      </div>
                    </div>
                    <div className="text-right sm:flex-shrink-0">
                      <div className="text-xs font-mono text-[var(--text-muted)]">Vulnerability</div>
                      <div className="text-xl font-black font-mono text-red-600 dark:text-red-400">
                        {rc.vulnerabilityIndex}/100
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* State Rainfall Distribution & Historical Comparison */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* State Rainfall */}
              <div className="p-4 rounded-xl bg-[var(--bg-surface-secondary)] border border-[var(--border-app)] space-y-3">
                <h4 className="text-xs font-bold uppercase tracking-wider text-[var(--text-primary)]">
                  7-Day State Rainfall Anomalies
                </h4>
                <div className="space-y-2 text-xs">
                  {weeklyData.stateRainfallDistribution.map(s => (
                    <div key={s.state} className="flex items-center justify-between p-2 rounded-lg bg-[var(--bg-surface)] border border-[var(--border-app)]">
                      <div>
                        <span className="font-bold text-[var(--text-primary)]">{s.state}</span>
                        <span className="text-[10px] text-[var(--text-muted)] block">Mean: {s.historicalMean}mm</span>
                      </div>
                      <div className="text-right">
                        <span className="font-mono font-bold text-cyan-600 dark:text-cyan-400">{s.rain7d} mm</span>
                        <span className={`text-[10px] font-mono block ${s.anomalyPercent.startsWith('+') ? 'text-red-500' : 'text-emerald-500'}`}>
                          {s.anomalyPercent}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Historical Comparison */}
              <div className="p-4 rounded-xl bg-[var(--bg-surface-secondary)] border border-[var(--border-app)] space-y-3">
                <h4 className="text-xs font-bold uppercase tracking-wider text-[var(--text-primary)]">
                  Historical Baseline vs. Current Episode
                </h4>
                <div className="space-y-2.5 text-xs">
                  {weeklyData.historicalComparison.map((hc, i) => (
                    <div key={i} className="p-2.5 rounded-lg bg-[var(--bg-surface)] border border-[var(--border-app)] space-y-1">
                      <div className="font-bold text-[var(--text-primary)]">{hc.metric}</div>
                      <div className="flex items-center justify-between text-[11px] font-mono">
                        <span className="text-cyan-600 dark:text-cyan-400">Current: {hc.currentWeek}</span>
                        <span className="text-[var(--text-muted)]">Monsoon 2022: {hc.comparativeMonsoon2022}</span>
                      </div>
                      <div className="text-[11px] text-[var(--text-secondary)]">{hc.interpretation}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Warning Lifecycle & Next Week Outlook */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 rounded-xl bg-[var(--bg-surface-secondary)] border border-[var(--border-app)] space-y-2">
                <h4 className="text-xs font-bold uppercase tracking-wider text-[var(--text-primary)]">
                  Weekly Warning Lifecycle Tracking
                </h4>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  {weeklyData.warningLifecycle.map((wl, i) => (
                    <div key={i} className="p-2.5 rounded-lg bg-[var(--bg-surface)] border border-[var(--border-app)]">
                      <div className="text-lg font-bold font-mono text-cyan-600 dark:text-cyan-400">{wl.count}</div>
                      <div className="font-semibold text-[var(--text-primary)] text-[11px]">{wl.category}</div>
                      <div className="text-[10px] text-[var(--text-muted)] truncate">{wl.details}</div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="p-4 rounded-xl bg-[var(--bg-surface-secondary)] border border-[var(--border-app)] space-y-2">
                <h4 className="text-xs font-bold uppercase tracking-wider text-[var(--text-primary)]">
                  Next 7-Day Operational Outlook
                </h4>
                <ul className="list-disc list-inside space-y-1.5 text-xs text-[var(--text-secondary)]">
                  {weeklyData.nextWeekOutlook.map((ow, i) => (
                    <li key={i}>{ow}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        )}

        {/* ================= REPORT 3: EMERGENCY BRIEFING ================= */}
        {selectedReportType === 'emergency' && (
          <div className="space-y-8">
            {/* Situation Summary */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <h3 className="text-xs font-bold uppercase tracking-wider text-red-600 dark:text-red-400 flex items-center gap-1.5">
                  <ShieldAlert className="w-4 h-4" />
                  <span>1. Immediate Incident Command Briefing</span>
                </h3>
                <span className="px-2.5 py-0.5 rounded text-xs font-black uppercase bg-red-600 text-white">
                  {emergencyData.operationalLevel}
                </span>
              </div>
              <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/30 space-y-2">
                <p className="text-xs sm:text-sm text-[var(--text-primary)] leading-relaxed font-medium">
                  {emergencyData.situationSummary}
                </p>
              </div>
            </div>

            {/* Active Critical Incidents Dossier */}
            <div className="space-y-3">
              <h3 className="text-xs font-bold uppercase tracking-wider text-red-600 dark:text-red-400">
                2. Critical Incident Operational Register
              </h3>
              <div className="space-y-3">
                {emergencyData.criticalIncidents.map(ci => (
                  <div key={ci.alert.id} className="p-4 rounded-xl bg-[var(--bg-surface-secondary)] border border-[var(--border-app)] space-y-3">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 border-b border-[var(--border-app)] pb-2">
                      <div className="flex items-center gap-2">
                        <span className="px-2 py-0.5 rounded text-[10px] font-black uppercase bg-red-600 text-white">
                          {ci.alert.alertState}
                        </span>
                        <span className="font-mono font-bold text-sm text-[var(--text-primary)]">{ci.alert.location}</span>
                        <span className="text-xs font-mono text-[var(--text-muted)]">[{ci.alert.id}]</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-mono px-2 py-0.5 rounded bg-[var(--bg-surface)] text-cyan-600 dark:text-cyan-400 border border-[var(--border-app)] font-bold">
                          Status: {ci.responseStatus}
                        </span>
                        <span className="text-xs font-mono font-bold text-red-600 dark:text-red-400">
                          Score: {ci.alert.riskScore}/100
                        </span>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
                      <div className="p-2 rounded bg-[var(--bg-surface)] border border-[var(--border-app)]">
                        <span className="text-[10px] text-[var(--text-muted)] block">Precipitation Inflow</span>
                        <span className="font-mono font-bold text-cyan-600 dark:text-cyan-400">{ci.alert.environmentalTriggers.rainfallRate}</span>
                      </div>
                      <div className="p-2 rounded bg-[var(--bg-surface)] border border-[var(--border-app)]">
                        <span className="text-[10px] text-[var(--text-muted)] block">Soil Saturation</span>
                        <span className="font-mono font-bold text-amber-600 dark:text-amber-400">{ci.alert.environmentalTriggers.soilSaturation}</span>
                      </div>
                      <div className="p-2 rounded bg-[var(--bg-surface)] border border-[var(--border-app)]">
                        <span className="text-[10px] text-[var(--text-muted)] block">Surface Displacement</span>
                        <span className="font-mono font-bold text-red-600 dark:text-red-400">{ci.alert.environmentalTriggers.slopeDisplacement}</span>
                      </div>
                      <div className="p-2 rounded bg-[var(--bg-surface)] border border-[var(--border-app)]">
                        <span className="text-[10px] text-[var(--text-muted)] block">Shear Stress Ratio</span>
                        <span className="font-mono font-bold text-[var(--text-primary)]">{ci.alert.environmentalTriggers.shearStressRatio}</span>
                      </div>
                    </div>

                    <div className="text-xs text-[var(--text-secondary)] flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 pt-1">
                      <div><strong>Field Command:</strong> {ci.fieldCommand}</div>
                      <div><strong>Evacuation:</strong> {ci.evacuationStatus}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Lifeline Infrastructure Impact Table */}
            <div className="space-y-3">
              <h3 className="text-xs font-bold uppercase tracking-wider text-amber-600 dark:text-amber-400 flex items-center gap-1.5">
                <Truck className="w-4 h-4" />
                <span>3. Lifeline Infrastructure Impact Matrix</span>
              </h3>
              <div className="overflow-x-auto border border-[var(--border-app)] rounded-xl">
                <table className="w-full text-left text-xs">
                  <thead className="bg-[var(--bg-surface-secondary)] text-[var(--text-muted)] text-[10px] font-semibold uppercase tracking-wider">
                    <tr>
                      <th className="py-2.5 px-3">Asset / Route</th>
                      <th className="py-2.5 px-3">Type</th>
                      <th className="py-2.5 px-3">Operational Status</th>
                      <th className="py-2.5 px-3">Tactical Impact Details</th>
                      <th className="py-2.5 px-3">Agency Lead</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[var(--border-app)]">
                    {emergencyData.infrastructureImpactMatrix.map((im, idx) => (
                      <tr key={idx} className="hover:bg-[var(--bg-surface-secondary)]/50">
                        <td className="py-2.5 px-3 font-semibold text-[var(--text-primary)]">{im.assetName}</td>
                        <td className="py-2.5 px-3 text-[var(--text-secondary)]">{im.type}</td>
                        <td className="py-2.5 px-3 font-bold">
                          <span className="px-2 py-0.5 rounded text-[10px] bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20">
                            {im.status}
                          </span>
                        </td>
                        <td className="py-2.5 px-3 text-[var(--text-secondary)] max-w-sm">{im.impactDetails}</td>
                        <td className="py-2.5 px-3 text-[var(--text-muted)] font-mono text-[11px]">{im.agencyLead}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Agency Mobilization Matrix */}
            <div className="space-y-3">
              <h3 className="text-xs font-bold uppercase tracking-wider text-cyan-600 dark:text-cyan-400 flex items-center gap-1.5">
                <Building2 className="w-4 h-4" />
                <span>4. Inter-Agency Field Mobilization & Standby Assets</span>
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {emergencyData.agencyMobilization.map((am, i) => (
                  <div key={i} className="p-3.5 rounded-xl bg-[var(--bg-surface-secondary)] border border-[var(--border-app)] space-y-1.5">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-bold text-[var(--text-primary)]">{am.agency}</span>
                      <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                        {am.status}
                      </span>
                    </div>
                    <div className="text-xs text-[var(--text-secondary)]">{am.resources}</div>
                    <div className="text-[11px] text-[var(--text-muted)]">Station: {am.location}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Emergency Communication Dissemination Log */}
            <div className="p-4 rounded-xl bg-[var(--bg-surface-secondary)] border border-[var(--border-app)] space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-[var(--text-primary)] flex items-center gap-1.5">
                <Radio className="w-4 h-4 text-cyan-500" />
                <span>Emergency Public Communication & Alert Dissemination Status</span>
              </h4>
              <div className="space-y-2 text-xs">
                {emergencyData.communicationLog.map((cl, i) => (
                  <div key={i} className="flex flex-col sm:flex-row sm:items-center sm:justify-between p-2 rounded-lg bg-[var(--bg-surface)] border border-[var(--border-app)] gap-1">
                    <span className="font-semibold text-[var(--text-primary)]">{cl.channel}</span>
                    <div className="flex items-center gap-3 text-[11px] font-mono text-[var(--text-muted)]">
                      <span>Recipients: {cl.recipientCount}</span>
                      <span className="text-emerald-500">{cl.status}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* 3. SIGN-OFF BLOCK & FORMAL DISCLAIMER */}
        <div className="pt-6 border-t-2 border-[var(--border-app)] space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 text-xs text-[var(--text-secondary)]">
            <div>
              <div className="font-bold text-[var(--text-primary)]">Disaster Decision Support Desk</div>
              <div>GiriRakshak AI Operational Center • Regional Hub</div>
            </div>
            <div className="sm:text-right font-mono text-[11px] text-[var(--text-muted)]">
              <div>System Engine: ML-Hazard-Inference-v2.4</div>
              <div>Checksum: 8F2A-910D-51B4</div>
            </div>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-100 dark:bg-slate-900/60 border border-[var(--border-app)] text-[11px] text-[var(--text-muted)] space-y-1">
            <p className="font-bold text-[var(--text-secondary)]">
              Operational Decision-Support Disclaimer:
            </p>
            <p className="leading-relaxed">
              This report is generated using simulated demonstration data for testing and operational decision-support purposes. It is not an official warning or government advisory. Civil administration and disaster response teams must corroborate satellite telemetry with designated district field engineers prior to ordering mandatory community evacuations.
            </p>
          </div>
        </div>
      </div>

      {/* FULL DOCUMENT PREVIEW MODAL */}
      {isPreviewModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto print:hidden">
          <div className="relative w-full max-w-4xl rounded-2xl bg-[var(--bg-surface)] border border-[var(--border-app)] shadow-2xl overflow-hidden my-8 animate-in fade-in zoom-in-95 duration-150">
            {/* Modal Header */}
            <div className="p-4 bg-[var(--bg-surface-secondary)] border-b border-[var(--border-app)] flex items-center justify-between">
              <div className="flex items-center gap-2">
                <FileText className="w-4 h-4 text-cyan-500" />
                <span className="font-bold text-sm text-[var(--text-primary)]">
                  Document Preview — {selectedReportType === 'daily' ? 'Daily Bulletin' : selectedReportType === 'weekly' ? 'Weekly Threat Assessment' : 'Emergency Situation Briefing'}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={handlePrintPDF}
                  className="px-3 py-1.5 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-bold transition-colors"
                >
                  Print / PDF
                </button>
                <button
                  onClick={() => setIsPreviewModalOpen(false)}
                  className="p-1.5 rounded-lg hover:bg-[var(--border-subtle)] text-[var(--text-muted)] hover:text-[var(--text-primary)]"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Modal Body */}
            <div className="p-6 max-h-[80vh] overflow-y-auto space-y-6 text-xs text-[var(--text-secondary)]">
              <div className="p-3 bg-amber-500/10 border border-amber-500/20 text-amber-700 dark:text-amber-300 rounded-lg text-center font-bold">
                DEMO MODE — SIMULATED REPORT PREVIEW
              </div>
              <div className="border border-[var(--border-app)] p-6 rounded-xl space-y-4 bg-[var(--bg-surface)]">
                <div className="flex items-center justify-between border-b pb-3 border-[var(--border-app)]">
                  <div>
                    <h3 className="text-lg font-bold text-[var(--text-primary)]">
                      {selectedReportType === 'daily' && 'Daily Landslide Risk & Hazard Bulletin'}
                      {selectedReportType === 'weekly' && 'Weekly Regional Threat & Geotechnical Assessment'}
                      {selectedReportType === 'emergency' && 'Emergency Geotechnical Incident Situation Briefing'}
                    </h3>
                    <span className="text-[11px] text-[var(--text-muted)]">GiriRakshak AI Disaster Decision Support</span>
                  </div>
                  <div className="text-right font-mono text-[10px] text-[var(--text-muted)]">
                    <div>{dailyData.refNumber}</div>
                    <div>{new Date().toLocaleDateString('en-GB')}</div>
                  </div>
                </div>

                <p className="leading-relaxed">
                  {selectedReportType === 'daily' && dailyData.executiveSummary}
                  {selectedReportType === 'weekly' && weeklyData.executiveSummary}
                  {selectedReportType === 'emergency' && emergencyData.situationSummary}
                </p>

                <div className="text-[11px] text-[var(--text-muted)] italic pt-4 border-t border-[var(--border-app)]">
                  Preview representation verified against simulated demonstration dataset.
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
