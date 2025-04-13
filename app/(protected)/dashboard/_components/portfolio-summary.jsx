"use client";

import { ArrowDown, ArrowUp, DollarSign } from "lucide-react";
import {
  Card, CardContent, CardDescription, CardHeader, CardTitle,
} from "@/components/ui/card";
import {
  Tabs, TabsContent, TabsList, TabsTrigger,
} from "@/components/ui/tabs";
import { useEffect, useState } from "react";

export function PortfolioSummary({ className }) {
  const [wallets, setWallets] = useState(null);

  // Fetch wallets from backend
  const fetchWalletsData = async () => {
    try {
      const res = await fetch("/api/data", {
        credentials: "include",
        cache: "no-store",
      });
      if (!res.ok) {
        console.error("Unauthorized or error fetching data");
        return;
      }
      const json = await res.json();
      setWallets(json.wallets);
    } catch (err) {
      console.error("Failed to fetch user data", err);
    }
  };

  useEffect(() => {
    const syncAndFetch = async () => {
      try {
        const res = await fetch("/api/balance-sync", {
          method: "POST",
        });
        const data = await res.json();
        console.log("Balance sync result:", data.message);
      } catch (err) {
        console.error("Error syncing balances:", err);
      }

     
      await fetchWalletsData();
    };

    syncAndFetch();
  }, []);

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle>Portfolio Summary</CardTitle>
        <CardDescription>Your crypto assets overview</CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="all" className="space-y-4">
          <TabsList>
            <TabsTrigger value="all">All Time</TabsTrigger>
            <TabsTrigger value="month">Month</TabsTrigger>
            <TabsTrigger value="week">Week</TabsTrigger>
            <TabsTrigger value="day">Day</TabsTrigger>
          </TabsList>

          <TabsContent value="all" className="space-y-4">
            <div className="space-y-2">
              <div className="flex items-center">
                <div className="flex items-center gap-2">
                  ₹
                  <span className="text-3xl font-bold">
                    {wallets?.balance !== undefined
                      ? wallets.balance
                      : "Loading..."}
                  </span>
                </div>
                <div className="ml-auto flex items-center gap-1 text-emerald-500">
                  <ArrowUp className="h-4 w-4" />
                  <span className="text-sm font-medium">12.5%</span>
                </div>
              </div>
              <p className="text-xs text-muted-foreground">
                +$2,563.23 (12.5%) from initial investment
              </p>
            </div>
          </TabsContent>

          {/* Static/Placeholder tabs (update if needed) */}
          <TabsContent value="month" className="space-y-4">
            <div className="space-y-2">
              <div className="flex items-center">
                <div className="flex items-center gap-2">
                  <DollarSign className="h-4 w-4 text-muted-foreground" />
                  <span className="text-3xl font-bold">24,563.73</span>
                </div>
                <div className="ml-auto flex items-center gap-1 text-emerald-500">
                  <ArrowUp className="h-4 w-4" />
                  <span className="text-sm font-medium">4.3%</span>
                </div>
              </div>
              <p className="text-xs text-muted-foreground">
                +$1,021.45 (4.3%) in the last month
              </p>
            </div>
          </TabsContent>

          <TabsContent value="week" className="space-y-4">
            <div className="space-y-2">
              <div className="flex items-center">
                <div className="flex items-center gap-2">
                  <DollarSign className="h-4 w-4 text-muted-foreground" />
                  <span className="text-3xl font-bold">24,563.73</span>
                </div>
                <div className="ml-auto flex items-center gap-1 text-rose-500">
                  <ArrowDown className="h-4 w-4" />
                  <span className="text-sm font-medium">1.2%</span>
                </div>
              </div>
              <p className="text-xs text-muted-foreground">
                -$298.45 (1.2%) in the last week
              </p>
            </div>
          </TabsContent>

          <TabsContent value="day" className="space-y-4">
            <div className="space-y-2">
              <div className="flex items-center">
                <div className="flex items-center gap-2">
                  <DollarSign className="h-4 w-4 text-muted-foreground" />
                  <span className="text-3xl font-bold">24,563.73</span>
                </div>
                <div className="ml-auto flex items-center gap-1 text-emerald-500">
                  <ArrowUp className="h-4 w-4" />
                  <span className="text-sm font-medium">0.8%</span>
                </div>
              </div>
              <p className="text-xs text-muted-foreground">
                +$195.23 (0.8%) in the last 24 hours
              </p>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
