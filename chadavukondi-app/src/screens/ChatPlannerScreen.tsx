import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  ScrollView,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { generateStudyPlanWithGemini } from '../api/gemini';
import { savePlan } from '../storage/planStorage';
import { StudyPlan } from '../types';
import { M3 } from '../theme/material3';

interface Message {
  id: string;
  sender: 'ai' | 'user';
  text: string;
  timestamp: string;
}

interface ChatPlannerScreenProps {
  onBack: () => void;
  onPlanCreated: (plan: StudyPlan) => void;
}

type Step = 'ask_subject' | 'ask_days' | 'ask_hours' | 'ask_months' | 'generating' | 'done';

export const ChatPlannerScreen: React.FC<ChatPlannerScreenProps> = ({
  onBack,
  onPlanCreated,
}) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'msg-1',
      sender: 'ai',
      text: 'Yo! Welcome to Chadavukondi Firstu! ⚡️📚\n\nWhat topic, skill, or exam do you want to conquer? (e.g. Full Stack Dev, Data Science, UPSC, NEET, DSA...)',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    },
  ]);

  const [currentStep, setCurrentStep] = useState<Step>('ask_subject');
  const [inputVal, setInputVal] = useState('');
  const [subject, setSubject] = useState('');
  const [daysPerWeek, setDaysPerWeek] = useState(5);
  const [hoursPerDay, setHoursPerDay] = useState(3);
  const [targetMonths, setTargetMonths] = useState(2);
  const [loading, setLoading] = useState(false);

  const handleSend = async (overrideText?: string) => {
    const text = (overrideText || inputVal).trim();
    if (!text) return;

    const userMsg: Message = {
      id: `msg-${Date.now()}`,
      sender: 'user',
      text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    const nextMessages = [...messages, userMsg];
    setMessages(nextMessages);
    setInputVal('');

    if (currentStep === 'ask_subject') {
      setSubject(text);
      setCurrentStep('ask_days');
      setMessages([
        ...nextMessages,
        {
          id: `msg-${Date.now() + 1}`,
          sender: 'ai',
          text: `“${text}” — great pick! Let's lock it in. 🎯\n\nHow many days a week can you dedicate to study sessions?`,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        },
      ]);
    } else if (currentStep === 'ask_days') {
      const parsedDays = parseInt(text.replace(/[^0-9]/g, ''), 10) || 5;
      const validDays = Math.min(Math.max(parsedDays, 1), 7);
      setDaysPerWeek(validDays);
      setCurrentStep('ask_hours');
      setMessages([
        ...nextMessages,
        {
          id: `msg-${Date.now() + 1}`,
          sender: 'ai',
          text: `Locked in for ${validDays} days/week. 🗓️\n\nHow many hours per study day can you put in? (Be real with yourself!)`,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        },
      ]);
    } else if (currentStep === 'ask_hours') {
      const parsedHours = parseInt(text.replace(/[^0-9]/g, ''), 10) || 3;
      const validHours = Math.min(Math.max(parsedHours, 1), 12);
      setHoursPerDay(validHours);
      setCurrentStep('ask_months');
      setMessages([
        ...nextMessages,
        {
          id: `msg-${Date.now() + 1}`,
          sender: 'ai',
          text: `${validHours} hrs/day, respect the grind. ⏰\n\nWhat is your target timeline in months to finish this quest?`,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        },
      ]);
    } else if (currentStep === 'ask_months') {
      const parsedMonths = parseInt(text.replace(/[^0-9]/g, ''), 10) || 2;
      const validMonths = Math.min(Math.max(parsedMonths, 1), 12);
      setTargetMonths(validMonths);
      setCurrentStep('generating');
      setLoading(true);

      const generatingMsg: Message = {
        id: `msg-${Date.now() + 1}`,
        sender: 'ai',
        text: `“Inka matladakandi, Chadavukondi Firstu!” 🚀🔥\n\nCooking your personalized day-by-day roadmap for “${subject}” (${validMonths} months, ${daysPerWeek} days/wk, ${hoursPerDay} hrs/day)...`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages([...nextMessages, generatingMsg]);

      try {
        const newPlan = await generateStudyPlanWithGemini({
          subject,
          daysPerWeek,
          hoursPerDay,
          targetMonths: validMonths,
        });

        await savePlan(newPlan);
        setLoading(false);
        setCurrentStep('done');

        onPlanCreated(newPlan);
      } catch (err: any) {
        setLoading(false);
        setMessages([
          ...nextMessages,
          generatingMsg,
          {
            id: `msg-${Date.now() + 2}`,
            sender: 'ai',
            text: `Whoops! Encountered a bump: ${err.message || 'Unknown issue'}. Let's retry!`,
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          },
        ]);
        setCurrentStep('ask_months');
      }
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.keyboardContainer}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <View style={styles.container}>
        {/* App Bar */}
        <View style={styles.topAppBar}>
          <TouchableOpacity style={styles.iconButton} onPress={onBack} activeOpacity={0.7}>
            <Ionicons name="arrow-back" size={22} color="#0F172A" />
          </TouchableOpacity>
          <View style={styles.headerInfo}>
            <Text style={styles.headerTitle}>AI Study Architect ⚡️</Text>
            <Text style={styles.headerSubtitle}>Building your custom game plan</Text>
          </View>
        </View>

        {/* Chat Messages */}
        <ScrollView
          style={styles.messagesScroll}
          contentContainerStyle={styles.messagesContent}
          keyboardShouldPersistTaps="handled"
        >
          {messages.map((m) => (
            <View
              key={m.id}
              style={[
                styles.messageRow,
                m.sender === 'user' ? styles.userRow : styles.aiRow,
              ]}
            >
              {m.sender === 'ai' && (
                <View style={styles.avatarCircle}>
                  <Text style={styles.avatarEmoji}>🤖</Text>
                </View>
              )}
              <View
                style={[
                  styles.bubble,
                  m.sender === 'user' ? styles.userBubble : styles.aiBubble,
                ]}
              >
                <Text
                  style={[
                    styles.bubbleText,
                    m.sender === 'user' ? styles.userText : styles.aiText,
                  ]}
                >
                  {m.text}
                </Text>
                <Text
                  style={[
                    styles.timestamp,
                    m.sender === 'user' ? styles.userTimestamp : styles.aiTimestamp,
                  ]}
                >
                  {m.timestamp}
                </Text>
              </View>
            </View>
          ))}

          {loading && (
            <View style={styles.loadingCard}>
              <ActivityIndicator size="small" color={M3.colors.primary} />
              <Text style={styles.loadingText}>Synthesizing your game plan...</Text>
            </View>
          )}
        </ScrollView>

        {/* Quick Suggestion Pills */}
        {currentStep === 'ask_days' && (
          <View style={styles.chipsRow}>
            {['3 Days/wk', '4 Days/wk', '5 Days/wk', '6 Days/wk', '7 Days/wk'].map((d) => (
              <TouchableOpacity
                key={d}
                style={styles.suggestionChip}
                onPress={() => handleSend(d)}
                activeOpacity={0.8}
              >
                <Text style={styles.suggestionChipText}>⚡️ {d}</Text>
              </TouchableOpacity>
            ))}
          </View>
        )}

        {currentStep === 'ask_hours' && (
          <View style={styles.chipsRow}>
            {['1 Hour', '2 Hours', '3 Hours', '4 Hours', '6 Hours'].map((h) => (
              <TouchableOpacity
                key={h}
                style={styles.suggestionChip}
                onPress={() => handleSend(h)}
                activeOpacity={0.8}
              >
                <Text style={styles.suggestionChipText}>⏰ {h}/day</Text>
              </TouchableOpacity>
            ))}
          </View>
        )}

        {currentStep === 'ask_months' && (
          <View style={styles.chipsRow}>
            {['1 Month (Sprint)', '2 Months', '3 Months (Ideal)', '6 Months'].map((m) => (
              <TouchableOpacity
                key={m}
                style={styles.suggestionChip}
                onPress={() => handleSend(m)}
                activeOpacity={0.8}
              >
                <Text style={styles.suggestionChipText}>🎯 {m}</Text>
              </TouchableOpacity>
            ))}
          </View>
        )}

        {/* Bottom Dock Input */}
        <View style={styles.bottomDock}>
          <TextInput
            style={styles.dockInput}
            placeholder={
              currentStep === 'ask_subject'
                ? 'Type subject or skill here...'
                : 'Your response...'
            }
            placeholderTextColor="#94A3B8"
            value={inputVal}
            onChangeText={setInputVal}
            onSubmitEditing={() => handleSend()}
            returnKeyType="send"
            editable={!loading}
          />

          <TouchableOpacity
            style={[styles.sendButton, !inputVal.trim() && styles.sendButtonDisabled]}
            onPress={() => handleSend()}
            disabled={!inputVal.trim() || loading}
            activeOpacity={0.85}
          >
            <Ionicons name="arrow-up" size={20} color="#FFFFFF" />
          </TouchableOpacity>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  keyboardContainer: {
    flex: 1,
  },
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
  headerInfo: {
    flex: 1,
  },
  headerTitle: {
    ...M3.typography.titleLarge,
    color: '#0F172A',
    fontWeight: '700',
  },
  headerSubtitle: {
    ...M3.typography.bodySmall,
    color: '#64748B',
  },
  messagesScroll: {
    flex: 1,
  },
  messagesContent: {
    padding: 16,
    paddingBottom: 24,
  },
  messageRow: {
    flexDirection: 'row',
    marginBottom: 16,
    alignItems: 'flex-end',
    gap: 8,
  },
  userRow: {
    justifyContent: 'flex-end',
  },
  aiRow: {
    justifyContent: 'flex-start',
  },
  avatarCircle: {
    width: 34,
    height: 34,
    borderRadius: M3.shapes.full,
    backgroundColor: M3.colors.primaryContainer,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 4,
  },
  avatarEmoji: {
    fontSize: 16,
  },
  bubble: {
    maxWidth: '82%',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  aiBubble: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 18,
    borderTopRightRadius: 18,
    borderBottomRightRadius: 18,
    borderBottomLeftRadius: 4,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    ...M3.elevation.level1,
  },
  userBubble: {
    backgroundColor: M3.colors.primary,
    borderTopLeftRadius: 18,
    borderTopRightRadius: 18,
    borderBottomLeftRadius: 18,
    borderBottomRightRadius: 4,
    ...M3.elevation.level1,
  },
  bubbleText: {
    ...M3.typography.bodyMedium,
    lineHeight: 22,
  },
  aiText: {
    color: '#0F172A',
  },
  userText: {
    color: '#FFFFFF',
  },
  timestamp: {
    fontSize: 10,
    marginTop: 4,
  },
  aiTimestamp: {
    color: '#94A3B8',
    textAlign: 'left',
  },
  userTimestamp: {
    color: '#C7D2FE',
    textAlign: 'right',
  },
  loadingCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: M3.colors.primaryContainer,
    padding: 14,
    borderRadius: 16,
    gap: 12,
    alignSelf: 'flex-start',
    marginTop: 8,
  },
  loadingText: {
    ...M3.typography.labelMedium,
    color: M3.colors.onPrimaryContainer,
  },
  chipsRow: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingBottom: 10,
    gap: 8,
    flexWrap: 'wrap',
  },
  suggestionChip: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: M3.shapes.full,
    borderWidth: 1,
    borderColor: '#CBD5E1',
    ...M3.elevation.level1,
  },
  suggestionChipText: {
    ...M3.typography.labelSmall,
    color: M3.colors.primaryDark,
    fontWeight: '700',
  },
  bottomDock: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#E2E8F0',
    gap: 10,
  },
  dockInput: {
    flex: 1,
    backgroundColor: '#F1F5F9',
    borderRadius: M3.shapes.full,
    paddingHorizontal: 18,
    paddingVertical: 12,
    fontSize: 14,
    color: '#0F172A',
    fontFamily: M3.fonts.body,
  },
  sendButton: {
    width: 44,
    height: 44,
    borderRadius: M3.shapes.full,
    backgroundColor: M3.colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    ...M3.elevation.level1,
  },
  sendButtonDisabled: {
    backgroundColor: '#CBD5E1',
    opacity: 0.6,
  },
});
