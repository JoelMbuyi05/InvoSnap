// components/invoice/InvoicePreview.js
'use client';

import { useAuth } from '@/lib/context/AuthContext';
import { useInvoiceStore } from '@/lib/store/invoiceStore';
import { Card } from '@/components/ui/card';
import { format } from 'date-fns';

export default function InvoicePreview() {
  const { userData } = useAuth();
  const { invoice } = useInvoiceStore();

  const templateId = invoice.templateId || 'professional';

  // Professional Template (Default)
  if (templateId === 'professional') {
    return (
      <Card className="p-8 bg-white">
        {/* Header with border */}
        <div className="border-b-2 border-blue-600 pb-6 mb-6">
          <div className="flex justify-between items-start">
            <div>
              {userData?.logoUrl && (
                <img
                  src={userData.logoUrl} 
                  alt="Logo" 
                  className=" h-16 mb-4 object-contain" 
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
              <h1 className="text-3xl font-semibold text-blue-600">INVOICE</h1>
              <p className="text-gray-600 mt-2">{invoice.invoiceNumber || 'INV-0001'}</p>
            </div>
          </div>
        </div>

        {/* Bill To & Dates */}
        <div className="grid grid-cols-2 gap-8 mb-8">
          <div>
            <p className="text-sm font-semibold text-blue-600 mb-2">BILL TO</p>
            <p className="font-semibold text-gray-900">{invoice.clientName || 'Client Name'}</p>
            {invoice.clientEmail && <p className="text-sm text-gray-600">{invoice.clientEmail}</p>}
            {invoice.clientAddress && <p className="text-sm text-gray-600 mt-1">{invoice.clientAddress}</p>}
          </div>
          
          <div className="text-right">
            <div className="mb-3">
              <p className="text-sm font-semibold text-blue-600 mb-1">ISSUE DATE</p>
              <p className="text-gray-900">
                {invoice.issueDate ? format(new Date(invoice.issueDate), 'MMM d, yyyy') : 'Not set'}
              </p>
            </div>
            <div>
              <p className="text-sm font-semibold text-blue-600 mb-1">DUE DATE</p>
              <p className="text-gray-900">
                {invoice.dueDate ? format(new Date(invoice.dueDate), 'MMM d, yyyy') : 'Not set'}
              </p>
            </div>
          </div>
        </div>

        {/* Items Table */}
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
              <tr key={item.id || index} className="border-b border-gray-200">
                <td className="py-3 text-gray-900">{item.description || 'Item'}</td>
                <td className="py-3 text-right text-gray-900">{item.quantity || 0}</td>
                <td className="py-3 text-right text-gray-900">${Number(item.rate || 0).toFixed(2)}</td>
                <td className="py-3 text-right font-medium text-gray-900">${Number(item.amount || 0).toFixed(2)}</td>
              </tr>
            ))}
          </tbody>
        </table>

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
            <div className="flex justify-between py-3 border-t-2 border-blue-600 font-bold text-lg text-blue-600 mt-2">
              <span>TOTAL</span>
              <span>${(invoice.total || 0).toFixed(2)}</span>
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
    );
  }

  // Modern Template (Colorful with gradient)
  if (templateId === 'modern') {
    return (
      <Card className="overflow-hidden bg-gradient-to-br from-blue-50 to-purple-50">
        {/* Gradient Header */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-8">
          <div className="flex justify-between items-start">
            <div>
              {userData?.logoUrl && (
                <img
                  src={userData.logoUrl} 
                  alt="Logo" 
                  className="h-16 mb-4 object-contain"
                  />
              )}
              <h1 className="text-4xl font-bold">{userData?.businessName || 'Business Name'}</h1>
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
        </div>

        <div className="p-8">
          {/* Bill To & Dates */}
          <div className="grid grid-cols-2 gap-8 mb-8">
            <div className="bg-white p-4 rounded-lg shadow-sm">
              <p className="text-sm font-semibold text-purple-600 mb-2">BILL TO</p>
              <p className="font-semibold text-gray-900">{invoice.clientName || 'Client Name'}</p>
              {invoice.clientEmail && <p className="text-sm text-gray-600">{invoice.clientEmail}</p>}
              {invoice.clientAddress && <p className="text-sm text-gray-600 mt-1">{invoice.clientAddress}</p>}
            </div>
            
            <div className="bg-white p-4 rounded-lg shadow-sm">
              <div className="mb-3">
                <p className="text-sm font-semibold text-purple-600 mb-1">ISSUE DATE</p>
                <p className="text-gray-900">{invoice.issueDate ? format(new Date(invoice.issueDate), 'MMM d, yyyy') : 'Not set'}</p>
              </div>
              <div>
                <p className="text-sm font-semibold text-purple-600 mb-1">DUE DATE</p>
                <p className="text-gray-900">{invoice.dueDate ? format(new Date(invoice.dueDate), 'MMM d, yyyy') : 'Not set'}</p>
              </div>
            </div>
          </div>

          {/* Items */}
          <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
            <table className="w-full">
              <thead>
                <tr className="border-b-2 border-purple-200">
                  <th className="text-left py-3 font-semibold text-purple-600">Description</th>
                  <th className="text-right py-3 font-semibold text-purple-600 w-20">Qty</th>
                  <th className="text-right py-3 font-semibold text-purple-600 w-28">Rate</th>
                  <th className="text-right py-3 font-semibold text-purple-600 w-32">Amount</th>
                </tr>
              </thead>
              <tbody>
                {invoice.items?.map((item, index) => (
                  <tr key={item.id || index} className="border-b border-gray-100">
                    <td className="py-3 text-gray-900">{item.description || 'Item'}</td>
                    <td className="py-3 text-right text-gray-900">{item.quantity || 0}</td>
                    <td className="py-3 text-right text-gray-900">${Number(item.rate || 0).toFixed(2)}</td>
                    <td className="py-3 text-right font-medium text-gray-900">${Number(item.amount || 0).toFixed(2)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Totals */}
          <div className="flex justify-end">
            <div className="w-80 bg-white rounded-lg shadow-sm p-6">
              <div className="space-y-2">
                <div className="flex justify-between text-gray-700">
                  <span>Subtotal</span>
                  <span>${(invoice.subtotal || 0).toFixed(2)}</span>
                </div>
                {invoice.discountPercent > 0 && (
                  <div className="flex justify-between text-gray-700">
                    <span>Discount ({invoice.discountPercent}%)</span>
                    <span>-${(invoice.discountAmount || 0).toFixed(2)}</span>
                  </div>
                )}
                {invoice.taxRate > 0 && (
                  <div className="flex justify-between text-gray-700">
                    <span>Tax ({invoice.taxRate}%)</span>
                    <span>${(invoice.taxAmount || 0).toFixed(2)}</span>
                  </div>
                )}
                <div className="flex justify-between py-3 border-t-2 border-purple-600 font-bold text-xl bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                  <span>TOTAL</span>
                  <span>${(invoice.total || 0).toFixed(2)}</span>
                </div>
              </div>
            </div>
          </div>

          {invoice.notes && (
            <div className="mt-6 bg-white rounded-lg shadow-sm p-6">
              <p className="text-sm font-semibold text-purple-600 mb-2">NOTES</p>
              <p className="text-sm text-gray-600 whitespace-pre-wrap">{invoice.notes}</p>
            </div>
          )}
        </div>
      </Card>
    );
  }

  // Minimal Template (Clean black & white)
  if (templateId === 'minimal') {
    return (
      <Card className="p-8 bg-white">
        {/* Minimal Header */}
        <div className="border-b-4 border-gray-900 pb-6 mb-8">
          <div className="flex justify-between items-start">
            <div>
              {userData?.logoUrl && (
                <img 
                src={userData.logoUrl} 
                alt="Logo" 
                className="h-16 mb-4 object-contain grayscale" />
              )}
              <h2 className="text-sm font-medium text-gray-600 uppercase tracking-widest">
                {userData?.businessName || 'Business Name'}
              </h2>
              <div className="text-xs text-gray-500 mt-2 space-y-1">
                {userData?.businessEmail && <p>{userData.businessEmail}</p>}
                {userData?.businessPhone && <p>{userData.businessPhone}</p>}
              </div>
            </div>
            <div className="text-right">
              <h1 className="text-2xl font-light tracking-wide text-gray-900">INVOICE</h1>
              <p className="text-sm text-gray-600 mt-2">{invoice.invoiceNumber || 'INV-0001'}</p>
            </div>
          </div>
        </div>

        {/* Bill To & Dates */}
        <div className="grid grid-cols-2 gap-12 mb-10">
          <div>
            <p className="text-xs font-medium text-gray-400 uppercase tracking-widest mb-3">Bill To</p>
            <p className="font-medium text-gray-900 text-lg">{invoice.clientName || 'Client Name'}</p>
            {invoice.clientEmail && <p className="text-sm text-gray-600 mt-1">{invoice.clientEmail}</p>}
            {invoice.clientAddress && <p className="text-sm text-gray-600 mt-1">{invoice.clientAddress}</p>}
          </div>
          
          <div className="text-right space-y-4">
            <div>
              <p className="text-xs font-medium text-gray-400 uppercase tracking-widest mb-2">Issue Date</p>
              <p className="text-gray-900">{invoice.issueDate ? format(new Date(invoice.issueDate), 'MMM d, yyyy') : 'Not set'}</p>
            </div>
            <div>
              <p className="text-xs font-medium text-gray-400 uppercase tracking-widest mb-2">Due Date</p>
              <p className="text-gray-900">{invoice.dueDate ? format(new Date(invoice.dueDate), 'MMM d, yyyy') : 'Not set'}</p>
            </div>
          </div>
        </div>

        {/* Items Table */}
        <table className="w-full mb-10">
          <thead>
            <tr className="border-b border-gray-900">
              <th className="text-left py-4 font-medium text-gray-900 text-sm uppercase tracking-wider">Description</th>
              <th className="text-right py-4 font-medium text-gray-900 text-sm uppercase tracking-wider w-20">Qty</th>
              <th className="text-right py-4 font-medium text-gray-900 text-sm uppercase tracking-wider w-28">Rate</th>
              <th className="text-right py-4 font-medium text-gray-900 text-sm uppercase tracking-wider w-32">Amount</th>
            </tr>
          </thead>
          <tbody>
            {invoice.items?.map((item, index) => (
              <tr key={item.id || index} className="border-b border-gray-200">
                <td className="py-4 text-gray-800">{item.description || 'Item'}</td>
                <td className="py-4 text-right text-gray-800">{item.quantity || 0}</td>
                <td className="py-4 text-right text-gray-800">${Number(item.rate || 0).toFixed(2)}</td>
                <td className="py-4 text-right font-medium text-gray-900">${Number(item.amount || 0).toFixed(2)}</td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Totals */}
        <div className="flex justify-end">
          <div className="w-96 space-y-3">
            <div className="flex justify-between text-gray-700">
              <span className="uppercase text-xs tracking-wider">Subtotal</span>
              <span className="font-medium">${(invoice.subtotal || 0).toFixed(2)}</span>
            </div>
            {invoice.discountPercent > 0 && (
              <div className="flex justify-between text-gray-700">
                <span className="uppercase text-xs tracking-wider">Discount ({invoice.discountPercent}%)</span>
                <span className="font-medium">-${(invoice.discountAmount || 0).toFixed(2)}</span>
              </div>
            )}
            {invoice.taxRate > 0 && (
              <div className="flex justify-between text-gray-700">
                <span className="uppercase text-xs tracking-wider">Tax ({invoice.taxRate}%)</span>
                <span className="font-medium">${(invoice.taxAmount || 0).toFixed(2)}</span>
              </div>
            )}
            <div className="flex justify-between pt-4 border-t-2 border-gray-900 font-medium text-2xl text-gray-900">
              <span className="uppercase text-sm tracking-widest">Total</span>
              <span>${(invoice.total || 0).toFixed(2)}</span>
            </div>
          </div>
        </div>

        {invoice.notes && (
          <div className="mt-12 pt-8 border-t border-gray-200">
            <p className="text-xs font-medium text-gray-400 uppercase tracking-widest mb-3">Notes</p>
            <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-wrap">{invoice.notes}</p>
          </div>
        )}
      </Card>
    );
  }

  return null;
}