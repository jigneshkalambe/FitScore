import axios from "axios";

const Axios = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:7777/api",
});

Axios.interceptors.request.use((config) => {
    if (typeof window !== "undefined") {
        const token = localStorage.getItem("token");
        if (token) {
            config.headers.set("Authorization", `Bearer ${token}`);
        }
    }
    return config;
});

const MAX_RETRIES = 3;

const idempotentMethods = ["get", "delete"];

Axios.interceptors.response.use(
    (response) => response,
    async (error) => {
        if (error.response?.status === 401) {
            if (typeof window !== "undefined") {
                localStorage.removeItem("token");
                localStorage.removeItem("user");
                window.dispatchEvent(new Event("auth:session-expired"));
            }
            return Promise.reject(error);
        }

        const config = error.config;
        const isRetryableStatus = !error.response || (error.response.status >= 500 && error.response.status < 600);
        const isIdempotent = idempotentMethods.includes(config?.method?.toLowerCase());

        if (!isRetryableStatus || !isIdempotent) {
            return Promise.reject(error);
        }

        config._retryCount = config._retryCount ?? 0;

        if (config._retryCount >= MAX_RETRIES) {
            return Promise.reject(error);
        }

        config._retryCount += 1;
        const delay = 500 * Math.pow(2, config._retryCount - 1);
        await new Promise((resolve) => setTimeout(resolve, delay));

        return Axios(config);
    }
);

export default Axios;
