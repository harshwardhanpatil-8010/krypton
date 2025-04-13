"use client";

import React, { useState } from "react";
import { AppSidebar } from "../_components/sidebar";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { Separator } from "@/components/ui/separator";
import { ChevronDown, FolderSync } from "lucide-react";
import { Toaster } from "sonner";
import { Toast } from "@/components/ui/toast";

export default function SendCrypto() {
  const [selectedNetwork, setSelectedNetwork] = useState("Ethereum");
  const [selectedToken, setSelectedToken] = useState("ETH");
  const [recipient, setRecipient] = useState("");
  const [amount, setAmount] = useState("");
  const [confirmWalletAddress, setConfirmWalletAddress] = useState("");
  const [showNetworkDropdown, setShowNetworkDropdown] = useState(false);
  const [showTokenDropdown, setShowTokenDropdown] = useState(false);
  const [confirmStep, setConfirmStep] = useState(false);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const networks = ["Ethereum", "Bitcoin"];
  const tokens = {
    Ethereum: ["ETH", "USDT", "DAI"],
    Bitcoin: ["BTC", "WBTC", "USDT"],
  };

  const handleSend = (e) => {
    e.preventDefault();
    setMessage("");
    if (!recipient || !amount) {
      Toast.error("Please enter all fields.");
      return;
    }
    setConfirmStep(true);
  };

  const handleConfirmTransfer = async (e) => {
    e.preventDefault();
    setMessage("");

    if (confirmWalletAddress !== recipient) {
      setMessage("❌ Wallet addresses do not match.");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/transfer", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          recipient,
          amount,
          network: selectedNetwork,
          crypto: selectedToken,
        }),
      });

      const text = await res.text();
      const data = text ? JSON.parse(text) : null;

      if (res.ok) {
        setMessage("✅ Transfer successful!");
        setRecipient("");
        setAmount("");
        setConfirmWalletAddress("");
        setConfirmStep(false);
      } else {
        setMessage(`❌ ${data?.message || "Transfer failed"}`);
      }
    } catch (err) {
      console.error("Client error:", err);
      setMessage("❌ Unexpected error occurred.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <SidebarProvider className="bg-krypton-900/20">
      <AppSidebar />
      <div className="flex flex-col flex-1 p-8">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <FolderSync className="text-white w-6 h-6" />
            <h1 className="text-4xl text-white font-bold">Transfer</h1>
          </div>
          <SidebarTrigger className="md:hidden xl:hidden" />
        </div>

        <Separator className="my-4 border-2" />

        <div className="flex justify-center items-center flex-1">
          <div className="bg-gray-800 p-8 rounded-3xl w-[400px] shadow-2xl border border-gray-700 text-white">
            {!confirmStep ? (
              <form onSubmit={handleSend} className="space-y-5">
                {/* Network Dropdown */}
                <div className="relative">
                  <div
                    className="flex justify-between bg-[#1E1E1E] px-5 py-4 rounded-xl cursor-pointer"
                    onClick={() => setShowNetworkDropdown(!showNetworkDropdown)}
                  >
                    <span>{selectedNetwork}</span>
                    <ChevronDown className="w-5 h-5" />
                  </div>
                  {showNetworkDropdown && (
                    <div className="absolute w-full bg-gray-700 mt-2 rounded-xl z-10">
                      {networks.map((network) => (
                        <div
                          key={network}
                          className="px-5 py-3 hover:bg-gray-600 cursor-pointer rounded-xl"
                          onClick={() => {
                            setSelectedNetwork(network);
                            setSelectedToken(tokens[network][0]);
                            setShowNetworkDropdown(false);
                          }}
                        >
                          {network}
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Token Dropdown */}
                <div className="relative">
                  <div
                    className="flex justify-between bg-[#1E1E1E] px-5 py-4 rounded-xl cursor-pointer"
                    onClick={() => setShowTokenDropdown(!showTokenDropdown)}
                  >
                    <span>{selectedToken}</span>
                    <ChevronDown className="w-5 h-5" />
                  </div>
                  {showTokenDropdown && (
                    <div className="absolute w-full bg-gray-700 mt-2 rounded-xl z-10">
                      {tokens[selectedNetwork].map((token) => (
                        <div
                          key={token}
                          className="px-5 py-3 hover:bg-gray-600 cursor-pointer rounded-xl"
                          onClick={() => {
                            setSelectedToken(token);
                            setShowTokenDropdown(false);
                          }}
                        >
                          {token}
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Inputs */}
                <div>
                  <span>Recipient Address</span>
                  <input
                    type="text"
                    value={recipient}
                    onChange={(e) => setRecipient(e.target.value)}
                    className="bg-[#1E1E1E] w-full px-5 py-4 mt-2 rounded-xl outline-none"
                    placeholder="Recipient wallet address"
                  />
                </div>

                <div>
                  <span>Amount</span>
                  <input
                    type="number"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    className="bg-[#1E1E1E] w-full px-5 py-4 mt-2 rounded-xl outline-none"
                    placeholder="0.0"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full mt-6 bg-blue-600 py-4 rounded-xl font-semibold hover:opacity-90"
                  disabled={!recipient || !amount}
                >
                  Proceed to Confirm
                </button>
              </form>
            ) : (
              <form onSubmit={handleConfirmTransfer} className="space-y-5">
                <p className="text-center text-gray-300">
                  Re-enter the wallet address to confirm.
                </p>
                <input
                  type="text"
                  className="w-full px-4 py-3 bg-gray-700 rounded-lg"
                  value={confirmWalletAddress}
                  onChange={(e) => setConfirmWalletAddress(e.target.value)}
                  placeholder="Re-enter wallet address"
                  onPaste={(e) => e.preventDefault()}
                />
                <button
                  type="submit"
                  className="w-full bg-green-600 py-3 rounded-lg"
                  disabled={loading}
                >
                  {loading ? "Processing..." : "Confirm & Transfer"}
                </button>
                <button
                  type="button"
                  className="w-full bg-gray-600 py-3 rounded-lg"
                  onClick={() => setConfirmStep(false)}
                >
                  Edit Details
                </button>
              </form>
            )}

            {message && (
              <p
                className={`mt-4 text-center font-medium ${
                  message.includes("✅") ? "text-green-400" : "text-red-400"
                }`}
              >
                {message}
              </p>
            )}
          </div>
        </div>
      </div>
    </SidebarProvider>
  );
}
