import sys
import json
import joblib
import numpy as np

def predict():
    try:
        model_path = 'models/diabetes_model.pkl'
        model = joblib.load(model_path)

        if len(sys.argv) < 2:
            print(json.dumps({"error": "No input provided"}))
            return

        input_json = sys.argv[1]
        input_data = json.loads(input_json)
        
        # Expected features: 8
        if isinstance(input_data, dict):
             features = input_data.get('features', list(input_data.values()))
        else:
            features = input_data

        features_np = np.array(features).reshape(1, -1)
        
        # SVM can give probability
        # prediction = model.predict(features_np)
        # using probability if trained with probability=True
        
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
