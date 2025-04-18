"use client"
import { ArrowDown, ArrowUp } from "lucide-react"
import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export function RecentTransactions() {
  const [transactions, setTransactions] = useState([]);

  useEffect(() => {
    const fetchTransactionData = async () => {
      try {
        const res = await fetch("/api/data", {
          credentials: "include",
        });
        if (!res.ok) {
          console.error("Unauthorized or error fetching data");
          return;
        }
        const json = await res.json();
        setTransactions(json.transactions || []);
      } catch (err) {
        console.error("Failed to fetch user data", err);
      }
    };

    fetchTransactionData();
  }, []);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Transactions</CardTitle>
        <CardDescription>Your latest crypto transactions</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4 max-h-80 overflow-y-auto pr-2">
          {transactions.length > 0 ? transactions.map((txn, index) => (
            <div key={index} className="flex items-center gap-4">
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gray-200 dark:bg-gray-700">
              {["receive", "sell", "swap"].includes(txn.tnx_type) ? (
                   <ArrowUp className="text-emerald-600 h-5 w-5" />
                ) : (
                 
                  <ArrowDown className="text-red-500 h-5 w-5" />
                )}
              </div>
              <div className="flex-1 space-y-1">
              {["receive", "sell", "swap"].includes(txn.tnx_type) ? (
                <p className="text-sm font-medium leading-none text-emerald-600">
                  {txn.crypto} {txn.tnx_amount}
                </p>
                 ) : (
                  <p className="text-sm font-medium leading-none text-red-500">
                  {txn.crypto} {txn.tnx_amount}
                  </p>
                )}
                
              </div>
              <div className="text-right">
                <p className="text-sm font-medium capitalize">{txn.network}</p>
                
              </div>
            </div>
          )) : (
            <p className="text-sm text-muted-foreground">No transactions found</p>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
