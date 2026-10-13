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
            <Ionicons name="time-outline" size={13} color="#64748B" />
            <Text style={styles.hourText}>{topic.allocatedHours} hrs</Text>
          </View>

          {isCompleted && (
            <View style={styles.statusBadgeCompleted}>
              <Text style={styles.statusBadgeTextCompleted}>Crushed It! ⚡️</Text>
            </View>
          )}

          {isReviewLater && (
            <View style={styles.statusBadgeReview}>
              <Text style={styles.statusBadgeTextReview}>Saved for Review 🔖</Text>
            </View>
          )}
        </View>
      </View>

      {/* Action Chips */}
      <View style={styles.actionsCol}>
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
            size={16}
            color={isCompleted ? '#065F46' : '#64748B'}
          />
          <Text
            style={[
              styles.actionChipText,
              isCompleted && { color: '#065F46', fontWeight: '800' },
            ]}
          >
            {isCompleted ? 'Done' : 'Done'}
          </Text>
        </TouchableOpacity>

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
            size={16}
            color={isReviewLater ? '#92400E' : '#64748B'}
          />
          <Text
            style={[
              styles.actionChipText,
              isReviewLater && { color: '#92400E', fontWeight: '800' },
            ]}
          >
            {isReviewLater ? 'Saved' : 'Later'}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    ...M3.elevation.level1,
    alignItems: 'center',
  },
  completedContainer: {
    backgroundColor: '#F0FDF4',
    borderColor: '#BBF7D0',
  },
  reviewContainer: {
    backgroundColor: '#FFFBEB',
    borderColor: '#FDE68A',
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
    color: '#0F172A',
  },
  completedTitle: {
    color: '#15803D',
    textDecorationLine: 'line-through',
  },
  summary: {
    ...M3.typography.bodySmall,
    color: '#64748B',
    marginBottom: 8,
  },
  completedSummary: {
    color: '#86EFAC',
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
    backgroundColor: '#F1F5F9',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: M3.shapes.full,
    gap: 4,
  },
  hourText: {
    ...M3.typography.labelSmall,
    color: '#64748B',
  },
  statusBadgeCompleted: {
    backgroundColor: '#DCFCE7',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: M3.shapes.full,
  },
  statusBadgeTextCompleted: {
    ...M3.typography.labelSmall,
    color: '#15803D',
    fontWeight: '800',
  },
  statusBadgeReview: {
    backgroundColor: '#FEF3C7',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: M3.shapes.full,
  },
  statusBadgeTextReview: {
    ...M3.typography.labelSmall,
    color: '#B45309',
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
    borderRadius: M3.shapes.full,
    gap: 4,
    minWidth: 76,
    justifyContent: 'center',
  },
  actionChipNeutral: {
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  actionChipCompletedActive: {
    backgroundColor: '#DCFCE7',
    borderWidth: 1,
    borderColor: '#86EFAC',
  },
  actionChipReviewActive: {
    backgroundColor: '#FEF3C7',
    borderWidth: 1,
    borderColor: '#FCD34D',
  },
  actionChipText: {
    ...M3.typography.labelSmall,
    color: '#475569',
  },
});
