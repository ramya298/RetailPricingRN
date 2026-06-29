import * as DocumentPicker from "expo-document-picker";
import Papa from "papaparse";
import type { CSVRow } from "../types";
import { File } from "expo-file-system/next";

export interface CSVPickResult {
  rows: CSVRow[];
  filename: string;
  headerErrors: string[];
  parseErrors: Papa.ParseError[];
}

const REQUIRED_HEADERS = ["storeId", "sku", "productName", "price", "date"];
const HEADER_ALIASES: Record<string, string> = {
  storeid: "storeId",
  store_id: "storeId",
  sku: "sku",
  productname: "productName",
  product_name: "productName",
  price: "price",
  date: "date",
  currency: "currency",
};

function normalizeHeader(header: string): string {
  const normalized = header.trim().toLowerCase().replace(/\s+/g, "_");
  return HEADER_ALIASES[normalized] ?? normalized;
}

export async function pickAndParseCSV(): Promise<CSVPickResult | null> {
  // 1. Open native file picker
  const result = await DocumentPicker.getDocumentAsync({
    // Include */* as fallback — iOS sometimes doesn't surface csv MIME
    type: ["text/csv", "text/comma-separated-values", "application/csv", "*/*"],
    copyToCacheDirectory: true,
    multiple: false,
  });

  if (result.canceled) return null;

  const asset = result.assets[0];
  const filename = asset.name;

  // 2. Guard: only .csv files
  if (!filename.toLowerCase().endsWith(".csv")) {
    throw new Error("Please select a .csv file.");
  }

  // 3. Guard: max 50 MB
  if (asset.size && asset.size > 50 * 1024 * 1024) {
    throw new Error("File exceeds 50 MB limit. Please split and retry.");
  }

  // 4. Read URI → string  (key mobile difference vs web FileReader)
  const file = new File(asset.uri);
  const csvString = await file.text();

  // 5. Parse with PapaParse — same config as web, but feeding a string not a File
  const parsed = Papa.parse<CSVRow>(csvString, {
    header: true,
    skipEmptyLines: true,
    transformHeader: normalizeHeader,
  });

  // 6. Check required headers
  const headers = Object.keys(parsed.data[0] ?? {});
  const headerErrors = REQUIRED_HEADERS.filter((h) => !headers.includes(h)).map(
    (h) => `Missing required column: "${h}"`,
  );

  return {
    rows: parsed.data,
    filename,
    headerErrors,
    parseErrors: parsed.errors,
  };
}

