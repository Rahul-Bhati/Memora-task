import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';

const REMINDER_NOTIFICATION_ID = 'daily-reminder';

// Configure notification behavior
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

export const requestNotificationPermissions = async (): Promise<boolean> => {
  if (Platform.OS === 'web') {
    return true; // Web doesn't need permissions for local notifications
  }

  const { status: existingStatus } = await Notifications.getPermissionsAsync();
  let finalStatus = existingStatus;

  if (existingStatus !== 'granted') {
    const { status } = await Notifications.requestPermissionsAsync();
    finalStatus = status;
  }

  return finalStatus === 'granted';
};

export const scheduleReminderNotification = async (time: string): Promise<void> => {
  try {
    // Cancel existing reminder
    await cancelReminderNotification();

    // Request permissions
    const hasPermission = await requestNotificationPermissions();
    if (!hasPermission) {
      console.warn('Notification permissions not granted');
      return;
    }

    // Parse time (HH:MM format)
    const [hours, minutes] = time.split(':').map(Number);

    // Schedule daily notification
    await Notifications.scheduleNotificationAsync({
      identifier: REMINDER_NOTIFICATION_ID,
      content: {
        title: 'Daily Task Reminder',
        body: 'Don\'t forget to check your todo list!',
        data: { screen: 'todos' },
      },
      trigger: {
        hour: hours,
        minute: minutes,
        repeats: true,
      },
    });

    console.log(`Daily reminder scheduled for ${time}`);
  } catch (error) {
    console.error('Error scheduling notification:', error);
  }
};

export const cancelReminderNotification = async (): Promise<void> => {
  try {
    await Notifications.cancelScheduledNotificationAsync(REMINDER_NOTIFICATION_ID);
    console.log('Daily reminder cancelled');
  } catch (error) {
    console.error('Error cancelling notification:', error);
  }
};