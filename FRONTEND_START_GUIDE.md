# Frontend Startup Guide

## Quick Start

1. **Navigate to Frontend Directory**:
   ```powershell
   cd frontend
   ```

2. **Install Dependencies** (First time only):
   ```powershell
   npm install
   ```

3. **Start Development Server**:
   ```powershell
   npm run dev
   ```

## What to Expect

### Normal Startup Flow:
1. ⏳ Vite starts building (2-5 seconds)
2. 🚀 **Dev server starts** on http://localhost:5173
3. ✅ Hot Module Replacement (HMR) enabled
4. 🔥 Changes reflect instantly in browser

### Important Notes:

- **React + Vite** - Modern, fast development experience
- **Port 5173** is default (can be changed in vite.config.js)
- Backend must be running on **port 5000** for API calls to work
- Auto-refreshes when you save files (Hot Reload)

## Prerequisites

### Required:
- **Node.js 16+** (Check with `node --version`)
- **npm** (comes with Node.js)

### Verify Installation:
```powershell
node --version    # Should be 16.x or higher
npm --version     # Should be 8.x or higher
```

## Available Commands

### Development:
```powershell
npm run dev       # Start dev server (http://localhost:5173)
```

### Production:
```powershell
npm run build     # Build for production (creates dist/ folder)
npm run preview   # Preview production build locally
```

## Troubleshooting

### If Dependencies Fail to Install:

1. **Clear npm cache**:
   ```powershell
   npm cache clean --force
   ```

2. **Delete node_modules and reinstall**:
   ```powershell
   Remove-Item -Recurse -Force node_modules
   Remove-Item package-lock.json
   npm install
   ```

3. **Check Node version**: 
   - Must be Node.js 16 or higher
   - Update Node.js if needed from https://nodejs.org

### If Dev Server Doesn't Start:

1. **Check Port 5173**: 
   ```powershell
   netstat -ano | findstr :5173
   ```
   - Kill process if port is in use

2. **Check vite.config.js**:
   - Ensure proxy settings point to http://localhost:5000

3. **Firewall/Antivirus**: 
   - May block local development server
   - Add exception for Node.js

### If Backend APIs Don't Work:

1. **Backend Running?**
   - Ensure Flask server is running on port 5000
   - Check http://localhost:5000/health

2. **CORS Errors?**
   - Backend must have CORS enabled for http://localhost:5173
   - Check app.py CORS configuration

3. **Check Network Tab**:
   - Open Browser DevTools (F12)
   - Go to Network tab
   - See if API calls are reaching backend

## Expected Output

```
  VITE v7.2.0  ready in 234 ms

  ➜  Local:   http://localhost:5173/
  ➜  Network: use --host to expose
  ➜  press h + enter to show help
```

## Project Structure

```
frontend/
├── src/
│   ├── main.jsx          # Entry point
│   ├── App.jsx           # Main app component
│   ├── api.js            # API calls to backend
│   ├── components/       # Reusable components
│   ├── pages/            # Page components
│   ├── contexts/         # React contexts
│   ├── hooks/            # Custom hooks
│   └── data/             # Static data
├── public/               # Static assets
├── index.html            # HTML template
├── package.json          # Dependencies
├── vite.config.js        # Vite configuration
└── tailwind.config.js    # Tailwind CSS config
```

## Technology Stack

- **React 18** - UI library
- **Vite** - Build tool (faster than Webpack)
- **React Router** - Navigation
- **Axios** - HTTP requests to backend
- **Tailwind CSS** - Utility-first CSS
- **Framer Motion** - Animations
- **Lucide React** - Icon library

## Development Tips

### Hot Reload:
- Save any file in `src/` → Browser updates instantly
- No need to manually refresh

### API Configuration:
- Backend URL configured in `src/api.js`
- Default: http://localhost:5000

### Styling:
- Uses Tailwind CSS utility classes
- Custom styles in `src/index.css`

### Adding Dependencies:
```powershell
npm install <package-name>
```

## Production Deployment

### Build for Production:
```powershell
npm run build
```

Creates optimized files in `dist/` folder:
- Minified JavaScript
- Optimized CSS
- Compressed assets

### Deploy `dist/` to:
- Netlify
- Vercel
- GitHub Pages
- Any static hosting service

## Backend Integration

Ensure backend is running before starting frontend:

1. **Terminal 1** (Backend):
   ```powershell
   cd c:\Users\TEJAS GOWDA\Desktop\KANOONU AI\1 COMPLETE ZIP KANOONU AI\final project\Kai
   python app.py
   ```

2. **Terminal 2** (Frontend):
   ```powershell
   cd c:\Users\TEJAS GOWDA\Desktop\KANOONU AI\1 COMPLETE ZIP KANOONU AI\final project\Kai\frontend
   npm run dev
   ```

3. **Access Application**:
   - Frontend: http://localhost:5173
   - Backend: http://localhost:5000

## Common Issues

### "Module not found" errors:
→ Run `npm install` again

### Blank white page:
→ Check browser console (F12) for errors

### API calls failing:
→ Ensure backend is running on port 5000

### Slow performance:
→ Clear browser cache and restart dev server

---

**Need help?** Check:
- Browser DevTools Console (F12)
- Terminal output for Vite errors
- Backend logs for API issues
