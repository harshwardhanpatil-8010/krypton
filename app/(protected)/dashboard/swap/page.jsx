"use client";

import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import React, { useState } from "react";
import { AppSidebar } from "../_components/sidebar";
import { Separator } from "@/components/ui/separator";
import { ChevronDown, ArrowUpDown, ArrowRightLeft } from "lucide-react";
import { toast } from "sonner";

export default function Swap() {
  const [selectedNetwork, setSelectedNetwork] = useState("Ethereum");
  const [fromToken, setFromToken] = useState("ETH");
  const [toToken, setToToken] = useState("");
  const [amount, setAmount] = useState("");
  const [showNetworkDropdown, setShowNetworkDropdown] = useState(false);
  const [showFromDropdown, setShowFromDropdown] = useState(false);
  const [showToDropdown, setShowToDropdown] = useState(false);

  const networks = ["Ethereum", "Bitcoin"];
  const tokens = {
    Ethereum: ["ETH", "USDT", "DAI"],
    Bitcoin: ["BTC", "ETH", "USDT"],
  };

  const handleSwap = async () => {
    if (!amount || !fromToken || !toToken) {
      toast.error("Please enter amount and select tokens.");
      return;
    }

    try {
      const res = await fetch("/api/swap", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          network: selectedNetwork,
          fromToken,
          toToken,
          amount: parseFloat(amount),
        }),
      });

      if (!res.ok) throw toast.error("Swap API failed");

      const data = await res.json();

      toast.success(`You will receive approx ${data.convertedAmount} ${toToken}`);
    } catch (error) {
      toast.error("Failed to fetch quote.");
    }
  };

  const swapTokens = () => {
    if (!toToken) return toast.error("Please select a token to swap to.");
    setFromToken(toToken);
    setToToken(fromToken);
  };

  return (
    <SidebarProvider className="bg-krypton-900/20">
      <AppSidebar />

      <div className="flex flex-col flex-1 p-8">
        <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
  <ArrowRightLeft className="text-white w-6 h-6" />
  <h1 className="text-4xl text-white font-bold">Swap</h1>
</div>
          <SidebarTrigger className="md:hidden xl:hidden 2xl:hidden lg:hidden" />
        </div>

        <Separator className="my-4 border-2" />

        <div className="flex justify-center items-center flex-1">
          <div className="bg-gray-800 backdrop-blur-lg text-white p-8 rounded-3xl w-[400px] shadow-2xl border border-gray-700">
            <div className="relative">
              <div
                className="flex items-center justify-between bg-[#1E1E1E]/90 px-5 py-4 rounded-xl cursor-pointer hover:bg-[#252525] transition-colors duration-200"
                onClick={() => setShowNetworkDropdown(!showNetworkDropdown)}
              >
                <span className="font-medium">{selectedNetwork}</span>
                <ChevronDown className="w-5 h-5 text-gray-400" />
              </div>
              {showNetworkDropdown && (
                <div className="absolute w-full bg-gray-700 mt-2 rounded-xl shadow-lg z-10">
                  {networks.map((network) => (
                    <div
                      key={network}
                      className="px-5 py-3 hover:bg-gray-600 cursor-pointer rounded-xl"
                      onClick={() => {
                        setSelectedNetwork(network);
                        setFromToken(tokens[network][0]);
                        setToToken("");
                        setShowNetworkDropdown(false);
                      }}
                    >
                      {network}
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="mt-8">
              <span className="text-sm font-semibold text-gray-300">Swap from</span>
              <div className="relative">
                <div
                  className="flex items-center justify-between bg-[#1E1E1E]/90 px-5 py-4 mt-2 rounded-xl hover:bg-[#252525] transition-colors duration-200 cursor-pointer"
                  onClick={() => setShowFromDropdown(!showFromDropdown)}
                >
                  <div className="flex items-center gap-3">
                    <span className="w-8 h-8 bg-blue-500 rounded-full"></span>
                    <span className="font-medium">{fromToken}</span>
                  </div>
                  <ChevronDown className="w-5 h-5 text-gray-400" />
                </div>
                {showFromDropdown && (
                  <div className="absolute w-full bg-gray-700 mt-2 rounded-xl shadow-lg z-10">
                    {tokens[selectedNetwork]?.map((token) => (
                      <div
                        key={token}
                        className="px-5 py-3 hover:bg-gray-600 cursor-pointer rounded-xl"
                        onClick={() => {
                          setFromToken(token);
                          setShowFromDropdown(false);
                        }}
                      >
                        {token}
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <input
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="bg-[#1E1E1E]/90 text-right outline-none w-full text-xl font-medium px-5 py-4 mt-2 rounded-xl"
                placeholder="0.0"
              />
            </div>

            <div className="flex justify-center my-4">
              <div
                className="p-2 bg-[#1E1E1E] rounded-lg cursor-pointer hover:bg-[#252525] transition duration-200"
                onClick={swapTokens}
              >
                <ArrowUpDown className="w-5 h-5 text-gray-400" />
              </div>
            </div>

            <div className="mt-4">
              <span className="text-sm font-semibold text-gray-300">Swap to</span>
              <div className="relative">
                <div
                  className="flex items-center justify-between bg-[#1E1E1E]/90 px-5 py-4 mt-2 rounded-xl cursor-pointer hover:bg-[#252525] transition-colors duration-200"
                  onClick={() => setShowToDropdown(!showToDropdown)}
                >
                  <div className="flex items-center gap-3">
                    <span className="w-8 h-8 bg-purple-500 rounded-full"></span>
                    <span className="font-medium">{toToken || "Select a token"}</span>
                  </div>
                  <ChevronDown className="w-5 h-5 text-gray-400" />
                </div>
                {showToDropdown && tokens[selectedNetwork] && (
                  <div className="absolute w-full bg-gray-700 mt-2 rounded-xl shadow-lg z-10">
                    {tokens[selectedNetwork].map((token) => (
                      <div
                        key={token}
                        className="px-5 py-3 hover:bg-gray-600 cursor-pointer rounded-xl"
                        onClick={() => {
                          setToToken(token);
                          setShowToDropdown(false);
                        }}
                      >
                        {token}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            <button
              className="w-full mt-6 bg-blue-600 text-white py-4 rounded-xl text-center font-semibold text-lg hover:opacity-90 transition-opacity duration-200 shadow-lg shadow-blue-500/20 cursor-pointer"
              disabled={!toToken || !amount}
              onClick={handleSwap}
            >
              Get Quotes
            </button>
          </div>
        </div>
      </div>
    </SidebarProvider>
  );
}
