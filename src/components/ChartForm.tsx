import { useState, FormEvent, useRef, useEffect } from 'react';
import { ChartFormData } from '@/lib/types';

interface ChartFormProps {
  onSubmit: (data: ChartFormData) => void;
  isLoading: boolean;
}

const ChartForm = ({ onSubmit, isLoading }: ChartFormProps) => {
  const [symbol, setSymbol] = useState<string>('SUB-32');
  const [netuidValue, setNetuidValue] = useState<string>('32');
  const [resolution, setResolution] = useState<string>('1day');
  const [fromDate, setFromDate] = useState<string>(
    new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
  );
  const [toDate, setToDate] = useState<string>(
    new Date().toISOString().split('T')[0]
  );

  // Update symbol when netuidValue changes
  useEffect(() => {
    setSymbol(`SUB-${netuidValue}`);
  }, [netuidValue]);

  const handleNetuidChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    // Only allow integers
    if (value === '' || /^\d+$/.test(value)) {
      setNetuidValue(value);
    }
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    
    // Convert string dates to Date objects
    const formData: ChartFormData = {
      symbol,
      resolution,
      fromDate: new Date(fromDate),
      toDate: new Date(toDate),
    };
    
    onSubmit(formData);
  };

  return (
    <div className="w-full mb-8 bg-white p-4 rounded border border-gray-200 shadow-sm">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Symbol Input */}
          <div>
            <label htmlFor="symbol" className="block text-sm font-medium text-gray-700 mb-1">
              SUB NETUID
            </label>
            <div className="relative flex items-center">
              <div className="absolute left-0 pl-3 text-gray-500 pointer-events-none">
                SUB-
              </div>
              <input
                id="netuid"
                type="text"
                value={netuidValue}
                onChange={handleNetuidChange}
                className="w-full pl-12 px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
                placeholder="Enter NETUID"
              />
            </div>
          </div>

          {/* Resolution Select */}
          <div>
            <label htmlFor="resolution" className="block text-sm font-medium text-gray-700 mb-1">
              Resolution
            </label>
            <select
              id="resolution"
              value={resolution}
              onChange={(e) => setResolution(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="1min">1 Minute</option>
              <option value="5min">5 Minutes</option>
              <option value="15min">15 Minutes</option>
              <option value="60min">1 Hour</option>
              <option value="1day">1 Day</option>
            </select>
          </div>

          {/* From Date Input */}
          <div>
            <label htmlFor="fromDate" className="block text-sm font-medium text-gray-700 mb-1">
              From Date
            </label>
            <input
              id="fromDate"
              type="date"
              value={fromDate}
              onChange={(e) => setFromDate(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          {/* To Date Input */}
          <div>
            <label htmlFor="toDate" className="block text-sm font-medium text-gray-700 mb-1">
              To Date
            </label>
            <input
              id="toDate"
              type="date"
              value={toDate}
              min={fromDate}
              onChange={(e) => setToDate(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
        </div>

        {/* Submit Button */}
        <div className="flex justify-end">
          <button
            type="submit"
            disabled={isLoading}
            className={`px-4 py-2 rounded font-medium ${
              isLoading
                ? 'bg-gray-400 cursor-not-allowed'
                : 'bg-blue-600 hover:bg-blue-700 text-white'
            }`}
          >
            {isLoading ? 'Loading...' : 'Load Chart'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default ChartForm; 