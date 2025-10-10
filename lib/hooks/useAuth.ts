import { useContext, useDebugValue, Dispatch, SetStateAction } from 'react';
import AuthContext from '@/contexts/auth-provider';

interface AuthState {
    user?: string;
    accessToken?: string; 
}

interface AuthContextType {
    auth: AuthState;
    setAuth: Dispatch<SetStateAction<AuthState>>;
}

const useAuth = (): AuthContextType => {
    const context = useContext<AuthContextType>(AuthContext);

    useDebugValue(context.auth, auth => auth?.user ? `User: ${auth.user}` : "Guest");

    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }

    return context;
};

export default useAuth;