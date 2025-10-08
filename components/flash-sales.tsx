"use client"

import { useState, useEffect, useRef } from "react"
import { Heart, ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { getProducts, SAMPLE_PRODUCT_IDS, transformProductData } from "@/lib/api"
import Link from "next/link"
import { useLanguage } from "@/contexts/language-context"
import { getTranslatedProductTitle } from "@/lib/product-utils"

export default function FlashSales() {
  const { t, language } = useLanguage()
  const [timeLeft, setTimeLeft] = useState({ hours: 12, minutes: 1, seconds: 47 })
  const [flashProducts, setFlashProducts] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const scrollContainerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev.seconds > 0) {
          return { ...prev, seconds: prev.seconds - 1 }
        } else if (prev.minutes > 0) {
          return { ...prev, minutes: prev.minutes - 1, seconds: 59 }
        } else if (prev.hours > 0) {
          return { hours: prev.hours - 1, minutes: 59, seconds: 59 }
        }
        return prev
      })
    }, 1000)

    return () => clearInterval(timer)
  }, [])

  useEffect(() => {
    async function fetchProducts() {
      setLoading(true)

      const products = await getProducts(SAMPLE_PRODUCT_IDS.flashSales)
      const transformed = products.map((p, index) => ({
        ...transformProductData(p),
        originalProduct: p,
        discount: index === 0 ? 31 : index === 1 ? 17 : index === 2 ? 12 : index === 3 ? 22 : index === 4 ? 5 : 6,
        sold:
          index === 0
            ? 17840
            : index === 1
              ? 11225
              : index === 2
                ? 11149
                : index === 3
                  ? 7530
                  : index === 4
                    ? 5373
                    : 3052,
        badge: index === 2 ? "YUSHU" : undefined,
        priceVND:
          index === 0
            ? "144,020"
            : index === 1
              ? "73,905"
              : index === 2
                ? "204,660"
                : index === 3
                  ? "238,770"
                  : index === 4
                    ? "83,380"
                    : "109,910",
        originalPriceYuan:
          index === 0
            ? "¥38"
            : index === 1
              ? "¥19.5"
              : index === 2
                ? "¥54"
                : index === 3
                  ? "¥63"
                  : index === 4
                    ? "¥22"
                    : "¥29",
      }))

      setFlashProducts(transformed)
      setLoading(false)
    }

    fetchProducts()
  }, [])

  const scroll = (direction: "left" | "right") => {
    if (scrollContainerRef.current) {
      const scrollAmount = 600
      scrollContainerRef.current.scrollBy({
        left: direction === "left" ? -scrollAmount : scrollAmount,
        behavior: "smooth",
      })
    }
  }

  if (loading) {
    return (
      <div>
        <div className="bg-white rounded-lg p-4 shadow-sm">
          <div className="h-8 bg-muted rounded w-1/4 mb-4 animate-pulse"></div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="border rounded-lg overflow-hidden">
                <div className="aspect-square bg-muted animate-pulse"></div>
                <div className="p-2 space-y-2">
                  <div className="h-4 bg-muted rounded animate-pulse"></div>
                  <div className="h-4 bg-muted rounded w-2/3 animate-pulse"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div>
      <div className="bg-gradient-to-br from-orange-50 via-white to-red-50 rounded-2xl p-8 shadow-md border border-orange-100">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-6">
            <h2 className="text-3xl font-bold bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent">
              {t("flashSales")}
            </h2>
            <div className="flex items-center gap-2 text-base">
              <div className="bg-gradient-to-br from-orange-500 to-red-500 text-white px-3 py-2 rounded-lg font-bold min-w-[48px] text-center shadow-md">
                {String(timeLeft.hours).padStart(2, "0")}
              </div>
              <span className="font-semibold text-gray-700">{t("hours")}</span>
              <span className="font-bold text-orange-500">:</span>
              <div className="bg-gradient-to-br from-orange-500 to-red-500 text-white px-3 py-2 rounded-lg font-bold min-w-[48px] text-center shadow-md">
                {String(timeLeft.minutes).padStart(2, "0")}
              </div>
              <span className="font-semibold text-gray-700">{t("minutes")}</span>
              <span className="font-bold text-orange-500">:</span>
              <div className="bg-gradient-to-br from-orange-500 to-red-500 text-white px-3 py-2 rounded-lg font-bold min-w-[48px] text-center shadow-md">
                {String(timeLeft.seconds).padStart(2, "0")}
              </div>
              <span className="font-semibold text-gray-700">{t("seconds")}</span>
            </div>
          </div>
        </div>

        <div className="relative">
          <Button
            onClick={() => scroll("left")}
            variant="outline"
            size="icon"
            className="absolute left-0 top-1/2 -translate-y-1/2 z-20 h-12 w-12 rounded-full bg-white/95 backdrop-blur-sm border-2 border-orange-200 hover:bg-orange-50 hover:border-orange-300 shadow-lg transition-all"
          >
            <ChevronLeft className="h-6 w-6 text-orange-600" />
          </Button>

          <div ref={scrollContainerRef} className="flex gap-5 overflow-x-auto scrollbar-hide scroll-smooth px-14 py-2">
            {flashProducts.map((product) => (
              <Link key={product.id} href={`/product/${product.id}`} className="flex-shrink-0 w-[240px]">
                <div className="group cursor-pointer bg-white rounded-xl hover:shadow-2xl transition-all duration-300 overflow-hidden h-[420px] flex flex-col border-2 border-transparent hover:border-orange-200">
                  <div className="relative flex-shrink-0 h-[240px] bg-gradient-to-br from-gray-50 to-gray-100">
                    {product.badge && (
                      <div className="absolute top-3 left-3 bg-gradient-to-r from-red-600 to-red-500 text-white text-xs px-3 py-1.5 rounded-lg z-10 font-bold shadow-md">
                        {product.badge}
                      </div>
                    )}
                    <div className="absolute top-3 left-3 bg-gradient-to-r from-red-600 to-red-500 text-white text-xs px-3 py-1.5 rounded-lg font-bold z-10 shadow-md">
                      1688
                    </div>
                    <div className="absolute top-3 right-3 bg-gradient-to-br from-yellow-400 to-orange-400 text-white text-sm font-bold px-3 py-1.5 rounded-lg shadow-md z-10">
                      -{product.discount}%
                    </div>
                    <div className="w-full h-full overflow-hidden">
                      <img
                        src={product.image || "/placeholder.svg"}
                        alt={product.title}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      />
                    </div>
                    <button className="absolute bottom-3 right-3 bg-white/95 hover:bg-white p-2.5 rounded-full shadow-lg hover:shadow-xl transition-all">
                      <Heart className="h-5 w-5 text-gray-600 hover:text-red-500 transition-colors" />
                    </button>
                  </div>
                  <div className="p-4 flex-1 flex flex-col bg-white">
                    <h3 className="text-sm font-medium line-clamp-2 mb-3 h-[42px] text-gray-800 group-hover:text-gray-900 leading-relaxed">
                      {product.originalProduct
                        ? getTranslatedProductTitle(product.originalProduct, language)
                        : product.title}
                    </h3>
                    <div className="flex items-center gap-2 mb-3">
                      <span className="bg-gradient-to-r from-red-50 to-orange-50 text-red-600 text-xs px-2.5 py-1 rounded-full font-semibold border border-red-200">
                        {product.discount}% {t("buyAgain")}
                      </span>
                      <span className="text-xs text-gray-600 font-medium bg-gray-100 px-2.5 py-1 rounded-full">
                        {t("sold")} {product.sold.toLocaleString()}
                      </span>
                    </div>
                    <div className="flex items-baseline gap-2 mt-auto">
                      <span className="text-orange-600 font-bold text-xl">{product.priceVND} đ</span>
                      <span className="text-sm text-gray-400 line-through font-medium">
                        {product.originalPriceYuan}
                      </span>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>

          <Button
            onClick={() => scroll("right")}
            variant="outline"
            size="icon"
            className="absolute right-0 top-1/2 -translate-y-1/2 z-20 h-12 w-12 rounded-full bg-white/95 backdrop-blur-sm border-2 border-orange-200 hover:bg-orange-50 hover:border-orange-300 shadow-lg transition-all"
          >
            <ChevronRight className="h-6 w-6 text-orange-600" />
          </Button>
        </div>
      </div>
    </div>
  )
}
