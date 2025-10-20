import NextAuth from "next-auth";

export interface Role {
    name: string;
}

export interface DecodedToken {
    email: string;
    role: Role; 
}

declare module "next-auth" {

    interface Session {
        user: {
            id: string | undefined;
            username: string | undefined;
            email: string;
            role: Role;
            accessToken: string;
        }
    }
}