// app/(dashboard)/dashboard/invoices/new/page.js - MOBILE RESPONSIVE VERSION
'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/context/AuthContext';
import { useInvoiceStore } from '@/lib/store/invoiceStore';
import { generateInvoiceNumber, calculateDueDate } from '@/lib/invoice/calculator';
import { saveInvoice, validateInvoice } from '@/lib/invoice/save';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Save, Send, Loader2 } from 'lucide-react';
import Link from 'next/link';
import InvoiceForm from '@/components/invoice/invoiceForm';
import InvoicePreview from '@/components/invoice/invoicePreview';
import SendModal from '@/components/invoice/sendModal';
import { toast } from 'sonner';

export default function NewInvoicePage() {
  const router = useRouter();
  const { user, userData } = useAuth();
  const { invoice, setInvoiceDetails, resetInvoice } = useInvoiceStore();
  const [savingDraft, setSavingDraft] = useState(false);
  const [savingAndSending, setSavingAndSending] = useState(false);
  const [sendModalOpen, setSendModalOpen] = useState(false);
  const [savedInvoiceId, setSavedInvoiceId] = useState(null);

  useEffect(() => {
    if (userData) {
      resetInvoice();
      
      const invoiceNumber = generateInvoiceNumber(
        userData.invoicePrefix || 'INV',
        userData.nextInvoiceNumber || 1
      );
      
      const issueDate = new Date().toISOString().split('T')[0];
      const dueDate = calculateDueDate(issueDate, 30);

      setInvoiceDetails({
        invoiceNumber,
        issueDate,
        dueDate,
        taxRate: userData.taxRate || 0,
        notes: userData.defaultNotes || ''
      });
    }
  }, [userData, resetInvoice, setInvoiceDetails]);

  async function handleSaveDraft() {
    const errors = validateInvoice(invoice);
    if (errors.length > 0) {
      errors.forEach(error => toast.error(error));
      return;
    }

    try {
      setSavingDraft(true);
      const invoiceId = await saveInvoice(user.uid, invoice);
      setSavedInvoiceId(invoiceId);
      toast.success('Invoice saved as draft!');
      router.push('/dashboard');
    } catch (error) {
      console.error('Save error:', error);
      toast.error(error.message || 'Failed to save invoice');
    } finally {
      setSavingDraft(false);
    }
  }

  async function handlePreviewAndSend() {
    const errors = validateInvoice(invoice);
    if (errors.length > 0) {
      errors.forEach(error => toast.error(error));
      return;
    }

    if (!savedInvoiceId) {
      try {
        setSavingAndSending(true);
        const invoiceId = await saveInvoice(user.uid, invoice);
        setSavedInvoiceId(invoiceId);
        toast.success('Invoice saved!');
        setSendModalOpen(true);
      } catch (error) {
        console.error('Save error:', error);
        toast.error(error.message || 'Failed to save invoice');
      } finally {
        setSavingAndSending(false);
      }
    } else {
      setSendModalOpen(true);
    }
  }

  const isBusy = savingDraft || savingAndSending;

  return (
    <div className="max-w-7xl mx-auto">
      {/* Header - Mobile Responsive */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div className="flex items-center gap-3">
          <Link href="/dashboard">
            <Button variant="ghost" size="icon" className="-ml-2 sm:ml-0">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <h1 className="text-2xl sm:text-3xl font-bold">New Invoice</h1>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
          <Button 
            variant="outline" 
            onClick={handleSaveDraft}
            disabled={isBusy}
            className="w-full sm:w-auto order-2 sm:order-1"
          >
            {savingDraft ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <Save className="mr-2 h-4 w-4" />
                Save Draft
              </>
            )}
          </Button>
          
          <Button 
            onClick={handlePreviewAndSend}
            disabled={isBusy}
            className="w-full sm:w-auto order-1 sm:order-2"
          >
            {savingAndSending ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <Send className="mr-2 h-4 w-4" />
                Preview & Send
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

        {/* Preview - Show first on mobile for immediate feedback */}
        <div className="order-1 lg:order-2">
          <div className="lg:sticky lg:top-8">
            <InvoicePreview />
          </div>
        </div>
      </div>

      {/* Send Modal */}
      {savedInvoiceId && (
        <SendModal
          isOpen={sendModalOpen}
          onClose={() => setSendModalOpen(false)}
          invoice={invoice}
          invoiceId={savedInvoiceId}
          businessInfo={userData}
        />
      )}
    </div>
  );
}