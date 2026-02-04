import axios, {
  AxiosError,
  AxiosResponse,
  InternalAxiosRequestConfig,
} from "axios";

// Token management
let accessToken: string | null = null;
let isRefreshing = false;
let refreshSubscribers: ((token: string) => void)[] = [];

export function setAccessToken(token: string | null) {
  accessToken = token;
}

export function getAccessToken(): string | null {
  return accessToken;
}

function subscribeTokenRefresh(callback: (token: string) => void) {
  refreshSubscribers.push(callback);
}

function onTokenRefreshed(token: string) {
  refreshSubscribers.forEach((callback) => callback(token));
  refreshSubscribers = [];
}

// Create axios instance
const api = axios.create({
  baseURL: "/api",
  timeout: 30000,
  withCredentials: true, // Important for cookies (refresh token)
});

// Request interceptor
api.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    // Attach access token if available
    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }

    // Handle Content-Type
    // If data is FormData, let browser set the Content-Type (with boundary)
    // Otherwise, set it to application/json
    if (config.data) {
      if (config.data instanceof FormData) {
        // Delete Content-Type to let browser set it with boundary for multipart/form-data
        delete config.headers["Content-Type"];
      } else if (!config.headers["Content-Type"]) {
        config.headers["Content-Type"] = "application/json";
      }
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor
api.interceptors.response.use(
  (response: AxiosResponse) => {
    return response;
  },
  async (error: AxiosError) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & {
      _retry?: boolean;
    };

    // Handle 401 Unauthorized - Token expired
    if (error.response?.status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        // Wait for token refresh and retry
        return new Promise((resolve) => {
          subscribeTokenRefresh((token: string) => {
            originalRequest.headers.Authorization = `Bearer ${token}`;
            resolve(api(originalRequest));
          });
        });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        // Call refresh endpoint
        const response = await axios.post(
          "/api/auth/refresh",
          {},
          { withCredentials: true }
        );

        if (response.data.success) {
          const newToken = response.data.data.accessToken;
          setAccessToken(newToken);
          onTokenRefreshed(newToken);

          // Retry original request with new token
          originalRequest.headers.Authorization = `Bearer ${newToken}`;
          return api(originalRequest);
        } else {
          // Refresh failed - redirect to login
          handleAuthFailure();
          return Promise.reject(error);
        }
      } catch (refreshError) {
        // Refresh failed - redirect to login
        handleAuthFailure();
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    // Handle 403 Forbidden - No permission
    if (error.response?.status === 403) {
      console.error("Access forbidden: You don't have permission for this action");
      // You can dispatch an event or call a callback here
      // window.dispatchEvent(new CustomEvent('forbidden', { detail: error.response?.data }));
    }

    return Promise.reject(error);
  }
);

function handleAuthFailure() {
  setAccessToken(null);
  refreshSubscribers = [];

  // Redirect to login if in browser
  if (typeof window !== "undefined") {
    const currentPath = window.location.pathname;
    if (currentPath !== "/login" && currentPath !== "/register") {
      window.location.href = `/login?redirect=${encodeURIComponent(currentPath)}`;
    }
  }
}

export default api;

// Typed response wrapper
export interface ApiResponse<T> {
  success: true;
  data: T;
}

export interface ApiError {
  success: false;
  error: string;
  errors?: Record<string, string[]>;
}

export type ApiResult<T> = ApiResponse<T> | ApiError;

// Helper function to extract data from axios response
export function extractData<T>(response: AxiosResponse<ApiResult<T>>): ApiResult<T> {
  return response.data;
}

// Convenience methods with typed responses
export const apiClient = {
  async get<T>(url: string, config?: Parameters<typeof api.get>[1]): Promise<ApiResult<T>> {
    try {
      const response = await api.get<ApiResult<T>>(url, config);
      return response.data;
    } catch (error) {
      return handleApiError(error);
    }
  },

  async post<T>(
    url: string,
    data?: unknown,
    config?: Parameters<typeof api.post>[2]
  ): Promise<ApiResult<T>> {
    try {
      const response = await api.post<ApiResult<T>>(url, data, config);
      return response.data;
    } catch (error) {
      return handleApiError(error);
    }
  },

  async put<T>(
    url: string,
    data?: unknown,
    config?: Parameters<typeof api.put>[2]
  ): Promise<ApiResult<T>> {
    try {
      const response = await api.put<ApiResult<T>>(url, data, config);
      return response.data;
    } catch (error) {
      return handleApiError(error);
    }
  },

  async patch<T>(
    url: string,
    data?: unknown,
    config?: Parameters<typeof api.patch>[2]
  ): Promise<ApiResult<T>> {
    try {
      const response = await api.patch<ApiResult<T>>(url, data, config);
      return response.data;
    } catch (error) {
      return handleApiError(error);
    }
  },

  async delete<T>(url: string, config?: Parameters<typeof api.delete>[1]): Promise<ApiResult<T>> {
    try {
      const response = await api.delete<ApiResult<T>>(url, config);
      return response.data;
    } catch (error) {
      return handleApiError(error);
    }
  },
};

function handleApiError(error: unknown): ApiError {
  if (axios.isAxiosError(error)) {
    // If server returned an error response
    if (error.response?.data) {
      const data = error.response.data;
      if (typeof data === "object" && "error" in data) {
        return data as ApiError;
      }
      return {
        success: false,
        error: typeof data === "string" ? data : "Request failed",
      };
    }
    // Network error or timeout
    if (error.code === "ECONNABORTED") {
      return { success: false, error: "Request timeout" };
    }
    if (!error.response) {
      return { success: false, error: "Network error. Please check your connection." };
    }
    return { success: false, error: error.message };
  }
  return { success: false, error: "An unexpected error occurred" };
}
