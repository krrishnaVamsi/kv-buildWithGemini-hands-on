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

  const handleSend = async () => {
    const text = inputVal.trim();
    if (!text) return;

    const userMsg: Message = {
      id: `msg-${Date.now()}`,
      sender: 'user',
      text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputVal('');

    if (currentStep === 'ask_subject') {
      setSubject(text);
      setCurrentStep('ask_days');
      setTimeout(() => {
        setMessages((prev) => [
          ...prev,
          {
            id: `msg-ai-${Date.now()}`,
            sender: 'ai',
            text: `Super! "${text}" is an awesome goal. 🚀\n\nHow many days per week can you allocate for studying? (e.g. 4, 5, 6, 7 days)`,
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          },
        ]);
      }, 500);
    } else if (currentStep === 'ask_days') {
      const days = parseInt(text.replace(/[^0-9]/g, '')) || 5;
      const clampedDays = Math.max(1, Math.min(7, days));
      setDaysPerWeek(clampedDays);
      setCurrentStep('ask_hours');
      setTimeout(() => {
        setMessages((prev) => [
          ...prev,
          {
            id: `msg-ai-${Date.now()}`,
            sender: 'ai',
            text: `Got it! ${clampedDays} days a week. ⏰\n\nHow many hours per day can you study focused without checking reels or Instagram? (e.g. 2, 3, 4, 6 hours)`,
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          },
        ]);
      }, 500);
    } else if (currentStep === 'ask_hours') {
      const hours = parseInt(text.replace(/[^0-9]/g, '')) || 3;
      const clampedHours = Math.max(1, Math.min(16, hours));
      setHoursPerDay(clampedHours);
      setCurrentStep('ask_months');
      setTimeout(() => {
        setMessages((prev) => [
          ...prev,
          {
            id: `msg-ai-${Date.now()}`,
            sender: 'ai',
            text: `Perfect dedication: ${clampedHours} hours/day! 🎯\n\nFinally, how many months is your target timeline to achieve complete mastery? (e.g. 1, 2, 3, 6 months)`,
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          },
        ]);
      }, 500);
    } else if (currentStep === 'ask_months') {
      const months = parseInt(text.replace(/[^0-9]/g, '')) || 2;
      const clampedMonths = Math.max(1, Math.min(12, months));
      setTargetMonths(clampedMonths);
      setCurrentStep('generating');
      setLoading(true);

      const generatingMsg: Message = {
        id: `msg-ai-gen-${Date.now()}`,
        sender: 'ai',
        text: `Creating your custom calendar for "${subject}" (${clampedMonths} months, ${daysPerWeek} days/wk, ${hoursPerDay} hrs/day)... "Chadavukondi Firstu!" 🧠⚡`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages((prev) => [...prev, generatingMsg]);

      try {
        const plan = await generateStudyPlanWithGemini({
          subject,
          daysPerWeek,
          hoursPerDay,
          targetMonths: clampedMonths,
        });

        await savePlan(plan);
        setLoading(false);
        setCurrentStep('done');

        setMessages((prev) => [
          ...prev,
          {
            id: `msg-ai-done-${Date.now()}`,
            sender: 'ai',
            text: `🎉 Your personalized schedule for "${subject}" is ready with ${plan.weeks.length} weeks and ${plan.weeks.reduce((acc, w) => acc + w.days.reduce((da, d) => da + d.topics.length, 0), 0)} scheduled topics!`,
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          },
        ]);

        setTimeout(() => {
          onPlanCreated(plan);
        }, 1200);
      } catch (err) {
        setLoading(false);
        console.error('Plan generation failed:', err);
      }
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      style={styles.container}
    >
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={onBack}>
          <Ionicons name="arrow-back" size={24} color="#0F172A" />
        </TouchableOpacity>
        <View style={styles.headerInfo}>
          <Text style={styles.headerTitle}>Study Planner Assistant</Text>
          <Text style={styles.headerSubtitle}>చదువుకోండి ఫస్టు Bot • AI Ready</Text>
        </View>
      </View>

      {/* Messages */}
      <ScrollView style={styles.messagesScroll} contentContainerStyle={styles.messagesContent}>
        {messages.map((m) => (
          <View
            key={m.id}
            style={[styles.bubbleWrapper, m.sender === 'user' ? styles.userWrapper : styles.aiWrapper]}
          >
            {m.sender === 'ai' && (
              <View style={styles.avatar}>
                <Ionicons name="sparkles" size={16} color="#FFFFFF" />
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
                  m.sender === 'user' ? styles.userBubbleText : styles.aiBubbleText,
                ]}
              >
                {m.text}
              </Text>
              <Text
                style={[
                  styles.timestampText,
                  m.sender === 'user' ? styles.userTimestamp : styles.aiTimestamp,
                ]}
              >
                {m.timestamp}
              </Text>
            </View>
          </View>
        ))}

        {loading && (
          <View style={styles.loadingBox}>
            <ActivityIndicator size="small" color="#4F46E5" />
            <Text style={styles.loadingText}>Crafting syllabus & allocating hours...</Text>
          </View>
        )}
      </ScrollView>

      {/* Input bar */}
      <View style={styles.inputBar}>
        <TextInput
          style={styles.input}
          placeholder={
            currentStep === 'ask_subject'
              ? 'e.g. Full Stack Web Development, UPSC, Python'
              : currentStep === 'ask_days'
              ? 'e.g. 5 days per week'
              : currentStep === 'ask_hours'
              ? 'e.g. 3 hours per day'
              : currentStep === 'ask_months'
              ? 'e.g. 2 months'
              : 'Type your message...'
          }
          placeholderTextColor="#94A3B8"
          value={inputVal}
          onChangeText={setInputVal}
          onSubmitEditing={handleSend}
          editable={!loading && currentStep !== 'done'}
        />
        <TouchableOpacity
          style={[styles.sendBtn, (!inputVal.trim() || loading) && styles.sendBtnDisabled]}
          onPress={handleSend}
          disabled={!inputVal.trim() || loading}
        >
          <Ionicons name="send" size={18} color="#FFFFFF" />
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
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
  headerInfo: {
    flex: 1,
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#0F172A',
  },
  headerSubtitle: {
    fontSize: 12,
    color: '#64748B',
  },
  messagesScroll: {
    flex: 1,
  },
  messagesContent: {
    padding: 16,
    gap: 12,
  },
  bubbleWrapper: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: 8,
  },
  userWrapper: {
    justifyContent: 'flex-end',
  },
  aiWrapper: {
    justifyContent: 'flex-start',
  },
  avatar: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#4F46E5',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 4,
  },
  bubble: {
    maxWidth: '82%',
    padding: 12,
    borderRadius: 16,
  },
  aiBubble: {
    backgroundColor: '#FFFFFF',
    borderBottomLeftRadius: 4,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  userBubble: {
    backgroundColor: '#4F46E5',
    borderBottomRightRadius: 4,
  },
  bubbleText: {
    fontSize: 14,
    lineHeight: 20,
  },
  aiBubbleText: {
    color: '#1E293B',
  },
  userBubbleText: {
    color: '#FFFFFF',
  },
  timestampText: {
    fontSize: 10,
    marginTop: 4,
    alignSelf: 'flex-end',
  },
  aiTimestamp: {
    color: '#94A3B8',
  },
  userTimestamp: {
    color: '#E0E7FF',
  },
  loadingBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    padding: 12,
    backgroundColor: '#EEF2FF',
    borderRadius: 12,
    alignSelf: 'flex-start',
  },
  loadingText: {
    fontSize: 13,
    color: '#4338CA',
    fontWeight: '500',
  },
  inputBar: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#E2E8F0',
    gap: 10,
  },
  input: {
    flex: 1,
    backgroundColor: '#F1F5F9',
    borderRadius: 24,
    paddingHorizontal: 16,
    paddingVertical: 10,
    fontSize: 14,
    color: '#0F172A',
  },
  sendBtn: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: '#4F46E5',
    justifyContent: 'center',
    alignItems: 'center',
  },
  sendBtnDisabled: {
    backgroundColor: '#94A3B8',
  },
});
