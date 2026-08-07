from backend.app.prompts.planner_prompt import get_planner_prompt
from backend.app.prompts.router_prompt import get_router_prompt
from backend.app.prompts.document_prompt import get_document_prompt
from backend.app.prompts.decision_prompt import get_decision_prompt
from backend.app.prompts.automation_prompt import get_automation_prompt
from backend.app.prompts.validation_prompt import get_validation_prompt
from backend.app.prompts.report_prompt import get_report_prompt

class PromptManager:
    """
    Centralized Prompt Manager for Orbit AI.
    Provides agent-specific prompts without prompt duplication.
    """

    @staticmethod
    def get_prompt_for_agent(agent_id: str, context: dict) -> str:
        filename = context.get("filename", "document.pdf")
        text_content = context.get("text_content", "")

        if agent_id == "planner":
            return get_planner_prompt(filename, text_content)
        elif agent_id == "router":
            planner_output = context.get("planner_output", {})
            return get_router_prompt(planner_output, filename)
        elif agent_id == "document":
            workflow = context.get("router_output", {}).get("selectedWorkflow", "Complaint Resolution")
            return get_document_prompt(filename, text_content, workflow)
        elif agent_id == "decision":
            doc_output = context.get("document_output", {})
            router_output = context.get("router_output", {})
            return get_decision_prompt(doc_output, router_output)
        elif agent_id == "automation":
            decision_output = context.get("decision_output", {})
            return get_automation_prompt(filename, decision_output)
        elif agent_id == "validation":
            automation_output = context.get("automation_output", {})
            decision_output = context.get("decision_output", {})
            return get_validation_prompt(automation_output, decision_output)
        elif agent_id == "report":
            validation_output = context.get("validation_output", {})
            automation_output = context.get("automation_output", {})
            return get_report_prompt(filename, validation_output, automation_output)
        else:
            raise ValueError(f"Unknown agent_id: {agent_id}")

prompt_manager = PromptManager()
