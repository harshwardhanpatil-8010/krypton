"use client";

import React, { useState } from "react";
import { AppSidebar } from "../_components/sidebar";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { Separator } from "@/components/ui/separator";
import { ChevronDown, SatelliteDish } from "lucide-react";
import { toast, Toaster } from "sonner";

function Receive() {
  const [selectedNetwork, setSelectedNetwork] = useState("Ethereum");
  const [selectedToken, setSelectedToken] = useState("ETH");
  const [senderPublicKey, setSenderPublicKey] = useState("");
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
    if (!senderPublicKey || !amount) {
      toast.error("Please enter all fields.");
      return;
    }
    setConfirmStep(true);
  };

  const handleConfirmTransfer = async (e) => {
    e.preventDefault();
    setMessage("");

    if (confirmWalletAddress !== senderPublicKey) {
      setMessage("❌ Wallet addresses do not match. Please try again.");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/receive", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          sender: senderPublicKey, // sender's public key
          amount,
          network: selectedNetwork,
          crypto: selectedToken,
        }),
      });

      const text = await res.text();
      let data = null;

      if (text.trim() === "") {
        setMessage("❌ Server returned no content.");
        setLoading(false);
        return;
      }

      try {
        data = JSON.parse(text);
      } catch {
        setMessage("❌ Server returned malformed response.");
        setLoading(false);
        return;
      }

      if (res.ok) {
        setMessage("✅ Transaction successful!");
        setSenderPublicKey("");
        setAmount("");
        setConfirmWalletAddress("");
        setConfirmStep(false);
      } else {
        setMessage(`❌ ${data?.message || "Transaction failed"}`);
      }
    } catch {
      setMessage("❌ An unexpected error occurred.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <SidebarProvider className="bg-krypton-900/20">
      <AppSidebar />
      <div className="flex flex-col flex-1 p-6 md:p-10">
        <div className="flex items-center justify-between mb-6">
          <SidebarTrigger className="md:hidden" />
          <div className="flex items-center space-x-2">
            <SatelliteDish className="text-white w-6 h-6" />
            <h1 className="text-4xl text-white font-bold">Receive</h1>
          </div>
        </div>
        <Separator className="my-4 border-2" />

        <div className="flex justify-center items-center flex-1">
          <div className="bg-gray-800 backdrop-blur-lg text-white p-8 rounded-3xl w-full max-w-md shadow-2xl border border-gray-700">
            {!confirmStep ? (
              <form onSubmit={handleSend} className="space-y-6">
                {/* Network Dropdown */}
                <div className="relative">
                  <div
                    className="flex items-center justify-between bg-[#1E1E1E]/90 px-5 py-4 rounded-xl cursor-pointer hover:bg-[#252525] transition"
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

                {/* Token Dropdown */}
                <div className="relative">
                  <div
                    className="flex items-center justify-between bg-[#1E1E1E]/90 px-5 py-4 rounded-xl cursor-pointer hover:bg-[#252525] transition"
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

                {/* Sender Public Key */}
                <div>
                  <label className="text-sm font-semibold text-gray-300">Sender Wallet Address</label>
                  <input
                    type="text"
                    value={senderPublicKey}
                    onChange={(e) => setSenderPublicKey(e.target.value)}
                    className="bg-[#1E1E1E]/90 w-full text-white px-5 py-4 mt-2 rounded-xl outline-none"
                    placeholder="Enter sender's wallet address"
                  />
                </div>

                {/* Amount */}
                <div>
                  <label className="text-sm font-semibold text-gray-300">Amount</label>
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
                  className="w-full bg-blue-600 text-white py-4 rounded-xl font-semibold text-lg hover:opacity-90 transition"
                  disabled={!senderPublicKey || !amount}
                >
                  Proceed to Confirm
                </button>
              </form>
            ) : (
              <form onSubmit={handleConfirmTransfer} className="space-y-5">
                <p className="text-gray-300 text-center">
                  Please re-enter the sender wallet address to confirm.
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
                  className="w-full bg-green-600 hover:bg-green-700 text-white py-3 rounded-lg font-semibold text-lg transition"
                  disabled={loading}
                >
                  {loading ? "Processing..." : "Confirm & Transfer"}
                </button>
                <button
                  type="button"
                  className="w-full bg-gray-600 hover:bg-gray-700 text-white py-3 rounded-lg font-semibold text-lg transition mt-2"
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
      <Toaster richColors />
    </SidebarProvider>
  );
}

export default Receive;
