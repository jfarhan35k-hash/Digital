// ============================================================
//  config.js  -  Digital Awareness Day
// ============================================================

// ---------- TOOLS ----------
const TOOLS = [
  { id:"iot_system",   emoji:"📡", label:"IoT System",         category:"Sensors & IoT",  stages:["capture","integrate"],  cost:2, desc:"IoT system combines sensors and a gateway to capture real-time data from machines (vibration, temperature, pressure) and securely stream it to cloud or on-prem systems." },
  { id:"wifi",         emoji:"📶", label:"Wi-Fi / Network",    category:"Sensors & IoT",  stages:["integrate"],            cost:1, desc:"Wi-Fi and plant networks provide the wireless connectivity needed for sensors, tablets and mobile tools to communicate." },
  { id:"5g_module",    emoji:"📡", label:"5G Module",          category:"Sensors & IoT",  stages:["integrate"],            cost:2, desc:"5G modules provide ultra-fast, low-latency connectivity for mobile equipment, AGVs and remote plant areas." },
  { id:"rfid",         emoji:"🏷️", label:"RFID Tag",           category:"Data Capture",   stages:["capture","identify"],   cost:1, desc:"RFID tags identify items, pallets or tools automatically when they pass a reader - no manual scanning needed." },
  { id:"barcode",      emoji:"📊", label:"Barcode Scanner",    category:"Data Capture",   stages:["capture","identify"],   cost:1, desc:"Barcode scanners quickly identify parts, products and batches to eliminate manual data entry errors." },
  { id:"mobile_form",  emoji:"📱", label:"Mobile Form",        category:"Data Capture",   stages:["capture","validate"],   cost:1, desc:"Mobile forms let operators capture inspections, defects and checklists directly on a phone or tablet." },
  { id:"photo_ocr",    emoji:"📷", label:"Photo + OCR",        category:"Data Capture",   stages:["capture","identify"],   cost:1, desc:"Photo capture with OCR extracts text from labels, serial numbers and documents using the device camera." },
  { id:"checklist",    emoji:"✅", label:"Digital Checklist",  category:"Workflow",       stages:["validate","act"],       cost:1, desc:"Digital checklists guide operators step-by-step and automatically record completion time and sign-off." },
  { id:"digital_sop",  emoji:"📋", label:"Digital SOP",        category:"Workflow",       stages:["identify","validate"],  cost:1, desc:"Digital SOPs show the correct work instructions with photos and videos directly at the point of use." },
  { id:"approval",     emoji:"✍️", label:"e-Approval",         category:"Workflow",       stages:["validate","act"],       cost:1, desc:"e-Approval routes requests like deviations or shift handovers through managers digitally for fast sign-off." },
  { id:"teams",        emoji:"💬", label:"Teams Alert",        category:"Workflow",       stages:["act"],                  cost:1, desc:"Microsoft Teams is used to communicate between team members, share updates and receive instant alert notifications." },
  { id:"alerts",       emoji:"🔔", label:"Smart Alerts",       category:"Workflow",       stages:["act"],                  cost:1, desc:"Smart Alerts automatically notify the right person by email, SMS or Teams when a threshold or anomaly is detected." },
  { id:"img_classify", emoji:"🤖", label:"Image Classifier",   category:"Smart Assist",   stages:["identify","validate"],  cost:3, desc:"Image classifiers use AI to automatically detect defects, missing parts or safety issues from photos." },
  { id:"predict",      emoji:"🔮", label:"Predictive Model",   category:"Smart Assist",   stages:["analyze","act"],        cost:3, desc:"Predictive models use historical data and machine learning to forecast failures before they happen." },
  { id:"nlp_chat",     emoji:"🧠", label:"NLP Chatbot",        category:"Smart Assist",   stages:["identify","act"],       cost:3, desc:"NLP chatbots answer operator questions in natural language, pulling info from manuals, SOPs and knowledge bases." },
  { id:"pi_vision",    emoji:"👁️", label:"PI Vision",          category:"Visualization",  stages:["analyze","validate"],   cost:2, desc:"PI Vision displays live and historical plant data in dashboards for quick analysis and troubleshooting." },
  { id:"digital_twin", emoji:"🪞", label:"Digital Twin",       category:"Visualization",  stages:["analyze","validate"],   cost:3, desc:"A Digital Twin is a live virtual model of a machine or process used for simulation, monitoring and optimisation." },
  { id:"power_auto",   emoji:"⚡", label:"Power Automate",     category:"Automation",     stages:["integrate","act"],      cost:2, desc:"Power Automate runs no-code workflows that connect apps - like auto-creating a ticket when an alert fires." },
  { id:"api_sync",     emoji:"🔗", label:"API Sync",           category:"Automation",     stages:["integrate"],            cost:2, desc:"API sync connects two systems in real time so data flows automatically without manual exports or imports." },
  { id:"erp",          emoji:"🏭", label:"ERP Connector",      category:"Automation",     stages:["integrate"],            cost:3, desc:"ERP connectors sync production, inventory and shipping data with SAP or Oracle for enterprise visibility." }
];

// ---------- SCENARIOS ----------
const SCENARIOS = [
  {
    id: "quality",
    title: "Tyre Curing Defect Detection",
    badge: "QUALITY",
    text: "Operator visually inspects cured tyres on the discharge conveyor for surface defects. Suspected defects are marked with a paper tag; the operator writes a defect code and shift details. The tagged tyre is moved to a QA bay; the QA inspector revisits later and transcribes to the QMS. Root-cause review is done weekly from paper logs.",
    pains: [
      "Subjectivity in visual checks under fatigue",
      "Lost or illegible tags; delayed transcription",
      "Slow root-cause analysis across shifts",
      "Repeat defects not detected quickly"
    ],
    manualTime: 600, manualError: 0.15, manualCost: 20,
    optimal: ["barcode","mobile_form","photo_ocr","img_classify","iot_system","wifi","pi_vision","alerts","api_sync"],
    requiredStages: ["capture","identify","validate","act"],
    keyToolCategories: ["Data Capture","Smart Assist","Visualization"]
  },
  {
    id: "production",
    title: "Tyre Building Machine Changeover",
    badge: "PRODUCTION",
    text: "Changeover from tyre size A to size B. The supervisor coordinates with mechanics; parts and recipes are fetched from stores; mechanical adjustments are done; the machine recipe is loaded manually in the HMI; initial trial runs follow; QA signs off. Steps are tracked on a paper SMED sheet.",
    pains: [
      "Hunting for parts and slow recipe retrieval",
      "Inconsistent sequence between crews",
      "Late QA sign-off; poor data for improvement",
      "High variability between shifts"
    ],
    manualTime: 2700, manualError: 0.12, manualCost: 150,
    optimal: ["rfid","barcode","digital_sop","checklist","iot_system","wifi","pi_vision","power_auto","api_sync"],
    requiredStages: ["identify","validate","integrate","act"],
    keyToolCategories: ["Data Capture","Workflow","Automation"]
  },
  {
    id: "maintenance",
    title: "Mixer Motor Breakdown Response",
    badge: "MAINTENANCE",
    text: "An operator notices unusual vibration or noise on the mixer motor; records it in a logbook; raises a paper work-order. The planner reviews, assigns a technician; the technician diagnoses, orders parts; parts are delivered later; the repair is done; the log is updated. Root-cause is analyzed monthly.",
    pains: [
      "Delayed detection; slow communication",
      "Parts stock-outs during urgent repairs",
      "Poor historical trending; long MTTR",
      "Repeated failures not spotted quickly"
    ],
    manualTime: 10800, manualError: 0.20, manualCost: 1200,
    optimal: ["iot_system","wifi","pi_vision","predict","mobile_form","teams","approval","power_auto","api_sync"],
    requiredStages: ["capture","analyze","integrate","act"],
    keyToolCategories: ["Sensors & IoT","Smart Assist","Automation"]
  }
];

// ---------- ANIMATED SCENES ----------
const SCENARIO_SCENES = {
  quality:
    '<svg viewBox="0 0 400 180" xmlns="http://www.w3.org/2000/svg" style="width:100%;height:100%">' +
      '<rect x="20" y="115" width="360" height="22" fill="#1a2050" stroke="#00f0ff" stroke-width="1"/>' +
      '<rect x="15" y="40" width="60" height="75" fill="#2a1a4a" stroke="#00f0ff" stroke-width="1.3" rx="2"/>' +
      '<text x="45" y="55" font-size="7" fill="#00f0ff" text-anchor="middle">PRESS A</text>' +
      '<rect x="325" y="40" width="60" height="75" fill="#2a1a4a" stroke="#00f0ff" stroke-width="1.3" rx="2"/>' +
      '<text x="355" y="55" font-size="7" fill="#00f0ff" text-anchor="middle">CAMERA</text>' +
      '<circle cx="355" cy="83" r="10" fill="none" stroke="#ffd700"><animate attributeName="stroke-opacity" values="0.3;1;0.3" dur="1.2s" repeatCount="indefinite"/></circle>' +
      '<g fill="none" stroke="#00f0ff" stroke-width="1.5">' +
        '<circle cx="110" cy="104" r="12"><animateTransform attributeName="transform" type="translate" from="0 0" to="20 0" dur="4s" repeatCount="indefinite"/></circle>' +
        '<circle cx="200" cy="104" r="12"><animateTransform attributeName="transform" type="translate" from="0 0" to="20 0" dur="4s" begin="1.3s" repeatCount="indefinite"/></circle>' +
        '<circle cx="285" cy="104" r="12"><animateTransform attributeName="transform" type="translate" from="0 0" to="20 0" dur="4s" begin="2.6s" repeatCount="indefinite"/></circle>' +
      '</g>' +
      '<text x="200" y="25" fill="#00f0ff" font-size="11" text-anchor="middle" font-weight="700">CURING LINE QUALITY</text>' +
      '<text x="200" y="160" fill="#ff3366" font-size="9" text-anchor="middle">AI VISION - DEFECT DETECTED</text>' +
    '</svg>',

  production:
    '<svg viewBox="0 0 400 180" xmlns="http://www.w3.org/2000/svg" style="width:100%;height:100%">' +
      '<rect x="40" y="55" width="320" height="85" fill="rgba(255,215,0,0.1)" stroke="#ffd700" stroke-width="1.3" rx="3"/>' +
      '<rect x="140" y="78" width="40" height="40" fill="rgba(0,240,255,0.15)" stroke="#00f0ff" stroke-width="1"><animate attributeName="opacity" values="1;0.3;1" dur="2s" repeatCount="indefinite"/></rect>' +
      '<text x="160" y="102" font-size="6" fill="#00f0ff" text-anchor="middle">A</text>' +
      '<rect x="225" y="78" width="40" height="40" fill="rgba(255,51,102,0.15)" stroke="#ff3366" stroke-width="1.5"/>' +
      '<text x="245" y="102" font-size="6" fill="#ff3366" text-anchor="middle">B</text>' +
      '<text x="200" y="20" fill="#ffd700" font-size="11" text-anchor="middle" font-weight="700">SMED CHANGEOVER</text>' +
      '<text x="200" y="165" fill="#ff3366" font-size="9" text-anchor="middle">SWAP IN PROGRESS - RECIPE B</text>' +
    '</svg>',

  maintenance:
    '<svg viewBox="0 0 400 180" xmlns="http://www.w3.org/2000/svg" style="width:100%;height:100%">' +
      '<rect x="130" y="50" width="140" height="95" rx="6" fill="rgba(255,51,102,0.08)" stroke="#ff3366" stroke-width="1.5"/>' +
      '<text x="200" y="63" fill="#ff3366" font-size="7" text-anchor="middle" font-weight="700">MIXER MOTOR</text>' +
      '<circle cx="200" cy="98" r="22" fill="none" stroke="#ff3366" stroke-width="1.5"/>' +
      '<circle cx="200" cy="98" r="22" fill="none" stroke="#ff3366" stroke-width="2"><animate attributeName="r" values="22;26;22" dur="0.6s" repeatCount="indefinite"/><animate attributeName="stroke-opacity" values="1;0;1" dur="0.6s" repeatCount="indefinite"/></circle>' +
      '<circle cx="200" cy="98" r="5" fill="#ff3366"/>' +
      '<text x="200" y="25" fill="#ff3366" font-size="11" text-anchor="middle" font-weight="700">MOTOR VIBRATION ALERT</text>' +
      '<text x="200" y="165" fill="#ff8c00" font-size="9" text-anchor="middle">PREDICTIVE MAINTENANCE REQUIRED</text>' +
    '</svg>'
};

// ---------- GAME SETTINGS ----------
const GAME_SETTINGS = {
  maxTiles: 8,
  timerSeconds: 300,
  weights: { coverage: 0.35, efficiency: 0.30, cost: 0.15, creativity: 0.10, keyTools: 0.10 },
  speedBonusMax: 50
};

// ---------- MISSION FLOW PHASES (4 sequential lanes) ----------
const PHASES = [
  { id: "detect",    label: "DETECT",    tagline: "Spot the issue before it hurts",  icon: "\u{1F50D}", stages: ["capture", "identify"], color: "#00f0ff" },
  { id: "analyze",   label: "ANALYZE",   tagline: "Understand the root cause",       icon: "\u{1F9E0}", stages: ["analyze", "validate"], color: "#7c3aed" },
  { id: "act",       label: "ACT",       tagline: "Take decisive corrective action", icon: "\u26A1",    stages: ["act"],                  color: "#ff8800" },
  { id: "integrate", label: "INTEGRATE", tagline: "Connect the loop, close the gap", icon: "\u{1F517}", stages: ["integrate"],            color: "#ffd700" }
];

function getToolPhase(tool) {
  if (!tool || !tool.stages) return null;
  for (var i = 0; i < PHASES.length; i++) {
    var ph = PHASES[i];
    for (var j = 0; j < tool.stages.length; j++) {
      if (ph.stages.indexOf(tool.stages[j]) >= 0) return ph.id;
    }
  }
  return null;
}
