import { View, Text, BackHandler, TextInput, TouchableOpacity, ScrollView, ToastAndroid } from 'react-native'
import React, { useEffect, useState } from 'react';
import { Picker } from '@react-native-picker/picker';
import styles from '../styles.js';  
import statesBrazil from './statesBrazil.js';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { BASE_URL } from './config.js';
const GOOGLE_MAPS_APIKEY = 'AIzaSyAOpdZ5yzReKCQobwk3DAnPzGT_yrSDf4Q';

export default function AddUnity({route, navigation}) {
    const [name, setName] = useState(null);
    const [cep, setCep] = useState(null);
    const [street, setStreet] = useState(null);
    const [neighborhood, setNeighborhood] = useState(null);
    const [number, setNumber] = useState(null);
    const [city, setCity] = useState(null);
    const [state, setState] = useState(null);
    
    const getCoordinatesFromAddress = async (address) => {
        const apiKey = GOOGLE_MAPS_APIKEY; // Substitua com sua chave de API
        const response = await axios.get(`https://maps.googleapis.com/maps/api/geocode/json`, {
            params: {
            address: address,
            key: apiKey
            }
        });
        
        if (response.data.status === 'OK') {
            const location = response.data.results[0].geometry.location;
            return location;
        } else {
            throw new Error('Geocoding API error: ' + response.data.status);
        }
    };

    const saveAddress = async () => {
        try {
            if(!cep) { 
                ToastAndroid.show('Informe o CEP por favor.', ToastAndroid.SHORT);;
                return; 
            }
            if(!number) { 
                ToastAndroid.show('Informe o número por favor.', ToastAndroid.SHORT);;
                return; 
            }

            let _professionalId = await AsyncStorage.getItem('professionalId');
            let _location = await getCoordinatesFromAddress( `${street} ${number} - ${neighborhood}, ${city} - ${state}` );

            let dataToSend = {
                name, cep, street, neighborhood, number, city, state, professional_id: _professionalId, latitude: _location.lat, longitude: _location.lng
            }
            
            let result = await axios.post(BASE_URL + '/api/units', dataToSend);

            if(result.data) {
                await AsyncStorage.setItem('currentAddress', JSON.stringify(result.data));
                ToastAndroid.show('Novo endereço adicionado!', ToastAndroid.SHORT);;
                AsyncStorage.setItem('currentStatus', "false");
                navigation.navigate("Main");
            } else {
                ToastAndroid.show('Por favor, tente em instantes...', ToastAndroid.SHORT);;
            }

        } catch (error) {
            ToastAndroid.show(error.response.data.error, ToastAndroid.SHORT);;
        }
    }

    const fetchAddress = async (cep) => {
        try {
          if (cep.length === 8) {
            const response = await axios.get(`https://viacep.com.br/ws/${cep}/json/`);
            const { logradouro, bairro, localidade, uf } = response.data;
    
            setStreet(logradouro);
            setNeighborhood(bairro);
            setCity(localidade);
            setState(uf);
          } else {
            setStreet('');
            setNeighborhood('');
            setCity('');
            setState('');
          }
        } catch (error) {
          console.error("Erro ao buscar o endereço:", error);
          ToastAndroid.show("Não foi possível recuperar o endereço no momento.", ToastAndroid.SHORT);
        }
    };

    const handleCepChange = (text) => {
        const cleanedText = text.replace(/\D/g, '');
        setCep(cleanedText);
        
        if (cleanedText.length === 8) {
          fetchAddress(cleanedText);
        } else {
          setStreet('');
          setNeighborhood('');
          setCity('');
          setState('');
        }
      };

    useEffect(() => {
        const handleBackButtonPress = () => {
            navigation.navigate('Welcome');
            return true;
        };

        BackHandler.addEventListener('hardwareBackPress', handleBackButtonPress);
        
        return () => {
            BackHandler.removeEventListener('hardwareBackPress', handleBackButtonPress);
        };
    }, [navigation]);

    return (
        <View style={styles.container}>
            <ScrollView style={{width: '80%'}}>
                <Text style={styles.labelForm}>Nome da unidade</Text>
                <View style={styles.inputContainer}>
                    <TextInput placeholder='Informe o nome da unidade' style={styles.inputTextForm} value={name} onChangeText={text => setName(text)}  />
                </View>

                <Text style={styles.labelForm}>CEP</Text>
                <View style={styles.inputContainer}>
                    <TextInput placeholder='Informe o CEP' style={styles.inputTextForm} value={cep} onChangeText={text => handleCepChange(text)} maxLength={8} keyboardType='numeric' />
                </View>

                <Text style={styles.labelForm}>Endereço</Text>
                <View style={styles.inputContainer}>
                    <TextInput placeholder='Informe o endereço' style={styles.inputTextForm} value={street} onChangeText={text => setStreet(text)}  />
                </View>

                <Text style={styles.labelForm}>Bairro</Text>
                <View style={styles.inputContainer}>
                    <TextInput placeholder='Informe o bairro' style={styles.inputTextForm} value={neighborhood} onChangeText={text => setNeighborhood(text)}  />
                </View>

                <Text style={styles.labelForm}>Número</Text>
                <View style={styles.inputContainer}>
                    <TextInput placeholder='Informe o número' style={styles.inputTextForm} value={number} onChangeText={text => setNumber(text)} keyboardType='numeric' />
                </View>

                <Text style={styles.labelForm}>Estado</Text>
                <Picker
                    selectedValue={state}
                    onValueChange={(itemValue) => setState(itemValue)}
                    style={[ styles.inputContainer, {height: 50, width: '100%',  backgroundColor: '#EEE', borderRadius: 7, borderColor: '#222', borderWidth: 1} ]}
                >
                    <Picker.Item label="Selecione um estado" value="" />
                    {statesBrazil.map((estado) => (
                    <Picker.Item key={estado.value} label={estado.label} value={estado.value} />
                    ))}
                </Picker>

                <Text style={styles.labelForm}>Cidade</Text>
                <View style={styles.inputContainer}>
                    <TextInput placeholder='Informe a cidade' style={styles.inputTextForm} value={city} onChangeText={text => setCity(text)}  />
                </View>

                
                <TouchableOpacity style={styles.buttonForm} onPress={() => saveAddress()}>
                    <Text style={styles.buttonText}> Salvar endereço </Text>
                </TouchableOpacity>
            </ScrollView>
        </View>
    )
}