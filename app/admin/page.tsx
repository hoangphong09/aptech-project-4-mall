"use client"

import { Package, FolderTree, Users, ShoppingCart } from "lucide-react"
import { Card } from "@/components/ui/card"

export default function AdminDashboard() {
  const stats = [
    {
      name: "Total Products",
      value: "1,234",
      icon: Package,
      change: "+12%",
      changeType: "positive",
    },
    {
      name: "Categories",
      value: "45",
      icon: FolderTree,
      change: "+3",
      changeType: "positive",
    },
    {
      name: "Total Users",
      value: "8,549",
      icon: Users,
      change: "+18%",
      changeType: "positive",
    },
    {
      name: "Orders Today",
      value: "127",
      icon: ShoppingCart,
      change: "-5%",
      changeType: "negative",
    },
  ]

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-600 mt-1">Welcome back! Here's what's happening with your store.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => (
          <Card key={stat.name} className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">{stat.name}</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">{stat.value}</p>
                <p className={`text-sm mt-2 ${stat.changeType === "positive" ? "text-green-600" : "text-red-600"}`}>
                  {stat.change} from last month
                </p>
              </div>
              <div className="bg-[#ff6600]/10 rounded-full p-3">
                <stat.icon className="h-6 w-6 text-[#ff6600]" />
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Recent Orders</h2>
          <div className="space-y-4">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="flex items-center justify-between py-3 border-b border-gray-100 last:border-0">
                <div>
                  <p className="font-medium text-gray-900">Order #{1000 + i}</p>
                  <p className="text-sm text-gray-500">Customer Name {i}</p>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-gray-900">${(Math.random() * 500 + 50).toFixed(2)}</p>
                  <span className="inline-block px-2 py-1 text-xs font-medium bg-green-100 text-green-800 rounded">
                    Completed
                  </span>
                </div>
              </div>
            ))}
          </div>
        </Card>

        <Card className="p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Low Stock Products</h2>
          <div className="space-y-4">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="flex items-center justify-between py-3 border-b border-gray-100 last:border-0">
                <div>
                  <p className="font-medium text-gray-900">Product Name {i}</p>
                  <p className="text-sm text-gray-500">SKU: PRD-{1000 + i}</p>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-red-600">{Math.floor(Math.random() * 10 + 1)} left</p>
                  <span className="inline-block px-2 py-1 text-xs font-medium bg-red-100 text-red-800 rounded">
                    Low Stock
                  </span>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  )
}
