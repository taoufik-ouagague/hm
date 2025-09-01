import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Switch } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Animated, { 
  useSharedValue, 
  useAnimatedStyle, 
  withTiming, 
  withSpring,
  withDelay,
  withSequence
} from 'react-native-reanimated';
import { User, Bell, Moon, Globe, Shield, CircleHelp as HelpCircle, ChevronRight, Palette, Volume2, Smartphone, Download, Star, Heart } from 'lucide-react-native';

interface SettingItem {
  id: string;
  title: string;
  subtitle?: string;
  icon: React.ReactNode;
  type: 'toggle' | 'navigation' | 'action';
  value?: boolean;
  onPress?: () => void;
  onToggle?: (value: boolean) => void;
}

export default function SettingsScreen() {
  const [darkMode, setDarkMode] = useState(false);
  const [notifications, setNotifications] = useState(true);
  const [sounds, setSounds] = useState(true);
  const fadeAnim = useSharedValue(0);

  useEffect(() => {
    fadeAnim.value = withTiming(1, { duration: 600 });
  }, []);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: fadeAnim.value,
  }));

  const settingSections = [
    {
      title: 'Account',
      items: [
        {
          id: 'profile',
          title: 'Profile',
          subtitle: 'Manage your account details',
          icon: <User size={20} color="#6366f1" />,
          type: 'navigation' as const,
          onPress: () => console.log('Profile pressed')
        }
      ]
    },
    {
      title: 'Preferences',
      items: [
        {
          id: 'notifications',
          title: 'Notifications',
          subtitle: 'Push notifications and alerts',
          icon: <Bell size={20} color="#10b981" />,
          type: 'toggle' as const,
          value: notifications,
          onToggle: setNotifications
        },
        {
          id: 'darkMode',
          title: 'Dark Mode',
          subtitle: 'Switch to dark theme',
          icon: <Moon size={20} color="#8b5cf6" />,
          type: 'toggle' as const,
          value: darkMode,
          onToggle: setDarkMode
        },
        {
          id: 'sounds',
          title: 'Sounds',
          subtitle: 'App sounds and haptics',
          icon: <Volume2 size={20} color="#f59e0b" />,
          type: 'toggle' as const,
          value: sounds,
          onToggle: setSounds
        },
        {
          id: 'language',
          title: 'Language',
          subtitle: 'English (US)',
          icon: <Globe size={20} color="#06b6d4" />,
          type: 'navigation' as const,
          onPress: () => console.log('Language pressed')
        },
        {
          id: 'theme',
          title: 'Theme',
          subtitle: 'Customize app appearance',
          icon: <Palette size={20} color="#ec4899" />,
          type: 'navigation' as const,
          onPress: () => console.log('Theme pressed')
        }
      ]
    },
    {
      title: 'Privacy & Security',
      items: [
        {
          id: 'privacy',
          title: 'Privacy Settings',
          subtitle: 'Control your data',
          icon: <Shield size={20} color="#ef4444" />,
          type: 'navigation' as const,
          onPress: () => console.log('Privacy pressed')
        }
      ]
    },
    {
      title: 'Support',
      items: [
        {
          id: 'help',
          title: 'Help Center',
          subtitle: 'Get support and tutorials',
          icon: <HelpCircle size={20} color="#6b7280" />,
          type: 'navigation' as const,
          onPress: () => console.log('Help pressed')
        },
        {
          id: 'rate',
          title: 'Rate App',
          subtitle: 'Share your feedback',
          icon: <Star size={20} color="#f59e0b" />,
          type: 'action' as const,
          onPress: () => console.log('Rate pressed')
        },
        {
          id: 'feedback',
          title: 'Send Feedback',
          subtitle: 'Help us improve',
          icon: <Heart size={20} color="#ef4444" />,
          type: 'action' as const,
          onPress: () => console.log('Feedback pressed')
        }
      ]
    }
  ];

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <Animated.View style={[styles.content, animatedStyle]}>
          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.title}>Settings</Text>
            <Text style={styles.subtitle}>Customize your experience</Text>
          </View>

          {/* Profile Card */}
          <ProfileCard />

          {/* Settings Sections */}
          {settingSections.map((section, sectionIndex) => (
            <View key={section.title} style={styles.section}>
              <Text style={styles.sectionTitle}>{section.title}</Text>
              <View style={styles.settingsGroup}>
                {section.items.map((item, itemIndex) => (
                  <SettingItem
                    key={item.id}
                    item={item}
                    delay={sectionIndex * 200 + itemIndex * 100}
                  />
                ))}
              </View>
            </View>
          ))}

          {/* App Info */}
          <View style={styles.appInfo}>
            <Text style={styles.appInfoText}>Version 1.0.0</Text>
            <Text style={styles.appInfoText}>Made with ❤️ by Bolt</Text>
          </View>
        </Animated.View>
      </ScrollView>
    </SafeAreaView>
  );
}

function ProfileCard() {
  const scale = useSharedValue(0.9);
  const opacity = useSharedValue(0);

  useEffect(() => {
    opacity.value = withTiming(1, { duration: 600 });
    scale.value = withSpring(1, { damping: 15 });
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
    <Animated.View style={[styles.profileCard, animatedStyle]}>
      <TouchableOpacity onPress={handlePress}>
        <View style={styles.profileContent}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>JD</Text>
          </View>
          <View style={styles.profileInfo}>
            <Text style={styles.profileName}>John Doe</Text>
            <Text style={styles.profileEmail}>john.doe@example.com</Text>
          </View>
          <ChevronRight size={20} color="#9ca3af" />
        </View>
      </TouchableOpacity>
    </Animated.View>
  );
}

function SettingItem({ item, delay }: { item: SettingItem; delay: number }) {
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
    if (item.onPress) {
      item.onPress();
    }
  };

  return (
    <Animated.View style={[styles.settingItem, animatedStyle]}>
      <TouchableOpacity 
        style={styles.settingContent} 
        onPress={item.type !== 'toggle' ? handlePress : undefined}
      >
        <View style={styles.settingIcon}>
          {item.icon}
        </View>
        <View style={styles.settingDetails}>
          <Text style={styles.settingTitle}>{item.title}</Text>
          {item.subtitle && (
            <Text style={styles.settingSubtitle}>{item.subtitle}</Text>
          )}
        </View>
        {item.type === 'toggle' && (
          <Switch
            value={item.value}
            onValueChange={item.onToggle}
            trackColor={{ false: '#e5e7eb', true: '#6366f1' }}
            thumbColor="white"
          />
        )}
        {item.type === 'navigation' && (
          <ChevronRight size={16} color="#9ca3af" />
        )}
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
  profileCard: {
    backgroundColor: 'white',
    borderRadius: 16,
    marginBottom: 30,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  profileContent: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
  },
  avatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#6366f1',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  avatarText: {
    fontSize: 20,
    fontFamily: 'Inter-Bold',
    color: 'white',
  },
  profileInfo: {
    flex: 1,
  },
  profileName: {
    fontSize: 18,
    fontFamily: 'Inter-SemiBold',
    color: '#1f2937',
    marginBottom: 2,
  },
  profileEmail: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#6b7280',
  },
  section: {
    marginBottom: 30,
  },
  sectionTitle: {
    fontSize: 18,
    fontFamily: 'Inter-SemiBold',
    color: '#1f2937',
    marginBottom: 12,
    marginLeft: 4,
  },
  settingsGroup: {
    backgroundColor: 'white',
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  settingItem: {
    borderBottomWidth: 1,
    borderBottomColor: '#f3f4f6',
  },
  settingContent: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
  },
  settingIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#f3f4f6',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  settingDetails: {
    flex: 1,
  },
  settingTitle: {
    fontSize: 16,
    fontFamily: 'Inter-Medium',
    color: '#1f2937',
    marginBottom: 2,
  },
  settingSubtitle: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#6b7280',
  },
  appInfo: {
    alignItems: 'center',
    marginTop: 20,
    paddingVertical: 20,
  },
  appInfoText: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#9ca3af',
    marginBottom: 4,
  },
});