import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { StudyTopic, TopicStatus } from '../types';
import { M3 } from '../theme/material3';

interface TopicItemProps {
  topic: StudyTopic;
  onStatusChange: (status: TopicStatus) => void;
}

export const TopicItem: React.FC<TopicItemProps> = ({ topic, onStatusChange }) => {
  const isCompleted = topic.status === 'completed';
  const isReviewLater = topic.status === 'review_later';

  return (
    <View
      style={[
        styles.container,
        isCompleted && styles.completedContainer,
        isReviewLater && styles.reviewContainer,
      ]}
    >
      <View style={styles.contentCol}>
        <View style={styles.titleRow}>
          <Text style={[styles.title, isCompleted && styles.completedTitle]}>
            {topic.title}
          </Text>
        </View>

        {topic.summary ? (
          <Text
            style={[styles.summary, isCompleted && styles.completedSummary]}
            numberOfLines={2}
          >
            {topic.summary}
          </Text>
        ) : null}

        <View style={styles.metaRow}>
          <View style={styles.hourChip}>
            <Ionicons name="time-outline" size={13} color={M3.colors.secondary} />
            <Text style={styles.hourText}>{topic.allocatedHours} hrs</Text>
          </View>

          {isCompleted && (
            <View style={styles.statusBadgeCompleted}>
              <Ionicons name="checkmark-circle" size={12} color={M3.colors.success} />
              <Text style={styles.statusBadgeTextCompleted}>Completed</Text>
            </View>
          )}

          {isReviewLater && (
            <View style={styles.statusBadgeReview}>
              <Ionicons name="bookmark" size={12} color={M3.colors.warning} />
              <Text style={styles.statusBadgeTextReview}>Review Later</Text>
            </View>
          )}
        </View>
      </View>

      {/* M3 Action Buttons */}
      <View style={styles.actionsCol}>
        {/* Complete Toggle Button */}
        <TouchableOpacity
          style={[
            styles.actionChip,
            isCompleted ? styles.actionChipCompletedActive : styles.actionChipNeutral,
          ]}
          onPress={() => onStatusChange(isCompleted ? 'pending' : 'completed')}
          activeOpacity={0.8}
        >
          <Ionicons
            name={isCompleted ? 'checkmark-circle' : 'checkmark-circle-outline'}
            size={18}
            color={isCompleted ? M3.colors.success : M3.colors.onSurfaceVariant}
          />
          <Text
            style={[
              styles.actionChipText,
              isCompleted && { color: M3.colors.success, fontWeight: '700' },
            ]}
          >
            {isCompleted ? 'Done' : 'Done'}
          </Text>
        </TouchableOpacity>

        {/* Review Later Toggle Button */}
        <TouchableOpacity
          style={[
            styles.actionChip,
            isReviewLater ? styles.actionChipReviewActive : styles.actionChipNeutral,
          ]}
          onPress={() => onStatusChange(isReviewLater ? 'pending' : 'review_later')}
          activeOpacity={0.8}
        >
          <Ionicons
            name={isReviewLater ? 'bookmark' : 'bookmark-outline'}
            size={18}
            color={isReviewLater ? M3.colors.warning : M3.colors.onSurfaceVariant}
          />
          <Text
            style={[
              styles.actionChipText,
              isReviewLater && { color: M3.colors.warning, fontWeight: '700' },
            ]}
          >
            {isReviewLater ? 'Saved' : 'Review'}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    backgroundColor: M3.colors.surfaceContainerLowest,
    borderRadius: M3.shapes.large,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: M3.colors.outlineVariant,
    ...M3.elevation.level1,
    alignItems: 'center',
  },
  completedContainer: {
    backgroundColor: '#F3FBF5',
    borderColor: '#BEE7C7',
  },
  reviewContainer: {
    backgroundColor: '#FFFBF3',
    borderColor: '#FBE0B5',
  },
  contentCol: {
    flex: 1,
    paddingRight: 12,
  },
  titleRow: {
    marginBottom: 4,
  },
  title: {
    ...M3.typography.titleMedium,
    color: M3.colors.onSurface,
  },
  completedTitle: {
    color: '#3B7A4C',
    textDecorationLine: 'line-through',
  },
  summary: {
    ...M3.typography.bodySmall,
    color: M3.colors.onSurfaceVariant,
    marginBottom: 8,
  },
  completedSummary: {
    color: '#6E987B',
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
    backgroundColor: M3.colors.surfaceContainerHighest,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: M3.shapes.full,
    gap: 4,
  },
  hourText: {
    ...M3.typography.labelSmall,
    color: M3.colors.onSurfaceVariant,
  },
  statusBadgeCompleted: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: M3.colors.successContainer,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: M3.shapes.full,
    gap: 4,
  },
  statusBadgeTextCompleted: {
    ...M3.typography.labelSmall,
    color: M3.colors.onSuccessContainer,
    fontWeight: '700',
  },
  statusBadgeReview: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: M3.colors.warningContainer,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: M3.shapes.full,
    gap: 4,
  },
  statusBadgeTextReview: {
    ...M3.typography.labelSmall,
    color: M3.colors.onWarningContainer,
    fontWeight: '700',
  },
  actionsCol: {
    flexDirection: 'column',
    gap: 6,
    justifyContent: 'center',
  },
  actionChip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: M3.shapes.full,
    gap: 4,
    minWidth: 80,
    justifyContent: 'center',
  },
  actionChipNeutral: {
    backgroundColor: M3.colors.surfaceContainerHigh,
  },
  actionChipCompletedActive: {
    backgroundColor: M3.colors.successContainer,
  },
  actionChipReviewActive: {
    backgroundColor: M3.colors.warningContainer,
  },
  actionChipText: {
    ...M3.typography.labelSmall,
    color: M3.colors.onSurfaceVariant,
  },
});
