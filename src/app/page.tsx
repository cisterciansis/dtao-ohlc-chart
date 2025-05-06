'use client';

import { useState } from 'react';
import ChartForm from '@/components/ChartForm';
import OHLCChart from '@/components/OHLCChart';
import Notification from '@/components/Notification';
import { ChartFormData, CandleData } from '@/lib/types';
import { fetchOHLCData, dateToUnixTimestamp, getNextDayTimestamp } from '@/lib/api';

export default function Home() {
  const [chartData, setChartData] = useState<CandleData[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [notification, setNotification] = useState<{ type: 'success' | 'error' | 'info', message: string } | null>(null);

  const handleFormSubmit = async (formData: ChartFormData) => {
    try {
      setIsLoading(true);
      setNotification(null);

      // Convert form dates to Unix timestamps
      const fromTimestamp = dateToUnixTimestamp(formData.fromDate);
      // Get the timestamp for the start of the day after the user's selected end date
      // This ensures we include data for the full selected day
      const toTimestamp = getNextDayTimestamp(formData.toDate);

      // Fetch the data
      const data = await fetchOHLCData({
        symbol: formData.symbol,
        resolution: formData.resolution,
        from: fromTimestamp,
        to: toTimestamp,
      });

      setChartData(data);

      if (data.length === 0) {
        setNotification({
          type: 'info',
          message: 'No data available for the selected parameters.'
        });
      } else {
        setNotification({
          type: 'success',
          message: `Successfully loaded ${data.length} data points.`
        });
      }
    } catch (error) {
      console.error('Error fetching chart data:', error);
      setNotification({
        type: 'error',
        message: error instanceof Error ? error.message : 'Failed to load chart data.'
      });
      setChartData([]);
    } finally {
      setIsLoading(false);
    }
  };

  const clearNotification = () => {
    setNotification(null);
  };

  return (
    <div className="container mx-auto">
      <header className="mb-6">
        <h1 className="text-2xl font-bold mb-2">OHLC Chart</h1>
        <p className="text-gray-600">Select parameters and load candlestick chart data</p>
      </header>

      {notification && (
        <Notification
          type={notification.type}
          message={notification.message}
          onClose={clearNotification}
        />
      )}

      <ChartForm onSubmit={handleFormSubmit} isLoading={isLoading} />

      {isLoading ? (
        <div className="w-full border border-gray-200 rounded shadow-sm bg-white h-[500px] flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-2"></div>
            <p className="text-gray-600">Loading chart data...</p>
          </div>
        </div>
      ) : (
        <OHLCChart data={chartData} />
      )}
    </div>
  );
} 