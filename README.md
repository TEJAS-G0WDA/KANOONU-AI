<div align="center">

# ⚖️ Kanoonu AI 🏛️

### *Your AI-Powered Legal Companion for Indian Law*

[![Python](https://img.shields.io/badge/Python-3.10+-3776AB?style=for-the-badge&logo=python&logoColor=white)](https://www.python.org/)
[![React](https://img.shields.io/badge/React-18-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://reactjs.org/)
[![Flask](https://img.shields.io/badge/Flask-2.3+-000000?style=for-the-badge&logo=flask&logoColor=white)](https://flask.palletsprojects.com/)
[![PyTorch](https://img.shields.io/badge/PyTorch-Latest-EE4C2C?style=for-the-badge&logo=pytorch&logoColor=white)](https://pytorch.org/)
[![License](https://img.shields.io/badge/License-MIT-yellow?style=for-the-badge)](LICENSE)

**A comprehensive legal assistance platform powered by AI, providing instant legal advice, case law search, and more - all trained on Indian law.**

[Features](#-features) • [Installation](#-installation--setup) • [Usage](#-usage-guide)
</div>

---

## ✨ Features

<table>
<tr>
<td width="50%">

### 🤖 AI-Powered Features
- **AI Legal Chatbot** - Instant legal advice powered by Gemma-2-2B Indian Law model
- **Case Law Search** - AI-powered case analysis and insights
- **Smart Voice Assistant** - Speech-to-text and text-to-speech
- **GPU Acceleration** - Optimized for RTX 3050+ GPUs

</td>
<td width="50%">

### 📚 Legal Resources
- **Document Templates** - Ready-to-use legal document templates
- **Video Tutorials** - Step-by-step legal procedure guides
- **Lawyer Directory** - Connect with qualified legal professionals
- **Admin Dashboard** - Complete content management system

</td>
</tr>
<tr>
<td colspan="2">

### 🌐 User Experience
- **Multilingual Support** - Full support for English & Kannada
- **Responsive Design** - Works seamlessly on desktop and mobile
- **Real-time Updates** - Instant responses and hot reload during development

</td>
</tr>
</table>

---

## 🛠️ Tech Stack

<div align="center">

| Category | Technologies |
|----------|-------------|
| **Backend** | ![Python](https://img.shields.io/badge/-Python-3776AB?logo=python&logoColor=white) ![Flask](https://img.shields.io/badge/-Flask-000000?logo=flask&logoColor=white) ![PyTorch](https://img.shields.io/badge/-PyTorch-EE4C2C?logo=pytorch&logoColor=white) |
| **Frontend** | ![React](https://img.shields.io/badge/-React-61DAFB?logo=react&logoColor=black) ![Vite](https://img.shields.io/badge/-Vite-646CFF?logo=vite&logoColor=white) ![TailwindCSS](https://img.shields.io/badge/-Tailwind-06B6D4?logo=tailwindcss&logoColor=white) |
| **AI/ML** | ![HuggingFace](https://img.shields.io/badge/-HuggingFace-FFD21E?logo=huggingface&logoColor=black) Gemma-2-2B-Indian-Law Model |
| **Tools** | ![Git](https://img.shields.io/badge/-Git-F05032?logo=git&logoColor=white) ![npm](https://img.shields.io/badge/-npm-CB3837?logo=npm&logoColor=white) |

</div>

### Backend Stack
- **Framework**: Python 3.10+, Flask
- **AI Model**: Gemma-2-2B-Indian-Law (Hugging Face Transformers)
- **Libraries**: PyTorch, Accelerate, Flask-CORS, BeautifulSoup4
- **Device Support**: CPU / CUDA GPU (NVIDIA)

### Frontend Stack
- **Framework**: React 18 with Vite
- **Styling**: Tailwind CSS, Framer Motion
- **Icons**: Lucide React
- **Routing**: React Router DOM v6
- **HTTP Client**: Axios

## 📋 Prerequisites

Before you begin, ensure you have the following installed:

| Requirement | Version | Required | Notes |
|------------|---------|----------|-------|
| **Python** | 3.10.11+ | ✅ Yes | Core backend runtime |
| **Node.js** | 16+ | ✅ Yes | Frontend development |
| **npm** | 8+ | ✅ Yes | Comes with Node.js |
| **Git** | Latest | ✅ Yes | Version control |
| **RAM** | 4GB+ | ✅ Yes | For AI model loading |
| **CUDA GPU** | RTX 3050+ | ⚠️ Optional | Faster AI inference |

> **💡 Tip**: Use `python --version` and `node --version` to check your installed versions.


## 🚀 Installation & Setup

### 1️⃣ Clone the Repository

```bash
git clone https://github.com/TEJAS-G0WDA/KANOONU-AI.git
cd kanoonu-ai
```

---

### 2️⃣ Backend Setup

<details>
<summary><b>📦 Step 1: Create Virtual Environment</b></summary>

**Windows (PowerShell):**
```powershell
python -m venv venv
.\venv\Scripts\activate
```

**Linux/Mac:**
```bash
python -m venv venv
source venv/bin/activate
```

</details>

<details>
<summary><b>📥 Step 2: Install Python Dependencies</b></summary>

```bash
pip install -r requirements.txt
```

</details>

<details>
<summary><b>⚡ Step 3: (Optional) Install CUDA PyTorch for GPU Acceleration</b></summary>

If you have an NVIDIA GPU with CUDA support:

```bash
# For CUDA 12.1 (RTX 30/40 series)
pip install --upgrade torch torchvision torchaudio --index-url https://download.pytorch.org/whl/cu121

# For CUDA 11.8 (Older GPUs)
pip install --upgrade torch torchvision torchaudio --index-url https://download.pytorch.org/whl/cu118
```

**Verify GPU Setup:**
```python
import torch
print(torch.cuda.is_available())  # Should return True
```

</details>

<details>
<summary><b>🤖 Step 4: Download AI Model (IMPORTANT!)</b></summary>

> **⚠️ CRITICAL STEP**: The AI model is **NOT included** in the repository due to its large size (~5GB).

#### Option A: Automatic Download (Recommended)
The model will **automatically download** from Hugging Face on first run:

```bash
python app.py
```

The model will be saved to `./model/gemma2-indian-law/` for future use.

#### Option B: Manual Download

1. **Install Hugging Face CLI:**
   ```bash
   pip install huggingface-hub
   ```

2. **Login to Hugging Face** (optional, for gated models):
   ```bash
   huggingface-cli login
   ```

3. **Download the model:**
   ```bash
   huggingface-cli download Ananya8154/Gemma-2-2B-Indian-Law --local-dir ./model/gemma2-indian-law
   ```

4. **Verify download:**
   ```bash
   # Check if config.json exists
   ls ./model/gemma2-indian-law/config.json
   ```

#### Expected Model Structure:
```
model/
└── gemma2-indian-law/
    ├── config.json
    ├── model.safetensors
    ├── tokenizer.json
    ├── tokenizer_config.json
    └── ... (other model files)
```

> **📝 Note**: First download takes 10-15 minutes depending on your internet speed. The model is approximately **5GB** in size.

</details>

---

### 3️⃣ Frontend Setup

<details>
<summary><b>📂 Step 1: Navigate to Frontend Directory</b></summary>

```bash
cd frontend
```

</details>

<details>
<summary><b>📦 Step 2: Install Node Dependencies</b></summary>

```bash
npm install
```

This installs:
- ⚛️ React & React DOM
- ⚡ Vite (build tool)
- 🎨 Tailwind CSS
- 🧭 React Router DOM
- 📡 Axios
- 🎯 Lucide React (icons)
- 🎬 Framer Motion (animations)

</details>

---

## ▶️ Running the Application

> **⚡ Quick Start**: Run both backend and frontend in separate terminals.

### 🔷 Terminal 1: Start Backend Server

```powershell
# Navigate to project root
cd kanoonu-ai

# Activate virtual environment
.\venv\Scripts\activate  # Windows
# source venv/bin/activate  # Linux/Mac

# Start Flask backend
python app.py
```

**✅ Expected Output:**
```
============================================================
🚀 Starting Kanoonu AI Server...
============================================================
✅ Tokenizer loaded successfully
⏳ Loading model checkpoint shards...
💡 Tip: Server will start immediately. Model loading continues in background.
🌐 Server starting on http://127.0.0.1:5000
============================================================
 * Running on http://127.0.0.1:5000
```

**What Happens:**
- ✅ Server starts **immediately** on `http://localhost:5000`
- 📦 AI model loads in background (5-10 min on CPU, 1-2 min on GPU)
- 🚀 API endpoints available while model loads
- ⏳ AI features work once model loading completes

---

### 🔶 Terminal 2: Start Frontend Development Server

```powershell
# Open a new terminal
cd kanoonu-ai/frontend

# Start Vite dev server
npm run dev
```

**✅ Expected Output:**
```
  VITE v7.2.0  ready in 234 ms

  ➜  Local:   http://localhost:5173/
  ➜  Network: use --host to expose
  ➜  press h + enter to show help
```

---

### 🌐 Access the Application

<div align="center">

| Service | URL | Description |
|---------|-----|-------------|
| **Frontend** | http://localhost:5173 | Main application |
| **Backend API** | http://localhost:5000 | Flask REST API |
| **Health Check** | http://localhost:5000/health | Server status & model info |

</div>

> **💡 Pro Tip**: Bookmark the health check endpoint to monitor AI model loading status!

## 🔍 Health Check & Monitoring

To check if the backend and AI model are ready:

```bash
curl http://localhost:5000/health
```

**Sample Response:**
```json
{
  "status": "healthy",
  "model_loaded": true,
  "model_loading": false,
  "device": "cuda",
  "model_error": null,
  "timestamp": "2026-02-03T10:30:00Z"
}
```

**Field Descriptions:**
- `model_loaded`: **true** = AI ready | **false** = Still loading
- `model_loading`: Currently loading the model?
- `device`: **cuda** = GPU | **cpu** = CPU
- `model_error`: Error message if model failed to load

---

## 📁 Project Structure

```
kanoonu-ai/
├── 📄 app.py                          # Flask backend server (main entry point)
├── 📄 requirements.txt                # Python dependencies
├── 📖 README.md                       # This file
├── 📖 BACKEND_START_GUIDE.md          # Backend troubleshooting guide
├── 📖 FRONTEND_START_GUIDE.md         # Frontend setup & troubleshooting
├── 📖 SETUP_INSTRUCTIONS.md           # Detailed installation guide
│
├── 📂 features/                       # Backend features & utilities
│   └── case_scraper.py               # Case law web scraping module
│
├── 📂 frontend/                       # ⚛️ React frontend application
│   ├── 📂 src/
│   │   ├── 📂 components/            # Reusable React components
│   │   │   ├── Navbar.jsx           # Navigation bar
│   │   │   └── Footer.jsx           # Footer component
│   │   ├── 📂 pages/                 # Page components (routes)
│   │   │   ├── Home.jsx             # Landing page
│   │   │   ├── Chatbot.jsx          # AI chatbot interface
│   │   │   ├── AILawyer.jsx         # AI lawyer consultation
│   │   │   ├── CaseLawSearch.jsx    # Legal case search
│   │   │   ├── DocumentTemplates.jsx # Document templates
│   │   │   ├── VideoTutorials.jsx   # Video tutorial library
│   │   │   ├── Lawyers.jsx          # Lawyer directory
│   │   │   ├── Admin.jsx            # Admin dashboard
│   │   │   └── AdminLogin.jsx       # Admin authentication
│   │   ├── 📂 contexts/
│   │   │   └── LanguageContext.jsx  # i18n language switching
│   │   ├── 📂 hooks/
│   │   │   └── useSpeechAssistant.js # Voice interaction hook
│   │   ├── 📂 data/
│   │   │   └── legalGlossary.js     # Legal terms dictionary
│   │   ├── api.js                   # API client configuration
│   │   ├── App.jsx                  # Main app component
│   │   ├── main.jsx                 # React entry point
│   │   └── index.css                # Global styles
│   ├── 📂 public/                    # Static assets (images, icons)
│   ├── package.json                  # Node.js dependencies
│   ├── vite.config.js               # Vite bundler config
│   └── tailwind.config.js           # Tailwind CSS config
│
├── 📂 model/                          # 🤖 AI model directory
│   └── gemma2-indian-law/            # ⚠️ Download separately (see setup)
│       ├── config.json
│       ├── model.safetensors
│       ├── tokenizer.json
│       └── ... (other model files)
│
├── 📂 templates/                      # Legacy HTML templates (optional)
├── 📂 static/                         # Legacy static files (optional)
└── 📂 uploads/                        # User file uploads directory
```

> **🔴 Important**: The `model/gemma2-indian-law/` directory is **NOT included** in the repository. Follow [Step 4 of Backend Setup](#2️⃣-backend-setup) to download the AI model.

---

## 💡 Usage Guide

### 👤 For Users:

| Feature | Description | How to Access |
|---------|-------------|---------------|
| 🤖 **Chat with AI** | Ask legal questions in plain English/Kannada | Navigate to "AI Lawyer" or "Chatbot" |
| 🔍 **Search Cases** | Find relevant legal precedents | Use "Case Law Search" page |
| 📄 **Access Templates** | Download legal document templates | Visit "Document Templates" |
| 📹 **Watch Tutorials** | Learn legal procedures step-by-step | Go to "Video Tutorials" |
| 👨‍⚖️ **Find Lawyers** | Connect with legal professionals | Browse "Lawyer Directory" |

### 🔐 For Admins:

1. **Login** - Access admin panel at `http://localhost:5173/admin-login`
2. **Default Credentials**:
   - Username: `admin`
   - Password: `1234`
   - ⚠️ **Change these in production!**
3. **Admin Features**:
   - 👨‍⚖️ Manage lawyer profiles
   - 📄 Upload/update document templates
   - 📹 Add/update video tutorials
   - 📊 View system analytics

---

## 🐛 Troubleshooting

<details>
<summary><b>🔴 Backend Issues</b></summary>

### ❌ Port 5000 Already in Use

**Check what's using the port:**
```powershell
netstat -ano | findstr :5000
```

**Kill the process (Windows):**
```powershell
taskkill /PID <PID> /F
```

**Kill the process (Linux/Mac):**
```bash
kill -9 <PID>
```

---

### ⏳ Model Loading Hangs or Takes Too Long

**Possible Causes:**
- ❌ Insufficient RAM (needs 4GB+ free)
- ❌ Model files corrupted
- ❌ Slow internet (if downloading)

**Solutions:**
1. **Check available RAM:**
   - Close unnecessary applications
   - Open Task Manager (Ctrl+Shift+Esc) to monitor RAM

2. **Clear and re-download model:**
   ```bash
   # Delete model directory
   Remove-Item -Recurse model/gemma2-indian-law
   
   # Restart server (will auto-download)
   python app.py
   ```

3. **Check model files:**
   ```bash
   # Verify config.json exists
   ls model/gemma2-indian-law/config.json
   ```

---

### 📦 Dependency Installation Errors

```bash
# Upgrade pip first
python -m pip install --upgrade pip

# Reinstall requirements
pip install --upgrade -r requirements.txt
```

---

### 🚫 CUDA/GPU Not Detected

**Verify CUDA installation:**
```python
import torch
print(torch.cuda.is_available())  # Should return True
print(torch.cuda.get_device_name(0))  # Your GPU name
```

**If False, reinstall PyTorch with CUDA:**
```bash
pip uninstall torch torchvision torchaudio
pip install torch torchvision torchaudio --index-url https://download.pytorch.org/whl/cu121
```

</details>

<details>
<summary><b>🔵 Frontend Issues</b></summary>

### ❌ Port 5173 Already in Use

**Edit** `vite.config.js` to use a different port:
```javascript
export default {
  server: {
    port: 3001 // Change port number
  }
}
```

Or kill the process:
```powershell
# Windows
netstat -ano | findstr :5173
taskkill /PID <PID> /F
```

---

### 📦 npm Install Fails

```bash
# Clear npm cache
npm cache clean --force

# Delete node_modules and reinstall
Remove-Item -Recurse -Force node_modules
Remove-Item package-lock.json
npm install
```

---

### 🌐 API Connection Errors / CORS Issues

**Symptoms:**
- Console shows CORS errors
- API calls fail with 404/500 errors

**Solutions:**
1. **Ensure backend is running** on port 5000
2. **Check API endpoint** in `frontend/src/api.js`:
   ```javascript
   const API_URL = 'http://localhost:5000';
   ```
3. **Verify CORS config** in `app.py`:
   ```python
   CORS(app, origins=['http://localhost:5173'], supports_credentials=True)
   ```

---

### 🖥️ Blank White Page

1. **Open Browser Console** (F12)
2. **Check for errors** in Console tab
3. **Check Network tab** for failed requests
4. **Clear browser cache** and hard reload (Ctrl+Shift+R)

</details>

<details>
<summary><b>🟡 General Issues</b></summary>

### 📚 Where are the logs?

**Backend logs:** Check terminal where `python app.py` is running

**Frontend logs:** Open Browser DevTools (F12) → Console tab

---

### 🔄 How to restart everything?

1. **Stop both servers** (Ctrl+C in both terminals)
2. **Restart backend:**
   ```bash
   python app.py
   ```
3. **Restart frontend:**
   ```bash
   cd frontend
   npm run dev
   ```

---

### 🆘 Still Having Issues?

1. Check [BACKEND_START_GUIDE.md](BACKEND_START_GUIDE.md) for detailed backend troubleshooting
2. Check [FRONTEND_START_GUIDE.md](FRONTEND_START_GUIDE.md) for frontend-specific issues
3. Check [SETUP_INSTRUCTIONS.md](SETUP_INSTRUCTIONS.md) for step-by-step setup
4. Open an issue on GitHub with:
   - Error messages
   - System info (OS, Python version, Node version)
   - Steps to reproduce

</details>

---



## System Requirements & Performance

### Minimum Requirements

| Component | Specification |
|-----------|--------------|
| **CPU** | Intel i5 / AMD Ryzen 5 (4 cores) |
| **RAM** | 8GB (4GB free for model) |
| **Storage** | 10GB free space |
| **OS** | Windows 10+, Ubuntu 20.04+, macOS 11+ |
| **Internet** | Required for initial model download |

### Recommended Requirements (For Best Performance)

| Component | Specification |
|-----------|--------------|
| **CPU** | Intel i7 / AMD Ryzen 7 (8 cores) |
| **RAM** | 16GB+ |
| **GPU** | NVIDIA RTX 3050+ (4GB VRAM) |
| **Storage** | 20GB+ SSD |
| **Internet** | 10+ Mbps for model download |

### Performance Benchmarks

| Hardware | Model Load Time | Inference Speed (per query) |
|----------|----------------|---------------------------|
| **CPU Only** | 5-10 minutes | 10-15 seconds |
| **RTX 3050** | 1-2 minutes | 2-3 seconds |
| **RTX 4060+** | 30-60 seconds | 1-2 seconds |

> **💡 Tip**: GPU acceleration reduces inference time by **5-10x** compared to CPU.

---


## 📞 Support & Documentation

| Resource | Description |
|----------|-------------|
| 📖 [README.md](README.md) | Main documentation (this file) |
| 🔧 [BACKEND_START_GUIDE.md](BACKEND_START_GUIDE.md) | Backend troubleshooting & setup |
| ⚛️ [FRONTEND_START_GUIDE.md](FRONTEND_START_GUIDE.md) | Frontend setup & development |
| 📋 [SETUP_INSTRUCTIONS.md](SETUP_INSTRUCTIONS.md) | Detailed installation guide |

---

<div align="center">

### ⭐ If you find this project helpful, please consider giving it a star!

**Made with ❤️ for the Legal Community**

[![GitHub stars](https://img.shields.io/github/stars/your-username/kanoonu-ai?style=social)](https://github.com/your-username/kanoonu-ai/stargazers)
[![GitHub forks](https://img.shields.io/github/forks/your-username/kanoonu-ai?style=social)](https://github.com/your-username/kanoonu-ai/network/members)

</div>
