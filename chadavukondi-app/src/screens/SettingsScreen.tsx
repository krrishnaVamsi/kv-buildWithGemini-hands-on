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
      {/* M3 Top App Bar */}
      <View style={styles.topAppBar}>
        <TouchableOpacity style={styles.iconButton} onPress={onBack} activeOpacity={0.7}>
          <Ionicons name="arrow-back" size={24} color={M3.colors.onSurface} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Settings & Meme Catalog</Text>
      </View>

      <ScrollView style={styles.content} contentContainerStyle={styles.scrollContent}>
        {/* Gemini API Key Box */}
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <View style={styles.cardIconBox}>
              <Ionicons name="key-outline" size={20} color={M3.colors.primary} />
            </View>
            <View>
              <Text style={styles.cardTitle}>Gemini AI Configuration</Text>
              <Text style={styles.cardSubtitle}>Local device storage only</Text>
            </View>
          </View>
          <Text style={styles.cardDesc}>
            Your API key is stored strictly on your local device storage. It is never uploaded to any backend or git repository.
          </Text>

          <TextInput
            style={styles.keyInput}
            placeholder="AIzaSy..."
            placeholderTextColor={M3.colors.outline}
            secureTextEntry
            value={apiKeyInput}
            onChangeText={setApiKeyInput}
          />

          <TouchableOpacity style={styles.saveBtn} onPress={handleSaveKey} activeOpacity={0.85}>
            <Ionicons name="save-outline" size={16} color={M3.colors.onPrimary} />
            <Text style={styles.saveBtnText}>{isSaved ? 'Saved Locally! ✅' : 'Save Key'}</Text>
          </TouchableOpacity>
        </View>

        {/* Meme Badges Showcase */}
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <View style={[styles.cardIconBox, { backgroundColor: M3.colors.warningContainer }]}>
              <Ionicons name="trophy-outline" size={20} color={M3.colors.warning} />
            </View>
            <View>
              <Text style={styles.cardTitle}>Milestone Badges Catalog</Text>
              <Text style={styles.cardSubtitle}>Meme reward achievements</Text>
            </View>
          </View>
          <Text style={styles.cardDesc}>
            Badges awarded when you hit consecutive study weeks & months!
          </Text>

          {MEME_BADGES_CATALOG.map((b) => (
            <View key={b.id} style={styles.badgeItem}>
              <View style={[styles.badgeIconBox, { backgroundColor: b.color + '22' }]}>
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
            <View style={[styles.cardIconBox, { backgroundColor: M3.colors.tertiaryContainer }]}>
              <Ionicons name="chatbubbles-outline" size={20} color={M3.colors.tertiary} />
            </View>
            <View>
              <Text style={styles.cardTitle}>Telugu Meme Dialogue Vault</Text>
              <Text style={styles.cardSubtitle}>Motivation & comedy references</Text>
            </View>
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
    backgroundColor: M3.colors.surface,
  },
  topAppBar: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 12,
    backgroundColor: M3.colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: M3.colors.outlineVariant,
    gap: 12,
  },
  iconButton: {
    width: 40,
    height: 40,
    borderRadius: M3.shapes.full,
    backgroundColor: M3.colors.surfaceContainerHigh,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    ...M3.typography.titleLarge,
    color: M3.colors.onSurface,
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
    backgroundColor: M3.colors.surfaceContainerLow,
    borderRadius: M3.shapes.extraLarge,
    padding: 20,
    borderWidth: 1,
    borderColor: M3.colors.outlineVariant,
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
    color: M3.colors.onSurface,
  },
  cardSubtitle: {
    ...M3.typography.labelSmall,
    color: M3.colors.onSurfaceVariant,
  },
  cardDesc: {
    ...M3.typography.bodySmall,
    color: M3.colors.onSurfaceVariant,
    lineHeight: 18,
    marginBottom: 14,
  },
  keyInput: {
    backgroundColor: M3.colors.surfaceContainerLowest,
    borderWidth: 1,
    borderColor: M3.colors.outlineVariant,
    borderRadius: M3.shapes.medium,
    paddingHorizontal: 14,
    paddingVertical: 10,
    fontSize: 14,
    color: M3.colors.onSurface,
    marginBottom: 14,
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
    color: M3.colors.onPrimary,
  },
  badgeItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: M3.colors.surfaceContainerHigh,
    gap: 12,
  },
  badgeIconBox: {
    width: 44,
    height: 44,
    borderRadius: M3.shapes.full,
    justifyContent: 'center',
    alignItems: 'center',
  },
  badgeInfo: {
    flex: 1,
  },
  badgeTelugu: {
    ...M3.typography.titleSmall,
    color: M3.colors.onSurface,
  },
  badgeEng: {
    ...M3.typography.bodySmall,
    color: M3.colors.onSurfaceVariant,
    marginTop: 1,
  },
  badgeQuote: {
    fontSize: 11,
    fontStyle: 'italic',
    color: M3.colors.tertiary,
    marginTop: 2,
  },
  memeRefRow: {
    backgroundColor: M3.colors.surfaceContainerLowest,
    borderRadius: M3.shapes.large,
    padding: 14,
    marginBottom: 10,
    borderLeftWidth: 4,
    borderLeftColor: M3.colors.tertiary,
    borderWidth: 1,
    borderColor: M3.colors.outlineVariant,
  },
  memeQuoteLarge: {
    ...M3.typography.titleSmall,
    color: M3.colors.onSurface,
    marginBottom: 4,
  },
  memeMeaning: {
    ...M3.typography.bodySmall,
    color: M3.colors.onSurfaceVariant,
    marginBottom: 2,
  },
  memeChar: {
    fontSize: 11,
    color: M3.colors.secondary,
    fontStyle: 'italic',
  },
});
