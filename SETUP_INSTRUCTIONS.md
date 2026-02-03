# 🚀 Kanoonu AI - React Frontend Setup Instructions

## Prerequisites

1. **Node.js & npm**: Install Node.js 16+ from [nodejs.org](https://nodejs.org/)
2. **Python & Flask Backend**: Ensure your Flask backend is set up and ready

## Step 1: Install Backend Dependencies

First, make sure you have the updated Flask backend with CORS support:

```bash
# Activate your virtual environment (if using one)
# Windows:
.\venv\Scripts\activate

# Install/update Flask CORS
pip install flask-cors>=4.0.0

# Or install all requirements
pip install -r requirements.txt
```

## Step 2: Install Frontend Dependencies

Navigate to the frontend directory and install dependencies:

```bash
cd frontend
npm install
```

This will install:
- React 18
- Vite (build tool)
- Tailwind CSS
- React Router
- Axios
- Lucide React (icons)

## Step 3: Start the Flask Backend

In the root directory (where `app.py` is located):

```bash
# Activate virtual environment (if using one)
# Windows:
.\venv\Scripts\activate

# Start Flask server
python app.py
```

The backend will run on `http://localhost:5000`

## Step 4: Start the React Frontend

In a **new terminal**, navigate to the frontend directory:

```bash
cd frontend
npm run dev
```

The frontend will run on `http://localhost:3000`

## Step 5: Access the Application

Open your browser and navigate to:
```
http://localhost:3000
```

## 📁 Project Structure

```
KnAi/
├── app.py                    # Flask backend
├── frontend/                 # React frontend
│   ├── src/
│   │   ├── components/      # Navbar, Footer
│   │   ├── pages/           # Home, Chatbot, CaseLawSearch, Lawyers, Admin
│   │   ├── api.js           # API configuration
│   │   ├── App.jsx          # Main app with routing
│   │   └── index.css        # Tailwind styles
│   ├── package.json
│   └── vite.config.js
└── requirements.txt
```

## 🎨 Features Implemented

✅ **Landing Page** (`/`)
- Hero section with CTA buttons
- Features section (Why Kanoonu AI)
- Contributors section

✅ **Chatbot Page** (`/chat`)
- Full-screen chat interface
- Real-time AI responses
- Loading indicators
- Smooth animations

✅ **Case Law Search** (`/case-law-search`)
- Search bar with results display
- Links to Indian Kanoon
- JSON API integration

✅ **Lawyers Page** (`/lawyers`)
- Grid of lawyer cards
- Book consultation modal
- Dummy data (ready for backend integration)

✅ **Admin Panel** (`/admin`)
- Login page (`/admin/login`)
- Dashboard to add/delete lawyers
- Form for managing lawyers

✅ **Navigation**
- Sticky top navbar
- Responsive hamburger menu
- Active route highlighting

## 🔧 Configuration

### API Base URL

The frontend is configured to connect to `http://localhost:5000`. To change this:

Edit `frontend/src/api.js`:
```javascript
const API_BASE_URL = 'http://your-backend-url:port';
```

### Admin Credentials

Default admin credentials:
- Username: `admin`
- Password: `1234`

(Change these in `app.py` for production!)

## 🐛 Troubleshooting

### CORS Errors

If you see CORS errors in the browser console:
1. Make sure `flask-cors` is installed: `pip install flask-cors`
2. Check that `app.py` has: `CORS(app, origins=['http://localhost:3000'], supports_credentials=True)`

### Port Already in Use

If port 3000 is already in use:
- Edit `frontend/vite.config.js` and change the port number
- Or kill the process using port 3000

### Backend Not Responding

1. Check Flask is running: `http://localhost:5000`
2. Verify Flask logs for errors
3. Check API endpoint URLs match in `frontend/src/api.js`

### Module Not Found Errors

In the frontend directory:
```bash
npm install
```

### Build for Production

```bash
cd frontend
npm run build
```

The `dist/` folder will contain the production build.

## 📝 Next Steps

1. **Connect Lawyers API**: Replace dummy data in `Lawyers.jsx` with actual API calls
2. **Admin API Integration**: Connect admin panel to backend lawyer management
3. **Authentication**: Add proper session management for admin
4. **Error Handling**: Enhance error messages and loading states
5. **Dark Mode**: Add dark mode toggle (Tailwind ready for this)

## 🎯 Tech Stack

- **Frontend**: React 18 + Vite
- **Styling**: Tailwind CSS
- **Icons**: Lucide React
- **Routing**: React Router v6
- **HTTP Client**: Axios
- **Backend**: Flask (Python)
- **Fonts**: Playfair Display (headings), Inter (body)

---


