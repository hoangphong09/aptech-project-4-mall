"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Heart, Minus, Plus, Star } from "lucide-react"
import { getProducts, transformProductData, SAMPLE_PRODUCT_IDS } from "@/lib/api"
import Link from "next/link"
import { useLanguage } from "@/contexts/language-context"
import { getTranslatedProductTitle } from "@/lib/product-utils"
import { useCart } from "@/contexts/cart-context"
import { useRouter } from "next/navigation"

interface ProductDetailProps {
  productId: string
}

export default function ProductDetail({ productId }: ProductDetailProps) {
  const [product, setProduct] = useState<any>(null)
  const [relatedProducts, setRelatedProducts] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedImage, setSelectedImage] = useState(0)
  const [selectedSize, setSelectedSize] = useState("")
  const [quantity, setQuantity] = useState(1)
  const { t } = useLanguage()
  const { addToCart } = useCart()
  const router = useRouter()
  const [showAddedMessage, setShowAddedMessage] = useState(false)

  useEffect(() => {
    async function fetchProductDetail() {
      setLoading(true)

      // Fetch main product
      const products = await getProducts([productId])
      if (products.length > 0) {
        const transformed = transformProductData(products[0])
        setProduct({
          ...transformed,
          images: products[0].main_imgs || [transformed.image],
          description: products[0].title,
          sales: products[0].sales || 0,
          shopName: products[0].shop_name || "ATlogistics Shop",
          rating: 4.8,
          reviews: 1250,
        })
      }

      // Fetch related products
      const related = await getProducts(SAMPLE_PRODUCT_IDS.recommendations.slice(0, 6))
      setRelatedProducts(related.map((p) => transformProductData(p)))

      setLoading(false)
    }

    fetchProductDetail()
  }, [productId])

  if (loading || !product) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="animate-pulse space-y-4">
          <div className="h-96 bg-gray-200 rounded"></div>
          <div className="h-8 bg-gray-200 rounded w-3/4"></div>
          <div className="h-6 bg-gray-200 rounded w-1/2"></div>
        </div>
      </div>
    )
  }

  const sizes = [
    "80*01 xanh lam",
    "80*02 màu xám",
    "80*03 Lam Hải quân",
    "80*04 Màu xanh",
    "80*07 xanh lam",
    "80*07 xanh lam-đen",
    "80*11 Màu xanh",
    "80*04 xanh lam",
    "80*05 xanh ngọc",
    "80*06 xanh lam",
    "80*08 xanh lam",
    "80*09 xanh lam",
    "80*07 xanh lam-đen",
    "80*10 xanh lam",
    "80*11 Xanh Kurth",
    "80*12 xanh ngọc",
    "80*13 xanh ngọc",
    "80*14 xanh ngọc",
  ]

  const sizeChart = [
    { size: "M", code: "80*01 xanh lam", stock: 200, price: "73,900 đ" },
    { size: "L", code: "80*01 xanh lam", stock: 200, price: "73,900 đ" },
    { size: "XL", code: "80*01 xanh lam", stock: 200, price: "73,900 đ" },
    { size: "XXL", code: "80*01 màu xám", stock: 200, price: "73,900 đ" },
  ]

  const handleAddToCart = () => {
    if (!product) return

    addToCart({
      id: product.id,
      title: product.title,
      titleTranslations: product.titleTranslations,
      price: product.price,
      image: product.image,
      quantity,
      selectedSize,
      selectedColor: selectedSize, // Using size as color for now
    })

    setShowAddedMessage(true)
    setTimeout(() => setShowAddedMessage(false), 2000)
  }

  const handleBuyNow = () => {
    handleAddToCart()
    router.push("/cart")
  }

  return (
    <div className="bg-white">
      {showAddedMessage && (
        <div className="fixed top-20 right-4 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg z-50 animate-in slide-in-from-top">
          ✓ {t("addedToCart")}
        </div>
      )}

      {/* Main Product Section */}
      <div className="container mx-auto px-4 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left: Product Images */}
          <div>
            <div className="bg-white rounded-lg overflow-hidden mb-4">
              <img
                src={product.images[selectedImage] || product.image}
                alt={product.title}
                className="w-full aspect-square object-contain"
              />
            </div>
            <div className="flex gap-2 overflow-x-auto">
              {product.images.map((img: string, idx: number) => (
                <button
                  key={idx}
                  onClick={() => setSelectedImage(idx)}
                  className={`flex-shrink-0 w-20 h-20 rounded border-2 overflow-hidden ${
                    selectedImage === idx ? "border-[#FF6600]" : "border-gray-200"
                  }`}
                >
                  <img
                    src={img || "/placeholder.svg"}
                    alt={`Product ${idx + 1}`}
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>
          </div>

          {/* Right: Product Info */}
          <div>
            <h1 className="text-xl font-medium mb-4 leading-relaxed">{getTranslatedProductTitle(product)}</h1>

            <Button className="bg-[#FF6600] hover:bg-[#FF6600]/90 text-white mb-4 w-full">
              {t("similarProducts")} 73,900 đ
            </Button>

            <div className="mb-6">
              <div className="text-[#FF6600] text-3xl font-bold mb-1">{product.price} đ</div>
              <div className="text-sm text-gray-500">{t("priceIncludesTax")}</div>
            </div>

            {/* Size Selection */}
            <div className="mb-6">
              <div className="flex items-center justify-between mb-3">
                <span className="font-medium">{t("color")}:</span>
                <span className="text-sm text-gray-500">17 {t("colors")}</span>
              </div>
              <div className="grid grid-cols-3 gap-2 max-h-48 overflow-y-auto">
                {sizes.map((size, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedSize(size)}
                    className={`px-3 py-2 text-sm border rounded hover:border-[#FF6600] transition-colors ${
                      selectedSize === size ? "border-[#FF6600] bg-orange-50" : "border-gray-300"
                    }`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>

            {/* Size Chart */}
            <div className="mb-6">
              <div className="flex items-center justify-between mb-3">
                <span className="font-medium">{t("size")}:</span>
              </div>
              <div className="space-y-2">
                {sizeChart.map((item, idx) => (
                  <div key={idx} className="flex items-center justify-between py-2 border-b">
                    <div className="flex-1">
                      <div className="font-medium">{item.size}</div>
                      <div className="text-xs text-gray-500">{item.code}</div>
                    </div>
                    <div className="text-[#FF6600] font-bold mr-4">{item.price}</div>
                    <Button size="sm" variant="outline" className="text-xs bg-transparent">
                      <Plus className="h-3 w-3" />
                    </Button>
                  </div>
                ))}
              </div>
            </div>

            {/* Quantity and Actions */}
            <div className="mb-6">
              <div className="font-medium mb-3">{t("quantity")}:</div>
              <div className="flex items-center gap-4">
                <div className="flex items-center border rounded">
                  <Button
                    size="icon"
                    variant="ghost"
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="h-10 w-10"
                  >
                    <Minus className="h-4 w-4" />
                  </Button>
                  <input
                    type="number"
                    value={quantity}
                    onChange={(e) => setQuantity(Math.max(1, Number.parseInt(e.target.value) || 1))}
                    className="w-16 text-center border-x h-10"
                  />
                  <Button size="icon" variant="ghost" onClick={() => setQuantity(quantity + 1)} className="h-10 w-10">
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
                <div className="text-sm text-gray-500">{t("inStock")}: 999+</div>
              </div>
            </div>

            <div className="flex gap-3">
              <Button onClick={handleAddToCart} className="flex-1 bg-[#FF6600] hover:bg-[#FF6600]/90 text-white h-12">
                {t("addToCart")}
              </Button>
              <Button onClick={handleBuyNow} className="flex-1 bg-orange-700 hover:bg-orange-800 text-white h-12">
                {t("buyNow")}
              </Button>
              <Button size="icon" variant="outline" className="h-12 w-12 bg-transparent">
                <Heart className="h-5 w-5" />
              </Button>
            </div>

            {/* Shop Info */}
            <Card className="mt-6 p-4">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center">
                  <span className="text-2xl">🏪</span>
                </div>
                <div className="flex-1">
                  <div className="font-medium">{product.shopName}</div>
                  <div className="flex items-center gap-1 text-sm text-yellow-500">
                    <Star className="h-4 w-4 fill-current" />
                    <span className="text-gray-900 font-medium">{product.rating}</span>
                    <span className="text-gray-500">({product.reviews})</span>
                  </div>
                </div>
              </div>
              <div className="grid grid-cols-3 gap-4 text-center text-sm">
                <div>
                  <div className="text-gray-500">{t("products")}</div>
                  <div className="font-medium">1,234</div>
                </div>
                <div>
                  <div className="text-gray-500">{t("returnRate")}</div>
                  <div className="font-medium text-green-600">80%</div>
                </div>
                <div>
                  <div className="text-gray-500">{t("responseRate")}</div>
                  <div className="font-medium text-green-600">90%</div>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>

      {/* Related Products */}
      <div className="bg-gray-50 py-8">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl font-bold mb-6">{t("relatedProducts")}</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {relatedProducts.map((item) => (
              <Link key={item.id} href={`/product/${item.id}`}>
                <Card className="group cursor-pointer hover:shadow-lg transition-shadow overflow-hidden">
                  <div className="relative">
                    <img
                      src={item.image || "/placeholder.svg"}
                      alt={item.title}
                      className="w-full aspect-square object-cover group-hover:scale-105 transition-transform"
                    />
                    <div className="absolute top-2 left-2 bg-red-600 text-white text-xs px-2 py-1 rounded">1688</div>
                  </div>
                  <div className="p-3">
                    <h3 className="text-sm line-clamp-2 mb-2 min-h-[40px]">{getTranslatedProductTitle(item)}</h3>
                    <div className="text-[#FF6600] font-bold">{item.price} đ</div>
                    <div className="text-xs text-gray-500 mt-1">
                      {t("sold")}: {item.views}
                    </div>
                  </div>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* Product Information */}
      <div className="container mx-auto px-4 py-8">
        <h2 className="text-2xl font-bold mb-6">{t("productInfo")}</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
          <div>
            <div className="text-gray-500 mb-1">{t("productCategory")}</div>
            <div className="font-medium">{product.category || t("tshirt")}</div>
          </div>
          <div>
            <div className="text-gray-500 mb-1">{t("material")}</div>
            <div className="font-medium">{t("cotton")}</div>
          </div>
          <div>
            <div className="text-gray-500 mb-1">{t("origin")}</div>
            <div className="font-medium">{t("china")}</div>
          </div>
          <div>
            <div className="text-gray-500 mb-1">{t("brand")}</div>
            <div className="font-medium">OEM</div>
          </div>
        </div>
      </div>

      {/* Size Chart Table */}
      <div className="container mx-auto px-4 py-8">
        <h2 className="text-2xl font-bold mb-6">{t("sizeWeight")}</h2>
        <div className="overflow-x-auto">
          <table className="w-full border-collapse border">
            <thead>
              <tr className="bg-gray-50">
                <th className="border p-3 text-left">{t("size")}</th>
                <th className="border p-3 text-left">{t("colorCode")}</th>
                <th className="border p-3 text-left">{t("availableStock")}</th>
                <th className="border p-3 text-left">{t("height")}</th>
                <th className="border p-3 text-left">{t("length")}</th>
                <th className="border p-3 text-left">{t("width")}</th>
              </tr>
            </thead>
            <tbody>
              {["M", "L", "XL", "XXL", "XXXL"].map((size, idx) => (
                <tr key={idx} className="hover:bg-gray-50">
                  <td className="border p-3">{size}</td>
                  <td className="border p-3">80*01 xanh lam</td>
                  <td className="border p-3">200</td>
                  <td className="border p-3">{65 + idx * 2}</td>
                  <td className="border p-3">{57 + idx * 2}</td>
                  <td className="border p-3">{30 + idx}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Product Description */}
      <div className="container mx-auto px-4 py-8">
        <h2 className="text-2xl font-bold mb-6">{t("productDescription")}</h2>
        <div className="prose max-w-none">
          <img
            src={product.image || "/placeholder.svg"}
            alt="Product description"
            className="w-full max-w-2xl mx-auto rounded-lg"
          />
        </div>
      </div>
    </div>
  )
}
