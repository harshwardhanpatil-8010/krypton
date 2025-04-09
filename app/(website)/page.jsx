
import React from 'react';

import { ArrowRight } from 'lucide-react';

import Link from 'next/link';
import Navbar from './navbar';
import ParticleBackground from '@/components/ui/particlebackground';


const Hero = () => {
  return (
    <section className="relative min-h-screen flex flex-col justify-center items-center pt-24 pb-16 px-4 overflow-hidden">

      <ParticleBackground/>
      <Navbar/>
      <div className="absolute inset-0 opacity-20 pointer-events-none">
        <div className="absolute top-0 -left-1/4 w-1/2 h-1/2 bg-krypton-500/20 rounded-full blur-[120px]" />
        <div className="absolute bottom-0 -right-1/4 w-1/2 h-1/2 bg-krypton-400/20 rounded-full blur-[100px]" />
      </div>
      
      <div className="container mx-auto z-10">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-block glass-morphism rounded-full px-3 py-1 mb-6 backdrop-blur-sm animate-fade-in opacity-0" style={{ animationDelay: '0.2s' }}>
            <span className="text-sm font-medium text-krypton-300">Revolutionizing Crypto Portfolio Management</span>
          </div>
          
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6 leading-tight animate-fade-in opacity-0" style={{ animationDelay: '0.4s' }}>
            <span className="text-white">Control Your Crypto</span>
            <br />
            <span className="text-glow text-krypton-400">Navigate The Future</span>
          </h1>
          
          <p className="text-lg md:text-xl text-gray-300 mb-10 max-w-3xl mx-auto animate-fade-in opacity-0" style={{ animationDelay: '0.6s' }}>
            Krypton provides a powerful, intuitive platform to monitor, analyze, and optimize your cryptocurrency investments in real-time with advanced analytics.
          </p>
          
          <div className="flex flex-col sm:flex-row justify-center gap-4 animate-fade-in opacity-0" style={{ animationDelay: '0.8s' }}>
            <Link href="/register" className="bg-krypton-500 hover:bg-krypton-600 text-white px-8 py-3 rounded-lg text-lg font-medium ">
              Get Started Free
            </Link>
          
          </div>
        </div>
        

        <div className="mt-16 max-w-5xl mx-auto relative animate-fade-in opacity-0" style={{ animationDelay: '1s' }}>
          <div className="glass-card rounded-xl border border-gray-700 shadow-2xl overflow-hidden transition-transform hover:translate-y-[-5px] duration-300">
            <div className="relative">
            
              <div className="aspect-[16/9] w-full bg-gradient-to-br from-gray-900 to-gray-800 p-6">
                <div className="h-full rounded-lg border border-gray-700 bg-black/40 p-4 flex flex-col">
                  <div className="flex gap-2 mb-4">
                    <div className="w-3 h-3 rounded-full bg-red-500"></div>
                    <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                    <div className="w-3 h-3 rounded-full bg-green-500"></div>
                  </div>
                  
                  <div className="flex-1 grid grid-cols-3 gap-4">
                    <div className="col-span-2 rounded bg-white/5 p-3">
                      <div className="mb-2 h-4 w-24 rounded bg-white/10"></div>
                      <div className="space-y-3">
                        <div className="h-24 rounded bg-krypton-500/20 flex items-end">
                          <div className="flex-1 flex justify-around items-end">
                            <div className="w-1/12 h-[10%] rounded-t bg-krypton-400/80"></div>
                            <div className="w-1/12 h-[20%] rounded-t bg-krypton-400/80"></div>
                            <div className="w-1/12 h-[60%] rounded-t bg-krypton-400/80"></div>
                            <div className="w-1/12 h-[40%] rounded-t bg-krypton-400/80"></div>
                            <div className="w-1/12 h-[30%] rounded-t bg-krypton-400/80"></div>
                            <div className="w-1/12 h-[70%] rounded-t bg-krypton-400/80"></div>
                            <div className="w-1/12 h-[45%] rounded-t bg-krypton-400/80"></div>
                            <div className="w-1/12 h-[55%] rounded-t bg-krypton-400/80"></div>
                          </div>
                        </div>
                        <div className="flex justify-between">
                          <div className="h-3 w-16 rounded bg-white/10"></div>
                          <div className="h-3 w-16 rounded bg-white/10"></div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="col-span-1 space-y-4">
                      <div className="rounded bg-white/5 p-3">
                        <div className="mb-2 h-3 w-16 rounded bg-white/10"></div>
                        <div className="h-3 w-28 rounded bg-krypton-400/60"></div>
                      </div>
                      <div className="rounded bg-white/5 p-3">
                        <div className="mb-2 h-3 w-20 rounded bg-white/10"></div>
                        <div className="h-16 rounded-full bg-krypton-500/20 flex items-center justify-center">
                          <div className="h-10 w-10 rounded-full bg-krypton-400/80"></div>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="mt-4 grid grid-cols-4 gap-3">
                    <div className="rounded bg-white/5 p-2">
                      <div className="h-2 w-12 rounded bg-white/10 mb-1"></div>
                      <div className="h-3 w-16 rounded bg-krypton-400/40"></div>
                    </div>
                    <div className="rounded bg-white/5 p-2">
                      <div className="h-2 w-12 rounded bg-white/10 mb-1"></div>
                      <div className="h-3 w-10 rounded bg-red-400/40"></div>
                    </div>
                    <div className="rounded bg-white/5 p-2">
                      <div className="h-2 w-12 rounded bg-white/10 mb-1"></div>
                      <div className="h-3 w-14 rounded bg-green-400/40"></div>
                    </div>
                    <div className="rounded bg-white/5 p-2">
                      <div className="h-2 w-12 rounded bg-white/10 mb-1"></div>
                      <div className="h-3 w-12 rounded bg-yellow-400/40"></div>
                    </div>
                  </div>
                </div>
              </div>
              
      
              <div className="absolute inset-0 rounded-xl pointer-events-none animate-glow opacity-70"></div>
            </div>
          </div>
          
         
          <div className="absolute -right-12 top-1/4 glass-morphism rounded-lg p-3 animate-float shadow-lg hidden md:block">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-green-500/20 flex items-center justify-center">
                <div className="w-3 h-3 rounded-full bg-green-500"></div>
              </div>
              <div>
                <div className="text-xs text-gray-400">Bitcoin</div>
                <div className="text-sm font-medium text-white">+12.34%</div>
              </div>
            </div>
          </div>
          
          <div className="absolute -left-8 bottom-1/4 glass-morphism rounded-lg p-3 animate-float shadow-lg hidden md:block" style={{ animationDelay: '1s' }}>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-krypton-500/20 flex items-center justify-center">
                <div className="w-3 h-3 rounded-full bg-krypton-500"></div>
              </div>
              <div>
                <div className="text-xs text-gray-400">Ethereum</div>
                <div className="text-sm font-medium text-white">+5.67%</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;