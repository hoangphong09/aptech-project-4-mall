import axios from "../axios"; 

interface RefreshResponse {
    token: string; 
}
type RefreshFunction = () => Promise<string>;

const useRefreshToken = () => {

    const refresh: RefreshFunction = async () => {
        
        
        const response = await axios.get<RefreshResponse>('/refresh', {
            withCredentials: true 
        });
        return response.data.token; 
    }
    
    return refresh;
}

export default useRefreshToken;