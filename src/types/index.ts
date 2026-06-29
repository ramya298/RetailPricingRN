export interface PricingRecord {
  id: string;
  storeId: string;
  sku: string;
  productName: string;
  price: number;
  currency: string;
  date: string;
  uploadedAt: string;
  updatedAt: string;
  uploadBatchId: string;
  status: 'active' | 'superseded' | 'deleted';
}

export interface UploadBatch {
  id: string;
  filename: string;
  uploadedAt: string;
  recordCount: number;
  errorCount: number;
  status: 'processing' | 'complete' | 'failed';
  uploadedBy: string;
}

export interface CSVRow {
  storeId: string;
  sku: string;
  productName: string;
  price: string;
  date: string;
  currency?: string;
}

export interface ParseError {
  row: number;
  field: string;
  message: string;
  value: string;
}

export interface ParseResult {
  records: PricingRecord[];
  errors: ParseError[];
  totalRows: number;
}

export interface SearchFilters {
  query: string;
  storeId: string;
  dateFrom: string;
  dateTo: string;
  priceMin: string;
  priceMax: string;
}

export const DEFAULT_FILTERS: SearchFilters = {
  query: '',
  storeId: '',
  dateFrom: '',
  dateTo: '',
  priceMin: '',
  priceMax: '',
};

export interface EditPayload {
  id: string;
  price: number;
  productName: string;
}

export interface AuditEntry {
  id: string;
  recordId: string;
  action: 'upload' | 'edit' | 'delete';
  before: Partial<PricingRecord>;
  after: Partial<PricingRecord>;
  performedBy: string;
  performedAt: string;
}

export type NotificationType = 'success' | 'error' | 'warning' | 'info';

export interface Notification {
  id: string;
  type: NotificationType;
  title: string;
  message?: string;
}
