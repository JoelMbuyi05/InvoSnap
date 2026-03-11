// app/(dashboard)/dashboard/invoices/new/page.js
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
      console.log('Invoice saved with ID:', invoiceId);
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
        console.log('Invoice saved with ID:', invoiceId);
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
    <div>
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
          <Link href="/dashboard">
            <Button variant="ghost" size="icon">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <h1 className="text-3xl font-bold">New Invoice</h1>
        </div>
        
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            onClick={handleSaveDraft}
            disabled={isBusy}
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

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div>
          <InvoiceForm />
        </div>

        <div className="lg:sticky lg:top-8 h-fit">
          <InvoicePreview />
        </div>
      </div>

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