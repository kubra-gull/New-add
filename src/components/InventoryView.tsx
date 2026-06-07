import React, { useState, useMemo } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  Boxes,
  Plus,
  ThermometerSnowflake,
  AlertOctagon,
  ChevronsRight,
  RefreshCw,
  CalendarDays,
  ShieldCheck,
  Building,
  Info,
  DollarSign,
  Briefcase,
  Layers,
  Thermometer,
} from "lucide-react";
import { mockDb, logOperation } from "../data/mockFirebase";
import { InventoryRecord } from "../types";
import { ALL_PROVINCES, getDistricts, getTehsils } from "../data/pakistanLocations";

export function InventoryView() {
  const [stock, setStock] = useState<InventoryRecord[]>(() => mockDb.getInventory());

  // Form toggles
  const [isAdding, setIsAdding] = useState(false);
  const [isTransferring, setIsTransferring] = useState(false);
  const [isReturning, setIsReturning] = useState(false);

  // Form states
  const [formName, setFormName] = useState("Polio Vaccine (Sabin/OPV)");
  const [formBatch, setFormBatch] = useState("");
  const [formManuf, setFormManuf] = useState("");
  const [formQty, setFormQty] = useState(1000);
  const [formArrival, setFormArrival] = useState("");
  const [formExpiry, setFormExpiry] = useState("");
  const [formProv, setFormProv] = useState(ALL_PROVINCES[0]);
  const [formDist, setFormDist] = useState("");
  const [formTeh, setFormTeh] = useState("");

  // Transfer Form State
  const [transferBatch, setTransferBatch] = useState("");
  const [transferQty, setTransferQty] = useState(100);
  const [transferTargetDistrict, setTransferTargetDistrict] = useState("");

  // Return/Wastage Form State
  const [returnBatch, setReturnBatch] = useState("");
  const [returnQty, setReturnQty] = useState(10);
  const [returnReason, setReturnReason] = useState("Cold Chain Overlap");

  // Dynamic cascades for location in forms
  const distList = useMemo(() => getDistricts(formProv), [formProv]);
  const tehList = useMemo(() => getTehsils(formProv, formDist), [formProv, formDist]);

  React.useEffect(() => {
    if (distList.length > 0) {
      setFormDist((curr) => (distList.includes(curr) ? curr : distList[0]));
    } else {
      setFormDist("");
    }
  }, [distList]);

  React.useEffect(() => {
    if (tehList.length > 0) {
      setFormTeh((curr) => (tehList.includes(curr) ? curr : tehList[0]));
    } else {
      setFormTeh("");
    }
  }, [tehList]);

  // Thermistor interactive temperature gauge for simulation
  const [currentSimTemp, setCurrentSimTemp] = useState<number>(4.2);

  // Calculated Compliance status based on dynamic slider
  const { complianceStatus, complianceBg, complianceText } = useMemo(() => {
    if (currentSimTemp >= 2 && currentSimTemp <= 8) {
      return {
        complianceStatus: "OPTIMAL (COGNITIVE LOCK)",
        complianceBg: "bg-emerald-500/10 border-emerald-500 text-emerald-500",
        complianceText: "Safe vaccine storage temperature range of 2ºC to 8ºC is actively locked.",
      };
    } else if (currentSimTemp >= 0 && currentSimTemp < 2) {
      return {
        complianceStatus: "WARNING: LOW TEMPERATURE",
        complianceBg: "bg-amber-500/10 border-amber-500 text-amber-500",
        complianceText: "Approaching vaccine freezing threshold. Check refrigerator thermostat immediately.",
      };
    } else {
      return {
        complianceStatus: "CRITICAL COLD-CHAIN BREAK ALARM",
        complianceBg: "bg-red-500/10 border-red-500 text-red-500 animate-pulse",
        complianceText: "CRITICAL WARNING: Temperature violates cold-chain bounds. Vaccine spoilage risk active!",
      };
    }
  }, [currentSimTemp]);

  // Total Quantity Calculation
  const grandTotalDoses = useMemo(() => {
    return stock.reduce((acc, curr) => acc + curr.quantity, 0);
  }, [stock]);

  // Handler: Add Stock
  const handleAddStock = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formBatch || !formManuf || !formQty || !formArrival || !formExpiry) {
      alert("Please complete all vaccine shipment data.");
      return;
    }

    const newRecord: InventoryRecord = {
      id: `INV-${Date.now().toString().substr(9)}`,
      vaccineName: formName,
      batchNumber: formBatch.toUpperCase(),
      manufacturer: formManuf,
      quantity: Number(formQty),
      arrivalDate: formArrival,
      expiryDate: formExpiry,
      temperature: 4.0, // base starting point
      minimumTemp: 2.0,
      maximumTemp: 5.0,
      status: Number(formQty) < 100 ? "Low Stock" : "Robust",
      province: formProv,
      district: formDist,
      tehsil: formTeh,
      createdAt: new Date().toISOString(),
    };

    const updated = [newRecord, ...stock];
    setStock(updated);
    mockDb.setInventory(updated);
    setIsAdding(false);

    // Clear forms
    setFormBatch("");
    setFormManuf("");
    setFormQty(1000);

    logOperation(
      "ADD_STOCK",
      `Received shipment of ${formName} (Batch: ${formBatch}) at ${formTeh} storage depot.`
    );
  };

  // Handler: Transfer Stock
  const handleTransferStock = (e: React.FormEvent) => {
    e.preventDefault();
    if (!transferBatch || !transferQty || !transferTargetDistrict) return;

    const matchedBatchIndex = stock.findIndex(
      (item) => item.batchNumber.toLowerCase() === transferBatch.toLowerCase()
    );

    if (matchedBatchIndex === -1) {
      alert("Lot ID batch not detected in inventory records.");
      return;
    }

    const matchedBatch = stock[matchedBatchIndex];
    if (matchedBatch.quantity < transferQty) {
      alert(`Insufficient reserves. Only ${matchedBatch.quantity} doses present in batch ${transferBatch}.`);
      return;
    }

    // Process transfer
    matchedBatch.quantity -= transferQty;
    if (matchedBatch.quantity < 100 && matchedBatch.quantity > 0) {
      matchedBatch.status = "Low Stock";
    }

    // Log operational transfer as separate inventory segment
    const transferRecord: InventoryRecord = {
      ...matchedBatch,
      id: `INV-TF-${Math.random().toString(36).substr(2, 5).toUpperCase()}`,
      quantity: Number(transferQty),
      district: transferTargetDistrict,
      status: "Robust",
      createdAt: new Date().toISOString(),
    };

    const finalStock = [...stock];
    finalStock.push(transferRecord);
    setStock(finalStock);
    mockDb.setInventory(finalStock);
    setIsTransferring(false);

    logOperation(
      "TRANSFER_STOCK",
      `Transferred ${transferQty} doses of ${matchedBatch.vaccineName} (Batch: ${transferBatch}) to ${transferTargetDistrict}.`
    );
  };

  // Handler: Return / Wastage
  const handleReturnStock = (e: React.FormEvent) => {
    e.preventDefault();
    if (!returnBatch || !returnQty) return;

    const matchedBatch = stock.find((item) => item.batchNumber.toLowerCase() === returnBatch.toLowerCase());
    if (!matchedBatch) {
      alert("Lot active batch number not found in reserves registry.");
      return;
    }

    if (matchedBatch.quantity < returnQty) {
      alert("Cannot return doses greater than existing batch stocks.");
      return;
    }

    matchedBatch.quantity -= Number(returnQty);
    setStock([...stock]);
    mockDb.setInventory([...stock]);
    setIsReturning(false);

    logOperation(
      "RETURN_STOCK",
      `Disposed/Returned ${returnQty} doses of ${matchedBatch.vaccineName} due to: ${returnReason}`
    );
  };

  // Delete inventory line completely
  const handleDeleteInventoryLine = (id: string) => {
    if (!confirm("Are you sure you want to remove this inventory record completely from NIH databases?")) return;
    const filtered = stock.filter((item) => item.id !== id);
    setStock(filtered);
    mockDb.setInventory(filtered);
    logOperation("INVENTORY_DELETE", `Removed Inventory Tracking sheet ID: ${id}`);
  };

  return (
    <div className="space-y-6">
      
      {/* Upper overview controls */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-zinc-900 border-b-4 border-primary p-6 rounded-2xl text-white">
        <div>
          <span className="text-[10px] text-primary uppercase font-mono font-bold tracking-widest bg-primary/10 px-2 py-0.5 rounded">
            LOGISTICS CONTROL FRAMEWAY
          </span>
          <h1 className="text-xl md:text-2xl font-bold mt-1 tracking-tight">
            National Vaccine Cold-Chain Logistics
          </h1>
          <p className="text-xs text-slate-300 mt-1">
            Real-time manufacturer batching records, expiration indexes, and depot refrigeration telemetry
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => {
              setIsTransferring(false);
              setIsReturning(false);
              setIsAdding(true);
            }}
            className="p-2 px-3.5 bg-primary hover:bg-primary-hover text-slate-905 font-bold text-xs rounded-xl flex items-center gap-1.5 transition-all"
          >
            <Plus className="w-4 h-4" /> Add Shipment
          </button>
          
          <button
            onClick={() => {
              setIsAdding(false);
              setIsReturning(false);
              setIsTransferring(true);
            }}
            className="p-2 px-3.5 bg-[#005F73] hover:bg-[#005F73]/80 text-white text-xs font-semibold rounded-xl flex items-center gap-1.5 transition-all border border-primary/30"
          >
            <ChevronsRight className="w-4 h-4" /> Transfer Stock
          </button>

          <button
            onClick={() => {
              setIsAdding(false);
              setIsTransferring(false);
              setIsReturning(true);
            }}
            className="p-2 px-3.5 bg-rose-950 text-red-300 hover:bg-rose-900 text-xs font-semibold rounded-xl flex items-center gap-1.5 transition-all border border-red-500/20"
          >
            <RefreshCw className="w-4 h-4" /> Return/Wastage
          </button>
        </div>
      </div>

      {/* Thermistor compliance interactive dial */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Interactive Thermistor Card */}
        <div className="lg:col-span-1 bg-white dark:bg-dark-card border border-slate-200 dark:border-slate-800 p-6 rounded-xl flex flex-col justify-between">
          <div className="space-y-4">
            <h3 className="font-bold text-slate-850 dark:text-slate-100 text-sm flex items-center gap-2">
              <ThermometerSnowflake className="w-5 h-5 text-primary" /> Active Thermistor Telemetry
            </h3>
            <p className="text-xs text-slate-400">
              Drag the dial below to simulate storage temperature fluctuations and audit active warning indicators across Pakistan vaccine reserves.
            </p>

            {/* Slider Controls */}
            <div className="py-4 space-y-4 text-center">
              <span className={`text-4xl font-extrabold font-mono tracking-tighter ${
                currentSimTemp >= 2 && currentSimTemp <= 8 ? "text-emerald-500" : "text-red-500"
              }`}>
                {currentSimTemp.toFixed(1)} ºC
              </span>
              
              <div className="space-y-1">
                <input
                  type="range"
                  min="-5"
                  max="15"
                  step="0.5"
                  value={currentSimTemp}
                  onChange={(e) => setCurrentSimTemp(Number(e.target.value))}
                  className="w-full h-2 bg-slate-200 dark:bg-slate-850 rounded-lg appearance-none cursor-pointer accent-primary"
                />
                <div className="flex justify-between text-[10px] text-slate-400 font-mono">
                  <span>-5ºC (Frozen)</span>
                  <span className="text-emerald-500 font-bold">2ºC - 8ºC Optimal</span>
                  <span>15ºC (Critical)</span>
                </div>
              </div>
            </div>

            {/* Temperature Alerts Output */}
            <div className={`p-4 border-l-4 rounded-r-lg text-xs space-y-1 ${complianceBg}`}>
              <strong className="block font-bold font-mono tracking-wide">{complianceStatus}</strong>
              <p className="opacity-90 leading-normal">{complianceText}</p>
            </div>
          </div>

          <div className="bg-slate-50 dark:bg-slate-900/40 p-3.5 rounded-xl text-xs text-slate-500 italic flex items-start gap-2 mt-4">
            <Info className="w-4.5 h-4.5 text-slate-400 shrink-0" />
            <span>
              EPI strict cold-chain compliance demands constant data Logging. Freezing ruins Pertussis/Hepatitis B antigens, while heat spoils oral Polio strains rapidly.
            </span>
          </div>
        </div>

        {/* Dynamic Multi-forms Area */}
        <div className="lg:col-span-2">
          <AnimatePresence mode="wait">
            {isAdding && (
              <motion.form
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                onSubmit={handleAddStock}
                className="bg-white dark:bg-dark-card border border-slate-200 dark:border-slate-800 p-6 rounded-xl space-y-5 shadow-xs"
              >
                <div className="flex justify-between items-center border-b pb-2 dark:border-slate-800">
                  <h3 className="font-bold text-slate-850 dark:text-slate-100 flex items-center gap-2">
                    <Building className="w-5 h-5 text-primary" /> Register Vaccine Consignment Lot
                  </h3>
                  <button type="button" onClick={() => setIsAdding(false)} className="text-slate-400 font-bold hover:text-black">Cancel</button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
                  <div>
                    <label className="block text-slate-400 mb-1">Vaccine Formula Name *</label>
                    <select
                      value={formName}
                      onChange={(e) => setFormName(e.target.value)}
                      className="w-full p-2.5 bg-slate-50 dark:bg-zinc-900 rounded border dark:border-slate-800 text-slate-805 dark:text-zinc-150"
                    >
                      <option value="Polio Vaccine (Sabin/OPV)">Polio drop formulations</option>
                      <option value="Measles-Rubella MR Vaccine">Measles-Rubella MR combinations</option>
                      <option value="BCG (Tuberculosis) Vaccine">Tuberculosis (BCG)</option>
                      <option value="Pentavalent (DTP-HepB-Hib)">Pentavalent diphtheria series</option>
                      <option value="Typhoid Conjugate Vaccine">Typhoid Conjugate Vaccines (TCV)</option>
                      <option value="Rotavirus Oral Vaccine">Rotavirus Oral formulations</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-slate-400 mb-1">Batch ID Stamp (Lot) *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. OPV-993-SND"
                      value={formBatch}
                      onChange={(e) => setFormBatch(e.target.value)}
                      className="w-full p-2.5 bg-slate-50 dark:bg-zinc-900 rounded border font-mono dark:border-slate-800 text-slate-805 dark:text-zinc-150"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-400 mb-1">Manufacturer *</label>
                    <input
                      type="text"
                      required
                      placeholder="Serum Institute / GSK / NIH"
                      value={formManuf}
                      onChange={(e) => setFormManuf(e.target.value)}
                      className="w-full p-2.5 bg-slate-50 dark:bg-zinc-900 rounded border dark:border-slate-800 text-slate-805 dark:text-zinc-150"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
                  <div>
                    <label className="block text-slate-400 mb-1">Shipment Quantity (Doses) *</label>
                    <input
                      type="number"
                      required
                      value={formQty}
                      onChange={(e) => setFormQty(Number(e.target.value))}
                      className="w-full p-2.5 bg-slate-50 dark:bg-zinc-900 rounded border font-mono dark:border-slate-800 text-slate-805 dark:text-zinc-150"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-400 mb-1">Arrival Date *</label>
                    <input
                      type="date"
                      required
                      value={formArrival}
                      onChange={(e) => setFormArrival(e.target.value)}
                      className="w-full p-2.5 bg-slate-50 dark:bg-zinc-900 rounded border dark:border-slate-800 text-slate-805 dark:text-zinc-150"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-400 mb-1">Expiry Date *</label>
                    <input
                      type="date"
                      required
                      value={formExpiry}
                      onChange={(e) => setFormExpiry(e.target.value)}
                      className="w-full p-2.5 bg-slate-50 dark:bg-zinc-900 rounded border dark:border-slate-800 text-slate-805 dark:text-zinc-150"
                    />
                  </div>
                </div>

                {/* Geography layout */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs border-t pt-3 dark:border-slate-800">
                  <div>
                    <label className="block text-[11px] text-slate-400 mb-1">Province Location *</label>
                    <select
                      value={formProv}
                      onChange={(e) => setFormProv(e.target.value)}
                      className="w-full bg-slate-50 dark:bg-zinc-900 p-2 border dark:border-slate-800"
                    >
                      {ALL_PROVINCES.map((p) => (
                        <option key={p} value={p}>{p}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-[11px] text-slate-400 mb-1">District depot *</label>
                    <select
                      value={formDist}
                      onChange={(e) => setFormDist(e.target.value)}
                      className="w-full bg-slate-50 dark:bg-zinc-900 p-2 border dark:border-slate-800"
                    >
                      {distList.map((d) => (
                        <option key={d} value={d}>{d}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-[11px] text-slate-400 mb-1">Tehsil depot *</label>
                    <select
                      value={formTeh}
                      onChange={(e) => setFormTeh(e.target.value)}
                      className="w-full bg-slate-50 dark:bg-zinc-900 p-2 border dark:border-slate-800"
                    >
                      {tehList.map((t) => (
                        <option key={t} value={t}>{t}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="flex justify-end pt-2 border-t dark:border-slate-800">
                  <button type="submit" className="px-5 py-2 text-xs bg-primary text-slate-909 font-bold rounded-xl flex items-center gap-1.5 hover:bg-teal-500">
                    <ShieldCheck className="w-4 h-4" /> Finalize Stock Integration
                  </button>
                </div>
              </motion.form>
            )}

            {isTransferring && (
              <motion.form
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                onSubmit={handleTransferStock}
                className="bg-white dark:bg-dark-card border border-slate-200 dark:border-slate-800 p-6 rounded-xl space-y-4 shadow-xs text-xs"
              >
                <div className="flex justify-between items-center border-b pb-2 dark:border-slate-800">
                  <h3 className="font-bold text-slate-850 dark:text-zinc-100 flex items-center gap-2">
                    <ChevronsRight className="w-5 h-5 text-primary" /> Transfer Inter-depot Stock Lots
                  </h3>
                  <button type="button" onClick={() => setIsTransferring(false)} className="text-slate-400 font-bold hover:text-black">Cancel</button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-slate-400 mb-1">Source Batch ID (Available Lot) *</label>
                    <select
                      value={transferBatch}
                      onChange={(e) => setTransferBatch(e.target.value)}
                      required
                      className="w-full bg-slate-50 dark:bg-slate-905 p-2 rounded text-zinc-705 dark:text-zinc-150 border dark:border-slate-800 font-mono"
                    >
                      <option value="">-- Choose active batch --</option>
                      {stock.map((item) => (
                        <option key={item.id} value={item.batchNumber}>
                          {item.batchNumber} - {item.vaccineName} ({item.quantity} doses)
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-slate-400 mb-1">Transfer Dosage Volume *</label>
                    <input
                      type="number"
                      required
                      min={10}
                      value={transferQty}
                      onChange={(e) => setTransferQty(Number(e.target.value))}
                      className="w-full bg-slate-50 dark:bg-slate-905 border dark:border-slate-850 p-2 rounded text-zinc-700"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-400 mb-1">Recipient Destination District *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Hyderabad / Peshawar"
                      value={transferTargetDistrict}
                      onChange={(e) => setTransferTargetDistrict(e.target.value)}
                      className="w-full bg-slate-50 dark:bg-slate-905 border p-2 rounded text-zinc-700"
                    />
                  </div>
                </div>

                <div className="flex justify-end pt-2 border-t dark:border-slate-800">
                  <button type="submit" className="px-5 py-2 bg-secondary text-white font-bold rounded-xl">
                    Authorize Consignment Transfer
                  </button>
                </div>
              </motion.form>
            )}

            {isReturning && (
              <motion.form
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                onSubmit={handleReturnStock}
                className="bg-white dark:bg-dark-card border border-slate-200 dark:border-slate-800 p-6 rounded-xl space-y-4 shadow-xs text-xs"
              >
                <div className="flex justify-between items-center border-b pb-2 dark:border-slate-800">
                  <h3 className="font-bold text-slate-850 dark:text-zinc-100 flex items-center gap-2">
                    <RefreshCw className="w-5 h-5 text-red-500" /> Log Vaccine Disposal & Return / Wastage
                  </h3>
                  <button type="button" onClick={() => setIsReturning(false)} className="text-zinc-400 font-bold font-bold hover:text-black">Cancel</button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-slate-400 mb-1">Select Discarded Batch Lot *</label>
                    <select
                      value={returnBatch}
                      onChange={(e) => setReturnBatch(e.target.value)}
                      required
                      className="w-full bg-slate-50 dark:bg-slate-905 border p-2 rounded text-zinc-705 dark:text-zinc-150 font-mono"
                    >
                      <option value="">-- Choose lot --</option>
                      {stock.map((item) => (
                        <option key={item.id} value={item.batchNumber}>
                          {item.batchNumber} - {item.vaccineName} ({item.quantity} doses)
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-slate-400 mb-1">Damaged/Wastage Dose Count *</label>
                    <input
                      type="number"
                      required
                      value={returnQty}
                      onChange={(e) => setReturnQty(Number(e.target.value))}
                      className="w-full bg-slate-50 dark:bg-slate-905 border p-2 rounded text-zinc-700"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-400 mb-1">Disposal Audit Reason *</label>
                    <select
                      value={returnReason}
                      onChange={(e) => setReturnReason(e.target.value)}
                      className="w-full bg-slate-50 dark:bg-slate-905 border p-2 rounded text-zinc-705"
                    >
                      <option value="Cold Chain Fail">Cold Chain Freezing Violations</option>
                      <option value="Vials Expiry Date">Batch Exceeded Manufacturer Expiry</option>
                      <option value="Physical Vial Fractures">Broken Vials / Physical Spoil</option>
                      <option value="Unused Outflow Return">Unused vaccine return</option>
                    </select>
                  </div>
                </div>

                <div className="flex justify-end pt-2 border-t dark:border-slate-800">
                  <button type="submit" className="px-5 py-2 bg-red-600 text-white font-bold rounded-xl hover:bg-red-700">
                    Submit Wastage / Disposal Audit
                  </button>
                </div>
              </motion.form>
            )}
          </AnimatePresence>

          {/* Core Grand metrics totals widgets */}
          <div className="mt-4 bg-[#005F73] text-white p-5 rounded-2xl flex justify-between items-center relative overflow-hidden border border-primary/30 shadow-xs">
            <div className="absolute -bottom-6 -right-6 w-32 h-32 bg-primary/10 rounded-full"></div>
            <div>
              <span className="text-[9px] uppercase tracking-wider font-mono text-primary font-extrabold bg-white/10 px-2 py-0.5 rounded">
                SECURED CENTRAL SUPPLY LINE
              </span>
              <p className="text-sm text-slate-200 mt-1">Grand National Registered Stockpile</p>
              <h2 className="text-3xl font-extrabold font-mono tracking-tight mt-0.5">{grandTotalDoses.toLocaleString()}</h2>
            </div>
            <Boxes className="w-12 h-12 text-primary opacity-60 shrink-0" />
          </div>
        </div>

      </div>

      {/* Main Stock Table listing in beautiful Cards */}
      <div className="bg-white dark:bg-dark-card border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-xs">
        <h3 className="font-bold text-slate-850 dark:text-slate-100 flex items-center gap-2 mb-4">
          <Layers className="w-5 h-5 text-primary" /> Active Consignments Inventory Registry
        </h3>

        <div className="overflow-x-auto custom-scrollbar">
          <table className="w-full text-left text-xs text-slate-500">
            <thead className="bg-slate-50 dark:bg-slate-850 text-slate-500 uppercase text-[10px] tracking-wider font-mono">
              <tr>
                <th className="p-3">Vaccine / Batch Stamp</th>
                <th className="p-3">Manufacturer</th>
                <th className="p-3 text-right">Doses In Stock</th>
                <th className="p-3">Expiry Date</th>
                <th className="p-3 text-center">Temp Check</th>
                <th className="p-3">Location Depot</th>
                <th className="p-3">Status</th>
                <th className="p-3 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60 text-slate-705 dark:text-zinc-300">
              {stock.map((item) => {
                const nearExpiry = new Date(item.expiryDate).getTime() < new Date("2026-09-01").getTime();
                
                return (
                  <tr key={item.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-900/30 transition-all">
                    <td className="p-3">
                      <div className="font-bold text-slate-850 dark:text-white truncate max-w-xs">{item.vaccineName}</div>
                      <span className="text-[10px] font-mono font-semibold bg-slate-100 dark:bg-slate-800 text-slate-500 px-1.5 py-0.5 rounded mt-1 inline-block select-all">
                        {item.batchNumber}
                      </span>
                    </td>
                    <td className="p-3 truncate max-w-[150px]">{item.manufacturer}</td>
                    <td className="p-3 text-right font-bold font-mono text-sm text-slate-900 dark:text-primary">
                      {item.quantity.toLocaleString()}
                    </td>
                    <td className={`p-3 font-mono ${nearExpiry ? "text-red-500 font-bold" : ""}`}>
                      {item.expiryDate} {nearExpiry && "⚠️ Expiring"}
                    </td>
                    <td className="p-3 text-center font-mono font-bold text-emerald-500">
                      {item.temperature.toFixed(1)}ºC
                    </td>
                    <td className="p-3">
                      <span className="block">{item.district}</span>
                      <span className="text-[10px] text-slate-400 font-mono italic">{item.province}</span>
                    </td>
                    <td className="p-3">
                      <span className={`px-2 py-0.5 rounded font-mono text-[9px] font-bold uppercase ${
                        item.status === "Robust"
                          ? "bg-emerald-500/10 text-emerald-500"
                          : item.status === "Low Stock"
                          ? "bg-amber-500/10 text-amber-500"
                          : "bg-red-500/10 text-red-500"
                      }`}>
                        {item.status}
                      </span>
                    </td>
                    <td className="p-3 text-center">
                      <button
                        onClick={() => handleDeleteInventoryLine(item.id)}
                        className="p-1 px-2.5 text-[10px] bg-red-100 text-red-650 rounded hover:bg-red-200 font-mono uppercase dark:bg-red-950/40 dark:text-red-400"
                      >
                        Duct out
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}
