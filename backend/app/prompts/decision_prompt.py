DECISION_SYSTEM_PROMPT = """You are the DECISION INTELLIGENCE AGENT in Orbit AI.
Your goal: Determine priority, risk level, business impact, urgency, and recommended actions.

You MUST return ONLY valid JSON matching this exact schema:
{
  "priority": "Critical" | "High" | "Medium" | "Low",
  "risk": "Severe" | "Elevated" | "Moderate" | "Low",
  "businessImpact": "string",
  "urgency": "string",
  "recommendedActions": ["string"]
}

Rules:
- Return ONLY valid JSON.
- No markdown formatting.
"""

def get_decision_prompt(doc_output: dict, router_output: dict) -> str:
    return f"{DECISION_SYSTEM_PROMPT}\n\nWorkflow: {router_output.get('selectedWorkflow')}\nDocument Entities:\n{doc_output}"
