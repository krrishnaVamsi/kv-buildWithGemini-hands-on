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
import { useTheme } from '../theme/ThemeContext';

export const HomeScreen: React.FC = () => {
  const { isDark, toggleTheme, theme } = useTheme();
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
      if (window.confirm(`Delete game plan "${plan.title}"?`)) {
        doDelete();
      }
    } else {
      Alert.alert(
        'Delete Game Plan',
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
      <SafeAreaView style={[styles.safeArea, { backgroundColor: theme.colors.surface }]}>
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
      <SafeAreaView style={[styles.safeArea, { backgroundColor: theme.colors.surface }]}>
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
      <SafeAreaView style={[styles.safeArea, { backgroundColor: theme.colors.surface }]}>
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
    <SafeAreaView style={[styles.safeArea, { backgroundColor: theme.colors.surface }]}>
      <StatusBar
        barStyle={isDark ? 'light-content' : 'dark-content'}
        backgroundColor={theme.colors.surface}
      />

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
        <View style={styles.brandingBox}>
          <View style={[styles.logoPill, { backgroundColor: theme.colors.primaryContainer }]}>
            <Text style={styles.logoEmoji}>⚡️</Text>
          </View>
          <View>
            <Text style={[styles.appTitle, { color: theme.colors.onSurface }]}>
              Chadavukondi Firstu!
            </Text>
            <Text style={[styles.appSubtitle, { color: theme.colors.onSurfaceVariant }]}>
              Stop scrolling, lock in ⚡️
            </Text>
          </View>
        </View>

        <View style={styles.topRightActions}>
          {/* Dark Mode Toggle */}
          <TouchableOpacity
            style={[
              styles.actionIconButton,
              { backgroundColor: theme.colors.surfaceContainerHigh },
            ]}
            onPress={toggleTheme}
            activeOpacity={0.7}
            accessibilityLabel="Toggle Dark Mode"
          >
            <Ionicons
              name={isDark ? 'sunny' : 'moon'}
              size={18}
              color={isDark ? '#FBBF24' : theme.colors.primary}
            />
          </TouchableOpacity>

          {/* Settings / Meme Vault */}
          <TouchableOpacity
            style={[
              styles.actionIconButton,
              { backgroundColor: theme.colors.primaryContainer },
            ]}
            onPress={() => setActiveScreen('settings')}
            activeOpacity={0.7}
            accessibilityLabel="Settings and Meme Vault"
          >
            <Ionicons name="sparkles" size={17} color={theme.colors.primary} />
          </TouchableOpacity>
        </View>
      </View>

      {/* Main Content Area */}
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.scrollContent}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={refreshData}
            tintColor={theme.colors.primary}
          />
        }
      >
        {/* Gen-Z Hero Motivation Card */}
        <View
          style={[
            styles.heroBanner,
            {
              backgroundColor: isDark ? '#111827' : '#1E1B4B',
              borderColor: isDark ? '#1F2937' : '#312E81',
            },
          ]}
        >
          <View
            style={[
              styles.heroHeaderPill,
              { backgroundColor: isDark ? '#1F2937' : '#312E81' },
            ]}
          >
            <Text style={styles.heroHeaderPillText}>LOCKED IN MODE 🔥</Text>
          </View>
          <Text style={styles.heroTitle}>
            “Okkasari commit aithe na maata nene vinanu!”
          </Text>
          <Text style={styles.heroSub}>
            Zero excuses. Pick a subject, build your daily roadmap, and earn legendary Telugu meme badges.
          </Text>

          <View style={styles.heroFooterRow}>
            <TouchableOpacity
              style={[styles.heroActionButton, { backgroundColor: theme.colors.primary }]}
              onPress={() => setActiveScreen('chat')}
              activeOpacity={0.85}
            >
              <Text style={[styles.heroActionText, { color: theme.colors.onPrimary }]}>
                Create Game Plan
              </Text>
              <Ionicons name="arrow-forward" size={16} color={theme.colors.onPrimary} />
            </TouchableOpacity>

            <View style={styles.memeTag}>
              <Text style={styles.memeTagText}>#TeluguMemeEnergy 🚀</Text>
            </View>
          </View>
        </View>

        {/* Section Header */}
        <View style={styles.sectionHeader}>
          <View>
            <Text style={[styles.sectionTitle, { color: theme.colors.onSurface }]}>
              Active Game Plans
            </Text>
            <Text style={[styles.sectionCaption, { color: theme.colors.onSurfaceVariant }]}>
              {plans.length} roadmaps in progress
            </Text>
          </View>

          {plans.length > 0 && (
            <TouchableOpacity
              style={[
                styles.newPlanChip,
                { backgroundColor: theme.colors.primaryContainer },
              ]}
              onPress={() => setActiveScreen('chat')}
              activeOpacity={0.8}
            >
              <Ionicons name="add" size={18} color={theme.colors.primary} />
              <Text
                style={[
                  styles.newPlanChipText,
                  { color: theme.colors.onPrimaryContainer },
                ]}
              >
                New Plan
              </Text>
            </TouchableOpacity>
          )}
        </View>

        {/* Plan Cards or Empty State */}
        {plans.length === 0 ? (
          <View
            style={[
              styles.emptyContainer,
              {
                backgroundColor: theme.colors.cardBg,
                borderColor: theme.colors.cardBorder,
              },
            ]}
          >
            <View
              style={[
                styles.emptyIconCircle,
                { backgroundColor: theme.colors.primaryContainer },
              ]}
            >
              <Ionicons name="rocket-outline" size={38} color={theme.colors.primary} />
            </View>
            <Text style={[styles.emptyTitle, { color: theme.colors.onSurface }]}>
              Nothing Cooking Yet 🍳
            </Text>
            <Text style={[styles.emptyDescription, { color: theme.colors.onSurfaceVariant }]}>
              Tell the AI what you want to conquer (Python, Web Dev, UPSC, etc.) and it will craft an aesthetic, custom-paced roadmap for you!
            </Text>
            <TouchableOpacity
              style={[
                styles.emptyActionButton,
                { backgroundColor: theme.colors.primary },
              ]}
              onPress={() => setActiveScreen('chat')}
              activeOpacity={0.85}
            >
              <Ionicons name="chatbubbles" size={18} color={theme.colors.onPrimary} />
              <Text
                style={[styles.emptyActionText, { color: theme.colors.onPrimary }]}
              >
                Craft My First Plan ⚡️
              </Text>
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

      {/* Floating Action Button */}
      <TouchableOpacity
        style={[styles.m3Fab, { backgroundColor: theme.colors.primary }]}
        activeOpacity={0.85}
        onPress={() => setActiveScreen('chat')}
      >
        <Ionicons name="add" size={28} color={theme.colors.onPrimary} />
      </TouchableOpacity>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  topAppBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 14,
    paddingBottom: 14,
    borderBottomWidth: 1,
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
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoEmoji: {
    fontSize: 20,
  },
  appTitle: {
    fontSize: 18,
    fontWeight: '800',
    letterSpacing: -0.3,
  },
  appSubtitle: {
    fontSize: 12,
    marginTop: 1,
    fontWeight: '500',
  },
  topRightActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  actionIconButton: {
    width: 38,
    height: 38,
    borderRadius: 9999,
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
    borderRadius: 24,
    padding: 22,
    marginBottom: 26,
    borderWidth: 1,
  },
  heroHeaderPill: {
    alignSelf: 'flex-start',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 9999,
    marginBottom: 12,
  },
  heroHeaderPillText: {
    fontSize: 11,
    color: '#A5B4FC',
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  heroTitle: {
    fontSize: 20,
    color: '#FFFFFF',
    fontWeight: '800',
    marginBottom: 8,
    lineHeight: 28,
  },
  heroSub: {
    fontSize: 13,
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
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 9999,
    gap: 8,
  },
  heroActionText: {
    fontSize: 13,
    fontWeight: '700',
  },
  memeTag: {
    backgroundColor: 'rgba(255, 255, 255, 0.12)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 9999,
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
    fontSize: 18,
    fontWeight: '700',
  },
  sectionCaption: {
    fontSize: 12,
  },
  newPlanChip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 9999,
    gap: 6,
  },
  newPlanChipText: {
    fontSize: 13,
    fontWeight: '700',
  },
  emptyContainer: {
    borderRadius: 24,
    padding: 32,
    alignItems: 'center',
    borderWidth: 1,
    marginTop: 10,
  },
  emptyIconCircle: {
    width: 76,
    height: 76,
    borderRadius: 9999,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 8,
  },
  emptyDescription: {
    fontSize: 14,
    textAlign: 'center',
    marginBottom: 24,
    lineHeight: 22,
  },
  emptyActionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingVertical: 13,
    borderRadius: 9999,
    gap: 8,
  },
  emptyActionText: {
    fontSize: 14,
    fontWeight: '700',
  },
  m3Fab: {
    position: 'absolute',
    right: 20,
    bottom: 24,
    width: 58,
    height: 58,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 6,
  },
});
