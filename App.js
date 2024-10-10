import React, { useEffect, useState } from 'react'
import AppNavigator from './Navigation';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { BASE_URL } from './app/screens/config';
import { WebSocketProvider } from './WebSocketProvider';
import axios from 'axios';
import * as Notifications from 'expo-notifications';

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(null);
  
  useEffect(() => {
    const requestNotificationPermission = async () => {
      const { status } = await Notifications.requestPermissionsAsync();
      if (status !== 'granted') {
        console.log('Permissão para receber notificações é necessária!');
        return;
      }
      console.log('Permissão concedida para notificações');
    };

    requestNotificationPermission();
  }, []);

  useEffect(() => {
    const checkLoginStatus = async () => {
      const token = await AsyncStorage.getItem('professionalToken');
      const valid = await isTokenValid(token);
      setIsLoggedIn(valid);
    };

    checkLoginStatus();
  }, []);

  const isTokenValid = async (token) => {
    if (!token) return false;
    
    try {
      let verification = await axios.post(BASE_URL+'/api/professionals/checktoken', {token});
      return verification.data.valid;
    } catch (error) {
      return false;
    }
  };

  if (isLoggedIn === null) {
    return null;
  }

  return (
    <WebSocketProvider>
      <AppNavigator isLoggedIn={isLoggedIn}  />
    </WebSocketProvider>
  )
}