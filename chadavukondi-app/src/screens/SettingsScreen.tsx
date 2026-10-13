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
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={onBack}>
          <Ionicons name="arrow-back" size={24} color="#0F172A" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Settings & Meme Catalog</Text>
      </View>

      <ScrollView style={styles.content} contentContainerStyle={styles.scrollContent}>
        {/* Gemini API Key Box */}
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <Ionicons name="key-outline" size={20} color="#4F46E5" />
            <Text style={styles.cardTitle}>Gemini AI Configuration</Text>
          </View>
          <Text style={styles.cardDesc}>
            Your API key is stored strictly on your local device storage. It is never uploaded to any backend or git repository.
          </Text>

          <TextInput
            style={styles.keyInput}
            placeholder="AIzaSy..."
            placeholderTextColor="#94A3B8"
            secureTextEntry
            value={apiKeyInput}
            onChangeText={setApiKeyInput}
          />

          <TouchableOpacity style={styles.saveBtn} onPress={handleSaveKey}>
            <Ionicons name="save-outline" size={16} color="#FFFFFF" />
            <Text style={styles.saveBtnText}>{isSaved ? 'Saved Locally! ✅' : 'Save Key'}</Text>
          </TouchableOpacity>
        </View>

        {/* Meme Badges Showcase */}
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <Ionicons name="trophy-outline" size={20} color="#D97706" />
            <Text style={styles.cardTitle}>Milestone Badges Catalog</Text>
          </View>
          <Text style={styles.cardDesc}>
            Badges awarded when you hit consecutive study weeks & months!
          </Text>

          {MEME_BADGES_CATALOG.map((b) => (
            <View key={b.id} style={styles.badgeItem}>
              <View style={[styles.badgeIconBox, { backgroundColor: b.color + '20' }]}>
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

        {/* Telugu Meme Dialogue References */}
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <Ionicons name="chatbubbles-outline" size={20} color="#059669" />
            <Text style={styles.cardTitle}>Telugu Meme Audio & Text Vault</Text>
          </View>
          {MEME_REFERENCES.map((m) => (
            <View key={m.id} style={styles.memeRefRow}>
              <Text style={styles.memeQuoteLarge}>{m.teluguQuote}</Text>
              <Text style={styles.memeMeaning}>👉 {m.englishMeaning}</Text>
              <Text style={styles.memeChar}>Reference: {m.characterOrScene}</Text>
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
  backBtn: {
    padding: 4,
  },
  headerTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: '#0F172A',
  },
  content: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
    gap: 16,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 6,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#0F172A',
  },
  cardDesc: {
    fontSize: 13,
    color: '#64748B',
    lineHeight: 18,
    marginBottom: 12,
  },
  keyInput: {
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#CBD5E1',
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 14,
    color: '#0F172A',
    marginBottom: 12,
  },
  saveBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#4F46E5',
    paddingVertical: 10,
    borderRadius: 8,
    gap: 6,
  },
  saveBtnText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '700',
  },
  badgeItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
    gap: 12,
  },
  badgeIconBox: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
  },
  badgeInfo: {
    flex: 1,
  },
  badgeTelugu: {
    fontSize: 14,
    fontWeight: '700',
    color: '#1E293B',
  },
  badgeEng: {
    fontSize: 12,
    color: '#475569',
    marginTop: 1,
  },
  badgeQuote: {
    fontSize: 11,
    fontStyle: 'italic',
    color: '#64748B',
    marginTop: 2,
  },
  memeRefRow: {
    backgroundColor: '#F8FAFC',
    borderRadius: 10,
    padding: 12,
    marginBottom: 10,
    borderLeftWidth: 3,
    borderLeftColor: '#059669',
  },
  memeQuoteLarge: {
    fontSize: 14,
    fontWeight: '700',
    color: '#0F172A',
    marginBottom: 4,
  },
  memeMeaning: {
    fontSize: 12,
    color: '#334155',
    marginBottom: 2,
  },
  memeChar: {
    fontSize: 11,
    color: '#64748B',
    fontStyle: 'italic',
  },
});
