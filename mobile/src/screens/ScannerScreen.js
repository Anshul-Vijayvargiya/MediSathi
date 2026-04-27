import React, { useState, useEffect, useRef } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Image, ActivityIndicator, Alert } from 'react-native';
import { CameraView, useCameraPermissions } from 'expo-camera';
import { Camera, RefreshCw, Check, X } from 'lucide-react-native';
import axios from 'axios';

// Replace with your local IP or backend URL
const API_URL = 'http://192.168.1.100:5000/api'; // Use actual IP for physical device

export default function ScannerScreen({ navigation }) {
  const [permission, requestPermission] = useCameraPermissions();
  const [photo, setPhoto] = useState(null);
  const [loading, setLoading] = useState(false);
  const cameraRef = useRef(null);

  if (!permission) return <View />;
  if (!permission.granted) {
    return (
      <View style={styles.container}>
        <Text style={styles.text}>We need your permission to show the camera</Text>
        <TouchableOpacity style={styles.button} onPress={requestPermission}>
          <Text style={styles.buttonText}>Grant Permission</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const takePicture = async () => {
    if (cameraRef.current) {
      const options = { quality: 0.8, base64: true };
      const data = await cameraRef.current.takePictureAsync(options);
      setPhoto(data);
    }
  };

  const uploadImage = async () => {
    if (!photo) return;

    setLoading(true);
    const formData = new FormData();
    formData.append('prescription', {
      uri: photo.uri,
      type: 'image/jpeg',
      name: 'prescription.jpg',
    });

    try {
      // Note: Add authentication token if required
      const response = await axios.post(`${API_URL}/ocr/scan`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      if (response.data.status === 'success') {
        navigation.navigate('Results', { medicines: response.data.data });
      } else {
        Alert.alert('Error', 'Could not parse prescription. Please try again.');
      }
    } catch (error) {
      console.error(error);
      Alert.alert('Upload Failed', error.response?.data?.message || 'Check your connection');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      {!photo ? (
        <CameraView style={styles.camera} ref={cameraRef}>
          <View style={styles.overlay}>
            <View style={styles.guideBox} />
            <Text style={styles.guideText}>Align prescription inside the box</Text>
          </View>
          <View style={styles.controls}>
            <TouchableOpacity style={styles.captureButton} onPress={takePicture}>
              <Camera color="#fff" size={32} />
            </TouchableOpacity>
          </View>
        </CameraView>
      ) : (
        <View style={styles.preview}>
          <Image source={{ uri: photo.uri }} style={styles.image} />
          {loading && (
            <View style={styles.loadingOverlay}>
              <ActivityIndicator size="large" color="#059669" />
              <Text style={styles.loadingText}>Analyzing Prescription...</Text>
            </View>
          )}
          <View style={styles.previewControls}>
            <TouchableOpacity 
              style={[styles.actionButton, styles.cancelBtn]} 
              onPress={() => setPhoto(null)}
              disabled={loading}
            >
              <X color="#fff" size={24} />
              <Text style={styles.buttonText}>Retake</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={[styles.actionButton, styles.confirmBtn]} 
              onPress={uploadImage}
              disabled={loading}
            >
              <Check color="#fff" size={24} />
              <Text style={styles.buttonText}>Process</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#000' },
  camera: { flex: 1 },
  overlay: { flex: 1, backgroundColor: 'transparent', justifyContent: 'center', alignItems: 'center' },
  guideBox: { width: '85%', height: '60%', borderWidth: 2, borderColor: 'rgba(255,255,255,0.5)', borderRadius: 12 },
  guideText: { color: '#fff', marginTop: 20, fontSize: 16, fontWeight: '500' },
  controls: { position: 'absolute', bottom: 40, width: '100%', alignItems: 'center' },
  captureButton: { width: 70, height: 70, borderRadius: 35, backgroundColor: '#059669', justifyContent: 'center', alignItems: 'center', borderWidth: 4, borderColor: 'rgba(255,255,255,0.3)' },
  preview: { flex: 1 },
  image: { flex: 1, resizeMode: 'contain' },
  previewControls: { position: 'absolute', bottom: 40, flexDirection: 'row', width: '100%', justifyContent: 'space-evenly' },
  actionButton: { flexDirection: 'row', alignItems: 'center', paddingVertical: 12, paddingHorizontal: 24, borderRadius: 30, gap: 8 },
  cancelBtn: { backgroundColor: '#ef4444' },
  confirmBtn: { backgroundColor: '#059669' },
  buttonText: { color: '#fff', fontWeight: 'bold', fontSize: 16 },
  loadingOverlay: { ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(0,0,0,0.7)', justifyContent: 'center', alignItems: 'center' },
  loadingText: { color: '#fff', marginTop: 15, fontSize: 18, fontWeight: '600' },
  text: { color: '#fff', textAlign: 'center', marginBottom: 20 },
  button: { backgroundColor: '#059669', padding: 15, borderRadius: 10 }
});
