// lib/whatsapp/share.js

// EXPLANATION: Generate WhatsApp share link
export function generateWhatsAppLink(invoice, businessInfo, invoiceUrl) {
  const message = `
Hi ${invoice.clientName}!

${businessInfo.businessName} has sent you an invoice.

*Invoice ${invoice.invoiceNumber}*
Amount: $${invoice.total.toFixed(2)}
Due: ${invoice.dueDate}

View invoice: ${invoiceUrl}

If you have questions, contact us at ${businessInfo.businessEmail}
  `.trim();

  // EXPLANATION: WhatsApp URL format
  // wa.me/{phone}?text={message}
  // If no phone, just open WhatsApp with message
  
  const encodedMessage = encodeURIComponent(message);
  
  if (invoice.clientPhone) {
    // Remove spaces, dashes, parentheses from phone
    const cleanPhone = invoice.clientPhone.replace(/[\s\-\(\)]/g, '');
    return `https://wa.me/${cleanPhone}?text=${encodedMessage}`;
  } else {
    // Open WhatsApp with message (user selects contact)
    return `https://wa.me/?text=${encodedMessage}`;
  }
}