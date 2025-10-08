"use client"

import { useCart } from "@/contexts/cart-context"
import { useLanguage } from "@/contexts/language-context"
import { getTranslatedProductTitle } from "@/lib/product-utils"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Minus, Plus, Trash2, ShoppingBag } from "lucide-react"
import Link from "next/link"
import Header from "@/components/header"
import Footer from "@/components/footer"

export default function CartPage() {
  const { items, removeFromCart, updateQuantity, getTotalPrice } = useCart()
  const { t } = useLanguage()

  const formatPrice = (price: string) => {
    const numPrice = Number.parseFloat(price.replace(/[^\d.]/g, ""))
    return numPrice.toLocaleString("vi-VN")
  }

  const totalPrice = getTotalPrice()

  if (items.length === 0) {
    return (
      <>
        <Header />
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <Card className="p-12 text-center max-w-md">
            <ShoppingBag className="h-24 w-24 text-gray-300 mx-auto mb-6" />
            <h2 className="text-2xl font-bold mb-4">{t("cartEmpty")}</h2>
            <p className="text-gray-500 mb-6">{t("continueShopping")}</p>
            <Link href="/">
              <Button className="bg-[#FF6600] hover:bg-[#FF6600]/90 text-white">{t("continueShopping")}</Button>
            </Link>
          </Card>
        </div>
        <Footer />
      </>
    )
  }

  return (
    <>
      <Header />
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="container mx-auto px-4">
          <h1 className="text-3xl font-bold mb-8">
            {t("cart")} ({items.length} {t("itemsInCart")})
          </h1>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Cart Items */}
            <div className="lg:col-span-2 space-y-4">
              {items.map((item, index) => (
                <Card key={`${item.id}-${index}`} className="p-6">
                  <div className="flex gap-6">
                    <img
                      src={item.image || "/placeholder.svg"}
                      alt={item.title}
                      className="w-32 h-32 object-cover rounded-lg"
                    />

                    <div className="flex-1">
                      <h3 className="font-medium text-lg mb-2 line-clamp-2">{getTranslatedProductTitle(item)}</h3>

                      {item.selectedSize && (
                        <p className="text-sm text-gray-500 mb-2">
                          {t("size")}: {item.selectedSize}
                        </p>
                      )}

                      <div className="text-[#FF6600] text-xl font-bold mb-4">{item.price} đ</div>

                      <div className="flex items-center justify-between">
                        <div className="flex items-center border rounded">
                          <Button
                            size="icon"
                            variant="ghost"
                            onClick={() => updateQuantity(`${item.id}-${index}`, item.quantity - 1)}
                            className="h-10 w-10"
                          >
                            <Minus className="h-4 w-4" />
                          </Button>
                          <span className="w-16 text-center">{item.quantity}</span>
                          <Button
                            size="icon"
                            variant="ghost"
                            onClick={() => updateQuantity(`${item.id}-${index}`, item.quantity + 1)}
                            className="h-10 w-10"
                          >
                            <Plus className="h-4 w-4" />
                          </Button>
                        </div>

                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => removeFromCart(`${item.id}-${index}`)}
                          className="text-red-600 hover:text-red-700 hover:bg-red-50"
                        >
                          <Trash2 className="h-4 w-4 mr-2" />
                          {t("remove")}
                        </Button>
                      </div>
                    </div>
                  </div>
                </Card>
              ))}
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <Card className="p-6 sticky top-24">
                <h2 className="text-xl font-bold mb-6">{t("orderSummary")}</h2>

                <div className="space-y-4 mb-6">
                  <div className="flex justify-between text-gray-600">
                    <span>{t("subtotal")}</span>
                    <span>{formatPrice(totalPrice.toString())} đ</span>
                  </div>
                  <div className="border-t pt-4 flex justify-between font-bold text-lg">
                    <span>{t("total")}</span>
                    <span className="text-[#FF6600]">{formatPrice(totalPrice.toString())} đ</span>
                  </div>
                </div>

                <Button className="w-full bg-[#FF6600] hover:bg-[#FF6600]/90 text-white h-12 text-lg">
                  {t("proceedToCheckout")}
                </Button>

                <Link href="/">
                  <Button variant="outline" className="w-full mt-3 bg-transparent">
                    {t("continueShopping")}
                  </Button>
                </Link>
              </Card>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  )
}
