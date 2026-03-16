// app/(dashboard)/dashboard/page.js - MOBILE RESPONSIVE VERSION
'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/lib/context/AuthContext';
import { collection, query, where, getDocs, orderBy, deleteDoc, doc } from 'firebase/firestore';
import { db } from '@/lib/firebase/config';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Plus, FileText, Download, Send, Search, Trash2, Edit, Filter } from 'lucide-react';
import Link from 'next/link';
import { format } from 'date-fns';
import { toast } from 'sonner';
import LoadingSpinner from '@/components/common/LoadingSpinner';
import SendModal from '@/components/invoice/sendModal';

export default function DashboardPage() {
  const { user, userData } = useAuth();
  const [invoices, setInvoices] = useState([]);
  const [filteredInvoices, setFilteredInvoices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [showFilters, setShowFilters] = useState(false);
  
  // Send modal state
  const [sendModalOpen, setSendModalOpen] = useState(false);
  const [selectedInvoice, setSelectedInvoice] = useState(null);

  useEffect(() => {
    if (user) {
      fetchInvoices();
    }
  }, [user]);

  useEffect(() => {
    filterInvoices();
  }, [searchTerm, statusFilter, invoices]);

  async function fetchInvoices() {
    try {
      const q = query(
        collection(db, 'invoices'),
        where('userId', '==', user.uid),
        orderBy('createdAt', 'desc')
      );
      
      const snapshot = await getDocs(q);
      const invoicesData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      
      setInvoices(invoicesData);
      setFilteredInvoices(invoicesData);
    } catch (error) {
      console.error('Error fetching invoices:', error);
      toast.error('Failed to load invoices');
    } finally {
      setLoading(false);
    }
  }

  function filterInvoices() {
    let filtered = invoices;

    if (searchTerm) {
      filtered = filtered.filter(invoice =>
        invoice.invoiceNumber?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        invoice.clientName?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (statusFilter !== 'all') {
      filtered = filtered.filter(invoice => invoice.status === statusFilter);
    }

    setFilteredInvoices(filtered);
  }

  async function handleDownloadPDF(invoiceId, invoiceNumber) {
    try {
      const toastId = toast.loading('Generating PDF...');
      
      if(!invoiceId) {
        throw new Error('Invoice ID is missing');
      }

      console.log('Downloading PDF for invoice:', invoiceId);
      
      const response = await fetch(`/api/invoices/${invoiceId}/pdf`);
      
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to generate PDF');
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${invoiceNumber}.pdf`;
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

  async function handleDelete(invoiceId, invoiceNumber) {
    if (!confirm(`Delete invoice ${invoiceNumber}? This cannot be undone.`)) {
      return;
    }

    try {
      await deleteDoc(doc(db, 'invoices', invoiceId));
      setInvoices(invoices.filter(inv => inv.id !== invoiceId));
      toast.success('Invoice deleted');
    } catch (error) {
      console.error('Delete error:', error);
      toast.error('Failed to delete invoice');
    }
  }

  function handleOpenSendModal(invoice) {
    setSelectedInvoice(invoice);
    setSendModalOpen(true);
  }

  function getStatusColor(status) {
    switch (status) {
      case 'draft': return 'bg-gray-100 text-gray-800';
      case 'sent': return 'bg-blue-100 text-blue-800';
      case 'viewed': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  }

  if (loading) {
    return <LoadingSpinner text="Loading invoices..." />;
  }

  return (
    <div className="max-w-7xl mx-auto">
      {/* Header - Mobile Responsive */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold">Invoices</h1>
          <p className="text-gray-600 mt-1">{filteredInvoices.length} invoice(s)</p>
        </div>
        <Link href="/dashboard/invoices/new" className="w-full sm:w-auto">
          <Button className="w-full sm:w-auto">
            <Plus className="mr-2 h-4 w-4" />
            New Invoice
          </Button>
        </Link>
      </div>

      {/* Search & Filters - Mobile Responsive */}
      <div className="mb-6 space-y-3">
        {/* Search Bar */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Search by invoice number or client name..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        
        {/* Filter Toggle Button - Mobile Only */}
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowFilters(!showFilters)}
            className="md:hidden"
          >
            <Filter className="mr-2 h-4 w-4" />
            Filters
          </Button>
          
          {/* Filter Buttons */}
          <div className={`flex flex-wrap gap-2 ${showFilters ? 'flex' : 'hidden md:flex'}`}>
            <Button
              variant={statusFilter === 'all' ? 'default' : 'outline'}
              onClick={() => setStatusFilter('all')}
              size="sm"
            >
              All
            </Button>
            <Button
              variant={statusFilter === 'draft' ? 'default' : 'outline'}
              onClick={() => setStatusFilter('draft')}
              size="sm"
            >
              Draft
            </Button>
            <Button
              variant={statusFilter === 'sent' ? 'default' : 'outline'}
              onClick={() => setStatusFilter('sent')}
              size="sm"
            >
              Sent
            </Button>
            <Button
              variant={statusFilter === 'viewed' ? 'default' : 'outline'}
              onClick={() => setStatusFilter('viewed')}
              size="sm"
            >
              Viewed
            </Button>
          </div>
        </div>
      </div>

      {/* Invoice List */}
      {filteredInvoices.length === 0 ? (
        <Card className="p-8 sm:p-12 text-center">
          <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold mb-2">
            {searchTerm || statusFilter !== 'all' ? 'No invoices found' : 'No invoices yet'}
          </h3>
          <p className="text-gray-600 mb-6">
            {searchTerm || statusFilter !== 'all' 
              ? 'Try adjusting your filters'
              : 'Create your first invoice in 60 seconds'
            }
          </p>
          {!searchTerm && statusFilter === 'all' && (
            <Link href="/dashboard/invoices/new">
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Create Invoice
              </Button>
            </Link>
          )}
        </Card>
      ) : (
        <div className="space-y-3">
          {filteredInvoices.map(invoice => (
            <Card key={invoice.id} className="p-4 hover:shadow-md transition-shadow">
              {/* Mobile Layout - Stacked */}
              <div className="md:hidden space-y-3">
                {/* Header */}
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-3 min-w-0 flex-1">
                    <div className="w-10 h-10 bg-blue-100 rounded flex items-center justify-center flex-shrink-0">
                      <FileText className="h-5 w-5 text-blue-600" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2 mb-1 flex-wrap">
                        <h3 className="font-semibold text-sm">{invoice.invoiceNumber || 'INV-000'}</h3>
                        <Badge className={getStatusColor(invoice.status)}>
                          {invoice.status || 'draft'}
                        </Badge>
                      </div>
                      <p className="text-sm text-gray-600 truncate">{invoice.clientName || 'No client'}</p>
                    </div>
                  </div>
                </div>

                {/* Details */}
                <div className="flex items-center justify-between text-sm pl-13">
                  <div>
                    <p className="text-gray-500 text-xs">Amount</p>
                    <p className="font-semibold">${invoice.total?.toFixed(2) || '0.00'}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-gray-500 text-xs">Due Date</p>
                    <p className="font-semibold text-sm">
                      {invoice.dueDate ? format(new Date(invoice.dueDate), 'MMM d') : 'N/A'}
                    </p>
                  </div>
                </div>

                {/* Actions */}
                <div className="grid grid-cols-2 gap-2 pl-13">
                  <Link href={`/dashboard/invoices/${invoice.id}/edit`} className="contents">
                    <Button variant="outline" size="sm" className="w-full">
                      <Edit className="mr-1 h-3 w-3" />
                      <span className="text-xs">Edit</span>
                    </Button>
                  </Link>
                  
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => handleDownloadPDF(invoice.id, invoice.invoiceNumber)}
                    className="w-full"
                  >
                    <Download className="mr-1 h-3 w-3" />
                    <span className="text-xs">PDF</span>
                  </Button>
                  
                  {invoice.status === 'draft' && (
                    <Button 
                      size="sm"
                      onClick={() => handleOpenSendModal(invoice)}
                      className="w-full col-span-2"
                    >
                      <Send className="mr-1 h-3 w-3" />
                      <span className="text-xs">Send</span>
                    </Button>
                  )}
                  
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={() => handleDelete(invoice.id, invoice.invoiceNumber)}
                    className="text-red-600 hover:text-red-700 hover:bg-red-50 w-full col-span-2"
                  >
                    <Trash2 className="mr-1 h-3 w-3" />
                    <span className="text-xs">Delete</span>
                  </Button>
                </div>
              </div>

              {/* Desktop Layout - Row */}
              <div className="hidden md:flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-blue-100 rounded flex items-center justify-center">
                    <FileText className="h-6 w-6 text-blue-600" />
                  </div>
                  
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-semibold">{invoice.invoiceNumber || 'INV-000'}</h3>
                      <Badge className={getStatusColor(invoice.status)}>
                        {invoice.status || 'draft'}
                      </Badge>
                    </div>
                    <div className="text-sm text-gray-600">
                      <span>{invoice.clientName || 'No client'}</span>
                      <span className="mx-2">•</span>
                      <span>${invoice.total?.toFixed(2) || '0.00'}</span>
                      <span className="mx-2">•</span>
                      <span>
                        Due {invoice.dueDate ? format(new Date(invoice.dueDate), 'MMM d, yyyy') : 'N/A'}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <Link href={`/dashboard/invoices/${invoice.id}/edit`}>
                    <Button variant="outline" size="sm">
                      <Edit className="mr-2 h-4 w-4" />
                      Edit
                    </Button>
                  </Link>
                  
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => handleDownloadPDF(invoice.id, invoice.invoiceNumber)}
                  >
                    <Download className="mr-2 h-4 w-4" />
                    PDF
                  </Button>
                  
                  {invoice.status === 'draft' && (
                    <Button 
                      size="sm"
                      onClick={() => handleOpenSendModal(invoice)}
                    >
                      <Send className="mr-2 h-4 w-4" />
                      Send
                    </Button>
                  )}
                  
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={() => handleDelete(invoice.id, invoice.invoiceNumber)}
                    className="text-red-600 hover:text-red-700 hover:bg-red-50"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Send Modal */}
      {selectedInvoice && (
        <SendModal
          isOpen={sendModalOpen}
          onClose={() => {
            setSendModalOpen(false);
            setSelectedInvoice(null);
            fetchInvoices();
          }}
          invoice={selectedInvoice}
          invoiceId={selectedInvoice.id}
          businessInfo={userData}
        />
      )}
    </div>
  );
}