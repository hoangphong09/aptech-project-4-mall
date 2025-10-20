"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Eye, EyeOff, ShoppingBag } from "lucide-react"
import { axiosAuth } from "@/lib/axios"
import { AxiosError } from 'axios';

export default function RegisterPage() {

  const router = useRouter()
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState('');
  const [matchPassword, setValidMatch] = useState(false);
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")

  useEffect(() => {
    if((password === confirmPassword) && password.length !== 0 && confirmPassword.length !== 0) setValidMatch(true)
      else setValidMatch(false)
  }, [password, confirmPassword])

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")

    try{
        const response = await axiosAuth.post("api/auth/register", JSON.stringify({username: username, password: password, role: 'CUSTOMER', email: email}),
        {
          headers: {"Content-Type": "application/json"},
          withCredentials: true
        })

        setTimeout(() => {
          if (response){
            router.push("/");
          }
        }, 1000)

      } catch(error) {
        const err = error as AxiosError
        if (!err?.response){
          setError("Không nhận được phản hồi từ server")
        } else {
          setError(err.message)
        }
      } finally {
        setTimeout(() => {
          setIsLoading(false);
        }, 1000)
      }
  }

  function handleGoogleSignUp(): void {
    throw new Error("Function not implemented.")
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-orange-50 flex items-center justify-center p-4">
      <div className="w-full max-w-6xl grid lg:grid-cols-2 gap-8 items-center">
        {/* Left Side - Branding */}
        <div className="hidden lg:flex flex-col items-center justify-center p-12 bg-gradient-to-br from-[#ff6600] to-[#ff8833] rounded-3xl shadow-2xl text-white">
          <div className="mb-8">
            <div className="bg-white rounded-2xl p-6 shadow-xl">
              <svg viewBox="0 0 120 120" fill="none" className="w-32 h-32">
                <circle cx="60" cy="40" r="18" fill="#ff6600" />
                <circle cx="40" cy="70" r="12" fill="#ff6600" />
                <circle cx="80" cy="70" r="12" fill="#ff6600" />
                <path d="M60 58c-12 0-24 6-24 18v12h48v-12c0-12-12-18-24-18z" fill="#ff6600" />
              </svg>
            </div>
          </div>
          <h1 className="text-5xl font-bold mb-4">
            Panda<span className="text-orange-200">Mall</span>
          </h1>
          <p className="text-xl text-orange-100 text-center mb-8 max-w-md">
            Nền tảng mua sắm trực tuyến hàng đầu từ Trung Quốc
          </p>
          <div className="flex items-center gap-8 text-orange-100">
            <div className="text-center">
              <div className="text-3xl font-bold">1M+</div>
              <div className="text-sm">Sản phẩm</div>
            </div>
            <div className="w-px h-12 bg-orange-300" />
            <div className="text-center">
              <div className="text-3xl font-bold">500K+</div>
              <div className="text-sm">Khách hàng</div>
            </div>
            <div className="w-px h-12 bg-orange-300" />
            <div className="text-center">
              <div className="text-3xl font-bold">99%</div>
              <div className="text-sm">Hài lòng</div>
            </div>
          </div>
        </div>

        {/* Right Side - Login Form */}
        <div className="bg-white rounded-3xl shadow-2xl p-8 lg:p-12">
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-2 lg:hidden">
              <div className="bg-[#ff6600] rounded-lg p-2">
                <ShoppingBag className="h-6 w-6 text-white" />
              </div>
              <h2 className="text-2xl font-bold">
                <span className="text-gray-800">Panda</span>
                <span className="text-[#ff6600]">Mall</span>
              </h2>
            </div>
            <h2 className="text-3xl font-bold text-gray-800 mb-2">Đăng ký tài khoản!</h2>
            <p className="text-gray-600">Để bắt đầu đặt đơn</p>
          </div>

          <form onSubmit={handleRegister} className="space-y-6">
            <div>
              <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-2">
                Username đăng nhập
              </label>
              <Input
                id="username"
                type="text"
                placeholder="Nhập tên đăng nhập"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="h-12 text-base"
                required
              />
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                Email hoặc Số điện thoại
              </label>
              <Input
                id="email"
                type="text"
                placeholder="Nhập email hoặc số điện thoại"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="h-12 text-base"
                required
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                Mật khẩu
              </label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Nhập mật khẩu"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="h-12 text-base pr-12"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                >
                  {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
            </div>

            <div>
              <label htmlFor="confirm-password" className="block text-sm font-medium text-gray-700 mb-2">
                Nhập lại Mật khẩu
              </label>
              <div className="relative">
                <Input
                  id="confirm-password"
                  type={showConfirmPassword ? "text" : "password"}
                  placeholder="Nhập lại mật khẩu"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="h-12 text-base pr-12"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                >
                  {showConfirmPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
            </div>

            {error && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-sm text-red-700">{error}</p>
              </div>
            )}

            <Button
              type="submit"
              disabled={isLoading || !matchPassword}
              className="w-full h-12 bg-[#ff6600] hover:bg-[#ff5500] text-white text-base font-semibold rounded-lg transition-colors"
            >
              {isLoading ? "Đang đăng ký..." : "Đăng ký"}
            </Button>
          </form>

          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-4 bg-white text-gray-500">Hoặc đăng ký với</span>
              </div>
            </div>

            <div className="mt-6">
              <button onClick={() => handleGoogleSignUp()} className="w-full flex items-center justify-center gap-2 px-4 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                  <path
                    fill="#4285F4"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                  />
                  <path
                    fill="#EA4335"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  />
                </svg>
                <span className="text-sm font-medium text-gray-700">Đăng ký với Google</span>
              </button>
            </div>
          </div>

          <p className="mt-8 text-center text-sm text-gray-600">
            Đã có tài khoản?{" "}
            <a onClick={() => router.push("/login")} className="text-[#ff6600] hover:text-[#ff5500] font-semibold">
              Đăng nhập
            </a>
          </p>
        </div>
      </div>
    </div>
  )
}
