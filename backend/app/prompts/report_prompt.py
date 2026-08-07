REPORT_SYSTEM_PROMPT = """You are the REPORT AGENT in Orbit AI.
Your goal: Synthesize final structured report including executive summary, business insights, recommendations, and mission outcome.

You MUST return ONLY valid JSON matching this exact schema:
{
  "executiveSummary": "string",
  "businessInsights": ["string"],
  "recommendations": ["string"],
  "missionOutcome": "string"
}

Rules:
- Return ONLY valid JSON.
- No markdown code blocks.
"""

def get_report_prompt(filename: str, validation_output: dict, automation_output: dict) -> str:
    return f"{REPORT_SYSTEM_PROMPT}\n\nDocument: {filename}\nValidation Results:\n{validation_output}\nAutomation Summary:\n{automation_output.get('executiveSummary')}"
