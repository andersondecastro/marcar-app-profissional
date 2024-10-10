import { View, Text, Switch, StyleSheet, ActivityIndicator, Image, TouchableOpacity, ToastAndroid } from 'react-native';
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { BASE_URL } from './config';
import LiveRequests from './LiveRequests';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from '@react-navigation/native';

export default function Welcome({route, navigation}) {
    const [isEnabled, setIsEnabled] = useState(false);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);
    const [name, setName] = useState('');
    const [profileId, setProfileId] = useState(null);
    const [lastActiveAddress, setLastActiveAddress] = useState(null);

    const fetchInfoData = async () => {
        setError('');
        let token = await AsyncStorage.getItem('professionalToken');
        
        try {
          const response = await axios.get(BASE_URL + '/api/professionals/me', {headers: { 'Authorization': 'Bearer ' + token }});
          setName(response.data?.name);
          setProfileId(response.data?._id);
        } catch (err) {
          setError(err.message); 
        } finally {
          setLoading(false); 
        }
    };

    const checkRequestStatusInProgress = async () => {
      const token = await AsyncStorage.getItem('professionalToken');
      const _professionalId = await AsyncStorage.getItem('professionalId');
      
      try {
        let results = await axios.get(BASE_URL+'/api/requests?professionalId='+_professionalId, {token});
        let listResult = results.data.filter(i => ["aceito", "andamento"].includes(i.status)).map(item => item); // todos os requests do profissional logado.
        
        if(listResult.length > 0){
          navigation.navigate('PendingRequests', {data: listResult})
        }
        return;
      } catch (error) {
        console.log("ERR:  " , error)
        return false;
      }
    };

    useFocusEffect(
      React.useCallback(() => {
        const setAddress = async () => {
          let _currentAddress = await AsyncStorage.getItem('currentAddress');
          let _currentStatus = await AsyncStorage.getItem('currentStatus');
          setLastActiveAddress(_currentAddress ? JSON.parse(_currentAddress) : _currentAddress);
          setIsEnabled(JSON.parse(_currentStatus));
        };
        checkRequestStatusInProgress();
        setAddress();
        fetchInfoData();
      }, [])
    );
    
    const updateAvailableStatus = async () => {
        let storedUnity = JSON.parse( await AsyncStorage.getItem('currentAddress') );
        let token = await AsyncStorage.getItem('professionalToken');

        try {
          let _newStatusAvailable = isEnabled ? false : true;
            let data = { available: _newStatusAvailable }
            let _currentUnitId = storedUnity._id;
            
            const response = await axios.put(BASE_URL + '/api/units/' + _currentUnitId + '?update_available=' + profileId, data, {headers: { 'Authorization': 'Bearer ' + token }});
            
            if(response.data) {
              setIsEnabled(_newStatusAvailable);
              AsyncStorage.setItem('currentStatus', JSON.stringify(_newStatusAvailable));
              ToastAndroid.show( 'Status atualizado!', ToastAndroid.SHORT); 
            }
        } catch (err) {
            ToastAndroid.show( err.message, ToastAndroid.SHORT); 
        } 
    };

    if (loading) return <ActivityIndicator size="large" color="#555" />;
    if (error) return <Text style={{textAlign:'center', marginTop: 60, padding: 10}}>Erro: {error}</Text>;

    const textColor = isEnabled ? '#52E425' : '#E42528';
    const buttonColor = isEnabled ? 'green' : '#E42528';
    
    return (
        <View style={{flex: 1, backgroundColor: '#FFF', paddingTop: 60}}>
            <TouchableOpacity style={{flexDirection: 'row', justifyContent: 'center', alignItems: 'center'}} onPress={() => navigation.navigate("ChangeUnity")}>
              <Text style={{textAlign: 'center', color: '#222', fontSize: 13, fontWeight: '500', marginHorizontal: 5}}> {lastActiveAddress ? `${lastActiveAddress.street} ${lastActiveAddress.number}` : 'Mudar endereço'} </Text>
              <Image source={require('../../assets/icons/down.png')} style={{width: 10, height: 6}} />
            </TouchableOpacity>

            <View style={{padding: 20, backgroundColor: '#f7f7f7', borderRadius: 7, marginTop: 40, marginHorizontal: 20, borderColor: '#888', borderWidth: 0.5}}>
                <Text style={{color: '#000', fontSize: 21, fontWeight: 'bold'}}>Olá {name || ''}!</Text>
                <View style={{flexDirection: 'row'}}>
                    <Text style={[styles.labelTxt]}> Você está </Text>
                    <Text style={{ color: textColor }}> {isEnabled ? 'ONLINE' : 'OFFLINE'} </Text>
                </View>
            </View>

            {lastActiveAddress ? (
              <View style={{flexDirection: 'row', justifyContent: 'center', padding: 20, marginTop: 100, alignItems: 'center',}}>
                  <TouchableOpacity style={{backgroundColor: buttonColor, paddingHorizontal: 30, paddingVertical: 20, borderRadius: 100}} onPress={() => updateAvailableStatus()}>
                    {isEnabled ? (
                      <Text style={{color: '#F3F3F3', fontWeight: 'bold', fontSize: 21}}> CONECTADO! </Text>
                    ) : (
                      <Text style={{color: '#F3F3F3', fontWeight: 'bold', fontSize: 21}}> CONECTAR </Text>
                    )}
                  </TouchableOpacity>
              </View>
            ) : (
              <View style={{margin: 20, padding: 10}}>
                <Text>Escolha uma unidade primeiro para ficar online</Text>
                <TouchableOpacity style={{margin: 20, borderColor: '#555', backgroundColor: '#E42528', borderWidth: 0.5, borderRadius: 7, padding: 10, alignItems: 'center'}} onPress={() =>  navigation.navigate("ChangeUnity")}>
                    <Text style={{color: '#fff', fontSize: 14, fontWeight: '500'}}>Ativar unidade</Text>
                </TouchableOpacity>
              </View>
            )}

            { isEnabled ? <LiveRequests /> : (<Text style={{margin: 20, color: '#888', padding: 20}}>Você não receberá chamados quando estiver indisponível!</Text>) }
        </View>
    )
}


const styles = StyleSheet.create({
    switchContainer: {
      width: 80,
      height: 140,
      justifyContent: 'center',
      alignItems: 'center',
    },
    labelTxt: {
        color: '#555',
    }
  });