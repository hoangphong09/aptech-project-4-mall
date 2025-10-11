import { axiosAuth } from "@/lib/axios"
import NextAuth, { AuthOptions, Awaitable, RequestInternal, User } from "next-auth"
import { JWT } from "next-auth/jwt"
import { jwtDecode } from "jwt-decode"
import { DecodedToken, Role } from "@/lib/types/next-auth"

import CredentialsProvider from "next-auth/providers/credentials"

export const authOptions : AuthOptions = {

    providers: [
        CredentialsProvider({
            name: "Credentials",
            credentials: {
                username: { label: "Username", type: "text" },
                password: { label: "Password", type: "password"}
            },
            async authorize(credentials: Record<string, string> | undefined, req: Pick<RequestInternal, "body" | "query" | "headers" | "method">): Promise<CustomUser | null> {
                const res = await axiosAuth.post("/login", JSON.stringify({username: credentials?.username, password: credentials?.password}),
                {
                    headers: {"Content-Type": "application/json"},
                    withCredentials: true
                })

                const json = await res.data;
                if (json){
                    const accessToken = json.token;
                    const decodedPayload = jwtDecode<DecodedToken & { sub: string, exp: number }>(accessToken);
                    return {
                        id: String(json.id || decodedPayload.sub), 
                        username : decodedPayload.sub,
                        email: decodedPayload.email,
                        roles: decodedPayload.roles,
                        accessToken: accessToken,
                        accessTokenExpires: decodedPayload.exp * 1000
                    } as CustomUser
                }
                return null;
            },
        })
    ],

    callbacks: {
        async jwt({token, user, account}){
            if (user && account) {
                console.log(account);
                return {...token, ...user} as unknown as CustomToken;
            }

            const customToken = token as unknown as CustomToken;


            return {}
        },
        async session({session, token, user}){
            session.user = token as any;
            return session;
        }
    },

    pages: {
        signIn: '/login',
    },

    session: {
        strategy: 'jwt'
    }
}

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST } 

interface CustomUser extends User{
    id: string;
    username: string;
    email: string;
    roles: Role[];
    accessToken: string;
    accessTokenExpires: number;
}

interface CustomToken {
    username: string;
    email: string;
    roles: Role[];
    accessToken: string;
    refreshToken: string;
    accessTokenExpires: number;
    error?: 'RefreshAccessTokenError';
}