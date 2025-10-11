import NextAuth from "next-auth";

export interface Role {
    name: string;
}

export interface DecodedToken {
    email: string;
    roles: Role[]; 
}

declare module "next-auth" {

    interface Session {
        user: {
            id: string | undefined;
            username: string;
            email: string;
            roles: Role[];
            accessToken: string;
        }
    }
}