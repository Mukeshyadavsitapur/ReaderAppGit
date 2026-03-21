// This is the client service used to connect to the new Rust backend.
// As the application's performance critical tasks are migrated to Rust,
// new API endpoints should be added here.

import { Platform } from 'react-native';

// For Android emulator, localhost is 10.0.2.2.
// For iOS simulator and web, localhost is 127.0.0.1.
// Use your machine's local IP if testing on a physical device.
const getBaseUrl = () => {
  if (Platform.OS === 'android') {
    return 'http://10.0.2.2:3030';
  }
  return 'http://127.0.0.1:3030';
};

const BASE_URL = getBaseUrl();

export interface HealthCheckResponse {
  status: string;
  message: string;
}

export interface PerformanceData {
  cpu_usage: number;
  memory_usage: number;
  active_connections: number;
}

/**
 * Checks if the Rust backend is currently reachable.
 */
export const checkBackendHealth = async (): Promise<HealthCheckResponse> => {
  try {
    const response = await fetch(`${BASE_URL}/api/health`);
    if (!response.ok) {
      throw new Error(`HTTP Error! status: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error('Failed to connect to Rust backend:', error);
    throw error;
  }
};

/**
 * Fetches sample performance data from the Rust backend.
 */
export const fetchPerformanceData = async (): Promise<PerformanceData> => {
  try {
    const response = await fetch(`${BASE_URL}/api/performance`);
    if (!response.ok) {
      throw new Error(`HTTP Error! status: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error('Failed to fetch performance data:', error);
    throw error;
  }
};

export interface TextProcessingRequest {
  text: string;
}

export interface TextProcessingResponse {
  word_count: number;
  char_count: number;
  estimated_reading_time_seconds: number;
  processed_status: string;
}

/**
 * Offloads heavy text processing to the Rust API.
 */
export const processTextData = async (payload: TextProcessingRequest): Promise<TextProcessingResponse> => {
  try {
    const response = await fetch(`${BASE_URL}/api/process-text`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    if (!response.ok) {
      throw new Error(`HTTP Error! status: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error('Failed to process text on Rust backend:', error);
    throw error;
  }
};
