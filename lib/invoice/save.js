// lib/invoice/save.js
import { collection, addDoc, doc, updateDoc, increment, getDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase/config';

export async function saveInvoice(userId, invoiceData) {
  try {
    console.log('Saving invoice for user:', userId);
    
    // ✅ FIX: Check if user document exists first
    const userDocRef = doc(db, 'users', userId);
    const userDoc = await getDoc(userDocRef);
    
    if (!userDoc.exists()) {
      console.error('User document does not exist!');
      throw new Error('User profile not found. Please log out and log back in.');
    }
    
    // Create invoice document
    const invoiceRef = await addDoc(collection(db, 'invoices'), {
      userId,
      ...invoiceData,
      status: 'draft',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    });

    console.log('Invoice created with ID:', invoiceRef.id);

    // ✅ FIX: Only update if user document exists
    await updateDoc(userDocRef, {
      nextInvoiceNumber: increment(1)
    });

    console.log('User nextInvoiceNumber incremented');

    return invoiceRef.id;
  } catch (error) {
    console.error('Error saving invoice:', error);
    throw error;
  }
}

export async function updateInvoice(invoiceId, invoiceData) {
  try {
    await updateDoc(doc(db, 'invoices', invoiceId), {
      ...invoiceData,
      updatedAt: new Date().toISOString()
    });
  } catch (error) {
    console.error('Error updating invoice:', error);
    throw error;
  }
}

export function validateInvoice(invoice) {
  const errors = [];

  if (!invoice.clientId) {
    errors.push('Please select a client');
  }

  if (!invoice.items || invoice.items.length === 0) {
    errors.push('Add at least one item');
  }

  const hasEmptyItems = invoice.items?.some(item => !item.description);
  if (hasEmptyItems) {
    errors.push('All items must have a description');
  }

  const hasInvalidAmounts = invoice.items?.some(item => !item.amount || item.amount <= 0);
  if (hasInvalidAmounts) {
    errors.push('All items must have a quantity and rate');
  }

  if (!invoice.invoiceNumber) {
    errors.push('Invoice number is required');
  }

  if (!invoice.issueDate) {
    errors.push('Issue date is required');
  }

  if (!invoice.dueDate) {
    errors.push('Due date is required');
  }

  return errors;
}