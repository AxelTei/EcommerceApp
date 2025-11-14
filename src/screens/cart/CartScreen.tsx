// src/screens/cart/CartScreen.tsx
import React from 'react';
import {
  View,
  Text,
  FlatList,
  Image,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
} from 'react-native';
import { useCartStore } from '../../stores/cartStore';
import { CartItem } from '../../types';
import { Colors, Spacing, Typography, BorderRadius, Shadows } from '../../config/theme';
import { Button } from '../../components/common/Button';

export const CartScreen: React.FC = () => {
  const { items, removeItem, updateQuantity, getSubtotal, getTotal, promoCode } = useCartStore();

  const renderCartItem = ({ item }: { item: CartItem }) => (
    <View style={styles.cartItem}>
      <Image source={{ uri: item.product.images[0] }} style={styles.itemImage} />
      
      <View style={styles.itemInfo}>
        <Text style={styles.itemBrand}>{item.product.brand}</Text>
        <Text style={styles.itemName} numberOfLines={2}>{item.product.name}</Text>
        
        {(item.selectedSize || item.selectedColor) && (
          <View style={styles.variantsContainer}>
            {item.selectedSize && (
              <Text style={styles.variantText}>Taille: {item.selectedSize}</Text>
            )}
            {item.selectedColor && (
              <Text style={styles.variantText}>Couleur: {item.selectedColor}</Text>
            )}
          </View>
        )}

        <View style={styles.itemFooter}>
          <Text style={styles.itemPrice}>{item.product.price.toFixed(2)}€</Text>
          
          <View style={styles.quantityContainer}>
            <TouchableOpacity 
              style={styles.quantityButton}
              onPress={() => updateQuantity(item.id, item.quantity - 1)}
            >
              <Text style={styles.quantityButtonText}>−</Text>
            </TouchableOpacity>
            
            <Text style={styles.quantityText}>{item.quantity}</Text>
            
            <TouchableOpacity 
              style={styles.quantityButton}
              onPress={() => updateQuantity(item.id, item.quantity + 1)}
            >
              <Text style={styles.quantityButtonText}>+</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>

      <TouchableOpacity 
        style={styles.removeButton}
        onPress={() => removeItem(item.id)}
      >
        <Text style={styles.removeButtonText}>🗑️</Text>
      </TouchableOpacity>
    </View>
  );

  if (items.length === 0) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Panier</Text>
        </View>
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyIcon}>🛒</Text>
          <Text style={styles.emptyTitle}>Votre panier est vide</Text>
          <Text style={styles.emptyText}>Ajoutez des produits pour commencer</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Panier ({items.length})</Text>
      </View>

      <FlatList
        data={items}
        keyExtractor={(item) => item.id}
        renderItem={renderCartItem}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
      />

      {/* Summary */}
      <View style={styles.summaryContainer}>
        <View style={styles.summaryRow}>
          <Text style={styles.summaryLabel}>Sous-total</Text>
          <Text style={styles.summaryValue}>{getSubtotal().toFixed(2)}€</Text>
        </View>

        {promoCode && (
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>
              Réduction ({promoCode.code})
            </Text>
            <Text style={styles.discountValue}>-{useCartStore.getState().getDiscount().toFixed(2)}€</Text>
          </View>
        )}

        <View style={styles.summaryRow}>
          <Text style={styles.summaryLabel}>Livraison</Text>
          <Text style={styles.summaryValue}>5.99€</Text>
        </View>

        <View style={styles.divider} />

        <View style={styles.summaryRow}>
          <Text style={styles.totalLabel}>Total</Text>
          <Text style={styles.totalValue}>{getTotal().toFixed(2)}€</Text>
        </View>

        <Button
          title="Commander"
          onPress={() => console.log('Checkout')}
          style={styles.checkoutButton}
        />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  header: {
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
    backgroundColor: '#fff',
  },
  headerTitle: {
    ...Typography.h2,
    color: Colors.text,
  },
  listContent: {
    padding: Spacing.md,
  },
  cartItem: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: BorderRadius.lg,
    padding: Spacing.md,
    marginBottom: Spacing.md,
    ...Shadows.small,
  },
  itemImage: {
    width: 80,
    height: 80,
    borderRadius: BorderRadius.md,
    backgroundColor: Colors.surface,
  },
  itemInfo: {
    flex: 1,
    marginLeft: Spacing.md,
  },
  itemBrand: {
    fontSize: 12,
    color: Colors.textMuted,
    textTransform: 'uppercase',
    marginBottom: 4,
  },
  itemName: {
    ...Typography.small,
    fontWeight: '600',
    color: Colors.text,
    marginBottom: Spacing.xs,
  },
  variantsContainer: {
    flexDirection: 'row',
    gap: Spacing.sm,
    marginBottom: Spacing.xs,
  },
  variantText: {
    fontSize: 12,
    color: Colors.textSecondary,
  },
  itemFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 'auto',
  },
  itemPrice: {
    fontSize: 16,
    fontWeight: 'bold',
    color: Colors.primary,
  },
  quantityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.md,
    padding: 4,
  },
  quantityButton: {
    width: 28,
    height: 28,
    justifyContent: 'center',
    alignItems: 'center',
  },
  quantityButtonText: {
    fontSize: 18,
    color: Colors.text,
    fontWeight: '600',
  },
  quantityText: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.text,
    marginHorizontal: Spacing.md,
    minWidth: 24,
    textAlign: 'center',
  },
  removeButton: {
    padding: Spacing.xs,
  },
  removeButtonText: {
    fontSize: 20,
  },
  summaryContainer: {
    backgroundColor: '#fff',
    padding: Spacing.lg,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: Spacing.sm,
  },
  summaryLabel: {
    ...Typography.body,
    color: Colors.textSecondary,
  },
  summaryValue: {
    ...Typography.body,
    color: Colors.text,
    fontWeight: '600',
  },
  discountValue: {
    ...Typography.body,
    color: Colors.success,
    fontWeight: '600',
  },
  divider: {
    height: 1,
    backgroundColor: Colors.border,
    marginVertical: Spacing.md,
  },
  totalLabel: {
    ...Typography.h3,
    color: Colors.text,
  },
  totalValue: {
    ...Typography.h3,
    color: Colors.primary,
  },
  checkoutButton: {
    marginTop: Spacing.md,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: Spacing.xl,
  },
  emptyIcon: {
    fontSize: 80,
    marginBottom: Spacing.lg,
  },
  emptyTitle: {
    ...Typography.h2,
    color: Colors.text,
    marginBottom: Spacing.sm,
  },
  emptyText: {
    ...Typography.body,
    color: Colors.textSecondary,
    textAlign: 'center',
  },
});