import * as XLSX from 'xlsx';
import { Platform } from 'react-native';
import * as FileSystem from 'expo-file-system/legacy';
import * as Sharing from 'expo-sharing';
import { StudyPlan } from '../types';

export async function exportStudyPlanToExcel(plan: StudyPlan): Promise<{ success: boolean; message: string }> {
  try {
    const rows: Array<Record<string, any>> = [];

    plan.weeks.forEach((week) => {
      week.days.forEach((day) => {
        day.topics.forEach((topic) => {
          rows.push({
            'Week #': `Week ${week.weekNumber}`,
            'Week Theme': week.theme,
            'Day #': `Day ${day.dayNumber}`,
            'Date': day.dateStr,
            'Topic Title': topic.title,
            'Summary / Key Concept': topic.summary || '',
            'Allocated Hours': topic.allocatedHours,
            'Status': topic.status === 'completed' ? 'Completed (✅)' : topic.status === 'review_later' ? 'Review Later (🔖)' : 'Pending (⏳)',
            'Completed Date': topic.completedAt ? topic.completedAt.split('T')[0] : 'N/A',
          });
        });
      });
    });

    const worksheet = XLSX.utils.json_to_sheet(rows);

    // Summary metadata worksheet
    const summaryData = [
      { Parameter: 'Subject / Skill', Value: plan.title },
      { Parameter: 'Target Duration', Value: `${plan.targetMonths} Month(s)` },
      { Parameter: 'Pacing Days / Week', Value: `${plan.daysPerWeek} Days` },
      { Parameter: 'Daily Study Hours', Value: `${plan.hoursPerDay} Hours` },
      { Parameter: 'Completed Weeks Streak', Value: `${plan.streakWeeks} Weeks` },
      { Parameter: 'Completed Topics Count', Value: `${plan.streakDays}` },
      { Parameter: 'Created On', Value: plan.createdAt.split('T')[0] },
    ];
    const summarySheet = XLSX.utils.json_to_sheet(summaryData);

    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, summarySheet, 'Plan Overview');
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Schedule & Topics');

    // Generate binary string
    const wbout = XLSX.write(workbook, { type: 'base64', bookType: 'xlsx' });
    const cleanTitle = plan.title.replace(/[^a-zA-Z0-9]/g, '_');
    const fileName = `${cleanTitle}_StudyPlan_${Date.now()}.xlsx`;

    if (Platform.OS === 'web') {
      // Web browser download
      const binaryString = atob(wbout);
      const bytes = new Uint8Array(binaryString.length);
      for (let i = 0; i < binaryString.length; i++) {
        bytes[i] = binaryString.charCodeAt(i);
      }
      const blob = new Blob([bytes], {
        type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = fileName;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      return { success: true, message: `Downloaded ${fileName} successfully!` };
    } else {
      // Native iOS / Android device export via expo-file-system/legacy and expo-sharing
      const targetDir = FileSystem.documentDirectory || FileSystem.cacheDirectory;
      const fileUri = `${targetDir}${fileName}`;
      await FileSystem.writeAsStringAsync(fileUri, wbout, {
        encoding: FileSystem.EncodingType.Base64,
      });

      const isAvailable = await Sharing.isAvailableAsync();
      if (isAvailable) {
        await Sharing.shareAsync(fileUri, {
          mimeType: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
          dialogTitle: `Export ${plan.title} Study Plan`,
          UTI: 'com.microsoft.excel.xlsx',
        });
        return { success: true, message: 'Exported and shared successfully!' };
      } else {
        return { success: true, message: `File saved locally to ${fileUri}` };
      }
    }
  } catch (error: any) {
    console.error('Export excel error:', error);
    return { success: false, message: error.message || 'Failed to export Excel file' };
  }
}
