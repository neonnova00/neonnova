// NeonNova dedicated dashboards with Supabase Auth and per-user project vault.
const menuToggle = document.getElementById("menuToggle");
const mainNav = document.getElementById("mainNav");
menuToggle?.addEventListener("click", () => {
  const isOpen = mainNav.classList.toggle("open");
  menuToggle.setAttribute("aria-expanded", String(isOpen));
  menuToggle.textContent = isOpen ? "×" : "☰";
});
mainNav?.querySelectorAll("a").forEach(link => link.addEventListener("click", () => {
  mainNav.classList.remove("open");
  menuToggle?.setAttribute("aria-expanded", "false");
  if (menuToggle) menuToggle.textContent = "☰";
}));
const year = document.getElementById("year");
if (year) year.textContent = new Date().getFullYear();

const dashboards = {
  overview: {
    eyebrow:"HUB_00 / COMMAND CENTER", title:"Command Center",
    description:"Your central control room. This dashboard gives you a focused overview of the NeonNova workspace options.",
    theme:"overview", note:"This is a local front-end demo. No server, account, database, or remote service is connected.",
    cards:[["⌂","Workspace map","Use the Main Dashboard button to move between dedicated workspaces."],["◉","Local status","All dashboard views run directly in your browser."],["✦","Quick start","Choose one goal, enter its workspace, and explore its tools."]],
    actions:[["Show local status","status"],["Return to workspace list","home"]]
  },
  studio: {
    eyebrow:"LAB_01 / CREATIVE WORKSHOP", title:"Coding Studio",
    description:"Choose a tool to begin building your software project.",
    theme:"studio", note:"The code editor and running website each open in their own dedicated dashboard.",
    cards:[["⌘","Code Editor","Write and manage your project's source files."],["▣","Live Preview","Open the preview after running your main HTML file."],["⇩","Project Export","Prepare your project as one folder for download."]],
    actions:[["Write Code","editor"],["Open Live Preview","preview"],["Back to Main Dashboard","home"]]
  },
  editor: {
    eyebrow:"IDE_01 / SOURCE WORKSPACE", title:"Code Editor",
    description:"Write and edit your project code in a dedicated workspace, separate from the Coding Studio landing dashboard and the Live Preview dashboard.",
    theme:"studio", note:"Choose a source-file tab to edit it. Click Run Preview to open the separate Live Preview dashboard.",
    cards:[], actions:[]
  },
  preview: {
    eyebrow:"RUN_02 / LIVE OUTPUT", title:"Live Preview Dashboard",
    description:"View the website generated from your current HTML, CSS, and JavaScript files.",
    theme:"studio", note:"This preview runs locally in a sandboxed browser frame. It does not execute server-side languages.",
    cards:[], actions:[]
  },
  ai: {
    eyebrow:"AI_02 / NEURAL LAB", title:"AI Lab",
    description:"A dedicated space for prompt design, AI concepts, and organizing ideas for future intelligent tools.",
    theme:"ai", note:"No AI model or API is connected. These controls provide examples only and do not send prompts anywhere.",
    cards:[["✳","Idea Generator","Turn a rough idea into a goal, audience, and first steps."],["⌘","Code Explainer","Reserve this area for plain-language explanations of code."],["⌕","Debug Station","Organize an error, expected behavior, and steps to reproduce it."]],
    actions:[["Show sample prompt","prompt"],["Check connection status","status"]]
  },
  learn: {
    eyebrow:"LEARN_03 / KNOWLEDGE GARDEN", title:"Learning Hub",
    description:"A curated learning library for programming, AI, software engineering, security, databases, and deployment—with a personal progress tracker.",
    theme:"learn", note:"Resource links open the providers' websites. Your checklist and completed learning steps are saved in this browser only; cloud sync and course hosting are not connected.",
    cards:[["◈","Guided Roadmaps","Follow a practical path from web fundamentals to full-stack development."],["⌘","Resource Library","Find official documentation, free courses, practice sites, and references."],["✓","Learning Progress","Track completed milestones locally and build a portfolio through projects."]],
    actions:[]
  },
  projects: {
    eyebrow:"FILES_04 / PROJECT VAULT", title:"My Projects",
    description:"A dedicated project planning area for ideas, milestones, and build notes.",
    theme:"projects", note:"Sign in to create and manage private cloud projects. Cloud save requires a working internet connection and the configured Supabase project.",
    cards:[["▣","Project Shelf","Keep each idea organized with a title and a clear purpose."],["✎","Build Notes","Record features, bugs, decisions, and the next task."],["⇩","Export Desk","Plan a folder structure before packaging a project."]],
    actions:[["Create a local demo card","project"],["Show project checklist","checklist"]]
  },
  team: {
    eyebrow:"TEAM_05 / COLLABORATION CENTER", title:"Collaboration Center",
    description:"Plan, develop, test, review, and deliver projects together from a dedicated team workspace.",
    theme:"team", note:"The workspace currently saves its demo data in this browser. Cloud-shared teams, enforced permissions, invitations, and real-time code editing are future integration stages.",
    cards:[["◎","Shared Projects","Organize goals and team project status."],["⇄","Tasks & Boards","Assign owners, priorities, and deadlines."],["◌","Discussions & Reviews","Record updates and review decisions."]],
    actions:[["Open collaboration workspace","teamboard"],["Show collaboration roadmap","teamroadmap"]]
  },
  settings: {
    eyebrow:"SYS_06 / CONTROL SETTINGS", title:"System Settings",
    description:"A dedicated settings area for interface preferences and privacy information.",
    theme:"settings", note:"Settings are previews and are not saved between browser sessions.",
    cards:[["◐","Appearance","Each dashboard has its own neon accent theme."],["⌁","Workspace Behavior","Use Back to Main Dashboard to return to the workspace launcher."],["◇","Privacy","Project data is sent to Supabase only when you sign in and save. Dashboard navigation remains local."]],
    actions:[["Show privacy information","privacy"],["Show theme information","theme"]]
  },
  tools: {
    eyebrow:"TOOLS_07 / EXTERNAL TOOLKIT", title:"Connected Tools",
    description:"Open useful developer services in a separate browser tab. These are external links only, not account or API integrations.",
    theme:"tools", note:"NeonNova does not sign in to these services, exchange data with them, or connect to their servers from this demo.",
    cards:[["⌘","GitHub","Repositories, source code hosting, and version control."],["◈","Supabase","A platform for databases, authentication, and storage."],["✳","ChatGPT","Explore ideas and get programming assistance."]],
    links:[["Open GitHub","https://github.com/"],["Open Supabase","https://supabase.com/"],["Open ChatGPT","https://chatgpt.com/"]]
  }
};
const hub = document.getElementById("mainDashboard");
const view = document.getElementById("dedicatedDashboard");
const cardArea = document.getElementById("viewCards");
const actionArea = document.getElementById("viewActions");
const tiles = document.querySelectorAll(".dashboard-tile");


function renderCodingStudio(root) {
  const studio = makeEl("section", "coding-studio");
  studio.setAttribute("aria-label", "Coding Studio editor and live preview");
  const toolbar = makeEl("div", "studio-toolbar");
  const projectName = document.createElement("input");
  projectName.className = "studio-project-name"; projectName.type = "text";
  projectName.maxLength = 120; projectName.value = "My NeonNova Website";
  projectName.setAttribute("aria-label", "Project name");
  const run = makeEl("button", "button button-primary", "▶ Run Preview"); run.type = "button";
  const save = makeEl("button", "button button-secondary", "Save on This Device"); save.type = "button";
  toolbar.append(projectName, run, save);
  const status = makeEl("p", "studio-status", "Ready. Your code runs locally in this browser."); status.setAttribute("role", "status");
  const workspace = makeEl("div", "studio-workspace");
  const editorPanel = makeEl("section", "studio-editor-panel");
  const tabs = makeEl("div", "studio-tabs"); tabs.setAttribute("role", "tablist"); tabs.setAttribute("aria-label", "Code files");
  const editorTitle = makeEl("div", "studio-panel-title", "SOURCE FILES");
  const editorHint = makeEl("p", "studio-hint", "Choose a file, edit the code, then run the preview.");
  const editor = document.createElement("textarea"); editor.className = "studio-code-editor";
  editor.spellcheck = false; editor.autocapitalize = "off"; editor.autocomplete = "off";
  editor.setAttribute("aria-label", "Code editor");
  editorPanel.append(editorTitle, tabs, editorHint, editor);
  workspace.append(editorPanel);
  const help = makeEl("p", "studio-security-note", "Edit your files here. Run Preview opens a separate dashboard for the generated website. Do not paste code you do not trust.");
  studio.append(toolbar, status, workspace, help); root.append(studio);

  const defaults = {
    html: '<main class="hero">\n  <p class="eyebrow">WELCOME TO MY FIRST PROJECT</p>\n  <h1>Hello, NeonNova ✦</h1>\n  <p>Edit this HTML, style it with CSS, and add behavior with JavaScript.</p>\n  <button id="helloButton">Try the button</button>\n  <p id="message" aria-live="polite"></p>\n</main>',
    css: 'body {\n  margin: 0;\n  min-height: 100vh;\n  display: grid;\n  place-items: center;\n  background: #080d20;\n  color: #edf6ff;\n  font-family: system-ui, sans-serif;\n}\n.hero { max-width: 650px; padding: 48px 28px; text-align: center; }\n.eyebrow { color: #61eaff; letter-spacing: .18em; font-size: .75rem; }\nh1 { font-size: clamp(2rem, 7vw, 4rem); margin: .5em 0; }\nbutton { padding: 12px 18px; border: 0; border-radius: 8px; background: #61eaff; color: #071020; font-weight: 700; cursor: pointer; }',
    js: 'document.getElementById("helloButton")?.addEventListener("click", () => {\n  document.getElementById("message").textContent = "Great! Your JavaScript is working.";\n});'
  };
  let code = {...defaults};
  try {
    const saved = JSON.parse(localStorage.getItem("neonnova-studio-v1") || "null");
    if (saved && typeof saved === "object") {
      if (typeof saved.html === "string") code.html = saved.html;
      if (typeof saved.css === "string") code.css = saved.css;
      if (typeof saved.js === "string") code.js = saved.js;
      if (typeof saved.name === "string" && saved.name.trim()) projectName.value = saved.name.slice(0,120);
    }
  } catch (_) { /* Ignore invalid or unavailable browser storage and use defaults. */ }
  let activeFile = "html";
  const fileLabels = {html:"index.html",css:"style.css",js:"script.js"};
  function setStatus(text, isError=false) { status.textContent = text; status.classList.toggle("is-error", isError); }
  function selectFile(file) {
    code[activeFile] = editor.value;
    activeFile = file; editor.value = code[file];
    tabs.querySelectorAll("button").forEach(b => { const active = b.dataset.file === file; b.classList.toggle("active", active); b.setAttribute("aria-selected", String(active)); });
    editor.setAttribute("aria-label", fileLabels[file] + " editor");
  }
  Object.keys(fileLabels).forEach(file => {
    const tab = makeEl("button", "studio-tab", fileLabels[file]); tab.type = "button"; tab.dataset.file = file;
    tab.setAttribute("role", "tab"); tab.setAttribute("aria-selected", "false");
    tab.addEventListener("click", () => selectFile(file)); tabs.append(tab);
  });
  editor.value = code.html; selectFile("html");
  editor.addEventListener("input", () => { code[activeFile] = editor.value; setStatus("Unsaved edits in " + fileLabels[activeFile] + ". Run preview to see changes."); });
  function currentCode() { code[activeFile] = editor.value; return code; }
  function runPreview() {
    const c = currentCode();
    try {
      localStorage.setItem("neonnova-studio-v1", JSON.stringify({name:projectName.value.trim() || "My NeonNova Website", ...c, savedAt:new Date().toISOString()}));
    } catch (_) {
      setStatus("Could not save the preview draft in this browser. Try Save on This Device first.", true);
      return;
    }
    openDashboard("preview");
  }
  run.addEventListener("click", runPreview);
  save.addEventListener("click", () => {
    const c = currentCode();
    try { localStorage.setItem("neonnova-studio-v1", JSON.stringify({name:projectName.value.trim() || "My NeonNova Website", ...c, savedAt:new Date().toISOString()})); setStatus("Saved on this device in this browser."); }
    catch (_) { setStatus("Browser storage is unavailable or full. Download your files to keep a copy.", true); }
  });
  // The editor is intentionally its own dashboard; the preview is rendered by renderLivePreview().
}

function renderLivePreview(root) {
  const shell = makeEl("section", "coding-studio live-preview-dashboard");
  const toolbar = makeEl("div", "studio-toolbar");
  const back = makeEl("button", "button button-secondary", "← Back to Code Editor"); back.type = "button";
  back.addEventListener("click", () => openDashboard("editor"));
  const rerun = makeEl("button", "button button-primary", "↻ Refresh Preview"); rerun.type = "button";
  toolbar.append(back, rerun);
  const status = makeEl("p", "studio-status", "Loading project preview…"); status.setAttribute("role", "status");
  const panel = makeEl("section", "studio-preview-panel standalone-preview-panel");
  const head = makeEl("div", "studio-preview-head");
  head.append(makeEl("div", "studio-panel-title", "RUNNING WEBSITE"), makeEl("span", "studio-live-indicator", "LOCAL SANDBOX"));
  const frame = document.createElement("iframe"); frame.className = "studio-preview-frame standalone-preview-frame";
  frame.title = "Live preview of the current project"; frame.setAttribute("sandbox", "allow-scripts"); frame.referrerPolicy = "no-referrer";
  const consoleBox = makeEl("pre", "studio-console", "Preview messages will appear here.");
  panel.append(head, frame, makeEl("div", "studio-panel-title studio-console-title", "RUN STATUS"), consoleBox);
  shell.append(toolbar, status, panel); root.append(shell);
  function run() {
    let saved = {};
    try { saved = JSON.parse(localStorage.getItem("neonnova-studio-v1") || "{}"); } catch (_) {}
    const html = typeof saved.html === "string" ? saved.html : "<main><h1>Hello, NeonNova</h1><p>Return to the editor to write your project.</p></main>";
    const css = typeof saved.css === "string" ? saved.css : "body{font-family:system-ui;padding:2rem;background:#080d20;color:#edf6ff}";
    const js = typeof saved.js === "string" ? saved.js : "";
    const source = '<!doctype html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><style>' + css + '</style></head><body>' + html + '<script>window.addEventListener("error",function(e){parent.postMessage({type:"neonnova-preview-error",message:String(e.message||"Script error")},"*")});<\/script><script>' + js + '<\/script></body></html>';
    frame.srcdoc = source;
    status.textContent = "Preview running for: " + (saved.name || "My NeonNova Website");
    consoleBox.textContent = "Preview started. JavaScript errors will appear here.";
  }
  rerun.addEventListener("click", run);
  window.addEventListener("message", event => {
    if (event.source === frame.contentWindow && event.data?.type === "neonnova-preview-error") consoleBox.textContent = "JavaScript error: " + String(event.data.message || "Unknown error");
  });
  run();
}

function showHub(updateHistory = true) {
  view.hidden = true; hub.hidden = false;
  document.body.classList.remove("dashboard-open");
  document.body.dataset.theme = "overview";
  if (updateHistory && location.hash.startsWith("#workspace-")) history.pushState({dashboard:"home"}, "", "#home");
  window.scrollTo({top:0, behavior:"smooth"});
}
function openDashboard(key, updateHistory = true) {
  const data = dashboards[key];
  if (!data) return;
  if (updateHistory) history.pushState({dashboard:key}, "", "#workspace-" + encodeURIComponent(key));
  hub.hidden = true; view.hidden = false;
  document.body.classList.add("dashboard-open");
  document.body.dataset.theme = data.theme;
  document.getElementById("viewEyebrow").textContent = data.eyebrow;
  document.getElementById("viewTitle").textContent = data.title;
  document.getElementById("viewDescription").textContent = data.description;
  document.getElementById("viewNote").textContent = data.note;
  cardArea.replaceChildren();
  data.cards.forEach(([glyph,title,description]) => {
    const card = document.createElement("article"); card.className = "dedicated-card";
    const icon = document.createElement("span"); icon.className = "dedicated-card-icon"; icon.textContent = glyph;
    const h = document.createElement("h3"); h.textContent = title;
    const p = document.createElement("p"); p.textContent = description;
    card.append(icon,h,p); cardArea.append(card);
  });
  actionArea.replaceChildren();
  if (key === "overview") {
    renderCommandHub(actionArea);
    window.scrollTo({top:0, behavior:"smooth"});
    return;
  }
  if (key === "studio") {
    const intro = makeEl("p", "dashboard-action-message", "Ready to build? Open the dedicated code-writing dashboard, or view the latest saved preview.");
    actionArea.append(intro);
  }
  if (key === "editor") {
    renderCodingStudio(actionArea);
    window.scrollTo({top:0, behavior:"smooth"});
    return;
  }
  if (key === "preview") {
    renderLivePreview(actionArea);
    window.scrollTo({top:0, behavior:"smooth"});
    return;
  }
  if (key === "projects") {
    renderProjectVault(actionArea);
    window.scrollTo({top:0, behavior:"smooth"});
    return;
  }
  if (key === "learn") {
    renderLearningHub(actionArea);
    window.scrollTo({top:0, behavior:"smooth"});
    return;
  }
  if (key === "team") {
    renderTeamCollaboration(actionArea);
    window.scrollTo({top:0, behavior:"smooth"});
    return;
  }
  if (data.links) {
    data.links.forEach(([label,url]) => {
      const a = document.createElement("a"); a.className = "button button-primary"; a.href = url;
      a.target = "_blank"; a.rel = "noopener noreferrer"; a.textContent = label + " ↗"; actionArea.append(a);
    });
  } else {
    const message = document.createElement("p"); message.className = "dashboard-action-message"; message.setAttribute("aria-live","polite");
    data.actions.forEach(([label,action]) => {
      const b = document.createElement("button"); b.className = "button button-primary"; b.type = "button"; b.textContent = label + " ↗";
      b.addEventListener("click", () => {
        if (action === "home") { showHub(); return; }
        if (action === "editor" || action === "preview") { openDashboard(action); return; }
        const replies = {
          status:"LOCAL STATUS: Ready. This dashboard is running in your browser only.",
          tip:"Tip: build one small feature, test it, then improve it in manageable steps.",
          roadmap:"Roadmap: plan the interface, add the editor, add a local preview, then test downloads.",
          prompt:"Sample prompt: “Explain this idea simply, list three approaches, and suggest a small first step.” No AI service was called.",
          lesson:"Suggested first lesson: create a basic HTML page, style it with CSS, then add one JavaScript interaction.",
          project:"A sample project idea is ready to plan: give it a name, goal, first feature, and next task. No file was saved.",
          checklist:"Project checklist: purpose, files, key feature, test steps, known issues, and next milestone.",
          task:"Sample task: Define the goal, assign an owner, list the steps, and agree on what completion means.",
          teamboard:"The collaboration board is ready below.",
          teamroadmap:"Next stage: secure shared teams, invite members, cloud-synced tasks, team messages, and real-time co-editing using Supabase with row-level security.",
          privacy:"Privacy: this static demo does not submit your dashboard activity to a server.",
          theme:"Theme note: each dedicated dashboard has its own accent color and visual mood."
        };
        message.textContent = "✦ " + (replies[action] || "Local demo action complete.");
      });
      actionArea.append(b);
    });
    actionArea.append(message);
  }
  window.scrollTo({top:0, behavior:"smooth"});
}



function renderCommandHub(root) {
  const KEY = "neonnova_command_hub_events_v2";
  const DATA_KEY = "neonnova_command_hub_data_v1";
  const panel = makeEl("section", "command-hub-workspace");
  const top = makeEl("div", "command-hub-topline");
  const intro = makeEl("div", "command-hub-intro");
  intro.append(makeEl("span", "eyebrow", "HUB_00 / CENTRAL OPERATIONS"), makeEl("h3", "", "NeonNova Command Center"), makeEl("p", "", "One control room for projects, modules, AI tasks, people, notifications, security, resources and platform settings."));
  const clock = makeEl("div", "command-hub-clock");
  const clockTime = makeEl("strong", "", "--:--:--"); const clockDate = makeEl("small", "", "Loading local time…");
  clock.append(makeEl("span", "", "LOCAL DEVICE TIME"), clockTime, clockDate); top.append(intro, clock); panel.append(top);
  const notice = makeEl("div", "command-hub-notice", "LOCAL PROTOTYPE MODE · This Command Center stores its management records in this browser. Remote telemetry, real user administration, secure audit logs, cross-device sync and live module events require backend services and role-protected APIs."); panel.append(notice);
  const nav = makeEl("nav", "command-hub-tabs"); nav.setAttribute("aria-label", "Command Center components");
  const body = makeEl("div", "command-hub-body"); const status = makeEl("p", "command-hub-status", "Command Center ready."); status.setAttribute("role", "status"); panel.append(nav, body, status); root.append(panel);
  const sections = [
    ["overview","Overview"],["projects","Project Manager"],["monitoring","System Monitor"],
    ["ai","AI Control"],["users","User Management"],["notifications","Notifications"],
    ["activity","Activity Logs"],["integrations","Integrations"],["security","Security"],
    ["resources","Resources"],["settings","Settings"]
  ]; let active="overview";
  let events=[]; let data={projects:[],aiTasks:[],users:[{name:"You",role:"Owner",status:"Local profile"}],notifications:[],integrations:[{name:"GitHub",url:"https://github.com",state:"External link only"},{name:"Supabase",url:"https://supabase.com",state:"Configuration required"},{name:"ChatGPT",url:"https://chatgpt.com",state:"External link only"}],preferences:{compact:false,alerts:true}};
  try { const saved=JSON.parse(localStorage.getItem(KEY)||"[]"); if(Array.isArray(saved)) events=saved.slice(0,80); } catch {}
  try { const saved=JSON.parse(localStorage.getItem(DATA_KEY)||"null"); if(saved&&typeof saved==="object") data={...data,...saved,preferences:{...data.preferences,...(saved.preferences||{})}}; } catch {}
  const persist=()=>{try{localStorage.setItem(DATA_KEY,JSON.stringify(data));return true}catch{return false}};
  const log=(message,level="info")=>{events.unshift({message,level,at:new Date().toISOString()});events=events.slice(0,80);try{localStorage.setItem(KEY,JSON.stringify(events))}catch{}};
  const button=(label,fn,cls="button button-secondary")=>{const b=makeEl("button",cls,label);b.type="button";b.addEventListener("click",fn);return b;};
  const metric=(label,value,detail,state="ready")=>{const card=makeEl("article","command-hub-metric");card.append(makeEl("span","",label),makeEl("strong","",value),makeEl("small","",detail));card.append(makeEl("i","command-hub-tag tag-"+state,state.toUpperCase()));return card;};
  const sectionHead=(eyebrow,title,desc)=>{const h=makeEl("div","command-hub-section-head");h.append(makeEl("span","eyebrow",eyebrow),makeEl("h4","",title),makeEl("p","",desc));return h;};
  const panelCard=(title,copy)=>{const c=makeEl("article","command-hub-panel");c.append(makeEl("h4","",title),makeEl("p","command-hub-copy",copy));return c;};
  const input=(placeholder,type="text")=>{const el=document.createElement("input");el.className="command-hub-input";el.placeholder=placeholder;el.type=type;return el;};
  function renderOverview(){
    body.append(sectionHead("SYSTEM SNAPSHOT / COMMAND PRIORITIES","Your platform at a glance","Start with the next action, then open the workspace responsible for it."));
    const grid=makeEl("div","command-hub-metrics");
    grid.append(metric("WORKSPACES","08","Available workspace destinations"),metric("LOCAL PROJECTS",String(data.projects.length),"Records in this browser"),metric("AI TASK QUEUE",String(data.aiTasks.filter(t=>t.status!=="Completed").length),"Local task records"),metric("NETWORK",navigator.onLine?"ONLINE":"OFFLINE","Browser connectivity only",navigator.onLine?"ready":"warning"));body.append(grid);
    const cols=makeEl("div","command-hub-columns");
    const next=panelCard("Recommended next actions","Create a project record, review your module directory, or check the integration/security readiness before enabling cloud features.");
    next.append(button("Create a project",()=>{active="projects";render();},"button button-primary"),button("Review integrations",()=>{active="integrations";render()}),button("Open module directory",()=>{active="modules";render()}));
    const feed=panelCard("Recent Command Center activity","Actions recorded by this browser session. This is not a secure server audit trail.");
    const list=makeEl("div","command-hub-event-list");(events.length?events.slice(0,5):[{message:"Command Center opened",level:"info",at:new Date().toISOString()}]).forEach(e=>{const row=makeEl("div","command-hub-event");row.append(makeEl("i","event-"+(e.level||"info")),makeEl("span","",e.message),makeEl("time","",new Date(e.at).toLocaleTimeString([], {hour:"2-digit",minute:"2-digit"})));list.append(row)});feed.append(list);
    cols.append(next,feed);body.append(cols);
    const quick=makeEl("div","command-hub-quick");quick.append(makeEl("h4","","Open a NeonNova workspace"));
    [["Coding Studio","studio"],["AI Lab","ai"],["Learning Hub","learn"],["My Projects","projects"],["Collaboration","team"],["Connected Tools","tools"]].forEach(([label,key])=>quick.append(button("Open "+label,()=>{log("Opened "+label);openDashboard(key)})));body.append(quick);
  }
  function renderProjects(){
    body.append(sectionHead("PROJECT MANAGER / WORK TRACKING","Manage project records","Create and track project summaries here. This local manager does not yet sync with Coding Studio or the cloud vault."));
    const form=makeEl("div","command-hub-form");const name=input("Project name");const desc=input("Short project purpose");const state=document.createElement("select");state.className="command-hub-input";["Planning","In progress","On hold","Completed"].forEach(x=>{const o=document.createElement("option");o.value=x;o.textContent=x;state.append(o)});
    form.append(name,desc,state,button("＋ Add project",()=>{if(!name.value.trim()){status.textContent="Enter a project name first.";return}data.projects.unshift({id:Date.now().toString(36),name:name.value.trim(),description:desc.value.trim(),status:state.value,createdAt:new Date().toISOString()});persist();log("Project created: "+name.value.trim());render();status.textContent="Project saved in this browser."},"button button-primary"));body.append(form);
    const list=makeEl("div","command-hub-module-grid");if(!data.projects.length)list.append(panelCard("No project records yet","Add a project above to begin organizing your work."));
    data.projects.forEach(p=>{const c=makeEl("article","command-hub-module");c.append(makeEl("span","eyebrow",p.status.toUpperCase()),makeEl("h4","",p.name),makeEl("p","",p.description||"No description added."));const sel=document.createElement("select");sel.className="command-hub-input";["Planning","In progress","On hold","Completed"].forEach(x=>{const o=document.createElement("option");o.value=x;o.textContent=x;o.selected=p.status===x;sel.append(o)});sel.addEventListener("change",()=>{p.status=sel.value;persist();log("Project status changed: "+p.name);status.textContent="Project status updated."});c.append(sel,button("Delete project",()=>{if(confirm("Delete this local project record?")){data.projects=data.projects.filter(x=>x.id!==p.id);persist();log("Project deleted: "+p.name);render()}},"button button-danger"));list.append(c)});body.append(list);
  }
  function renderMonitoring(){
    body.append(sectionHead("SYSTEM MONITOR / DEVICE DIAGNOSTICS","Current browser diagnostics","Only values available to this browser are shown. Server health and performance metrics are not available in this local build."));
    const grid=makeEl("div","command-hub-metrics");let storage="Unavailable";try{storage=typeof localStorage!=="undefined"?"Available":"Unavailable"}catch{}
    grid.append(metric("NETWORK",navigator.onLine?"ONLINE":"OFFLINE","Browser online event",navigator.onLine?"ready":"warning"),metric("LOCAL STORAGE",storage,"Browser storage API"),metric("LANGUAGE",navigator.language||"Unknown","Browser locale"),metric("DISPLAY",`${screen.width} × ${screen.height}`,"Screen dimensions"));body.append(grid);
    const c=panelCard("Remote monitoring is not connected","CPU/RAM, server uptime, database health, API latency, application errors and other users' sessions require authenticated monitoring agents and protected service endpoints.");
    c.append(button("Refresh browser diagnostics",()=>{log("Browser diagnostics refreshed");status.textContent="Browser diagnostics refreshed at "+new Date().toLocaleTimeString();render()},"button button-primary"));body.append(c);
  }
  function renderAI(){
    body.append(sectionHead("AI CONTROL PANEL / TASK COORDINATION","AI operations queue","Queue and label AI work here. Creating a task does not call an AI model; connect the AI Lab backend in a later integration stage."));
    const form=makeEl("div","command-hub-form");const task=input("Describe an AI task");const kind=document.createElement("select");kind.className="command-hub-input";["Idea generation","Code assistance","Research","Data analysis","Model experiment"].forEach(x=>{const o=document.createElement("option");o.value=x;o.textContent=x;kind.append(o)});
    form.append(task,kind,button("＋ Queue AI task",()=>{if(!task.value.trim()){status.textContent="Describe the AI task first.";return}data.aiTasks.unshift({id:Date.now().toString(36),title:task.value.trim(),kind:kind.value,status:"Queued",createdAt:new Date().toISOString()});persist();log("AI task queued locally: "+task.value.trim());render();status.textContent="Task added to the local queue; it has not been sent to an AI model."},"button button-primary"));body.append(form);
    const list=makeEl("div","command-hub-module-grid");if(!data.aiTasks.length)list.append(panelCard("Queue is empty","Add an AI task to organize work for the AI Lab."));
    data.aiTasks.forEach(t=>{const c=makeEl("article","command-hub-module");c.append(makeEl("span","eyebrow",t.kind.toUpperCase()),makeEl("h4","",t.title));const s=document.createElement("select");s.className="command-hub-input";["Queued","In progress","Completed","Cancelled"].forEach(x=>{const o=document.createElement("option");o.value=x;o.textContent=x;o.selected=t.status===x;s.append(o)});s.addEventListener("change",()=>{t.status=s.value;persist();log("AI task status updated: "+t.title);status.textContent="Local task status updated."});c.append(s);list.append(c)});body.append(list);
    body.append(button("Open AI Lab workspace ↗",()=>openDashboard("ai"),"button button-secondary"));
  }
  function renderUsers(){
    body.append(sectionHead("USER MANAGEMENT / IDENTITY DIRECTORY","Profiles and roles","This is a local demonstration directory. It cannot create accounts, change real permissions, or administer Supabase users."));
    const form=makeEl("div","command-hub-form");const name=input("Display name");const role=document.createElement("select");role.className="command-hub-input";["Team leader","Administrator (demo label)","Developer","Reviewer","Learner","Guest"].forEach(x=>{const o=document.createElement("option");o.value=x;o.textContent=x;role.append(o)});
    form.append(name,role,button("＋ Add local profile",()=>{if(!name.value.trim()){status.textContent="Enter a display name first.";return}data.users.push({name:name.value.trim(),role:role.value,status:"Local profile only"});persist();log("Local profile added: "+name.value.trim());render();status.textContent="Local profile added. No account was created."},"button button-primary"));body.append(form);
    const grid=makeEl("div","command-hub-module-grid");data.users.forEach(u=>{const c=makeEl("article","command-hub-module");c.append(makeEl("span","eyebrow",u.status||"LOCAL ONLY"),makeEl("h4","",u.name),makeEl("p","",u.role+" · Display label only; not an enforced permission."));grid.append(c)});body.append(grid);
  }
  function renderNotifications(){
    body.append(sectionHead("NOTIFICATIONS CENTER / ACTIONABLE ALERTS","Alerts and announcements","Local reminders can be created and dismissed. Email, push, team and cross-module notifications are not connected."));
    const form=makeEl("div","command-hub-form");const msg=input("Write a reminder or announcement");const level=document.createElement("select");level.className="command-hub-input";["Info","Attention","Important"].forEach(x=>{const o=document.createElement("option");o.value=x;o.textContent=x;level.append(o)});
    form.append(msg,level,button("＋ Add notification",()=>{if(!msg.value.trim())return;data.notifications.unshift({id:Date.now().toString(36),message:msg.value.trim(),level:level.value,at:new Date().toISOString()});persist();log("Notification created");render();status.textContent="Notification saved locally."},"button button-primary"));body.append(form);
    const list=makeEl("div","command-hub-event-list command-hub-event-list-large");const activeItems=data.notifications.filter(n=>!n.dismissed);if(!activeItems.length)list.append(makeEl("p","command-hub-empty","No active notifications."));activeItems.forEach(n=>{const row=makeEl("div","command-hub-event");row.append(makeEl("i","event-"+(n.level==="Important"?"warning":"info")),makeEl("span","",n.message),makeEl("time","",new Date(n.at).toLocaleString()),button("Dismiss",()=>{n.dismissed=true;persist();log("Notification dismissed");render()}));list.append(row)});body.append(list);
  }
  function renderActivity(){
    body.append(sectionHead("ACTIVITY LOGS / HISTORY","Recent operations","A browser-local activity record. It can be cleared or modified by the browser user and is not a compliance-grade audit log."));
    const controls=makeEl("div","command-hub-controls");controls.append(button("Record test event",()=>{log("Manual test event recorded");render();status.textContent="Test event recorded locally."}),button("Clear local history",()=>{if(confirm("Clear Command Center activity stored in this browser?")){events=[];try{localStorage.removeItem(KEY)}catch{};render();status.textContent="Local activity history cleared."}},"button button-danger"));body.append(controls);
    const list=makeEl("div","command-hub-event-list command-hub-event-list-large");if(!events.length)list.append(makeEl("p","command-hub-empty","No events recorded yet."));events.forEach(e=>{const row=makeEl("div","command-hub-event");row.append(makeEl("i","event-"+(e.level||"info")),makeEl("span","",e.message),makeEl("time","",new Date(e.at).toLocaleString()));list.append(row)});body.append(list);
  }
  function renderIntegrations(){
    body.append(sectionHead("INTEGRATION MANAGER / SERVICE CONNECTIONS","Connected services","These entries are reference links and setup states, not authenticated integrations or active plugins."));
    const grid=makeEl("div","command-hub-module-grid");data.integrations.forEach(x=>{const c=makeEl("article","command-hub-module");c.append(makeEl("span","eyebrow","EXTERNAL SERVICE"),makeEl("h4","",x.name),makeEl("p","",x.state),button("Open provider ↗",()=>window.open(x.url,"_blank","noopener,noreferrer")));grid.append(c)});body.append(grid);
    body.append(panelCard("Integration roadmap","After the platform modules are complete, define secure API contracts, authentication scopes, event formats, retry behavior and audit logging before enabling cross-module data exchange."));
  }
  function renderSecurity(){
    body.append(sectionHead("SECURITY CENTER / ACCESS GOVERNANCE","Security posture","Review what is configured and what remains necessary before production use."));
    const grid=makeEl("div","command-hub-module-grid");[
      ["Authentication","Supabase Auth package is included; live sign-in and sign-up tests are still required.","CONFIGURATION DEPENDENT"],
      ["Role-based access","No server-enforced Command Center roles or admin permissions are implemented yet.","NOT IMPLEMENTED"],
      ["Audit logging","Only browser-local activity history is available.","LOCAL ONLY"],
      ["Secrets management","Provider secrets must remain server-side; never paste service-role keys into frontend files.","REQUIRED RULE"],
      ["Session protection","Production session review, revocation and security alerts are not implemented.","PLANNED"],
      ["Row-level security","Cloud project access depends on correct Supabase RLS policies and testing.","TEST REQUIRED"]
    ].forEach(([a,b,c])=>{const card=makeEl("article","command-hub-module");card.append(makeEl("h4","",a),makeEl("p","",b),makeEl("span","command-hub-security-state",c));grid.append(card)});body.append(grid);
  }
  function renderResources(){
    body.append(sectionHead("RESOURCE MONITOR / CAPACITY","Browser storage and resources","Shows only storage information the browser exposes. It is not a server, cloud-storage or platform-wide usage report."));
    const grid=makeEl("div","command-hub-metrics");let usage="Not exposed",quota="Not exposed";
    if(navigator.storage?.estimate){navigator.storage.estimate().then(x=>{const used=x.usage||0,limit=x.quota||0;usage=(used/1048576).toFixed(2)+" MB";quota=(limit/1073741824).toFixed(2)+" GB";if(active==="resources")render()}).catch(()=>{});}
    grid.append(metric("ORIGIN STORAGE",usage,"Browser estimate"),metric("STORAGE QUOTA",quota,"Browser estimate"),metric("SCREEN SIZE",`${screen.width} × ${screen.height}`,"Display dimensions"),metric("DEVICE MEMORY",navigator.deviceMemory?`${navigator.deviceMemory} GB`:"Not exposed","Browser privacy-limited signal"));body.append(grid);
    body.append(panelCard("Resource management boundary","Cloud storage capacity, per-user quotas, file sizes, API usage, server memory and compute costs require provider APIs and authenticated backend reporting."));
  }
  function renderSettings(){
    body.append(sectionHead("SETTINGS / PLATFORM PREFERENCES","Command Center preferences","These preferences affect this local Command Center interface only."));
    const card=panelCard("Interface preferences","Choose whether to use compact spacing and whether local reminder notices should be shown.");
    [["Compact layout","compact"],["Local notification reminders","alerts"]].forEach(([label,key])=>{const row=makeEl("label","command-hub-setting");const cb=document.createElement("input");cb.type="checkbox";cb.checked=!!data.preferences[key];cb.addEventListener("change",()=>{data.preferences[key]=cb.checked;persist();panel.classList.toggle("is-compact",!!data.preferences.compact);log(label+" preference changed");status.textContent="Preference saved in this browser."});row.append(cb,makeEl("span","",label));card.append(row)});body.append(card);
    panel.classList.toggle("is-compact",!!data.preferences.compact);
    body.append(panelCard("Platform-wide settings still required","Production settings for account security, organization roles, billing, retention, backups, API credentials and integrations must be implemented through secure backend services."));
  }
  function renderModules(){
    body.append(sectionHead("MODULE DIRECTORY / ROUTING","NeonNova workspaces","Open the independent workspace responsible for each activity."));
    const grid=makeEl("div","command-hub-module-grid");const modules=[["Coding Studio","Code editing, live preview and project export","studio"],["AI Lab","AI assistance and development tools","ai"],["Learning Hub","Learning resources and progress","learn"],["My Projects","Project records and cloud vault","projects"],["Collaboration","Team planning and shared workflows","team"],["Connected Tools","External developer services","tools"],["System Settings","Workspace preferences and privacy","settings"]];
    modules.forEach(([name,desc,key])=>{const c=makeEl("article","command-hub-module");c.append(makeEl("span","eyebrow","WORKSPACE"),makeEl("h4","",name),makeEl("p","",desc),button("Open workspace ↗",()=>{log("Launched module: "+name);openDashboard(key)}));grid.append(c)});body.append(grid);
  }
  function render(){
    body.replaceChildren();nav.replaceChildren();
    sections.forEach(([id,label])=>nav.append(button(label,()=>{active=id;log("Opened Command Center section: "+label);render()},"command-hub-tab"+(active===id?" is-active":""))));
    const renderers={overview:renderOverview,projects:renderProjects,monitoring:renderMonitoring,ai:renderAI,users:renderUsers,notifications:renderNotifications,activity:renderActivity,integrations:renderIntegrations,security:renderSecurity,resources:renderResources,settings:renderSettings};
    (renderers[active]||renderOverview)();
  }
  const updateClock=()=>{clockTime.textContent=new Date().toLocaleTimeString([], {hour:"2-digit",minute:"2-digit",second:"2-digit",hour12:false});clockDate.textContent=new Date().toLocaleDateString([], {weekday:"long",year:"numeric",month:"short",day:"numeric"});};
  updateClock();const timer=window.setInterval(updateClock,1000);
  render();
}

function renderTeamCollaboration(root) {
  const KEY = "neonnova_collaboration_center_v2";
  const panel = makeEl("section", "team-board-panel collaboration-center");
  const state = {teamName:"NeonNova Builders", members:[{name:"You",role:"Owner"}], projects:[{id:"starter",name:"NeonNova platform",description:"Coordinate the next platform milestone.",status:"Planning",updatedAt:new Date().toISOString()}], tasks:[], messages:[], reviews:[], resources:[], activity:[], notes:""};
  try { const saved=JSON.parse(localStorage.getItem(KEY)||"null"); if(saved && typeof saved==="object") Object.assign(state,saved); } catch {}
  const logActivity = (text) => { state.activity.unshift({id:Date.now().toString(36)+Math.random().toString(36).slice(2,6),text,at:new Date().toISOString()}); state.activity=state.activity.slice(0,30); persist(); };
  const persist = (message="Changes saved in this browser.") => { try { localStorage.setItem(KEY,JSON.stringify(state)); status.textContent=message; } catch { status.textContent="Browser storage is unavailable; changes may not persist."; } };
  const header=makeEl("div","collab-hero");
  const heroCopy=makeEl("div","collab-hero-copy");
  heroCopy.append(makeEl("span","eyebrow","TEAM_05 / COLLABORATION CENTER"),makeEl("h3","","Connect · Coordinate · Create · Deliver"),makeEl("p","","Build better things together. Plan projects, coordinate tasks, discuss decisions, review changes, and keep shared resources organized in one team workspace."));
  const heroMark=makeEl("div","collab-hero-mark"); heroMark.append(makeEl("span","","NN"),makeEl("small","","TEAM SPACE")); header.append(heroCopy,heroMark); panel.append(header);
  const notice=makeEl("div","team-local-notice","LOCAL PROTOTYPE · This workspace saves on this browser only. Invitations, private cross-account access, cloud sync, and real-time co-editing are not connected yet."); panel.append(notice);
  const stats=makeEl("div","collab-stats");
  const statItems=[["SHARED PROJECTS",()=>state.projects.length],["OPEN TASKS",()=>state.tasks.filter(t=>t.status!=="done").length],["TEAM MEMBERS",()=>state.members.length],["PENDING REVIEWS",()=>state.reviews.filter(r=>r.status==="Pending").length]];
  const statValues=[]; statItems.forEach(([label,get])=>{const card=makeEl("article","collab-stat");card.append(makeEl("span","",label));const val=makeEl("strong","",String(get()));statValues.push([val,get]);card.append(val);stats.append(card)});panel.append(stats);
  const nav=makeEl("nav","collab-tabs"); nav.setAttribute("aria-label","Collaboration sections");
  const body=makeEl("div","collab-panel-body"); const status=makeEl("p","team-board-status","Ready. Changes are stored in this browser."); status.setAttribute("aria-live","polite");
  const tabs=[ ["overview","Overview"],["projects","Projects"],["tasks","Tasks & Boards"],["discussions","Discussions"],["reviews","Reviews"],["resources","Shared Resources"],["team","Team & Roles"],["activity","Activity & History"],["notifications","Notifications"],["analytics","Team Analytics"],["integrations","Integrations"] ]; let active="overview";
  const makeButton=(label,cls="button button-secondary",onClick)=>{const b=makeEl("button",cls,label);b.type="button";if(onClick)b.addEventListener("click",onClick);return b};
  const field=(label,placeholder,type="text")=>{const wrap=makeEl("label","collab-field");wrap.append(makeEl("span","",label));const input=document.createElement(type==="textarea"?"textarea":"input");if(type!=="textarea")input.type=type;input.placeholder=placeholder;if(type==="textarea")input.rows=3;wrap.append(input);return {wrap,input}};
  const empty=(message)=>makeEl("p","team-empty-state",message);
  function refreshStats(){statValues.forEach(([el,get])=>el.textContent=String(get()));}
  function sectionTitle(kicker,title,desc){const h=makeEl("div","collab-section-heading");h.append(makeEl("span","eyebrow",kicker),makeEl("h4","",title),makeEl("p","",desc));return h;}
  function card(title,desc,meta){const c=makeEl("article","collab-item-card");c.append(makeEl("h5","",title));if(desc)c.append(makeEl("p","",desc));if(meta)c.append(makeEl("small","",meta));return c;}
  function renderOverview(){
    body.append(sectionTitle("WORKSPACE SNAPSHOT","Team workspace","A shared place to turn ideas into coordinated work."));
    const grid=makeEl("div","collab-overview-grid");
    const projectBox=makeEl("section","collab-subpanel");projectBox.append(makeEl("h5","","Project activity"));
    if(!state.projects.length)projectBox.append(empty("Create a project to start coordinating work."));
    state.projects.slice(0,4).forEach(p=>projectBox.append(card(p.name,p.description,`${p.status} · Updated ${new Date(p.updatedAt||Date.now()).toLocaleDateString()}`)));
    const taskBox=makeEl("section","collab-subpanel");taskBox.append(makeEl("h5","","Team tasks"));
    const recent=state.tasks.filter(t=>t.status!=="done").slice(0,4); if(!recent.length)taskBox.append(empty("No open tasks. Add one in Tasks & Boards."));
    recent.forEach(t=>taskBox.append(card(t.title,t.details,`${t.owner||"Unassigned"} · ${t.status==="doing"?"In progress":"To do"} · ${t.priority}`)));
    const activityBox=makeEl("section","collab-subpanel");activityBox.append(makeEl("h5","","Recent activity"));if(!state.activity.length)activityBox.append(empty("Activity will appear here as you make changes."));state.activity.slice(0,5).forEach(a=>activityBox.append(card(a.text,"",new Date(a.at).toLocaleString())));
    const integrations=makeEl("section","collab-subpanel");integrations.append(makeEl("h5","","Connected NeonNova modules"));[["Coding Studio","Shared code sessions are planned; use the Coding Studio for individual editing today."],["AI Lab","Organize AI experiment notes and results as shared resources."],["Learning Hub","Coordinate study groups and team challenges."],["Publishing","Track release readiness and deployment tasks."]].forEach(([t,d])=>integrations.append(card(t,d,"Integration status: planned")));
    grid.append(projectBox,taskBox,activityBox,integrations);body.append(grid);
  }
  function renderProjects(){
    body.append(sectionTitle("PROJECT SPACE","Shared Projects","Organize project goals and track the work connected to each project."));
    const form=makeEl("form","collab-form");const name=field("Project name","e.g. Team portfolio website");const desc=field("Project goal","What are you building?","textarea");const statusSelect=field("Initial status","","text");statusSelect.input.value="Planning";statusSelect.input.readOnly=true;form.append(name.wrap,desc.wrap,makeButton("＋ Create project","button button-primary"));
    form.addEventListener("submit",e=>{e.preventDefault();if(!name.input.value.trim())return;state.projects.unshift({id:Date.now().toString(36),name:name.input.value.trim(),description:desc.input.value.trim(),status:"Planning",updatedAt:new Date().toISOString()});logActivity(`Created project: ${name.input.value.trim()}`);render();});body.append(form);
    const list=makeEl("div","collab-card-grid");if(!state.projects.length)list.append(empty("No projects yet. Create your first team project."));state.projects.forEach(p=>{const c=card(p.name,p.description,`Status: ${p.status}`);const actions=makeEl("div","collab-inline-actions");const sel=document.createElement("select");sel.className="team-status-select";sel.innerHTML='<option>Planning</option><option>Active</option><option>On hold</option><option>Completed</option>';sel.value=p.status;sel.setAttribute("aria-label","Project status");sel.addEventListener("change",()=>{p.status=sel.value;p.updatedAt=new Date().toISOString();logActivity(`Changed ${p.name} status to ${p.status}`);render()});actions.append(sel,makeButton("Delete","button button-secondary",()=>{if(confirm(`Delete project “${p.name}”?`)){state.projects=state.projects.filter(x=>x.id!==p.id);logActivity(`Deleted project: ${p.name}`);render()}}));c.append(actions);list.append(c)});body.append(list);
  }
  function renderTasks(){
    body.append(sectionTitle("PLAN & DELIVER","Tasks and Boards","Assign ownership, deadlines, priorities, and blockers. Update status as work moves forward."));
    const form=makeEl("form","collab-form collab-task-form");const title=field("Task title","e.g. Build the responsive navigation");const owner=field("Assigned to","Member name or email");const due=field("Deadline","","date");const details=field("Description / blocker","Definition of done, context, or blockers","textarea");
    const priority=document.createElement("select");priority.innerHTML='<option>Normal</option><option>High</option><option>Urgent</option>';priority.setAttribute("aria-label","Priority");const priorityWrap=makeEl("label","collab-field");priorityWrap.append(makeEl("span","","Priority"),priority);
    const project=document.createElement("select");project.innerHTML='<option value="">No project linked</option>';state.projects.forEach(p=>{const o=document.createElement("option");o.value=p.id;o.textContent=p.name;project.append(o)});const projectWrap=makeEl("label","collab-field");projectWrap.append(makeEl("span","","Project"),project);
    form.append(title.wrap,owner.wrap,due.wrap,priorityWrap,projectWrap,details.wrap,makeButton("＋ Add task","button button-primary"));form.addEventListener("submit",e=>{e.preventDefault();if(!title.input.value.trim())return;const task={id:Date.now().toString(36)+Math.random().toString(36).slice(2,5),title:title.input.value.trim(),owner:owner.input.value.trim(),due:due.input.value,priority:priority.value,projectId:project.value,details:details.input.value.trim(),status:"open",createdAt:new Date().toISOString()};state.tasks.unshift(task);logActivity(`Added task: ${task.title}`);render()});body.append(form);
    const controls=makeEl("div","collab-controls");const filter=document.createElement("select");filter.className="team-filter";filter.innerHTML='<option value="all">All tasks</option><option value="open">To do</option><option value="doing">In progress</option><option value="done">Completed</option>';filter.setAttribute("aria-label","Filter tasks");controls.append(makeEl("strong","","Task board"),filter);body.append(controls);
    const list=makeEl("div","team-task-list");const draw=()=>{list.replaceChildren();const items=state.tasks.filter(t=>filter.value==="all"||t.status===filter.value);if(!items.length)list.append(empty("No tasks in this view yet. Add the first task above."));items.forEach(t=>{const c=makeEl("article","team-task-card");const top=makeEl("div","team-task-top");top.append(makeEl("h4","",t.title),makeEl("span","team-priority priority-"+t.priority.toLowerCase(),t.priority));c.append(top,makeEl("p","team-task-meta",`Owner: ${t.owner||"Unassigned"}${t.due?" · Due: "+t.due:""}`));if(t.details)c.append(makeEl("p","team-task-details",t.details));const linked=state.projects.find(p=>p.id===t.projectId);if(linked)c.append(makeEl("small","collab-muted","Project: "+linked.name));const actions=makeEl("div","team-task-actions");const sel=document.createElement("select");sel.className="team-status-select";sel.innerHTML='<option value="open">To do</option><option value="doing">In progress</option><option value="done">Completed</option>';sel.value=t.status;sel.setAttribute("aria-label","Task status");sel.addEventListener("change",()=>{t.status=sel.value;logActivity(`Updated task “${t.title}” to ${t.status}`);render()});actions.append(sel,makeButton("Delete","button button-secondary",()=>{if(confirm("Delete this task?")){state.tasks=state.tasks.filter(x=>x.id!==t.id);logActivity(`Deleted task: ${t.title}`);render()}}));c.append(actions);list.append(c)});};filter.addEventListener("change",draw);body.append(list);draw();
  }
  function renderDiscussions(){
    body.append(sectionTitle("TEAM COMMUNICATION","Discussions","Keep project conversations, decisions, questions, and blockers close to the work."));
    const form=makeEl("form","collab-form");const author=field("Your display name","Your name");const message=field("Message","Share an update, question, or decision…","textarea");form.append(author.wrap,message.wrap,makeButton("Post discussion","button button-primary"));form.addEventListener("submit",e=>{e.preventDefault();if(!message.input.value.trim())return;const m={id:Date.now().toString(36),author:author.input.value.trim()||"You",message:message.input.value.trim(),at:new Date().toISOString()};state.messages.unshift(m);logActivity(`${m.author} posted a discussion update`);render()});body.append(form);
    const list=makeEl("div","collab-discussion-list");if(!state.messages.length)list.append(empty("No discussion posts yet. Start with a question, decision, or progress update."));state.messages.forEach(m=>{const c=card(m.author,m.message,new Date(m.at).toLocaleString());c.classList.add("collab-message");c.append(makeButton("Delete post","button button-secondary",()=>{if(confirm("Delete this post?")){state.messages=state.messages.filter(x=>x.id!==m.id);logActivity(`Deleted a discussion post by ${m.author}`);render()}}));list.append(c)});body.append(list);
  }
  function renderReviews(){
    body.append(sectionTitle("QUALITY GATE","Reviews and Changes","Track review requests and decisions. This prototype records review status; it does not inspect or merge Git changes."));
    const form=makeEl("form","collab-form");const title=field("Change / pull request title","e.g. Add password reset screen");const author=field("Submitted by","Developer name");const detail=field("Review notes","What changed? What should reviewers test?","textarea");form.append(title.wrap,author.wrap,detail.wrap,makeButton("＋ Submit for review","button button-primary"));form.addEventListener("submit",e=>{e.preventDefault();if(!title.input.value.trim())return;state.reviews.unshift({id:Date.now().toString(36),title:title.input.value.trim(),author:author.input.value.trim()||"Unassigned",detail:detail.input.value.trim(),status:"Pending",at:new Date().toISOString()});logActivity(`Submitted for review: ${title.input.value.trim()}`);render()});body.append(form);
    const list=makeEl("div","collab-card-grid");if(!state.reviews.length)list.append(empty("No changes awaiting review. Add a review request to start the checklist."));state.reviews.forEach(r=>{const c=card(r.title,r.detail,`Submitted by ${r.author} · ${r.status}`);const actions=makeEl("div","collab-inline-actions");["Approved","Changes requested","Pending"].forEach(next=>actions.append(makeButton(next,"button button-secondary",()=>{r.status=next;logActivity(`Review “${r.title}”: ${next}`);render()})));c.append(actions);list.append(c)});body.append(list);
  }
  function renderResources(){
    body.append(sectionTitle("SHARED ASSETS","Files and Resources","Keep links to design files, documents, datasets, AI experiments, and learning resources. Upload storage is not connected in this prototype."));
    const form=makeEl("form","collab-form");const title=field("Resource name","e.g. UI wireframes");const url=field("Resource link (optional)","https://…","url");const kind=field("Type","Design, document, dataset, AI experiment…");form.append(title.wrap,url.wrap,kind.wrap,makeButton("＋ Add resource","button button-primary"));form.addEventListener("submit",e=>{e.preventDefault();if(!title.input.value.trim())return;state.resources.unshift({id:Date.now().toString(36),title:title.input.value.trim(),url:url.input.value.trim(),kind:kind.input.value.trim()||"General",at:new Date().toISOString()});logActivity(`Shared resource: ${title.input.value.trim()}`);render()});body.append(form);
    const list=makeEl("div","collab-card-grid");if(!state.resources.length)list.append(empty("No shared resources yet. Add a link to a design, document, or dataset."));state.resources.forEach(r=>{const c=card(r.title,r.kind,new Date(r.at).toLocaleDateString());if(r.url){const link=makeEl("a","collab-resource-link","Open resource ↗");link.href=r.url;link.target="_blank";link.rel="noopener noreferrer";c.append(link)}c.append(makeButton("Remove","button button-secondary",()=>{state.resources=state.resources.filter(x=>x.id!==r.id);logActivity(`Removed resource: ${r.title}`);render()}));list.append(c)});body.append(list);
  }
  function renderTeam(){
    body.append(sectionTitle("PEOPLE & ACCESS","Team and Roles","Organize membership and define responsibilities. Role labels here are planning-only until server-enforced permissions are connected."));
    const form=makeEl("form","collab-form");const name=field("Member display name","Teammate name");const role=document.createElement("select");role.innerHTML='<option>Owner</option><option>Administrator</option><option>Developer</option><option>Reviewer</option><option>Learner</option><option>Guest</option>';const roleWrap=makeEl("label","collab-field");roleWrap.append(makeEl("span","","Role"),role);form.append(name.wrap,roleWrap,makeButton("＋ Add team member","button button-primary"));form.addEventListener("submit",e=>{e.preventDefault();if(!name.input.value.trim())return;if(state.members.some(m=>m.name.toLowerCase()===name.input.value.trim().toLowerCase())){status.textContent="That display name is already on this local team.";return}state.members.push({name:name.input.value.trim(),role:role.value});logActivity(`Added ${name.input.value.trim()} as ${role.value}`);render()});body.append(form);
    const list=makeEl("div","collab-card-grid");state.members.forEach(m=>{const c=card(m.name,`Role: ${m.role}`,"Local prototype member");c.append(makeButton("Remove member","button button-secondary",()=>{if(m.role==="Owner"){status.textContent="The owner cannot be removed from this local team.";return}state.members=state.members.filter(x=>x!==m);logActivity(`Removed team member: ${m.name}`);render()}));list.append(c)});body.append(list);
    const note=makeEl("div","collab-security-callout");note.append(makeEl("strong","","Security requirement for cloud teams"),makeEl("p","","When cloud membership is enabled, every team, project, task, message, review, and resource must be protected by database policies. A display name or role chosen in this browser is not proof of identity or permission."));body.append(note);
  }
  function renderActivity(){
    body.append(sectionTitle("PROJECT HISTORY","Activity and decisions","A chronological record of changes made in this local workspace."));
    const list=makeEl("div","collab-card-grid");
    if(!state.activity.length) list.append(empty("No activity recorded yet. Create a project or task to begin the history."));
    state.activity.forEach(a=>list.append(card(a.text,"",new Date(a.at).toLocaleString())));
    body.append(list);
    body.append(makeEl("p","collab-muted","History is stored in this browser and is not a tamper-proof audit log."));
  }
  function renderNotifications(){
    body.append(sectionTitle("INBOX","Notifications","A local preview of events that may need your attention."));
    const items=[];
    state.reviews.filter(r=>r.status==="Pending").forEach(r=>items.push({title:"Review waiting",detail:r.title,at:r.at}));
    state.tasks.filter(t=>t.status!=="done"&&t.due&&new Date(t.due+"T23:59:59")<new Date()).forEach(t=>items.push({title:"Task overdue",detail:t.title,at:t.due}));
    state.messages.filter(m=>/@you\b/i.test(m.message)).forEach(m=>items.push({title:"You may have been mentioned",detail:m.message,at:m.at}));
    const list=makeEl("div","collab-card-grid");
    if(!items.length)list.append(empty("You're all caught up. Pending reviews, overdue tasks, and @you mentions will appear here."));
    items.sort((a,b)=>new Date(b.at)-new Date(a.at)).forEach(n=>list.append(card(n.title,n.detail,String(n.at))));
    body.append(list);
    body.append(makeEl("p","collab-muted","Notifications are generated from local prototype data. Push, email, and cross-device alerts are not connected."));
  }
  function renderAnalytics(){
    body.append(sectionTitle("DELIVERY INSIGHTS","Team analytics","A lightweight view of workload, task completion, and review status."));
    const total=state.tasks.length, done=state.tasks.filter(t=>t.status==="done").length, doing=state.tasks.filter(t=>t.status==="doing").length, open=total-done-doing;
    const overdue=state.tasks.filter(t=>t.status!=="done"&&t.due&&new Date(t.due+"T23:59:59")<new Date()).length;
    const metrics=makeEl("div","collab-stats");
    [["TASKS TOTAL",total],["COMPLETED",done],["IN PROGRESS",doing],["OVERDUE",overdue]].forEach(([label,value])=>{const c=makeEl("article","collab-stat");c.append(makeEl("span","",label),makeEl("strong","",String(value)));metrics.append(c)});body.append(metrics);
    const progress=total?Math.round(done/total*100):0;const wrap=makeEl("section","collab-subpanel");wrap.append(makeEl("h5","","Task completion"),makeEl("p","",`${progress}% completed · ${open} to do · ${doing} in progress`));const bar=makeEl("div","collab-progress-track");const fill=makeEl("div","collab-progress-fill");fill.style.width=progress+"%";bar.append(fill);wrap.append(bar);body.append(wrap);
    const reviews=makeEl("section","collab-subpanel");reviews.append(makeEl("h5","","Review pipeline"),makeEl("p","",`${state.reviews.filter(r=>r.status==="Pending").length} pending · ${state.reviews.filter(r=>r.status==="Approved").length} approved · ${state.reviews.filter(r=>r.status==="Changes requested").length} changes requested`));body.append(reviews);
    body.append(makeEl("p","collab-muted","These figures describe this browser's prototype data, not synchronized team-wide analytics."));
  }
  function renderIntegrations(){
    body.append(sectionTitle("CONNECTED WORKFLOW","Integrations","Plan how the Collaboration Center will work with the rest of NeonNova and external tools."));
    const items=[["Coding Studio","Shared sessions, pair programming, file handoff","Planned"],["AI Lab","Shared experiments, prompts, model results","Planned"],["Learning Hub","Study groups, learning paths, team challenges","Planned"],["Publishing","Release checklists and deployment coordination","Planned"],["Git provider","Repositories, branches, commits, pull requests","Not connected"],["Communication","External chat, audio, and video meeting tools","Not connected"]];
    const grid=makeEl("div","collab-card-grid");items.forEach(([name,detail,stateLabel])=>{const c=card(name,detail,"Integration: "+stateLabel);const tag=makeEl("span","collab-tag",stateLabel.toUpperCase());c.append(tag);grid.append(c)});body.append(grid);
    body.append(makeEl("p","collab-muted","No external account has been connected and no credentials are requested in this prototype."));
  }
  function render(){body.replaceChildren();nav.replaceChildren();tabs.forEach(([id,label])=>{const b=makeButton(label,"collab-tab"+(active===id?" is-active":""),()=>{active=id;render()});b.setAttribute("aria-current",active===id?"page":"false");nav.append(b)});({overview:renderOverview,projects:renderProjects,tasks:renderTasks,discussions:renderDiscussions,reviews:renderReviews,resources:renderResources,team:renderTeam,activity:renderActivity,notifications:renderNotifications,analytics:renderAnalytics,integrations:renderIntegrations}[active]||renderOverview)();refreshStats();persist("Changes saved in this browser.");}
  panel.append(nav,body,status);root.append(panel);render();
}

const LEARNING_RESOURCES = [
  {category:"Start here", level:"Beginner", title:"MDN Learn Web Development", detail:"Structured web curriculum with practical exercises covering the web, HTML, CSS, JavaScript, accessibility, and tools.", url:"https://developer.mozilla.org/en-US/docs/Learn_web_development", kind:"Guided curriculum", free:"Free"},
  {category:"Start here", level:"Beginner", title:"freeCodeCamp", detail:"Interactive lessons and project-based learning across web development, JavaScript, Python, databases, and APIs.", url:"https://www.freecodecamp.org/learn/", kind:"Interactive courses", free:"Free"},
  {category:"Start here", level:"Beginner", title:"The Odin Project", detail:"A project-driven full-stack web development curriculum. Some setup uses command-line tools and Git.", url:"https://www.theodinproject.com/", kind:"Project curriculum", free:"Free"},
  {category:"HTML & CSS", level:"Beginner", title:"HTML — MDN", detail:"Semantic page structure, links, images, forms, and accessible markup.", url:"https://developer.mozilla.org/en-US/docs/Learn_web_development/Core/Structuring_content", kind:"Documentation + exercises", free:"Free"},
  {category:"HTML & CSS", level:"Beginner", title:"CSS — MDN", detail:"Selectors, box model, layout, responsive design, typography, and visual styling.", url:"https://developer.mozilla.org/en-US/docs/Learn_web_development/Core/Styling_basics", kind:"Documentation + exercises", free:"Free"},
  {category:"JavaScript", level:"Beginner", title:"JavaScript Guide — MDN", detail:"Language fundamentals, functions, objects, promises, modules, and browser APIs.", url:"https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide", kind:"Language reference", free:"Free"},
  {category:"JavaScript", level:"Beginner", title:"JavaScript.info", detail:"A detailed tutorial from fundamentals to browser behavior and advanced topics.", url:"https://javascript.info/", kind:"Step-by-step tutorial", free:"Free"},
  {category:"Python", level:"Beginner", title:"Official Python Tutorial", detail:"Learn Python syntax, data structures, modules, exceptions, files, and virtual environments.", url:"https://docs.python.org/3/tutorial/", kind:"Official documentation", free:"Free"},
  {category:"Python", level:"Beginner", title:"Automate the Boring Stuff with Python", detail:"Practical automation examples for files, spreadsheets, web tasks, and repetitive work.", url:"https://automatetheboringstuff.com/", kind:"Practical book", free:"Read online"},
  {category:"Java", level:"Beginner", title:"Dev.java Learning Paths", detail:"Java language basics, object-oriented programming, tools, and modern Java concepts.", url:"https://dev.java/learn/", kind:"Official learning paths", free:"Free"},
  {category:"C & C++", level:"Beginner", title:"Learn C++", detail:"Tutorials and reference material for C++ language fundamentals and the standard library.", url:"https://www.learncpp.com/", kind:"Tutorial", free:"Free"},
  {category:"C & C++", level:"Intermediate", title:"C Language — cppreference", detail:"Reference for C language syntax, standard library facilities, and language behavior.", url:"https://en.cppreference.com/w/c", kind:"Reference", free:"Free"},
  {category:"Git & Tools", level:"Beginner", title:"Git Handbook — GitHub", detail:"Understand repositories, commits, branches, remotes, and the basic Git workflow.", url:"https://docs.github.com/en/get-started/using-git/about-git", kind:"Official guide", free:"Free"},
  {category:"Git & Tools", level:"Beginner", title:"Learn Git Branching", detail:"Visual, interactive practice for commits, branches, merging, and rebasing.", url:"https://learngitbranching.js.org/", kind:"Interactive practice", free:"Free"},
  {category:"Backend & APIs", level:"Beginner", title:"Node.js Learn", detail:"Server-side JavaScript concepts, package management, asynchronous work, and HTTP servers.", url:"https://nodejs.org/en/learn", kind:"Official learning hub", free:"Free"},
  {category:"Backend & APIs", level:"Beginner", title:"Express.js Guide", detail:"Build web servers and APIs with routing, middleware, error handling, and security practices.", url:"https://expressjs.com/en/guide/routing.html", kind:"Official documentation", free:"Free"},
  {category:"Databases & SQL", level:"Beginner", title:"SQLBolt", detail:"Short interactive lessons for SQL queries, filtering, joins, and table operations.", url:"https://sqlbolt.com/", kind:"Interactive lessons", free:"Free"},
  {category:"Databases & SQL", level:"Beginner", title:"PostgreSQL Tutorial", detail:"Relational database concepts, SQL queries, joins, aggregates, and schema basics.", url:"https://www.postgresql.org/docs/current/tutorial.html", kind:"Official tutorial", free:"Free"},
  {category:"AI & Machine Learning", level:"Beginner", title:"Google Machine Learning Crash Course", detail:"Introductory ML concepts, model evaluation, data preparation, and interactive exercises.", url:"https://developers.google.com/machine-learning/crash-course", kind:"Course + exercises", free:"Free"},
  {category:"AI & Machine Learning", level:"Beginner", title:"Kaggle Learn", detail:"Short practical courses in Python, pandas, data visualization, machine learning, and AI topics.", url:"https://www.kaggle.com/learn", kind:"Micro-courses + notebooks", free:"Free"},
  {category:"AI & Machine Learning", level:"Intermediate", title:"fast.ai Practical Deep Learning", detail:"A hands-on deep learning course using examples and practical model-building workflows.", url:"https://course.fast.ai/", kind:"Practical course", free:"Free"},
  {category:"AI & Machine Learning", level:"Intermediate", title:"Hugging Face Learn", detail:"Learn about transformers, datasets, model hubs, agents, and machine-learning tooling.", url:"https://huggingface.co/learn", kind:"Courses + guides", free:"Free resources"},
  {category:"Security", level:"Beginner", title:"OWASP Top 10", detail:"Understand major web application security risks and the habits that help prevent them.", url:"https://owasp.org/www-project-top-ten/", kind:"Security reference", free:"Free"},
  {category:"Security", level:"Beginner", title:"PortSwigger Web Security Academy", detail:"Free interactive labs for learning web security concepts in a controlled environment.", url:"https://portswigger.net/web-security", kind:"Interactive labs", free:"Free"},
  {category:"Testing & Quality", level:"Beginner", title:"web.dev Learn Accessibility", detail:"Learn to make web interfaces usable with semantic HTML, keyboard support, and accessible patterns.", url:"https://web.dev/learn/accessibility/", kind:"Guided course", free:"Free"},
  {category:"Testing & Quality", level:"Intermediate", title:"Playwright Documentation", detail:"Automate browser tests for user journeys, UI behavior, and cross-browser checks.", url:"https://playwright.dev/docs/intro", kind:"Official documentation", free:"Free"},
  {category:"Cloud & Deployment", level:"Beginner", title:"GitHub Pages Documentation", detail:"Publish static websites from a GitHub repository and learn the basic deployment flow.", url:"https://docs.github.com/en/pages", kind:"Official guide", free:"Free for supported use"},
  {category:"Cloud & Deployment", level:"Beginner", title:"Vercel Learn", detail:"Guided lessons for modern web applications and deployment workflows.", url:"https://vercel.com/learn", kind:"Guided lessons", free:"Free learning content"},
  {category:"Computer Science", level:"Beginner", title:"CS50x — Harvard", detail:"A broad introduction to computer science, problem-solving, algorithms, and programming.", url:"https://cs50.harvard.edu/x/", kind:"University course", free:"Free to study"},
  {category:"Practice & Challenges", level:"Beginner", title:"Exercism", detail:"Practice programming with language-specific exercises and community mentoring options.", url:"https://exercism.org/", kind:"Coding practice", free:"Free"},
  {category:"Practice & Challenges", level:"Beginner", title:"Project Euler", detail:"Sharpen mathematical reasoning and programming through progressively challenging problems.", url:"https://projecteuler.net/", kind:"Problem solving", free:"Free"}
];

const LEARNING_PATH = [
  {id:"setup", title:"1. Set up your workspace", detail:"Install VS Code, learn files and folders, and use the terminal safely.", project:"Create a README and organize a project folder."},
  {id:"html", title:"2. Build pages with HTML", detail:"Use semantic elements, links, images, lists, and forms.", project:"Create a personal profile page with working links."},
  {id:"css", title:"3. Style with CSS", detail:"Practice the box model, layout, responsive design, and accessible contrast.", project:"Make your profile page responsive on mobile and desktop."},
  {id:"js", title:"4. Add JavaScript", detail:"Learn variables, functions, conditions, arrays, objects, DOM events, and fetch basics.", project:"Build an interactive task list or calculator."},
  {id:"git", title:"5. Learn Git and GitHub", detail:"Track changes with commits, create a repository, and understand branches.", project:"Publish a small static website and record its source history."},
  {id:"python", title:"6. Learn a second language", detail:"Start Python fundamentals, then practice files, data structures, and small scripts.", project:"Build a command-line quiz or file organizer."},
  {id:"backend", title:"7. Build a backend and database", detail:"Learn HTTP, APIs, server-side code, SQL, authentication concepts, and validation.", project:"Create a small notes API with a database and input validation."},
  {id:"ai", title:"8. Add AI responsibly", detail:"Learn Python/data basics, model evaluation, prompt design, API security, and privacy.", project:"Build an AI-assisted study tool with clear limitations and tests."},
  {id:"quality", title:"9. Test, secure, and deploy", detail:"Check accessibility, validate inputs, protect secrets, write tests, and monitor errors.", project:"Deploy a portfolio project and write a concise test checklist."}
];

function renderLearningHub(root) {
  const saved = (() => { try { return JSON.parse(localStorage.getItem("neonnova-learning-progress-v1") || "{}"); } catch { return {}; } })();
  const progress = saved.completed && typeof saved.completed === "object" ? saved.completed : {};
  const bookmarks = new Set(Array.isArray(saved.bookmarks) ? saved.bookmarks : []);
  const shell = makeEl("section", "learning-hub-workspace");
  shell.append(makeEl("div", "learning-hero-kicker", "LEARN / BUILD SKILLS / SHIP PROJECTS"));
  shell.append(makeEl("h2", "learning-hero-title", "Your path from curious beginner to confident builder"));
  shell.append(makeEl("p", "learning-hero-copy", "Use the roadmap to decide what to learn next, then open curated courses, official documentation, and hands-on practice. Choose one track at a time and build projects as you go."));

  const statRow = makeEl("div", "learning-stats");
  const stats = [ ["RESOURCES", String(LEARNING_RESOURCES.length)], ["ROADMAP STEPS", `${LEARNING_PATH.filter(x=>progress[x.id]).length}/${LEARNING_PATH.length}`], ["BOOKMARKS", String(bookmarks.size)] ];
  stats.forEach(([label,value]) => { const box=makeEl("div","learning-stat"); box.append(makeEl("span","",label),makeEl("strong","",value)); statRow.append(box); });
  shell.append(statRow);

  const pathSection = makeEl("section", "learning-section");
  pathSection.append(makeEl("div","learning-section-heading"));
  const ph=pathSection.querySelector(".learning-section-heading"); ph.append(makeEl("div","", "YOUR ROADMAP"), makeEl("h3","","A practical learning path"), makeEl("p","","Tick a step when you can apply it in a small project—not just when you finish watching a lesson."));
  const pathList = makeEl("div", "learning-roadmap");
  LEARNING_PATH.forEach(step => {
    const item=makeEl("label","learning-roadmap-item" + (progress[step.id] ? " is-complete" : ""));
    const check=document.createElement("input"); check.type="checkbox"; check.checked=Boolean(progress[step.id]); check.setAttribute("aria-label", "Mark " + step.title + " complete");
    const body=makeEl("span","learning-roadmap-content"); body.append(makeEl("strong","",step.title),makeEl("span","",step.detail),makeEl("small","","BUILD: " + step.project));
    check.addEventListener("change",()=>{ progress[step.id]=check.checked; persist(); item.classList.toggle("is-complete",check.checked); updateStats(); });
    item.append(check,body); pathList.append(item);
  });
  pathSection.append(pathList); shell.append(pathSection);

  const library = makeEl("section", "learning-section");
  const lh=makeEl("div","learning-section-heading"); lh.append(makeEl("div","","RESOURCE LIBRARY"),makeEl("h3","","Find your next lesson"),makeEl("p","","Curated external resources. Most entries are free; where relevant, check each provider for account requirements, certificates, or service limits.")); library.append(lh);
  const controls=makeEl("div","learning-controls");
  const search=document.createElement("input"); search.type="search"; search.className="learning-search"; search.placeholder="Search Python, AI, HTML, security…"; search.setAttribute("aria-label","Search learning resources");
  const category=document.createElement("select"); category.className="learning-category"; category.setAttribute("aria-label","Filter by learning category");
  ["All topics", ...new Set(LEARNING_RESOURCES.map(x=>x.category))].forEach(name=>{const o=document.createElement("option");o.value=name;o.textContent=name;category.append(o);});
  const level=document.createElement("select"); level.className="learning-category"; level.setAttribute("aria-label","Filter by difficulty");
  ["All levels","Beginner","Intermediate","Advanced"].forEach(name=>{const o=document.createElement("option");o.value=name;o.textContent=name;level.append(o);});
  controls.append(search,category,level); library.append(controls);
  const resultsMeta=makeEl("p","learning-results-meta"); resultsMeta.setAttribute("aria-live","polite"); library.append(resultsMeta);
  const resourceGrid=makeEl("div","learning-resource-grid"); library.append(resourceGrid);
  function renderResources(){
    const q=search.value.trim().toLowerCase(); const cat=category.value; const lev=level.value;
    const list=LEARNING_RESOURCES.filter(r=>(cat==="All topics"||r.category===cat)&&(lev==="All levels"||r.level===lev)&&(!q||[r.title,r.detail,r.category,r.level,r.kind].join(" ").toLowerCase().includes(q)));
    resultsMeta.textContent=`Showing ${list.length} of ${LEARNING_RESOURCES.length} resources`;
    resourceGrid.replaceChildren();
    if(!list.length){resourceGrid.append(makeEl("p","learning-empty","No resources match those filters. Try a broader search or choose All topics."));return;}
    list.forEach(r=>{
      const card=makeEl("article","learning-resource-card");
      const meta=makeEl("div","learning-resource-meta");meta.append(makeEl("span","learning-tag",r.category),makeEl("span","learning-level",r.level));
      const title=makeEl("h4","",r.title);const detail=makeEl("p","",r.detail);const kind=makeEl("p","learning-resource-kind",`${r.kind} · ${r.free}`);
      const actions=makeEl("div","learning-resource-actions");const a=makeEl("a","button button-primary","Open resource ↗");a.href=r.url;a.target="_blank";a.rel="noopener noreferrer";
      const b=makeEl("button","button learning-bookmark",bookmarks.has(r.title)?"★ Saved":"☆ Save");b.type="button";b.setAttribute("aria-pressed",String(bookmarks.has(r.title)));
      b.addEventListener("click",()=>{if(bookmarks.has(r.title))bookmarks.delete(r.title);else bookmarks.add(r.title);b.textContent=bookmarks.has(r.title)?"★ Saved":"☆ Save";b.setAttribute("aria-pressed",String(bookmarks.has(r.title)));persist();updateStats();});
      actions.append(a,b);card.append(meta,title,detail,kind,actions);resourceGrid.append(card);
    });
  }
  search.addEventListener("input",renderResources);category.addEventListener("change",renderResources);level.addEventListener("change",renderResources);renderResources();shell.append(library);

  const projects=makeEl("section","learning-section");const jh=makeEl("div","learning-section-heading");jh.append(makeEl("div","","LEARN BY MAKING"),makeEl("h3","","Portfolio project ideas"),makeEl("p","","Use these projects to turn lessons into evidence of your skills."));projects.append(jh);
  const ideas=[
    ["Personal portfolio","HTML · CSS · JavaScript","A responsive profile, project gallery, contact links, and accessible navigation."],
    ["Study planner","JavaScript · local storage","Add tasks, mark sessions complete, and show weekly progress."],
    ["Weather dashboard","APIs · async JavaScript","Fetch public weather data, show loading/error states, and explain API limits."],
    ["Python data explorer","Python · CSV · charts","Load a public CSV, clean missing values, and explain patterns accurately."],
    ["AI study assistant","Backend · AI API · safety","Build a server-backed assistant with private keys, clear citations where possible, and evaluation tests."],
    ["Secure notes API","Node.js · SQL · testing","Create validated CRUD endpoints, authentication, and tests for unauthorized access."]
  ];
  const ideaGrid=makeEl("div","learning-project-grid");ideas.forEach(([title,stack,desc])=>{const c=makeEl("article","learning-project-card");c.append(makeEl("span","learning-tag",stack),makeEl("h4","",title),makeEl("p","",desc));const b=makeEl("button","button learning-bookmark","Copy project brief");b.type="button";b.addEventListener("click",async()=>{const text=`Project: ${title}\nStack: ${stack}\nGoal: ${desc}\nNext step: Break the goal into three small tasks and test each feature.`;try{await navigator.clipboard.writeText(text);b.textContent="Brief copied ✓";}catch{const ta=document.createElement("textarea");ta.value=text;c.append(ta);ta.select();b.textContent="Select and copy the brief above";}});c.append(b);ideaGrid.append(c);});projects.append(ideaGrid);shell.append(projects);

  const footer=makeEl("div","learning-footer-actions");const reset=makeEl("button","button learning-bookmark","Reset learning progress");reset.type="button";reset.addEventListener("click",()=>{if(!confirm("Reset this browser's Learning Hub progress and bookmarks?"))return;Object.keys(progress).forEach(k=>delete progress[k]);bookmarks.clear();persist();openDashboard("learn",false);});footer.append(reset,makeEl("p","","Learning data is stored only in this browser. It is not a synced account record."));shell.append(footer);
  function persist(){try{localStorage.setItem("neonnova-learning-progress-v1",JSON.stringify({completed:progress,bookmarks:[...bookmarks],updatedAt:new Date().toISOString()}));}catch{}}
  function updateStats(){const values=statRow.querySelectorAll("strong");if(values[1])values[1].textContent=`${LEARNING_PATH.filter(x=>progress[x.id]).length}/${LEARNING_PATH.length}`;if(values[2])values[2].textContent=String(bookmarks.size);}
  root.append(shell);
}

// Supabase connection. The publishable key is designed for browser use; table RLS
// policies remain the security boundary. Never put a service-role key in this file.
const SUPABASE_URL = "https://smxwhonbjlquaadxnoll.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "sb_publishable_3k8OrFHg8qt2ud4B4Vo2kw_xGXMf2q5";
const supabaseClient = window.supabase?.createClient
  ? window.supabase.createClient(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY)
  : null;

function makeEl(tag, className, text) {
  const el = document.createElement(tag);
  if (className) el.className = className;
  if (text !== undefined) el.textContent = text;
  return el;
}
function makeField(labelText, type, placeholder, value = "") {
  const label = makeEl("label", "cloud-field");
  label.append(makeEl("span", "", labelText));
  const input = document.createElement(type === "textarea" ? "textarea" : "input");
  if (type !== "textarea") input.type = type;
  input.placeholder = placeholder;
  input.value = value;
  if (type === "textarea") input.rows = 8;
  label.append(input);
  return {label, input};
}
function renderProjectVault(root) {
  const panel = makeEl("section", "cloud-vault");
  const heading = makeEl("div", "cloud-vault-heading");
  heading.append(makeEl("span", "eyebrow", "CLOUD VAULT / SUPABASE"), makeEl("h3", "", "Your private projects"));
  panel.append(heading);
  const status = makeEl("p", "cloud-status", supabaseClient ? "Checking your session…" : "Supabase client did not load. Check your internet connection and reload this page.");
  status.setAttribute("role", "status");
  panel.append(status);
  if (!supabaseClient) { root.append(panel); return; }

  const authArea = makeEl("div", "cloud-auth-area");
  const projectArea = makeEl("div", "cloud-project-area");
  panel.append(authArea, projectArea);
  root.append(panel);

  const setStatus = (message, isError = false) => {
    status.textContent = message;
    status.classList.toggle("is-error", isError);
  };
  const refresh = async () => {
    authArea.replaceChildren(); projectArea.replaceChildren();
    const { data: { session }, error: sessionError } = await supabaseClient.auth.getSession();
    if (sessionError) { setStatus("Could not check session: " + sessionError.message, true); return; }
    if (!session) {
      setStatus("Sign in or create an account. Your cloud projects are private to your account.");
      const email = makeField("Email address", "email", "you@example.com");
      const password = makeField("Password", "password", "At least 8 characters");
      const name = makeField("Display name (for sign-up)", "text", "Your name");
      const authButtons = makeEl("div", "cloud-button-row");
      const signIn = makeEl("button", "button button-primary", "Sign in"); signIn.type = "button";
      const signUp = makeEl("button", "button button-secondary", "Create account"); signUp.type = "button";
      const runAuth = async (mode) => {
        const mail = email.input.value.trim(); const pass = password.input.value;
        if (!mail || !pass) { setStatus("Enter your email address and password first.", true); return; }
        if (mode === "signup" && pass.length < 8) { setStatus("Use a password with at least 8 characters.", true); return; }
        signIn.disabled = signUp.disabled = true;
        setStatus(mode === "signup" ? "Creating your account…" : "Signing in…");
        try {
          let result;
          if (mode === "signup") {
            result = await supabaseClient.auth.signUp({ email: mail, password: pass, options: { data: { display_name: name.input.value.trim() } } });
          } else {
            result = await supabaseClient.auth.signInWithPassword({ email: mail, password: pass });
          }
          if (result.error) { setStatus(result.error.message, true); return; }
          if (mode === "signup" && !result.data.session) {
            setStatus("Account created, but Supabase email confirmation is still enabled. In Supabase Dashboard → Authentication → Sign In / Providers → Email, turn Confirm email OFF for this prototype, then try signing up again. No dashboard access is granted until Supabase returns an authenticated session.", true);
            return;
          }
          setStatus(mode === "signup" ? "Account created and signed in. Opening your projects dashboard…" : "Signed in successfully. Opening your projects dashboard…");
          openDashboard("projects");
        } catch (error) {
          setStatus("Authentication request failed. Check your connection and try again.", true);
        } finally {
          signIn.disabled = signUp.disabled = false;
        }
      };
      signIn.addEventListener("click", () => runAuth("signin"));
      signUp.addEventListener("click", () => runAuth("signup"));
      authButtons.append(signIn, signUp);
      authArea.append(email.label, password.label, name.label, authButtons);
      return;
    }

    const user = session.user;
    setStatus("Signed in as " + user.email + ". Your saved projects are protected by database row-level security.");
    const signOut = makeEl("button", "button button-secondary", "Sign out");
    signOut.type = "button";
    signOut.addEventListener("click", async () => {
      const { error } = await supabaseClient.auth.signOut();
      if (error) setStatus("Could not sign out: " + error.message, true); else await refresh();
    });
    authArea.append(signOut);

    const nameField = makeField("Project name", "text", "My first project");
    nameField.input.maxLength = 120;
    const descriptionField = makeField("Project goal / description", "text", "What will this project do?");
    descriptionField.input.maxLength = 500;
    const languageField = makeField("Main language", "text", "html"); languageField.input.value = "html";
    languageField.input.maxLength = 40;
    const codeField = makeField("Project source code / notes", "textarea", "Write your code or project notes here…");
    const saveButton = makeEl("button", "button button-primary", "Save project to cloud"); saveButton.type = "button";
    const newButton = makeEl("button", "button button-secondary", "New project"); newButton.type = "button";
    const editor = makeEl("div", "cloud-project-editor");
    editor.append(nameField.label, descriptionField.label, languageField.label, codeField.label, makeEl("p", "cloud-empty", "Cloud saves belong to the signed-in account. Never put passwords, API keys, or other secrets in project notes."), makeEl("div", "cloud-button-row"));
    editor.lastElementChild.append(saveButton, newButton);
    newButton.addEventListener("click", () => {
      nameField.input.value = ""; descriptionField.input.value = ""; languageField.input.value = "html"; codeField.input.value = "";
      saveButton.dataset.projectId = ""; saveButton.textContent = "Save project to cloud";
      setStatus("New project form ready.");
    });
    projectArea.append(editor, makeEl("h4", "cloud-list-title", "Saved projects"));
    const list = makeEl("div", "cloud-project-list"); projectArea.append(list);

    const loadProjects = async () => {
      list.replaceChildren(makeEl("p", "cloud-empty", "Loading your projects…"));
      const { data: projects, error } = await supabaseClient.from("user_projects")
        .select("id,name,description,language,content,created_at,updated_at")
        .order("updated_at", { ascending: false });
      list.replaceChildren();
      if (error) { list.append(makeEl("p", "cloud-error", "Could not load projects: " + error.message)); return; }
      if (!projects.length) { list.append(makeEl("p", "cloud-empty", "No cloud projects yet. Create one above.")); return; }
      projects.forEach(project => {
        const item = makeEl("article", "cloud-project-item");
        const info = makeEl("div", "cloud-project-info");
        info.append(makeEl("strong", "", project.name), makeEl("small", "", (project.language || "text").toUpperCase() + " • Updated " + new Date(project.updated_at).toLocaleString()));
        const actions = makeEl("div", "cloud-project-actions");
        const open = makeEl("button", "button button-secondary", "Open"); open.type = "button";
        open.addEventListener("click", () => {
          nameField.input.value = project.name;
          descriptionField.input.value = project.description || "";
          languageField.input.value = project.language || "html";
          codeField.input.value = typeof project.content === "string" ? project.content : (project.content?.source || project.content?.notes || JSON.stringify(project.content || {}, null, 2));
          saveButton.dataset.projectId = project.id;
          saveButton.textContent = "Update saved project";
          editor.scrollIntoView({ behavior: "smooth", block: "center" });
        });
        const remove = makeEl("button", "button button-danger", "Delete"); remove.type = "button";
        remove.addEventListener("click", async () => {
          if (!window.confirm('Delete the cloud project "' + project.name + '"? This cannot be undone.')) return;
          try {
            const { error: deleteError } = await supabaseClient.from("user_projects").delete().eq("id", project.id);
            if (deleteError) setStatus("Delete failed: " + deleteError.message, true);
            else {
              if (saveButton.dataset.projectId === project.id) newButton.click();
              setStatus("Project deleted."); await loadProjects();
            }
          } catch (_) { setStatus("Delete request failed. Check your connection and try again.", true); }
        });
        actions.append(open, remove); item.append(info, actions); list.append(item);
      });
    };
    saveButton.addEventListener("click", async () => {
      const projectName = nameField.input.value.trim();
      if (!projectName) { setStatus("Enter a project name before saving.", true); nameField.input.focus(); return; }
      saveButton.disabled = true; setStatus("Saving project securely…");
      const payload = { user_id: user.id, name: projectName, description: descriptionField.input.value.trim(), language: languageField.input.value.trim() || "text", content: { source: codeField.input.value }, updated_at: new Date().toISOString() };
      const projectId = saveButton.dataset.projectId;
      try {
        const result = projectId
          ? await supabaseClient.from("user_projects").update(payload).eq("id", projectId).select("id").maybeSingle()
          : await supabaseClient.from("user_projects").insert(payload).select("id").single();
        if (result.error) { setStatus("Save failed: " + result.error.message, true); return; }
        if (projectId && !result.data) { setStatus("No project was updated. It may have been deleted or you may not own it. Reload the list and try again.", true); return; }
        setStatus(projectId ? "Project updated in your NeonNova cloud vault." : "Project saved to your NeonNova cloud vault.");
        newButton.click();
        await loadProjects();
      } catch (_) {
        setStatus("Save request failed. Check your connection and try again.", true);
      } finally {
        saveButton.disabled = false;
      }
    });
    await loadProjects();
  };
  refresh().catch(error => setStatus("Connection error: " + error.message, true));
}

tiles.forEach(tile => tile.addEventListener("click", () => openDashboard(tile.dataset.dashboard)));
document.getElementById("backToHub").addEventListener("click", showHub);
document.querySelectorAll('a[href="#mainDashboard"]').forEach(a => a.addEventListener("click", showHub));
document.body.dataset.theme = "overview";


// Main Command Center local clock and development roadmap.
function updateLocalClock() {
  const now = new Date();
  const clock = document.getElementById("localClock");
  const date = document.getElementById("localDate");
  if (clock) clock.textContent = now.toLocaleTimeString([], {hour:"2-digit", minute:"2-digit", second:"2-digit", hour12:false});
  if (date) date.textContent = now.toLocaleDateString([], {weekday:"long", year:"numeric", month:"short", day:"numeric"});
}
updateLocalClock();
window.setInterval(updateLocalClock, 1000);

document.getElementById("showBuildPlan")?.addEventListener("click", () => {
  const output = document.getElementById("roadmapMessage");
  if (!output) return;
  output.textContent = "DEVELOPMENT ROADMAP  •  01 — Finish the local Coding Studio with editable HTML, CSS, JavaScript and a sandboxed live preview.  02 — Add local project creation, import/export and validation.  03 — Expand tutorials and guided practice.  04 — Test accessibility, responsive layouts and browser compatibility.  05 — Only if you later choose, plan secure accounts, cloud storage or AI integrations as separate opt-in stages. This build currently uses no backend or API.";
  output.scrollIntoView({behavior:"smooth", block:"nearest"});
});


/* Browser Back/Forward and Escape restore the correct workspace view. */
window.addEventListener("popstate", () => {
  const key = location.hash.startsWith("#workspace-") ? decodeURIComponent(location.hash.slice("#workspace-".length)) : "";
  if (key && dashboards[key]) openDashboard(key, false);
  else showHub(false);
});
window.addEventListener("keydown", event => {
  if (event.key === "Escape" && document.body.classList.contains("dashboard-open")) showHub();
});
