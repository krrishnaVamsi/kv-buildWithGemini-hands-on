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
      text: 'నమస్కారం! Welcome to Chadavukondi Firstu! 📚🔥\n\nWhat subject, skill, or competitive exam would you like to build an unbeatable study plan for?',
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
          text: `Awesome! "${text}" is a great goal. 🗓️\n\nHow many days per week can you allocate for focused study? (e.g., 3 to 7 days)`,
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
          text: `Got it: ${validDays} days per week. ⏰\n\nHow many hours can you dedicate each study day? (e.g., 1 to 8 hours)`,
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
          text: `Perfect: ${validHours} hours per day. 🎯\n\nIn how many months do you aim to master this topic? (e.g., 1, 2, or 3 months)`,
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
        text: `“ఇంకా మాట్లాడకండి, చదువుకోండి ఫస్టు!” 🚀\n\nCreating your personalized study calendar for "${subject}" (${validMonths} months, ${daysPerWeek} days/wk, ${hoursPerDay} hrs/day)...`,
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
            text: `Error generating plan: ${err.message || 'Unknown error'}. Please try again.`,
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
        {/* M3 Top App Bar */}
        <View style={styles.topAppBar}>
          <TouchableOpacity style={styles.iconButton} onPress={onBack} activeOpacity={0.7}>
            <Ionicons name="arrow-back" size={24} color={M3.colors.onSurface} />
          </TouchableOpacity>
          <View style={styles.headerInfo}>
            <Text style={styles.headerTitle}>AI Study Planner</Text>
            <Text style={styles.headerSubtitle}>Material You Assistant</Text>
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
                  <Ionicons name="school" size={16} color={M3.colors.primary} />
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
              <Text style={styles.loadingText}>Synthesizing syllabus roadmap...</Text>
            </View>
          )}
        </ScrollView>

        {/* M3 Quick Suggestion Chips */}
        {currentStep === 'ask_days' && (
          <View style={styles.chipsRow}>
            {['3 Days', '4 Days', '5 Days', '6 Days', '7 Days'].map((d) => (
              <TouchableOpacity
                key={d}
                style={styles.suggestionChip}
                onPress={() => handleSend(d)}
                activeOpacity={0.8}
              >
                <Text style={styles.suggestionChipText}>{d}</Text>
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
                <Text style={styles.suggestionChipText}>{h}</Text>
              </TouchableOpacity>
            ))}
          </View>
        )}

        {currentStep === 'ask_months' && (
          <View style={styles.chipsRow}>
            {['1 Month', '2 Months', '3 Months', '6 Months'].map((m) => (
              <TouchableOpacity
                key={m}
                style={styles.suggestionChip}
                onPress={() => handleSend(m)}
                activeOpacity={0.8}
              >
                <Text style={styles.suggestionChipText}>{m}</Text>
              </TouchableOpacity>
            ))}
          </View>
        )}

        {/* M3 Bottom Dock Input */}
        <View style={styles.bottomDock}>
          <TextInput
            style={styles.dockInput}
            placeholder={
              currentStep === 'ask_subject'
                ? 'e.g. Python, UPSC, React Native...'
                : 'Type your answer...'
            }
            placeholderTextColor={M3.colors.onSurfaceVariant}
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
            <Ionicons name="arrow-up" size={22} color={M3.colors.onPrimary} />
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
  headerInfo: {
    flex: 1,
  },
  headerTitle: {
    ...M3.typography.titleLarge,
    color: M3.colors.onSurface,
  },
  headerSubtitle: {
    ...M3.typography.bodySmall,
    color: M3.colors.onSurfaceVariant,
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
    width: 32,
    height: 32,
    borderRadius: M3.shapes.full,
    backgroundColor: M3.colors.primaryContainer,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 4,
  },
  bubble: {
    maxWidth: '82%',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  // Asymmetric M3 bubble corners
  aiBubble: {
    backgroundColor: M3.colors.surfaceContainerHigh,
    borderTopLeftRadius: M3.shapes.large,
    borderTopRightRadius: M3.shapes.large,
    borderBottomRightRadius: M3.shapes.large,
    borderBottomLeftRadius: M3.shapes.extraSmall,
  },
  userBubble: {
    backgroundColor: M3.colors.primary,
    borderTopLeftRadius: M3.shapes.large,
    borderTopRightRadius: M3.shapes.large,
    borderBottomLeftRadius: M3.shapes.large,
    borderBottomRightRadius: M3.shapes.extraSmall,
  },
  bubbleText: {
    ...M3.typography.bodyMedium,
    lineHeight: 22,
  },
  aiText: {
    color: M3.colors.onSurface,
  },
  userText: {
    color: M3.colors.onPrimary,
  },
  timestamp: {
    fontSize: 10,
    marginTop: 4,
  },
  aiTimestamp: {
    color: M3.colors.onSurfaceVariant,
    textAlign: 'left',
  },
  userTimestamp: {
    color: '#D8DBFF',
    textAlign: 'right',
  },
  loadingCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: M3.colors.primaryContainer,
    padding: 14,
    borderRadius: M3.shapes.large,
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
    backgroundColor: M3.colors.surfaceContainerHigh,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: M3.shapes.full,
    borderWidth: 1,
    borderColor: M3.colors.outlineVariant,
  },
  suggestionChipText: {
    ...M3.typography.labelSmall,
    color: M3.colors.primary,
    fontWeight: '700',
  },
  bottomDock: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: M3.colors.surface,
    borderTopWidth: 1,
    borderTopColor: M3.colors.outlineVariant,
    gap: 10,
  },
  dockInput: {
    flex: 1,
    backgroundColor: M3.colors.surfaceContainerHighest,
    borderRadius: M3.shapes.full,
    paddingHorizontal: 18,
    paddingVertical: 12,
    fontSize: 14,
    color: M3.colors.onSurface,
  },
  sendButton: {
    width: 46,
    height: 46,
    borderRadius: M3.shapes.full,
    backgroundColor: M3.colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    ...M3.elevation.level1,
  },
  sendButtonDisabled: {
    backgroundColor: M3.colors.surfaceContainerHighest,
    opacity: 0.5,
  },
});
