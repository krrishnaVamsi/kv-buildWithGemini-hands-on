import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  RefreshControl,
  SafeAreaView,
  StatusBar,
  Alert,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { StudyPlan } from '../types';
import { PlanCard } from '../components/PlanCard';
import { loadPlans, deletePlan, getApiKey } from '../storage/planStorage';
import { ChatPlannerScreen } from './ChatPlannerScreen';
import { PlanDetailScreen } from './PlanDetailScreen';
import { SettingsScreen } from './SettingsScreen';
import { M3 } from '../theme/material3';

export const HomeScreen: React.FC = () => {
  const [plans, setPlans] = useState<StudyPlan[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [activeScreen, setActiveScreen] = useState<'home' | 'chat' | 'detail' | 'settings'>('home');
  const [selectedPlan, setSelectedPlan] = useState<StudyPlan | null>(null);
  const [currentApiKey, setCurrentApiKey] = useState('');

  const refreshData = async () => {
    const loaded = await loadPlans();
    setPlans(loaded);
    const key = await getApiKey();
    setCurrentApiKey(key);
    setLoading(false);
    setRefreshing(false);
  };

  useEffect(() => {
    refreshData();
  }, []);

  const handleDeletePlan = (plan: StudyPlan) => {
    const doDelete = async () => {
      await deletePlan(plan.id);
      await refreshData();
    };

    if (Platform.OS === 'web') {
      if (window.confirm(`Delete study plan "${plan.title}"?`)) {
        doDelete();
      }
    } else {
      Alert.alert(
        'Delete Study Plan',
        `Are you sure you want to delete "${plan.title}"?`,
        [
          { text: 'Cancel', style: 'cancel' },
          { text: 'Delete', style: 'destructive', onPress: doDelete },
        ]
      );
    }
  };

  if (activeScreen === 'chat') {
    return (
      <SafeAreaView style={styles.safeArea}>
        <ChatPlannerScreen
          onBack={() => setActiveScreen('home')}
          onPlanCreated={(newPlan) => {
            setSelectedPlan(newPlan);
            setActiveScreen('detail');
            refreshData();
          }}
        />
      </SafeAreaView>
    );
  }

  if (activeScreen === 'detail' && selectedPlan) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <PlanDetailScreen
          plan={selectedPlan}
          onBack={() => {
            setActiveScreen('home');
            refreshData();
          }}
          onPlanUpdated={(updated) => {
            setSelectedPlan(updated);
            refreshData();
          }}
        />
      </SafeAreaView>
    );
  }

  if (activeScreen === 'settings') {
    return (
      <SafeAreaView style={styles.safeArea}>
        <SettingsScreen
          currentApiKey={currentApiKey}
          onBack={() => setActiveScreen('home')}
          onApiKeySaved={(newKey) => {
            setCurrentApiKey(newKey);
          }}
        />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor={M3.colors.surface} />

      {/* M3 Top App Bar */}
      <View style={styles.topAppBar}>
        <View>
          <Text style={styles.appTitle}>చదువుకోండి ఫస్టు</Text>
          <Text style={styles.appSubtitle}>Chadavukondi Firstu • M3 Study Planner</Text>
        </View>

        <TouchableOpacity
          style={styles.settingsIconButton}
          onPress={() => setActiveScreen('settings')}
          activeOpacity={0.7}
        >
          <Ionicons name="settings-outline" size={22} color={M3.colors.onSurfaceVariant} />
        </TouchableOpacity>
      </View>

      {/* Main Content Area */}
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.scrollContent}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={refreshData} />}
      >
        {/* M3 Hero Motivation Tonal Banner */}
        <View style={styles.heroBanner}>
          <View style={styles.heroContent}>
            <Text style={styles.heroTeluguQuote}>“ఇంకా మాట్లాడకండి... చదువుకోండి ఫస్టు!”</Text>
            <Text style={styles.heroEnglishSub}>
              Build consistent habits, conquer your daily syllabus, and unlock Telugu meme badges!
            </Text>
          </View>
          <View style={styles.heroIconBox}>
            <Ionicons name="school" size={26} color={M3.colors.primary} />
          </View>
        </View>

        {/* Section Header */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Your Study Plans ({plans.length})</Text>
          {plans.length > 0 && (
            <TouchableOpacity
              style={styles.newPlanChip}
              onPress={() => setActiveScreen('chat')}
              activeOpacity={0.8}
            >
              <Ionicons name="add" size={16} color={M3.colors.primary} />
              <Text style={styles.newPlanChipText}>New Plan</Text>
            </TouchableOpacity>
          )}
        </View>

        {/* Plan Cards or Empty State */}
        {plans.length === 0 ? (
          <View style={styles.emptyContainer}>
            <View style={styles.emptyIconCircle}>
              <Ionicons name="book-outline" size={36} color={M3.colors.primary} />
            </View>
            <Text style={styles.emptyTitle}>No study plans yet</Text>
            <Text style={styles.emptyDescription}>
              Chat with our AI bot to generate a structured, topic-wise study roadmap tailored to your timeline.
            </Text>
            <TouchableOpacity
              style={styles.emptyActionButton}
              onPress={() => setActiveScreen('chat')}
              activeOpacity={0.85}
            >
              <Ionicons name="chatbubbles" size={18} color={M3.colors.onPrimary} />
              <Text style={styles.emptyActionText}>Start Planner Chat</Text>
            </TouchableOpacity>
          </View>
        ) : (
          plans.map((p) => (
            <PlanCard
              key={p.id}
              plan={p}
              onPress={() => {
                setSelectedPlan(p);
                setActiveScreen('detail');
              }}
              onDelete={() => handleDeletePlan(p)}
            />
          ))
        )}
      </ScrollView>

      {/* M3 Floating Action Button (FAB) */}
      <TouchableOpacity
        style={styles.m3Fab}
        activeOpacity={0.85}
        onPress={() => setActiveScreen('chat')}
      >
        <Ionicons name="add" size={28} color={M3.colors.onPrimaryContainer} />
      </TouchableOpacity>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: M3.colors.surface,
  },
  topAppBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 12,
    backgroundColor: M3.colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: M3.colors.outlineVariant,
  },
  appTitle: {
    ...M3.typography.headlineSmall,
    color: M3.colors.onSurface,
  },
  appSubtitle: {
    ...M3.typography.labelSmall,
    color: M3.colors.onSurfaceVariant,
    marginTop: 2,
  },
  settingsIconButton: {
    width: 40,
    height: 40,
    borderRadius: M3.shapes.full,
    backgroundColor: M3.colors.surfaceContainerHigh,
    justifyContent: 'center',
    alignItems: 'center',
  },
  container: {
    flex: 1,
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 100,
  },
  heroBanner: {
    backgroundColor: M3.colors.primaryContainer,
    borderRadius: M3.shapes.extraLarge,
    padding: 20,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
    gap: 16,
    ...M3.elevation.level1,
  },
  heroContent: {
    flex: 1,
  },
  heroTeluguQuote: {
    ...M3.typography.titleMedium,
    color: M3.colors.onPrimaryContainer,
    fontWeight: '800',
    marginBottom: 6,
  },
  heroEnglishSub: {
    ...M3.typography.bodySmall,
    color: M3.colors.onPrimaryContainer,
    opacity: 0.85,
    lineHeight: 18,
  },
  heroIconBox: {
    width: 50,
    height: 50,
    borderRadius: M3.shapes.large,
    backgroundColor: M3.colors.surfaceContainerLowest,
    justifyContent: 'center',
    alignItems: 'center',
    ...M3.elevation.level1,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    ...M3.typography.titleLarge,
    color: M3.colors.onSurface,
  },
  newPlanChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: M3.colors.surfaceContainerHigh,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: M3.shapes.full,
    gap: 4,
  },
  newPlanChipText: {
    ...M3.typography.labelMedium,
    color: M3.colors.primary,
  },
  emptyContainer: {
    backgroundColor: M3.colors.surfaceContainerLow,
    borderRadius: M3.shapes.extraLarge,
    padding: 32,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: M3.colors.outlineVariant,
    marginTop: 10,
  },
  emptyIconCircle: {
    width: 72,
    height: 72,
    borderRadius: M3.shapes.full,
    backgroundColor: M3.colors.primaryContainer,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  emptyTitle: {
    ...M3.typography.titleLarge,
    color: M3.colors.onSurface,
    marginBottom: 8,
  },
  emptyDescription: {
    ...M3.typography.bodyMedium,
    color: M3.colors.onSurfaceVariant,
    textAlign: 'center',
    marginBottom: 24,
  },
  emptyActionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: M3.colors.primary,
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: M3.shapes.full,
    gap: 8,
    ...M3.elevation.level1,
  },
  emptyActionText: {
    ...M3.typography.labelLarge,
    color: M3.colors.onPrimary,
  },
  m3Fab: {
    position: 'absolute',
    right: 20,
    bottom: 24,
    width: 56,
    height: 56,
    borderRadius: M3.shapes.large, // Official M3 rounded-square shape
    backgroundColor: M3.colors.primaryContainer,
    justifyContent: 'center',
    alignItems: 'center',
    ...M3.elevation.level3,
  },
});
