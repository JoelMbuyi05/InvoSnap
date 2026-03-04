// app/(dashboard)/dashboard/invoices/[id]/edit/page.js
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
      
      // Security check
      if (invoiceData.userId !== user.uid) {
        toast.error('You do not have permission to edit this invoice');
        router.push('/dashboard');
        return;
      }

      // Load invoice into store
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
    <div>
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
          <Link href="/dashboard">
            <Button variant="ghost" size="icon">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <h1 className="text-3xl font-bold">Edit Invoice {invoice.invoiceNumber}</h1>
        </div>
        
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            onClick={handleSave}
            disabled={saving}
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

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div>
          <InvoiceForm />
        </div>

        <div className="lg:sticky lg:top-8 h-fit">
          <InvoicePreview />
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