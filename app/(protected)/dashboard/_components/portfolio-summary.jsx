"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { downloadTransactionInvoice } from "@/utils/downloadInvoice";
import { ArrowDownToLine, RefreshCw } from "lucide-react"; // Import icons
import { Skeleton } from "@/components/ui/skeleton";

export function PortfolioSummary({ className }) {
  const [wallets, setWallets] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isGenerating, setIsGenerating] = useState(false);

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
    } finally {
      setIsLoading(false);
    }
  };

  const handleDownload = async () => {
    setIsGenerating(true);
    try {
      const res = await fetch("/api/generate-invoice", {
        credentials: "include",
        cache: "no-store",
      });

      if (!res.ok) {
        console.error("Failed to fetch transactions");
        return;
      }

      const txs = await res.json();

      if (!txs || txs.length === 0) {
        alert("No transactions found for invoice.");
        return;
      }

      downloadTransactionInvoice(txs);
    } catch (err) {
      console.error("Error generating invoice:", err);
    } finally {
      setIsGenerating(false);
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
    <Card className={`${className} transition-all duration-300 hover:shadow-lg`}>
      <CardHeader className="border-b pb-4">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-2xl font-bold">Portfolio Summary</CardTitle>
            <CardDescription className="mt-1 text-gray-500">Your crypto assets overview</CardDescription>
          </div>
          <Button 
            variant="ghost" 
            size="icon"
            onClick={fetchWalletsData}
            className="hover:bg-gray-100 rounded-full"
          >
            <RefreshCw className="h-5 w-5" />
          </Button>
        </div>
      </CardHeader>
      <CardContent className="pt-6">
        <Tabs defaultValue="all" className="space-y-4">
          <TabsContent value="all">
            <div className="space-y-4">
              {isLoading ? (
                <Skeleton className="h-12 w-32" />
              ) : (
                <div className="flex items-center">
                  <div className="flex items-center gap-2 text-emerald-600">
                    <span className="text-xl">₹</span>
                    <span className="text-4xl font-bold tracking-tight">
                      {wallets?.balance !== undefined ? wallets.balance : "N/A"}
                    </span>
                  </div>
                </div>
              )}
            </div>
          </TabsContent>
          <div className="flex justify-center pt-4">
            <Button 
              className="w-full max-w-xs transition-all duration-300 hover:scale-105"
              onClick={handleDownload}
              disabled={isGenerating}
            >
              <ArrowDownToLine className="mr-2 h-4 w-4" />
              {isGenerating ? "Generating..." : "Generate Invoice"}
            </Button>
          </div>
        </Tabs>
      </CardContent>
    </Card>
  );
}
