import { axiosAuth } from "../axios";
import { useSession } from "next-auth/react";
import { useEffect } from "react";
import { AxiosError, InternalAxiosRequestConfig } from 'axios';
import useRefreshToken from './useRefreshToken';

interface RetryAxiosRequestConfig extends InternalAxiosRequestConfig {
    sent?: boolean;
}

const useAxiosPrivate = () => {

    const { data: session } = useSession();
    const refresh = useRefreshToken(); 

    useEffect(() => {
       
        const interceptRequest = axiosAuth.interceptors.request.use(
            (config: InternalAxiosRequestConfig) => {
                if (!config.headers['Authorization']) {
                    config.headers['Authorization'] = `Bearer ${session?.user.accessToken}`;
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
                    (statusCode === 401) && 
                    prevRequest && 
                    !prevRequest.sent
                ) {
                    prevRequest.sent = true;
                    
                    const newAccessToken = await refresh();

                    if (session) {
                        session.user.accessToken = newAccessToken;
                    }
                    
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
    }, [session, refresh]) 

    return axiosAuth; 
}

export default useAxiosPrivate;