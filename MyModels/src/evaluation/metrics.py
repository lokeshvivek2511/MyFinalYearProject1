import numpy as np
from sklearn.metrics import mean_squared_error, r2_score


def regression_metrics(y_true, y_pred) -> dict:
    """
    Computes regression evaluation metrics.

    Args:
        y_true: Actual values
        y_pred: Predicted values

    Returns:
        dict: RMSE and R2 score
    """
    rmse = np.sqrt(mean_squared_error(y_true, y_pred))
    r2 = r2_score(y_true, y_pred)

    return {
        "RMSE": round(rmse, 2),
        "R2_Score": round(r2, 2)
    }
