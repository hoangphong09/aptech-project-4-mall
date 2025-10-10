import { axiosAuth } from "../axios";
import { useSession } from "next-auth/react";
import { useEffect } from "react";
import { AxiosError, AxiosRequestConfig, InternalAxiosRequestConfig } from 'axios';
import useRefreshToken from './useRefreshToken';
import useAuth from './useAuth'; 

interface RetryAxiosRequestConfig extends InternalAxiosRequestConfig {
    sent?: boolean;
}

const useAxiosPrivate = () => {
    
    const refresh = useRefreshToken(); 
    const { auth } = useAuth();       

    useEffect(() => {
       
        const interceptRequest = axiosAuth.interceptors.request.use(
            (config: InternalAxiosRequestConfig) => {
                if (!config.headers['Authorization']) {
                    config.headers['Authorization'] = `Bearer ${auth?.accessToken}`;
                }
                return config;
            },
            (error: AxiosError) => {
                return Promise.reject(error);
            }
        );

        const interceptResponse = axiosAuth.interceptors.response.use(
            response => response,
            async (error: AxiosError) => {
                const prevRequest = error?.config as RetryAxiosRequestConfig | undefined;
                const statusCode = error?.response?.status;

                if (
                    (statusCode === 401 || statusCode === 403) && 
                    prevRequest && 
                    !prevRequest.sent
                ) {
                    prevRequest.sent = true;
                    
                    const newAccessToken = await refresh();
                    
                    prevRequest.headers['Authorization'] = `Bearer ${newAccessToken}`;
                    return axiosAuth(prevRequest);
                }
                
                return Promise.reject(error);
            }
        );

        return () => {
            axiosAuth.interceptors.request.eject(interceptRequest);
            axiosAuth.interceptors.response.eject(interceptResponse);
        }
    }, [auth, refresh]) 

    return axiosAuth; 
}

export default useAxiosPrivate;