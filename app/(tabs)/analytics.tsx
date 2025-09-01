import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Dimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Animated, { 
  useSharedValue, 
  useAnimatedStyle, 
  withTiming, 
  withSpring,
  withDelay,
  interpolate
} from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';
import { 
  TrendingUp, 
  Calendar, 
  Clock, 
  Target,
  BarChart3,
  PieChart,
  Activity,
  Zap
} from 'lucide-react-native';

const { width } = Dimensions.get('window');

interface ChartData {
  day: string;
  value: number;
  color: string;
}

export default function AnalyticsScreen() {
  const [selectedPeriod, setSelectedPeriod] = useState('week');
  const fadeAnim = useSharedValue(0);

  const chartData: ChartData[] = [
    { day: 'Mon', value: 85, color: '#6366f1' },
    { day: 'Tue', value: 92, color: '#8b5cf6' },
    { day: 'Wed', value: 78, color: '#10b981' },
    { day: 'Thu', value: 95, color: '#f59e0b' },
    { day: 'Fri', value: 88, color: '#ef4444' },
    { day: 'Sat', value: 76, color: '#06b6d4' },
    { day: 'Sun', value: 82, color: '#84cc16' }
  ];

  useEffect(() => {
    fadeAnim.value = withTiming(1, { duration: 600 });
  }, []);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: fadeAnim.value,
  }));

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <Animated.View style={[styles.content, animatedStyle]}>
          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.title}>Analytics</Text>
            <Text style={styles.subtitle}>Track your productivity insights</Text>
          </View>

          {/* Period Selector */}
          <View style={styles.periodSelector}>
            {['week', 'month', 'year'].map((period) => (
              <PeriodButton
                key={period}
                period={period}
                selected={selectedPeriod === period}
                onPress={() => setSelectedPeriod(period)}
              />
            ))}
          </View>

          {/* Key Metrics */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Key Metrics</Text>
            <View style={styles.metricsGrid}>
              <MetricCard
                icon={<Target size={24} color="white" />}
                title="Completion Rate"
                value="87%"
                trend="+5%"
                color={['#6366f1', '#8b5cf6']}
                delay={0}
              />
              <MetricCard
                icon={<Clock size={24} color="white" />}
                title="Avg. Focus Time"
                value="4.2h"
                trend="+12%"
                color={['#10b981', '#059669']}
                delay={100}
              />
              <MetricCard
                icon={<Zap size={24} color="white" />}
                title="Productivity Score"
                value="92"
                trend="+8%"
                color={['#f59e0b', '#d97706']}
                delay={200}
              />
              <MetricCard
                icon={<Activity size={24} color="white" />}
                title="Active Days"
                value="28"
                trend="+3"
                color={['#ef4444', '#dc2626']}
                delay={300}
              />
            </View>
          </View>

          {/* Chart */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Weekly Progress</Text>
            <View style={styles.chartContainer}>
              <BarChart data={chartData} />
            </View>
          </View>

          {/* Insights */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Insights</Text>
            <View style={styles.insightsList}>
              <InsightCard
                icon={<TrendingUp size={20} color="#10b981" />}
                title="Great Progress!"
                description="You're 15% more productive than last week"
                delay={0}
              />
              <InsightCard
                icon={<Calendar size={20} color="#6366f1" />}
                title="Consistency Streak"
                description="You've maintained your routine for 12 days"
                delay={100}
              />
              <InsightCard
                icon={<Clock size={20} color="#f59e0b" />}
                title="Peak Hours"
                description="You're most productive between 9-11 AM"
                delay={200}
              />
            </View>
          </View>
        </Animated.View>
      </ScrollView>
    </SafeAreaView>
  );
}

function PeriodButton({ period, selected, onPress }: {
  period: string;
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
          styles.periodButton,
          selected && styles.periodButtonSelected
        ]}
        onPress={handlePress}
      >
        <Text style={[
          styles.periodButtonText,
          selected && styles.periodButtonTextSelected
        ]}>
          {period.charAt(0).toUpperCase() + period.slice(1)}
        </Text>
      </TouchableOpacity>
    </Animated.View>
  );
}

function MetricCard({ icon, title, value, trend, color, delay }: {
  icon: React.ReactNode;
  title: string;
  value: string;
  trend: string;
  color: string[];
  delay: number;
}) {
  const translateY = useSharedValue(30);
  const opacity = useSharedValue(0);
  const scale = useSharedValue(0.9);

  useEffect(() => {
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

  return (
    <Animated.View style={[styles.metricCard, animatedStyle]}>
      <LinearGradient
        colors={color}
        style={styles.metricGradient}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        <View style={styles.metricHeader}>
          {icon}
          <Text style={styles.metricTrend}>{trend}</Text>
        </View>
        <Text style={styles.metricValue}>{value}</Text>
        <Text style={styles.metricTitle}>{title}</Text>
      </LinearGradient>
    </Animated.View>
  );
}

function BarChart({ data }: { data: ChartData[] }) {
  const maxValue = Math.max(...data.map(d => d.value));

  return (
    <View style={styles.chart}>
      <View style={styles.chartBars}>
        {data.map((item, index) => (
          <BarItem
            key={item.day}
            data={item}
            maxValue={maxValue}
            index={index}
          />
        ))}
      </View>
      <View style={styles.chartLabels}>
        {data.map((item) => (
          <Text key={item.day} style={styles.chartLabel}>
            {item.day}
          </Text>
        ))}
      </View>
    </View>
  );
}

function BarItem({ data, maxValue, index }: {
  data: ChartData;
  maxValue: number;
  index: number;
}) {
  const height = useSharedValue(0);
  const targetHeight = (data.value / maxValue) * 120;

  useEffect(() => {
    height.value = withDelay(
      index * 100,
      withSpring(targetHeight, { damping: 15 })
    );
  }, []);

  const animatedStyle = useAnimatedStyle(() => ({
    height: height.value,
  }));

  return (
    <View style={styles.barContainer}>
      <Animated.View
        style={[
          styles.bar,
          { backgroundColor: data.color },
          animatedStyle
        ]}
      />
    </View>
  );
}

function InsightCard({ icon, title, description, delay }: {
  icon: React.ReactNode;
  title: string;
  description: string;
  delay: number;
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

  return (
    <Animated.View style={[styles.insightCard, animatedStyle]}>
      <View style={styles.insightIcon}>
        {icon}
      </View>
      <View style={styles.insightContent}>
        <Text style={styles.insightTitle}>{title}</Text>
        <Text style={styles.insightDescription}>{description}</Text>
      </View>
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
    marginBottom: 24,
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
  periodSelector: {
    flexDirection: 'row',
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 4,
    marginBottom: 24,
  },
  periodButton: {
    flex: 1,
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  periodButtonSelected: {
    backgroundColor: '#6366f1',
  },
  periodButtonText: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    color: '#6b7280',
  },
  periodButtonTextSelected: {
    color: 'white',
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
  metricsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  metricCard: {
    width: (width - 48) / 2,
    marginBottom: 16,
  },
  metricGradient: {
    padding: 16,
    borderRadius: 16,
    height: 100,
  },
  metricHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  metricTrend: {
    fontSize: 12,
    fontFamily: 'Inter-SemiBold',
    color: 'white',
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
  },
  metricValue: {
    fontSize: 20,
    fontFamily: 'Inter-Bold',
    color: 'white',
    marginBottom: 2,
  },
  metricTitle: {
    fontSize: 12,
    fontFamily: 'Inter-Medium',
    color: 'rgba(255, 255, 255, 0.9)',
  },
  chartContainer: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  chart: {
    height: 160,
  },
  chartBars: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    height: 120,
    marginBottom: 16,
  },
  barContainer: {
    flex: 1,
    alignItems: 'center',
    marginHorizontal: 2,
  },
  bar: {
    width: 20,
    borderRadius: 10,
  },
  chartLabels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  chartLabel: {
    fontSize: 12,
    fontFamily: 'Inter-Medium',
    color: '#6b7280',
    textAlign: 'center',
    flex: 1,
  },
  insightsList: {
    backgroundColor: 'white',
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  insightCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f3f4f6',
  },
  insightIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#f3f4f6',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  insightContent: {
    flex: 1,
  },
  insightTitle: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#1f2937',
    marginBottom: 2,
  },
  insightDescription: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#6b7280',
  },
});