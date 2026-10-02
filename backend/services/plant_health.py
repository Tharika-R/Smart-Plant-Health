"""
Plant Health Evaluation Service

Evaluates live telemetry (soil moisture, temperature, humidity) against 
plant-specific thresholds and generates friendly, non-technical health statuses.
"""

def evaluate_plant_health(
    soil_moisture: float,
    temperature: float,
    humidity: float,
    moisture_threshold: float = 40.0,
    temp_threshold: float = 30.0
) -> dict:
    
    # 1. Critical Evaluation
    if soil_moisture < 25.0:
        return {
            "status": "CRITICAL",
            "message": "Your plant needs water soon. Soil moisture is critically low.",
            "severity": "critical"
        }
    if temperature > (temp_threshold + 6.0):
        return {
            "status": "CRITICAL",
            "message": "It's much warmer than usual around your plant. Keep an eye on hydration.",
            "severity": "critical"
        }
    
    # 2. Attention Evaluation
    if soil_moisture < moisture_threshold:
        return {
            "status": "ATTENTION",
            "message": "Your plant is getting thirsty. Consider watering today.",
            "severity": "warning"
        }
    if temperature > temp_threshold:
        return {
            "status": "ATTENTION",
            "message": "It's warmer than usual around your plant.",
            "severity": "warning"
        }
    if soil_moisture > 85.0:
        return {
            "status": "ATTENTION",
            "message": "Soil moisture is very high. Allow soil to breathe before watering again.",
            "severity": "warning"
        }

    # 3. Healthy Default
    return {
        "status": "HEALTHY",
        "message": "Your plant is getting the care it needs.",
        "severity": "info"
    }
