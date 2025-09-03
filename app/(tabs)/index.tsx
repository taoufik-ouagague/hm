import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Dimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Animated, { 
  useSharedValue, 
  useAnimatedStyle, 
  withTiming, 
  withSpring,
  interpolate,
  runOnJS,
  withSequence,
  withDelay
} from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';
import { 
  Calendar, 
  TrendingUp, 
  Clock, 
  Target, 
  Zap,
  ChevronRight,
  Star,
  Award,
  Activity,
  Plus
} from 'lucide-react-native';

const { width } = Dimensions.get('window');

interface StatCard {
  id: string;
  title: string;
  value: string;
  change: string;
  icon: React.ReactNode;
  color: string[];
}

export default function HomeScreen() {
  const [currentTime, setCurrentTime] = useState(new Date());
  const fadeAnim = useSharedValue(0);
  const slideAnim = useSharedValue(50);
  const scaleAnim = useSharedValue(0.8);

  const stats: StatCard[] = [
    {
      id: '1',
      title: 'Tasks Completed',
      value: '24',
      change: '+12%',
      icon: <Target size={24} color="white" />,
      color: ['#6366f1', '#8b5cf6']
    },
    {
      id: '2',
      title: 'Productivity Score',
      value: '87%',
      change: '+5%',
      icon: <TrendingUp size={24} color="white" />,
      color: ['#10b981', '#059669']
    },
    {
      id: '3',
      title: 'Focus Time',
      value: '4.2h',
      change: '+18%',
      icon: <Clock size={24} color="white" />,
      color: ['#f59e0b', '#d97706']
    },
    {
      id: '4',
      title: 'Streak Days',
      value: '12',
      change: '+2',
      icon: <Zap size={24} color="white" />,
      color: ['#ef4444', '#dc2626']
    }
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    // Animate entrance
    fadeAnim.value = withTiming(1, { duration: 800 });
    slideAnim.value = withSpring(0, { damping: 15 });
    scaleAnim.value = withSpring(1, { damping: 12 });

    return () => clearInterval(timer);
  }, []);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: fadeAnim.value,
    transform: [
      { translateY: slideAnim.value },
      { scale: scaleAnim.value }
    ]
  }));

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString([], { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <Animated.View style={[styles.content, animatedStyle]}>
          {/* Header */}
          <View style={styles.header}>
            <View>
              <Text style={styles.greeting}>Good morning!</Text>
              <Text style={styles.date}>{formatDate(currentTime)}</Text>
            </View>
            <View style={styles.timeContainer}>
              <Text style={styles.time}>{formatTime(currentTime)}</Text>
            </View>
          </View>

          {/* Quick Actions */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Quick Actions</Text>
            <View style={styles.quickActions}>
              <QuickActionButton 
                icon={<Plus size={20} color="#6366f1" />}
                title="New Task"
                delay={0}
              />
              <QuickActionButton 
                icon={<Calendar size={20} color="#10b981" />}
                title="Schedule"
                delay={100}
              />
              <QuickActionButton 
                icon={<Activity size={20} color="#f59e0b" />}
                title="Focus Mode"
                delay={200}
              />
            </View>
          </View>

          {/* Stats Grid */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Today's Overview</Text>
            <View style={styles.statsGrid}>
              {stats.map((stat, index) => (
                <StatCard key={stat.id} stat={stat} index={index} />
              ))}
            </View>
          </View>

          {/* Recent Activity */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Recent Activity</Text>
            <View style={styles.activityList}>
              <ActivityItem 
                icon={<Award size={20} color="#6366f1" />}
                title="Completed morning routine"
                time="2 hours ago"
                delay={0}
              />
              <ActivityItem 
                icon={<Star size={20} color="#f59e0b" />}
                title="Achieved daily goal"
                time="4 hours ago"
                delay={100}
              />
              <ActivityItem 
                icon={<Target size={20} color="#10b981" />}
                title="Finished project milestone"
                time="Yesterday"
                delay={200}
              />
            </View>
          </View>
        </Animated.View>
      </ScrollView>
    </SafeAreaView>
  );
}

function QuickActionButton({ icon, title, delay }: { icon: React.ReactNode; title: string; delay: number }) {
  const scale = useSharedValue(0.8);
  const opacity = useSharedValue(0);

  useEffect(() => {
    opacity.value = withDelay(delay, withTiming(1, { duration: 600 }));
    scale.value = withDelay(delay, withSpring(1, { damping: 15 }));
  }, []);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [{ scale: scale.value }]
  }));

  const handlePress = () => {
    scale.value = withSequence(
      withTiming(0.95, { duration: 100 }),
      withTiming(1, { duration: 100 })
    );
  };

  return (
    <Animated.View style={animatedStyle}>
      <TouchableOpacity style={styles.quickActionButton} onPress={handlePress}>
        {icon}
        <Text style={styles.quickActionText}>{title}</Text>
      </TouchableOpacity>
    </Animated.View>
  );
}

function StatCard({ stat, index }: { stat: StatCard; index: number }) {
  const translateY = useSharedValue(30);
  const opacity = useSharedValue(0);
  const scale = useSharedValue(0.9);

  useEffect(() => {
    const delay = index * 150;
    opacity.value = withDelay(delay, withTiming(1, { duration: 600 }));
    translateY.value = withDelay(delay, withSpring(0, { damping: 15 }));
    scale.value = withDelay(delay, withSpring(1, { damping: 12 }));
  }, []);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [
      { translateY: translateY.value },
      { scale: scale.value }
    ]
  }));

  const handlePress = () => {
    scale.value = withSequence(
      withTiming(0.95, { duration: 100 }),
      withTiming(1, { duration: 100 })
    );
  };

  return (
    <Animated.View style={[styles.statCard, animatedStyle]}>
      <TouchableOpacity onPress={handlePress}>
        <LinearGradient
          colors={stat.color}
          style={styles.statGradient}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        >
          <View style={styles.statHeader}>
            {stat.icon}
            <Text style={styles.statChange}>{stat.change}</Text>
          </View>
          <Text style={styles.statValue}>{stat.value}</Text>
          <Text style={styles.statTitle}>{stat.title}</Text>
        </LinearGradient>
      </TouchableOpacity>
    </Animated.View>
  );
}

function ActivityItem({ icon, title, time, delay }: { 
  icon: React.ReactNode; 
  title: string; 
  time: string; 
  delay: number 
}) {
  const translateX = useSharedValue(-20);
  const opacity = useSharedValue(0);

  useEffect(() => {
    opacity.value = withDelay(delay, withTiming(1, { duration: 500 }));
    translateX.value = withDelay(delay, withSpring(0, { damping: 15 }));
  }, []);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [{ translateX: translateX.value }]
  }));

  const handlePress = () => {
    translateX.value = withSequence(
      withTiming(5, { duration: 100 }),
      withTiming(0, { duration: 100 })
    );
  };

  return (
    <Animated.View style={animatedStyle}>
      <TouchableOpacity style={styles.activityItem} onPress={handlePress}>
        <View style={styles.activityIcon}>
          {icon}
        </View>
        <View style={styles.activityContent}>
          <Text style={styles.activityTitle}>{title}</Text>
          <Text style={styles.activityTime}>{time}</Text>
        </View>
        <ChevronRight size={16} color="#9ca3af" />
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
    padding: 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 30,
  },
  greeting: {
    fontSize: 28,
    fontFamily: 'Inter-Bold',
    color: '#1f2937',
    marginBottom: 4,
  },
  date: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: '#6b7280',
  },
  timeContainer: {
    backgroundColor: 'white',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  time: {
    fontSize: 18,
    fontFamily: 'Inter-SemiBold',
    color: '#1f2937',
  },
  section: {
    marginBottom: 30,
  },
  sectionTitle: {
    fontSize: 20,
    fontFamily: 'Inter-SemiBold',
    color: '#1f2937',
    marginBottom: 16,
  },
  quickActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  quickActionButton: {
    backgroundColor: 'white',
    padding: 16,
    borderRadius: 16,
    alignItems: 'center',
    flex: 1,
    marginHorizontal: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  quickActionText: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    color: '#374151',
    marginTop: 8,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  statCard: {
    width: (width - 48) / 2,
    marginBottom: 16,
  },
  statGradient: {
    padding: 20,
    borderRadius: 16,
    height: 120,
  },
  statHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  statChange: {
    fontSize: 12,
    fontFamily: 'Inter-SemiBold',
    color: 'white',
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  statValue: {
    fontSize: 24,
    fontFamily: 'Inter-Bold',
    color: 'white',
    marginBottom: 4,
  },
  statTitle: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    color: 'rgba(255, 255, 255, 0.9)',
  },
  activityList: {
    backgroundColor: 'white',
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  activityItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f3f4f6',
  },
  activityIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#f3f4f6',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  activityContent: {
    flex: 1,
  },
  activityTitle: {
    fontSize: 16,
    fontFamily: 'Inter-Medium',
    color: '#1f2937',
    marginBottom: 2,
  },
  activityTime: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#6b7280',
  },
});