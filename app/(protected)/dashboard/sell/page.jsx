"use client"
import { SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar'
import React from 'react'
import { AppSidebar } from '../_components/sidebar'
import { Separator } from '@/components/ui/separator'
import { useState, useEffect } from 'react'
import { Input } from '@/components/ui/input'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { Button } from '@/components/ui/button'
import { PanelTopClose, Wallet } from 'lucide-react'
function sell() {
  const [cryptoAmount, setCryptoAmount] = useState("")
  const [paymentMethod, setPaymentMethod] = useState("UPI")
  const [cryptoCurrency, setCryptoCurrency] = useState("BTC")
  const [selling, setSelling] = useState(false)


  const handleSell = async () => {
    try {
      setSelling(true)
      const res = await fetch("/api/sell", {
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

      if (!res.ok) throw new Error(data?.error || "Failed to sell")

      toast({ title: "Success", description: data.message })
      setCryptoAmount("")
    } catch (error) {
      toast({
        title: "Error",
        description: error.message || "Something went wrong",
      })
    } finally {
      setSelling(false)
    }
  }

  return (
    <SidebarProvider className="bg-krypton-900/20">
      <AppSidebar />
      <div className="flex h-full w-full">
        <SidebarTrigger className="md:hidden xl:hidden 2xl:hidden lg:hidden" />
        <main className="flex-1 p-6">
         
        <div className="flex items-center space-x-2">
  <PanelTopClose className="text-white w-6 h-6" />
  <h1 className="text-4xl text-white font-bold">Sell</h1>
</div>

          <Separator className="my-4 border-2" />

          <div className="max-w-xl mx-auto bg-gray-800/50 backdrop-blur-lg rounded-3xl p-8 shadow-2xl space-y-6 border border-gray-700 mt-64">
            <h2 className="text-xl font-semibold text-center">Sell Crypto Instantly</h2>

            <div className="space-y-4">
              <Input
                placeholder="Enter crypto amount"
                value={cryptoAmount}
                onChange={(e) => setCryptoAmount(e.target.value)}
                className="bg-gray-900/50 border-gray-600 rounded-xl h-12 pl-4 focus:ring-2 focus:ring-green-500 transition-all"
                type="number"
                min={0}
              />
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" className="w-full justify-between h-12 rounded-xl bg-gray-900/50 border-gray-600">
                      {cryptoCurrency}
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
                <DropdownMenuTrigger asChild >
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
                onClick={handleSell}
                disabled={selling}
                className="w-full h-12 rounded-xl bg-emerald-500 text-white font-semibold"
              >
                {selling ? "Processing..." : "Sell Now"}
              </Button>
            </div>
          </div>
        </main>
      </div>
    </SidebarProvider>
  )
}
export default sell