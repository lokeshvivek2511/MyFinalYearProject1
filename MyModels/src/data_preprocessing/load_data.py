import pandas as pd
from src.config.settings import CROP_DATA_FILE

# Expected columns in the dataset
REQUIRED_COLUMNS = [
    "Nitrogen",
    "Phosphorus",
    "Potassium",
    "Temperature",
    "Humidity",
    "pH_Value",
    "Rainfall",
    "Crop",
    "Yield"
]


def load_crop_data() -> pd.DataFrame:
    """
    Loads the crop yield dataset and validates required columns.

    Returns:
        pd.DataFrame: Loaded crop dataset
    """
    if not CROP_DATA_FILE.exists():
        raise FileNotFoundError(
            f"Dataset not found at path: {CROP_DATA_FILE}"
        )

    df = pd.read_csv(CROP_DATA_FILE)

    missing_columns = set(REQUIRED_COLUMNS) - set(df.columns)
    if missing_columns:
        raise ValueError(
            f"Dataset is missing required columns: {missing_columns}"
        )

    return df
