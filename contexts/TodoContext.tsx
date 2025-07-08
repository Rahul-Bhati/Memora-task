import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { Todo, ReminderSettings } from '@/types/todo';
import { loadTodos, saveTodos, loadReminderSettings, saveReminderSettings } from '@/utils/storage';
import { scheduleReminderNotification, cancelReminderNotification } from '@/utils/notifications';

interface TodoState {
  todos: Todo[];
  reminderSettings: ReminderSettings;
  loading: boolean;
}

type TodoAction =
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_TODOS'; payload: Todo[] }
  | { type: 'ADD_TODO'; payload: Todo }
  | { type: 'UPDATE_TODO'; payload: Todo }
  | { type: 'DELETE_TODO'; payload: string }
  | { type: 'TOGGLE_TODO'; payload: string }
  | { type: 'SET_REMINDER_SETTINGS'; payload: ReminderSettings };

const initialState: TodoState = {
  todos: [],
  reminderSettings: { enabled: false, time: '09:00' },
  loading: true,
};

const todoReducer = (state: TodoState, action: TodoAction): TodoState => {
  switch (action.type) {
    case 'SET_LOADING':
      return { ...state, loading: action.payload };
    case 'SET_TODOS':
      return { ...state, todos: action.payload };
    case 'ADD_TODO':
      return { ...state, todos: [...state.todos, action.payload] };
    case 'UPDATE_TODO':
      return {
        ...state,
        todos: state.todos.map(todo =>
          todo.id === action.payload.id ? action.payload : todo
        ),
      };
    case 'DELETE_TODO':
      return {
        ...state,
        todos: state.todos.filter(todo => todo.id !== action.payload),
      };
    case 'TOGGLE_TODO':
      return {
        ...state,
        todos: state.todos.map(todo =>
          todo.id === action.payload
            ? { ...todo, completed: !todo.completed, updatedAt: new Date().toISOString() }
            : todo
        ),
      };
    case 'SET_REMINDER_SETTINGS':
      return { ...state, reminderSettings: action.payload };
    default:
      return state;
  }
};

interface TodoContextType extends TodoState {
  addTodo: (title: string, description?: string) => void;
  updateTodo: (todo: Todo) => void;
  deleteTodo: (id: string) => void;
  toggleTodo: (id: string) => void;
  updateReminderSettings: (settings: ReminderSettings) => void;
}

const TodoContext = createContext<TodoContextType | undefined>(undefined);

export const TodoProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(todoReducer, initialState);

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    if (!state.loading) {
      saveTodos(state.todos);
    }
  }, [state.todos, state.loading]);

  useEffect(() => {
    if (!state.loading) {
      saveReminderSettings(state.reminderSettings);
      updateNotifications();
    }
  }, [state.reminderSettings, state.loading]);

  const loadData = async () => {
    try {
      const [todos, reminderSettings] = await Promise.all([
        loadTodos(),
        loadReminderSettings(),
      ]);
      dispatch({ type: 'SET_TODOS', payload: todos });
      dispatch({ type: 'SET_REMINDER_SETTINGS', payload: reminderSettings });
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  };

  const updateNotifications = async () => {
    try {
      if (state.reminderSettings.enabled) {
        await scheduleReminderNotification(state.reminderSettings.time);
      } else {
        await cancelReminderNotification();
      }
    } catch (error) {
      console.error('Error updating notifications:', error);
    }
  };

  const addTodo = (title: string, description?: string) => {
    const newTodo: Todo = {
      id: Date.now().toString(),
      title,
      description,
      completed: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    dispatch({ type: 'ADD_TODO', payload: newTodo });
  };

  const updateTodo = (todo: Todo) => {
    const updatedTodo = { ...todo, updatedAt: new Date().toISOString() };
    dispatch({ type: 'UPDATE_TODO', payload: updatedTodo });
  };

  const deleteTodo = (id: string) => {
    dispatch({ type: 'DELETE_TODO', payload: id });
  };

  const toggleTodo = (id: string) => {
    dispatch({ type: 'TOGGLE_TODO', payload: id });
  };

  const updateReminderSettings = (settings: ReminderSettings) => {
    dispatch({ type: 'SET_REMINDER_SETTINGS', payload: settings });
  };

  return (
    <TodoContext.Provider
      value={{
        ...state,
        addTodo,
        updateTodo,
        deleteTodo,
        toggleTodo,
        updateReminderSettings,
      }}
    >
      {children}
    </TodoContext.Provider>
  );
};

export const useTodo = () => {
  const context = useContext(TodoContext);
  if (context === undefined) {
    throw new Error('useTodo must be used within a TodoProvider');
  }
  return context;
};