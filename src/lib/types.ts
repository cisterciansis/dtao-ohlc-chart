// API response type
export interface OHLCApiResponse {
  s: string; // Status indicator ('ok' for success)
  t: number[]; // Array of timestamps (seconds)
  o: number[]; // Array of open prices
  h: number[]; // Array of high prices
  l: number[]; // Array of low prices
  c: number[]; // Array of close prices
  nextTime?: number; // Optional next time
}

// Structured data for chart
export interface CandleData {
  time: number; // Time in milliseconds
  open: number;
  high: number;
  low: number;
  close: number;
}

// API request parameters
export interface OHLCQueryParams {
  symbol: string;
  resolution: string;
  from: number;
  to: number;
}

// Form data
export interface ChartFormData {
  symbol: string;
  resolution: string;
  fromDate: Date;
  toDate: Date;
} 