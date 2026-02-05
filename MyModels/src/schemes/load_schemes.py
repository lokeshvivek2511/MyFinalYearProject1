import pandas as pd
from pathlib import Path

# ------------------ PATH CONFIG ------------------

BASE_DIR = Path(__file__).resolve().parents[2]
SCHEME_DATA_FILE = BASE_DIR / "data" / "schemes" / "government_schemes.csv"

# ------------------ REQUIRED COLUMNS ------------------

REQUIRED_COLUMNS = [
    "scheme_id",
    "scheme_name",
    "benefits",
    "min_age",
    "max_age",
    "min_land_holding",
    "max_land_holding",
    "income_limit",
    "farmer_type",
    "state",
    "crop_type",
    "category",
    "gender",
    "other_conditions",
    "steps_to_apply",
    "official_url"
]

# ------------------ LOAD FUNCTION ------------------

def load_schemes() -> pd.DataFrame:
    """
    Loads government schemes dataset and validates structure.

    Returns:
        pd.DataFrame: schemes dataset
    """

    # Check file existence
    if not SCHEME_DATA_FILE.exists():
        raise FileNotFoundError(
            f"Government schemes dataset not found at: {SCHEME_DATA_FILE}"
        )

    # Load CSV
    df = pd.read_csv(SCHEME_DATA_FILE)

    # Validate required columns
    missing_columns = set(REQUIRED_COLUMNS) - set(df.columns)
    if missing_columns:
        raise ValueError(
            f"Missing required columns in scheme dataset: {missing_columns}"
        )

    return df