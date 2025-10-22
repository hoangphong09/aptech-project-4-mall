import axios from "../axios"; 
import { useSession } from "next-auth/react";

interface RefreshResponse {
    token: string; 
}
type RefreshFunction = () => Promise<string>;

const useRefreshToken = () => {
    const {data:session} = useSession();

    const refresh: RefreshFunction = async () => {
        
        
        const response = await axios.get<RefreshResponse>('/api/auth/refresh', {
            withCredentials: true, 
            headers: {
                "Authorization": `Bearer ${session?.user.accessToken}`
            }
        });
        if (response.status === 200) return response.data.token; 
        else return "refresh-token error";
    }
    
    return refresh;
}

export default useRefreshToken;