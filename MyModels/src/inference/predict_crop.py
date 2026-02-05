import os
import joblib
import numpy as np

# ------------------ PATH CONFIG ------------------

BASE_DIR = os.path.dirname(os.path.dirname(os.path.dirname(__file__)))

MODEL_DIR = os.path.join(BASE_DIR, "models", "crop_recommendation")

MODEL_PATH = os.path.join(MODEL_DIR, "model.pkl")
SCALER_PATH = os.path.join(MODEL_DIR, "scaler.pkl")
ENCODER_PATH = os.path.join(MODEL_DIR, "label_encoder.pkl")

# ------------------ LOAD MODEL ------------------

def load_model():
    model = joblib.load(MODEL_PATH)
    scaler = joblib.load(SCALER_PATH)
    encoder = joblib.load(ENCODER_PATH)
    return model, scaler, encoder

# ------------------ PREDICTION ------------------

def predict_top_3_crops(input_data: dict):
    """
    input_data: dict of feature_name -> value
    """

    model, scaler, encoder = load_model()

    # Convert dict → array
    features = np.array([list(input_data.values())])

    # Scale
    features_scaled = scaler.transform(features)

    # Predict probabilities
    probabilities = model.predict_proba(features_scaled)[0]

    # Get top 3 indices
    top_3_idx = np.argsort(probabilities)[-3:][::-1]

    results = []
    for idx in top_3_idx:
        results.append({
            "crop": encoder.inverse_transform([idx])[0],
            "confidence": round(float(probabilities[idx]), 3)
        })

    return {
        "top_3_crops": results
    }
