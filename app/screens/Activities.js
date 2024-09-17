import { StatusBar } from 'expo-status-bar';
import { View, Text, FlatList, StyleSheet, ActivityIndicator, TouchableOpacity, Image } from 'react-native'
import React, { useCallback, useEffect, useState } from 'react'
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { BASE_URL, _date, _hour } from './config';
import statusMap from './statusMap.js';
import { useFocusEffect } from '@react-navigation/native';


export default function Activities({navigation}) {
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const goToDetails = async (reqId) => {
    await AsyncStorage.setItem('currentRequestInProgress', JSON.stringify(reqId));
    navigation.navigate('RequestDetails');
  }

  const renderItem = ({ item }) => {
    const statusInfo = statusMap[item.status.toLowerCase()] || { 
      image: require('../../assets/criado.png'), 
      label: 'DESCONHECIDO' 
    };

    return (
      <View style={styles.item}>
        <TouchableOpacity onPress={ () => { if (item.status == 'andamento'||item.status == 'aceito') goToDetails(item._id) } }>
          <View style={{justifyContent: 'space-around', width: '100%', flexDirection: 'row'}}>
            <View>
                <Text style={styles.title}>{item.services.map(i => i.name)} </Text>
                <Text style={styles.sutitle}>Solicitado em: {_date(item.createdAt)} às {_hour(item.createdAt)} </Text>
                
                <View style={{flexDirection: 'row', alignItems: 'center', marginTop: 5}}> 
                  <Image source={statusInfo.image} style={{width: 20, height: 20}} />
                  <Text style={{color: '#444'}}> {statusInfo.label}</Text>
                </View>
            </View>
            <View>
                <Text style={{color: '#888', fontWeight: 'bold'}}> {item.subtotal_price ? 'R$ '+item.subtotal_price : '-'} </Text>
            </View>
          </View>
        </TouchableOpacity>
      </View>
  )};
  
  const fetchActivities = async () => {
    setError('');
    setLoading(true);
    try {
      let token = await AsyncStorage.getItem('professionalToken');
      const response = await axios.get(BASE_URL + '/api/professionals/me/requests', {
        headers: { 'Authorization': 'Bearer ' + token },
      });
      setActivities(response.data);
    } catch (err) {
      setError(err.message); 
    } finally {
      setLoading(false); 
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchActivities();
    }, [])
  );

  if (loading) return <ActivityIndicator size="large" color="#555" />;
  if (error) return <Text style={{textAlign: 'center', padding: 10}}> {error.response}</Text>;

  return (
    <View style={{flex: 1, backgroundColor: '#FFF'}}>
      
      {activities.length <=0 ? (<Text style={{textAlign: 'center', padding: 10, color: '#888'}}>Nenhuma atividade registrada ainda.</Text>) : null}

      <FlatList
        data={activities} 
        renderItem={renderItem} 
        keyExtractor={item => item._id} 
      />
    </View>
  )
}

const styles = StyleSheet.create({
    container: {
      flex: 1,
      marginTop: StatusBar.currentHeight || 0,
    },
    item: {
      padding: 10,
      paddingBottom: 20,
      marginVertical: 8,
      marginHorizontal: 16,
      flexDirection: 'row',
      justifyContent: 'space-between',
      borderBottomWidth: 0.5,
      borderBottomColor: '#eee',
      
    },
    title: {
      fontSize: 16,
      fontWeight: 'bold',
      color: '#555'
    },
    sutitle: {
        fontSize: 13,
        color: '#555'
    },
    titlePage: {
        color: '#000', 
        fontSize: 21, 
        fontWeight: 'bold',
        padding: 20
    }
  });
