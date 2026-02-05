import matplotlib.pyplot as plt
import seaborn as sns
import pandas as pd

from src.config.settings import PLOTS_DIR


def plot_actual_vs_predicted(y_true, y_pred):
    """
    Saves Actual vs Predicted Yield plot.
    """
    PLOTS_DIR.mkdir(parents=True, exist_ok=True)

    plt.figure(figsize=(8, 6))
    sns.scatterplot(x=y_true, y=y_pred)
    plt.xlabel("Actual Yield")
    plt.ylabel("Predicted Yield")
    plt.title("Actual vs Predicted Crop Yield")
    plt.tight_layout()

    plt.savefig(PLOTS_DIR / "actual_vs_predicted_yield.png")
    plt.close()


def plot_feature_importance(model, feature_names):
    """
    Saves feature importance plot from Random Forest.
    """
    PLOTS_DIR.mkdir(parents=True, exist_ok=True)

    importances = model.feature_importances_
    df = pd.DataFrame({
        "Feature": feature_names,
        "Importance": importances
    }).sort_values(by="Importance", ascending=False)

    plt.figure(figsize=(8, 6))
    sns.barplot(x="Importance", y="Feature", data=df)
    plt.title("Feature Importance for Crop Yield Prediction")
    plt.tight_layout()

    plt.savefig(PLOTS_DIR / "feature_importance.png")
    plt.close()
