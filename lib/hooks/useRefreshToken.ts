import axios from "../axios"; 
import useAuth from "./useAuth";

interface RefreshResponse {
    token: string; 
}
type RefreshFunction = () => Promise<string>;

const useRefreshToken = () => {
   
    const { setAuth } = useAuth();
    const refresh: RefreshFunction = async () => {
        
        
        const response = await axios.get<RefreshResponse>('/refresh', {
            withCredentials: true 
        });

        setAuth((prev: any) => {
            return { ...prev, accessToken: response.data.token };
        });

        return response.data.token; 
    }
    
    return refresh;
}

export default useRefreshToken;