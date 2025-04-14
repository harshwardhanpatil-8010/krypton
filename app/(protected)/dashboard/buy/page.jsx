'use client'

import { useState, useEffect } from "react"
import { toast } from "@/hooks/use-toast"
import { ScanLine, Wallet } from "lucide-react"
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
  const [network, setNetwork] = useState("Ethereum")
  const [buying, setBuying] = useState(false)

  const walletId = 1  

  const initialMarkets = [
    { id: 1, name: "Bitcoin", symbol: "BTC", price: 7400000, change: 0, volume: "32.5B", marketCap: "534.2B", positive: true },
    { id: 2, name: "Ethereum", symbol: "ETH", price: 170000, change: 0, volume: "15.7B", marketCap: "233.1B", positive: true },
    { id: 3, name: "Binance Coin", symbol: "BNB", price: 234.56, change: 0, volume: "1.2B", marketCap: "36.5B", positive: true },
    { id: 4, name: "Solana", symbol: "SOL", price: 65.09, change: 0, volume: "2.1B", marketCap: "27.3B", positive: true },
    { id: 5, name: "Cardano", symbol: "ADA", price: 0.38, change: 0, volume: "428.5M", marketCap: "13.4B", positive: true },
  ]

  const [markets, setMarkets] = useState(initialMarkets)

  useEffect(() => {
    const interval = setInterval(() => {
      setMarkets((prevMarkets) =>
        prevMarkets.map((market) => {
          const fluctuation = (Math.random() * 2 - 1) * 0.02 
          const newPrice = market.price * (1 + fluctuation)
          const change = ((newPrice - market.price) / market.price) * 100

          return {
            ...market,
            price: parseFloat(newPrice.toFixed(2)),
            change: parseFloat(change.toFixed(2)),
            positive: change >= 0,
          }
        })
      )
    }, 6000)

    return () => clearInterval(interval)
  }, [])

  const currentMarket = markets.find((m) => m.symbol === cryptoCurrency)
  const rate = currentMarket?.price || 0

  const handleBuy = async () => {
    if (!cryptoCurrency || !cryptoAmount || !currentMarket?.name || !network) {
      toast({ title: "Missing fields", description: "Please fill in all required fields" })
      return
    }

    try {
      setBuying(true)
      const res = await fetch("/api/buy", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          wallet_id: walletId,
          crypto_amount: parseFloat(cryptoAmount),
          symbol: cryptoCurrency,
          name: currentMarket.name,
          network: network,
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
      <div className="flex h-full w-full">
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
            <h2 className="text-2xl font-semibold text-center">Buy Crypto Instantly</h2>

            <div className="space-y-6">
              <Input
                placeholder="Enter amount"
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
                  {markets.map((market) => (
                    <DropdownMenuItem key={market.symbol} onClick={() => setCryptoCurrency(market.symbol)}>
                      {market.symbol}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" className="w-full justify-between h-12 rounded-xl bg-gray-900/50 border-gray-600">
                    {network}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-full bg-gray-800 border-gray-700">
                  {["Ethereum", "BNB Smart Chain", "Solana", "Polygon"].map((net) => (
                    <DropdownMenuItem key={net} onClick={() => setNetwork(net)}>
                      {net}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" className="w-full justify-between h-12 rounded-xl bg-gray-900/50 border-gray-600">
                    <Wallet className="w-5 h-5 mr-2" />
                    {paymentMethod}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-full bg-gray-800 border-gray-700">
                  <DropdownMenuItem onClick={() => setPaymentMethod("UPI")}>UPI</DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setPaymentMethod("Bank Transfer")}>Bank Transfer</DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setPaymentMethod("Card")}>Card</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>

              <div className="text-sm text-gray-300 text-center">
                Current Rate: ₹{rate.toLocaleString()}
              </div>

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
