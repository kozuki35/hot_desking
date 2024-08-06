import axios, { InternalAxiosRequestConfig } from "axios";

const axiosInstance = axios.create({
    baseURL: process.env.BASE_URL,
    timeout: 10000,
    headers: {
        "Content-Type": "application/json",
    }
})

axiosInstance.interceptors.request.use(
    (config: InternalAxiosRequestConfig) => {
        const accessToken = localStorage.getItem("token");
        if (accessToken) {
            config.headers.Authorization = `Bearer ${accessToken}`;
        }
        return config;
    },
    (err) => {
        return Promise.reject(err);
    }
)