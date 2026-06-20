"""
Flask web server that lets you chat with your existing Microsoft Foundry agent
from a webpage in your browser, with support for quiz and flashcard generation.

The flow is:
    your webpage  ->  THIS server (holds credentials, calls the agent)  ->  your agent

You never put your Azure credentials in the webpage itself. They live here,
in the backend, where users can't see them.
"""

import os
import json
import random
import string
import uuid
import hashlib
from datetime import datetime, timedelta
from pathlib import Path
from typing import Dict, Optional

from flask import Flask, jsonify, request, render_template, make_response, redirect

try:
    from dotenv import load_dotenv
except ImportError:
    def load_dotenv():
        return False

try:
    from azure.identity import DefaultAzureCredential
    from azure.ai.projects import AIProjectClient
except ImportError:
    DefaultAzureCredential = None
    AIProjectClient = None

# Load settings (your endpoint + agent name) from the .env file sitting next to this file.
load_dotenv()

PROJECT_ENDPOINT = os.getenv("PROJECT_ENDPOINT")
AGENT_NAME = os.getenv("AGENT_NAME")
AGENT_ID = os.getenv("AGENT_ID")
INSTRUCTOR_PASSWORD = os.getenv("INSTRUCTOR_PASSWORD", "changeme123")
SESSION_MAX_HOURS = int(os.getenv("SESSION_MAX_HOURS", "3"))

FOUNDRY_ENABLED = bool(PROJECT_ENDPOINT and (AGENT_NAME or AGENT_ID))

# --- Connect to Foundry ---------------------------------------------------
project: Optional[AIProjectClient] = None
openai_client = None


def get_openai_client():
    """Create the Foundry/OpenAI client lazily so startup stays simple."""
    global project, openai_client
    if not FOUNDRY_ENABLED:
        raise RuntimeError(
            "Foundry is not configured. Set PROJECT_ENDPOINT and AGENT_ID (or AGENT_NAME) "
            "if you want to use /chat."
        )
    if DefaultAzureCredential is None or AIProjectClient is None:
        raise RuntimeError(
            "Foundry dependencies are not installed. Install azure-identity and azure-ai-projects "
            "to enable /chat."
        )
    if openai_client is None:
        # DefaultAzureCredential uses the login you already have on this machine
        # (the same identity you get after running `az login`). No keys in code.
        project = AIProjectClient(endpoint=PROJECT_ENDPOINT, credential=DefaultAzureCredential())
        openai_client = project.get_openai_client()
    return openai_client

# --- Web server -----------------------------------------------------------
app = Flask(__name__, template_folder='templates')

# Keep conversations in memory by browser session ID so tabs/users don't collide.
state: Dict[str, Dict] = {
    "conversations": {},
    "used_questions": {},
    "live_sessions": {},
}
SESSION_COOKIE = "agent_chat_session"


def get_or_create_session_id(session_id: Optional[str]) -> str:
    """Return current session ID or create a new browser-scoped one."""
    return session_id or str(uuid.uuid4())


def get_conversation_id(session_id: str) -> str:
    """Return the conversation for this browser session, creating it if missing."""
    conversations = state["conversations"]
    if session_id not in conversations:
        client = get_openai_client()
        conversation = client.conversations.create()
        conversations[session_id] = conversation.id
    return conversations[session_id]


def generate_session_key() -> str:
    """Generate a random 6-character uppercase alphanumeric session key."""
    return ''.join(random.choices(string.ascii_uppercase + string.digits, k=6))


def is_valid_session(key: str) -> bool:
    """Return True if the session key exists, is active, and has not expired."""
    session = state["live_sessions"].get(key)
    if not session or not session.get("active"):
        return False
    age = datetime.now() - session["created_at"]
    if age > timedelta(hours=SESSION_MAX_HOURS):
        session["active"] = False
        return False
    return True


def check_instructor_auth(incoming_request) -> bool:
    """Return True if the request cookie contains a valid instructor token."""
    return incoming_request.cookies.get("instructor_auth") == hashlib.sha256(INSTRUCTOR_PASSWORD.encode()).hexdigest()


def get_active_learner_session(expected_mode: Optional[str] = None):
    """Return (key, session) for an active learner cookie session, optionally filtered by mode."""
    key = request.cookies.get("learner_session_key", "")
    if not is_valid_session(key):
        return None, None
    session = state["live_sessions"].get(key)
    if not session:
        return None, None
    if expected_mode and session.get("mode") != expected_mode:
        return None, None
    return key, session


def build_agent_reference() -> dict:
    """Build the agent reference body from env vars."""
    # This API expects the field name "name"; we allow AGENT_ID as the preferred
    # env key because many Foundry portals present this value as an identifier.
    return {"name": AGENT_ID or AGENT_NAME, "type": "agent_reference"}


QUIZ_QUESTIONS = [
    {
        "question": "1. What does AI stand for?",
        "options": ["Automated Intelligence", "Artificial Intelligence", "Advanced Integration", "Algorithmic Interpretation"],
        "answer": 1,
        "explanation": "AI stands for Artificial Intelligence, which refers to machines performing tasks that normally require human intelligence.",
    },
    {
        "question": "2. Which of the following is an example of AI?",
        "options": ["Calculator", "Thermometer", "Chatbot", "Flashlight"],
        "answer": 2,
        "explanation": "A chatbot is an AI system designed to communicate with users using natural language.",
    },
    {
        "question": "3. A system that learns from data to make predictions is called:",
        "options": ["Database", "Machine Learning model", "Operating System", "Compiler"],
        "answer": 1,
        "explanation": "A machine learning model learns patterns from data and uses them to make predictions or decisions.",
    },
    {
        "question": "4. Which one is a branch of AI?",
        "options": ["Networking", "Natural Language Processing", "Hardware design", "Web hosting"],
        "answer": 1,
        "explanation": "Natural Language Processing (NLP) is a branch of AI that focuses on language understanding and generation.",
    },
    {
        "question": "5. What is the main goal of AI?",
        "options": ["To replace all humans", "To make computers behave intelligently", "To increase internet speed", "To build bigger processors"],
        "answer": 1,
        "explanation": "The main goal of AI is to create systems that can perform tasks intelligently.",
    },
    {
        "question": "6. Which of these is a supervised learning task?",
        "options": ["Clustering", "Regression", "Reinforcement", "Random search"],
        "answer": 1,
        "explanation": "Regression is a supervised learning task because it uses labeled data to predict continuous values.",
    },
    {
        "question": "7. In AI, data used to train a model is called:",
        "options": ["Output data", "Test data", "Training data", "Hidden data"],
        "answer": 2,
        "explanation": "Training data is used to teach the model patterns before it is tested on new data.",
    },
    {
        "question": "8. Which AI technique is commonly used for image recognition?",
        "options": ["Deep learning", "Sorting", "Compression", "Encryption"],
        "answer": 0,
        "explanation": "Deep learning, especially neural networks, is widely used for image recognition tasks.",
    },
    {
        "question": "9. What does NLP stand for?",
        "options": ["Neural Logic Processing", "Natural Language Processing", "Network Language Protocol", "Numeric Learning Procedure"],
        "answer": 1,
        "explanation": "NLP stands for Natural Language Processing, which is the AI field focused on human language.",
    },
    {
        "question": "10. Which of the following is a limitation of AI?",
        "options": ["It never makes mistakes", "It always understands context perfectly", "It may depend on the quality of data", "It works without electricity"],
        "answer": 2,
        "explanation": "AI systems can only be as good as the data they are trained on, so poor data can reduce performance.",
    },
    {
        "question": "11. A chatbot is mainly used for:",
        "options": ["Painting images", "Talking with users", "Storing files", "Printing documents"],
        "answer": 1,
        "explanation": "A chatbot is designed to interact with users through conversation.",
    },
    {
        "question": "12. Which learning method uses rewards and penalties?",
        "options": ["Supervised learning", "Unsupervised learning", "Reinforcement learning", "Transfer learning"],
        "answer": 2,
        "explanation": "Reinforcement learning uses rewards and penalties to teach an agent how to behave.",
    },
    {
        "question": "13. Which of these is an AI application?",
        "options": ["Facial recognition", "Text editor", "Calculator app", "Music player"],
        "answer": 0,
        "explanation": "Facial recognition uses AI to identify or verify people from images or videos.",
    },
    {
        "question": "14. Unsupervised learning is used mainly for:",
        "options": ["Finding patterns in unlabeled data", "Predicting exam scores", "Controlling robots", "Searching the web"],
        "answer": 0,
        "explanation": "Unsupervised learning finds hidden patterns in data that has no labels.",
    },
    {
        "question": "15. What is the function of an AI model?",
        "options": ["To store only raw data", "To process information and make predictions or decisions", "To increase battery life", "To replace the CPU"],
        "answer": 1,
        "explanation": "An AI model processes input data to make predictions, classifications, or decisions.",
    },
]

LEARN_SOURCE_ROOT = "https://learn.microsoft.com/en-us/training/paths/develop-ai-agents-azure/"

AI103_LEARNING_PATHS = [
    LEARN_SOURCE_ROOT,
]

AI103_MODULES = [
    {"title": "Develop AI agents with Microsoft Foundry and Visual Studio Code", "url": "https://learn.microsoft.com/en-us/training/modules/develop-ai-agents-azure-vs-code/"},
    {"title": "Integrate custom tools into your agent", "url": "https://learn.microsoft.com/en-us/training/modules/build-agent-with-custom-tools/"},
    {"title": "Integrate MCP Tools with Azure AI Agents", "url": "https://learn.microsoft.com/en-us/training/modules/connect-agent-to-mcp-tools/"},
    {"title": "Build knowledge-enhanced AI agents with Foundry IQ", "url": "https://learn.microsoft.com/en-us/training/modules/introduction-foundry-iq/"},
    {"title": "Integrate your agent with Microsoft 365", "url": "https://learn.microsoft.com/en-us/training/modules/integrate-foundry-agent-with-m365/"},
    {"title": "Build agent-driven workflows using Microsoft Foundry", "url": "https://learn.microsoft.com/en-us/training/modules/build-agent-workflows-microsoft-foundry/"},
    {"title": "Develop an AI agent with Microsoft Agent Framework", "url": "https://learn.microsoft.com/en-us/training/modules/develop-ai-agent-with-semantic-kernel/"},
    {"title": "Orchestrate a multi-agent solution using the Microsoft Agent Framework", "url": "https://learn.microsoft.com/en-us/training/modules/orchestrate-semantic-kernel-multi-agent-solution/"},
    {"title": "Discover Azure AI Agents with A2A", "url": "https://learn.microsoft.com/en-us/training/modules/discover-agents-with-a2a/"},
]

# Module-specific question sets - EXAM LEVEL DIFFICULTY
MODULE_QUESTIONS = {
    "Develop AI agents with Microsoft Foundry and Visual Studio Code": [
        {"question": "In Foundry, when designing an agent's system prompt, which factor has the most significant impact on reducing hallucinations in complex reasoning tasks?", "options": ["Token count limit", "Clear constraint definitions and task decomposition instructions", "Model temperature setting alone", "Response length specification"], "answer": 1, "explanation": "Explicit constraint definitions and task decomposition in the system prompt significantly reduce hallucinations by guiding the model's reasoning process."},
        {"question": "When debugging a Foundry agent in VS Code that intermittently fails on specific tool calls, what is the most effective diagnostic approach?", "options": ["Increase the context window", "Enable structured logging of tool call parameters, responses, and agent state transitions", "Reduce the number of available tools", "Change the model version"], "answer": 1, "explanation": "Structured logging of tool interactions and state transitions provides visibility into failure patterns."},
        {"question": "What is the critical difference between agent prompt engineering in Foundry versus traditional LLM prompt engineering?", "options": ["Foundry doesn't require prompts", "Foundry prompts must account for tool availability, schema validation, and agent state persistence across multiple turns", "They are identical", "Foundry uses JSON only"], "answer": 1, "explanation": "Foundry agents operate in multi-turn environments with tools and state, requiring different prompt design considerations than single-turn LLM interactions."},
        {"question": "When implementing error handling in a Foundry agent, which pattern best prevents cascading failures in tool chains?", "options": ["Ignore all errors and continue", "Implement exponential backoff with explicit fallback paths and state rollback mechanisms", "Retry indefinitely", "Use a single try-catch block"], "answer": 1, "explanation": "Exponential backoff with fallback paths and state rollback ensures graceful degradation and prevents error propagation."},
        {"question": "In VS Code's Foundry extension, what does the tracing view reveal about an agent's decision-making that standard logs cannot?", "options": ["Only execution time", "Token usage and reasoning paths, including why certain tools were or weren't selected", "Only errors", "Nothing useful"], "answer": 1, "explanation": "Tracing shows the full decision-making process including reasoning chains and tool selection rationale."},
    ],
    "Integrate custom tools into your agent": [
        {"question": "When designing a custom tool schema for agent use, which parameter characteristic is most critical for preventing type mismatches at runtime?", "options": ["Aesthetic naming", "Explicit type definitions with strict validation and clear examples of valid input ranges", "Long descriptions only", "No schema needed"], "answer": 1, "explanation": "Explicit, strict type definitions with validation rules and examples prevent agents from passing incorrectly formatted data."},
        {"question": "How should error responses from a custom tool be structured to maximize an agent's ability to self-correct?", "options": ["Simple yes/no", "Structured error codes with specific failure reasons, remediation hints, and valid parameter ranges", "No error handling", "Same format as success responses"], "answer": 1, "explanation": "Detailed, structured error responses enable agents to understand failures and adjust subsequent attempts."},
        {"question": "What is the relationship between tool description granularity and agent performance in multi-step workflows?", "options": ["More detail always helps", "Tools need specific descriptions of what they DON'T do, edge cases they handle, and constraints on usage frequency", "Descriptions don't matter", "One word is sufficient"], "answer": 1, "explanation": "Negative space (what tools can't do) and constraint documentation are often more important than capability descriptions."},
        {"question": "When a custom tool has variable latency (50ms-5s), how should this be communicated in the tool schema to affect agent behavior?", "options": ["Tool schema doesn't support latency", "Include latency expectations and retry policies in the schema, allowing agents to batch calls or adjust timeout expectations", "Just hope the agent waits", "Use random values"], "answer": 1, "explanation": "Communicating latency characteristics allows agents to make informed decisions about tool usage patterns."},
        {"question": "How do you design a custom tool that an agent can safely invoke without constant human verification while maintaining security?", "options": ["Remove all security", "Define clear scope boundaries, implement rate limiting, use signed requests, and log all invocations with audit trails", "Ask for permission every time", "Don't use tools"], "answer": 1, "explanation": "Combination of scope boundaries, rate limiting, request signing, and audit logging enables safe autonomous tool use."},
    ],
    "Integrate MCP Tools with Azure AI Agents": [
        {"question": "When implementing MCP tool servers, what architectural pattern ensures compatibility with heterogeneous agent frameworks?", "options": ["Use proprietary APIs", "Implement standard JSON-RPC 2.0 protocol with schema validation and fallback response handling", "Only REST", "No standards needed"], "answer": 1, "explanation": "JSON-RPC 2.0 with validated schemas is the MCP standard ensuring cross-platform compatibility."},
        {"question": "How does MCP handle versioning when an agent requests a tool version that the server has deprecated?", "options": ["Crashes", "Implements capability negotiation with graceful degradation and version fallback mechanisms", "Ignores the request", "Uses the newest version always"], "answer": 1, "explanation": "MCP uses capability negotiation to handle version mismatches and enable backwards compatibility."},
        {"question": "In an MCP-based architecture, what performance consideration is most critical when serving 100+ concurrent agent instances?", "options": ["CPU cores", "Connection pooling, request queuing, and stateless tool implementations to prevent resource contention", "RAM only", "Disk space"], "answer": 1, "explanation": "Stateless implementations with connection pooling are essential for scaling MCP servers across many concurrent agents."},
        {"question": "When integrating multiple MCP tool servers with Azure AI Agents, how should cross-tool dependencies be managed?", "options": ["Call them in random order", "Define dependency graphs at the orchestration layer with circuit breakers and compensation logic for partial failures", "Sequential only", "Ignore dependencies"], "answer": 1, "explanation": "Orchestration-layer dependency management with circuit breakers enables resilient multi-tool workflows."},
        {"question": "What security mechanism in MCP prevents unauthorized agents from accessing sensitive tools?", "options": ["Nothing, tools are public", "Capability-based access control with signed tokens and agent identity verification at the MCP protocol level", "Passwords only", "Trust on first use"], "answer": 1, "explanation": "MCP implements capability-based security with token verification for fine-grained access control."},
    ],
    "Build knowledge-enhanced AI agents with Foundry IQ": [
        {"question": "When implementing vector search in Foundry IQ, what is the relationship between embedding model choice and retrieval accuracy for domain-specific content?", "options": ["Embedding model doesn't matter", "Domain-specific embeddings significantly outperform generic models, especially for specialized terminology and cross-lingual content", "All embeddings are identical", "Use the smallest model"], "answer": 1, "explanation": "Domain-specific embeddings are critical for accurate retrieval of specialized knowledge."},
        {"question": "How should knowledge indices be structured to support both keyword and semantic search while minimizing latency in real-time agent queries?", "options": ["Single flat index", "Hybrid indices with separate keyword and vector shards, with query routing based on query type analysis", "No indexing", "Random structure"], "answer": 1, "explanation": "Hybrid indices optimize for both search types while maintaining query performance."},
        {"question": "In a Foundry IQ system with continuously updating knowledge, how do you prevent agents from using stale information without blocking on every query?", "options": ["Never update", "Implement version-aware caching with TTLs, background refresh strategies, and consistency guarantees", "Block all queries", "Use random data"], "answer": 1, "explanation": "Version-aware caching with configurable TTLs balances freshness and performance."},
        {"question": "When knowledge indices contain conflicting information about the same fact, how should Foundry IQ resolve this for agent consumption?", "options": ["Return both randomly", "Implement confidence scoring, source attribution, and conflict resolution strategies that bubble uncertainty to the agent", "Ignore conflicts", "Use the newest source always"], "answer": 1, "explanation": "Confidence scoring and source attribution help agents make informed decisions about knowledge reliability."},
        {"question": "What is the impact of knowledge chunking strategy on agent retrieval accuracy, and how should chunk size be optimized?", "options": ["Chunk size doesn't matter", "Optimal chunk size balances context preservation with embedding quality; too small loses context, too large dilutes relevance; vary by document type", "Largest chunks always", "No chunking needed"], "answer": 1, "explanation": "Chunk size optimization is critical; it varies by document type and retrieval task complexity."},
    ],
    "Integrate your agent with Microsoft 365": [
        {"question": "When designing M365-integrated agents, what is the primary challenge in maintaining compliance with conditional access policies?", "options": ["No challenge", "Agents must handle dynamic policy changes, device registration requirements, and interactive auth flows without manual intervention", "Just use basic auth", "Compliance doesn't apply to agents"], "answer": 1, "explanation": "Modern M365 environments have dynamic conditional access that agents must respect and adapt to."},
        {"question": "How should an agent handle Microsoft 365 API throttling to maximize throughput in batch operations?", "options": ["Ignore throttling", "Implement exponential backoff with jitter, adaptive request batching, and queue-based processing with priority ordering", "Retry immediately", "Sequential requests only"], "answer": 1, "explanation": "Exponential backoff with jitter and adaptive batching are essential for reliable M365 API usage at scale."},
        {"question": "When an agent integrates with Teams, what architectural pattern prevents message flooding and ensures reliable delivery in high-latency scenarios?", "options": ["Send immediately without confirmation", "Implement message deduplication, idempotency keys, and delivery confirmation with out-of-order message handling", "No pattern needed", "Use polling"], "answer": 1, "explanation": "Idempotency and deduplication mechanisms ensure reliable Teams integration even with network issues."},
        {"question": "How does delegated vs. application permissions in M365 affect agent design, and when should each be used?", "options": ["They're the same", "Delegated for user-context operations with consent, application for background operations; choice affects security model and user experience", "Always use delegated", "Permissions don't matter"], "answer": 1, "explanation": "The choice between delegated and application permissions fundamentally affects agent security posture and use cases."},
        {"question": "When integrating with Exchange Online via agent, what is the most critical security consideration for handling sensitive email content?", "options": ["No security needed", "Implement field-level encryption, audit logging of access, and content filtering rules to prevent accidental exposure", "Store everything plaintext", "Trust the platform only"], "answer": 1, "explanation": "Email contains sensitive data; additional security layers are essential beyond platform protections."},
    ],
    "Build agent-driven workflows using Microsoft Foundry": [
        {"question": "In a complex agent workflow with parallel branches, what is the optimal strategy for handling partial failures without reprocessing completed work?", "options": ["Restart everything", "Implement checkpointing at branch boundaries with compensation logic that rolls back only failed branches", "Ignore failures", "Sequential only"], "answer": 1, "explanation": "Checkpointing and compensation logic enable efficient recovery from partial failures in complex workflows."},
        {"question": "How should workflow state be managed in Foundry to support both transient failures and long-running operations spanning days?", "options": ["In-memory only", "Persistent state storage with event sourcing, allowing state reconstruction and enabling pause/resume capabilities", "No state tracking", "Local files only"], "answer": 1, "explanation": "Persistent, event-sourced state enables long-running workflows with full recovery capabilities."},
        {"question": "When implementing a workflow with conditional branching based on agent decisions, what prevents inconsistent outcomes across identical inputs?", "options": ["Nothing, randomness is expected", "Implement deterministic decision logic with seed-based randomization, decision logging, and replay capabilities", "Remove conditions", "Always use the same path"], "answer": 1, "explanation": "Deterministic logic with logging enables reproducibility and debugging of complex branching workflows."},
        {"question": "How should timeouts be configured in Foundry workflows to balance responsiveness with reliability?", "options": ["One fixed timeout for all operations", "Implement operation-specific timeouts with exponential backoff, escalation policies, and SLA-based timeout hierarchies", "No timeouts", "Random durations"], "answer": 1, "explanation": "Differentiated timeout strategies are essential for complex workflows with varied operation characteristics."},
        {"question": "In a workflow with external service dependencies, what pattern prevents cascading failures across the workflow?", "options": ["Call all at once", "Circuit breaker pattern with bulkheads, fallback services, and graceful degradation strategies", "Ignore failures", "Sequential dependencies only"], "answer": 1, "explanation": "Circuit breakers and bulkheads prevent cascading failures in workflows with external dependencies."},
    ],
    "Develop an AI agent with Microsoft Agent Framework": [
        {"question": "When using semantic kernel for agent planning, what is the relationship between function parameterization and the agent's ability to reason about tool usage?", "options": ["Parameters don't affect reasoning", "Well-parameterized functions with clear constraints enable the agent to reason about preconditions, postconditions, and side effects", "All parameters are equal", "Reasoning doesn't depend on parameters"], "answer": 1, "explanation": "Function parameterization directly affects the agent's ability to reason about tool applicability and constraints."},
        {"question": "How does the semantic kernel's planner handle situations where multiple function combinations could achieve the same goal?", "options": ["Randomly picks one", "Evaluates functions using cost models, analyzes execution paths, and selects based on efficiency and resource constraints", "Always uses first", "Refuses to choose"], "answer": 1, "explanation": "Advanced planners evaluate multiple paths and select based on cost models and resource constraints."},
        {"question": "In an agent framework, what architectural decision is most critical for preventing infinite loops in recursive function calls?", "options": ["No safeguards needed", "Implement call depth tracking, loop detection algorithms, and semantic analysis of whether sub-calls progress toward the goal", "Trust the agent", "No recursion allowed"], "answer": 1, "explanation": "Active loop detection and progress monitoring are essential safeguards in recursive agent scenarios."},
        {"question": "How should memory systems in agent frameworks handle conflicting information from different sources within the same context?", "options": ["Use latest information always", "Implement source credibility tracking, timestamp-based resolution, and explicit conflict surfacing to the agent", "Ignore conflicts", "Merge everything"], "answer": 1, "explanation": "Credibility tracking and conflict surfacing enable agents to reason about information reliability."},
        {"question": "When designing agent functions for a semantic kernel, what property is most important for enabling effective chaining across multiple steps?", "options": ["Speed", "Clear input/output contracts with minimal side effects, enabling composition and reusability", "Complexity", "Magic behavior"], "answer": 1, "explanation": "Clear contracts enable function composition and predictable agent behavior in multi-step workflows."},
    ],
    "Orchestrate a multi-agent solution using the Microsoft Agent Framework": [
        {"question": "In a multi-agent system, what problem does the consensus algorithm solve, and when is it necessary?", "options": ["No consensus needed", "Prevents agents from diverging in their understanding of system state; critical for distributed decision-making and conflict resolution", "Only for voting", "Agents never disagree"], "answer": 1, "explanation": "Consensus mechanisms prevent system inconsistencies in distributed multi-agent architectures."},
        {"question": "How should agent specialization be balanced against the overhead of inter-agent communication in multi-agent orchestration?", "options": ["Maximize specialization always", "Analyze communication graphs and apply minimal specialization that improves solution quality above communication cost threshold", "Minimize communication only", "No specialization needed"], "answer": 1, "explanation": "The specialization-communication tradeoff requires analysis of problem-specific characteristics."},
        {"question": "When orchestrating agents that may deadlock waiting for each other's responses, what detection and recovery mechanism should be implemented?", "options": ["Ignore deadlocks", "Resource-wait-for graphs with cycle detection, combined with timeout-based recovery and agent restart strategies", "Just wait longer", "No deadlocks possible"], "answer": 1, "explanation": "Active deadlock detection with timeout recovery is essential for reliability in multi-agent systems."},
        {"question": "How should role-based specialization be implemented to prevent agents from becoming knowledge bottlenecks in orchestrated workflows?", "options": ["One agent does everything", "Implement role replication with load balancing, capability-based routing, and redundancy for critical roles", "All agents identical", "Sequential roles only"], "answer": 1, "explanation": "Role replication and load balancing prevent single points of failure in multi-agent systems."},
        {"question": "In a multi-agent system with emergent behaviors, what monitoring and logging strategy enables root cause analysis?", "options": ["Standard logs only", "Implement interaction graphs showing agent message patterns, coupled with causal analysis tools and behavior replay capabilities", "No monitoring", "One global log"], "answer": 1, "explanation": "Interaction graph visualization with causal analysis is critical for understanding emergent behavior in multi-agent systems."},
    ],
    "Discover Azure AI Agents with A2A": [
        {"question": "In Azure AI Agents architecture, what is the distinction between stateless orchestration and stateful agent execution, and how does this affect scaling?", "options": ["No distinction", "Stateless orchestration enables horizontal scaling while stateful execution requires sticky sessions or distributed state management", "Same thing", "Scaling doesn't matter"], "answer": 1, "explanation": "The stateless/stateful distinction is critical for designing scalable Azure AI Agent deployments."},
        {"question": "When implementing A2A (Agent-to-Agent) communication in Azure, what protocol considerations ensure reliable message delivery under network partitions?", "options": ["TCP is sufficient", "Implement message queuing with at-least-once semantics, idempotency keys, and acknowledgment protocols that survive partition healing", "UDP is faster", "No reliability needed"], "answer": 1, "explanation": "Queue-based communication with idempotency is essential for reliable A2A interactions."},
        {"question": "How should Azure AI Agents be configured to handle long-running operations that may exceed API timeout limits?", "options": ["Just hope it completes", "Implement async job patterns with polling/webhook callbacks, status queries, and graceful timeout handling", "Increase timeout indefinitely", "Don't use long operations"], "answer": 1, "explanation": "Async patterns with callbacks are the standard for handling long-running operations in cloud services."},
        {"question": "What is the relationship between Azure AI Agents' managed identity and the scope of operations they can perform safely without additional authentication?", "options": ["No relationship", "Managed identity defines the scope of Azure resource access; broader scope increases attack surface; follow principle of least privilege", "All operations allowed", "No security model"], "answer": 1, "explanation": "Least-privilege managed identity configuration is essential for secure Azure AI Agent deployments."},
        {"question": "When Azure AI Agents integrate with Azure Cognitive Services, what caching strategy maximizes performance while respecting API quotas?", "options": ["Cache everything indefinitely", "Implement service-specific caching with TTLs, cache warming strategies, and quota-aware request batching", "Never cache", "Cache randomly"], "answer": 1, "explanation": "Service-aware caching with quota management optimizes both performance and cost in Azure deployments."},
    ],
}


def fallback_questions(count: int):
    """Return fallback quiz questions when generation fails."""
    return _randomize_question_set(QUIZ_QUESTIONS[:count])


def fallback_flashcards(module_title: str, count: int):
    """Return fallback flashcards when generation fails."""
    # Simple fallback: create basic flashcards from the module title
    flashcards = [
        {
            "front": f"What is the main topic of '{module_title}'?",
            "back": module_title,
        },
    ]
    return flashcards[:count]


def fallback_detailed_questions(module_title: str, count: int):
    """Return fallback detailed questions for a specific module when generation fails."""
    questions = MODULE_QUESTIONS.get(module_title, QUIZ_QUESTIONS)
    return _randomize_question_set(questions[:count])


def fallback_easy_module_questions(module_title: str, module_url: str, count: int):
    """Return easy, module-specific questions."""
    bank = [
        {
            "question": f"[{module_title}] What is the main focus of this module?",
            "options": [
                module_title,
                "Database indexing for SQL",
                "Network packet routing",
                "Desktop hardware repair",
            ],
            "answer": 0,
            "explanation": "The module title itself states the primary focus.",
        },
        {
            "question": f"[{module_title}] Which choice best represents the expected learning outcome?",
            "options": [
                "Memorize random cloud terms",
                "Understand and apply the module topic in an AI-agent scenario",
                "Build a gaming PC",
                "Configure printer drivers",
            ],
            "answer": 1,
            "explanation": "Microsoft Learn modules focus on practical understanding and application.",
        },
        {
            "question": f"[{module_title}] Where should you go for the official step-by-step module content?",
            "options": [
                "Stack Overflow comments",
                "Social media posts",
                module_url,
                "Random blog archive",
            ],
            "answer": 2,
            "explanation": "The official Microsoft Learn module page is the correct source.",
        },
        {
            "question": f"[{module_title}] Why is this module relevant for AI3026 learners?",
            "options": [
                "It is unrelated to AI agents",
                "It replaces all Azure services",
                "It teaches core concepts used when building practical AI-agent solutions",
                "It is only for hardware technicians",
            ],
            "answer": 2,
            "explanation": "Each module builds skills that map to practical AI-agent development workflows.",
        },
        {
            "question": f"[{module_title}] What is the best study strategy for this module?",
            "options": [
                "Skip all exercises",
                "Read once and ignore labs",
                "Complete module exercises and validate understanding with quizzes",
                "Only memorize headings",
            ],
            "answer": 2,
            "explanation": "Practice plus self-assessment leads to better retention and exam readiness.",
        },
        {
            "question": f"[{module_title}] Which action helps avoid mistakes when implementing this module topic?",
            "options": [
                "Guess configuration values",
                "Follow module guidance and verify results step-by-step",
                "Disable validation checks",
                "Ignore prerequisites",
            ],
            "answer": 1,
            "explanation": "Following guided steps and verification prevents common implementation mistakes.",
        },
        {
            "question": f"[{module_title}] In a real project, when should this module knowledge be applied?",
            "options": [
                "Only after project completion",
                "Never, it is theory only",
                "During design and implementation of AI-agent features",
                "Only for final presentation slides",
            ],
            "answer": 2,
            "explanation": "These concepts are intended for real design and implementation decisions.",
        },
        {
            "question": f"[{module_title}] Which statement is true about hands-on labs in this module?",
            "options": [
                "Labs are optional and have no learning value",
                "Labs help convert theory into practical skills",
                "Labs are only for advanced researchers",
                "Labs are unrelated to module objectives",
            ],
            "answer": 1,
            "explanation": "Hands-on labs are designed to reinforce concepts through practice.",
        },
        {
            "question": f"[{module_title}] What is the simplest way to confirm you understood this module?",
            "options": [
                "Skip review and move on",
                "Answer module quiz questions correctly and explain your choices",
                "Copy answers from others",
                "Only read summaries",
            ],
            "answer": 1,
            "explanation": "Correct answers with reasoning indicate genuine understanding.",
        },
        {
            "question": f"[{module_title}] Which resource is most reliable for updates to this module topic?",
            "options": [
                "Outdated forum screenshots",
                "Unofficial notes",
                "Microsoft Learn module and linked official docs",
                "Anonymous chat messages",
            ],
            "answer": 2,
            "explanation": "Official Learn content is maintained and aligned with current guidance.",
        },
    ]
    safe_count = max(1, min(count, len(bank)))
    return _randomize_question_set(bank[:safe_count])


def generate_ai103_questions(count: int):
    """Stub for question generation - returns fallback."""
    return fallback_questions(count)


def generate_module_questions(module_title: str, module_url: str, count: int):
    """Stub for module-specific question generation."""
    return fallback_detailed_questions(module_title, count)


def generate_module_flashcards(module_title: str, module_url: str, count: int):
    """Stub for flashcard generation."""
    return fallback_flashcards(module_title, count)


def _ensure_question_option_explanations(question: dict) -> dict:
    """Ensure each question has per-option explanations (correct and incorrect reasons)."""
    if not isinstance(question, dict):
        return question

    options = question.get("options")
    answer = question.get("answer")
    if not isinstance(options, list) or not options:
        return question
    if not isinstance(answer, int) or answer < 0 or answer >= len(options):
        return question

    existing = question.get("option_explanations")
    if isinstance(existing, list) and len(existing) == len(options):
        return question

    correct_option = str(options[answer])
    base = str(question.get("explanation", "")).strip()
    if not base:
        base = f"{correct_option} is the best answer based on the module concepts tested in this question."

    option_explanations = []
    for idx, option in enumerate(options):
        option_text = str(option)
        if idx == answer:
            option_explanations.append(base)
        else:
            option_explanations.append(
                f"{option_text} is not the best answer here. {correct_option} is correct because it directly satisfies the question requirement."
            )

    question["option_explanations"] = option_explanations
    return question


def _randomize_question_options(question: dict):
    """Shuffle options and remap the correct answer index for one question."""
    question = _ensure_question_option_explanations(question)
    options = question.get("options", [])
    answer = question.get("answer")
    option_explanations = question.get("option_explanations", [])

    if not isinstance(options, list) or len(options) != 4:
        return question
    if not isinstance(answer, int) or answer < 0 or answer >= len(options):
        return question

    if not isinstance(option_explanations, list) or len(option_explanations) != len(options):
        option_explanations = [""] * len(options)

    indices = list(range(len(options)))
    random.shuffle(indices)

    randomized = {
        **question,
        "options": [options[i] for i in indices],
        "option_explanations": [option_explanations[i] for i in indices],
        "answer": indices.index(answer),
    }

    return randomized


def _randomize_question_set(questions: list):
    """Apply option randomization to each question in a list."""
    randomized = []
    for question in questions:
        if isinstance(question, dict):
            randomized.append(_randomize_question_options(question))
        else:
            randomized.append(question)
    return randomized


def _get_question_hash(question: dict) -> str:
    """Create a stable unique identifier for a question based on its text."""
    question_text = str(question.get("question", "")).strip()
    return hashlib.md5(question_text.encode()).hexdigest()


def _get_used_questions(session_id: str) -> set:
    """Get set of all used question hashes for this session (global across all modules)."""
    if session_id not in state["used_questions"]:
        state["used_questions"][session_id] = set()
    return state["used_questions"][session_id]


def _mark_questions_as_used(session_id: str, questions: list) -> None:
    """Mark questions as used globally in this session."""
    used = _get_used_questions(session_id)
    for q in questions:
        _ensure_question_option_explanations(q)
        q_hash = _get_question_hash(q)
        used.add(q_hash)


def _filter_used_questions(questions: list, used_hashes: set) -> list:
    """Filter out questions that have already been used."""
    filtered = []
    for q in questions:
        q_hash = _get_question_hash(q)
        if q_hash not in used_hashes:
            filtered.append(q)
    return filtered


def _clear_session_questions(session_id: str) -> None:
    """Clear all used questions for a session."""
    if session_id in state["used_questions"]:
        state["used_questions"][session_id].clear()


def _attach_learn_links_to_questions(questions: list, learn_url: str) -> list:
    """Attach a relevant Microsoft Learn link to each correct-answer explanation."""
    if not isinstance(questions, list):
        return questions

    safe_url = str(learn_url or LEARN_SOURCE_ROOT).strip() or LEARN_SOURCE_ROOT
    learn_anchor = (
        f'See Microsoft Learn: <a href="{safe_url}" target="_blank" '
        f'rel="noopener noreferrer">{safe_url}</a>'
    )

    for q in questions:
        if not isinstance(q, dict):
            continue

        _ensure_question_option_explanations(q)
        q["learn_link"] = safe_url

        options = q.get("options", [])
        answer = q.get("answer")
        option_explanations = q.get("option_explanations", [])

        if (
            isinstance(answer, int)
            and 0 <= answer < len(options)
            and isinstance(option_explanations, list)
            and answer < len(option_explanations)
        ):
            correct_reason = str(option_explanations[answer])
            if "learn.microsoft.com" not in correct_reason.lower():
                option_explanations[answer] = f"{correct_reason}<br>{learn_anchor}".strip()

    return questions


# --- Routes ---

@app.route("/")
def home():
    """Landing page - learner enters session key, instructor clicks login."""
    return render_template("landing.html")


@app.route("/join", methods=["POST"])
def join_session():
    """Validate a learner's session key and redirect to the quiz view."""
    key = request.form.get("key", "").strip().upper()
    if not key or not is_valid_session(key):
        return render_template("landing.html", error="Invalid or expired session key. Ask your instructor for the current key.")
    session = state["live_sessions"][key]
    target = "/flashcards" if session.get("mode") == "flashcards" else "/session"
    res = make_response(redirect(target))
    res.set_cookie("learner_session_key", key, httponly=True, samesite="Lax")
    return res


@app.route("/session")
def session_view():
    """Learner quiz view - only accessible with a valid session key cookie."""
    key = request.cookies.get("learner_session_key", "")
    if not is_valid_session(key):
        return redirect("/")
    session = state["live_sessions"][key]
    if session.get("mode") == "flashcards":
        return redirect("/flashcards")
    return render_template("session.html", session=session, key=key)


@app.route("/quiz")
def quiz_page():
    """Serve the easy AI3026 objective quiz page."""
    if not check_instructor_auth(request):
        key = request.cookies.get("learner_session_key", "")
        if not is_valid_session(key):
            return redirect("/")
        if state["live_sessions"][key].get("mode") == "flashcards":
            return redirect("/flashcards")
    return render_template("ai3026-quiz.html")


@app.route("/quiz-modules")
def quiz_modules_page():
    """Serve the module-based AI3026 quiz page."""
    if not check_instructor_auth(request):
        key = request.cookies.get("learner_session_key", "")
        if not is_valid_session(key):
            return redirect("/")
        if state["live_sessions"][key].get("mode") == "flashcards":
            return redirect("/flashcards")
    return render_template("ai3026-modules-quiz.html")


@app.route("/flashcards")
def flashcards_page():
    """Serve the module-based flashcards page."""
    is_instructor = check_instructor_auth(request)
    flashcard_session_mode = False
    flashcard_modules = list(range(1, len(AI103_MODULES) + 1))
    if not is_instructor:
        key = request.cookies.get("learner_session_key", "")
        if not is_valid_session(key):
            return redirect("/")
        learner_session = state["live_sessions"][key]
        if learner_session.get("mode") != "flashcards":
            return redirect("/session")
        flashcard_session_mode = True
        flashcard_modules = learner_session.get("modules", flashcard_modules)
    return render_template(
        "ai3026-flashcards.html",
        is_instructor=is_instructor,
        flashcard_session_mode=flashcard_session_mode,
        flashcard_modules=flashcard_modules,
    )


@app.route("/instructor", methods=["GET"])
def instructor_page():
    """Instructor dashboard - password protected."""
    if not check_instructor_auth(request):
        return render_template("instructor_login.html")
    sessions = {k: v for k, v in state["live_sessions"].items() if v.get("active")}
    return render_template("instructor.html", sessions=sessions, modules=AI103_MODULES)


@app.route("/instructor/login", methods=["POST"])
def instructor_login():
    """Validate instructor password and set auth cookie."""
    password = request.form.get("password", "")
    if password != INSTRUCTOR_PASSWORD:
        return render_template("instructor_login.html", error="Incorrect password.")
    token = hashlib.sha256(INSTRUCTOR_PASSWORD.encode()).hexdigest()
    res = make_response(redirect("/instructor"))
    res.set_cookie("instructor_auth", token, httponly=True, samesite="Lax")
    return res


@app.route("/instructor/logout", methods=["POST"])
def instructor_logout():
    res = make_response(redirect("/"))
    res.delete_cookie("instructor_auth")
    return res


@app.route("/api/quiz/modules", methods=["GET"])
def quiz_modules():
    """List AI-103 modules for module-based quiz generation."""
    modules = [
        {
            "id": idx + 1,
            "title": module["title"],
            "url": module["url"],
        }
        for idx, module in enumerate(AI103_MODULES)
    ]
    return jsonify({"modules": modules})


@app.route("/api/quiz/questions/module", methods=["GET"])
def quiz_questions_by_module():
    """Generate quiz questions for one selected module with rich option explanations."""
    module_id = request.args.get("module_id", type=int)
    count = request.args.get("count", default=10, type=int)
    fresh = request.args.get("fresh", default=True, type=bool)

    if module_id is None or module_id < 1 or module_id > len(AI103_MODULES):
        return jsonify({"error": "module_id is out of range"}), 400

    selected = AI103_MODULES[module_id - 1]
    safe_count = max(1, min(count, 25))
    
    # Get session ID to track used questions globally
    session_id = get_or_create_session_id(request.cookies.get(SESSION_COOKIE))
    used_questions = _get_used_questions(session_id)

    if not fresh:
        fallback_qs = fallback_detailed_questions(selected["title"], safe_count * 3)
        # Filter out already used questions
        available_qs = _filter_used_questions(fallback_qs, used_questions)
        if not available_qs:
            # If all used, reset for this session
            _clear_session_questions(session_id)
            available_qs = fallback_qs
        final_qs = available_qs[:safe_count]
        final_qs = _attach_learn_links_to_questions(final_qs, selected.get("url", LEARN_SOURCE_ROOT))
        _mark_questions_as_used(session_id, final_qs)
        res = make_response(jsonify({
            "module": {"id": module_id, **selected},
            "questions": final_qs,
            "source": "fallback",
        }))
        res.set_cookie(SESSION_COOKIE, session_id, httponly=True, samesite="Lax")
        return res

    try:
        questions = generate_module_questions(selected["title"], selected["url"], safe_count * 3)
        if not questions:
            raise ValueError("Generated 0 valid module questions")
        # Filter out already used questions
        available_qs = _filter_used_questions(questions, used_questions)
        if not available_qs:
            # If all used, reset for this session
            _clear_session_questions(session_id)
            available_qs = questions
        final_qs = available_qs[:safe_count]
        final_qs = _attach_learn_links_to_questions(final_qs, selected.get("url", LEARN_SOURCE_ROOT))
        _mark_questions_as_used(session_id, final_qs)
        res = make_response(jsonify({
            "module": {"id": module_id, **selected},
            "questions": final_qs,
            "source": "ai103-module",
        }))
        res.set_cookie(SESSION_COOKIE, session_id, httponly=True, samesite="Lax")
        return res
    except Exception:
        fallback_qs = fallback_detailed_questions(selected["title"], safe_count * 3)
        available_qs = _filter_used_questions(fallback_qs, used_questions)
        if not available_qs:
            _clear_session_questions(session_id)
            available_qs = fallback_qs
        final_qs = available_qs[:safe_count]
        final_qs = _attach_learn_links_to_questions(final_qs, selected.get("url", LEARN_SOURCE_ROOT))
        _mark_questions_as_used(session_id, final_qs)
        res = make_response(jsonify({
            "module": {"id": module_id, **selected},
            "questions": final_qs,
            "source": "fallback",
        }))
        res.set_cookie(SESSION_COOKIE, session_id, httponly=True, samesite="Lax")
        return res


@app.route("/api/quiz/questions/module/easy", methods=["GET"])
def quiz_questions_by_module_easy():
    """Generate easy quiz questions for one selected module without detailed explanations."""
    module_id = request.args.get("module_id", type=int)
    count = request.args.get("count", default=5, type=int)
    fresh = request.args.get("fresh", default=True, type=bool)

    if module_id is None or module_id < 1 or module_id > len(AI103_MODULES):
        return jsonify({"error": "module_id is out of range"}), 400

    selected = AI103_MODULES[module_id - 1]
    safe_count = max(1, min(count, 10))

    session_id = get_or_create_session_id(request.cookies.get(SESSION_COOKIE))
    used_questions = _get_used_questions(session_id)

    easy_qs = fallback_easy_module_questions(selected["title"], selected["url"], safe_count * 3)
    available_qs = _filter_used_questions(easy_qs, used_questions)

    if not available_qs:
        _clear_session_questions(session_id)
        easy_qs = fallback_easy_module_questions(selected["title"], selected["url"], safe_count * 3)
        available_qs = _filter_used_questions(easy_qs, _get_used_questions(session_id))

    final_qs = available_qs[:safe_count]

    _mark_questions_as_used(session_id, final_qs)

    # The easy quiz does not need option-level explanation payload.
    for q in final_qs:
        if isinstance(q, dict):
            q.pop("option_explanations", None)
            q.pop("learn_link", None)

    res = make_response(jsonify({
        "module": {"id": module_id, **selected},
        "questions": final_qs,
        "source": "ai103-module-easy",
        "fresh": fresh,
    }))
    res.set_cookie(SESSION_COOKIE, session_id, httponly=True, samesite="Lax")
    return res

@app.route("/api/quiz/questions", methods=["GET"])
def quiz_questions():
    """Return quiz questions from AI-103 modules, with local fallback."""
    count = request.args.get("count", default=15, type=int)
    fresh = request.args.get("fresh", default=True, type=bool)

    safe_count = max(1, min(count, 40))
    
    session_id = get_or_create_session_id(request.cookies.get(SESSION_COOKIE))
    used_questions = _get_used_questions(session_id)

    if not fresh:
        fallback_qs = fallback_questions(safe_count * 3)
        available_qs = _filter_used_questions(fallback_qs, used_questions)
        if not available_qs:
            _clear_session_questions(session_id)
            available_qs = fallback_qs
        final_qs = available_qs[:safe_count]
        final_qs = _attach_learn_links_to_questions(final_qs, LEARN_SOURCE_ROOT)
        _mark_questions_as_used(session_id, final_qs)
        res = make_response(jsonify({
            "questions": final_qs,
            "source": "fallback",
            "moduleCount": len(AI103_MODULES),
        }))
        res.set_cookie(SESSION_COOKIE, session_id, httponly=True, samesite="Lax")
        return res

    try:
        questions = generate_ai103_questions(safe_count * 3)
        if not questions:
            raise ValueError("Generated 0 valid questions")
        available_qs = _filter_used_questions(questions, used_questions)
        if not available_qs:
            _clear_session_questions(session_id)
            available_qs = questions
        final_qs = available_qs[:safe_count]
        final_qs = _attach_learn_links_to_questions(final_qs, LEARN_SOURCE_ROOT)
        _mark_questions_as_used(session_id, final_qs)
        res = make_response(jsonify({
            "questions": final_qs,
            "source": "learn-path-develop-ai-agents-azure",
            "moduleCount": len(AI103_MODULES),
        }))
        res.set_cookie(SESSION_COOKIE, session_id, httponly=True, samesite="Lax")
        return res
    except Exception:
        fallback_qs = fallback_questions(safe_count * 3)
        available_qs = _filter_used_questions(fallback_qs, used_questions)
        if not available_qs:
            _clear_session_questions(session_id)
            available_qs = fallback_qs
        final_qs = available_qs[:safe_count]
        final_qs = _attach_learn_links_to_questions(final_qs, LEARN_SOURCE_ROOT)
        _mark_questions_as_used(session_id, final_qs)
        res = make_response(jsonify({
            "questions": final_qs,
            "source": "fallback",
            "moduleCount": len(AI103_MODULES),
        }))
        res.set_cookie(SESSION_COOKIE, session_id, httponly=True, samesite="Lax")
        return res


@app.route("/api/quiz/save", methods=["POST"])
def save_quiz_results():
    """Save quiz questions and answers to a text file."""
    if not check_instructor_auth(request):
        return jsonify({"error": "unauthorized"}), 403

    data = request.get_json() or {}

    questions = data.get("questions", [])
    answers = data.get("answers", [])
    module_title = data.get("module_title", "Quiz")
    source = data.get("source", "unknown")

    if not questions or not isinstance(questions, list):
        return jsonify({"error": "questions are required"}), 400

    if not isinstance(answers, list) or len(answers) != len(questions):
        return jsonify({"error": "answers length must match questions length"}), 400

    export_dir = Path(__file__).parent / "quiz_exports"
    export_dir.mkdir(exist_ok=True)

    timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
    file_name = f"quiz_{timestamp}_{uuid.uuid4().hex[:8]}.txt"
    file_path = export_dir / file_name

    lines = []
    lines.append("AI-103 Quiz Export")
    lines.append(f"Saved at: {datetime.now().isoformat(timespec='seconds')}")
    lines.append(f"Module: {module_title}")
    lines.append(f"Source: {source}")
    lines.append("")

    score = 0
    for idx, (q, chosen) in enumerate(zip(questions, answers), start=1):
        options = q.get("options", [])
        answer_idx = q.get("answer")

        if isinstance(chosen, int) and isinstance(answer_idx, int) and chosen == answer_idx:
            score += 1

        lines.append(f"Q{idx}. {q.get('question', '')}")
        for opt_idx, opt in enumerate(options):
            marker = ""
            if isinstance(answer_idx, int) and opt_idx == answer_idx:
                marker += " [Correct]"
            if isinstance(chosen, int) and opt_idx == chosen:
                marker += " [Selected]"
            lines.append(f"  {chr(65 + opt_idx)}. {opt}{marker}")

        lines.append(f"  Explanation: {q.get('explanation', '')}")

        option_explanations = q.get("option_explanations", [])
        if isinstance(option_explanations, list) and len(option_explanations) == 4:
            lines.append("  Option analysis:")
            for opt_idx, detail in enumerate(option_explanations):
                lines.append(f"    {chr(65 + opt_idx)}: {detail}")
        lines.append("")

    lines.insert(4, f"Score: {score}/{len(questions)}")

    file_path.write_text("\n".join(lines), encoding="utf-8")
    return jsonify({
        "status": "ok",
        "file": str(file_path),
        "score": score,
        "total": len(questions),
    })


@app.route("/api/flashcards/modules", methods=["GET"])
def flashcard_modules():
    """List modules for flashcard generation."""
    allowed_ids = set(range(1, len(AI103_MODULES) + 1))
    if not check_instructor_auth(request):
        _, learner_session = get_active_learner_session(expected_mode="flashcards")
        if not learner_session:
            return jsonify({"error": "invalid or inactive flashcard session"}), 403
        allowed_ids = set(learner_session.get("modules", []))

    modules = [
        {
            "id": idx + 1,
            "title": module["title"],
            "url": module["url"],
        }
        for idx, module in enumerate(AI103_MODULES)
        if (idx + 1) in allowed_ids
    ]
    return jsonify({"modules": modules})


@app.route("/api/flashcards/module", methods=["GET"])
def flashcards_by_module():
    """Generate flashcards for one selected module."""
    module_id = request.args.get("module_id", type=int)
    count = request.args.get("count", default=10, type=int)
    fresh = request.args.get("fresh", default=True, type=bool)

    allowed_ids = set(range(1, len(AI103_MODULES) + 1))
    if not check_instructor_auth(request):
        _, learner_session = get_active_learner_session(expected_mode="flashcards")
        if not learner_session:
            return jsonify({"error": "invalid or inactive flashcard session"}), 403
        allowed_ids = set(learner_session.get("modules", []))

    if module_id is None:
        module_id = min(allowed_ids) if allowed_ids else 1

    if module_id is None or module_id < 1 or module_id > len(AI103_MODULES):
        return jsonify({"error": "module_id is out of range"}), 400
    if module_id not in allowed_ids:
        return jsonify({"error": "module is not enabled for this flashcard session"}), 403

    selected = AI103_MODULES[module_id - 1]
    safe_count = max(1, min(count, 25))
    
    # Get session ID to track used flashcards
    session_id = get_or_create_session_id(request.cookies.get(SESSION_COOKIE))
    used_cards = _get_used_questions(session_id)

    if not fresh:
        fallback_fc = fallback_flashcards(selected["title"], safe_count * 3)
        available_fc = _filter_used_questions(fallback_fc, used_cards)
        if not available_fc:
            _clear_session_questions(session_id)
            available_fc = fallback_fc
        final_fc = available_fc[:safe_count]
        _mark_questions_as_used(session_id, final_fc)
        res = make_response(jsonify({
            "module": {"id": module_id, **selected},
            "flashcards": final_fc,
            "source": "fallback",
        }))
        res.set_cookie(SESSION_COOKIE, session_id, httponly=True, samesite="Lax")
        return res

    try:
        flashcards = generate_module_flashcards(selected["title"], selected["url"], safe_count * 3)
        if not flashcards:
            raise ValueError("Generated 0 valid flashcards")
        available_fc = _filter_used_questions(flashcards, used_cards)
        if not available_fc:
            _clear_session_questions(session_id)
            available_fc = flashcards
        final_fc = available_fc[:safe_count]
        _mark_questions_as_used(session_id, final_fc)
        res = make_response(jsonify({
            "module": {"id": module_id, **selected},
            "flashcards": final_fc,
            "source": "learn-path-develop-ai-agents-azure",
        }))
        res.set_cookie(SESSION_COOKIE, session_id, httponly=True, samesite="Lax")
        return res
    except Exception:
        fallback_fc = fallback_flashcards(selected["title"], safe_count * 3)
        available_fc = _filter_used_questions(fallback_fc, used_cards)
        if not available_fc:
            _clear_session_questions(session_id)
            available_fc = fallback_fc
        final_fc = available_fc[:safe_count]
        _mark_questions_as_used(session_id, final_fc)
        res = make_response(jsonify({
            "module": {"id": module_id, **selected},
            "flashcards": final_fc,
            "source": "fallback",
        }))
        res.set_cookie(SESSION_COOKIE, session_id, httponly=True, samesite="Lax")
        return res


@app.route("/api/flashcards/save", methods=["POST"])
def save_flashcards():
    """Save flashcards to a text file."""
    if not check_instructor_auth(request):
        return jsonify({"error": "unauthorized"}), 403

    data = request.get_json() or {}

    flashcards = data.get("flashcards", [])
    module_title = data.get("module_title", "Flashcards")
    source = data.get("source", "unknown")

    if not isinstance(flashcards, list) or not flashcards:
        return jsonify({"error": "flashcards are required"}), 400

    export_dir = Path(__file__).parent / "quiz_exports"
    export_dir.mkdir(exist_ok=True)

    timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
    file_name = f"flashcards_{timestamp}_{uuid.uuid4().hex[:8]}.txt"
    file_path = export_dir / file_name

    lines = []
    lines.append("AI-103 Flashcards Export")
    lines.append(f"Saved at: {datetime.now().isoformat(timespec='seconds')}")
    lines.append(f"Module: {module_title}")
    lines.append(f"Source: {source}")
    lines.append("")

    for idx, card in enumerate(flashcards, start=1):
        front = str(card.get("front", "")).strip()
        back = str(card.get("back", "")).strip()
        if not front or not back:
            continue
        lines.append(f"Card {idx}")
        lines.append(f"Front: {front}")
        lines.append(f"Back: {back}")
        lines.append("")

    if len(lines) <= 5:
        return jsonify({"error": "no valid flashcards to save"}), 400

    file_path.write_text("\n".join(lines), encoding="utf-8")
    return jsonify({
        "status": "ok",
        "file": str(file_path),
        "total": len([c for c in flashcards if c.get("front") and c.get("back")]),
    })


@app.route("/api/session/start", methods=["POST"])
def start_session():
    """Create a new live session. Instructor only."""
    if not check_instructor_auth(request):
        return jsonify({"error": "unauthorized"}), 403

    data = request.get_json() or {}
    if data.get("mode") == "flashcards":
        return jsonify({"error": "Use /api/session/start-flashcards for flashcard-only sessions"}), 400
    key = generate_session_key()
    while key in state["live_sessions"]:
        key = generate_session_key()

    modules = data.get("modules", [1])
    if not isinstance(modules, list) or not modules:
        modules = [1]

    state["live_sessions"][key] = {
        "active": True,
        "mode": data.get("mode", "quiz"),
        "modules": modules,
        "question_count": int(data.get("question_count", 5)),
        "timer_seconds": int(data.get("timer_seconds", 60)),
        "current_question": None,
        "current_question_pushed_at": None,
        "answer_revealed": False,
        "learners": set(),
        "answers": {},
        "submitted_for_question": set(),
        "created_at": datetime.now(),
    }
    return jsonify({"key": key})


@app.route("/api/session/start-flashcards", methods=["POST"])
def start_flashcards_session():
    """Create a flashcards-only session with a dedicated key. Instructor only."""
    if not check_instructor_auth(request):
        return jsonify({"error": "unauthorized"}), 403

    data = request.get_json() or {}
    key = generate_session_key()
    while key in state["live_sessions"]:
        key = generate_session_key()

    requested_count = int(data.get("card_count", 25))
    safe_count = max(5, min(requested_count, 25))
    all_modules = list(range(1, len(AI103_MODULES) + 1))

    state["live_sessions"][key] = {
        "active": True,
        "mode": "flashcards",
        "modules": all_modules,
        "question_count": safe_count,
        "timer_seconds": 60,
        "current_question": None,
        "current_question_pushed_at": None,
        "answer_revealed": False,
        "learners": set(),
        "answers": {},
        "submitted_for_question": set(),
        "created_at": datetime.now(),
    }
    return jsonify({"key": key, "mode": "flashcards", "modules": all_modules})


@app.route("/api/session/end-flashcards", methods=["POST"])
def end_flashcards_session():
    """End an active flashcards-only session. Instructor only."""
    if not check_instructor_auth(request):
        return jsonify({"error": "unauthorized"}), 403

    key = (request.get_json() or {}).get("key", "")
    session = state["live_sessions"].get(key)
    if not session or session.get("mode") != "flashcards":
        return jsonify({"error": "flashcard session not found"}), 404

    session["active"] = False
    return jsonify({"status": "ended", "mode": "flashcards"})


@app.route("/api/session/end", methods=["POST"])
def end_session():
    """End an active session. Instructor only."""
    if not check_instructor_auth(request):
        return jsonify({"error": "unauthorized"}), 403

    key = (request.get_json() or {}).get("key", "")
    session = state["live_sessions"].get(key)
    if session:
        session["active"] = False
    return jsonify({"status": "ended"})


@app.route("/api/session/push-question", methods=["POST"])
def push_question():
    """Push a question to all learners in a session. Instructor only."""
    if not check_instructor_auth(request):
        return jsonify({"error": "unauthorized"}), 403

    data = request.get_json() or {}
    key = data.get("key", "")
    question = data.get("question")
    session = state["live_sessions"].get(key)
    if not session or not session["active"]:
        return jsonify({"error": "session not found"}), 404
    if session.get("mode") == "flashcards":
        return jsonify({"error": "flashcard sessions do not support pushed quiz questions"}), 400

    session["current_question"] = question
    session["current_question_pushed_at"] = datetime.now().isoformat()
    session["answer_revealed"] = False
    return jsonify({"status": "pushed"})


@app.route("/api/session/reveal", methods=["POST"])
def reveal_answer():
    """Reveal the answer for the current question. Instructor only."""
    if not check_instructor_auth(request):
        return jsonify({"error": "unauthorized"}), 403

    key = (request.get_json() or {}).get("key", "")
    session = state["live_sessions"].get(key)
    if session:
        session["answer_revealed"] = True
    return jsonify({"status": "revealed"})


@app.route("/api/session/next", methods=["POST"])
def next_question():
    """Clear current question and move learners back to waiting."""
    payload = request.get_json() or {}
    key = payload.get("key", "") or request.cookies.get("learner_session_key", "")

    if not check_instructor_auth(request):
        learner_key = request.cookies.get("learner_session_key", "")
        if not learner_key or learner_key != key or not is_valid_session(learner_key):
            return jsonify({"error": "unauthorized"}), 403

    session = state["live_sessions"].get(key)
    if not session or not session.get("active"):
        return jsonify({"error": "session not found"}), 404

    session["current_question"] = None
    session["current_question_pushed_at"] = None
    session["answer_revealed"] = False
    return jsonify({"status": "next"})


@app.route("/api/session/current-question", methods=["GET"])
def current_question():
    """Learners poll this to get the current question for their session."""
    key = request.args.get("key") or request.cookies.get("learner_session_key", "")
    if not is_valid_session(key):
        return jsonify({"error": "invalid session"}), 403

    session = state["live_sessions"][key]
    session_id = request.cookies.get(SESSION_COOKIE, str(uuid.uuid4()))
    session.setdefault("learners", set()).add(session_id)

    # Get learner's own score
    session_id = request.cookies.get(SESSION_COOKIE, str(uuid.uuid4()))
    learner_answers = session.get("answers", {}).get(session_id, {})
    my_score = learner_answers.get("score", 0)
    my_total = learner_answers.get("total", 0)

    res = make_response(jsonify({
        "question": session.get("current_question"),
        "pushed_at": session.get("current_question_pushed_at"),
        "answer_revealed": session.get("answer_revealed", False),
        "timer_seconds": session.get("timer_seconds", 60),
        "active": session.get("active", False),
        "mode": session.get("mode", "quiz"),
        "my_score": my_score,
        "my_total": my_total,
    }))
    res.headers["Cache-Control"] = "no-store, no-cache, must-revalidate, max-age=0"
    res.headers["Pragma"] = "no-cache"
    res.headers["Expires"] = "0"
    return res


@app.route("/api/session/status", methods=["GET"])
def session_status():
    """Instructor polls this for live stats."""
    if not check_instructor_auth(request):
        return jsonify({"error": "unauthorized"}), 403

    key = request.args.get("key", "")
    session = state["live_sessions"].get(key)
    if not session:
        return jsonify({"error": "not found"}), 404

    # Count answered learners and score distribution for current question
    answers = session.get("answers", {})
    current_q = session.get("current_question")
    q_hash = hash(str(current_q)) if current_q else None
    
    answered_count = len(session.get("submitted_for_question", set()))
    learner_count = len(session.get("learners", set()))
    
    # Score distribution for current question
    correct = 0
    incorrect = 0
    for learner_id, learner_data in answers.items():
        last_answer = learner_data.get("last_answer", {})
        if last_answer.get("question_hash") == q_hash:
            if last_answer.get("correct"):
                correct += 1
            else:
                incorrect += 1

    return jsonify({
        "active": session.get("active"),
        "learner_count": learner_count,
        "answered_count": answered_count,
        "correct": correct,
        "incorrect": incorrect,
        "key": key,
    })


@app.route("/api/session/submit-answer", methods=["POST"])
def submit_answer():
    """Learner submits an answer choice for the current question."""
    data = request.get_json() or {}
    key = data.get("key", "")
    chosen = data.get("chosen")
    question_hash = data.get("question_hash")
    
    if not is_valid_session(key):
        return jsonify({"error": "invalid session"}), 403
    
    session = state["live_sessions"][key]
    current_q = session.get("current_question")
    if not current_q:
        return jsonify({"error": "no question"}), 400
    
    # Prevent duplicate submissions for same question
    submission_key = f"{question_hash}"
    if submission_key in session.get("submitted_for_question", set()):
        # Already submitted for this question, return existing score
        session_id = request.cookies.get(SESSION_COOKIE, str(uuid.uuid4()))
        learner_data = session.get("answers", {}).get(session_id, {})
        return jsonify({
            "correct": learner_data.get("last_answer", {}).get("correct", False),
            "score": learner_data.get("score", 0),
            "total": learner_data.get("total", 0),
        })
    
    session.setdefault("submitted_for_question", set()).add(submission_key)
    
    # Get learner session ID
    session_id = request.cookies.get(SESSION_COOKIE, str(uuid.uuid4()))
    session.setdefault("answers", {}).setdefault(session_id, {
        "score": 0,
        "total": 0,
        "last_answer": {},
    })
    
    learner_data = session["answers"][session_id]
    correct_idx = int(current_q.get("answer", -1))
    is_correct = int(chosen) == correct_idx
    
    if is_correct:
        learner_data["score"] += 1
    learner_data["total"] += 1
    learner_data["last_answer"] = {
        "chosen": int(chosen),
        "correct": is_correct,
        "question_hash": question_hash,
    }
    
    return jsonify({
        "correct": is_correct,
        "score": learner_data["score"],
        "total": learner_data["total"],
    })


@app.route("/chat", methods=["POST"])
def chat():
    """Take the typed message, send it to the agent, return the agent's reply."""
    data = request.get_json() or {}
    message = data.get("message", "").strip()

    if not message:
        return jsonify({"error": "message cannot be empty"}), 400

    if not FOUNDRY_ENABLED:
        return jsonify({
            "reply": (
                "Chat is disabled because Foundry settings are not configured. "
                "Set PROJECT_ENDPOINT and AGENT_ID (or AGENT_NAME) to enable chat."
            )
        }), 503

    session_id = get_or_create_session_id(request.cookies.get(SESSION_COOKIE))

    try:
        client = get_openai_client()
        conversation_id = get_conversation_id(session_id)
        response = client.responses.create(
            conversation=conversation_id,
            extra_body={"agent_reference": build_agent_reference()},
            input=message,
        )
        payload = {"reply": response.output_text}
    except Exception as error:
        error_text = str(error)
        if "not_found" in error_text and "Agent" in error_text:
            hint = (
                "Agent was not found. Set AGENT_ID (preferred) or AGENT_NAME in .env "
                "to the exact value from Foundry portal."
            )
            payload = {"reply": f"[Error talking to the agent: {hint} Raw: {error_text}]"}
        else:
            # Send a readable message back to the page instead of crashing.
            payload = {"reply": f"[Error talking to the agent: {error}]"}

    res = make_response(jsonify(payload))
    res.set_cookie(SESSION_COOKIE, session_id, httponly=True, samesite="Lax")
    return res


@app.route("/reset", methods=["POST"])
def reset():
    """Start a fresh conversation (forget previous context)."""
    session_id = request.cookies.get(SESSION_COOKIE)
    if session_id:
        state["conversations"].pop(session_id, None)
        # Also clear used questions for a fresh quiz
        state["used_questions"].pop(session_id, None)
    return jsonify({"status": "ok"})


if __name__ == "__main__":
    app.run(debug=True, host="0.0.0.0", port=8000)
