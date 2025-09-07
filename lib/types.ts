// TypeScript 类型定义基于 Supabase stocks 表结构

export interface Stock {
  id: number;
  code: number;
  stock_name: string;
  latest_price: number | null;
  latest_change_pct: number | null;
  listing_board: string | null;
  auction_change_pct: number | null;
  pe_ttm: number | null;
  pe: number | null;
  dde_large_order: number | null;
  volume_ratio: number | null;
  interval_change_13d: number | null;
  interval_change_5d: number | null;
  listing_days: number | null;
  forecast_pe_1y: number | null;
  forecast_pe_2y: number | null;
  forecast_pe_3y: number | null;
  market_cap: number | null;
  eps: number | null;
  gross_margin: number | null;
  net_margin: number | null;
  auction_price: number | null;
  auction_type: string | null;
  auction_desc: string | null;
  auction_rating: string | null;
  auction_volume: number | null;
  auction_amount: number | null;
  market_code: number | null;
  update_date: string; // DATE as string in ISO format
  created_at: string; // TIMESTAMP as string in ISO format
  updated_at: string; // TIMESTAMP as string in ISO format
}

// 用于创建新股票记录的类型（排除自动生成的字段）
export type StockInsert = Omit<Stock, 'id' | 'created_at' | 'updated_at'>;

// 用于更新股票记录的类型（所有字段都可选）
export type StockUpdate = Partial<StockInsert>;

// API 响应类型
export interface StocksResponse {
  data: Stock[] | null;
  error: string | null;
}

// 用于表格显示的简化股票类型
export interface StockTableData {
  id: number;
  code: number;
  stock_name: string;
  latest_price: number | null;
  latest_change_pct: number | null;
  pe_ttm: number | null;
  update_date: string;
}

// 筛选和排序选项
export interface StockFilters {
  dateRange?: {
    start: string;
    end: string;
  };
  minPrice?: number;
  maxPrice?: number;
  minChangePct?: number;
  maxChangePct?: number;
}

export interface StockSortOptions {
  field: keyof Stock;
  direction: 'asc' | 'desc';
}

// Supabase 错误类型
export interface SupabaseError {
  message: string;
  details: string;
  hint: string;
  code: string;
}