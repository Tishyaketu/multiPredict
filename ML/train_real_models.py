import pandas as pd
import numpy as np
from sklearn.linear_model import LogisticRegression
from sklearn.svm import SVC
from sklearn.model_selection import train_test_split
from sklearn.metrics import accuracy_score
import joblib
import os

# Ensure models directory exists
if not os.path.exists('models'):
    os.makedirs('models')

# 1. Heart Disease Training
print("------------------------------------------------")
print("Training Heart Disease Model (Logistic Regression)...")
try:
    heart_df = pd.read_csv('datasets/Heart Disease/heart.csv')
    X_heart = heart_df.drop('target', axis=1)
    y_heart = heart_df['target']

    X_train, X_test, y_train, y_test = train_test_split(X_heart, y_heart, test_size=0.2, random_state=42)

    heart_model = LogisticRegression(max_iter=1000)
    heart_model.fit(X_train, y_train)

    y_pred = heart_model.predict(X_test)
    acc = accuracy_score(y_test, y_pred)
    print(f"Heart Disease Model Accuracy: {acc*100:.2f}%")

    joblib.dump(heart_model, 'models/heart_model.pkl')
    print("Saved models/heart_model.pkl")

except Exception as e:
    print(f"Error training Heart model: {e}")

# 2. Diabetes Training
print("------------------------------------------------")
print("Training Diabetes Model (SVM)...")
try:
    diabetes_df = pd.read_csv('datasets/Diabetes/diabetes.csv')
    X_diabetes = diabetes_df.drop('Outcome', axis=1)
    y_diabetes = diabetes_df['Outcome']
    
    X_train, X_test, y_train, y_test = train_test_split(X_diabetes, y_diabetes, test_size=0.2, random_state=42)

    # Probability=True is important if we want confidence scores later, but user requirements just said SVM.
    # Standard SVM (SVC)
    diabetes_model = SVC(probability=True) 
    diabetes_model.fit(X_train, y_train)

    y_pred = diabetes_model.predict(X_test)
    acc = accuracy_score(y_test, y_pred)
    print(f"Diabetes Model Accuracy: {acc*100:.2f}%")

    joblib.dump(diabetes_model, 'models/diabetes_model.pkl')
    print("Saved models/diabetes_model.pkl")

except Exception as e:
    print(f"Error training Diabetes model: {e}")

print("------------------------------------------------")
print("Tabular Model Training Complete.")
