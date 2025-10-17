import axios from "../axios"; 

interface RefreshResponse {
    token: string; 
}
type RefreshFunction = () => Promise<string>;

const useRefreshToken = () => {

    const refresh: RefreshFunction = async () => {
        
        
        const response = await axios.get<RefreshResponse>('/api/auth/refresh', {
            withCredentials: true 
        });
        if (response.status === 200) return response.data.token; 
        else return "refresh-token error";
    }
    
    return refresh;
}

export default useRefreshToken;