// components/pdf/PDFInvoice.js
import React from 'react';
import { Document, Page, Text, View, StyleSheet, Font } from '@react-pdf/renderer';

// Register fonts (optional)
Font.register({
  family: 'Inter',
  src: 'https://fonts.gstatic.com/s/inter/v12/UcCO3FwrK3iLTeHuS_fvQtMwCp50KnMw2boKoduKmMEVuLyfAZ9hiA.woff2'
});

const styles = StyleSheet.create({
  page: {
    padding: 40,
    fontSize: 11,
    fontFamily: 'Helvetica',
    backgroundColor: '#ffffff'
  },
  header: {
    marginBottom: 30,
    borderBottomWidth: 2,
    borderBottomColor: '#2563eb',
    paddingBottom: 20
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start'
  },
  businessInfo: {
    maxWidth: '50%'
  },
  businessName: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#1f2937'
  },
  businessDetails: {
    fontSize: 9,
    color: '#6b7280',
    marginTop: 2
  },
  invoiceTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#2563eb',
    textAlign: 'right',
    marginBottom: 8
  },
  invoiceNumber: {
    fontSize: 11,
    color: '#6b7280',
    textAlign: 'right'
  },
  section: {
    marginBottom: 25
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20
  },
  column: {
    width: '48%'
  },
  label: {
    fontSize: 9,
    color: '#2563eb',
    fontWeight: 'bold',
    marginBottom: 6,
    textTransform: 'uppercase',
    letterSpacing: 0.5
  },
  value: {
    fontSize: 11,
    color: '#1f2937',
    marginBottom: 2
  },
  clientName: {
    fontSize: 13,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 4
  },
  table: {
    marginTop: 20,
    marginBottom: 30
  },
  tableHeader: {
    flexDirection: 'row',
    backgroundColor: '#2563eb',
    padding: 10,
    color: '#ffffff',
    fontWeight: 'bold',
    fontSize: 10
  },
  tableRow: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
    padding: 10,
    fontSize: 10
  },
  colDescription: {
    width: '50%'
  },
  colQty: {
    width: '15%',
    textAlign: 'right'
  },
  colRate: {
    width: '17.5%',
    textAlign: 'right'
  },
  colAmount: {
    width: '17.5%',
    textAlign: 'right',
    fontWeight: 'bold'
  },
  totalsContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: 20
  },
  totalsBox: {
    width: '50%'
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 8,
    fontSize: 10
  },
  totalLabel: {
    color: '#6b7280'
  },
  totalValue: {
    color: '#1f2937',
    fontWeight: 'bold'
  },
  grandTotal: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 12,
    backgroundColor: '#f3f4f6',
    borderTopWidth: 2,
    borderTopColor: '#2563eb',
    marginTop: 5
  },
  grandTotalLabel: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#2563eb',
    textTransform: 'uppercase'
  },
  grandTotalValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2563eb'
  },
  notes: {
    marginTop: 30,
    paddingTop: 20,
    borderTopWidth: 1,
    borderTopColor: '#e5e7eb'
  },
  notesLabel: {
    fontSize: 9,
    color: '#2563eb',
    fontWeight: 'bold',
    marginBottom: 8,
    textTransform: 'uppercase'
  },
  notesText: {
    fontSize: 9,
    color: '#6b7280',
    lineHeight: 1.5
  },
  footer: {
    position: 'absolute',
    bottom: 30,
    left: 40,
    right: 40,
    textAlign: 'center',
    fontSize: 8,
    color: '#9ca3af',
    borderTopWidth: 1,
    borderTopColor: '#e5e7eb',
    paddingTop: 10
  }
});

export default function PDFInvoice({ invoice, businessInfo }) {
  // Helper function to format currency
  const formatCurrency = (amount) => {
    return `$${Number(amount || 0).toFixed(2)}`;
  };

  // Helper function to format date
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    });
  };

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.headerRow}>
            <View style={styles.businessInfo}>
              <Text style={styles.businessName}>
                {businessInfo?.businessName || 'Business Name'}
              </Text>
              {businessInfo?.businessEmail && (
                <Text style={styles.businessDetails}>{businessInfo.businessEmail}</Text>
              )}
              {businessInfo?.businessPhone && (
                <Text style={styles.businessDetails}>{businessInfo.businessPhone}</Text>
              )}
              {businessInfo?.businessAddress && (
                <Text style={styles.businessDetails}>{businessInfo.businessAddress}</Text>
              )}
            </View>
            
            <View>
              <Text style={styles.invoiceTitle}>INVOICE</Text>
              <Text style={styles.invoiceNumber}>{invoice?.invoiceNumber || 'INV-0001'}</Text>
            </View>
          </View>
        </View>

        {/* Bill To & Dates */}
        <View style={styles.section}>
          <View style={styles.row}>
            <View style={styles.column}>
              <Text style={styles.label}>Bill To</Text>
              <Text style={styles.clientName}>{invoice?.clientName || 'Client Name'}</Text>
              {invoice?.clientEmail && (
                <Text style={styles.value}>{invoice.clientEmail}</Text>
              )}
              {invoice?.clientAddress && (
                <Text style={styles.value}>{invoice.clientAddress}</Text>
              )}
            </View>

            <View style={[styles.column, { alignItems: 'flex-end' }]}>
              <View style={{ marginBottom: 15 }}>
                <Text style={styles.label}>Issue Date</Text>
                <Text style={styles.value}>{formatDate(invoice?.issueDate)}</Text>
              </View>
              <View>
                <Text style={styles.label}>Due Date</Text>
                <Text style={styles.value}>{formatDate(invoice?.dueDate)}</Text>
              </View>
            </View>
          </View>
        </View>

        {/* Items Table */}
        <View style={styles.table}>
          {/* Table Header */}
          <View style={styles.tableHeader}>
            <Text style={styles.colDescription}>Description</Text>
            <Text style={styles.colQty}>Qty</Text>
            <Text style={styles.colRate}>Rate</Text>
            <Text style={styles.colAmount}>Amount</Text>
          </View>

          {/* Table Rows */}
          {invoice?.items && invoice.items.length > 0 ? (
            invoice.items.map((item, index) => (
              <View key={index} style={styles.tableRow}>
                <Text style={styles.colDescription}>{item.description || 'Item'}</Text>
                <Text style={styles.colQty}>{item.quantity || 0}</Text>
                <Text style={styles.colRate}>{formatCurrency(item.rate)}</Text>
                <Text style={styles.colAmount}>{formatCurrency(item.amount)}</Text>
              </View>
            ))
          ) : (
            <View style={styles.tableRow}>
              <Text style={styles.colDescription}>No items</Text>
              <Text style={styles.colQty}>0</Text>
              <Text style={styles.colRate}>$0.00</Text>
              <Text style={styles.colAmount}>$0.00</Text>
            </View>
          )}
        </View>

        {/* Totals */}
        <View style={styles.totalsContainer}>
          <View style={styles.totalsBox}>
            <View style={styles.totalRow}>
              <Text style={styles.totalLabel}>Subtotal</Text>
              <Text style={styles.totalValue}>{formatCurrency(invoice?.subtotal)}</Text>
            </View>

            {invoice?.discountPercent > 0 && (
              <View style={styles.totalRow}>
                <Text style={styles.totalLabel}>
                  Discount ({invoice.discountPercent}%)
                </Text>
                <Text style={styles.totalValue}>
                  -{formatCurrency(invoice?.discountAmount)}
                </Text>
              </View>
            )}

            {invoice?.taxRate > 0 && (
              <View style={styles.totalRow}>
                <Text style={styles.totalLabel}>Tax ({invoice.taxRate}%)</Text>
                <Text style={styles.totalValue}>{formatCurrency(invoice?.taxAmount)}</Text>
              </View>
            )}

            <View style={styles.grandTotal}>
              <Text style={styles.grandTotalLabel}>Total</Text>
              <Text style={styles.grandTotalValue}>{formatCurrency(invoice?.total)}</Text>
            </View>
          </View>
        </View>

        {/* Notes */}
        {invoice?.notes && (
          <View style={styles.notes}>
            <Text style={styles.notesLabel}>Notes</Text>
            <Text style={styles.notesText}>{invoice.notes}</Text>
          </View>
        )}

        {/* Footer */}
        <View style={styles.footer}>
          <Text>Generated by InvoSnap • {businessInfo?.businessName || 'InvoSnap'}</Text>
        </View>
      </Page>
    </Document>
  );
}