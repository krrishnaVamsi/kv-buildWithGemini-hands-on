import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Modal,
  TextInput,
  Alert,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { StudyPlan, TopicStatus, StudyWeek, StudyDay } from '../types';
import { TopicItem } from '../components/TopicItem';
import { updateTopicStatusInPlan, addCustomTopicToDay } from '../storage/planStorage';
import { exportStudyPlanToExcel } from '../utils/excelExport';

interface PlanDetailScreenProps {
  plan: StudyPlan;
  onBack: () => void;
  onPlanUpdated: (updatedPlan: StudyPlan) => void;
}

export const PlanDetailScreen: React.FC<PlanDetailScreenProps> = ({
  plan,
  onBack,
  onPlanUpdated,
}) => {
  const [selectedWeekIndex, setSelectedWeekIndex] = useState(0);
  const [selectedDayIndex, setSelectedDayIndex] = useState(0);
  const [isExporting, setIsExporting] = useState(false);
  const [addTopicModalVisible, setAddTopicModalVisible] = useState(false);
  const [newTopicTitle, setNewTopicTitle] = useState('');
  const [newTopicSummary, setNewTopicSummary] = useState('');
  const [newTopicHours, setNewTopicHours] = useState('1');

  const currentWeek: StudyWeek | undefined = plan.weeks[selectedWeekIndex] || plan.weeks[0];
  const currentDay: StudyDay | undefined = currentWeek?.days[selectedDayIndex] || currentWeek?.days[0];

  const handleStatusChange = async (topicId: string, status: TopicStatus) => {
    const updated = await updateTopicStatusInPlan(plan.id, topicId, status);
    if (updated) {
      onPlanUpdated(updated);
    }
  };

  const handleExportExcel = async () => {
    setIsExporting(true);
    const result = await exportStudyPlanToExcel(plan);
    setIsExporting(false);
    if (Platform.OS === 'web') {
      window.alert(result.message);
    } else {
      Alert.alert(result.success ? 'Export Complete' : 'Export Failed', result.message);
    }
  };

  const handleAddCustomTopic = async () => {
    if (!newTopicTitle.trim()) {
      if (Platform.OS === 'web') {
        window.alert('Please enter a topic title');
      } else {
        Alert.alert('Missing Field', 'Please enter a topic title');
      }
      return;
    }

    if (!currentWeek || !currentDay) return;

    const updated = await addCustomTopicToDay(plan.id, currentWeek.id, currentDay.id, {
      title: newTopicTitle.trim(),
      summary: newTopicSummary.trim(),
      allocatedHours: parseFloat(newTopicHours) || 1,
    });

    if (updated) {
      onPlanUpdated(updated);
      setNewTopicTitle('');
      setNewTopicSummary('');
      setAddTopicModalVisible(false);
    }
  };

  return (
    <View style={styles.container}>
      {/* Top Header with Back gesture/button and Excel Export */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={onBack} hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
          <Ionicons name="arrow-back" size={24} color="#0F172A" />
        </TouchableOpacity>
        <View style={styles.headerTitleCol}>
          <Text style={styles.headerTitle} numberOfLines={1}>
            {plan.title}
          </Text>
          <Text style={styles.headerSubtitle}>
            {plan.streakWeeks}w streak • {plan.daysPerWeek} days/wk • {plan.hoursPerDay}h/day
          </Text>
        </View>
        <TouchableOpacity
          style={styles.exportBtn}
          onPress={handleExportExcel}
          disabled={isExporting}
        >
          <Ionicons name="download-outline" size={18} color="#FFFFFF" />
          <Text style={styles.exportBtnText}>{isExporting ? '...' : 'Excel'}</Text>
        </TouchableOpacity>
      </View>

      {/* Week Selector Ribbon */}
      <View style={styles.weekRibbonContainer}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.weekScrollContent}>
          {plan.weeks.map((week, idx) => {
            const isSelected = idx === selectedWeekIndex;
            return (
              <TouchableOpacity
                key={week.id}
                style={[styles.weekPill, isSelected && styles.weekPillActive]}
                onPress={() => {
                  setSelectedWeekIndex(idx);
                  setSelectedDayIndex(0);
                }}
              >
                <Text style={[styles.weekPillText, isSelected && styles.weekPillTextActive]}>
                  Week {week.weekNumber}
                </Text>
                {week.isCompleted && (
                  <Ionicons name="checkmark-circle" size={13} color={isSelected ? '#FFFFFF' : '#10B981'} />
                )}
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </View>

      {/* Week Theme & Context */}
      {currentWeek && (
        <View style={styles.themeBar}>
          <Ionicons name="bulb-outline" size={16} color="#4F46E5" />
          <Text style={styles.themeText} numberOfLines={1}>
            {currentWeek.theme}
          </Text>
        </View>
      )}

      {/* Day Selector Tabs */}
      <View style={styles.daySelectorRow}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.dayScrollContent}>
          {currentWeek?.days.map((day, dIdx) => {
            const isDaySelected = dIdx === selectedDayIndex;
            const completedCount = day.topics.filter((t) => t.status === 'completed').length;
            const totalCount = day.topics.length;
            const allDayDone = totalCount > 0 && completedCount === totalCount;

            return (
              <TouchableOpacity
                key={day.id}
                style={[styles.dayCard, isDaySelected && styles.dayCardActive]}
                onPress={() => setSelectedDayIndex(dIdx)}
              >
                <Text style={[styles.dayCardLabel, isDaySelected && styles.dayCardLabelActive]}>
                  Day {day.dayNumber}
                </Text>
                <Text style={[styles.dayCardDate, isDaySelected && styles.dayCardDateActive]}>
                  {day.dateStr.split('-').slice(1).join('/')}
                </Text>
                <View style={styles.dayStatusDotRow}>
                  {allDayDone ? (
                    <Ionicons name="checkmark" size={12} color={isDaySelected ? '#FFFFFF' : '#10B981'} />
                  ) : (
                    <Text style={[styles.dayTopicCount, isDaySelected && { color: '#FFFFFF' }]}>
                      {completedCount}/{totalCount}
                    </Text>
                  )}
                </View>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </View>

      {/* Topics List for Current Day */}
      <ScrollView style={styles.topicScrollView} contentContainerStyle={styles.topicScrollContent}>
        <View style={styles.sectionHeaderRow}>
          <Text style={styles.sectionHeading}>
            Day {currentDay?.dayNumber} Topics ({currentDay?.dateStr})
          </Text>
          <TouchableOpacity
            style={styles.addTopicInlineBtn}
            onPress={() => setAddTopicModalVisible(true)}
          >
            <Ionicons name="add-circle" size={16} color="#4F46E5" />
            <Text style={styles.addTopicInlineText}>Add Topic</Text>
          </TouchableOpacity>
        </View>

        {(!currentDay?.topics || currentDay.topics.length === 0) ? (
          <View style={styles.emptyTopicBox}>
            <Text style={styles.emptyTopicText}>No topics scheduled for this day.</Text>
            <TouchableOpacity
              style={styles.addFirstTopicBtn}
              onPress={() => setAddTopicModalVisible(true)}
            >
              <Text style={styles.addFirstTopicBtnText}>+ Add a topic</Text>
            </TouchableOpacity>
          </View>
        ) : (
          currentDay.topics.map((topic) => (
            <TopicItem
              key={topic.id}
              topic={topic}
              onStatusChange={(newStatus) => handleStatusChange(topic.id, newStatus)}
            />
          ))
        )}

        {/* Motivational meme quote banner */}
        <View style={styles.memeBox}>
          <Ionicons name="sparkles" size={18} color="#D97706" />
          <View style={styles.memeTextCol}>
            <Text style={styles.memeTelugu}>“చదువుకోండి ఫస్టు... మిగతావన్నీ తరువాత!”</Text>
            <Text style={styles.memeEnglish}>Finish today’s syllabus before checking social media.</Text>
          </View>
        </View>
      </ScrollView>

      {/* Add Custom Topic Modal */}
      <Modal visible={addTopicModalVisible} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Add Custom Topic</Text>
              <TouchableOpacity onPress={() => setAddTopicModalVisible(false)}>
                <Ionicons name="close" size={24} color="#64748B" />
              </TouchableOpacity>
            </View>

            <Text style={styles.inputLabel}>Topic Title *</Text>
            <TextInput
              style={styles.textInput}
              placeholder="e.g. Dynamic Programming Memoization"
              value={newTopicTitle}
              onChangeText={setNewTopicTitle}
            />

            <Text style={styles.inputLabel}>Summary / Notes (Optional)</Text>
            <TextInput
              style={[styles.textInput, { height: 70, textAlignVertical: 'top' }]}
              placeholder="Key concepts or links..."
              multiline
              value={newTopicSummary}
              onChangeText={setNewTopicSummary}
            />

            <Text style={styles.inputLabel}>Allocated Hours</Text>
            <TextInput
              style={styles.textInput}
              placeholder="1"
              keyboardType="numeric"
              value={newTopicHours}
              onChangeText={setNewTopicHours}
            />

            <View style={styles.modalActionRow}>
              <TouchableOpacity
                style={styles.modalCancelBtn}
                onPress={() => setAddTopicModalVisible(false)}
              >
                <Text style={styles.modalCancelText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.modalConfirmBtn}
                onPress={handleAddCustomTopic}
              >
                <Text style={styles.modalConfirmText}>Add to Schedule</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 14,
    paddingBottom: 14,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
    gap: 12,
  },
  backButton: {
    padding: 4,
  },
  headerTitleCol: {
    flex: 1,
  },
  headerTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: '#0F172A',
  },
  headerSubtitle: {
    fontSize: 12,
    color: '#64748B',
    marginTop: 2,
  },
  exportBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#059669',
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 8,
    gap: 4,
  },
  exportBtnText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '700',
  },
  weekRibbonContainer: {
    backgroundColor: '#FFFFFF',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  weekScrollContent: {
    paddingHorizontal: 16,
    gap: 8,
  },
  weekPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 20,
    backgroundColor: '#F1F5F9',
  },
  weekPillActive: {
    backgroundColor: '#4F46E5',
  },
  weekPillText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#475569',
  },
  weekPillTextActive: {
    color: '#FFFFFF',
  },
  themeBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#EEF2FF',
    paddingHorizontal: 16,
    paddingVertical: 8,
    gap: 8,
  },
  themeText: {
    fontSize: 12,
    color: '#4338CA',
    fontWeight: '600',
    flex: 1,
  },
  daySelectorRow: {
    backgroundColor: '#FFFFFF',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
  },
  dayScrollContent: {
    paddingHorizontal: 16,
    gap: 10,
  },
  dayCard: {
    width: 72,
    paddingVertical: 10,
    borderRadius: 12,
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    alignItems: 'center',
  },
  dayCardActive: {
    backgroundColor: '#4F46E5',
    borderColor: '#4F46E5',
  },
  dayCardLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: '#1E293B',
    marginBottom: 2,
  },
  dayCardLabelActive: {
    color: '#FFFFFF',
  },
  dayCardDate: {
    fontSize: 10,
    color: '#64748B',
    marginBottom: 6,
  },
  dayCardDateActive: {
    color: '#E0E7FF',
  },
  dayStatusDotRow: {
    marginTop: 2,
  },
  dayTopicCount: {
    fontSize: 10,
    fontWeight: '600',
    color: '#475569',
  },
  topicScrollView: {
    flex: 1,
  },
  topicScrollContent: {
    padding: 16,
  },
  sectionHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  sectionHeading: {
    fontSize: 15,
    fontWeight: '700',
    color: '#1E293B',
  },
  addTopicInlineBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  addTopicInlineText: {
    fontSize: 13,
    color: '#4F46E5',
    fontWeight: '600',
  },
  emptyTopicBox: {
    backgroundColor: '#FFFFFF',
    padding: 24,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  emptyTopicText: {
    color: '#64748B',
    fontSize: 14,
    marginBottom: 10,
  },
  addFirstTopicBtn: {
    backgroundColor: '#EEF2FF',
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: 8,
  },
  addFirstTopicBtnText: {
    color: '#4F46E5',
    fontWeight: '600',
    fontSize: 13,
  },
  memeBox: {
    flexDirection: 'row',
    backgroundColor: '#FEF3C7',
    borderRadius: 12,
    padding: 14,
    marginTop: 14,
    gap: 10,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#FDE68A',
  },
  memeTextCol: {
    flex: 1,
  },
  memeTelugu: {
    fontSize: 13,
    fontWeight: '700',
    color: '#92400E',
    marginBottom: 2,
  },
  memeEnglish: {
    fontSize: 11,
    color: '#B45309',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(15, 23, 42, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    width: '100%',
    maxWidth: 420,
    padding: 20,
    shadowColor: '#000',
    shadowOpacity: 0.15,
    shadowRadius: 10,
    elevation: 6,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#0F172A',
  },
  inputLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: '#334155',
    marginBottom: 6,
  },
  textInput: {
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#CBD5E1',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    fontSize: 14,
    color: '#0F172A',
    marginBottom: 14,
  },
  modalActionRow: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 10,
    marginTop: 8,
  },
  modalCancelBtn: {
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 8,
  },
  modalCancelText: {
    color: '#64748B',
    fontWeight: '600',
    fontSize: 14,
  },
  modalConfirmBtn: {
    backgroundColor: '#4F46E5',
    paddingVertical: 10,
    paddingHorizontal: 18,
    borderRadius: 8,
  },
  modalConfirmText: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 14,
  },
});
