import os
import joblib
import pandas as pd
import numpy as np

from sklearn.model_selection import train_test_split
from sklearn.preprocessing import StandardScaler, LabelEncoder
from sklearn.ensemble import RandomForestClassifier
from sklearn.metrics import (
    accuracy_score,
    classification_report,
    confusion_matrix
)

import matplotlib.pyplot as plt
import seaborn as sns

# ------------------ PATH CONFIG ------------------

BASE_DIR = os.path.dirname(os.path.dirname(os.path.dirname(__file__)))

TRAIN_DATA_PATH = os.path.join(BASE_DIR, "data", "raw", "Train Dataset.csv")
TEST_DATA_PATH = os.path.join(BASE_DIR, "data", "raw", "Test Dataset.csv")

MODEL_DIR = os.path.join(BASE_DIR, "models", "crop_recommendation")
PLOT_DIR = os.path.join(BASE_DIR, "outputs", "plots")
REPORT_DIR = os.path.join(BASE_DIR, "outputs", "reports")

os.makedirs(MODEL_DIR, exist_ok=True)
os.makedirs(PLOT_DIR, exist_ok=True)
os.makedirs(REPORT_DIR, exist_ok=True)

# ------------------ LOAD DATA ------------------

print("📥 Loading datasets...")
train_df = pd.read_csv(TRAIN_DATA_PATH)
test_df = pd.read_csv(TEST_DATA_PATH)

# ------------------ FEATURES & TARGET ------------------

TARGET_COL = "Crop"   # ⚠️ must match your dataset column name

X_train = train_df.drop(columns=[TARGET_COL])
y_train = train_df[TARGET_COL]

X_test = test_df.drop(columns=[TARGET_COL])
y_test = test_df[TARGET_COL]

# ------------------ ENCODE TARGET ------------------

print("🔤 Encoding crop labels...")
label_encoder = LabelEncoder()
y_train_enc = label_encoder.fit_transform(y_train)
y_test_enc = label_encoder.transform(y_test)

# ------------------ SCALE FEATURES ------------------

print("📏 Scaling features...")
scaler = StandardScaler()
X_train_scaled = scaler.fit_transform(X_train)
X_test_scaled = scaler.transform(X_test)

# ------------------ TRAIN MODEL ------------------

print("🌳 Training Random Forest Classifier...")
model = RandomForestClassifier(
    n_estimators=200,
    max_depth=15,
    random_state=42
)
model.fit(X_train_scaled, y_train_enc)

# ------------------ EVALUATION ------------------

print("📊 Evaluating model...")
y_pred = model.predict(X_test_scaled)

accuracy = accuracy_score(y_test_enc, y_pred)
print(f"✅ Accuracy: {accuracy:.2f}")

report = classification_report(
    y_test_enc,
    y_pred,
    target_names=label_encoder.classes_
)

with open(os.path.join(REPORT_DIR, "classification_report.txt"), "w") as f:
    f.write(report)

# ------------------ CONFUSION MATRIX ------------------

print("📉 Generating confusion matrix...")
cm = confusion_matrix(y_test_enc, y_pred)

plt.figure(figsize=(10, 8))
sns.heatmap(
    cm,
    annot=False,
    cmap="Blues",
    xticklabels=label_encoder.classes_,
    yticklabels=label_encoder.classes_
)
plt.xlabel("Predicted")
plt.ylabel("Actual")
plt.title("Crop Recommendation – Confusion Matrix")
plt.tight_layout()
plt.savefig(os.path.join(PLOT_DIR, "confusion_matrix.png"))
plt.close()

# ------------------ SAVE MODELS ------------------

print("💾 Saving model artifacts...")
joblib.dump(model, os.path.join(MODEL_DIR, "model.pkl"))
joblib.dump(scaler, os.path.join(MODEL_DIR, "scaler.pkl"))
joblib.dump(label_encoder, os.path.join(MODEL_DIR, "label_encoder.pkl"))

print("🎉 Crop recommendation model trained successfully!")
