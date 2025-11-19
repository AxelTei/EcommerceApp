// src/screens/shop/HomeScreen.tsx
import React, { useState } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  TextInput,
  Modal,
  Alert,
} from 'react-native';
import { mockProducts } from '../../utils/mockData';
import { Product } from '../../types';
import { useCartStore } from '../../stores/cartStore';
import { ProductDetailScreen } from './ProductDetailScreen';
import { QRScannerScreen } from './QRScannerScreen';
import { AnimatedProductCard } from '../../components/animations/AnimatedProductCard';
import { useTheme } from '../../context/ThemeContext';
import { Spacing, Typography, BorderRadius } from '../../config/theme';

export const HomeScreen: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [detailVisible, setDetailVisible] = useState(false);
  const [qrScannerVisible, setQrScannerVisible] = useState(false);
  
  const addItem = useCartStore(state => state.addItem);
  const { applyPromoCode } = useCartStore();
  const { colors: Colors } = useTheme();

  const categories = ['Tout', 'electronics', 'clothing', 'shoes', 'accessories'];

  const filteredProducts = mockProducts.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = !selectedCategory || selectedCategory === 'Tout' || product.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const getCategoryLabel = (cat: string) => {
    const labels: Record<string, string> = {
      'Tout': 'Tout',
      'electronics': 'Électronique',
      'clothing': 'Vêtements',
      'shoes': 'Chaussures',
      'accessories': 'Accessoires',
    };
    return labels[cat] || cat;
  };

  const handleQRScan = async (code: string) => {
    setTimeout(async () => {
      setQrScannerVisible(false);
      
      const success = await applyPromoCode(code);
      
      if (success) {
        Alert.alert('Code promo scanné !', `Le code ${code} a été appliqué à votre panier`);
      } else {
        Alert.alert('Code invalide', 'Ce code QR n\'est pas un code promo valide');
      }
    }, 500);
  };

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: Colors.background,
    },
    header: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingHorizontal: Spacing.lg,
      paddingVertical: Spacing.md,
    },
    headerTitle: {
      ...Typography.h2,
      color: Colors.text,
    },
    headerIcons: {
      flexDirection: 'row',
      gap: Spacing.md,
    },
    notificationIcon: {
      fontSize: 24,
    },
    searchContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: Colors.surface,
      marginHorizontal: Spacing.lg,
      marginBottom: Spacing.md,
      paddingHorizontal: Spacing.md,
      borderRadius: BorderRadius.md,
    },
    searchIcon: {
      fontSize: 20,
      marginRight: Spacing.sm,
    },
    searchInput: {
      flex: 1,
      paddingVertical: Spacing.sm + 4,
      fontSize: 16,
      color: Colors.text,
    },
    categoriesContainer: {
      marginBottom: Spacing.md,
    },
    categoryChip: {
      paddingHorizontal: Spacing.lg,
      paddingVertical: Spacing.sm,
      backgroundColor: Colors.surface,
      borderRadius: BorderRadius.full,
      marginLeft: Spacing.lg,
    },
    categoryChipActive: {
      backgroundColor: Colors.primary,
    },
    categoryText: {
      fontSize: 14,
      fontWeight: '600',
      color: Colors.textSecondary,
    },
    categoryTextActive: {
      color: '#fff',
    },
    productsGrid: {
      paddingHorizontal: Spacing.md,
    },
    emptyContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      paddingTop: 60,
    },
    emptyText: {
      ...Typography.body,
      color: Colors.textMuted,
    },
  });

  const renderProduct = ({ item, index }: { item: Product; index: number }) => (
    <AnimatedProductCard
      product={item}
      index={index}
      onPress={() => {
        setSelectedProduct(item);
        setDetailVisible(true);
      }}
      onAddToCart={() => addItem(item, 1)}
    />
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Boutique</Text>
        <View style={styles.headerIcons}>
          <TouchableOpacity onPress={() => setQrScannerVisible(true)}>
            <Text style={styles.notificationIcon}>📷</Text>
          </TouchableOpacity>
          <TouchableOpacity>
            <Text style={styles.notificationIcon}>🔔</Text>
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.searchContainer}>
        <Text style={styles.searchIcon}>🔍</Text>
        <TextInput
          style={styles.searchInput}
          placeholder="Rechercher un produit..."
          placeholderTextColor={Colors.textMuted}
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
      </View>

      <View style={styles.categoriesContainer}>
        <FlatList
          horizontal
          data={categories}
          keyExtractor={(item) => item}
          showsHorizontalScrollIndicator={false}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={[
                styles.categoryChip,
                (selectedCategory === item || (item === 'Tout' && !selectedCategory)) && styles.categoryChipActive
              ]}
              onPress={() => setSelectedCategory(item === 'Tout' ? null : item)}
            >
              <Text style={[
                styles.categoryText,
                (selectedCategory === item || (item === 'Tout' && !selectedCategory)) && styles.categoryTextActive
              ]}>
                {getCategoryLabel(item)}
              </Text>
            </TouchableOpacity>
          )}
        />
      </View>

      <FlatList
        data={filteredProducts}
        keyExtractor={(item) => item.id}
        numColumns={2}
        contentContainerStyle={styles.productsGrid}
        renderItem={renderProduct}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>Aucun produit trouvé</Text>
          </View>
        }
      />

      <Modal
        visible={detailVisible}
        animationType="slide"
        onRequestClose={() => setDetailVisible(false)}
      >
        {selectedProduct && (
          <ProductDetailScreen 
            product={selectedProduct}
            onBack={() => setDetailVisible(false)}
          />
        )}
      </Modal>

      <Modal
        visible={qrScannerVisible}
        animationType="slide"
        onRequestClose={() => setQrScannerVisible(false)}
      >
        <QRScannerScreen
          onBack={() => setQrScannerVisible(false)}
          onScan={handleQRScan}
        />
      </Modal>
    </SafeAreaView>
  );
};