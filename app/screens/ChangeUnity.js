import { View, Text, Image, TouchableOpacity, ActivityIndicator, FlatList, ToastAndroid, Alert } from 'react-native'
import React, { useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { BASE_URL } from './config';

export default function ChangeUnity({navigation}) {
    const [units, setUnits] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const updateAvailableStatus = async (value) => {
        let storedUnity = JSON.parse( await AsyncStorage.getItem('currentAddress') );
        let profileId = ( await AsyncStorage.getItem('professionalId') );
        let token = await AsyncStorage.getItem('professionalToken');

        try {
            let data = { available: value }
            let _currentUnitId = storedUnity._id;
            
            const response = await axios.put(BASE_URL + '/api/units/' + _currentUnitId + '?update_available=' + profileId, data, {headers: { 'Authorization': 'Bearer ' + token }});
            
            if(response.data) {
              AsyncStorage.setItem('currentStatus', JSON.stringify(value));
              ToastAndroid.show( 'Status atualizado!', ToastAndroid.SHORT); 
            }
        } catch (err) {
            ToastAndroid.show( err.message, ToastAndroid.SHORT); 
        } 
    };

    const goToAddUnit = async () => {
        navigation.navigate('AddUnity');
    }

    const selectUnity = async unity => {
        await AsyncStorage.setItem('currentAddress', JSON.stringify(unity));
        ToastAndroid.show('Endereço alterado!', ToastAndroid.SHORT);;
        AsyncStorage.setItem('currentStatus', "false");
        updateAvailableStatus(false);
        navigation.navigate("Main");
    }

    useEffect(() => {
        const fetchUnits = async () => {
        setError('');
        let token = await AsyncStorage.getItem('professionalToken');
        
        try {
            const response = await axios.get(BASE_URL + '/api/professionals/me/units', {headers: { 'Authorization': 'Bearer ' + token }});
            setUnits(response.data);
        } catch (err) {
            setError(err.response.data.error); 
        } finally {
            setLoading(false); 
        }
        };

        fetchUnits();
    }, []);

    if (loading) return <ActivityIndicator size="large" color="#555" />;
    if (error) return <Text style={{textAlign: 'center', padding: 10}}> {error}</Text>;

    return (
        <View style={{flex: 1, backgroundColor: '#FFF', paddingTop: 20}}>
            <TouchableOpacity style={{margin: 20, borderColor: '#555', backgroundColor: '#E42528', borderWidth: 0.5, borderRadius: 7, padding: 10, alignItems: 'center'}} onPress={() => goToAddUnit()}>
                <Text style={{color: '#fff', fontSize: 14, fontWeight: '500'}}>Adicionar nova unidade</Text>
            </TouchableOpacity>

            {units.length > 0 ? <Text style={{marginHorizontal: 20, marginTop: 10}}>Selecione a unidade que deseja trabalhar agora</Text> : null}

            {units.length > 0 ? units.map((item, index) => (
                <TouchableOpacity onPress={() => selectUnity(item)} key={index}>
                    <View style={{marginHorizontal: 20, marginVertical: 10, borderColor: '#555', borderWidth: 0.5, borderRadius: 7, padding: 10, flexDirection: 'row', justifyContent: 'space-between'}}>
                        <View>
                            <Text style={{color: '#333', fontSize: 16, fontWeight: '600'}}> {item.name} </Text>
                            <Text style={{color: '555', fontSize: 12}}> {item.street} {item.number} </Text>
                            <Text style={{color: '555', fontSize: 12}}> {item.city} {item.state} </Text>
                        </View>
                        {/* <TouchableOpacity style={{right: 10}} onPress={() => openOptions()}>
                            <Image source={require('../../assets/icons/menu-point-vertical.png')} style={{height: 21, width: 5}} />
                        </TouchableOpacity> */}
                        <View>
                            {(item.available) ? ( 
                                <View style={{backgroundColor: 'lightgreen', padding: 3, borderRadius: 5,}}>
                                    <Text style={{fontSize: 12}}> disponível </Text> 
                                </View>
                            ) : null}
                        </View>
                    </View>
                </TouchableOpacity>
            )) : (
                <Text style={{color: '#888', fontSize: 13, marginTop: 10, marginHorizontal: 20}}> Nenhuma unidade cadastrada ainda.</Text>
            )}
        </View>
    )
}