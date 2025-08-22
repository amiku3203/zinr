const nodemailer = require('nodemailer');
const ejs = require('ejs');
const path = require('path');

// Create transporter with fallback values
let transporter;
try {
  // Check for both SMTP_ and EMAIL_ prefixes to support different .env configurations
  const emailHost = process.env.SMTP_HOST || process.env.EMAIL_HOST || 'smtp.gmail.com';
  const emailPort = process.env.SMTP_PORT || process.env.EMAIL_PORT || 587;
  const emailUser = process.env.SMTP_USER || process.env.EMAIL_USER;
  const emailPass = process.env.SMTP_PASS || process.env.EMAIL_PASS;

  if (emailHost && emailUser && emailPass) {
    // Use real email configuration
    transporter = nodemailer.createTransport({
      host: emailHost,
      port: emailPort,
      secure: false,
      auth: {
        user: emailUser,
        pass: emailPass
      }
    });
    console.log('Email service initialized with real credentials');
  } else {
    // Use dummy transporter for development
    transporter = nodemailer.createTransport({
      host: 'localhost',
      port: 1025,
      secure: false,
      auth: {
        user: 'dummy@example.com',
        pass: 'dummy_password'
      }
    });
    console.warn('Email service initialized with dummy credentials - emails will not be sent');
  }
} catch (error) {
  console.error('Failed to initialize email service:', error);
  // Create a mock transporter
  transporter = {
    sendMail: async (mailOptions) => {
      console.log('Mock email sent:', mailOptions);
      return { messageId: 'mock_message_id' };
    }
  };
  console.warn('Using mock email service - emails will not be sent');
}

exports.sendEmail = async ({ to, subject, template, context }) => {
  try {
    console.log('Sending email:', { to, subject, template });
    console.log('Email service status:', {
      hasTransporter: !!transporter,
      transporterType: transporter ? transporter.constructor.name : 'none'
    });
    
    const templatePath = path.join(__dirname, '..', 'templates', `${template}.ejs`);
    console.log('Template path:', templatePath);
    
    const html = await ejs.renderFile(templatePath, context);
    console.log('Template rendered successfully');

    // Use the same email user for the from field
    const emailUser = process.env.SMTP_USER || process.env.EMAIL_USER || 'noreply@zinr.com';
    console.log('From email:', emailUser);

    const result = await transporter.sendMail({
      from: `"ZinR Restaurant Solutions" <${emailUser}>`,
      to,
      subject,
      html
    });
    
    console.log('Email sent successfully:', result.messageId);
    return result;
  } catch (error) {
    console.error('Error in sendEmail:', error);
    throw error;
  }
};

// Send order confirmation email
exports.sendOrderConfirmationEmail = async (email, order, restaurant) => {
  const context = {
    orderNumber: order.orderNumber,
    restaurantName: restaurant.name,
    customerName: order.customer.name,
    customerEmail: order.customer.email || email,
    customerPhone: order.customer.phone,
    items: order.items,
    totalAmount: order.totalAmount,
    tableNumber: order.tableNumber,
    notes: order.notes,
    orderDate: new Date(order.createdAt).toLocaleDateString(),
    orderTime: new Date(order.createdAt).toLocaleTimeString()
  };

  await exports.sendEmail({
    to: email,
    subject: `Order Confirmation - ${order.orderNumber}`,
    template: 'order-confirmation',
    context
  });
};

// Send restaurant QR code email
exports.sendRestaurantQREmail = async (email, restaurant) => {
  const context = {
    restaurantName: restaurant.name,
    restaurant: restaurant, // Pass the full restaurant object for the template
    restaurantAddress: restaurant.address,
    restaurantPhone: restaurant.phone
  };

  await exports.sendEmail({
    to: email,
    subject: `Your Restaurant is Ready! 🎉 - ${restaurant.name}`,
    template: 'restaurant-qr',
    context
  });
};

// Send dashboard notification email
exports.sendDashboardNotificationEmail = async (email, restaurant = null) => {
  const context = {
    restaurantName: restaurant?.name || 'Your Restaurant',
    qrCodeDataUrl: restaurant?.qrCode || null,
    restaurantAddress: restaurant?.address || null,
    restaurantPhone: restaurant?.phone || null
  };

  await exports.sendEmail({
    to: email,
    subject: 'Your ZinR Dashboard is Ready! 🚀',
    template: 'dashboard-notification',
    context
  });
};

// Send payment confirmation invoice email
exports.sendPaymentConfirmationEmail = async (email, order, restaurant) => {
  const context = {
    orderNumber: order.orderNumber,
    restaurantName: restaurant.name,
    customerName: order.customer.name,
    customerEmail: order.customer.email || email,
    customerPhone: order.customer.phone,
    items: order.items,
    totalAmount: order.totalAmount,
    tableNumber: order.tableNumber,
    notes: order.notes,
    orderDate: new Date(order.createdAt).toLocaleDateString(),
    orderTime: new Date(order.createdAt).toLocaleTimeString(),
    paymentStatus: 'Paid',
    paymentMethod: order.paymentMethod,
    transactionId: order.paymentDetails?.transactionId,
    paidAt: order.paymentDetails?.paidAt ? new Date(order.paymentDetails.paidAt).toLocaleString() : null
  };

  await exports.sendEmail({
    to: email,
    subject: `Payment Confirmed - Invoice #${order.orderNumber}`,
    template: 'payment-confirmation',
    context
  });
};

// Resend invoice email (useful for manual resending)
exports.resendInvoiceEmail = async (email, order, restaurant) => {
  try {
    if (order.paymentStatus === 'paid') {
      await exports.sendPaymentConfirmationEmail(email, order, restaurant);
    } else {
      await exports.sendOrderConfirmationEmail(email, order, restaurant);
    }
    return { success: true, message: 'Invoice email resent successfully' };
  } catch (error) {
    return { success: false, message: 'Failed to resend invoice email', error: error.message };
  }
};

// Send test QR code email for debugging
exports.sendTestQREmail = async (email, restaurant) => {
  const context = {
    restaurantName: restaurant?.name || 'Test Restaurant',
    qrCodeDataUrl: restaurant?.qrCode || null
  };

  await exports.sendEmail({
    to: email,
    subject: '🧪 QR Code Test Email',
    template: 'test-qr',
    context
  });
};
