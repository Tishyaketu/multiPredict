import tensorflow as tf
from tensorflow.keras import layers, models, applications
from tensorflow.keras.preprocessing.image import ImageDataGenerator
import os
import sys

# Suppress TF warnings
os.environ['TF_CPP_MIN_LOG_LEVEL'] = '2'

# GPU Configuration
gpus = tf.config.list_physical_devices('GPU')
if gpus:
    try:
        # Currently, memory growth needs to be the same across GPUs
        for gpu in gpus:
            tf.config.experimental.set_memory_growth(gpu, True)
        print(f"✅ GPU Detected: {len(gpus)} device(s) found. using GPU.")
    except RuntimeError as e:
        # Memory growth must be set before GPUs have been initialized
        print(e)
else:
    print("⚠️ No GPU detected. Training will use CPU.")

MODELS_DIR = 'models'
if not os.path.exists(MODELS_DIR):
    os.makedirs(MODELS_DIR)

# Constants
IMG_SIZE_BREAST = (100, 100)
IMG_SIZE_LUNG = (150, 150) # Smaller than standard to save time/memory on CPU
BATCH_SIZE = 32
EPOCHS = 5 # Small number for demonstration. Increase for real performance.

# 1. Breast Cancer (CNN)
# Path: datasets/ultrasound breast classification/train/ [benign, malignant]
BREAST_DIR = 'datasets/ultrasound breast classification/train'

print("------------------------------------------------")
print("Training Breast Cancer Model (Custom CNN)...")

if os.path.exists(BREAST_DIR):
    train_datagen = ImageDataGenerator(rescale=1./255, validation_split=0.2)
    
    train_generator = train_datagen.flow_from_directory(
        BREAST_DIR,
        target_size=IMG_SIZE_BREAST,
        batch_size=BATCH_SIZE,
        class_mode='binary',
        subset='training'
    )
    
    validation_generator = train_datagen.flow_from_directory(
        BREAST_DIR,
        target_size=IMG_SIZE_BREAST,
        batch_size=BATCH_SIZE,
        class_mode='binary',
        subset='validation'
    )
    
    model_breast = models.Sequential([
        layers.Conv2D(32, (3, 3), activation='relu', input_shape=(100, 100, 3)),
        layers.MaxPooling2D(2, 2),
        layers.Conv2D(64, (3, 3), activation='relu'),
        layers.MaxPooling2D(2, 2),
        layers.Conv2D(64, (3, 3), activation='relu'),
        layers.Flatten(),
        layers.Dense(64, activation='relu'),
        layers.Dense(1, activation='sigmoid')
    ])
    
    model_breast.compile(optimizer='adam', loss='binary_crossentropy', metrics=['accuracy'])
    
    # Check if we have data
    if train_generator.samples > 0:
        history = model_breast.fit(
            train_generator,
            epochs=EPOCHS,
            validation_data=validation_generator
        )
        model_breast.save(os.path.join(MODELS_DIR, 'breast_cancer_model.h5'))
        print("Saved models/breast_cancer_model.h5")
    else:
        print("No images found in Breast Cancer dataset path!")
else:
    print(f"Directory not found: {BREAST_DIR}")


# 2. Lung Cancer (InceptionResNet)
# Path: datasets/Lung Cancer DataSet/Data/train/ [4 classes]
LUNG_DIR = 'datasets/Lung Cancer DataSet/Data/train'

print("------------------------------------------------")
print("Training Lung Cancer Model (InceptionResNetV2 Transfer Learning)...")

if os.path.exists(LUNG_DIR):
    # Determine number of classes
    classes = [d for d in os.listdir(LUNG_DIR) if os.path.isdir(os.path.join(LUNG_DIR, d))]
    num_classes = len(classes)
    print(f"Found {num_classes} classes: {classes}")

    train_datagen_lung = ImageDataGenerator(rescale=1./255, validation_split=0.2)
    
    train_generator_lung = train_datagen_lung.flow_from_directory(
        LUNG_DIR,
        target_size=IMG_SIZE_LUNG,
        batch_size=BATCH_SIZE,
        class_mode='categorical' if num_classes > 2 else 'binary',
        subset='training'
    )
    
    validation_generator_lung = train_datagen_lung.flow_from_directory(
        LUNG_DIR,
        target_size=IMG_SIZE_LUNG,
        batch_size=BATCH_SIZE,
        class_mode='categorical' if num_classes > 2 else 'binary',
        subset='validation'
    )

    # Use InceptionResNetV2 base
    # include_top=False removes the final 1000-class classification layer
    # We freeze the base to strictly do transfer learning (faster, less data needed)
    base_model = applications.InceptionResNetV2(
        weights='imagenet', 
        include_top=False, 
        input_shape=(150, 150, 3)
    )
    base_model.trainable = False 

    model_lung = models.Sequential([
        base_model,
        layers.GlobalAveragePooling2D(),
        layers.Dense(128, activation='relu'),
        layers.Dense(num_classes if num_classes > 2 else 1, activation='softmax' if num_classes > 2 else 'sigmoid')
    ])

    model_lung.compile(
        optimizer='adam', 
        loss='categorical_crossentropy' if num_classes > 2 else 'binary_crossentropy', 
        metrics=['accuracy']
    )

    if train_generator_lung.samples > 0:
        model_lung.fit(
            train_generator_lung,
            epochs=EPOCHS,
            validation_data=validation_generator_lung
        )
        model_lung.save(os.path.join(MODELS_DIR, 'lung_cancer_model.h5'))
        print("Saved models/lung_cancer_model.h5")
    else:
         print("No images found in Lung Cancer dataset path!")

else:
    print(f"Directory not found: {LUNG_DIR}")

print("------------------------------------------------")
print("Image Model Training Complete.")
