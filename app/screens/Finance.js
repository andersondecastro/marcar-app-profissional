import { View, Text, FlatList, ScrollView, ActivityIndicator, Image } from 'react-native'
import React, { useCallback, useEffect, useState } from 'react'
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { _formatDate, _hour, _shortDate, BASE_URL } from './config';
import { useFocusEffect } from '@react-navigation/native';
import { TouchableOpacity } from 'react-native-gesture-handler';

export default function Finance({navigation}) {
    const [extractList, setExtractList] = useState([]);
    const [partialGains, setPartialGains] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchFinanceData = async () => {
        setError('');
        setLoading(true);
        try {
            let token = await AsyncStorage.getItem('professionalToken');
            
            const response = await axios.get(BASE_URL + '/api/professionals/me/finances', {
                headers: { 'Authorization': 'Bearer ' + token },
            });
            
            setExtractList(response.data);
        } catch (err) {
            setError(err.message); 
        } finally {
            setLoading(false); 
        }
    }

    const fetchPartialGains = async () => {
        try {
            let token = await AsyncStorage.getItem('professionalToken');
            
            const response = await axios.get(BASE_URL + '/api/professionals/me/finances/week-and-today', {
                headers: { 'Authorization': 'Bearer ' + token },
            });
            
            setPartialGains(response.data);
        } catch (err) {
            console.log(err.message); 
        } 
    }

    const goToBankingData = async () => {
        navigation.navigate('BankingForm');
    }

    useFocusEffect(
        useCallback(() => {
            fetchFinanceData();
            fetchPartialGains();
        }, [])
    );

    if (loading) return <ActivityIndicator size="large" color="#555" />;
    if (error) return <Text style={{textAlign: 'center', padding: 10}}> {error.response}</Text>;

    return (
        <View style={{flex: 1, backgroundColor: '#FFF'}}>
            {partialGains ? (
                <View style={{ backgroundColor: '#eee', borderRadius: 7, padding: 10, paddingVertical: 20, margin: 20 }}>
                    <View style={{flexDirection: 'row', justifyContent: 'space-between',}}>
                        <View>
                            <Text style={{color: '#555', fontWeight: '400', fontSize: 15}}>Ganhos na semana</Text>
                            <Text style={{color: '#333', fontWeight: '800', fontSize: 28}}>R$ {partialGains?.weeklyTotal}</Text>
                        </View>
                        <View>
                            <TouchableOpacity style={{flexDirection: 'row', alignItems: 'center', padding: 10, backgroundColor: '#fff', borderRadius: 10}} onPress={() => goToBankingData()}>
                                <Image source={require('../../assets/icons/bank.png')} style={{width: 18, height: 18,}} /> 
                                <Text style={{fontSize: 12, color: '#111'}}>+ Conta bancária</Text>
                            </TouchableOpacity>
                        </View>
                    </View>

                    <View style={{borderColor: '#DDD', borderWidth: 0.2, marginVertical: 30}}></View>

                    <View>
                        <Text style={{color: '#555', fontWeight: '400', fontSize: 15}}>Ganhos hoje</Text>
                        <Text style={{color: '#333', fontWeight: '500', fontSize: 18}}>R$ {partialGains?.todayTotal}</Text>
                    </View>
                </View>
            ) : (
                <Text style={{color: '#888', marginVertical: 10, marginHorizontal: 20}}>Nenhuma informação financeira ainda.</Text>                
            )}

            <View style={{ borderRadius: 7, padding: 10, paddingVertical: 20, margin: 20, flex: 1 }}>
                <Text style={{color: '#333', fontWeight: '500', fontSize: 28, marginBottom: 10}}>Lançamentos</Text>
                {extractList.length > 0 ? (
                    <ScrollView>
                        {extractList.map((item, index) => (
                        <View key={item._id}>
                            <View style={{flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between'}}>
                                <Text style={{color: '#888', fontSize: 12, marginVertical: 10}}>{ _formatDate(item.date) }</Text>
                                <Text style={{color: 'green', fontSize: 12, marginVertical: 10, fontWeight: '800'}}>R$ { item.totalReceived }</Text>
                            </View>
                            
                            <View style={{borderColor: '#eee', borderWidth: 1, marginVertical: 5}}></View>

                            {item.receipts.length > 0 ? (
                                
                                item.receipts.map( (itemReceipt, idx) => (
                                        <View key={idx}>
                                            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                                                <View>
                                                    <Text style={{ fontSize: 16, fontWeight: '500' }}>{itemReceipt?.serviceName || '-'}</Text>
                                                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                                        <Text style={{ fontSize: 12 }}>{_shortDate(itemReceipt.date)} - </Text>
                                                        <Text style={{ fontSize: 12 }}>{_hour(itemReceipt.date)}</Text>
                                                    </View>
                                                </View>
                                                <View>
                                                    <Text style={{ fontSize: 19, fontWeight: '200' }}>R$ {itemReceipt.subtotal_price}</Text>
                                                </View>
                                            </View>
                                            <View style={{ borderColor: '#EEE', borderWidth: 0.2, marginVertical: 20 }}></View>
                                        </View>
                                ))
                                
                            ) : (
                                <Text style={{margin: 20}}>Nenhum lançamento para essa data.</Text>
                            )}
                         </View>
                        ))}
                    </ScrollView>

                ) : (
                    null
                )}
            </View>
        </View>
    )
}