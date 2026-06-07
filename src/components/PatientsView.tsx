import React, { useState, useMemo } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  Search,
  Plus,
  UserCheck,
  Edit2,
  Trash2,
  Phone,
  Bookmark,
  MapPin,
  Calendar,
  Layers,
  Sparkles,
  ClipboardList,
  Syringe,
  X,
  Printer,
  FileCheck,
} from "lucide-react";
import {
  ALL_PROVINCES,
  getDistricts,
  getTehsils,
  getUnionCouncils,
} from "../data/pakistanLocations";
import { mockDb, logOperation } from "../data/mockFirebase";
import { PatientRecord, VaccinationRecord } from "../types";

export function PatientsView() {
  const [patients, setPatients] = useState<PatientRecord[]>(() => mockDb.getPatients());
  const [vaccinations, setVaccinations] = useState<VaccinationRecord[]>(() => mockDb.getVaccinations());
  const [selectedPatientId, setSelectedPatientId] = useState<string | null>(null);

  // Search filter terms
  const [searchTerm, setSearchTerm] = useState("");
  
  // Registration form states
  const [isRegistering, setIsRegistering] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  
  // Form fields state
  const [formName, setFormName] = useState("");
  const [formDob, setFormDob] = useState("");
  const [formGender, setFormGender] = useState<"Male" | "Female" | "Other">("Male");
  const [formGuardian, setFormGuardian] = useState("");
  const [formCnic, setFormCnic] = useState("");
  const [formMobile, setFormMobile] = useState("");
  const [formAddress, setFormAddress] = useState("");
  const [formProvince, setFormProvince] = useState(ALL_PROVINCES[0]);
  const [formDistrict, setFormDistrict] = useState("");
  const [formTehsil, setFormTehsil] = useState("");
  const [formUc, setFormUc] = useState("");
  
  // Injection / Dose Scheduling Form
  const [isScheduling, setIsScheduling] = useState(false);
  const [schedDisease, setSchedDisease] = useState("Polio");
  const [schedDoseNum, setSchedDoseNum] = useState(1);
  const [schedDate, setSchedDate] = useState("");
  
  // Dose Administer Record states
  const [isAdministering, setIsAdministering] = useState<string | null>(null); // holds v.id
  const [adminBatch, setAdminBatch] = useState("");
  const [adminNotes, setAdminNotes] = useState("");

  // Districts cascade updates
  const districtsList = useMemo(() => getDistricts(formProvince), [formProvince]);
  const tehsilsList = useMemo(() => getTehsils(formProvince, formDistrict), [formProvince, formDistrict]);
  const ucsList = useMemo(() => getUnionCouncils(formProvince, formDistrict, formTehsil), [formProvince, formDistrict, formTehsil]);

  // Sync cascading dropdown defaults when province/district changes
  React.useEffect(() => {
    if (districtsList.length > 0) {
      setFormDistrict((d) => (districtsList.includes(d) ? d : districtsList[0]));
    } else {
      setFormDistrict("");
    }
  }, [districtsList]);

  React.useEffect(() => {
    if (tehsilsList.length > 0) {
      setFormTehsil((t) => (tehsilsList.includes(t) ? t : tehsilsList[0]));
    } else {
      setFormTehsil("");
    }
  }, [tehsilsList]);

  React.useEffect(() => {
    if (ucsList.length > 0) {
      setFormUc((u) => (ucsList.includes(u) ? u : ucsList[0]));
    } else {
      setFormUc("");
    }
  }, [ucsList]);

  // Search implementation
  const filteredPatients = useMemo(() => {
    const q = searchTerm.toLowerCase().trim();
    if (!q) return patients;
    return patients.filter(
      (p) =>
        p.childName.toLowerCase().includes(q) ||
        p.id.toLowerCase().includes(q) ||
        p.cnic.includes(q) ||
        p.mobileNumber.includes(q) ||
        p.district.toLowerCase().includes(q) ||
        p.province.toLowerCase().includes(q)
    );
  }, [patients, searchTerm]);

  // Currently Selected Patient
  const selectedPatient = useMemo(() => {
    return patients.find((p) => p.id === selectedPatientId) || null;
  }, [patients, selectedPatientId]);

  // Currently Selected Patient's Immunization List
  const selectedPatientVaccs = useMemo(() => {
    if (!selectedPatientId) return [];
    return vaccinations.filter((v) => v.patientId === selectedPatientId);
  }, [vaccinations, selectedPatientId]);

  const clearForm = () => {
    setFormName("");
    setFormDob("");
    setFormGender("Male");
    setFormGuardian("");
    setFormCnic("");
    setFormMobile("");
    setFormAddress("");
    setFormProvince(ALL_PROVINCES[0]);
    setFormDistrict("");
    setFormTehsil("");
    setFormUc("");
  };

  // Create Patient Handler
  const handleRegisterChild = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formName || !formDob || !formGuardian || !formCnic || !formMobile || !formProvince) {
      alert("Please complete all mandatory patient fields.");
      return;
    }

    const autoId = `NIH-PAT-${100 + patients.length + 1}`;
    const newRecord: PatientRecord = {
      id: autoId,
      childName: formName,
      dob: formDob,
      gender: formGender,
      guardianName: formGuardian,
      cnic: formCnic,
      mobileNumber: formMobile,
      address: formAddress || "N/A",
      province: formProvince,
      district: formDistrict,
      tehsil: formTehsil,
      unionCouncil: formUc || "UC Rural 1",
      registeredBy: "admin-user-01",
      createdAt: new Date().toISOString(),
    };

    const updated = [...patients, newRecord];
    setPatients(updated);
    mockDb.setPatients(updated);
    setSelectedPatientId(autoId);
    setIsRegistering(false);

    // Bootstrap standard vaccination calendar scheduling: BCG and Polio-1
    const initialVaccs: VaccinationRecord[] = [
      {
        id: `VAC-${Math.random().toString(36).substr(2, 9).toUpperCase()}`,
        patientId: autoId,
        diseaseName: "Tuberculosis (BCG)",
        doseNumber: 1,
        status: "scheduled",
        administeredDate: null,
        scheduledDate: formDob, // Birth dose
        batchNumber: null,
        administeredBy: null,
        clinicLocation: `${formDistrict} District Centre`,
        notes: "Automated birth BCG dose schedule.",
        createdAt: new Date().toISOString(),
      },
      {
        id: `VAC-${Math.random().toString(36).substr(2, 9).toUpperCase()}`,
        patientId: autoId,
        diseaseName: "Polio",
        doseNumber: 1,
        status: "scheduled",
        administeredDate: null,
        scheduledDate: new Date(new Date(formDob).getTime() + 14 * 24 * 60 * 60 * 1000).toISOString().split("T")[0], // 14 days later
        batchNumber: null,
        administeredBy: null,
        clinicLocation: `${formDistrict} Mobile Point`,
        notes: "Scheduled Polio drops.",
        createdAt: new Date().toISOString(),
      },
    ];

    const allVaccs = [...vaccinations, ...initialVaccs];
    setVaccinations(allVaccs);
    mockDb.setVaccinations(allVaccs);

    logOperation(
      "REGISTER_CHILD",
      `Registered child ${formName} (${autoId}) with automated birth immunizations in UC: ${formUc}.`
    );
    clearForm();
  };

  // Edit patient setup
  const startEditPatient = () => {
    if (!selectedPatient) return;
    setFormName(selectedPatient.childName);
    setFormDob(selectedPatient.dob);
    setFormGender(selectedPatient.gender);
    setFormGuardian(selectedPatient.guardianName);
    setFormCnic(selectedPatient.cnic);
    setFormMobile(selectedPatient.mobileNumber);
    setFormAddress(selectedPatient.address);
    setFormProvince(selectedPatient.province);
    setFormDistrict(selectedPatient.district);
    setFormTehsil(selectedPatient.tehsil);
    setFormUc(selectedPatient.unionCouncil);
    
    setIsEditing(true);
  };

  const handleUpdatePatient = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedPatientId) return;

    const updatedList = patients.map((p) => {
      if (p.id === selectedPatientId) {
        return {
          ...p,
          childName: formName,
          dob: formDob,
          gender: formGender,
          guardianName: formGuardian,
          cnic: formCnic,
          mobileNumber: formMobile,
          address: formAddress,
          province: formProvince,
          district: formDistrict,
          tehsil: formTehsil,
          unionCouncil: formUc,
        };
      }
      return p;
    });

    setPatients(updatedList);
    mockDb.setPatients(updatedList);
    setIsEditing(false);

    logOperation("PATIENT_EDIT", `Modified child profile data for ID: ${selectedPatientId}`);
    clearForm();
  };

  // Delete patient
  const handleDeletePatient = (patId: string) => {
    if (!confirm("Are you sure you want to delete this patient profile? This deletes associated vaccine logs.")) return;
    
    const filteredPat = patients.filter((p) => p.id !== patId);
    const filteredVac = vaccinations.filter((v) => v.patientId !== patId);

    setPatients(filteredPat);
    mockDb.setPatients(filteredPat);
    setVaccinations(filteredVac);
    mockDb.setVaccinations(filteredVac);

    setSelectedPatientId(null);
    logOperation("PATIENT_DELETE", `Permanently removed patient record and vaccine schedule for ID: ${patId}`);
  };

  // Schedule Custom Vaccine Dose
  const handleScheduleDose = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedPatientId || !schedDate) return;

    const newSched: VaccinationRecord = {
      id: `VAC-${Math.random().toString(36).substr(2, 9).toUpperCase()}`,
      patientId: selectedPatientId,
      diseaseName: schedDisease,
      doseNumber: Number(schedDoseNum),
      status: "scheduled",
      administeredDate: null,
      scheduledDate: schedDate,
      batchNumber: null,
      administeredBy: null,
      clinicLocation: "EPI Registered Point",
      notes: "Manually scheduled appointment.",
      createdAt: new Date().toISOString(),
    };

    const updatedVac = [...vaccinations, newSched];
    setVaccinations(updatedVac);
    mockDb.setVaccinations(updatedVac);
    setIsScheduling(false);
    setSchedDate("");

    logOperation("SCHEDULE_DOSE", `Scheduled manual dose of ${schedDisease} for child ID: ${selectedPatientId}`);
  };

  // Inject Dose Handler (Mark as Administered)
  const handleAdministerDose = (vacId: string) => {
    if (!adminBatch) {
      alert("Manufacturing batch number is required for vaccine cold-chain trace audits.");
      return;
    }

    const updated = vaccinations.map((v) => {
      if (v.id === vacId) {
        return {
          ...v,
          status: "administered" as const,
          administeredDate: new Date().toISOString(),
          batchNumber: adminBatch,
          notes: adminNotes || "Administered successfully.",
          administeredBy: "admin-user-01",
        };
      }
      return v;
    });

    setVaccinations(updated);
    mockDb.setVaccinations(updated);

    // Deduct stock dose from inventory automatically if tracked
    const inventoryList = mockDb.getInventory();
    const batchMatched = inventoryList.find((item) => item.batchNumber.toLowerCase() === adminBatch.toLowerCase());
    if (batchMatched && batchMatched.quantity > 0) {
      batchMatched.quantity -= 1;
      if (batchMatched.quantity <= 0) {
        batchMatched.status = "Low Stock";
      }
      mockDb.setInventory(inventoryList);
    }

    setIsAdministering(null);
    setAdminBatch("");
    setAdminNotes("");

    logOperation(
      "VACCINE_ADMINISTER",
      `Injected Dose Vaccine Log ID: ${vacId} with Batch No: ${adminBatch}`
    );
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      
      {/* Left Column: Instant Lookup Registry & Search list */}
      <div className="lg:col-span-1 bg-white dark:bg-dark-card rounded-2xl border border-slate-200 dark:border-slate-800 p-5 flex flex-col justify-between max-h-[80vh]">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-slate-800 dark:text-slate-100 flex items-center gap-2">
              <ClipboardList className="w-5 h-5 text-primary" /> Integrated Patient Index
            </h3>
            <button
              onClick={() => {
                clearForm();
                setIsEditing(false);
                setIsRegistering(true);
              }}
              className="p-1 px-2.5 text-xs bg-primary hover:bg-primary-hover text-slate-900 font-bold rounded-lg flex items-center gap-1 transition-all"
            >
              <Plus className="w-4 h-4" /> Register
            </button>
          </div>

          {/* Instant dynamic Search Box */}
          <div className="relative">
            <Search className="absolute left-3 top-2.5 w-4.5 h-4.5 text-slate-400" />
            <input
              type="text"
              placeholder="Search ID, Name, CNIC, Mobile, District..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-4 py-2 text-xs rounded-lg bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 focus:outline-none focus:border-primary font-mono"
            />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm("")}
                className="absolute right-3 top-3 text-xs text-slate-400 hover:text-slate-600"
              >
                Clear
              </button>
            )}
          </div>

          <p className="text-[10px] text-slate-400 uppercase tracking-widest font-mono">
            Results Showing: {filteredPatients.length} Active Children
          </p>
        </div>

        {/* Patients Scroller list */}
        <div className="flex-1 overflow-y-auto custom-scrollbar space-y-2 mt-4 pr-1">
          {filteredPatients.length === 0 ? (
            <div className="p-8 text-center text-slate-400 text-xs">
              No matching registered children found. Press Register to add a child.
            </div>
          ) : (
            filteredPatients.map((p) => {
              const selected = p.id === selectedPatientId;
              return (
                <div
                  key={p.id}
                  onClick={() => setSelectedPatientId(p.id)}
                  className={`p-3.5 rounded-xl border cursor-pointer transition-all ${
                    selected
                      ? "bg-secondary text-white border-primary"
                      : "bg-slate-50 dark:bg-slate-900/50 hover:bg-slate-100 dark:hover:bg-slate-900 border-slate-100 dark:border-slate-800"
                  }`}
                >
                  <div className="flex justify-between items-start">
                    <span className="text-[10px] font-mono font-bold tracking-wider opacity-90 select-all">
                      {p.id}
                    </span>
                    <span className="text-[10px] uppercase font-mono bg-primary/20 px-2 py-0.5 rounded text-primary">
                      {p.gender}
                    </span>
                  </div>
                  <h4 className="font-bold text-sm mt-1.5 truncate">{p.childName}</h4>
                  <div className="flex items-center gap-1 text-[10px] mt-1 opacity-80">
                    <MapPin className="w-3 h-3" />
                    <span>
                      {p.tehsil}, {p.province}
                    </span>
                  </div>
                  <div className="flex justify-between items-center text-[10px] mt-2 border-t border-dashed border-slate-100/10 pt-1.5 opacity-80">
                    <span>G: {p.guardianName}</span>
                    <span className="font-mono">{p.mobileNumber}</span>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* Right Content Area: Registration Forms OR Patient Dossier View */}
      <div className="lg:col-span-2 space-y-6">
        
        {/* VIEW 1: REGISTER/EDIT PATIENT CHILD FORM */}
        <AnimatePresence mode="wait">
          {(isRegistering || isEditing) ? (
            <motion.form
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              onSubmit={isEditing ? handleUpdatePatient : handleRegisterChild}
              className="bg-white dark:bg-dark-card rounded-2xl border border-slate-200 dark:border-slate-800 p-6 space-y-6 shadow-xs"
            >
              <div className="flex justify-between items-center border-b border-slate-100 dark:border-slate-800 pb-3">
                <h3 className="font-bold text-slate-800 dark:text-slate-100 flex items-center gap-2">
                  <UserCheck className="w-5 h-5 text-primary" />
                  {isEditing ? `Edit Record for: ${selectedPatient?.childName}` : "Register New Child (National Registry)"}
                </h3>
                <button
                  type="button"
                  onClick={() => {
                    setIsRegistering(false);
                    setIsEditing(false);
                  }}
                  className="p-1 px-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded font-bold text-slate-400"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Grid 1: Basic Bio */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-500 mb-1">Child Name *</label>
                  <input
                    type="text"
                    required
                    value={formName}
                    onChange={(e) => setFormName(e.target.value)}
                    className="w-full p-2.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 text-xs focus:outline-none focus:border-primary text-slate-800 dark:text-slate-100"
                    placeholder="Enter Child Name"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-500 mb-1">Date of Birth *</label>
                  <input
                    type="date"
                    required
                    value={formDob}
                    onChange={(e) => setFormDob(e.target.value)}
                    className="w-full p-2.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 text-xs focus:outline-none focus:border-primary text-slate-850 dark:text-slate-100"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-500 mb-1">Gender *</label>
                  <select
                    value={formGender}
                    onChange={(e) => setFormGender(e.target.value as any)}
                    className="w-full p-2.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 text-xs focus:outline-none focus:border-primary text-slate-800 dark:text-slate-100"
                  >
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
              </div>

              {/* Grid 2: Guardian Details */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 border-t border-slate-50 dark:border-slate-800 pt-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-500 mb-1">Guardian Name *</label>
                  <input
                    type="text"
                    required
                    value={formGuardian}
                    onChange={(e) => setFormGuardian(e.target.value)}
                    className="w-full p-2.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 text-xs focus:outline-none focus:border-primary text-slate-800 dark:text-slate-100"
                    placeholder="Father/Mother/Guardian"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-500 mb-1">Guardian CNIC *</label>
                  <input
                    type="text"
                    required
                    maxLength={15}
                    value={formCnic}
                    onChange={(e) => setFormCnic(e.target.value)}
                    className="w-full p-2.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 text-xs font-mono focus:outline-none focus:border-primary text-slate-800 dark:text-slate-100"
                    placeholder="37405-1234567-1"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-500 mb-1">Mobile Contact *</label>
                  <input
                    type="text"
                    required
                    value={formMobile}
                    onChange={(e) => setFormMobile(e.target.value)}
                    className="w-full p-2.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 text-xs font-mono focus:outline-none focus:border-primary text-slate-800 dark:text-slate-100"
                    placeholder="0300-1234567"
                  />
                </div>
              </div>

              {/* Grid 3: Pakistan Location Cascades */}
              <div className="space-y-3 border-t border-slate-50 dark:border-slate-800 pt-4">
                <span className="block text-xs font-bold text-slate-400 font-mono uppercase">
                  Pakistan Geographical Division Check-In
                </span>
                
                <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
                  {/* Province Select */}
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-500 mb-1">Province *</label>
                    <select
                      value={formProvince}
                      onChange={(e) => setFormProvince(e.target.value)}
                      className="w-full p-2.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 text-xs focus:outline-none focus:border-primary text-slate-800 dark:text-slate-100"
                    >
                      {ALL_PROVINCES.map((p) => (
                        <option key={p} value={p}>
                          {p}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* District Select */}
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-500 mb-1">District *</label>
                    <select
                      value={formDistrict}
                      onChange={(e) => setFormDistrict(e.target.value)}
                      required
                      className="w-full p-2.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 text-xs focus:outline-none focus:border-primary text-slate-800 dark:text-slate-100"
                    >
                      {districtsList.map((d) => (
                        <option key={d} value={d}>
                          {d}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Tehsil Select */}
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-500 mb-1">Tehsil *</label>
                    <select
                      value={formTehsil}
                      onChange={(e) => setFormTehsil(e.target.value)}
                      required
                      className="w-full p-2.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 text-xs focus:outline-none focus:border-primary text-slate-800 dark:text-slate-100"
                    >
                      {tehsilsList.map((t) => (
                        <option key={t} value={t}>
                          {t}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* UC Select */}
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-500 mb-1">Union Council (UC) *</label>
                    <select
                      value={formUc}
                      onChange={(e) => setFormUc(e.target.value)}
                      required
                      className="w-full p-2.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 text-xs focus:outline-none focus:border-primary text-slate-800 dark:text-slate-100 font-mono"
                    >
                      {ucsList.map((u) => (
                        <option key={u} value={u}>
                          {u}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-500 mb-1">Full Physical Residential Address</label>
                  <input
                    type="text"
                    value={formAddress}
                    onChange={(e) => setFormAddress(e.target.value)}
                    className="w-full p-2.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 text-xs focus:outline-none focus:border-primary text-slate-800 dark:text-slate-100"
                    placeholder="Street, Sector, Block, Area City"
                  />
                </div>
              </div>

              {/* Form buttons */}
              <div className="flex justify-end gap-3 border-t border-slate-100 dark:border-slate-800 pt-4">
                <button
                  type="button"
                  onClick={() => {
                    setIsRegistering(false);
                    setIsEditing(false);
                  }}
                  className="px-4 py-2 text-xs bg-slate-100 dark:bg-slate-800 font-medium rounded-lg text-slate-600 dark:text-slate-350"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 text-xs bg-secondary hover:bg-secondary/90 font-bold rounded-lg text-white font-mono"
                >
                  {isEditing ? "Update Child Record" : "Confirm National registration"}
                </button>
              </div>
            </motion.form>
          ) : selectedPatient ? (
            
            // VIEW 2: FULL PATIENT DOSSIER (Selected Child Card + Immunization Records Card)
            <div className="space-y-6">
              {/* Profile Card Summary */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white dark:bg-dark-card border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-xs relative overflow-hidden"
              >
                <div className="absolute top-0 right-0 w-24 h-24 bg-primary/5 rounded-full blur-xl"></div>
                
                <div className="flex flex-col sm:flex-row justify-between items-start gap-4 pb-4 border-b border-dashed border-slate-150 dark:border-slate-800">
                  <div>
                    <span className="text-[10px] bg-secondary/15 text-secondary dark:bg-secondary/40 dark:text-primary font-mono font-bold px-2 py-0.5 rounded">
                      PATIENT DOSSIER: {selectedPatient.id}
                    </span>
                    <h2 className="text-xl font-extrabold text-slate-800 dark:text-slate-100 mt-2">
                      {selectedPatient.childName}
                    </h2>
                    <p className="text-xs text-slate-400 font-mono mt-0.5">
                      Registered: {new Date(selectedPatient.createdAt).toLocaleDateString()}
                    </p>
                  </div>

                  <div className="flex gap-2 shrink-0">
                    <button
                      onClick={startEditPatient}
                      className="p-2 bg-slate-100 dark:bg-slate-850 hover:bg-slate-200 hover:text-black dark:text-slate-300 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all"
                    >
                      <Edit2 className="w-3.5 h-3.5" /> Edit
                    </button>
                    <button
                      onClick={() => handleDeletePatient(selectedPatient.id)}
                      className="p-2 bg-red-100 text-red-650 hover:bg-red-200 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all dark:bg-red-950 dark:text-red-300"
                    >
                      <Trash2 className="w-3.5 h-3.5" /> Delete
                    </button>
                    <button
                      onClick={() => window.print()}
                      className="p-2 bg-slate-100 dark:bg-slate-850 hover:bg-slate-200 dark:text-slate-300 rounded-lg text-xs"
                      title="Print Immunization Record Card"
                    >
                      <Printer className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {/* Sub-grid of bio */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-4 text-xs">
                  <div>
                    <span className="text-slate-400 block font-mono uppercase text-[9px]">Date of Birth</span>
                    <strong className="text-slate-700 dark:text-slate-250 font-mono text-sm block mt-0.5">
                      {selectedPatient.dob}
                    </strong>
                  </div>
                  <div>
                    <span className="text-slate-400 block font-mono uppercase text-[9px]">Guardian</span>
                    <strong className="text-slate-700 dark:text-slate-250 block text-sm mt-0.5">
                      {selectedPatient.guardianName}
                    </strong>
                  </div>
                  <div>
                    <span className="text-slate-400 block font-mono uppercase text-[9px]">Guardian CNIC</span>
                    <strong className="text-slate-700 dark:text-slate-250 font-mono text-xs block mt-0.5">
                      {selectedPatient.cnic}
                    </strong>
                  </div>
                  <div>
                    <span className="text-slate-400 block font-mono uppercase text-[9px]">Guardian Contact</span>
                    <strong className="text-slate-700 dark:text-slate-250 font-mono text-xs block mt-0.5 flex items-center gap-1">
                      <Phone className="w-3 h-3 text-primary" /> {selectedPatient.mobileNumber}
                    </strong>
                  </div>
                </div>

                {/* Sub-grid of physical residence */}
                <div className="mt-4 pt-4 border-t border-slate-100 dark:border-slate-800/80 text-xs text-slate-500 flex items-start gap-2">
                  <MapPin className="w-4 h-4 text-primary shrink-0" />
                  <div>
                    <span className="font-semibold text-slate-600 dark:text-slate-300">
                      Union Council {selectedPatient.unionCouncil}, Tehsil {selectedPatient.tehsil}, District {selectedPatient.district}, Province {selectedPatient.province}
                    </span>
                    <p className="text-[10px] text-slate-400 mt-0.5">Address: {selectedPatient.address}</p>
                  </div>
                </div>
              </motion.div>

              {/* Immunization Tracker Dashboard POS */}
              <div className="bg-white dark:bg-dark-card border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-xs space-y-4">
                <div className="flex justify-between items-center pb-2 border-b border-slate-100 dark:border-slate-800">
                  <div>
                    <h3 className="font-bold text-slate-800 dark:text-slate-100 text-sm flex items-center gap-2">
                      <Syringe className="w-4.5 h-4.5 text-primary" /> Core Immunization Health Card
                    </h3>
                    <p className="text-[10px] text-slate-400 mt-0.5">Record booster shots, injections and schedule schedules</p>
                  </div>
                  <button
                    onClick={() => {
                      setSchedDisease("Polio");
                      setSchedDoseNum(1);
                      setIsScheduling((val) => !val);
                    }}
                    className="p-1 px-2.5 bg-secondary text-white text-xs font-semibold rounded-lg flex items-center gap-1 hover:bg-slate-800 transition-all"
                  >
                    <Plus className="w-3.5 h-3.5" /> Book Dose
                  </button>
                </div>

                {/* VIEW 2B: BOOK APPOINTMENT DOSE FORM INLINE */}
                {isScheduling && (
                  <motion.form
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    onSubmit={handleScheduleDose}
                    className="p-4 bg-slate-50 dark:bg-slate-900/60 rounded-xl border border-dashed border-primary/30 grid grid-cols-1 md:grid-cols-4 gap-4 items-end text-xs"
                  >
                    <div>
                      <label className="block text-[10px] font-semibold text-slate-500 mb-1 uppercase">Target Disease</label>
                      <select
                        value={schedDisease}
                        onChange={(e) => setSchedDisease(e.target.value)}
                        className="w-full bg-white dark:bg-slate-800 border p-2 rounded-lg"
                      >
                        {["Polio", "Measles", "Tuberculosis (BCG)", "Diphtheria", "Tetanus", "Pertussis", "Hepatitis B", "Hib", "Rotavirus", "Pneumococcal", "Typhoid", "Rubella"].map((d) => (
                          <option key={d} value={d}>{d}</option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-[10px] font-semibold text-slate-500 mb-1 uppercase">Dose Seq / Booster</label>
                      <select
                        value={schedDoseNum}
                        onChange={(e) => setSchedDoseNum(Number(e.target.value))}
                        className="w-full bg-white dark:bg-slate-800 border p-2 rounded-lg"
                      >
                        <option value={1}>Dose #1 (Primary)</option>
                        <option value={2}>Dose #2</option>
                        <option value={3}>Dose #3</option>
                        <option value={4}>Dose #4 (Booster)</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-[10px] font-semibold text-slate-500 mb-1 uppercase">Target Date</label>
                      <input
                        type="date"
                        required
                        value={schedDate}
                        onChange={(e) => setSchedDate(e.target.value)}
                        className="w-full bg-white dark:bg-slate-800 border p-2 rounded-lg"
                      />
                    </div>

                    <div className="flex gap-2">
                      <button
                        type="button"
                        onClick={() => setIsScheduling(false)}
                        className="w-1/2 p-2 bg-slate-200 dark:bg-slate-800 rounded-lg text-slate-600 dark:text-slate-350"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        className="w-1/2 p-2 bg-primary hover:bg-primary-hover text-slate-900 font-bold rounded-lg"
                      >
                        Confirm
                      </button>
                    </div>
                  </motion.form>
                )}

                {/* Live vaccinations schedule list */}
                <div className="space-y-3">
                  {selectedPatientVaccs.length === 0 ? (
                    <div className="p-6 text-center text-slate-400 text-xs">
                      No immunization history or future scheduled boosters registered for this child.
                    </div>
                  ) : (
                    selectedPatientVaccs.map((v) => {
                      const isUnsaved = isAdministering === v.id;
                      
                      return (
                        <div
                          key={v.id}
                          className="bg-slate-50 dark:bg-slate-900/60 rounded-xl p-4 border border-slate-150 dark:border-slate-800/80 hover:border-primary/35 transition-all text-xs"
                        >
                          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                            <div>
                              <div className="flex items-center gap-2">
                                <span className={`w-2.5 h-2.5 rounded-full ${
                                  v.status === "administered" ? "bg-emerald-500" : v.status === "missed" ? "bg-red-500" : "bg-amber-400"
                                }`}></span>
                                <h4 className="font-bold text-slate-800 dark:text-slate-100 text-sm">
                                  {v.diseaseName} (Dose #{v.doseNumber})
                                </h4>
                              </div>
                              <p className="text-[10px] text-slate-500 mt-0.5">
                                Scheduled Appointment Target: <strong>{v.scheduledDate}</strong>
                              </p>
                            </div>

                            {/* Status actions */}
                            <div className="flex items-center gap-2">
                              {v.status === "administered" ? (
                                <div className="text-right">
                                  <span className="px-2 py-0.5 bg-emerald-500/10 text-emerald-500 font-mono text-[10px] rounded font-bold border border-emerald-500/20">
                                    INJECTED (OK)
                                  </span>
                                  <p className="text-[9px] text-slate-400 font-mono mt-0.5">Batch: {v.batchNumber}</p>
                                </div>
                              ) : v.status === "missed" ? (
                                <div className="flex items-center gap-2">
                                  <span className="px-2 py-0.5 bg-red-100 text-red-650 font-mono text-[10px] rounded font-bold uppercase dark:bg-red-950 dark:text-red-300">
                                    MISSED
                                  </span>
                                  <button
                                    onClick={() => {
                                      setIsAdministering(v.id);
                                    }}
                                    className="p-1.5 bg-primary hover:bg-primary-hover text-slate-900 font-bold px-3 rounded-lg flex items-center gap-1 text-[11px]"
                                  >
                                    <Syringe className="w-3.5 h-3.5" /> Inject Now
                                  </button>
                                </div>
                              ) : (
                                <button
                                  onClick={() => {
                                    setIsAdministering(v.id);
                                  }}
                                  className="p-1.5 bg-primary hover:bg-primary-hover text-slate-900 font-bold px-3 rounded-lg flex items-center gap-1 text-[11px] transition-all"
                                >
                                  <Syringe className="w-3.5 h-3.5" /> Mark Administered
                                </button>
                              )}
                            </div>
                          </div>

                          {/* INLINE ADMINISTER SYRINGE BOX */}
                          {isUnsaved && (
                            <motion.div
                              initial={{ opacity: 0, y: 5 }}
                              animate={{ opacity: 1, y: 0 }}
                              className="mt-3 pt-3 border-t border-dashed border-slate-200 dark:border-slate-800 grid grid-cols-1 sm:grid-cols-3 gap-3 items-end"
                            >
                              <div>
                                <label className="block text-[10px] text-zinc-500 mb-1">Lot Batch Stamp *</label>
                                <input
                                  type="text"
                                  placeholder="e.g. OPV-992-PAK"
                                  value={adminBatch}
                                  onChange={(e) => setAdminBatch(e.target.value)}
                                  className="w-full bg-white dark:bg-slate-805 border p-1 rounded font-mono text-zinc-800 dark:text-zinc-100"
                                />
                              </div>
                              <div>
                                <label className="block text-[10px] text-zinc-500 mb-1">Physician Logs / Notes</label>
                                <input
                                  type="text"
                                  placeholder="Passed clear tolerance"
                                  value={adminNotes}
                                  onChange={(e) => setAdminNotes(e.target.value)}
                                  className="w-full bg-white dark:bg-slate-805 border p-1 rounded text-zinc-805"
                                />
                              </div>
                              <div className="flex gap-1">
                                <button
                                  type="button"
                                  onClick={() => setIsAdministering(null)}
                                  className="w-1/3 bg-slate-200 dark:bg-slate-800 p-1.5 rounded"
                                >
                                  Cancel
                                </button>
                                <button
                                  type="button"
                                  onClick={() => handleAdministerDose(v.id)}
                                  className="w-2/3 bg-emerald-500 hover:bg-emerald-600 text-white font-bold p-1.5 rounded text-center flex justify-center items-center gap-1"
                                >
                                  <FileCheck className="w-4 h-4" /> Save Injection
                                </button>
                              </div>
                            </motion.div>
                          )}

                          {/* Render notes if exists */}
                          {v.notes && (
                            <div className="mt-2 bg-slate-100 dark:bg-slate-850 p-2 rounded text-[10px] text-slate-500 font-mono italic">
                              Clinical Logs: {v.notes}
                            </div>
                          )}
                        </div>
                      );
                    })
                  )}
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-white dark:bg-dark-card border border-slate-200 dark:border-slate-800 rounded-2xl p-12 text-center shadow-xs flex flex-col justify-center items-center h-full">
              <ClipboardList className="w-16 h-16 text-primary animate-pulse mb-3" />
              <h3 className="font-extrabold text-slate-800 dark:text-slate-100">National Healthcare Clinical Portal</h3>
              <p className="text-xs text-slate-400 mt-1 max-w-sm">
                Select a child on the left patient index panel to load active immunization schedules, schedule new booster shots, or conduct clinical registers.
              </p>
            </div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
