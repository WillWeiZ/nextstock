import { NextApiRequest, NextApiResponse } from 'next'
import { stocksApi } from '../../lib/supabase'

interface StatsResponse {
  data: {
    totalCount: number;
    positiveCount: number;
    negativeCount: number;
    avgChangePct: number;
  } | null;
  error: string | null;
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<StatsResponse>
) {
  if (req.method !== 'GET') {
    return res.status(405).json({ data: null, error: '方法不被允许' })
  }

  try {
    const { date } = req.query
    const stats = await stocksApi.getStockStats(date as string)

    res.status(200).json({ data: stats, error: null })
  } catch (error) {
    console.error('统计API错误:', error)
    const errorMessage = error instanceof Error ? error.message : '获取统计信息时发生未知错误'
    res.status(500).json({ data: null, error: errorMessage })
  }
}