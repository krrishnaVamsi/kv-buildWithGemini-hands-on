import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { StudyPlan } from '../types';
import { M3 } from '../theme/material3';

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
    <TouchableOpacity activeOpacity={0.9} style={styles.card} onPress={onPress}>
      {/* Top Meta & Actions */}
      <View style={styles.headerRow}>
        <View style={styles.durationPill}>
          <Ionicons name="flash-outline" size={13} color={M3.colors.primary} />
          <Text style={styles.durationPillText}>
            {plan.targetMonths} Mo • {plan.daysPerWeek}d/wk • {plan.hoursPerDay}h/day
          </Text>
        </View>

        <TouchableOpacity
          style={styles.deleteIconButton}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          onPress={(e) => {
            e.stopPropagation();
            onDelete();
          }}
        >
          <Ionicons name="trash-outline" size={16} color="#94A3B8" />
        </TouchableOpacity>
      </View>

      {/* Plan Title */}
      <Text style={styles.title} numberOfLines={2}>
        {plan.title}
      </Text>

      {/* Stats Ribbon */}
      <View style={styles.statsRow}>
        <View style={styles.streakPill}>
          <Text style={styles.streakEmoji}>🔥</Text>
          <Text style={styles.streakText}>{plan.streakWeeks}w Streak</Text>
        </View>

        <View style={styles.topicsPill}>
          <Ionicons name="checkbox-outline" size={13} color={M3.colors.secondary} />
          <Text style={styles.topicsText}>{completedTopics}/{totalTopics} Cleared</Text>
        </View>

        <View style={styles.xpPill}>
          <Text style={styles.xpText}>{progressPercent}% Mastery</Text>
        </View>
      </View>

      {/* Capsule Progress Bar */}
      <View style={styles.progressBarTrack}>
        <View style={[styles.progressBarFill, { width: `${progressPercent}%` }]} />
      </View>

      {/* Next Up Focus Box */}
      {upcomingTopic && (
        <View style={styles.upcomingBox}>
          <View style={styles.upcomingTag}>
            <Text style={styles.upcomingTagText}>NEXT UP 🎯</Text>
          </View>
          <Text style={styles.upcomingTitle} numberOfLines={1}>
            {upcomingTopic}
          </Text>
        </View>
      )}

      {/* Badges Earned Ribbon */}
      {plan.badges && plan.badges.length > 0 && (
        <View style={styles.badgeRow}>
          {plan.badges.slice(0, 3).map((b) => (
            <View key={b.id} style={[styles.miniBadge, { backgroundColor: b.color + '1A' }]}>
              <Ionicons name={b.iconName as any} size={12} color={b.color} />
              <Text style={[styles.miniBadgeText, { color: b.color }]}>
                {b.teluguTitle || b.title}
              </Text>
            </View>
          ))}
          {plan.badges.length > 3 && (
            <View style={styles.moreBadge}>
              <Text style={styles.moreBadgeText}>+{plan.badges.length - 3}</Text>
            </View>
          )}
        </View>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 22,
    padding: 20,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    ...M3.elevation.level1,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  durationPill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: M3.colors.primaryContainer,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: M3.shapes.full,
    gap: 5,
  },
  durationPillText: {
    ...M3.typography.labelSmall,
    color: M3.colors.onPrimaryContainer,
    fontWeight: '700',
  },
  deleteIconButton: {
    width: 32,
    height: 32,
    borderRadius: M3.shapes.full,
    backgroundColor: '#F8FAFC',
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    ...M3.typography.titleLarge,
    color: M3.colors.onSurface,
    fontWeight: '700',
    marginBottom: 12,
  },
  statsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 14,
  },
  streakPill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FEF3C7',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: M3.shapes.full,
    gap: 4,
  },
  streakEmoji: {
    fontSize: 12,
  },
  streakText: {
    ...M3.typography.labelSmall,
    color: '#92400E',
    fontWeight: '700',
  },
  topicsPill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#E0F2FE',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: M3.shapes.full,
    gap: 4,
  },
  topicsText: {
    ...M3.typography.labelSmall,
    color: '#0369A1',
    fontWeight: '700',
  },
  xpPill: {
    backgroundColor: '#F1F5F9',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: M3.shapes.full,
  },
  xpText: {
    ...M3.typography.labelSmall,
    color: '#475569',
    fontWeight: '700',
  },
  progressBarTrack: {
    height: 7,
    backgroundColor: '#F1F5F9',
    borderRadius: M3.shapes.full,
    overflow: 'hidden',
    marginBottom: 12,
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: M3.colors.primary,
    borderRadius: M3.shapes.full,
  },
  upcomingBox: {
    backgroundColor: '#F8FAFC',
    borderRadius: 14,
    padding: 12,
    marginBottom: 10,
    borderLeftWidth: 3,
    borderLeftColor: M3.colors.primary,
  },
  upcomingTag: {
    marginBottom: 3,
  },
  upcomingTagText: {
    fontSize: 10,
    fontWeight: '800',
    color: M3.colors.primary,
    letterSpacing: 0.6,
  },
  upcomingTitle: {
    ...M3.typography.bodyMedium,
    color: M3.colors.onSurface,
    fontWeight: '600',
  },
  badgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    flexWrap: 'wrap',
    marginTop: 4,
  },
  miniBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: M3.shapes.full,
    gap: 4,
  },
  miniBadgeText: {
    fontSize: 10,
    fontWeight: '700',
  },
  moreBadge: {
    backgroundColor: '#F1F5F9',
    paddingHorizontal: 6,
    paddingVertical: 3,
    borderRadius: M3.shapes.full,
  },
  moreBadgeText: {
    fontSize: 10,
    color: '#64748B',
    fontWeight: '700',
  },
});
