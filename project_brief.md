# My agent: Chadavukondi Firstu (చదువుకోండి ఫస్టు)
One-liner: A motivational conversational study planner agent inspired by Telugu meme culture that helps students and learners break down ambitious subjects into structured weekly study schedules, track progress with completion/review states, and award humorous milestone achievement badges.

Tool coverage:
- Memory: Remembers the user's study topics, target mastery timeline, days per week, daily hours, completed modules, and streak history across sessions.
- Tools:
  - `generate_study_plan`: Calculate and allocate topic breakdown based on subject, target months, weekly days, and daily hours.
  - `add_custom_topic`: Dynamically insert user-defined subtopics into specific weeks or review buckets.
  - `update_topic_status`: Mark topic as 'completed' or 'mark for review later' across single or multiple weeks.
  - `check_streaks_and_badges`: Compute current weekly/monthly completion streaks and award milestone badges.
- Catalog/UI: Catalog of study weeks, daily syllabus topics, status toggles (Complete / Review Later), and earned meme milestone badges rendered via A2UI cards and tables.
- Image gen: Generates custom milestone achievement badges and motivational Telugu meme reaction visuals (e.g., Brahmi / Kota / Ali study motivation cards) for weekly and monthly milestones.
- Sandbox: Computes hours-to-topic workload distribution, pacing ratios, and streak tracking logic.

Recommended for every project: memory, storage, tools, image generation, A2UI
Agent-specific / stretch (pick what fits): Code sandbox for workload pacing algorithms, Cloud Firestore for persistent calendar state across devices.
