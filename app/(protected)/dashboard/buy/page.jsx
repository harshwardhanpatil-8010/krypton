'use client'

import { useState } from "react"
import { toast } from "@/hooks/use-toast"
import { Bell, Search, Wallet, Bitcoin, Ethereum, DollarSign, ScanLine } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import { AppSidebar } from "../_components/sidebar"
import {
  DropdownMenu,
  DropdownMenuContent, 
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Separator } from "@/components/ui/separator"

export default function Page() {
  const [cryptoAmount, setCryptoAmount] = useState("")
  const [paymentMethod, setPaymentMethod] = useState("UPI")
  const [cryptoCurrency, setCryptoCurrency] = useState("BTC")
  const [buying, setBuying] = useState(false)


  const handleBuy = async () => {
    try {
      setBuying(true)
      const res = await fetch("/api/buy", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          user_id,
          wallet_id,
          asset_id,
          crypto_amount: parseFloat(cryptoAmount),
          rate,
          payment_method: paymentMethod,
        }),
      })

      const data = await res.json()

      if (!res.ok) throw new Error(data?.error || "Failed to buy")

      toast({ title: "Success", description: data.message })
      setCryptoAmount("")
    } catch (error) {
      toast({
        title: "Error",
        description: error.message || "Something went wrong",
      })
    } finally {
      setBuying(false)
    }
  }

  return (
    <SidebarProvider className="bg-krypton-900/20">
      <AppSidebar />
      <div className="flex h-full w-full ">
        <SidebarTrigger className="md:hidden xl:hidden 2xl:hidden lg:hidden" />
        <main className="flex-1 p-6">
          <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-2">
  <ScanLine className="text-white w-6 h-6" />
  <h1 className="text-4xl text-white font-bold">Buy</h1>
</div>
          </div>

          <Separator className="my-4 border-2" />

          <div className="max-w-xl mx-auto bg-gray-800/50 backdrop-blur-lg rounded-3xl p-8 shadow-2xl space-y-6 border border-gray-700 mt-64">
            <h2 className="text-2xl font-semibold text-center ">
              Buy Crypto Instantly
            </h2>

            <div className="space-y-6">
              <div className="relative">
                <Input
                  placeholder="Enter amount"
                  value={cryptoAmount}
                  onChange={(e) => setCryptoAmount(e.target.value)}
                  className="bg-gray-900/50 border-gray-600 rounded-xl h-12 pl-4 focus:ring-2 focus:ring-green-500 transition-all"
                  type="number"
                  min={0}
                />
              </div>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" className="w-full justify-between h-12 rounded-xl bg-gray-900/50 border-gray-600 ">
                    <div className="flex items-center">
                     
                      {cryptoCurrency}
                    </div>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-full bg-gray-800 border-gray-700">
                  <DropdownMenuItem onClick={() => setCryptoCurrency("BTC")} className="flex items-center">
                   BTC
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setCryptoCurrency("ETH")} className="flex items-center">
                   ETH
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setCryptoCurrency("USDT")} className="flex items-center">
                   USDT
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" className="w-full justify-between h-12 rounded-xl bg-gray-900/50 border-gray-600 ">
                    <div className="flex items-center">
                      <Wallet className="w-5 h-5 mr-2" />
                      {paymentMethod}
                    </div>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-full bg-gray-800 border-gray-700">
                  <DropdownMenuItem onClick={() => setPaymentMethod("UPI")}>UPI</DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setPaymentMethod("Bank Transfer")}>Bank Transfer</DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setPaymentMethod("Card")}>Card</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>

              <Button
                onClick={handleBuy}
                disabled={buying}
                className="w-full h-12 rounded-xl bg-emerald-500 text-white font-semibold"
              >
                {buying ? "Processing..." : "Buy Now"}
              </Button>
            </div>
          </div>
        </main>
      </div>
    </SidebarProvider>
  )
}
