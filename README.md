# 🪐 Orbit AI — Enterprise AI Workflow Platform

> **"Orbit AI orchestrates specialized AI agents to execute standardized business workflows from document ingestion to business-ready outcomes."**

---

## 💡 The Core Differentiator: "Why Not ChatGPT?"

> **"ChatGPT is a general-purpose AI assistant. Orbit AI is a workflow orchestration platform. It doesn't just generate responses—it runs a predefined business process, tracks execution, validates outputs, stores mission history, and presents structured results through an operational interface."**

---

## 🏛️ Enterprise System Architecture

```
                                     [ USER INTERFACE ]
                         React 18 + TypeScript + Vite + Tailwind CSS
                                              │
                                              ▼ (Live Synchronization)
                                    [ MISSION CONTROL API ]
                                       FastAPI @ Port 8000
                                              │
                                              ▼
                                   [ WORKFORCE ENGINE ]
                                Sequential 7-Agent Pipeline
                                              │
         ┌────────────────────────────────────┼────────────────────────────────────┐
         ▼                                    ▼                                    ▼
[ 1. MISSION PLANNER ]              [ 2. WORKFLOW ROUTER ]               [ 3. DOCUMENT INTELLIGENCE ]
 - Intent Classification             - Domain Taxonomy Routing            - Multi-Format Parsing
 - Execution Strategy                - Priority Assignment                - Entity & Text Extraction
         │                                    │                                    │
         └────────────────────────────────────┼────────────────────────────────────┘
                                              │
         ┌────────────────────────────────────┴────────────────────────────────────┐
         ▼                                    ▼                                    ▼
[ 4. DECISION INTELLIGENCE ]        [ 5. TASK EXECUTOR ]                 [ 6. VALIDATION ENGINE ]
 - Risk Exposure Models              - Action Dispatches                  - 5-Point Quality Check
 - Policy & Rule Evaluation          - Client Response Drafts             - Output Quality Audit
         │                                    │                                    │
         └────────────────────────────────────┼────────────────────────────────────┘
                                              │
                                              ▼
                                   [ 7. REPORT GENERATOR ]
                                  - Executive Synthesis
                                  - Strategic Business Recommendations
                                              │
                                              ▼
                                    [ SQLITE DB (WAL MODE) ]
                                   - Missions, Workflows, Results
                                   - Live Analytics Synchronization
```

---

## 🎬 5-Step Winning Live Demo Sequence

1. **Show the Problem**: Highlight real enterprise document bottlenecks (unstructured contracts, SLAs, complaint disputes).
2. **Upload Document**: Select document or click **"✨ One-Click Demo Mode"** card on Upload workspace (`/app/upload`).
3. **Animate Mission Lifecycle**: Watch the 5-stage lifecycle (`Created` ➔ `Queued` ➔ `Running` ➔ `Completed` ➔ `Archived`) step through the 7 AI agents.
4. **Show Results & Quality Score**: Review the validated deliverable and dynamic 5-point Quality Score badge on the Results page.
5. **Explain Agent Collaboration**: Briefly highlight how `Mission Planner`, `Decision Intelligence`, `Task Executor`, and `Validation Engine` collaborated.

---

## 🔄 Enterprise Mission Lifecycle

```
[ CREATED ] ➔ [ QUEUED ] ➔ [ RUNNING ] ➔ [ COMPLETED ] ➔ [ ARCHIVED ]
```

1. **Created**: Document ingested via Mission Control; format & size verified.
2. **Queued**: Enqueued with unique Mission ID (`ORB-2026-XXXXXX`) in local workspace storage.
3. **Running**: Sequentially processed through the 7-stage Workforce Engine (`Mission Planner` ➔ `Report Generator`).
4. **Completed**: Deliverable audited by the 5-point Validation Engine; Quality Score (0-100%) calculated.
5. **Archived**: Permanently stored in SQLite WAL database with instant search, export, and re-run capability.

---

## 🤖 Specialized AI Workforce & Enterprise Nomenclature

| # | Agent Name | Business Responsibility | Deliverable Output |
|---|---|---|---|
| 1 | **Mission Planner** | Analyzes document intent, classifies mission scope, and plans execution strategy. | Mission intent, task breakdown, confidence score |
| 2 | **Workflow Router** | Evaluates domain taxonomy (`Contract Analysis`, `Complaint Resolution`, `Meeting Synthesis`) & assigns priority. | Selected workflow, priority, routing rationale |
| 3 | **Document Intelligence** | Extracts text (PyMuPDF / DOCX / Tesseract OCR), sentiment, key topics, named entities, and dates. | Extracted summary, entity index, sentiment signal |
| 4 | **Decision Intelligence** | Evaluates business rules, risk exposure level (`Severe` / `Elevated` / `Moderate` / `Low`), and policy impacts. | Risk level, risk factors, recommended actions |
| 5 | **Task Executor** | Prepares automated system dispatches, customer email reply drafts, and operational action items. | Client response draft, system dispatches, action list |
| 6 | **Validation Engine** | Secret Weapon: Audits output completeness, tone standards, actionability, and quality score (0-100%). | Quality Score %, 5/5 check flags, verdict |
| 7 | **Report Generator** | Master executive synthesis — compiles final report title, strategic insights, and recommendations. | Executive report, business recommendations, outcome tag |

---

## 🗄️ Database Architecture (SQLite WAL Mode)

Orbit AI uses **SQLite 3 in Write-Ahead Logging (WAL Mode)** for zero-configuration, reliable, offline-ready local persistence:

- **64MB RAM Cache**: Instant query performance (`PRAGMA cache_size=-64000`).
- **Performance Indexes**: Descending indexes on timestamps for history search and analytics aggregation.
- **Production Upgradability**: Single-setting transition to PostgreSQL / Supabase by updating `DATABASE_URL` in `.env`.

---

## 📡 Live Synchronized API Endpoints

| Method | Endpoint | Description | Response Payload |
|---|---|---|---|
| `GET` | `/api/health` | Engine status check | `{ status: "healthy", version: "7.0.0" }` |
| `POST` | `/api/upload` | Upload & run Workforce Engine | `{ runs: [...], results: [...] }` |
| `POST` | `/api/demo/run` | One-click Demo Mode showcase | `{ runs: [...], results: [...] }` |
| `GET` | `/api/history` | Fetch workflow history | `WorkflowRun[]` |
| `DELETE` | `/api/history/{id}` | Remove workflow record | `{ success: true, deleted: id }` |
| `POST` | `/api/history/{id}/rerun` | Queue workflow re-run | `{ success: true, rerun: id }` |
| `GET` | `/api/results` | Fetch validated deliverables | `ResultRecord[]` |
| `PUT` | `/api/results/{id}` | Update business deliverable | `{ success: true, updated: id }` |
| `GET` | `/api/analytics` | Fetch live workspace metrics | `{ totalTasks, successRate, workflowDistribution }` |
| `GET` | `/api/export/csv` | Download history CSV | CSV File Stream |
| `GET` | `/api/export/json` | Download deliverables JSON | JSON File Stream |

---

## 🚀 Quick Start & Demo Setup

```bash
# 1. Start Backend Engine (Terminal 1)
cd backend
pip install -r requirements.txt
python server.py

# 2. Start Web Interface (Terminal 2)
npm install
npm run dev
# Open http://localhost:5173/app/upload
```
