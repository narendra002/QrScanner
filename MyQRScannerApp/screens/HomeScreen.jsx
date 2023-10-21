import React, { useState, useEffect } from 'react';
import { View, Text, Button, FlatList, TouchableOpacity, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const HomeScreen = ({ navigation }) => {
  const [scannedQRs, setScannedQRs] = useState([]);

  useEffect(() => {
    loadScannedQRs();
  }, []);

  useEffect(() => {
    // Add a listener to refresh the list when the screen gains focus
    const unsubscribe = navigation.addListener('focus', () => {
      loadScannedQRs();
    });

    // Clean up the listener when the component unmounts
    return unsubscribe;
  }, [navigation]);

  const loadScannedQRs = async () => {
    try {
      const savedQRs = await AsyncStorage.getItem('scannedQRs');
      if (savedQRs) {
        setScannedQRs(JSON.parse(savedQRs));
      }
    } catch (error) {
      console.error('Error loading scanned QR codes:', error);
    }
  };

  const handleQRScan = () => {
    navigation.navigate('Scanner');
  };

  const deleteQRCode = async (id) => {
    try {
      const updatedQRs = scannedQRs.filter((qr) => qr.id !== id);
      setScannedQRs(updatedQRs);
      await AsyncStorage.setItem('scannedQRs', JSON.stringify(updatedQRs));
    } catch (error) {
      console.error('Error deleting scanned QR code:', error);
    }
  };

  const handleRefresh = () => {
    loadScannedQRs();
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Previously Scanned QR Codes</Text>
      <FlatList
        data={scannedQRs}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => {
          const { id, content } = item;

          return (
            <View style={styles.listItem}>
              <TouchableOpacity
                onPress={() => {
                  navigation.navigate('ScannedQRCode', { content });
                }}
              >
                <Text style={styles.listItemText}>
                  {content ? content.substring(0, 20) + '...' : 'No content'}
                </Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => deleteQRCode(id)}>
                <Text style={styles.deleteButton}>Delete</Text>
              </TouchableOpacity>
            </View>
          );
        }}
      />
      <View style={styles.buttonContainer}>
        <Button title="Scan QR Code" onPress={handleQRScan} />
        <Button title="Refresh List" onPress={handleRefresh} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f2f2f2',
  },
  title: {
    fontSize: 20,
    marginBottom: 10,
  },
  listItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 10,
    backgroundColor: '#fff',
    borderRadius: 5,
    marginVertical: 5,
  },
  listItemText: {
    flex: 1,
  },
  deleteButton: {
    color: 'red',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
  },
});

export default HomeScreen;
