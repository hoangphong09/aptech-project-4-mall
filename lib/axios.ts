import axios, { AxiosInstance } from "axios";

const REST_API_BASE_URL: string = "http://localhost:8080";

const axiosInstance: AxiosInstance = axios.create({
    baseURL: REST_API_BASE_URL
});

export default axiosInstance;

export const axiosAuth: AxiosInstance = axios.create({
    baseURL: REST_API_BASE_URL,
    headers: { 'Content-Type' : 'application/json' },
    withCredentials: true
});