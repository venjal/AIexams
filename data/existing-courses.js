window.QuizCourses = {
  "AI-3026": {
    "code": "AI-3026",
    "title": "Develop AI agents with Microsoft Foundry and Visual Studio Code",
    "group": "Technical and architecture",
    "url": "https://learn.microsoft.com/en-us/training/paths/develop-ai-agents-azure/",
    "modules": [
      {
        "id": "ai-3026-1",
        "title": "Develop AI agents with Microsoft Foundry and Visual Studio Code",
        "url": "https://learn.microsoft.com/en-us/training/modules/develop-ai-agents-azure-vs-code/",
        "questions": {
          "Easy": [
            {
              "text": "What is Microsoft Foundry mainly used for?",
              "options": [
                "Building, testing, and deploying AI agents",
                "Editing photos and videos",
                "Managing spreadsheet formulas",
                "Designing 3D game levels"
              ],
              "correct": 0,
              "explanation": "Microsoft Foundry is a platform for building, testing, and deploying AI agents."
            },
            {
              "text": "Which tool do you use to build and debug Foundry agents in this module?",
              "options": [
                "Visual Studio Code",
                "Microsoft Excel",
                "Adobe Photoshop",
                "Windows Notepad"
              ],
              "correct": 0,
              "explanation": "Visual Studio Code with the Foundry extension is used to build and debug agents."
            },
            {
              "text": "What is a system prompt for an AI agent?",
              "options": [
                "Instructions that tell the agent how to behave",
                "The agent's internet connection",
                "A type of database table",
                "The computer's power setting"
              ],
              "correct": 0,
              "explanation": "A system prompt gives the agent instructions about how it should behave."
            },
            {
              "text": "Why is logging useful when debugging an agent?",
              "options": [
                "It helps you see what the agent did and where it failed",
                "It makes the agent run faster",
                "It deletes old files automatically",
                "It changes the screen brightness"
              ],
              "correct": 0,
              "explanation": "Logs show the agent's actions so you can find where things went wrong."
            },
            {
              "text": "What does an AI agent do?",
              "options": [
                "Performs tasks by reasoning and using tools",
                "Only stores files on disk",
                "Prints documents to paper",
                "Plays background music"
              ],
              "correct": 0,
              "explanation": "An AI agent reasons about a task and uses tools to complete it."
            }
          ],
          "Difficult": [
            {
              "text": "In Foundry, when designing an agent's system prompt, which factor has the most significant impact on reducing hallucinations in complex reasoning tasks?",
              "options": [
                "Raising the model temperature to widen the range of candidate responses it considers",
                "Clear constraint definitions and task decomposition instructions",
                "Maximizing the context window so the full knowledge base fits inside the prompt",
                "Setting a strict maximum response length to curb the amount of fabricated detail"
              ],
              "correct": 1,
              "explanation": "Explicit constraint definitions and task decomposition in the system prompt significantly reduce hallucinations by guiding the model's reasoning process."
            },
            {
              "text": "When debugging a Foundry agent in VS Code that intermittently fails on specific tool calls, what is the most effective diagnostic approach?",
              "options": [
                "Expanding the context window so the agent retains the full conversation history across calls",
                "Enable structured logging of tool call parameters, responses, and agent state transitions",
                "Pinning the agent to an earlier model version that was previously validated against those tools",
                "Temporarily reducing the available tools so fewer calls remain that could be the ones failing"
              ],
              "correct": 1,
              "explanation": "Structured logging of tool interactions and state transitions provides visibility into failure patterns."
            },
            {
              "text": "What is the critical difference between agent prompt engineering in Foundry versus traditional LLM prompt engineering?",
              "options": [
                "Foundry prompts are authored in a declarative YAML schema rather than natural language, so wording rarely matters",
                "Foundry prompts must account for tool availability, schema validation, and agent state persistence across multiple turns",
                "Foundry rewrites prompts automatically at runtime from telemetry, so the original phrasing has little lasting effect",
                "Foundry prompts differ only in needing a longer system message and a larger set of few-shot examples up front"
              ],
              "correct": 1,
              "explanation": "Foundry agents operate in multi-turn environments with tools and state, requiring different prompt design considerations than single-turn LLM interactions."
            },
            {
              "text": "When implementing error handling in a Foundry agent, which pattern best prevents cascading failures in tool chains?",
              "options": [
                "Wrapping the entire tool chain in one try-catch and surfacing the first error straight back to the user",
                "Implement exponential backoff with explicit fallback paths and state rollback mechanisms",
                "Retrying each failing tool call immediately and repeatedly until it eventually succeeds on its own",
                "Caching the last successful response and replaying it whenever a later tool call happens to fail"
              ],
              "correct": 1,
              "explanation": "Exponential backoff with fallback paths and state rollback ensures graceful degradation and prevents error propagation."
            },
            {
              "text": "In VS Code's Foundry extension, what does the tracing view reveal about an agent's decision-making that standard logs cannot?",
              "options": [
                "A consolidated stack trace of every single exception thrown during the entire agent run",
                "Token usage and reasoning paths, including why certain tools were or weren't selected",
                "Per-request CPU, memory, and network utilization for the underlying hosting environment",
                "The raw network packets exchanged between the agent and each downstream tool endpoint"
              ],
              "correct": 1,
              "explanation": "Tracing shows the full decision-making process including reasoning chains and tool selection rationale."
            }
          ]
        }
      },
      {
        "id": "ai-3026-2",
        "title": "Integrate custom tools into your agent",
        "url": "https://learn.microsoft.com/en-us/training/modules/build-agent-with-custom-tools/",
        "questions": {
          "Easy": [
            {
              "text": "What is a 'tool' in the context of an AI agent?",
              "options": [
                "A function the agent can call to perform an action",
                "A physical screwdriver",
                "A type of monitor cable",
                "A keyboard shortcut"
              ],
              "correct": 0,
              "explanation": "A tool is a function the agent can call to take an action."
            },
            {
              "text": "Why do tools need clear input definitions?",
              "options": [
                "So the agent sends the correct data to them",
                "To make the screen more colorful",
                "To reduce the size of files",
                "To speed up your typing"
              ],
              "correct": 0,
              "explanation": "Clear input definitions help the agent send correctly formatted data."
            },
            {
              "text": "What should a tool return when something goes wrong?",
              "options": [
                "A clear error message the agent can understand",
                "Nothing at all",
                "A random number",
                "A picture of the error"
              ],
              "correct": 0,
              "explanation": "A clear error message lets the agent understand and recover from the problem."
            },
            {
              "text": "Why add a description to a custom tool?",
              "options": [
                "So the agent knows when to use it",
                "To make the tool look nicer",
                "To increase battery life",
                "To change the font"
              ],
              "correct": 0,
              "explanation": "A good description helps the agent decide when the tool should be used."
            },
            {
              "text": "What is a benefit of giving an agent custom tools?",
              "options": [
                "It can perform actions beyond just generating text",
                "It uses less electricity",
                "It removes the need for a screen",
                "It makes the keyboard louder"
              ],
              "correct": 0,
              "explanation": "Custom tools let an agent take real actions, not just produce text."
            }
          ],
          "Difficult": [
            {
              "text": "When designing a custom tool schema for agent use, which parameter characteristic is most critical for preventing type mismatches at runtime?",
              "options": [
                "Descriptive parameter names that closely mirror the agent's own natural-language vocabulary",
                "Explicit type definitions with strict validation and clear examples of valid input ranges",
                "Default values for every parameter so the agent can simply omit any field it is unsure about",
                "Verbose human-readable descriptions explaining the underlying business purpose of each field"
              ],
              "correct": 1,
              "explanation": "Explicit, strict type definitions with validation rules and examples prevent agents from passing incorrectly formatted data."
            },
            {
              "text": "How should error responses from a custom tool be structured to maximize an agent's ability to self-correct?",
              "options": [
                "A single boolean success flag the agent checks before deciding whether it should retry the call",
                "Structured error codes with specific failure reasons, remediation hints, and valid parameter ranges",
                "Free-form natural-language messages that describe what went wrong in conversational prose",
                "Exactly the same response shape as a success so the agent's response parser can stay simple"
              ],
              "correct": 1,
              "explanation": "Detailed, structured error responses enable agents to understand failures and adjust subsequent attempts."
            },
            {
              "text": "What is the relationship between tool description granularity and agent performance in multi-step workflows?",
              "options": [
                "The longer and more exhaustive each capability description is, the better the agent will end up performing",
                "Tools need specific descriptions of what they DON'T do, edge cases they handle, and constraints on usage frequency",
                "Descriptions should list only the parameters, since the agent already infers all behavior from the schema",
                "A single concise one-line summary is ideal because longer descriptions only end up confusing the planner"
              ],
              "correct": 1,
              "explanation": "Negative space (what tools can't do) and constraint documentation are often more important than capability descriptions."
            },
            {
              "text": "When a custom tool has variable latency (50ms-5s), how should this be communicated in the tool schema to affect agent behavior?",
              "options": [
                "Wrapping slow calls in a hidden background thread so the agent never directly observes any of the delay at all",
                "Include latency expectations and retry policies in the schema, allowing agents to batch calls or adjust timeout expectations",
                "Setting one aggressive global timeout and letting the agent simply retry the call whenever it happens to run slowly",
                "Averaging the recently observed latency and exposing it as a single fixed constant inside the response body payload"
              ],
              "correct": 1,
              "explanation": "Communicating latency characteristics allows agents to make informed decisions about tool usage patterns."
            },
            {
              "text": "How do you design a custom tool that an agent can safely invoke without constant human verification while maintaining security?",
              "options": [
                "Granting the tool broad standing permissions but requiring a human approval only on its very first invocation",
                "Define clear scope boundaries, implement rate limiting, use signed requests, and log all invocations with audit trails",
                "Restricting the tool strictly to read-only operations so that no additional security controls are ever needed",
                "Issuing one long-lived shared API key that the agent then embeds directly into every outbound request header"
              ],
              "correct": 1,
              "explanation": "Combination of scope boundaries, rate limiting, request signing, and audit logging enables safe autonomous tool use."
            }
          ]
        }
      },
      {
        "id": "ai-3026-3",
        "title": "Integrate MCP Tools with Azure AI Agents",
        "url": "https://learn.microsoft.com/en-us/training/modules/connect-agent-to-mcp-tools/",
        "questions": {
          "Easy": [
            {
              "text": "What does MCP stand for?",
              "options": [
                "Model Context Protocol",
                "Main Control Panel",
                "Multi Camera Player",
                "Manual Copy Process"
              ],
              "correct": 0,
              "explanation": "MCP stands for Model Context Protocol."
            },
            {
              "text": "What is the purpose of MCP?",
              "options": [
                "A standard way for agents to connect to tools",
                "A way to edit videos",
                "A type of computer monitor",
                "A spreadsheet formula"
              ],
              "correct": 0,
              "explanation": "MCP gives agents a standard way to connect to external tools."
            },
            {
              "text": "Why use a standard protocol like MCP?",
              "options": [
                "So tools work across different agent frameworks",
                "To make text bigger",
                "To save battery power",
                "To print faster"
              ],
              "correct": 0,
              "explanation": "A standard protocol lets the same tools work with many agent frameworks."
            },
            {
              "text": "Where do Azure AI Agents run?",
              "options": [
                "In the Microsoft Azure cloud",
                "Only on paper",
                "Inside a printer",
                "On a calculator"
              ],
              "correct": 0,
              "explanation": "Azure AI Agents run in the Microsoft Azure cloud."
            },
            {
              "text": "What is one benefit of MCP tool servers?",
              "options": [
                "They let many agents reuse the same tools",
                "They cool down the computer",
                "They charge the battery",
                "They clean the screen"
              ],
              "correct": 0,
              "explanation": "MCP tool servers let multiple agents share and reuse the same tools."
            }
          ],
          "Difficult": [
            {
              "text": "When implementing MCP tool servers, what architectural pattern ensures compatibility with heterogeneous agent frameworks?",
              "options": [
                "Expose a GraphQL endpoint so that each framework can request exactly the response fields that it needs",
                "Implement standard JSON-RPC 2.0 protocol with schema validation and fallback response handling",
                "Provide a thin REST wrapper around the vendor's proprietary SDK separately for each agent framework",
                "Publish a separate framework-specific client library that adapts itself to each different agent runtime"
              ],
              "correct": 1,
              "explanation": "JSON-RPC 2.0 with validated schemas is the MCP standard ensuring cross-platform compatibility."
            },
            {
              "text": "How does MCP handle versioning when an agent requests a tool version that the server has deprecated?",
              "options": [
                "Transparently upgrades the incoming request to the newest version and then returns its updated schema",
                "Implements capability negotiation with graceful degradation and version fallback mechanisms",
                "Rejects the request outright with a 404 so that the agent quickly learns to stop calling that tool",
                "Keeps a permanent running copy of every historical version and routes requests purely by exact match"
              ],
              "correct": 1,
              "explanation": "MCP uses capability negotiation to handle version mismatches and enable backwards compatibility."
            },
            {
              "text": "In an MCP-based architecture, what performance consideration is most critical when serving 100+ concurrent agent instances?",
              "options": [
                "Allocating a dedicated long-lived connection and a separate worker thread for each individual agent instance",
                "Connection pooling, request queuing, and stateless tool implementations to prevent resource contention",
                "Vertically scaling the server with progressively more CPU cores until the resource contention disappears",
                "Caching every tool response in memory so that repeated calls never reach the backend service at all"
              ],
              "correct": 1,
              "explanation": "Stateless implementations with connection pooling are essential for scaling MCP servers across many concurrent agents."
            },
            {
              "text": "When integrating multiple MCP tool servers with Azure AI Agents, how should cross-tool dependencies be managed?",
              "options": [
                "Embedding the dependency calls inside each tool itself so that the chain effectively resolves itself implicitly",
                "Define dependency graphs at the orchestration layer with circuit breakers and compensation logic for partial failures",
                "Invoking all of the dependent tools fully in parallel and merging whichever set of results returns first",
                "Hard-coding one fixed sequential call order and aborting the entire workflow on any single dependency failure"
              ],
              "correct": 1,
              "explanation": "Orchestration-layer dependency management with circuit breakers enables resilient multi-tool workflows."
            },
            {
              "text": "What security mechanism in MCP prevents unauthorized agents from accessing sensitive tools?",
              "options": [
                "Network-level IP allow-lists that strictly restrict exactly which hosts are able to reach the tool server",
                "Capability-based access control with signed tokens and agent identity verification at the MCP protocol level",
                "A single shared secret that is passed in the request body and then rotated on a regular weekly schedule",
                "Obfuscating the tool endpoint URLs so that only the trusted agents ever know the correct addresses to call"
              ],
              "correct": 1,
              "explanation": "MCP implements capability-based security with token verification for fine-grained access control."
            }
          ]
        }
      },
      {
        "id": "ai-3026-4",
        "title": "Build knowledge-enhanced AI agents with Foundry IQ",
        "url": "https://learn.microsoft.com/en-us/training/modules/introduction-foundry-iq/",
        "questions": {
          "Easy": [
            {
              "text": "What does Foundry IQ add to an agent?",
              "options": [
                "Access to a knowledge base for better answers",
                "A louder speaker",
                "A faster keyboard",
                "A brighter screen"
              ],
              "correct": 0,
              "explanation": "Foundry IQ gives the agent access to a knowledge base so it can answer more accurately."
            },
            {
              "text": "What is vector search used for?",
              "options": [
                "Finding information by meaning, not just keywords",
                "Drawing charts",
                "Formatting text",
                "Sending emails"
              ],
              "correct": 0,
              "explanation": "Vector search finds information based on meaning rather than exact keywords."
            },
            {
              "text": "Why give an agent access to a knowledge base?",
              "options": [
                "So it can answer using accurate, specific information",
                "To make it type faster",
                "To save disk space",
                "To change the wallpaper"
              ],
              "correct": 0,
              "explanation": "A knowledge base gives the agent accurate facts to answer from."
            },
            {
              "text": "What is 'chunking' in knowledge systems?",
              "options": [
                "Splitting documents into smaller pieces for search",
                "Deleting old files",
                "Zipping a folder",
                "Renaming a file"
              ],
              "correct": 0,
              "explanation": "Chunking splits documents into smaller pieces so they can be searched effectively."
            },
            {
              "text": "What problem does retrieval help solve?",
              "options": [
                "Giving the agent relevant facts to reduce guessing",
                "Cooling the processor",
                "Cleaning the keyboard",
                "Saving battery"
              ],
              "correct": 0,
              "explanation": "Retrieval supplies relevant facts so the agent guesses less."
            }
          ],
          "Difficult": [
            {
              "text": "When implementing vector search in Foundry IQ, what is the relationship between embedding model choice and retrieval accuracy for domain-specific content?",
              "options": [
                "Larger general-purpose embedding models will always catch up to domain-specific models once given enough training data",
                "Domain-specific embeddings significantly outperform generic models, especially for specialized terminology and cross-lingual content",
                "The choice of embedding model only affects how quickly indexing runs and never the relevance of the retrieved results",
                "Simple keyword overlap consistently matters far more than embeddings, so the embedding model choice remains entirely secondary"
              ],
              "correct": 1,
              "explanation": "Domain-specific embeddings are critical for accurate retrieval of specialized knowledge."
            },
            {
              "text": "How should knowledge indices be structured to support both keyword and semantic search while minimizing latency in real-time agent queries?",
              "options": [
                "A single dense vector index that approximates keyword matches purely through the learned embedding space",
                "Hybrid indices with separate keyword and vector shards, with query routing based on query type analysis",
                "Two fully independent search services that are each queried sequentially and then merged together afterward",
                "An inverted keyword index with semantic re-ranking applied across every single result that is returned"
              ],
              "correct": 1,
              "explanation": "Hybrid indices optimize for both search types while maintaining query performance."
            },
            {
              "text": "In a Foundry IQ system with continuously updating knowledge, how do you prevent agents from using stale information without blocking on every query?",
              "options": [
                "Disabling caching entirely so that every single query always reads from the very latest index state",
                "Implement version-aware caching with TTLs, background refresh strategies, and consistency guarantees",
                "Refreshing the entire index synchronously at the very start of each individual agent query request",
                "Pinning agents to a nightly snapshot and rebuilding it only during scheduled maintenance windows"
              ],
              "correct": 1,
              "explanation": "Version-aware caching with configurable TTLs balances freshness and performance."
            },
            {
              "text": "When knowledge indices contain conflicting information about the same fact, how should Foundry IQ resolve this for agent consumption?",
              "options": [
                "Always returning the single most recently ingested source while silently discarding all of the older entries",
                "Implement confidence scoring, source attribution, and conflict resolution strategies that bubble uncertainty to the agent",
                "Concatenating every conflicting passage together and then letting the language model quietly decide on its own",
                "Picking whichever source happens to have the highest keyword match score against the query terms provided"
              ],
              "correct": 1,
              "explanation": "Confidence scoring and source attribution help agents make informed decisions about knowledge reliability."
            },
            {
              "text": "What is the impact of knowledge chunking strategy on agent retrieval accuracy, and how should chunk size be optimized?",
              "options": [
                "Always using the largest chunks the model allows so that no surrounding context is ever lost during retrieval, even for short documents",
                "Optimal chunk size balances context preservation with embedding quality; too small loses context, too large dilutes relevance; vary by document type",
                "Using one single fixed token size for every document regardless of its structure, content type, or retrieval task",
                "Splitting strictly on sentence boundaries so that each individual chunk ends up containing exactly one isolated idea"
              ],
              "correct": 1,
              "explanation": "Chunk size optimization is critical; it varies by document type and retrieval task complexity."
            }
          ]
        }
      },
      {
        "id": "ai-3026-5",
        "title": "Integrate your agent with Microsoft 365",
        "url": "https://learn.microsoft.com/en-us/training/modules/integrate-foundry-agent-with-m365/",
        "questions": {
          "Easy": [
            {
              "text": "What is Microsoft 365?",
              "options": [
                "A suite of productivity apps like Teams, Outlook, and Word",
                "A video game console",
                "A photo editing app only",
                "A type of printer"
              ],
              "correct": 0,
              "explanation": "Microsoft 365 is a suite of productivity apps such as Teams, Outlook, and Word."
            },
            {
              "text": "Which Microsoft 365 app is used for team chat?",
              "options": [
                "Microsoft Teams",
                "Microsoft Paint",
                "Microsoft Solitaire",
                "Microsoft Edge"
              ],
              "correct": 0,
              "explanation": "Microsoft Teams is the Microsoft 365 app used for team chat."
            },
            {
              "text": "What is Microsoft Graph used for?",
              "options": [
                "Accessing Microsoft 365 data and services",
                "Drawing bar charts",
                "Editing videos",
                "Playing music"
              ],
              "correct": 0,
              "explanation": "Microsoft Graph is the API used to access Microsoft 365 data and services."
            },
            {
              "text": "Why do agents need permissions in Microsoft 365?",
              "options": [
                "To securely access only the data they are allowed to",
                "To make the app colorful",
                "To speed up the mouse",
                "To increase the volume"
              ],
              "correct": 0,
              "explanation": "Permissions ensure an agent can access only the data it is allowed to."
            },
            {
              "text": "What is one benefit of connecting an agent to Microsoft 365?",
              "options": [
                "It can help with emails, files, and meetings",
                "It charges your phone",
                "It prints in color",
                "It cleans your desk"
              ],
              "correct": 0,
              "explanation": "Connecting to Microsoft 365 lets an agent help with emails, files, and meetings."
            }
          ],
          "Difficult": [
            {
              "text": "When designing M365-integrated agents, what is the primary challenge in maintaining compliance with conditional access policies?",
              "options": [
                "Conditional access only ever applies to interactive human users, so background service agents are fully exempt from it",
                "Agents must handle dynamic policy changes, device registration requirements, and interactive auth flows without manual intervention",
                "Agents must securely store each user's password so that they can satisfy every conditional access policy check",
                "Compliance is handled entirely inside the Graph SDK, so the agent itself needs no special handling logic at all"
              ],
              "correct": 1,
              "explanation": "Modern M365 environments have dynamic conditional access that agents must respect and adapt to."
            },
            {
              "text": "How should an agent handle Microsoft 365 API throttling to maximize throughput in batch operations?",
              "options": [
                "Retrying every throttled request immediately so that the overall batch is able to finish as quickly as possible",
                "Implement exponential backoff with jitter, adaptive request batching, and queue-based processing with priority ordering",
                "Splitting the workload across many separate app registrations in order to effectively multiply the available quota",
                "Sending all of the requests together inside one very large batch so that the service only throttles the call once"
              ],
              "correct": 1,
              "explanation": "Exponential backoff with jitter and adaptive batching are essential for reliable M365 API usage at scale."
            },
            {
              "text": "When an agent integrates with Teams, what architectural pattern prevents message flooding and ensures reliable delivery in high-latency scenarios?",
              "options": [
                "Sending each message immediately and then simply resending the whole conversation again if any of them fail",
                "Implement message deduplication, idempotency keys, and delivery confirmation with out-of-order message handling",
                "Polling the Teams channel on a fixed interval and reposting any individual messages that appear to be missing",
                "Buffering all of the messages locally and then flushing them together at once when the network finally recovers"
              ],
              "correct": 1,
              "explanation": "Idempotency and deduplication mechanisms ensure reliable Teams integration even with network issues."
            },
            {
              "text": "How does delegated vs. application permissions in M365 affect agent design, and when should each be used?",
              "options": [
                "Delegated permissions are really just application permissions that happen to expire after each individual user session",
                "Delegated for user-context operations with consent, application for background operations; choice affects security model and user experience",
                "Application permissions should always be preferred in every single case because they conveniently avoid all of the consent prompts entirely",
                "The two permission types are fully interchangeable as long as exactly the same underlying Graph scopes are requested"
              ],
              "correct": 1,
              "explanation": "The choice between delegated and application permissions fundamentally affects agent security posture and use cases."
            },
            {
              "text": "When integrating with Exchange Online via agent, what is the most critical security consideration for handling sensitive email content?",
              "options": [
                "Relying on Exchange transport encryption, which already protects all of the message content fully end to end",
                "Implement field-level encryption, audit logging of access, and content filtering rules to prevent accidental exposure",
                "Caching the decrypted message bodies locally in order to reduce the number of repeated Graph API calls made",
                "Restricting access by the mailbox folder name rather than by the message's individually assigned sensitivity label"
              ],
              "correct": 1,
              "explanation": "Email contains sensitive data; additional security layers are essential beyond platform protections."
            }
          ]
        }
      },
      {
        "id": "ai-3026-6",
        "title": "Build agent-driven workflows using Microsoft Foundry",
        "url": "https://learn.microsoft.com/en-us/training/modules/build-agent-workflows-microsoft-foundry/",
        "questions": {
          "Easy": [
            {
              "text": "What is a workflow?",
              "options": [
                "A series of steps to complete a task",
                "A single button click",
                "A type of monitor",
                "A keyboard key"
              ],
              "correct": 0,
              "explanation": "A workflow is a series of steps that together complete a task."
            },
            {
              "text": "Why use workflows with agents?",
              "options": [
                "To automate multi-step tasks reliably",
                "To make the fan spin",
                "To dim the screen",
                "To delete files"
              ],
              "correct": 0,
              "explanation": "Workflows let agents automate multi-step tasks reliably."
            },
            {
              "text": "What should a good workflow do if one step fails?",
              "options": [
                "Recover or handle the failure gracefully",
                "Make the computer explode",
                "Turn the screen off forever",
                "Delete all the files"
              ],
              "correct": 0,
              "explanation": "A good workflow recovers from or gracefully handles a failed step."
            },
            {
              "text": "What does it mean to run steps in parallel?",
              "options": [
                "Doing multiple steps at the same time",
                "Turning off the computer",
                "Printing two pages",
                "Closing the app"
              ],
              "correct": 0,
              "explanation": "Running in parallel means several steps happen at the same time."
            },
            {
              "text": "Why save a workflow's state?",
              "options": [
                "So it can resume after a pause or failure",
                "To make it louder",
                "To change its color",
                "To speed up typing"
              ],
              "correct": 0,
              "explanation": "Saving state lets a workflow resume after a pause or failure."
            }
          ],
          "Difficult": [
            {
              "text": "In a complex agent workflow with parallel branches, what is the optimal strategy for handling partial failures without reprocessing completed work?",
              "options": [
                "Restarting the entire workflow from the very beginning in order to guarantee one fully consistent end result",
                "Implement checkpointing at branch boundaries with compensation logic that rolls back only failed branches",
                "Letting the failed branches retry forever while all of the completed branches simply wait for them to finish",
                "Merging all of the partial results immediately and then flagging the whole workflow as fully complete"
              ],
              "correct": 1,
              "explanation": "Checkpointing and compensation logic enable efficient recovery from partial failures in complex workflows."
            },
            {
              "text": "How should workflow state be managed in Foundry to support both transient failures and long-running operations spanning days?",
              "options": [
                "Keeping all of the workflow state in memory and then simply replaying the inputs after any restart occurs",
                "Persistent state storage with event sourcing, allowing state reconstruction and enabling pause/resume capabilities",
                "Writing the final workflow state out to a single local file once the run has fully finished executing",
                "Storing only the current step number so that the workflow can resume from that one point after a failure"
              ],
              "correct": 1,
              "explanation": "Persistent, event-sourced state enables long-running workflows with full recovery capabilities."
            },
            {
              "text": "When implementing a workflow with conditional branching based on agent decisions, what prevents inconsistent outcomes across identical inputs?",
              "options": [
                "Accepting that identical inputs may branch differently, since the agents are inherently stochastic by their nature",
                "Implement deterministic decision logic with seed-based randomization, decision logging, and replay capabilities",
                "Forcing every single run down the most common branch in order to keep all of the outcomes uniform",
                "Re-evaluating each condition twice and only proceeding when both of the two results happen to agree"
              ],
              "correct": 1,
              "explanation": "Deterministic logic with logging enables reproducibility and debugging of complex branching workflows."
            },
            {
              "text": "How should timeouts be configured in Foundry workflows to balance responsiveness with reliability?",
              "options": [
                "Applying one generous global timeout so that no individual operation is ever cut off prematurely by mistake",
                "Implement operation-specific timeouts with exponential backoff, escalation policies, and SLA-based timeout hierarchies",
                "Setting every timeout equal to the slowest operation that has been observed anywhere across the whole workflow",
                "Disabling timeouts on the external calls entirely and trusting the services to respond at some point eventually"
              ],
              "correct": 1,
              "explanation": "Differentiated timeout strategies are essential for complex workflows with varied operation characteristics."
            },
            {
              "text": "In a workflow with external service dependencies, what pattern prevents cascading failures across the workflow?",
              "options": [
                "Calling every external service up front and then aborting the whole workflow if any one of them is unavailable",
                "Circuit breaker pattern with bulkheads, fallback services, and graceful degradation strategies",
                "Retrying each failing dependency on a tight loop until the service eventually comes back fully online",
                "Sharing one single connection pool across all of the dependencies in order to keep management simpler"
              ],
              "correct": 1,
              "explanation": "Circuit breakers and bulkheads prevent cascading failures in workflows with external dependencies."
            }
          ]
        }
      },
      {
        "id": "ai-3026-7",
        "title": "Develop an AI agent with Microsoft Agent Framework",
        "url": "https://learn.microsoft.com/en-us/training/modules/develop-ai-agent-with-semantic-kernel/",
        "questions": {
          "Easy": [
            {
              "text": "What is the Microsoft Agent Framework used for?",
              "options": [
                "Building AI agents that can use functions and tools",
                "Editing spreadsheets",
                "Designing posters",
                "Managing printers"
              ],
              "correct": 0,
              "explanation": "The Microsoft Agent Framework is used to build AI agents that use functions and tools."
            },
            {
              "text": "What is a 'function' an agent can call?",
              "options": [
                "A reusable piece of code that performs a task",
                "A type of cable",
                "A screen setting",
                "A mouse button"
              ],
              "correct": 0,
              "explanation": "A function is a reusable piece of code the agent can call to perform a task."
            },
            {
              "text": "What does a 'planner' do in an agent framework?",
              "options": [
                "Decides which steps and tools to use to reach a goal",
                "Cleans the keyboard",
                "Charges the battery",
                "Prints documents"
              ],
              "correct": 0,
              "explanation": "A planner decides which steps and tools the agent should use to reach a goal."
            },
            {
              "text": "Why is agent 'memory' useful?",
              "options": [
                "It lets the agent remember context across steps",
                "It makes the screen bigger",
                "It cools the CPU",
                "It plays sounds"
              ],
              "correct": 0,
              "explanation": "Memory lets the agent keep track of context across multiple steps."
            },
            {
              "text": "What is a benefit of chaining functions together?",
              "options": [
                "The agent can complete complex multi-step tasks",
                "The fan runs quieter",
                "The screen gets brighter",
                "The mouse moves faster"
              ],
              "correct": 0,
              "explanation": "Chaining functions lets the agent complete complex, multi-step tasks."
            }
          ],
          "Difficult": [
            {
              "text": "When using semantic kernel for agent planning, what is the relationship between function parameterization and the agent's ability to reason about tool usage?",
              "options": [
                "Functions with fewer parameters always reason better simply because there is far less for the agent to track",
                "Well-parameterized functions with clear constraints enable the agent to reason about preconditions, postconditions, and side effects",
                "Parameter names only ever influence the reasoning in the specific cases where they happen to exactly match the user's own wording",
                "Reasoning depends almost entirely on the function's declared return type rather than on its input parameters"
              ],
              "correct": 1,
              "explanation": "Function parameterization directly affects the agent's ability to reason about tool applicability and constraints."
            },
            {
              "text": "How does the semantic kernel's planner handle situations where multiple function combinations could achieve the same goal?",
              "options": [
                "Always selects the very first valid function combination that it happens to find in order to minimize planning time",
                "Evaluates functions using cost models, analyzes execution paths, and selects based on efficiency and resource constraints",
                "Pauses and asks the user to choose manually whenever more than one valid plan is currently available to it",
                "Picks whichever combination uses the fewest total functions overall, regardless of their individual cost"
              ],
              "correct": 1,
              "explanation": "Advanced planners evaluate multiple paths and select based on cost models and resource constraints."
            },
            {
              "text": "In an agent framework, what architectural decision is most critical for preventing infinite loops in recursive function calls?",
              "options": [
                "Capping the total wall-clock runtime so that any runaway recursion eventually just times out on its own",
                "Implement call depth tracking, loop detection algorithms, and semantic analysis of whether sub-calls progress toward the goal",
                "Disallowing any function from directly calling itself while still permitting indirect mutual recursion between separate functions",
                "Limiting the total number of distinct functions so that the agent simply has fewer ways available to loop"
              ],
              "correct": 1,
              "explanation": "Active loop detection and progress monitoring are essential safeguards in recursive agent scenarios."
            },
            {
              "text": "How should memory systems in agent frameworks handle conflicting information from different sources within the same context?",
              "options": [
                "Always trusting the most recently stored value and overwriting any of the earlier entries that conflict with it",
                "Implement source credibility tracking, timestamp-based resolution, and explicit conflict surfacing to the agent",
                "Averaging all of the conflicting facts together into one single combined value before the agent ever reads them",
                "Discarding any fact that happens to appear in more than one source at all in order to avoid every ambiguity"
              ],
              "correct": 1,
              "explanation": "Credibility tracking and conflict surfacing enable agents to reason about information reliability."
            },
            {
              "text": "When designing agent functions for a semantic kernel, what property is most important for enabling effective chaining across multiple steps?",
              "options": [
                "Maximum raw execution speed so that each individual step in the chain is able to complete as fast as possible",
                "Clear input/output contracts with minimal side effects, enabling composition and reusability",
                "Rich internal state that each function then automatically carries forward into the next step of the chain",
                "Broad multi-purpose functions that can each individually handle many different steps within a single call"
              ],
              "correct": 1,
              "explanation": "Clear contracts enable function composition and predictable agent behavior in multi-step workflows."
            }
          ]
        }
      },
      {
        "id": "ai-3026-8",
        "title": "Orchestrate a multi-agent solution using the Microsoft Agent Framework",
        "url": "https://learn.microsoft.com/en-us/training/modules/orchestrate-semantic-kernel-multi-agent-solution/",
        "questions": {
          "Easy": [
            {
              "text": "What is a multi-agent solution?",
              "options": [
                "Several agents working together on a task",
                "One very large monitor",
                "A single keyboard shortcut",
                "A type of printer"
              ],
              "correct": 0,
              "explanation": "A multi-agent solution uses several agents working together on a task."
            },
            {
              "text": "Why use multiple agents instead of just one?",
              "options": [
                "Each can specialize in a different part of the task",
                "To use more electricity",
                "To make more noise",
                "To fill up the disk"
              ],
              "correct": 0,
              "explanation": "Multiple agents can each specialize in a different part of the task."
            },
            {
              "text": "What is 'orchestration' in a multi-agent system?",
              "options": [
                "Coordinating how the agents work together",
                "Playing background music",
                "Cleaning the screen",
                "Charging the battery"
              ],
              "correct": 0,
              "explanation": "Orchestration is coordinating how the agents work together."
            },
            {
              "text": "What can happen if agents don't coordinate well?",
              "options": [
                "They may give inconsistent or conflicting results",
                "The computer gets faster",
                "The screen turns blue forever",
                "The keyboard lights up"
              ],
              "correct": 0,
              "explanation": "Poor coordination can lead to inconsistent or conflicting results."
            },
            {
              "text": "What is one benefit of agent specialization?",
              "options": [
                "Each agent can focus and do its part better",
                "It cools the processor",
                "It saves printer ink",
                "It increases the volume"
              ],
              "correct": 0,
              "explanation": "Specialization lets each agent focus on and do its part better."
            }
          ],
          "Difficult": [
            {
              "text": "In a multi-agent system, what problem does the consensus algorithm solve, and when is it necessary?",
              "options": [
                "Speeds the whole system up by letting whichever agent is fastest commit decisions on behalf of the group",
                "Prevents agents from diverging in their understanding of system state; critical for distributed decision-making and conflict resolution",
                "Guarantees that every single agent always receives every one of its messages in the exact same order that they were originally sent",
                "Assigns one permanent leader agent that all of the other agents in the system then simply defer to and obey"
              ],
              "correct": 1,
              "explanation": "Consensus mechanisms prevent system inconsistencies in distributed multi-agent architectures."
            },
            {
              "text": "How should agent specialization be balanced against the overhead of inter-agent communication in multi-agent orchestration?",
              "options": [
                "Always maximizing specialization, on the assumption that more narrowly focused agents are inherently more accurate",
                "Analyze communication graphs and apply minimal specialization that improves solution quality above communication cost threshold",
                "Minimizing all inter-agent communication even in the cases where it forces every agent to act as a broad generalist",
                "Assigning exactly one agent per task type, regardless of how much coordination overhead that ultimately requires"
              ],
              "correct": 1,
              "explanation": "The specialization-communication tradeoff requires analysis of problem-specific characteristics."
            },
            {
              "text": "When orchestrating agents that may deadlock waiting for each other's responses, what detection and recovery mechanism should be implemented?",
              "options": [
                "Extending each agent's wait timeout so that the blocked agents will eventually receive some kind of response",
                "Resource-wait-for graphs with cycle detection, combined with timeout-based recovery and agent restart strategies",
                "Routing all of the agent requests through one single shared queue in order to remove any of the circular waits",
                "Giving every agent a unique fixed priority so that the higher-priority agent is always the one to proceed first"
              ],
              "correct": 1,
              "explanation": "Active deadlock detection with timeout recovery is essential for reliability in multi-agent systems."
            },
            {
              "text": "How should role-based specialization be implemented to prevent agents from becoming knowledge bottlenecks in orchestrated workflows?",
              "options": [
                "Consolidating all of the critical knowledge into one expert agent that the others then simply query whenever needed",
                "Implement role replication with load balancing, capability-based routing, and redundancy for critical roles",
                "Making every single agent completely identical so that any one of them is able to take over a stalled task",
                "Processing all of the specialized roles strictly in sequence in order to keep each responsibility clearly separated"
              ],
              "correct": 1,
              "explanation": "Role replication and load balancing prevent single points of failure in multi-agent systems."
            },
            {
              "text": "In a multi-agent system with emergent behaviors, what monitoring and logging strategy enables root cause analysis?",
              "options": [
                "Aggregating every agent's individual output into one single global log file and then carefully scanning through all of it for errors",
                "Implement interaction graphs showing agent message patterns, coupled with causal analysis tools and behavior replay capabilities",
                "Increasing the verbosity of each agent's own individual logs and then reviewing every one of them separately",
                "Sampling just a small subset of the agent messages periodically in order to estimate the overall behavior"
              ],
              "correct": 1,
              "explanation": "Interaction graph visualization with causal analysis is critical for understanding emergent behavior in multi-agent systems."
            }
          ]
        }
      },
      {
        "id": "ai-3026-9",
        "title": "Discover Azure AI Agents with A2A",
        "url": "https://learn.microsoft.com/en-us/training/modules/discover-agents-with-a2a/",
        "questions": {
          "Easy": [
            {
              "text": "What does A2A stand for?",
              "options": [
                "Agent-to-Agent communication",
                "App-to-App backup",
                "Audio-to-Audio mixing",
                "Account-to-Account transfer"
              ],
              "correct": 0,
              "explanation": "A2A stands for Agent-to-Agent communication."
            },
            {
              "text": "Where do Azure AI Agents run?",
              "options": [
                "In the Microsoft Azure cloud",
                "Only on a USB stick",
                "Inside a printer",
                "On a calculator"
              ],
              "correct": 0,
              "explanation": "Azure AI Agents run in the Microsoft Azure cloud."
            },
            {
              "text": "What is the benefit of A2A communication?",
              "options": [
                "Agents can work together by exchanging messages",
                "It charges the laptop",
                "It prints faster",
                "It cleans the screen"
              ],
              "correct": 0,
              "explanation": "A2A lets agents work together by exchanging messages."
            },
            {
              "text": "What is a 'managed identity' used for?",
              "options": [
                "Letting an agent access Azure resources securely",
                "Changing the wallpaper",
                "Increasing screen brightness",
                "Editing photos"
              ],
              "correct": 0,
              "explanation": "A managed identity lets an agent access Azure resources securely."
            },
            {
              "text": "Why use caching with Azure AI services?",
              "options": [
                "To improve speed and reduce repeated calls",
                "To make the fan louder",
                "To delete old emails",
                "To dim the monitor"
              ],
              "correct": 0,
              "explanation": "Caching improves speed and reduces repeated calls to the service."
            }
          ],
          "Difficult": [
            {
              "text": "In Azure AI Agents architecture, what is the distinction between stateless orchestration and stateful agent execution, and how does this affect scaling?",
              "options": [
                "Stateless orchestration runs noticeably faster but is fundamentally unable to support more than a single agent at any one given time",
                "Stateless orchestration enables horizontal scaling while stateful execution requires sticky sessions or distributed state management",
                "Stateful execution actually scales more easily, because each instance simply keeps all of its own data local",
                "The two differ only in how much logging detail they emit and have no real effect on how the system scales"
              ],
              "correct": 1,
              "explanation": "The stateless/stateful distinction is critical for designing scalable Azure AI Agent deployments."
            },
            {
              "text": "When implementing A2A (Agent-to-Agent) communication in Azure, what protocol considerations ensure reliable message delivery under network partitions?",
              "options": [
                "Relying on a single persistent TCP connection that simply reconnects itself automatically again right after each network partition",
                "Implement message queuing with at-least-once semantics, idempotency keys, and acknowledgment protocols that survive partition healing",
                "Switching over to UDP for its lower latency and then simply resending any of the messages that appear to be lost",
                "Buffering messages inside each agent's own local memory and replaying them once the network has fully recovered"
              ],
              "correct": 1,
              "explanation": "Queue-based communication with idempotency is essential for reliable A2A interactions."
            },
            {
              "text": "How should Azure AI Agents be configured to handle long-running operations that may exceed API timeout limits?",
              "options": [
                "Raising the synchronous API timeout high enough that it comfortably covers even the very longest operation",
                "Implement async job patterns with polling/webhook callbacks, status queries, and graceful timeout handling",
                "Splitting the long operation into many tiny synchronous calls that are then simply chained one after another",
                "Holding the connection open and streaming keep-alive bytes continuously until the work has finally completed"
              ],
              "correct": 1,
              "explanation": "Async patterns with callbacks are the standard for handling long-running operations in cloud services."
            },
            {
              "text": "What is the relationship between Azure AI Agents' managed identity and the scope of operations they can perform safely without additional authentication?",
              "options": [
                "Using a managed identity entirely removes the need for any further authorization checks at all on resource calls",
                "Managed identity defines the scope of Azure resource access; broader scope increases attack surface; follow principle of least privilege",
                "A single broadly scoped managed identity is actually considered safer overall, because it conveniently avoids frequent token refresh requests",
                "Managed identity only ever governs network-level access and never which specific Azure resources can be used"
              ],
              "correct": 1,
              "explanation": "Least-privilege managed identity configuration is essential for secure Azure AI Agent deployments."
            },
            {
              "text": "When Azure AI Agents integrate with Azure Cognitive Services, what caching strategy maximizes performance while respecting API quotas?",
              "options": [
                "Caching every single response permanently so that the same input never has to consume any of the quota twice",
                "Implement service-specific caching with TTLs, cache warming strategies, and quota-aware request batching",
                "Disabling caching altogether so that the agent always receives the freshest possible output from the model",
                "Caching responses only on the client side while completely ignoring the service's own published quota limits"
              ],
              "correct": 1,
              "explanation": "Service-aware caching with quota management optimizes both performance and cost in Azure deployments."
            }
          ]
        }
      }
    ]
  },
  "AI-103": {
    "code": "AI-103",
    "title": "Azure AI Apps and Agents Developer",
    "group": "Technical and architecture",
    "url": "https://learn.microsoft.com/en-us/credentials/certifications/resources/study-guides/ai-103",
    "modules": [
      {
        "id": "ai-103-1",
        "title": "Plan and manage an Azure AI solution",
        "url": "https://learn.microsoft.com/en-us/credentials/certifications/resources/study-guides/ai-103",
        "questions": {
          "Easy": [],
          "Difficult": [
            {
              "text": "An AI application must access Foundry resources without storing secrets in source code. Which authentication approach should you use?",
              "options": [
                "A shared access signature committed with the application",
                "A managed identity with role-based access control",
                "A model API key stored in a client-side environment file",
                "An anonymous endpoint protected only by rate limiting"
              ],
              "correct": 1,
              "explanation": "Managed identity and Azure role-based access control provide keyless authentication without embedding credentials in application code."
            },
            {
              "text": "You need to detect declining grounding quality in a production RAG application. What should you monitor?",
              "options": [
                "Only the model deployment name",
                "Search relevance, groundedness evaluations, and data ingestion quality",
                "Only the number of tokens in the system prompt",
                "The application server operating system version"
              ],
              "correct": 1,
              "explanation": "Grounding quality depends on healthy ingestion and retrieval plus groundedness and relevance evaluation of generated responses."
            },
            {
              "text": "A team must prevent an agent from invoking a high-impact tool without human review. Which control best meets the requirement?",
              "options": [
                "Increase the model temperature",
                "Add an approval workflow before the tool executes",
                "Give the agent a larger context window",
                "Disable trace logging"
              ],
              "correct": 1,
              "explanation": "An approval workflow provides explicit human oversight before a sensitive tool action is executed."
            }
          ]
        }
      },
      {
        "id": "ai-103-2",
        "title": "Implement generative AI and agentic solutions",
        "url": "https://learn.microsoft.com/en-us/credentials/certifications/resources/study-guides/ai-103",
        "questions": {
          "Easy": [],
          "Difficult": [
            {
              "text": "A support assistant must answer from current internal policies and cite its sources. Which architecture is most appropriate?",
              "options": [
                "Fine-tune a model once and remove the source documents",
                "Use retrieval-augmented generation with a searchable policy index",
                "Increase temperature and rely on the model's pretrained knowledge",
                "Store the policies only in conversation memory"
              ],
              "correct": 1,
              "explanation": "RAG retrieves current policy content at run time and can provide source citations for grounded answers."
            },
            {
              "text": "An agent needs to call a shipping API with validated arguments. What should you define?",
              "options": [
                "A function tool with a precise input schema",
                "A second system prompt with no tool metadata",
                "A larger token quota only",
                "A vector index containing API responses"
              ],
              "correct": 0,
              "explanation": "A function tool schema tells the model when and how to call the API and enables argument validation."
            },
            {
              "text": "Which telemetry is most useful for diagnosing a slow multi-step agent workflow?",
              "options": [
                "Only the final answer length",
                "Distributed traces with per-step latency, token usage, and tool-call results",
                "The user's browser resolution",
                "The model catalog sort order"
              ],
              "correct": 1,
              "explanation": "Step-level tracing exposes latency, token consumption, failures, and tool behavior throughout an agent workflow."
            }
          ]
        }
      },
      {
        "id": "ai-103-3",
        "title": "Implement computer vision solutions",
        "url": "https://learn.microsoft.com/en-us/credentials/certifications/resources/study-guides/ai-103",
        "questions": {
          "Easy": [],
          "Difficult": [
            {
              "text": "An application must answer questions about objects shown in an uploaded image. Which capability should it use?",
              "options": [
                "A text-only embedding model",
                "A multimodal model that accepts image and text input",
                "Speech synthesis",
                "A language detection API"
              ],
              "correct": 1,
              "explanation": "A multimodal model can reason over visual evidence and the user's text question together."
            },
            {
              "text": "You need to remove and replace a selected region of an image. Which image-generation technique should you use?",
              "options": [
                "Inpainting with a mask",
                "Speech diarization",
                "Vector search",
                "Entity linking"
              ],
              "correct": 0,
              "explanation": "Inpainting uses a mask to identify the region that the model should regenerate or replace."
            },
            {
              "text": "Images may contain hidden text that attempts to override an agent's instructions. What risk should the solution detect?",
              "options": [
                "Model quota exhaustion",
                "Indirect prompt injection",
                "Speech translation drift",
                "Vector dimension mismatch"
              ],
              "correct": 1,
              "explanation": "Instructions embedded in visual content are an indirect prompt-injection risk and should be detected and mitigated."
            }
          ]
        }
      },
      {
        "id": "ai-103-4",
        "title": "Implement text analysis solutions",
        "url": "https://learn.microsoft.com/en-us/credentials/certifications/resources/study-guides/ai-103",
        "questions": {
          "Easy": [],
          "Difficult": [
            {
              "text": "A solution must identify people, organizations, and locations in customer messages. Which text-analysis capability is required?",
              "options": [
                "Named entity recognition",
                "Image segmentation",
                "Speaker diarization",
                "Optical character recognition"
              ],
              "correct": 0,
              "explanation": "Named entity recognition identifies and categorizes entities such as people, organizations, and locations in text."
            },
            {
              "text": "A voice assistant must produce text from live audio before an agent can reason over it. Which capability should be used first?",
              "options": [
                "Text to speech",
                "Speech to text",
                "Image captioning",
                "Vector compression"
              ],
              "correct": 1,
              "explanation": "Speech to text transcribes audio into text that the agent can process."
            },
            {
              "text": "A global help desk needs to preserve the meaning of a user's message while converting it to another language. Which service capability is appropriate?",
              "options": [
                "Azure Translator in Foundry Tools",
                "Azure AI Vision object detection",
                "Azure Content Understanding layout extraction",
                "A model deployment quota increase"
              ],
              "correct": 0,
              "explanation": "Azure Translator is designed to translate text between languages while preserving meaning."
            }
          ]
        }
      },
      {
        "id": "ai-103-5",
        "title": "Implement information extraction solutions",
        "url": "https://learn.microsoft.com/en-us/credentials/certifications/resources/study-guides/ai-103",
        "questions": {
          "Easy": [],
          "Difficult": [
            {
              "text": "A RAG system must retrieve results that match both exact product codes and semantic meaning. Which retrieval approach should you configure?",
              "options": [
                "Keyword search only",
                "Vector search only",
                "Hybrid search that combines keyword and vector retrieval",
                "Random document sampling"
              ],
              "correct": 2,
              "explanation": "Hybrid search combines lexical matching for exact terms with vector similarity for semantic relevance."
            },
            {
              "text": "You need to extract tables, fields, and document structure from scanned forms. Which pipeline is most appropriate?",
              "options": [
                "OCR, layout analysis, and field extraction",
                "Text-to-speech followed by translation",
                "Image generation followed by inpainting",
                "A chat completion with no document input"
              ],
              "correct": 0,
              "explanation": "Scanned-form extraction requires OCR to read text, layout analysis to understand structure, and field extraction to produce usable values."
            },
            {
              "text": "Extracted documents will be used by agents and downstream reasoning workflows. Which output is most useful?",
              "options": [
                "Unstructured screenshots only",
                "Grounded structured data or markdown with source provenance",
                "A single confidence score with no extracted content",
                "Base64-encoded pages without metadata"
              ],
              "correct": 1,
              "explanation": "Structured or markdown output with provenance is clean, grounded, and suitable for agent and RAG workflows."
            }
          ]
        }
      }
    ]
  },
  "GH-900": {
    "code": "GH-900",
    "title": "GitHub Foundations",
    "group": "Technical and architecture",
    "url": "https://learn.microsoft.com/en-us/credentials/certifications/github-foundations/",
    "modules": [
      {
        "id": "gh-900-1",
        "title": "Introduction to Git",
        "url": "https://learn.microsoft.com/en-us/training/modules/intro-to-git/",
        "questions": {
          "Easy": [],
          "Difficult": [
            {
              "text": "What type of version control system is Git?",
              "options": [
                "A distributed version control system where every clone holds the full history",
                "A centralized system where history lives only on one server",
                "A file-locking system that allows only one editor at a time",
                "A cloud-only service that requires an internet connection to commit"
              ],
              "correct": 0,
              "explanation": "Git is a distributed version control system; each clone contains the complete repository history."
            },
            {
              "text": "Which command records staged changes into the local repository history?",
              "options": [
                "git commit",
                "git push",
                "git clone",
                "git fetch"
              ],
              "correct": 0,
              "explanation": "git commit saves staged changes as a new commit in the local repository."
            },
            {
              "text": "What does the staging area (index) let you do before committing?",
              "options": [
                "Choose exactly which changes to include in the next commit",
                "Automatically deploy code to production",
                "Permanently delete a branch",
                "Encrypt the repository contents"
              ],
              "correct": 0,
              "explanation": "The staging area lets you select which changes will be part of the next commit."
            },
            {
              "text": "What is a commit in Git?",
              "options": [
                "A snapshot of your changes with a unique identifier and message",
                "A live connection to a remote server",
                "A temporary clipboard that clears on restart",
                "A backup that only stores file names"
              ],
              "correct": 0,
              "explanation": "A commit is a snapshot of changes, identified by a hash and described by a message."
            },
            {
              "text": "Why is branching considered a core strength of Git?",
              "options": [
                "It lets you work on features in isolation and merge them later",
                "It permanently locks files for other users",
                "It removes the need to commit changes",
                "It stores each branch on a separate physical server"
              ],
              "correct": 0,
              "explanation": "Branches let you develop work in isolation and merge it back when ready."
            }
          ]
        }
      },
      {
        "id": "gh-900-2",
        "title": "Introduction to GitHub",
        "url": "https://learn.microsoft.com/en-us/training/modules/introduction-to-github/",
        "questions": {
          "Easy": [],
          "Difficult": [
            {
              "text": "What is a GitHub repository?",
              "options": [
                "A storage location for a project's files and their complete version history",
                "A chat channel for developers",
                "A billing dashboard for your account",
                "A local text editor installed on your machine"
              ],
              "correct": 0,
              "explanation": "A repository stores a project's files along with the full history of changes."
            },
            {
              "text": "What is the primary purpose of a pull request on GitHub?",
              "options": [
                "To propose changes and enable review before merging into a branch",
                "To permanently delete a repository",
                "To download a repository to your computer",
                "To reset your account password"
              ],
              "correct": 0,
              "explanation": "Pull requests propose changes and allow discussion and review before merging."
            },
            {
              "text": "What are GitHub Issues used for?",
              "options": [
                "Tracking bugs, tasks, and feature requests with discussion",
                "Storing binary release artifacts",
                "Configuring server firewalls",
                "Encrypting repository secrets"
              ],
              "correct": 0,
              "explanation": "Issues track bugs, tasks, and ideas, and support collaborative discussion."
            },
            {
              "text": "What does forking a repository do?",
              "options": [
                "Creates your own copy of someone else's repository under your account",
                "Deletes the original repository",
                "Merges two repositories permanently",
                "Locks the repository so no one can edit it"
              ],
              "correct": 0,
              "explanation": "A fork is a personal copy of another repository that you can modify freely."
            },
            {
              "text": "How do GitHub notifications help collaboration?",
              "options": [
                "They alert you to activity like mentions, reviews, and issue updates",
                "They automatically write your code",
                "They delete inactive branches",
                "They replace the need for pull requests"
              ],
              "correct": 0,
              "explanation": "Notifications keep you informed of relevant activity such as mentions and reviews."
            }
          ]
        }
      },
      {
        "id": "gh-900-3",
        "title": "Introduction to GitHub's products",
        "url": "https://learn.microsoft.com/en-us/training/modules/github-introduction-products/",
        "questions": {
          "Easy": [],
          "Difficult": [
            {
              "text": "Which GitHub plan is designed for individual developers and small teams at no cost for core features?",
              "options": [
                "GitHub Free",
                "GitHub Enterprise Cloud",
                "GitHub Enterprise Server",
                "GitHub One"
              ],
              "correct": 0,
              "explanation": "GitHub Free provides core collaboration features for individuals and small teams."
            },
            {
              "text": "What does GitHub Enterprise primarily add for large organizations?",
              "options": [
                "Advanced security, compliance, and administrative controls at scale",
                "The ability to write code without commits",
                "Free unlimited physical servers",
                "Automatic removal of all billing"
              ],
              "correct": 0,
              "explanation": "GitHub Enterprise offers advanced security, compliance, and admin capabilities for large orgs."
            },
            {
              "text": "What is GitHub Desktop?",
              "options": [
                "A graphical application for working with GitHub repositories locally",
                "A cloud-based code editor only",
                "A billing management portal",
                "A command-line-only tool"
              ],
              "correct": 0,
              "explanation": "GitHub Desktop is a GUI app that simplifies working with repositories on your computer."
            },
            {
              "text": "What is GitHub Mobile used for?",
              "options": [
                "Managing issues, pull requests, and notifications from a phone",
                "Compiling native applications on the device",
                "Hosting production web servers",
                "Replacing Git entirely"
              ],
              "correct": 0,
              "explanation": "GitHub Mobile lets you triage issues, review pull requests, and manage notifications on the go."
            },
            {
              "text": "Which factor most commonly determines which GitHub plan an organization chooses?",
              "options": [
                "The features, security, and support level the organization needs",
                "The color theme of the interface",
                "The number of Markdown files in a repo",
                "The programming language used"
              ],
              "correct": 0,
              "explanation": "Plan choice is driven by required features, security, compliance, and support needs."
            }
          ]
        }
      },
      {
        "id": "gh-900-4",
        "title": "Configure code scanning on GitHub",
        "url": "https://learn.microsoft.com/en-us/training/modules/configure-code-scanning/",
        "questions": {
          "Easy": [],
          "Difficult": [
            {
              "text": "What is the main purpose of code scanning on GitHub?",
              "options": [
                "To automatically find security vulnerabilities and coding errors in a repository",
                "To format Markdown documents",
                "To manage user billing",
                "To rename branches automatically"
              ],
              "correct": 0,
              "explanation": "Code scanning analyzes code to detect security vulnerabilities and errors."
            },
            {
              "text": "Which analysis engine is built into GitHub for code scanning?",
              "options": [
                "CodeQL",
                "Kubernetes",
                "Terraform",
                "Jenkins"
              ],
              "correct": 0,
              "explanation": "CodeQL is GitHub's semantic code analysis engine used for code scanning."
            },
            {
              "text": "How is code scanning commonly automated in a repository?",
              "options": [
                "By running it through GitHub Actions workflows",
                "By emailing code to a reviewer",
                "By printing the code for manual review",
                "By disabling all pull requests"
              ],
              "correct": 0,
              "explanation": "GitHub Actions workflows can run code scanning automatically on events like pushes and pull requests."
            },
            {
              "text": "Where do code scanning results appear for triage?",
              "options": [
                "In the Security tab as alerts",
                "In the repository's README",
                "In the billing settings",
                "In the user's profile bio"
              ],
              "correct": 0,
              "explanation": "Code scanning alerts are surfaced in the repository's Security tab."
            },
            {
              "text": "Besides CodeQL, what else can be used to perform code scanning on GitHub?",
              "options": [
                "Third-party analysis tools integrated via Actions",
                "Only manual code review",
                "A spreadsheet of known bugs",
                "The repository wiki"
              ],
              "correct": 0,
              "explanation": "Code scanning supports third-party tools in addition to CodeQL, integrated through Actions."
            }
          ]
        }
      },
      {
        "id": "gh-900-5",
        "title": "Introduction to GitHub Copilot",
        "url": "https://learn.microsoft.com/en-us/training/modules/introduction-to-github-copilot/",
        "questions": {
          "Easy": [],
          "Difficult": [
            {
              "text": "What is GitHub Copilot?",
              "options": [
                "An AI-powered coding assistant that suggests code and answers questions",
                "A version control system that replaces Git",
                "A billing tool for repositories",
                "A static site hosting service"
              ],
              "correct": 0,
              "explanation": "GitHub Copilot is an AI pair programmer that provides code suggestions and chat assistance."
            },
            {
              "text": "How does Copilot typically present inline suggestions?",
              "options": [
                "As grayed-out ghost text you can accept as you type",
                "As pop-up advertisements",
                "As emails sent to your inbox",
                "As changes committed automatically without review"
              ],
              "correct": 0,
              "explanation": "Copilot shows inline suggestions as ghost text that you can accept or ignore."
            },
            {
              "text": "What can Copilot Chat help you do?",
              "options": [
                "Explain, refactor, and debug code through a conversational interface",
                "Manage your GitHub billing plan",
                "Provision cloud servers directly",
                "Encrypt your repository"
              ],
              "correct": 0,
              "explanation": "Copilot Chat lets you ask questions to explain, refactor, and debug code conversationally."
            },
            {
              "text": "Who is ultimately responsible for reviewing Copilot's suggestions?",
              "options": [
                "The developer, who should verify correctness and security",
                "GitHub support staff",
                "The Copilot model itself",
                "No one, since suggestions are always correct"
              ],
              "correct": 0,
              "explanation": "Developers remain responsible for reviewing and validating Copilot's suggestions."
            },
            {
              "text": "In which environments can GitHub Copilot be used?",
              "options": [
                "Supported editors and IDEs such as VS Code and Visual Studio",
                "Only inside a web browser tab",
                "Only on GitHub Mobile",
                "Only through email"
              ],
              "correct": 0,
              "explanation": "Copilot integrates with supported editors and IDEs like VS Code and Visual Studio."
            }
          ]
        }
      },
      {
        "id": "gh-900-6",
        "title": "Code with GitHub Codespaces",
        "url": "https://learn.microsoft.com/en-us/training/modules/code-with-github-codespaces/",
        "questions": {
          "Easy": [],
          "Difficult": [
            {
              "text": "What is a GitHub Codespace?",
              "options": [
                "A cloud-hosted development environment you can access from a browser or editor",
                "A local hard drive partition",
                "A billing plan for enterprises",
                "A type of pull request"
              ],
              "correct": 0,
              "explanation": "A Codespace is a configurable, cloud-hosted development environment."
            },
            {
              "text": "What is a key advantage of using Codespaces?",
              "options": [
                "You get a ready-to-code environment without local setup",
                "It permanently deletes your local files",
                "It removes the need for version control",
                "It only works offline"
              ],
              "correct": 0,
              "explanation": "Codespaces provide a preconfigured environment accessible from anywhere, reducing setup."
            },
            {
              "text": "Which file is commonly used to configure a Codespace environment?",
              "options": [
                "A devcontainer.json configuration file",
                "A .gitignore file",
                "The README.md",
                "The LICENSE file"
              ],
              "correct": 0,
              "explanation": "The devcontainer.json file defines the tools and settings for a Codespace."
            },
            {
              "text": "How can you open a Codespace?",
              "options": [
                "From a repository in the browser or from VS Code",
                "Only by installing a desktop-only app",
                "Only through GitHub Mobile",
                "Only by emailing GitHub support"
              ],
              "correct": 0,
              "explanation": "Codespaces can be launched from the repository in a browser or through VS Code."
            },
            {
              "text": "What happens to your work in a Codespace between sessions?",
              "options": [
                "It persists in the cloud environment until the Codespace is deleted",
                "It is erased every time you close the tab",
                "It is printed to paper",
                "It is emailed to all collaborators"
              ],
              "correct": 0,
              "explanation": "A Codespace retains its state in the cloud until you delete it."
            }
          ]
        }
      },
      {
        "id": "gh-900-7",
        "title": "Manage your work with GitHub Projects",
        "url": "https://learn.microsoft.com/en-us/training/modules/manage-work-github-projects/",
        "questions": {
          "Easy": [],
          "Difficult": [
            {
              "text": "What is GitHub Projects used for?",
              "options": [
                "Planning and tracking work using boards, tables, and custom fields",
                "Compiling source code",
                "Managing DNS records",
                "Encrypting commits"
              ],
              "correct": 0,
              "explanation": "GitHub Projects helps teams plan and track work with flexible boards and tables."
            },
            {
              "text": "What can be added as items in a GitHub Project?",
              "options": [
                "Issues and pull requests, plus draft notes",
                "Only image files",
                "Only billing invoices",
                "Only wiki pages"
              ],
              "correct": 0,
              "explanation": "Projects can contain issues, pull requests, and draft items."
            },
            {
              "text": "What are custom fields in GitHub Projects used for?",
              "options": [
                "Adding metadata like status, priority, or iteration to items",
                "Changing the repository's license",
                "Deleting branches automatically",
                "Storing user passwords"
              ],
              "correct": 0,
              "explanation": "Custom fields let you track metadata such as status, priority, and iteration."
            },
            {
              "text": "Which view types does GitHub Projects support?",
              "options": [
                "Board and table (and roadmap) views",
                "Only a single fixed list",
                "Only a calendar",
                "Only a raw text file"
              ],
              "correct": 0,
              "explanation": "Projects support board, table, and roadmap views for different perspectives on the work."
            },
            {
              "text": "How do Projects help a team collaborate?",
              "options": [
                "They provide a shared, up-to-date view of work and its status",
                "They restrict access to the codebase",
                "They replace pull request reviews",
                "They remove the need for issues"
              ],
              "correct": 0,
              "explanation": "Projects give the whole team a shared, current view of what is being worked on."
            }
          ]
        }
      },
      {
        "id": "gh-900-8",
        "title": "Communicate effectively on GitHub using Markdown",
        "url": "https://learn.microsoft.com/en-us/training/modules/communicate-using-markdown/",
        "questions": {
          "Easy": [],
          "Difficult": [
            {
              "text": "What is Markdown?",
              "options": [
                "A lightweight markup language for formatting text",
                "A programming language for building apps",
                "A database query language",
                "A cloud hosting service"
              ],
              "correct": 0,
              "explanation": "Markdown is a lightweight markup language used to format plain text."
            },
            {
              "text": "How do you create a heading in Markdown?",
              "options": [
                "Start the line with one or more # characters",
                "Wrap the text in <table> tags",
                "Prefix the line with a dollar sign",
                "Indent the line with four spaces only"
              ],
              "correct": 0,
              "explanation": "Headings are created with # symbols, where more # means a smaller heading level."
            },
            {
              "text": "How do you make text bold in Markdown?",
              "options": [
                "Wrap it in double asterisks, like **text**",
                "Prefix it with a > character",
                "Wrap it in single backticks",
                "Add three dashes below it"
              ],
              "correct": 0,
              "explanation": "Double asterisks (or double underscores) around text make it bold."
            },
            {
              "text": "What does a backtick (`) around text create in Markdown?",
              "options": [
                "Inline code formatting",
                "A hyperlink",
                "A bulleted list",
                "A blockquote"
              ],
              "correct": 0,
              "explanation": "Single backticks create inline code formatting."
            },
            {
              "text": "Which GitHub feature lets you reuse Markdown content like issue templates?",
              "options": [
                "Saved replies and issue/PR templates",
                "Branch protection rules",
                "Code scanning alerts",
                "Billing settings"
              ],
              "correct": 0,
              "explanation": "Templates and saved replies let you reuse standardized Markdown content."
            }
          ]
        }
      },
      {
        "id": "gh-900-9",
        "title": "Contribute to an open-source project on GitHub",
        "url": "https://learn.microsoft.com/en-us/training/modules/contribute-open-source/",
        "questions": {
          "Easy": [],
          "Difficult": [
            {
              "text": "What is usually the first step to contribute code to someone else's open-source project?",
              "options": [
                "Fork the repository, then create a branch for your change",
                "Delete the original repository",
                "Email the maintainer your entire codebase",
                "Force-push to the main branch directly"
              ],
              "correct": 0,
              "explanation": "Contributors typically fork the repo and work on a branch before opening a pull request."
            },
            {
              "text": "Which file commonly explains how to contribute to a project?",
              "options": [
                "CONTRIBUTING.md",
                "package-lock.json",
                ".gitignore",
                "LICENSE"
              ],
              "correct": 0,
              "explanation": "A CONTRIBUTING.md file describes how to contribute to the project."
            },
            {
              "text": "How do you propose your changes back to the original open-source project?",
              "options": [
                "Open a pull request from your fork/branch",
                "Publish a blog post",
                "Create a new unrelated repository",
                "Send a direct message on social media"
              ],
              "correct": 0,
              "explanation": "A pull request proposes your changes to the upstream project for review."
            },
            {
              "text": "Why is communicating with maintainers important when contributing?",
              "options": [
                "It helps align your change with the project's goals and increases acceptance",
                "It is required to delete the repository",
                "It automatically merges your code",
                "It bypasses code review"
              ],
              "correct": 0,
              "explanation": "Clear communication helps your contribution fit the project and get accepted."
            },
            {
              "text": "What is a common benefit of contributing to open source?",
              "options": [
                "Building skills, reputation, and community connections",
                "Guaranteed payment for every commit",
                "Automatic ownership of the project",
                "Removal of all code review"
              ],
              "correct": 0,
              "explanation": "Open-source contribution builds experience, reputation, and community relationships."
            }
          ]
        }
      },
      {
        "id": "gh-900-10",
        "title": "Manage an InnerSource program by using GitHub",
        "url": "https://learn.microsoft.com/en-us/training/modules/manage-innersource-program-github/",
        "questions": {
          "Easy": [],
          "Difficult": [
            {
              "text": "What is InnerSource?",
              "options": [
                "Applying open-source collaboration practices within an organization",
                "A tool that encrypts private repositories",
                "A GitHub billing tier",
                "A programming language"
              ],
              "correct": 0,
              "explanation": "InnerSource applies open-source methods and culture inside a company."
            },
            {
              "text": "Which practice helps make InnerSource projects discoverable?",
              "options": [
                "Clear documentation, topics, and searchable repositories",
                "Hiding repositories from all employees",
                "Removing README files",
                "Disabling issues"
              ],
              "correct": 0,
              "explanation": "Good documentation and discoverability let employees find and use internal projects."
            },
            {
              "text": "Why is clear contribution guidance important in InnerSource?",
              "options": [
                "It helps colleagues from other teams contribute effectively",
                "It prevents anyone from cloning the repo",
                "It disables pull requests",
                "It removes the need for maintainers"
              ],
              "correct": 0,
              "explanation": "Guidance such as CONTRIBUTING files helps cross-team contributors participate."
            },
            {
              "text": "What role do maintainers play in an InnerSource program?",
              "options": [
                "They guide contributions, review changes, and keep the project healthy",
                "They delete the repository weekly",
                "They handle company payroll",
                "They manage physical servers only"
              ],
              "correct": 0,
              "explanation": "Maintainers steward the project, review contributions, and keep it healthy."
            },
            {
              "text": "What is a key benefit of InnerSource for an organization?",
              "options": [
                "Increased collaboration, reuse, and reduced duplicated effort across teams",
                "Higher licensing costs",
                "Fewer available repositories",
                "Mandatory public exposure of code"
              ],
              "correct": 0,
              "explanation": "InnerSource increases collaboration and code reuse while reducing duplicated work."
            }
          ]
        }
      },
      {
        "id": "gh-900-11",
        "title": "Maintain a secure repository by using GitHub best practices",
        "url": "https://learn.microsoft.com/en-us/training/modules/maintain-secure-repository-github/",
        "questions": {
          "Easy": [],
          "Difficult": [
            {
              "text": "What is the purpose of Dependabot on GitHub?",
              "options": [
                "To alert you to and update vulnerable dependencies",
                "To format your Markdown files",
                "To manage user billing",
                "To delete stale branches"
              ],
              "correct": 0,
              "explanation": "Dependabot detects vulnerable dependencies and can open update pull requests."
            },
            {
              "text": "How should secrets like API keys be handled in a repository?",
              "options": [
                "Kept out of code and stored in encrypted secrets, not committed",
                "Committed directly into the README",
                "Shared in issue comments",
                "Printed in the repository description"
              ],
              "correct": 0,
              "explanation": "Secrets should never be committed; use encrypted secrets and keep them out of code."
            },
            {
              "text": "What does secret scanning do?",
              "options": [
                "Detects credentials accidentally committed to a repository",
                "Scans images for viruses",
                "Formats source code",
                "Manages pull request labels"
              ],
              "correct": 0,
              "explanation": "Secret scanning finds exposed credentials and tokens committed to a repository."
            },
            {
              "text": "What is a branch protection rule used for?",
              "options": [
                "Enforcing requirements like reviews or checks before merging",
                "Deleting a branch after each commit",
                "Encrypting the repository",
                "Hiding the commit history"
              ],
              "correct": 0,
              "explanation": "Branch protection rules enforce standards, such as required reviews, before merging."
            },
            {
              "text": "Which practice improves repository security posture?",
              "options": [
                "Regularly reviewing access, enabling scanning, and updating dependencies",
                "Giving every user admin access",
                "Disabling all security alerts",
                "Committing secrets for convenience"
              ],
              "correct": 0,
              "explanation": "Least-privilege access, scanning, and dependency updates strengthen security."
            }
          ]
        }
      },
      {
        "id": "gh-900-12",
        "title": "Introduction to GitHub administration",
        "url": "https://learn.microsoft.com/en-us/training/modules/github-introduction-administration/",
        "questions": {
          "Easy": [],
          "Difficult": [
            {
              "text": "What is a primary responsibility of a GitHub organization administrator?",
              "options": [
                "Managing members, teams, and access permissions",
                "Writing all of the organization's code",
                "Designing the company logo",
                "Approving every individual commit personally"
              ],
              "correct": 0,
              "explanation": "Admins manage members, teams, and repository access across the organization."
            },
            {
              "text": "How do teams help manage access in a GitHub organization?",
              "options": [
                "They group members to grant permissions collectively",
                "They store binary artifacts",
                "They replace pull requests",
                "They handle billing invoices"
              ],
              "correct": 0,
              "explanation": "Teams group people so permissions can be granted to many members at once."
            },
            {
              "text": "What is the principle of least privilege in administration?",
              "options": [
                "Granting only the access each person needs to do their work",
                "Giving everyone admin rights",
                "Removing all permissions from everyone",
                "Sharing one account among all users"
              ],
              "correct": 0,
              "explanation": "Least privilege means granting only the minimum access required."
            },
            {
              "text": "What is the difference between organization and enterprise accounts?",
              "options": [
                "Enterprise accounts manage multiple organizations with centralized policy",
                "Organizations can only hold one repository",
                "Enterprise accounts cannot have members",
                "They are identical in every way"
              ],
              "correct": 0,
              "explanation": "Enterprise accounts centrally manage multiple organizations and their policies."
            },
            {
              "text": "Why is auditing activity important for administrators?",
              "options": [
                "It provides visibility into actions for security and compliance",
                "It automatically writes documentation",
                "It deletes old repositories",
                "It replaces access controls"
              ],
              "correct": 0,
              "explanation": "Audit logs give admins visibility into actions for security and compliance."
            }
          ]
        }
      },
      {
        "id": "gh-900-13",
        "title": "Authenticate and authorize user identities on GitHub",
        "url": "https://learn.microsoft.com/en-us/training/modules/authenticate-authorize-user-identities-github/",
        "questions": {
          "Easy": [],
          "Difficult": [
            {
              "text": "What does two-factor authentication (2FA) add to a GitHub account?",
              "options": [
                "A second verification step beyond the password",
                "A faster internet connection",
                "Automatic code formatting",
                "Unlimited free repositories"
              ],
              "correct": 0,
              "explanation": "2FA requires a second factor in addition to the password, improving security."
            },
            {
              "text": "What is a personal access token (PAT) used for?",
              "options": [
                "Authenticating to GitHub for Git operations and API access",
                "Encrypting the repository README",
                "Storing project documentation",
                "Managing billing plans"
              ],
              "correct": 0,
              "explanation": "PATs authenticate command-line and API access in place of a password."
            },
            {
              "text": "What is the difference between authentication and authorization?",
              "options": [
                "Authentication verifies identity; authorization determines access rights",
                "They are the same thing",
                "Authorization verifies identity; authentication grants access",
                "Neither relates to security"
              ],
              "correct": 0,
              "explanation": "Authentication proves who you are; authorization defines what you can do."
            },
            {
              "text": "What does SAML single sign-on (SSO) provide for organizations?",
              "options": [
                "Centralized identity management through an identity provider",
                "Free unlimited storage",
                "Automatic code reviews",
                "A new programming language"
              ],
              "correct": 0,
              "explanation": "SAML SSO lets organizations centrally manage access via an identity provider."
            },
            {
              "text": "Why should tokens and keys be scoped and rotated?",
              "options": [
                "To limit access and reduce risk if they are exposed",
                "To make them harder to create",
                "To increase billing charges",
                "To disable the repository"
              ],
              "correct": 0,
              "explanation": "Scoping and rotating credentials limits access and reduces the impact of a leak."
            }
          ]
        }
      },
      {
        "id": "gh-900-14",
        "title": "Manage repository changes by using pull requests on GitHub",
        "url": "https://learn.microsoft.com/en-us/training/modules/manage-changes-pull-requests-github/",
        "questions": {
          "Easy": [],
          "Difficult": [
            {
              "text": "What does a pull request enable a team to do?",
              "options": [
                "Review, discuss, and approve changes before they are merged",
                "Delete the repository history",
                "Bypass all code review",
                "Automatically deploy to production without checks"
              ],
              "correct": 0,
              "explanation": "Pull requests enable review and discussion of changes before merging."
            },
            {
              "text": "What is a merge conflict?",
              "options": [
                "When competing changes to the same lines can't be automatically combined",
                "When two users have the same username",
                "When a repository exceeds its size limit",
                "When a branch has no commits"
              ],
              "correct": 0,
              "explanation": "A merge conflict occurs when Git can't automatically reconcile competing changes."
            },
            {
              "text": "What is the benefit of requiring reviews on a pull request?",
              "options": [
                "It improves code quality and shares knowledge before merging",
                "It permanently locks the repository",
                "It removes the need for tests",
                "It deletes the source branch"
              ],
              "correct": 0,
              "explanation": "Required reviews improve quality and spread knowledge across the team."
            },
            {
              "text": "What are status checks on a pull request?",
              "options": [
                "Automated tests or validations that must pass before merging",
                "Manual emails sent to reviewers",
                "A list of repository collaborators",
                "The repository's license type"
              ],
              "correct": 0,
              "explanation": "Status checks are automated validations that can be required before merging."
            },
            {
              "text": "What does a draft pull request indicate?",
              "options": [
                "Work in progress that is not yet ready for review or merge",
                "A pull request that is already merged",
                "A permanently closed request",
                "A request to delete a branch"
              ],
              "correct": 0,
              "explanation": "A draft pull request signals the work is still in progress and not ready to merge."
            }
          ]
        }
      },
      {
        "id": "gh-900-15",
        "title": "Search and organize repository history by using GitHub",
        "url": "https://learn.microsoft.com/en-us/training/modules/search-organize-repository-history-github/",
        "questions": {
          "Easy": [],
          "Difficult": [
            {
              "text": "What does 'git blame' (or the blame view) show?",
              "options": [
                "Who last changed each line of a file and in which commit",
                "A list of failed builds",
                "The repository's billing history",
                "The number of forks"
              ],
              "correct": 0,
              "explanation": "Blame shows the commit and author responsible for each line of a file."
            },
            {
              "text": "What is the purpose of searching commit history?",
              "options": [
                "To find when and why specific changes were made",
                "To format Markdown",
                "To manage user permissions",
                "To delete old branches"
              ],
              "correct": 0,
              "explanation": "Searching history helps you locate when and why particular changes happened."
            },
            {
              "text": "How can you narrow GitHub search results effectively?",
              "options": [
                "Use filters and qualifiers such as author, path, or date",
                "Only scroll through every result manually",
                "Search only by repository color",
                "Disable all filters"
              ],
              "correct": 0,
              "explanation": "Search qualifiers and filters (author, path, date, etc.) refine results."
            },
            {
              "text": "What does cross-linking issues and pull requests achieve?",
              "options": [
                "It connects related work so context is easy to follow",
                "It deletes the linked items",
                "It hides the commit history",
                "It disables notifications"
              ],
              "correct": 0,
              "explanation": "Cross-linking connects related issues and PRs, making context easy to trace."
            },
            {
              "text": "Why is a well-organized commit history valuable?",
              "options": [
                "It makes changes easier to understand, review, and troubleshoot",
                "It increases repository storage limits",
                "It removes the need for branches",
                "It automatically fixes bugs"
              ],
              "correct": 0,
              "explanation": "A clear history makes it easier to understand, review, and debug changes."
            }
          ]
        }
      },
      {
        "id": "gh-900-16",
        "title": "Using GitHub Copilot with Python",
        "url": "https://learn.microsoft.com/en-us/training/modules/introduction-copilot-python/",
        "questions": {
          "Easy": [],
          "Difficult": [
            {
              "text": "How can GitHub Copilot assist when writing Python code?",
              "options": [
                "By suggesting functions, completing code, and offering fixes as you type",
                "By hosting your Python web server",
                "By managing your GitHub billing",
                "By encrypting your repository"
              ],
              "correct": 0,
              "explanation": "Copilot provides autocomplete-style suggestions and fixes while you write Python."
            },
            {
              "text": "What is a good way to guide Copilot toward a useful Python suggestion?",
              "options": [
                "Write a clear function name, comment, or docstring describing the intent",
                "Delete all comments from the file",
                "Rename variables to random characters",
                "Disable the editor's syntax highlighting"
              ],
              "correct": 0,
              "explanation": "Descriptive names, comments, and docstrings help Copilot produce relevant suggestions."
            },
            {
              "text": "Why should you still test Copilot-generated Python code?",
              "options": [
                "Suggestions can contain bugs or miss edge cases and must be verified",
                "Because Copilot never produces working code",
                "Because testing is required to accept a suggestion",
                "Because Copilot deletes code that isn't tested"
              ],
              "correct": 0,
              "explanation": "Copilot's suggestions may have bugs, so testing and review remain essential."
            },
            {
              "text": "What kind of Python tasks is Copilot commonly helpful with?",
              "options": [
                "Boilerplate, repetitive patterns, and common algorithms",
                "Paying invoices",
                "Physically installing servers",
                "Designing hardware chips"
              ],
              "correct": 0,
              "explanation": "Copilot excels at boilerplate, repetitive code, and common algorithmic patterns."
            },
            {
              "text": "How does Copilot Chat help a Python developer?",
              "options": [
                "It can explain code, suggest refactors, and help debug interactively",
                "It compiles Python into hardware",
                "It manages DNS records",
                "It replaces the Python interpreter"
              ],
              "correct": 0,
              "explanation": "Copilot Chat can explain, refactor, and help debug Python code conversationally."
            }
          ]
        }
      }
    ]
  },
  "AB-100": {
    "code": "AB-100",
    "title": "Agentic AI Business Solutions Architect",
    "group": "Technical and architecture",
    "url": "https://learn.microsoft.com/en-us/credentials/certifications/resources/study-guides/ab-100",
    "modules": [
      {
        "id": "ab-100-1",
        "title": "Analyze requirements for AI-powered business solutions",
        "url": "https://learn.microsoft.com/en-us/credentials/certifications/resources/study-guides/ab-100",
        "questions": {
          "Easy": [],
          "Difficult": [
            {
              "text": "When assessing whether a business task is a good candidate for agent-based automation, which characteristic is the strongest indicator of a good fit?",
              "options": [
                "The task is repetitive and rules-based with clear, well-defined inputs and outputs",
                "The task is performed only once per year by a single executive",
                "The task has no measurable outcome or success criteria",
                "The task depends entirely on unpredictable human intuition"
              ],
              "correct": 0,
              "explanation": "Repetitive, well-defined tasks with clear inputs/outputs are the best fit for agent automation."
            },
            {
              "text": "Which set of qualities should you evaluate when reviewing data used for grounding an AI solution?",
              "options": [
                "Accuracy, relevance, timeliness, cleanliness, and availability",
                "Font, color, spacing, and layout",
                "Server region, VM size, and disk type",
                "The number of columns and the file extension only"
              ],
              "correct": 0,
              "explanation": "Grounding data should be assessed for accuracy, relevance, timeliness, cleanliness, and availability."
            },
            {
              "text": "Why should business solution data be organized so it's available to other AI systems?",
              "options": [
                "To enable reuse and consistent grounding across multiple agents and solutions",
                "To permanently lock the data so no system can access it",
                "To increase storage costs intentionally",
                "To prevent any agent from being grounded"
              ],
              "correct": 0,
              "explanation": "Well-organized, accessible data enables reuse and consistent grounding across AI systems."
            },
            {
              "text": "A stakeholder wants an agent to support decision-making. What should you assess first?",
              "options": [
                "The quality and availability of grounding data and clear decision criteria",
                "The color scheme of the agent's interface",
                "The number of employees in the company",
                "Which font the reports will use"
              ],
              "correct": 0,
              "explanation": "Reliable decision-making depends on high-quality grounding data and clear decision criteria."
            },
            {
              "text": "What is the primary purpose of grounding data in an AI-powered solution?",
              "options": [
                "To provide factual, relevant context so responses are accurate and trustworthy",
                "To slow down the model deliberately",
                "To replace the need for any language model",
                "To store user passwords securely"
              ],
              "correct": 0,
              "explanation": "Grounding supplies factual context so the AI produces accurate, trustworthy responses."
            }
          ]
        }
      },
      {
        "id": "ab-100-2",
        "title": "Design overall AI strategy for business solutions",
        "url": "https://learn.microsoft.com/en-us/credentials/certifications/resources/study-guides/ab-100",
        "questions": {
          "Easy": [],
          "Difficult": [
            {
              "text": "Which Microsoft framework guides the AI adoption process when defining an enterprise AI strategy?",
              "options": [
                "The Cloud Adoption Framework for Azure",
                "The OSI networking model",
                "The waterfall project methodology",
                "The relational database normalization rules"
              ],
              "correct": 0,
              "explanation": "The Cloud Adoption Framework for Azure provides the AI adoption process guidance."
            },
            {
              "text": "When should you extend Microsoft 365 Copilot rather than build a fully custom agent?",
              "options": [
                "When the requirement is largely met by existing M365 data and capabilities with light extension",
                "When you want to avoid using any Microsoft services",
                "When the requirement has nothing to do with M365 content",
                "Only when no data is involved at all"
              ],
              "correct": 0,
              "explanation": "Extending M365 Copilot fits when existing M365 capabilities and data mostly satisfy the need."
            },
            {
              "text": "What is the main purpose of a prompt library in a business solution?",
              "options": [
                "To reuse consistent, tested prompts across the organization",
                "To store user login credentials",
                "To replace all documentation",
                "To encrypt network traffic"
              ],
              "correct": 0,
              "explanation": "A prompt library promotes reuse of consistent, tested prompts across teams."
            },
            {
              "text": "When designing a multi-agent business solution, which platforms might you combine?",
              "options": [
                "Microsoft 365 Copilot, Copilot Studio, and Microsoft Foundry",
                "Only a single spreadsheet application",
                "A photo editor and a video player",
                "A printer driver and a fax service"
              ],
              "correct": 0,
              "explanation": "Multi-agent solutions can span Microsoft 365 Copilot, Copilot Studio, and Microsoft Foundry."
            },
            {
              "text": "What is the role of a Microsoft AI Center of Excellence in an AI strategy?",
              "options": [
                "To provide governance, standards, and best practices for AI adoption",
                "To physically build data center hardware",
                "To handle only payroll processing",
                "To design the company's office layout"
              ],
              "correct": 0,
              "explanation": "An AI Center of Excellence establishes governance, standards, and best practices for adoption."
            }
          ]
        }
      },
      {
        "id": "ab-100-3",
        "title": "Evaluate the costs and benefits of an AI-powered business solution",
        "url": "https://learn.microsoft.com/en-us/credentials/certifications/resources/study-guides/ab-100",
        "questions": {
          "Easy": [],
          "Difficult": [
            {
              "text": "Which element should ROI criteria for an AI-powered business solution include?",
              "options": [
                "Total cost of ownership (TCO)",
                "The CEO's favorite color",
                "The number of office plants",
                "The brand of coffee in the break room"
              ],
              "correct": 0,
              "explanation": "ROI criteria should account for the total cost of ownership."
            },
            {
              "text": "What does a model router do in an AI solution?",
              "options": [
                "Routes each request to the most suitable model",
                "Physically connects network cables",
                "Encrypts the model's weights",
                "Deletes unused prompts automatically"
              ],
              "correct": 0,
              "explanation": "A model router intelligently sends each request to the most suitable model."
            },
            {
              "text": "When analyzing whether to build, buy, or extend AI components, which factor is most relevant?",
              "options": [
                "Cost, time-to-value, and fit against existing capabilities",
                "The vendor's office location only",
                "The color of the product logo",
                "The number of letters in the product name"
              ],
              "correct": 0,
              "explanation": "Build/buy/extend decisions weigh cost, time-to-value, and fit with existing capabilities."
            },
            {
              "text": "What is the purpose of an ROI analysis for a proposed AI solution?",
              "options": [
                "To quantify benefits versus costs and justify the investment",
                "To choose the UI font",
                "To decide the office seating chart",
                "To schedule lunch breaks"
              ],
              "correct": 0,
              "explanation": "ROI analysis quantifies benefits against costs to justify the AI investment."
            },
            {
              "text": "How can a model router help optimize cost?",
              "options": [
                "By sending simpler requests to cheaper models and complex requests to more capable ones",
                "By always using the most expensive model",
                "By disabling all models to save money",
                "By routing every request to a human"
              ],
              "correct": 0,
              "explanation": "A model router controls cost by matching request complexity to model capability."
            }
          ]
        }
      },
      {
        "id": "ab-100-4",
        "title": "Design AI and agents for business solutions",
        "url": "https://learn.microsoft.com/en-us/credentials/certifications/resources/study-guides/ab-100",
        "questions": {
          "Easy": [],
          "Difficult": [
            {
              "text": "What best describes an autonomous agent?",
              "options": [
                "An agent that can act and complete tasks with minimal human intervention",
                "An agent that requires a human to approve every single keystroke",
                "A static report that never changes",
                "A spreadsheet macro that only runs on request"
              ],
              "correct": 0,
              "explanation": "Autonomous agents act and complete tasks with minimal human intervention."
            },
            {
              "text": "In Copilot Studio, what is a fallback topic used for?",
              "options": [
                "Handling user inputs that don't match any defined topic",
                "Storing the agent's billing information",
                "Encrypting the conversation logs",
                "Deleting the agent automatically"
              ],
              "correct": 0,
              "explanation": "A fallback topic handles inputs that don't match any defined topic."
            },
            {
              "text": "What is a task agent primarily designed to do?",
              "options": [
                "Perform specific, well-defined tasks",
                "Replace the entire operating system",
                "Manage physical building security",
                "Design marketing posters"
              ],
              "correct": 0,
              "explanation": "Task agents are designed to perform specific, well-defined tasks."
            },
            {
              "text": "Which framework helps you assess the design quality of intelligent application workloads on Power Platform?",
              "options": [
                "The Microsoft Power Platform Well-Architected Framework",
                "The OSI seven-layer model",
                "The SQL isolation levels",
                "The HTTP status code list"
              ],
              "correct": 0,
              "explanation": "The Power Platform Well-Architected Framework guides intelligent workload design quality."
            },
            {
              "text": "What is the purpose of a connector for Copilot in Dynamics 365 Sales?",
              "options": [
                "To integrate external systems and data into the Copilot experience",
                "To change the screen resolution",
                "To disable Copilot entirely",
                "To format Word documents"
              ],
              "correct": 0,
              "explanation": "Connectors integrate external systems and data into the Copilot experience."
            }
          ]
        }
      },
      {
        "id": "ab-100-5",
        "title": "Design extensibility of AI solutions",
        "url": "https://learn.microsoft.com/en-us/credentials/certifications/resources/study-guides/ab-100",
        "questions": {
          "Easy": [],
          "Difficult": [
            {
              "text": "What does the Model Context Protocol (MCP) enable in Copilot Studio?",
              "options": [
                "A standardized way to connect agents to external tools and data",
                "A way to change the agent's font",
                "A method to compress images",
                "A billing rate calculator"
              ],
              "correct": 0,
              "explanation": "MCP provides a standard way to connect agents to external tools and data."
            },
            {
              "text": "What is 'Computer Use' in Copilot Studio designed to let agents do?",
              "options": [
                "Automate tasks in apps and websites through their user interfaces",
                "Manufacture computer hardware",
                "Overclock the processor",
                "Replace the operating system"
              ],
              "correct": 0,
              "explanation": "Computer Use lets agents automate tasks in apps and websites via the UI."
            },
            {
              "text": "Where can Microsoft 365 Copilot agents be surfaced to users?",
              "options": [
                "In Microsoft 365 apps such as Teams and SharePoint",
                "Only inside a printer's control panel",
                "Only on a physical calculator",
                "Only in the BIOS settings"
              ],
              "correct": 0,
              "explanation": "M365 Copilot agents can be surfaced in apps like Teams and SharePoint."
            },
            {
              "text": "Why would you design an AI solution using custom models in Microsoft Foundry?",
              "options": [
                "To meet domain-specific requirements that generic models can't satisfy",
                "To make the solution slower on purpose",
                "To avoid using any AI at all",
                "To reduce the number of available features"
              ],
              "correct": 0,
              "explanation": "Custom models in Foundry address domain-specific needs generic models can't meet."
            },
            {
              "text": "What does enabling reasoning behavior in a Copilot Studio agent improve?",
              "options": [
                "The agent's ability to plan and handle multi-step responses",
                "The screen brightness",
                "The size of the log files",
                "The keyboard layout"
              ],
              "correct": 0,
              "explanation": "Reasoning behavior improves an agent's ability to plan multi-step responses."
            }
          ]
        }
      },
      {
        "id": "ab-100-6",
        "title": "Orchestrate configuration for prebuilt agents and apps",
        "url": "https://learn.microsoft.com/en-us/credentials/certifications/resources/study-guides/ab-100",
        "questions": {
          "Easy": [],
          "Difficult": [
            {
              "text": "What does Microsoft 365 Copilot for Sales primarily enhance?",
              "options": [
                "Sales workflows within Microsoft 365 and CRM systems",
                "3D game rendering",
                "Physical warehouse robots",
                "Printer firmware updates"
              ],
              "correct": 0,
              "explanation": "M365 Copilot for Sales enhances sales workflows across M365 and CRM."
            },
            {
              "text": "What is the AI hub in Microsoft Power Platform?",
              "options": [
                "A central place to discover and use Power Platform AI features",
                "A hardware networking switch",
                "A billing invoice generator",
                "A file compression tool"
              ],
              "correct": 0,
              "explanation": "The AI hub is a central place to discover and use Power Platform AI features."
            },
            {
              "text": "Why add knowledge sources to in-app help for Dynamics 365 Finance or Supply Chain Management?",
              "options": [
                "To improve contextual guidance and answers for users inside the app",
                "To increase the app's file size",
                "To remove all documentation",
                "To disable the finance module"
              ],
              "correct": 0,
              "explanation": "Adding knowledge sources improves contextual in-app guidance and answers."
            },
            {
              "text": "What is a key benefit of using prebuilt agents in Dynamics 365 apps?",
              "options": [
                "Faster time-to-value with ready-made AI capabilities",
                "Guaranteed removal of all business processes",
                "Slower performance by design",
                "Elimination of the user interface"
              ],
              "correct": 0,
              "explanation": "Prebuilt agents deliver faster time-to-value with ready-made capabilities."
            },
            {
              "text": "What does orchestrating AI features across multiple Dynamics 365 apps aim to achieve?",
              "options": [
                "Coherent, integrated AI experiences across the whole solution",
                "Isolated features that never share data",
                "A single-app-only experience",
                "Random behavior across apps"
              ],
              "correct": 0,
              "explanation": "Orchestration aims for coherent, integrated AI experiences across the solution."
            }
          ]
        }
      },
      {
        "id": "ab-100-7",
        "title": "Analyze, monitor, and tune AI-powered business solutions",
        "url": "https://learn.microsoft.com/en-us/credentials/certifications/resources/study-guides/ab-100",
        "questions": {
          "Easy": [],
          "Difficult": [
            {
              "text": "Why interpret telemetry data collected from deployed agents?",
              "options": [
                "To assess performance and guide model tuning and improvements",
                "To change the office thermostat",
                "To pick a new company logo",
                "To schedule holidays"
              ],
              "correct": 0,
              "explanation": "Telemetry interpretation drives performance assessment and model tuning."
            },
            {
              "text": "What is a primary purpose of monitoring agent metrics?",
              "options": [
                "To detect issues and drive continuous improvement",
                "To increase electricity usage",
                "To hide the agent from users",
                "To delete the telemetry"
              ],
              "correct": 0,
              "explanation": "Monitoring metrics helps detect issues and continuously improve the solution."
            },
            {
              "text": "How does analyzing user feedback help tune an AI solution?",
              "options": [
                "It highlights failures and areas that need improvement",
                "It sets the screen resolution",
                "It replaces the need for any monitoring",
                "It encrypts the model weights"
              ],
              "correct": 0,
              "explanation": "User feedback surfaces failures and improvement opportunities for tuning."
            },
            {
              "text": "What should you monitor to help ensure agent reliability over time?",
              "options": [
                "Performance metrics and telemetry data",
                "The office Wi-Fi password",
                "The number of desks in the room",
                "The company stock ticker only"
              ],
              "correct": 0,
              "explanation": "Reliability depends on monitoring performance metrics and telemetry."
            },
            {
              "text": "What is a benefit of applying AI-based analysis tools to a deployed solution?",
              "options": [
                "They can automatically surface issues and support tuning",
                "They physically clean the servers",
                "They print monthly calendars",
                "They replace the finance team"
              ],
              "correct": 0,
              "explanation": "AI-based tools automatically identify issues and support tuning."
            }
          ]
        }
      },
      {
        "id": "ab-100-8",
        "title": "Manage the testing of AI-powered business solutions",
        "url": "https://learn.microsoft.com/en-us/credentials/certifications/resources/study-guides/ab-100",
        "questions": {
          "Easy": [],
          "Difficult": [
            {
              "text": "Why define validation criteria for a custom AI model?",
              "options": [
                "To objectively judge whether the model meets its requirements",
                "To choose the model's color",
                "To delete the training data",
                "To increase inference cost"
              ],
              "correct": 0,
              "explanation": "Validation criteria let you objectively assess whether the model meets requirements."
            },
            {
              "text": "What do end-to-end test scenarios validate in a solution spanning multiple Dynamics 365 apps?",
              "options": [
                "The full workflow across the integrated apps",
                "Only the login screen color",
                "The office network cabling",
                "The printer paper size"
              ],
              "correct": 0,
              "explanation": "End-to-end scenarios validate the complete workflow across integrated apps."
            },
            {
              "text": "Why establish metrics and a process to test agents?",
              "options": [
                "To measure quality and readiness consistently",
                "To make testing impossible",
                "To remove all test cases",
                "To hide defects from stakeholders"
              ],
              "correct": 0,
              "explanation": "Defined metrics and process enable consistent measurement of quality and readiness."
            },
            {
              "text": "How can Copilot assist in the testing effort?",
              "options": [
                "By helping generate test cases",
                "By deleting the test environment",
                "By disabling validation",
                "By hiding the results"
              ],
              "correct": 0,
              "explanation": "Copilot can assist by helping generate test cases."
            },
            {
              "text": "What does validating Copilot prompt best practices help ensure?",
              "options": [
                "Reliable, high-quality Copilot responses",
                "A faster keyboard",
                "Lower monitor brightness",
                "Fewer employees"
              ],
              "correct": 0,
              "explanation": "Validating prompt best practices helps ensure reliable, high-quality responses."
            }
          ]
        }
      },
      {
        "id": "ab-100-9",
        "title": "Design the ALM process for AI-powered business solutions",
        "url": "https://learn.microsoft.com/en-us/credentials/certifications/resources/study-guides/ab-100",
        "questions": {
          "Easy": [],
          "Difficult": [
            {
              "text": "What does Application Lifecycle Management (ALM) govern for AI-powered solutions?",
              "options": [
                "The lifecycle from development through deployment and maintenance",
                "Only the marketing budget",
                "The office cleaning schedule",
                "The color of the app icon"
              ],
              "correct": 0,
              "explanation": "ALM governs the solution lifecycle from development through deployment and maintenance."
            },
            {
              "text": "Why include data in the ALM process for AI models?",
              "options": [
                "Because data changes affect model behavior and must be versioned and controlled",
                "Because data is irrelevant to models",
                "To make deployments slower",
                "To avoid tracking any changes"
              ],
              "correct": 0,
              "explanation": "Data changes affect model behavior, so data must be versioned and controlled in ALM."
            },
            {
              "text": "What is a benefit of applying ALM to Copilot Studio agents, connectors, and actions?",
              "options": [
                "Controlled, repeatable promotion across environments",
                "Random deployment order",
                "Permanent loss of change history",
                "Elimination of all environments"
              ],
              "correct": 0,
              "explanation": "ALM enables controlled, repeatable promotion of agents across environments."
            },
            {
              "text": "Why apply ALM to custom AI models?",
              "options": [
                "To track versions and changes and enable safe deployment",
                "To prevent any deployment ever",
                "To hide the model from developers",
                "To increase model errors"
              ],
              "correct": 0,
              "explanation": "ALM tracks versions and changes for custom models and enables safe deployment."
            },
            {
              "text": "What is a key goal of an ALM strategy for agentic-first solutions?",
              "options": [
                "Consistent, reliable deployment and change management",
                "Untracked, ad-hoc changes",
                "Avoiding all testing",
                "Removing version control"
              ],
              "correct": 0,
              "explanation": "An ALM strategy targets consistent, reliable deployment and change management."
            }
          ]
        }
      },
      {
        "id": "ab-100-10",
        "title": "Design responsible AI, security, governance, risk management, and compliance",
        "url": "https://learn.microsoft.com/en-us/credentials/certifications/resources/study-guides/ab-100",
        "questions": {
          "Easy": [],
          "Difficult": [
            {
              "text": "What is prompt injection (prompt manipulation) a risk to?",
              "options": [
                "The integrity and security of an AI agent's intended behavior",
                "The physical power supply",
                "The office lighting",
                "The printer's ink levels"
              ],
              "correct": 0,
              "explanation": "Prompt injection threatens the integrity and security of an agent's intended behavior."
            },
            {
              "text": "Why design audit trails for changes to models and data?",
              "options": [
                "To provide accountability and support compliance tracking",
                "To increase random noise",
                "To hide who made changes",
                "To delete historical records"
              ],
              "correct": 0,
              "explanation": "Audit trails provide accountability and support compliance tracking."
            },
            {
              "text": "What does validating data residency and movement compliance ensure?",
              "options": [
                "Data is stored and processed only in allowed locations",
                "Data is deleted immediately",
                "Data moves randomly between regions",
                "Data is never backed up"
              ],
              "correct": 0,
              "explanation": "Data residency validation ensures data stays within allowed locations."
            },
            {
              "text": "Against which principles should a solution be reviewed for responsible AI?",
              "options": [
                "The Microsoft Responsible AI principles",
                "The office dress code",
                "The building fire code only",
                "The parking policy"
              ],
              "correct": 0,
              "explanation": "Solutions should be reviewed against Microsoft Responsible AI principles."
            },
            {
              "text": "Why apply access controls to grounding data and model tuning?",
              "options": [
                "To prevent unauthorized data exposure and tampering",
                "To make data public to everyone",
                "To slow down the model",
                "To remove all security"
              ],
              "correct": 0,
              "explanation": "Access controls protect grounding data and tuning from unauthorized exposure and tampering."
            }
          ]
        }
      }
    ]
  }
};
