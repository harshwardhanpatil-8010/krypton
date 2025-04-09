import { Bell, Plus } from "lucide-react"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

export function PriceAlerts() {
  const alerts = [
    {
      id: 1,
      asset: "Bitcoin",
      symbol: "BTC",
      condition: "above",
      price: 30000,
      active: true,
    },
    {
      id: 2,
      asset: "Ethereum",
      symbol: "ETH",
      condition: "below",
      price: 1800,
      active: true,
    },
  ]

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>Price Alerts</CardTitle>
          <CardDescription>Get notified on price movements</CardDescription>
        </div>
        <Button size="sm" variant="outline">
          <Plus className="mr-2 h-4 w-4" />
          New Alert
        </Button>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {alerts.map((alert) => (
            <div key={alert.id} className="flex items-center gap-4">
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-muted">
                <Bell className="h-4 w-4" />
              </div>
              <div className="flex-1 space-y-1">
                <p className="text-sm font-medium leading-none">
                  {alert.asset} ({alert.symbol})
                </p>
                <p className="text-xs text-muted-foreground">
                  Alert when price goes {alert.condition} ${alert.price.toLocaleString()}
                </p>
              </div>
              <div>
                <div className="flex h-6 w-12 cursor-pointer items-center rounded-full bg-emerald-500 p-1">
                  <div className="h-4 w-4 rounded-full bg-white"></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

