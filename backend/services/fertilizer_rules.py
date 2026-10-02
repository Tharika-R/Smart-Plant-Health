"""
Rule-Based Fertilizer Recommendation & Safety Engine

IMPORTANT:
This physical prototype uses standard capacitive moisture and DHT22 sensors without NPK sensors.
All recommendations are rule-based according to plant variety, age, growth stage, and safety thresholds.
"""

def generate_fertilizer_recommendation(
    plant_type: str,
    growth_stage: str,
    soil_moisture: float,
    days_since_last_fertilizer: float = None,
    requested_dose_ml: float = 5.0
) -> dict:
    
    plant_lower = plant_type.lower()
    stage_lower = growth_stage.lower()

    # Default Rule Templates
    nutrient = "Balanced N-P-K General Feed"
    fertilizer = "Organic Foliage Booster (N-P-K 10-10-10)"
    dose_ml = 5.0
    reason = f"Based on the plant's growth stage and current conditions, a balanced organic feed is recommended."

    # Stage & Variety Specific Rules
    if "tomato" in plant_lower or "chilli" in plant_lower or "pepper" in plant_lower:
        if "flower" in stage_lower or "fruit" in stage_lower:
            nutrient = "Phosphorus & Potassium Fruit Booster"
            fertilizer = "FloraBloom Organic Enhancer (N-P-K 5-15-25)"
            dose_ml = 5.0
            reason = f"Based on the plant's growth stage and current conditions, this fertilizer is recommended to foster flower retention and fruit development."
        else:
            nutrient = "Nitrogen Canopy Tonic"
            fertilizer = "BioGrow Leaf Tonic (N-P-K 15-5-10)"
            dose_ml = 5.0
            reason = f"Based on the plant's growth stage and current conditions, a nitrogen-focused fertilizer is recommended to support foliage growth."

    elif "rose" in plant_lower:
        if "flower" in stage_lower:
            nutrient = "Potassium Bloom Enhancer"
            fertilizer = "RoseBloom Liquid Tonic (N-P-K 8-12-24)"
            dose_ml = 5.0
            reason = "Based on the plant's growth stage and current conditions, this fertilizer is recommended for bud density and vibrant bloom."
        else:
            nutrient = "Balanced Soil Conditioner"
            fertilizer = "Organic Rose Feed (N-P-K 10-10-10)"
            dose_ml = 5.0
            reason = "Based on the plant's growth stage and current conditions, a balanced feed supports healthy root development."

    elif "monstera" in plant_lower or "indoor" in plant_lower or "lily" in plant_lower:
        nutrient = "Nitrogen & Iron Micro-Tonic"
        fertilizer = "Gentle Tropical Leaf Feed (N-P-K 12-6-6)"
        dose_ml = 5.0
        reason = f"Based on the plant's growth stage and current conditions, a gentle leaf feed is recommended for dark green leaf development."

    # Respect requested dose if valid
    if requested_dose_ml > 0:
        dose_ml = min(30.0, requested_dose_ml)

    # ------------------ SAFETY EVALUATIONS ------------------
    can_dispense = True
    warning = None

    # Safety Check 1: Soil Moisture < 30%
    if soil_moisture < 30.0:
        can_dispense = False
        warning = "The soil is too dry. Water your plant before fertilizing."

    # Safety Check 2: Cooldown Interval (minimum 2 days / 48 hours)
    elif days_since_last_fertilizer is not None and days_since_last_fertilizer < 2.0:
        can_dispense = False
        warning = "Fertilizer was applied recently. Allow your plant time to absorb nutrients."

    return {
        "fertilizer": fertilizer,
        "nutrient": nutrient,
        "dose_ml": float(dose_ml),
        "reason": reason,
        "can_dispense": can_dispense,
        "warning": warning
    }
