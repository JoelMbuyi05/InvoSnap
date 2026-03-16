# InvoSnap
InvoSnap is a free, modern invoicing SaaS application built specifically for freelancers and small businesses. Born from the frustration of overcomplicated invoicing tools, InvoSnap delivers a lightning-fast, no-nonsense solution to create, send, and track professional invoices.

## The Problem
Traditional invoicing software is expensive, bloated with features most freelancers never use, and requires lengthy onboarding. Small businesses in emerging markets (especially Africa) need simple, accessible tools that work via WhatsApp.

## The Solution
InvoSnap strips invoicing down to its essentials:

** Create an invoice in 60 seconds
** Send via Email or WhatsApp instantly
** Track invoice views automatically
** 100% free - no hidden costs, no credit card required
** Mobile-first design for on-the-go invoicing

 ## ✨ Key Features

 ## 🚀 Core Functionality

** 60-Second Invoice Creation - Streamlined form that captures only what matters
** Multi-Channel Delivery - Send via Email, WhatsApp, or shareable link
** Mobile-Responsive - Works flawlessly on phones, tablets, and desktop
** View Tracking - Know exactly when clients view your invoices
** PDF Generation - Professional, branded PDF invoices on demand
** Client Management - Store client details for faster repeat invoicing
** Multiple Templates - Professional, Modern, and Minimal designs
** WhatsApp Integration - Primary communication channel in African markets

## 🔐 Security & Performance

** Firestore Security Rules - Row-level security for data protection
** Public Invoice Links - Shareable links with automatic view tracking
** Real-time Updates - Instant synchronization across devices
** Optimized Performance - Lazy loading, code splitting, and caching

## 🛠️ Technology Stack

## Frontend

** Next.js 14 - React framework with App Router
** React 18 - UI library with Server Components
** Tailwind CSS - Utility-first CSS framework
** shadcn/ui - Headless component library
** Zustand - Lightweight state management
** React Hook Form - Performant form validation
** date-fns - Modern date utility library

## Backend & Database

## Firebase
** Authentication - Email/password and Google OAuth
** Firestore - NoSQL database for invoices, clients, and users
** Storage - Business logo uploads

## Resend - Modern email API for transactional emails

## PDF & File Handling

** @react-pdf/renderer - Generate PDFs in React
** Lucide React - Beautiful icon library

## 🚀 Getting Started

## Installation

1. Clone the repository
2. Install dependencies
3. Set up environment variables: Create a .env.local file in the root directory
4. Set up Firebase
5. Deploy Firestore Security Rules: Go to Firestore → Rules
6. Run the development server
Open http://localhost:3000 in your browser.
Building for Production
Deploying to Vercel
Add all environment variables in the Vercel dashboard under Settings → Environment Variables.

## 📚 Development Process

## Week 1: Foundation (Days 1-7)

** Set up Next.js 14 with App Router
** Implemented Firebase Authentication
** Built client management CRUD operations
**bCreated invoice form with dynamic item calculation
** Integrated Zustand for state management

## Challenges:

** Learning Next.js 14 App Router (migrating from Pages Router mindset)
** Understanding Firestore security rules and data modeling
** Implementing real-time calculations for invoice totals

## Week 2: Core Features (Days 8-14)

** Built three invoice templates (Professional, Modern, Minimal)
** Integrated @react-pdf/renderer for PDF generation
** Implemented email sending via Resend API
** Added WhatsApp sharing functionality
** Created public invoice viewing page

## Challenges:

** PDF generation - wrestling with @react-pdf/renderer's limitations
** Debugging CORS issues with Firebase Storage for logos
** Email templating and ensuring mobile responsiveness

## Week 3: Polish & UX (Days 15-21)

** Built landing page with scroll animations
** Added invoice search and filtering
** Implemented toast notifications (Sonner)
** Created Terms of Service and Privacy Policy pages
** Added loading states and error boundaries

## Challenges:

** Making the landing page stand out without being generic
** Optimizing performance (lazy loading, code splitting)
** Handling edge cases (empty states, validation errors)

## Week 4: Launch Prep (Days 22-28)

** Security audit and Firestore rules hardening
* Mobile responsiveness testing
** SEO optimization (metadata, OpenGraph tags)
** Deployment to Vercel
** Bug fixes and final polish

## Challenges:

** Firebase Admin SDK configuration for server-side operations
** Environment variable management across dev/staging/prod
** Last-minute invoice status tracking bug

## Methodology

** Agile/Iterative - Built in weekly sprints with clear milestones
** Mobile-First - Designed for mobile, scaled up to desktop
** Component-Driven - Reusable components with shadcn/ui patterns
** Git Workflow - Feature branches, conventional commits
