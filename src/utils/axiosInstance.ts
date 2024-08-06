import axios, { InternalAxiosRequestConfig } from "axios";

const axiosInstance = axios.create({
    //TODO: extract into an environment variable
    baseURL: "http://localhost:3000/api/v1",
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

export default axiosInstance;