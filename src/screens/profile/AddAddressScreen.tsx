// src/screens/profile/AddAddressScreen.tsx
import React from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  Alert,
} from 'react-native';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Input } from '../../components/common/Input';
import { Button } from '../../components/common/Button';
import { addressSchema, AddressFormData } from '../../utils/validation';
import { useAddressStore } from '../../stores/adressStore';
import { useTheme } from '../../context/ThemeContext';
import { Spacing, Typography } from '../../config/theme';

interface AddAddressScreenProps {
  onBack: () => void;
  onSuccess: () => void;
}

export const AddAddressScreen: React.FC<AddAddressScreenProps> = ({ onBack, onSuccess }) => {
  const addAddress = useAddressStore(state => state.addAddress);
  const { colors: Colors } = useTheme();

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<AddressFormData>({
    resolver: zodResolver(addressSchema),
    defaultValues: {
      label: '',
      street: '',
      city: '',
      postalCode: '',
      country: 'France',
    },
  });

  const onSubmit = async (data: AddressFormData) => {
    try {
      await addAddress(data);
      Alert.alert('Succès', 'Adresse ajoutée avec succès', [
        { text: 'OK', onPress: onSuccess }
      ]);
    } catch (error) {
      Alert.alert('Erreur', 'Impossible d\'ajouter l\'adresse');
    }
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
    content: {
      flex: 1,
      padding: Spacing.lg,
    },
    row: {
      flexDirection: 'row',
      gap: Spacing.md,
    },
    halfInput: {
      flex: 1,
    },
    submitButton: {
      marginTop: Spacing.lg,
    },
  });

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={onBack}>
          <Text style={styles.backIcon}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Nouvelle adresse</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView 
        style={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <Controller
          control={control}
          name="label"
          render={({ field: { onChange, onBlur, value } }) => (
            <Input
              label="Nom de l'adresse"
              leftIcon="🏷️"
              placeholder="Maison, Travail, etc."
              value={value}
              onChangeText={onChange}
              onBlur={onBlur}
              error={errors.label?.message}
            />
          )}
        />

        <Controller
          control={control}
          name="street"
          render={({ field: { onChange, onBlur, value } }) => (
            <Input
              label="Adresse"
              leftIcon="📍"
              placeholder="123 Rue de la Paix"
              value={value}
              onChangeText={onChange}
              onBlur={onBlur}
              error={errors.street?.message}
            />
          )}
        />

        <View style={styles.row}>
          <View style={styles.halfInput}>
            <Controller
              control={control}
              name="postalCode"
              render={({ field: { onChange, onBlur, value } }) => (
                <Input
                  label="Code postal"
                  leftIcon="📮"
                  placeholder="75001"
                  keyboardType="numeric"
                  maxLength={5}
                  value={value}
                  onChangeText={onChange}
                  onBlur={onBlur}
                  error={errors.postalCode?.message}
                />
              )}
            />
          </View>

          <View style={styles.halfInput}>
            <Controller
              control={control}
              name="city"
              render={({ field: { onChange, onBlur, value } }) => (
                <Input
                  label="Ville"
                  leftIcon="🏙️"
                  placeholder="Paris"
                  value={value}
                  onChangeText={onChange}
                  onBlur={onBlur}
                  error={errors.city?.message}
                />
              )}
            />
          </View>
        </View>

        <Controller
          control={control}
          name="country"
          render={({ field: { onChange, onBlur, value } }) => (
            <Input
              label="Pays"
              leftIcon="🌍"
              placeholder="France"
              value={value}
              onChangeText={onChange}
              onBlur={onBlur}
              error={errors.country?.message}
            />
          )}
        />

        <Button
          title="Ajouter l'adresse"
          onPress={handleSubmit(onSubmit)}
          style={styles.submitButton}
        />
      </ScrollView>
    </SafeAreaView>
  );
};