# 🍽️ Zinr - Restaurant Management System

A comprehensive restaurant management platform that enables restaurant owners to create digital menus, manage orders, and handle subscriptions with integrated payment processing.

## ✨ Features

### 🏪 Restaurant Management
- **Restaurant Creation**: Set up your restaurant profile with name, address, and contact details
- **QR Code Generation**: Automatic QR code generation for each restaurant
- **Email Notifications**: QR codes sent directly to restaurant owner's email
- **Menu Management**: Create categories and menu items with prices and descriptions

### 📱 Customer Ordering System
- **Digital Menu**: Customers scan QR codes to access your menu
- **Order Placement**: Easy-to-use interface for placing orders
- **Real-time Updates**: Track order status from pending to completion
- **Special Instructions**: Support for custom order notes and requests

### 💳 Subscription Management
- **Service Plans**: Choose from Basic, Premium, or Enterprise plans
- **Razorpay Integration**: Secure payment processing for subscriptions
- **Plan Features**: Different limits for orders, menu items, and support levels
- **Auto-renewal**: Optional automatic subscription renewal

### 📊 Analytics Dashboard
- **Order Statistics**: Track orders by status and time period
- **Revenue Analytics**: Monitor total revenue and average order values
- **Performance Insights**: Visual charts and metrics for business growth
- **Real-time Data**: Live updates on restaurant performance

### 🔧 Order Management
- **Status Tracking**: Manage orders through the complete lifecycle
- **Customer Information**: Store customer details and preferences
- **Payment Status**: Track payment completion and methods
- **Estimated Times**: Set and communicate order preparation times

## 🚀 Tech Stack

### Backend
- **Node.js** with Express.js framework
- **MongoDB** with Mongoose ODM
- **JWT** authentication
- **Nodemailer** for email services
- **QRCode** generation
- **Razorpay** payment integration
- **Winston** logging

### Frontend
- **React 19** with modern hooks
- **Redux Toolkit** for state management
- **Tailwind CSS** for responsive design
- **Framer Motion** for animations
- **Lucide React** for icons
- **React Router** for navigation

## 📋 Prerequisites

- Node.js (v18 or higher)
- MongoDB
- Razorpay account
- SMTP email service

## 🛠️ Installation

### 1. Clone the repository
```bash
git clone <repository-url>
cd zinr
```

### 2. Install backend dependencies
```bash
cd backend
npm install
```

### 3. Install frontend dependencies
```bash
cd ../frontend
npm install
```

### 4. Environment Configuration

Create `.env` files in both backend and frontend directories:

#### Backend (.env)
```env
NODE_ENV=development
PORT=5000
MONGODB_URI=mongodb://localhost:27017/zinr
JWT_SECRET=your_jwt_secret_here
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your_email@gmail.com
SMTP_PASS=your_app_password
RAZORPAY_KEY_ID=your_razorpay_key_id
RAZORPAY_KEY_SECRET=your_razorpay_secret
FRONTEND_URL=http://localhost:5173
```

#### Frontend (.env)
```env
REACT_APP_RAZORPAY_KEY_ID=your_razorpay_key_id
```

### 5. Start the development servers

#### Backend
```bash
cd backend
npm run dev
```

#### Frontend
```bash
cd frontend
npm run dev
```

## 🌐 API Endpoints

### Authentication
- `POST /api/v1/auth/register` - User registration
- `POST /api/v1/auth/login` - User login
- `POST /api/v1/auth/verify-email` - Email verification

### Restaurants
- `POST /api/v1/restaurants` - Create restaurant
- `GET /api/v1/restaurants/me` - Get user's restaurant
- `PUT /api/v1/restaurants` - Update restaurant
- `DELETE /api/v1/restaurants` - Delete restaurant
- `GET /api/v1/restaurants/:id/public` - Public restaurant data

### Categories
- `POST /api/v1/categories` - Create category
- `GET /api/v1/categories` - Get restaurant categories
- `PUT /api/v1/categories/:id` - Update category
- `DELETE /api/v1/categories/:id` - Delete category

### Menu Items
- `POST /api/v1/items` - Create menu item
- `GET /api/v1/items` - Get category items
- `PUT /api/v1/items/:id` - Update menu item
- `DELETE /api/v1/items/:id` - Delete menu item

### Orders
- `POST /api/v1/orders` - Create order (public)
- `GET /api/v1/orders/restaurant/:id` - Get restaurant orders
- `GET /api/v1/orders/:id` - Get order details
- `PATCH /api/v1/orders/:id/status` - Update order status
- `GET /api/v1/orders/number/:number` - Get order by number
- `GET /api/v1/orders/stats/:id` - Get order statistics

### Subscriptions
- `GET /api/v1/subscriptions/plans` - Get available plans
- `POST /api/v1/subscriptions/create-order` - Create subscription
- `POST /api/v1/subscriptions/verify-payment` - Verify payment
- `GET /api/v1/subscriptions/restaurant/:id` - Get restaurant subscription
- `PATCH /api/v1/subscriptions/:id/cancel` - Cancel subscription

## 📱 Usage

### For Restaurant Owners

1. **Sign Up & Login**: Create an account and log in to the dashboard
2. **Create Restaurant**: Set up your restaurant profile
3. **Manage Menu**: Add categories and menu items
4. **View Orders**: Monitor incoming orders in real-time
5. **Update Status**: Track orders from pending to completion
6. **Subscribe to Plans**: Choose a service plan that fits your needs
7. **View Analytics**: Monitor performance and growth metrics

### For Customers

1. **Scan QR Code**: Use your phone to scan the restaurant's QR code
2. **Browse Menu**: View categories and menu items with prices
3. **Add to Cart**: Select items and quantities
4. **Place Order**: Fill in your details and submit the order
5. **Track Status**: Monitor your order progress
6. **Receive Updates**: Get notifications when your order is ready

## 🎨 UI/UX Features

- **Responsive Design**: Works perfectly on desktop, tablet, and mobile
- **Dark Theme**: Modern dashboard with dark mode aesthetics
- **Smooth Animations**: Framer Motion powered transitions
- **Interactive Elements**: Hover effects and micro-interactions
- **Mobile-First**: Optimized for mobile restaurant management
- **Accessibility**: Keyboard navigation and screen reader support

## 🔒 Security Features

- **JWT Authentication**: Secure token-based authentication
- **Password Hashing**: Bcrypt encryption for user passwords
- **Input Validation**: Joi schema validation for all inputs
- **CORS Protection**: Cross-origin resource sharing security
- **Helmet Security**: HTTP header security middleware
- **Rate Limiting**: API request throttling

## 📧 Email Features

- **Order Confirmations**: Automatic order confirmation emails
- **QR Code Delivery**: Restaurant QR codes sent via email
- **Professional Templates**: Beautiful HTML email templates
- **SMTP Integration**: Reliable email delivery

## 💳 Payment Integration

- **Razorpay**: Secure payment gateway integration
- **Multiple Plans**: Basic, Premium, and Enterprise subscriptions
- **Secure Processing**: PCI DSS compliant payment handling
- **Payment Verification**: Cryptographic signature verification

## 🚀 Deployment

### Backend Deployment
```bash
cd backend
npm run build
npm start
```

### Frontend Deployment
```bash
cd frontend
npm run build
# Deploy the dist folder to your hosting service
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the ISC License.

## 🆘 Support

For support and questions:
- Create an issue in the repository
- Contact the development team
- Check the documentation

## 🔮 Future Enhancements

- **Real-time Notifications**: WebSocket integration for live updates
- **Inventory Management**: Stock tracking and low stock alerts
- **Customer Reviews**: Rating and feedback system
- **Loyalty Program**: Customer rewards and points system
- **Multi-language Support**: Internationalization
- **Advanced Analytics**: Machine learning insights
- **Mobile Apps**: Native iOS and Android applications

---

**Built with ❤️ for the restaurant industry**
