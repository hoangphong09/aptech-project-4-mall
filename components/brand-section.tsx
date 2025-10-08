"use client"

import { useState, useEffect, useRef } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Heart, ChevronLeft, ChevronRight } from "lucide-react"
import { getProducts } from "@/lib/api"
import type { Product1688 } from "@/lib/api"
import Link from "next/link"
import { useLanguage } from "@/contexts/language-context"
import { getTranslatedProductTitle } from "@/lib/product-utils"

interface BrandSectionProps {
  title: string
  brands: Array<{ name: string; logo?: string }>
  productIds: string[]
}

export default function BrandSection({ title, brands, productIds }: BrandSectionProps) {
  const { t, language } = useLanguage()
  const [products, setProducts] = useState<Product1688[]>([])
  const [loading, setLoading] = useState(true)
  const [activeBrand, setActiveBrand] = useState(0)
  const scrollContainerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    async function fetchProducts() {
      setLoading(true)
      const fetchedProducts = await getProducts(productIds)
      setProducts(fetchedProducts)
      setLoading(false)
    }

    fetchProducts()
  }, [productIds])

  const scroll = (direction: "left" | "right") => {
    if (scrollContainerRef.current) {
      const scrollAmount = 600
      scrollContainerRef.current.scrollBy({
        left: direction === "left" ? -scrollAmount : scrollAmount,
        behavior: "smooth",
      })
    }
  }

  const getDiscountPercentage = (price: string, originalPrice: string) => {
    const priceNum = Number.parseFloat(price)
    const originalNum = Number.parseFloat(originalPrice)
    if (originalNum > priceNum) {
      return Math.round(((originalNum - priceNum) / originalNum) * 100)
    }
    return 0
  }

  if (loading) {
    return (
      <div className="bg-white rounded-lg p-8">
        <div className="h-8 bg-muted rounded w-1/4 mb-6 animate-pulse"></div>
        <div className="flex gap-6 mb-6 border-b pb-4">
          {brands.map((brand, i) => (
            <div key={i} className="h-10 w-24 bg-muted rounded animate-pulse"></div>
          ))}
        </div>
        <div className="flex gap-4 overflow-hidden">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="flex-shrink-0 w-[220px]">
              <div className="aspect-square bg-muted animate-pulse rounded"></div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="bg-gradient-to-br from-blue-50 via-white to-indigo-50 rounded-2xl p-10 shadow-md border border-blue-100">
      <h2 className="text-3xl font-bold mb-8 bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
        {title}
      </h2>

      <div className="flex items-center gap-3 mb-8 overflow-x-auto scrollbar-hide pb-2">
        {brands.map((brand, index) => (
          <button
            key={index}
            onClick={() => setActiveBrand(index)}
            className={`flex items-center gap-2.5 px-5 py-3 rounded-full flex-shrink-0 transition-all duration-300 font-semibold text-sm ${
              activeBrand === index
                ? "bg-gradient-to-r from-blue-500 to-indigo-500 text-white shadow-lg scale-105"
                : "bg-white text-gray-600 hover:bg-gray-50 border-2 border-gray-200 hover:border-blue-300 hover:text-blue-600"
            }`}
          >
            {brand.logo && (
              <img
                src={brand.logo || "/placeholder.svg"}
                alt={brand.name}
                className={`h-6 w-6 object-contain transition-transform ${
                  activeBrand === index ? "scale-110" : "group-hover:scale-110"
                }`}
              />
            )}
            <span className="whitespace-nowrap">{brand.name}</span>
          </button>
        ))}
      </div>

      <div className="relative">
        <Button
          onClick={() => scroll("left")}
          size="icon"
          variant="ghost"
          className="absolute left-0 top-1/2 -translate-y-1/2 z-20 bg-white/95 backdrop-blur-sm hover:bg-blue-50 rounded-full h-14 w-14 border-2 border-blue-200 hover:border-blue-300 shadow-xl transition-all"
        >
          <ChevronLeft className="h-7 w-7 text-blue-600" />
        </Button>

        <div ref={scrollContainerRef} className="flex gap-8 overflow-x-auto scrollbar-hide scroll-smooth px-20 py-4">
          {products.map((product) => {
            const discount = getDiscountPercentage(product.price, product.original_price)
            const priceInVND = Math.round(Number.parseFloat(product.price) * 1000)
            const originalPriceInYuan = Math.round(Number.parseFloat(product.original_price) / 1000)

            return (
              <Link key={product.item_id} href={`/product/${product.item_id}`} className="flex-shrink-0 w-[300px]">
                <Card className="group cursor-pointer hover:shadow-2xl transition-all duration-300 h-[480px] overflow-hidden flex flex-col border-2 border-gray-200 hover:border-blue-400 bg-white rounded-xl">
                  <div className="relative flex-shrink-0 h-[280px] bg-gradient-to-br from-gray-50 to-white overflow-hidden">
                    <div className="absolute top-4 left-4 bg-gradient-to-r from-red-600 to-red-500 text-white text-xs font-bold px-3.5 py-2 rounded-lg shadow-lg z-10">
                      1688
                    </div>

                    <div className="absolute top-4 right-4 bg-gradient-to-br from-gray-900 to-black text-white text-sm font-bold px-3.5 py-2 rounded-lg shadow-lg z-10 border border-white/20">
                      毒
                    </div>

                    {discount > 0 && (
                      <div className="absolute top-16 right-4 bg-gradient-to-br from-orange-500 to-red-500 text-white text-xs font-bold px-3 py-1.5 rounded-lg shadow-lg z-10">
                        -{discount}%
                      </div>
                    )}

                    <div className="w-full h-full flex items-center justify-center p-6">
                      <img
                        src={product.main_imgs[0] || "/placeholder.svg?height=280&width=280"}
                        alt={product.title}
                        className="max-w-full max-h-full object-contain group-hover:scale-110 transition-transform duration-500"
                      />
                    </div>

                    <Button
                      size="icon"
                      variant="ghost"
                      className="absolute bottom-4 right-4 bg-white/95 hover:bg-white rounded-full h-11 w-11 shadow-lg hover:shadow-xl transition-all hover:scale-110"
                      onClick={(e) => e.preventDefault()}
                    >
                      <Heart className="h-5 w-5 text-gray-600 hover:text-red-500 transition-colors" />
                    </Button>
                  </div>

                  <div className="p-6 flex flex-col flex-1 bg-white">
                    <h3 className="text-sm font-medium leading-relaxed line-clamp-2 mb-4 h-[44px] overflow-hidden text-gray-800 group-hover:text-blue-600 transition-colors">
                      {getTranslatedProductTitle(product, language)}
                    </h3>

                    <div className="flex items-center gap-2 mb-4 flex-shrink-0 flex-wrap">
                      {discount > 0 && (
                        <span className="text-xs font-semibold text-orange-600 bg-gradient-to-r from-orange-50 to-red-50 px-3 py-1.5 rounded-full border border-orange-200">
                          {discount}% {t("buyAgain")}
                        </span>
                      )}
                      <span className="text-xs text-gray-600 font-medium bg-gray-100 px-3 py-1.5 rounded-full">
                        {t("sold")} {product.sales.toLocaleString()}
                      </span>
                    </div>

                    <div className="mt-auto flex-shrink-0">
                      <div className="text-transparent bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text font-bold text-2xl mb-1.5">
                        {priceInVND.toLocaleString()} đ
                      </div>
                      <div className="text-gray-400 text-sm line-through font-medium">¥{originalPriceInYuan}</div>
                    </div>
                  </div>
                </Card>
              </Link>
            )
          })}
        </div>

        <Button
          onClick={() => scroll("right")}
          size="icon"
          variant="ghost"
          className="absolute right-0 top-1/2 -translate-y-1/2 z-20 bg-white/95 backdrop-blur-sm hover:bg-blue-50 rounded-full h-14 w-14 border-2 border-blue-200 hover:border-blue-300 shadow-xl transition-all"
        >
          <ChevronRight className="h-7 w-7 text-blue-600" />
        </Button>
      </div>
    </div>
  )
}
