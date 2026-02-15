// app/api/invoices/[id]/send-email/route.js
import { NextResponse } from 'next/server';
import { Resend } from 'resend';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase/config';
import { getInvoiceEmailHTML, getInvoiceEmailText } from '@/lib/email/templates';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request, { params }) {
  try {
    const invoiceId = params.id;

    // Fetch invoice
    const invoiceDoc = await getDoc(doc(db, 'invoices', invoiceId));
    if (!invoiceDoc.exists()) {
      return NextResponse.json({ error: 'Invoice not found' }, { status: 404 });
    }

    const invoice = invoiceDoc.data();

    // Fetch business info
    const userDoc = await getDoc(doc(db, 'users', invoice.userId));
    const businessInfo = userDoc.data();

    // Generate invoice URL (public view)
    const invoiceUrl = `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/invoice/${invoiceId}`;

    // Generate email content
    const htmlContent = getInvoiceEmailHTML(invoice, businessInfo, invoiceUrl);
    const textContent = getInvoiceEmailText(invoice, businessInfo, invoiceUrl);

    // Send email
    const { data, error } = await resend.emails.send({
      from: `${businessInfo.businessName} <invoices@resend.dev>`, // Use verified domain later
      to: invoice.clientEmail,
      subject: `Invoice ${invoice.invoiceNumber} from ${businessInfo.businessName}`,
      html: htmlContent,
      text: textContent
    });

    if (error) {
      console.error('Resend error:', error);
      return NextResponse.json({ error: 'Failed to send email' }, { status: 500 });
    }

    // Update invoice status
    await updateDoc(doc(db, 'invoices', invoiceId), {
      status: 'sent',
      sentAt: new Date().toISOString(),
      sentVia: ['email']
    });

    return NextResponse.json({ 
      success: true, 
      messageId: data.id 
    });

  } catch (error) {
    console.error('Email sending error:', error);
    return NextResponse.json({ 
      error: error.message 
    }, { status: 500 });
  }
}