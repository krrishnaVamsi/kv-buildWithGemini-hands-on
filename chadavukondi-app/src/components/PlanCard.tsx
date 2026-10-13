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
    <TouchableOpacity activeOpacity={0.88} style={styles.card} onPress={onPress}>
      {/* Top Meta & Actions */}
      <View style={styles.headerRow}>
        <View style={styles.m3Chip}>
          <Ionicons name="calendar-outline" size={13} color={M3.colors.primary} />
          <Text style={styles.m3ChipText}>{plan.targetMonths} Mo • {plan.daysPerWeek}d/wk</Text>
        </View>

        <TouchableOpacity
          style={styles.deleteIconButton}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          onPress={(e) => {
            e.stopPropagation();
            onDelete();
          }}
        >
          <Ionicons name="trash-outline" size={17} color={M3.colors.onSurfaceVariant} />
        </TouchableOpacity>
      </View>

      {/* Plan Title */}
      <Text style={styles.title} numberOfLines={2}>
        {plan.title}
      </Text>

      {/* Streak and Pace M3 Pills */}
      <View style={styles.statsRow}>
        <View style={styles.streakPill}>
          <Ionicons name="flame" size={15} color={M3.colors.warning} />
          <Text style={styles.streakText}>{plan.streakWeeks}w Streak</Text>
        </View>

        <View style={styles.statPill}>
          <Ionicons name="checkmark-done" size={15} color={M3.colors.success} />
          <Text style={styles.statText}>{completedTopics}/{totalTopics} Topics</Text>
        </View>

        <View style={styles.statPill}>
          <Ionicons name="time-outline" size={14} color={M3.colors.secondary} />
          <Text style={styles.statText}>{plan.hoursPerDay}h/day</Text>
        </View>
      </View>

      {/* M3 Capsule Progress Bar */}
      <View style={styles.progressSection}>
        <View style={styles.progressInfoRow}>
          <Text style={styles.progressLabel}>Syllabus Mastery</Text>
          <Text style={styles.progressValue}>{progressPercent}%</Text>
        </View>
        <View style={styles.progressBarTrack}>
          <View style={[styles.progressBarFill, { width: `${progressPercent}%` }]} />
        </View>
      </View>

      {/* Upcoming Topic Banner */}
      {upcomingTopic && (
        <View style={styles.upcomingBox}>
          <View style={styles.upcomingTag}>
            <Ionicons name="compass-outline" size={13} color={M3.colors.primary} />
            <Text style={styles.upcomingTagText}>NEXT UP</Text>
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
            <View key={b.id} style={[styles.miniBadge, { backgroundColor: b.color + '22' }]}>
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
    backgroundColor: M3.colors.surfaceContainerLow,
    borderRadius: M3.shapes.extraLarge,
    padding: 20,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: M3.colors.outlineVariant,
    ...M3.elevation.level1,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  m3Chip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: M3.colors.secondaryContainer,
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: M3.shapes.full,
    gap: 6,
  },
  m3ChipText: {
    ...M3.typography.labelSmall,
    color: M3.colors.onSecondaryContainer,
  },
  deleteIconButton: {
    width: 32,
    height: 32,
    borderRadius: M3.shapes.full,
    backgroundColor: M3.colors.surfaceContainerHighest,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    ...M3.typography.titleLarge,
    color: M3.colors.onSurface,
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
    backgroundColor: M3.colors.warningContainer,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: M3.shapes.full,
    gap: 5,
  },
  streakText: {
    ...M3.typography.labelSmall,
    color: M3.colors.onWarningContainer,
  },
  statPill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: M3.colors.surfaceContainerHighest,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: M3.shapes.full,
    gap: 5,
  },
  statText: {
    ...M3.typography.labelSmall,
    color: M3.colors.onSurfaceVariant,
  },
  progressSection: {
    marginBottom: 12,
  },
  progressInfoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  progressLabel: {
    ...M3.typography.labelSmall,
    color: M3.colors.onSurfaceVariant,
  },
  progressValue: {
    ...M3.typography.labelSmall,
    color: M3.colors.primary,
    fontWeight: '700',
  },
  progressBarTrack: {
    height: 8,
    backgroundColor: M3.colors.surfaceContainerHighest,
    borderRadius: M3.shapes.full,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: M3.colors.primary,
    borderRadius: M3.shapes.full,
  },
  upcomingBox: {
    backgroundColor: M3.colors.surfaceContainerHigh,
    borderRadius: M3.shapes.large,
    padding: 12,
    marginBottom: 10,
  },
  upcomingTag: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginBottom: 4,
  },
  upcomingTagText: {
    fontSize: 10,
    fontWeight: '800',
    color: M3.colors.primary,
    letterSpacing: 0.8,
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
    backgroundColor: M3.colors.surfaceContainerHighest,
    paddingHorizontal: 6,
    paddingVertical: 3,
    borderRadius: M3.shapes.full,
  },
  moreBadgeText: {
    fontSize: 10,
    color: M3.colors.onSurfaceVariant,
    fontWeight: '700',
  },
});
