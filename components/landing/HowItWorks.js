// components/landing/HowItWorks.js
'use client';

import { FileText, Palette, Send } from 'lucide-react';
import { useScrollAnimation } from '@/lib/hooks/useScrollAnimation';

const steps = [
  {
    number: '1',
    icon: FileText,
    title: 'Fill in the details',
    description: 'Add your client info, line items, and payment terms. Takes less than a minute.',
    color: 'bg-blue-600',
    gradient: 'from-blue-500 to-indigo-600'
  },
  {
    number: '2',
    icon: Palette,
    title: 'Choose your design',
    description: 'Pick a professional template and customize it with your branding.',
    color: 'bg-purple-600',
    gradient: 'from-purple-500 to-pink-600'
  },
  {
    number: '3',
    icon: Send,
    title: 'Send & get paid',
    description: 'Send via email or WhatsApp. Track when clients view it. Done!',
    color: 'bg-green-600',
    gradient: 'from-green-500 to-emerald-600'
  }
];

function StepCard({ step, index }) {
  const [ref, isVisible] = useScrollAnimation({ once: true, threshold: 0.2 });

  return (
    <div 
      ref={ref}
      className={`relative transition-all duration-700 ${
        isVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-90'
      }`}
      style={{ transitionDelay: `${index * 200}ms` }}
    >
      <div className="text-center group">
        <div className={`w-20 h-20 bg-gradient-to-br ${step.gradient} rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg group-hover:scale-110 group-hover:rotate-3 transition-all duration-300`}>
          <step.icon className="h-10 w-10 text-white" />
        </div>
        <h3 className="text-2xl font-bold text-gray-900 mb-3">
          {step.title}
        </h3>
        <p className="text-gray-600 leading-relaxed">
          {step.description}
        </p>
      </div>
    </div>
  );
}

export default function HowItWorks() {
  const [titleRef, titleVisible] = useScrollAnimation({ once: true });

  return (
    <section id="how-it-works" className="py-20 bg-gradient-to-br from-gray-50 to-blue-50">
      <div className="container mx-auto px-4">
        <div 
          ref={titleRef}
          className={`text-center mb-16 transition-all duration-1000 ${
            titleVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}
        >
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            How it works
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Three simple steps to professional invoices
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-12 max-w-5xl mx-auto mb-12">
          {steps.map((step, index) => (
            <StepCard key={index} step={step} index={index} />
          ))}
        </div>

        <div className="text-center">
          <div className="inline-block bg-white px-8 py-4 rounded-2xl shadow-lg border-2 border-blue-200">
            <p className="text-lg text-gray-600">
              Total time: <span className="font-bold text-blue-600 text-2xl">Under 60 seconds</span> ⚡
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}