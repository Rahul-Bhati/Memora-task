import AsyncStorage from '@react-native-async-storage/async-storage';
import { Todo, ReminderSettings } from '@/types/todo';

const TODOS_KEY = '@todos';
const REMINDER_SETTINGS_KEY = '@reminder_settings';

export const saveTodos = async (todos: Todo[]): Promise<void> => {
  try {
    await AsyncStorage.setItem(TODOS_KEY, JSON.stringify(todos));
  } catch (error) {
    console.error('Error saving todos:', error);
  }
};

export const loadTodos = async (): Promise<Todo[]> => {
  try {
    const todosJson = await AsyncStorage.getItem(TODOS_KEY);
    return todosJson ? JSON.parse(todosJson) : [];
  } catch (error) {
    console.error('Error loading todos:', error);
    return [];
  }
};

export const saveReminderSettings = async (settings: ReminderSettings): Promise<void> => {
  try {
    await AsyncStorage.setItem(REMINDER_SETTINGS_KEY, JSON.stringify(settings));
  } catch (error) {
    console.error('Error saving reminder settings:', error);
  }
};

export const loadReminderSettings = async (): Promise<ReminderSettings> => {
  try {
    const settingsJson = await AsyncStorage.getItem(REMINDER_SETTINGS_KEY);
    return settingsJson ? JSON.parse(settingsJson) : { enabled: false, time: '09:00' };
  } catch (error) {
    console.error('Error loading reminder settings:', error);
    return { enabled: false, time: '09:00' };
  }
};