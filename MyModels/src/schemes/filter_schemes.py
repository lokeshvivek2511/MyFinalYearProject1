from src.schemes.load_schemes import load_schemes
from src.schemes.rule_engine import check_scheme_eligibility


def get_eligible_schemes(user_input: dict) -> dict:
    """
    Filters eligible government schemes based on user input.

    Args:
        user_input (dict): farmer details

    Returns:
        dict: eligible schemes and count
    """

    df = load_schemes()
    eligible_schemes = []

    for _, row in df.iterrows():
        scheme = row.to_dict()
        result = check_scheme_eligibility(scheme, user_input)

        if result["eligible"]:
            eligible_schemes.append({
                "scheme_id": scheme["scheme_id"],
                "scheme_name": scheme["scheme_name"],
                "benefits": scheme["benefits"],
                "reasons": result["reasons"],
                "other_conditions": scheme["other_conditions"],
                "steps_to_apply": scheme["steps_to_apply"],
                "official_url": scheme["official_url"]
            })

    return {
        "total_eligible_schemes": len(eligible_schemes),
        "schemes": eligible_schemes
    }