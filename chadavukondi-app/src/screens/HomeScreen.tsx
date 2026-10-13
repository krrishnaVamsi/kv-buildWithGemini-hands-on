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

      {/* Top App Bar in English */}
      <View style={styles.topAppBar}>
        <View style={styles.brandingBox}>
          <View style={styles.logoPill}>
            <Text style={styles.logoEmoji}>⚡️</Text>
          </View>
          <View>
            <Text style={styles.appTitle}>Chadavukondi Firstu!</Text>
            <Text style={styles.appSubtitle}>Stop scrolling, start studying 📚</Text>
          </View>
        </View>

        <TouchableOpacity
          style={styles.settingsIconButton}
          onPress={() => setActiveScreen('settings')}
          activeOpacity={0.7}
        >
          <Ionicons name="sparkles" size={18} color={M3.colors.primary} />
        </TouchableOpacity>
      </View>

      {/* Main Content Area */}
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.scrollContent}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={refreshData} />}
      >
        {/* Gen-Z Hero Motivation Card */}
        <View style={styles.heroBanner}>
          <View style={styles.heroHeaderPill}>
            <Text style={styles.heroHeaderPillText}>LOCKED IN MODE 🔥</Text>
          </View>
          <Text style={styles.heroTitle}>
            “Inka matladakandi... Chadavukondi Firstu!”
          </Text>
          <Text style={styles.heroSub}>
            Zero excuses. Pick a subject, build your daily roadmap, and earn legendary Telugu meme badges.
          </Text>

          <View style={styles.heroFooterRow}>
            <TouchableOpacity
              style={styles.heroActionButton}
              onPress={() => setActiveScreen('chat')}
              activeOpacity={0.85}
            >
              <Text style={styles.heroActionText}>Create Game Plan</Text>
              <Ionicons name="arrow-forward" size={16} color="#FFFFFF" />
            </TouchableOpacity>

            <View style={styles.memeTag}>
              <Text style={styles.memeTagText}>#TeluguMemeEnergy 🚀</Text>
            </View>
          </View>
        </View>

        {/* Section Header */}
        <View style={styles.sectionHeader}>
          <View>
            <Text style={styles.sectionTitle}>Active Game Plans</Text>
            <Text style={styles.sectionCaption}>{plans.length} roadmaps in progress</Text>
          </View>

          {plans.length > 0 && (
            <TouchableOpacity
              style={styles.newPlanChip}
              onPress={() => setActiveScreen('chat')}
              activeOpacity={0.8}
            >
              <Ionicons name="add" size={18} color={M3.colors.primary} />
              <Text style={styles.newPlanChipText}>New Plan</Text>
            </TouchableOpacity>
          )}
        </View>

        {/* Plan Cards or Empty State */}
        {plans.length === 0 ? (
          <View style={styles.emptyContainer}>
            <View style={styles.emptyIconCircle}>
              <Ionicons name="rocket-outline" size={38} color={M3.colors.primary} />
            </View>
            <Text style={styles.emptyTitle}>Nothing Cooking Yet 🍳</Text>
            <Text style={styles.emptyDescription}>
              Tell the AI what you want to master (Python, Web Dev, UPSC, etc.) and it will craft an aesthetic, custom-paced study roadmap for you!
            </Text>
            <TouchableOpacity
              style={styles.emptyActionButton}
              onPress={() => setActiveScreen('chat')}
              activeOpacity={0.85}
            >
              <Ionicons name="chatbubbles" size={18} color={M3.colors.onPrimary} />
              <Text style={styles.emptyActionText}>Craft My First Plan ⚡️</Text>
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

      {/* Modern M3 Floating Action Button (FAB) */}
      <TouchableOpacity
        style={styles.m3Fab}
        activeOpacity={0.85}
        onPress={() => setActiveScreen('chat')}
      >
        <Ionicons name="add" size={28} color="#FFFFFF" />
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
    paddingTop: 14,
    paddingBottom: 14,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: M3.colors.outlineVariant,
  },
  brandingBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  logoPill: {
    width: 38,
    height: 38,
    borderRadius: 12,
    backgroundColor: M3.colors.primaryContainer,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoEmoji: {
    fontSize: 20,
  },
  appTitle: {
    ...M3.typography.titleLarge,
    color: M3.colors.onSurface,
    fontWeight: '800',
  },
  appSubtitle: {
    ...M3.typography.bodySmall,
    color: M3.colors.onSurfaceVariant,
    marginTop: 1,
  },
  settingsIconButton: {
    width: 40,
    height: 40,
    borderRadius: M3.shapes.full,
    backgroundColor: M3.colors.primaryContainer,
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
    backgroundColor: '#1E1B4B', // Sleek deep midnight indigo
    borderRadius: 24,
    padding: 22,
    marginBottom: 26,
    ...M3.elevation.level2,
  },
  heroHeaderPill: {
    alignSelf: 'flex-start',
    backgroundColor: '#312E81',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: M3.shapes.full,
    marginBottom: 12,
  },
  heroHeaderPillText: {
    ...M3.typography.labelSmall,
    color: '#A5B4FC',
    fontWeight: '800',
  },
  heroTitle: {
    ...M3.typography.headlineSmall,
    color: '#FFFFFF',
    fontWeight: '800',
    marginBottom: 8,
    lineHeight: 28,
  },
  heroSub: {
    ...M3.typography.bodySmall,
    color: '#C7D2FE',
    lineHeight: 20,
    marginBottom: 18,
  },
  heroFooterRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: 12,
  },
  heroActionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: M3.colors.primary,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: M3.shapes.full,
    gap: 8,
  },
  heroActionText: {
    ...M3.typography.labelMedium,
    color: '#FFFFFF',
    fontWeight: '700',
  },
  memeTag: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: M3.shapes.full,
  },
  memeTagText: {
    fontSize: 11,
    color: '#FCD34D',
    fontWeight: '700',
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
  sectionCaption: {
    ...M3.typography.bodySmall,
    color: M3.colors.onSurfaceVariant,
  },
  newPlanChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: M3.colors.primaryContainer,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: M3.shapes.full,
    gap: 6,
  },
  newPlanChipText: {
    ...M3.typography.labelMedium,
    color: M3.colors.onPrimaryContainer,
    fontWeight: '700',
  },
  emptyContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    padding: 32,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: M3.colors.outlineVariant,
    marginTop: 10,
    ...M3.elevation.level1,
  },
  emptyIconCircle: {
    width: 76,
    height: 76,
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
    lineHeight: 22,
  },
  emptyActionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: M3.colors.primary,
    paddingHorizontal: 24,
    paddingVertical: 13,
    borderRadius: M3.shapes.full,
    gap: 8,
    ...M3.elevation.level2,
  },
  emptyActionText: {
    ...M3.typography.labelLarge,
    color: '#FFFFFF',
    fontWeight: '700',
  },
  m3Fab: {
    position: 'absolute',
    right: 20,
    bottom: 24,
    width: 58,
    height: 58,
    borderRadius: 18,
    backgroundColor: M3.colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    ...M3.elevation.level3,
  },
});
