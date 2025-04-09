"use client"
import { useEffect, useState } from "react";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "./_components/sidebar";
import { Separator } from "@/components/ui/separator";
import { PortfolioSummary } from "./_components/portfolio-summary";
import { MarketOverview } from "./_components/market-overview";
import { RecentTransactions } from "./_components/recent-transactions";
import { AssetsList } from "./_components/asset-list";

import { LayoutDashboard } from "lucide-react";
function Dashboard() {
const [wallets, setWallets] = useState(null);

  useEffect(() => {
    const fetchWalletsData = async () => {
      try {
        const res = await fetch("/api/data", {
          credentials: "include",
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

    fetchWalletsData();
  }, []);
  return (
    <SidebarProvider className="bg-krypton-900/20">
      <AppSidebar />
      <div className="flex-1 p-10">
        <SidebarTrigger className="md:hidden xl:hidden 2xl:hidden lg:hidden" />
        <div className="flex items-center space-x-2">
  <LayoutDashboard className="text-white w-6 h-6" />
  <h1 className="text-4xl text-white font-bold">Dashboard</h1>
</div>
        <p className="text-gray-400 justify-self-end"> {wallets?.public_key || "Loading..."}</p>
               <Separator className="my-4 border-2 " />
               <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-7">
          <PortfolioSummary className="md:col-span-2 lg:col-span-3" />
          <MarketOverview className="md:col-span-2 lg:col-span-4" />
          <AssetsList className="md:col-span-2 lg:col-span-4" />
          <div className="space-y-6 md:col-span-2 lg:col-span-3">
            <RecentTransactions />   
          </div>
        </div>
      </div>
    </SidebarProvider>
  );
}

export default Dashboard;