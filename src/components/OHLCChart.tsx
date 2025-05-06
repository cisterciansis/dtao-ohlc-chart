import { useEffect, useRef } from 'react';
import { createChart, ColorType, CandlestickSeries } from 'lightweight-charts';
import { CandleData } from '@/lib/types';

interface OHLCChartProps {
  data: CandleData[];
  height?: number;
}

const OHLCChart = ({ data, height = 500 }: OHLCChartProps) => {
  const chartContainerRef = useRef<HTMLDivElement>(null);
  const chartRef = useRef<any>(null);

  useEffect(() => {
    // Clean up previous chart if it exists
    if (chartRef.current) {
      try {
        chartRef.current.remove();
      } catch (error) {
        // Chart might already be disposed, ignore the error
        console.log('Chart already disposed');
      }
      chartRef.current = null;
    }

    if (chartContainerRef.current && data.length > 0) {
      // Create a new chart
      const chart = createChart(chartContainerRef.current, {
        height: height,
        width: chartContainerRef.current.clientWidth,
        layout: {
          background: { type: ColorType.Solid, color: '#ffffff' },
          textColor: '#333',
        },
        grid: {
          vertLines: { color: '#f0f0f0' },
          horzLines: { color: '#f0f0f0' },
        },
        timeScale: {
          timeVisible: true,
          secondsVisible: false,
          borderColor: '#d1d1d1',
        },
        rightPriceScale: {
          borderColor: '#d1d1d1',
        },
      });

      // Add a candlestick series to the chart with the correct API for v5
      const candlestickSeries = chart.addSeries(CandlestickSeries, {
        upColor: '#26a69a',
        downColor: '#ef5350',
        borderVisible: false,
        wickUpColor: '#26a69a',
        wickDownColor: '#ef5350',
      });

      // Convert our data format to match the library's expected format
      const chartData = data.map(candle => ({
        // Convert to Unix timestamp in seconds and use as a proper time value
        time: candle.time / 1000 as unknown as any,
        open: candle.open,
        high: candle.high,
        low: candle.low,
        close: candle.close,
      }));

      // Set the data
      candlestickSeries.setData(chartData);

      // Fit the chart to data
      chart.timeScale().fitContent();

      // Handle window resize
      const handleResize = () => {
        if (chartContainerRef.current) {
          chart.applyOptions({ width: chartContainerRef.current.clientWidth });
        }
      };

      window.addEventListener('resize', handleResize);

      // Save the chart reference for cleanup
      chartRef.current = chart;

      return () => {
        window.removeEventListener('resize', handleResize);
        try {
          chart.remove();
        } catch (error) {
          // Chart might already be disposed, ignore the error
          console.log('Chart already disposed during cleanup');
        }
      };
    }
  }, [data, height]);

  return (
    <div className="w-full border border-gray-200 rounded shadow-sm bg-white">
      {data.length === 0 ? (
        <div className="flex items-center justify-center h-[500px] text-gray-500">
          No data available. Please load chart data.
        </div>
      ) : (
        <div ref={chartContainerRef} className="w-full" />
      )}
    </div>
  );
};

export default OHLCChart; 