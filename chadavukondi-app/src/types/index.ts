export type TopicStatus = 'pending' | 'completed' | 'review_later';

export interface StudyTopic {
  id: string;
  title: string;
  summary?: string;
  status: TopicStatus;
  allocatedHours: number;
  completedAt?: string;
  notes?: string;
}

export interface StudyDay {
  id: string;
  dayNumber: number; // e.g. Day 1, Day 2
  dateStr: string; // YYYY-MM-DD
  topics: StudyTopic[];
}

export interface StudyWeek {
  id: string;
  weekNumber: number; // Week 1, Week 2...
  theme: string;
  days: StudyDay[];
  isCompleted: boolean;
  completedAt?: string;
}

export interface MemeBadge {
  id: string;
  title: string;
  teluguTitle: string;
  description: string;
  memeQuote: string;
  badgeType: 'weekly' | 'monthly' | 'streak';
  unlockedAt?: string;
  iconName: string;
  color: string;
}

export interface StudyPlan {
  id: string;
  title: string; // Subject / Skill
  targetMonths: number;
  daysPerWeek: number;
  hoursPerDay: number;
  createdAt: string;
  startDate: string;
  weeks: StudyWeek[];
  streakDays: number;
  streakWeeks: number;
  badges: MemeBadge[];
}

export interface MemeReference {
  id: string;
  title: string;
  teluguQuote: string;
  englishMeaning: string;
  characterOrScene: string;
  category: 'motivation' | 'slacking_warning' | 'completion' | 'milestone';
}
