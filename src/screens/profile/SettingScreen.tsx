// src/screens/profile/SettingsScreen.tsx
import React from 'react';
import {
  View,
  Text,
  Switch,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  SafeAreaView,
} from 'react-native';
import { useThemeStore } from '../../stores/themeStore';
import { getColors, Spacing, Typography, BorderRadius, Shadows } from '../../config/theme';

interface SettingsScreenProps {
  onBack: () => void;
}

export const SettingsScreen: React.FC<SettingsScreenProps> = ({ onBack }) => {
  const { theme, toggleTheme } = useThemeStore();
  const isDark = theme === 'dark';
  const Colors = getColors(isDark);

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: Colors.background }]}>
      <View style={[styles.header, { backgroundColor: Colors.surface, borderBottomColor: Colors.border }]}>
        <TouchableOpacity onPress={onBack}>
          <Text style={[styles.backIcon, { color: Colors.text }]}>←</Text>
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: Colors.text }]}>Paramètres</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: Colors.text }]}>Apparence</Text>
          
          <View style={[styles.settingItem, { backgroundColor: Colors.surface }]}>
            <View style={styles.settingInfo}>
              <Text style={[styles.settingIcon, { backgroundColor: Colors.primary + '20' }]}>🌙</Text>
              <View style={styles.settingText}>
                <Text style={[styles.settingTitle, { color: Colors.text }]}>Mode sombre</Text>
                <Text style={[styles.settingSubtitle, { color: Colors.textSecondary }]}>
                  Activer le thème sombre
                </Text>
              </View>
            </View>
            <Switch
              value={isDark}
              onValueChange={toggleTheme}
              trackColor={{ false: Colors.border, true: Colors.primary }}
              thumbColor="#fff"
            />
          </View>
        </View>

        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: Colors.text }]}>Compte</Text>
          
          <TouchableOpacity style={[styles.settingItem, { backgroundColor: Colors.surface }]}>
            <View style={styles.settingInfo}>
              <Text style={[styles.settingIcon, { backgroundColor: Colors.info + '20' }]}>👤</Text>
              <View style={styles.settingText}>
                <Text style={[styles.settingTitle, { color: Colors.text }]}>Informations personnelles</Text>
                <Text style={[styles.settingSubtitle, { color: Colors.textSecondary }]}>
                  Nom, email, téléphone
                </Text>
              </View>
            </View>
            <Text style={[styles.arrow, { color: Colors.textMuted }]}>›</Text>
          </TouchableOpacity>

          <TouchableOpacity style={[styles.settingItem, { backgroundColor: Colors.surface }]}>
            <View style={styles.settingInfo}>
              <Text style={[styles.settingIcon, { backgroundColor: Colors.warning + '20' }]}>🔒</Text>
              <View style={styles.settingText}>
                <Text style={[styles.settingTitle, { color: Colors.text }]}>Sécurité</Text>
                <Text style={[styles.settingSubtitle, { color: Colors.textSecondary }]}>
                  Mot de passe, authentification
                </Text>
              </View>
            </View>
            <Text style={[styles.arrow, { color: Colors.textMuted }]}>›</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: Colors.text }]}>Confidentialité</Text>
          
          <TouchableOpacity style={[styles.settingItem, { backgroundColor: Colors.surface }]}>
            <View style={styles.settingInfo}>
              <Text style={[styles.settingIcon, { backgroundColor: Colors.success + '20' }]}>📄</Text>
              <View style={styles.settingText}>
                <Text style={[styles.settingTitle, { color: Colors.text }]}>Politique de confidentialité</Text>
              </View>
            </View>
            <Text style={[styles.arrow, { color: Colors.textMuted }]}>›</Text>
          </TouchableOpacity>

          <TouchableOpacity style={[styles.settingItem, { backgroundColor: Colors.surface }]}>
            <View style={styles.settingInfo}>
              <Text style={[styles.settingIcon, { backgroundColor: Colors.accent + '20' }]}>📋</Text>
              <View style={styles.settingText}>
                <Text style={[styles.settingTitle, { color: Colors.text }]}>Conditions d'utilisation</Text>
              </View>
            </View>
            <Text style={[styles.arrow, { color: Colors.textMuted }]}>›</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
    borderBottomWidth: 1,
  },
  backIcon: {
    fontSize: 24,
  },
  headerTitle: {
    ...Typography.h3,
  },
  section: {
    marginTop: Spacing.lg,
    paddingHorizontal: Spacing.lg,
  },
  sectionTitle: {
    ...Typography.body,
    fontWeight: '600',
    marginBottom: Spacing.md,
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: Spacing.md,
    borderRadius: BorderRadius.lg,
    marginBottom: Spacing.sm,
    ...Shadows.small,
  },
  settingInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  settingIcon: {
    fontSize: 24,
    width: 48,
    height: 48,
    borderRadius: 24,
    textAlign: 'center',
    lineHeight: 48,
    marginRight: Spacing.md,
  },
  settingText: {
    flex: 1,
  },
  settingTitle: {
    ...Typography.body,
    fontWeight: '600',
    marginBottom: 2,
  },
  settingSubtitle: {
    ...Typography.small,
  },
  arrow: {
    fontSize: 24,
  },
});