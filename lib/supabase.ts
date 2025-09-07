import { createClient } from '@supabase/supabase-js'
import type { Stock } from './types'

// Supabase 配置
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

if (!supabaseUrl || !supabaseKey) {
  throw new Error('缺少 Supabase 环境变量')
}

// 创建 Supabase 客户端
export const supabase = createClient(supabaseUrl, supabaseKey)

// 数据库操作函数
export const stocksApi = {
  // 获取所有股票数据
  async getStocks(limit = 100): Promise<Stock[]> {
    const { data, error } = await supabase
      .from('stocks')
      .select('*')
      .order('update_date', { ascending: false })
      .order('latest_change_pct', { ascending: false })
      .limit(limit)

    if (error) {
      console.error('获取股票数据失败:', error)
      throw new Error(`获取股票数据失败: ${error.message}`)
    }

    return data || []
  },

  // 按日期获取股票数据
  async getStocksByDate(date: string): Promise<Stock[]> {
    const { data, error } = await supabase
      .from('stocks')
      .select('*')
      .eq('update_date', date)
      .order('latest_change_pct', { ascending: false })

    if (error) {
      console.error('按日期获取股票数据失败:', error)
      throw new Error(`按日期获取股票数据失败: ${error.message}`)
    }

    return data || []
  },

  // 获取最新日期的股票数据
  async getLatestStocks(): Promise<Stock[]> {
    const { data, error } = await supabase
      .from('stocks')
      .select('*')
      .order('update_date', { ascending: false })
      .order('latest_change_pct', { ascending: false })
      .limit(100)

    if (error) {
      console.error('获取最新股票数据失败:', error)
      throw new Error(`获取最新股票数据失败: ${error.message}`)
    }

    return data || []
  },

  // 获取可用的日期列表
  async getAvailableDates(): Promise<string[]> {
    const { data, error } = await supabase
      .from('stocks')
      .select('update_date')
      .order('update_date', { ascending: false })

    if (error) {
      console.error('获取日期列表失败:', error)
      throw new Error(`获取日期列表失败: ${error.message}`)
    }

    // 去重并返回日期数组
    const uniqueDates = new Set(data?.map(item => item.update_date) || [])
    const dates = Array.from(uniqueDates)
    return dates
  },

  // 获取统计信息
  async getStockStats(date?: string) {
    let query = supabase
      .from('stocks')
      .select('latest_change_pct, latest_price')

    if (date) {
      query = query.eq('update_date', date)
    } else {
      // 获取最新日期的数据
      const { data: latestData } = await supabase
        .from('stocks')
        .select('update_date')
        .order('update_date', { ascending: false })
        .limit(1)

      if (latestData && latestData.length > 0) {
        query = query.eq('update_date', latestData[0].update_date)
      }
    }

    const { data, error } = await query

    if (error) {
      console.error('获取统计信息失败:', error)
      throw new Error(`获取统计信息失败: ${error.message}`)
    }

    const stocks = data || []
    const totalCount = stocks.length
    const positiveCount = stocks.filter(s => (s.latest_change_pct || 0) > 0).length
    const negativeCount = stocks.filter(s => (s.latest_change_pct || 0) < 0).length
    const avgChangePct = stocks.reduce((sum, s) => sum + (s.latest_change_pct || 0), 0) / totalCount || 0

    return {
      totalCount,
      positiveCount,
      negativeCount,
      avgChangePct: Number(avgChangePct.toFixed(2))
    }
  }
}
