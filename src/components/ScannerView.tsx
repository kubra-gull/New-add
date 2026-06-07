import React, { useState, useMemo } from "react";
import { motion } from "motion/react";
import {
  QrCode,
  Scan,
  Maximize2,
  Minimize2,
  Sparkles,
  Search,
  ServerCrash,
  UserCheck,
  CheckCircle,
  FileSpreadsheet,
  Cpu,
  Volume2,
} from "lucide-react";
import { mockDb, logOperation } from "../data/mockFirebase";
import { InventoryRecord, PatientRecord } from "../types";

export function ScannerView() {
  const stock = mockDb.getInventory();
  const patients = mockDb.getPatients();

  const [scanType, setScanType] = useState<"vaccine" | "patient">("vaccine");
  const [selectedScanIndex, setSelectedScanIndex] = useState(0);
  const [scanState, setScanState] = useState<"idle" | "scanning" | "success" | "empty">("idle");
  const [useBeep, setUseBeep] = useState(true);

  // Scanned item results state
  const [scannedVaccine, setScannedVaccine] = useState<InventoryRecord | null>(null);
  const [scannedPatient, setScannedPatient] = useState<PatientRecord | null>(null);

  // Play synthetic audio beep
  const playSynthesizedBeep = () => {
    if (!useBeep) return;
    try {
      const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
      const oscillator = audioCtx.createOscillator();
      const gainNode = audioCtx.createGain();

      oscillator.connect(gainNode);
      gainNode.connect(audioCtx.destination);

      oscillator.type = "sine";
      oscillator.frequency.value = 1200; // high pleasant beep
      gainNode.gain.setValueAtTime(0.2, audioCtx.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.1);

      oscillator.start(audioCtx.currentTime);
      oscillator.stop(audioCtx.currentTime + 0.1);
    } catch (e) {
      console.warn("Web audio beep suppressed by browser permissions: ", e);
    }
  };

  // Run scanning routine
  const triggerLaserSim = () => {
    setScanState("scanning");
    setScannedVaccine(null);
    setScannedPatient(null);

    setTimeout(() => {
      playSynthesizedBeep();

      if (scanType === "vaccine") {
        const item = stock[selectedScanIndex % stock.length];
        if (item) {
          setScannedVaccine(item);
          setScanState("success");
          logOperation("QR_SCAN_VACCINE", `Scanned Vaccine QR Lot Batch ID: ${item.batchNumber}`);
        } else {
          setScanState("empty");
        }
      } else {
        const item = patients[selectedScanIndex % patients.length];
        if (item) {
          setScannedPatient(item);
          setScanState("success");
          logOperation("BARCODE_SCAN_PATIENT", `Scanned Child Enrollment Card Barcode ID: ${item.id}`);
        } else {
          setScanState("empty");
        }
      }
    }, 2000); // 2 seconds pulse scanning delay
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      
      {/* Left Column: Scanner Lens Simulation Frame */}
      <div className="bg-white dark:bg-dark-card border border-slate-200 dark:border-slate-800 p-6 rounded-2xl flex flex-col justify-between shadow-xs">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-slate-850 dark:text-zinc-100 flex items-center gap-2">
              <Scan className="w-5 h-5 text-primary" /> EPI Barcode & QR Optic Lens
            </h3>
            
            <div className="flex bg-slate-100 dark:bg-slate-850 p-0.5 rounded-lg text-[10px] font-mono leading-none">
              <button
                onClick={() => {
                  setScanType("vaccine");
                  setSelectedScanIndex(0);
                  setScanState("idle");
                }}
                className={`p-1.5 px-3.5 rounded-md ${scanType === "vaccine" ? "bg-secondary text-white font-bold" : "text-slate-500"}`}
              >
                Vaccine QR Code
              </button>
              <button
                onClick={() => {
                  setScanType("patient");
                  setSelectedScanIndex(0);
                  setScanState("idle");
                }}
                className={`p-1.5 px-3.5 rounded-md ${scanType === "patient" ? "bg-secondary text-white font-bold" : "text-slate-500"}`}
              >
                Patient Barcode
              </button>
            </div>
          </div>

          <p className="text-xs text-slate-400">
            Simulate scanning a vaccine shipment vial QR code or scanning a child's medical card barcode to retrieve digital histories instantly.
          </p>

          {/* Selector Mock Input */}
          <div className="space-y-2 py-1 text-xs">
            <label className="block text-slate-400 font-mono text-[9px] uppercase tracking-wider">
              Choose Specimen Object to Align under Lens
            </label>
            <select
              value={selectedScanIndex}
              onChange={(e) => {
                setSelectedScanIndex(Number(e.target.value));
                setScanState("idle");
              }}
              className="w-full bg-slate-50 dark:bg-slate-905 border dark:border-slate-800 p-2.5 rounded font-medium text-slate-705 dark:text-zinc-150"
            >
              {scanType === "vaccine"
                ? stock.map((item, idx) => (
                    <option key={item.id} value={idx}>
                      Lot Batch: [{item.batchNumber}] - {item.vaccineName}
                    </option>
                  ))
                : patients.map((pat, idx) => (
                    <option key={pat.id} value={idx}>
                      Card ID: [{pat.id}] - Child Name: {pat.childName}
                    </option>
                  ))}
            </select>
          </div>
        </div>

        {/* Visual Camera lens simulator wrapper */}
        <div className="my-6 relative border-2 border-slate-300 dark:border-slate-800 rounded-xl overflow-hidden aspect-video bg-zinc-950 flex flex-col items-center justify-center p-4">
          
          {/* Border focus corners */}
          <div className="absolute top-3 left-3 w-4 h-4 border-t-2 border-l-2 border-primary"></div>
          <div className="absolute top-3 right-3 w-4 h-4 border-t-2 border-r-2 border-primary"></div>
          <div className="absolute bottom-3 left-3 w-4 h-4 border-b-2 border-l-2 border-primary"></div>
          <div className="absolute bottom-3 right-3 w-4 h-4 border-b-2 border-r-2 border-primary"></div>

          {scanState === "scanning" && (
            <>
              {/* Laser Line Animation */}
              <motion.div
                initial={{ y: "-100%" }}
                animate={{ y: "100%" }}
                transition={{
                  repeat: Infinity,
                  duration: 1.5,
                  ease: "easeInOut",
                }}
                className="absolute left-0 right-0 h-0.5 bg-primary shadow-[0_0_12px_#00D9D9] z-10"
              />
              <span className="text-[10px] text-primary font-mono tracking-widest uppercase animate-pulse-slow">
                ALIGNING LOT BARCODE... LASER FIRED
              </span>
            </>
          )}

          {scanState === "idle" && (
            <div className="text-center space-y-2">
              {scanType === "vaccine" ? (
                <QrCode className="w-12 h-12 text-slate-500 mx-auto animate-pulse-slow" />
              ) : (
                <Scan className="w-12 h-12 text-slate-502 mx-auto animate-pulse-slow" />
              )}
              <p className="text-[10px] text-slate-500 font-mono uppercase tracking-wider">
                Specimen Ready. Align under scanner window.
              </p>
            </div>
          )}

          {scanState === "success" && (
            <div className="text-center space-y-2 z-10 bg-slate-900/80 p-3 rounded-lg border border-primary/20">
              <CheckCircle className="w-10 h-10 text-emerald-400 mx-auto" />
              <span className="block text-[11px] text-emerald-400 font-mono tracking-wider font-bold">
                DECRYPTION PROTOCOL COMPLETE
              </span>
            </div>
          )}

          <div className="absolute bottom-3 right-3 bg-zinc-900/60 p-1.5 rounded text-[8px] text-white font-mono flex items-center gap-1">
            <Volume2 className="w-3 h-3 text-primary" /> Audio bip: {useBeep ? "Armed" : "Silent"}
          </div>
        </div>

        {/* Action Button */}
        <div className="flex gap-3">
          <button
            onClick={() => setUseBeep(!useBeep)}
            className={`p-2.5 rounded-xl border text-xs font-semibold ${
              useBeep ? "bg-slate-100 dark:bg-slate-805 text-zinc-705 border-slate-300" : "bg-slate-55 border-slate-205 text-zinc-400"
            }`}
          >
            {useBeep ? "Mute Bip Tone" : "Arm Bip Tone"}
          </button>
          <button
            onClick={triggerLaserSim}
            disabled={scanState === "scanning"}
            className="flex-1 p-2.5 bg-primary hover:bg-primary-hover disabled:bg-slate-300 disabled:text-slate-500 text-slate-909 font-bold text-xs rounded-xl flex items-center justify-center gap-2 transition-all font-mono"
          >
            {scanState === "scanning" ? "PROCESSING DECRYPT..." : "TRIGGER OPTICAL SCANNER (BEEP)"}
          </button>
        </div>
      </div>

      {/* Right Column: Dynamic Database Scan Output */}
      <div className="space-y-6">
        
        {scanState === "success" && scannedVaccine && (
          <motion.div
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-white dark:bg-dark-card border border-slate-200 dark:border-slate-800 p-6 rounded-2xl shadow-xs space-y-6"
          >
            {/* Header */}
            <div className="border-b pb-3 flex items-center justify-between dark:border-slate-800">
              <div>
                <span className="text-[10px] bg-emerald-500/10 text-emerald-502 px-2.5 py-0.5 rounded font-mono font-bold uppercase">
                  ✔ Valid Vaccine Lot Parsed
                </span>
                <h3 className="text-lg font-bold text-slate-850 dark:text-zinc-100 mt-2 font-sans">
                  {scannedVaccine.vaccineName}
                </h3>
              </div>
              <FileSpreadsheet className="w-9 h-9 text-emerald-500" />
            </div>

            {/* Fetched fields */}
            <div className="grid grid-cols-2 gap-4 text-xs">
              <div className="bg-slate-50 dark:bg-slate-905 p-3 rounded">
                <span className="text-[10px] text-slate-400 block font-mono">BATCH NUMBER</span>
                <strong className="text-slate-802 font-mono text-xs dark:text-zinc-200 block truncate select-all">{scannedVaccine.batchNumber}</strong>
              </div>

              <div className="bg-slate-50 dark:bg-slate-905 p-3 rounded">
                <span className="text-[10px] text-slate-400 block font-mono">PHARMACEUTICAL MANUFACTURER</span>
                <strong className="text-slate-802 font-semibold text-xs dark:text-zinc-200 block truncate">{scannedVaccine.manufacturer}</strong>
              </div>

              <div className="bg-slate-50 dark:bg-slate-905 p-3 rounded">
                <span className="text-[10px] text-slate-400 block font-mono">EXPIRY DATE RECORDED</span>
                <strong className="text-slate-802 font-mono text-xs text-rose-500 block truncate">{scannedVaccine.expiryDate}</strong>
              </div>

              <div className="bg-slate-50 dark:bg-slate-905 p-3 rounded">
                <span className="text-[10px] text-slate-400 block font-mono">DEPOT STOCK QUANTITY</span>
                <strong className="text-slate-802 font-mono text-sm dark:text-zinc-200 block truncate">{scannedVaccine.quantity.toLocaleString()} Doses</strong>
              </div>
            </div>

            {/* Additional info */}
            <div className="border-t pt-4 dark:border-slate-850 grid grid-cols-3 gap-2 text-[11px] text-slate-500">
              <div>
                <span className="block text-slate-400">District Depot</span>
                <strong className="text-slate-705 dark:text-slate-200">{scannedVaccine.district}</strong>
              </div>
              <div>
                <span className="block text-slate-400">Sensor Heat</span>
                <strong className="text-emerald-500 font-mono">{scannedVaccine.temperature.toFixed(1)}ºC</strong>
              </div>
              <div>
                <span className="block text-slate-400">Compliance</span>
                <strong className="text-teal-400 uppercase font-mono">{scannedVaccine.status}</strong>
              </div>
            </div>
          </motion.div>
        )}

        {scanState === "success" && scannedPatient && (
          <motion.div
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-white dark:bg-dark-card border border-slate-200 dark:border-slate-800 p-6 rounded-2xl shadow-xs space-y-6"
          >
            {/* Header */}
            <div className="border-b pb-3 flex items-center justify-between dark:border-slate-800">
              <div>
                <span className="text-[10px] bg-primary/20 text-primary-hover px-2.5 py-0.5 rounded font-mono font-bold uppercase">
                  ✔ Valid Child card Barcode decrypted
                </span>
                <h3 className="text-lg font-bold text-slate-850 dark:text-zinc-100 mt-2 font-sans">
                  {scannedPatient.childName}
                </h3>
              </div>
              <UserCheck className="w-9 h-9 text-primary" />
            </div>

            {/* Bio fields */}
            <div className="grid grid-cols-2 gap-4 text-xs">
              <div className="bg-slate-50 dark:bg-slate-900/50 p-3 rounded">
                <span className="text-[10px] text-slate-400 block font-mono">PATIENT IDENTIFIER ID</span>
                <strong className="text-slate-850 font-mono font-bold block text-sm select-all mt-0.5">{scannedPatient.id}</strong>
              </div>

              <div className="bg-slate-50 dark:bg-slate-900/50 p-3 rounded">
                <span className="text-[10px] text-slate-400 block font-mono">DATE OF BIRTH</span>
                <strong className="text-slate-850 block font-mono text-xs dark:text-zinc-300 mt-0.5">{scannedPatient.dob}</strong>
              </div>

              <div className="bg-slate-50 dark:bg-slate-900/50 p-3 rounded">
                <span className="text-[10px] text-slate-400 block font-mono">LEGAL GUARDIAN NAME</span>
                <strong className="text-zinc-700 block text-xs dark:text-zinc-305 mt-0.5">{scannedPatient.guardianName}</strong>
              </div>

              <div className="bg-slate-50 dark:bg-slate-900/50 p-3 rounded">
                <span className="text-[10px] text-slate-400 block font-mono">GUARDIAN CNIC / MOBILE</span>
                <strong className="text-zinc-700 font-mono block text-xs dark:text-zinc-305 mt-0.5">{scannedPatient.cnic} / {scannedPatient.mobileNumber}</strong>
              </div>
            </div>

            {/* Residence Cascades */}
            <div className="border-t pt-4 dark:border-slate-800 space-y-1 text-xs text-zinc-500">
              <span className="text-[10px] block font-mono text-zinc-400">RESIDENTIAL GEOGRAPHICAL UNION COUNCIL</span>
              <p className="font-semibold text-zinc-700 dark:text-zinc-300 leading-normal">
                UC: {scannedPatient.unionCouncil}, Tehsil: {scannedPatient.tehsil}, District: {scannedPatient.district}, Province: {scannedPatient.province}
              </p>
            </div>
          </motion.div>
        )}

        {scanState === "idle" && (
          <div className="bg-slate-50 dark:bg-dark-card border border-dashed border-slate-200 dark:border-slate-800 p-12 text-center rounded-2xl flex flex-col justify-center items-center h-full">
            <Cpu className="w-12 h-12 text-slate-400 mb-2.5 animate-pulse-slow" />
            <span className="text-xs font-mono uppercase text-slate-400 font-bold">Dossier Retrieval Ready</span>
            <p className="text-xs text-slate-400 max-w-xs mt-1 leading-relaxed">
              When scanning is activated, real-time cryptographic decryptions perform on the local SQLite/NoSQL key indexes automatically.
            </p>
          </div>
        )}

        {scanState === "scanning" && (
          <div className="bg-slate-50 dark:bg-dark-card border border-dashed border-slate-205 dark:border-slate-800 p-12 text-center rounded-2xl flex flex-col justify-center items-center h-full">
            <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin mb-3"></div>
            <span className="text-xs font-mono uppercase text-slate-400 font-bold">Querying Central Records...</span>
            <p className="text-xs text-slate-400 max-w-xs mt-1">
              Validating laser-scanned barcode signature against key logs.
            </p>
          </div>
        )}

      </div>

    </div>
  );
}
