import sys
import json
import joblib
import numpy as np
import os

def predict():
    try:
        # 1. Input Validation
        if len(sys.argv) < 3:
            print(json.dumps({"error": "Insufficient arguments. Usage: python predict_form.py <type> <json_data>"}))
            return

        pred_type = sys.argv[1] # 'diabetes' or 'heart'
        input_json = sys.argv[2] # JSON string of data

        # 2. Logic Selection
        if pred_type == 'diabetes':
            model_path = 'models/diabetes_model.pkl'
        elif pred_type == 'heart':
            model_path = 'models/heart_model.pkl'
        else:
            print(json.dumps({"error": f"Unknown prediction type: {pred_type}"}))
            return

        # 3. Load Model
        # Ensure path is relative to where script is run, or absolute. 
        # Usually run from root, so 'dynamic/ML/models' might be needed if run from root.
        # But existing scripts used 'models/...'.
        # Let's check where the CWD usually is. 
        # Based on file structure: /home/tish/thas/dynamic/ML/predict_diabetes.py used 'models/diabetes_model.pkl'
        # So we assume CWD is 'dynamic/ML' OR the paths are relative to the script location.
        # Actually, best practice is relative to script location to be safe.
        
        script_dir = os.path.dirname(os.path.abspath(__file__))
        abs_model_path = os.path.join(script_dir, model_path)
        
        if not os.path.exists(abs_model_path):
             # Fallback to current directory check (legacy behavior support)
             if os.path.exists(model_path):
                 abs_model_path = model_path
             else:
                 print(json.dumps({"error": f"Model file not found at {abs_model_path}"}))
                 return

        model = joblib.load(abs_model_path)

        # 4. Parse Data
        try:
            input_data = json.loads(input_json)
        except json.JSONDecodeError:
            print(json.dumps({"error": "Invalid JSON data provided"}))
            return

        # Handle Dict vs List (Standardizing input)
        if isinstance(input_data, dict):
            # Try 'features' key, else all values
            features = input_data.get('features', list(input_data.values()))
        else:
            features = input_data

        # 5. Predict
        features_np = np.array(features).reshape(1, -1)
        
        # Determine if we can get probabilities (SVC probability=True for diabetes, LR for heart)
        # For simplicity and consistency with old scripts, we stick to predict() for now,
        # but could easily add predict_proba() if 'heart_model' (LR) or 'diabetes_model' (SVC prob=True) supports it.
        
        prediction = model.predict(features_np)
        pred_val = int(prediction[0])

        result = {
            "prediction": pred_val,
            "type": pred_type,
            "status": "success"
        }
        
        print(json.dumps(result))

    except Exception as e:
        error_result = {
            "error": str(e),
            "status": "error"
        }
        print(json.dumps(error_result))

if __name__ == "__main__":
    predict()
