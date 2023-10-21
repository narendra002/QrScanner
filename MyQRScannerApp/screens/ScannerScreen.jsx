import React, { useState, useEffect } from 'react';
import { View, Text, Button, StyleSheet, TouchableOpacity } from 'react-native';
import { Camera } from 'expo-camera';
import AsyncStorage from '@react-native-async-storage/async-storage';

const ScannerScreen = ({ navigation }) => {
  const [hasPermission, setHasPermission] = useState(null);
  const [scannedData, setScannedData] = useState(null);

  useEffect(() => {
    (async () => {
      const { status } = await Camera.requestCameraPermissionsAsync();
      setHasPermission(status === 'granted');
    })();
  }, []);

  const handleBarCodeScanned = async ({ data }) => {
    setScannedData(data);
  };

  const handleCancelScan = () => {
    navigation.navigate('Home');
  };

  const saveToHistory = async (content) => {
    try {
      const storedQRs = await AsyncStorage.getItem('scannedQRs');
      const parsedStoredQRs = storedQRs ? JSON.parse(storedQRs) : [];
      const id = Date.now().toString();
      const updatedQRs = [...parsedStoredQRs, { id, content }];
      await AsyncStorage.setItem('scannedQRs', JSON.stringify(updatedQRs));
      navigation.navigate('Home');
    } catch (error) {
      console.error('Error saving scanned QR code:', error);
    }
  };

  if (hasPermission === null) {
    return <View />;
  }
  if (hasPermission === false) {
    return <Text>No access to the camera</Text>;
  }

  return (
    <View style={styles.container}>
      <Camera style={styles.camera} onBarCodeScanned={scannedData ? undefined : handleBarCodeScanned} />

      {scannedData && (
        <View style={styles.dataContainer}>
          <Text style={styles.dataText}>Scanned Data:</Text>
          <Text style={styles.scannedData}>{scannedData}</Text>
          <TouchableOpacity style={styles.saveButton} onPress={() => saveToHistory(scannedData)}>
            <Text style={styles.saveButtonText}>Save to History</Text>
          </TouchableOpacity>
          <Button title="Close" onPress={handleCancelScan} />
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  camera: {
    flex: 1,
    width: '100%',
  },
  dataContainer: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
    marginTop: 20,
    width: '80%',
  },
  dataText: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  scannedData: {
    fontSize: 16,
    marginBottom: 20,
  },
  saveButton: {
    backgroundColor: 'blue',
    padding: 10,
    borderRadius: 5,
    marginBottom: 5,
  },
  saveButtonText: {
    
    color: 'white',
    textAlign: 'center',
    fontSize: 16,
  },
});

export default ScannerScreen;
