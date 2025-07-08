import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, SafeAreaView, Alert } from 'react-native';
import { useLocalSearchParams, router } from 'expo-router';
import { useTodo } from '@/contexts/TodoContext';
import { TodoForm } from '@/components/TodoForm';
import { Todo } from '@/types/todo';

export default function TaskDetailScreen() {
  const { id } = useLocalSearchParams();
  const { todos, updateTodo, deleteTodo } = useTodo();
  const [task, setTask] = useState<Todo | null>(null);

  useEffect(() => {
    const foundTask = todos.find(todo => todo.id === id);
    if (foundTask) {
      setTask(foundTask);
    } else {
      // Task not found, redirect back
      router.back();
    }
  }, [id, todos]);

  const handleUpdate = (title: string, description?: string) => {
    if (!task) return;

    const updatedTask: Todo = {
      ...task,
      title,
      description,
    };

    updateTodo(updatedTask);
    router.back();
  };

  const handleDelete = () => {
    if (!task) return;

    Alert.alert(
      'Delete Task',
      'Are you sure you want to delete this task? This action cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => {
            deleteTodo(task.id);
            router.back();
          },
        },
      ]
    );
  };

  const handleCancel = () => {
    router.back();
  };

  if (!task) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>Loading task...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Edit Task</Text>
        <Text style={styles.subtitle}>
          Created: {new Date(task.createdAt).toLocaleDateString()}
        </Text>
        {task.updatedAt !== task.createdAt && (
          <Text style={styles.subtitle}>
            Updated: {new Date(task.updatedAt).toLocaleDateString()}
          </Text>
        )}
        <View style={styles.statusContainer}>
          <View style={[styles.statusBadge, task.completed && styles.completedBadge]}>
            <Text style={[styles.statusText, task.completed && styles.completedStatusText]}>
              {task.completed ? 'Completed' : 'Pending'}
            </Text>
          </View>
        </View>
      </View>

      <TodoForm
        todo={task}
        onSubmit={handleUpdate}
        onCancel={handleCancel}
        submitLabel="Update Task"
      />

      <View style={styles.dangerZone}>
        <Text style={styles.dangerTitle}>Danger Zone</Text>
        <View style={styles.dangerContent}>
          <Text style={styles.dangerDescription}>
            Once you delete this task, there is no going back. Please be certain.
          </Text>
          <View style={styles.deleteButtonContainer}>
            <View style={styles.deleteButton}>
              <Text 
                style={styles.deleteButtonText}
                onPress={handleDelete}
              >
                Delete Task
              </Text>
            </View>
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 16,
    color: '#6B7280',
    fontFamily: 'Inter-Regular',
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
    fontSize: 14,
    color: '#6B7280',
    marginTop: 4,
    fontFamily: 'Inter-Regular',
  },
  statusContainer: {
    marginTop: 12,
  },
  statusBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
    backgroundColor: '#FEF3C7',
  },
  completedBadge: {
    backgroundColor: '#D1FAE5',
  },
  statusText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#92400E',
    fontFamily: 'Inter-SemiBold',
  },
  completedStatusText: {
    color: '#065F46',
  },
  dangerZone: {
    margin: 16,
    backgroundColor: '#fff',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#FCA5A5',
    overflow: 'hidden',
  },
  dangerTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#DC2626',
    padding: 16,
    backgroundColor: '#FEF2F2',
    borderBottomWidth: 1,
    borderBottomColor: '#FCA5A5',
    fontFamily: 'Inter-SemiBold',
  },
  dangerContent: {
    padding: 16,
  },
  dangerDescription: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 16,
    lineHeight: 20,
    fontFamily: 'Inter-Regular',
  },
  deleteButtonContainer: {
    alignItems: 'flex-start',
  },
  deleteButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: '#DC2626',
    borderRadius: 6,
  },
  deleteButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#fff',
    fontFamily: 'Inter-SemiBold',
  },
});