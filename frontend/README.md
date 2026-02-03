# Kanoonu AI Frontend

Modern React + Tailwind CSS frontend for Kanoonu AI - India's Smart Legal Companion.

## 🚀 Quick Start

### Prerequisites

- Node.js 16+ and npm/yarn installed
- Flask backend running on `http://localhost:5000`

### Installation

1. Navigate to the frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

### Development

Start the development server:
```bash
npm run dev
```

The frontend will be available at `http://localhost:3000`

### Build for Production

```bash
npm run build
```

The built files will be in the `dist` directory.

## 📁 Project Structure

```
frontend/
├── src/
│   ├── components/      # Reusable components (Navbar, Footer)
│   ├── pages/          # Page components (Home, Chatbot, etc.)
│   ├── api.js          # API configuration and functions
│   ├── App.jsx         # Main app component with routing
│   ├── main.jsx        # Entry point
│   └── index.css       # Global styles and Tailwind imports
├── index.html          # HTML template
├── package.json        # Dependencies and scripts
├── vite.config.js     # Vite configuration
└── tailwind.config.js # Tailwind CSS configuration
```

## 🔌 API Connection

The frontend connects to the Flask backend at `http://localhost:5000`. Make sure:

1. The Flask backend is running
2. CORS is enabled (if needed - see backend setup)
3. API endpoints match:
   - `/ask` - Chat question endpoint
   - `/case-law-search` - Case law search endpoint
   - `/admin/login` - Admin authentication

## 🎨 Features

- **Landing Page**: Hero section, features, and contributors
- **Chatbot**: Full-screen chat interface with AI responses
- **Case Law Search**: Search Indian legal cases
- **Lawyers**: Browse and book consultations with lawyers
- **Admin Panel**: Manage lawyers database (requires login)

## 🛠️ Technologies

- **React 18** - UI framework
- **Vite** - Build tool and dev server
- **Tailwind CSS** - Utility-first CSS framework
- **React Router** - Client-side routing
- **Axios** - HTTP client
- **Lucide React** - Icon library

## 📝 Notes

- The frontend uses a proxy in Vite config for API calls during development
- For production, update the API base URL in `src/api.js`
- Admin login credentials: `admin` / `1234` (default)

