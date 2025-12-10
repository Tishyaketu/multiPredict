import pandas as pd
import numpy as np
from sklearn.linear_model import LogisticRegression
from sklearn.svm import SVC
from sklearn.datasets import load_breast_cancer, load_diabetes
import joblib
import os

# Ensure models directory exists
if not os.path.exists('models'):
    os.makedirs('models')

print("Training Heart Disease Model (Dummy)...")
# Mock Data for Heart Disease (13 features)
# Age, Sex, Chest Pain Type, Resting BP, Cholesterol, Fasting BS, ECG, Max HR, Exercise Angina, Oldpeak, Slope, Vessels, Thalassemia
X_heart = np.random.rand(100, 13)
y_heart = np.random.randint(0, 2, size=100)
heart_model = LogisticRegression()
heart_model.fit(X_heart, y_heart)
joblib.dump(heart_model, 'models/heart_model.pkl')
print("Saved models/heart_model.pkl")

print("Training Diabetes Model (SVM)...")
# Mock Data for Diabetes (8 features)
# Pregnancies, Glucose, BP, Skin, Insulin, BMI, Pedigree, Age
X_diabetes = np.random.rand(100, 8)
y_diabetes = np.random.randint(0, 2, size=100)
diabetes_model = SVC(probability=True) # Probability=True for predict_proba if needed
diabetes_model.fit(X_diabetes, y_diabetes)
joblib.dump(diabetes_model, 'models/diabetes_model.pkl')
print("Saved models/diabetes_model.pkl")

print("Done.")
