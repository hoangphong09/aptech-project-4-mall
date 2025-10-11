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
            if (user) {
                const customUser = user as CustomUser
            return {
                ...token,
                username: customUser.username,
                email: customUser.email,
                roles: customUser.roles,
                accessToken: customUser.accessToken,
                accessTokenExpires: customUser.accessTokenExpires,
            };
            }
            return token;
        },
        async session({ session, token }) {
            if (!session.user) session.user = {} as any;
            session.user.username = (token as any).username;
            session.user.email = (token as any).email;
            session.user.roles = (token as any).roles;
            return session;
        },
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