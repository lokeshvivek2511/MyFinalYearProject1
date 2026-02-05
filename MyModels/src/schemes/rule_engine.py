def check_scheme_eligibility(scheme: dict, user: dict) -> dict:
    """
    Checks eligibility of a single scheme for a given user.

    Args:
        scheme (dict): One scheme row
        user (dict): User input details

    Returns:
        dict: eligibility result with reasons
    """

    eligible = True
    reasons = []

    # ---------- AGE ----------
    if not (scheme["min_age"] <= user["age"] <= scheme["max_age"]):
        eligible = False
        reasons.append("Age criteria not satisfied")
    else:
        reasons.append("Age criteria satisfied")

    # ---------- LAND HOLDING ----------
    if not (scheme["min_land_holding"] <= user["land_holding"] <= scheme["max_land_holding"]):
        eligible = False
        reasons.append("Land holding criteria not satisfied")
    else:
        reasons.append("Land holding criteria satisfied")

    # ---------- INCOME ----------
    if user["income"] > scheme["income_limit"]:
        eligible = False
        reasons.append("Income exceeds scheme limit")
    else:
        reasons.append("Income criteria satisfied")

    # ---------- FARMER TYPE ----------
    if scheme["farmer_type"] != "any" and scheme["farmer_type"] != user["farmer_type"]:
        eligible = False
        reasons.append("Farmer type not eligible")
    else:
        reasons.append("Farmer type eligible")

    # ---------- STATE ----------
    if scheme["state"] != "ALL" and scheme["state"].lower() != user["state"].lower():
        eligible = False
        reasons.append("State restriction not satisfied")
    else:
        reasons.append("State criteria satisfied")

    # ---------- CROP TYPE ----------
    if scheme["crop_type"] != "ALL" and scheme["crop_type"].lower() != user["crop_type"].lower():
        eligible = False
        reasons.append("Crop type not eligible")
    else:
        reasons.append("Crop type eligible")

    # ---------- CATEGORY ----------
    if scheme["category"] != "ALL" and scheme["category"] != user["category"]:
        eligible = False
        reasons.append("Category not eligible")
    else:
        reasons.append("Category eligible")

    # ---------- GENDER ----------
    if scheme["gender"] != "ALL" and scheme["gender"] != user["gender"]:
        eligible = False
        reasons.append("Gender not eligible")
    else:
        reasons.append("Gender eligible")

    return {
        "eligible": eligible,
        "reasons": reasons
    }