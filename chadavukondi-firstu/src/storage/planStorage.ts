import AsyncStorage from '@react-native-async-storage/async-storage';
import { StudyPlan, TopicStatus, StudyTopic, MemeBadge } from '../types';
import { MEME_BADGES_CATALOG } from '../data/memeCatalog';

const STORAGE_KEY_PLANS = '@chadavukondi_plans_v1';
const STORAGE_KEY_API_KEY = '@chadavukondi_gemini_api_key_v1';

export async function loadPlans(): Promise<StudyPlan[]> {
  try {
    const raw = await AsyncStorage.getItem(STORAGE_KEY_PLANS);
    if (!raw) return [];
    return JSON.parse(raw);
  } catch (error) {
    console.error('Failed to load study plans:', error);
    return [];
  }
}

export async function savePlans(plans: StudyPlan[]): Promise<void> {
  try {
    await AsyncStorage.setItem(STORAGE_KEY_PLANS, JSON.stringify(plans));
  } catch (error) {
    console.error('Failed to save study plans:', error);
  }
}

export async function getPlanById(planId: string): Promise<StudyPlan | null> {
  const plans = await loadPlans();
  return plans.find((p) => p.id === planId) || null;
}

export async function savePlan(plan: StudyPlan): Promise<void> {
  const plans = await loadPlans();
  const index = plans.findIndex((p) => p.id === plan.id);
  if (index >= 0) {
    plans[index] = plan;
  } else {
    plans.unshift(plan);
  }
  await savePlans(plans);
}

export async function deletePlan(planId: string): Promise<void> {
  const plans = await loadPlans();
  const updated = plans.filter((p) => p.id !== planId);
  await savePlans(updated);
}

export async function updateTopicStatusInPlan(
  planId: string,
  topicId: string,
  newStatus: TopicStatus
): Promise<StudyPlan | null> {
  const plan = await getPlanById(planId);
  if (!plan) return null;

  let topicFound = false;
  let targetWeekNumber = 1;

  for (const week of plan.weeks) {
    for (const day of week.days) {
      for (const topic of day.topics) {
        if (topic.id === topicId) {
          topic.status = newStatus;
          if (newStatus === 'completed') {
            topic.completedAt = new Date().toISOString();
          } else {
            delete topic.completedAt;
          }
          topicFound = true;
          targetWeekNumber = week.weekNumber;
          break;
        }
      }
      if (topicFound) break;
    }
    if (topicFound) break;
  }

  if (topicFound) {
    // Recalculate week completion and streaks/badges
    evaluatePlanStreaksAndBadges(plan);
    await savePlan(plan);
  }

  return plan;
}

export async function addCustomTopicToDay(
  planId: string,
  weekId: string,
  dayId: string,
  topicData: { title: string; summary?: string; allocatedHours: number }
): Promise<StudyPlan | null> {
  const plan = await getPlanById(planId);
  if (!plan) return null;

  const week = plan.weeks.find((w) => w.id === weekId);
  if (!week) return null;

  const day = week.days.find((d) => d.id === dayId);
  if (!day) return null;

  const newTopic: StudyTopic = {
    id: `custom-topic-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
    title: topicData.title.trim(),
    summary: topicData.summary || 'Custom user added topic',
    status: 'pending',
    allocatedHours: topicData.allocatedHours || 1,
  };

  day.topics.push(newTopic);
  evaluatePlanStreaksAndBadges(plan);
  await savePlan(plan);
  return plan;
}

export function evaluatePlanStreaksAndBadges(plan: StudyPlan): void {
  let completedWeeksCount = 0;
  let totalTopics = 0;
  let completedTopics = 0;

  for (const week of plan.weeks) {
    const weekTopics = week.days.flatMap((d) => d.topics);
    totalTopics += weekTopics.length;
    const weekCompleted = weekTopics.length > 0 && weekTopics.every((t) => t.status === 'completed');
    week.isCompleted = weekCompleted;
    if (weekCompleted) {
      completedWeeksCount++;
    }
    completedTopics += weekTopics.filter((t) => t.status === 'completed').length;
  }

  plan.streakWeeks = completedWeeksCount;
  // Estimate streak days based on completed topics
  plan.streakDays = completedTopics;

  // Evaluate badges
  const currentBadges = plan.badges || [];
  const awardBadge = (badgeTemplateId: string) => {
    if (!currentBadges.some((b) => b.id === badgeTemplateId)) {
      const template = MEME_BADGES_CATALOG.find((b) => b.id === badgeTemplateId);
      if (template) {
        currentBadges.push({
          ...template,
          unlockedAt: new Date().toISOString(),
        });
      }
    }
  };

  if (completedWeeksCount >= 1) awardBadge('badge-week-1');
  if (completedWeeksCount >= 2) awardBadge('badge-week-2');
  if (completedWeeksCount >= 3) awardBadge('badge-week-3');
  if (completedWeeksCount >= 4) awardBadge('badge-month-1');
  if (completedWeeksCount >= 8) awardBadge('badge-month-2');
  if (completedTopics >= 7) awardBadge('badge-streak-7');

  plan.badges = currentBadges;
}

export async function getApiKey(): Promise<string> {
  try {
    if (typeof window !== 'undefined' && window.localStorage) {
      const creatorKey = window.localStorage.getItem('creator_gemini_api_key');
      if (creatorKey && creatorKey.trim()) {
        return creatorKey.trim();
      }
    }
    const key = await AsyncStorage.getItem(STORAGE_KEY_API_KEY);
    return key || '';
  } catch {
    return '';
  }
}

export async function setApiKey(key: string): Promise<void> {
  await AsyncStorage.setItem(STORAGE_KEY_API_KEY, key.trim());
}
