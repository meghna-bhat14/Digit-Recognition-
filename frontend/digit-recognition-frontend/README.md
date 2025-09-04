Digit Recognition Project

This project demonstrates a handwritten digit recognition system built incrementally using two different ML models, a FastAPI backend, and a Next.js frontend.

🧠 Machine Learning Models
1. Basic Dense Model (No Hidden Layers)

The first model is a simple neural network with only one dense output layer (10 neurons, one for each digit 0–9).

Input: Flattened 28×28 grayscale images → 784 features.

Activation: Sigmoid

Optimizer: Adam

Loss: Sparse Categorical Crossentropy

Accuracy: Achieved good performance (~90%), but limited in capturing complex digit shapes due to lack of hidden layers.

2. Improved Dense Model (With Hidden Layer)

The second model introduced a hidden layer to capture more complex patterns.

Architecture:

Input layer: Flattened 784 features

Hidden layer: Dense with ReLU activation

Output layer: Dense with 10 neurons + Softmax

This improved the model’s ability to generalize and handle variations in handwriting.

⚡ Backend – FastAPI

The trained model is served via a FastAPI backend.

Exposes a /predict/ POST endpoint that accepts an uploaded image and returns:

Predicted digit

Probabilities for each class

Includes preprocessing steps: resizing to 28×28, grayscale conversion, centering, and inversion handling (to match MNIST format).

🎨 Frontend – Next.js + React

The user interface is built with Next.js (TypeScript + Tailwind CSS).

Features:

A canvas where users can draw a digit.

Predict button to send the drawing to the backend.

Results are displayed as formatted JSON for clarity.

CORS enabled on the backend to allow frontend communication.

🛠️ Tech Stack

ML Framework: TensorFlow / Keras

Backend: FastAPI (Python)

Frontend: Next.js (TypeScript, TailwindCSS, React)

Model Serving: Uvicorn server for API hosting