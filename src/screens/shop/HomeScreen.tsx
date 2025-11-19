// src/screens/shop/HomeScreen.tsx
import React, { useState } from 'react';
import {
  View,
  Text,
  FlatList,
  Image,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  TextInput,
  Modal,
} from 'react-native';
import { mockProducts } from '../../utils/mockData';
import { Product } from '../../types';
import { useCartStore } from '../../stores/cartStore';
import { ProductDetailScreen } from './ProductDetailScreen';
import { useTheme } from '../../context/ThemeContext';
import { Spacing, Typography, BorderRadius, Shadows } from '../../config/theme';

export const HomeScreen: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [detailVisible, setDetailVisible] = useState(false);
  
  const addItem = useCartStore(state => state.addItem);
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
    productCard: {
      flex: 1,
      margin: Spacing.sm,
      backgroundColor: Colors.surface,
      borderRadius: BorderRadius.lg,
      overflow: 'hidden',
      ...Shadows.medium,
    },
    productImage: {
      width: '100%',
      height: 180,
      backgroundColor: Colors.border,
    },
    outOfStockBadge: {
      position: 'absolute',
      top: Spacing.sm,
      right: Spacing.sm,
      backgroundColor: Colors.error,
      paddingHorizontal: Spacing.sm,
      paddingVertical: 4,
      borderRadius: BorderRadius.sm,
    },
    outOfStockText: {
      color: '#fff',
      fontSize: 12,
      fontWeight: '600',
    },
    productInfo: {
      padding: Spacing.sm + 4,
    },
    productBrand: {
      fontSize: 12,
      color: Colors.textMuted,
      textTransform: 'uppercase',
      marginBottom: 4,
    },
    productName: {
      ...Typography.small,
      fontWeight: '600',
      color: Colors.text,
      marginBottom: Spacing.xs,
    },
    ratingContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: Spacing.xs,
    },
    ratingText: {
      fontSize: 12,
      color: Colors.text,
      marginRight: 4,
    },
    reviewsText: {
      fontSize: 12,
      color: Colors.textMuted,
    },
    priceContainer: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginTop: Spacing.xs,
    },
    price: {
      fontSize: 18,
      fontWeight: 'bold',
      color: Colors.primary,
    },
    addButton: {
      width: 32,
      height: 32,
      backgroundColor: Colors.primary,
      borderRadius: BorderRadius.full,
      justifyContent: 'center',
      alignItems: 'center',
    },
    addButtonText: {
      color: '#fff',
      fontSize: 20,
      fontWeight: 'bold',
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

  const renderProduct = ({ item }: { item: Product }) => (
    <TouchableOpacity 
      style={styles.productCard}
      onPress={() => {
        setSelectedProduct(item);
        setDetailVisible(true);
      }}
    >
      <Image source={{ uri: item.images[0] }} style={styles.productImage} />
      
      {!item.inStock && (
        <View style={styles.outOfStockBadge}>
          <Text style={styles.outOfStockText}>Rupture</Text>
        </View>
      )}

      <View style={styles.productInfo}>
        <Text style={styles.productBrand}>{item.brand}</Text>
        <Text style={styles.productName} numberOfLines={2}>{item.name}</Text>
        
        <View style={styles.ratingContainer}>
          <Text style={styles.ratingText}>⭐ {item.rating}</Text>
          <Text style={styles.reviewsText}>({item.reviewsCount})</Text>
        </View>

        <View style={styles.priceContainer}>
          <Text style={styles.price}>{item.price.toFixed(2)}€</Text>
          <TouchableOpacity 
            style={styles.addButton}
            onPress={() => addItem(item, 1)}
          >
            <Text style={styles.addButtonText}>+</Text>
          </TouchableOpacity>
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Boutique</Text>
        <TouchableOpacity>
          <Text style={styles.notificationIcon}>🔔</Text>
        </TouchableOpacity>
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
    </SafeAreaView>
  );
};