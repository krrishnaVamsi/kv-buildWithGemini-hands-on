import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { StudyTopic, TopicStatus } from '../types';

interface TopicItemProps {
  topic: StudyTopic;
  onStatusChange: (status: TopicStatus) => void;
}

export const TopicItem: React.FC<TopicItemProps> = ({ topic, onStatusChange }) => {
  const isCompleted = topic.status === 'completed';
  const isReviewLater = topic.status === 'review_later';

  return (
    <View style={[styles.container, isCompleted && styles.completedCard, isReviewLater && styles.reviewCard]}>
      <View style={styles.contentCol}>
        <View style={styles.titleRow}>
          <Text style={[styles.title, isCompleted && styles.completedTitle]}>
            {topic.title}
          </Text>
        </View>
        {topic.summary ? (
          <Text style={[styles.summary, isCompleted && styles.completedSummary]} numberOfLines={2}>
            {topic.summary}
          </Text>
        ) : null}
        <View style={styles.metaRow}>
          <View style={styles.hourChip}>
            <Ionicons name="time-outline" size={13} color="#64748B" />
            <Text style={styles.hourText}>{topic.allocatedHours}h</Text>
          </View>
          {isCompleted && (
            <View style={styles.statusBadgeCompleted}>
              <Text style={styles.statusBadgeTextCompleted}>Completed</Text>
            </View>
          )}
          {isReviewLater && (
            <View style={styles.statusBadgeReview}>
              <Text style={styles.statusBadgeTextReview}>Review Later</Text>
            </View>
          )}
        </View>
      </View>

      {/* Action buttons */}
      <View style={styles.actionsCol}>
        <TouchableOpacity
          style={[styles.actionBtn, isCompleted ? styles.btnSuccessActive : styles.btnSuccess]}
          onPress={() => onStatusChange(isCompleted ? 'pending' : 'completed')}
          hitSlop={{ top: 5, bottom: 5, left: 5, right: 5 }}
        >
          <Ionicons
            name={isCompleted ? 'checkmark-circle' : 'checkmark-circle-outline'}
            size={22}
            color={isCompleted ? '#10B981' : '#64748B'}
          />
          <Text style={[styles.btnText, isCompleted && { color: '#10B981', fontWeight: '700' }]}>
            {isCompleted ? 'Done' : 'Complete'}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.actionBtn, isReviewLater ? styles.btnReviewActive : styles.btnReview]}
          onPress={() => onStatusChange(isReviewLater ? 'pending' : 'review_later')}
          hitSlop={{ top: 5, bottom: 5, left: 5, right: 5 }}
        >
          <Ionicons
            name={isReviewLater ? 'bookmark' : 'bookmark-outline'}
            size={20}
            color={isReviewLater ? '#F59E0B' : '#64748B'}
          />
          <Text style={[styles.btnText, isReviewLater && { color: '#F59E0B', fontWeight: '700' }]}>
            Review
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 12,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  completedCard: {
    backgroundColor: '#F0FDF4',
    borderColor: '#BBF7D0',
  },
  reviewCard: {
    backgroundColor: '#FFFBEB',
    borderColor: '#FDE68A',
  },
  contentCol: {
    flex: 1,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  title: {
    fontSize: 15,
    fontWeight: '600',
    color: '#1E293B',
    flexShrink: 1,
  },
  completedTitle: {
    color: '#15803D',
    textDecorationLine: 'line-through',
  },
  summary: {
    fontSize: 12,
    color: '#64748B',
    marginBottom: 6,
    lineHeight: 16,
  },
  completedSummary: {
    color: '#86EFAC',
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  hourChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    backgroundColor: '#F1F5F9',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
  },
  hourText: {
    fontSize: 11,
    color: '#475569',
    fontWeight: '500',
  },
  statusBadgeCompleted: {
    backgroundColor: '#DCFCE7',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
  },
  statusBadgeTextCompleted: {
    fontSize: 10,
    fontWeight: '700',
    color: '#15803D',
  },
  statusBadgeReview: {
    backgroundColor: '#FEF3C7',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
  },
  statusBadgeTextReview: {
    fontSize: 10,
    fontWeight: '700',
    color: '#B45309',
  },
  actionsCol: {
    flexDirection: 'column',
    gap: 6,
    alignItems: 'center',
  },
  actionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingVertical: 5,
    paddingHorizontal: 8,
    borderRadius: 8,
    backgroundColor: '#F8FAFC',
    minWidth: 86,
    justifyContent: 'center',
  },
  btnSuccess: {
    borderColor: '#E2E8F0',
    borderWidth: 1,
  },
  btnSuccessActive: {
    backgroundColor: '#DCFCE7',
  },
  btnReview: {
    borderColor: '#E2E8F0',
    borderWidth: 1,
  },
  btnReviewActive: {
    backgroundColor: '#FEF3C7',
  },
  btnText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#475569',
  },
});
