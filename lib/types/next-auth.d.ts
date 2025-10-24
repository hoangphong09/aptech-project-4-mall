import NextAuth from "next-auth";

export interface Role {
    name: string;
}

export interface DecodedToken {
    email: string;
    fullname: string;
    role: Role; 
}

declare module "next-auth" {

    interface Session {
        user: {
            id: string | undefined;
            username: string | undefined;
            fullname: string;
            email: string;
            role: Role;
            accessToken: string;
            provider: string;
        }
    }
}