import pandas as pd
from sklearn.preprocessing import StandardScaler, LabelEncoder


FEATURE_COLUMNS = [
    "Nitrogen",
    "Phosphorus",
    "Potassium",
    "Temperature",
    "Humidity",
    "pH_Value",
    "Rainfall"
]


def prepare_features(df: pd.DataFrame):
    """
    Prepares features and target for model training.

    Args:
        df (pd.DataFrame): Cleaned crop dataset

    Returns:
        X_scaled (pd.DataFrame): Scaled feature matrix
        y (pd.Series): Target variable (Yield)
        scaler (StandardScaler): Fitted scaler
        crop_encoder (LabelEncoder): Encoder for crop labels
    """

    X = df[FEATURE_COLUMNS]
    y = df["Yield"]

    # Scale numeric features
    scaler = StandardScaler()
    X_scaled = scaler.fit_transform(X)

    return X_scaled, y, scaler
