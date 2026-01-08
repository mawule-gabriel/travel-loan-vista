const getApiBaseUrl = (): string => {
    // Prefer explicit env var injected at build time or by the hosting environment
    const envUrl = import.meta.env.VITE_API_BASE_URL;
    if (envUrl && typeof envUrl === 'string' && envUrl.trim() !== '') {
        return envUrl;
    }

    const hostname = window.location.hostname;
    const isNetworkIP = /^\d+\.\d+\.\d+\.\d+$/.test(hostname);

    // For network IPs (e.g., testing on a LAN device), preserve hostname and port but
    // avoid falling back to a hard-coded localhost URL.
    if (isNetworkIP) {
        const protocol = window.location.protocol === 'https:' ? 'https' : 'http';
        return `${protocol}://${hostname}:8080/api`;
    }

    // Default production API
    return 'https://crepusculumloanapp.onrender.com/api';
};

export const env = {
    apiBaseUrl: getApiBaseUrl(),
} as const;

