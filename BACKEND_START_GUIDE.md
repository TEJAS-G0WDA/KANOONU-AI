# Backend Startup Guide

## Quick Start

1. **Activate Virtual Environment** (if using one):
   ```powershell
   .\venv\Scripts\activate
   ```

2. **Start Backend Server**:
   ```powershell
   python app.py
   ```

## What to Expect

### Normal Startup Flow:
1. ✅ Tokenizer loads (fast - ~1 second)
2. ⏳ Model loading starts in background (5-10 minutes on CPU)
3. 🚀 **Server starts immediately** on http://localhost:5000
4. 📦 Model continues loading in background
5. ✅ Model ready when loading completes

### Important Notes:

- **Server starts immediately** - You don't need to wait for model to load
- Model loading happens in background thread
- AI features will work once model is loaded
- Check model status: Visit `http://localhost:5000/health`

## Troubleshooting

### If Model Loading Hangs:

1. **Check Available RAM**: Model needs ~4GB RAM
   - Close other applications
   - Check Task Manager for memory usage

2. **Check Model Files**: 
   - Ensure `./Gemma-2-2B-Indian-Law/` directory exists
   - Check if `config.json` is present

3. **Try Downloading Model**:
   - Delete local model folder
   - Let it download from Hugging Face (requires internet)

4. **Check Logs**: 
   - Look for error messages in terminal
   - Check if out of memory errors appear

### If Server Doesn't Start:

1. **Check Port 5000**: 
   - Make sure nothing else is using port 5000
   - Use `netstat -ano | findstr :5000` to check

2. **Check Python Version**: 
   - Requires Python 3.8+
   - Check with `python --version`

3. **Check Dependencies**:
   ```powershell
   pip install -r requirements.txt
   ```

## Health Check

Once server is running, check status:
```
http://localhost:5000/health
```

Response will show:
- `model_loaded`: true/false
- `model_loading`: true/false  
- `model_error`: error message if any
- `device`: CPU or CUDA

## Expected Output

```
============================================================
🚀 Starting Kanoonu AI Server...
============================================================
🌐 Server starting immediately on http://127.0.0.1:5000
📦 Model is loading in background (check /health endpoint for status)
💡 AI features will work once model is loaded
============================================================

📦 Loading model checkpoint shards...
⏳ This may take 5-10 minutes on CPU. Please be patient...
💡 Tip: Server will start immediately. Model loading continues in background.
💡 Check /health endpoint to see model loading status.

 * Running on http://127.0.0.1:5000
```

The server should be accessible immediately, even while model is loading!

