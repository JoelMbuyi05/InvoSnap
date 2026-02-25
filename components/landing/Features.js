// components/landing/Features.js
'use client';

import { Zap, Mail, MessageCircle, FileText, Eye, Download } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { useScrollAnimation } from '@/lib/hooks/useScrollAnimation';

const features = [
  {
    icon: Zap,
    title: 'Lightning Fast',
    description: 'Create professional invoices in under 60 seconds. No complex setup, no learning curve.',
    color: 'text-yellow-600 bg-yellow-100',
    gradient: 'from-yellow-400 to-orange-500'
  },
  {
    icon: MessageCircle,
    title: 'WhatsApp Ready',
    description: 'Send invoices directly via WhatsApp. Perfect for clients who prefer messaging.',
    color: 'text-green-600 bg-green-100',
    gradient: 'from-green-400 to-emerald-500'
  },
  {
    icon: Mail,
    title: 'Email Integration',
    description: 'Professional emails with PDF attachments sent automatically. Branded and beautiful.',
    color: 'text-blue-600 bg-blue-100',
    gradient: 'from-blue-400 to-indigo-500'
  },
  {
    icon: FileText,
    title: 'Beautiful Templates',
    description: 'Choose from professionally designed templates. Customize colors, add your logo.',
    color: 'text-purple-600 bg-purple-100',
    gradient: 'from-purple-400 to-pink-500'
  },
  {
    icon: Eye,
    title: 'Track Views',
    description: 'Know exactly when clients view your invoices. Never wonder if they received it.',
    color: 'text-pink-600 bg-pink-100',
    gradient: 'from-pink-400 to-rose-500'
  },
  {
    icon: Download,
    title: 'PDF Export',
    description: 'Download professional PDFs anytime. Perfect for printing or offline sharing.',
    color: 'text-indigo-600 bg-indigo-100',
    gradient: 'from-indigo-400 to-purple-500'
  }
];

function FeatureCard({ feature, index }) {
  const [ref, isVisible] = useScrollAnimation({ once: true, threshold: 0.2 });

  return (
    <div
      ref={ref}
      className={`transition-all duration-700 ${
        isVisible 
          ? 'opacity-100 translate-y-0' 
          : 'opacity-0 translate-y-8'
      }`}
      style={{ transitionDelay: `${index * 100}ms` }}
    >
      <Card className="border-2 hover:border-blue-300 hover:shadow-xl transition-all duration-300 h-full group">
        <CardContent className="p-6">
          <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${feature.gradient} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}>
            <feature.icon className="h-6 w-6 text-white" />
          </div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">
            {feature.title}
          </h3>
          <p className="text-gray-600 leading-relaxed">
            {feature.description}
          </p>
        </CardContent>
      </Card>
    </div>
  );
}

export default function Features() {
  const [titleRef, titleVisible] = useScrollAnimation({ once: true });

  return (
    <section id="features" className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <div 
          ref={titleRef}
          className={`text-center mb-16 transition-all duration-1000 ${
            titleVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}
        >
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Everything you need to get paid
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Simple, powerful features that help you create invoices and get paid faster
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <FeatureCard key={index} feature={feature} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
}