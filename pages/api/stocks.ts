import { NextApiRequest, NextApiResponse } from 'next'
import { stocksApi } from '../../lib/supabase'
import { StocksResponse } from '../../lib/types'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<StocksResponse>
) {
  if (req.method !== 'GET') {
    return res.status(405).json({ data: null, error: '方法不被允许' })
  }

  try {
    const { date, limit } = req.query
    let stocks

    if (date && typeof date === 'string') {
      // 按日期获取股票数据
      stocks = await stocksApi.getStocksByDate(date)
    } else {
      // 获取最新股票数据
      const limitNum = limit ? parseInt(limit as string, 10) : 100
      stocks = await stocksApi.getLatestStocks()
    }

    res.status(200).json({ data: stocks, error: null })
  } catch (error) {
    console.error('API 错误:', error)
    const errorMessage = error instanceof Error ? error.message : '获取股票数据时发生未知错误'
    res.status(500).json({ data: null, error: errorMessage })
  }
}