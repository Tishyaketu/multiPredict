import sys
import json
import joblib
import numpy as np

def predict():
    try:
        # Load model using absolute path or relative to script
        model_path = 'models/heart_model.pkl'
        model = joblib.load(model_path)

        # Get data from command line argument (first arg is script name, second is JSON string)
        if len(sys.argv) < 2:
            print(json.dumps({"error": "No input provided"}))
            return

        input_json = sys.argv[1]
        input_data = json.loads(input_json)
        
        # Expected features in order:
        # [Age, Sex, ChestPain, RestingBP, Cholesterol, FastingBS, ECG, MaxHR, ExerciseAngina, Oldpeak, Slope, Vessels, Thalassemia]
        # In a real app, you'd map dict keys to this list order safely.
        # For simplicity, we assume the input_data is already a list of values or a dict we convert.
        
        if isinstance(input_data, dict):
            # Example mapping based on user keys (simplified)
            # Ensure the order matches the training (train_dummy_models.py used 13 random features)
            # We just extract values or expect a specific key 'features'
            features = input_data.get('features', [])
            if not features:
               # Fallback: try to convert dict values to list (risky order)
               features = list(input_data.values())
        else:
            features = input_data

        features_np = np.array(features).reshape(1, -1)
        
        prediction = model.predict(features_np)
        
        result = {
            "prediction": int(prediction[0]),
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
