import json
from typing import Dict, Any
from pydantic import BaseModel, ValidationError

class PlannerSchema(BaseModel):
    missionType: str
    businessGoal: str
    requiredWorkflow: str
    confidence: int

class RouterSchema(BaseModel):
    selectedWorkflow: str
    routeReason: str
    priority: str

class DocumentSchema(BaseModel):
    entities: list[str]
    dates: list[str]
    people: list[str]
    organizations: list[str]
    keyTopics: list[str]
    sentiment: str

class DecisionSchema(BaseModel):
    priority: str
    risk: str
    businessImpact: str
    urgency: str
    recommendedActions: list[str]

class AutomationSchema(BaseModel):
    customerReply: str
    executiveSummary: str
    actionItems: list[str]
    managementReport: str

class ValidationSchema(BaseModel):
    completeness: str
    confidence: int
    missingInformation: list[str]
    potentialIssues: list[str]
    overallQualityScore: str

class ReportSchema(BaseModel):
    executiveSummary: str
    businessInsights: list[str]
    recommendations: list[str]
    missionOutcome: str

AGENT_SCHEMAS = {
    "planner": PlannerSchema,
    "router": RouterSchema,
    "document": DocumentSchema,
    "decision": DecisionSchema,
    "automation": AutomationSchema,
    "validation": ValidationSchema,
    "report": ReportSchema,
}

class SchemaValidator:
    @staticmethod
    def clean_json_string(raw_text: str) -> str:
        text = raw_text.strip()
        if text.startswith("```json"):
            text = text.replace("```json", "").replace("```", "")
        elif text.startswith("```"):
            text = text.replace("```", "")
        return text.strip()

    @staticmethod
    def validate(agent_id: str, raw_json: str) -> Dict[str, Any]:
        cleaned = SchemaValidator.clean_json_string(raw_json)
        parsed = json.loads(cleaned)

        schema_cls = AGENT_SCHEMAS.get(agent_id)
        if schema_cls:
            validated_model = schema_cls(**parsed)
            return validated_model.model_dump()
        return parsed

schema_validator = SchemaValidator()
