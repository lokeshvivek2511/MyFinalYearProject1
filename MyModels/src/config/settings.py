from pathlib import Path

# =========================
# Base project directory
# =========================
BASE_DIR = Path(__file__).resolve().parents[2]

# =========================
# Data directories
# =========================
DATA_DIR = BASE_DIR / "data"
RAW_DATA_DIR = DATA_DIR / "raw"
PROCESSED_DATA_DIR = DATA_DIR / "processed"

# =========================
# Model directories
# =========================
MODELS_DIR = BASE_DIR / "models"
CROP_MODEL_DIR = MODELS_DIR / "crop_recommendation"

# =========================
# Output directories
# =========================
OUTPUTS_DIR = BASE_DIR / "outputs"
PLOTS_DIR = OUTPUTS_DIR / "plots"
REPORTS_DIR = OUTPUTS_DIR / "reports"

# =========================
# Dataset filenames
# =========================
CROP_DATA_FILE = RAW_DATA_DIR / "Crop_Yield_Prediction.csv"

# =========================
# Model filenames
# =========================
CROP_MODEL_FILE = CROP_MODEL_DIR / "model.pkl"
SCALER_FILE = CROP_MODEL_DIR / "scaler.pkl"

# =========================
# Train-test split
# =========================
TEST_SIZE = 0.2
RANDOM_STATE = 42
