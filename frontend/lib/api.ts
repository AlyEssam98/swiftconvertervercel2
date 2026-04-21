import axios from 'axios';

const SESSION_KEY = 'session_token';
const AUTH_LOGOUT_EVENT = 'auth:logout';

type RetryConfig = {
    _retry?: boolean;
    skipAuthRefresh?: boolean;
};

const api = axios.create({
    baseURL: (process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:8081'),
    withCredentials: true,
    headers: {
        'Content-Type': 'application/json',
    },
});

let refreshPromise: Promise<string | null> | null = null;

const getTokenFromResponse = (data: unknown): string | null => {
    if (typeof data === 'string' && data.trim()) return data.trim();
    if (!data || typeof data !== 'object') return null;
    const obj = data as Record<string, unknown>;
    const token = (obj.token ?? obj.accessToken ?? obj.access_token) as string | undefined;
    return typeof token === 'string' && token.trim() ? token.trim() : null;
};

const emitLogout = () => {
    if (typeof window === 'undefined') {
        return;
    }

    try {
        sessionStorage.removeItem(SESSION_KEY);
    } catch {
        // ignore storage failures
    }
    window.dispatchEvent(new Event(AUTH_LOGOUT_EVENT));
};

const refreshAccessToken = async (): Promise<string | null> => {
    if (refreshPromise) {
        return refreshPromise;
    }

    refreshPromise = api.post('/api/v1/auth/refresh', {}, { skipAuthRefresh: true } as any)
        .then((res) => {
            const token = getTokenFromResponse(res?.data);
            if (typeof window !== 'undefined' && token) {
                sessionStorage.setItem(SESSION_KEY, token);
            }
            return token;
        })
        .catch(() => null)
        .finally(() => {
            refreshPromise = null;
        });

    return refreshPromise;
};

api.interceptors.request.use((config) => {
    // Use sessionStorage instead of localStorage for session-based auth
    const token = typeof window !== 'undefined' ? sessionStorage.getItem(SESSION_KEY) : null;
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

api.interceptors.response.use(
    response => response,
    async (error) => {
        const status = error.response?.status;
        const originalRequest = (error.config ?? {}) as typeof error.config & RetryConfig;
        const hasSessionToken = typeof window !== 'undefined' && !!sessionStorage.getItem(SESSION_KEY);
        const shouldTryRefresh = status === 401 && hasSessionToken && !originalRequest._retry && !originalRequest.skipAuthRefresh;

        if (shouldTryRefresh) {
            originalRequest._retry = true;
            const refreshedToken = await refreshAccessToken();
            if (refreshedToken) {
                originalRequest.headers = originalRequest.headers ?? {};
                originalRequest.headers.Authorization = `Bearer ${refreshedToken}`;
                return api(originalRequest);
            }
        }

        if (status === 401) {
            emitLogout();
        }

        return Promise.reject(error);
    }
);

export const callHealthCheck = async () => {
    try {
        const response = await api.get('/api/v1/health');
        console.log('Health check successful:', response.data);
        return response.data;
    } catch (error) {
        console.error('Health check failed:', error);
        // Silently fail - don't throw or show user-facing errors
    }
};

export default api;

