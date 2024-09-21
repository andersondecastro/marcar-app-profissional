import React, { useEffect, useState } from 'react'

import AppNavigator from './Navigation';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { BASE_URL } from './app/screens/config';
import axios from 'axios';

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(null);
  const [stateInProgress, setStateInProgress] = useState(null);

  useEffect(() => {
    const checkLoginStatus = async () => {
      const token = await AsyncStorage.getItem('professionalToken');
      const valid = await isTokenValid(token);
      setIsLoggedIn(valid);
    };

    checkLoginStatus();
  }, []);

  useEffect(() => {
    const checkLastState = async () => {
      let isStateInProgress = JSON.parse( await AsyncStorage.getItem("isStateInProgress") );
      console.log("[ is state: ", isStateInProgress, " - tipo:  ", typeof isStateInProgress , "]");

      let stateInProgress = await AsyncStorage.getItem("stateInProgress");
      console.log("what state: ", stateInProgress);

      if(isStateInProgress) {
        setStateInProgress(stateInProgress);
      }
    }

    checkLastState();
  }, [])

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
    <AppNavigator isLoggedIn={isLoggedIn} stateInProgress={stateInProgress} />
  )
}