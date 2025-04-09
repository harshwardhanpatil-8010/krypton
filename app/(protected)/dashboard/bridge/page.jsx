"use client";

import { SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar';
import React, { useState } from 'react';
import { AppSidebar } from '../_components/sidebar';
import { Separator } from '@/components/ui/separator';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Loader2, Refrigerator } from 'lucide-react';

const CHAINS = ['Ethereum', 'Polygon', 'Binance Smart Chain', 'Arbitrum'];
const TOKENS = ['ETH', 'USDC', 'DAI'];

export default function CryptoBridge() {
  const [amount, setAmount] = useState('');
  const [token, setToken] = useState('ETH');
  const [sourceChain, setSourceChain] = useState('Ethereum');
  const [destChain, setDestChain] = useState('Polygon');
  const [isBridging, setIsBridging] = useState(false);

  const handleBridge = async () => {
    if (!amount || !token || sourceChain === destChain) {
      return alert('Please enter valid values and select different chains.');
    }

    setIsBridging(true);
    try {
      const response = await fetch('/api/bridge', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ amount, token, sourceChain, destChain }),
      });
      const data = await response.json();
      alert('Bridge Successful: ' + data.message);
    } catch (error) {
      alert('Bridge Failed');
    }
    setIsBridging(false);
  };

  const swapChains = () => {
    setSourceChain(destChain);
    setDestChain(sourceChain);
  };

  return (
    <SidebarProvider className="bg-krypton-900/20">
      <AppSidebar />
      <div className="flex flex-col flex-1 p-6 md:p-10">
        
        <div className="flex items-center justify-between mb-6">
          <SidebarTrigger className="md:hidden" />
          <div className="flex items-center space-x-3">
            <Refrigerator className="text-white w-6 h-6" />
            <h1 className="text-4xl text-white font-bold">Bridge</h1>
          </div>
        </div>

        <Separator className="my-4 border-2" />

       
        <div className="max-w-2xl mx-auto bg-gray-900/90 backdrop-blur-xl rounded-3xl p-10 space-y-10 shadow-2xl mt-20 border border-green-800/30">
          <div className="space-y-8">
            
            <div className="relative">
              <Input
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="Enter amount"
                className="bg-gray-800/50 text-white placeholder:text-gray-400 h-16 text-lg pl-6 rounded-xl border border-green-800/30"
              />
              <Select value={token} onValueChange={setToken}>
                <SelectTrigger className="w-32 absolute right-2 top-2 bg-gray-700/50 text-white border-none h-12 rounded-lg">
                  <SelectValue placeholder="Token" />
                </SelectTrigger>
                <SelectContent className="bg-gray-800 border border-green-800/30">
                  {TOKENS.map((tk) => (
                    <SelectItem key={tk} value={tk} className="text-white hover:bg-green-800/30">
                      {tk}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 relative">
              <div>
                <label className="text-green-400 text-sm mb-2 block">From Chain</label>
                <Select value={sourceChain} onValueChange={setSourceChain}>
                  <SelectTrigger className="w-full bg-gray-800/50 text-white h-14 text-base rounded-xl border border-green-800/30">
                    <SelectValue placeholder="Source Chain" />
                  </SelectTrigger>
                  <SelectContent className="bg-gray-800 border border-green-800/30">
                    {CHAINS.map((chain) => (
                      <SelectItem key={chain} value={chain} className="text-white hover:bg-green-800/30">
                        {chain}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="text-green-400 text-sm mb-2 block">To Chain</label>
                <Select value={destChain} onValueChange={setDestChain}>
                  <SelectTrigger className="w-full bg-gray-800/50 text-white h-14 text-base rounded-xl border border-green-800/30">
                    <SelectValue placeholder="Destination Chain" />
                  </SelectTrigger>
                  <SelectContent className="bg-gray-800 border border-green-800/30">
                    {CHAINS.map((chain) => (
                      <SelectItem key={chain} value={chain} className="text-white hover:bg-green-800/30">
                        {chain}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

        
          <Button
            onClick={handleBridge}
            disabled={isBridging}
            className="w-full h-16 text-lg font-semibold bg-gradient-to-r from-green-600 to-green-500 hover:from-green-500 hover:to-green-400 text-white rounded-xl transition-all duration-200 shadow-lg hover:shadow-green-500/30"
          >
            {isBridging ? (
              <>
                <Loader2 className="w-5 h-5 mr-3 animate-spin" />
                Processing...
              </>
            ) : (
              'Bridge Tokens'
            )}
          </Button>
        </div>
      </div>
    </SidebarProvider>
  );
}
