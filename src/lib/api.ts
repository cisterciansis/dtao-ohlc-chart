import { OHLCApiResponse, OHLCQueryParams, CandleData } from './types';

const API_BASE_URL = 'https://api.app.trustedstake.ai';

// Convert a Date object to Unix timestamp in seconds
export const dateToUnixTimestamp = (date: Date): number => {
  return Math.floor(date.getTime() / 1000);
};

// Get the timestamp for the start of the next day
export const getNextDayTimestamp = (date: Date): number => {
  const nextDay = new Date(date);
  nextDay.setDate(nextDay.getDate() + 1);
  nextDay.setHours(0, 0, 0, 0);
  return dateToUnixTimestamp(nextDay);
};

// Transform API response data to chart-compatible format
export const transformApiResponse = (data: OHLCApiResponse): CandleData[] => {
  if (data.s !== 'ok' || !data.t || data.t.length === 0) {
    return [];
  }

  return data.t.map((timestamp, index) => ({
    time: timestamp * 1000, // Convert to milliseconds for JavaScript Date
    open: data.o[index],
    high: data.h[index],
    low: data.l[index],
    close: data.c[index],
  }));
};

// Fetch OHLC data from the API
export const fetchOHLCData = async (params: OHLCQueryParams): Promise<CandleData[]> => {
  try {
    const queryParams = new URLSearchParams({
      symbol: params.symbol,
      resolution: params.resolution,
      from: params.from.toString(),
      to: params.to.toString(),
    });

    const response = await fetch(`${API_BASE_URL}/udf/history?${queryParams.toString()}`);
    
    if (!response.ok) {
      throw new Error(`API request failed with status: ${response.status}`);
    }

    const data: OHLCApiResponse = await response.json();
    
    if (data.s !== 'ok') {
      throw new Error(`API returned error status: ${data.s}`);
    }

    return transformApiResponse(data);
  } catch (error) {
    console.error('Error fetching OHLC data:', error);
    throw error;
  }
}; 