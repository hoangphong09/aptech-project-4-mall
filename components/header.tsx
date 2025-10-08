"use client"

import {
  Search,
  ShoppingCart,
  Bell,
  Camera,
  Smartphone,
  ChevronDown,
  LogOut,
  User,
  Settings,
  Globe,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { useLanguage } from "@/contexts/language-context"
import { useCart } from "@/contexts/cart-context"
import type { Language } from "@/lib/translations"

export default function Header() {
  const router = useRouter()
  const [showUserMenu, setShowUserMenu] = useState(false)
  const [showLanguageMenu, setShowLanguageMenu] = useState(false)
  const { language, setLanguage, t } = useLanguage()
  const { getTotalItems } = useCart()
  const cartItemCount = getTotalItems()

  const languages: { code: Language; label: string; flag: string }[] = [
    { code: "vi", label: "Tiếng Việt", flag: "🇻🇳" },
    { code: "en", label: "English", flag: "🇬🇧" },
    { code: "zh", label: "中文", flag: "🇨🇳" },
  ]

  const currentLanguage = languages.find((lang) => lang.code === language)

  return (
    <>
      <div className="bg-[#ff6600] text-white py-2 px-4 text-sm">
        <div className="container mx-auto flex items-center justify-between">
          <div className="flex items-center gap-6">
            <Link href="/" className="hover:underline">
              {t("home")}
            </Link>
            <a href="#" className="hover:underline">
              {t("fees")}
            </a>
            <a href="#" className="hover:underline">
              {t("contact")}
            </a>
            <a href="#" className="hover:underline">
              {t("guide")}
            </a>
          </div>
          <div className="flex items-center gap-4">
            <span>{t("exchangeRate")}</span>
            <Link href="/cart" className="hover:opacity-80 relative">
              <ShoppingCart className="h-4 w-4" />
              {cartItemCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-bold">
                  {cartItemCount}
                </span>
              )}
            </Link>
            <button className="hover:opacity-80">
              <Bell className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>

      <header className="bg-white border-b sticky top-0 z-50 shadow-sm">
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center gap-4">
            <Link href="/" className="flex items-center gap-2 flex-shrink-0 hover:opacity-80 transition-opacity">
              <div className="bg-[#ff6600] rounded-lg p-1.5 w-9 h-9 flex items-center justify-center">
                <svg viewBox="0 0 24 24" fill="white" className="w-6 h-6">
                  <path d="M3 13h8V3H3v10zm0 8h8v-6H3v6zm10 0h8V11h-8v10zm0-18v6h8V3h-8z" />
                </svg>
              </div>
              <div className="font-bold text-xl">
                <span className="text-gray-800">AT</span>
                <span className="text-[#ff6600]">logistics</span>
              </div>
            </Link>

            <div className="flex-1 max-w-3xl">
              <div className="flex items-center border rounded-lg overflow-hidden">
                <div className="relative bg-[#ff6600] text-white px-3 py-2 flex items-center gap-1 cursor-pointer hover:bg-[#ff5500] transition-colors">
                  <span className="text-sm font-medium whitespace-nowrap">1688</span>
                  <span className="text-xs">1688.com</span>
                  <ChevronDown className="h-3 w-3 ml-1" />
                </div>
                <Input
                  placeholder={t("searchPlaceholder")}
                  className="border-0 rounded-none h-10 flex-1 focus-visible:ring-0 focus-visible:ring-offset-0"
                />
                <Button className="h-10 rounded-none bg-[#ff6600] hover:bg-[#ff5500] px-6">
                  <Search className="h-5 w-5" />
                </Button>
              </div>
            </div>

            <div className="flex items-center gap-3 flex-shrink-0">
              <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                <Camera className="h-5 w-5 text-gray-600" />
              </button>

              <div className="flex items-center gap-2 px-3 py-2 border border-[#ff6600] rounded-lg hover:bg-orange-50 transition-colors cursor-pointer">
                <div className="bg-[#ff6600] rounded p-1">
                  <svg viewBox="0 0 24 24" fill="white" className="w-4 h-4">
                    <path d="M12 2L2 7v10c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V7l-10-5z" />
                  </svg>
                </div>
                <div className="text-left">
                  <div className="text-[10px] text-[#ff6600] font-semibold leading-tight">{t("extension")}</div>
                  <div className="text-[10px] text-gray-700 leading-tight">{t("easyShop")}</div>
                </div>
              </div>

              <button className="flex flex-col items-center gap-0.5 px-2 py-1 hover:bg-gray-100 rounded-lg transition-colors">
                <Smartphone className="h-5 w-5 text-[#ff6600]" />
                <span className="text-[10px] text-gray-700">{t("downloadApp")}</span>
              </button>

              <div className="relative">
                <button
                  className="flex items-center gap-1 px-2 py-1 hover:bg-gray-100 rounded-lg transition-colors"
                  onClick={() => setShowLanguageMenu(!showLanguageMenu)}
                >
                  <Globe className="h-5 w-5 text-gray-600" />
                  <span className="text-lg">{currentLanguage?.flag}</span>
                  <ChevronDown className="h-3 w-3 text-gray-600" />
                </button>

                {showLanguageMenu && (
                  <>
                    <div className="fixed inset-0 z-40" onClick={() => setShowLanguageMenu(false)} />
                    <div className="absolute right-0 top-full mt-2 w-40 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-50">
                      {languages.map((lang) => (
                        <button
                          key={lang.code}
                          onClick={() => {
                            setLanguage(lang.code)
                            setShowLanguageMenu(false)
                          }}
                          className={`flex items-center gap-2 px-4 py-2 hover:bg-gray-50 transition-colors w-full text-left ${
                            language === lang.code ? "bg-orange-50" : ""
                          }`}
                        >
                          <span className="text-lg">{lang.flag}</span>
                          <span className="text-sm text-gray-700">{lang.label}</span>
                        </button>
                      ))}
                    </div>
                  </>
                )}
              </div>

              <div className="relative">
                <div
                  className="flex items-center gap-2 cursor-pointer hover:bg-gray-100 px-2 py-1 rounded-lg transition-colors"
                  onClick={() => setShowUserMenu(!showUserMenu)}
                >
                  <div className="w-9 h-9 rounded-full bg-gray-400 flex items-center justify-center text-white font-semibold">
                    P
                  </div>
                  <span className="text-sm text-gray-700 hidden lg:inline">{t("userName")}</span>
                  <ChevronDown className="h-4 w-4 text-gray-600 hidden lg:inline" />
                </div>

                {showUserMenu && (
                  <>
                    <div className="fixed inset-0 z-40" onClick={() => setShowUserMenu(false)} />
                    <div className="absolute right-0 top-full mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50">
                      <Link
                        href="/profile"
                        className="flex items-center gap-3 px-4 py-2 hover:bg-gray-50 transition-colors"
                        onClick={() => setShowUserMenu(false)}
                      >
                        <User className="h-4 w-4 text-gray-600" />
                        <span className="text-sm text-gray-700">{t("account")}</span>
                      </Link>
                      <Link
                        href="/settings"
                        className="flex items-center gap-3 px-4 py-2 hover:bg-gray-50 transition-colors"
                        onClick={() => setShowUserMenu(false)}
                      >
                        <Settings className="h-4 w-4 text-gray-600" />
                        <span className="text-sm text-gray-700">{t("settings")}</span>
                      </Link>
                      <div className="border-t border-gray-200 my-2" />
                      <button
                        onClick={() => {
                          setShowUserMenu(false)
                          router.push("/login")
                        }}
                        className="flex items-center gap-3 px-4 py-2 hover:bg-gray-50 transition-colors w-full text-left"
                      >
                        <LogOut className="h-4 w-4 text-red-600" />
                        <span className="text-sm text-red-600">{t("logout")}</span>
                      </button>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </header>
    </>
  )
}
