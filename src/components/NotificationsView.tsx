import React, { useState, useMemo } from "react";
import { motion } from "motion/react";
import {
  Bell,
  MessageSquare,
  Mail,
  Send,
  AlertTriangle,
  FileCheck,
  Search,
  BadgeAlert,
  Smartphone,
  CheckCircle,
} from "lucide-react";
import { mockDb, logOperation } from "../data/mockFirebase";
import { NotificationRecord, PatientRecord } from "../types";

interface TemplateDef {
  name: string;
  medium: "SMS" | "Email" | "WhatsApp";
  type: string;
  urduText: string;
  engText: string;
}

const DISPATCH_TEMPLATES: TemplateDef[] = [
  {
    name: "UPCOMING_DOSE_REMINDER_SMS",
    medium: "SMS",
    type: "Upcoming Dose Reminder",
    urduText: "محترم والدین، آپ کے بچے کی حفاظتی ویکسین کی نئی خوراک مقررہ تاریخ پر لگنا لازمی ہے۔ برائے مہربانی قریبی مرکز تشریف لائیں۔ شکریہ۔ (EPI-NIH)",
    engText: "Dear Parent, your child's next mandatory vaccination dose is scheduled. Please visit the nearest NIH health center promptly. Thank you.",
  },
  {
    name: "BOOSTER_ALERT_WA",
    medium: "WhatsApp",
    type: "Booster Reminder",
    urduText: "پیارے والدین، یاد دہانی: آپ کا بچہ پولیو یا خسرہ کا اہم بوسٹر ڈوز پینے کا اہل ہے۔ اپنے بچے کا حفاظتی کارڈ ہمراہ لائیں۔ سلامتی - پاکستان حفاظتی ادارہ۔",
    engText: "A friendly reminder that your child is due for their vital booster shot. Kindly bring their digital immunization card to the tehsil center.",
  },
  {
    name: "MISSED_DOSE_URGENT_MAIL",
    medium: "Email",
    type: "Missed Dose Alert",
    urduText: "انتہائی ضروری اطلاع: آپ کے بچے کی زندگی بچانے والی حفاظتی خوراک چھوٹ گئی ہے۔ ہماری ٹیم جلد ہی آپ سے رابطہ کرے گی تاکہ کور کیا جا سکے۔",
    engText: "CRITICAL HEALTH ALERT: Our logs show that your child missed their scheduled immunization dose. Lady Health Workers will assist with urgent catch-up.",
  }
];

export function NotificationsView() {
  const [notifications, setNotifications] = useState<NotificationRecord[]>(() => mockDb.getNotifications());
  const patients = mockDb.getPatients();

  // Selected parameters for manual dispatch
  const [targetPatientIndex, setTargetPatientIndex] = useState(0);
  const [selectedMedium, setSelectedMedium] = useState<"SMS" | "Email" | "WhatsApp">("SMS");
  const [selectedType, setSelectedType] = useState<"Upcoming Dose Reminder" | "Booster Reminder" | "Missed Dose Alert">("Upcoming Dose Reminder");
  
  // Custom manual text override option or auto template
  const [isSuccessToast, setIsSuccessToast] = useState<string | null>(null);

  // Active template selection matches
  const activeTemplate = useMemo(() => {
    return DISPATCH_TEMPLATES.find((t) => t.medium === selectedMedium && t.type === selectedType) || DISPATCH_TEMPLATES[0];
  }, [selectedMedium, selectedType]);

  // Handle Dispatch click
  const handleDispatchNotification = () => {
    const matchedPatient = patients[targetPatientIndex % patients.length];
    if (!matchedPatient) {
      alert("No patient child enrolled to send notification.");
      return;
    }

    const message = `${activeTemplate.engText} // ${activeTemplate.urduText}`;

    const newAlert: NotificationRecord = {
      id: `NOT-${Math.random().toString(36).substr(2, 9).toUpperCase()}`,
      patientId: matchedPatient.id,
      type: selectedType,
      medium: selectedMedium,
      recipient: selectedMedium === "Email" ? `${matchedPatient.guardianName.toLowerCase().replace(/\s+/g, "")}@nih.gov.pk` : matchedPatient.mobileNumber,
      templateName: activeTemplate.name,
      messageBody: message,
      sentAt: new Date().toISOString(),
      status: "Sent",
    };

    const updated = [newAlert, ...notifications];
    setNotifications(updated);
    mockDb.setNotifications(updated);

    // Trigger green UI toast
    setIsSuccessToast(`Safely dispatched bilingually to ${matchedPatient.childName}'s guardian: ${newAlert.recipient}!`);
    setTimeout(() => setIsSuccessToast(null), 4000);

    logOperation(
      "NOTIFICATION_GATEWAY_DISPATCH",
      `Sent ${selectedType} reminder via ${selectedMedium} to parent of child ID: ${matchedPatient.id}`
    );
  };

  return (
    <div className="space-y-6">
      
      {/* Alert toast notification */}
      {isSuccessToast && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          className="bg-emerald-500 border-l-4 border-slate-900 text-white p-4 rounded-xl flex items-center justify-between text-xs font-bold"
        >
          <div className="flex items-center gap-2">
            <CheckCircle className="w-5 h-5 text-slate-900" />
            <span>{isSuccessToast}</span>
          </div>
          <button onClick={() => setIsSuccessToast(null)} className="text-slate-900 font-extrabold hover:text-black">Dismiss</button>
        </motion.div>
      )}

      {/* Primary Grid Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Left Card: Gateway dispatch settings */}
        <div className="bg-white dark:bg-dark-card border border-slate-200 dark:border-slate-800 p-6 rounded-2xl shadow-xs space-y-5">
          <h3 className="font-bold text-slate-850 dark:text-zinc-150 flex items-center gap-2">
            <Bell className="w-5 h-5 text-primary" /> Bilingual Gateway Dispatcher
          </h3>
          <p className="text-xs text-slate-400">
            Remind guardians about vaccine dates, booster sweeps, and missed schedules countrywide.
          </p>

          <div className="space-y-4 text-xs">
            {/* Field 1: Choose child */}
            <div>
              <label className="block text-slate-400 mb-1">Target Child Resident</label>
              <select
                value={targetPatientIndex}
                onChange={(e) => setTargetPatientIndex(Number(e.target.value))}
                className="w-full bg-slate-50 dark:bg-slate-905 border dark:border-slate-800 p-2.5 rounded font-medium text-slate-705 dark:text-zinc-150"
              >
                {patients.map((pat, idx) => (
                  <option key={pat.id} value={idx}>
                    PATIENT ID: {pat.id} - Child: {pat.childName} (Parent: {pat.guardianName}, Mob: {pat.mobileNumber})
                  </option>
                ))}
              </select>
            </div>

            {/* Field 2: Form of announcement */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-slate-400 mb-1">Immunization Alert Event</label>
                <select
                  value={selectedType}
                  onChange={(e) => setSelectedType(e.target.value as any)}
                  className="w-full bg-slate-50 dark:bg-slate-905 border dark:border-slate-800 p-2.5 rounded text-zinc-150"
                >
                  <option value="Upcoming Dose Reminder">Upcoming Dose Reminder</option>
                  <option value="Booster Reminder">Booster Reminder</option>
                  <option value="Missed Dose Alert">Missed Dose Alert</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-400 mb-1">Contact dispatch protocol</label>
                <select
                  value={selectedMedium}
                  onChange={(e) => setSelectedMedium(e.target.value as any)}
                  className="w-full bg-slate-50 dark:bg-slate-905 border dark:border-slate-800 p-2.5 rounded text-zinc-150"
                >
                  <option value="SMS">SMS Gateway (GSM Tele-reserves)</option>
                  <option value="WhatsApp">WhatsApp Gateway API</option>
                  <option value="Email">Email Services (.gov.pk server)</option>
                </select>
              </div>
            </div>

            {/* Render dynamically mapped target output destination */}
            <div className="bg-slate-50 dark:bg-slate-900/60 p-3.5 rounded-xl text-xs space-y-1">
              <span className="text-[10px] text-slate-400 font-mono block">RECIPIENT CONTACT POOL</span>
              <strong className="text-secondary dark:text-primary font-mono text-[13px] block">
                {selectedMedium === "Email"
                  ? `${patients[targetPatientIndex]?.guardianName?.toLowerCase().replace(/\s+/g, "") || "guardian"}@nih.gov.pk`
                  : patients[targetPatientIndex]?.mobileNumber || "0300-1234567"}
              </strong>
              <p className="text-[10px] text-slate-400 leading-normal">
                Matched to reside in District: <strong className="text-slate-700 dark:text-slate-200">{patients[targetPatientIndex]?.district}</strong>, Union council: <strong className="text-slate-700 dark:text-slate-200">{patients[targetPatientIndex]?.unionCouncil}</strong>.
              </p>
            </div>

            {/* Action Trigger */}
            <button
              onClick={handleDispatchNotification}
              className="w-full p-3 bg-primary hover:bg-primary-hover text-slate-909 font-bold text-xs rounded-xl flex items-center justify-center gap-2 transition-all font-mono"
            >
              <Send className="w-5.0 h-5.0" /> DISPATCH TEMPLATE Reminders
            </button>
          </div>
        </div>

        {/* Right Card: Live Bilingual Preview Console */}
        <div className="bg-slate-900 text-white p-6 rounded-2xl flex flex-col justify-between shadow-xs border-r-4 border-primary">
          <div className="space-y-4">
            <span className="text-[9px] uppercase tracking-widest font-mono text-primary font-bold">
              DIGITAL PREVIEW CONSOLE (TELECOM COMPLIANT)
            </span>
            
            <div className="p-4 bg-slate-800/60 rounded-xl border border-white/5 space-y-4">
              <div className="flex items-center gap-2 text-slate-400 font-mono text-[10px]">
                {selectedMedium === "SMS" && <Smartphone className="w-4.5 h-4.5 text-primary" />}
                {selectedMedium === "WhatsApp" && <MessageSquare className="w-4.5 h-4.5 text-emerald-400" />}
                {selectedMedium === "Email" && <Mail className="w-4.5 h-4.5 text-cyan-400" />}
                <span>TEMPLATE_SIGNATURE: {activeTemplate.name}</span>
              </div>

              {/* Urg English */}
              <div className="space-y-1.5 text-xs">
                <span className="text-[10px] text-primary uppercase font-mono block">English Translation Outflow</span>
                <p className="leading-relaxed bg-zinc-950/50 p-2.5 rounded font-mono text-[11px]">
                  {activeTemplate.engText}
                </p>
              </div>

              {/* Urg Urdu */}
              <div className="space-y-1.5 text-xs border-t border-slate-750 pt-3">
                <span className="text-[10px] text-primary uppercase font-mono block">Urdu Translation Outflow (اردو)</span>
                <p className="leading-relaxed bg-zinc-950/50 p-2.5 rounded text-sm text-right dir-rtl leading-loose font-sans font-medium">
                  {activeTemplate.urduText}
                </p>
              </div>
            </div>
          </div>

          <p className="text-[10px] text-slate-400 mt-6 leading-relaxed">
            * Note: Pakistan Telecommunication Authority (PTA) mandates masking filters are in effect. These SMS bundles use government short-codes (e.g., "8066-NIH") to guarantee delivery without standard carrier delays.
          </p>
        </div>

      </div>

      {/* Notifications history table ledger */}
      <div className="bg-white dark:bg-dark-card border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-xs">
        <h3 className="font-bold text-slate-850 dark:text-slate-100 flex items-center gap-2 mb-4 text-sm">
          <BadgeAlert className="w-5 h-5 text-primary" /> National Alerts Log Dispatch Report
        </h3>

        <div className="overflow-x-auto custom-scrollbar">
          <table className="w-full text-left text-xs text-slate-500">
            <thead className="bg-slate-50 dark:bg-slate-850 text-slate-400 uppercase text-[9px] font-mono select-none">
              <tr>
                <th className="p-3">Remind Time</th>
                <th className="p-3">Patient Child ID</th>
                <th className="p-3">Notice Area</th>
                <th className="p-3">Medium</th>
                <th className="p-3">Recipient Address</th>
                <th className="p-3">Status</th>
                <th className="p-3">Message Snippet</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-105 dark:divide-slate-800">
              {notifications.map((n) => (
                <tr key={n.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-900/30 transition-all font-mono">
                  <td className="p-3 text-[10px] whitespace-nowrap">{new Date(n.sentAt).toLocaleTimeString()} {new Date(n.sentAt).toLocaleDateString()}</td>
                  <td className="p-3 font-semibold text-slate-850 dark:text-zinc-200">{n.patientId}</td>
                  <td className="p-3 text-slate-705 dark:text-zinc-300 whitespace-nowrap">{n.type}</td>
                  <td className="p-3 whitespace-nowrap">
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-100 dark:bg-slate-800 text-zinc-500">
                      {n.medium}
                    </span>
                  </td>
                  <td className="p-3 text-slate-705 dark:text-zinc-300 truncate max-w-[150px]">{n.recipient}</td>
                  <td className="p-3">
                    <span className="text-emerald-500 font-bold">● {n.status}</span>
                  </td>
                  <td className="p-3 text-slate-400 truncate max-w-[220px] text-[10px] italic select-all" title={n.messageBody}>
                    {n.messageBody}
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
