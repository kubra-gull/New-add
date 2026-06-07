import React, { useState, useMemo } from "react";
import { motion } from "motion/react";
import {
  ShieldAlert,
  CalendarDays,
  CheckCircle,
  Clock,
  HeartPulse,
  Info,
  Layers,
  Search,
  BookOpen,
} from "lucide-react";
import { mockDb, logOperation } from "../data/mockFirebase";
import { VaccinationRecord, PatientRecord } from "../types";

interface DiseaseProtocol {
  name: string;
  schedule: string;
  dosesNeeded: number;
  route: string;
  targetAge: string;
  tempRequirement: string;
  details: string;
}

const COVERED_DISEASES_PROTOCOLS: DiseaseProtocol[] = [
  {
    name: "Polio",
    schedule: "At birth, 6, 10, and 14 weeks",
    dosesNeeded: 4,
    route: "Oral Drops (OPV) / Intramuscular (IPV)",
    targetAge: "0 to 15 years",
    tempRequirement: "-20ºC to -15ºC (Long-term) / +2ºC to +8ºC (Short-term)",
    details: "Critical national priority. Essential for eliminating poliovirus strains. Monitored through massive Union Council sweep campaigns.",
  },
  {
    name: "Measles",
    schedule: "9 months and 15 months",
    dosesNeeded: 2,
    route: "Subcutaneous Injection",
    targetAge: "9 months up to 5 years",
    tempRequirement: "+2ºC to +8ºC",
    details: "Protects against measles pneumonia and severe neurological complications.",
  },
  {
    name: "Tuberculosis (BCG)",
    schedule: "At birth or first contact",
    dosesNeeded: 1,
    route: "Intradermal Injection",
    targetAge: "At birth (Ideal) up to 1 year",
    tempRequirement: "+2ºC to +8ºC",
    details: "Provides life-saving protection against tuberculous meningitis and disseminated disease.",
  },
  {
    name: "Diphtheria",
    schedule: "Part of Pentavalent vaccine at 6, 10, and 14 weeks",
    dosesNeeded: 3,
    route: "Intramuscular Injection",
    targetAge: "6 weeks to 6 years",
    tempRequirement: "+2ºC to +8ºC (Do not freeze)",
    details: "Prevents severe upper respiratory tract membrane blockages and heart damage.",
  },
  {
    name: "Tetanus",
    schedule: "Womb protection (Maternal) & Child Pentavalent doses",
    dosesNeeded: 5,
    route: "Intramuscular Injection",
    targetAge: "Childhood to maternal age",
    tempRequirement: "+2ºC to +8ºC (Must not freeze)",
    details: "Fights neonatal lockjaw. Essential for obstetric hygiene compliance.",
  },
  {
    name: "Pertussis",
    schedule: "Injections at 6, 10, and 14 weeks",
    dosesNeeded: 3,
    route: "Intramuscular Injection (DTP component)",
    targetAge: "6 weeks up to 7 years",
    tempRequirement: "+2ºC to +8ºC",
    details: "Fights Whooping Cough. Highly transmissible in dense urban centers.",
  },
  {
    name: "Hepatitis B",
    schedule: "At birth & Child Pentavalent doses",
    dosesNeeded: 4,
    route: "Intramuscular Injection",
    targetAge: "At birth and sequence",
    tempRequirement: "+2ºC to +8ºC",
    details: "Immunizes against chronic carrier state liver disease and cancer.",
  },
  {
    name: "Hib",
    schedule: "Pentavalent series at 6, 10, and 14 weeks",
    dosesNeeded: 3,
    route: "Intramuscular Injection",
    targetAge: "6 weeks to 5 years",
    tempRequirement: "+2ºC to +8ºC",
    details: "Hemophilus Influenzae B - prevents deadly infant meningitis and epiglottitis.",
  },
  {
    name: "Rotavirus",
    schedule: "Age 6 weeks and 10 weeks",
    dosesNeeded: 2,
    route: "Oral Administration (Liquid)",
    targetAge: "6 weeks to 15 weeks",
    tempRequirement: "+2ºC to +8ºC",
    details: "Major defense against dehydrating diarrheal gastroenteritis in children under 2.",
  },
  {
    name: "Pneumococcal Pneumonia",
    schedule: "PCV10 shots at 6, 10 weeks, and 9 months",
    dosesNeeded: 3,
    route: "Intramuscular Injection",
    targetAge: "6 weeks to 2 years",
    tempRequirement: "+2ºC to +8ºC",
    details: "Fights bacterial streptococcus pneumonia and ear infections.",
  },
  {
    name: "Typhoid",
    schedule: "Single conjugate dose at 9 months",
    dosesNeeded: 1,
    route: "Intramuscular Injection (TCV)",
    targetAge: "9 months to 15 years",
    tempRequirement: "+2ºC to +8ºC",
    details: "Pakistan was the 1st country to introduce WHO-approved TCV due to drug-resistant typhoid outbreaks.",
  },
  {
    name: "Rubella",
    schedule: "Combined with Measles as MR vaccine at 9 & 15 months",
    dosesNeeded: 2,
    route: "Subcutaneous Injection",
    targetAge: "9 months up to 15 years",
    tempRequirement: "+2ºC to +8ºC",
    details: "Eliminates Congenital Rubella Syndrome which causes congenital birth deficits.",
  }
];

export function VaccinationsView() {
  const [selectedDisease, setSelectedDisease] = useState<string>("Polio");
  const [patientFilterText, setPatientFilterText] = useState("");

  const vaccinations = mockDb.getVaccinations();
  const patients = mockDb.getPatients();

  // Selected disease details
  const currentProtocol = useMemo(() => {
    return COVERED_DISEASES_PROTOCOLS.find((p) => p.name.toLowerCase() === selectedDisease.toLowerCase()) || COVERED_DISEASES_PROTOCOLS[0];
  }, [selectedDisease]);

  // Calculated stats for active disease
  const diseaseStats = useMemo(() => {
    const matched = vaccinations.filter((v) => v.diseaseName.toLowerCase().includes(selectedDisease.toLowerCase()));
    return {
      total: matched.length,
      administered: matched.filter((v) => v.status === "administered").length,
      scheduled: matched.filter((v) => v.status === "scheduled").length,
      missed: matched.filter((v) => v.status === "missed").length,
    };
  }, [vaccinations, selectedDisease]);

  // List of vaccination records with associated patient data
  const integratedHistory = useMemo(() => {
    const list = vaccinations.filter((v) => v.diseaseName.toLowerCase().includes(selectedDisease.toLowerCase()));
    return list.map((v) => {
      const p = patients.find((pat) => pat.id === v.patientId);
      return {
        ...v,
        patientName: p ? p.childName : "Unknown Child",
        patientCnic: p ? p.cnic : "N/A",
        patientDistrict: p ? p.district : "N/A",
      };
    }).filter((item) => {
      const q = patientFilterText.toLowerCase().trim();
      if (!q) return true;
      return (
        item.patientName.toLowerCase().includes(q) ||
        item.patientId.toLowerCase().includes(q) ||
        item.patientCnic.includes(q) ||
        (item.batchNumber && item.batchNumber.toLowerCase().includes(q))
      );
    });
  }, [vaccinations, patients, selectedDisease, patientFilterText]);

  return (
    <div className="space-y-6">
      
      {/* Upper header summary */}
      <div className="bg-white dark:bg-dark-card border border-slate-200 dark:border-slate-800 p-5 rounded-2xl flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-xl font-extrabold text-slate-800 dark:text-slate-100 flex items-center gap-2">
            <HeartPulse className="w-6 h-6 text-primary" /> Supported Pediatric Immunization Schedules
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            EPI National Guidelines (Expanded Programme on Immunization, Pakistan Ministry of National Health Services)
          </p>
        </div>
      </div>

      {/* Primary Layout Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        
        {/* Left Side: 12 Diseases List */}
        <div className="lg:col-span-1 bg-white dark:bg-dark-card border border-slate-200 dark:border-slate-800 p-4 rounded-xl space-y-2">
          <span className="block text-[10px] font-mono text-slate-400 uppercase tracking-widest pl-2 mb-2">
            SELECT DISEASE CAMPAIGN
          </span>
          <div className="space-y-1.5 max-h-[64vh] overflow-y-auto custom-scrollbar pr-1">
            {COVERED_DISEASES_PROTOCOLS.map((disease, i) => {
              const active = disease.name.toLowerCase() === selectedDisease.toLowerCase();
              return (
                <button
                  key={i}
                  onClick={() => {
                    setSelectedDisease(disease.name);
                    setPatientFilterText("");
                  }}
                  className={`w-full text-left p-3 rounded-xl transition-all font-sans flex items-center justify-between ${
                    active
                      ? "bg-secondary text-white font-bold"
                      : "bg-slate-50 dark:bg-slate-900/60 hover:bg-slate-100 dark:hover:bg-slate-900 text-slate-700 dark:text-slate-350"
                  }`}
                >
                  <div className="flex items-center gap-2.5 truncate">
                    <span className={`w-2.5 h-2.5 rounded-full ${active ? "bg-primary" : "bg-slate-300 dark:bg-slate-750"}`}></span>
                    <span className="text-xs truncate">{disease.name}</span>
                  </div>
                  <span className="text-[10px] font-mono opacity-80 bg-slate-200/20 px-2 py-0.5 rounded">
                    #{(i + 1).toString().padStart(2, "0")}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Right Side: Disease Protocol + Active Records lookup */}
        <div className="lg:col-span-3 space-y-6">
          
          {/* Disease Protocol Cards */}
          <div className="bg-white dark:bg-dark-card border border-slate-200 dark:border-slate-800 rounded-xl p-6 shadow-xs relative">
            <div className="absolute top-4 right-4 text-primary opacity-20">
              <BookOpen className="w-16 h-16" />
            </div>

            <div className="border-b border-slate-100 dark:border-slate-800 pb-3 mb-4">
              <span className="text-xs bg-primary/20 text-primary-hover font-mono font-bold px-2.5 py-0.5 rounded">
                OFFICIAL COLD-CHAIN PROTOCOL
              </span>
              <h2 className="text-2xl font-bold font-sans text-slate-850 dark:text-slate-100 mt-2">
                {currentProtocol.name} Immunization Protocol
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs">
              <div className="space-y-3">
                <div className="flex justify-between border-b border-dashed dark:border-slate-800 pb-1.5">
                  <span className="text-slate-400 font-medium">Standard Doses Required</span>
                  <strong className="text-slate-705 dark:text-slate-200 font-mono text-sm">{currentProtocol.dosesNeeded} Dose(s)</strong>
                </div>
                <div className="flex justify-between border-b border-dashed dark:border-slate-800 pb-1.5">
                  <span className="text-slate-400 font-medium">Administration Method</span>
                  <strong className="text-slate-705 dark:text-slate-200">{currentProtocol.route}</strong>
                </div>
                <div className="flex justify-between border-b border-dashed dark:border-slate-800 pb-1.5">
                  <span className="text-slate-400 font-medium">Target Demographics</span>
                  <strong className="text-slate-705 dark:text-slate-200 font-mono">{currentProtocol.targetAge}</strong>
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex justify-between border-b border-dashed dark:border-slate-800 pb-1.5">
                  <span className="text-slate-400 font-medium">Storage Temperature Safe Zone</span>
                  <strong className="text-cyan-500 font-mono">{currentProtocol.tempRequirement}</strong>
                </div>
                <div className="flex justify-between border-b border-dashed dark:border-slate-800 pb-1.5">
                  <span className="text-slate-400 font-medium">Immunization Schedule</span>
                  <strong className="text-slate-705 dark:text-slate-200 max-w-xs text-right truncate">{currentProtocol.schedule}</strong>
                </div>
                <p className="text-[11px] text-slate-500 italic">
                  * Note: Maintain strict compliance indices for vaccines, especially during countrywide heatwaves when refrigerator failures are critical.
                </p>
              </div>
            </div>

            <div className="mt-5 p-3.5 bg-slate-50 dark:bg-slate-900/60 rounded-xl flex gap-2.5 items-start">
              <Info className="w-5 h-5 text-secondary shrink-0 mt-0.5" />
              <div className="text-xs text-slate-600 dark:text-slate-350">
                <strong className="font-semibold text-slate-800 dark:text-slate-200">Public Health Intelligence:</strong> {currentProtocol.details}
              </div>
            </div>
          </div>

          {/* Disease Stats Segment */}
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
            <div className="bg-white dark:bg-dark-card border border-slate-150 dark:border-slate-800 p-4 rounded-xl shadow-xs text-center">
              <span className="block text-[10px] text-slate-400 font-mono uppercase">Logged Records</span>
              <span className="block text-xl font-bold font-mono text-slate-800 dark:text-white mt-1">{diseaseStats.total}</span>
            </div>
            <div className="bg-white dark:bg-dark-card border border-slate-150 dark:border-slate-800 p-4 rounded-xl shadow-xs text-center border-l-4 border-emerald-500">
              <span className="block text-[10px] text-slate-400 font-mono uppercase">Administered</span>
              <span className="block text-xl font-bold font-mono text-emerald-500 mt-1">{diseaseStats.administered}</span>
            </div>
            <div className="bg-white dark:bg-dark-card border border-slate-150 dark:border-slate-800 p-4 rounded-xl shadow-xs text-center border-l-4 border-amber-500">
              <span className="block text-[10px] text-slate-400 font-mono uppercase">Scheduled</span>
              <span className="block text-xl font-bold font-mono text-amber-500 mt-1">{diseaseStats.scheduled}</span>
            </div>
            <div className="bg-white dark:bg-dark-card border border-slate-150 dark:border-slate-800 p-4 rounded-xl shadow-xs text-center border-l-4 border-red-500">
              <span className="block text-[10px] text-slate-400 font-mono uppercase">Missed Doses</span>
              <span className="block text-xl font-bold font-mono text-red-500 mt-1">{diseaseStats.missed}</span>
            </div>
          </div>

          {/* Records Search list specifically for this disease */}
          <div className="bg-white dark:bg-dark-card border border-slate-200 dark:border-slate-800 rounded-xl p-5 shadow-xs space-y-4">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
              <h3 className="font-bold text-slate-850 dark:text-slate-100 text-sm">
                Active Operations Ledger for {selectedDisease}
              </h3>
              
              <div className="relative w-full sm:w-64">
                <Search className="absolute left-2.5 top-2 w-4 h-4 text-slate-400" />
                <input
                  type="text"
                  placeholder="Filter name, CNIC, ID, batch..."
                  value={patientFilterText}
                  onChange={(e) => setPatientFilterText(e.target.value)}
                  className="w-full pl-8 pr-3 py-1 bg-slate-50 dark:bg-slate-905 border border-slate-200 dark:border-slate-800 rounded-lg text-xs font-mono"
                />
              </div>
            </div>

            {/* List */}
            <div className="space-y-2 max-h-72 overflow-y-auto custom-scrollbar pr-1">
              {integratedHistory.length === 0 ? (
                <div className="p-8 text-center text-slate-400 text-xs italic">
                  No active history sheets found matching filters for {selectedDisease}.
                </div>
              ) : (
                integratedHistory.map((item) => (
                  <div
                    key={item.id}
                    className="p-3.5 bg-slate-50 dark:bg-slate-900/40 border border-slate-150 dark:border-slate-800/80 rounded-xl text-xs flex flex-col sm:flex-row justify-between gap-3"
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <strong className="text-slate-700 dark:text-zinc-200 font-bold">{item.patientName}</strong>
                        <span className="text-[10px] bg-slate-200 dark:bg-slate-800 p-0.5 rounded font-mono text-slate-500 select-all">{item.patientId}</span>
                      </div>
                      <p className="text-[10px] text-slate-400 font-mono mt-1">
                        Dose Sequence: <strong>Dose #{item.doseNumber}</strong> | District assigned: <strong>{item.patientDistrict}</strong>
                      </p>
                    </div>

                    <div className="text-left sm:text-right flex flex-col justify-center">
                      <div className="flex items-center sm:justify-end gap-1.5">
                        <span className={`w-2 h-2 rounded-full ${item.status === "administered" ? "bg-emerald-500" : item.status === "scheduled" ? "bg-amber-400" : "bg-red-500"}`}></span>
                        <span className="font-mono font-bold uppercase text-[10px]">
                          {item.status}
                        </span>
                      </div>
                      
                      {item.status === "administered" && item.administeredDate && (
                        <p className="text-[9px] text-slate-400 font-mono mt-1">
                          Given on: {new Date(item.administeredDate).toLocaleDateString()} | Batch: {item.batchNumber || "UNMARKED"}
                        </p>
                      )}
                      
                      {item.status === "scheduled" && (
                        <p className="text-[9px] text-slate-400 font-mono mt-1">
                          Expected target: {item.scheduledDate}
                        </p>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

        </div>

      </div>

    </div>
  );
}
