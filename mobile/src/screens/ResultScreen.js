import React, { useState } from 'react';
import { StyleSheet, Text, View, ScrollView, TextInput, TouchableOpacity, Alert } from 'react-native';
import { Pill, Clock, Calendar, Save, Trash2 } from 'lucide-react-native';
import axios from 'axios';

export default function ResultScreen({ route, navigation }) {
  const { medicines: initialMedicines } = route.params;
  const [medicines, setMedicines] = useState(initialMedicines);

  const updateMedicine = (index, field, value) => {
    const newList = [...medicines];
    newList[index][field] = value;
    setMedicines(newList);
  };

  const removeMedicine = (index) => {
    setMedicines(medicines.filter((_, i) => i !== index));
  };

  const handleSave = async () => {
    try {
      // In a real app, you would loop and save each or send as a batch
      // For demo, we'll alert success
      Alert.alert(
        "Success", 
        `${medicines.length} medications have been added to your schedule.`,
        [{ text: "OK", onPress: () => navigation.navigate('Scanner') }]
      );
    } catch (error) {
      Alert.alert("Error", "Failed to save medications");
    }
  };

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Text style={styles.header}>Verify Extracted Data</Text>
        <Text style={styles.subHeader}>We've parsed the following details. Please correct any errors.</Text>

        {medicines.map((med, index) => (
          <View key={index} style={styles.card}>
            <View style={styles.cardHeader}>
              <Pill size={20} color="#059669" />
              <TextInput
                style={styles.nameInput}
                value={med.name}
                onChangeText={(text) => updateMedicine(index, 'name', text)}
                placeholder="Medicine Name"
              />
              <TouchableOpacity onPress={() => removeMedicine(index)}>
                <Trash2 size={20} color="#ef4444" />
              </TouchableOpacity>
            </View>

            <View style={styles.fieldRow}>
              <View style={styles.field}>
                <Text style={styles.label}>Dosage</Text>
                <TextInput
                  style={styles.input}
                  value={med.dosage}
                  onChangeText={(text) => updateMedicine(index, 'dosage', text)}
                  placeholder="e.g. 500mg"
                />
              </View>
              <View style={styles.field}>
                <Text style={styles.label}>Frequency</Text>
                <TextInput
                  style={styles.input}
                  value={med.frequency}
                  onChangeText={(text) => updateMedicine(index, 'frequency', text)}
                  placeholder="e.g. Twice daily"
                />
              </View>
            </View>

            <View style={styles.field}>
              <Text style={styles.label}>Timing / Instructions</Text>
              <TextInput
                style={styles.input}
                value={med.timing}
                onChangeText={(text) => updateMedicine(index, 'timing', text)}
                placeholder="e.g. After Breakfast"
              />
            </View>
          </View>
        ))}

        {medicines.length === 0 && (
          <Text style={styles.emptyText}>No medicines found. Try scanning again.</Text>
        )}
      </ScrollView>

      <View style={styles.footer}>
        <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
          <Save color="#fff" size={24} />
          <Text style={styles.saveButtonText}>Save to Dashboard</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f8fafc' },
  scrollContent: { padding: 20, paddingBottom: 100 },
  header: { fontSize: 24, fontWeight: 'bold', color: '#1e293b', marginBottom: 8 },
  subHeader: { fontSize: 14, color: '#64748b', marginBottom: 20 },
  card: { backgroundColor: '#fff', borderRadius: 16, padding: 16, marginBottom: 16, elevation: 2, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 4 },
  cardHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 15, gap: 10 },
  nameInput: { flex: 1, fontSize: 18, fontWeight: 'bold', color: '#0f172a', paddingVertical: 4 },
  fieldRow: { flexDirection: 'row', gap: 12, marginBottom: 12 },
  field: { flex: 1 },
  label: { fontSize: 12, fontWeight: '600', color: '#94a3b8', marginBottom: 4, textTransform: 'uppercase' },
  input: { backgroundColor: '#f1f5f9', borderRadius: 8, padding: 10, fontSize: 14, color: '#334155' },
  footer: { position: 'absolute', bottom: 0, width: '100%', backgroundColor: '#fff', padding: 20, borderTopWidth: 1, borderTopColor: '#e2e8f0' },
  saveButton: { backgroundColor: '#059669', flexDirection: 'row', justifyContent: 'center', alignItems: 'center', padding: 16, borderRadius: 12, gap: 10 },
  saveButtonText: { color: '#fff', fontSize: 18, fontWeight: 'bold' },
  emptyText: { textAlign: 'center', color: '#94a3b8', marginTop: 40, fontSize: 16 }
});
