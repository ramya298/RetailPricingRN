/**
 * Data service for React Native.
 * Replaces localStorage with AsyncStorage — same async API contract,
 * so all screens work identically to the web version.
 */

import AsyncStorage from "@react-native-async-storage/async-storage";
import { v4 as uuid } from "./uuid";
import type {
  PricingRecord,
  UploadBatch,
  SearchFilters,
  EditPayload,
  AuditEntry,
  ParseResult,
  CSVRow,
  ParseError,
} from "../types";

const RECORDS_KEY = "pricing_records";
const BATCHES_KEY = "upload_batches";
const AUDIT_KEY = "audit_log";
const CURRENT_USER = "user1@retailchain.com";

// ─── Persistence helpers ──────────────────────────────────────────────────────

async function load<T>(key: string, fallback: T[]): Promise<T[]> {
  try {
    const raw = await AsyncStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
}

async function save<T>(key: string, data: T[]): Promise<void> {
  try {
    await AsyncStorage.setItem(key, JSON.stringify(data));
  } catch (e) {
    console.warn("AsyncStorage save failed:", e);
  }
}

export async function resetData(): Promise<void> {
  try {
    await AsyncStorage.multiRemove([RECORDS_KEY, BATCHES_KEY, AUDIT_KEY]);
  } catch (e) {
    console.warn("AsyncStorage reset failed:", e);
  }
}

// ─── Seed data ────────────────────────────────────────────────────────────────

export async function seedIfEmpty(): Promise<void> {
  const existing = await load<PricingRecord>(RECORDS_KEY, []);
  if (existing.length > 0) return;

  const now = new Date().toISOString();
  const batchId = uuid();
  const stores = ["NYC-001", "LAX-002", "CHI-003"];
  const products = [
    { sku: "SKU-1001", name: "Organic Whole Milk 1L" },
    { sku: "SKU-1002", name: "Sourdough Bread 800g" },
    { sku: "SKU-1003", name: "Free-Range Eggs x12" },
  ];

  const records: PricingRecord[] = [];
  stores.forEach((storeId) => {
    products.forEach((p) => {
      const basePrice = 2.5 + Math.random() * 50;
      records.push({
        id: uuid(),
        storeId,
        sku: p.sku,
        productName: p.name,
        price: Math.round(basePrice * 100) / 100,
        currency: "USD",
        date: "2024-06-01",
        uploadedAt: now,
        updatedAt: now,
        uploadBatchId: batchId,
        status: "active",
      });
    });
  });

  await save(RECORDS_KEY, records);
  await save(BATCHES_KEY, [
    {
      id: batchId,
      filename: "seed_data_2024_06_01.csv",
      uploadedAt: now,
      recordCount: records.length,
      errorCount: 0,
      status: "complete" as const,
      uploadedBy: CURRENT_USER,
    },
  ]);
  await save(AUDIT_KEY, []);
}

// ─── Validation ───────────────────────────────────────────────────────────────

function validateCSVRow(row: CSVRow, rowIndex: number): ParseError[] {
  const errors: ParseError[] = [];
  if (!row.storeId?.trim())
    errors.push({
      row: rowIndex,
      field: "storeId",
      message: "Store ID required",
      value: row.storeId ?? "",
    });
  if (!row.sku?.trim())
    errors.push({
      row: rowIndex,
      field: "sku",
      message: "SKU required",
      value: row.sku ?? "",
    });
  if (!row.productName?.trim())
    errors.push({
      row: rowIndex,
      field: "productName",
      message: "Product name required",
      value: row.productName ?? "",
    });
  const price = parseFloat(row.price);
  if (isNaN(price) || price < 0)
    errors.push({
      row: rowIndex,
      field: "price",
      message: "Must be a non-negative number",
      value: row.price ?? "",
    });
  if (!row.date?.trim())
    errors.push({
      row: rowIndex,
      field: "date",
      message: "Date required",
      value: row.date ?? "",
    });
  else if (!/^\d{4}-\d{2}-\d{2}$/.test(row.date.trim()))
    errors.push({
      row: rowIndex,
      field: "date",
      message: "Must be YYYY-MM-DD",
      value: row.date,
    });
  return errors;
}

// ─── Public API ───────────────────────────────────────────────────────────────

export async function ingestCSV(
  rows: CSVRow[],
  filename: string,
): Promise<ParseResult> {
  const records: PricingRecord[] = [];
  const errors: ParseError[] = [];
  const now = new Date().toISOString();
  const batchId = uuid();

  rows.forEach((row, i) => {
    const rowErrors = validateCSVRow(row, i + 2);
    if (rowErrors.length) {
      errors.push(...rowErrors);
    } else {
      records.push({
        id: uuid(),
        storeId: row.storeId.trim(),
        sku: row.sku.trim().toUpperCase(),
        productName: row.productName.trim(),
        price: Math.round(parseFloat(row.price) * 100) / 100,
        currency: row.currency?.trim() || "USD",
        date: row.date.trim(),
        uploadedAt: now,
        updatedAt: now,
        uploadBatchId: batchId,
        status: "active",
      });
    }
  });

  if (records.length > 0) {
    const existing = await load<PricingRecord>(RECORDS_KEY, []);
    await save(RECORDS_KEY, [...existing, ...records]);

    const batches = await load<UploadBatch>(BATCHES_KEY, []);
    batches.unshift({
      id: batchId,
      filename,
      uploadedAt: now,
      recordCount: records.length,
      errorCount: errors.length,
      status: "complete",
      uploadedBy: CURRENT_USER,
    });
    await save(BATCHES_KEY, batches);
    await appendAudit({
      id: uuid(),
      recordId: batchId,
      action: "upload",
      before: {},
      after: { uploadBatchId: batchId } as Partial<PricingRecord>,
      performedBy: CURRENT_USER,
      performedAt: now,
    });
  }

  return { records, errors, totalRows: rows.length };
}

export async function searchRecords(
  filters: SearchFilters,
  page: number,
  pageSize: number,
): Promise<{ records: PricingRecord[]; total: number }> {
  let all = (await load<PricingRecord>(RECORDS_KEY, [])).filter(
    (r) => r.status === "active",
  );

  if (filters.query) {
    const q = filters.query.toLowerCase();
    all = all.filter(
      (r) =>
        r.sku.toLowerCase().includes(q) ||
        r.productName.toLowerCase().includes(q) ||
        r.storeId.toLowerCase().includes(q),
    );
  }
  if (filters.storeId) all = all.filter((r) => r.storeId === filters.storeId);
  if (filters.dateFrom) all = all.filter((r) => r.date >= filters.dateFrom);
  if (filters.dateTo) all = all.filter((r) => r.date <= filters.dateTo);
  if (filters.priceMin)
    all = all.filter((r) => r.price >= parseFloat(filters.priceMin));
  if (filters.priceMax)
    all = all.filter((r) => r.price <= parseFloat(filters.priceMax));

  const total = all.length;
  const start = (page - 1) * pageSize;
  return { records: all.slice(start, start + pageSize), total };
}

export async function updateRecord(
  payload: EditPayload,
): Promise<PricingRecord> {
  const all = await load<PricingRecord>(RECORDS_KEY, []);
  const idx = all.findIndex((r) => r.id === payload.id);
  if (idx === -1) throw new Error("Record not found");
  const before = { ...all[idx] };
  all[idx] = {
    ...all[idx],
    price: payload.price,
    productName: payload.productName,
    updatedAt: new Date().toISOString(),
  };
  await save(RECORDS_KEY, all);
  await appendAudit({
    id: uuid(),
    recordId: payload.id,
    action: "edit",
    before,
    after: all[idx],
    performedBy: CURRENT_USER,
    performedAt: new Date().toISOString(),
  });
  return all[idx];
}

export async function deleteRecord(id: string): Promise<void> {
  const all = await load<PricingRecord>(RECORDS_KEY, []);
  const idx = all.findIndex((r) => r.id === id);
  if (idx === -1) throw new Error("Record not found");
  const before = { ...all[idx] };
  all[idx] = {
    ...all[idx],
    status: "deleted",
    updatedAt: new Date().toISOString(),
  };
  await save(RECORDS_KEY, all);
  await appendAudit({
    id: uuid(),
    recordId: id,
    action: "delete",
    before,
    after: all[idx],
    performedBy: CURRENT_USER,
    performedAt: new Date().toISOString(),
  });
}

export async function getUploadBatches(): Promise<UploadBatch[]> {
  return load<UploadBatch>(BATCHES_KEY, []);
}

export async function getUniqueStoreIds(): Promise<string[]> {
  const records = await load<PricingRecord>(RECORDS_KEY, []);
  return [...new Set(records.map((r) => r.storeId))].sort();
}

async function appendAudit(entry: AuditEntry) {
  const log = await load<AuditEntry>(AUDIT_KEY, []);
  log.push(entry);
  await save(AUDIT_KEY, log.slice(-5000));
}
