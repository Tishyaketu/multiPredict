import tensorflow as tf
from tensorflow import keras
from tensorflow.keras import layers
import numpy as np
import os

if not os.path.exists('models'):
    os.makedirs('models')

print("Creating Breast Cancer Model (CNN Dummy)...")
# Input: Image (e.g., 50x50x3)
model_breast = keras.Sequential([
    keras.Input(shape=(50, 50, 3)),
    layers.Conv2D(16, (3, 3), activation='relu'),
    layers.GlobalAveragePooling2D(),
    layers.Dense(1, activation='sigmoid')
])
model_breast.compile(optimizer='adam', loss='binary_crossentropy', metrics=['accuracy'])
model_breast.save('models/breast_cancer_model.h5')
print("Saved models/breast_cancer_model.h5")

print("Creating Lung Cancer Model (InceptionResNet Dummy)...")
# Input: Image (e.g., 50x50x3) - Mocking a smaller model for speed instead of full InceptionResNet
model_lung = keras.Sequential([
    keras.Input(shape=(50, 50, 3)),
    layers.Conv2D(16, (3, 3), activation='relu'),
    layers.GlobalAveragePooling2D(),
    layers.Dense(1, activation='sigmoid') # Binary classification: Cancer/Normal
])
model_lung.compile(optimizer='adam', loss='binary_crossentropy', metrics=['accuracy'])
model_lung.save('models/lung_cancer_model.h5')
print("Saved models/lung_cancer_model.h5")

print("Done.")
