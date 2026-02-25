// components/landing/Footer.js
'use client';

import { Zap, Github, Linkedin, Mail } from 'lucide-react';
import Link from 'next/link';
import { useScrollAnimation } from '@/lib/hooks/useScrollAnimation';

const footerSections = [
  {
    title: 'Product',
    links: [
      { name: 'Features', href: '#features' },
      { name: 'Sign up', href: '/signup' },
      { name: 'Log in', href: '/login' }
    ]
  },
  {
    title: 'Legal',
    links: [
      { name: 'Privacy Policy', href: '/privacy' },
      { name: 'Terms of Service', href: '/terms' }
    ]
  },
  {
    title: 'Connect',
    links: [
      { name: 'Email', href: 'mailto:joelmbuyi700@gmail.com', icon: Mail },
      { name: 'GitHub', href: 'https://github.com/JoelMbuyi05', icon: Github },
      { name: 'LinkedIn', href: 'https://www.linkedin.com/in/joelmbuyi05/', icon: Linkedin }
    ]
  }
];

function FooterColumn({ section, index }) {
  const [ref, isVisible] = useScrollAnimation({ once: true, threshold: 0.1 });

  return (
    <div 
      ref={ref}
      className={`transition-all duration-700 ${
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
      }`}
      style={{ transitionDelay: `${index * 150}ms` }}
    >
      <h3 className="font-semibold text-white mb-4 text-lg">{section.title}</h3>
      <ul className="space-y-3">
        {section.links.map((link, i) => (
          <li key={i}>
            {link.href.startsWith('http') ? (
              <a 
                href={link.href}
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-white transition-all flex items-center gap-2 group"
              >
                {link.icon && <link.icon className="h-4 w-4 group-hover:scale-110 transition-transform" />}
                <span className="group-hover:translate-x-1 transition-transform">{link.name}</span>
              </a>
            ) : link.href.startsWith('mailto') ? (
              <a 
                href={link.href}
                className="text-gray-400 hover:text-white transition-all flex items-center gap-2 group"
              >
                {link.icon && <link.icon className="h-4 w-4 group-hover:scale-110 transition-transform" />}
                <span className="group-hover:translate-x-1 transition-transform">{link.name}</span>
              </a>
            ) : link.href.startsWith('#') ? (
              <a 
                href={link.href}
                className="text-gray-400 hover:text-white transition-all group"
              >
                <span className="group-hover:translate-x-1 inline-block transition-transform">{link.name}</span>
              </a>
            ) : (
              <Link 
                href={link.href}
                className="text-gray-400 hover:text-white transition-all group"
              >
                <span className="group-hover:translate-x-1 inline-block transition-transform">{link.name}</span>
              </Link>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default function Footer() {
  const [brandRef, brandVisible] = useScrollAnimation({ once: true, threshold: 0.1 });
  const [copyrightRef, copyrightVisible] = useScrollAnimation({ once: true, threshold: 0.1 });

  return (
    <footer className="bg-gray-900 text-gray-300">
      <div className="container mx-auto px-4 py-16">
        <div className="grid md:grid-cols-4 gap-12 mb-12">
          {/* Brand */}
          <div 
            ref={brandRef}
            className={`transition-all duration-1000 ${
              brandVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
            }`}
          >
            <div className="flex items-center gap-2 mb-4 group cursor-pointer">
              <div className="bg-blue-600 p-2 rounded-lg group-hover:scale-110 transition-all">
                <Zap className="h-6 w-6 text-white" />
              </div>
              <span className="text-2xl font-bold text-white">InvoSnap</span>
            </div>
            <p className="text-sm text-gray-400 leading-relaxed mb-6">
              Professional invoices in 60 seconds. Built for freelancers and small businesses.
            </p>
            <div className="flex gap-3">
              <a 
                href="https://github.com/JoelMbuyi05"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 bg-gray-800 hover:bg-blue-600 rounded-lg flex items-center justify-center transition-all hover:scale-110"
              >
                <Github className="h-5 w-5" />
              </a>
              <a 
                href="https://www.linkedin.com/in/joelmbuyi05/"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 bg-gray-800 hover:bg-blue-600 rounded-lg flex items-center justify-center transition-all hover:scale-110"
              >
                <Linkedin className="h-5 w-5" />
              </a>
              <a 
                href="mailto:joelmbuyi700@gmail.com"
                className="w-10 h-10 bg-gray-800 hover:bg-blue-600 rounded-lg flex items-center justify-center transition-all hover:scale-110"
              >
                <Mail className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* Footer columns */}
          {footerSections.map((section, index) => (
            <FooterColumn key={index} section={section} index={index + 1} />
          ))}
        </div>

        <div 
          ref={copyrightRef}
          className={`border-t border-gray-800 pt-8 transition-all duration-1000 ${
            copyrightVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
          }`}
        >
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-gray-400">
            <p>
              © {new Date().getFullYear()} InvoSnap. All rights reserved.
            </p>
            <p className="flex items-center gap-2">
              Built with <span className="text-red-500 animate-pulse">❤️</span> by{' '}
              <a 
                href="https://github.com/JoelMbuyi05" 
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-400 hover:text-blue-300 font-semibold hover:underline"
              >
                M. Joel
              </a>
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}