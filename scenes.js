// ============================================================
// HIGH-QUALITY SVG SCENE ANIMATIONS - Industrial cinematic
// Pure inline SVG + CSS animations, loop forever
// ============================================================

const SCENARIO_SCENES = {

  quality: `
    <svg viewBox="0 0 800 400" xmlns="http://www.w3.org/2000/svg" class="scene-svg" preserveAspectRatio="xMidYMid meet">
      <defs>
        <radialGradient id="q-floor" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stop-color="#0d1a2e"/>
          <stop offset="100%" stop-color="#040812" stop-opacity="0"/>
        </radialGradient>
        <linearGradient id="q-tire-grad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stop-color="#2a2a2a"/>
          <stop offset="50%" stop-color="#0d0d0d"/>
          <stop offset="100%" stop-color="#1a1a1a"/>
        </linearGradient>
        <radialGradient id="q-rim" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stop-color="#4a5568"/>
          <stop offset="70%" stop-color="#2d3748"/>
          <stop offset="100%" stop-color="#1a202c"/>
        </radialGradient>
        <filter id="q-glow"><feGaussianBlur stdDeviation="3"/></filter>
      </defs>
      <ellipse cx="400" cy="340" rx="280" ry="30" fill="url(#q-floor)"/>
      <ellipse cx="400" cy="320" rx="180" ry="24" fill="#1a1f2e" stroke="#00f0ff" stroke-width="1" opacity="0.7"/>
      <g class="q-tire-group">
        <circle cx="400" cy="220" r="110" fill="url(#q-tire-grad)" stroke="#000" stroke-width="2"/>
        <circle cx="400" cy="220" r="100" fill="none" stroke="#0a0a0a" stroke-width="2" stroke-dasharray="12 6"/>
        <circle cx="400" cy="220" r="90" fill="none" stroke="#0a0a0a" stroke-width="2" stroke-dasharray="8 4"/>
        <circle cx="400" cy="220" r="65" fill="url(#q-rim)" stroke="#1a1a1a" stroke-width="2"/>
        <circle cx="400" cy="220" r="15" fill="#4a5568" stroke="#2d3748" stroke-width="2"/>
        <circle cx="400" cy="220" r="5" fill="#1a1a1a"/>
      </g>
      <g class="q-scan-line">
        <line x1="270" y1="220" x2="530" y2="220" stroke="#00f0ff" stroke-width="2" filter="url(#q-glow)"/>
      </g>
      <g class="q-detect-1"><rect x="340" y="155" width="40" height="40" fill="none" stroke="#00f0ff" stroke-width="2" rx="4"/></g>
      <g class="q-detect-2"><rect x="420" y="245" width="40" height="40" fill="none" stroke="#00f0ff" stroke-width="2" rx="4"/></g>
      <g class="q-detect-3"><rect x="430" y="170" width="35" height="35" fill="none" stroke="#ff8800" stroke-width="2" rx="4"/><text x="447" y="195" fill="#ff8800" font-size="16" text-anchor="middle" font-weight="bold">!</text></g>
      <g transform="translate(20, 20)">
        <rect width="160" height="50" fill="#0a0e1a" stroke="#00f0ff" stroke-width="1" rx="4" opacity="0.85"/>
        <text x="10" y="20" fill="#00f0ff" font-size="11" font-family="monospace">AI VISION ACTIVE</text>
        <circle cx="140" cy="17" r="5" fill="#00ff88"><animate attributeName="opacity" values="1;0.3;1" dur="1s" repeatCount="indefinite"/></circle>
        <text x="10" y="38" fill="#ffffff" font-size="10" font-family="monospace" opacity="0.7">SCANNING...</text>
      </g>
      <g transform="translate(620, 20)">
        <rect width="160" height="50" fill="#0a0e1a" stroke="#ff8800" stroke-width="1" rx="4" opacity="0.85"/>
        <text x="10" y="20" fill="#ff8800" font-size="11" font-family="monospace">DEFECTS: 02</text>
        <text x="10" y="38" fill="#ffffff" font-size="10" font-family="monospace" opacity="0.7">ACCURACY 99.2%</text>
      </g>
    </svg>
  `,

  production: `
    <svg viewBox="0 0 800 400" xmlns="http://www.w3.org/2000/svg" class="scene-svg" preserveAspectRatio="xMidYMid meet">
      <defs>
        <linearGradient id="p-metal" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stop-color="#4a5568"/>
          <stop offset="50%" stop-color="#2d3748"/>
          <stop offset="100%" stop-color="#1a202c"/>
        </linearGradient>
        <radialGradient id="p-drum" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stop-color="#3a3a3a"/>
          <stop offset="100%" stop-color="#1a1a1a"/>
        </radialGradient>
        <filter id="p-glow"><feGaussianBlur stdDeviation="4"/></filter>
      </defs>
      <rect x="0" y="320" width="800" height="80" fill="#0a0e1a"/>
      <ellipse cx="400" cy="340" rx="300" ry="20" fill="#1a1f2e" opacity="0.6"/>
      <rect x="250" y="260" width="300" height="80" fill="url(#p-metal)" stroke="#4a5568" stroke-width="2" rx="4"/>
      <g class="p-drum">
        <circle cx="400" cy="180" r="90" fill="url(#p-drum)" stroke="#000" stroke-width="2"/>
        <circle cx="400" cy="180" r="90" fill="none" stroke="#0a0a0a" stroke-width="2" stroke-dasharray="20 10"/>
        <circle cx="400" cy="180" r="70" fill="none" stroke="#0a0a0a" stroke-width="1" stroke-dasharray="10 5"/>
        <circle cx="400" cy="180" r="20" fill="#4a5568" stroke="#1a1a1a" stroke-width="2"/>
        <circle cx="400" cy="180" r="8" fill="#1a1a1a"/>
      </g>
      <g class="p-arm-left">
        <rect x="170" y="200" width="20" height="90" fill="url(#p-metal)" stroke="#2d3748" rx="4"/>
        <circle cx="180" cy="200" r="12" fill="#4a5568" stroke="#1a1a1a" stroke-width="2"/>
        <rect x="178" y="130" width="4" height="80" fill="#4a5568"/>
        <circle cx="180" cy="130" r="8" fill="#ff8800" filter="url(#p-glow)"/>
      </g>
      <g class="p-arm-right">
        <rect x="610" y="200" width="20" height="90" fill="url(#p-metal)" stroke="#2d3748" rx="4"/>
        <circle cx="620" cy="200" r="12" fill="#4a5568" stroke="#1a1a1a" stroke-width="2"/>
        <rect x="618" y="130" width="4" height="80" fill="#4a5568"/>
        <circle cx="620" cy="130" r="8" fill="#00f0ff" filter="url(#p-glow)"/>
      </g>
      <path d="M 100 180 Q 250 180 310 180" stroke="#1a1a1a" stroke-width="10" fill="none" stroke-linecap="round"/>
      <path d="M 100 180 Q 250 180 310 180" stroke="#2a2a2a" stroke-width="6" fill="none" stroke-linecap="round" stroke-dasharray="20 10">
        <animate attributeName="stroke-dashoffset" values="0;-30" dur="1s" repeatCount="indefinite"/>
      </path>
      <g transform="translate(300, 290)">
        <rect width="200" height="40" fill="#0a0e1a" stroke="#00f0ff" stroke-width="1" rx="4"/>
        <circle cx="20" cy="20" r="6" fill="#00ff88"><animate attributeName="opacity" values="1;0.3;1" dur="1.5s" repeatCount="indefinite"/></circle>
        <text x="40" y="25" fill="#00f0ff" font-size="12" font-family="monospace">CHANGEOVER: 68%</text>
      </g>
      <g class="p-steam">
        <circle cx="380" cy="100" r="10" fill="#ffffff" opacity="0.15"><animate attributeName="cy" values="100;40;100" dur="3s" repeatCount="indefinite"/><animate attributeName="opacity" values="0.3;0;0.3" dur="3s" repeatCount="indefinite"/></circle>
        <circle cx="395" cy="100" r="12" fill="#ffffff" opacity="0.1"><animate attributeName="cy" values="100;30;100" dur="4s" repeatCount="indefinite" begin="0.5s"/><animate attributeName="opacity" values="0.3;0;0.3" dur="4s" repeatCount="indefinite" begin="0.5s"/></circle>
        <circle cx="410" cy="100" r="8" fill="#ffffff" opacity="0.12"><animate attributeName="cy" values="100;50;100" dur="3.5s" repeatCount="indefinite" begin="1s"/><animate attributeName="opacity" values="0.3;0;0.3" dur="3.5s" repeatCount="indefinite" begin="1s"/></circle>
      </g>
      <g transform="translate(20, 20)">
        <rect width="160" height="50" fill="#0a0e1a" stroke="#00f0ff" stroke-width="1" rx="4" opacity="0.85"/>
        <text x="10" y="20" fill="#00f0ff" font-size="11" font-family="monospace">MACHINE STATUS</text>
        <text x="10" y="38" fill="#00ff88" font-size="10" font-family="monospace">OPERATIONAL</text>
      </g>
      <g transform="translate(620, 20)">
        <rect width="160" height="50" fill="#0a0e1a" stroke="#ffd700" stroke-width="1" rx="4" opacity="0.85"/>
        <text x="10" y="20" fill="#ffd700" font-size="11" font-family="monospace">CYCLE: 1247</text>
        <text x="10" y="38" fill="#ffffff" font-size="10" font-family="monospace" opacity="0.7">RPM: 42</text>
      </g>
    </svg>
  `,

  maintenance: `
    <svg viewBox="0 0 800 400" xmlns="http://www.w3.org/2000/svg" class="scene-svg" preserveAspectRatio="xMidYMid meet">
      <defs>
        <linearGradient id="m-motor" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stop-color="#3a3a3a"/>
          <stop offset="100%" stop-color="#1a1a1a"/>
        </linearGradient>
        <radialGradient id="m-warning" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stop-color="#ff3366" stop-opacity="0.6"/>
          <stop offset="100%" stop-color="#ff3366" stop-opacity="0"/>
        </radialGradient>
        <filter id="m-glow"><feGaussianBlur stdDeviation="4"/></filter>
      </defs>
      <rect x="0" y="330" width="800" height="70" fill="#0a0e1a"/>
      <circle class="m-warning-pulse" cx="400" cy="200" r="120" fill="url(#m-warning)"/>
      <circle class="m-warning-ring" cx="400" cy="200" r="150" fill="none" stroke="#ff3366" stroke-width="2" opacity="0.5"/>
      <rect x="300" y="300" width="200" height="30" fill="url(#m-motor)" stroke="#1a1a1a" stroke-width="2" rx="4"/>
      <rect x="320" y="150" width="160" height="150" fill="url(#m-motor)" stroke="#000" stroke-width="2" rx="8"/>
      <rect x="325" y="170" width="150" height="2" fill="#0a0a0a"/>
      <rect x="325" y="186" width="150" height="2" fill="#0a0a0a"/>
      <rect x="325" y="202" width="150" height="2" fill="#0a0a0a"/>
      <rect x="325" y="218" width="150" height="2" fill="#0a0a0a"/>
      <rect x="325" y="234" width="150" height="2" fill="#0a0a0a"/>
      <rect x="325" y="250" width="150" height="2" fill="#0a0a0a"/>
      <rect x="325" y="266" width="150" height="2" fill="#0a0a0a"/>
      <rect x="325" y="282" width="150" height="2" fill="#0a0a0a"/>
      <g class="m-fan">
        <circle cx="400" cy="150" r="30" fill="#1a1a1a" stroke="#4a5568" stroke-width="2"/>
        <path d="M 400 120 L 415 145 L 400 150 L 385 145 Z" fill="#4a5568"/>
        <path d="M 430 150 L 405 165 L 400 150 L 405 135 Z" fill="#4a5568"/>
        <path d="M 400 180 L 385 155 L 400 150 L 415 155 Z" fill="#4a5568"/>
        <path d="M 370 150 L 395 135 L 400 150 L 395 165 Z" fill="#4a5568"/>
        <circle cx="400" cy="150" r="8" fill="#2d3748"/>
      </g>
      <circle class="m-hotspot" cx="400" cy="230" r="15" fill="#ff3366" filter="url(#m-glow)"/>
      <circle cx="400" cy="230" r="8" fill="#ffd700"/>
      <path d="M 320 220 Q 280 250 250 290" stroke="#1a1a1a" stroke-width="6" fill="none"/>
      <path d="M 480 220 Q 520 250 550 290" stroke="#1a1a1a" stroke-width="6" fill="none"/>
      <g class="m-alert">
        <polygon points="600,100 630,160 570,160" fill="#ffd700" stroke="#000" stroke-width="2"/>
        <text x="600" y="150" fill="#000" font-size="30" text-anchor="middle" font-weight="bold">!</text>
      </g>
      <g transform="translate(20, 20)">
        <rect width="170" height="50" fill="#0a0e1a" stroke="#ff3366" stroke-width="1" rx="4" opacity="0.9"/>
        <text x="10" y="20" fill="#ff3366" font-size="11" font-family="monospace">ALERT: MOTOR</text>
        <circle cx="150" cy="17" r="5" fill="#ff3366"><animate attributeName="opacity" values="1;0.2;1" dur="0.6s" repeatCount="indefinite"/></circle>
        <text x="10" y="38" fill="#ffffff" font-size="10" font-family="monospace" opacity="0.8">TEMP: 112C</text>
      </g>
      <g transform="translate(610, 20)">
        <rect width="170" height="50" fill="#0a0e1a" stroke="#ffd700" stroke-width="1" rx="4" opacity="0.9"/>
        <text x="10" y="20" fill="#ffd700" font-size="11" font-family="monospace">VIBRATION HIGH</text>
        <text x="10" y="38" fill="#ffffff" font-size="10" font-family="monospace" opacity="0.8">DOWNTIME RISK</text>
      </g>
    </svg>
  `
};
