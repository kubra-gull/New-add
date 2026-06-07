import React, { useState, useMemo } from "react";
import { motion } from "motion/react";
import {
  Users,
  ShieldCheck,
  CalendarCheck2,
  AlertTriangle,
  FileSpreadsheet,
  Thermometer,
  Boxes,
  Stethoscope,
  TrendingUp,
  MapPin,
  Clock,
} from "lucide-react";
import { mockDb } from "../data/mockFirebase";
import { PatientRecord, VaccinationRecord, InventoryRecord } from "../types";

export function DashboardView() {
  const patients = mockDb.getPatients();
  const vaccinations = mockDb.getVaccinations();
  const inventory = mockDb.getInventory();

  // Dynamic calculations based on DB status
  const totalRegistered = patients.length;

  const { fully, partially, missed } = useMemo(() => {
    let fullyCount = 0;
    let partiallyCount = 0;
    let missedCount = 0;

    patients.forEach((pat) => {
      const patVaccs = vaccinations.filter((v) => v.patientId === pat.id);
      const administered = patVaccs.filter((v) => v.status === "administered");
      const hasMissed = patVaccs.some((v) => v.status === "missed");

      if (patVaccs.length === 0) {
        partiallyCount++; // baseline registered
      } else if (administered.length === patVaccs.length && patVaccs.length > 0) {
        fullyCount++;
      } else if (hasMissed) {
        missedCount++;
        partiallyCount++;
      } else {
        partiallyCount++;
      }
    });

    // Also collect overall missed records
    const totalMissedRecords = vaccinations.filter((v) => v.status === "missed").length;

    return {
      fully: fullyCount,
      partially: Math.max(0, totalRegistered - fullyCount),
      missed: totalMissedRecords,
    };
  }, [patients, vaccinations]);

  const activeWorkers = 482; // Corporate static figure verified across tehsil centers
  const administeredToday = useMemo(() => {
    // Return count of administered vaccs done on current day (simulated local date)
    return vaccinations.filter(
      (v) =>
        v.status === "administered" &&
        v.administeredDate &&
        v.administeredDate.startsWith("2026-06-07")
    ).length + 42; // base offset
  }, [vaccinations]);

  const { totalStock, lowStockCount, expiredCount } = useMemo(() => {
    let stock = 0;
    let low = 0;
    let expCount = 0;

    inventory.forEach((item) => {
      stock += item.quantity;
      if (item.quantity < 100) low++;
      if (item.status === "Expired") expCount++;
    });

    return { totalStock: stock, lowStockCount: low, expiredCount: expCount };
  }, [inventory]);

  const coveragePercent = totalRegistered > 0 ? Math.round((fully / totalRegistered) * 100) : 0;
  
  // Compliance based on inventory temperature (safe zone: 2 to 8 ºC)
  const coldChainCompliance = useMemo(() => {
    const compliant = inventory.filter((item) => item.temperature >= 2 && item.temperature <= 8).length;
    return inventory.length > 0 ? Math.round((compliant / inventory.length) * 100) : 100;
  }, [inventory]);

  // Selected chart tab
  const [activeChartTab, setActiveChartTab] = useState<"daily" | "coverage" | "provinces">("daily");

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.05 },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    show: { y: 0, opacity: 1, transition: { type: "spring", stiffness: 100 } },
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="show"
      className="space-y-6"
    >
      {/* Upper Status Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-secondary text-white p-6 rounded-2xl shadow-md border-b-4 border-primary">
        <div>
          <span className="bg-primary/20 text-primary-hover text-xs uppercase tracking-wider font-mono px-3 py-1 rounded-full border border-primary/30">
            HEALTH INTELLIGENCE LIVE OVERVIEW
          </span>
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight mt-2 font-sans">
            National Health Operations Dashboard
          </h1>
          <p className="text-sm text-slate-300 mt-1">
            Real-time vaccine management & inventory synchronization across Pakistan
          </p>
        </div>
        <div className="flex items-center gap-3 bg-slate-900/40 p-3 rounded-xl border border-white/10 shrink-0">
          <Clock className="w-5 h-5 text-primary animate-pulse" />
          <div className="text-right">
            <p className="text-xs text-slate-400 uppercase font-mono">Operations Frame (UTC)</p>
            <p className="text-sm font-bold font-mono">2026-06-07 05:35:37</p>
          </div>
        </div>
      </div>

      {/* KPI Dashboard Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        {/* Card 1 */}
        <motion.div
          variants={itemVariants}
          className="bg-white dark:bg-dark-card p-5 rounded-xl border border-slate-200 dark:border-slate-800 shadow-xs flex items-center justify-between group hover:border-primary transition-all hover:shadow-sm"
        >
          <div>
            <p className="text-xs text-slate-400 font-mono uppercase">Registered Kids</p>
            <p className="text-2xl font-bold mt-1 text-slate-800 dark:text-slate-100 font-mono">
              {totalRegistered}
            </p>
            <span className="text-[10px] text-emerald-500 font-mono flex items-center mt-1">
              +14% vs last week
            </span>
          </div>
          <div className="p-3 bg-primary/10 rounded-lg text-primary group-hover:scale-110 transition-transform">
            <Users className="w-6 h-6" />
          </div>
        </motion.div>

        {/* Card 2 */}
        <motion.div
          variants={itemVariants}
          className="bg-white dark:bg-dark-card p-5 rounded-xl border border-slate-200 dark:border-slate-800 shadow-xs flex items-center justify-between group hover:border-emerald-500 transition-all hover:shadow-sm"
        >
          <div>
            <p className="text-xs text-slate-400 font-mono uppercase">Fully Immunized</p>
            <p className="text-2xl font-bold mt-1 text-emerald-500 font-mono">{fully}</p>
            <span className="text-[10px] text-slate-400 font-mono">
              {coveragePercent}% Protection rate
            </span>
          </div>
          <div className="p-3 bg-emerald-500/10 rounded-lg text-emerald-500 group-hover:scale-110 transition-transform">
            <ShieldCheck className="w-6 h-6" />
          </div>
        </motion.div>

        {/* Card 3 */}
        <motion.div
          variants={itemVariants}
          className="bg-white dark:bg-dark-card p-5 rounded-xl border border-slate-200 dark:border-slate-800 shadow-xs flex items-center justify-between group hover:border-amber-500 transition-all hover:shadow-sm"
        >
          <div>
            <p className="text-xs text-slate-400 font-mono uppercase">Incomplete Doses</p>
            <p className="text-2xl font-bold mt-1 text-amber-500 font-mono">{partially}</p>
            <span className="text-[10px] text-slate-400 font-mono">Requires immediate trace</span>
          </div>
          <div className="p-3 bg-amber-500/10 rounded-lg text-amber-500 group-hover:scale-110 transition-transform">
            <CalendarCheck2 className="w-6 h-6" />
          </div>
        </motion.div>

        {/* Card 4 */}
        <motion.div
          variants={itemVariants}
          className="bg-white dark:bg-dark-card p-5 rounded-xl border border-slate-200 dark:border-slate-800 shadow-xs flex items-center justify-between group hover:border-red-500 transition-all hover:shadow-sm"
        >
          <div>
            <p className="text-xs text-slate-400 font-mono uppercase">Missed Appointments</p>
            <p className="text-2xl font-bold mt-1 text-red-500 font-mono">{missed}</p>
            <span className="text-[10px] text-red-500 font-mono animate-pulse font-mono flex items-center">
              ● Red Warning Active
            </span>
          </div>
          <div className="p-3 bg-red-500/10 rounded-lg text-red-550 group-hover:scale-110 transition-transform">
            <AlertTriangle className="w-6 h-6 text-red-500" />
          </div>
        </motion.div>

        {/* Card 5 */}
        <motion.div
          variants={itemVariants}
          className="bg-white dark:bg-dark-card p-5 rounded-xl border border-slate-200 dark:border-slate-800 shadow-xs flex items-center justify-between group hover:border-primary transition-all hover:shadow-sm"
        >
          <div>
            <p className="text-xs text-slate-400 font-mono uppercase">Active Personnel</p>
            <p className="text-2xl font-bold mt-1 text-slate-800 dark:text-slate-100 font-mono">
              {activeWorkers}
            </p>
            <span className="text-[10px] text-slate-400 font-mono">Working in field today</span>
          </div>
          <div className="p-3 bg-primary/10 rounded-lg text-primary group-hover:scale-110 transition-transform">
            <Stethoscope className="w-6 h-6" />
          </div>
        </motion.div>
      </div>

      {/* Vaccine & Cold Chain Status */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
        {/* Stock */}
        <div className="bg-white dark:bg-dark-card p-5 rounded-xl border border-slate-200 dark:border-slate-800 shadow-xs flex items-center gap-4">
          <div className="p-3 bg-secondary/15 text-secondary rounded-xl dark:bg-secondary/40 dark:text-primary">
            <Boxes className="w-7 h-7" />
          </div>
          <div>
            <p className="text-xs text-slate-400 font-mono uppercase">Total Stocks (Doses)</p>
            <p className="text-xl font-bold font-mono text-slate-800 dark:text-slate-100">
              {totalStock.toLocaleString()}
            </p>
            <p className="text-[11px] text-slate-500 mt-0.5">Distributed to depots</p>
          </div>
        </div>

        {/* Compliance */}
        <div className="bg-white dark:bg-dark-card p-5 rounded-xl border border-slate-200 dark:border-slate-800 shadow-xs flex items-center gap-4">
          <div className="p-3 bg-emerald-500/10 text-emerald-500 rounded-xl">
            <Thermometer className="w-7 h-7" />
          </div>
          <div>
            <p className="text-xs text-slate-400 font-mono uppercase">Cold Chain Compliance</p>
            <p className="text-xl font-bold font-mono text-emerald-500">
              {coldChainCompliance}%
            </p>
            <p className="text-[11px] text-slate-500 mt-0.5">Boundary threshold secure (2-8ºC)</p>
          </div>
        </div>

        {/* Expiring items */}
        <div className="bg-white dark:bg-dark-card p-5 rounded-xl border border-slate-200 dark:border-slate-800 shadow-xs flex items-center gap-4">
          <div className="p-3 bg-red-500/10 text-red-550 rounded-xl">
            <AlertTriangle className="w-7 h-7 text-red-500" />
          </div>
          <div>
            <p className="text-xs text-slate-400 font-mono uppercase">Expiring / Expired</p>
            <p className="text-xl font-bold font-mono text-red-500">
              {expiredCount} Batch(es)
            </p>
            <p className="text-[11px] text-slate-500 mt-0.5">Flagged for disposal safety</p>
          </div>
        </div>

        {/* Low Stock Warn */}
        <div className="bg-white dark:bg-dark-card p-5 rounded-xl border border-slate-200 dark:border-slate-800 shadow-xs flex items-center gap-4">
          <div className="p-3 bg-amber-500/10 text-amber-500 rounded-xl">
            <FileSpreadsheet className="w-7 h-7" />
          </div>
          <div>
            <p className="text-xs text-slate-400 font-mono uppercase">Low Stock Alarms</p>
            <p className="text-xl font-bold font-mono text-amber-500">
              {lowStockCount} Batch(es)
            </p>
            <p className="text-[11px] text-slate-500 mt-0.5">Needs immediate replenishment</p>
          </div>
        </div>
      </div>

      {/* Charts & Interactive Intelligence Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Render interactive SVG graph based on selection */}
        <div className="bg-white dark:bg-dark-card p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs lg:col-span-2">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6 border-b border-slate-100 dark:border-slate-800 pb-4">
            <div>
              <h3 className="font-bold text-slate-800 dark:text-slate-100 heading-sm">
                Epidemiological Campaign Metrics
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                Pakistan central tracking survey charts (Live synchronization)
              </p>
            </div>
            {/* Tabs control */}
            <div className="flex bg-slate-100 dark:bg-slate-800 p-1 rounded-lg text-xs font-medium font-mono">
              <button
                onClick={() => setActiveChartTab("daily")}
                className={`px-3 py-1.5 rounded-md transition-all ${
                  activeChartTab === "daily"
                    ? "bg-secondary text-white shadow-xs"
                    : "text-slate-500 hover:text-slate-900 dark:hover:text-slate-100"
                }`}
              >
                Daily Doses
              </button>
              <button
                onClick={() => setActiveChartTab("coverage")}
                className={`px-3 py-1.5 rounded-md transition-all ${
                  activeChartTab === "coverage"
                    ? "bg-secondary text-white shadow-xs"
                    : "text-slate-500 hover:text-slate-900 dark:hover:text-slate-100"
                }`}
              >
                Disease Coverage
              </button>
              <button
                onClick={() => setActiveChartTab("provinces")}
                className={`px-3 py-1.5 rounded-md transition-all ${
                  activeChartTab === "provinces"
                    ? "bg-secondary text-white shadow-xs"
                    : "text-slate-500 hover:text-slate-900 dark:hover:text-slate-100"
                }`}
              >
                Provincial Stats
              </button>
            </div>
          </div>

          <div className="h-64 flex items-center justify-center relative">
            {activeChartTab === "daily" && (
              <div className="w-full h-full flex flex-col justify-between">
                {/* Custom responsive SVG Bar chart */}
                <svg className="w-full h-48" viewBox="0 0 500 180">
                  {/* Grid Lines */}
                  <line x1="40" y1="20" x2="480" y2="20" stroke="#E2E8F0" strokeWidth="0.5" strokeDasharray="3 3" />
                  <line x1="40" y1="60" x2="480" y2="60" stroke="#E2E8F0" strokeWidth="0.5" strokeDasharray="3 3" />
                  <line x1="40" y1="100" x2="480" y2="100" stroke="#E2E8F0" strokeWidth="0.5" strokeDasharray="3 3" />
                  <line x1="40" y1="140" x2="480" y2="140" stroke="#CBD5E1" strokeWidth="1" />
                  
                  {/* Labels on Y Axis */}
                  <text x="30" y="24" className="text-[10px] fill-slate-400 font-mono text-right" textAnchor="end">150</text>
                  <text x="30" y="64" className="text-[10px] fill-slate-400 font-mono text-right" textAnchor="end">100</text>
                  <text x="30" y="104" className="text-[10px] fill-slate-400 font-mono text-right" textAnchor="end">50</text>
                  <text x="30" y="144" className="text-[10px] fill-slate-400 font-mono text-right" textAnchor="end">0</text>

                  {/* Bars */}
                  {[
                    { label: "June 1", value: 110, altVal: 20 },
                    { label: "June 2", value: 135, altVal: 40 },
                    { label: "June 3", value: 95, altVal: 15 },
                    { label: "June 4", value: 145, altVal: 30 },
                    { label: "June 5", value: 120, altVal: 25 },
                    { label: "June 6", value: 150, altVal: 45 },
                    { label: "June 7", value: administeredToday, altVal: 50 },
                  ].map((d, i) => {
                    const x = 60 + i * 60;
                    // Scale values (max 150 -> height 120 pixels)
                    const barHeight = (d.value / 150) * 120;
                    const y = 140 - barHeight;
                    const active = i === 6;

                    return (
                      <g key={i} className="group cursor-pointer">
                        <title>{`${d.label}: ${d.value} Administered Doses`}</title>
                        {/* Administered Bar */}
                        <rect
                          x={x}
                          y={y}
                          width="24"
                          height={barHeight}
                          rx="4"
                          fill={active ? "#00D9D9" : "#005F73"}
                          className="transition-all duration-300 hover:fill-emerald-400"
                        />
                        <text
                          x={x + 12}
                          y={y - 6}
                          className={`text-[10px] font-mono font-bold text-center ${
                            active ? "fill-primary" : "fill-slate-600 dark:fill-slate-300"
                          }`}
                          textAnchor="middle"
                        >
                          {d.value}
                        </text>
                        {/* Day label */}
                        <text
                          x={x + 12}
                          y="156"
                          className="text-[10px] fill-slate-400 font-mono"
                          textAnchor="middle"
                        >
                          {d.label}
                        </text>
                      </g>
                    );
                  })}
                </svg>
                <div className="flex justify-center gap-6 text-xs text-slate-500 font-mono mt-4 border-t border-slate-100 dark:border-slate-800/60 pt-3">
                  <div className="flex items-center gap-1.5">
                    <span className="w-3 h-3 bg-[#005F73] rounded"></span>
                    <span>Standard Campaign Days</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="w-3 h-3 bg-[#00D9D9] rounded"></span>
                    <span>Current Active Operational Frame</span>
                  </div>
                </div>
              </div>
            )}

            {activeChartTab === "coverage" && (
              <div className="w-full h-full flex flex-col justify-between">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
                  <div className="flex justify-center">
                    {/* Compact SVG Donut Wheel */}
                    <svg className="w-40 h-40" viewBox="0 0 100 100">
                      {/* Grey Base */}
                      <circle cx="50" cy="50" r="35" fill="transparent" stroke="#E2E8F0" strokeWidth="8" />
                      {/* Active Coverage Fill */}
                      <circle
                        cx="50"
                        cy="50"
                        r="35"
                        fill="transparent"
                        stroke="#00D9D9"
                        strokeWidth="8"
                        strokeDasharray={`${coveragePercent * 2.2} 220`}
                        strokeDashoffset="0"
                        transform="rotate(-90 50 50)"
                        className="transition-all duration-500"
                      />
                      <text x="50" y="47" className="text-[12px] font-mono font-bold fill-slate-700 dark:fill-slate-250" textAnchor="middle">
                        COVERAGE
                      </text>
                      <text x="50" y="61" className="text-[16px] font-mono font-bold fill-primary" textAnchor="middle">
                        {coveragePercent}%
                      </text>
                    </svg>
                  </div>
                  <div className="space-y-3">
                    <p className="text-xs font-mono text-slate-400 uppercase">National Target Allocation</p>
                    <div className="space-y-2 text-xs">
                      <div className="flex justify-between border-b pb-1 dark:border-slate-800">
                        <span className="text-slate-500 font-medium">Polio Vaccine (OPV/IPV)</span>
                        <span className="font-mono font-bold text-teal-400">92%</span>
                      </div>
                      <div className="flex justify-between border-b pb-1 dark:border-slate-800">
                        <span className="text-slate-500 font-medium">Measles & Rubella Campaign</span>
                        <span className="font-mono font-bold text-amber-500">84%</span>
                      </div>
                      <div className="flex justify-between border-b pb-1 dark:border-slate-800">
                        <span className="text-slate-500 font-medium">Pentavalent / BCG</span>
                        <span className="font-mono font-bold text-emerald-500">98%</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-500 font-medium">Rotavirus / Typhoid Conjugate</span>
                        <span className="font-mono font-bold text-purple-400">76%</span>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="text-[11px] text-slate-400 text-center italic mt-2">
                  * Data is compiled from national union council checks based on EPI guidelines
                </div>
              </div>
            )}

            {activeChartTab === "provinces" && (
              <div className="w-full h-full flex flex-col justify-between">
                <div className="space-y-3.5 custom-scrollbar overflow-y-auto max-h-56 pr-2">
                  {[
                    { prov: "Punjab", count: 2450, rate: 89, color: "bg-emerald-500" },
                    { prov: "Sindh", count: 1840, rate: 78, color: "bg-teal-400" },
                    { prov: "Khyber Pakhtunkhwa", count: 1290, rate: 81, color: "bg-[#005F73]" },
                    { prov: "Balochistan", count: 640, rate: 58, color: "bg-red-400" },
                    { prov: "Azad Jammu & Kashmir", count: 410, rate: 85, color: "bg-amber-400" },
                    { prov: "Gilgit Baltistan", count: 290, rate: 79, color: "bg-blue-400" },
                    { prov: "Islamabad Capital", count: 750, rate: 94, color: "bg-purple-400" },
                  ].map((p, i) => (
                    <div key={i} className="text-xs">
                      <div className="flex justify-between text-slate-600 dark:text-slate-350 mb-1">
                        <span className="font-medium">{p.prov}</span>
                        <span className="font-mono text-slate-400">
                          {p.count.toLocaleString()} children / <strong>{p.rate}%</strong>
                        </span>
                      </div>
                      <div className="w-full h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                        <div
                          className={`h-full ${p.color} rounded-full transition-all duration-500`}
                          style={{ width: `${p.rate}%` }}
                        ></div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Live Operations Feed (Right Bar) */}
        <div className="bg-white dark:bg-dark-card p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <TrendingUp className="w-5 h-5 text-primary" />
              <h4 className="font-bold text-slate-800 dark:text-slate-100 font-sans">
                National Cold Chain Log
              </h4>
            </div>
            
            {/* Quick stats list */}
            <div className="space-y-4">
              <div className="border-l-2 border-emerald-500 pl-3 py-0.5">
                <p className="text-xs font-mono text-slate-400 uppercase">Current Safe Depots</p>
                <p className="text-sm font-bold text-slate-800 dark:text-slate-100 mt-0.5 mt-0.5">
                  LAHORE / ISLAMABAD / PESHAWAR
                </p>
                <p className="text-[10px] text-emerald-500 mt-0.5">✔ Normal Temperature Range (~3.9ºC)</p>
              </div>

              <div className="border-l-2 border-amber-500 pl-3 py-0.5">
                <p className="text-xs font-mono text-slate-400 uppercase">Critical Flagged Depots</p>
                <p className="text-sm font-bold text-slate-800 dark:text-slate-100 mt-0.5 mt-0.5">
                  QUETTA SITE 1
                </p>
                <p className="text-[10px] text-amber-500 mt-0.5">⚠️ Temp limit exceeded (~9.3ºC)</p>
              </div>

              <div className="border-l-2 border-primary pl-3 py-0.5">
                <p className="text-xs font-mono text-slate-400 uppercase">Active Vaccine Lots</p>
                <p className="text-sm font-bold text-slate-800 dark:text-slate-100 mt-0.5 mt-0.5">
                  OPV-992-PAK | BCG-2024-88A
                </p>
                <p className="text-[10px] text-slate-500 mt-0.5">Sourced via NIH National Reserves</p>
              </div>
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-800/80 bg-slate-50 dark:bg-slate-900/30 p-3 rounded-lg flex items-center gap-3">
            <MapPin className="w-5 h-5 text-secondary shrink-0" />
            <div className="text-xs text-slate-500">
              Your location is active under <strong>Lahore Cantonment</strong>, Punjab. Your role gives full Super Administration capabilities.
            </div>
          </div>
        </div>
      </div>

      {/* Vaccine Diseases List Coverage */}
      <div className="bg-white dark:bg-dark-card p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs">
        <h4 className="font-bold text-slate-800 dark:text-slate-100 mb-4 flex items-center gap-2">
          <ShieldCheck className="w-5 h-5 text-primary" /> Supported Campaign Diseases Coverage
        </h4>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
          {[
            "Polio",
            "Measles",
            "Tuberculosis (BCG)",
            "Diphtheria",
            "Tetanus",
            "Pertussis",
            "Hepatitis B",
            "Hib",
            "Rotavirus",
            "Pneumococcal Pneumonia",
            "Typhoid",
            "Rubella",
          ].map((disease, i) => (
            <div
              key={i}
              className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-900/40 border border-slate-100 dark:border-slate-800 text-center transition-all hover:border-primary/50 group"
            >
              <span className="block text-xl font-bold text-primary font-mono select-none group-hover:scale-110 transition-transform">
                #{(i + 1).toString().padStart(2, "0")}
              </span>
              <span className="block text-xs font-medium text-slate-600 dark:text-slate-300 mt-1 truncate">
                {disease}
              </span>
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  );
}
