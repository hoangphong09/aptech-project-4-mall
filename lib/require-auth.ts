"use client";

import { useEffect, useMemo } from 'react';
import useAuth from '@/lib/hooks/useAuth'; 
import { jwtDecode } from 'jwt-decode';

import { useRouter, usePathname, redirect } from 'next/navigation'; 
import { ReactNode } from 'react';


interface RequireAuthProps {
    allowedRoles: string[]; 
    children: ReactNode;
}

interface DecodedToken {
    roles: string[]; 
}

const RequireAuth = ({ allowedRoles, children }: RequireAuthProps) => {
    const { auth } = useAuth();
    const router = useRouter();
    const pathname = usePathname(); 

    const roles: string[] = useMemo(() => {
        if (auth?.accessToken) {
            try {
                const decoded = jwtDecode<DecodedToken>(auth.accessToken);
                return decoded.roles || [];
            } catch (error) {
                console.error("Token decode failed:", error);
                return [];
            }
        }
        return [];
    }, [auth?.accessToken]);

    // 4. Check for role match
    const isAuthorized = useMemo(() => {
        if (!roles || roles.length === 0) return false;
        return roles.find(role => allowedRoles.includes(role));
    }, [roles, allowedRoles]);

    useEffect(() => {
        if (!auth?.user) {
            router.push(`/login?from=${pathname}`);
        } else if (!isAuthorized) {
            router.push(`/unauthorized?from=${pathname}`);
        }
    }, [auth?.user, isAuthorized, pathname, router]);

    if (isAuthorized) {
        return {children};
    }

    return null;
}

export default RequireAuth;