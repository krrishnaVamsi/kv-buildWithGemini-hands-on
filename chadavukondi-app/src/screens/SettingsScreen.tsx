import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Alert,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { setApiKey } from '../storage/planStorage';
import { MEME_BADGES_CATALOG, MEME_REFERENCES } from '../data/memeCatalog';
import { M3 } from '../theme/material3';

interface SettingsScreenProps {
  currentApiKey: string;
  onBack: () => void;
  onApiKeySaved: (newKey: string) => void;
}

export const SettingsScreen: React.FC<SettingsScreenProps> = ({
  currentApiKey,
  onBack,
  onApiKeySaved,
}) => {
  const [apiKeyInput, setApiKeyInput] = useState(currentApiKey);
  const [isSaved, setIsSaved] = useState(false);

  const handleSaveKey = async () => {
    await setApiKey(apiKeyInput);
    onApiKeySaved(apiKeyInput);
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 2000);

    if (Platform.OS === 'web') {
      window.alert('API Key saved locally on your device!');
    } else {
      Alert.alert('Saved', 'Gemini API Key saved locally on your device!');
    }
  };

  return (
    <View style={styles.container}>
      {/* Top App Bar */}
      <View style={styles.topAppBar}>
        <TouchableOpacity style={styles.iconButton} onPress={onBack} activeOpacity={0.7}>
          <Ionicons name="arrow-back" size={22} color="#0F172A" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Settings & Meme Vault ⚡️</Text>
      </View>

      <ScrollView style={styles.content} contentContainerStyle={styles.scrollContent}>
        {/* Gemini API Key Box */}
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <View style={styles.cardIconBox}>
              <Ionicons name="key-outline" size={20} color={M3.colors.primary} />
            </View>
            <View>
              <Text style={styles.cardTitle}>Gemini AI Integration</Text>
              <Text style={styles.cardSubtitle}>Stored locally on your device</Text>
            </View>
          </View>
          <Text style={styles.cardDesc}>
            Your key stays 100% on your device storage. It is never logged or pushed to GitHub.
          </Text>

          <TextInput
            style={styles.keyInput}
            placeholder="AIzaSy..."
            placeholderTextColor="#94A3B8"
            secureTextEntry
            value={apiKeyInput}
            onChangeText={setApiKeyInput}
          />

          <TouchableOpacity style={styles.saveBtn} onPress={handleSaveKey} activeOpacity={0.85}>
            <Ionicons name="save-outline" size={16} color="#FFFFFF" />
            <Text style={styles.saveBtnText}>{isSaved ? 'Saved Locally! ✅' : 'Save Key'}</Text>
          </TouchableOpacity>
        </View>

        {/* Meme Badges Showcase */}
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <View style={[styles.cardIconBox, { backgroundColor: '#FEF3C7' }]}>
              <Ionicons name="trophy" size={20} color="#F59E0B" />
            </View>
            <View>
              <Text style={styles.cardTitle}>Milestone Badges Showcase</Text>
              <Text style={styles.cardSubtitle}>Unlock by hitting weekly study streaks</Text>
            </View>
          </View>
          <Text style={styles.cardDesc}>
            Earn these legendary Telugu meme badges as you crush your syllabus milestones!
          </Text>

          {MEME_BADGES_CATALOG.map((b) => (
            <View key={b.id} style={styles.badgeItem}>
              <View style={[styles.badgeIconBox, { backgroundColor: b.color + '1A' }]}>
                <Ionicons name={b.iconName as any} size={22} color={b.color} />
              </View>
              <View style={styles.badgeInfo}>
                <Text style={styles.badgeTelugu}>{b.teluguTitle}</Text>
                <Text style={styles.badgeEng}>{b.title} • {b.description}</Text>
                <Text style={styles.badgeQuote}>“{b.memeQuote}”</Text>
              </View>
            </View>
          ))}
        </View>

        {/* Telugu Meme Dialogue Vault */}
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <View style={[styles.cardIconBox, { backgroundColor: '#FFE4E6' }]}>
              <Ionicons name="chatbubbles" size={20} color="#F43F5E" />
            </View>
            <View>
              <Text style={styles.cardTitle}>Telugu Meme Dialogue Vault</Text>
              <Text style={styles.cardSubtitle}>Pure motivation & comedic gold</Text>
            </View>
          </View>
          {MEME_REFERENCES.map((m) => (
            <View key={m.id} style={styles.memeRefRow}>
              <Text style={styles.memeQuoteLarge}>{m.teluguQuote}</Text>
              <Text style={styles.memeMeaning}>👉 {m.englishMeaning}</Text>
              <Text style={styles.memeChar}>Scene: {m.characterOrScene}</Text>
            </View>
          ))}
        </View>
      </ScrollView>
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
  headerTitle: {
    ...M3.typography.titleLarge,
    color: '#0F172A',
  },
  content: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
    gap: 16,
    paddingBottom: 40,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 22,
    padding: 20,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    ...M3.elevation.level1,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 8,
  },
  cardIconBox: {
    width: 40,
    height: 40,
    borderRadius: M3.shapes.full,
    backgroundColor: M3.colors.primaryContainer,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cardTitle: {
    ...M3.typography.titleMedium,
    color: '#0F172A',
  },
  cardSubtitle: {
    ...M3.typography.labelSmall,
    color: '#64748B',
  },
  cardDesc: {
    ...M3.typography.bodySmall,
    color: '#64748B',
    lineHeight: 18,
    marginBottom: 14,
  },
  keyInput: {
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 10,
    fontSize: 14,
    color: '#0F172A',
    marginBottom: 14,
    fontFamily: M3.fonts.body,
  },
  saveBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: M3.colors.primary,
    paddingVertical: 12,
    borderRadius: M3.shapes.full,
    gap: 8,
    ...M3.elevation.level1,
  },
  saveBtnText: {
    ...M3.typography.labelLarge,
    color: '#FFFFFF',
    fontWeight: '700',
  },
  badgeItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
    gap: 12,
  },
  badgeIconBox: {
    width: 44,
    height: 44,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
  },
  badgeInfo: {
    flex: 1,
  },
  badgeTelugu: {
    ...M3.typography.titleSmall,
    color: '#0F172A',
    fontWeight: '700',
  },
  badgeEng: {
    ...M3.typography.bodySmall,
    color: '#64748B',
    marginTop: 1,
  },
  badgeQuote: {
    fontSize: 11,
    fontStyle: 'italic',
    color: M3.colors.primary,
    marginTop: 2,
    fontWeight: '600',
  },
  memeRefRow: {
    backgroundColor: '#F8FAFC',
    borderRadius: 16,
    padding: 14,
    marginBottom: 10,
    borderLeftWidth: 3,
    borderLeftColor: M3.colors.primary,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  memeQuoteLarge: {
    ...M3.typography.titleSmall,
    color: '#0F172A',
    fontWeight: '700',
    marginBottom: 4,
  },
  memeMeaning: {
    ...M3.typography.bodySmall,
    color: '#64748B',
    marginBottom: 2,
  },
  memeChar: {
    fontSize: 11,
    color: M3.colors.primaryDark,
    fontStyle: 'italic',
  },
});
