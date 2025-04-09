import React, { useEffect, useState } from "react"
import { ArrowDown, ArrowUp } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

export function MarketOverview({ className }) {
  const initialMarkets = [
    {
      id: 1,
      name: "Bitcoin",
      symbol: "BTC",
      price: 7400000,
      change: 0,
      volume: "32.5B",
      marketCap: "534.2B",
      positive: true,
    },
    {
      id: 2,
      name: "Ethereum",
      symbol: "ETH",
      price: 170000,
      change: 0,
      volume: "15.7B",
      marketCap: "233.1B",
      positive: true,
    },
    {
      id: 3,
      name: "Binance Coin",
      symbol: "BNB",
      price: 234.56,
      change: 0,
      volume: "1.2B",
      marketCap: "36.5B",
      positive: true,
    },
    {
      id: 4,
      name: "Solana",
      symbol: "SOL",
      price: 65.09,
      change: 0,
      volume: "2.1B",
      marketCap: "27.3B",
      positive: true,
    },
    {
      id: 5,
      name: "Cardano",
      symbol: "ADA",
      price: 0.38,
      change: 0,
      volume: "428.5M",
      marketCap: "13.4B",
      positive: true,
    },
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

  return (
    <Card className={className}>
      <CardHeader>
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <CardTitle>Market Overview</CardTitle>
            <CardDescription>Top cryptocurrencies by market cap</CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead className="text-right">Price</TableHead>
              <TableHead className="text-right">24h</TableHead>
              <TableHead className="hidden md:table-cell text-right">Volume</TableHead>
              <TableHead className="hidden md:table-cell text-right">Market Cap</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {markets.map((market) => (
              <TableRow key={market.id}>
                <TableCell>
                  <div>
                    <div className="font-medium">{market.name}</div>
                    <div className="text-xs text-muted-foreground">{market.symbol}</div>
                  </div>
                </TableCell>
                <TableCell className="text-right font-medium">
                  ₹{market.price.toLocaleString()}
                </TableCell>
                <TableCell className="text-right">
                  <div
                    className={`flex items-center justify-end gap-1 ${
                      market.positive ? "text-emerald-500" : "text-rose-500"
                    }`}
                  >
                    {market.positive ? <ArrowUp className="h-4 w-4" /> : <ArrowDown className="h-4 w-4" />}
                    <span>{Math.abs(market.change).toFixed(2)}%</span>
                  </div>
                </TableCell>
                <TableCell className="hidden md:table-cell text-right">${market.volume}</TableCell>
                <TableCell className="hidden md:table-cell text-right">${market.marketCap}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}
