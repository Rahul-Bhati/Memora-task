import React from 'react';
import {
  View,
  Text,
  Switch,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  Alert,
} from 'react-native';
import { Bell, Clock } from 'lucide-react-native';
import { useTodo } from '@/contexts/TodoContext';
import { TimePicker } from '@/components/TimePicker';
import { requestNotificationPermissions } from '@/utils/notifications';

export default function SettingsScreen() {
  const { reminderSettings, updateReminderSettings } = useTodo();

  const handleToggleReminders = async (enabled: boolean) => {
    if (enabled) {
      const hasPermission = await requestNotificationPermissions();
      if (!hasPermission) {
        Alert.alert(
          'Notification Permission Required',
          'Please enable notifications in your device settings to receive daily reminders.',
          [{ text: 'OK' }]
        );
        return;
      }
    }

    updateReminderSettings({
      ...reminderSettings,
      enabled,
    });
  };

  const handleTimeChange = (time: string) => {
    updateReminderSettings({
      ...reminderSettings,
      time,
    });
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Daily Reminders</Text>
        <Text style={styles.subtitle}>Set up notifications to stay on track</Text>
      </View>

      <ScrollView style={styles.content}>
        <View style={styles.section}>
          <View style={styles.settingItem}>
            <View style={styles.settingInfo}>
              <View style={styles.settingHeader}>
                <Bell size={20} color="#3B82F6" />
                <Text style={styles.settingTitle}>Enable Reminders</Text>
              </View>
              <Text style={styles.settingDescription}>
                Get daily notifications to check your task list
              </Text>
            </View>
            <Switch
              value={reminderSettings.enabled}
              onValueChange={handleToggleReminders}
              trackColor={{ false: '#E5E7EB', true: '#93C5FD' }}
              thumbColor={reminderSettings.enabled ? '#3B82F6' : '#F3F4F6'}
            />
          </View>

          {reminderSettings.enabled && (
            <View style={styles.timePickerContainer}>
              <View style={styles.timePickerHeader}>
                <Clock size={20} color="#6B7280" />
                <Text style={styles.timePickerTitle}>Reminder Time</Text>
              </View>
              <TimePicker
                value={reminderSettings.time}
                onChange={handleTimeChange}
              />
              <Text style={styles.timePickerDescription}>
                You'll receive a daily reminder at this time to check your tasks
              </Text>
            </View>
          )}
        </View>

        <View style={styles.infoSection}>
          <Text style={styles.infoTitle}>About Daily Reminders</Text>
          <Text style={styles.infoText}>
            Daily reminders help you stay consistent with your task management. 
            When enabled, you'll receive a notification at your chosen time each day 
            to review and update your task list.
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  header: {
    padding: 16,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: '#111827',
    fontFamily: 'Inter-Bold',
  },
  subtitle: {
    fontSize: 16,
    color: '#6B7280',
    marginTop: 4,
    fontFamily: 'Inter-Regular',
  },
  content: {
    flex: 1,
  },
  section: {
    backgroundColor: '#fff',
    margin: 16,
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
  },
  settingInfo: {
    flex: 1,
    marginRight: 16,
  },
  settingHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 4,
  },
  settingTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111827',
    fontFamily: 'Inter-SemiBold',
  },
  settingDescription: {
    fontSize: 14,
    color: '#6B7280',
    lineHeight: 20,
    fontFamily: 'Inter-Regular',
  },
  timePickerContainer: {
    marginTop: 24,
    paddingTop: 20,
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
  },
  timePickerHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 12,
  },
  timePickerTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#374151',
    fontFamily: 'Inter-SemiBold',
  },
  timePickerDescription: {
    fontSize: 14,
    color: '#6B7280',
    marginTop: 8,
    fontFamily: 'Inter-Regular',
  },
  infoSection: {
    backgroundColor: '#EBF8FF',
    margin: 16,
    marginTop: 0,
    borderRadius: 12,
    padding: 16,
  },
  infoTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1E40AF',
    marginBottom: 8,
    fontFamily: 'Inter-SemiBold',
  },
  infoText: {
    fontSize: 14,
    color: '#1E40AF',
    lineHeight: 20,
    fontFamily: 'Inter-Regular',
  },
});