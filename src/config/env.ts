const getApiBaseUrl = (): string => {
    if (import.meta.env.VITE_API_BASE_URL) {
        return import.meta.env.VITE_API_BASE_URL;
    }

    const hostname = window.location.hostname;
    const isNetworkIP = /^\d+\.\d+\.\d+\.\d+$/.test(hostname);

    if (isNetworkIP) {
        return `http://${hostname}:8080/api`;
    }

    return 'https://crepusculumloanapp.onrender.com/api';
};

export const env = {
    apiBaseUrl: getApiBaseUrl(),
} as const;

