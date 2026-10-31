# NeonNova Command Center — AI Lab connected version

## Start the app with its secure AI backend

This version includes an optional Node.js backend for real OpenAI Responses API calls. The browser never receives the provider API key.

### Requirements
- Node.js 18 or newer
- Internet connection
- An OpenAI API key and API billing/usage access for real model requests (API usage may incur charges)

### Windows / VS Code setup
1. Extract the project ZIP and open the extracted folder in VS Code.
2. Open **Terminal → New Terminal**.
3. Run `npm install` and wait for it to finish.
4. Copy `.env.example` to a new file named `.env` in the same folder.
5. Open `.env` and replace `replace_with_your_private_key` with your own API key. Do not include the key in `script.js`, `index.html`, GitHub, or any public file.
6. Run `npm start`.
7. Open `http://localhost:3000` in your browser. Do not use Live Server for the connected AI feature; Live Server does not run `server.js`.
8. Open **AI Lab → Live AI Assistant**, enter a request, and press **Send to AI**.

To stop the server, click the terminal and press `Ctrl+C`.

## Security notes
- `.env` is ignored by Git via `.gitignore`; keep it private.
- The server applies a basic in-memory development request limit. Before public deployment, add user authentication, per-user quotas, durable rate limiting, request monitoring, and appropriate privacy controls.
- Do not expose this development server directly to the public internet as-is.
- Real model requests are sent to OpenAI and may incur API usage charges. Check your API project's billing, limits, and usage.
- The default model is `gpt-5.5`. Change `OPENAI_MODEL` in `.env` if your API project uses a different available model.

## Current AI connection
- `/api/health` reports whether a key is configured without returning the key.
- `POST /api/ai` sends the user's request to the OpenAI Responses API from the server and returns model text.
- AI Lab → **Live AI Assistant** uses this endpoint.
- Other workspaces (dataset training, model benchmarking, external tools, and deployments) remain planning/configuration tools until their own execution integrations are implemented.

## Existing project workflows
- Use Coding Studio / Code Editor to edit HTML, CSS, JavaScript, create/delete files, run a local preview, and export a project ZIP.
- Use Publish Project to prepare a ZIP and select an external publishing provider. Publishing is not automatic.
- The in-browser editor state is stored locally; this is not a multi-user cloud project system.

## Learning Hub
- Open **Learning Hub** from the main dashboard for a nine-stage roadmap from workspace setup through secure deployment.
- The resource library includes curated links for HTML/CSS, JavaScript, Python, Java, C/C++, Git, backend/API development, SQL, AI/ML, security, testing, computer science, and deployment.
- Search resources by keyword and filter by topic or level.
- Bookmark resources and tick roadmap milestones. These preferences are saved in the current browser's `localStorage`; they are not synced to an account or server.
- Project briefs can be copied from the project idea cards. The learning content is a curated index of external resources, not a hosted course platform; each provider controls its own content, availability, and account requirements.

## My Projects cloud vault (Supabase)
- Open **Main Dashboard → My Projects**. Create an account with an email and password, then confirm your email if Supabase asks you to.
- Sign in to create a project record with a name, goal, language, and source code/notes. Use **Open** to load a saved project into the form, **Update saved project** to edit it, **New project** to start another, and **Delete** to remove a saved record after confirmation.
- Cloud project records use the existing `public.user_projects` table. Row Level Security (RLS) policies restrict SELECT, INSERT, UPDATE, and DELETE to the signed-in owner (`auth.uid() = user_id`). The browser uses only a Supabase publishable key; never add a `service_role` or secret key to frontend code.
- The first version saves the source as a single text payload. It does not yet sync the Code Editor's three separate HTML/CSS/JS buffers directly, upload files to Storage, or provide collaboration/version history.
- For local development, open the folder through VS Code Live Server or `http://localhost:3000` with the Node server running. The cloud vault needs internet access.
- Security note from the Supabase project advisor: enable leaked-password protection in **Authentication → Settings / Password Security** if available for this project. Do not reuse passwords, and do not save API keys or passwords inside project content.


## No-email-confirmation prototype setup
In Supabase Dashboard, open Authentication → Sign In / Providers → Email and turn **Confirm email** OFF. Save the change. This allows password signup to return a session immediately, after which NeonNova opens the My Projects dashboard. This is suitable for a controlled prototype only: users can register with unverified email addresses. Before public launch, consider enabling verification and adding anti-abuse protections.


## Collaboration Board — Stage 1
- Open **Main Dashboard → Collaboration** to create tasks, assign an owner name, set priority and due date, update status, delete tasks, and keep team notes.
- This first stage stores its board in the current browser's `localStorage`. It is useful for testing the workflow, but it is **not shared** across accounts, browsers, or devices. Do not enter secrets or sensitive personal information.
- Next stage required for true collaboration: create secure Supabase team/member/task/message tables with Row Level Security, invitation/join flow, and Realtime updates. That stage must be tested with at least two separate signed-in accounts before it can be described as shared collaboration.

## Collaboration Center — Stage 2 prototype

The Collaboration workspace now has dedicated sections for Overview, Shared Projects, Tasks & Boards, Discussions, Reviews, Shared Resources, and Team & Roles. These prototype records are stored in the current browser's `localStorage` under `neonnova_collaboration_center_v2`.

**Important:** this is not yet multi-user cloud collaboration. The current prototype does not send invitations, enforce server-side roles, upload files, connect Git repositories, sync records between devices, or provide real-time co-editing. Do not use local role labels as a security boundary or store secrets/private credentials in this prototype. Those features require authenticated server/database policies and separate integration work.

### Try the Collaboration Center
1. Open the project using VS Code and Live Server.
2. Choose **Collaboration** from the Main Dashboard.
3. Explore the tabs and create a project, task, discussion post, review request, shared resource link, or team member entry.
4. Refresh the browser and confirm the demo data remains on that browser.

### Planned cloud implementation
1. Create secure team and membership tables linked to authenticated Supabase users.
2. Add row-level security so only team members can access team records, with explicit owner/admin/developer/reviewer/learner/guest permissions.
3. Connect projects, tasks, discussions, reviews, resources, and activity to Supabase.
4. Add invitation tokens and email delivery only after a reliable invitation flow is chosen.
5. Add Supabase Realtime for activity and messages; use a collaboration editor/CRDT approach for simultaneous code editing rather than overwriting whole files.
6. Add Git provider integration, file storage policies, review diffs, audit logs, notifications, and deployment workflows in later stages.

### Collaboration Center — finishing pass
The Collaboration workspace now includes Overview, Projects, Tasks & Boards, Discussions, Reviews, Shared Resources, Team & Roles, Activity & History, Notifications, Team Analytics, and Integrations. Activity, notifications, and analytics are derived from the local prototype data. Integration cards describe planned connections only; they do not connect external accounts. All Collaboration data remains local to the current browser until a later cloud-integration phase. Real-time co-editing, secure invitations, server-enforced roles, Git operations, file uploads, and cross-device synchronization are not implemented yet.

## Command Hub — Stage 1
The Command Hub now opens as a dedicated operations workspace with Overview, Monitoring, Activity Log, Modules, and Security & Access sections. It provides browser-local diagnostics (network state, browser locale/platform, screen size, and local-storage availability), a module launcher, and a local activity history stored in this browser under `neonnova_command_hub_events_v1`.

**Important boundaries:** these diagnostics do not measure server uptime, CPU/RAM, database health, API latency, other users' sessions, or security incidents. The activity list is browser-local and is not a secure audit log. Role labels and security information are explanatory only; no server-enforced Command Hub administrator roles are implemented in this stage. Remote monitoring, secure audit logging, authorization, alerts, and administration APIs require a later backend integration and security review.


## Command Center expansion — Stage 2

The Command Center now presents the complete 11-component management structure:

1. Overview Dashboard — priorities, local project/task counts, and recent local activity.
2. Project Manager — create, update status, and delete local project records.
3. System Monitor — browser/network/storage capability diagnostics; remote telemetry is not connected.
4. AI Control Panel — create and update a local AI task queue; tasks are not sent to a model.
5. User Management — local profile/role labels for planning; no real accounts or permissions are administered here.
6. Notifications Center — create and dismiss local reminders.
7. Activity Logs — view, record, and clear browser-local Command Center events.
8. Integration Manager — provider links and integration readiness notes; these are not active authenticated integrations.
9. Security Center — implementation/readiness guidance for authentication, roles, audit logs, secrets and RLS.
10. Resource Monitor — browser-exposed storage estimate and display/device signals only.
11. Settings — local compact-layout and reminder preferences.

### Important implementation boundaries

- The existing main dashboard, cover artwork, Coding Studio, AI Lab, Learning Hub, My Projects, Collaboration, Settings and Connected Tools workspaces are retained.
- Command Center records are stored in the current browser's localStorage. They do not sync across devices or users.
- Project Manager records are currently separate from the My Projects vault and Coding Studio files. Cross-module synchronization is a later integration phase.
- The AI Control Panel is a task organizer, not an AI execution engine. Use the AI Lab's existing backend workflow for model requests where configured.
- User Management shows local labels only. Do not use it to make real access-control decisions.
- System Monitor and Resource Monitor cannot inspect remote servers, CPU/RAM for the whole platform, database health, API latency, or cloud quotas.
- Activity Logs are editable browser-local records, not secure audit evidence.
- Integration Manager lists external providers and setup guidance; it does not authenticate to those providers.
- Production deployment requires server-side authorization, role enforcement, protected API endpoints, monitoring agents, durable audit logs, tested backup/recovery, and reviewed Supabase Row Level Security policies.

### Suggested next development stages

1. Complete and test each independent module.
2. Define shared project, identity, notification and event data contracts.
3. Connect modules to shared backend services only after the module work is complete.
4. Add server-enforced roles, security event collection, remote monitoring and durable audit logs.
5. Test permissions, data isolation, recovery, responsive layouts and end-to-end workflows before production release.
