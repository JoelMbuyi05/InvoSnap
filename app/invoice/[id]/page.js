// app/invoice/[id]/page.js
'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { doc, getDoc, updateDoc, increment } from 'firebase/firestore';
import { db } from '@/lib/firebase/config';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Download, Zap } from 'lucide-react';
import { format } from 'date-fns';
import Image from 'next/image';
import LoadingSpinner from '@/components/common/LoadingSpinner';
import { toast } from 'sonner';

export default function PublicInvoicePage() {
  const params = useParams();
  const [invoice, setInvoice] = useState(null);
  const [business, setBusiness] = useState(null);
  const [loading, setLoading] = useState(true);

  const invoiceId = params.id;

  useEffect(() => {
    if (invoiceId) {
      fetchInvoice();
    }
  }, [invoiceId]);

  async function fetchInvoice() {
    try {
      const invoiceDoc = await getDoc(doc(db, 'invoices', invoiceId));
      
      if (!invoiceDoc.exists()) {
        toast.error('Invoice not found');
        setLoading(false);
        return;
      }

      const invoiceData = invoiceDoc.data();
      setInvoice(invoiceData);

      // Fetch business info
      const userDoc = await getDoc(doc(db, 'users', invoiceData.userId));
      if (userDoc.exists()) {
        setBusiness(userDoc.data());
      }

      // ✅ TRACK VIEW: Update status to "viewed" if currently "sent"
      if (invoiceData.status === 'sent') {
        await updateDoc(doc(db, 'invoices', invoiceId), {
          status: 'viewed',
          viewedAt: new Date().toISOString(),
          viewCount: increment(1)
        });
      } else {
        // Just increment view counter
        await updateDoc(doc(db, 'invoices', invoiceId), {
          viewCount: increment(1)
        });
      }

    } catch (error) {
      console.error('Error fetching invoice:', error);
      toast.error('Failed to load invoice');
    } finally {
      setLoading(false);
    }
  }

  async function handleDownloadPDF() {
    try {
      const toastId = toast.loading('Generating PDF...');
      const response = await fetch(`/api/invoices/${invoiceId}/pdf`);
      
      if (!response.ok) throw new Error('Failed to generate PDF');

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
      toast.error('Error downloading PDF');
    }
  }

  if (loading) {
    return <LoadingSpinner text="Loading invoice..." />;
  }

  if (!invoice) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Card className="p-12 text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Invoice Not Found</h2>
          <p className="text-gray-600">This invoice may have been deleted or the link is incorrect.</p>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4 max-w-4xl">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-2">
            <div className="bg-blue-600 p-2 rounded-lg">
              <Zap className="h-6 w-6 text-white" />
            </div>
            <span className="text-2xl font-bold text-gray-900">InvoSnap</span>
          </div>
          <Button onClick={handleDownloadPDF}>
            <Download className="mr-2 h-4 w-4" />
            Download PDF
          </Button>
        </div>

        {/* Invoice */}
        <Card className="p-8 bg-white">
          {/* Header */}
          <div className="border-b-2 border-blue-600 pb-6 mb-6">
            <div className="flex justify-between items-start">
              <div>
                {business?.logoUrl && (
                  <Image
                    src={business.logoUrl} 
                    alt="Logo" 
                    fill
                    className="object-contain object-left" 
                    unoptimized={true}
                    />
                )}
                <h2 className="font-semibold text-gray-900">{business?.businessName || 'Business Name'}</h2>
                <div className="text-sm text-gray-600 mt-1 space-y-0.5">
                  {business?.businessEmail && <p>{business.businessEmail}</p>}
                  {business?.businessPhone && <p>{business.businessPhone}</p>}
                  {business?.businessAddress && <p>{business.businessAddress}</p>}
                </div>
              </div>
              <div className="text-right">
                <h1 className="text-3xl font-semibold text-blue-600">INVOICE</h1>
                <p className="text-gray-600 mt-2">{invoice.invoiceNumber}</p>
              </div>
            </div>
          </div>

          {/* Bill To & Dates */}
          <div className="grid grid-cols-2 gap-8 mb-8">
            <div>
              <p className="text-sm font-semibold text-blue-600 mb-2">BILL TO</p>
              <p className="font-semibold text-gray-900">{invoice.clientName}</p>
              {invoice.clientEmail && <p className="text-sm text-gray-600">{invoice.clientEmail}</p>}
              {invoice.clientAddress && <p className="text-sm text-gray-600 mt-1">{invoice.clientAddress}</p>}
            </div>
            
            <div className="text-right">
              <div className="mb-3">
                <p className="text-sm font-semibold text-blue-600 mb-1">ISSUE DATE</p>
                <p className="text-gray-900">{format(new Date(invoice.issueDate), 'MMM d, yyyy')}</p>
              </div>
              <div>
                <p className="text-sm font-semibold text-blue-600 mb-1">DUE DATE</p>
                <p className="text-gray-900">{format(new Date(invoice.dueDate), 'MMM d, yyyy')}</p>
              </div>
            </div>
          </div>

          {/* Items */}
          <table className="w-full mb-8">
            <thead>
              <tr className="border-b-2 border-blue-600">
                <th className="text-left py-3 font-semibold text-blue-600">Description</th>
                <th className="text-right py-3 font-semibold text-blue-600 w-20">Qty</th>
                <th className="text-right py-3 font-semibold text-blue-600 w-28">Rate</th>
                <th className="text-right py-3 font-semibold text-blue-600 w-32">Amount</th>
              </tr>
            </thead>
            <tbody>
              {invoice.items?.map((item, index) => (
                <tr key={index} className="border-b border-gray-200">
                  <td className="py-3 text-gray-900">{item.description}</td>
                  <td className="py-3 text-right text-gray-900">{item.quantity}</td>
                  <td className="py-3 text-right text-gray-900">${Number(item.rate).toFixed(2)}</td>
                  <td className="py-3 text-right font-medium text-gray-900">${Number(item.amount).toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Totals */}
          <div className="flex justify-end">
            <div className="w-80">
              <div className="flex justify-between py-2 text-gray-700">
                <span>Subtotal</span>
                <span>${invoice.subtotal.toFixed(2)}</span>
              </div>
              {invoice.discountPercent > 0 && (
                <div className="flex justify-between py-2 text-gray-700">
                  <span>Discount ({invoice.discountPercent}%)</span>
                  <span>-${invoice.discountAmount.toFixed(2)}</span>
                </div>
              )}
              {invoice.taxRate > 0 && (
                <div className="flex justify-between py-2 text-gray-700">
                  <span>Tax ({invoice.taxRate}%)</span>
                  <span>${invoice.taxAmount.toFixed(2)}</span>
                </div>
              )}
              <div className="flex justify-between py-3 border-t-2 border-blue-600 font-bold text-lg text-blue-600 mt-2">
                <span>TOTAL</span>
                <span>${invoice.total.toFixed(2)}</span>
              </div>
            </div>
          </div>

          {invoice.notes && (
            <div className="mt-8 pt-6 border-t border-gray-200">
              <p className="text-sm font-semibold text-blue-600 mb-2">NOTES</p>
              <p className="text-sm text-gray-600 whitespace-pre-wrap">{invoice.notes}</p>
            </div>
          )}
        </Card>

        {/* Footer */}
        <div className="text-center mt-8 text-sm text-gray-500">
          <p>Powered by InvoSnap</p>
        </div>
      </div>
    </div>
  );
}