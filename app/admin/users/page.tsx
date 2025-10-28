"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card } from "@/components/ui/card"
import { Plus, Pencil, Trash2, Search, Ban, CheckCircle, Eye, EyeOff } from "lucide-react"
import { useAuth } from "@/contexts/auth-context"

interface User {
  avatarUrl: string
  id: string
  username?: string
  fullName: string
  email: string
  phone: string
  role: "ADMIN" | "STAFF" | "CUSTOMER"
  status: "ACTIVE" | "SUSPENDED" | "DELETED"
  orders: number
  totalSpent: number
  createdAt: string
}

interface UserUpdateDTO {
  fullName?: string
  avatarUrl?: string
  phone?: string
  email?: string
  role?: "ADMIN" | "STAFF" | "CUSTOMER"
  status?: "ACTIVE" | "SUSPENDED" | "DELETED"
}

export default function UsersPage() {
  const { getAllUsers, updateUser, deleteUser } = useAuth()
  const [users, setUsers] = useState<User[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingUser, setEditingUser] = useState<User | null>(null)
  const [formData, setFormData] = useState<UserUpdateDTO>({
  fullName: "",
  avatarUrl: "",
  phone: "",
  email: "",
  role: "CUSTOMER",
  status: "ACTIVE",
  });

  useEffect(() => {
  const fetchUsers = async () => {
    try {
      const authUsers = await getAllUsers()
      setUsers(authUsers.map((u: any) => ({
        id: u.userId,
        username: u.username ?? "",
        fullName: u.fullName ?? "",
        email: u.email ?? "",
        phone: u.phone ?? "",
        avatarUrl: u.avatarUrl ?? "",
        role: (u.role ?? "CUSTOMER") as "ADMIN" | "STAFF" | "CUSTOMER",
        status: (u.status ?? "ACTIVE") as "ACTIVE" | "SUSPENDED" | "DELETED",
        orders: u.orderCount,
        totalSpent: u.totalSpent,
        createdAt: u.createdAt,
      })))
    } catch (err) {
      console.error("Failed to fetch users:", err)
    }
  }

  fetchUsers()
  }, [])


  const filteredUsers = users.filter(
    (user) =>
      user.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.phone.includes(searchQuery),
  )

  const handleEdit = (user: User) => {
    setEditingUser(user)
    setFormData({
      fullName: user.fullName,
      email: user.email,
      phone: user.phone,
      avatarUrl: user.avatarUrl || "",
      role: user.role?.toUpperCase() as "ADMIN" | "STAFF" | "CUSTOMER",
      status: user.status?.toUpperCase() as "ACTIVE" | "SUSPENDED" | "DELETED",
    })
    setIsModalOpen(true)
  }

  const handleDelete = (id: string) => {
    if (confirm("Are you sure you want to delete this user?")) {
      deleteUser(id)
    }
  }

  const handleToggleStatus = (id: string) => {
    const user = users.find(user => user.id === id);
    if (user){
      setUsers(users.map((user) =>
      user.id === id
      ? {
          ...user,
          status: user.status === "ACTIVE" ? "SUSPENDED" : "ACTIVE",
        }
      : user
      ));

      updateUser(user.id, {
            status: user.status === "ACTIVE" ? "SUSPENDED" : "ACTIVE",
          })
    }
    
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (editingUser) {

    const updatedUser: User = {
      ...editingUser,
      fullName: formData.fullName ?? editingUser.fullName,
      email: formData.email ?? editingUser.email,
      phone: formData.phone ?? editingUser.phone,
      role: formData.role ?? editingUser.role,
      status: formData.status ?? editingUser.status,
      avatarUrl: formData.avatarUrl ?? editingUser.avatarUrl,
    };

    setUsers(users.map((user) => (user.id === editingUser.id ? updatedUser : user)));

    updateUser(editingUser.id, {
      fullName: formData.fullName,
      email: formData.email,
      phone: formData.phone,
      role: formData.role,
      status: formData.status,
      avatarUrl: formData.avatarUrl,
    });
  }


    setIsModalOpen(false)
    }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Users</h1>
          <p className="text-gray-600 mt-1">Manage user accounts and permissions</p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="p-6">
          <p className="text-sm font-medium text-gray-600">Total Users</p>
          <p className="text-3xl font-bold text-gray-900 mt-2">{users.length}</p>
        </Card>
        <Card className="p-6">
          <p className="text-sm font-medium text-gray-600">Active Users</p>
          <p className="text-3xl font-bold text-green-600 mt-2">{users.filter((u) => u.status === "ACTIVE").length}</p>
        </Card>
        <Card className="p-6">
          <p className="text-sm font-medium text-gray-600">Banned Users</p>
          <p className="text-3xl font-bold text-red-600 mt-2">{users.filter((u) => u.status === "SUSPENDED").length}</p>
        </Card>
      </div>

      {/* Search */}
      <Card className="p-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
          <Input
            placeholder="Search users by name, email, or phone..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
      </Card>

      {/* Users Table */}
      <Card>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">User</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Contact</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Role</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Status</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Orders</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Total Spent</th>
                <th className="px-6 py-4 text-right text-sm font-semibold text-gray-900">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredUsers.map((user) => (
                <tr key={user.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-[#ff6600] flex items-center justify-center text-white font-semibold">
                        {user.fullName.charAt(0)}
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-900">{user.fullName}</p>
                        <p className="text-xs text-gray-500">Joined {user.createdAt}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <p className="text-sm text-gray-900">{user.email}</p>
                    <p className="text-xs text-gray-500">{user.phone}</p>
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`inline-block px-2 py-1 text-xs font-medium rounded ${
                        user.role === "ADMIN" ? "bg-purple-100 text-purple-800" : "bg-blue-100 text-blue-800"
                      }`}
                    >
                      {user.role}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`inline-block px-2 py-1 text-xs font-medium rounded ${
                        user.status === "ACTIVE" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
                      }`}
                    >
                      {user.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">{user.orders}</td>
                  <td className="px-6 py-4 text-sm font-semibold text-gray-900">{user.totalSpent.toLocaleString()}đ</td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleToggleStatus(user.id)}
                        className={
                          user.status === "ACTIVE"
                            ? "text-red-600 hover:text-red-700 hover:bg-red-50"
                            : "text-green-600 hover:text-green-700 hover:bg-green-50"
                        }
                        title={user.status === "ACTIVE" ? "Ban user" : "Activate user"}
                      >
                        {user.status === "ACTIVE" ? <Ban className="h-4 w-4" /> : <CheckCircle className="h-4 w-4" />}
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleEdit(user)}
                        className="text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDelete(user.id)}
                        className="text-red-600 hover:text-red-700 hover:bg-red-50"
                        disabled={user.role === "ADMIN"}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <Card className="w-full max-w-md p-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">{editingUser ? "Edit User" : "Add User"}</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
                <Input
                  value={formData.fullName}
                  onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                  placeholder="Tên đầy đủ"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                <Input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="user@example.com"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Phone</label>
                <Input
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  placeholder="+84 123 456 789"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Role</label>
                <select
                  value={formData.role}
                  onChange={(e) => setFormData({ ...formData, role: e.target.value as "ADMIN" | "STAFF" | "CUSTOMER" })}
                  className="w-full h-10 px-3 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#ff6600]"
                >
                  <option value="CUSTOMER">Customer</option>
                  <option value="STAFF">Staff</option>
                  <option value="ADMIN">Admin</option>
                </select>
              </div>
              <div className="flex gap-3 pt-4">
                <Button type="button" variant="outline" onClick={() => setIsModalOpen(false)} className="flex-1">
                  Cancel
                </Button>
                <Button type="submit" className="flex-1 bg-[#ff6600] hover:bg-[#ff5500]">
                  {editingUser ? "Update" : "Select an User"}
                </Button>
              </div>
            </form>
          </Card>
        </div>
      )}
    </div>
  )
}
