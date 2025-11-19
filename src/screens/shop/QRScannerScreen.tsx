// src/screens/shop/QRScannerScreen.tsx
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  Alert,
} from 'react-native';
import { CameraView, Camera, BarcodeScanningResult } from 'expo-camera';
import { useTheme } from '../../context/ThemeContext';
import { Spacing, Typography, BorderRadius } from '../../config/theme';

interface QRScannerScreenProps {
  onBack: () => void;
  onScan: (code: string) => void;
}

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');
const SCAN_AREA_SIZE = SCREEN_WIDTH * 0.7;

export const QRScannerScreen: React.FC<QRScannerScreenProps> = ({ onBack, onScan }) => {
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const [scanned, setScanned] = useState(false);
  const { colors: Colors } = useTheme();

  useEffect(() => {
    (async () => {
      const { status } = await Camera.requestCameraPermissionsAsync();
      setHasPermission(status === 'granted');
    })();
  }, []);

  const handleBarCodeScanned = (result: BarcodeScanningResult) => {
    if (scanned) return;
    
    Alert.alert('QR Code détecté !', `Contenu: ${result.data}`);
    setScanned(true);
    
    setTimeout(() => {
      onScan(result.data);
    }, 1000);
  };

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#000',
    },
    camera: {
      flex: 1,
    },
    overlay: {
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      justifyContent: 'center',
      alignItems: 'center',
    },
    topOverlay: {
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      height: (SCREEN_HEIGHT - SCAN_AREA_SIZE) / 2,
      backgroundColor: 'rgba(0, 0, 0, 0.6)',
    },
    bottomOverlay: {
      position: 'absolute',
      bottom: 0,
      left: 0,
      right: 0,
      height: (SCREEN_HEIGHT - SCAN_AREA_SIZE) / 2,
      backgroundColor: 'rgba(0, 0, 0, 0.6)',
    },
    leftOverlay: {
      position: 'absolute',
      left: 0,
      width: (SCREEN_WIDTH - SCAN_AREA_SIZE) / 2,
      top: (SCREEN_HEIGHT - SCAN_AREA_SIZE) / 2,
      height: SCAN_AREA_SIZE,
      backgroundColor: 'rgba(0, 0, 0, 0.6)',
    },
    rightOverlay: {
      position: 'absolute',
      right: 0,
      width: (SCREEN_WIDTH - SCAN_AREA_SIZE) / 2,
      top: (SCREEN_HEIGHT - SCAN_AREA_SIZE) / 2,
      height: SCAN_AREA_SIZE,
      backgroundColor: 'rgba(0, 0, 0, 0.6)',
    },
    scanArea: {
      width: SCAN_AREA_SIZE,
      height: SCAN_AREA_SIZE,
      borderWidth: 2,
      borderColor: '#fff',
      borderRadius: BorderRadius.lg,
    },
    corner: {
      position: 'absolute',
      width: 30,
      height: 30,
      borderColor: Colors.primary,
    },
    topLeft: {
      top: -2,
      left: -2,
      borderTopWidth: 4,
      borderLeftWidth: 4,
      borderTopLeftRadius: BorderRadius.lg,
    },
    topRight: {
      top: -2,
      right: -2,
      borderTopWidth: 4,
      borderRightWidth: 4,
      borderTopRightRadius: BorderRadius.lg,
    },
    bottomLeft: {
      bottom: -2,
      left: -2,
      borderBottomWidth: 4,
      borderLeftWidth: 4,
      borderBottomLeftRadius: BorderRadius.lg,
    },
    bottomRight: {
      bottom: -2,
      right: -2,
      borderBottomWidth: 4,
      borderRightWidth: 4,
      borderBottomRightRadius: BorderRadius.lg,
    },
    header: {
      position: 'absolute',
      top: 60,
      left: 0,
      right: 0,
      flexDirection: 'row',
      justifyContent: 'space-between',
      paddingHorizontal: Spacing.lg,
      zIndex: 999,
    },
    backButton: {
      width: 44,
      height: 44,
      borderRadius: 22,
      backgroundColor: 'rgba(255, 255, 255, 0.9)',
      justifyContent: 'center',
      alignItems: 'center',
    },
    backIcon: {
      fontSize: 24,
      color: '#000',
    },
    instructions: {
      position: 'absolute',
      bottom: 80,
      left: 0,
      right: 0,
      alignItems: 'center',
      zIndex: 999,
    },
    instructionText: {
      ...Typography.body,
      color: '#fff',
      textAlign: 'center',
      backgroundColor: 'rgba(0, 0, 0, 0.6)',
      paddingHorizontal: Spacing.xl,
      paddingVertical: Spacing.md,
      borderRadius: BorderRadius.lg,
    },
    resetButton: {
      marginTop: Spacing.md,
      paddingHorizontal: Spacing.lg,
      paddingVertical: Spacing.sm,
      backgroundColor: Colors.primary,
      borderRadius: BorderRadius.md,
    },
    resetText: {
      color: '#fff',
      fontWeight: '600',
    },
    permissionContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: Colors.background,
      padding: Spacing.xl,
    },
    permissionIcon: {
      fontSize: 60,
      marginBottom: Spacing.lg,
    },
    permissionTitle: {
      ...Typography.h2,
      color: Colors.text,
      marginBottom: Spacing.sm,
      textAlign: 'center',
    },
    permissionText: {
      ...Typography.body,
      color: Colors.textSecondary,
      textAlign: 'center',
    },
  });

  if (hasPermission === null) {
    return (
      <View style={styles.permissionContainer}>
        <Text style={styles.permissionIcon}>📷</Text>
        <Text style={styles.permissionTitle}>Demande d'accès</Text>
        <Text style={styles.permissionText}>
          Nous avons besoin d'accéder à votre caméra pour scanner les codes QR
        </Text>
      </View>
    );
  }

  if (hasPermission === false) {
    return (
      <View style={styles.permissionContainer}>
        <Text style={styles.permissionIcon}>❌</Text>
        <Text style={styles.permissionTitle}>Accès refusé</Text>
        <Text style={styles.permissionText}>
          Veuillez autoriser l'accès à la caméra dans les paramètres
        </Text>
        <TouchableOpacity onPress={onBack} style={{ marginTop: Spacing.xl }}>
          <Text style={{ color: Colors.primary, fontWeight: '600' }}>Retour</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <CameraView
        style={styles.camera}
        facing="back"
        onBarcodeScanned={scanned ? undefined : handleBarCodeScanned}
      >
        <View style={styles.overlay}>
          <View style={styles.topOverlay} />
          <View style={styles.bottomOverlay} />
          <View style={styles.leftOverlay} />
          <View style={styles.rightOverlay} />
          
          <View style={styles.scanArea}>
            <View style={[styles.corner, styles.topLeft]} />
            <View style={[styles.corner, styles.topRight]} />
            <View style={[styles.corner, styles.bottomLeft]} />
            <View style={[styles.corner, styles.bottomRight]} />
          </View>
        </View>

        <View style={styles.instructions}>
          <Text style={styles.instructionText}>
            {scanned ? 'QR Code scanné !' : 'Placez le QR code dans le cadre'}
          </Text>
          {scanned && (
            <TouchableOpacity 
              style={styles.resetButton}
              onPress={() => setScanned(false)}
            >
              <Text style={styles.resetText}>Scanner à nouveau</Text>
            </TouchableOpacity>
          )}
        </View>
      </CameraView>

      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={onBack}>
          <Text style={styles.backIcon}>←</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};