# Team Dhruvishaya - RSCOE Aerospace

## 🚀 Zero-Installation Deployment

### Option 1: Netlify (Recommended - 100% Web Interface)

1. **Go to [netlify.com](https://netlify.com)**
2. **Sign up/Login** (use GitHub)
3. **Click "Add new site" → "Import an existing project"**
4. **Connect your GitHub repo**
5. **Deploy settings**:
   - **Base directory**: (leave empty)
   - **Build command**: (leave empty - static site)
   - **Publish directory**: `public`
6. **Click "Deploy site"**
7. **Get your free `.netlify.app` URL instantly!**

### Option 2: Vercel (Also 100% Web Interface)

1. **Go to [vercel.com](https://vercel.com)**
2. **Sign up/Login** (use GitHub)
3. **Click "New Project"**
4. **Import your GitHub repo**
5. **Configure**:
   - **Framework Preset**: `Other`
   - **Root Directory**: (leave empty)
   - **Build Command**: (leave empty)
   - **Output Directory**: `public`
6. **Click "Deploy"**
7. **Get your free `.vercel.app` URL!**

## 📁 Project Structure

```
rocketry-club-website/
├── public/             # Static files (served directly)
│   ├── index.html      # Main page with falling animation
│   ├── css/style.css   # Styles with gravity animation
│   ├── js/script.js    # Interactions + Supabase form
│   └── assets/         # Images, videos
├── server.js           # Optional - for local development
├── package.json        # Dependencies
└── README.md           # This file
```

## 🎯 Why This Works

- **Form submissions** → Supabase (no server needed)
- **Static hosting** → Perfect for Netlify/Vercel
- **Falling animation** → CSS only, works everywhere
- **No installation** → Just connect GitHub repo

## 🧪 Test Locally (Optional)

```bash
# If you want to test locally:
npx serve public
# Visit http://localhost:3000
```

## ✨ Features

- ✅ Falling text animation on page load
- ✅ Responsive design
- ✅ Form submissions to Supabase
- ✅ Video background
- ✅ Custom cursor effects
- ✅ Scroll animations

**Choose Netlify or Vercel - both take 2 minutes to deploy!** 🎉
