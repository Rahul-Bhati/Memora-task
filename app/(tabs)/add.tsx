import React from 'react';
import { SafeAreaView, StyleSheet, Text, View } from 'react-native';
import { router } from 'expo-router';
import { useTodo } from '@/contexts/TodoContext';
import { TodoForm } from '@/components/TodoForm';

export default function AddTaskScreen() {
  const { addTodo } = useTodo();

  const handleSubmit = (title: string, description?: string) => {
    addTodo(title, description);
    router.push('/');
  };

  const handleCancel = () => {
    router.push('/');
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Add New Task</Text>
        <Text style={styles.subtitle}>Create a new task to stay organized</Text>
      </View>
      <TodoForm
        onSubmit={handleSubmit}
        onCancel={handleCancel}
        submitLabel="Create Task"
      />
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
});