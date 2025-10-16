"use client"

import { useState } from "react"
import { useCart } from "@/contexts/cart-context"
import { useLanguage } from "@/contexts/language-context"
import { getTranslatedProductTitle } from "@/lib/product-utils"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Minus, Plus, Trash2, ShoppingBag, CreditCard, Banknote, Building2, CheckCircle2, QrCode } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import Header from "@/components/header"
import Footer from "@/components/footer"

export default function CartPage() {
  const { items, removeFromCart, updateQuantity, getTotalPrice, clearCart } = useCart()
  const { t } = useLanguage()
  const router = useRouter()

  const [showCheckout, setShowCheckout] = useState(false)
  const [paymentMethod, setPaymentMethod] = useState<"cod" | "banking" | "card">("cod")
  const [orderPlaced, setOrderPlaced] = useState(false)
  const [orderNumber, setOrderNumber] = useState("")
  const [formData, setFormData] = useState({
    fullName: "",
    phoneNumber: "",
    address: "",
    notes: "",
  })
  const [cardData, setCardData] = useState({
    cardNumber: "",
    cardHolder: "",
    expiry: "",
    cvv: "",
  })
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [cardErrors, setCardErrors] = useState<Record<string, string>>({})

  const formatPrice = (price: string) => {
    const numPrice = Number.parseFloat(price.replace(/[^\d.]/g, ""))
    return numPrice.toLocaleString("vi-VN")
  }

  const totalPrice = getTotalPrice()
  const shippingFee = totalPrice > 500000 ? 0 : 30000 // Free shipping over 500k
  const finalTotal = totalPrice + shippingFee

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!formData.fullName.trim()) {
      newErrors.fullName = t("required")
    }
    if (!formData.phoneNumber.trim()) {
      newErrors.phoneNumber = t("required")
    } else if (!/^[0-9]{10,11}$/.test(formData.phoneNumber.replace(/\s/g, ""))) {
      newErrors.phoneNumber = "Invalid phone number"
    }
    if (!formData.address.trim()) {
      newErrors.address = t("required")
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const validateCard = () => {
    const newErrors: Record<string, string> = {}

    if (!cardData.cardNumber.trim()) {
      newErrors.cardNumber = t("required")
    } else if (!/^[0-9]{16}$/.test(cardData.cardNumber.replace(/\s/g, ""))) {
      newErrors.cardNumber = "Invalid card number"
    }
    if (!cardData.cardHolder.trim()) {
      newErrors.cardHolder = t("required")
    }
    if (!cardData.expiry.trim()) {
      newErrors.expiry = t("required")
    } else if (!/^(0[1-9]|1[0-2])\/[0-9]{2}$/.test(cardData.expiry)) {
      newErrors.expiry = "Invalid format (MM/YY)"
    }
    if (!cardData.cvv.trim()) {
      newErrors.cvv = t("required")
    } else if (!/^[0-9]{3,4}$/.test(cardData.cvv)) {
      newErrors.cvv = "Invalid CVV"
    }

    setCardErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handlePlaceOrder = () => {
    if (!validateForm()) {
      return
    }

    if (paymentMethod === "card" && !validateCard()) {
      return
    }

    const orderNum = `AT${Date.now().toString().slice(-8)}`
    setOrderNumber(orderNum)

    console.log("[v0] Order placed:", {
      orderNumber: orderNum,
      items,
      total: finalTotal,
      paymentMethod,
      shippingInfo: formData,
      ...(paymentMethod === "card" && { cardInfo: { ...cardData, cvv: "***" } }),
    })

    clearCart()
    setOrderPlaced(true)
  }

  if (orderPlaced) {
    return (
      <>
        <Header />
        <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12">
          <Card className="p-12 text-center max-w-2xl mx-4">
            <CheckCircle2 className="h-24 w-24 text-green-500 mx-auto mb-6" />
            <h2 className="text-3xl font-bold mb-4">{t("orderSuccess")}</h2>
            <p className="text-gray-600 mb-6 text-lg">{t("orderSuccessMessage")}</p>

            <div className="bg-gray-50 p-6 rounded-lg mb-8">
              <p className="text-sm text-gray-500 mb-2">{t("orderNumber")}</p>
              <p className="text-2xl font-bold text-[#FF6600]">{orderNumber}</p>
            </div>

            <div className="bg-blue-50 border border-blue-200 p-4 rounded-lg mb-8">
              <p className="text-sm text-blue-800">
                {paymentMethod === "cod" && t("codDescription")}
                {paymentMethod === "banking" && t("bankingDescription")}
                {paymentMethod === "card" && t("cardDescription")}
              </p>
            </div>

            <div className="flex gap-4 justify-center">
              <Link href="/">
                <Button className="bg-[#FF6600] hover:bg-[#FF6600]/90 text-white px-8">{t("backToHome")}</Button>
              </Link>
            </div>
          </Card>
        </div>
        <Footer />
      </>
    )
  }

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
            <div className="lg:col-span-2 space-y-6">
              <div className="space-y-4">
                {items.map((item, index) => (
                  <Card key={index} className="p-6">
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

                        <div className="text-[#FF6600] text-xl font-bold mb-4">{formatPrice(item.price)} đ</div>

                        <div className="flex items-center justify-between">
                          <div className="flex items-center border rounded-lg">
                            <Button
                              size="icon"
                              variant="ghost"
                              onClick={() => updateQuantity(index, item.quantity - 1)}
                              className="h-10 w-10"
                              disabled={item.quantity <= 1}
                            >
                              <Minus className="h-4 w-4" />
                            </Button>
                            <span className="w-16 text-center font-medium">{item.quantity}</span>
                            <Button
                              size="icon"
                              variant="ghost"
                              onClick={() => updateQuantity(index, item.quantity + 1)}
                              className="h-10 w-10"
                            >
                              <Plus className="h-4 w-4" />
                            </Button>
                          </div>

                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => removeFromCart(index)}
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

              {showCheckout && (
                <>
                  <Card className="p-6">
                    <h2 className="text-xl font-bold mb-6">{t("shippingInfo")}</h2>

                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="fullName">{t("fullName")} *</Label>
                        <Input
                          id="fullName"
                          value={formData.fullName}
                          onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                          placeholder={t("enterFullName")}
                          className={errors.fullName ? "border-red-500" : ""}
                        />
                        {errors.fullName && <p className="text-red-500 text-sm mt-1">{errors.fullName}</p>}
                      </div>

                      <div>
                        <Label htmlFor="phoneNumber">{t("phoneNumber")} *</Label>
                        <Input
                          id="phoneNumber"
                          value={formData.phoneNumber}
                          onChange={(e) => setFormData({ ...formData, phoneNumber: e.target.value })}
                          placeholder={t("enterPhone")}
                          className={errors.phoneNumber ? "border-red-500" : ""}
                        />
                        {errors.phoneNumber && <p className="text-red-500 text-sm mt-1">{errors.phoneNumber}</p>}
                      </div>

                      <div>
                        <Label htmlFor="address">{t("deliveryAddress")} *</Label>
                        <Textarea
                          id="address"
                          value={formData.address}
                          onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                          placeholder={t("enterAddress")}
                          rows={3}
                          className={errors.address ? "border-red-500" : ""}
                        />
                        {errors.address && <p className="text-red-500 text-sm mt-1">{errors.address}</p>}
                      </div>

                      <div>
                        <Label htmlFor="notes">
                          {t("orderNotes")} ({t("optional")})
                        </Label>
                        <Textarea
                          id="notes"
                          value={formData.notes}
                          onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                          placeholder="Ghi chú thêm cho đơn hàng..."
                          rows={2}
                        />
                      </div>
                    </div>

                    <div className="mt-6">
                      <h3 className="font-semibold mb-4">{t("paymentMethod")}</h3>
                      <RadioGroup value={paymentMethod} onValueChange={(value: any) => setPaymentMethod(value)}>
                        <div className="space-y-3">
                          <Card
                            className={`p-4 cursor-pointer transition-all ${paymentMethod === "cod" ? "border-[#FF6600] border-2 bg-orange-50" : "hover:border-gray-300"}`}
                          >
                            <div className="flex items-center space-x-3">
                              <RadioGroupItem value="cod" id="cod" />
                              <Label htmlFor="cod" className="flex items-center gap-3 cursor-pointer flex-1">
                                <Banknote className="h-5 w-5 text-green-600" />
                                <div>
                                  <p className="font-medium">{t("cashOnDelivery")}</p>
                                  <p className="text-sm text-gray-500">{t("codDescription")}</p>
                                </div>
                              </Label>
                            </div>
                          </Card>

                          <Card
                            className={`p-4 cursor-pointer transition-all ${paymentMethod === "banking" ? "border-[#FF6600] border-2 bg-orange-50" : "hover:border-gray-300"}`}
                          >
                            <div className="flex items-center space-x-3">
                              <RadioGroupItem value="banking" id="banking" />
                              <Label htmlFor="banking" className="flex items-center gap-3 cursor-pointer flex-1">
                                <Building2 className="h-5 w-5 text-blue-600" />
                                <div>
                                  <p className="font-medium">{t("internetBanking")}</p>
                                  <p className="text-sm text-gray-500">{t("bankingDescription")}</p>
                                </div>
                              </Label>
                            </div>
                          </Card>

                          <Card
                            className={`p-4 cursor-pointer transition-all ${paymentMethod === "card" ? "border-[#FF6600] border-2 bg-orange-50" : "hover:border-gray-300"}`}
                          >
                            <div className="flex items-center space-x-3">
                              <RadioGroupItem value="card" id="card" />
                              <Label htmlFor="card" className="flex items-center gap-3 cursor-pointer flex-1">
                                <CreditCard className="h-5 w-5 text-purple-600" />
                                <div>
                                  <p className="font-medium">{t("creditCard")}</p>
                                  <p className="text-sm text-gray-500">{t("cardDescription")}</p>
                                </div>
                              </Label>
                            </div>
                          </Card>
                        </div>
                      </RadioGroup>
                    </div>
                  </Card>

                  {paymentMethod === "card" && (
                    <Card className="p-6">
                      <h3 className="font-semibold mb-4 flex items-center gap-2">
                        <CreditCard className="h-5 w-5" />
                        {t("creditCard")}
                      </h3>
                      <div className="space-y-4">
                        <div>
                          <Label htmlFor="cardNumber">{t("cardNumber")} *</Label>
                          <Input
                            id="cardNumber"
                            value={cardData.cardNumber}
                            onChange={(e) => {
                              const value = e.target.value.replace(/\s/g, "")
                              if (/^\d*$/.test(value) && value.length <= 16) {
                                setCardData({ ...cardData, cardNumber: value })
                              }
                            }}
                            placeholder={t("enterCardNumber")}
                            maxLength={19}
                            className={cardErrors.cardNumber ? "border-red-500" : ""}
                          />
                          {cardErrors.cardNumber && (
                            <p className="text-red-500 text-sm mt-1">{cardErrors.cardNumber}</p>
                          )}
                        </div>

                        <div>
                          <Label htmlFor="cardHolder">{t("cardHolderName")} *</Label>
                          <Input
                            id="cardHolder"
                            value={cardData.cardHolder}
                            onChange={(e) => setCardData({ ...cardData, cardHolder: e.target.value.toUpperCase() })}
                            placeholder={t("enterCardHolder")}
                            className={cardErrors.cardHolder ? "border-red-500" : ""}
                          />
                          {cardErrors.cardHolder && (
                            <p className="text-red-500 text-sm mt-1">{cardErrors.cardHolder}</p>
                          )}
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <Label htmlFor="expiry">{t("expiryDate")} *</Label>
                            <Input
                              id="expiry"
                              value={cardData.expiry}
                              onChange={(e) => {
                                let value = e.target.value.replace(/\D/g, "")
                                if (value.length >= 2) {
                                  value = value.slice(0, 2) + "/" + value.slice(2, 4)
                                }
                                setCardData({ ...cardData, expiry: value })
                              }}
                              placeholder={t("enterExpiry")}
                              maxLength={5}
                              className={cardErrors.expiry ? "border-red-500" : ""}
                            />
                            {cardErrors.expiry && <p className="text-red-500 text-sm mt-1">{cardErrors.expiry}</p>}
                          </div>

                          <div>
                            <Label htmlFor="cvv">{t("cvv")} *</Label>
                            <Input
                              id="cvv"
                              type="password"
                              value={cardData.cvv}
                              onChange={(e) => {
                                const value = e.target.value.replace(/\D/g, "")
                                if (value.length <= 4) {
                                  setCardData({ ...cardData, cvv: value })
                                }
                              }}
                              placeholder={t("enterCVV")}
                              maxLength={4}
                              className={cardErrors.cvv ? "border-red-500" : ""}
                            />
                            {cardErrors.cvv && <p className="text-red-500 text-sm mt-1">{cardErrors.cvv}</p>}
                          </div>
                        </div>
                      </div>
                    </Card>
                  )}

                  {paymentMethod === "banking" && (
                    <Card className="p-6">
                      <h3 className="font-semibold mb-4 flex items-center gap-2">
                        <QrCode className="h-5 w-5" />
                        {t("scanQRCode")}
                      </h3>
                      <p className="text-sm text-gray-600 mb-6">{t("bankingInstructions")}</p>

                      <div className="flex flex-col md:flex-row gap-6">
                        <div className="flex-shrink-0">
                          <div className="bg-white p-4 rounded-lg border-2 border-gray-200 inline-block">
                            <img src="/qr-code-payment.png" alt="QR Code" className="w-48 h-48" />
                          </div>
                        </div>

                        <div className="flex-1 space-y-3">
                          <div className="bg-gray-50 p-4 rounded-lg">
                            <p className="text-sm text-gray-500 mb-1">{t("bankName")}</p>
                            <p className="font-semibold">{t("vietcombank")}</p>
                          </div>

                          <div className="bg-gray-50 p-4 rounded-lg">
                            <p className="text-sm text-gray-500 mb-1">{t("accountNumber")}</p>
                            <p className="font-semibold">1234567890</p>
                          </div>

                          <div className="bg-gray-50 p-4 rounded-lg">
                            <p className="text-sm text-gray-500 mb-1">{t("accountName")}</p>
                            <p className="font-semibold">CONG TY ATLOGISTICS</p>
                          </div>

                          <div className="bg-gray-50 p-4 rounded-lg">
                            <p className="text-sm text-gray-500 mb-1">{t("transferContent")}</p>
                            <p className="font-bold text-2xl text-[#FF6600]">{orderNumber || "AT12345678"}</p>
                          </div>

                          <div className="bg-orange-50 p-4 rounded-lg border border-orange-200">
                            <p className="text-sm text-gray-500 mb-1">{t("paymentAmount")}</p>
                            <p className="font-bold text-2xl text-[#FF6600]">{formatPrice(finalTotal.toString())} đ</p>
                          </div>
                        </div>
                      </div>
                    </Card>
                  )}
                </>
              )}
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
                  <div className="flex justify-between text-gray-600">
                    <span>{t("shippingFee")}</span>
                    <span className={shippingFee === 0 ? "text-green-600 font-medium" : ""}>
                      {shippingFee === 0 ? t("freeShipping") : `${formatPrice(shippingFee.toString())} đ`}
                    </span>
                  </div>
                  <div className="border-t pt-4 flex justify-between font-bold text-lg">
                    <span>{t("total")}</span>
                    <span className="text-[#FF6600]">{formatPrice(finalTotal.toString())} đ</span>
                  </div>
                </div>

                {!showCheckout ? (
                  <>
                    <Button
                      onClick={() => setShowCheckout(true)}
                      className="w-full bg-[#FF6600] hover:bg-[#FF6600]/90 text-white h-12 text-lg"
                    >
                      {t("proceedToCheckout")}
                    </Button>
                    <Link href="/">
                      <Button variant="outline" className="w-full mt-3 bg-transparent">
                        {t("continueShopping")}
                      </Button>
                    </Link>
                  </>
                ) : (
                  <>
                    <Button
                      onClick={handlePlaceOrder}
                      className="w-full bg-[#FF6600] hover:bg-[#FF6600]/90 text-white h-12 text-lg"
                    >
                      {paymentMethod === "banking" ? t("confirmPayment") : t("placeOrder")}
                    </Button>
                    <Button onClick={() => setShowCheckout(false)} variant="outline" className="w-full mt-3">
                      {t("cart")}
                    </Button>
                  </>
                )}
              </Card>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  )
}
