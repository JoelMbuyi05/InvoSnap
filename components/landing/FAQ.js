// components/landing/FAQ.js
'use client';

import { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { useScrollAnimation } from '@/lib/hooks/useScrollAnimation';

const faqs = [
  {
    question: 'Is InvoSnap really free?',
    answer: 'Yes! InvoSnap is 100% free with unlimited invoices and clients. We may introduce optional premium features in the future, but the core invoicing functionality will always be free.'
  },
  {
    question: 'Do I need a credit card to sign up?',
    answer: 'No credit card required! Just sign up with your email and start creating invoices immediately.'
  },
  {
    question: 'Can I send invoices via WhatsApp?',
    answer: 'Yes! Generate a shareable link and send it directly via WhatsApp. This feature is available on all plans.'
  },
  {
    question: 'What file formats can I download?',
    answer: 'All invoices can be downloaded as professional PDF files that you can print or share offline.'
  },
  {
    question: 'Can I customize the invoice design?',
    answer: 'Yes! Choose from multiple professional templates and customize colors to match your brand.'
  },
  {
    question: 'Is my data secure?',
    answer: 'Absolutely. We use Firebase (Google) for secure authentication and data storage. Your data is encrypted and protected.'
  },
  {
    question: 'Can I track if clients viewed my invoice?',
    answer: 'Yes! You\'ll see when clients open and view your invoices, so you always know where things stand.'
  }
];

function FAQItem({ faq, isOpen, onClick, index }) {
  const [ref, isVisible] = useScrollAnimation({ once: true, threshold: 0.1 });

  return (
    <div 
      ref={ref}
      className={`border-b border-gray-200 transition-all duration-700 ${
        isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-8'
      }`}
      style={{ transitionDelay: `${index * 100}ms` }}
    >
      <button
        onClick={onClick}
        className="w-full py-6 flex items-center justify-between text-left hover:text-blue-600 transition-colors group"
      >
        <span className="text-lg font-semibold text-gray-900 pr-8 group-hover:translate-x-2 transition-transform">
          {faq.question}
        </span>
        <ChevronDown 
          className={`h-5 w-5 text-gray-500 flex-shrink-0 transition-all duration-300 ${
            isOpen ? 'rotate-180 text-blue-600' : ''
          }`}
        />
      </button>
      <div 
        className={`overflow-hidden transition-all duration-500 ease-in-out ${
          isOpen ? 'max-h-96 opacity-100 mb-6' : 'max-h-0 opacity-0'
        }`}
      >
        <div className="text-gray-600 leading-relaxed pb-2">
          {faq.answer}
        </div>
      </div>
    </div>
  );
}

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState(0);
  const [titleRef, titleVisible] = useScrollAnimation({ once: true });
  const [contactRef, contactVisible] = useScrollAnimation({ once: true, threshold: 0.2 });

  return (
    <section className="py-20 bg-gradient-to-br from-gray-50 via-white to-blue-50">
      <div className="container mx-auto px-4">
        <div 
          ref={titleRef}
          className={`text-center mb-16 transition-all duration-1000 ${
            titleVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}
        >
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Frequently asked questions
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Everything you need to know about InvoSnap
          </p>
        </div>

        <div className="max-w-3xl mx-auto bg-white rounded-2xl shadow-lg p-8 border border-gray-200">
          {faqs.map((faq, index) => (
            <FAQItem
              key={index}
              faq={faq}
              index={index}
              isOpen={openIndex === index}
              onClick={() => setOpenIndex(openIndex === index ? -1 : index)}
            />
          ))}
        </div>

        <div 
          ref={contactRef}
          className={`text-center mt-12 transition-all duration-1000 ${
            contactVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-90'
          }`}
        >
          <div className="inline-block bg-gradient-to-r from-blue-500 to-purple-500 p-6 rounded-2xl shadow-xl">
            <p className="text-white mb-3 text-lg font-medium">
              Still have questions?
            </p>
            <a 
              href="mailto:joelmbuyi700@gmail.com" 
              className="inline-block bg-white text-blue-600 px-6 py-3 rounded-lg font-semibold hover:bg-blue-50 hover:scale-105 transition-all shadow-lg"
            >
              Contact us →
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}