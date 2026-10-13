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
import { useTheme } from '../theme/ThemeContext';

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
  const { isDark, toggleTheme, theme } = useTheme();
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
        <Text style={[styles.headerTitle, { color: theme.colors.onSurface }]}>
          Settings & Meme Vault ⚡️
        </Text>
      </View>

      <ScrollView style={styles.content} contentContainerStyle={styles.scrollContent}>
        {/* Appearance / Dark Mode Toggle Card */}
        <View
          style={[
            styles.card,
            {
              backgroundColor: theme.colors.cardBg,
              borderColor: theme.colors.cardBorder,
            },
          ]}
        >
          <View style={styles.cardHeader}>
            <View
              style={[
                styles.cardIconBox,
                { backgroundColor: theme.colors.primaryContainer },
              ]}
            >
              <Ionicons
                name={isDark ? 'moon' : 'sunny'}
                size={20}
                color={isDark ? '#FBBF24' : theme.colors.primary}
              />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={[styles.cardTitle, { color: theme.colors.onSurface }]}>
                Appearance
              </Text>
              <Text style={[styles.cardSubtitle, { color: theme.colors.onSurfaceVariant }]}>
                {isDark ? 'OLED Dark Mode Enabled' : 'Light Mode Enabled'}
              </Text>
            </View>

            <TouchableOpacity
              style={[
                styles.themeTogglePill,
                {
                  backgroundColor: isDark ? '#1F2937' : '#EEF2FF',
                  borderColor: isDark ? '#374151' : '#C7D2FE',
                },
              ]}
              onPress={toggleTheme}
              activeOpacity={0.8}
            >
              <Ionicons
                name={isDark ? 'sunny' : 'moon'}
                size={14}
                color={isDark ? '#FBBF24' : theme.colors.primary}
              />
              <Text
                style={[
                  styles.themeTogglePillText,
                  { color: isDark ? '#F9FAFB' : theme.colors.primary },
                ]}
              >
                {isDark ? 'Light' : 'Dark'}
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Gemini API Key Box */}
        <View
          style={[
            styles.card,
            {
              backgroundColor: theme.colors.cardBg,
              borderColor: theme.colors.cardBorder,
            },
          ]}
        >
          <View style={styles.cardHeader}>
            <View
              style={[
                styles.cardIconBox,
                { backgroundColor: theme.colors.primaryContainer },
              ]}
            >
              <Ionicons name="key-outline" size={20} color={theme.colors.primary} />
            </View>
            <View>
              <Text style={[styles.cardTitle, { color: theme.colors.onSurface }]}>
                Gemini AI Integration
              </Text>
              <Text style={[styles.cardSubtitle, { color: theme.colors.onSurfaceVariant }]}>
                Stored locally on your device
              </Text>
            </View>
          </View>
          <Text style={[styles.cardDesc, { color: theme.colors.onSurfaceVariant }]}>
            Your key stays 100% on your device storage. It is never logged or pushed to GitHub.
          </Text>

          <TextInput
            style={[
              styles.keyInput,
              {
                backgroundColor: theme.colors.subtleBg,
                borderColor: theme.colors.cardBorder,
                color: theme.colors.onSurface,
              },
            ]}
            placeholder="AIzaSy..."
            placeholderTextColor={theme.colors.onSurfaceVariant}
            secureTextEntry
            value={apiKeyInput}
            onChangeText={setApiKeyInput}
          />

          <TouchableOpacity
            style={[styles.saveBtn, { backgroundColor: theme.colors.primary }]}
            onPress={handleSaveKey}
            activeOpacity={0.85}
          >
            <Ionicons name="save-outline" size={16} color={theme.colors.onPrimary} />
            <Text style={[styles.saveBtnText, { color: theme.colors.onPrimary }]}>
              {isSaved ? 'Saved Locally! ✅' : 'Save Key'}
            </Text>
          </TouchableOpacity>
        </View>

        {/* Meme Badges Showcase */}
        <View
          style={[
            styles.card,
            {
              backgroundColor: theme.colors.cardBg,
              borderColor: theme.colors.cardBorder,
            },
          ]}
        >
          <View style={styles.cardHeader}>
            <View
              style={[
                styles.cardIconBox,
                { backgroundColor: isDark ? '#451A03' : '#FEF3C7' },
              ]}
            >
              <Ionicons name="trophy" size={20} color="#F59E0B" />
            </View>
            <View>
              <Text style={[styles.cardTitle, { color: theme.colors.onSurface }]}>
                Milestone Badges Showcase
              </Text>
              <Text style={[styles.cardSubtitle, { color: theme.colors.onSurfaceVariant }]}>
                Unlock by hitting weekly streaks
              </Text>
            </View>
          </View>
          <Text style={[styles.cardDesc, { color: theme.colors.onSurfaceVariant }]}>
            Earn these legendary Telugu meme badges as you crush your milestone goals!
          </Text>

          {MEME_BADGES_CATALOG.map((b) => (
            <View
              key={b.id}
              style={[
                styles.badgeItem,
                { borderBottomColor: theme.colors.subtleBg },
              ]}
            >
              <View
                style={[
                  styles.badgeIconBox,
                  { backgroundColor: isDark ? b.color + '33' : b.color + '1A' },
                ]}
              >
                <Ionicons name={b.iconName as any} size={22} color={b.color} />
              </View>
              <View style={styles.badgeInfo}>
                <Text style={[styles.badgeTelugu, { color: theme.colors.onSurface }]}>
                  {b.teluguTitle}
                </Text>
                <Text style={[styles.badgeEng, { color: theme.colors.onSurfaceVariant }]}>
                  {b.title} • {b.description}
                </Text>
                <Text style={[styles.badgeQuote, { color: theme.colors.primary }]}>
                  “{b.memeQuote}”
                </Text>
              </View>
            </View>
          ))}
        </View>

        {/* Telugu Meme Dialogue Vault */}
        <View
          style={[
            styles.card,
            {
              backgroundColor: theme.colors.cardBg,
              borderColor: theme.colors.cardBorder,
            },
          ]}
        >
          <View style={styles.cardHeader}>
            <View
              style={[
                styles.cardIconBox,
                { backgroundColor: isDark ? '#4C0519' : '#FFE4E6' },
              ]}
            >
              <Ionicons name="chatbubbles" size={20} color="#F43F5E" />
            </View>
            <View>
              <Text style={[styles.cardTitle, { color: theme.colors.onSurface }]}>
                Telugu Meme Dialogue Vault
              </Text>
              <Text style={[styles.cardSubtitle, { color: theme.colors.onSurfaceVariant }]}>
                Pure motivation & comedic gold
              </Text>
            </View>
          </View>
          {MEME_REFERENCES.map((m) => (
            <View
              key={m.id}
              style={[
                styles.memeRefRow,
                {
                  backgroundColor: theme.colors.subtleBg,
                  borderColor: theme.colors.cardBorder,
                  borderLeftColor: theme.colors.primary,
                },
              ]}
            >
              <Text style={[styles.memeQuoteLarge, { color: theme.colors.onSurface }]}>
                {m.teluguQuote}
              </Text>
              <Text style={[styles.memeMeaning, { color: theme.colors.onSurfaceVariant }]}>
                👉 {m.englishMeaning}
              </Text>
              <Text style={[styles.memeChar, { color: theme.colors.primary }]}>
                Scene: {m.characterOrScene}
              </Text>
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
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
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
    borderRadius: 22,
    padding: 20,
    borderWidth: 1,
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
    borderRadius: 9999,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '600',
  },
  cardSubtitle: {
    fontSize: 11,
  },
  themeTogglePill: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 9999,
    borderWidth: 1,
    gap: 5,
  },
  themeTogglePillText: {
    fontSize: 12,
    fontWeight: '700',
  },
  cardDesc: {
    fontSize: 12,
    lineHeight: 18,
    marginBottom: 14,
  },
  keyInput: {
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 10,
    fontSize: 14,
    marginBottom: 14,
  },
  saveBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    borderRadius: 9999,
    gap: 8,
  },
  saveBtnText: {
    fontSize: 14,
    fontWeight: '700',
  },
  badgeItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
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
    fontSize: 14,
    fontWeight: '700',
  },
  badgeEng: {
    fontSize: 12,
    marginTop: 1,
  },
  badgeQuote: {
    fontSize: 11,
    fontStyle: 'italic',
    marginTop: 2,
    fontWeight: '600',
  },
  memeRefRow: {
    borderRadius: 16,
    padding: 14,
    marginBottom: 10,
    borderLeftWidth: 3,
    borderWidth: 1,
  },
  memeQuoteLarge: {
    fontSize: 14,
    fontWeight: '700',
    marginBottom: 4,
  },
  memeMeaning: {
    fontSize: 12,
    marginBottom: 2,
  },
  memeChar: {
    fontSize: 11,
    fontStyle: 'italic',
  },
});
