// app/api/invoices/[id]/pdf/route.js
import { NextResponse } from 'next/server';
const { adminDb } = require('@/lib/firebase/admin');
import { renderToBuffer } from '@react-pdf/renderer';
import PDFInvoice from '@/components/pdf/PDFInvoice';

export async function GET(request, { params }) {
  try {
    // ✅ FIX: Properly extract invoice ID
    const {id: invoiceId} = await params;

    if (!invoiceId) {
      console.error('❌ No invoice ID provided');
      return NextResponse.json({ error: 'Invoice ID is required' }, { status: 400 });
    }

    console.log('📄 Generating PDF for invoice:', invoiceId);

    // Fetch invoice
    const invoiceDoc = await adminDb.collection('invoices').doc(invoiceId).get();
    
    if (!invoiceDoc.exists) {
      console.error('❌ Invoice not found:', invoiceId);
      return NextResponse.json({ error: 'Invoice not found' }, { status: 404 });
    }

    const invoice = invoiceDoc.data();
    console.log('✅ Invoice found:', invoice.invoiceNumber);

    // Fetch business info
    const userDoc = await adminDb.collection('users').doc(invoice.userId).get();
    
    if (!userDoc.exists) {
      console.error('❌ User not found:', invoice.userId);
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const businessInfo = userDoc.data();
    console.log('✅ Business info found');

    // Generate PDF
    console.log('🔄 Rendering PDF...');
    
    const pdfBuffer = await renderToBuffer(
      <PDFInvoice 
        invoice={invoice}
        businessInfo={businessInfo}
        showWatermark={false}
      />
    );
    
    console.log('✅ PDF rendered successfully, size:', pdfBuffer.length, 'bytes');

    // Return PDF
    return new NextResponse(pdfBuffer, {
      status: 200,
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="${invoice.invoiceNumber || 'invoice'}.pdf"`,
        'Content-Length': pdfBuffer.length.toString(),
        'Cache-Control': 'no-cache, no-store, must-revalidate'
      }
    });
  } catch (error) {
    console.error('❌ PDF generation error:', error);
    console.error('Error name:', error.name);
    console.error('Error message:', error.message);
    console.error('Error stack:', error.stack);
    
    return NextResponse.json({ 
      error: 'Failed to generate PDF',
      details: error.message,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    }, { status: 500 });
  }
}