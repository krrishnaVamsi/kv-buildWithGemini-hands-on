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
import { useTheme } from '../theme/ThemeContext';

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
  const { isDark, theme } = useTheme();
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
    <View style={[styles.container, { backgroundColor: theme.colors.surface }]}>
      {/* Top App Bar */}
      <View
        style={[
          styles.topAppBar,
          {
            backgroundColor: theme.colors.cardBg,
            borderBottomColor: theme.colors.cardBorder,
          },
        ]}
      >
        <TouchableOpacity
          style={[styles.iconButton, { backgroundColor: theme.colors.subtleBg }]}
          onPress={onBack}
          activeOpacity={0.7}
        >
          <Ionicons name="arrow-back" size={22} color={theme.colors.onSurface} />
        </TouchableOpacity>

        <View style={styles.titleCol}>
          <Text style={[styles.planTitle, { color: theme.colors.onSurface }]} numberOfLines={1}>
            {plan.title}
          </Text>
          <Text style={[styles.planSubtitle, { color: theme.colors.onSurfaceVariant }]}>
            The Roadmap ⚡️
          </Text>
        </View>

        {/* Export Excel Button */}
        <TouchableOpacity
          style={[
            styles.exportPillButton,
            { backgroundColor: theme.colors.primaryContainer },
          ]}
          onPress={handleExportExcel}
          disabled={isExporting}
          activeOpacity={0.8}
        >
          <Ionicons name="download-outline" size={15} color={theme.colors.primary} />
          <Text
            style={[
              styles.exportPillText,
              { color: theme.colors.onPrimaryContainer },
            ]}
          >
            {isExporting ? 'Exporting...' : 'Excel'}
          </Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.scrollArea} contentContainerStyle={styles.scrollContent}>
        {/* Summary Overview Card */}
        <View
          style={[
            styles.overviewCard,
            {
              backgroundColor: theme.colors.cardBg,
              borderColor: theme.colors.cardBorder,
            },
          ]}
        >
          <View style={styles.overviewRow}>
            <View style={styles.overviewStat}>
              <Text style={[styles.overviewStatValue, { color: theme.colors.primary }]}>
                {plan.streakWeeks}w
              </Text>
              <Text style={[styles.overviewStatLabel, { color: theme.colors.onSurfaceVariant }]}>
                Week Streak 🔥
              </Text>
            </View>
            <View style={[styles.overviewDivider, { backgroundColor: theme.colors.cardBorder }]} />
            <View style={styles.overviewStat}>
              <Text style={[styles.overviewStatValue, { color: theme.colors.secondary }]}>
                {plan.streakDays}
              </Text>
              <Text style={[styles.overviewStatLabel, { color: theme.colors.onSurfaceVariant }]}>
                Topics Cleared 🎯
              </Text>
            </View>
            <View style={[styles.overviewDivider, { backgroundColor: theme.colors.cardBorder }]} />
            <View style={styles.overviewStat}>
              <Text style={[styles.overviewStatValue, { color: theme.colors.tertiary }]}>
                {plan.badges ? plan.badges.length : 0}
              </Text>
              <Text style={[styles.overviewStatLabel, { color: theme.colors.onSurfaceVariant }]}>
                Milestones 🏆
              </Text>
            </View>
          </View>
        </View>

        {/* Week Segmented Pill Carousel */}
        <View style={styles.sectionHeadingRow}>
          <Text style={[styles.sectionHeading, { color: theme.colors.onSurface }]}>
            Weeks Roadmap
          </Text>
          <Text style={[styles.sectionSub, { color: theme.colors.onSurfaceVariant }]}>
            Week {selectedWeekIndex + 1} of {plan.weeks.length}
          </Text>
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
                style={[
                  styles.weekPill,
                  {
                    backgroundColor: isSelected ? theme.colors.primary : theme.colors.cardBg,
                    borderColor: isSelected ? theme.colors.primary : theme.colors.cardBorder,
                  },
                ]}
                onPress={() => {
                  setSelectedWeekIndex(idx);
                  setSelectedDayIndex(0);
                }}
                activeOpacity={0.8}
              >
                <Text
                  style={[
                    styles.weekPillText,
                    {
                      color: isSelected ? theme.colors.onPrimary : theme.colors.onSurfaceVariant,
                      fontWeight: isSelected ? '700' : '500',
                    },
                  ]}
                >
                  Week {w.weekNumber}
                </Text>
                {w.isCompleted && (
                  <Ionicons
                    name="checkmark-circle"
                    size={14}
                    color={isSelected ? theme.colors.onPrimary : theme.colors.success}
                  />
                )}
              </TouchableOpacity>
            );
          })}
        </ScrollView>

        {/* Week Theme Banner */}
        {currentWeek && (
          <View
            style={[
              styles.themeBanner,
              {
                backgroundColor: theme.colors.primaryContainer,
                borderLeftColor: theme.colors.primary,
              },
            ]}
          >
            <View style={styles.themeTag}>
              <Text style={[styles.themeTagText, { color: theme.colors.primary }]}>
                FOCUS THEME ✨
              </Text>
            </View>
            <Text style={[styles.themeTitle, { color: theme.colors.onPrimaryContainer }]}>
              {currentWeek.theme}
            </Text>
          </View>
        )}

        {/* Day Selector Ribbon */}
        <View style={styles.sectionHeadingRow}>
          <Text style={[styles.sectionHeading, { color: theme.colors.onSurface }]}>
            Daily Sessions
          </Text>
          <Text style={[styles.sectionSub, { color: theme.colors.onSurfaceVariant }]}>
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
                style={[
                  styles.dayTab,
                  {
                    backgroundColor: isDaySelected ? theme.colors.primary : theme.colors.cardBg,
                    borderColor: isDaySelected ? theme.colors.primary : theme.colors.cardBorder,
                  },
                ]}
                onPress={() => setSelectedDayIndex(dIdx)}
                activeOpacity={0.8}
              >
                <Text
                  style={[
                    styles.dayTabTitle,
                    {
                      color: isDaySelected ? theme.colors.onPrimary : theme.colors.onSurface,
                    },
                  ]}
                >
                  Day {d.dayNumber}
                </Text>
                <Text
                  style={[
                    styles.dayTabDate,
                    {
                      color: isDaySelected
                        ? isDark ? '#1E1B4B' : '#C7D2FE'
                        : theme.colors.onSurfaceVariant,
                    },
                  ]}
                >
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
          <Text style={[styles.topicSectionTitle, { color: theme.colors.onSurface }]}>
            Today's Quests ({dayTopics.length})
          </Text>

          <TouchableOpacity
            style={[
              styles.addCustomTopicChip,
              { backgroundColor: theme.colors.primaryContainer },
            ]}
            onPress={() => setAddTopicModalVisible(true)}
            activeOpacity={0.8}
          >
            <Ionicons name="add" size={16} color={theme.colors.primary} />
            <Text
              style={[
                styles.addCustomTopicText,
                { color: theme.colors.onPrimaryContainer },
              ]}
            >
              Add Quest
            </Text>
          </TouchableOpacity>
        </View>

        {/* Topics List */}
        {dayTopics.length === 0 ? (
          <View
            style={[
              styles.emptyDayBox,
              {
                backgroundColor: theme.colors.cardBg,
                borderColor: theme.colors.cardBorder,
              },
            ]}
          >
            <Text style={styles.emptyDayEmoji}>🏖️</Text>
            <Text style={[styles.emptyDayText, { color: theme.colors.onSurfaceVariant }]}>
              Rest day or no topics scheduled!
            </Text>
            <TouchableOpacity
              style={[styles.addTopicQuickBtn, { backgroundColor: theme.colors.primary }]}
              onPress={() => setAddTopicModalVisible(true)}
            >
              <Text
                style={[styles.addTopicQuickBtnText, { color: theme.colors.onPrimary }]}
              >
                + Add Custom Topic
              </Text>
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
          <View
            style={[
              styles.dialogCard,
              {
                backgroundColor: theme.colors.cardBg,
                borderColor: theme.colors.cardBorder,
              },
            ]}
          >
            <View style={styles.modalHeader}>
              <View
                style={[
                  styles.modalHeaderIcon,
                  { backgroundColor: theme.colors.primaryContainer },
                ]}
              >
                <Ionicons name="sparkles" size={18} color={theme.colors.primary} />
              </View>
              <Text style={[styles.modalTitle, { color: theme.colors.onSurface }]}>
                Add Custom Quest
              </Text>
            </View>

            <Text style={[styles.modalSubtitle, { color: theme.colors.onSurfaceVariant }]}>
              Adding to Week {selectedWeekIndex + 1}, Day {selectedDayIndex + 1}
            </Text>

            <View style={styles.formGroup}>
              <Text style={[styles.inputLabel, { color: theme.colors.onSurfaceVariant }]}>
                Topic Title *
              </Text>
              <TextInput
                style={[
                  styles.dialogInput,
                  {
                    backgroundColor: theme.colors.subtleBg,
                    borderColor: theme.colors.cardBorder,
                    color: theme.colors.onSurface,
                  },
                ]}
                placeholder="e.g. Master React Hooks & Memo"
                placeholderTextColor={theme.colors.onSurfaceVariant}
                value={newTopicTitle}
                onChangeText={setNewTopicTitle}
              />
            </View>

            <View style={styles.formGroup}>
              <Text style={[styles.inputLabel, { color: theme.colors.onSurfaceVariant }]}>
                Key Notes / Resources (Optional)
              </Text>
              <TextInput
                style={[
                  styles.dialogInput,
                  styles.dialogInputMulti,
                  {
                    backgroundColor: theme.colors.subtleBg,
                    borderColor: theme.colors.cardBorder,
                    color: theme.colors.onSurface,
                  },
                ]}
                placeholder="e.g. Watch Dave Gray tutorial & build counter demo"
                placeholderTextColor={theme.colors.onSurfaceVariant}
                multiline
                numberOfLines={3}
                value={newTopicSummary}
                onChangeText={setNewTopicSummary}
              />
            </View>

            <View style={styles.formGroup}>
              <Text style={[styles.inputLabel, { color: theme.colors.onSurfaceVariant }]}>
                Estimated Hours
              </Text>
              <TextInput
                style={[
                  styles.dialogInput,
                  {
                    backgroundColor: theme.colors.subtleBg,
                    borderColor: theme.colors.cardBorder,
                    color: theme.colors.onSurface,
                  },
                ]}
                placeholder="1.5"
                placeholderTextColor={theme.colors.onSurfaceVariant}
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
                <Text style={[styles.dialogTextButtonLabel, { color: theme.colors.onSurfaceVariant }]}>
                  Cancel
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  styles.dialogFilledButton,
                  { backgroundColor: theme.colors.primary },
                ]}
                onPress={handleAddCustomTopic}
              >
                <Text style={[styles.dialogFilledButtonLabel, { color: theme.colors.onPrimary }]}>
                  Add Quest ⚡️
                </Text>
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
  },
  topAppBar: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 18,
    paddingTop: 14,
    paddingBottom: 14,
    borderBottomWidth: 1,
    gap: 12,
  },
  iconButton: {
    width: 38,
    height: 38,
    borderRadius: 9999,
    justifyContent: 'center',
    alignItems: 'center',
  },
  titleCol: {
    flex: 1,
  },
  planTitle: {
    fontSize: 16,
    fontWeight: '700',
  },
  planSubtitle: {
    fontSize: 12,
  },
  exportPillButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 9999,
    gap: 5,
  },
  exportPillText: {
    fontSize: 12,
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
    borderRadius: 22,
    padding: 18,
    marginBottom: 20,
    borderWidth: 1,
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
    fontSize: 24,
    fontWeight: '700',
  },
  overviewStatLabel: {
    fontSize: 11,
    marginTop: 2,
    fontWeight: '600',
  },
  overviewDivider: {
    width: 1,
    height: 34,
  },
  sectionHeadingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  sectionHeading: {
    fontSize: 16,
    fontWeight: '600',
  },
  sectionSub: {
    fontSize: 12,
  },
  weeksCarousel: {
    gap: 8,
    paddingBottom: 16,
  },
  weekPill: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 9,
    borderRadius: 9999,
    borderWidth: 1,
    gap: 6,
  },
  weekPillText: {
    fontSize: 13,
  },
  themeBanner: {
    borderRadius: 16,
    padding: 14,
    marginBottom: 20,
    borderLeftWidth: 3,
  },
  themeTag: {
    marginBottom: 4,
  },
  themeTagText: {
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 0.8,
  },
  themeTitle: {
    fontSize: 14,
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
    alignItems: 'center',
    borderWidth: 1,
  },
  dayTabTitle: {
    fontSize: 13,
    fontWeight: '600',
  },
  dayTabDate: {
    fontSize: 10,
    marginTop: 2,
    fontWeight: '600',
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
    fontSize: 16,
    fontWeight: '600',
  },
  addCustomTopicChip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 9999,
    gap: 4,
  },
  addCustomTopicText: {
    fontSize: 12,
    fontWeight: '600',
  },
  emptyDayBox: {
    borderRadius: 18,
    padding: 28,
    alignItems: 'center',
    marginTop: 8,
    borderWidth: 1,
  },
  emptyDayEmoji: {
    fontSize: 32,
    marginBottom: 8,
  },
  emptyDayText: {
    fontSize: 14,
    marginBottom: 12,
  },
  addTopicQuickBtn: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 9999,
  },
  addTopicQuickBtnText: {
    fontSize: 13,
    fontWeight: '600',
  },
  modalBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.65)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  dialogCard: {
    width: '100%',
    maxWidth: 480,
    borderRadius: 24,
    padding: 24,
    borderWidth: 1,
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
    borderRadius: 9999,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '700',
  },
  modalSubtitle: {
    fontSize: 12,
    marginBottom: 18,
  },
  formGroup: {
    marginBottom: 14,
  },
  inputLabel: {
    fontSize: 11,
    fontWeight: '600',
    marginBottom: 6,
  },
  dialogInput: {
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 10,
    fontSize: 14,
    borderWidth: 1,
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
    fontSize: 14,
    fontWeight: '600',
  },
  dialogFilledButton: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 9999,
  },
  dialogFilledButtonLabel: {
    fontSize: 14,
    fontWeight: '700',
  },
});
