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
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />

      {/* App Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.logoTitle}>చదువుకోండి ఫస్టు</Text>
          <Text style={styles.logoSubtitle}>Chadavukondi Firstu • Study Planner</Text>
        </View>
        <TouchableOpacity
          style={styles.settingsIconBtn}
          onPress={() => setActiveScreen('settings')}
        >
          <Ionicons name="settings-outline" size={22} color="#334155" />
        </TouchableOpacity>
      </View>

      {/* Main Content */}
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.scrollContent}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={refreshData} />}
      >
        {/* Banner with meme spirit */}
        <View style={styles.banner}>
          <View style={styles.bannerContent}>
            <Text style={styles.bannerMemeQuote}>“ఇంకా మాట్లాడకండి... చదువుకోండి ఫస్టు!”</Text>
            <Text style={styles.bannerMemeSub}>
              Select your plan, conquer today’s topics, and claim your weekly streak badges!
            </Text>
          </View>
          <View style={styles.bannerIconBox}>
            <Ionicons name="school" size={28} color="#4F46E5" />
          </View>
        </View>

        {/* Section Heading */}
        <View style={styles.sectionRow}>
          <Text style={styles.sectionTitle}>Your Study Plans ({plans.length})</Text>
          {plans.length > 0 && (
            <TouchableOpacity onPress={() => setActiveScreen('chat')}>
              <Text style={styles.addPlanLink}>+ New Plan</Text>
            </TouchableOpacity>
          )}
        </View>

        {/* Plan Cards */}
        {plans.length === 0 ? (
          <View style={styles.emptyState}>
            <View style={styles.emptyIconCircle}>
              <Ionicons name="book-outline" size={38} color="#4F46E5" />
            </View>
            <Text style={styles.emptyTitle}>No study plans yet!</Text>
            <Text style={styles.emptyDesc}>
              Tap the button below to start a quick chat with the planner bot and generate your topic-wise calendar!
            </Text>
            <TouchableOpacity style={styles.createFirstBtn} onPress={() => setActiveScreen('chat')}>
              <Ionicons name="chatbubbles" size={18} color="#FFFFFF" />
              <Text style={styles.createFirstBtnText}>Create My First Plan</Text>
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

      {/* Floating Action Button (FAB) */}
      <TouchableOpacity
        style={styles.fab}
        activeOpacity={0.85}
        onPress={() => setActiveScreen('chat')}
      >
        <Ionicons name="add" size={30} color="#FFFFFF" />
      </TouchableOpacity>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 14,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  logoTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: '#0F172A',
  },
  logoSubtitle: {
    fontSize: 12,
    color: '#64748B',
    marginTop: 1,
  },
  settingsIconBtn: {
    padding: 6,
    borderRadius: 8,
    backgroundColor: '#F8FAFC',
  },
  container: {
    flex: 1,
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 90,
  },
  banner: {
    backgroundColor: '#EEF2FF',
    borderRadius: 16,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#E0E7FF',
    gap: 12,
  },
  bannerContent: {
    flex: 1,
  },
  bannerMemeQuote: {
    fontSize: 14,
    fontWeight: '800',
    color: '#3730A3',
    marginBottom: 4,
  },
  bannerMemeSub: {
    fontSize: 12,
    color: '#4F46E5',
    lineHeight: 16,
  },
  bannerIconBox: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 2,
    shadowColor: '#4F46E5',
    shadowOpacity: 0.1,
    shadowRadius: 6,
  },
  sectionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 14,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1E293B',
  },
  addPlanLink: {
    fontSize: 14,
    fontWeight: '700',
    color: '#4F46E5',
  },
  emptyState: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 28,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    marginTop: 10,
  },
  emptyIconCircle: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: '#EEF2FF',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#0F172A',
    marginBottom: 8,
  },
  emptyDesc: {
    fontSize: 13,
    color: '#64748B',
    textAlign: 'center',
    lineHeight: 19,
    marginBottom: 20,
  },
  createFirstBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#4F46E5',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 10,
    gap: 8,
  },
  createFirstBtnText: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 14,
  },
  fab: {
    position: 'absolute',
    right: 20,
    bottom: 24,
    width: 58,
    height: 58,
    borderRadius: 29,
    backgroundColor: '#4F46E5',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 6,
    shadowColor: '#4F46E5',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.35,
    shadowRadius: 8,
  },
});
