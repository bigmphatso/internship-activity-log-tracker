
export interface Day {
  date: string;
  log: Record<string, string>;
}

export interface Week {
  weekNumber: number;
  days: Day[];
  summary?: string;
}

export interface Internship {
  location: string;
  totalWeeks: number;
  startDate: string;
  weeks: Week[];
  logFields: string[];
}

export interface User {
  uid: string;
  email?: string | null;
  fullName: string | null;
  username: string | null;
}
