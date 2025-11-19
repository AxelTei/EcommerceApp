// src/screens/auth/LoginScreen.tsx
import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Button } from '../../components/common/Button';
import { Input } from '../../components/common/Input';
import { loginSchema, LoginFormData } from '../../utils/validation';
import { useAuthStore } from '../../stores/authStore';
import { useTheme } from '../../context/ThemeContext';
import { Spacing, Typography } from '../../config/theme';

export const LoginScreen: React.FC = () => {
  const [showPassword, setShowPassword] = useState(false);
  const { login, isLoading } = useAuthStore();
  const navigation = useNavigation<NativeStackNavigationProp<any>>();
  const { colors: Colors } = useTheme();

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const onSubmit = async (data: LoginFormData) => {
    try {
      await login(data);
    } catch (error) {
      Alert.alert('Erreur', 'Email ou mot de passe incorrect');
    }
  };

  // STYLES DYNAMIQUES À L'INTÉRIEUR DU COMPOSANT
  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: Colors.background,
    },
    keyboardView: {
      flex: 1,
    },
    scrollContent: {
      flexGrow: 1,
      padding: Spacing.lg,
    },
    header: {
      alignItems: 'center',
      marginTop: Spacing.xl,
      marginBottom: Spacing.xxl,
    },
    logo: {
      fontSize: 60,
      marginBottom: Spacing.md,
    },
    title: {
      ...Typography.h1,
      color: Colors.text,
      marginBottom: Spacing.xs,
    },
    subtitle: {
      ...Typography.body,
      color: Colors.textSecondary,
    },
    form: {
      marginBottom: Spacing.xl,
    },
    forgotPassword: {
      alignSelf: 'flex-end',
      marginBottom: Spacing.lg,
    },
    forgotPasswordText: {
      ...Typography.small,
      color: Colors.primary,
      fontWeight: '600',
    },
    loginButton: {
      marginTop: Spacing.md,
    },
    divider: {
      flexDirection: 'row',
      alignItems: 'center',
      marginVertical: Spacing.xl,
    },
    dividerLine: {
      flex: 1,
      height: 1,
      backgroundColor: Colors.border,
    },
    dividerText: {
      ...Typography.small,
      color: Colors.textMuted,
      marginHorizontal: Spacing.md,
    },
    socialButtons: {
      marginBottom: Spacing.xl,
    },
    socialButton: {
      marginTop: Spacing.md,
    },
    footer: {
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center',
    },
    footerText: {
      ...Typography.body,
      color: Colors.textSecondary,
    },
    signupLink: {
      ...Typography.body,
      color: Colors.primary,
      fontWeight: '600',
    },
  });

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardView}
      >
        <ScrollView 
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.header}>
            <Text style={styles.logo}>🛒</Text>
            <Text style={styles.title}>Bienvenue !</Text>
            <Text style={styles.subtitle}>Connectez-vous à votre compte</Text>
          </View>

          <View style={styles.form}>
            <Controller
              control={control}
              name="email"
              render={({ field: { onChange, onBlur, value } }) => (
                <Input
                  label="Email"
                  leftIcon="📧"
                  placeholder="votre@email.com"
                  keyboardType="email-address"
                  autoCapitalize="none"
                  autoCorrect={false}
                  value={value}
                  onChangeText={onChange}
                  onBlur={onBlur}
                  error={errors.email?.message}
                />
              )}
            />

            <Controller
              control={control}
              name="password"
              render={({ field: { onChange, onBlur, value } }) => (
                <Input
                  label="Mot de passe"
                  leftIcon="🔒"
                  rightIcon={showPassword ? '👁️' : '👁️‍🗨️'}
                  onRightIconPress={() => setShowPassword(!showPassword)}
                  placeholder="••••••••"
                  secureTextEntry={!showPassword}
                  value={value}
                  onChangeText={onChange}
                  onBlur={onBlur}
                  error={errors.password?.message}
                />
              )}
            />

            <TouchableOpacity style={styles.forgotPassword}>
              <Text style={styles.forgotPasswordText}>Mot de passe oublié ?</Text>
            </TouchableOpacity>

            <Button
              title="Se connecter"
              onPress={handleSubmit(onSubmit)}
              loading={isLoading}
              style={styles.loginButton}
            />
          </View>

          <View style={styles.divider}>
            <View style={styles.dividerLine} />
            <Text style={styles.dividerText}>OU</Text>
            <View style={styles.dividerLine} />
          </View>

          <View style={styles.socialButtons}>
            <Button
              title="Continuer avec Google"
              variant="outline"
              onPress={() => Alert.alert('Bientôt disponible')}
            />
            <Button
              title="Continuer avec Apple"
              variant="outline"
              onPress={() => Alert.alert('Bientôt disponible')}
              style={styles.socialButton}
            />
          </View>

          <View style={styles.footer}>
            <Text style={styles.footerText}>Pas encore de compte ? </Text>
            <TouchableOpacity onPress={() => navigation.navigate('Signup')}>
              <Text style={styles.signupLink}>Inscrivez-vous</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};