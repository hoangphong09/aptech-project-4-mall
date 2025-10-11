"use client"

import { useSession, signOut } from "next-auth/react"
import useAxiosPrivate from "@/lib/hooks/useAxiosCredentials"
import { AxiosError } from "axios"

export function useLogout() {
  const { data: session } = useSession()
  const axiosPrivate = useAxiosPrivate()

  const handleLogout = async (e?: React.FormEvent) => {
    e?.preventDefault()
    console.log("logout clicked");
    try {
        const token = session?.user?.accessToken
        if (token) {
            const res = await axiosPrivate.post(
                "/logout",
                {},
                {
                    headers: { Authorization: `Bearer ${token}` },
                    withCredentials: true,
                }
        )

        console.log(res.status + " for logout status");
      }
        await signOut({ 
        //callbackUrl: "/login" 
        })
    } catch (err) {
      const error = err as AxiosError
      console.error("Logout failed:", error.message)
    }
  }

  return { handleLogout }
}
