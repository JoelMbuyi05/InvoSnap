// components/landing/Hero.js
'use client';

import { Button } from '@/components/ui/button';
import { Zap, ArrowRight, Sparkles } from 'lucide-react';
import Link from 'next/link';
import { useScrollAnimation } from '@/lib/hooks/useScrollAnimation';

export default function Hero() {
  const [heroRef, heroVisible] = useScrollAnimation({ once: true });
  const [cardRef, cardVisible] = useScrollAnimation({ once: true, threshold: 0.2 });

  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-blue-900 via-blue-800 to-indigo-900 min-h-screen flex flex-col">
      {/* Animated background blobs */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
        <div className="absolute top-40 left-40 w-80 h-80 bg-indigo-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000"></div>
      </div>

      {/* Navigation */}
      <nav className="container mx-auto px-4 py-6 relative z-10">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 animate-fade-right">
            <Zap className="h-8 w-8 text-blue-400" />
            <span className="text-2xl font-bold text-white">InvoSnap</span>
          </div>
          <div className="hidden md:flex items-center gap-6 animate-fade-left">
            <a href="#features" className="text-blue-100 hover:text-white transition-colors">Features</a>
            <a href="#how-it-works" className="text-blue-100 hover:text-white transition-colors">How it works</a>
            <a href="#pricing" className="text-blue-100 hover:text-white transition-colors">Pricing</a>
            <Link href="/login">
              <Button variant="ghost" className="text-white hover:bg-blue-800">Log in</Button>
            </Link>
            <Link href="/signup">
              <Button className="bg-white text-blue-900 hover:bg-blue-50 shadow-lg hover:shadow-xl transition-all">
                Get Started
              </Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Content */}
      <div className="flex-1 flex items-center">
        <div className="container mx-auto px-4 py-20 relative z-10">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left: Text Content */}
            <div 
              ref={heroRef}
              className={`transition-all duration-1000 ${
                heroVisible ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-12'
              }`}
            >
              <div className="inline-flex items-center gap-2 bg-blue-800/50 backdrop-blur-sm text-blue-100 px-4 py-2 rounded-full text-sm font-medium mb-6 border border-blue-700/50 hover:bg-blue-700/50 transition-all">
                <Sparkles className="h-4 w-4 animate-pulse" />
                Professional invoicing made simple
              </div>
              
              <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-white mb-6 leading-tight">
                Create invoices in{' '}
                <span className="bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent animate-gradient">
                  60 seconds
                </span>
              </h1>
              
              <p className="text-xl text-blue-100 mb-8 leading-relaxed">
                The fastest way to create professional invoices and get paid. 
                No accounting degree required. Perfect for freelancers and small businesses.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 mb-8">
                <Link href="/signup">
                  <Button size="lg" className="text-lg px-8 bg-white text-blue-900 hover:bg-blue-50 shadow-xl hover:shadow-2xl hover:scale-105 transition-all">
                    Start for Free
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </Link>
                <a href="#how-it-works">
                  <Button size="lg" variant="outline" className="text-lg px-8 border-2 border-white text-white hover:bg-white/10 backdrop-blur-sm transition-all">
                    See How It Works
                  </Button>
                </a>
              </div>

              <div className="flex flex-wrap items-center gap-6 text-sm text-blue-200">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                  <span>Free forever</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                  <span>No credit card required</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                  <span>Setup in 60 seconds</span>
                </div>
              </div>
            </div>

            {/* Right: Floating Invoice Card */}
            <div 
              ref={cardRef}
              className={`relative transition-all duration-1000 delay-300 ${
                cardVisible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-12'
              }`}
            >
              <div className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-2xl p-8 border border-blue-200/50 transform hover:scale-105 hover:rotate-1 transition-all duration-500">
                {/* Mock Invoice Preview */}
                <div className="space-y-6">
                  <div className="flex justify-between items-start">
                    <div>
                      <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg mb-3 animate-pulse"></div>
                      <div className="h-4 w-32 bg-gradient-to-r from-gray-200 to-gray-300 rounded animate-pulse"></div>
                      <div className="h-3 w-24 bg-gradient-to-r from-gray-100 to-gray-200 rounded mt-2 animate-pulse" style={{ animationDelay: '100ms' }}></div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm text-gray-500 mb-1 font-semibold">INVOICE</div>
                      <div className="h-5 w-24 bg-gray-900 rounded"></div>
                    </div>
                  </div>

                  <div className="border-t border-gray-200 pt-4">
                    <div className="space-y-3">
                      {[1, 2, 3].map((i) => (
                        <div key={i} className="flex justify-between items-center">
                          <div className="h-3 w-40 bg-gradient-to-r from-gray-200 to-gray-300 rounded animate-pulse" style={{ animationDelay: `${i * 150}ms` }}></div>
                          <div className="h-3 w-16 bg-gradient-to-r from-gray-200 to-gray-300 rounded animate-pulse" style={{ animationDelay: `${i * 150}ms` }}></div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="border-t border-gray-200 pt-4 flex justify-between items-center">
                    <div className="h-4 w-16 bg-gray-300 rounded font-semibold">Total</div>
                    <div className="h-7 w-28 bg-gradient-to-r from-blue-600 to-purple-600 rounded animate-pulse"></div>
                  </div>
                </div>
              </div>

              {/* Floating badges with animations */}
              <div className="absolute -top-6 -right-6 bg-gradient-to-r from-green-400 to-emerald-500 text-white px-6 py-3 rounded-2xl shadow-xl font-bold text-lg transform rotate-3 hover:rotate-0 hover:scale-110 transition-all duration-300 cursor-pointer">
                ⚡ 60 sec
              </div>
              <div className="absolute -bottom-6 -left-6 bg-gradient-to-r from-purple-500 to-pink-500 text-white px-6 py-3 rounded-2xl shadow-xl font-bold text-lg transform -rotate-3 hover:rotate-0 hover:scale-110 transition-all duration-300 cursor-pointer">
                📧 Email + WhatsApp
              </div>

              {/* Decorative circles */}
              <div className="absolute -z-10 -top-20 -right-20 w-40 h-40 bg-blue-400/20 rounded-full blur-3xl"></div>
              <div className="absolute -z-10 -bottom-20 -left-20 w-40 h-40 bg-purple-400/20 rounded-full blur-3xl"></div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}