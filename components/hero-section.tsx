"use client"

import { useLanguage } from "@/contexts/language-context"
import { useEffect, useState } from "react"

interface Category {
  id: string
  name: string
  icon?: string
}

const categoryTranslations: Record<string, { vi: string; en: string; zh: string }> = {
  服装服饰: { vi: "Thời trang", en: "Fashion", zh: "服装服饰" },
  母婴用品: { vi: "Mẹ và bé", en: "Mother & Baby", zh: "母婴用品" },
  电子配件: { vi: "Phụ kiện điện tử", en: "Electronics", zh: "电子配件" },
  办公文具: { vi: "Văn phòng phẩm", en: "Office Supplies", zh: "办公文具" },
  美容护理: { vi: "Sức khỏe & Sắc đẹp", en: "Health & Beauty", zh: "美容护理" },
  家用电器: { vi: "Điện gia dụng", en: "Home Appliances", zh: "家用电器" },
  汽车配件: { vi: "Phụ kiện & trang trí", en: "Accessories & Decor", zh: "汽车配件" },
  运动户外: { vi: "Thể thao & dã ngoại", en: "Sports & Outdoor", zh: "运动户外" },
  箱包皮具: { vi: "Túi xách, vali", en: "Bags & Luggage", zh: "箱包皮具" },
}

export default function HeroSection() {
  const { t, language } = useLanguage()
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchCategories() {
      try {
        console.log("[v0] Fetching categories from API")
        const response = await fetch("/api/categories")

        if (!response.ok) {
          console.error("[v0] Failed to fetch categories:", response.status)
          setLoading(false)
          return
        }

        const data = await response.json()
        console.log("[v0] Categories loaded:", data.categories?.length || 0)
        setCategories(data.categories || [])
      } catch (error) {
        console.error("[v0] Error fetching categories:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchCategories()
  }, [])

  const translateCategoryName = (name: string): string => {
    const translation = categoryTranslations[name]
    if (translation) {
      return translation[language]
    }
    return name
  }

  return (
    <div className="bg-[#f9f6f0] py-6">
      <div className="container mx-auto px-4">
        <div className="flex gap-5">
          <aside className="hidden lg:block w-64 flex-shrink-0">
            <div className="bg-[#fdfbf7] rounded-lg shadow-md border border-[#e8dcc8]">
              <div className="flex items-center gap-2 p-4 border-b border-[#e8dcc8] bg-[#f5ede0]">
                <svg className="w-5 h-5 text-[#8b6f47]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
                <h3 className="font-semibold text-base text-[#5a4a3a]">{t("categories")}</h3>
              </div>
              <nav className="py-2">
                {loading ? (
                  <div className="px-4 py-8 text-center text-sm text-[#8b6f47]">
                    {language === "vi" ? "Đang tải..." : language === "en" ? "Loading..." : "加载中..."}
                  </div>
                ) : categories.length > 0 ? (
                  categories.map((category) => (
                    <a
                      key={category.id}
                      href="#"
                      className="flex items-center gap-3 px-4 py-2.5 hover:bg-[#f5ede0] transition-colors text-[#6b5744]"
                    >
                      <span className="text-lg">{category.icon || "📦"}</span>
                      <span className="text-sm">{translateCategoryName(category.name)}</span>
                    </a>
                  ))
                ) : (
                  <div className="px-4 py-8 text-center text-sm text-[#8b6f47]">
                    {language === "vi" ? "Không có danh mục" : language === "en" ? "No categories" : "没有分类"}
                  </div>
                )}
              </nav>
            </div>
          </aside>

          {/* Main hero image - takes up 3 columns for larger display */}
          <div className="flex-1 grid grid-cols-1 lg:grid-cols-4 gap-4">
            <div className="lg:col-span-3 relative overflow-hidden rounded-lg shadow-lg bg-white">
              <img
                src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-HQknbY84cjN01vMx2oJDjCc2VSNdz0.png"
                alt="Nhập hàng Trung giá gốc"
                className="w-full h-auto object-contain block"
              />
            </div>

            {/* Right Side Banners - takes up 1 column */}
            <div className="flex flex-col gap-4">
              <div className="relative overflow-hidden rounded-lg shadow-lg border-4 border-[#d4c4a8] min-h-[180px] flex-1">
                <img
                  src="/vintage-style-red-promotional-banner-with-deals-an.jpg"
                  alt="Ngàn deal bùng nổ"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-br from-red-900/20 via-transparent to-amber-900/20 pointer-events-none" />
              </div>

              <div className="relative overflow-hidden rounded-lg shadow-lg border-4 border-[#d4c4a8] min-h-[180px] flex-1">
                <img
                  src="/vintage-style-mobile-app-promotional-banner-with-p.jpg"
                  alt="App Mobile"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-br from-amber-100/30 via-transparent to-orange-900/20 pointer-events-none" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
