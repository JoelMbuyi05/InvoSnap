// app/api/invoices/[id]/send-email/route.js
import { NextResponse } from 'next/server';
import { Resend } from 'resend';
import { adminDb } from '@/lib/firebase/admin';
import { getInvoiceEmailHTML, getInvoiceEmailText } from '@/lib/email/templates';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request, { params }) {
  try {
    const { id: invoiceId } = await params;
    if (!invoiceId) {
      console.error('❌ No invoice ID provided');
      return NextResponse.json({ error: 'Invoice ID is required' }, { status: 400 });
    }

    console.log('📧 Sending email for invoice:', invoiceId);

    // Fetch invoice
    const invoiceDoc = await adminDb.collection('invoices').doc(invoiceId).get();

    if (!invoiceDoc.exists) {
      console.error('❌ Invoice not found:', invoiceId);
      return NextResponse.json({ error: 'Invoice not found' }, { status: 404 });
    }

    const invoice = invoiceDoc.data();
    console.log('✅ Invoice found:', invoice.invoiceNumber);

    if (!invoice.clientEmail) {
      console.error('❌ No client email');
      return NextResponse.json({ error: 'Client email is required' }, { status: 400 });
    }

    // Fetch business info
    const userDoc = await adminDb.collection('users').doc(invoice.userId).get();

    if (!userDoc.exists) {
      console.error('❌ User not found:', invoice.userId);
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const businessInfo = userDoc.data();
    console.log('✅ Business info found');

    // Generate invoice URL
    const invoiceUrl = `${process.env.NEXT_PUBLIC_APP_URL}/invoice/${invoiceId}`;
    console.log('🔗 Invoice URL:', invoiceUrl);

    // Generate email content
    const htmlContent = getInvoiceEmailHTML(invoice, businessInfo, invoiceUrl);
    const textContent = getInvoiceEmailText(invoice, businessInfo, invoiceUrl);

    console.log('📨 Sending email to:', invoice.clientEmail);

    const { data, error } = await resend.emails.send({
      from: 'InvoSnap <invoices@resend.dev>',
      to: invoice.clientEmail,
      subject: `Invoice ${invoice.invoiceNumber} from ${businessInfo.businessName || 'InvoSnap'}`,
      html: htmlContent,
      text: textContent
    });

    if (error) {
      console.error('❌ Resend API error:', error);
      throw new Error(error.message || 'Resend API error');
    }

    console.log('✅ Email sent successfully, ID:', data?.id);

    // Update invoice status
    await adminDb.collection('invoices').doc(invoiceId).update({
      status: 'sent',
      sentAt: new Date().toISOString(),
      sentVia: ['email']
    });

    console.log('✅ Invoice status updated to sent');

    return NextResponse.json({ 
      success: true, 
      messageId: data?.id 
    });

  } catch (error) {
    console.error('❌ Email sending error:', error);
    console.error('Error details:', {
      name: error.name,
      message: error.message,
      stack: error.stack
    });

    return NextResponse.json({ 
      error: 'Failed to send email',
      details: error.message,
      hint: 'Check your Resend API key and email configuration'
    }, { status: 500 });
  }
}