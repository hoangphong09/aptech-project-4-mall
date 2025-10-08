"use client"
import { Facebook, Twitter, Instagram, Youtube } from "lucide-react"
import { useLanguage } from "@/contexts/language-context"

export default function Footer() {
  const { t } = useLanguage()

  return (
    <footer className="bg-white border-t mt-12">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-8 mb-8">
          {/* About */}
          <div>
            <h3 className="font-bold mb-4">{t("aboutUs")}</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                <a href="#" className="hover:text-primary">
                  {t("introduction")}
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-primary">
                  {t("careers")}
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-primary">
                  {t("terms")}
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-primary">
                  {t("privacyPolicy")}
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-primary">
                  {t("complaintPolicy")}
                </a>
              </li>
            </ul>
          </div>

          {/* Customer Service */}
          <div>
            <h3 className="font-bold mb-4">{t("customerService")}</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                <a href="#" className="hover:text-primary">
                  {t("helpCenter")}
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-primary">
                  {t("buyingGuide")}
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-primary">
                  {t("sellingGuide")}
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-primary">
                  {t("payment")}
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-primary">
                  {t("shipping")}
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-primary">
                  {t("returnRefund")}
                </a>
              </li>
            </ul>
          </div>

          {/* Payment */}
          <div>
            <h3 className="font-bold mb-4">{t("paymentMethods")}</h3>
            <div className="grid grid-cols-3 gap-2">
              <div className="border rounded p-1 flex items-center justify-center h-8">
                <img src="/placeholder.svg?height=20&width=30" alt="Visa" className="h-4" />
              </div>
              <div className="border rounded p-1 flex items-center justify-center h-8">
                <img src="/placeholder.svg?height=20&width=30" alt="Mastercard" className="h-4" />
              </div>
              <div className="border rounded p-1 flex items-center justify-center h-8">
                <img src="/placeholder.svg?height=20&width=30" alt="JCB" className="h-4" />
              </div>
              <div className="border rounded p-1 flex items-center justify-center h-8">
                <img src="/placeholder.svg?height=20&width=30" alt="COD" className="h-4" />
              </div>
              <div className="border rounded p-1 flex items-center justify-center h-8">
                <img src="/placeholder.svg?height=20&width=30" alt="Momo" className="h-4" />
              </div>
              <div className="border rounded p-1 flex items-center justify-center h-8">
                <img src="/placeholder.svg?height=20&width=30" alt="ZaloPay" className="h-4" />
              </div>
            </div>
          </div>

          {/* Shipping */}
          <div>
            <h3 className="font-bold mb-4">{t("shippingPartners")}</h3>
            <div className="grid grid-cols-3 gap-2">
              <div className="border rounded p-1 flex items-center justify-center h-8">
                <img src="/placeholder.svg?height=20&width=30" alt="GHN" className="h-4" />
              </div>
              <div className="border rounded p-1 flex items-center justify-center h-8">
                <img src="/placeholder.svg?height=20&width=30" alt="GHTK" className="h-4" />
              </div>
              <div className="border rounded p-1 flex items-center justify-center h-8">
                <img src="/placeholder.svg?height=20&width=30" alt="Viettel Post" className="h-4" />
              </div>
              <div className="border rounded p-1 flex items-center justify-center h-8">
                <img src="/placeholder.svg?height=20&width=30" alt="VNPost" className="h-4" />
              </div>
              <div className="border rounded p-1 flex items-center justify-center h-8">
                <img src="/placeholder.svg?height=20&width=30" alt="J&T" className="h-4" />
              </div>
              <div className="border rounded p-1 flex items-center justify-center h-8">
                <img src="/placeholder.svg?height=20&width=30" alt="Ninja Van" className="h-4" />
              </div>
            </div>
          </div>

          {/* Follow Us */}
          <div>
            <h3 className="font-bold mb-4">{t("followUs")}</h3>
            <div className="flex gap-3 mb-4">
              <a href="#" className="text-muted-foreground hover:text-primary">
                <Facebook className="h-5 w-5" />
              </a>
              <a href="#" className="text-muted-foreground hover:text-primary">
                <Instagram className="h-5 w-5" />
              </a>
              <a href="#" className="text-muted-foreground hover:text-primary">
                <Twitter className="h-5 w-5" />
              </a>
              <a href="#" className="text-muted-foreground hover:text-primary">
                <Youtube className="h-5 w-5" />
              </a>
            </div>
            <h3 className="font-bold mb-2">{t("downloadOurApp")}</h3>
            <div className="space-y-2">
              <img src="/app-store-badge.png" alt="App Store" className="h-10" />
              <img src="/google-play-badge.png" alt="Google Play" className="h-10" />
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t pt-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <div className="bg-primary rounded-lg p-1.5 w-8 h-8 flex items-center justify-center">
                <span className="text-white font-bold">A</span>
              </div>
              <div>
                <div className="font-bold text-foreground">
                  <span>AT</span>
                  <span className="text-primary">logistics</span>
                </div>
                <div className="text-xs">{t("allRightsReserved")}</div>
              </div>
            </div>
            <div className="text-xs text-center md:text-right">
              <p>{t("address")}</p>
              <p className="mt-1">
                {t("hotline")} | {t("email")}
              </p>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
