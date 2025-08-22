# 🧾 Automatic Invoice Email System

## Overview
The ZinR backend now automatically sends professional invoice emails to customers immediately after they place an order, ensuring they receive a detailed receipt right away.

## Features

### 1. **Immediate Invoice Delivery**
- ✅ Invoice sent automatically when order is created
- ✅ No waiting for payment confirmation
- ✅ Professional, branded invoice design
- ✅ Includes all order details and pricing breakdown

### 2. **Two Types of Invoices**

#### **Order Confirmation Invoice** (Sent immediately)
- Sent when order is first created
- Shows order details, items, and total amount
- Includes GST breakdown (18%)
- Professional styling with restaurant branding
- Order tracking information

#### **Payment Confirmation Invoice** (Sent after payment)
- Sent when payment is verified
- Includes all payment details
- Transaction ID and payment method
- Confirms successful payment
- Same professional styling

### 3. **Invoice Content**
- 🏪 Restaurant information and branding
- 👤 Customer details (name, email, phone)
- 📋 Complete order items with quantities and prices
- 💰 Price breakdown (subtotal, GST, total)
- 📅 Order date and time
- 🎯 Table number (if applicable)
- 📝 Special instructions and notes
- 📱 Order tracking QR code

### 4. **Email Templates**
- **`order-confirmation.ejs`** - Initial invoice template
- **`payment-confirmation.ejs`** - Payment confirmation template
- Responsive design for mobile and desktop
- Professional color scheme and typography
- Indian Rupee (₹) currency formatting

## Technical Implementation

### Email Service Functions
```javascript
// Send initial invoice
sendOrderConfirmationEmail(email, order, restaurant)

// Send payment confirmation
sendPaymentConfirmationEmail(email, order, restaurant)

// Resend invoice manually
resendInvoiceEmail(email, order, restaurant)
```

### API Endpoints
```
POST /api/orders/:orderId/resend-invoice
```
- Protected route for restaurant owners
- Manually resend invoice to customer
- Useful for customer support

### Automatic Triggers
1. **Order Creation** → Sends order confirmation invoice
2. **Payment Verification** → Sends payment confirmation invoice
3. **Manual Resend** → Restaurant can resend invoice anytime

## Configuration

### Environment Variables Required
```env
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password
```

### Email Service Features
- Automatic fallback to dummy transporter for development
- Error handling and logging
- Support for multiple email providers
- Template-based email generation

## Usage Examples

### Frontend Integration
```javascript
// After successful order creation
const response = await fetch('/api/orders', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify(orderData)
});

// Invoice is automatically sent to customer email
// No additional action required
```

### Manual Invoice Resend
```javascript
// Restaurant owner can resend invoice
const response = await fetch(`/api/orders/${orderId}/resend-invoice`, {
  method: 'POST',
  headers: { 
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`
  }
});
```

## Benefits

### For Customers
- 📧 Immediate order confirmation
- 🧾 Professional invoice for records
- 💳 Clear payment information
- 📱 Easy order tracking

### For Restaurants
- 🚀 Improved customer experience
- 📊 Better order documentation
- 💼 Professional business image
- 🔄 Reduced customer inquiries

### For Business
- 📈 Increased customer satisfaction
- 💰 Better financial tracking
- 🎯 Improved brand perception
- 📋 Automated documentation

## Troubleshooting

### Common Issues
1. **Emails not sending**
   - Check SMTP configuration
   - Verify customer email in order data
   - Check server logs for errors

2. **Template rendering issues**
   - Ensure EJS templates are properly formatted
   - Check template path configuration
   - Verify template variables

3. **Invoice not received**
   - Check spam/junk folders
   - Verify email address format
   - Check SMTP server status

### Debug Mode
Enable detailed logging in the email service:
```javascript
console.log('Email service status:', {
  hasTransporter: !!transporter,
  transporterType: transporter ? transporter.constructor.name : 'none'
});
```

## Future Enhancements

### Planned Features
- 📊 Invoice analytics and reporting
- 🎨 Customizable invoice templates
- 📱 SMS invoice delivery
- 💾 PDF invoice generation
- 🔗 Digital invoice links
- 📈 Invoice tracking and analytics

### Customization Options
- Restaurant-specific branding
- Multiple language support
- Custom color schemes
- Additional invoice fields
- Integration with accounting systems

## Support

For technical support or questions about the invoice system:
- Check server logs for error messages
- Verify email configuration
- Test with sample order data
- Contact development team

---

**Last Updated**: August 2024
**Version**: 1.0.0
**Status**: ✅ Production Ready
