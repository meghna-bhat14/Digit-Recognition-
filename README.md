# ✨ Digit Recognition Project  

This project demonstrates a handwritten digit recognition system built incrementally using two different ML models, a FastAPI backend, and a Next.js frontend. Users can draw digits on a canvas, and the system predicts the digit using trained models on the MNIST dataset.  

---

## 🧠 Machine Learning Models  

### 1. Basic Dense Model (No Hidden Layers)  
- **Architecture:** Single dense output layer (10 neurons, one for each digit 0–9).  
- **Input:** Flattened 28×28 grayscale images → 784 features.  
- **Activation:** Sigmoid  
- **Optimizer:** Adam  
- **Loss:** Sparse Categorical Crossentropy  
- **Accuracy:** ~92–94%  
- **Limitation:** Could not capture complex digit shapes due to no hidden layers.  

---

### 2. Improved Dense Model (With Hidden Layers)  
- **Architecture:**  
  - Input: Flattened 784 features  
  - Hidden layer: Dense (128 neurons, ReLU) + Dropout  
  - Hidden layer: Dense (64 neurons, ReLU)  
  - Output layer: Dense (10 neurons, Softmax)  
- **Accuracy:** ~98.5% after 10 epochs  
- **Improvement:** Able to generalize handwriting variations and achieve much higher accuracy compared to the single-layer model.  

---

## ⚡ Backend – FastAPI  

The trained model is served via a **FastAPI backend**.  

- **Endpoint:** `/predict/` (POST)  
- **Input:** Uploaded digit image (from canvas).  
- **Processing:** Resizing to 28×28, grayscale conversion, centering, inversion handling (to match MNIST format).  
- **Output:**  
  - Predicted digit  
  - Probabilities for each class (0–9)  

CORS is enabled to allow frontend communication.  

---

## 🎨 Frontend – Next.js + React  

The user interface is built with **Next.js (TypeScript + Tailwind CSS)**.  

### Features:  
- A **canvas** where users can draw a digit (supports **mouse and touch input**).  
- **Predict** button to send the drawing to the backend.  
- **Clear** button to reset the canvas.  
- Results include:  
  - The predicted digit  
  - A **pie chart visualization** (Recharts) showing probability distribution across digits  
- Polished UI with Tailwind styling for a better user experience.  

---

## 🛠️ Tech Stack  

- **ML Framework:** TensorFlow / Keras  
- **Backend:** FastAPI (Python)  
- **Frontend:** Next.js (TypeScript, TailwindCSS, React, Recharts)  
- **Model Serving:** Uvicorn server for API hosting  

---

## 🚀 Future Improvements  

- **Convolutional Neural Networks (CNNs):** Achieve higher accuracy (~99%) by leveraging spatial patterns in images.  
- **Data Augmentation:** Improve robustness by training with rotated, shifted, and noisy digits.  
- **Model Deployment:** Host backend on cloud (AWS/GCP/Heroku) for wider accessibility.  
- **Frontend Enhancements:** Add confidence bars, better error handling, and mobile optimizations.  
- **Ensemble Models:** Combine predictions from multiple models for higher reliability.  

---

## How to run

-install all the modules mentioned in requirements.txt inside ml_engine_and_backend folder
-run app.py from cmd using the command 'python -m uvicorn app:app --reload'
-run npm install for frontend 
-run frontend using npm run dev

---
