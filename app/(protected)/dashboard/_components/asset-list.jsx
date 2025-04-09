"use client"

import { useState, useEffect } from "react"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

export function AssetsList({ className }) {
  const initialMarkets = [
    { id: 1, name: "Bitcoin", symbol: "BTC", price: 7400000, change: 0 },
    { id: 2, name: "Ethereum", symbol: "ETH", price: 170000, change: 0 },
    { id: 3, name: "Binance Coin", symbol: "BNB", price: 234.56, change: 0 },
    { id: 4, name: "Solana", symbol: "SOL", price: 65.09, change: 0 },
    { id: 5, name: "Cardano", symbol: "ADA", price: 0.38, change: 0 },
  ]

  const [assets, setAssets] = useState([])
  const [markets, setMarkets] = useState(initialMarkets)

  useEffect(() => {
    const fetchAssetsData = async () => {
      try {
        const res = await fetch("/api/data", {
          credentials: "include",
        })
        if (!res.ok) {
          console.error("Unauthorized or error fetching data")
          return
        }
        const json = await res.json()
        setAssets(json.crypto_assets || [])
      } catch (err) {
        console.error("Failed to fetch user data", err)
      }
    }

    fetchAssetsData()
  }, [])

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

  return (
    <Card className={className}>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>Your Assets</CardTitle>
          <CardDescription>Manage your crypto portfolio</CardDescription>
        </div>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Asset</TableHead>
              <TableHead className="hidden md:table-cell">Amount</TableHead>
              <TableHead className="text-right">Value</TableHead>
              <TableHead className="hidden md:table-cell text-right">Price</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {assets && assets.length > 0 ? (
              assets.map((asset) => {
                const market = markets.find((m) => m.symbol === asset.symbol)
                const currentValue =
                  market && asset?.asset_amount
                    ? market.price * asset.asset_amount
                    : 0

                return (
                  <TableRow key={asset.asset_id || asset.symbol}>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <div>
                          <div className="font-medium">{asset.name}</div>
                          <div className="hidden text-xs text-muted-foreground sm:inline-block">
                            {asset.symbol}
                          </div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="hidden md:table-cell">
                      {asset.asset_amount}
                    </TableCell>
                    
                    <TableCell className="hidden md:table-cell text-right text-emerald-500">
                      ₹
                      {market?.price?.toLocaleString(undefined, {
                        minimumFractionDigits: 2,
                      })}
                    </TableCell>
                    <TableCell className="text-right hidden md:table-cell text-emerald-500">
                      <div className="font-medium">
                        ₹
                        {currentValue.toLocaleString(undefined, {
                          minimumFractionDigits: 2,
                        })}
                      </div>
                    </TableCell>
                  </TableRow>
                )
              })
            ) : (
              <TableRow>
                <TableCell colSpan={4}>Loading assets...</TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}
