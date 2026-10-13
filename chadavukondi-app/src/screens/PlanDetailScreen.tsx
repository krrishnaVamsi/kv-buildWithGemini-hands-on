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
import { M3 } from '../theme/material3';

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
        Alert.alert('Required', 'Please enter a topic title');
      }
      return;
    }

    if (!currentWeek || !currentDay) return;

    const hours = parseFloat(newTopicHours) || 1;
    const updated = await addCustomTopicToDay(
      plan.id,
      currentWeek.id,
      currentDay.id,
      {
        title: newTopicTitle.trim(),
        summary: newTopicSummary.trim(),
        allocatedHours: hours,
      }
    );

    if (updated) {
      onPlanUpdated(updated);
      setNewTopicTitle('');
      setNewTopicSummary('');
      setNewTopicHours('1');
      setAddTopicModalVisible(false);
    }
  };

  // Compute metrics for the current day
  const dayTopics = currentDay?.topics || [];
  const completedDayTopics = dayTopics.filter((t) => t.status === 'completed').length;
  const dayProgress = dayTopics.length > 0 ? Math.round((completedDayTopics / dayTopics.length) * 100) : 0;

  return (
    <View style={styles.container}>
      {/* Top App Bar */}
      <View style={styles.topAppBar}>
        <TouchableOpacity style={styles.iconButton} onPress={onBack} activeOpacity={0.7}>
          <Ionicons name="arrow-back" size={22} color="#0F172A" />
        </TouchableOpacity>

        <View style={styles.titleCol}>
          <Text style={styles.planTitle} numberOfLines={1}>
            {plan.title}
          </Text>
          <Text style={styles.planSubtitle}>Study Roadmap & Schedule ⚡️</Text>
        </View>

        {/* Export Excel Button */}
        <TouchableOpacity
          style={styles.exportPillButton}
          onPress={handleExportExcel}
          disabled={isExporting}
          activeOpacity={0.8}
        >
          <Ionicons name="download-outline" size={15} color={M3.colors.primary} />
          <Text style={styles.exportPillText}>
            {isExporting ? 'Exporting...' : 'Excel'}
          </Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.scrollArea} contentContainerStyle={styles.scrollContent}>
        {/* Summary Overview Card */}
        <View style={styles.overviewCard}>
          <View style={styles.overviewRow}>
            <View style={styles.overviewStat}>
              <Text style={styles.overviewStatValue}>{plan.streakWeeks}w</Text>
              <Text style={styles.overviewStatLabel}>Week Streak 🔥</Text>
            </View>
            <View style={styles.overviewDivider} />
            <View style={styles.overviewStat}>
              <Text style={styles.overviewStatValue}>{plan.streakDays}</Text>
              <Text style={styles.overviewStatLabel}>Topics Cleared 🎯</Text>
            </View>
            <View style={styles.overviewDivider} />
            <View style={styles.overviewStat}>
              <Text style={styles.overviewStatValue}>{plan.badges ? plan.badges.length : 0}</Text>
              <Text style={styles.overviewStatLabel}>Meme Badges 🏆</Text>
            </View>
          </View>
        </View>

        {/* Week Segmented Pill Carousel */}
        <View style={styles.sectionHeadingRow}>
          <Text style={styles.sectionHeading}>Weeks Roadmap</Text>
          <Text style={styles.sectionSub}>Week {selectedWeekIndex + 1} of {plan.weeks.length}</Text>
        </View>

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.weeksCarousel}
        >
          {plan.weeks.map((w, idx) => {
            const isSelected = idx === selectedWeekIndex;
            return (
              <TouchableOpacity
                key={w.weekNumber}
                style={[styles.weekPill, isSelected && styles.weekPillActive]}
                onPress={() => {
                  setSelectedWeekIndex(idx);
                  setSelectedDayIndex(0);
                }}
                activeOpacity={0.8}
              >
                <Text style={[styles.weekPillText, isSelected && styles.weekPillTextActive]}>
                  Week {w.weekNumber}
                </Text>
                {w.isCompleted && (
                  <Ionicons name="checkmark-circle" size={14} color={isSelected ? '#FFFFFF' : M3.colors.success} />
                )}
              </TouchableOpacity>
            );
          })}
        </ScrollView>

        {/* Week Theme Banner */}
        {currentWeek && (
          <View style={styles.themeBanner}>
            <View style={styles.themeTag}>
              <Text style={styles.themeTagText}>FOCUS THEME ✨</Text>
            </View>
            <Text style={styles.themeTitle}>{currentWeek.theme}</Text>
          </View>
        )}

        {/* Day Selector Ribbon */}
        <View style={styles.sectionHeadingRow}>
          <Text style={styles.sectionHeading}>Daily Sessions</Text>
          <Text style={styles.sectionSub}>
            {completedDayTopics}/{dayTopics.length} Cleared ({dayProgress}%)
          </Text>
        </View>

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.daysCarousel}
        >
          {currentWeek?.days.map((d, dIdx) => {
            const isDaySelected = dIdx === selectedDayIndex;
            const completedCount = d.topics.filter((t) => t.status === 'completed').length;
            const isAllDone = d.topics.length > 0 && completedCount === d.topics.length;

            return (
              <TouchableOpacity
                key={d.dayNumber}
                style={[styles.dayTab, isDaySelected && styles.dayTabActive]}
                onPress={() => setSelectedDayIndex(dIdx)}
                activeOpacity={0.8}
              >
                <Text style={[styles.dayTabTitle, isDaySelected && styles.dayTabTitleActive]}>
                  Day {d.dayNumber}
                </Text>
                <Text style={[styles.dayTabDate, isDaySelected && styles.dayTabDateActive]}>
                  {d.dateStr ? d.dateStr.split('-').slice(1).join('/') : `D${d.dayNumber}`}
                </Text>
                {isAllDone && (
                  <View style={styles.dayDoneBadge}>
                    <Ionicons name="checkmark" size={10} color="#FFFFFF" />
                  </View>
                )}
              </TouchableOpacity>
            );
          })}
        </ScrollView>

        {/* Topics List Header & Add Custom Topic Button */}
        <View style={styles.topicHeaderRow}>
          <Text style={styles.topicSectionTitle}>
            Today's Quests ({dayTopics.length})
          </Text>

          <TouchableOpacity
            style={styles.addCustomTopicChip}
            onPress={() => setAddTopicModalVisible(true)}
            activeOpacity={0.8}
          >
            <Ionicons name="add" size={16} color={M3.colors.primary} />
            <Text style={styles.addCustomTopicText}>Add Quest</Text>
          </TouchableOpacity>
        </View>

        {/* Topics List */}
        {dayTopics.length === 0 ? (
          <View style={styles.emptyDayBox}>
            <Text style={styles.emptyDayEmoji}>🏖️</Text>
            <Text style={styles.emptyDayText}>Rest day or no topics scheduled!</Text>
            <TouchableOpacity
              style={styles.addTopicQuickBtn}
              onPress={() => setAddTopicModalVisible(true)}
            >
              <Text style={styles.addTopicQuickBtnText}>+ Add Custom Topic</Text>
            </TouchableOpacity>
          </View>
        ) : (
          dayTopics.map((topic) => (
            <TopicItem
              key={topic.id}
              topic={topic}
              onStatusChange={(status) => handleStatusChange(topic.id, status)}
            />
          ))
        )}
      </ScrollView>

      {/* Add Custom Topic Dialog Modal */}
      <Modal
        visible={addTopicModalVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setAddTopicModalVisible(false)}
      >
        <View style={styles.modalBackdrop}>
          <View style={styles.dialogCard}>
            <View style={styles.modalHeader}>
              <View style={styles.modalHeaderIcon}>
                <Ionicons name="sparkles" size={18} color={M3.colors.primary} />
              </View>
              <Text style={styles.modalTitle}>Add Custom Quest</Text>
            </View>

            <Text style={styles.modalSubtitle}>
              Adding to Week {selectedWeekIndex + 1}, Day {selectedDayIndex + 1}
            </Text>

            <View style={styles.formGroup}>
              <Text style={styles.inputLabel}>Topic Title *</Text>
              <TextInput
                style={styles.dialogInput}
                placeholder="e.g. Master React Hooks & Memo"
                placeholderTextColor="#94A3B8"
                value={newTopicTitle}
                onChangeText={setNewTopicTitle}
              />
            </View>

            <View style={styles.formGroup}>
              <Text style={styles.inputLabel}>Key Notes / Resources (Optional)</Text>
              <TextInput
                style={[styles.dialogInput, styles.dialogInputMulti]}
                placeholder="e.g. Watch Dave Gray tutorial & build counter demo"
                placeholderTextColor="#94A3B8"
                multiline
                numberOfLines={3}
                value={newTopicSummary}
                onChangeText={setNewTopicSummary}
              />
            </View>

            <View style={styles.formGroup}>
              <Text style={styles.inputLabel}>Estimated Hours</Text>
              <TextInput
                style={styles.dialogInput}
                placeholder="1.5"
                placeholderTextColor="#94A3B8"
                keyboardType="numeric"
                value={newTopicHours}
                onChangeText={setNewTopicHours}
              />
            </View>

            {/* Dialog Actions */}
            <View style={styles.modalActions}>
              <TouchableOpacity
                style={styles.dialogTextButton}
                onPress={() => setAddTopicModalVisible(false)}
              >
                <Text style={styles.dialogTextButtonLabel}>Cancel</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.dialogFilledButton}
                onPress={handleAddCustomTopic}
              >
                <Text style={styles.dialogFilledButtonLabel}>Add Quest ⚡️</Text>
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
  topAppBar: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 18,
    paddingTop: 14,
    paddingBottom: 14,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
    gap: 12,
  },
  iconButton: {
    width: 38,
    height: 38,
    borderRadius: M3.shapes.full,
    backgroundColor: '#F1F5F9',
    justifyContent: 'center',
    alignItems: 'center',
  },
  titleCol: {
    flex: 1,
  },
  planTitle: {
    ...M3.typography.titleMedium,
    color: '#0F172A',
    fontWeight: '700',
  },
  planSubtitle: {
    ...M3.typography.bodySmall,
    color: '#64748B',
  },
  exportPillButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: M3.colors.primaryContainer,
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: M3.shapes.full,
    gap: 5,
  },
  exportPillText: {
    ...M3.typography.labelSmall,
    color: M3.colors.primaryDark,
    fontWeight: '700',
  },
  scrollArea: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 40,
  },
  overviewCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 22,
    padding: 18,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    ...M3.elevation.level1,
  },
  overviewRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  overviewStat: {
    alignItems: 'center',
  },
  overviewStatValue: {
    ...M3.typography.headlineMedium,
    color: M3.colors.primary,
  },
  overviewStatLabel: {
    ...M3.typography.labelSmall,
    color: '#64748B',
    marginTop: 2,
  },
  overviewDivider: {
    width: 1,
    height: 34,
    backgroundColor: '#E2E8F0',
  },
  sectionHeadingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  sectionHeading: {
    ...M3.typography.titleMedium,
    color: '#0F172A',
  },
  sectionSub: {
    ...M3.typography.labelSmall,
    color: '#64748B',
  },
  weeksCarousel: {
    gap: 8,
    paddingBottom: 16,
  },
  weekPill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 16,
    paddingVertical: 9,
    borderRadius: M3.shapes.full,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    gap: 6,
    ...M3.elevation.level1,
  },
  weekPillActive: {
    backgroundColor: M3.colors.primary,
    borderColor: M3.colors.primary,
  },
  weekPillText: {
    ...M3.typography.labelMedium,
    color: '#475569',
  },
  weekPillTextActive: {
    color: '#FFFFFF',
    fontWeight: '700',
  },
  themeBanner: {
    backgroundColor: '#EEF2FF',
    borderRadius: 16,
    padding: 14,
    marginBottom: 20,
    borderLeftWidth: 3,
    borderLeftColor: M3.colors.primary,
  },
  themeTag: {
    marginBottom: 4,
  },
  themeTagText: {
    fontSize: 10,
    fontWeight: '800',
    color: M3.colors.primary,
    letterSpacing: 0.8,
  },
  themeTitle: {
    ...M3.typography.bodyMedium,
    color: '#312E81',
    fontWeight: '700',
  },
  daysCarousel: {
    gap: 10,
    paddingBottom: 20,
  },
  dayTab: {
    width: 74,
    paddingVertical: 10,
    borderRadius: 16,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    ...M3.elevation.level1,
  },
  dayTabActive: {
    backgroundColor: M3.colors.primary,
    borderColor: M3.colors.primary,
    ...M3.elevation.level2,
  },
  dayTabTitle: {
    ...M3.typography.labelMedium,
    color: '#0F172A',
  },
  dayTabTitleActive: {
    color: '#FFFFFF',
  },
  dayTabDate: {
    fontSize: 10,
    color: '#64748B',
    marginTop: 2,
    fontWeight: '600',
  },
  dayTabDateActive: {
    color: '#C7D2FE',
  },
  dayDoneBadge: {
    position: 'absolute',
    top: -4,
    right: -4,
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: '#10B981',
    justifyContent: 'center',
    alignItems: 'center',
  },
  topicHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  topicSectionTitle: {
    ...M3.typography.titleMedium,
    color: '#0F172A',
  },
  addCustomTopicChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: M3.colors.primaryContainer,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: M3.shapes.full,
    gap: 4,
  },
  addCustomTopicText: {
    ...M3.typography.labelMedium,
    color: M3.colors.primaryDark,
  },
  emptyDayBox: {
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    padding: 28,
    alignItems: 'center',
    marginTop: 8,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  emptyDayEmoji: {
    fontSize: 32,
    marginBottom: 8,
  },
  emptyDayText: {
    ...M3.typography.bodyMedium,
    color: '#64748B',
    marginBottom: 12,
  },
  addTopicQuickBtn: {
    backgroundColor: M3.colors.primary,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: M3.shapes.full,
  },
  addTopicQuickBtnText: {
    ...M3.typography.labelMedium,
    color: '#FFFFFF',
  },
  modalBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(15, 23, 42, 0.55)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  dialogCard: {
    width: '100%',
    maxWidth: 480,
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    padding: 24,
    ...M3.elevation.level3,
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 4,
  },
  modalHeaderIcon: {
    width: 34,
    height: 34,
    borderRadius: M3.shapes.full,
    backgroundColor: M3.colors.primaryContainer,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalTitle: {
    ...M3.typography.titleLarge,
    color: '#0F172A',
  },
  modalSubtitle: {
    ...M3.typography.bodySmall,
    color: '#64748B',
    marginBottom: 18,
  },
  formGroup: {
    marginBottom: 14,
  },
  inputLabel: {
    ...M3.typography.labelSmall,
    color: '#475569',
    marginBottom: 6,
  },
  dialogInput: {
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 10,
    fontSize: 14,
    color: '#0F172A',
    fontFamily: M3.fonts.body,
  },
  dialogInputMulti: {
    height: 70,
    textAlignVertical: 'top',
  },
  modalActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 12,
    marginTop: 18,
  },
  dialogTextButton: {
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
  dialogTextButtonLabel: {
    ...M3.typography.labelLarge,
    color: '#64748B',
  },
  dialogFilledButton: {
    backgroundColor: M3.colors.primary,
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: M3.shapes.full,
    ...M3.elevation.level1,
  },
  dialogFilledButtonLabel: {
    ...M3.typography.labelLarge,
    color: '#FFFFFF',
  },
});
