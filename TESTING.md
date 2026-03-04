# InvoSnap Testing Checklist

## Authentication
- [ ] Sign up with new email
- [ ] Sign up with existing email (should fail)
- [ ] Login with correct credentials
- [ ] Login with wrong credentials (should fail)
- [ ] Logout

## Client Management
- [ ] Add new client
- [ ] Edit client
- [ ] Delete client
- [ ] View client list

## Invoice Creation
- [ ] Create invoice with all fields
- [ ] Create invoice with minimum fields
- [ ] Save draft
- [ ] Edit saved invoice
- [ ] Delete invoice

## Invoice Calculations
- [ ] Add multiple line items
- [ ] Calculate totals correctly
- [ ] Apply discount (percentage)
- [ ] Apply tax
- [ ] Verify final total = subtotal - discount + tax

## PDF Generation
- [ ] Download PDF
- [ ] Verify PDF has all invoice data
- [ ] Check PDF formatting
- [ ] Test on mobile

## Email Sending
- [ ] Send invoice via email
- [ ] Verify email received
- [ ] Check email formatting
- [ ] Test PDF attachment

## WhatsApp
- [ ] Generate WhatsApp link
- [ ] Send via WhatsApp
- [ ] Verify link works

## Public Invoice View
- [ ] Access public invoice URL
- [ ] Verify all data visible
- [ ] Test download from public page
- [ ] Check mobile view

## Responsive Design
- [ ] Test on desktop (1920x1080)
- [ ] Test on tablet (768px)
- [ ] Test on mobile (375px)
- [ ] Test landscape mode

## Browser Compatibility
- [ ] Chrome
- [ ] Firefox
- [ ] Safari
- [ ] Edge

## Error Handling
- [ ] Network error (disconnect internet)
- [ ] Invalid invoice ID
- [ ] Missing required fields
- [ ] Firestore permission denied