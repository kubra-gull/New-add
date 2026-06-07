export interface LocationData {
  [province: string]: {
    [district: string]: {
      [tehsil: string]: string[]; // List of Union Councils
    };
  };
}

export const PAKISTAN_LOCATIONS: LocationData = {
  "Punjab": {
    "Lahore": {
      "Lahore Cantonment": ["UC-1 Cantt West", "UC-2 Cantt East", "UC-3 DHA Phase-III", "UC-4 Cavalry Ground"],
      "Lahore City": ["UC-10 Anarkali", "UC-11 Shadman", "UC-12 Gulberg", "UC-13 Model Town"],
      "Shalimar": ["UC-20 Mughalpura", "UC-21 Baghbanpura", "UC-22 Shalimar Link"]
    },
    "Rawalpindi": {
      "Rawalpindi City": ["UC-30 Raja Bazar", "UC-31 Satellite Town", "UC-32 Sadiqabad"],
      "Gujar Khan": ["UC-40 Gujar Khan Urban", "UC-41 Qazian", "UC-42 Bewal"],
      "Taxila": ["UC-50 Taxila Cantt", "UC-51 Wah Cantt", "UC-52 Faisal Town"]
    },
    "Multan": {
      "Multan City": ["UC-60 Shah Rukn-e-Alam", "UC-61 Mumtazabad", "UC-62 Gulgasht"],
      "Saddar Multan": ["UC-70 Sher Shah", "UC-71 Lar", "UC-72 Qadirpur Ran"]
    }
  },
  "Sindh": {
    "Karachi South": {
      "Saddar Tehsil": ["UC-1 Clifton", "UC-2 Bath Island", "UC-3 Kharadar", "UC-4 Mithadar"],
      "Aram Bagh": ["UC-8 Aram Bagh South", "UC-9 Burns Road", "UC-10 Gazdarabad"]
    },
    "Hyderabad": {
      "Hyderabad City": ["UC-15 Latifabad", "UC-16 Qasimabad", "UC-17 Cantonment"],
      "Saddar Hyderabad": ["UC-20 Tando Jam", "UC-21 Hatri", "UC-22 Husri"]
    },
    "Sukkur": {
      "Sukkur City": ["UC-25 Barrage Colony", "UC-26 Shalimar Ward", "UC-27 military Road"],
      "Rohri": ["UC-30 Rohri Station", "UC-31 Ali Wahan", "UC-32 Kandhra"]
    }
  },
  "Khyber Pakhtunkhwa": {
    "Peshawar": {
      "Peshawar City": ["UC-1 Yakatoot", "UC-2 Lahori Gate", "UC-3 Andar Shehar"],
      "Town-I": ["UC-10 Hayatabad Phase-1", "UC-11 Hayatabad Phase-5", "UC-12 Board Bazar"]
    },
    "Abbottabad": {
      "Abbottabad Tehsil": ["UC-5 Malikpura", "UC-6 Kehal", "UC-7 Narian", "UC-8 Jinnahabad"],
      "Havelian": ["UC-12 Havelian City", "UC-13 Langra", "UC-14 Kokal"]
    }
  },
  "Balochistan": {
    "Quetta": {
      "Quetta City": ["UC-1 Jinnah Road", "UC-2 Zarghoon Road", "UC-3 Brewery Colony"],
      "Chaman Tehsil": ["UC-10 Border Ward", "UC-11 Chaman Bazar", "UC-12 Chaman Cantt"]
    },
    "Gwadar": {
      "Gwadar City": ["UC-5 Port View", "UC-6 Surbandar", "UC-7 Pishukan"],
      "Pasni": ["UC-15 Pasni Town", "UC-16 Kalmat", "UC-17 Shadi Kaur"]
    }
  },
  "Gilgit Baltistan": {
    "Gilgit": {
      "Gilgit Town": ["UC-1 Jutial", "UC-2 Konodas", "UC-3 Khomer"],
      "Danyore": ["UC-10 Danyore Sect-A", "UC-11 Jalalabad", "UC-12 Oshikhandass"]
    },
    "Hunza": {
      "Aliabad": ["UC-5 Aliabad Centre", "UC-6 Ganish", "UC-7 Karimabad"],
      "Gojal": ["UC-15 Gulmit", "UC-16 Passu", "UC-17 Sost Border Post"]
    }
  },
  "Azad Jammu & Kashmir": {
    "Muzaffarabad": {
      "Muzaffarabad Town": ["UC-1 Upper Chattar", "UC-2 Garhi Dupatta", "UC-3 Plate Ward"],
      "Hattian Bala": ["UC-10 Hattian City", "UC-11 Chikar", "UC-12 Lamnian"]
    },
    "Mirpur": {
      "Mirpur Town": ["UC-5 Sector D-3", "UC-6 Sector C-1", "UC-7 New City"],
      "Dadyal": ["UC-15 Dadyal Ward-1", "UC-16 Ratta", "UC-17 Thara"]
    }
  },
  "Islamabad Capital Territory": {
    "Islamabad": {
      "Islamabad Urban": ["UC-1 G-6", "UC-2 F-7", "UC-3 G-9", "UC-4 I-10", "UC-5 E-11"],
      "Islamabad Rural": ["UC-15 Bhara Kahu", "UC-16 Tarlai", "UC-17 Khanna Pul", "UC-18 Sihala"]
    }
  }
};

export const ALL_PROVINCES = Object.keys(PAKISTAN_LOCATIONS);

export function getDistricts(province: string): string[] {
  if (!province || !PAKISTAN_LOCATIONS[province]) return [];
  return Object.keys(PAKISTAN_LOCATIONS[province]);
}

export function getTehsils(province: string, district: string): string[] {
  if (!province || !district || !PAKISTAN_LOCATIONS[province]?.[district]) return [];
  return Object.keys(PAKISTAN_LOCATIONS[province][district]);
}

export function getUnionCouncils(province: string, district: string, tehsil: string): string[] {
  if (
    !province ||
    !district ||
    !tehsil ||
    !PAKISTAN_LOCATIONS[province]?.[district]?.[tehsil]
  ) {
    return [];
  }
  return PAKISTAN_LOCATIONS[province][district][tehsil];
}
