import NextAuth, { AuthOptions, Awaitable, RequestInternal, User } from "next-auth"
import { jwtDecode } from "jwt-decode"
import { DecodedToken, Role } from "@/lib/types/next-auth"

import CredentialsProvider from "next-auth/providers/credentials"
import GoogleProvider from "next-auth/providers/google"

export const authOptions : AuthOptions = {
    
    providers: [
        CredentialsProvider({
            name: "Credentials",
            credentials: {
                accessToken: { label: "AccessToken", type: "password"}
            },
            async authorize(credentials: Record<string, string> | undefined, req: Pick<RequestInternal, "body" | "query" | "headers" | "method">): Promise<CustomUser | null> {
                if (credentials?.accessToken){
                    const accessToken = credentials.accessToken;
                    const decodedPayload = jwtDecode<DecodedToken & { sub: string, exp: number }>(accessToken);

                    return {
                        id: String(decodedPayload.sub), 
                        username : decodedPayload.sub,
                        email: decodedPayload.email,
                        fullname: decodedPayload.fullname,
                        role: decodedPayload.role,
                        accessToken: accessToken,
                        accessTokenExpires: decodedPayload.exp,
                        provider: 'credentials'
                    } as CustomUser
                }
                return null;
            },
        }),
        GoogleProvider({
            name: "Google",
            clientId: `${process.env.GOOGLE_CLIENT_ID}`,
            clientSecret: `${process.env.GOOGLE_CLIENT_SECRET}`,
            authorization: {
                params: {
                    scope: 'openid email profile', 
                }
            }
        })
    ],

    callbacks: {
        async jwt({token, user, account}){
            if(account?.provider === "credentials"){
                if (user) {
                    const customUser = user as CustomUser
                    return {
                        ...token,
                        username: customUser.username,
                        email: customUser.email,
                        fullname: customUser.fullname,
                        roles: customUser.role,
                        accessToken: customUser.accessToken,
                        accessTokenExpires: customUser.accessTokenExpires,
                        provider: customUser.provider
                    };
                }
            }
            if(account?.provider === "google"){
                const email = user.email;
                const fullName = user.name;
                const backendResponse = await fetch(`http://localhost:8080/api/auth/login?method=google`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ username: email, fullname: fullName }),
                    credentials: 'include'
                });

                if (backendResponse.ok){
                    const customUserData = await backendResponse.json();
                    const accessToken = customUserData.token;
                    const decodedPayload = jwtDecode<DecodedToken & { sub: string, exp: number }>(accessToken);

                    return {
                    ...token,
                    id: String(decodedPayload.sub), 
                    username: decodedPayload.sub, 
                    email: decodedPayload.email,
                    fullname: decodedPayload.fullname,
                    role: decodedPayload.role,
                    accessToken: accessToken,
                    accessTokenExpires: decodedPayload.exp,
                    provider: 'google',
                    };
                }
                
            }

            return token;
        },
        async session({ session, token }) {

            if (!session.user) session.user = {} as any;
            session.user.username = (token as any).username;
            session.user.email = (token as any).email;
            session.user.fullname = (token as any).fullname;
            session.user.role = (token as any).role;

            (session.user as any).accessToken = (token as any).accessToken;
            (session.user as any).accessTokenExpires = (token as any).accessTokenExpires;
            (session.user as any).provider = (token as any).provider;
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
    fullname: string;
    email: string;
    role: Role;
    accessToken: string;
    accessTokenExpires: number;
    provider: string;
}