import React from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';

const ScannedQRCodeScreen = ({ route, navigation }) => {
  const { content } = route.params;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Scanned QR Code Content:</Text>
      <Text style={styles.contentText}>{content}</Text>
      <Button title="Go Back" onPress={() => navigation.goBack()} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  contentText: {
    fontSize: 16,
    marginBottom: 20,
  },
});

export default ScannedQRCodeScreen;
