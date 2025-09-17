# Deployment Guide - OrbWeb Studio

## 🚀 Deployment Options

### **1. Vercel (Recommended)**

#### **Setup Steps:**
1. **Connect Repository**
   ```bash
   # Install Vercel CLI
   npm i -g vercel
   
   # Login to Vercel
   vercel login
   
   # Deploy
   vercel
   ```

2. **Environment Variables**
   Set these in Vercel dashboard:
   ```
   VITE_SUPABASE_URL=your_supabase_url
   VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```

3. **Automatic Deployment**
   - Push to main branch = automatic deployment
   - Preview deployments for pull requests

#### **Configuration Files:**
- ✅ `vercel.json` - Routing configuration
- ✅ `public/_redirects` - Fallback routing

---

### **2. Netlify**

#### **Setup Steps:**
1. **Connect Repository**
   - Go to Netlify dashboard
   - Connect your GitHub repository
   - Set build command: `npm run build`
   - Set publish directory: `dist`

2. **Environment Variables**
   Set in Netlify dashboard:
   ```
   VITE_SUPABASE_URL=your_supabase_url
   VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```

3. **Build Settings**
   ```
   Build command: npm run build
   Publish directory: dist
   Node version: 18
   ```

#### **Configuration Files:**
- ✅ `public/_redirects` - SPA routing
- ✅ `netlify.toml` (optional)

---

### **3. GitHub Pages**

#### **Setup Steps:**
1. **Install gh-pages**
   ```bash
   npm install --save-dev gh-pages
   ```

2. **Add Scripts to package.json**
   ```json
   {
     "scripts": {
       "predeploy": "npm run build",
       "deploy": "gh-pages -d dist"
     }
   }
   ```

3. **Deploy**
   ```bash
   npm run deploy
   ```

#### **Configuration Files:**
- ✅ `public/.htaccess` - Apache routing
- ✅ Update `vite.config.ts` base path

---

### **4. Traditional Hosting (Apache/Nginx)**

#### **Apache Setup:**
1. **Upload Files**
   - Upload `dist` folder contents to web root
   - Ensure `.htaccess` is uploaded

2. **Configure .htaccess**
   ```apache
   Options -MultiViews
   RewriteEngine On
   RewriteCond %{REQUEST_FILENAME} !-f
   RewriteRule ^ index.html [QSA,L]
   ```

#### **Nginx Setup:**
1. **Upload Files**
   - Upload `dist` folder contents to web root

2. **Configure nginx.conf**
   ```nginx
   location / {
     try_files $uri $uri/ /index.html;
   }
   ```

---

## 🔧 Pre-Deployment Checklist

### **Environment Setup**
- [ ] Supabase project created
- [ ] Database tables created (run `database_setup.sql`)
- [ ] Environment variables configured
- [ ] Domain configured (if custom)

### **Build Testing**
- [ ] `npm run build` succeeds
- [ ] No TypeScript errors
- [ ] No linting errors
- [ ] All pages load correctly
- [ ] Admin panel accessible

### **SEO & Performance**
- [ ] Meta tags working
- [ ] Sitemap accessible
- [ ] Robots.txt accessible
- [ ] Images optimized
- [ ] Performance score > 90

---

## 🐛 Common Deployment Issues & Solutions

### **1. Admin Panel Error (404)**

#### **Problem:**
- `/admin` route returns 404 after deployment
- SPA routing not working

#### **Solutions:**
```bash
# For Vercel - ensure vercel.json exists
{
  "rewrites": [
    {
      "source": "/(.*)",
      "destination": "/index.html"
    }
  ]
}

# For Netlify - ensure _redirects exists
/*    /index.html   200

# For Apache - ensure .htaccess exists
Options -MultiViews
RewriteEngine On
RewriteCond %{REQUEST_FILENAME} !-f
RewriteRule ^ index.html [QSA,L]
```

### **2. Environment Variables Not Working**

#### **Problem:**
- Supabase connection fails
- API calls return errors

#### **Solutions:**
```bash
# Check environment variables are set
echo $VITE_SUPABASE_URL
echo $VITE_SUPABASE_ANON_KEY

# For Vercel
vercel env add VITE_SUPABASE_URL
vercel env add VITE_SUPABASE_ANON_KEY

# For Netlify
# Set in dashboard: Site Settings > Environment Variables
```

### **3. Build Failures**

#### **Problem:**
- Build process fails
- TypeScript errors

#### **Solutions:**
```bash
# Clear cache and reinstall
rm -rf node_modules package-lock.json
npm install

# Check for TypeScript errors
npm run build

# Fix any linting issues
npm run lint
```

### **4. Database Connection Issues**

#### **Problem:**
- Cannot connect to Supabase
- RLS policies blocking access

#### **Solutions:**
```sql
-- Check RLS policies
SELECT * FROM pg_policies WHERE tablename = 'your_table';

-- Grant permissions
GRANT ALL ON public.your_table TO anon, authenticated;

-- Test connection
SELECT 1;
```

---

## 📊 Post-Deployment Verification

### **1. Basic Functionality**
- [ ] Home page loads
- [ ] All navigation links work
- [ ] Contact form submits
- [ ] Admin panel accessible
- [ ] Database operations work

### **2. SEO Verification**
- [ ] Meta tags present
- [ ] Sitemap accessible: `/sitemap.xml`
- [ ] Robots.txt accessible: `/robots.txt`
- [ ] Open Graph tags working
- [ ] Structured data valid

### **3. Performance Check**
- [ ] Page load speed < 3 seconds
- [ ] Mobile responsive
- [ ] Images optimized
- [ ] No console errors
- [ ] Lighthouse score > 90

### **4. Security Check**
- [ ] HTTPS enabled
- [ ] No sensitive data exposed
- [ ] Admin panel protected
- [ ] CORS configured correctly

---

## 🔍 Monitoring & Maintenance

### **1. Analytics Setup**
```javascript
// Google Analytics (optional)
// Add to index.html
<script async src="https://www.googletagmanager.com/gtag/js?id=GA_MEASUREMENT_ID"></script>
```

### **2. Error Monitoring**
```javascript
// Sentry (optional)
import * as Sentry from "@sentry/react";

Sentry.init({
  dsn: "YOUR_SENTRY_DSN",
});
```

### **3. Performance Monitoring**
- **Google PageSpeed Insights**
- **WebPageTest**
- **Lighthouse CI**

### **4. Regular Maintenance**
- [ ] Update dependencies monthly
- [ ] Monitor error logs
- [ ] Check performance metrics
- [ ] Backup database regularly
- [ ] Update content regularly

---

## 🚨 Emergency Procedures

### **1. Rollback Deployment**
```bash
# Vercel
vercel rollback [deployment-url]

# Netlify
# Go to Deploys tab > Click on previous deployment > Publish

# GitHub Pages
git revert [commit-hash]
npm run deploy
```

### **2. Database Issues**
```sql
-- Check connection
SELECT 1;

-- Check tables
\dt

-- Check RLS
SELECT * FROM pg_policies;
```

### **3. Performance Issues**
```bash
# Check bundle size
npm run build
ls -la dist/assets/

# Analyze bundle
npx vite-bundle-analyzer dist
```

---

## 📞 Support & Resources

### **Documentation**
- [Vite Deployment Guide](https://vitejs.dev/guide/static-deploy.html)
- [Vercel Documentation](https://vercel.com/docs)
- [Netlify Documentation](https://docs.netlify.com/)
- [Supabase Documentation](https://supabase.com/docs)

### **Community**
- [Vite Discord](https://chat.vitejs.dev/)
- [React Community](https://reactjs.org/community/support.html)
- [Supabase Discord](https://discord.supabase.com/)

---

**Website OrbWeb Studio siap untuk deployment! 🚀**