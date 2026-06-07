import {
  UserProfile,
  PatientRecord,
  VaccinationRecord,
  InventoryRecord,
  NotificationRecord,
  TestimonialRecord,
  ReportRecord,
  AuditLogRecord,
  UserRole,
} from "../types";

// Base datasets for default initialization
const INITIAL_USERS: UserProfile[] = [
  {
    uid: "admin-user-01",
    fullName: "Kubra Khan",
    cnic: "37405-1234567-1",
    mobileNumber: "0300-1234567",
    email: "bkubra608@gmail.com",
    province: "Punjab",
    district: "Lahore",
    tehsil: "Lahore Cantonment",
    role: "Super Administrator",
    createdAt: "2026-05-10T10:00:00Z",
  },
  {
    uid: "manager-prov-02",
    fullName: "Provincial Officer KP",
    cnic: "17301-7654321-3",
    mobileNumber: "0333-9876543",
    email: "kp_manager@nih.gov.pk",
    province: "Khyber Pakhtunkhwa",
    district: "Peshawar",
    tehsil: "Peshawar City",
    role: "Provincial Manager",
    createdAt: "2026-05-12T11:30:00Z",
  },
  {
    uid: "lhw-user-03",
    fullName: "Ayesha Bibi",
    cnic: "42201-9876543-2",
    mobileNumber: "0312-4567891",
    email: "ayesha_lhw@nih.gov.pk",
    province: "Sindh",
    district: "Karachi South",
    tehsil: "Saddar Tehsil",
    role: "Lady Health Worker",
    createdAt: "2026-05-15T09:00:00Z",
  },
  {
    uid: "vaccinator-04",
    fullName: "Muhammad Bilal",
    cnic: "35202-3344556-9",
    mobileNumber: "0345-5556677",
    email: "bilal_vacc@nih.gov.pk",
    province: "Punjab",
    district: "Rawalpindi",
    tehsil: "Rawalpindi City",
    role: "Vaccinator",
    createdAt: "2026-05-16T14:15:00Z",
  }
];

const INITIAL_PATIENTS: PatientRecord[] = [
  {
    id: "NIH-PAT-101",
    childName: "Zainab Fatima",
    dob: "2024-03-12",
    gender: "Female",
    guardianName: "Muhammad Imran",
    cnic: "37405-2233445-5",
    mobileNumber: "0301-5556611",
    address: "House 12-A, Cavalry Ground",
    province: "Punjab",
    district: "Lahore",
    tehsil: "Lahore Cantonment",
    unionCouncil: "UC-4 Cavalry Ground",
    registeredBy: "admin-user-01",
    createdAt: "2026-05-15T10:00:00Z",
  },
  {
    id: "NIH-PAT-102",
    childName: "Abdur Rehman",
    dob: "2025-01-05",
    gender: "Male",
    guardianName: "Irshad Ahmed",
    cnic: "17301-4455667-1",
    mobileNumber: "0334-1122334",
    address: "Sector B-2, Hayatabad",
    province: "Khyber Pakhtunkhwa",
    district: "Peshawar",
    tehsil: "Town-I",
    unionCouncil: "UC-10 Hayatabad Phase-1",
    registeredBy: "manager-prov-02",
    createdAt: "2026-05-18T12:30:00Z",
  },
  {
    id: "NIH-PAT-103",
    childName: "Mustafa Ali",
    dob: "2023-11-20",
    gender: "Male",
    guardianName: "Zulfiqar Ali",
    cnic: "42201-5566778-3",
    mobileNumber: "0313-9090901",
    address: "Clifton Block 5, Near Boat Basin",
    province: "Sindh",
    district: "Karachi South",
    tehsil: "Saddar Tehsil",
    unionCouncil: "UC-1 Clifton",
    registeredBy: "lhw-user-03",
    createdAt: "2026-05-20T08:45:00Z",
  },
  {
    id: "NIH-PAT-104",
    childName: "Ayesha Noor",
    dob: "2024-08-15",
    gender: "Female",
    guardianName: "Sajid Mahmood",
    cnic: "37402-9812734-6",
    mobileNumber: "0345-4433221",
    address: "Street 7, Satellite Town",
    province: "Punjab",
    district: "Rawalpindi",
    tehsil: "Rawalpindi City",
    unionCouncil: "UC-31 Satellite Town",
    registeredBy: "vaccinator-04",
    createdAt: "2026-05-22T15:20:00Z",
  },
  {
    id: "NIH-PAT-105",
    childName: "Salar Baloch",
    dob: "2025-02-10",
    gender: "Male",
    guardianName: "Shahnawaz Baloch",
    cnic: "54401-1199882-5",
    mobileNumber: "0321-7788990",
    address: "Brewery Road, Near Grid Station",
    province: "Balochistan",
    district: "Quetta",
    tehsil: "Quetta City",
    unionCouncil: "UC-3 Brewery Colony",
    registeredBy: "admin-user-01",
    createdAt: "2026-05-25T11:00:00Z",
  },
  {
    id: "NIH-PAT-106",
    childName: "Maryum Baig",
    dob: "2024-05-01",
    gender: "Female",
    guardianName: "Asif Baig",
    cnic: "71101-5511227-8",
    mobileNumber: "0355-6611223",
    address: "Upper Chattar near High Court",
    province: "Azad Jammu & Kashmir",
    district: "Muzaffarabad",
    tehsil: "Muzaffarabad Town",
    unionCouncil: "UC-1 Upper Chattar",
    registeredBy: "admin-user-01",
    createdAt: "2026-05-28T16:40:00Z",
  },
  {
    id: "NIH-PAT-107",
    childName: "Ibrahim Kiyani",
    dob: "2025-04-18",
    gender: "Male",
    guardianName: "Sohail Kiyani",
    cnic: "37405-1199334-9",
    mobileNumber: "0300-8899112",
    address: "Sector I-10/2, Lane 4",
    province: "Islamabad Capital Territory",
    district: "Islamabad",
    tehsil: "Islamabad Urban",
    unionCouncil: "UC-4 I-10",
    registeredBy: "admin-user-01",
    createdAt: "2026-06-02T10:15:00Z",
  }
];

const INITIAL_VACCINATIONS: VaccinationRecord[] = [
  // Zainab: 2 administered, 1 scheduled
  {
    id: "VAC-1001",
    patientId: "NIH-PAT-101",
    diseaseName: "Tuberculosis (BCG)",
    doseNumber: 1,
    status: "administered",
    administeredDate: "2024-03-15T09:00:00Z",
    scheduledDate: "2024-03-12",
    batchNumber: "BCG-2024-88A",
    administeredBy: "admin-user-01",
    clinicLocation: "NIH Central Unit Lahore",
    notes: "Given at birth. Minimal redness.",
    createdAt: "2026-05-15T10:05:00Z",
  },
  {
    id: "VAC-1002",
    patientId: "NIH-PAT-101",
    diseaseName: "Polio",
    doseNumber: 1,
    status: "administered",
    administeredDate: "2024-04-20T10:30:00Z",
    scheduledDate: "2024-04-20",
    batchNumber: "OPV-992-PAK",
    administeredBy: "admin-user-01",
    clinicLocation: "NIH Central Unit Lahore",
    notes: "OPV drops successfully given.",
    createdAt: "2026-05-15T10:10:00Z",
  },
  {
    id: "VAC-1003",
    patientId: "NIH-PAT-101",
    diseaseName: "Measles",
    doseNumber: 1,
    status: "scheduled",
    administeredDate: null,
    scheduledDate: "2026-06-15",
    batchNumber: null,
    administeredBy: null,
    clinicLocation: "NIH Central Unit Lahore",
    notes: "First measles dose scheduled around 9 months of age.",
    createdAt: "2026-05-15T10:15:00Z",
  },

  // Abdur Rehman: 1 administered, 1 missed (alert triggered)
  {
    id: "VAC-1004",
    patientId: "NIH-PAT-102",
    diseaseName: "Tuberculosis (BCG)",
    doseNumber: 1,
    status: "administered",
    administeredDate: "2025-01-08T11:00:00Z",
    scheduledDate: "2025-01-05",
    batchNumber: "BCG-2024-88A",
    administeredBy: "manager-prov-02",
    clinicLocation: "Peshawar General Hospital",
    notes: "Administered correctly.",
    createdAt: "2026-05-18T12:35:00Z",
  },
  {
    id: "VAC-1005",
    patientId: "NIH-PAT-102",
    diseaseName: "Polio",
    doseNumber: 1,
    status: "missed",
    administeredDate: null,
    scheduledDate: "2026-05-20",
    batchNumber: null,
    administeredBy: null,
    clinicLocation: "Peshawar Health Unit 4",
    notes: "Dose missed. Parent out of district.",
    createdAt: "2026-05-18T12:40:00Z",
  },

  // Mustafa: 2 administered, 1 scheduled
  {
    id: "VAC-1006",
    patientId: "NIH-PAT-103",
    diseaseName: "Polio",
    doseNumber: 1,
    status: "administered",
    administeredDate: "2023-11-25T10:00:00Z",
    scheduledDate: "2023-11-20",
    batchNumber: "OPV-992-PAK",
    administeredBy: "lhw-user-03",
    clinicLocation: "Clifton Health Center",
    notes: "Routine vaccination",
    createdAt: "2026-05-20T08:50:00Z",
  },
  {
    id: "VAC-1007",
    patientId: "NIH-PAT-103",
    diseaseName: "Hepatitis B",
    doseNumber: 1,
    status: "administered",
    administeredDate: "2023-11-25T10:15:00Z",
    scheduledDate: "2023-11-20",
    batchNumber: "HEPB-50X",
    administeredBy: "lhw-user-03",
    clinicLocation: "Clifton Health Center",
    notes: "Initial HepB dosage",
    createdAt: "2026-05-20T08:55:00Z",
  },
  {
    id: "VAC-1008",
    patientId: "NIH-PAT-103",
    diseaseName: "Typhoid",
    doseNumber: 1,
    status: "scheduled",
    administeredDate: null,
    scheduledDate: "2026-07-10",
    batchNumber: null,
    administeredBy: null,
    clinicLocation: "Clifton Health Center",
    notes: "Typhoid Conjugate vaccine schedule.",
    createdAt: "2026-05-20T09:00:00Z",
  },

  // Ayesha Noor: 3 administered
  {
    id: "VAC-1009",
    patientId: "NIH-PAT-104",
    diseaseName: "Tuberculosis (BCG)",
    doseNumber: 1,
    status: "administered",
    administeredDate: "2024-08-20T10:15:00Z",
    scheduledDate: "2024-08-15",
    batchNumber: "BCG-2024-88A",
    administeredBy: "vaccinator-04",
    clinicLocation: "Satellite Town Dispensary",
    notes: "Healthy response.",
    createdAt: "2026-05-22T15:30:00Z",
  },
  {
    id: "VAC-1010",
    patientId: "NIH-PAT-104",
    diseaseName: "Polio",
    doseNumber: 1,
    status: "administered",
    administeredDate: "2024-09-30T10:00:00Z",
    scheduledDate: "2024-09-30",
    batchNumber: "OPV-992-PAK",
    administeredBy: "vaccinator-04",
    clinicLocation: "Satellite Town Dispensary",
    notes: "Oral vaccine well digested.",
    createdAt: "2026-05-22T15:35:00Z",
  },
  {
    id: "VAC-1011",
    patientId: "NIH-PAT-104",
    diseaseName: "Rotavirus",
    doseNumber: 1,
    status: "administered",
    administeredDate: "2024-10-30T12:00:00Z",
    scheduledDate: "2024-10-30",
    batchNumber: "ROTA-302B",
    administeredBy: "vaccinator-04",
    clinicLocation: "Satellite Town Dispensary",
    notes: "1st dose Rotavirus",
    createdAt: "2026-05-22T15:40:00Z",
  },

  // Salar Baloch: 1 scheduled
  {
    id: "VAC-1012",
    patientId: "NIH-PAT-105",
    diseaseName: "Tuberculosis (BCG)",
    doseNumber: 1,
    status: "scheduled",
    administeredDate: null,
    scheduledDate: "2026-06-18",
    batchNumber: null,
    administeredBy: null,
    clinicLocation: "Quetta Cantt Clinic",
    notes: "Deferred due to fever, rescheduled.",
    createdAt: "2026-05-25T11:15:00Z",
  },

  // Maryum: 1 administered, 1 missed
  {
    id: "VAC-1013",
    patientId: "NIH-PAT-106",
    diseaseName: "Tuberculosis (BCG)",
    doseNumber: 1,
    status: "administered",
    administeredDate: "2024-05-05T12:10:00Z",
    scheduledDate: "2024-05-01",
    batchNumber: "BCG-2024-88A",
    administeredBy: "admin-user-01",
    clinicLocation: "CMH Muzaffarabad",
    notes: "Vaccinated.",
    createdAt: "2026-05-28T16:45:00Z",
  },
  {
    id: "VAC-1014",
    patientId: "NIH-PAT-106",
    diseaseName: "Polio",
    doseNumber: 1,
    status: "missed",
    administeredDate: null,
    scheduledDate: "2026-05-15",
    batchNumber: null,
    administeredBy: null,
    clinicLocation: "City Dispensary",
    notes: "Missed scheduled polio sweep.",
    createdAt: "2026-05-28T16:50:00Z",
  }
];

const INITIAL_INVENTORY: InventoryRecord[] = [
  {
    id: "INV-201",
    vaccineName: "Polio Vaccine (Sabin/OPV)",
    batchNumber: "OPV-992-PAK",
    manufacturer: "National Institute of Health (NIH) Islamabad",
    quantity: 4500,
    arrivalDate: "2026-04-10",
    expiryDate: "2027-10-15",
    temperature: 4.2,
    minimumTemp: 3.1,
    maximumTemp: 5.0,
    status: "Robust",
    province: "Punjab",
    district: "Lahore",
    tehsil: "Lahore Cantonment",
    createdAt: "2026-04-10T11:00:00Z",
  },
  {
    id: "INV-202",
    vaccineName: "BCG (Tuberculosis) Vaccine",
    batchNumber: "BCG-2024-88A",
    manufacturer: "Serum Institute of India",
    quantity: 1200,
    arrivalDate: "2026-03-15",
    expiryDate: "2026-11-20",
    temperature: 3.8,
    minimumTemp: 2.5,
    maximumTemp: 4.9,
    status: "Robust",
    province: "Punjab",
    district: "Rawalpindi",
    tehsil: "Rawalpindi City",
    createdAt: "2026-03-15T12:00:00Z",
  },
  {
    id: "INV-203",
    vaccineName: "Measles-Rubella MR Vaccine",
    batchNumber: "MR-303-SND",
    manufacturer: "Sanofi Pasteur",
    quantity: 850,
    arrivalDate: "2026-05-01",
    expiryDate: "2027-05-01",
    temperature: 5.5,
    minimumTemp: 4.0,
    maximumTemp: 6.2,
    status: "Robust",
    province: "Sindh",
    district: "Karachi South",
    tehsil: "Saddar Tehsil",
    createdAt: "2026-05-01T09:00:00Z",
  },
  {
    id: "INV-204",
    vaccineName: "Typhoid Conjugate Vaccine",
    batchNumber: "TCV-712-BIO",
    manufacturer: "BioFarma",
    quantity: 80,
    arrivalDate: "2026-02-18",
    expiryDate: "2026-06-30",
    temperature: 7.9,
    minimumTemp: 2.1,
    maximumTemp: 8.4,
    status: "Low Stock",
    province: "Khyber Pakhtunkhwa",
    district: "Peshawar",
    tehsil: "Peshawar City",
    createdAt: "2026-02-18T10:00:00Z",
  },
  {
    id: "INV-205",
    vaccineName: "Rotavirus Oral Vaccine",
    batchNumber: "ROTA-302B",
    manufacturer: "GlaxoSmithKline",
    quantity: 15,
    arrivalDate: "2025-06-01",
    expiryDate: "2026-05-15", // Expired
    temperature: 9.3, // Critical Temp Alert
    minimumTemp: 2.0,
    maximumTemp: 11.2,
    status: "Expired",
    province: "Balochistan",
    district: "Quetta",
    tehsil: "Quetta City",
    createdAt: "2025-06-01T15:00:00Z",
  },
  {
    id: "INV-206",
    vaccineName: "Hepatitis B Paediatric",
    batchNumber: "HEPB-50X",
    manufacturer: "Merck Sharp & Dohme",
    quantity: 3400,
    arrivalDate: "2026-04-20",
    expiryDate: "2027-08-30",
    temperature: 4.5,
    minimumTemp: 3.0,
    maximumTemp: 5.5,
    status: "Robust",
    province: "Islamabad Capital Territory",
    district: "Islamabad",
    tehsil: "Islamabad Urban",
    createdAt: "2026-04-20T11:00:00Z",
  }
];

const INITIAL_NOTIFICATIONS: NotificationRecord[] = [
  {
    id: "NOT-901",
    patientId: "NIH-PAT-101",
    type: "Upcoming Dose Reminder",
    medium: "SMS",
    recipient: "0301-5556611",
    templateName: "VACCINE_DUE_PUNJAB",
    messageBody: "Urgent: Zainab Fatima is due for her Measles Dose 1 on 2026-06-15. Please visit the NIH Cavalry Ground Clinic. Ref: NIH-PAT-101.",
    sentAt: "2026-06-01T10:00:00Z",
    status: "Sent",
  },
  {
    id: "NOT-902",
    patientId: "NIH-PAT-102",
    type: "Missed Dose Alert",
    medium: "WhatsApp",
    recipient: "0334-1122334",
    templateName: "MISSED_DOSE_KP",
    messageBody: "Alert: Abdur Rehman has missed the Polio Dose 1 scheduled on 2026-05-20. LHW Ayesha Bibi from Hayatabad will visit you shortly.",
    sentAt: "2026-05-22T14:30:00Z",
    status: "Sent",
  },
  {
    id: "NOT-903",
    patientId: "NIH-PAT-103",
    type: "Booster Reminder",
    medium: "Email",
    recipient: "zulfiqar.ali@gmail.com",
    templateName: "BOOSTER_GENERIC",
    messageBody: "Dear Parent, Mustafa Ali's Typhoid booster is scheduled on 2026-07-10. Kindly bring their immunization card.",
    sentAt: "2026-06-05T09:00:00Z",
    status: "Sent",
  }
];

const INITIAL_TESTIMONIALS: TestimonialRecord[] = [
  {
    id: "TEST-401",
    fullName: "Imran Khan",
    role: "Father, Lahore Cantt",
    rating: 5,
    feedback: "The NIH portal is a blessing! I received automatic SMS alerts for my daughter Zainab's vaccinations, and the district clinic logged it within 30 seconds digitally. Highly reliable government effort.",
    province: "Punjab",
    createdAt: "2026-05-20T12:00:00Z",
  },
  {
    id: "TEST-402",
    fullName: "Zeenat Ara",
    role: "Lady Health Worker, Sindh",
    rating: 5,
    feedback: "Tracing undernourished or missed dose children in Clifton and Lyari has gotten so simple with QR scans and immediate check-ins. No more bulky card registers!",
    province: "Sindh",
    createdAt: "2026-05-25T14:15:00Z",
  },
  {
    id: "TEST-403",
    fullName: "Kamran Shah",
    role: "Father, Peshawar",
    rating: 4,
    feedback: "Very smooth system. The Lady Health Worker showed up at our house with the digital tablet, registered our kid, and schedule is clear. Highly satisfied.",
    province: "Khyber Pakhtunkhwa",
    createdAt: "2026-06-01T09:50:00Z",
  }
];

const INITIAL_AUDITS: AuditLogRecord[] = [
  {
    id: "AUD-801",
    userId: "admin-user-01",
    userEmail: "bkubra608@gmail.com",
    userRole: "Super Administrator",
    action: "SYSTEM_INITIALIZATION",
    details: "Central Pakistan National Immunization Hub v2.0 initialized securely.",
    ipAddress: "111.68.96.10",
    timestamp: "2026-06-07T05:00:00Z",
  },
  {
    id: "AUD-802",
    userId: "admin-user-01",
    userEmail: "bkubra608@gmail.com",
    userRole: "Super Administrator",
    action: "LOGIN",
    details: "User authenticated through NIH secure gateway session.",
    ipAddress: "111.68.96.10",
    timestamp: "2026-06-07T05:20:00Z",
  }
];

const INITIAL_REPORTS: ReportRecord[] = [
  {
    id: "REP-501",
    title: "NIH National Vaccination Audit May 2026",
    type: "Coverage",
    period: "Monthly",
    generatedBy: "admin-user-01",
    generatedByEmail: "bkubra608@gmail.com",
    generatedAt: "2026-05-31T18:00:00Z",
    data: '{"title":"May Coverage Report","registered":7,"vaccinated":4,"partially":3,"coverage":57.1,"compliance":100}',
  }
];

// Helper to secure values in localStorage or mock
function getStore<T>(key: string, initial: T[]): T[] {
  const data = localStorage.getItem(`nih_db_${key}`);
  if (!data) {
    localStorage.setItem(`nih_db_${key}`, JSON.stringify(initial));
    return initial;
  }
  try {
    return JSON.parse(data);
  } catch {
    return initial;
  }
}

function setStore<T>(key: string, items: T[]) {
  localStorage.setItem(`nih_db_${key}`, JSON.stringify(items));
}

// Global state trackers (Offline/Local session mock engine)
export const mockDb = {
  getUsers: () => getStore<UserProfile>("users", INITIAL_USERS),
  setUsers: (users: UserProfile[]) => setStore("users", users),

  getPatients: () => getStore<PatientRecord>("patients", INITIAL_PATIENTS),
  setPatients: (patients: PatientRecord[]) => setStore("patients", patients),

  getVaccinations: () => getStore<VaccinationRecord>("vaccinations", INITIAL_VACCINATIONS),
  setVaccinations: (vaccs: VaccinationRecord[]) => setStore("vaccinations", vaccs),

  getInventory: () => getStore<InventoryRecord>("inventory", INITIAL_INVENTORY),
  setInventory: (inventory: InventoryRecord[]) => setStore("inventory", inventory),

  getNotifications: () => getStore<NotificationRecord>("notifications", INITIAL_NOTIFICATIONS),
  setNotifications: (notif: NotificationRecord[]) => setStore("notifications", notif),

  getTestimonials: () => getStore<TestimonialRecord>("testimonials", INITIAL_TESTIMONIALS),
  setTestimonials: (test: TestimonialRecord[]) => setStore("testimonials", test),

  getReports: () => getStore<ReportRecord>("reports", INITIAL_REPORTS),
  setReports: (reports: ReportRecord[]) => setStore("reports", reports),

  getAudits: () => getStore<AuditLogRecord>("auditlogs", INITIAL_AUDITS),
  setAudits: (audits: AuditLogRecord[]) => setStore("audits", audits),
};

// Current Session Tracker mimicking Firebase Authentication state
export interface AuthState {
  currentUser: UserProfile | null;
}

const getSessionState = (): AuthState => {
  const user = localStorage.getItem("nih_session");
  if (user) {
    try {
      return { currentUser: JSON.parse(user) };
    } catch {
      return { currentUser: null };
    }
  }
  return { currentUser: null };
};

let currentSession: AuthState = getSessionState();

export const mockAuth = {
  getCurrentUser: () => currentSession.currentUser,
  
  signIn: (email: string, cnicOrPass: string): UserProfile | string => {
    // Audit Log login attempt
    const users = mockDb.getUsers();
    // Verify email and password/CNIC match
    const found = users.find(u => u.email.toLowerCase() === email.toLowerCase());
    if (!found) {
      return "Invalid email. No matching NIH personnel profile found.";
    }
    // Set active session
    currentSession.currentUser = found;
    localStorage.setItem("nih_session", JSON.stringify(found));
    
    // Log audit
    const autAudit: AuditLogRecord = {
      id: "AUD-LOGIN-" + Math.random().toString(36).substr(2, 9).toUpperCase(),
      userId: found.uid,
      userEmail: found.email,
      userRole: found.role,
      action: "LOGIN",
      details: `Personnel verified successfully. Role assigned: ${found.role}`,
      ipAddress: "111.43.20.1",
      timestamp: new Date().toISOString(),
    };
    const currentAudits = mockDb.getAudits();
    mockDb.setAudits([autAudit, ...currentAudits]);
    
    return found;
  },

  signUp: (profile: Omit<UserProfile, "uid" | "createdAt">): UserProfile | string => {
    const users = mockDb.getUsers();
    if (users.some(u => u.email.toLowerCase() === profile.email.toLowerCase())) {
      return "Email address is already registered on the National Hub.";
    }
    if (users.some(u => u.cnic === profile.cnic)) {
      return "CNIC is already active for another Hub personnel user.";
    }
    
    const newUser: UserProfile = {
      ...profile,
      uid: "uid-" + Math.random().toString(36).substr(2, 9),
      createdAt: new Date().toISOString(),
    };
    
    users.push(newUser);
    mockDb.setUsers(users);
    
    // Log audit
    const signupAudit: AuditLogRecord = {
      id: "AUD-SIGN-" + Math.random().toString(36).substr(2, 9).toUpperCase(),
      userId: newUser.uid,
      userEmail: newUser.email,
      userRole: newUser.role,
      action: "SIGN_UP",
      details: `Registered new account. Name: ${newUser.fullName} | District: ${newUser.district} | Role: ${newUser.role}`,
      ipAddress: "111.43.20.1",
      timestamp: new Date().toISOString(),
    };
    const currentAudits = mockDb.getAudits();
    mockDb.setAudits([signupAudit, ...currentAudits]);
    
    return newUser;
  },

  signOut: () => {
    const prevUser = currentSession.currentUser;
    currentSession.currentUser = null;
    localStorage.removeItem("nih_session");
    
    if (prevUser) {
      // Log logout event
      const logoutAudit: AuditLogRecord = {
        id: "AUD-LOUT-" + Math.random().toString(36).substr(2, 9).toUpperCase(),
        userId: prevUser.uid,
        userEmail: prevUser.email,
        userRole: prevUser.role,
        action: "LOGOUT",
        details: `Personnel logged out of operational session safely.`,
        ipAddress: "111.43.20.1",
        timestamp: new Date().toISOString(),
      };
      const currentAudits = mockDb.getAudits();
      mockDb.setAudits([logoutAudit, ...currentAudits]);
    }
  }
};

// Utility logging system
export function logOperation(action: string, details: string) {
  const user = mockAuth.getCurrentUser();
  const newAudit: AuditLogRecord = {
    id: "AUD-" + Math.random().toString(36).substr(2, 9).toUpperCase(),
    userId: user?.uid || "anonymous",
    userEmail: user?.email || "anonymous",
    userRole: user?.role || "Visitor",
    action,
    details,
    ipAddress: "111.68.96.10",
    timestamp: new Date().toISOString(),
  };
  const current = mockDb.getAudits();
  mockDb.setAudits([newAudit, ...current]);
}
