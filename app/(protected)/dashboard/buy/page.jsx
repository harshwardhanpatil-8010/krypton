'use client'

import { useState } from "react"

import { Bell, Search, Wallet } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import { AppSidebar } from "../_components/sidebar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Separator } from "@/components/ui/separator"


export default function Page() {
  const [cryptoAmount, setCryptoAmount] = useState("")
  const [paymentMethod, setPaymentMethod] = useState("UPI")
  const [buying, setBuying] = useState(false)



  const handleBuy = async () => {
    try {
      setBuying(true)
      const response = await fetch("/api/data", {
        user_id,
        wallet_id,
        asset_id,
        crypto_amount: parseFloat(cryptoAmount),
        rate,
        payment_method: paymentMethod,
      })
      toast({ title: "Success", description: response.data.message })
      setCryptoAmount("")
    } catch (error) {
      toast({
        title: "Error",
        description: error?.response?.data?.error || "Failed to buy asset",
      })
    } finally {
      setBuying(false)
    }
  }

  return (
    <SidebarProvider>
      <AppSidebar />
      <div className="flex h-full w-full bg-black text-white">
        <SidebarTrigger className="md:hidden xl:hidden 2xl:hidden lg:hidden" />
        <main className="flex-1 p-6">
          <div className="flex items-center justify-between mb-8">
            <h1 className="text-2xl font-bold">Buy</h1>
            <Separator className="my-4 border-2 " />
            <div className="flex items-center gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" />
                <Input
                  className="w-[280px] pl-9 bg-[#1a1b1e] border-0"
                  placeholder="Search for a token..."
                />
              </div>
              <Button variant="ghost" size="icon">
                <Wallet className="h-5 w-5" />
                <span className="ml-1">7</span>
              </Button>
              <Button variant="ghost" size="icon">
                <Bell className="h-5 w-5" />
              </Button>
            </div>
          </div>

          <div className="max-w-[900px] mx-auto bg-[#1a1b1e] rounded-lg p-6 space-y-6">
            <div className="flex gap-4">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline">Country</Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56">
                  <DropdownMenuItem>🇮🇳 India</DropdownMenuItem>
                  <DropdownMenuItem>🇺🇸 USA</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
              <Button variant="outline" className="bg-[#1a1b1e] border-gray-800">
                INR
              </Button>
            </div>

            <div className="text-center">
              <h2 className="text-5xl font-bold">₹{rate.toLocaleString()}</h2>
              <p className="text-sm text-muted-foreground mt-2"> Current price of 1 unit</p>
            </div>

            <div className="grid gap-4">
              <Input
                placeholder="Enter crypto amount"
                value={cryptoAmount}
                onChange={(e) => setCryptoAmount(e.target.value)}
                className="bg-black border-gray-700"
              />

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline">{paymentMethod}</Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuItem onClick={() => setPaymentMethod("UPI")}>UPI</DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setPaymentMethod("Bank Transfer")}>Bank Transfer</DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setPaymentMethod("Card")}>Card</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>

              <Button
                onClick={handleBuy}
                disabled={buying}
                className="bg-green-600 hover:bg-green-700 text-white font-bold"
              >
                {buying ? "Buying..." : "Buy Now"}
              </Button>
            </div>
          </div>
        </main>
      </div>
    </SidebarProvider>
  )
}
