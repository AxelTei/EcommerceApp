// src/screens/profile/OrdersScreen.tsx
import React, { useEffect } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  Image,
  StyleSheet,
  SafeAreaView,
} from 'react-native';
import { useOrderStore } from '../../stores/orderStore';
import { Order, OrderStatus } from '../../types';
import { useTheme } from '../../context/ThemeContext';
import { Spacing, Typography, BorderRadius, Shadows } from '../../config/theme';

interface OrdersScreenProps {
  onBack: () => void;
}

export const OrdersScreen: React.FC<OrdersScreenProps> = ({ onBack }) => {
  const { orders, loadOrders } = useOrderStore();
  const { colors: Colors } = useTheme();

  useEffect(() => {
    loadOrders();
  }, []);

  const getStatusColor = (status: OrderStatus) => {
    switch (status) {
      case 'pending': return Colors.warning;
      case 'processing': return Colors.info;
      case 'shipped': return Colors.primary;
      case 'delivered': return Colors.success;
      case 'cancelled': return Colors.error;
      default: return Colors.textMuted;
    }
  };

  const getStatusLabel = (status: OrderStatus) => {
    switch (status) {
      case 'pending': return 'En attente';
      case 'processing': return 'En préparation';
      case 'shipped': return 'Expédiée';
      case 'delivered': return 'Livrée';
      case 'cancelled': return 'Annulée';
      default: return status;
    }
  };

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('fr-FR', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });
  };

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: Colors.background,
    },
    header: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingHorizontal: Spacing.lg,
      paddingVertical: Spacing.md,
      backgroundColor: Colors.surface,
      borderBottomWidth: 1,
      borderBottomColor: Colors.border,
    },
    backIcon: {
      fontSize: 24,
      color: Colors.text,
    },
    headerTitle: {
      ...Typography.h3,
      color: Colors.text,
    },
    listContent: {
      padding: Spacing.lg,
    },
    orderCard: {
      backgroundColor: Colors.surface,
      borderRadius: BorderRadius.lg,
      padding: Spacing.lg,
      marginBottom: Spacing.md,
      ...Shadows.medium,
    },
    orderHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'flex-start',
      marginBottom: Spacing.md,
    },
    orderNumber: {
      fontSize: 16,
      fontWeight: '600',
      color: Colors.text,
      marginBottom: 4,
    },
    orderDate: {
      fontSize: 12,
      color: Colors.textSecondary,
    },
    statusBadge: {
      paddingHorizontal: Spacing.md,
      paddingVertical: Spacing.xs,
      borderRadius: BorderRadius.full,
    },
    statusText: {
      fontSize: 12,
      fontWeight: '600',
    },
    productsPreview: {
      flexDirection: 'row',
      marginBottom: Spacing.md,
    },
    productThumb: {
      width: 50,
      height: 50,
      borderRadius: BorderRadius.md,
      backgroundColor: Colors.border,
      marginRight: Spacing.sm,
    },
    moreProducts: {
      width: 50,
      height: 50,
      borderRadius: BorderRadius.md,
      backgroundColor: Colors.border,
      justifyContent: 'center',
      alignItems: 'center',
    },
    moreProductsText: {
      fontSize: 14,
      fontWeight: '600',
      color: Colors.textSecondary,
    },
    orderInfo: {
      borderTopWidth: 1,
      borderTopColor: Colors.border,
      paddingTop: Spacing.md,
    },
    infoRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginBottom: Spacing.xs,
    },
    infoLabel: {
      fontSize: 14,
      color: Colors.textSecondary,
    },
    infoValue: {
      fontSize: 14,
      fontWeight: '600',
      color: Colors.text,
    },
    totalValue: {
      fontSize: 16,
      fontWeight: 'bold',
      color: Colors.primary,
    },
    trackingContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      marginTop: Spacing.sm,
      backgroundColor: Colors.background,
      padding: Spacing.sm,
      borderRadius: BorderRadius.md,
    },
    trackingLabel: {
      fontSize: 12,
      color: Colors.textSecondary,
    },
    trackingNumber: {
      fontSize: 12,
      fontWeight: '600',
      color: Colors.text,
    },
    emptyContainer: {
      alignItems: 'center',
      paddingTop: 60,
    },
    emptyIcon: {
      fontSize: 80,
      marginBottom: Spacing.lg,
    },
    emptyTitle: {
      ...Typography.h3,
      color: Colors.text,
      marginBottom: Spacing.sm,
    },
    emptyText: {
      ...Typography.body,
      color: Colors.textSecondary,
    },
  });

  const renderOrder = ({ item }: { item: Order }) => (
    <TouchableOpacity style={styles.orderCard}>
      <View style={styles.orderHeader}>
        <View>
          <Text style={styles.orderNumber}>Commande #{item.id.slice(-8)}</Text>
          <Text style={styles.orderDate}>{formatDate(item.createdAt)}</Text>
        </View>
        <View style={[styles.statusBadge, { backgroundColor: getStatusColor(item.status) + '20' }]}>
          <Text style={[styles.statusText, { color: getStatusColor(item.status) }]}>
            {getStatusLabel(item.status)}
          </Text>
        </View>
      </View>

      <View style={styles.productsPreview}>
        {item.items.slice(0, 3).map((cartItem, index) => (
          <Image
            key={index}
            source={{ uri: cartItem.product.images[0] }}
            style={styles.productThumb}
          />
        ))}
        {item.items.length > 3 && (
          <View style={styles.moreProducts}>
            <Text style={styles.moreProductsText}>+{item.items.length - 3}</Text>
          </View>
        )}
      </View>

      <View style={styles.orderInfo}>
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Articles</Text>
          <Text style={styles.infoValue}>{item.items.length}</Text>
        </View>
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Total</Text>
          <Text style={styles.totalValue}>{item.total.toFixed(2)}€</Text>
        </View>
      </View>

      {item.trackingNumber && (
        <View style={styles.trackingContainer}>
          <Text style={styles.trackingLabel}>📦 Suivi: </Text>
          <Text style={styles.trackingNumber}>{item.trackingNumber}</Text>
        </View>
      )}
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={onBack}>
          <Text style={styles.backIcon}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Mes commandes</Text>
        <View style={{ width: 24 }} />
      </View>

      <FlatList
        data={orders}
        keyExtractor={(item) => item.id}
        renderItem={renderOrder}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyIcon}>📦</Text>
            <Text style={styles.emptyTitle}>Aucune commande</Text>
            <Text style={styles.emptyText}>Vos commandes apparaîtront ici</Text>
          </View>
        }
      />
    </SafeAreaView>
  );
};