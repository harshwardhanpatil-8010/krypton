"use client";

import React, { useState } from "react";
import { AppSidebar } from "../_components/sidebar";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { Separator } from "@/components/ui/separator";
import { ChevronDown, FolderSync } from "lucide-react";
import { Toaster } from "sonner";
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

  const handleSend = async (e) => {
    e.preventDefault();
    setMessage("");

    if (!recipient || !amount) {
      toast.error("Please enter all fields.");
      return;
    }

    setConfirmStep(true);
  };

  const handleConfirmTransfer = async (e) => {
    e.preventDefault();
    setMessage("");

    if (confirmWalletAddress !== recipient) {
      setMessage("❌ Wallet addresses do not match. Please try again.");
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

      let data = null;
      const text = await res.text();

      if (text.trim() === "") {
        setMessage("❌ Server returned no content.");
        setLoading(false);
        return;
      }

      try {
        data = JSON.parse(text);
      } catch (jsonErr) {
        setMessage("❌ Server returned malformed response.");
        setLoading(false);
        return;
      }

      if (res.ok) {
        setMessage("✅ Transaction successful!");
        setRecipient("");
        setAmount("");
        setConfirmWalletAddress("");
        setConfirmStep(false);
      } else {
        setMessage(`❌ ${data?.message || "Transaction failed"}`);
      }
    } catch (err) {
      console.error("Client error:", err);
      setMessage("❌ An unexpected error occurred.");
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
          <SidebarTrigger className="md:hidden xl:hidden 2xl:hidden lg:hidden" />
        </div>

        <Separator className="my-4 border-2" />

        <div className="flex justify-center items-center flex-1">
          <div className="bg-gray-800 backdrop-blur-lg text-white p-8 rounded-3xl w-[400px] shadow-2xl border border-gray-700">
            {!confirmStep ? (
              <form onSubmit={handleSend} className="space-y-5">
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

                <div className="mt-6 relative">
                  <div
                    className="flex items-center justify-between bg-[#1E1E1E]/90 px-5 py-4 rounded-xl cursor-pointer hover:bg-[#252525] transition-colors duration-200"
                    onClick={() => setShowTokenDropdown(!showTokenDropdown)}
                  >
                    <span className="font-medium">{selectedToken}</span>
                    <ChevronDown className="w-5 h-5 text-gray-400" />
                  </div>
                  {showTokenDropdown && (
                    <div className="absolute w-full bg-gray-700 mt-2 rounded-xl shadow-lg z-10">
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

                <div className="mt-6">
                  <span className="text-sm font-semibold text-gray-300">Recipient Address</span>
                  <input
                    type="text"
                    value={recipient}
                    onChange={(e) => setRecipient(e.target.value)}
                    className="bg-[#1E1E1E]/90 w-full text-white px-5 py-4 mt-2 rounded-xl outline-none"
                    placeholder="Enter recipient wallet address"
                  />
                </div>

                <div className="mt-6">
                  <span className="text-sm font-semibold text-gray-300">Amount</span>
                  <input
                    type="number"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    className="bg-[#1E1E1E]/90 w-full text-white px-5 py-4 mt-2 rounded-xl outline-none"
                    placeholder="0.0"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full mt-6 bg-blue-600 text-white py-4 rounded-xl text-center font-semibold text-lg hover:opacity-90 transition-opacity duration-200 shadow-lg shadow-blue-500/20"
                  disabled={!recipient || !amount}
                >
                  Proceed to Confirm
                </button>
              </form>
            ) : (
              <form onSubmit={handleConfirmTransfer} className="space-y-5">
                <p className="text-gray-300 text-center">
                  Please re-enter the wallet address to confirm.
                </p>
                <div>
                  <label className="block font-medium text-gray-300">Confirm Wallet Address</label>
                  <input
                    type="text"
                    className="w-full mt-2 px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={confirmWalletAddress}
                    onChange={(e) => setConfirmWalletAddress(e.target.value)}
                    placeholder="Re-enter wallet address"
                    onPaste={(e) => e.preventDefault()}
                  />
                </div>
                <button
                  type="submit"
                  className="w-full bg-green-600 hover:bg-green-700 text-white py-3 rounded-lg font-semibold text-lg transition duration-200"
                  disabled={loading}
                >
                  {loading ? "Processing..." : "Confirm & Transfer"}
                </button>
                <button
                  type="button"
                  className="w-full bg-gray-600 hover:bg-gray-700 text-white py-3 rounded-lg font-semibold text-lg transition duration-200 mt-2"
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
