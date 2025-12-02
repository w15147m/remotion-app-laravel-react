import axios, { AxiosInstance, AxiosError, AxiosResponse, InternalAxiosRequestConfig } from 'axios';

// ================================
// ✅ API Configuration
// ================================
export const apiUrl = 'http://127.0.0.1:8000/api';
export const R_License = 'acknowledgeRemotionLicense';
// ================================
// ✅ Types
// ================================
interface AuthInfo {
  token: string;
  user?: any;
}

interface ApiError {
  message?: string;
  errors?: Record<string, string[]>;
}

// Create an Axios instance
const api: AxiosInstance = axios.create({
  baseURL: apiUrl,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
});

// Request interceptor to add token
api.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  const authInfoStr = localStorage.getItem('authInfo');
  if (authInfoStr) {
    try {
      const authInfo: AuthInfo = JSON.parse(authInfoStr);
      const token = authInfo?.token;

      if (token && config.headers) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    } catch (error) {
      console.error('Error parsing authInfo:', error);
    }
  }
  return config;
});

// ================================
// ✅ Centralized Error Handler (for Axios)
// ================================
const handleApiError = (error: AxiosError<ApiError>) => {
  if (error.response) {
    const response = error.response;
    const errorData = response.data;
    let message = errorData?.message || `HTTP error! Status: ${response.status}`;

    if (errorData?.errors) {
      console.group(`Validation Errors (Status ${response.status})`);
      Object.entries(errorData.errors).forEach(([field, msgs]) => {
        console.error(`${field}: ${msgs.join(', ')}`);
      });
      console.groupEnd();

      const combined = Object.values(errorData.errors).flat().join('\n');
      // You can integrate toast here if needed
      console.error(combined || message);
      return Promise.reject(errorData);
    }

    if (response.status === 401) {
      console.error('Unauthorized! Redirecting to login...');
      localStorage.removeItem('authInfo');
      window.location.href = '/login';
      return Promise.reject(errorData);
    }

    console.error(message);
    return Promise.reject(errorData);
  } else if (error.request) {
    const message = "Network Error: No response received from server.";
    console.error("Network Error:", message);
    return Promise.reject({ message });
  } else {
    const message = error.message;
    console.error("Axios Setup Error:", message);
    return Promise.reject({ message });
  }
};

// Attach the error interceptor
api.interceptors.response.use(
  (response: AxiosResponse) => response,
  handleApiError
);

// ================================
// ✅ API Methods
// ================================
const extractData = <T>(response: AxiosResponse<T>): T => response.data;

export const post = <T = any>(url: string, data?: any): Promise<T> => {
  return api.post<T>(url, data).then(extractData);
};

export const get = <T = any>(url: string): Promise<T> => {
  return api.get<T>(url).then(extractData);
};

export const put = <T = any>(url: string, data?: any): Promise<T> => {
  return api.put<T>(url, data).then(extractData);
};

export const del = <T = any>(url: string): Promise<T> => {
  return api.delete<T>(url).then(extractData);
};

// ================================
// ✅ Login API (Separate instance without auth)
// ================================
const loginApi: AxiosInstance = axios.create({
  baseURL: apiUrl,
  headers: {
    "Content-Type": "application/json",
    "Accept": "application/json",
  },
});

loginApi.interceptors.response.use(
  (response: AxiosResponse) => response,
  handleApiError
);

export const loginPost = <T = any>(url: string, data: any): Promise<T> => {
  return loginApi.post<T>(url, data).then(extractData);
};