import { View, Text, TouchableOpacity, StyleSheet, Image, TextInput, Vibration, ToastAndroid } from 'react-native'
import React, { useEffect, useState } from 'react'
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { BASE_URL } from './config';
import sendWebSocketEvent from './sendWebSocketEvent';

export default function RequestDetails({navigation}) {
    const [isPressed, setIsPressed] = useState(false);
    const [value, setValue] = useState('');
    const [customerData, setCustomerData] = useState(null);
    const [estimatedArrive, setEstimatedArrive] = useState('-');
    const [verificationCode, setVerificationCode] = useState(null);

    const pressDuration = 1000;

    const handleLongPress = () => {
        setIsPressed(true);
        setTimeout(() => {
            setIsPressed(false);
            startService();
        }, pressDuration);
    };

    const handleChange = (text) => {
        const formatted = text.replace(/[^0-9]/g, '').slice(0, 4);
        setValue(formatted);
    };
    
    const formattedValue = value.split('').join(' ');

    useEffect(() => {
        let fetchRequestData = async () => {
            try {
                let token = await AsyncStorage.getItem('professionalToken');
                let _currentRequestId = JSON.parse( await AsyncStorage.getItem('currentRequestInProgress') );
                
                const response = await axios.get(BASE_URL + '/api/requests/' + _currentRequestId, {headers: { 'Authorization': 'Bearer ' + token }});
                
                if(response.data.status == 'andamento') {
                    navigation.navigate("ServiceInProgress");
                }
                setCustomerData(response.data);
                setVerificationCode(response.data.verification_code);
            } catch (error) {
                console.log("[ERRO FETCH REQUEST DATA] ",error);
            }
        }

        fetchRequestData();
    }, []);
    
    const startService = async () => {
        if(verificationCode !== value) {
            ToastAndroid.show( 'Código de verificação inválido. ', ToastAndroid.SHORT); 
            Vibration.vibrate(200);
            return;
        }

        Vibration.vibrate([500,1000,500]);
        
        try {
            const token = await AsyncStorage.getItem('professionalToken');
            const _currentRequestId = JSON.parse( await AsyncStorage.getItem('currentRequestInProgress') );
            let data = { status: 'andamento' };
            const _currentprofessionalId = await AsyncStorage.getItem('professionalId');
            
            const response = await axios.put(BASE_URL + '/api/requests/' + _currentRequestId, data, {headers: { 'Authorization': 'Bearer ' + token }});
            
            if(response.data && response.data.status == 'andamento') {
                await sendWebSocketEvent({
                    type: 'start_call',
                    requestId: _currentRequestId,
                    professionalId: _currentprofessionalId,
                });

                navigation.navigate("ServiceInProgress");
            }
        } catch (err) {
            ToastAndroid.show( err.message, ToastAndroid.SHORT); 
        } 
    }

    return (
        <View style={{flex: 1, backgroundColor: '#FFF', paddingTop: 60, paddingHorizontal: 20}}>
            <Text style={{fontSize: 20, fontWeight: '500', textAlign: 'center'}}>Chamado em andamento</Text>

            <View style={{flexDirection: 'row', maxWidth: '100%', alignItems: 'center', borderWidth: 0.5, borderColor: '#DDD', borderRadius: 7, marginVertical: 20, padding: 5}}>
                <Image source={require('../../assets/spinner.gif')} style={{width: 45, height: 45, alignSelf: 'center'}} />
                <Text style={{flexWrap: 'wrap', fontSize: 12}}> Aguarde! O motorista está se deslocando... </Text>
            </View>

            <View>
                <Text style={{fontSize: 14, fontWeight: '300'}}> Cliente: </Text>
                <Text style={{fontSize: 21, fontWeight: '500'}}> {customerData?.customer_id.name} </Text>
            </View>

            <View style={{flexDirection: 'row', justifyContent: 'space-between', maxWidth: '100%', alignItems: 'center', borderWidth: 0.5, borderColor: '#DDD', borderRadius: 7, marginVertical: 20, padding: 10}}>
                <View style={{flexDirection: 'column', alignItems: 'center'}}>
                    <Text style={{fontSize: 12}}> Chegada prevista:  </Text>
                    <Text style={{fontSize: 21, fontWeight: '400'}}> {estimatedArrive}  </Text>
                </View>

                <View style={{width: 1, height: '100%', backgroundColor: '#DDD'}}>
                </View>

                <View style={{flexDirection: 'column', alignItems: 'center'}}>
                    <Text style={{fontSize: 12}}> Serviço solicitado:  </Text>
                    <Text style={{fontSize: 18, fontWeight: '400'}}> {customerData?.services.map(i=>i.name).join(' | ')}  </Text>
                </View>
            </View>

            <View style={{ justifyContent:'center', alignItems: 'center'}}>
                <Text style={{color: '#555', marginVertical: 5, marginTop: 30}}> Informe o código do cliente abaixo: </Text>
                <TextInput
                    style={styles.input}
                    keyboardType='numeric'
                    maxLength={7} 
                    value={formattedValue}
                    onChangeText={handleChange}
                    textAlign='center'
                    placeholder='    '
                    placeholderTextColor='#CCC'
                />
            </View>
            
            <TouchableOpacity
                style={[styles.button, isPressed && styles.buttonPressed]}
                onLongPress={handleLongPress}
                delayLongPress={pressDuration} 
            >
                <Text style={[styles.buttonText, isPressed && styles.buttonTextPressed]}>COMEÇAR SERVIÇO</Text>
            </TouchableOpacity>
            
        </View>
    )
}


const styles = StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: '#f5f5f5',
    },
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
    input: {
        borderWidth: 0.5,
        borderColor: '#BBB',
        borderRadius: 7,
        padding: 15,
        width: '100%',
        fontSize: 21,
        letterSpacing: 10, 
    },
  });

  
