# Kanoonu AI - Local GPU-Accelerated Version (Gemma-2 Indian Law)
# Runs offline using Hugging Face Transformers + PyTorch with CUDA (RTX 3050)

from flask import Flask, request, render_template, jsonify, session, redirect, url_for, send_from_directory
from flask_cors import CORS
import os
import tempfile
import uuid
from transformers import AutoTokenizer, AutoModelForCausalLM, GenerationConfig
import torch
try:
    import accelerate  # noqa: F401
    _HAS_ACCELERATE = True
except Exception:
    _HAS_ACCELERATE = False

app = Flask(__name__)
app.secret_key = 'kanoonu_ai_secret_key_2024'  # Change this in production

# Enable CORS for React frontend
CORS(app, origins=['http://localhost:3000'], supports_credentials=True)

# Local model loading (GPU accelerated if CUDA available)
model_path = "Ananya8154/Gemma-2-2B-Indian-Law"
local_model_dir = "./model/gemma2-indian-law"

# Check if model exists locally
use_local_files = os.path.exists(local_model_dir) and os.path.exists(os.path.join(local_model_dir, "config.json"))

if use_local_files:
    print(f"📁 Using local model from: {local_model_dir}")
    model_path = local_model_dir
else:
    print(f"🌐 Downloading model from Hugging Face: {model_path}")

device = "cuda" if torch.cuda.is_available() else "cpu"
print(f"🔧 Device: {device.upper()}")

# Load tokenizer
try:
    tokenizer = AutoTokenizer.from_pretrained(model_path, local_files_only=use_local_files)
    print("✅ Tokenizer loaded successfully")
except Exception as e:
    print(f"❌ Error loading tokenizer: {e}")
    if use_local_files:
        print("⚠️  Falling back to Hugging Face for tokenizer...")
        tokenizer = AutoTokenizer.from_pretrained("Ananya8154/Gemma-2-2B-Indian-Law", local_files_only=False)
    else:
        raise

use_accelerate_cuda = _HAS_ACCELERATE and (device == "cuda")
_model_kwargs = {
	"dtype": torch.float16 if device == "cuda" else torch.float32,
	"low_cpu_mem_usage": True,
}
if use_accelerate_cuda:
	_model_kwargs["device_map"] = "auto"

# Model will be loaded in background thread
model = None
model_loading = False
model_load_error = None

def load_model_async():
    """Load model in background"""
    global model, model_loading, model_load_error
    model_loading = True
    model_load_error = None
    
    print("📦 Loading model checkpoint shards...")
    print("⏳ This may take 5-10 minutes on CPU. Please be patient...")
    print("💡 Tip: Server will start immediately. Model loading continues in background.")
    print("💡 Check /health endpoint to see model loading status.\n")
    
    try:
        import time
        start_time = time.time()
        
        loaded_model = AutoModelForCausalLM.from_pretrained(
            model_path,
            local_files_only=use_local_files,
            **_model_kwargs
        )
        
        load_time = time.time() - start_time
        print(f"⏱️  Model loading took {load_time:.1f} seconds")
        
        # Move to explicit device when not using accelerate with CUDA
        if not use_accelerate_cuda:
            print("🔄 Moving model to device...")
            loaded_model.to(device)
        loaded_model.eval()
        
        model = loaded_model
        print(f"✅ Model loaded successfully on {device.upper()}")
        if device == "cuda":
            print("🚀 Using GPU:", torch.cuda.get_device_name(0))
    except KeyboardInterrupt:
        print("\n⚠️  Model loading interrupted by user")
        model_load_error = "Loading interrupted"
    except MemoryError:
        print("❌ Out of memory! Model is too large for available RAM.")
        print("💡 Try: 1) Close other applications 2) Use a machine with more RAM 3) Use GPU if available")
        model_load_error = "Out of memory"
    except Exception as e:
        print(f"❌ Error loading model: {type(e).__name__}: {str(e)}")
        import traceback
        traceback.print_exc()
        model_load_error = str(e)
        
        if use_local_files:
            print("⚠️  Attempting to load from Hugging Face (this will download the model)...")
            try:
                loaded_model = AutoModelForCausalLM.from_pretrained(
                    "Ananya8154/Gemma-2-2B-Indian-Law",
                    local_files_only=False,
                    **_model_kwargs
                )
                if not use_accelerate_cuda:
                    loaded_model.to(device)
                loaded_model.eval()
                model = loaded_model
                model_load_error = None
                print(f"✅ Model loaded successfully from Hugging Face on {device.upper()}")
            except Exception as e2:
                print(f"❌ Failed to load model from Hugging Face: {type(e2).__name__}: {str(e2)}")
                model_load_error = str(e2)
    finally:
        model_loading = False

# Start model loading in background thread
import threading
model_thread = threading.Thread(target=load_model_async, daemon=True)
model_thread.start()


def generate_response(prompt: str) -> str:
    if model is None:
        return "Sorry, the AI model is not loaded. Please check the server logs and ensure the model files are available."
    
    try:
        outputs = model.generate(
            **tokenizer(prompt, return_tensors="pt").to(device),
            max_new_tokens=256,
            temperature=0.6,
            top_p=0.9,
            do_sample=True
        )
        decoded = tokenizer.decode(outputs[0], skip_special_tokens=True)
        # Strip everything before "Answer:" and remove the label itself
        marker = "Answer:"
        idx = decoded.find(marker)
        content = decoded[idx + len(marker):] if idx != -1 else decoded
        # Trim whitespace and collapse extra blank lines
        lines = [line.strip() for line in content.strip().splitlines()]
        collapsed = []
        last_blank = False
        for line in lines:
            is_blank = (line == "")
            if is_blank and last_blank:
                continue
            collapsed.append(line)
            last_blank = is_blank
        answer = "\n".join(collapsed).strip()
        return answer
    except Exception as e:
        print(f"❌ Error generating response: {e}")
        return f"Error generating response: {str(e)}"



# Authentication functions
def is_authenticated():
    return session.get('authenticated', False)

def login_user():
    session['authenticated'] = True

def logout_user():
    session.pop('authenticated', None)

@app.route("/")
def home():
    return render_template("index.html")

@app.route("/chatbot")
def chatbot():
    return render_template("chatbot.html")

# Document Analyzer feature removed

@app.route("/lawyers")
def lawyers():
    return render_template("lawyers.html")

@app.route("/lawyer_detail")
def lawyer_detail():
    return render_template("lawyer_detail.html")

@app.route("/admin")
def admin():
    if not is_authenticated():
        return redirect(url_for('admin_login'))
    return render_template("admin.html")

@app.route("/admin/login", methods=['GET', 'POST'])
def admin_login():
    if request.method == 'POST':
        username = request.form.get('username')
        password = request.form.get('password')
        
        if username == 'admin' and password == '1234':
            login_user()
            return redirect(url_for('admin'))
        else:
            return render_template('admin_login.html', error='Invalid credentials')
    
    return render_template('admin_login.html')

@app.route("/admin/logout")
def admin_logout():
    logout_user()
    return redirect(url_for('admin_login'))

@app.route("/ask", methods=["POST"])
def ask():
    data = request.json
    question = data.get("question", "")
    language = data.get("language", "english").strip().lower()
    if not question.strip():
        return jsonify({"answer": "Please enter a question."})

    if language == "kannada":
        prompt = (
            f"""
Question: {question}
Answer concisely like a legal expert, citing IPC or Acts if applicable.
Answer:
"""
        )
    else:
        prompt = (
            f"""
Question: {question}
Answer concisely like a legal expert, citing IPC or Acts if applicable.
Answer:
"""
        )

    try:
        answer = generate_response(prompt)
    except Exception as e:
        answer = f"Error generating response: {str(e)}"
    return jsonify({"answer": answer})

@app.route('/case-law-search', methods=['GET', 'POST'])
def case_law_search():
    from features.case_scraper import search_case_law
    if request.method == 'GET':
        return render_template('case_law.html', cases=None)
    # Prefer form POST, but support JSON too
    is_json_request = request.is_json or (request.content_type and 'application/json' in request.content_type)
    query = None
    
    if is_json_request:
        data = request.json or {}
        query = data.get('query', '')
    else:
        query = request.form.get('query', '')
    
    print("🔍 Incoming case law query:", query)
    if not query or not query.strip():
        if is_json_request:
            return jsonify([])
        return render_template('case_law.html', cases=[])
    
    cases = search_case_law(query.strip(), limit=5)
    print("📦 Scraper returned:", cases)
    
    # Return JSON for JSON requests, HTML template for form requests
    if is_json_request:
        return jsonify(cases)
    return render_template('case_law.html', cases=cases)

# TTS feature removed

# Health check endpoint (works even if model isn't loaded)
@app.route("/health", methods=["GET"])
def health():
    return jsonify({
        "status": "ok",
        "model_loaded": model is not None,
        "model_loading": model_loading,
        "model_error": model_load_error,
        "device": device
    })

if __name__ == "__main__":
    print("\n" + "="*60)
    print("🚀 Starting Kanoonu AI Server...")
    print("="*60)
    print("🌐 Server starting immediately on http://127.0.0.1:5000")
    print("📦 Model is loading in background (check /health endpoint for status)")
    print("💡 AI features will work once model is loaded")
    print("="*60 + "\n")
    
    # Give model thread a moment to start
    import time
    time.sleep(0.5)
    
    app.run(debug=True, host='127.0.0.1', port=5000, use_reloader=False)
