import React from 'react'
import { Stock } from '../lib/types'

interface StockTableProps {
  stocks: Stock[]
  loading?: boolean
}

const StockTable: React.FC<StockTableProps> = ({ stocks, loading = false }) => {
  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        <span className="ml-3 text-gray-600">数据加载中...</span>
      </div>
    )
  }

  if (!stocks || stocks.length === 0) {
    return (
      <div className="text-center py-12 text-gray-500">
        <p>暂无股票数据</p>
      </div>
    )
  }

  const formatNumber = (num: number | null, decimals = 2): string => {
    if (num === null || num === undefined) return '-'
    return num.toFixed(decimals)
  }

  const formatPercent = (num: number | null): string => {
    if (num === null || num === undefined) return '-'
    return `${num.toFixed(2)}%`
  }

  const getChangeClass = (changePct: number | null): string => {
    if (!changePct) return 'text-gray-500'
    return changePct > 0 ? 'stock-positive' : changePct < 0 ? 'stock-negative' : 'stock-neutral'
  }

  const formatDate = (dateString: string): string => {
    try {
      return new Date(dateString).toLocaleDateString('zh-CN')
    } catch {
      return dateString
    }
  }

  return (
    <div className="overflow-x-auto shadow-lg rounded-lg">
      <table className="stock-table">
        <thead>
          <tr>
            <th className="text-left">股票代码</th>
            <th className="text-left">股票名称</th>
            <th className="text-right">最新价</th>
            <th className="text-right">涨跌幅</th>
            <th className="text-right">竞价涨幅</th>
            <th className="text-right">市盈率TTM</th>
            <th className="text-right">主力净量</th>
            <th className="text-right">量比</th>
            <th className="text-center">更新日期</th>
          </tr>
        </thead>
        <tbody>
          {stocks.map((stock) => (
            <tr key={stock.id} className="hover:bg-gray-50">
              <td className="font-mono text-blue-600 font-semibold">
                {String(stock.code).padStart(6, '0')}
              </td>
              <td className="font-medium text-gray-900">
                {stock.stock_name}
              </td>
              <td className="text-right font-mono">
                ¥{formatNumber(stock.latest_price)}
              </td>
              <td className={`text-right font-mono font-semibold ${getChangeClass(stock.latest_change_pct)}`}>
                {formatPercent(stock.latest_change_pct)}
              </td>
              <td className={`text-right font-mono ${getChangeClass(stock.auction_change_pct)}`}>
                {formatPercent(stock.auction_change_pct)}
              </td>
              <td className="text-right font-mono">
                {formatNumber(stock.pe_ttm)}
              </td>
              <td className="text-right font-mono">
                {formatNumber(stock.dde_large_order, 0)}
              </td>
              <td className="text-right font-mono">
                {formatNumber(stock.volume_ratio)}
              </td>
              <td className="text-center text-sm text-gray-500">
                {formatDate(stock.update_date)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default StockTable