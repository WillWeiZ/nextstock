import React, { useState, useEffect } from 'react'
import Head from 'next/head'
import StockTable from '@/components/StockTable'
import StatsCard from '@/components/StatsCard'
import { Stock } from '@/lib/types'

interface StockStats {
  totalCount: number
  positiveCount: number
  negativeCount: number
  avgChangePct: number
}

const Dashboard: React.FC = () => {
  const [stocks, setStocks] = useState<Stock[]>([])
  const [stats, setStats] = useState<StockStats | null>(null)
  const [availableDates, setAvailableDates] = useState<string[]>([])
  const [selectedDate, setSelectedDate] = useState<string>('')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // 获取可用日期
  const fetchAvailableDates = async () => {
    try {
      const response = await fetch('/api/dates')
      const result = await response.json()
      
      if (result.error) {
        throw new Error(result.error)
      }
      
      setAvailableDates(result.data || [])
      // 设置默认选择最新日期
      if (result.data && result.data.length > 0) {
        setSelectedDate(result.data[0])
      }
    } catch (err) {
      console.error('获取日期失败:', err)
      setError(err instanceof Error ? err.message : '获取日期失败')
    }
  }

  // 获取股票数据
  const fetchStocks = async (date?: string) => {
    try {
      setLoading(true)
      const url = date ? `/api/stocks?date=${date}` : '/api/stocks'
      const response = await fetch(url)
      const result = await response.json()
      
      if (result.error) {
        throw new Error(result.error)
      }
      
      setStocks(result.data || [])
    } catch (err) {
      console.error('获取股票数据失败:', err)
      setError(err instanceof Error ? err.message : '获取股票数据失败')
    } finally {
      setLoading(false)
    }
  }

  // 获取统计信息
  const fetchStats = async (date?: string) => {
    try {
      const url = date ? `/api/stats?date=${date}` : '/api/stats'
      const response = await fetch(url)
      const result = await response.json()
      
      if (result.error) {
        throw new Error(result.error)
      }
      
      setStats(result.data)
    } catch (err) {
      console.error('获取统计信息失败:', err)
    }
  }

  // 处理日期选择变化
  const handleDateChange = (date: string) => {
    setSelectedDate(date)
    fetchStocks(date)
    fetchStats(date)
  }

  // 初始化数据
  useEffect(() => {
    const initializeData = async () => {
      await fetchAvailableDates()
    }
    initializeData()
  }, [])

  // 当选择的日期改变时，获取对应数据
  useEffect(() => {
    if (selectedDate) {
      fetchStocks(selectedDate)
      fetchStats(selectedDate)
    }
  }, [selectedDate])

  if (error) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="bg-red-50 border border-red-200 rounded-md p-4">
          <div className="flex">
            <div className="ml-3">
              <h3 className="text-sm font-medium text-red-800">
                数据加载错误
              </h3>
              <div className="mt-2 text-sm text-red-700">
                <p>{error}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <>
      <Head>
        <title>股票数据面板</title>
        <meta name="description" content="实时股票数据展示面板" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div className="min-h-screen bg-gray-100">
        <div className="container mx-auto px-4 py-8">
          {/* 页面标题和日期选择 */}
          <div className="mb-8">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
              <div className="mb-4 sm:mb-0">
                <h1 className="text-3xl font-bold text-gray-900">股票数据面板</h1>
                <p className="text-gray-600 mt-1">实时股票数据展示与分析</p>
              </div>
              
              {availableDates.length > 0 && (
                <div className="flex items-center space-x-2">
                  <label htmlFor="date-select" className="text-sm font-medium text-gray-700">
                    选择日期:
                  </label>
                  <select
                    id="date-select"
                    value={selectedDate}
                    onChange={(e) => handleDateChange(e.target.value)}
                    className="block px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  >
                    {availableDates.map((date) => (
                      <option key={date} value={date}>
                        {new Date(date).toLocaleDateString('zh-CN', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric',
                          weekday: 'short'
                        })}
                      </option>
                    ))}
                  </select>
                </div>
              )}
            </div>
          </div>

          {/* 统计卡片 */}
          {stats && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <StatsCard
                title="股票总数"
                value={stats.totalCount}
                subtitle="符合条件的股票"
                colorClass="text-blue-600"
              />
              <StatsCard
                title="上涨股票"
                value={stats.positiveCount}
                subtitle={`占比 ${((stats.positiveCount / stats.totalCount) * 100).toFixed(1)}%`}
                colorClass="text-green-600"
              />
              <StatsCard
                title="下跌股票"
                value={stats.negativeCount}
                subtitle={`占比 ${((stats.negativeCount / stats.totalCount) * 100).toFixed(1)}%`}
                colorClass="text-red-600"
              />
              <StatsCard
                title="平均涨跌幅"
                value={`${stats.avgChangePct}%`}
                subtitle="当日平均表现"
                colorClass={stats.avgChangePct > 0 ? "text-green-600" : stats.avgChangePct < 0 ? "text-red-600" : "text-gray-600"}
              />
            </div>
          )}

          {/* 股票数据表格 */}
          <div className="bg-white rounded-lg shadow">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-lg font-medium text-gray-900">
                股票数据
                {selectedDate && (
                  <span className="text-sm text-gray-500 ml-2">
                    ({new Date(selectedDate).toLocaleDateString('zh-CN')})
                  </span>
                )}
              </h2>
            </div>
            <div className="p-6">
              <StockTable stocks={stocks} loading={loading} />
            </div>
          </div>

          {/* 页脚 */}
          <div className="mt-8 text-center text-gray-500 text-sm">
            <p>数据来源：同花顺 | 自动更新于工作日上午</p>
          </div>
        </div>
      </div>
    </>
  )
}

export default Dashboard