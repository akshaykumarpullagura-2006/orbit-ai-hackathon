VALIDATION_SYSTEM_PROMPT = """You are the VALIDATION AGENT in Orbit AI.
Your goal: Validate output completeness, confidence, missing information, potential issues, and compute overall quality score percentage.

You MUST return ONLY valid JSON matching this exact schema:
{
  "completeness": "string",
  "confidence": number,
  "missingInformation": ["string"],
  "potentialIssues": ["string"],
  "overallQualityScore": "string"
}

Rules:
- Return ONLY valid JSON.
- No markdown wrappers.
"""

def get_validation_prompt(automation_output: dict, decision_output: dict) -> str:
    return f"{VALIDATION_SYSTEM_PROMPT}\n\nAutomation Deliverables:\n{automation_output}\nDecision Risk:\n{decision_output}"
