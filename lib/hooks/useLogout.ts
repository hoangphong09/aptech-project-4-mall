"use client"

import { useSession, signOut } from "next-auth/react"
import useAxiosPrivate from "@/lib/hooks/useAxiosCredentials"

export function useLogout() {
  const { data: session } = useSession()
  const axiosPrivate = useAxiosPrivate()

  const handleLogout = async (e?: React.FormEvent) => {
    e?.preventDefault()
    
    const token = session?.user?.accessToken
    try {
        if (token) {
          const res = await axiosPrivate.post(
                "/api/auth/logout",
                {},
                {
                    headers: { Authorization: `Bearer ${token}` },
                    withCredentials: true,
                }
          )
        }
        
    } catch (err) {
    } finally {
      await signOut({ 
        //callbackUrl: "/" 
        })
    }

  }

  return { handleLogout }
}
