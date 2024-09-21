import { View, Text, StyleSheet, TouchableOpacity, Vibration, ToastAndroid, BackHandler } from 'react-native'
import React, { useEffect, useState } from 'react'
import Timer from './Timer';
import { StatusBar } from 'expo-status-bar';
import axios from 'axios';
import { BASE_URL } from './config';
import AsyncStorage from '@react-native-async-storage/async-storage';
import sendWebSocketEvent from './sendWebSocketEvent';

export default function ServiceInProgress({navigation}) {
    const [isPressed, setIsPressed] = useState(false);

    useEffect(() => {
        const backAction = () => {
          return true;
        };
    
        BackHandler.addEventListener('hardwareBackPress', backAction);
    
        return () => {
          BackHandler.removeEventListener('hardwareBackPress', backAction);
        };
    }, [navigation]);
    
    const pressDuration = 1000;

    const handleLongPress = () => {
        setIsPressed(true);
        setTimeout(() => {
            setIsPressed(false);
            finishService();
        }, pressDuration);
    };

    const finishService = async () => {
        Vibration.vibrate([500,1000,500]);
        
        try {
            let token = await AsyncStorage.getItem('professionalToken');
            let _currentRequestId = JSON.parse( await AsyncStorage.getItem('currentRequestInProgress') );
            let _currentprofessionalId = await AsyncStorage.getItem('professionalId');
            AsyncStorage.removeItem("stateInProgress");
            AsyncStorage.removeItem("isStateInProgress");

            let data = { status: 'encerrado' };
            
            const response = await axios.put(BASE_URL + '/api/requests/' + _currentRequestId, data, {headers: { 'Authorization': 'Bearer ' + token }});
            
            if(response.data && response.data.status == 'encerrado') {
                await sendWebSocketEvent({
                    type: 'finish_call',
                    requestId: _currentRequestId,
                    professionalId: _currentprofessionalId,
                });

                ToastAndroid.show( 'Parabéns, serviço encerrado!', ToastAndroid.SHORT); 
                navigation.navigate("Main");
            }
        } catch (err) {
            ToastAndroid.show( err.message, ToastAndroid.SHORT); 
        } 
    }

    return (
        <View style={{flex: 1, backgroundColor: '#111', paddingTop: 60, paddingHorizontal: 20}}>
            <Text style={{fontSize: 20, fontWeight: '500', textAlign: 'center', color: '#f3f3f3'}}>Serviço em andamento</Text>

            <Timer initialColor='#f7f7f7' />

            <TouchableOpacity
                style={[styles.button, isPressed && styles.buttonPressed]}
                onLongPress={handleLongPress}
                delayLongPress={pressDuration} 
            >
                <Text style={[styles.buttonText, isPressed && styles.buttonTextPressed]}>ENCERRAR SERVIÇO</Text>
            </TouchableOpacity>

            <StatusBar barStyle="light-content" color="#FFf" backgroundColor="#111"  />
        </View>
    )
}


const styles = StyleSheet.create({
    button: {
        marginVertical: 20, 
        backgroundColor: '#E42528', 
        borderRadius: 7, 
        padding: 10, 
        alignItems: 'center',
    },
    buttonPressed: {
      backgroundColor: '#888', 
    },
    buttonText: {
      color: '#fff',
      fontSize: 16,
    },
    buttonTextPressed: {
        color: '#222'
    },
  });