import pandas as pd

NUMERIC_COLUMNS = [
    "Nitrogen",
    "Phosphorus",
    "Potassium",
    "Temperature",
    "Humidity",
    "pH_Value",
    "Rainfall",
    "Yield"
]


def clean_crop_data(df: pd.DataFrame) -> pd.DataFrame:
    """
    Cleans the crop dataset by handling duplicates and missing values.

    Args:
        df (pd.DataFrame): Raw crop dataset

    Returns:
        pd.DataFrame: Cleaned dataset
    """

    # Remove duplicate rows
    df = df.drop_duplicates().reset_index(drop=True)

    # Handle missing numeric values by filling with column mean
    for col in NUMERIC_COLUMNS:
        if df[col].isnull().any():
            df[col] = df[col].fillna(df[col].mean())

    # Remove rows with missing crop labels
    df = df.dropna(subset=["Crop"])

    return df
