import NextAuth from "next-auth";

export interface DecodedToken {
    id: string;
    email: string;
    fullname: string;
    role: string; 
    status: string;
}

declare module "next-auth" {

    interface Session {
        user: {
            id: string | undefined;
            username: string | undefined;
            fullname: string;
            email: string;
            role: string;
            accessToken: string;
            provider: string;
            status: string;
        }
    }
}