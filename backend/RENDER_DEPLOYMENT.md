# 🚀 Render Deployment Guide for ZinR Backend

## Prerequisites
- [Render Account](https://render.com)
- [MongoDB Atlas Account](https://mongodb.com/atlas)
- [Razorpay Account](https://razorpay.com)
- [Gmail Account](https://gmail.com) (for SMTP)

## Step 1: Prepare Your Repository

1. **Push your code to GitHub**
   ```bash
   git add .
   git commit -m "Prepare for Render deployment"
   git push origin main
   ```

2. **Ensure these files are in your repository:**
   - `render.yaml` ✅
   - `package.json` ✅
   - `src/server.js` ✅
   - `.env.production.template` ✅

## Step 2: Deploy on Render

### Option A: Using render.yaml (Recommended)

1. **Connect your GitHub repository to Render**
   - Go to [Render Dashboard](https://dashboard.render.com)
   - Click "New +" → "Blueprint"
   - Connect your GitHub account
   - Select your repository

2. **Render will automatically detect render.yaml**
   - Click "Connect" to proceed
   - Review the configuration
   - Click "Apply" to deploy

### Option B: Manual Deployment

1. **Create a new Web Service**
   - Go to [Render Dashboard](https://dashboard.render.com)
   - Click "New +" → "Web Service"
   - Connect your GitHub repository

2. **Configure the service:**
   - **Name**: `zinr-backend`
   - **Environment**: `Node`
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
   - **Plan**: `Starter` (Free tier)

## Step 3: Configure Environment Variables

In your Render service dashboard, add these environment variables:

### Required Variables:
```
NODE_ENV=production
PORT=10000
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/zinr_production?retryWrites=true&w=majority
JWT_SECRET=your-super-secure-jwt-secret-key-here
RAZORPAY_KEY_ID=rzp_live_your_live_key_id
RAZORPAY_KEY_SECRET=your_live_razorpay_secret_key
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-specific-password
FRONTEND_URL=https://zinr-frontend.vercel.app
BACKEND_URL=https://zinr-backend.onrender.com
CORS_ORIGIN=https://zinr-frontend.vercel.app
LOG_LEVEL=info
```

### How to get these values:

#### MongoDB URI:
1. Go to [MongoDB Atlas](https://mongodb.com/atlas)
2. Create a new cluster
3. Click "Connect" → "Connect your application"
4. Copy the connection string
5. Replace `<password>` with your database password

#### JWT Secret:
```bash
# Generate a secure random string
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
```

#### Razorpay Credentials:
1. Go to [Razorpay Dashboard](https://dashboard.razorpay.com)
2. Navigate to Settings → API Keys
3. Generate new API keys
4. Use Live keys for production

#### SMTP Credentials (Gmail):
1. Enable 2-factor authentication on Gmail
2. Generate an App Password
3. Use your Gmail address and app password

## Step 4: Deploy and Test

1. **Click "Deploy"**
   - Render will build and deploy your service
   - This may take 5-10 minutes

2. **Check deployment status**
   - Monitor the build logs
   - Ensure all dependencies install correctly

3. **Test your API**
   ```bash
   # Test health endpoint
   curl https://zinr-backend.onrender.com/api/health
   
   # Expected response: {"status":"ok","message":"Server is running"}
   ```

## Step 5: Configure Custom Domain (Optional)

1. **Add custom domain in Render**
   - Go to your service settings
   - Click "Custom Domains"
   - Add your domain (e.g., `api.zinr.com`)

2. **Update DNS records**
   - Add CNAME record pointing to your Render service

## Troubleshooting

### Common Issues:

#### 1. Build Failures
```bash
# Check if all dependencies are in package.json
npm list --depth=0
```

#### 2. Environment Variables
- Ensure all required variables are set
- Check for typos in variable names
- Verify MongoDB connection string format

#### 3. Port Issues
- Render automatically sets PORT environment variable
- Don't hardcode port in your code

#### 4. CORS Errors
- Verify FRONTEND_URL is correct
- Check CORS_ORIGIN configuration

### Debug Commands:
```bash
# Check environment variables
echo $NODE_ENV
echo $MONGODB_URI

# Test database connection
node -e "
const mongoose = require('mongoose');
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('MongoDB connection error:', err));
"
```

## Performance Optimization

### 1. Enable Auto-Scaling
- Set minimum instances to 1
- Enable auto-scaling based on traffic

### 2. Database Optimization
- Use MongoDB Atlas M10+ for production
- Enable connection pooling
- Set appropriate indexes

### 3. Caching
- Implement Redis for session storage
- Use CDN for static assets

## Security Checklist

- [ ] JWT_SECRET is strong and unique
- [ ] MongoDB connection uses SSL
- [ ] CORS is properly configured
- [ ] Environment variables are secure
- [ ] HTTPS is enabled (automatic on Render)
- [ ] Rate limiting is implemented
- [ ] Input validation is in place

## Monitoring

### 1. Render Metrics
- Monitor CPU and memory usage
- Check response times
- Set up alerts for failures

### 2. Application Logs
- Use Winston for structured logging
- Monitor error rates
- Set up log aggregation

## Support

- [Render Documentation](https://render.com/docs)
- [Render Community](https://community.render.com)
- [MongoDB Atlas Support](https://support.mongodb.com)

---

**🎉 Your backend is now deployed on Render!**

Next step: Deploy your frontend on Vercel and update the FRONTEND_URL in your environment variables.
