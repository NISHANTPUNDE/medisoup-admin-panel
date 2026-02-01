import Axios, { type AxiosInstance } from 'axios';

// API Response type matching backend format
export interface ApiResponse<T = any> {
    success: boolean;
    code: number;
    data: T | null;
    message: string;
}

// Create a single axios instance
const apiService: AxiosInstance = Axios.create({
    baseURL: import.meta.env.VITE_APP_API_URL || 'http://localhost:8081'
});

// Request interceptor - add token from localStorage
apiService.interceptors.request.use((config: any) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

// Response interceptor - handle API format
apiService.interceptors.response.use(
    (response: any) => {
        const apiResponse: ApiResponse = response?.data;

        if (apiResponse && typeof apiResponse === 'object' && 'success' in apiResponse) {
            return apiResponse.data;
        }

        return response?.data;
    },
    (error: any) => {
        let errorMessage = 'An error occurred';

        // Handle 401 Unauthorized - clear auth and redirect
        if (error.response?.status === 401) {
            const isLoginEndpoint = error.config?.url?.includes('/login');

            if (!isLoginEndpoint) {
                // Clear authentication and redirect to login
                localStorage.removeItem('token');
                localStorage.removeItem('user');
                window.location.href = '/';
                errorMessage = 'Session expired. Please login again.';
            }
        }

        // Extract error message from API format
        if (error.response?.data) {
            const apiError: ApiResponse = error.response.data;

            if (apiError.message) {
                errorMessage = apiError.message;
            } else if (typeof error.response.data.error === 'string') {
                errorMessage = error.response.data.error;
            }
        } else if (typeof error.message === 'string') {
            errorMessage = error.message;
        }

        const errorWithData: Error & { originalError?: any } = new Error(errorMessage);
        errorWithData.originalError = error.response?.data;

        throw errorWithData;
    }
);

export default apiService;
