import { StudyPlan, StudyWeek, StudyDay, StudyTopic } from '../types';
import { getApiKey } from '../storage/planStorage';

interface GenerationParams {
  subject: string;
  daysPerWeek: number;
  hoursPerDay: number;
  targetMonths: number;
  userApiKey?: string;
}

export async function generateStudyPlanWithGemini(params: GenerationParams): Promise<StudyPlan> {
  const { subject, daysPerWeek, hoursPerDay, targetMonths } = params;
  const totalWeeks = Math.max(1, Math.min(24, Math.round(targetMonths * 4)));
  const apiKey = params.userApiKey || (await getApiKey());

  if (apiKey) {
    try {
      const prompt = `
You are the witty, encouraging study mentor for "Chadavukondi Firstu" (చదువుకోండి ఫస్టు), a Telugu meme-inspired smart study planner.
Generate a structured, accurate study syllabus and calendar for the following inputs:
- Subject / Goal: "${subject}"
- Duration: ${targetMonths} months (Total ${totalWeeks} weeks)
- Pacing: ${daysPerWeek} days per week
- Daily study time: ${hoursPerDay} hours per day

Provide output as a strictly valid JSON object with the following schema (no markdown formatting, no backticks, only raw JSON):
{
  "title": "${subject}",
  "weeks": [
    {
      "weekNumber": 1,
      "theme": "Theme or Milestone for this week",
      "days": [
        {
          "dayNumber": 1,
          "topics": [
            {
              "title": "Subtopic title",
              "summary": "Key concept or practice focus",
              "allocatedHours": ${hoursPerDay}
            }
          ]
        }
      ]
    }
  ]
}

Ensure:
- Exactly ${totalWeeks} weeks are generated.
- Each week contains exactly ${daysPerWeek} days.
- The topics strictly progress from foundational basics to advanced mastery accurately for the subject.
- Return ONLY the JSON object.
`;

      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: [{ parts: [{ text: prompt }] }],
            generationConfig: {
              responseMimeType: 'application/json',
            },
          }),
        }
      );

      if (response.ok) {
        const data = await response.json();
        const text = data.candidates?.[0]?.content?.parts?.[0]?.text;
        if (text) {
          const cleaned = text.replace(/```json/gi, '').replace(/```/g, '').trim();
          const parsed = JSON.parse(cleaned);
          if (parsed && Array.isArray(parsed.weeks) && parsed.weeks.length > 0) {
            return formatGeneratedPlan(parsed, subject, daysPerWeek, hoursPerDay, targetMonths);
          }
        }
      } else {
        const errText = await response.text();
        console.warn('Gemini API call returned non-200, falling back to smart synthesizer:', errText);
      }
    } catch (e) {
      console.warn('Error calling Gemini API directly, synthesizing offline plan:', e);
    }
  }

  // Robust Smart Offline Synthesizer: Accurately breaks down the subject into weeks & days
  return createSynthesizedPlan(subject, daysPerWeek, hoursPerDay, targetMonths);
}

function formatGeneratedPlan(
  data: any,
  subject: string,
  daysPerWeek: number,
  hoursPerDay: number,
  targetMonths: number
): StudyPlan {
  const planId = `plan-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;
  const startDate = new Date();

  const weeks: StudyWeek[] = (data.weeks || []).map((w: any, wIdx: number) => {
    const weekId = `week-${planId}-${wIdx + 1}`;
    const days: StudyDay[] = (w.days || []).map((d: any, dIdx: number) => {
      const dayDate = new Date(startDate);
      dayDate.setDate(startDate.getDate() + wIdx * 7 + dIdx);
      const dateStr = dayDate.toISOString().split('T')[0];
      const dayId = `day-${weekId}-${dIdx + 1}`;

      const topics: StudyTopic[] = (d.topics || []).map((t: any, tIdx: number) => ({
        id: `topic-${dayId}-${tIdx + 1}`,
        title: t.title || `Topic ${tIdx + 1}`,
        summary: t.summary || '',
        status: 'pending' as const,
        allocatedHours: t.allocatedHours || hoursPerDay,
      }));

      return {
        id: dayId,
        dayNumber: d.dayNumber || dIdx + 1,
        dateStr,
        topics,
      };
    });

    return {
      id: weekId,
      weekNumber: w.weekNumber || wIdx + 1,
      theme: w.theme || `Week ${wIdx + 1} Mastery`,
      days,
      isCompleted: false,
    };
  });

  return {
    id: planId,
    title: subject,
    targetMonths,
    daysPerWeek,
    hoursPerDay,
    createdAt: new Date().toISOString(),
    startDate: startDate.toISOString().split('T')[0],
    weeks,
    streakDays: 0,
    streakWeeks: 0,
    badges: [],
  };
}

// Curated Subject Curriculums for accurate domain roadmaps
interface DomainCurriculum {
  weeks: {
    theme: string;
    topics: { title: string; summary: string }[];
  }[];
}

const DOMAIN_CURRICULA: Record<string, DomainCurriculum> = {
  web_dev: {
    weeks: [
      {
        theme: 'HTML5, Modern CSS Layouts & Responsive UI',
        topics: [
          { title: 'Semantic HTML5 & Accessible Document Structure', summary: 'Deep dive into semantic tags, ARIA attributes, and clean DOM trees.' },
          { title: 'CSS Flexbox & Two-Dimensional Grid Systems', summary: 'Mastering flex layouts, alignment, template areas, and auto-fit/fill grids.' },
          { title: 'Responsive Design & Mobile-First Breakpoints', summary: 'Media queries, fluid typography (clamp), and cross-device testing.' },
          { title: 'Modern CSS: Custom Properties & Micro-animations', summary: 'CSS variables, keyframe animations, transitions, and hover states.' },
          { title: 'Week 1 Milestone: Responsive Portfolio Landing Page', summary: 'Build and polish a mobile-first responsive portfolio from scratch.' },
        ],
      },
      {
        theme: 'Modern JavaScript (ES6+), Closures & Async Patterns',
        topics: [
          { title: 'JavaScript Fundamentals: Scopes, Closures & Context', summary: 'Master lexical scoping, closures, IIFEs, and "this" binding.' },
          { title: 'ES6+ Features: Destructuring, Spread & Array Methods', summary: 'Map, filter, reduce, optional chaining, and nullish coalescing.' },
          { title: 'Asynchronous JS: Promises, Async/Await & Event Loop', summary: 'Understanding the microtask queue, call stack, and promise handling.' },
          { title: 'Fetch API, RESTful HTTP & JSON Serialization', summary: 'Network requests, headers, query parameters, and error handling.' },
          { title: 'Week 2 Project: Interactive Dynamic Dashboard App', summary: 'Build an interactive dashboard consuming live REST API endpoints.' },
        ],
      },
      {
        theme: 'React Foundations, Component Architecture & Hooks',
        topics: [
          { title: 'React Core Principles: JSX, Virtual DOM & Props', summary: 'Component decomposition, unidirectional data flow, and prop validation.' },
          { title: 'Interactive State Management: useState & User Inputs', summary: 'Controlled forms, multi-field state updates, and immutability.' },
          { title: 'Side Effects & Lifecycle: useEffect Mastery', summary: 'API calls, event subscriptions, cleanup functions, and dependency arrays.' },
          { title: 'Component Composition & Custom Reusable Hooks', summary: 'Extracting stateful business logic into clean, custom React hooks.' },
          { title: 'Week 3 Sprint: Multi-Screen React Productivity Suite', summary: 'Create a fully functional interactive React task/study application.' },
        ],
      },
      {
        theme: 'Backend Architecture: Node.js, Express & REST APIs',
        topics: [
          { title: 'Node.js Runtime & Express Server Setup', summary: 'Event loop, HTTP modules, routing architecture, and npm dependencies.' },
          { title: 'Middleware Pipeline: Logging, CORS & Body Parsers', summary: 'Request lifecycle, custom middleware, error handling, and validation.' },
          { title: 'RESTful API Design: CRUD Routes & Status Codes', summary: 'Semantic HTTP verbs, resource controllers, and status standards.' },
          { title: 'Database Integration: PostgreSQL / MongoDB Modeling', summary: 'Schemas, relations, indexing, and ORM/ODM integration.' },
          { title: 'Week 4 Capstone: Full Stack Connected Web Application', summary: 'Deploy a full-stack client-server app with end-to-end CRUD.' },
        ],
      },
    ],
  },
  python_ai: {
    weeks: [
      {
        theme: 'Python Fundamentals, Object-Oriented Design & Scripting',
        topics: [
          { title: 'Python Syntax, Dynamic Typing & Control Structures', summary: 'Variables, loops, conditionals, list comprehensions, and generators.' },
          { title: 'Data Structures: Lists, Dictionaries, Sets & Tuples', summary: 'Time complexities, hash maps, nested collections, and mutations.' },
          { title: 'Object-Oriented Programming (OOP) in Python', summary: 'Classes, inheritance, encapsulation, dunder methods, and dataclasses.' },
          { title: 'File I/O, Error Handling & Module Architecture', summary: 'Context managers (with), custom exceptions, and package imports.' },
          { title: 'Week 1 Milestone: CLI Automation & Data Tool', summary: 'Build a production-style CLI script parsing and transforming files.' },
        ],
      },
      {
        theme: 'Data Science Toolkit: NumPy, Pandas & Data Wrangling',
        topics: [
          { title: 'NumPy: Multidimensional Arrays & Vectorized Math', summary: 'Broadcasting, indexing, matrix algebra, and performance profiling.' },
          { title: 'Pandas DataFrames: Cleaning & Transformation', summary: 'Handling missing values, grouping, merges, joins, and pivot tables.' },
          { title: 'Exploratory Data Analysis (EDA) & Statistical Metrics', summary: 'Distributions, outliers, correlations, skewness, and variance.' },
          { title: 'Data Visualization: Matplotlib, Seaborn & Plotly', summary: 'Histograms, heatmaps, scatter plots, and executive charts.' },
          { title: 'Week 2 Project: Comprehensive Real-World EDA Report', summary: 'Clean a dirty dataset, extract insights, and present visualizations.' },
        ],
      },
      {
        theme: 'Classical Machine Learning: Supervised & Unsupervised Models',
        topics: [
          { title: 'Scikit-Learn Pipeline: Feature Scaling & Encoding', summary: 'One-hot encoding, standard scaling, trains/test splits, and pipelines.' },
          { title: 'Regression & Classification: Linear, Logistic & Trees', summary: 'Cost functions, gradient descent, decision boundaries, and metrics.' },
          { title: 'Ensemble Learning: Random Forests & Gradient Boosting', summary: 'Bagging, boosting, hyperparameter tuning with GridSearchCV.' },
          { title: 'Model Evaluation: ROC-AUC, Precision, Recall & F1', summary: 'Confusion matrices, cross-validation, and bias-variance tradeoff.' },
          { title: 'Week 3 Sprint: Predictive ML Model with High Accuracy', summary: 'Train, tune, and benchmark an ML model on benchmark tabular data.' },
        ],
      },
      {
        theme: 'Deep Learning, Neural Networks & Generative AI',
        topics: [
          { title: 'Neural Networks: Forward Propagation & Backprop', summary: 'Activation functions (ReLU, Sigmoid), loss functions, and optimizers.' },
          { title: 'PyTorch / TensorFlow: Tensors & Custom Layers', summary: 'Building neural architectures, dataset loaders, and training loops.' },
          { title: 'NLP & LLM Architectures: Transformers & Embeddings', summary: 'Attention mechanisms, tokenization, vector search, and RAG.' },
          { title: 'Building with Gemini API: Prompt Engineering & Tool Calling', summary: 'Structured outputs, system prompts, function calling, and agents.' },
          { title: 'Week 4 Capstone: Production AI Agent & Deployed Service', summary: 'Deploy a multimodal AI service powered by Google Gemini.' },
        ],
      },
    ],
  },
  dsa: {
    weeks: [
      {
        theme: 'Algorithmic Complexity, Arrays & Two-Pointer Patterns',
        topics: [
          { title: 'Big-O Time & Space Complexity Masterclass', summary: 'Analyzing loops, recursion trees, memory allocations, and amortized time.' },
          { title: 'Array Manipulations, In-Place Swaps & Prefix Sums', summary: 'Range queries, running totals, and continuous subarray sums.' },
          { title: 'Two Pointers Technique: Opposite & Same Direction', summary: 'Trapping rain water, container with most water, and sorted two-sum.' },
          { title: 'Sliding Window Pattern: Fixed & Dynamic Windows', summary: 'Longest substring without repeating characters, min size subarray.' },
          { title: 'Week 1 Drill: 15 High-Frequency LeetCode Array Problems', summary: 'Timed coding challenge focused on linear scan algorithms.' },
        ],
      },
      {
        theme: 'Hashing, Linked Lists & Fast-Slow Pointer Mechanics',
        topics: [
          { title: 'Hash Tables: Collisions, Frequency Maps & Sets', summary: 'Group anagrams, four-sum variations, and O(1) lookups.' },
          { title: 'Singly & Doubly Linked Lists: Pointers & Reversals', summary: 'In-place linked list reversal, node deletions, and sentinel heads.' },
          { title: 'Floyd’s Cycle Detection: Fast & Slow Pointers', summary: 'Detecting loops, cycle entry points, and middle node calculations.' },
          { title: 'LRU Cache Design: Combining Doubly Linked List & Hash Map', summary: 'O(1) get and put operations with doubly linked cache nodes.' },
          { title: 'Week 2 Drill: 15 Linked List & Pointer Drills', summary: 'Solve hard interview-standard list problems with zero leaks.' },
        ],
      },
      {
        theme: 'Stacks, Queues, Recursion & Backtracking Mastery',
        topics: [
          { title: 'Stack Patterns: Monotonic Stacks & Valid Parentheses', summary: 'Next greater element, largest rectangle in histogram.' },
          { title: 'Queues, Deques & Monotonic Queue Sliding Windows', summary: 'Sliding window maximum, circular queues, and BFS fundamentals.' },
          { title: 'Recursion Fundamentals & Recursion Tree Analysis', summary: 'Base cases, subproblem formulation, and call-stack visualization.' },
          { title: 'Backtracking: Permutations, Subsets & Combinations', summary: 'State restoration, pruning dead paths, and N-Queens strategy.' },
          { title: 'Week 3 Sprint: Exhaustive Search & Constraint Solving', summary: 'Build elegant recursive solvers for classic combinatorial puzzles.' },
        ],
      },
      {
        theme: 'Binary Trees, Graphs & Dynamic Programming (DP)',
        topics: [
          { title: 'Binary Trees: DFS Traversals & Lowest Common Ancestor', summary: 'Pre/in/post order, max path sum, diameter, and tree symmetry.' },
          { title: 'Graph Traversals: BFS, DFS & Topological Sorting', summary: 'Connected components, bipartite graphs, and course schedule order.' },
          { title: 'Dynamic Programming: 1D Memoization & Tabulation', summary: 'Climbing stairs, coin change, longest increasing subsequence.' },
          { title: 'Dynamic Programming: 2D Grids, Knapsack & String Edit', summary: 'Unique paths, 0/1 knapsack, edit distance, and space optimization.' },
          { title: 'Week 4 Capstone: Mock Technical Interview Marathon', summary: 'Simulated 90-minute tech interview with 3 FAANG-level problems.' },
        ],
      },
    ],
  },
  upsc_civils: {
    weeks: [
      {
        theme: 'Indian Polity: Constitutional Framework & Fundamental Rights',
        topics: [
          { title: 'Making of the Constitution, Preamble & Basic Structure', summary: 'Constituent assembly debates, philosophical tenets, and landmark doctrines.' },
          { title: 'Fundamental Rights (Articles 12-35) & Writs Jurisdiction', summary: 'Article 14, 19, 21 jurisprudence, exceptions, and Supreme Court writs.' },
          { title: 'Directive Principles (DPSP) & Fundamental Duties', summary: 'Socialist, Gandhian, Liberal-Intellectual principles and Article 51A.' },
          { title: 'Union Executive: President, Prime Minister & Council of Ministers', summary: 'Ordinance-making power, emergency provisions, and parliamentary system.' },
          { title: 'Week 1 Mock Test: 100 Polity Prelims MCQs & Mains Essay', summary: 'Timed assessment covering constitutional law and statutory bodies.' },
        ],
      },
      {
        theme: 'Modern Indian History: Freedom Struggle & Mass Movements',
        topics: [
          { title: 'British Expansion, Economic Drain & Early Resistance', summary: 'Land revenue systems, commercialization of agriculture, 1857 revolt.' },
          { title: 'Socio-Religious Reform Movements & National Awakening', summary: 'Raja Ram Mohan Roy, Arya Samaj, Jyotirao Phule, and press evolution.' },
          { title: 'Gandhian Mass Movements: NCM, CDM & Quit India', summary: 'Non-cooperation, Civil disobedience, Dandi March, and grassroots mobilization.' },
          { title: 'Constitutional Developments (1909-1947) & Partition', summary: 'Morley-Minto, Montagu-Chelmsford, 1935 Act, and Cabinet Mission.' },
          { title: 'Week 2 Milestone: Mains Answer Writing on Modern History', summary: 'Write 5 structured 250-word analytical answers with introductions and conclusions.' },
        ],
      },
      {
        theme: 'Geography & Environment: Physiography, Climate & Biodiversity',
        topics: [
          { title: 'Physical Geography: Geomorphology & Plate Tectonics', summary: 'Earthquakes, volcanism, continental drift, and major landforms.' },
          { title: 'Indian Monsoons, Climate Patterns & Drainage Networks', summary: 'Jet streams, El Niño/La Niña, Himalayan vs Peninsular river systems.' },
          { title: 'Ecology & Biodiversity Conservation in India', summary: 'Biomes, protected areas network, tiger reserves, and IUCN statuses.' },
          { title: 'Climate Change, Global Conventions & Renewable Targets', summary: 'UNFCCC, Paris Agreement, COP summits, and India’s Net Zero roadmaps.' },
          { title: 'Week 3 Sprint: Comprehensive Map Work & Ecology Case Studies', summary: 'Map plotting rivers, passes, national parks, and ecological hotspots.' },
        ],
      },
      {
        theme: 'Indian Economy, Budgeting, Science & Current Affairs',
        topics: [
          { title: 'Macroeconomic Concepts: GDP, Inflation & Fiscal Deficit', summary: 'National income, CPI vs WPI, monetary policy committee (MPC) tools.' },
          { title: 'Union Budget, Taxation Reforms & Financial Sector', summary: 'Direct vs indirect taxes, GST Council, banking NPAs, and capital markets.' },
          { title: 'Science & Technology: Space, Defence & Biotechnology', summary: 'ISRO missions, defence tech, gene editing (CRISPR), and AI ethics.' },
          { title: 'Ethics, Integrity & Aptitude (GS Paper IV) Framework', summary: 'Moral philosophers, public administration dilemmas, and case analysis.' },
          { title: 'Week 4 Capstone: Full-Length Prelims & Mains Simulation', summary: 'Comprehensive simulation test synthesizing all GS modules.' },
        ],
      },
    ],
  },
  science_medical: {
    weeks: [
      {
        theme: 'Cell Biology, Genetics & Molecular Foundations',
        topics: [
          { title: 'Cell Structure, Organelles & Membrane Transport', summary: 'Prokaryotes vs eukaryotes, active/passive transport, endomembrane system.' },
          { title: 'Cell Cycle & Cell Division: Mitosis & Meiosis', summary: 'Phases of cell cycle, checkpoints, crossing over, and gametogenesis.' },
          { title: 'Mendelian Genetics & Chromosomal Inheritance', summary: 'Monohybrid/dihybrid crosses, linkage, pedigree charts, and genetic disorders.' },
          { title: 'Molecular Basis of Inheritance: DNA, RNA & Transcription', summary: 'Replication machinery, central dogma, genetic code, and translation.' },
          { title: 'Week 1 High-Yield Drill: 100 Genetics & Cell Bio MCQs', summary: 'Rapid-fire problem solving on genetic ratios and molecular mechanisms.' },
        ],
      },
      {
        theme: 'Human Physiology: Organ Systems & Homeostasis',
        topics: [
          { title: 'Digestion & Human Respiratory Mechanics', summary: 'Enzymatic cascades, pulmonary volumes, oxygen-hemoglobin curve.' },
          { title: 'Circulatory System, Cardiac Cycle & Blood Grouping', summary: 'ECG interpretation, double circulation, lymphatic system, regulation.' },
          { title: 'Excretory Products & Nephron Countercurrent System', summary: 'Urine formation, osmolarity regulation, RAAS hormonal control.' },
          { title: 'Neural Control, Synaptic Transmission & Reflex Arcs', summary: 'Action potentials, neurotransmitters, brain regions, sensory organs.' },
          { title: 'Week 2 Sprint: Human Physiology Diagnostic Test', summary: 'Timed physiology diagnostic covering high-yield NCERT concepts.' },
        ],
      },
      {
        theme: 'Plant Physiology, Ecology & Environmental Biology',
        topics: [
          { title: 'Photosynthesis: Light Reactions & Calvin Cycle', summary: 'Z-scheme, cyclic photophosphorylation, C3/C4 pathways, photorespiration.' },
          { title: 'Respiration in Plants & Plant Growth Regulators', summary: 'Glycolysis, Krebs cycle, electron transport chain, auxins/gibberellins.' },
          { title: 'Organisms, Populations & Ecological Adaptations', summary: 'Population growth curves, interactions (mutualism, predation), niches.' },
          { title: 'Ecosystem Dynamics, Nutrient Cycles & Biodiversity', summary: 'Trophic levels, energy pyramids, nitrogen/carbon cycles, conservation.' },
          { title: 'Week 3 Milestone: Plant Bio & Ecology Problem Set', summary: 'Solve comprehensive multi-statement questions with zero errors.' },
        ],
      },
      {
        theme: 'Organic Chemistry & Physics Mechanics for Medical Prep',
        topics: [
          { title: 'General Organic Chemistry (GOC): Inductive & Resonance', summary: 'Carbocation stability, acidity/basicity trends, nucleophiles vs electrophiles.' },
          { title: 'Hydrocarbons & Oxygenated Organic Compounds', summary: 'Alkenes, alcohols, aldehydes, ketones, and carboxylic acid reactions.' },
          { title: 'Physics: Laws of Motion, Work, Power & Energy', summary: 'Free body diagrams, friction, conservation laws, and circular motion.' },
          { title: 'Physics: Gravitation, Fluid Dynamics & Thermodynamics', summary: 'Orbital velocity, Bernoulli principle, heat engines, and entropy.' },
          { title: 'Week 4 Capstone: High-Yield Grand Mock Examination', summary: 'Full 180-question simulation test across Biology, Chemistry & Physics.' },
        ],
      },
    ],
  },
};

function detectDomain(subject: string): string {
  const s = subject.toLowerCase();
  if (
    s.includes('web') ||
    s.includes('react') ||
    s.includes('javascript') ||
    s.includes('js') ||
    s.includes('typescript') ||
    s.includes('frontend') ||
    s.includes('backend') ||
    s.includes('full stack') ||
    s.includes('html') ||
    s.includes('css') ||
    s.includes('node') ||
    s.includes('flutter') ||
    s.includes('app dev') ||
    s.includes('mobile') ||
    s.includes('android') ||
    s.includes('ios')
  ) {
    return 'web_dev';
  }

  if (
    s.includes('python') ||
    s.includes('machine learning') ||
    s.includes('ml') ||
    s.includes('ai') ||
    s.includes('artificial intelligence') ||
    s.includes('data science') ||
    s.includes('deep learning') ||
    s.includes('nlp') ||
    s.includes('analytics') ||
    s.includes('pandas')
  ) {
    return 'python_ai';
  }

  if (
    s.includes('dsa') ||
    s.includes('algo') ||
    s.includes('algorithm') ||
    s.includes('data structure') ||
    s.includes('leetcode') ||
    s.includes('coding interview') ||
    s.includes('competitive programming') ||
    s.includes('system design')
  ) {
    return 'dsa';
  }

  if (
    s.includes('upsc') ||
    s.includes('ias') ||
    s.includes('ips') ||
    s.includes('appsc') ||
    s.includes('tspsc') ||
    s.includes('civils') ||
    s.includes('civil services') ||
    s.includes('polity') ||
    s.includes('history') ||
    s.includes('ssc') ||
    s.includes('gov')
  ) {
    return 'upsc_civils';
  }

  if (
    s.includes('neet') ||
    s.includes('biology') ||
    s.includes('medical') ||
    s.includes('doctor') ||
    s.includes('mbbs') ||
    s.includes('botany') ||
    s.includes('zoology') ||
    s.includes('anatomy') ||
    s.includes('physiology')
  ) {
    return 'science_medical';
  }

  return 'generic';
}

function createSynthesizedPlan(
  subject: string,
  daysPerWeek: number,
  hoursPerDay: number,
  targetMonths: number
): StudyPlan {
  const planId = `plan-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;
  const totalWeeks = Math.max(1, Math.min(24, Math.round(targetMonths * 4)));
  const startDate = new Date();
  const weeks: StudyWeek[] = [];

  const domainKey = detectDomain(subject);
  const curated = DOMAIN_CURRICULA[domainKey];

  for (let w = 0; w < totalWeeks; w++) {
    const weekId = `week-${planId}-${w + 1}`;
    let weekTheme = '';
    const days: StudyDay[] = [];

    if (curated && curated.weeks[w % curated.weeks.length]) {
      const templateWeek = curated.weeks[w % curated.weeks.length];
      const cycleNumber = Math.floor(w / curated.weeks.length) + 1;
      weekTheme = cycleNumber > 1 ? `${templateWeek.theme} (Adv. Phase ${cycleNumber})` : templateWeek.theme;

      for (let d = 0; d < daysPerWeek; d++) {
        const dayDate = new Date(startDate);
        dayDate.setDate(startDate.getDate() + w * 7 + d);
        const dateStr = dayDate.toISOString().split('T')[0];
        const dayId = `day-${weekId}-${d + 1}`;

        const templateTopic = templateWeek.topics[d % templateWeek.topics.length];
        const topicId = `topic-${dayId}-1`;

        days.push({
          id: dayId,
          dayNumber: d + 1,
          dateStr,
          topics: [
            {
              id: topicId,
              title: `${templateTopic.title}`,
              summary: `${templateTopic.summary} Dedicate ${hoursPerDay}h today. Chadavukondi Firstu!`,
              status: 'pending',
              allocatedHours: hoursPerDay,
            },
          ],
        });
      }
    } else {
      // Dynamic Intelligent Universal Synthesizer for custom subjects
      const genericPhases = [
        {
          theme: `Foundations & Core Principles of ${subject}`,
          topics: [
            `Orientation, Scope & Key Terminology in ${subject}`,
            `Fundamental Concepts & Primary Building Blocks of ${subject}`,
            `Essential Rules, Laws & Operational Models in ${subject}`,
            `Basic Hands-on Exercises & Problem Scenarios in ${subject}`,
            `Review, Diagnostic Check & Consolidation of ${subject} Basics`,
            `Practical Case Analysis & Common Beginner Traps in ${subject}`,
            `Week 1 Sprint: Foundational Knowledge Test in ${subject}`,
          ],
        },
        {
          theme: `Intermediate Techniques & Practical Applications of ${subject}`,
          topics: [
            `Structural Workflows & Intermediate Patterns in ${subject}`,
            `Application of Core Principles to Real Scenarios in ${subject}`,
            `Deepening Analytical Rigor & Methodologies for ${subject}`,
            `Interactive Guided Drills & Speed Exercises in ${subject}`,
            `Analyzing Edge Cases, Nuances & Solutions in ${subject}`,
            `Collaborative / Project-Based Applications of ${subject}`,
            `Week 2 Milestone: Practical Assessment in ${subject}`,
          ],
        },
        {
          theme: `Advanced Problem Solving & Deep Dive into ${subject}`,
          topics: [
            `Advanced Specialized Frameworks in ${subject}`,
            `Performance, Optimization & High-Efficiency Habits for ${subject}`,
            `Complex Multi-Variable Problem Solving in ${subject}`,
            `Comprehensive Error Analysis & Troubleshooting in ${subject}`,
            `Strategic Integration of Multi-Disciplinary Ideas in ${subject}`,
            `Real-world Simulations & Peer-Level Review in ${subject}`,
            `Week 3 Sprint: Advanced Scenario Solving in ${subject}`,
          ],
        },
        {
          theme: `Mastery, Capstone & Real-World Execution in ${subject}`,
          topics: [
            `End-to-End Capstone Project Architecture for ${subject}`,
            `Deep Review of High-Yield & Critical Focus Areas in ${subject}`,
            `Speed Drills & Full-Length Timed Mock Testing for ${subject}`,
            `Final Polishing, Fine-Tuning & Documentation for ${subject}`,
            `Comprehensive Self-Evaluation & Benchmark Verification in ${subject}`,
            `Portfolio Showcase / Certification Readiness for ${subject}`,
            `Grand Milestone: 100% Prepared & Locked in for ${subject}`,
          ],
        },
      ];

      const phase = genericPhases[w % genericPhases.length];
      const cycleNumber = Math.floor(w / genericPhases.length) + 1;
      weekTheme = cycleNumber > 1 ? `${phase.theme} (Level ${cycleNumber})` : phase.theme;

      for (let d = 0; d < daysPerWeek; d++) {
        const dayDate = new Date(startDate);
        dayDate.setDate(startDate.getDate() + w * 7 + d);
        const dateStr = dayDate.toISOString().split('T')[0];
        const dayId = `day-${weekId}-${d + 1}`;

        const topicName = phase.topics[d % phase.topics.length];
        const topicId = `topic-${dayId}-1`;

        days.push({
          id: dayId,
          dayNumber: d + 1,
          dateStr,
          topics: [
            {
              id: topicId,
              title: topicName,
              summary: `Master ${topicName}. Complete daily practice notes and lock in for ${hoursPerDay} hours!`,
              status: 'pending',
              allocatedHours: hoursPerDay,
            },
          ],
        });
      }
    }

    weeks.push({
      id: weekId,
      weekNumber: w + 1,
      theme: weekTheme,
      days,
      isCompleted: false,
    });
  }

  return {
    id: planId,
    title: subject,
    targetMonths,
    daysPerWeek,
    hoursPerDay,
    createdAt: new Date().toISOString(),
    startDate: startDate.toISOString().split('T')[0],
    weeks,
    streakDays: 0,
    streakWeeks: 0,
    badges: [],
  };
}
