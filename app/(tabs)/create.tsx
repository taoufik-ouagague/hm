import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Animated, { 
  useSharedValue, 
  useAnimatedStyle, 
  withTiming, 
  withSpring,
  withSequence,
  interpolate
} from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';
import { 
  Plus, 
  Calendar, 
  Clock, 
  Flag, 
  Tag,
  Save,
  X,
  CheckCircle
} from 'lucide-react-native';

export default function CreateScreen() {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState<'low' | 'medium' | 'high'>('medium');
  const [category, setCategory] = useState('work');
  const [showSuccess, setShowSuccess] = useState(false);

  const fadeAnim = useSharedValue(0);
  const slideAnim = useSharedValue(30);
  const successScale = useSharedValue(0);

  useEffect(() => {
    fadeAnim.value = withTiming(1, { duration: 600 });
    slideAnim.value = withSpring(0, { damping: 15 });
  }, []);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: fadeAnim.value,
    transform: [{ translateY: slideAnim.value }]
  }));

  const successAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: successScale.value }],
    opacity: interpolate(successScale.value, [0, 1], [0, 1])
  }));

  const handleSave = () => {
    if (title.trim()) {
      // Show success animation
      setShowSuccess(true);
      successScale.value = withSequence(
        withSpring(1.2, { damping: 10 }),
        withSpring(1, { damping: 15 })
      );

      // Reset form after delay
      setTimeout(() => {
        setTitle('');
        setDescription('');
        setPriority('medium');
        setCategory('work');
        setShowSuccess(false);
        successScale.value = 0;
      }, 2000);
    }
  };

  const handleCancel = () => {
    setTitle('');
    setDescription('');
    setPriority('medium');
    setCategory('work');
  };

  const priorities = [
    { value: 'low', label: 'Low', color: '#10b981' },
    { value: 'medium', label: 'Medium', color: '#f59e0b' },
    { value: 'high', label: 'High', color: '#ef4444' }
  ];

  const categories = [
    { value: 'work', label: 'Work', icon: '💼' },
    { value: 'personal', label: 'Personal', icon: '🏠' },
    { value: 'health', label: 'Health', icon: '💪' },
    { value: 'learning', label: 'Learning', icon: '📚' }
  ];

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <Animated.View style={[styles.content, animatedStyle]}>
          {/* Header */}
          <LinearGradient
            colors={['#6366f1', '#8b5cf6']}
            style={styles.headerGradient}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
          >
            <Text style={styles.headerTitle}>Create New Task</Text>
            <Text style={styles.headerSubtitle}>Add a new item to your productivity list</Text>
          </LinearGradient>

          {/* Form */}
          <View style={styles.form}>
            {/* Title Input */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Task Title</Text>
              <TextInput
                style={styles.input}
                placeholder="Enter task title..."
                value={title}
                onChangeText={setTitle}
                placeholderTextColor="#9ca3af"
              />
            </View>

            {/* Description Input */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Description</Text>
              <TextInput
                style={[styles.input, styles.textArea]}
                placeholder="Add details about your task..."
                value={description}
                onChangeText={setDescription}
                multiline
                numberOfLines={4}
                placeholderTextColor="#9ca3af"
              />
            </View>

            {/* Priority Selection */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Priority</Text>
              <View style={styles.priorityContainer}>
                {priorities.map((p) => (
                  <PriorityButton
                    key={p.value}
                    priority={p}
                    selected={priority === p.value}
                    onPress={() => setPriority(p.value as any)}
                  />
                ))}
              </View>
            </View>

            {/* Category Selection */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Category</Text>
              <View style={styles.categoryContainer}>
                {categories.map((c) => (
                  <CategoryButton
                    key={c.value}
                    category={c}
                    selected={category === c.value}
                    onPress={() => setCategory(c.value)}
                  />
                ))}
              </View>
            </View>

            {/* Action Buttons */}
            <View style={styles.actionButtons}>
              <TouchableOpacity style={styles.cancelButton} onPress={handleCancel}>
                <X size={20} color="#6b7280" />
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
                <Save size={20} color="white" />
                <Text style={styles.saveButtonText}>Save Task</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Success Overlay */}
          {showSuccess && (
            <Animated.View style={[styles.successOverlay, successAnimatedStyle]}>
              <View style={styles.successContent}>
                <CheckCircle size={48} color="#10b981" />
                <Text style={styles.successText}>Task Created!</Text>
              </View>
            </Animated.View>
          )}
        </Animated.View>
      </ScrollView>
    </SafeAreaView>
  );
}

function PriorityButton({ priority, selected, onPress }: {
  priority: { value: string; label: string; color: string };
  selected: boolean;
  onPress: () => void;
}) {
  const scale = useSharedValue(1);

  const handlePress = () => {
    scale.value = withSequence(
      withTiming(0.95, { duration: 100 }),
      withTiming(1, { duration: 100 })
    );
    onPress();
  };

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }]
  }));

  return (
    <Animated.View style={animatedStyle}>
      <TouchableOpacity
        style={[
          styles.priorityButton,
          selected && { backgroundColor: priority.color }
        ]}
        onPress={handlePress}
      >
        <Flag size={16} color={selected ? 'white' : priority.color} />
        <Text style={[
          styles.priorityText,
          selected && { color: 'white' }
        ]}>
          {priority.label}
        </Text>
      </TouchableOpacity>
    </Animated.View>
  );
}

function CategoryButton({ category, selected, onPress }: {
  category: { value: string; label: string; icon: string };
  selected: boolean;
  onPress: () => void;
}) {
  const scale = useSharedValue(1);

  const handlePress = () => {
    scale.value = withSequence(
      withTiming(0.95, { duration: 100 }),
      withTiming(1, { duration: 100 })
    );
    onPress();
  };

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }]
  }));

  return (
    <Animated.View style={animatedStyle}>
      <TouchableOpacity
        style={[
          styles.categoryButton,
          selected && styles.categoryButtonSelected
        ]}
        onPress={handlePress}
      >
        <Text style={styles.categoryIcon}>{category.icon}</Text>
        <Text style={[
          styles.categoryText,
          selected && styles.categoryTextSelected
        ]}>
          {category.label}
        </Text>
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
  },
  headerGradient: {
    padding: 30,
    paddingTop: 40,
  },
  headerTitle: {
    fontSize: 28,
    fontFamily: 'Inter-Bold',
    color: 'white',
    marginBottom: 8,
  },
  headerSubtitle: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: 'rgba(255, 255, 255, 0.9)',
  },
  form: {
    padding: 20,
  },
  inputGroup: {
    marginBottom: 24,
  },
  label: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#374151',
    marginBottom: 8,
  },
  input: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: '#1f2937',
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top',
  },
  priorityContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  priorityButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 12,
    marginHorizontal: 4,
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  priorityText: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    color: '#374151',
    marginLeft: 6,
  },
  categoryContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  categoryButton: {
    width: '48%',
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  categoryButtonSelected: {
    backgroundColor: '#6366f1',
    borderColor: '#6366f1',
  },
  categoryIcon: {
    fontSize: 20,
    marginRight: 8,
  },
  categoryText: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    color: '#374151',
  },
  categoryTextSelected: {
    color: 'white',
  },
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
  },
  cancelButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    marginRight: 8,
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  cancelButtonText: {
    fontSize: 16,
    fontFamily: 'Inter-Medium',
    color: '#6b7280',
    marginLeft: 6,
  },
  saveButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#6366f1',
    borderRadius: 12,
    padding: 16,
    marginLeft: 8,
  },
  saveButtonText: {
    fontSize: 16,
    fontFamily: 'Inter-Medium',
    color: 'white',
    marginLeft: 6,
  },
  successOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  successContent: {
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 40,
    alignItems: 'center',
  },
  successText: {
    fontSize: 18,
    fontFamily: 'Inter-SemiBold',
    color: '#1f2937',
    marginTop: 16,
  },
});