export const STATUS_CONFIG = {
  live:   { label: "Live",        badge: "bg-green-900/40 text-green-400",   bar: "bg-green-500"  },
  dev:    { label: "In Progress", badge: "bg-blue-900/40 text-blue-400",     bar: "bg-blue-500"   },
  done:   { label: "Completed",   badge: "bg-purple-900/40 text-purple-400", bar: "bg-purple-500" },
  paused: { label: "Paused",      badge: "bg-amber-900/40 text-amber-400",   bar: "bg-amber-500"  },
};

export const TABS = [
  { key: "all",    label: "All"         },
  { key: "live",   label: "Live"        },
  { key: "dev",    label: "In Progress" },
  { key: "done",   label: "Completed"   },
  { key: "paused", label: "Paused"      },
];

export const EMPTY_FORM = { name: "", hackathon: "", desc: "", tags: "", status: "dev" };

export const INITIAL_TASKS = {
  p1: [
    { id: 1, text: "Set up project repository", done: true },
    { id: 2, text: "Design smart contract architecture", done: true },
    { id: 3, text: "Build frontend dashboard", done: false },
    { id: 4, text: "Write unit tests", done: false },
    { id: 5, text: "Deploy to testnet", done: false },
  ],
  p2: [
    { id: 1, text: "Data pipeline setup", done: true },
    { id: 2, text: "Train base model", done: true },
    { id: 3, text: "Build API layer", done: true },
    { id: 4, text: "Frontend integration", done: false },
    { id: 5, text: "Performance benchmarks", done: false },
  ],
  p3: [
    { id: 1, text: "UI wireframes", done: true },
    { id: 2, text: "Component library", done: false },
    { id: 3, text: "API integration", done: false },
  ],
};

export const INITIAL_PROJECTS = [
  {
    id: "p1", name: "ChainVault", hackathon: "Web3 Global Build",
    desc: "Decentralized asset management protocol with multi-sig wallets and yield optimization.",
    status: "live", progress: 62, tags: ["Solidity", "React", "Web3.js"],
    members: [
      { initials: "SC", name: "Sarah Chen",  role: "Full Stack Dev", color: "#1a3a5c", textColor: "#b8d4f8" },
      { initials: "JL", name: "Jordan Lee",  role: "Backend Eng",    color: "#3d2a1a", textColor: "#f8d4b8" },
      { initials: "AP", name: "Aisha Patel", role: "DevOps Eng",     color: "#1a3040", textColor: "#b8d4f8" },
    ],
    updated: "2h ago", github: "https://github.com", demo: "https://demo.com",
  },
  {
    id: "p2", name: "NeuralMatch", hackathon: "AI Agent Workshop",
    desc: "LLM-powered developer matchmaking using embeddings and semantic skill similarity.",
    status: "dev", progress: 78, tags: ["Python", "FastAPI", "OpenAI"],
    members: [
      { initials: "MK", name: "Marcus Kim", role: "ML Engineer",   color: "#2d1a5c", textColor: "#d4b8f8" },
      { initials: "PN", name: "Priya Nair", role: "Frontend Dev",  color: "#1a3d2b", textColor: "#b8f8d4" },
    ],
    updated: "5h ago", github: "https://github.com", demo: "https://demo.com",
  },
  {
    id: "p3", name: "EcoTrace", hackathon: "Climate Tech Hackathon",
    desc: "Supply chain carbon tracking dashboard for sustainability reporting.",
    status: "dev", progress: 35, tags: ["React", "Node.js", "MongoDB"],
    members: [
      { initials: "MZ", name: "Mei Zhang", role: "Mobile Dev", color: "#3d1a2a", textColor: "#f8b8d4" },
    ],
    updated: "1d ago", github: "https://github.com", demo: null,
  },
  {
    id: "p4", name: "HackBot", hackathon: "AI Agent Workshop",
    desc: "AI assistant for hackathon teams — automates standup summaries and task tracking.",
    status: "done", progress: 100, tags: ["Python", "GPT-4", "Slack API"],
    members: [
      { initials: "SC", name: "Sarah Chen", role: "Full Stack Dev", color: "#1a3a5c", textColor: "#b8d4f8" },
      { initials: "MK", name: "Marcus Kim", role: "ML Engineer",    color: "#2d1a5c", textColor: "#d4b8f8" },
    ],
    updated: "3d ago", github: "https://github.com", demo: "https://demo.com",
  },
  {
    id: "p5", name: "DevBridge", hackathon: "Web3 Global Build",
    desc: "Cross-chain identity protocol linking developer profiles across blockchains.",
    status: "paused", progress: 20, tags: ["Rust", "Substrate", "IPFS"],
    members: [
      { initials: "LB", name: "Lucas Berg", role: "Blockchain Dev", color: "#1a3040", textColor: "#b8d4f8" },
    ],
    updated: "1w ago", github: "https://github.com", demo: null,
  },
];