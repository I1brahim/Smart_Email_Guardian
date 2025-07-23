5. **Model Performance Optimization**
   - **Problem**: Initial models had different accuracy levels and processing speeds
   - **Cause**: Different algorithms and vectorization techniques
   - **Fix**: Optimized hyperparameters and implemented confidence-based selection# Email Security Scanner

A full-stack web application that uses machine learning to detect spam and phishing threats in email content. Built with React frontend and Flask backend with integrated ML models.

## 🚀 Project Overview

This project provides real-time email security analysis, helping users identify potentially dangerous emails before interacting with them. The core innovation lies in **adopting a dual-model approach**: creating two separate machine learning models - one specialized for spam detection and another for phishing detection - then combining their predictions logically in the backend to provide comprehensive email threat analysis.

The system leverages the strengths of different algorithms and datasets to achieve higher accuracy than a single multi-class model, providing detailed threat assessments with security recommendations.

## 🛠️ Technology Stack

### Frontend
- **React 18+** - Modern UI with hooks
- **JavaScript ES6+** - Core application logic
- **CSS-in-JS** - Inline styling for component isolation
- **Fetch API** - HTTP client for backend communication

### Backend
- **Flask** - Python web framework
- **scikit-learn** - Machine learning model integration
- **pandas** - Data processing and manipulation
- **numpy** - Numerical computations

## 🤖 Machine Learning Architecture

### **Dual-Model Approach Innovation**
This project adopts a **dual-model architecture** instead of a traditional single multi-class classifier:

#### **Model 1: Spam Detection**
- **Algorithm**: Multinomial Naive Bayes
- **Dataset**: SMS Spam Collection Dataset (spam.csv)
- **Features**: CountVectorizer for text feature extraction
- **Training Accuracy**: 98.39%
- **Labels**: `spam` vs `legit`
- **Vectorizer**: Count-based text vectorization

#### **Model 2: Phishing Detection**
- **Algorithm**: Logistic Regression
- **Dataset**: Phishing Email Dataset from Hugging Face (zefang-liu/phishing-email-dataset)
- **Features**: TF-IDF Vectorizer (max_features=5000)
- **Training Accuracy**: 96%
- **Labels**: `phishing email` vs `safe email`
- **Vectorizer**: TF-IDF text vectorization

### **Backend Logic Combination**
The Flask backend combines both models intelligently:
```python
# Both models make predictions
spam_prediction = spam_model.predict(spam_vectorized_text)
phishing_prediction = phishing_model.predict(phishing_vectorized_text)

# Get confidence scores
spam_confidence = max(spam_model.predict_proba(spam_vectorized_text)[0])
phishing_confidence = max(phishing_model.predict_proba(phishing_vectorized_text)[0])

# Choose the model with higher confidence
if spam_confidence > phishing_confidence:
    final_result = spam_result
else:
    final_result = phishing_result
```

This approach provides:
- **Higher accuracy** by leveraging specialized models
- **Better confidence scoring** through model comparison
- **Flexible prediction logic** that can be easily modified

## 📁 Project Structure

```
email-scanner/
├── frontend/
│   ├── src/
│   │   ├── App.js              # Main React component
│   │   └── index.js            # Application entry point
│   ├── public/
│   │   └── index.html          # HTML template
│   └── package.json            # Dependencies and scripts
├── backend/
│   ├── app.py                  # Flask application
│   ├── models/                 # ML model files
│   │   ├── spam_model.pkl
│   │   ├── phishing_model.pkl
│   │   └── vectorizer.pkl
│   └── requirements.txt        # Python dependencies
├── security_notes.md           # Security documentation
└── README.md                   # This file
```

## 🔧 Development Journey

### Phase 1: Machine Learning Model Development
1. **Designed Dual-Model Architecture**
   - Adopted innovative approach of creating two specialized models
   - Researched optimal algorithms for each threat type
   - Selected different vectorization techniques for each model

2. **Spam Detection Model Training**
   - Used SMS Spam Collection dataset (spam.csv)
   - Implemented Multinomial Naive Bayes algorithm
   - Applied Count Vectorization for feature extraction
   - Achieved 98.39% accuracy on test set
   - Saved model as `spam_model.pkl` and vectorizer as `spam_vectorizer.pkl`

3. **Phishing Detection Model Training**
   - Utilized Hugging Face phishing email dataset
   - Implemented Logistic Regression algorithm
   - Applied TF-IDF vectorization (max_features=5000)
   - Achieved 96% accuracy with excellent precision/recall
   - Saved model as `phishing_model.pkl` and vectorizer as `phishing_vectorizer.pkl`

### Phase 2: Initial Setup
4. **Created React Frontend**
   - Set up basic React component structure
   - Implemented email input form with textarea
   - Added scan button with loading states
   - Created responsive design with gradient background

5. **Built Flask Backend with Model Integration**
   - Configured Flask server on port 5000
   - **Implemented dual-model prediction logic**
   - Loaded both spam and phishing models with their respective vectorizers
   - Created intelligent model combination algorithm based on confidence scores
   - Added `/scan` endpoint for email analysis
   - Added `/history` endpoint for scan history

### Phase 3: Core Functionality
6. **Implemented Email Scanning**
   - Connected frontend to backend via HTTP requests
   - **Implemented dual-model analysis workflow**
   - Added real-time scan results display
   - Created probability scoring and risk levels
   - **Challenge**: Initial backend returned single model results
   - **Solution**: Modified to run both models and compare confidence scores

7. **Added Results Visualization**
   - Built result cards with status indicators
   - Added progress bars showing confidence levels
   - Implemented color-coded risk assessment
   - Created conditional security tips display

### Phase 4: History & Data Management
8. **Scan History Feature**
   - Implemented JSON-based scan history storage (`history.json`)
   - Created history table with pagination
   - Added automatic history fetching on page load
   - Built responsive table design
   - **Advanced Feature**: Developed comprehensive `HistoryManager` class for enhanced data management

9. **Data Structure Debugging**
   - **Challenge**: History table showing "N/A" instead of actual results
   - **Root Cause**: Mismatch between scan results format and history format
   - **Solution**: Aligned data structure access patterns
   ```javascript
   // Fixed: item.spam.label → item.label
   // Fixed: item.spam.probability → item.probability
   ```

### Phase 5: Security Implementation
10. **Security Enhancements**
   - **Input Sanitization**: Added `sanitizeInput()` function
     - Removes script tags, iframes, and malicious HTML
     - Blocks JavaScript protocols and event handlers
     - Implements input length limits (10,000 characters)
   
   - **XSS Prevention**: Added `escapeHtml()` function
     - Escapes HTML entities for safe display
     - Prevents code injection in user outputs
   
   - **API Security**: Implemented token-based authentication
     - Added API key validation with regex patterns
     - Bearer token authorization headers
     - Credential scope control (`same-origin`)

11. **Communication Security**
   - **HTTPS Enforcement**: Protocol validation in `getApiEndpoint()`
   - **Request Timeouts**: 30-second timeout with AbortController
   - **Error Handling**: Secure error messages without info disclosure

### Phase 6: Production Readiness
12. **Error Handling & Validation**
   - Comprehensive input validation
   - Response structure validation
   - Graceful error display to users
   - Network timeout handling

13. **UI/UX Improvements**
    - Added security warning notices
    - Implemented character counter for inputs
    - Enhanced loading states with spinners
    - Added timestamp tracking for scans

## 🔒 Security Features

### Input Security
- **HTML/Script Sanitization**: Removes dangerous tags and scripts
- **XSS Prevention**: HTML entity escaping for all user content
- **Input Validation**: Length limits and type checking
- **Protocol Blocking**: Prevents javascript: URLs and event handlers

### API Security
- **Authentication**: Bearer token validation for all requests
- **Rate Limiting**: Client-side request throttling
- **HTTPS Enforcement**: Automatic protocol upgrade in production
- **Error Security**: Generic error messages to prevent information disclosure

### Data Protection
- **Memory-Only Storage**: No persistent storage of sensitive data
- **Limited History**: Maintains only 50 most recent scans
- **Data Minimization**: Only necessary data transmitted and stored

## 📊 Data Flow

```
1. User Input → Frontend (Email Content + API Key)
2. Frontend → Backend (/scan endpoint)
3. Backend → ML Models (Spam & Phishing Detection)
4. ML Models → Backend (Predictions + Probabilities)
5. Backend → Frontend (Formatted Results)
6. Frontend → Display Results + Update History
7. Frontend → Backend (/history endpoint)
8. Backend → Frontend (Historical Scan Data)
```

## 🧮 API Endpoints

### POST /scan
**Request:**
```json
{
  "email": "email content to analyze"
}
```

**Response (Dual Model Results):**
```json
{
  "spam": {
    "label": "legit" | "spam",
    "probability": 0.15
  },
  "phishing": {
    "label": "safe email" | "phishing email",
    "probability": 0.08
  }
}
```

**Response (Single Best Prediction - Legacy Format):**
```json
{
  "type": "spam" | "phishing",
  "label": "legit" | "spam" | "phishing email" | "safe email",
  "probability": 0.95,
  "email": "original email content"
}
```

### GET /history
**Response:**
```json
[
  {
    "type": "spam" | "phishing",
    "label": "legit" | "spam" | "phishing email" | "safe email",
    "probability": 0.965894469735907,
    "email": "email content snippet"
  }
]
```

## 🚦 Installation & Setup

### Prerequisites
- Node.js 16+ and npm
- Python 3.8+ and pip
- Jupyter Notebook (for model training)

### Machine Learning Models Setup
```bash
# Install Python dependencies
pip install scikit-learn pandas joblib datasets

# Train spam model (run in Jupyter)
# Open train_spam_model.ipynb and execute all cells

# Train phishing model (run in Jupyter) 
# Open test_phishing_bert.ipynb and execute all cells

# Test models
python testing/test_spam.py
python testing/test_phishing.py
```

### Frontend Setup
```bash
cd frontend
npm install
npm start
# Runs on http://localhost:3000
```

### Backend Setup
```bash
cd backend
pip install flask flask-cors joblib scikit-learn
python app.py
# Runs on http://localhost:5000
```

### Directory Structure After Setup
```
ai/
├── spam_model.pkl          # Generated after training
├── spam_vectorizer.pkl     # Generated after training  
├── phishing_model.pkl      # Generated after training
└── phishing_vectorizer.pkl # Generated after training
```

## 🎯 Key Features

- ✅ **Dual-Model Architecture** - Specialized spam and phishing detection models
- ✅ **Real-time Email Analysis** - Instant threat detection with confidence scoring
- ✅ **Intelligent Model Combination** - Backend logic chooses best prediction
- ✅ **High Accuracy Models** - 98.39% spam detection, 96% phishing detection
- ✅ **Risk Assessment** - Probability scoring with risk levels
- ✅ **Scan History** - Track and review past email analyses with JSON storage
- ✅ **Security Tips** - Contextual security advice for risky emails
- ✅ **Responsive Design** - Works on desktop and mobile devices
- ✅ **Input Sanitization** - Protection against XSS and injection attacks
- ✅ **API Authentication** - Secure token-based access control
- ✅ **HTTPS Support** - Encrypted communication in production
- ✅ **Advanced History Management** - Comprehensive data management with statistics

## 🐛 Debugging Journey

### Major Issues Resolved

1. **Model Integration Challenge**
   - **Problem**: Initially struggled with integrating two different models with different vectorizers
   - **Cause**: Each model required its own preprocessing pipeline and vectorization
   - **Fix**: Created separate model loading and prediction pipelines in Flask backend

2. **History Display Bug**
   - **Problem**: History table showing "N/A" for all labels
   - **Cause**: Data structure mismatch between `/scan` and `/history` responses
   - **Fix**: Updated table mapping from `item.spam.label` to `item.label`

3. **React State Management**
   - **Problem**: Results not displaying after successful scans
   - **Cause**: Incorrect state updates and data flow
   - **Fix**: Proper state management with `setResults()` and `setHistory()`


## Frontend & Backend deployment 
**i used vercel to deploy the frontend** : https://smart-email-guardian.vercel.app/
**for the backend i used railway** : https://email-guardian-backend-production.up.railway.app
