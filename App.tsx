// App.tsx
import React, { useEffect } from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';
import { useAuthStore } from './src/stores/authStore';
import { useCartStore } from './src/stores/cartStore';

export default function App() {
  const { user, isAuthenticated, login, logout, loadUser } = useAuthStore();
  const { items, addItem, getTotal, loadCart } = useCartStore();

  useEffect(() => {
    loadUser();
    loadCart();
  }, []);

  const handleTestLogin = async () => {
    try {
      await login({ email: 'test@example.com', password: '12345678' });
      alert('Login réussi !');
    } catch (error) {
      alert('Login échoué');
    }
  };

  const handleTestAddToCart = () => {
    const mockProduct = {
      id: '1',
      name: 'Nike Air Max',
      description: 'Super chaussures',
      price: 129.99,
      images: ['https://via.placeholder.com/300'],
      category: 'shoes' as const,
      rating: 4.5,
      reviewsCount: 120,
      inStock: true,
    };
    addItem(mockProduct, 1);
    alert('Produit ajouté au panier !');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>🛒 E-commerce App - Test</Text>
      
      <View style={styles.section}>
        <Text style={styles.subtitle}>Auth Store</Text>
        <Text>Connecté: {isAuthenticated ? 'Oui' : 'Non'}</Text>
        {user && <Text>User: {user.firstName} {user.lastName}</Text>}
        
        <Button title="Test Login" onPress={handleTestLogin} />
        {isAuthenticated && <Button title="Logout" onPress={logout} />}
      </View>

      <View style={styles.section}>
        <Text style={styles.subtitle}>Cart Store</Text>
        <Text>Articles: {items.length}</Text>
        <Text>Total: {getTotal().toFixed(2)}€</Text>
        
        <Button title="Ajouter produit test" onPress={handleTestAddToCart} />
        <Button 
          title="Vider le panier" 
          onPress={() => {
            useCartStore.getState().clearCart();
            alert('Panier vidé !');
          }} 
          color="red"
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
    justifyContent: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 30,
    textAlign: 'center',
  },
  section: {
    marginVertical: 20,
    padding: 15,
    backgroundColor: '#f0f0f0',
    borderRadius: 10,
  },
  subtitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 10,
  },
});