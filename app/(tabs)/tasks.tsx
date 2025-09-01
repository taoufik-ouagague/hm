import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Animated, { 
  useSharedValue, 
  useAnimatedStyle, 
  withTiming, 
  withSpring,
  runOnJS,
  withSequence,
  interpolate
} from 'react-native-reanimated';
import { 
  Plus, 
  Check, 
  Trash2, 
  Clock, 
  Flag,
  Search,
  Filter
} from 'lucide-react-native';

interface Task {
  id: string;
  title: string;
  completed: boolean;
  priority: 'low' | 'medium' | 'high';
  createdAt: Date;
}

export default function TasksScreen() {
  const [tasks, setTasks] = useState<Task[]>([
    {
      id: '1',
      title: 'Review project proposal',
      completed: false,
      priority: 'high',
      createdAt: new Date()
    },
    {
      id: '2',
      title: 'Update team documentation',
      completed: true,
      priority: 'medium',
      createdAt: new Date()
    },
    {
      id: '3',
      title: 'Plan next sprint',
      completed: false,
      priority: 'low',
      createdAt: new Date()
    }
  ]);
  
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const fadeAnim = useSharedValue(0);

  useEffect(() => {
    fadeAnim.value = withTiming(1, { duration: 600 });
  }, []);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: fadeAnim.value,
  }));

  const addTask = () => {
    if (newTaskTitle.trim()) {
      const newTask: Task = {
        id: Date.now().toString(),
        title: newTaskTitle.trim(),
        completed: false,
        priority: 'medium',
        createdAt: new Date()
      };
      setTasks([newTask, ...tasks]);
      setNewTaskTitle('');
    }
  };

  const toggleTask = (id: string) => {
    setTasks(tasks.map(task => 
      task.id === id ? { ...task, completed: !task.completed } : task
    ));
  };

  const deleteTask = (id: string) => {
    setTasks(tasks.filter(task => task.id !== id));
  };

  const filteredTasks = tasks.filter(task =>
    task.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const completedCount = tasks.filter(task => task.completed).length;
  const totalCount = tasks.length;

  return (
    <SafeAreaView style={styles.container}>
      <Animated.View style={[styles.content, animatedStyle]}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>Tasks</Text>
          <Text style={styles.subtitle}>
            {completedCount} of {totalCount} completed
          </Text>
        </View>

        {/* Progress Bar */}
        <ProgressBar completed={completedCount} total={totalCount} />

        {/* Search */}
        <View style={styles.searchContainer}>
          <Search size={20} color="#9ca3af" style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search tasks..."
            value={searchQuery}
            onChangeText={setSearchQuery}
            placeholderTextColor="#9ca3af"
          />
          <TouchableOpacity style={styles.filterButton}>
            <Filter size={20} color="#6366f1" />
          </TouchableOpacity>
        </View>

        {/* Add Task */}
        <View style={styles.addTaskContainer}>
          <TextInput
            style={styles.addTaskInput}
            placeholder="Add a new task..."
            value={newTaskTitle}
            onChangeText={setNewTaskTitle}
            onSubmitEditing={addTask}
            placeholderTextColor="#9ca3af"
          />
          <TouchableOpacity style={styles.addButton} onPress={addTask}>
            <Plus size={24} color="white" />
          </TouchableOpacity>
        </View>

        {/* Tasks List */}
        <ScrollView style={styles.tasksList} showsVerticalScrollIndicator={false}>
          {filteredTasks.map((task, index) => (
            <TaskItem
              key={task.id}
              task={task}
              index={index}
              onToggle={() => toggleTask(task.id)}
              onDelete={() => deleteTask(task.id)}
            />
          ))}
        </ScrollView>
      </Animated.View>
    </SafeAreaView>
  );
}

function ProgressBar({ completed, total }: { completed: number; total: number }) {
  const progress = useSharedValue(0);
  const targetProgress = total > 0 ? completed / total : 0;

  useEffect(() => {
    progress.value = withSpring(targetProgress, { damping: 15 });
  }, [targetProgress]);

  const animatedStyle = useAnimatedStyle(() => ({
    width: `${progress.value * 100}%`,
  }));

  return (
    <View style={styles.progressContainer}>
      <View style={styles.progressBar}>
        <Animated.View style={[styles.progressFill, animatedStyle]} />
      </View>
      <Text style={styles.progressText}>
        {Math.round(targetProgress * 100)}% Complete
      </Text>
    </View>
  );
}

function TaskItem({ task, index, onToggle, onDelete }: {
  task: Task;
  index: number;
  onToggle: () => void;
  onDelete: () => void;
}) {
  const translateX = useSharedValue(-50);
  const opacity = useSharedValue(0);
  const scale = useSharedValue(0.9);

  useEffect(() => {
    const delay = index * 100;
    opacity.value = withDelay(delay, withTiming(1, { duration: 500 }));
    translateX.value = withDelay(delay, withSpring(0, { damping: 15 }));
    scale.value = withDelay(delay, withSpring(1, { damping: 12 }));
  }, []);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [
      { translateX: translateX.value },
      { scale: scale.value }
    ]
  }));

  const handleToggle = () => {
    scale.value = withSequence(
      withTiming(0.95, { duration: 100 }),
      withTiming(1, { duration: 100 })
    );
    runOnJS(onToggle)();
  };

  const handleDelete = () => {
    opacity.value = withTiming(0, { duration: 300 });
    translateX.value = withTiming(50, { duration: 300 });
    setTimeout(() => onDelete(), 300);
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return '#ef4444';
      case 'medium': return '#f59e0b';
      case 'low': return '#10b981';
      default: return '#6b7280';
    }
  };

  return (
    <Animated.View style={[styles.taskItem, animatedStyle]}>
      <TouchableOpacity style={styles.taskContent} onPress={handleToggle}>
        <View style={[
          styles.checkbox,
          task.completed && styles.checkboxCompleted
        ]}>
          {task.completed && <Check size={16} color="white" />}
        </View>
        <View style={styles.taskDetails}>
          <Text style={[
            styles.taskTitle,
            task.completed && styles.taskTitleCompleted
          ]}>
            {task.title}
          </Text>
          <View style={styles.taskMeta}>
            <View style={[styles.priorityDot, { backgroundColor: getPriorityColor(task.priority) }]} />
            <Text style={styles.taskPriority}>{task.priority} priority</Text>
            <Clock size={12} color="#9ca3af" style={{ marginLeft: 8 }} />
            <Text style={styles.taskTime}>
              {task.createdAt.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </Text>
          </View>
        </View>
      </TouchableOpacity>
      <TouchableOpacity style={styles.deleteButton} onPress={handleDelete}>
        <Trash2 size={18} color="#ef4444" />
      </TouchableOpacity>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  content: {
    flex: 1,
    padding: 20,
  },
  header: {
    marginBottom: 20,
  },
  title: {
    fontSize: 32,
    fontFamily: 'Inter-Bold',
    color: '#1f2937',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: '#6b7280',
  },
  progressContainer: {
    marginBottom: 24,
  },
  progressBar: {
    height: 8,
    backgroundColor: '#e5e7eb',
    borderRadius: 4,
    overflow: 'hidden',
    marginBottom: 8,
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#6366f1',
    borderRadius: 4,
  },
  progressText: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    color: '#6b7280',
    textAlign: 'center',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    borderRadius: 12,
    paddingHorizontal: 16,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  searchIcon: {
    marginRight: 12,
  },
  searchInput: {
    flex: 1,
    height: 48,
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: '#1f2937',
  },
  filterButton: {
    padding: 8,
  },
  addTaskContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
  },
  addTaskInput: {
    flex: 1,
    height: 48,
    backgroundColor: 'white',
    borderRadius: 12,
    paddingHorizontal: 16,
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: '#1f2937',
    marginRight: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  addButton: {
    width: 48,
    height: 48,
    backgroundColor: '#6366f1',
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  tasksList: {
    flex: 1,
  },
  taskItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  taskContent: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#d1d5db',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  checkboxCompleted: {
    backgroundColor: '#6366f1',
    borderColor: '#6366f1',
  },
  taskDetails: {
    flex: 1,
  },
  taskTitle: {
    fontSize: 16,
    fontFamily: 'Inter-Medium',
    color: '#1f2937',
    marginBottom: 4,
  },
  taskTitleCompleted: {
    textDecorationLine: 'line-through',
    color: '#9ca3af',
  },
  taskMeta: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  priorityDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 6,
  },
  taskPriority: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: '#6b7280',
    textTransform: 'capitalize',
  },
  taskTime: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: '#9ca3af',
    marginLeft: 4,
  },
  deleteButton: {
    padding: 8,
  },
});