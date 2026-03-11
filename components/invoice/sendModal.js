// components/invoice/SendModal.js
'use client';

import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Mail, MessageCircle, Download, Link as LinkIcon, Loader2, Check } from 'lucide-react';
import { toast } from 'sonner';

export default function SendModal({ 
  isOpen, 
  onClose, 
  invoice, 
  invoiceId,
  businessInfo
}) {
  const [sending, setSending] = useState(false);
  const [emailSent, setEmailSent] = useState(false);

  const invoiceUrl = `${process.env.NEXT_PUBLIC_APP_URL}/invoice/${invoiceId}`;

  async function handleSendEmail() {
    if (!invoice.clientEmail) {
      toast.error('Client email is required');
      return;
    }

    setSending(true);
    try {
      const response = await fetch(`/api/invoices/${invoiceId}/send-email`, {
        method: 'POST'
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.details || error.error || 'Failed to send email');
      }

      setEmailSent(true);
      toast.success('Invoice sent via email!');
      
      setTimeout(() => {
        setEmailSent(false);
        onClose();
      }, 2000);
    } catch (error) {
      console.error('Send error:', error);
      toast.error(error.message || 'Failed to send email');
    } finally {
      setSending(false);
    }
  }

  function handleWhatsApp() {
    // Professional WhatsApp message (no emojis for professional look)
    const dueDate = invoice.dueDate ? new Date(invoice.dueDate).toLocaleDateString('en-US', { 
      month: 'long', 
      day: 'numeric', 
      year: 'numeric' 
    }) : 'Upon receipt';

    const message = `Hello ${invoice.clientName || 'there'},

${businessInfo?.businessName || 'We'} sent you a new invoice.

INVOICE DETAILS
━━━━━━━━━━━━━━━
Invoice #: ${invoice.invoiceNumber}
Amount Due: $${invoice.total?.toFixed(2)}
Due Date: ${dueDate}

VIEW INVOICE
${invoiceUrl}

If you have any questions, please don't hesitate to contact us.

Best regards,
${businessInfo?.businessName || 'InvoSnap'}`;
    
    if (invoice.clientPhone) {
      const cleanPhone = invoice.clientPhone.replace(/[\s\-\(\)]/g, '');
      const whatsappUrl = `https://wa.me/${cleanPhone}?text=${encodeURIComponent(message)}`;
      window.open(whatsappUrl, '_blank');
    } else {
      const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(message)}`;
      window.open(whatsappUrl, '_blank');
    }
    toast.success('Opening WhatsApp...');
  }

  async function handleDownloadPDF() {
    try {
      const toastId = toast.loading('Generating PDF...');
      const response = await fetch(`/api/invoices/${invoiceId}/pdf`);
      
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.details || error.error || 'Failed to generate PDF');
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${invoice.invoiceNumber}.pdf`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
      
      toast.success('PDF downloaded!', { id: toastId });
    } catch (error) {
      console.error('Download error:', error);
      toast.error(error.message || 'Error downloading PDF');
    }
  }

  function handleCopyLink() {
    navigator.clipboard.writeText(invoiceUrl);
    toast.success('Link copied to clipboard!');
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>
            Send Invoice {invoice.invoiceNumber}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-3 py-4">
          {/* Email */}
          <button
            onClick={handleSendEmail}
            disabled={sending || emailSent || !invoice.clientEmail}
            className="w-full flex items-center gap-4 p-4 border-2 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
              {emailSent ? (
                <Check className="h-6 w-6 text-green-600" />
              ) : (
                <Mail className="h-6 w-6 text-blue-600" />
              )}
            </div>
            <div className="flex-1 text-left">
              <h3 className="font-semibold text-gray-900">
                {emailSent ? 'Email Sent!' : 'Send via Email'}
              </h3>
              <p className="text-sm text-gray-600">
                {!invoice.clientEmail 
                  ? 'No email address provided'
                  : emailSent 
                    ? 'Invoice delivered to inbox' 
                    : `Send to ${invoice.clientEmail}`
                }
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
            onClick={handleDownloadPDF}
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

        <div className="text-center text-sm text-gray-500 border-t pt-4">
          Select how you want to send this invoice
        </div>
      </DialogContent>
    </Dialog>
  );
}