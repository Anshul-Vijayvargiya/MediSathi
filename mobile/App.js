import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import ScannerScreen from './src/screens/ScannerScreen';
import ResultScreen from './src/screens/ResultScreen';

const Stack = createStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator 
        initialRouteName="Scanner"
        screenOptions={{
          headerStyle: {
            backgroundColor: '#059669', // emerald-600
          },
          headerTintColor: '#fff',
          headerTitleStyle: {
            fontWeight: 'bold',
          },
        }}
      >
        <Stack.Screen 
          name="Scanner" 
          component={ScannerScreen} 
          options={{ title: 'Scan Prescription' }} 
        />
        <Stack.Screen 
          name="Results" 
          component={ResultScreen} 
          options={{ title: 'Extracted Details' }} 
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
