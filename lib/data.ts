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

export function fmtR(v: number | null | undefined): string {
  return "R " + Math.round(v ?? 0).toLocaleString("en-ZA").replace(/,/g, " ");
}
