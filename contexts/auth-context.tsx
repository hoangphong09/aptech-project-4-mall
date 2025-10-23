"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import { useRouter } from "next/navigation"

interface User {
  id: string
  email: string
  name: string
  role: "admin" | "user"
  password?: string // Added password field for user management
}

interface AuthContextType {
  user: User | null
  login: (email: string, password: string) => Promise<boolean>
  logout: () => void
  isAdmin: boolean
  isLoading: boolean
  getAllUsers: () => User[]
  createUser: (user: User) => void
  updateUser: (id: string, updates: Partial<User>) => void
  deleteUser: (id: string) => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

const INITIAL_USERS: User[] = [
  {
    id: "admin-001",
    email: "admin@pandamall.com",
    name: "Admin User",
    role: "admin",
    password: "admin123",
  },
  {
    id: "user-001",
    email: "demo@example.com",
    name: "Demo User",
    role: "user",
    password: "demo123",
  },
]

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [allUsers, setAllUsers] = useState<User[]>([])
  const router = useRouter()

  useEffect(() => {
    const savedUsers = localStorage.getItem("allUsers")
    if (savedUsers) {
      try {
        setAllUsers(JSON.parse(savedUsers))
      } catch (error) {
        console.error("Failed to parse saved users:", error)
        localStorage.setItem("allUsers", JSON.stringify(INITIAL_USERS))
        setAllUsers(INITIAL_USERS)
      }
    } else {
      localStorage.setItem("allUsers", JSON.stringify(INITIAL_USERS))
      setAllUsers(INITIAL_USERS)
    }

    // Check if user is logged in from localStorage
    const savedUser = localStorage.getItem("user")
    if (savedUser) {
      try {
        const parsedUser = JSON.parse(savedUser)
        // Remove password from logged-in user object
        const { password, ...userWithoutPassword } = parsedUser
        setUser(userWithoutPassword)
      } catch (error) {
        console.error("Failed to parse saved user:", error)
        localStorage.removeItem("user")
      }
    }
    setIsLoading(false)
  }, [])

  const login = async (email: string, password: string): Promise<boolean> => {
    const foundUser = allUsers.find((u) => u.email === email && u.password === password)

    if (foundUser) {
      const { password: _, ...userWithoutPassword } = foundUser
      setUser(userWithoutPassword)
      localStorage.setItem("user", JSON.stringify(userWithoutPassword))
      return true
    }

    return false
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem("user")
    router.push("/")
  }

  const getAllUsers = () => {
    return allUsers
  }

  const createUser = (newUser: User) => {
    const updatedUsers = [...allUsers, newUser]
    setAllUsers(updatedUsers)
    localStorage.setItem("allUsers", JSON.stringify(updatedUsers))
  }

  const updateUser = (id: string, updates: Partial<User>) => {
    const updatedUsers = allUsers.map((u) => (u.id === id ? { ...u, ...updates } : u))
    setAllUsers(updatedUsers)
    localStorage.setItem("allUsers", JSON.stringify(updatedUsers))

    // If updating current user, update the logged-in user state
    if (user?.id === id) {
      const { password, ...userWithoutPassword } = updatedUsers.find((u) => u.id === id)!
      setUser(userWithoutPassword)
      localStorage.setItem("user", JSON.stringify(userWithoutPassword))
    }
  }

  const deleteUser = (id: string) => {
    const updatedUsers = allUsers.filter((u) => u.id !== id)
    setAllUsers(updatedUsers)
    localStorage.setItem("allUsers", JSON.stringify(updatedUsers))
  }

  const isAdmin = user?.role === "admin"

  return (
    <AuthContext.Provider
      value={{ user, login, logout, isAdmin, isLoading, getAllUsers, createUser, updateUser, deleteUser }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
