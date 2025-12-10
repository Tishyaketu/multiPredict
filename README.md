# Multi-Predict - Multi-Disease Prediction System

Multi-Predict is a robust web application designed to assist in the early detection of multiple diseases including Heart Disease, Diabetes, Breast Cancer, and Lung Cancer. It leverages advanced Machine Learning models integrated with a modern MERN stack web interface.

## 🚀 Features

*   **Multi-Disease Prediction**:
    *   **Heart Disease**: Analysis of clinical parameters.
    *   **Diabetes**: Risk assessment based on health metrics.
    *   **Breast Cancer**: Classification of Ultrasound images.
    *   **Lung Cancer**: Detection from CT Scan images.
*   **User System**: Secure Registration and Login with JWT.
*   **Medical Reports**: Instant PDF generation of prediction results.
*   **Interactive UI**: Modern, responsive dashboard.

## 🛠️ Technology Stack

*   **Frontend**: React (Vite), CSS3 (Glassmorphism)
*   **Backend**: Node.js, Express.js
*   **Database**: MongoDB
*   **Machine Learning**: Python, TensorFlow, Scikit-Learn
*   **Infrastructure**: Concurrently, Python-Shell integration

## 📦 Installation & Setup

1.  **Clone the Repository**
    ```bash
    git clone https://github.com/Tishyaketu/multiPredict.git
    cd Multi-Predict
    ```

2.  **Install All Dependencies**
    ```bash
    npm run install-all
    ```
    *This will install dependencies for Root, Backend, and Frontend.*

3.  **Setup Environment Variables**
    *   **Backend**: Check `Backend/.env` (Auto-generated during setup).
    *   **ML**: Ensure Python 3.8+ is installed. A virtual environment is created automatically if you followed the setup.

4.  **Run the Application**
    ```bash
    npm run dev
    ```
    *   **Frontend**: http://localhost:5173
    *   **Backend**: http://localhost:8000

## 🧪 Verification

To verify the system functionality:
*   **Backend Test**: `cd Backend && node test_phase3.js`
*   **ML Inference**: `cd ML && ./venv/bin/python predict_heart.py '{"age":60,...}'`

## 📄 License
MIT
