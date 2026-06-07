import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  ShieldCheck,
  UserCheck,
  Contact,
  MapPin,
  Lock,
  Mail,
  User,
  Smartphone,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  Users,
} from "lucide-react";
import { mockAuth, mockDb } from "../data/mockFirebase";
import { UserProfile, UserRole } from "../types";
import {
  ALL_PROVINCES,
  getDistricts,
  getTehsils,
} from "../data/pakistanLocations";

interface AuthViewProps {
  onSuccess: (user: UserProfile) => void;
}

export function AuthView({ onSuccess }: AuthViewProps) {
  const [activeTab, setActiveTab] = useState<"signin" | "signup">("signin");
  
  // Sign In States
  const [loginEmail, setLoginEmail] = useState("");
  const [loginCnic, setLoginCnic] = useState("");
  const [loginError, setLoginError] = useState("");
  
  // Register States
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [cnic, setCnic] = useState("");
  const [mobileNumber, setMobileNumber] = useState("");
  const [role, setRole] = useState<UserRole>("Lady Health Worker");
  const [province, setProvince] = useState(ALL_PROVINCES[0] || "");
  const [district, setDistrict] = useState("");
  const [tehsil, setTehsil] = useState("");
  const [registerError, setRegisterError] = useState("");
  const [registerSuccess, setRegisterSuccess] = useState<string | null>(null);

  // Load districts and tehsils in cascade
  const districts = getDistricts(province);
  useEffect(() => {
    if (districts.length > 0) {
      setDistrict(districts[0]);
    } else {
      setDistrict("");
    }
  }, [province]);

  const tehsils = getTehsils(province, district);
  useEffect(() => {
    if (tehsils.length > 0) {
      setTehsil(tehsils[0]);
    } else {
      setTehsil("");
    }
  }, [district]);

  // Quick sandbox accounts for testing
  const sandboxAccounts = [
    {
      name: "Kubra Khan",
      email: "bkubra608@gmail.com",
      role: "Super Administrator" as UserRole,
      badge: "National Head",
      flag: "🇵🇰",
    },
    {
      name: "Ayesha Bibi",
      email: "ayesha_lhw@nih.gov.pk",
      role: "Lady Health Worker" as UserRole,
      badge: "LHW Unit",
      flag: " Sindh",
    },
    {
      name: "Muhammad Bilal",
      email: "bilal_vacc@nih.gov.pk",
      role: "Vaccinator" as UserRole,
      badge: "EPI Crew",
      flag: " Punjab",
    },
    {
      name: "Provincial Officer KP",
      email: "kp_manager@nih.gov.pk",
      role: "Provincial Manager" as UserRole,
      badge: "KP Hub",
      flag: " KP",
    },
  ];

  // Auto-complete and log in sandbox credentials
  const handlePromoLogin = (accountEmail: string) => {
    setLoginEmail(accountEmail);
    setLoginCnic("37405-1234567-1"); // mock passcode
    setLoginError("");

    const result = mockAuth.signIn(accountEmail, "37405-1234567-1");
    if (typeof result === "string") {
      setLoginError(result);
    } else {
      onSuccess(result);
    }
  };

  // Hyphen formatting helper for CNIC (xxxxx-xxxxxxx-x)
  const formatCnicInRealTime = (value: string) => {
    const cleaned = value.replace(/\D/g, "");
    let formatted = cleaned;
    if (cleaned.length > 5) {
      formatted = cleaned.substring(0, 5) + "-" + cleaned.substring(5);
    }
    if (cleaned.length > 12) {
      formatted =
        formatted.substring(0, 13) + "-" + formatted.substring(13, 14);
    }
    return formatted.substring(0, 15);
  };

  // Real-time mobile phone formatter (e.g., 03xx-xxxxxxx)
  const formatMobileNumber = (value: string) => {
    const cleaned = value.replace(/\D/g, "");
    let formatted = cleaned;
    if (cleaned.length > 4) {
      formatted = cleaned.substring(0, 4) + "-" + cleaned.substring(4, 11);
    }
    return formatted.substring(0, 12);
  };

  const handleSignInSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError("");

    if (!loginEmail.trim()) {
      setLoginError("Please provide your NIH assigned email address.");
      return;
    }

    const result = mockAuth.signIn(loginEmail, loginCnic);
    if (typeof result === "string") {
      setLoginError(result);
    } else {
      onSuccess(result);
    }
  };

  const handleRegisterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setRegisterError("");
    setRegisterSuccess(null);

    // Basic Validations
    if (!fullName.trim() || fullName.length < 3) {
      setRegisterError("Full Name must be at least 3 characters long.");
      return;
    }
    if (!email.trim() || !email.includes("@")) {
      setRegisterError("Please enter a valid personnel email address.");
      return;
    }
    if (cnic.length !== 15) {
      setRegisterError("CNIC must occupy exactly 13 digits (format: 12345-1234567-1).");
      return;
    }
    if (mobileNumber.length < 11) {
      setRegisterError("Please enter a valid 11-digit mobile number.");
      return;
    }
    if (!province || !district || !tehsil) {
      setRegisterError("Please assign your primary operational base location.");
      return;
    }

    const newProfile = {
      fullName,
      email,
      cnic,
      mobileNumber,
      role,
      province,
      district,
      tehsil,
    };

    const result = mockAuth.signUp(newProfile);
    if (typeof result === "string") {
      setRegisterError(result);
    } else {
      setRegisterSuccess(
        `SUCCESS! Account registered securely for ID: ${result.uid}. Re-routing you in shortly...`
      );
      // Stagger and direct auto-login
      setTimeout(() => {
        onSuccess(result);
      }, 2000);
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 flex flex-col items-center justify-center p-4 md:p-8 relative overflow-hidden">
      
      {/* Decorative localized digital patterns */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_left,rgba(0,217,219,0.06),transparent_40%)] pointer-events-none" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(0,95,115,0.12),transparent_40%)] pointer-events-none" />

      <div className="w-full max-w-5xl grid grid-cols-1 lg:grid-cols-12 gap-8 z-10">
        
        {/* Left Side: National branding message */}
        <div className="lg:col-span-5 flex flex-col justify-between py-6 space-y-8 lg:pr-6">
          <div className="space-y-6">
            {/* National emblem display */}
            <div className="flex items-center gap-3">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-green-550 to-emerald-700 flex items-center justify-center font-extrabold text-2xl shadow-xl border border-white/10 select-none">
                🇵🇰
              </div>
              <div>
                <span className="text-[10px] tracking-widest font-mono text-primary font-bold uppercase block">
                  Ministry of National Health Services
                </span>
                <h1 className="text-xl font-extrabold text-white tracking-tight leading-tight">
                  NIH Pakistan Hub
                </h1>
                <p className="text-[10px] text-slate-400 uppercase font-mono">
                  EPI Secure Gateway
                </p>
              </div>
            </div>

            <div className="border-l-2 border-primary/50 pl-4 space-y-1">
              <p className="text-xs text-slate-400 font-mono">INTEGRITY STATUS</p>
              <p className="text-sm font-semibold text-white">
                Expanded Programme on Immunization (EPI)
              </p>
              <p className="text-xs text-slate-400 leading-relaxed">
                Empowering Lady Health Workers, District Vaccinators, and Federal Officers
                with real-time cold-chain supply records, instant QR scanner logging, and SMS alerts.
              </p>
            </div>
          </div>

          {/* Quick-Access Sandbox User Simulation panel */}
          <div className="bg-slate-950/60 p-5 rounded-2xl border border-white/5 space-y-4">
            <div className="flex items-center gap-2">
              <Users className="w-4 h-4 text-primary" />
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-300">
                Quick sandbox demo sign-in
              </h3>
            </div>
            <p className="text-[11px] text-slate-400">
              Select any pre-configured personnel profile to instantly bypass and evaluate features. Code updates will persist locally.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-2">
              {sandboxAccounts.map((account) => (
                <button
                  key={account.email}
                  onClick={() => handlePromoLogin(account.email)}
                  className="p-3 bg-slate-900/80 hover:bg-slate-850 hover:border-primary/45 border border-white/5 rounded-xl text-left transition-all group shrink-0"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] bg-primary/10 text-primary px-1.5 py-0.5 rounded font-mono font-bold">
                      {account.badge}
                    </span>
                    <span className="text-xs select-none">{account.flag}</span>
                  </div>
                  <h4 className="text-xs font-bold mt-1 text-slate-200 group-hover:text-primary transition-colors">
                    {account.name}
                  </h4>
                  <p className="text-[9px] text-slate-500 font-mono truncate">
                    {account.email}
                  </p>
                </button>
              ))}
            </div>
          </div>

          <div className="text-[9px] text-slate-600 font-mono uppercase tracking-wide">
            Federal Encryption Core ID • SERVER v4.1 • LOCAL PERSISTENCE
          </div>
        </div>

        {/* Right Side: Auth interaction Panel */}
        <div className="lg:col-span-7 bg-slate-950/40 p-6 md:p-8 rounded-3xl border border-white/10 shadow-2xl flex flex-col justify-between">
          <div>
            {/* Tab selection widget */}
            <div className="flex bg-slate-900/60 p-1.5 rounded-2xl border border-white/5 mb-6">
              <button
                onClick={() => {
                  setActiveTab("signin");
                  setLoginError("");
                  setRegisterError("");
                }}
                className={`flex-1 py-3 text-xs font-bold rounded-xl transition-all ${
                  activeTab === "signin"
                    ? "bg-primary text-slate-950 shadow-md"
                    : "text-slate-400 hover:text-white"
                }`}
              >
                Sign In to Operations
              </button>
              <button
                onClick={() => {
                  setActiveTab("signup");
                  setLoginError("");
                  setRegisterError("");
                }}
                className={`flex-1 py-3 text-xs font-bold rounded-xl transition-all ${
                  activeTab === "signup"
                    ? "bg-primary text-slate-950 shadow-md"
                    : "text-slate-400 hover:text-white"
                }`}
              >
                Create Hub Account
              </button>
            </div>

            <AnimatePresence mode="wait">
              {activeTab === "signin" ? (
                <motion.form
                  key="signin-form"
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 10 }}
                  transition={{ duration: 0.15 }}
                  onSubmit={handleSignInSubmit}
                  className="space-y-4"
                >
                  <div className="text-left">
                    <h2 className="text-lg font-bold text-white">Personnel Login Gateway</h2>
                    <p className="text-xs text-slate-400 mt-0.5">
                      Verify your assigned email and credentials to manage deployment schedules.
                    </p>
                  </div>

                  {loginError && (
                    <div className="p-3 bg-red-950/40 border border-red-800 text-red-200 rounded-xl text-xs flex items-start gap-2.5 animate-shake">
                      <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                      <span>{loginError}</span>
                    </div>
                  )}

                  <div className="space-y-1.5 text-left">
                    <label className="text-xs font-mono font-bold text-slate-400 uppercase">
                      Official Register Email
                    </label>
                    <div className="relative">
                      <Mail className="absolute left-3.5 top-3.5 w-4 h-4 text-slate-500" />
                      <input
                        type="email"
                        placeholder="e.g. javed_lhw@nih.gov.pk"
                        value={loginEmail}
                        onChange={(e) => setLoginEmail(e.target.value)}
                        className="w-full bg-slate-900/80 border border-white/5 focus:border-primary rounded-xl p-3 pl-10 text-xs text-white placeholder-slate-600 focus:outline-hidden"
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5 text-left">
                    <label className="text-xs font-mono font-bold text-slate-400 uppercase">
                      Personnel CNIC / Passcode
                    </label>
                    <div className="relative">
                      <Lock className="absolute left-3.5 top-3.5 w-4 h-4 text-slate-500" />
                      <input
                        type="text"
                        placeholder="xxxxx-xxxxxxx-x"
                        value={loginCnic}
                        onChange={(e) =>
                          setLoginCnic(formatCnicInRealTime(e.target.value))
                        }
                        className="w-full bg-slate-900/80 border border-white/5 focus:border-primary rounded-xl p-3 pl-10 text-xs text-white placeholder-slate-600 focus:outline-hidden font-mono"
                        required
                      />
                    </div>
                    <span className="text-[10px] text-slate-550 block mt-1 font-mono">
                      Sandbox bypass standard: Enter any CNIC number if email matches initialized datasets above.
                    </span>
                  </div>

                  <button
                    type="submit"
                    className="w-full py-3 bg-gradient-to-r from-primary to-emerald-400 hover:from-primary-hover hover:to-emerald-500 text-slate-950 font-bold text-xs rounded-xl transition-all shadow-md mt-6"
                  >
                    Authenticate Security Credentials
                  </button>
                </motion.form>
              ) : (
                <motion.form
                  key="signup-form"
                  initial={{ opacity: 0, x: 10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -10 }}
                  transition={{ duration: 0.15 }}
                  onSubmit={handleRegisterSubmit}
                  className="space-y-4 max-h-[64vh] overflow-y-auto pr-1 custom-scrollbar text-left"
                >
                  <div className="text-left">
                    <h2 className="text-lg font-bold text-white">Create Official Hub account</h2>
                    <p className="text-xs text-slate-400 mt-0.5">
                      Register as a Lady Health Worker, Vaccinator, or Provincial Manager.
                    </p>
                  </div>

                  {registerError && (
                    <div className="p-3 bg-red-950/40 border border-red-800 text-red-200 rounded-xl text-xs flex items-start gap-2.5">
                      <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                      <span>{registerError}</span>
                    </div>
                  )}

                  {registerSuccess && (
                    <div className="p-3 bg-emerald-950/40 border border-emerald-800 text-emerald-200 rounded-xl text-xs flex items-start gap-2.5">
                      <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5" />
                      <span>{registerSuccess}</span>
                    </div>
                  )}

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {/* Full Name */}
                    <div className="space-y-1.5">
                      <label className="text-xs font-mono font-bold text-slate-400 uppercase">
                        Full Name
                      </label>
                      <div className="relative">
                        <User className="absolute left-3.5 top-3.5 w-4 h-4 text-slate-500" />
                        <input
                          type="text"
                          placeholder="e.g. Javed Iqbal"
                          value={fullName}
                          onChange={(e) => setFullName(e.target.value)}
                          className="w-full bg-slate-900/80 border border-white/5 focus:border-primary rounded-xl p-3 pl-10 text-xs text-white placeholder-slate-650 focus:outline-hidden"
                          required
                        />
                      </div>
                    </div>

                    {/* Email */}
                    <div className="space-y-1.5">
                      <label className="text-xs font-mono font-bold text-slate-400 uppercase">
                        Personnel Email
                      </label>
                      <div className="relative">
                        <Mail className="absolute left-3.5 top-3.5 w-4 h-4 text-slate-500" />
                        <input
                          type="email"
                          placeholder="javed@nih.gov.pk"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          className="w-full bg-slate-900/80 border border-white/5 focus:border-primary rounded-xl p-3 pl-10 text-xs text-white placeholder-slate-650 focus:outline-hidden font-mono"
                          required
                        />
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {/* CNIC */}
                    <div className="space-y-1.5">
                      <label className="text-xs font-mono font-bold text-slate-400 uppercase">
                        CNIC Number
                      </label>
                      <div className="relative">
                        <Contact className="absolute left-3.5 top-3.5 w-4 h-4 text-slate-500" />
                        <input
                          type="text"
                          placeholder="xxxxx-xxxxxxx-x"
                          value={cnic}
                          onChange={(e) =>
                            setCnic(formatCnicInRealTime(e.target.value))
                          }
                          className="w-full bg-slate-900/80 border border-white/5 focus:border-primary rounded-xl p-3 pl-10 text-xs text-white placeholder-slate-650 focus:outline-hidden font-mono"
                          required
                        />
                      </div>
                    </div>

                    {/* Mobile Number */}
                    <div className="space-y-1.5">
                      <label className="text-xs font-mono font-bold text-slate-400 uppercase">
                        Mobile Number
                      </label>
                      <div className="relative">
                        <Smartphone className="absolute left-3.5 top-3.5 w-4 h-4 text-slate-500" />
                        <input
                          type="text"
                          placeholder="0300-1234567"
                          value={mobileNumber}
                          onChange={(e) =>
                            setMobileNumber(formatMobileNumber(e.target.value))
                          }
                          className="w-full bg-slate-900/80 border border-white/5 focus:border-primary rounded-xl p-3 pl-10 text-xs text-white placeholder-slate-650 focus:outline-hidden font-mono"
                          required
                        />
                      </div>
                    </div>
                  </div>

                  {/* Profile Role Picker */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-mono font-bold text-slate-400 uppercase">
                      Select Healthcare / Admin Role
                    </label>
                    <select
                      value={role}
                      onChange={(e) => setRole(e.target.value as UserRole)}
                      className="w-full bg-slate-900 border border-white/5 focus:border-primary rounded-xl p-3 text-xs text-white focus:outline-hidden"
                    >
                      <option value="Lady Health Worker">Lady Health Worker (LHW)</option>
                      <option value="Vaccinator">Field Vaccinator</option>
                      <option value="Medical Officer">Medical Officer (MO)</option>
                      <option value="District Manager">District Health Officer (DHO)</option>
                      <option value="Provincial Manager">Provincial EPI Director</option>
                      <option value="Store Manager">Cold Chain Officer</option>
                      <option value="Auditor">EPI Operations Auditor</option>
                    </select>
                  </div>

                  {/* Location cascading selects */}
                  <div className="bg-slate-900/40 p-4 rounded-2xl border border-white/5 space-y-3 mt-2">
                    <div className="flex items-center gap-1.5 text-xs font-bold text-slate-300">
                      <MapPin className="w-3.5 h-3.5 text-primary" />
                      <span>Operational Base Allocation</span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      {/* Province */}
                      <div className="space-y-1">
                        <label className="text-[10px] text-slate-500 font-mono uppercase">
                          Province
                        </label>
                        <select
                          value={province}
                          onChange={(e) => setProvince(e.target.value)}
                          className="w-full bg-slate-950 border border-white/5 focus:border-primary rounded-xl p-2.5 text-xs text-white focus:outline-hidden"
                        >
                          {ALL_PROVINCES.map((p) => (
                            <option key={p} value={p}>
                              {p}
                            </option>
                          ))}
                        </select>
                      </div>

                      {/* District */}
                      <div className="space-y-1">
                        <label className="text-[10px] text-slate-500 font-mono uppercase">
                          District
                        </label>
                        <select
                          value={district}
                          onChange={(e) => setDistrict(e.target.value)}
                          className="w-full bg-slate-950 border border-white/5 focus:border-primary rounded-xl p-2.5 text-xs text-white focus:outline-hidden"
                          disabled={districts.length === 0}
                        >
                          {districts.map((d) => (
                            <option key={d} value={d}>
                              {d}
                            </option>
                          ))}
                        </select>
                      </div>

                      {/* Tehsil */}
                      <div className="space-y-1">
                        <label className="text-[10px] text-slate-500 font-mono uppercase">
                          Tehsil
                        </label>
                        <select
                          value={tehsil}
                          onChange={(e) => setTehsil(e.target.value)}
                          className="w-full bg-slate-950 border border-white/5 focus:border-primary rounded-xl p-2.5 text-xs text-white focus:outline-hidden"
                          disabled={tehsils.length === 0}
                        >
                          {tehsils.map((t) => (
                            <option key={t} value={t}>
                              {t}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="w-full py-3 bg-gradient-to-r from-primary to-emerald-400 hover:from-primary-hover hover:from-emerald-500 text-slate-950 font-bold text-xs rounded-xl transition-all shadow-md mt-6"
                  >
                    Register and Issue Hub Token
                  </button>
                </motion.form>
              )}
            </AnimatePresence>
          </div>

          {/* Secure lock note */}
          <div className="flex items-center justify-center gap-1.5 text-[10px] text-slate-600 mt-6 select-none font-mono">
            <Lock className="w-3 h-3 text-slate-650" />
            <span>Encrypted local session verified under MNHSRC guidelines</span>
          </div>
        </div>

      </div>

    </div>
  );
}
