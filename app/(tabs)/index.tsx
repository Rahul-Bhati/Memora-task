import React, { useState } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  Alert,
} from 'react-native';
import { router } from 'expo-router';
import { Filter, SortAsc } from 'lucide-react-native';
import { useTodo } from '@/contexts/TodoContext';
import { TodoItem } from '@/components/TodoItem';
import { Todo } from '@/types/todo';

type FilterType = 'all' | 'pending' | 'completed';
type SortType = 'newest' | 'oldest' | 'alphabetical';

export default function TodoListScreen() {
  const { todos, loading, toggleTodo, deleteTodo } = useTodo();
  const [filter, setFilter] = useState<FilterType>('all');
  const [sort, setSort] = useState<SortType>('newest');

  const handleDelete = (id: string) => {
    Alert.alert(
      'Delete Task',
      'Are you sure you want to delete this task?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Delete', style: 'destructive', onPress: () => deleteTodo(id) },
      ]
    );
  };

  const handleEdit = (todo: Todo) => {
    router.push(`/task/${todo.id}`);
  };

  const getFilteredAndSortedTodos = () => {
    let filteredTodos = todos;

    // Apply filter
    switch (filter) {
      case 'pending':
        filteredTodos = todos.filter(todo => !todo.completed);
        break;
      case 'completed':
        filteredTodos = todos.filter(todo => todo.completed);
        break;
      default:
        filteredTodos = todos;
    }

    // Apply sort
    switch (sort) {
      case 'oldest':
        return filteredTodos.sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
      case 'alphabetical':
        return filteredTodos.sort((a, b) => a.title.localeCompare(b.title));
      default: // newest
        return filteredTodos.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    }
  };

  const filteredTodos = getFilteredAndSortedTodos();
  const pendingCount = todos.filter(todo => !todo.completed).length;
  const completedCount = todos.filter(todo => todo.completed).length;

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>Loading tasks...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>My Tasks</Text>
        <View style={styles.stats}>
          <Text style={styles.statText}>
            {pendingCount} pending • {completedCount} completed
          </Text>
        </View>
      </View>

      <View style={styles.controls}>
        <View style={styles.filterContainer}>
          <Filter size={16} color="#6B7280" />
          <TouchableOpacity
            style={[styles.filterButton, filter === 'all' && styles.activeFilter]}
            onPress={() => setFilter('all')}
          >
            <Text style={[styles.filterText, filter === 'all' && styles.activeFilterText]}>
              All
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.filterButton, filter === 'pending' && styles.activeFilter]}
            onPress={() => setFilter('pending')}
          >
            <Text style={[styles.filterText, filter === 'pending' && styles.activeFilterText]}>
              Pending
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.filterButton, filter === 'completed' && styles.activeFilter]}
            onPress={() => setFilter('completed')}
          >
            <Text style={[styles.filterText, filter === 'completed' && styles.activeFilterText]}>
              Done
            </Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity
          style={styles.sortButton}
          onPress={() => {
            const sortOptions: SortType[] = ['newest', 'oldest', 'alphabetical'];
            const currentIndex = sortOptions.indexOf(sort);
            const nextIndex = (currentIndex + 1) % sortOptions.length;
            setSort(sortOptions[nextIndex]);
          }}
        >
          <SortAsc size={16} color="#6B7280" />
          <Text style={styles.sortText}>
            {sort === 'newest' ? 'Newest' : sort === 'oldest' ? 'Oldest' : 'A-Z'}
          </Text>
        </TouchableOpacity>
      </View>

      {filteredTodos.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyTitle}>
            {filter === 'all' ? 'No tasks yet' : 
             filter === 'pending' ? 'No pending tasks' : 'No completed tasks'}
          </Text>
          <Text style={styles.emptySubtitle}>
            {filter === 'all' ? 'Tap "Add Task" to create your first task' :
             filter === 'pending' ? 'All tasks are completed!' : 'Complete some tasks to see them here'}
          </Text>
        </View>
      ) : (
        <FlatList
          data={filteredTodos}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <TodoItem
              todo={item}
              onToggle={toggleTodo}
              onEdit={handleEdit}
              onDelete={handleDelete}
            />
          )}
          contentContainerStyle={styles.listContainer}
          showsVerticalScrollIndicator={false}
        />
      )}
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
  stats: {
    marginTop: 4,
  },
  statText: {
    fontSize: 14,
    color: '#6B7280',
    fontFamily: 'Inter-Regular',
  },
  controls: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  filterContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  filterButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    backgroundColor: '#F3F4F6',
  },
  activeFilter: {
    backgroundColor: '#3B82F6',
  },
  filterText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#6B7280',
    fontFamily: 'Inter-SemiBold',
  },
  activeFilterText: {
    color: '#fff',
  },
  sortButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  sortText: {
    fontSize: 14,
    color: '#6B7280',
    fontFamily: 'Inter-Regular',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 32,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 8,
    fontFamily: 'Inter-SemiBold',
  },
  emptySubtitle: {
    fontSize: 16,
    color: '#6B7280',
    textAlign: 'center',
    lineHeight: 24,
    fontFamily: 'Inter-Regular',
  },
  listContainer: {
    paddingBottom: 100,
  },
});