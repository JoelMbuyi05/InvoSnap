// app/api/invoices/[invoiceId]/pdf/route.js
import { NextResponse } from 'next/server';
import { getDoc, doc } from 'firebase/firestore';
import { db } from '@/lib/firebase/config';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

export async function GET(request, { params }) {
  try {
    const { invoiceId } = params;
    
    if (!invoiceId) {
      return NextResponse.json(
        { error: 'Invoice ID is required' },
        { status: 400 }
      );
    }

    console.log('📝 Fetching invoice:', invoiceId);
    
    // Fetch invoice from Firestore
    const invoiceDoc = await getDoc(doc(db, 'invoices', invoiceId));
    
    if (!invoiceDoc.exists()) {
      console.log('❌ Invoice not found:', invoiceId);
      return NextResponse.json(
        { error: 'Invoice not found' },
        { status: 404 }
      );
    }

    const invoice = invoiceDoc.data();
    console.log('✅ Invoice found:', invoice.invoiceNumber);
    
    // Create PDF
    const doc = new jsPDF();
    
    // Business info
    doc.setFontSize(20);
    doc.setTextColor(41, 128, 185);
    doc.text(invoice.businessName || 'Your Business', 20, 20);
    
    doc.setFontSize(16);
    doc.setTextColor(0, 0, 0);
    doc.text('INVOICE', 150, 20);
    
    // Invoice details
    doc.setFontSize(10);
    doc.text(`Invoice #: ${invoice.invoiceNumber || 'N/A'}`, 20, 35);
    doc.text(`Date: ${invoice.createdAt ? new Date(invoice.createdAt).toLocaleDateString() : 'N/A'}`, 20, 42);
    doc.text(`Due Date: ${invoice.dueDate ? new Date(invoice.dueDate).toLocaleDateString() : 'N/A'}`, 20, 49);
    
    // Client info
    doc.setFontSize(12);
    doc.text('Bill To:', 20, 62);
    doc.setFontSize(10);
    doc.text(invoice.clientName || 'Client', 20, 70);
    if (invoice.clientEmail) doc.text(invoice.clientEmail, 20, 77);
    if (invoice.clientAddress) doc.text(invoice.clientAddress, 20, 84);
    
    // Items table
    const items = invoice.items || [];
    const tableData = items.map(item => [
      item.description || 'Item',
      String(item.quantity || 0),
      `$${parseFloat(item.rate || 0).toFixed(2)}`,
      `$${parseFloat(item.amount || 0).toFixed(2)}`
    ]);
    
    autoTable(doc, {
      startY: 100,
      head: [['Description', 'Qty', 'Rate', 'Amount']],
      body: tableData,
      foot: [
        ['', '', 'Subtotal:', `$${parseFloat(invoice.subtotal || 0).toFixed(2)}`],
        ['', '', 'Tax:', `$${parseFloat(invoice.taxAmount || 0).toFixed(2)}`],
        ['', '', 'Total:', `$${parseFloat(invoice.total || 0).toFixed(2)}`]
      ],
      theme: 'striped',
      headStyles: { fillColor: [41, 128, 185], textColor: 255 },
      footStyles: { fillColor: [240, 240, 240], textColor: 0, fontStyle: 'bold' }
    });
    
    // Notes
    if (invoice.notes) {
      const finalY = doc.lastAutoTable.finalY + 10;
      doc.setFontSize(10);
      doc.text('Notes:', 20, finalY);
      doc.setFontSize(9);
      doc.text(invoice.notes, 20, finalY + 7);
    }
    
    // Get PDF as buffer
    const pdfBuffer = Buffer.from(doc.output('arraybuffer'));
    
    console.log('✅ PDF generated successfully');
    
    // Return PDF
    return new NextResponse(pdfBuffer, {
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="${invoice.invoiceNumber || 'invoice'}.pdf"`,
        'Content-Length': pdfBuffer.length.toString()
      },
    });
    
  } catch (error) {
    console.error('❌ PDF generation error:', error);
    console.error('Error details:', error.message);
    
    return NextResponse.json(
      { error: 'Failed to generate PDF: ' + error.message },
      { status: 500 }
    );
  }
}