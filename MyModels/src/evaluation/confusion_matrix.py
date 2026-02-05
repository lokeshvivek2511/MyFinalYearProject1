import numpy as np
import matplotlib.pyplot as plt
import seaborn as sns
from sklearn.metrics import confusion_matrix

from src.config.settings import PLOTS_DIR


def create_yield_classes(y, bins=(0, 3000, 6000, float("inf"))):
    """
    Converts continuous yield into classes:
    0 = Low, 1 = Medium, 2 = High
    """
    return np.digitize(y, bins=bins) - 1


def plot_confusion_matrix(y_true, y_pred):
    """
    Creates and saves confusion matrix for binned yield classes.
    """
    PLOTS_DIR.mkdir(parents=True, exist_ok=True)

    y_true_cls = create_yield_classes(y_true)
    y_pred_cls = create_yield_classes(y_pred)

    cm = confusion_matrix(y_true_cls, y_pred_cls)

    plt.figure(figsize=(6, 5))
    sns.heatmap(
        cm,
        annot=True,
        fmt="d",
        cmap="Blues",
        xticklabels=["Low", "Medium", "High"],
        yticklabels=["Low", "Medium", "High"]
    )
    plt.xlabel("Predicted Class")
    plt.ylabel("Actual Class")
    plt.title("Confusion Matrix (Yield Categories)")
    plt.tight_layout()

    plt.savefig(PLOTS_DIR / "confusion_matrix.png")
    plt.close()
