import { axiosAuth } from "../axios";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { AxiosError, InternalAxiosRequestConfig } from 'axios';
import useRefreshToken from './useRefreshToken';
import { signIn, signOut } from "next-auth/react";
import axios from "axios";


interface RetryAxiosRequestConfig extends InternalAxiosRequestConfig {
    sent?: boolean;
}

const useAxiosPrivate = () => {

    const { data: session } = useSession();
    const refresh = useRefreshToken(); 
    const [hasRefreshed, setHasRefreshed] = useState(false);
    const provider = session?.user.provider;

    useEffect(() => {
        
        if (session && !hasRefreshed && provider === 'google') {
            const refreshGoogle = async () =>{
                const res = await axios.post(`/api/auth/refresh?method=${provider}`,
            {},
            {
                withCredentials: true,
                headers: {
                    "Authorization": `Bearer ${session?.user.accessToken}`,
                },
            })
                setHasRefreshed(true)
            }
            refreshGoogle();
        }

        if (!session) {
            setHasRefreshed(false);
        }

    }, [session])


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
                    (statusCode === 401) && prevRequest && !prevRequest.sent
                ) {
                    prevRequest.sent = true;
                    const newAccessToken = await refresh();
                    if (newAccessToken === "refresh-token error") {
                        await signOut({ callbackUrl: "/login" })
                        return Promise.reject(error);
                    } else {
                        await signIn('credentials', {accessToken: newAccessToken, redirect: false});
                    
                        prevRequest.headers['Authorization'] = `Bearer ${newAccessToken}`;
                        return axiosAuth(prevRequest);
                    }
                    
                }
                return Promise.reject(error);
            }
        );

        return () => {
            axiosAuth.interceptors.request.eject(interceptRequest);
            axiosAuth.interceptors.response.eject(interceptResponse);
        }
    }, [session?.user.accessToken, refresh]) 

    return axiosAuth; 
}

export default useAxiosPrivate;