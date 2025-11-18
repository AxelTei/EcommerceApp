// src/screens/cart/CheckoutScreen.tsx
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  Alert,
  Modal,
} from 'react-native';
import { useCartStore } from '../../stores/cartStore';
import { useAddressStore } from '../../stores/adressStore';
import { useOrderStore } from '../../stores/orderStore';
import { useAuthStore } from '../../stores/authStore';
import { AddAddressScreen } from '../profile/AddAddressScreen';
import { Colors, Spacing, Typography, BorderRadius, Shadows } from '../../config/theme';
import { Button } from '../../components/common/Button';

interface CheckoutScreenProps {
  onBack: () => void;
  onSuccess: () => void;
}

export const CheckoutScreen: React.FC<CheckoutScreenProps> = ({ onBack, onSuccess }) => {
  const [step, setStep] = useState(1);
  const [selectedAddress, setSelectedAddress] = useState<string | null>(null);
  const [selectedPayment, setSelectedPayment] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [addAddressVisible, setAddAddressVisible] = useState(false);

  const { items, getSubtotal, getTotal, promoCode, clearCart } = useCartStore();
  const { addresses, loadAddresses } = useAddressStore();
  const addOrder = useOrderStore(state => state.addOrder);
  const user = useAuthStore(state => state.user);

  useEffect(() => {
    loadAddresses();
  }, []);

  const paymentMethods = [
    { id: 'card', icon: '💳', title: 'Carte bancaire', subtitle: 'Visa, Mastercard, Amex' },
    { id: 'paypal', icon: '🅿️', title: 'PayPal', subtitle: 'Paiement sécurisé' },
    { id: 'apple', icon: '🍎', title: 'Apple Pay', subtitle: 'Paiement rapide' },
  ];

  const handlePlaceOrder = async () => {
    if (!selectedAddress || !selectedPayment) {
      Alert.alert('Erreur', 'Veuillez sélectionner une adresse et un moyen de paiement');
      return;
    }

    const selectedAddressData = addresses.find(a => a.id === selectedAddress);

    if (!selectedAddressData || !user) {
      Alert.alert('Erreur', 'Données manquantes');
      return;
    }

    setIsProcessing(true);

    try {
      await addOrder({
        userId: user.id,
        items: items,
        total: getTotal(),
        subtotal: getSubtotal(),
        shipping: 5.99,
        tax: 0,
        discount: promoCode ? useCartStore.getState().getDiscount() : undefined,
        status: 'processing',
        shippingAddress: selectedAddressData,
        paymentMethod: {
          type: selectedPayment === 'card' ? 'card' : selectedPayment === 'paypal' ? 'paypal' : 'apple_pay',
        },
      });
      
      clearCart();
      setIsProcessing(false);
      
      Alert.alert(
        'Commande confirmée ! 🎉',
        'Votre commande a été passée avec succès.',
        [{ text: 'OK', onPress: onSuccess }]
      );
    } catch (error) {
      setIsProcessing(false);
      Alert.alert('Erreur', 'Impossible de passer la commande');
    }
  };

  const renderStepIndicator = () => (
    <View style={styles.stepIndicator}>
      {[1, 2, 3].map((s) => (
        <View key={s} style={styles.stepContainer}>
          <View style={[
            styles.stepCircle,
            step >= s && styles.stepCircleActive,
            step > s && styles.stepCircleComplete,
          ]}>
            <Text style={[
              styles.stepNumber,
              step >= s && styles.stepNumberActive,
            ]}>
              {step > s ? '✓' : s}
            </Text>
          </View>
          {s < 3 && (
            <View style={[
              styles.stepLine,
              step > s && styles.stepLineActive,
            ]} />
          )}
        </View>
      ))}
    </View>
  );

  const renderAddressStep = () => (
    <View>
      <Text style={styles.stepTitle}>Adresse de livraison</Text>
      
      {addresses.map((address) => (
        <TouchableOpacity
          key={address.id}
          style={[
            styles.addressCard,
            selectedAddress === address.id && styles.addressCardSelected,
          ]}
          onPress={() => setSelectedAddress(address.id)}
        >
          <View style={styles.addressHeader}>
            <Text style={styles.addressLabel}>{address.label}</Text>
            <View style={[
              styles.radioButton,
              selectedAddress === address.id && styles.radioButtonSelected,
            ]}>
              {selectedAddress === address.id && (
                <View style={styles.radioButtonInner} />
              )}
            </View>
          </View>
          <Text style={styles.addressText}>{address.street}</Text>
          <Text style={styles.addressText}>
            {address.postalCode} {address.city}
          </Text>
          <Text style={styles.addressText}>{address.country}</Text>
        </TouchableOpacity>
      ))}

      <TouchableOpacity 
        style={styles.addButton}
        onPress={() => setAddAddressVisible(true)}
      >
        <Text style={styles.addButtonIcon}>+</Text>
        <Text style={styles.addButtonText}>Ajouter une adresse</Text>
      </TouchableOpacity>

      <Button
        title="Continuer"
        onPress={() => setStep(2)}
        disabled={!selectedAddress}
      />
    </View>
  );

  const renderPaymentStep = () => (
    <View>
      <Text style={styles.stepTitle}>Moyen de paiement</Text>
      
      {paymentMethods.map((method) => (
        <TouchableOpacity
          key={method.id}
          style={[
            styles.paymentCard,
            selectedPayment === method.id && styles.paymentCardSelected,
          ]}
          onPress={() => setSelectedPayment(method.id)}
        >
          <Text style={styles.paymentIcon}>{method.icon}</Text>
          <View style={styles.paymentInfo}>
            <Text style={styles.paymentTitle}>{method.title}</Text>
            <Text style={styles.paymentSubtitle}>{method.subtitle}</Text>
          </View>
          <View style={[
            styles.radioButton,
            selectedPayment === method.id && styles.radioButtonSelected,
          ]}>
            {selectedPayment === method.id && (
              <View style={styles.radioButtonInner} />
            )}
          </View>
        </TouchableOpacity>
      ))}

      <View style={styles.buttonRow}>
        <Button
          title="Retour"
          variant="outline"
          onPress={() => setStep(1)}
          style={styles.halfButton}
        />
        <Button
          title="Continuer"
          onPress={() => setStep(3)}
          disabled={!selectedPayment}
          style={styles.halfButton}
        />
      </View>
    </View>
  );

  const renderReviewStep = () => {
    const selectedAddressData = addresses.find(a => a.id === selectedAddress);
    const selectedPaymentData = paymentMethods.find(p => p.id === selectedPayment);

    return (
      <View>
        <Text style={styles.stepTitle}>Récapitulatif</Text>

        <View style={styles.reviewSection}>
          <Text style={styles.reviewSectionTitle}>Articles ({items.length})</Text>
          {items.map((item) => (
            <View key={item.id} style={styles.reviewItem}>
              <Text style={styles.reviewItemName} numberOfLines={1}>
                {item.quantity}x {item.product.name}
              </Text>
              <Text style={styles.reviewItemPrice}>
                {(item.product.price * item.quantity).toFixed(2)}€
              </Text>
            </View>
          ))}
        </View>

        <View style={styles.reviewSection}>
          <Text style={styles.reviewSectionTitle}>Livraison</Text>
          {selectedAddressData && (
            <>
              <Text style={styles.reviewText}>{selectedAddressData.label}</Text>
              <Text style={styles.reviewText}>{selectedAddressData.street}</Text>
              <Text style={styles.reviewText}>
                {selectedAddressData.postalCode} {selectedAddressData.city}
              </Text>
            </>
          )}
        </View>

        <View style={styles.reviewSection}>
          <Text style={styles.reviewSectionTitle}>Paiement</Text>
          {selectedPaymentData && (
            <Text style={styles.reviewText}>{selectedPaymentData.title}</Text>
          )}
        </View>

        <View style={styles.totalSection}>
          <View style={styles.totalRow}>
            <Text style={styles.totalLabel}>Sous-total</Text>
            <Text style={styles.totalValue}>{getSubtotal().toFixed(2)}€</Text>
          </View>
          {promoCode && (
            <View style={styles.totalRow}>
              <Text style={styles.totalLabel}>Réduction ({promoCode.code})</Text>
              <Text style={styles.discountValue}>
                -{useCartStore.getState().getDiscount().toFixed(2)}€
              </Text>
            </View>
          )}
          <View style={styles.totalRow}>
            <Text style={styles.totalLabel}>Livraison</Text>
            <Text style={styles.totalValue}>5.99€</Text>
          </View>
          <View style={styles.divider} />
          <View style={styles.totalRow}>
            <Text style={styles.finalLabel}>Total</Text>
            <Text style={styles.finalValue}>{getTotal().toFixed(2)}€</Text>
          </View>
        </View>

        <View style={styles.buttonRow}>
          <Button
            title="Retour"
            variant="outline"
            onPress={() => setStep(2)}
            style={styles.halfButton}
          />
          <Button
            title="Commander"
            onPress={handlePlaceOrder}
            loading={isProcessing}
            style={styles.halfButton}
          />
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={onBack}>
          <Text style={styles.backIcon}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Commande</Text>
        <View style={{ width: 24 }} />
      </View>

      {renderStepIndicator()}

      <ScrollView 
        style={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {step === 1 && renderAddressStep()}
        {step === 2 && renderPaymentStep()}
        {step === 3 && renderReviewStep()}
      </ScrollView>

      <Modal
        visible={addAddressVisible}
        animationType="slide"
        onRequestClose={() => setAddAddressVisible(false)}
      >
        <AddAddressScreen
          onBack={() => setAddAddressVisible(false)}
          onSuccess={() => {
            setAddAddressVisible(false);
            loadAddresses();
          }}
        />
      </Modal>
    </SafeAreaView>
  );
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
    backgroundColor: '#fff',
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
  stepIndicator: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: Spacing.lg,
    backgroundColor: '#fff',
  },
  stepContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  stepCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: Colors.surface,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: Colors.border,
  },
  stepCircleActive: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  stepCircleComplete: {
    backgroundColor: Colors.success,
    borderColor: Colors.success,
  },
  stepNumber: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.textMuted,
  },
  stepNumberActive: {
    color: '#fff',
  },
  stepLine: {
    width: 40,
    height: 2,
    backgroundColor: Colors.border,
    marginHorizontal: 4,
  },
  stepLineActive: {
    backgroundColor: Colors.success,
  },
  content: {
    flex: 1,
    padding: Spacing.lg,
  },
  stepTitle: {
    ...Typography.h2,
    color: Colors.text,
    marginBottom: Spacing.lg,
  },
  addressCard: {
    backgroundColor: '#fff',
    padding: Spacing.lg,
    borderRadius: BorderRadius.lg,
    marginBottom: Spacing.md,
    borderWidth: 2,
    borderColor: Colors.border,
  },
  addressCardSelected: {
    borderColor: Colors.primary,
  },
  addressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.sm,
  },
  addressLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.text,
  },
  addressText: {
    ...Typography.small,
    color: Colors.textSecondary,
    marginTop: 2,
  },
  radioButton: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: Colors.border,
    justifyContent: 'center',
    alignItems: 'center',
  },
  radioButtonSelected: {
    borderColor: Colors.primary,
  },
  radioButtonInner: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: Colors.primary,
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: Spacing.lg,
    borderWidth: 2,
    borderColor: Colors.border,
    borderRadius: BorderRadius.lg,
    borderStyle: 'dashed',
    marginBottom: Spacing.lg,
  },
  addButtonIcon: {
    fontSize: 20,
    color: Colors.primary,
    marginRight: Spacing.sm,
  },
  addButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.primary,
  },
  paymentCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: Spacing.lg,
    borderRadius: BorderRadius.lg,
    marginBottom: Spacing.md,
    borderWidth: 2,
    borderColor: Colors.border,
  },
  paymentCardSelected: {
    borderColor: Colors.primary,
  },
  paymentIcon: {
    fontSize: 32,
    marginRight: Spacing.md,
  },
  paymentInfo: {
    flex: 1,
  },
  paymentTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.text,
    marginBottom: 4,
  },
  paymentSubtitle: {
    ...Typography.small,
    color: Colors.textSecondary,
  },
  buttonRow: {
    flexDirection: 'row',
    gap: Spacing.md,
  },
  halfButton: {
    flex: 1,
  },
  reviewSection: {
    backgroundColor: '#fff',
    padding: Spacing.lg,
    borderRadius: BorderRadius.lg,
    marginBottom: Spacing.md,
  },
  reviewSectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.text,
    marginBottom: Spacing.sm,
  },
  reviewItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: Spacing.xs,
  },
  reviewItemName: {
    flex: 1,
    ...Typography.small,
    color: Colors.textSecondary,
  },
  reviewItemPrice: {
    ...Typography.small,
    fontWeight: '600',
    color: Colors.text,
  },
  reviewText: {
    ...Typography.small,
    color: Colors.textSecondary,
    marginTop: 2,
  },
  totalSection: {
    backgroundColor: '#fff',
    padding: Spacing.lg,
    borderRadius: BorderRadius.lg,
    marginBottom: Spacing.lg,
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: Spacing.sm,
  },
  totalLabel: {
    ...Typography.body,
    color: Colors.textSecondary,
  },
  totalValue: {
    ...Typography.body,
    fontWeight: '600',
    color: Colors.text,
  },
  discountValue: {
    ...Typography.body,
    fontWeight: '600',
    color: Colors.success,
  },
  divider: {
    height: 1,
    backgroundColor: Colors.border,
    marginVertical: Spacing.sm,
  },
  finalLabel: {
    ...Typography.h3,
    color: Colors.text,
  },
  finalValue: {
    ...Typography.h3,
    color: Colors.primary,
  },
});