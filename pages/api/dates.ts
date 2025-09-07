import { NextApiRequest, NextApiResponse } from 'next'
import { stocksApi } from '../../lib/supabase'

interface DatesResponse {
  data: string[] | null;
  error: string | null;
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<DatesResponse>
) {
  if (req.method !== 'GET') {
    return res.status(405).json({ data: null, error: '方法不被允许' })
  }

  try {
    const dates = await stocksApi.getAvailableDates()
    res.status(200).json({ data: dates, error: null })
  } catch (error) {
    console.error('获取日期API错误:', error)
    const errorMessage = error instanceof Error ? error.message : '获取日期列表时发生未知错误'
    res.status(500).json({ data: null, error: errorMessage })
  }
}