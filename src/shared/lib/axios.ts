import axios, {
  AxiosError,
  AxiosResponse,
  InternalAxiosRequestConfig,
} from "axios";

// Refresh state
let isRefreshing = false;
let refreshSubscribers: (() => void)[] = [];

const subscribeTokenRefresh = (callback: () => void) => {
  refreshSubscribers.push(callback);
};

const onTokenRefreshed = () => {
  refreshSubscribers.forEach((callback) => callback());
  refreshSubscribers = [];
};

// Create axios instance
const api = axios.create({
  baseURL: "/api",
  timeout: 30000,
  withCredentials: true,
});

// Request interceptor
api.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    if (config.data) {
      if (config.data instanceof FormData) {
        delete config.headers["Content-Type"];
      } else if (!config.headers["Content-Type"]) {
        config.headers["Content-Type"] = "application/json";
      }
    }

    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor
api.interceptors.response.use(
  (response: AxiosResponse) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & {
      _retry?: boolean;
    };

    if (error.response?.status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        return new Promise((resolve) => {
          subscribeTokenRefresh(() => {
            resolve(api(originalRequest));
          });
        });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        await axios.post("/api/auth/refresh", {}, { withCredentials: true });
        onTokenRefreshed();
        return api(originalRequest);
      } catch (refreshError) {
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);

export default api;

// Error type from API
export interface ApiError {
  error: string;
  errors?: Record<string, string[]>;
}

// Simple typed client - returns data directly, throws on error
export const apiClient = {
  async get<T>(url: string, config?: Parameters<typeof api.get>[1]): Promise<T> {
    const response = await api.get<T>(url, config);
    return response.data;
  },

  async post<T>(url: string, data?: unknown, config?: Parameters<typeof api.post>[2]): Promise<T> {
    const response = await api.post<T>(url, data, config);
    return response.data;
  },

  async put<T>(url: string, data?: unknown, config?: Parameters<typeof api.put>[2]): Promise<T> {
    const response = await api.put<T>(url, data, config);
    return response.data;
  },

  async patch<T>(url: string, data?: unknown, config?: Parameters<typeof api.patch>[2]): Promise<T> {
    const response = await api.patch<T>(url, data, config);
    return response.data;
  },

  async delete<T>(url: string, config?: Parameters<typeof api.delete>[1]): Promise<T> {
    const response = await api.delete<T>(url, config);
    return response.data;
  },
};
