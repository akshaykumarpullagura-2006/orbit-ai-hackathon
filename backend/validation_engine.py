import json
from typing import Dict, Any, List

class ValidationEngine:
    """
    Orbit AI Secret Weapon: Validation Engine.
    Validates, checks, and standardizes every output before it reaches the user.
    Ensures consistency across every workflow (Contract Analysis, Complaint Resolution, Report Generation, Meeting Synthesis).
    """

    def validate_deliverable(
        self,
        title: str,
        incident_type: str,
        priority: str,
        risk_level: str,
        summary: str,
        suggested_actions: List[str],
        generated_reply: str,
        confidence: int
    ) -> Dict[str, Any]:

        checks = {
          "schema_completeness": False,
          "risk_alignment": False,
          "actionability_count": False,
          "response_tone_standards": False,
          "confidence_threshold": False,
        }

        score = 0

        # 1. Schema Completeness Check
        if title and incident_type and summary and generated_reply:
            checks["schema_completeness"] = True
            score += 20

        # 2. Risk & Priority Alignment Check
        if risk_level in ["Severe", "Elevated", "Moderate", "Low"] and priority in ["Critical", "High", "Medium", "Low"]:
            checks["risk_alignment"] = True
            score += 20

        # 3. Actionability Count Check (minimum 2 concrete suggested actions)
        if len(suggested_actions) >= 2:
            checks["actionability_count"] = True
            score += 20

        # 4. Response & Tone Standardization Check
        lower_reply = generated_reply.lower()
        if len(generated_reply) > 30 and ("regards" in lower_reply or "team" in lower_reply or "sincerely" in lower_reply or "best" in lower_reply or "orbit" in lower_reply):
            checks["response_tone_standards"] = True
            score += 20

        # 5. Confidence Threshold Check (min 70% confidence)
        if confidence >= 70:
            checks["confidence_threshold"] = True
            score += 20

        validation_status = "PASSED_STANDARDIZED" if score >= 80 else "NEEDS_REVIEW"

        standardized_actions = [
            action if action.endswith(".") else f"{action}."
            for action in suggested_actions
        ]

        return {
            "validation_status": validation_status,
            "validation_score": score,
            "checks": checks,
            "standardized_actions": standardized_actions,
            "validation_summary": f"Validation Engine: Output passed {sum(checks.values())}/5 enterprise checks with a score of {score}%."
        }

validation_engine = ValidationEngine()
