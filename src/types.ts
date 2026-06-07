export type UserRole =
  | "Super Administrator"
  | "Provincial Manager"
  | "District Manager"
  | "Medical Officer"
  | "Vaccinator"
  | "Lady Health Worker"
  | "Store Manager"
  | "Auditor";

export interface UserProfile {
  uid: string;
  fullName: string;
  cnic: string;
  mobileNumber: string;
  email: string;
  province: string;
  district: string;
  tehsil: string;
  role: UserRole;
  createdAt: string;
}

export interface PatientRecord {
  id: string; // E.g., NIH-PAT-10023
  childName: string;
  dob: string; // YYYY-MM-DD
  gender: "Male" | "Female" | "Other";
  guardianName: string;
  cnic: string; // Guardian's CNIC
  mobileNumber: string;
  address: string;
  province: string;
  district: string;
  tehsil: string;
  unionCouncil: string;
  registeredBy: string; // User UID
  createdAt: string;
}

export interface VaccinationRecord {
  id: string;
  patientId: string;
  diseaseName: string; // Polio, Measles, BCG, etc.
  doseNumber: number; // 1, 2, 3, 4 (Booster)
  status: "administered" | "scheduled" | "missed";
  administeredDate: string | null;
  scheduledDate: string;
  batchNumber: string | null;
  administeredBy: string | null; // User UID
  clinicLocation: string;
  notes: string | null;
  createdAt: string;
}

export interface InventoryRecord {
  id: string;
  vaccineName: string;
  batchNumber: string;
  manufacturer: string;
  quantity: number;
  arrivalDate: string;
  expiryDate: string;
  temperature: number; // For cold-chain monitoring in ºC
  minimumTemp: number;
  maximumTemp: number;
  status: "Robust" | "Low Stock" | "Expired" | "Critical Temperature Alert";
  province: string;
  district: string;
  tehsil: string;
  createdAt: string;
}

export interface NotificationRecord {
  id: string;
  patientId: string;
  type: "Upcoming Dose Reminder" | "Booster Reminder" | "Missed Dose Alert";
  medium: "SMS" | "Email" | "WhatsApp";
  recipient: string;
  templateName: string;
  messageBody: string;
  sentAt: string;
  status: "Sent" | "Pending" | "Failed";
}

export interface TestimonialRecord {
  id: string;
  fullName: string;
  role: string;
  rating: number; // 1-5
  feedback: string;
  province: string;
  createdAt: string;
}

export interface ReportRecord {
  id: string;
  title: string;
  type: "Reconciliation" | "Compliance" | "Variance" | "Coverage";
  period: "Daily" | "Weekly" | "Monthly" | "Annual";
  generatedBy: string; // User UID
  generatedByEmail: string;
  generatedAt: string;
  data: string; // JSON content string
}

export interface AuditLogRecord {
  id: string;
  userId: string;
  userEmail: string;
  userRole: string;
  action: string; // LOGIN, LOGOUT, REGISTER_CHILD, ADD_DOSE, ADJUST_STOCK, ADD_TESTIMONIAL, etc.
  details: string;
  ipAddress: string;
  timestamp: string;
}
