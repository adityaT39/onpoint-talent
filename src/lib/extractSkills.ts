type SkillEntry = {
  display: string;
  aliases: string[];
};

export const SKILLS: SkillEntry[] = [
  // Frontend
  { display: "JavaScript",         aliases: ["javascript", "js"] },
  { display: "TypeScript",         aliases: ["typescript", "ts"] },
  { display: "Frontend Development", aliases: ["front-end", "frontend", "front end", "front-end development", "frontend development"] },
  { display: "React",              aliases: ["react", "reactjs", "react.js"] },
  { display: "Vue.js",             aliases: ["vue", "vue.js", "vuejs"] },
  { display: "Angular",            aliases: ["angular", "angularjs"] },
  { display: "Next.js",            aliases: ["next.js", "nextjs"] },
  { display: "HTML/CSS",           aliases: ["html", "css", "html5", "css3"] },
  { display: "Tailwind CSS",       aliases: ["tailwind", "tailwind css"] },
  { display: "Redux",              aliases: ["redux"] },
  { display: "GraphQL",            aliases: ["graphql"] },
  { display: "REST APIs",          aliases: ["rest api", "rest apis", "restful", "restful api"] },

  // Backend
  { display: "Node.js",            aliases: ["node.js", "nodejs", "node"] },
  { display: "Python",             aliases: ["python"] },
  { display: "Pandas",             aliases: ["pandas"] },
  { display: "Java",               aliases: ["java"] },
  { display: "C#",                 aliases: ["c#", "csharp"] },
  { display: "Go",                 aliases: ["golang", " go "] },
  { display: "Ruby",               aliases: ["ruby"] },
  { display: "PHP",                aliases: ["php"] },
  { display: "Rust",               aliases: ["rust"] },
  { display: "Django",             aliases: ["django"] },
  { display: "Flask",              aliases: ["flask"] },
  { display: "Spring Boot",        aliases: ["spring boot", "spring"] },
  { display: "FastAPI",            aliases: ["fastapi"] },
  { display: ".NET",               aliases: [".net", "dotnet", "asp.net"] },

  // OOP & Programming Concepts
  { display: "OOP",                aliases: ["object-oriented", "object oriented", "oop", "object-oriented programming", "object oriented programming", "object-oriented design"] },
  { display: "Functional Programming", aliases: ["functional programming"] },

  // Mobile
  { display: "React Native",       aliases: ["react native"] },
  { display: "Flutter",            aliases: ["flutter"] },
  { display: "Swift",              aliases: ["swift"] },
  { display: "Kotlin",             aliases: ["kotlin"] },
  { display: "iOS",                aliases: ["ios"] },
  { display: "Android",            aliases: ["android"] },

  // Databases
  { display: "SQL",                aliases: ["sql", "relational database", "database schema", "database schemas"] },
  { display: "PostgreSQL",         aliases: ["postgresql", "postgres"] },
  { display: "MySQL",              aliases: ["mysql"] },
  { display: "MongoDB",            aliases: ["mongodb", "mongo"] },
  { display: "Redis",              aliases: ["redis"] },
  { display: "Firebase",           aliases: ["firebase"] },
  { display: "Database Design",    aliases: ["database design", "data modelling", "data modeling", "schema design"] },

  // Version Control
  { display: "Version Control (Git)", aliases: ["git", "github", "version control", "source control", "code version control"] },

  // Cloud / DevOps
  { display: "AWS",                aliases: ["aws", "amazon web services"] },
  { display: "Azure",              aliases: ["azure", "microsoft azure"] },
  { display: "GCP",                aliases: ["gcp", "google cloud"] },
  { display: "Docker",             aliases: ["docker", "containerisation", "containerization"] },
  { display: "Kubernetes",         aliases: ["kubernetes", "k8s"] },
  { display: "CI/CD",              aliases: ["ci/cd", "continuous integration", "continuous deployment", "continuous delivery"] },
  { display: "Linux",              aliases: ["linux", "unix"] },
  { display: "Terraform",          aliases: ["terraform"] },
  { display: "DevOps",             aliases: ["devops"] },

  // Tools & Design
  { display: "Jira",               aliases: ["jira"] },
  { display: "Figma",              aliases: ["figma"] },
  { display: "Adobe XD",           aliases: ["adobe xd"] },
  { display: "Unity",              aliases: ["unity"] },
  { display: "Google Workspace",   aliases: ["google workspace", "google docs", "g suite", "google drive"] },

  // Data / ML / AI
  { display: "Machine Learning",   aliases: ["machine learning", "ml"] },
  { display: "AI / LLMs",          aliases: ["ai", "artificial intelligence", "llm", "large language model", "ai coding", "ai tools", "ai agents"] },
  { display: "Data Analysis",      aliases: ["data analysis", "data analytics", "analysing data", "analyzing data", "kpi reporting", "kpi", "financial data interpretation", "financial data"] },
  { display: "Data Science",       aliases: ["data science"] },
  { display: "Business Intelligence", aliases: ["business intelligence", "google business intelligence", "bi dashboard"] },
  { display: "Tableau",            aliases: ["tableau"] },
  { display: "Power BI",           aliases: ["power bi"] },
  { display: "Excel",              aliases: ["excel", "spreadsheet"] },

  // Testing
  { display: "Testing",            aliases: ["testing", "unit testing", "test-driven", "tdd", "automated testing"] },
  { display: "Jest",               aliases: ["jest"] },
  { display: "Cypress",            aliases: ["cypress"] },
  { display: "Playwright",         aliases: ["playwright"] },

  // Process & Soft skills
  { display: "Agile",              aliases: ["agile", "scrum", "kanban", "sprint"] },
  { display: "Project Management", aliases: ["project management"] },
  { display: "Communication",      aliases: ["communication skills", "written communication", "verbal communication", "client communication", "clear communication", "communication"] },
  { display: "Leadership",         aliases: ["leadership", "team lead", "tech lead"] },
  { display: "Problem Solving",    aliases: ["problem solving", "problem-solving", "analytical thinking"] },
  { display: "Stakeholder Management", aliases: ["stakeholder management", "stakeholder engagement"] },

  // Architecture
  { display: "System Design",      aliases: ["system design", "system architecture"] },
  { display: "Microservices",      aliases: ["microservices", "microservice"] },
  { display: "API Design",         aliases: ["api design", "api development"] },
  { display: "Serverless",         aliases: ["serverless", "lambda", "cloud functions"] },
  { display: "Cloud Architecture", aliases: ["cloud architecture", "cloud infrastructure"] },

  // Trades & Construction
  { display: "Plumbing",           aliases: ["plumbing", "plumber", "pipefitting", "pipe fitting"] },
  { display: "Electrical",         aliases: ["electrical", "electrician", "wiring", "circuitry"] },
  { display: "Carpentry",          aliases: ["carpentry", "carpenter", "woodworking", "joinery"] },
  { display: "Welding",            aliases: ["welding", "welder", "mig welding", "tig welding"] },
  { display: "HVAC",               aliases: ["hvac", "heating", "ventilation", "air conditioning", "refrigeration"] },
  { display: "Blueprint Reading",  aliases: ["blueprint", "blueprints", "shop drawing", "shop drawings", "technical drawing", "architectural drawing", "schematic"] },
  { display: "Safety Compliance",  aliases: ["osha", "health and safety", "safety compliance", "site safety", "ppe"] },
  { display: "Project Estimation", aliases: ["estimating", "cost estimation", "project estimation", "quoting"] },
  { display: "Heavy Machinery",    aliases: ["heavy machinery", "heavy equipment", "forklift", "excavator", "crane operation"] },
  { display: "Construction Management", aliases: ["construction management", "site management", "site supervisor", "construction experience", "new construction"] },

  // Education & Teaching
  { display: "Lesson Planning",    aliases: ["lesson planning", "lesson plan", "curriculum planning", "unit planning"] },
  { display: "Curriculum Development", aliases: ["curriculum development", "curriculum design", "course design"] },
  { display: "Classroom Management", aliases: ["classroom management", "behaviour management", "behavior management"] },
  { display: "Student Assessment", aliases: ["student assessment", "grading", "marking", "assessment and evaluation"] },
  { display: "Special Education",  aliases: ["special education", "special needs", "sen", "iep", "learning disabilities"] },
  { display: "Teaching",           aliases: ["teaching", "instruction", "tutoring", "lecturing", "facilitating learning"] },

  // Healthcare
  { display: "Patient Care",       aliases: ["patient care", "patient management", "bedside manner", "clinical care"] },
  { display: "Medical Terminology", aliases: ["medical terminology", "clinical terminology"] },
  { display: "First Aid / CPR",    aliases: ["first aid", "cpr", "basic life support", "bls", "aedefibrillator"] },
  { display: "Electronic Health Records", aliases: ["ehr", "emr", "electronic health records", "electronic medical records"] },
  { display: "Nursing",            aliases: ["nursing", "registered nurse", "rn", "enrolled nurse"] },
  { display: "Medication Administration", aliases: ["medication administration", "dispensing medication", "pharmacology"] },

  // Finance & Accounting
  { display: "Accounting",         aliases: ["accounting", "bookkeeping", "accounts payable", "accounts receivable", "general ledger"] },
  { display: "Financial Analysis", aliases: ["financial analysis", "financial modelling", "financial modeling", "financial reporting"] },
  { display: "Budgeting",          aliases: ["budgeting", "budget management", "forecasting", "financial planning"] },
  { display: "Payroll",            aliases: ["payroll", "payroll processing", "payroll management"] },
  { display: "QuickBooks",         aliases: ["quickbooks", "xero", "myob", "sage"] },
  { display: "Auditing",           aliases: ["auditing", "internal audit", "external audit", "compliance audit"] },
  { display: "Financial Products", aliases: ["mutual funds", "tfsa", "tfsas", "rrsp", "rrsps", "resp", "resps", "investment funds", "financial products"] },

  // Sales & Marketing
  { display: "Sales",              aliases: ["sales", "b2b sales", "b2c sales", "account management", "business development", "cold calling"] },
  { display: "CRM",                aliases: ["crm", "salesforce", "hubspot", "customer relationship management"] },
  { display: "Digital Marketing",  aliases: ["digital marketing", "online marketing", "performance marketing"] },
  { display: "SEO",                aliases: ["seo", "search engine optimisation", "search engine optimization"] },
  { display: "Social Media",       aliases: ["social media", "instagram", "linkedin marketing", "facebook ads", "tiktok"] },
  { display: "Content Creation",   aliases: ["content creation", "copywriting", "content writing", "blog writing"] },
  { display: "Email Marketing",    aliases: ["email marketing", "mailchimp", "klaviyo", "drip campaigns"] },

  // Customer Service
  { display: "Customer Service",   aliases: ["customer service", "customer support", "customer success", "client relations", "customer relations"] },
  { display: "Conflict Resolution", aliases: ["conflict resolution", "de-escalation", "dispute resolution"] },
  { display: "CRM Tools",          aliases: ["zendesk", "freshdesk", "intercom", "servicenow"] },

  // Legal
  { display: "Legal Research",     aliases: ["legal research", "case research", "statutory research"] },
  { display: "Contract Review",    aliases: ["contract review", "contract drafting", "contract negotiation"] },
  { display: "Compliance",         aliases: ["compliance", "regulatory compliance", "gdpr", "regulatory requirements", "kyc", "aml", "kyc/aml", "know your customer"] },
  { display: "Litigation",         aliases: ["litigation", "court proceedings", "legal proceedings"] },

  // Hospitality & Food Service
  { display: "Food Safety",        aliases: ["food safety", "food handling", "haccp", "food hygiene"] },
  { display: "POS Systems",        aliases: ["pos", "point of sale", "eftpos", "cash handling"] },
  { display: "Hospitality",        aliases: ["hospitality", "front of house", "front-of-house", "guest services"] },
  { display: "Inventory Management", aliases: ["inventory management", "stock management", "stock control", "inventory control"] },

  // General / Universal
  { display: "Microsoft Office",   aliases: ["microsoft office", "ms office", "word", "powerpoint", "outlook", "microsoft word", "microsoft 365", "office 365"] },
  { display: "Report Writing",     aliases: ["report writing", "technical writing", "documentation", "written reports", "proposal writing"] },
  { display: "Time Management",    aliases: ["time management", "prioritisation", "prioritization", "meeting deadlines"] },
  { display: "Work Ethic",         aliases: ["work ethic", "strong work ethic", "self-motivated", "self-motivation", "self motivation"] },
  { display: "Teamwork",           aliases: ["teamwork", "team player", "collaborative", "cross-functional", "collaboration", "collaborating"] },
  { display: "Research",           aliases: ["research", "data gathering", "information gathering"] },
  { display: "Attention to Detail", aliases: ["attention to detail", "detail-oriented", "detail oriented", "accuracy"] },
  { display: "Multitasking",       aliases: ["multitasking", "multi-tasking", "juggling priorities"] },
  { display: "Driver's Licence",   aliases: ["driver's licence", "driver's license", "drivers licence", "full licence", "valid licence", "driver's abstract", "drivers abstract", "driver abstract", "clean abstract"] },
];

export function extractSkills(text: string): string[] {
  const lower = text.toLowerCase();
  const results: string[] = [];

  for (const entry of SKILLS) {
    for (const alias of entry.aliases) {
      const idx = lower.indexOf(alias);
      if (idx === -1) continue;
      const before = idx === 0 || /\W/.test(lower[idx - 1]);
      const after = idx + alias.length >= lower.length || /\W/.test(lower[idx + alias.length]);
      if (before && after) {
        results.push(entry.display);
        break;
      }
    }
  }

  return results;
}
