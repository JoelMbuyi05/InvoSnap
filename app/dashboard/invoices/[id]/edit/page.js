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
import { ArrowLeft, Save, Loader2 } from 'lucide-react';
import Link from 'next/link';
import InvoiceForm from '@/components/invoice/invoiceForm';
import InvoicePreview from '@/components/invoice/invoicePreview';

export default function EditInvoicePage() {
  const router = useRouter();
  const params = useParams();
  const invoiceId = params.id;
  
  const { user } = useAuth();
  const { loadInvoice, invoice } = useInvoiceStore();
  
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // EXPLANATION: Load invoice data when page loads
  useEffect(() => {
    async function fetchInvoice() {
      try {
        const invoiceDoc = await getDoc(doc(db, 'invoices', invoiceId));
        
        if (!invoiceDoc.exists()) {
          alert('Invoice not found');
          router.push('/dashboard');
          return;
        }

        const invoiceData = invoiceDoc.data();
        
        // Check if user owns this invoice
        if (invoiceData.userId !== user.uid) {
          alert('You do not have permission to edit this invoice');
          router.push('/dashboard');
          return;
        }

        // Load into store
        loadInvoice(invoiceData);
      } catch (error) {
        console.error('Error loading invoice:', error);
        alert('Error loading invoice');
        router.push('/dashboard');
      } finally {
        setLoading(false);
      }
    }

    if (user && invoiceId) {
      fetchInvoice();
    }
  }, [user, invoiceId, loadInvoice, router]);

  async function handleSave() {
    const errors = validateInvoice(invoice);
    if (errors.length > 0) {
      alert('Please fix these errors:\n\n' + errors.join('\n'));
      return;
    }

    try {
      setSaving(true);
      await updateInvoice(invoiceId, invoice);
      alert('Invoice updated!');
      router.push('/dashboard');
    } catch (error) {
      console.error('Update error:', error);
      alert('Error updating invoice: ' + error.message);
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
      </div>
    );
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
          <h1 className="text-3xl font-bold">Edit Invoice</h1>
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
          <Button>Preview & Send</Button>
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
    </div>
  );
}