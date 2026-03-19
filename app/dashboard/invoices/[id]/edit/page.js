// app/(dashboard)/dashboard/invoices/[id]/edit/page.js - MOBILE RESPONSIVE VERSION
'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useAuth } from '@/lib/context/AuthContext';
import { useInvoiceStore } from '@/lib/store/invoiceStore';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase/config';
import { updateInvoice, validateInvoice } from '@/lib/invoice/save';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Save, Send, Loader2 } from 'lucide-react';
import Link from 'next/link';
import InvoiceForm from '@/components/invoice/invoiceForm';
import InvoicePreview from '@/components/invoice/invoicePreview';
import SendModal from '@/components/invoice/sendModal';
import LoadingSpinner from '@/components/common/LoadingSpinner';
import { toast } from 'sonner';

export default function EditInvoicePage() {
  const router = useRouter();
  const params = useParams();
  const { user, userData } = useAuth();
  const { invoice, loadInvoice } = useInvoiceStore();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [sendModalOpen, setSendModalOpen] = useState(false);

  const invoiceId = params.id;

  useEffect(() => {
    if (user && invoiceId) {
      fetchInvoice();
    }
  }, [user, invoiceId]);

  async function fetchInvoice() {
    try {
      const invoiceDoc = await getDoc(doc(db, 'invoices', invoiceId));
      
      if (!invoiceDoc.exists()) {
        toast.error('Invoice not found');
        router.push('/dashboard');
        return;
      }

      const invoiceData = invoiceDoc.data();
      
      if (invoiceData.userId !== user.uid) {
        toast.error('You do not have permission to edit this invoice');
        router.push('/dashboard');
        return;
      }

      loadInvoice(invoiceData);
    } catch (error) {
      console.error('Error fetching invoice:', error);
      toast.error('Failed to load invoice');
      router.push('/dashboard');
    } finally {
      setLoading(false);
    }
  }

  async function handleSave() {
    const errors = validateInvoice(invoice);
    if (errors.length > 0) {
      errors.forEach(error => toast.error(error));
      return;
    }

    try {
      setSaving(true);
      await updateInvoice(invoiceId, invoice);
      toast.success('Invoice updated!');
      router.push('/dashboard');
    } catch (error) {
      console.error('Save error:', error);
      toast.error('Failed to update invoice');
    } finally {
      setSaving(false);
    }
  }

  async function handleSaveAndSend() {
    const errors = validateInvoice(invoice);
    if (errors.length > 0) {
      errors.forEach(error => toast.error(error));
      return;
    }

    try {
      setSaving(true);
      await updateInvoice(invoiceId, invoice);
      toast.success('Invoice updated!');
      setSendModalOpen(true);
    } catch (error) {
      console.error('Save error:', error);
      toast.error('Failed to update invoice');
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return <LoadingSpinner text="Loading invoice..." />;
  }

  return (
    <div className="max-w-7xl mx-auto">
      {/* Header - Mobile Responsive */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div className="flex items-center gap-3 min-w-0">
          <Link href="/dashboard">
            <Button variant="ghost" size="icon" className="-ml-2 sm:ml-0">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold truncate">
            Edit {invoice.invoiceNumber}
          </h1>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
          <Button 
            variant="outline" 
            onClick={handleSave}
            disabled={saving}
            className="w-full sm:w-auto order-2 sm:order-1"
          >
            {saving ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <Save className="mr-2 h-4 w-4" />
                Save Changes
              </>
            )}
          </Button>
          
          <Button 
            onClick={handleSaveAndSend}
            disabled={saving}
            className="w-full sm:w-auto order-1 sm:order-2"
          >
            {saving ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <Send className="mr-2 h-4 w-4" />
                Save & Send
              </>
            )}
          </Button>
        </div>
      </div>

      {/* Form & Preview - Mobile: Stacked, Desktop: Side-by-side */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8">
        {/* Form */}
        <div className="order-2 lg:order-1">
          <InvoiceForm />
        </div>

        {/* Preview */}
        <div className="order-1 lg:order-2">
          <div className="lg:sticky lg:top-8">
            <InvoicePreview />
          </div>
        </div>
      </div>

      {/* Send Modal */}
      <SendModal
        isOpen={sendModalOpen}
        onClose={() => {
          setSendModalOpen(false);
          router.push('/dashboard');
        }}
        invoice={invoice}
        invoiceId={invoiceId}
        businessInfo={userData}
      />
    </div>
  );
}