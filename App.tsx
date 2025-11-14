// App.tsx
import { LoginScreen } from './src/screens/auth/LoginScreen';
import { useAuthStore } from './src/stores/authStore';
import { View, Text } from 'react-native';

export default function App() {
  const { isAuthenticated, user } = useAuthStore();

  if (isAuthenticated) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Text style={{ fontSize: 24 }}>✅ Connecté !</Text>
        <Text>Bienvenue {user?.firstName} {user?.lastName}</Text>
      </View>
    );
  }

  return <LoginScreen />;
}