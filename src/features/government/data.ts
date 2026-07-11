export interface RegionStat {
  region: string;
  schools: number;
  students: number;
  dropoutRate: number;
}

export const REGION_STATS: RegionStat[] = [
  { region: "Littoral", schools: 412, students: 284000, dropoutRate: 4.2 },
  { region: "Centre", schools: 389, students: 261000, dropoutRate: 5.1 },
  { region: "West", schools: 301, students: 198000, dropoutRate: 6.4 },
  { region: "North", schools: 178, students: 121000, dropoutRate: 11.8 },
  { region: "Far North", schools: 142, students: 96000, dropoutRate: 14.3 },
  { region: "South West", schools: 165, students: 88000, dropoutRate: 9.6 },
];

export interface GovSchool {
  id: string;
  name: string;
  region: string;
  type: "Public" | "Private";
  students: number;
  compliance: "compliant" | "under-review" | "non-compliant";
}

export const GOV_SCHOOLS: GovSchool[] = [
  { id: "SCH-1", name: "Lycée Bilingue de Douala", region: "Littoral", type: "Public", students: 1042, compliance: "compliant" },
  { id: "SCH-2", name: "Collège Saint Michel", region: "Littoral", type: "Private", students: 680, compliance: "compliant" },
  { id: "SCH-3", name: "Government Bilingual High School", region: "South West", type: "Public", students: 910, compliance: "under-review" },
  { id: "SCH-4", name: "Lycée de Garoua", region: "North", type: "Public", students: 720, compliance: "non-compliant" },
];

export interface GovUniversity {
  id: string;
  name: string;
  region: string;
  enrolled: number;
  graduationRate: number;
}

export const GOV_UNIVERSITIES: GovUniversity[] = [
  { id: "UNI-1", name: "Université de Douala", region: "Littoral", enrolled: 1465, graduationRate: 78 },
  { id: "UNI-2", name: "Université de Yaoundé I", region: "Centre", enrolled: 1820, graduationRate: 74 },
  { id: "UNI-3", name: "Université de Buea", region: "South West", enrolled: 990, graduationRate: 71 },
];

export const DROPOUT_TREND = [
  { year: "2022", rate: 9.8 },
  { year: "2023", rate: 8.9 },
  { year: "2024", rate: 8.1 },
  { year: "2025", rate: 7.4 },
  { year: "2026", rate: 6.9 },
];

export interface FundingRecord {
  id: string;
  school: string;
  region: string;
  allocated: number;
  disbursed: number;
  compliance: "compliant" | "under-review" | "non-compliant";
}

export const FUNDING: FundingRecord[] = [
  { id: "FUND-1", school: "Lycée Bilingue de Douala", region: "Littoral", allocated: 85000000, disbursed: 85000000, compliance: "compliant" },
  { id: "FUND-2", school: "Government Bilingual High School", region: "South West", allocated: 72000000, disbursed: 54000000, compliance: "under-review" },
  { id: "FUND-3", school: "Lycée de Garoua", region: "North", allocated: 60000000, disbursed: 30000000, compliance: "non-compliant" },
];

export interface NationalDiploma {
  id: string;
  student: string;
  institution: string;
  txHash: string;
  verified: boolean;
}

export const NATIONAL_DIPLOMAS: NationalDiploma[] = [
  { id: "NDIP-1", student: "Patrice Owona", institution: "Université de Douala", txHash: "0x9c1a…44fe", verified: true },
  { id: "NDIP-2", student: "Nadia Fongang", institution: "Université de Douala", txHash: "0x2f8b…091d", verified: true },
  { id: "NDIP-3", student: "Thabo Nkosi", institution: "Lycée Bilingue de Douala", txHash: "0x8a2f…c19e", verified: true },
];
