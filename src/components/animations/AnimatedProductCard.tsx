// src/components/animations/AnimatedProductCard.tsx
import React, { useRef } from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  Animated,
} from 'react-native';
import { Product } from '../../types';
import { useTheme } from '../../context/ThemeContext';
import { Spacing, Typography, BorderRadius, Shadows } from '../../config/theme';

interface AnimatedProductCardProps {
  product: Product;
  onPress: () => void;
  onAddToCart: () => void;
  index: number;
}

export const AnimatedProductCard: React.FC<AnimatedProductCardProps> = ({
  product,
  onPress,
  onAddToCart,
  index,
}) => {
  const scaleAnim = useRef(new Animated.Value(0)).current;
  const translateYAnim = useRef(new Animated.Value(50)).current;
  const opacityAnim = useRef(new Animated.Value(0)).current;
  const pressAnim = useRef(new Animated.Value(1)).current;

  const { colors: Colors } = useTheme();

  React.useEffect(() => {
    Animated.parallel([
      Animated.spring(scaleAnim, {
        toValue: 1,
        delay: index * 100,
        useNativeDriver: true,
        tension: 50,
        friction: 7,
      }),
      Animated.timing(translateYAnim, {
        toValue: 0,
        delay: index * 100,
        duration: 400,
        useNativeDriver: true,
      }),
      Animated.timing(opacityAnim, {
        toValue: 1,
        delay: index * 100,
        duration: 400,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  const handlePressIn = () => {
    Animated.spring(pressAnim, {
      toValue: 0.95,
      useNativeDriver: true,
    }).start();
  };

  const handlePressOut = () => {
    Animated.spring(pressAnim, {
      toValue: 1,
      useNativeDriver: true,
    }).start();
  };

  const styles = StyleSheet.create({
    wrapper: {
      flex: 1,
      margin: Spacing.sm,
    },
    card: {
      backgroundColor: Colors.surface,
      borderRadius: BorderRadius.lg,
      overflow: 'hidden',
      ...Shadows.medium,
    },
    image: {
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
    info: {
      padding: Spacing.md,
    },
    brand: {
      fontSize: 12,
      color: Colors.textMuted,
      textTransform: 'uppercase',
      marginBottom: 4,
    },
    name: {
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
    rating: {
      fontSize: 12,
      color: Colors.text,
      marginRight: 4,
    },
    reviews: {
      fontSize: 12,
      color: Colors.textMuted,
    },
    footer: {
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
  });

  return (
    <View style={styles.wrapper}>
      <Animated.View
        style={{
          transform: [
            { scale: Animated.multiply(scaleAnim, pressAnim) },
            { translateY: translateYAnim },
          ],
          opacity: opacityAnim,
        }}
      >
        <TouchableOpacity
          style={styles.card}
          onPress={onPress}
          onPressIn={handlePressIn}
          onPressOut={handlePressOut}
          activeOpacity={1}
        >
          <Image source={{ uri: product.images[0] }} style={styles.image} />
          
          {!product.inStock && (
            <View style={styles.outOfStockBadge}>
              <Text style={styles.outOfStockText}>Rupture</Text>
            </View>
          )}

          <View style={styles.info}>
            <Text style={styles.brand}>{product.brand}</Text>
            <Text style={styles.name} numberOfLines={2}>{product.name}</Text>
            
            <View style={styles.ratingContainer}>
              <Text style={styles.rating}>⭐ {product.rating}</Text>
              <Text style={styles.reviews}>({product.reviewsCount})</Text>
            </View>

            <View style={styles.footer}>
              <Text style={styles.price}>{product.price.toFixed(2)}€</Text>
              <TouchableOpacity 
                style={styles.addButton}
                onPress={onAddToCart}
              >
                <Text style={styles.addButtonText}>+</Text>
              </TouchableOpacity>
            </View>
          </View>
        </TouchableOpacity>
      </Animated.View>
    </View>
  );
};