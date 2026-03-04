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
    <section className="relative overflow-hidden bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 min-h-screen flex flex-col">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob"></div>
        <div className="absolute top-1/3 right-1/4 w-96 h-96 bg-purple-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-2000"></div>
        <div className="absolute bottom-1/4 left-1/3 w-96 h-96 bg-indigo-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-4000"></div>
      </div>

      {/* Navigation */}
      <nav className="container mx-auto px-4 py-6 relative z-10">
        <div className="flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 animate-fade-right cursor-pointer">
            <div className="bg-blue-600 p-2 rounded-lg">
              <Zap className="h-6 w-6 text-white" />
            </div>
            <span className="text-2xl font-bold text-gray-900">InvoSnap</span>
          </Link>
          
          <div className="hidden md:flex items-center gap-6 animate-fade-left">
            <a href="#features" className="text-gray-700 hover:text-blue-600 transition-colors font-medium cursor-pointer">
              Features
            </a>
            <a href="#how-it-works" className="text-gray-700 hover:text-blue-600 transition-colors font-medium cursor-pointer">
              How it works
            </a>
            
            <Link href="auth/login" className="cursor-pointer">
              <Button variant="outline" className="text-md px-4 border-2 border-blue-600 text-blue-600 hover:bg-blue-50 transition-all cursor-pointer w-full sm:w-auto">
                Log in
              </Button>
            </Link>
            
            <Link href="auth/signup" className="cursor-pointer">
              <Button className="bg-blue-600 text-white hover:bg-blue-700 shadow-lg hover:shadow-xl transition-all cursor-pointer">
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
              <div className="inline-flex items-center gap-2 bg-blue-100 text-blue-700 px-4 py-2 rounded-full text-sm font-medium mb-6 border border-blue-200 hover:bg-blue-200 transition-all cursor-default">
                <Sparkles className="h-4 w-4" />
                Professional invoicing made simple
              </div>
              
              <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-gray-900 mb-6 leading-tight">
                Create invoices in{' '}
                <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
                  60 seconds
                </span>
              </h1>
              
              <p className="text-xl text-gray-700 mb-8 leading-relaxed">
                The fastest way to create professional invoices and get paid. 
                No accounting degree required. Perfect for freelancers and small businesses.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 mb-8">
                <Link href="/signup" className="cursor-pointer">
                  <Button size="lg" className="text-lg px-8 bg-blue-600 text-white hover:bg-blue-700 shadow-xl hover:shadow-2xl hover:scale-105 transition-all cursor-pointer w-full sm:w-auto">
                    Start for Free
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </Link>
                
                <a href="#how-it-works" className="cursor-pointer">
                  <Button size="lg" variant="outline" className="text-lg px-8 border-2 border-blue-600 text-blue-600 hover:bg-blue-50 transition-all cursor-pointer w-full sm:w-auto">
                    See How It Works
                  </Button>
                </a>
              </div>

              <div className="flex flex-wrap items-center gap-6 text-sm text-gray-600">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span>No credit card required</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
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
              <div className="bg-white rounded-2xl shadow-2xl p-8 border border-gray-200 transform hover:scale-105 hover:-rotate-1 transition-all duration-500">
                {/* Mock Invoice Preview */}
                <div className="space-y-6">
                  <div className="flex justify-between items-start">
                    <div>
                      <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg mb-3"></div>
                      <div className="h-4 w-32 bg-gray-200 rounded"></div>
                      <div className="h-3 w-24 bg-gray-100 rounded mt-2"></div>
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
                          <div className="h-3 w-40 bg-gray-200 rounded"></div>
                          <div className="h-3 w-16 bg-gray-200 rounded"></div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="border-t border-gray-200 pt-4 flex justify-between items-center">
                    <div className="text-sm font-semibold text-gray-700">Total</div>
                    <div className="h-7 w-28 bg-gradient-to-r from-blue-600 to-purple-600 rounded"></div>
                  </div>
                </div>
              </div>

              {/* Floating badges */}
              <div className="absolute -top-6 -right-6 bg-gradient-to-r from-green-400 to-emerald-500 text-white px-6 py-3 rounded-2xl shadow-2xl font-bold text-lg transform rotate-3 hover:rotate-0 hover:scale-110 transition-all duration-300 cursor-default select-none">
                ⚡ 60 sec
              </div>
              <div className="absolute -bottom-6 -left-6 bg-gradient-to-r from-purple-500 to-pink-500 text-white px-6 py-3 rounded-2xl shadow-2xl font-bold text-lg transform -rotate-3 hover:rotate-0 hover:scale-110 transition-all duration-300 cursor-default select-none">
                📧 Email + WhatsApp
              </div>

              {/* Decorative elements */}
              <div className="absolute -z-10 -top-20 -right-20 w-64 h-64 bg-blue-200 rounded-full blur-3xl opacity-50"></div>
              <div className="absolute -z-10 -bottom-20 -left-20 w-64 h-64 bg-purple-200 rounded-full blur-3xl opacity-50"></div>
            </div>
          </div>
        </div>
      </div>

    </section>
  );
}