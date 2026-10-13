import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { StudyTopic, TopicStatus } from '../types';
import { useTheme } from '../theme/ThemeContext';

interface TopicItemProps {
  topic: StudyTopic;
  onStatusChange: (status: TopicStatus) => void;
}

export const TopicItem: React.FC<TopicItemProps> = ({ topic, onStatusChange }) => {
  const { isDark, theme } = useTheme();
  const isCompleted = topic.status === 'completed';
  const isReviewLater = topic.status === 'review_later';

  const containerBg = isCompleted
    ? isDark ? '#064E3B' : '#F0FDF4'
    : isReviewLater
    ? isDark ? '#451A03' : '#FFFBEB'
    : theme.colors.cardBg;

  const containerBorder = isCompleted
    ? isDark ? '#059669' : '#BBF7D0'
    : isReviewLater
    ? isDark ? '#D97706' : '#FDE68A'
    : theme.colors.cardBorder;

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: containerBg,
          borderColor: containerBorder,
        },
      ]}
    >
      <View style={styles.contentCol}>
        <View style={styles.titleRow}>
          <Text
            style={[
              styles.title,
              { color: theme.colors.onSurface },
              isCompleted && {
                color: isDark ? '#A7F3D0' : '#15803D',
                textDecorationLine: 'line-through',
              },
            ]}
          >
            {topic.title}
          </Text>
        </View>

        {topic.summary ? (
          <Text
            style={[
              styles.summary,
              { color: theme.colors.onSurfaceVariant },
              isCompleted && { color: isDark ? '#6EE7B7' : '#86EFAC' },
            ]}
            numberOfLines={2}
          >
            {topic.summary}
          </Text>
        ) : null}

        <View style={styles.metaRow}>
          <View
            style={[
              styles.hourChip,
              { backgroundColor: theme.colors.surfaceContainerHigh },
            ]}
          >
            <Ionicons name="time-outline" size={13} color={theme.colors.onSurfaceVariant} />
            <Text
              style={[
                styles.hourText,
                { color: theme.colors.onSurfaceVariant },
              ]}
            >
              {topic.allocatedHours} hrs
            </Text>
          </View>

          {isCompleted && (
            <View
              style={[
                styles.statusBadgeCompleted,
                { backgroundColor: isDark ? '#065F46' : '#DCFCE7' },
              ]}
            >
              <Text
                style={[
                  styles.statusBadgeTextCompleted,
                  { color: isDark ? '#A7F3D0' : '#15803D' },
                ]}
              >
                Crushed It! ⚡️
              </Text>
            </View>
          )}

          {isReviewLater && (
            <View
              style={[
                styles.statusBadgeReview,
                { backgroundColor: isDark ? '#78350F' : '#FEF3C7' },
              ]}
            >
              <Text
                style={[
                  styles.statusBadgeTextReview,
                  { color: isDark ? '#FDE68A' : '#B45309' },
                ]}
              >
                Saved for Review 🔖
              </Text>
            </View>
          )}
        </View>
      </View>

      {/* Action Chips */}
      <View style={styles.actionsCol}>
        <TouchableOpacity
          style={[
            styles.actionChip,
            isCompleted
              ? {
                  backgroundColor: isDark ? '#065F46' : '#DCFCE7',
                  borderColor: isDark ? '#34D399' : '#86EFAC',
                }
              : {
                  backgroundColor: theme.colors.subtleBg,
                  borderColor: theme.colors.cardBorder,
                },
          ]}
          onPress={() => onStatusChange(isCompleted ? 'pending' : 'completed')}
          activeOpacity={0.8}
        >
          <Ionicons
            name={isCompleted ? 'checkmark-circle' : 'checkmark-circle-outline'}
            size={16}
            color={
              isCompleted
                ? isDark ? '#A7F3D0' : '#065F46'
                : theme.colors.onSurfaceVariant
            }
          />
          <Text
            style={[
              styles.actionChipText,
              {
                color: isCompleted
                  ? isDark ? '#A7F3D0' : '#065F46'
                  : theme.colors.onSurfaceVariant,
                fontWeight: isCompleted ? '800' : '600',
              },
            ]}
          >
            Done
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.actionChip,
            isReviewLater
              ? {
                  backgroundColor: isDark ? '#78350F' : '#FEF3C7',
                  borderColor: isDark ? '#FBBF24' : '#FCD34D',
                }
              : {
                  backgroundColor: theme.colors.subtleBg,
                  borderColor: theme.colors.cardBorder,
                },
          ]}
          onPress={() => onStatusChange(isReviewLater ? 'pending' : 'review_later')}
          activeOpacity={0.8}
        >
          <Ionicons
            name={isReviewLater ? 'bookmark' : 'bookmark-outline'}
            size={16}
            color={
              isReviewLater
                ? isDark ? '#FDE68A' : '#92400E'
                : theme.colors.onSurfaceVariant
            }
          />
          <Text
            style={[
              styles.actionChipText,
              {
                color: isReviewLater
                  ? isDark ? '#FDE68A' : '#92400E'
                  : theme.colors.onSurfaceVariant,
                fontWeight: isReviewLater ? '800' : '600',
              },
            ]}
          >
            Later
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    borderRadius: 18,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    alignItems: 'center',
  },
  contentCol: {
    flex: 1,
    paddingRight: 12,
  },
  titleRow: {
    marginBottom: 4,
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
  },
  summary: {
    fontSize: 12,
    marginBottom: 8,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    flexWrap: 'wrap',
  },
  hourChip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 9999,
    gap: 4,
  },
  hourText: {
    fontSize: 11,
    fontWeight: '700',
  },
  statusBadgeCompleted: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 9999,
  },
  statusBadgeTextCompleted: {
    fontSize: 11,
    fontWeight: '800',
  },
  statusBadgeReview: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 9999,
  },
  statusBadgeTextReview: {
    fontSize: 11,
    fontWeight: '800',
  },
  actionsCol: {
    flexDirection: 'column',
    gap: 6,
    justifyContent: 'center',
  },
  actionChip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 9999,
    gap: 4,
    minWidth: 76,
    justifyContent: 'center',
    borderWidth: 1,
  },
  actionChipText: {
    fontSize: 11,
  },
});
