import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { StudyPlan } from '../types';
import { useTheme } from '../theme/ThemeContext';

interface PlanCardProps {
  plan: StudyPlan;
  onPress: () => void;
  onDelete: () => void;
}

export const PlanCard: React.FC<PlanCardProps> = ({ plan, onPress, onDelete }) => {
  const { isDark, theme } = useTheme();

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
    <TouchableOpacity
      activeOpacity={0.9}
      style={[
        styles.card,
        {
          backgroundColor: theme.colors.cardBg,
          borderColor: theme.colors.cardBorder,
        },
      ]}
      onPress={onPress}
    >
      {/* Top Meta & Actions */}
      <View style={styles.headerRow}>
        <View
          style={[
            styles.durationPill,
            { backgroundColor: theme.colors.primaryContainer },
          ]}
        >
          <Ionicons name="flash-outline" size={13} color={theme.colors.primary} />
          <Text
            style={[
              styles.durationPillText,
              { color: theme.colors.onPrimaryContainer },
            ]}
          >
            {plan.targetMonths} Mo • {plan.daysPerWeek}d/wk • {plan.hoursPerDay}h/day
          </Text>
        </View>

        <TouchableOpacity
          style={[
            styles.deleteIconButton,
            { backgroundColor: theme.colors.subtleBg },
          ]}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          onPress={(e) => {
            e.stopPropagation();
            onDelete();
          }}
        >
          <Ionicons name="trash-outline" size={16} color={theme.colors.onSurfaceVariant} />
        </TouchableOpacity>
      </View>

      {/* Plan Title */}
      <Text
        style={[styles.title, { color: theme.colors.onSurface }]}
        numberOfLines={2}
      >
        {plan.title}
      </Text>

      {/* Stats Ribbon */}
      <View style={styles.statsRow}>
        <View
          style={[
            styles.streakPill,
            { backgroundColor: isDark ? '#451A03' : '#FEF3C7' },
          ]}
        >
          <Text style={styles.streakEmoji}>🔥</Text>
          <Text
            style={[
              styles.streakText,
              { color: isDark ? '#FDE68A' : '#92400E' },
            ]}
          >
            {plan.streakWeeks}w Streak
          </Text>
        </View>

        <View
          style={[
            styles.topicsPill,
            { backgroundColor: isDark ? '#082F49' : '#E0F2FE' },
          ]}
        >
          <Ionicons name="checkbox-outline" size={13} color={theme.colors.secondary} />
          <Text
            style={[
              styles.topicsText,
              { color: isDark ? '#BAE6FD' : '#0369A1' },
            ]}
          >
            {completedTopics}/{totalTopics} Cleared
          </Text>
        </View>

        <View
          style={[
            styles.xpPill,
            { backgroundColor: theme.colors.surfaceContainerHigh },
          ]}
        >
          <Text
            style={[
              styles.xpText,
              { color: theme.colors.onSurfaceVariant },
            ]}
          >
            {progressPercent}% Mastery
          </Text>
        </View>
      </View>

      {/* Capsule Progress Bar */}
      <View
        style={[
          styles.progressBarTrack,
          { backgroundColor: theme.colors.surfaceContainerHigh },
        ]}
      >
        <View
          style={[
            styles.progressBarFill,
            {
              width: `${progressPercent}%`,
              backgroundColor: theme.colors.primary,
            },
          ]}
        />
      </View>

      {/* Next Up Focus Box */}
      {upcomingTopic && (
        <View
          style={[
            styles.upcomingBox,
            {
              backgroundColor: theme.colors.subtleBg,
              borderLeftColor: theme.colors.primary,
            },
          ]}
        >
          <View style={styles.upcomingTag}>
            <Text style={[styles.upcomingTagText, { color: theme.colors.primary }]}>
              NEXT UP 🎯
            </Text>
          </View>
          <Text
            style={[styles.upcomingTitle, { color: theme.colors.onSurface }]}
            numberOfLines={1}
          >
            {upcomingTopic}
          </Text>
        </View>
      )}

      {/* Badges Earned Ribbon */}
      {plan.badges && plan.badges.length > 0 && (
        <View style={styles.badgeRow}>
          {plan.badges.slice(0, 3).map((b) => (
            <View
              key={b.id}
              style={[
                styles.miniBadge,
                { backgroundColor: isDark ? b.color + '33' : b.color + '1A' },
              ]}
            >
              <Ionicons name={b.iconName as any} size={12} color={b.color} />
              <Text style={[styles.miniBadgeText, { color: b.color }]}>
                {b.teluguTitle || b.title}
              </Text>
            </View>
          ))}
          {plan.badges.length > 3 && (
            <View
              style={[
                styles.moreBadge,
                { backgroundColor: theme.colors.surfaceContainerHigh },
              ]}
            >
              <Text
                style={[
                  styles.moreBadgeText,
                  { color: theme.colors.onSurfaceVariant },
                ]}
              >
                +{plan.badges.length - 3}
              </Text>
            </View>
          )}
        </View>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    borderRadius: 22,
    padding: 20,
    marginBottom: 16,
    borderWidth: 1,
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
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 9999,
    gap: 5,
  },
  durationPillText: {
    fontSize: 11,
    fontWeight: '700',
  },
  deleteIconButton: {
    width: 32,
    height: 32,
    borderRadius: 9999,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 18,
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
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 9999,
    gap: 4,
  },
  streakEmoji: {
    fontSize: 12,
  },
  streakText: {
    fontSize: 11,
    fontWeight: '700',
  },
  topicsPill: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 9999,
    gap: 4,
  },
  topicsText: {
    fontSize: 11,
    fontWeight: '700',
  },
  xpPill: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 9999,
  },
  xpText: {
    fontSize: 11,
    fontWeight: '700',
  },
  progressBarTrack: {
    height: 7,
    borderRadius: 9999,
    overflow: 'hidden',
    marginBottom: 12,
  },
  progressBarFill: {
    height: '100%',
    borderRadius: 9999,
  },
  upcomingBox: {
    borderRadius: 14,
    padding: 12,
    marginBottom: 10,
    borderLeftWidth: 3,
  },
  upcomingTag: {
    marginBottom: 3,
  },
  upcomingTagText: {
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 0.6,
  },
  upcomingTitle: {
    fontSize: 14,
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
    borderRadius: 9999,
    gap: 4,
  },
  miniBadgeText: {
    fontSize: 10,
    fontWeight: '700',
  },
  moreBadge: {
    paddingHorizontal: 6,
    paddingVertical: 3,
    borderRadius: 9999,
  },
  moreBadgeText: {
    fontSize: 10,
    fontWeight: '700',
  },
});
