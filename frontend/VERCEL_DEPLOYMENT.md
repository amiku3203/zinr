# 🌐 Vercel Deployment Guide for ZinR Frontend

## Prerequisites
- [Vercel Account](https://vercel.com)
- [GitHub Account](https://github.com)
- Backend deployed on Render (see `../backend/RENDER_DEPLOYMENT.md`)

## Step 1: Prepare Your Repository

1. **Ensure your backend is deployed on Render first**
   - Backend should be accessible at: `https://zinr-backend.onrender.com`
   - Test the health endpoint: `https://zinr-backend.onrender.com/api/health`

2. **Push your frontend code to GitHub**
   ```bash
   git add .
   git commit -m "Prepare for Vercel deployment"
   git push origin main
   ```

3. **Verify these files are in your repository:**
   - `vercel.json` ✅
   - `package.json` ✅
   - `vite.config.js` ✅
   - `env.production.template` ✅

## Step 2: Deploy on Vercel

### Option A: Using Vercel CLI (Recommended)

1. **Install Vercel CLI**
   ```bash
   npm i -g vercel
   ```

2. **Login to Vercel**
   ```bash
   vercel login
   ```

3. **Deploy from your project directory**
   ```bash
   cd frontend
   vercel --prod
   ```

4. **Follow the prompts:**
   - Set up and deploy: `Y`
   - Which scope: Select your account
   - Link to existing project: `N`
   - Project name: `zinr-frontend`
   - Directory: `./` (current directory)
   - Override settings: `N`

### Option B: Using Vercel Dashboard

1. **Go to [Vercel Dashboard](https://vercel.com/dashboard)**
2. **Click "New Project"**
3. **Import your GitHub repository**
4. **Configure the project:**
   - **Framework Preset**: Vite
   - **Root Directory**: `./` (or leave empty)
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
   - **Install Command**: `npm install`

## Step 3: Configure Environment Variables

In your Vercel project dashboard:

1. **Go to Settings → Environment Variables**
2. **Add these variables:**

### Production Environment:
```
VITE_API_URL=https://zinr-backend.onrender.com
VITE_FRONTEND_URL=https://zinr-frontend.vercel.app
VITE_APP_NAME=ZinR
VITE_APP_VERSION=1.0.0
VITE_ENABLE_ANALYTICS=true
VITE_ENABLE_DEBUG=false
```

### Preview Environment (optional):
```
VITE_API_URL=https://zinr-backend.onrender.com
VITE_FRONTEND_URL=https://zinr-frontend-git-preview-username.vercel.app
VITE_APP_NAME=ZinR (Preview)
VITE_APP_VERSION=1.0.0
VITE_ENABLE_ANALYTICS=false
VITE_ENABLE_DEBUG=true
```

## Step 4: Configure Build Settings

1. **Go to Settings → General**
2. **Verify these settings:**
   - **Framework Preset**: Vite
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
   - **Install Command**: `npm install`
   - **Node.js Version**: 18.x

## Step 5: Deploy and Test

1. **Trigger deployment**
   - Push to main branch (auto-deploy)
   - Or manually deploy from dashboard

2. **Monitor build process**
   - Check build logs for any errors
   - Ensure all dependencies install correctly

3. **Test your application**
   - Visit your Vercel URL
   - Test all major functionality
   - Verify API calls work correctly

## Step 6: Configure Custom Domain (Optional)

1. **Add custom domain in Vercel**
   - Go to Settings → Domains
   - Add your domain (e.g., `zinr.com`)

2. **Update DNS records**
   - Add CNAME record pointing to `cname.vercel-dns.com`
   - Or add A record if using apex domain

## Step 7: Update Backend CORS

After frontend deployment, update your backend CORS settings:

1. **Go to Render dashboard**
2. **Update environment variables:**
   ```
   FRONTEND_URL=https://zinr-frontend.vercel.app
   CORS_ORIGIN=https://zinr-frontend.vercel.app
   ```

3. **Redeploy backend** (if needed)

## Troubleshooting

### Common Issues:

#### 1. Build Failures
```bash
# Test build locally first
npm run build

# Check for missing dependencies
npm list --depth=0
```

#### 2. Environment Variables
- Ensure all VITE_* variables are set
- Check variable names match your code
- Verify API URL is correct

#### 3. API Connection Issues
```bash
# Test API endpoint
curl https://zinr-backend.onrender.com/api/health

# Check CORS configuration
curl -H "Origin: https://zinr-frontend.vercel.app" \
     -H "Access-Control-Request-Method: GET" \
     -H "Access-Control-Request-Headers: X-Requested-With" \
     -X OPTIONS \
     https://zinr-backend.onrender.com/api/health
```

#### 4. Routing Issues
- Ensure `vercel.json` has correct SPA routing
- Check that all routes redirect to `index.html`

### Debug Commands:
```bash
# Check environment variables in build
echo $VITE_API_URL

# Test API connection
curl $VITE_API_URL/api/health

# Verify build output
ls -la dist/
```

## Performance Optimization

### 1. Enable Vercel Analytics
- Go to Settings → Analytics
- Enable Web Analytics
- Monitor Core Web Vitals

### 2. Image Optimization
- Use Vercel's Image Optimization
- Implement lazy loading
- Use WebP format when possible

### 3. Code Splitting
- Implement React.lazy() for routes
- Use dynamic imports for heavy components
- Optimize bundle size

## Security Features

### 1. Security Headers
- Vercel automatically sets security headers
- Custom headers configured in `vercel.json`
- HTTPS enabled by default

### 2. Environment Variables
- Sensitive data stored securely
- Not exposed to client-side code
- Access controlled by Vercel

### 3. CORS Configuration
- Properly configured for production
- Only allows your backend domain
- Secure cross-origin requests

## Monitoring and Analytics

### 1. Vercel Analytics
- Real-time performance metrics
- Core Web Vitals tracking
- User experience insights

### 2. Error Monitoring
- Set up error tracking (Sentry, LogRocket)
- Monitor API failures
- Track user interactions

### 3. Performance Monitoring
- Lighthouse CI integration
- Bundle size monitoring
- Build time optimization

## Continuous Deployment

### 1. Auto-deploy from GitHub
- Push to main branch triggers deployment
- Preview deployments for pull requests
- Automatic rollback on failures

### 2. Branch Deployments
- Feature branch deployments
- Staging environment setup
- Production deployment workflow

## Support and Resources

- [Vercel Documentation](https://vercel.com/docs)
- [Vercel Community](https://github.com/vercel/vercel/discussions)
- [Vite Documentation](https://vitejs.dev)
- [React Documentation](https://react.dev)

---

## 🎉 **Your frontend is now deployed on Vercel!**

### Next Steps:
1. ✅ Backend deployed on Render
2. ✅ Frontend deployed on Vercel
3. 🔄 Test all functionality
4. 🔄 Configure custom domain (optional)
5. 🔄 Set up monitoring and analytics

### Your URLs:
- **Frontend**: `https://zinr-frontend.vercel.app`
- **Backend**: `https://zinr-backend.onrender.com`
- **API Health**: `https://zinr-backend.onrender.com/api/health`

### Testing Checklist:
- [ ] Homepage loads correctly
- [ ] User registration/login works
- [ ] Restaurant creation works
- [ ] QR code generation works
- [ ] Menu management works
- [ ] Order processing works
- [ ] Payment integration works
- [ ] Email notifications work
