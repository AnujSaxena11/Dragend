# Dragend

**Hackathon Winner**

Dragend is an AI-powered visual platform that allows developers to design database schemas, configure API endpoints, and orchestrate complex backend workflows through a drag-and-drop interface. By combining a visual workflow builder with multi-engine generative AI capabilities, Dragend translates high-level system designs and natural language prompts into production-ready backend code.

---

## Core Features

* **Visual Workflow & Schema Builder:** Intuitively construct database schemas, API routes, and service logic without writing repetitive boilerplate.
* **Natural Language Code Generation:** Convert plain English instructions directly into optimized database queries, validation layers, and backend routing functions.
* **Automated Project Export:** Package fully structured backend projects into ready-to-deploy zip archives with structured directory layouts.
* **Multi-Engine AI Integration:** Connect with top-tier LLM providers to handle autonomous code creation, logic optimization, and schema synthesis.

---

## Supported AI Engines & Models

Dragend leverages an abstraction layer to route prompt workflows through a variety of leading AI providers and local execution environments:

| Provider / Engine | Supported Models | Primary Use Case |
|---|---|---|
| **Groq** | Llama 3.3 70B Versatile, Llama 3 70B Tool Use | Low-latency API code generation, schema synthesis & function calling |
| **Qwen (via Groq / Hosted)** | Qwen 2.5 / 3.6 (27B, 32B, 72B) | High-speed multi-lingual code reasoning & backend logic synthesis |
| **Google Gemini** | Gemini 2.5 Flash, Gemini 2.5 Pro | Complex multi-file architectural reasoning & long-context generation |

---

## Supported Target Frameworks & Databases

Dragend generates modular, clean, and maintainable backend boilerplates across multiple languages and data stores:

* **Node.js:** Express.js
* **Python:** FastAPI, Django
* **Java:** Spring Boot
* **Databases & Query Engines:** PostgreSQL, MySQL, SQLite, MongoDB
