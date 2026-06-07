import React, { useState, useMemo } from "react";
import { motion } from "motion/react";
import {
  FileText,
  Download,
  CheckCircle,
  FileDown,
  Sparkles,
  BarChart3,
  ListFilter,
  ShieldCheck,
  TrendingUp,
  Map,
  BadgeAlert,
} from "lucide-react";
import { mockDb, logOperation } from "../data/mockFirebase";
import { ReportRecord } from "../types";

export function ReportsView() {
  const [reports, setReports] = useState<ReportRecord[]>(() => mockDb.getReports());
  const auditLogs = mockDb.getAudits();

  // Selected filters / reports states
  const [reportType, setReportType] = useState<"Coverage" | "Inventory" | "Audit">("Coverage");
  const [isGenerating, setIsGenerating] = useState(false);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  // Dynamic coverage rates mock data representing Pakistan's provinces
  const provincialCoverageData = [
    { province: "Punjab", targeted: 240000, immunized: 211200, percentage: 88, wastage: 4.1 },
    { province: "Sindh", targeted: 180000, immunized: 135000, percentage: 75, wastage: 6.8 },
    { province: "Khyber Pakhtunkhwa (KPK)", targeted: 120000, immunized: 98400, percentage: 82, wastage: 5.2 },
    { province: "Balochistan", targeted: 75000, immunized: 43500, percentage: 58, wastage: 8.5 },
    { province: "Azad Jammu & Kashmir (AJK)", targeted: 32050, immunized: 28204, percentage: 88, wastage: 3.2 },
    { province: "Gilgit Baltistan (GB)", targeted: 20000, immunized: 16400, percentage: 82, wastage: 4.8 },
    { province: "ICT Islamabad", targeted: 25000, immunized: 23250, percentage: 93, wastage: 2.1 }
  ];

  // Calculated overall metrics
  const nationalAggregates = useMemo(() => {
    let totalsTargeted = 0;
    let totalsImmunized = 0;
    let totalsWastageSum = 0;

    provincialCoverageData.forEach((d) => {
      totalsTargeted += d.targeted;
      totalsImmunized += d.immunized;
      totalsWastageSum += d.wastage;
    });

    return {
      targeted: totalsTargeted,
      immunized: totalsImmunized,
      meanPercentage: Math.round((totalsImmunized / totalsTargeted) * 105) > 100 ? 100 : Math.round((totalsImmunized / totalsTargeted) * 105),
      meanWastage: Number((totalsWastageSum / provincialCoverageData.length).toFixed(2)),
    };
  }, []);

  // Handler to manually Generate dynamic summary Card
  const generateNewReport = () => {
    setIsGenerating(true);
    setSuccessMsg(null);

    setTimeout(() => {
      const generatedId = `REP-${Date.now().toString().substr(9)}`;
      const newReport: ReportRecord = {
        id: generatedId,
        title: `EPI National ${reportType} Audit Report`,
        type: reportType === "Coverage" ? "Coverage" : "Compliance",
        period: "Monthly",
        generatedBy: "admin-user-01",
        generatedByEmail: "admin@nih.gov.pk",
        generatedAt: new Date().toISOString(),
        data: JSON.stringify({ summary: `Analytical summary report for Pakistan province immunization: ${reportType}` }),
      };

      const updated = [newReport, ...reports];
      setReports(updated);
      mockDb.setReports(updated);
      setIsGenerating(false);
      setSuccessMsg(`Report ${generatedId} dynamically compiled & injected into audit records!`);

      logOperation(
        "GENERATE_REPORT",
        `Compiled dynamic public health intelligence report: ${newReport.title} (ID: ${generatedId})`
      );
    }, 1500); // simulated compilation delay
  };

  // Mock export csv trigger
  const exportToCsvSimulation = () => {
    alert("Parsing dynamic clinical records table into Comma Separated Val (CSV) file format wrapper... Ready for local download.");
    logOperation("CSV_EXPORT", "Exported National Immunization provincial ledger sheets to local Excel CSV format.");
  };

  return (
    <div className="space-y-6">
      
      {/* Upper header overview controls */}
      <div className="bg-white dark:bg-dark-card border border-slate-205 dark:border-slate-800 p-5 rounded-2xl flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-xl font-extrabold text-slate-850 dark:text-slate-105 flex items-center gap-2">
            <BarChart3 className="w-6 h-6 text-primary" /> PUBLIC HEALTH EPIDEMIOLOGY HUB
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Nationwide vaccination coverage tracking, cold-chain wastage analytics, and security audits of Pakistan
          </p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={exportToCsvSimulation}
            className="p-2 px-3.5 bg-slate-100 dark:bg-slate-855 dark:text-zinc-300 hover:bg-slate-200 text-xs font-semibold rounded-xl flex items-center gap-1.5 transition-all"
          >
            <FileDown className="w-4 h-4" /> Export CSV Spreadsheet
          </button>
        </div>
      </div>

      {successMsg && (
        <div className="p-3 bg-emerald-500 text-white rounded-xl text-xs font-bold flex items-center justify-between">
          <span>{successMsg}</span>
          <button onClick={() => setSuccessMsg(null)} className="text-slate-905 font-bold">X</button>
        </div>
      )}

      {/* Aggregate widgets */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        
        <div className="bg-white dark:bg-dark-card border border-slate-150 dark:border-slate-800 p-4 rounded-xl shadow-xs text-center">
          <span className="text-[10px] text-slate-400 font-mono uppercase">Target Child Population</span>
          <h3 className="text-2xl font-mono font-extrabold text-slate-850 dark:text-white mt-1">
            {nationalAggregates.targeted.toLocaleString()}
          </h3>
        </div>

        <div className="bg-white dark:bg-dark-card border border-slate-150 dark:border-slate-800 p-4 rounded-xl shadow-xs text-center">
          <span className="text-[10px] text-slate-400 font-mono uppercase">Fully Immunized</span>
          <h3 className="text-2xl font-mono font-extrabold text-emerald-500 mt-1">
            {nationalAggregates.immunized.toLocaleString()}
          </h3>
        </div>

        <div className="bg-white dark:bg-dark-card border border-slate-150 dark:border-slate-800 p-4 rounded-xl shadow-xs text-center border-b-4 border-primary">
          <span className="text-[10px] text-slate-400 font-mono uppercase">Mean Immunization Cap</span>
          <h3 className="text-2xl font-mono font-extrabold text-primary mt-1">
            {nationalAggregates.meanPercentage}%
          </h3>
        </div>

        <div className="bg-white dark:bg-dark-card border border-slate-150 dark:border-slate-800 p-4 rounded-xl shadow-xs text-center border-b-4 border-red-500">
          <span className="text-[10px] text-slate-400 font-mono uppercase">Avg Cold-Chain Wastage</span>
          <h3 className="text-2xl font-mono font-extrabold text-red-500 mt-1">
            {nationalAggregates.meanWastage}%
          </h3>
        </div>

      </div>

      {/* Graphic Map Chart Representation + Region statistics */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Statistics bar charts / Interactive SVG representation */}
        <div className="lg:col-span-2 bg-white dark:bg-dark-card border border-slate-200 dark:border-slate-800 p-6 rounded-2xl shadow-xs space-y-4">
          <h3 className="font-bold text-slate-850 dark:text-zinc-150 text-sm flex items-center gap-2">
            <Map className="w-5 h-5 text-primary" /> Provincial Coverage & Wastage Audit Matrix
          </h3>

          <div className="space-y-4 pt-2">
            {provincialCoverageData.map((d) => {
              // Decide visual indicator color based on percentage
              const ringColor = d.percentage >= 85 ? "bg-emerald-500" : d.percentage >= 70 ? "bg-amber-400" : "bg-red-500";
              return (
                <div key={d.province} className="space-y-1.5 text-xs">
                  <div className="flex justify-between items-center text-slate-650 dark:text-zinc-350">
                    <strong className="font-bold text-slate-805 dark:text-zinc-200">{d.province}</strong>
                    <span className="font-mono">
                      Immunized: <strong className="text-slate-850 dark:text-white font-mono">{d.immunized.toLocaleString()}</strong> / {d.targeted.toLocaleString()}
                    </span>
                  </div>

                  {/* Range slider indicator */}
                  <div className="relative w-full h-2.5 bg-slate-100 dark:bg-slate-850 rounded-full overflow-hidden">
                    <div
                      className={`h-full ${ringColor} transition-all`}
                      style={{ width: `${d.percentage}%` }}
                    />
                  </div>

                  <div className="flex justify-between text-[10px] text-slate-400 font-mono">
                    <span>Performance coverage cap: <strong>{d.percentage}%</strong></span>
                    <span className="text-red-550">Spillage wastage factor: <strong>{d.wastage}%</strong></span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Generate and Download reports block */}
        <div className="bg-slate-900 text-white p-6 rounded-2xl flex flex-col justify-between border-l-4 border-primary shadow-xs">
          <div className="space-y-4">
            <span className="text-[10px] text-primary tracking-widest font-mono font-bold">
              REPORT ARCHIVE SERVICES
            </span>
            <h3 className="text-lg font-bold">Generate Epidemiology Report</h3>
            
            <div className="space-y-3 text-xs leading-normal">
              <label className="block text-slate-400">Biological Target Audit Type</label>
              <select
                value={reportType}
                onChange={(e) => setReportType(e.target.value as any)}
                className="w-full bg-slate-800 border border-slate-700 p-2.5 rounded font-mono"
              >
                <option value="Coverage">Coverage Rates Report (EPI Vaccine Stats)</option>
                <option value="Inventory">Cold-chain and Batch Inventory Wastage</option>
                <option value="Audit">National Healthcare POS Transaction Logs</option>
              </select>
              
              <button
                onClick={generateNewReport}
                disabled={isGenerating}
                className="w-full p-2.5 bg-primary hover:bg-primary-hover text-slate-909 font-bold text-xs rounded-xl flex items-center justify-center gap-1.5 transition-all font-mono"
              >
                {isGenerating ? "Compiling metadata..." : "Initiate System Compiler"}
              </button>
            </div>
          </div>

          <div className="border-t border-slate-820 pt-4 mt-6">
            <span className="text-[9px] uppercase tracking-wider font-mono text-slate-500 block">
              Generated Reports History Ledger
            </span>
            
            <div className="space-y-2 mt-2 max-h-36 overflow-y-auto custom-scrollbar pr-1 text-xs">
              {reports.map((r) => (
                <div key={r.id} className="flex justify-between items-center p-2 rounded bg-slate-800/40 border border-white/5">
                  <div className="truncate">
                    <span className="font-semibold block truncate text-[11px] select-all">{r.title}</span>
                    <span className="text-[9px] text-slate-400 font-mono">{new Date(r.generatedAt).toLocaleDateString()}</span>
                  </div>
                  <button
                    onClick={() => alert(`Initiating mock secure file pipeline download for ${r.id}...`)}
                    className="p-1 px-1.5 bg-slate-703 hover:bg-slate-600 text-[10px] rounded"
                  >
                    <Download className="w-3.5 h-3.5 text-primary" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>

      </div>

      {/* Audit logs ledger card */}
      <div className="bg-white dark:bg-dark-card border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-xs">
        <h3 className="font-bold text-slate-850 dark:text-slate-101 flex items-center gap-2 mb-4 text-sm">
          <BadgeAlert className="w-5 h-5 text-primary" /> National Platform Security Audit Logs
        </h3>

        <div className="overflow-x-auto custom-scrollbar max-h-60">
          <table className="w-full text-left text-xs text-slate-505">
            <thead className="bg-slate-50 dark:bg-slate-850 text-slate-400 uppercase text-[9px] font-mono select-none">
              <tr>
                <th className="p-3">Log Timestamp</th>
                <th className="p-3">Audit ID File</th>
                <th className="p-3">Operator Action ID</th>
                <th className="p-3">Details Summary Message</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800 font-mono">
              {auditLogs.map((log) => (
                <tr key={log.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-900/30 transition-all text-slate-705 dark:text-zinc-300">
                  <td className="p-3 text-[10px] whitespace-nowrap">{new Date(log.timestamp).toLocaleString()}</td>
                  <td className="p-3 text-slate-450 truncate select-all">{log.id}</td>
                  <td className="p-3 text-secondary font-bold whitespace-nowrap">{log.action}</td>
                  <td className="p-3 text-slate-500 italic text-[11px] truncate max-w-lg" title={log.details}>
                    {log.details}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}
