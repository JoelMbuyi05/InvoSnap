// app/api/invoices/[id]/pdf/route.js
import { NextResponse } from 'next/server';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase/config';
import ReactPDF, { renderToBuffer } from '@react-pdf/renderer';
import PDFInvoice from '@/components/pdf/PDFInvoice';

export async function GET(request, { params }) {
  try {
    const invoiceId = params.id;

    console.log('📄 Generating PDF for invoice:', invoiceId);

    // Fetch invoice
    const invoiceDoc = await getDoc(doc(db, 'invoices', invoiceId));
    
    if (!invoiceDoc.exists()) {
      console.error('❌ Invoice not found:', invoiceId);
      return NextResponse.json({ error: 'Invoice not found' }, { status: 404 });
    }

    const invoice = invoiceDoc.data();
    console.log('✅ Invoice found:', invoice.invoiceNumber);

    // Fetch business info
    const userDoc = await getDoc(doc(db, 'users', invoice.userId));
    
    if (!userDoc.exists()) {
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
    
    console.log('✅ PDF rendered successfully');

    // Return PDF
    return new NextResponse(pdfBuffer, {
      status: 200,
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="${invoice.invoiceNumber}.pdf"`,
        'Cache-Control': 'no-cache'
      }
    });
  } catch (error) {
    console.error('❌ PDF generation error:', error);
    console.error('Error stack:', error.stack);
    return NextResponse.json({ 
      error: 'Failed to generate PDF',
      details: error.message 
    }, { status: 500 });
  }
}