import { apiClient } from "./apiClient";

export interface BackendGovSchool {
  id: string;
  name: string;
  region: string;
  type: "School" | "University";
  students: number;
  compliance: "compliant" | "under_review" | "non_compliant";
}

export interface BackendGovUniversity {
  id: string;
  name: string;
  region: string;
  enrolled: number;
  graduationRate: number;
}

export interface BackendRegionStat {
  id: string;
  region: string;
  schools: number;
  students: number;
  dropoutRate: number;
}

export interface BackendFundingRecord {
  id: string;
  region: string;
  allocated: string;
  disbursed: string;
  compliance: "compliant" | "under_review" | "non_compliant";
  school: { name: string };
}

export const governmentApi = {
  schools: {
    list: (token: string) => apiClient.get<BackendGovSchool[]>("/government/schools", token),
  },
  universities: {
    list: (token: string) => apiClient.get<BackendGovUniversity[]>("/government/universities", token),
  },
  statistics: {
    list: (token: string) => apiClient.get<BackendRegionStat[]>("/government/statistics", token),
  },
  funding: {
    list: (token: string) => apiClient.get<BackendFundingRecord[]>("/government/funding", token),
  },
};
