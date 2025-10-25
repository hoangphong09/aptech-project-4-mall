"use client"

import { createContext, useContext, ReactNode, useMemo } from "react"
import { useSession } from "next-auth/react"
import { Role, Status } from "@/lib/types/next-auth"
import useAxiosPrivate from "@/lib/hooks/useAxiosCredentials"

interface AuthContextType {
  user: SessionUser | null
  isAdmin: boolean
  isLoading: boolean
  getAllUsers: () => Promise<User[]>
  updateUser: (id: string, updates: Partial<User>) => void
  deleteUser: (id: string) => void
}

export interface SessionUser {
  id: number;
  username?: string;
  fullname: string;
  email: string;
  role: Role;
  status: Status;
  accessToken: string;
  accessTokenExpires?: string;
  provider?: string;
}

interface User {
  phone: string
  id: number
  username: string
  email: string
  fullName: string
  role: string
  status: string
  avatarUrl?: string
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const { data: session, status } = useSession()
  const axiosPrivate = useAxiosPrivate();

  const user = session?.user
    ? {
        id: userIdFrom(session.user),
        username: session.user.username,
        fullname: session.user.fullname,
        email: session.user.email,
        role: session.user.role,
        status: session.user.status,
        accessToken: (session.user as any).accessToken,
        accessTokenExpires: (session.user as any).accessTokenExpires,
        provider: (session.user as any).provider,
      }
    : null

  const isAdmin = user?.role.name === "ADMIN"
  const isStaff = user?.role.name === "STAFF"

  const getAllUsers = async (): Promise<User[]> => {
    if (!user?.accessToken) throw new Error("No access token available")

    const res = await axiosPrivate.get("/api/users/", {
      headers: {
        Authorization: `Bearer ${user.accessToken}`,
      },
    })
    return res.data;
  }

  const updateUser = async (id: string, updates: Partial<User>): Promise<void> => {
  if (!user?.accessToken) throw new Error("No access token available")

  await axiosPrivate.patch(`/api/users/${id}`, updates, {
    headers: {
      Authorization: `Bearer ${user.accessToken}`,
    },
  })
  }

  const deleteUser = async (id: string): Promise<void> => {
  if (!user?.accessToken) throw new Error("No access token available")

  await axiosPrivate.delete(`/api/users/${id}`, {
    headers: {
      Authorization: `Bearer ${user.accessToken}`,
    },
    })
  }

  const value = useMemo(
    () => ({
      user,
      isAdmin,
      isLoading: status === "loading",
      getAllUsers,
      updateUser,
      deleteUser
    }),
    [user, isAdmin, isStaff, status]
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}

function userIdFrom(user: any) {
  return user?.id || user?.username || "unknown"
}
