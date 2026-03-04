// components/invoice/InvoicePreview.js
'use client';

import { useAuth } from '@/lib/context/AuthContext';
import { useInvoiceStore } from '@/lib/store/invoiceStore';
import { Card } from '@/components/ui/card';
import Image from 'next/image';
import { format } from 'date-fns';

export default function InvoicePreview() {
  const { userData } = useAuth();
  const { invoice } = useInvoiceStore();

  // Get template style
  const templateId = invoice.templateId || 'professional';

  // Template-specific styles
  const getTemplateStyles = () => {
    switch (templateId) {
      case 'modern':
        return {
          container: 'bg-gradient-to-br from-blue-50 to-purple-50',
          header: 'bg-gradient-to-r from-blue-600 to-purple-600 text-white p-8 rounded-t-lg',
          title: 'text-4xl font-bold',
          accent: 'text-purple-600',
          border: 'border-purple-200'
        };
      case 'minimal':
        return {
          container: 'bg-white',
          header: 'border-b-4 border-gray-900 pb-6 mb-6',
          title: 'text-2xl font-light tracking-wide',
          accent: 'text-gray-900',
          border: 'border-gray-900'
        };
      default: // professional
        return {
          container: 'bg-white',
          header: 'border-b-2 border-blue-600 pb-6 mb-6',
          title: 'text-3xl font-semibold',
          accent: 'text-blue-600',
          border: 'border-blue-600'
        };
    }
  };

  const styles = getTemplateStyles();

  return (
    <Card className={`p-8 ${styles.container}`}>
      {/* Header */}
      <div className={styles.header}>
        {templateId === 'modern' ? (
          // Modern template - gradient header
          <div className="flex justify-between items-start">
            <div>
              {userData?.logoUrl && (
                <Image 
                      src={userData.logoUrl} 
                      alt="Logo" 
                      fill
                      sizes="128px"
                      className="object-contain object-left"
                      unoptimized={true}
                />
              )}
              <h1 className={styles.title}>
                {userData?.businessName || 'Business Name'}
              </h1>
              <div className="text-blue-100 text-sm mt-2 space-y-1">
                {userData?.businessEmail && <p>{userData.businessEmail}</p>}
                {userData?.businessPhone && <p>{userData.businessPhone}</p>}
              </div>
            </div>
            <div className="text-right">
              <p className="text-lg font-medium mb-1">INVOICE</p>
              <p className="text-2xl font-bold">{invoice.invoiceNumber || 'INV-0001'}</p>
            </div>
          </div>
        ) : (
          // Professional & Minimal - traditional header
          <div className="flex justify-between items-start">
            <div>
              {userData?.logoUrl && (
                <Image 
                        src={userData.logoUrl} 
                        alt="Logo" 
                        fill
                        sizes="128px"
                        className="object-contain object-left"
                        unoptimized={true}
                />
              )}
              <h2 className="font-semibold text-gray-900">
                {userData?.businessName || 'Business Name'}
              </h2>
              <div className="text-sm text-gray-600 mt-1 space-y-0.5">
                {userData?.businessEmail && <p>{userData.businessEmail}</p>}
                {userData?.businessPhone && <p>{userData.businessPhone}</p>}
                {userData?.businessAddress && <p>{userData.businessAddress}</p>}
              </div>
            </div>
            <div className="text-right">
              <h1 className={styles.title + ' ' + styles.accent}>INVOICE</h1>
              <p className="text-gray-600 mt-2">{invoice.invoiceNumber || 'INV-0001'}</p>
            </div>
          </div>
        )}
      </div>

      {/* Bill To & Dates */}
      <div className="grid grid-cols-2 gap-8 mb-8">
        <div>
          <p className={`text-sm font-semibold ${styles.accent} mb-2`}>BILL TO</p>
          <p className="font-semibold text-gray-900">{invoice.clientName || 'Client Name'}</p>
          {invoice.clientEmail && (
            <p className="text-sm text-gray-600">{invoice.clientEmail}</p>
          )}
          {invoice.clientAddress && (
            <p className="text-sm text-gray-600 mt-1">{invoice.clientAddress}</p>
          )}
        </div>
        
        <div className="text-right">
          <div className="mb-3">
            <p className={`text-sm font-semibold ${styles.accent} mb-1`}>ISSUE DATE</p>
            <p className="text-gray-900">
              {invoice.issueDate ? format(new Date(invoice.issueDate), 'MMM d, yyyy') : 'Not set'}
            </p>
          </div>
          <div>
            <p className={`text-sm font-semibold ${styles.accent} mb-1`}>DUE DATE</p>
            <p className="text-gray-900">
              {invoice.dueDate ? format(new Date(invoice.dueDate), 'MMM d, yyyy') : 'Not set'}
            </p>
          </div>
        </div>
      </div>

      {/* Items Table */}
      <div className="mb-8">
        <table className="w-full">
          <thead>
            <tr className={`border-b-2 ${styles.border}`}>
              <th className={`text-left py-3 font-semibold ${styles.accent}`}>Description</th>
              <th className={`text-right py-3 font-semibold ${styles.accent} w-20`}>Qty</th>
              <th className={`text-right py-3 font-semibold ${styles.accent} w-28`}>Rate</th>
              <th className={`text-right py-3 font-semibold ${styles.accent} w-32`}>Amount</th>
            </tr>
          </thead>
          <tbody>
            {invoice.items && invoice.items.length > 0 ? (
              invoice.items.map((item, index) => (
                <tr key={item.id || index} className="border-b border-gray-200">
                  <td className="py-3 text-gray-900">{item.description || 'Item'}</td>
                  <td className="py-3 text-right text-gray-900">{item.quantity || 0}</td>
                  <td className="py-3 text-right text-gray-900">
                    ${(item.rate || 0).toFixed(2)}
                  </td>
                  <td className="py-3 text-right font-medium text-gray-900">
                    ${(item.amount || 0).toFixed(2)}
                  </td>
                </tr>
              ))
            ) : (
              <tr className="border-b border-gray-200">
                <td className="py-3 text-gray-500" colSpan="4">No items added yet</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Totals */}
      <div className="flex justify-end">
        <div className="w-80">
          <div className="flex justify-between py-2 text-gray-700">
            <span>Subtotal</span>
            <span>${(invoice.subtotal || 0).toFixed(2)}</span>
          </div>
          
          {invoice.discountPercent > 0 && (
            <div className="flex justify-between py-2 text-gray-700">
              <span>Discount ({invoice.discountPercent}%)</span>
              <span>-${(invoice.discountAmount || 0).toFixed(2)}</span>
            </div>
          )}
          
          {invoice.taxRate > 0 && (
            <div className="flex justify-between py-2 text-gray-700">
              <span>Tax ({invoice.taxRate}%)</span>
              <span>${(invoice.taxAmount || 0).toFixed(2)}</span>
            </div>
          )}
          
          <div className={`flex justify-between py-3 border-t-2 ${styles.border} font-bold text-lg ${styles.accent} mt-2`}>
            <span>TOTAL</span>
            <span>${(invoice.total || 0).toFixed(2)}</span>
          </div>
        </div>
      </div>

      {/* Notes */}
      {invoice.notes && (
        <div className="mt-8 pt-6 border-t border-gray-200">
          <p className={`text-sm font-semibold ${styles.accent} mb-2`}>NOTES</p>
          <p className="text-sm text-gray-600 whitespace-pre-wrap">{invoice.notes}</p>
        </div>
      )}

      {/* Template indicator */}
      <div className="mt-6 text-center">
        <p className="text-xs text-gray-400">
          Template: {templateId.charAt(0).toUpperCase() + templateId.slice(1)}
        </p>
      </div>
    </Card>
  );
}
