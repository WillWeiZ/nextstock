// Global type aliases to avoid import friction in components/pages
// This file is included by tsconfig.json ("include" -> lib/stock-types.d.ts)

import type {
  Stock as _Stock,
  StockInsert as _StockInsert,
  StockUpdate as _StockUpdate,
  StocksResponse as _StocksResponse,
} from './types'

declare global {
  // Prefer explicit imports, but these globals ensure legacy references compile
  type Stock = _Stock
  type StockInsert = _StockInsert
  type StockUpdate = _StockUpdate
  type StocksResponse = _StocksResponse
}

export {}

