/* Snapshot loader. Reads pre-generated JSON files under public/data/<rep>/.
   These are written by `python -m pulse publish-web` from the PULSE v2 box. */
import path from "node:path";
import { promises as fs } from "node:fs";

export const REPS = ["AC", "AP", "BV", "NP", "BM"] as const;
export type RepCode = (typeof REPS)[number];

export const REP_NAMES: Record<RepCode, string> = {
  AC: "Aboo Cassim",
  AP: "Amit Patel",
  BV: "Bhadresh Vallabh",
  NP: "Nikhil Panchal",
  BM: "Byron Minnie",
};

const DATA_DIR = path.join(process.cwd(), "public", "data");

async function readJSON<T>(rel: string): Promise<T | null> {
  try {
    const buf = await fs.readFile(path.join(DATA_DIR, rel), "utf-8");
    return JSON.parse(buf) as T;
  } catch {
    return null;
  }
}

export type Store = {
  customer_name: string;
  town?: string;
  accno: string;
  curef?: string;
  last_purchase_date?: string | null;
  last_purchase_amt?: number;
  last_purchase_prod?: string | null;
  total_12m?: number;
  d_current?: number;
  d30?: number;
  d60?: number;
  d90?: number;
  d_total?: number;
  health_tier?: string;
  velocity_category?: string;
};

export type InvoiceLine = {
  prodname: string;
  qty: number;
  unit_price: number;
  value: number;
};

export type Invoice = {
  invoice_no: string | null;
  date: string | null;
  lines: InvoiceLine[];
  total: number;
  count: number;
};

export type Recovery = {
  accno: string;
  store_name: string;
  score: number;
  tier: string;
  days_since_purchase: number;
};

export type TodaySnapshot = {
  rep: RepCode;
  rep_name: string;
  generated_at: string;
  date_label: string;
  date_iso: string;
  stores: Store[];
  competitor_forms_outstanding?: number;
};

export type WeekSnapshot = {
  rep: RepCode;
  rep_name: string;
  generated_at: string;
  week_label: string;
  total_stores: number;
  days: { date_iso: string; date_label: string; is_today: boolean; stores: Store[] }[];
  competitor_forms_outstanding?: number;
};

export type RecoverySnapshot = {
  rep: RepCode;
  rep_name: string;
  generated_at: string;
  accounts: Recovery[];
  competitor_forms_outstanding?: number;
};

export type StoreDetailSnapshot = {
  rep: RepCode;
  rep_name: string;
  generated_at: string;
  store: Store;
  invoice: Invoice;
  competitor_forms_outstanding?: number;
};

export const loadToday = (rep: RepCode) => readJSON<TodaySnapshot>(`${rep}/today.json`);
export const loadWeek = (rep: RepCode) => readJSON<WeekSnapshot>(`${rep}/week.json`);
export const loadRecovery = (rep: RepCode) => readJSON<RecoverySnapshot>(`${rep}/recovery.json`);
export const loadStoreDetail = (rep: RepCode, accno: string) =>
  readJSON<StoreDetailSnapshot>(`${rep}/store-${accno}.json`);

// ── Scorecard + daily (written by `python -m pulse publish-web`) ─────────────
export type ScorecardRepRow = {
  rep: RepCode;
  name: string;
  sales: number;
  pct_target: number;
  visits_actual: number;
  visits_planned: number;
  plan_adherence: number;
  leads: number;
  new_stores: number;
  ack_pct: number;
};

export type Scorecard = {
  period_label: string;
  summary: {
    team_mtd: number;
    team_pct_target: number;
    team_visits_actual: number;
    team_visits_planned: number;
    team_plan_adherence: number;
  };
  rep_rows: ScorecardRepRow[];
};

export type DailySnapshot = {
  rep: RepCode;
  rep_name: string;
  date_label: string;
  cycle_label: string;
  mtd_sales: number;
  mtd_target: number;
  rank: number;
  plan_adherence_mtd: number;
  yesterday_sales: number;
  yesterday_leads: number;
  yesterday_visited_stores: string[];
  yesterday_visits_total: number;
};

// `date` is an ISO date or the literal "latest".
export const loadScorecard = (date: string) =>
  readJSON<Scorecard>(date === "latest" ? "scorecard/latest.json" : `scorecard/${date}.json`);
export const loadDaily = (date: string, rep: RepCode) =>
  readJSON<DailySnapshot>(
    date === "latest" ? `daily/latest/${rep}.json` : `daily/${date}/${rep}.json`,
  );

export function fmtR(v: number | null | undefined): string {
  return "R " + Math.round(v ?? 0).toLocaleString("en-ZA").replace(/,/g, " ");
}

export function fmtPct(v: number | null | undefined): string {
  return `${Math.round((v ?? 0) * 100)}%`;
}
