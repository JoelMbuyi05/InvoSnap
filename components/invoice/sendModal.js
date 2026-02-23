// components/invoice/SendModal.js
'use client';

import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Mail, MessageCircle, Download, Link as LinkIcon, Loader2, Check } from 'lucide-react';
import { generateWhatsAppLink } from '@/lib/whatsapp/share';

export default function SendModal({ 
  isOpen, 
  onClose, 
  invoice, 
  businessInfo,
  onSendEmail,
  onDownloadPDF 
}) {
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);

  const invoiceUrl = `${window.location.origin}/invoice/${invoice.id || 'preview'}`;

  async function handleSendEmail() {
    setSending(true);
    try {
      await onSendEmail();
      setSent(true);
      setTimeout(() => {
        onClose();
        setSent(false);
      }, 2000);
    } catch (error) {
      console.error('Send error:', error);
    } finally {
      setSending(false);
    }
  }

  function handleWhatsApp() {
    const whatsappUrl = generateWhatsAppLink(invoice, businessInfo, invoiceUrl);
    window.open(whatsappUrl, '_blank');
  }

  function handleCopyLink() {
    navigator.clipboard.writeText(invoiceUrl);
    alert('Link copied to clipboard!');
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Send Invoice {invoice.invoiceNumber}</DialogTitle>
        </DialogHeader>

        <div className="space-y-3 py-4">
          {/* Email */}
          <button
            onClick={handleSendEmail}
            disabled={sending || sent}
            className="w-full flex items-center gap-4 p-4 border-2 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
              {sent ? (
                <Check className="h-6 w-6 text-green-600" />
              ) : (
                <Mail className="h-6 w-6 text-blue-600" />
              )}
            </div>
            <div className="flex-1 text-left">
              <h3 className="font-semibold text-gray-900">
                {sent ? 'Email Sent!' : 'Send via Email'}
              </h3>
              <p className="text-sm text-gray-600">
                {sent ? 'Invoice delivered to inbox' : `Send to ${invoice.clientEmail}`}
              </p>
            </div>
            {sending && <Loader2 className="h-5 w-5 animate-spin text-blue-600" />}
          </button>

          {/* WhatsApp */}
          <button
            onClick={handleWhatsApp}
            className="w-full flex items-center gap-4 p-4 border-2 rounded-lg hover:border-green-500 hover:bg-green-50 transition-colors"
          >
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0">
              <MessageCircle className="h-6 w-6 text-green-600" />
            </div>
            <div className="flex-1 text-left">
              <h3 className="font-semibold text-gray-900">Send via WhatsApp</h3>
              <p className="text-sm text-gray-600">Share invoice link instantly</p>
            </div>
          </button>

          {/* Download PDF */}
          <button
            onClick={onDownloadPDF}
            className="w-full flex items-center gap-4 p-4 border-2 rounded-lg hover:border-purple-500 hover:bg-purple-50 transition-colors"
          >
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center flex-shrink-0">
              <Download className="h-6 w-6 text-purple-600" />
            </div>
            <div className="flex-1 text-left">
              <h3 className="font-semibold text-gray-900">Download PDF</h3>
              <p className="text-sm text-gray-600">Save to your device</p>
            </div>
          </button>

          {/* Copy Link */}
          <button
            onClick={handleCopyLink}
            className="w-full flex items-center gap-4 p-4 border-2 rounded-lg hover:border-gray-500 hover:bg-gray-50 transition-colors"
          >
            <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0">
              <LinkIcon className="h-6 w-6 text-gray-600" />
            </div>
            <div className="flex-1 text-left">
              <h3 className="font-semibold text-gray-900">Copy Link</h3>
              <p className="text-sm text-gray-600">Share invoice URL</p>
            </div>
          </button>
        </div>

        <div className="text-center text-sm text-gray-500">
          Select how you want to send this invoice
        </div>
      </DialogContent>
    </Dialog>
  );
}