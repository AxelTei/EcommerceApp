// App.tsx
import React, { useState } from 'react';
import { View, Text, Button } from 'react-native';
import { LoginScreen } from './src/screens/auth/LoginScreen';
import { SignupScreen } from './src/screens/auth/SignupScreen';
import { useAuthStore } from './src/stores/authStore';

export default function App() {
  const [showSignup, setShowSignup] = useState(false);
  const { isAuthenticated, user, logout } = useAuthStore();

  if (isAuthenticated) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Text style={{ fontSize: 24, marginBottom: 20 }}>✅ Connecté !</Text>
        <Text style={{ marginBottom: 20 }}>Bienvenue {user?.firstName} {user?.lastName}</Text>
        <Button title="Se déconnecter" onPress={logout} />
      </View>
    );
  }

  if (showSignup) {
    return <SignupScreen onNavigateToLogin={() => setShowSignup(false)} />;
  }

  return <LoginScreen onNavigateToSignup={() => setShowSignup(true)} />;
}