import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { StudyPlan } from '../types';

interface PlanCardProps {
  plan: StudyPlan;
  onPress: () => void;
  onDelete: () => void;
}

export const PlanCard: React.FC<PlanCardProps> = ({ plan, onPress, onDelete }) => {
  // Compute total and completed topics
  let totalTopics = 0;
  let completedTopics = 0;
  let upcomingTopic: string | null = null;

  for (const week of plan.weeks) {
    for (const day of week.days) {
      for (const topic of day.topics) {
        totalTopics++;
        if (topic.status === 'completed') {
          completedTopics++;
        } else if (!upcomingTopic && topic.status === 'pending') {
          upcomingTopic = topic.title;
        }
      }
    }
  }

  const progressPercent = totalTopics > 0 ? Math.round((completedTopics / totalTopics) * 100) : 0;

  return (
    <TouchableOpacity activeOpacity={0.88} style={styles.card} onPress={onPress}>
      <View style={styles.headerRow}>
        <View style={styles.badgeContainer}>
          <Text style={styles.tagText}>{plan.targetMonths} Mo • {plan.daysPerWeek}d/wk</Text>
        </View>
        <TouchableOpacity
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          onPress={(e) => {
            e.stopPropagation();
            onDelete();
          }}
        >
          <Ionicons name="trash-outline" size={18} color="#94A3B8" />
        </TouchableOpacity>
      </View>

      <Text style={styles.title} numberOfLines={2}>
        {plan.title}
      </Text>

      {/* Streak and points bar */}
      <View style={styles.statsRow}>
        <View style={styles.statChip}>
          <Ionicons name="flame" size={15} color="#EF4444" />
          <Text style={styles.statText}>{plan.streakWeeks}w Streak</Text>
        </View>
        <View style={styles.statChip}>
          <Ionicons name="checkmark-done-circle" size={15} color="#10B981" />
          <Text style={styles.statText}>{completedTopics}/{totalTopics} Topics</Text>
        </View>
        {plan.badges.length > 0 && (
          <View style={[styles.statChip, { backgroundColor: '#FEF3C7' }]}>
            <Ionicons name="trophy" size={15} color="#D97706" />
            <Text style={[styles.statText, { color: '#B45309' }]}>{plan.badges.length} Badges</Text>
          </View>
        )}
      </View>

      {/* Upcoming topic highlight */}
      <View style={styles.upcomingBox}>
        <Text style={styles.upcomingLabel}>UPCOMING TOPIC</Text>
        <Text style={styles.upcomingTitle} numberOfLines={1}>
          {upcomingTopic || 'All topics completed! 🎉 Chadavukondi Topper!'}
        </Text>
      </View>

      {/* Progress bar */}
      <View style={styles.progressTrack}>
        <View style={[styles.progressFill, { width: `${progressPercent}%` }]} />
      </View>
      <View style={styles.footerRow}>
        <Text style={styles.progressLabel}>{progressPercent}% Syllabus Completed</Text>
        <Ionicons name="chevron-forward" size={16} color="#64748B" />
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.06,
    shadowRadius: 10,
    elevation: 3,
    borderWidth: 1,
    borderColor: '#F1F5F9',
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  badgeContainer: {
    backgroundColor: '#EEF2FF',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  tagText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#4F46E5',
    textTransform: 'uppercase',
  },
  title: {
    fontSize: 19,
    fontWeight: '700',
    color: '#0F172A',
    marginBottom: 12,
  },
  statsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 12,
  },
  statChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    gap: 4,
  },
  statText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#334155',
  },
  upcomingBox: {
    backgroundColor: '#F8FAFC',
    borderRadius: 10,
    padding: 10,
    marginBottom: 12,
    borderLeftWidth: 3,
    borderLeftColor: '#4F46E5',
  },
  upcomingLabel: {
    fontSize: 10,
    fontWeight: '800',
    color: '#64748B',
    letterSpacing: 0.5,
    marginBottom: 2,
  },
  upcomingTitle: {
    fontSize: 13,
    fontWeight: '600',
    color: '#1E293B',
  },
  progressTrack: {
    height: 6,
    backgroundColor: '#E2E8F0',
    borderRadius: 99,
    overflow: 'hidden',
    marginBottom: 8,
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#4F46E5',
    borderRadius: 99,
  },
  footerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  progressLabel: {
    fontSize: 12,
    fontWeight: '500',
    color: '#64748B',
  },
});
