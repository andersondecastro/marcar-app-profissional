import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, ActivityIndicator, Image, TouchableOpacity, Vibration, ToastAndroid } from 'react-native';
import { BASE_URL, BASE_URL_WS } from './config';
import sendWebSocketEvent from './sendWebSocketEvent';
import CountdownTimer from './Counter';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { useNavigation } from '@react-navigation/native';
import * as Notifications from 'expo-notifications';

const time_miliseconds = 30000;

const WebSocketURL = BASE_URL_WS;

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
  }),
});

export default function RealTimeCallsScreen() {
  const [calls, setCalls] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isEnabled, setIsEnabled] = useState(false);
  const navigation = useNavigation();

  const handleNotifications = async () => {
    const { status } = await Notifications.getPermissionsAsync();
    if(status !== 'granted')  {
      ToastAndroid.show('Você não habilitou as notificações', ToastAndroid.SHORT);
    } else {
      await Notifications.scheduleNotificationAsync({
        content: {
          title: 'MARCAR - Tem serviço na área! ',
          body: 'Você está recebendo um chamado de serviço...',
          data: {screen: 'Welcome'}
        },
        trigger: {
          seconds: 1,
        }
      })
    }
  }

  useEffect(() => {
    const subscription = Notifications.addNotificationResponseReceivedListener(response => {
      const { data } = response.notification.request.content;
      if (data.screen) {
        navigation.navigate(data.screen);
      }
    });
    return () => subscription.remove();
  }, [navigation]);

  const updateAvailableStatus = async () => {
    let storedUnity = JSON.parse(await AsyncStorage.getItem('currentAddress'));
    let token = await AsyncStorage.getItem('professionalToken');
    let profileId = await AsyncStorage.getItem('professionalId');

    try {
      let data = { available: false };
      let _currentUnitId = storedUnity._id;
      
      const response = await axios.put(
        `${BASE_URL}/api/units/${_currentUnitId}?update_available=${profileId}`,
        data,
        { headers: { 'Authorization': `Bearer ${token}` } }
      );

      if (response.data) {
        setIsEnabled(false);
        await AsyncStorage.setItem('currentStatus', JSON.stringify(false));
      }
    } catch (err) {
      ToastAndroid.show(err.message, ToastAndroid.SHORT);
    }
  };

  const acceptRequest = async item => {
    try {
      let token = await AsyncStorage.getItem('professionalToken');
      let _professionalId = await AsyncStorage.getItem('professionalId');
      let currentUnity = JSON.parse(await AsyncStorage.getItem('currentAddress'));
      let _currentRequestId = item?._id || item?.requestId;
      let data = { status: 'aceito', unity_id: currentUnity._id };

      await sendWebSocketEvent({
        type: 'accept_call',
        requestId: _currentRequestId,
        unityId: currentUnity._id,
        professionalId: _professionalId
      });
      
      const response = await axios.put( BASE_URL+'/api/requests/'+_currentRequestId, data, { headers: { 'Authorization': `Bearer ${token}` } });
      
      if (response.data) {
        await updateAvailableStatus();
        await AsyncStorage.setItem('currentRequestInProgress', JSON.stringify(item._id));
        await AsyncStorage.setItem("stateInProgress", "aceitou_chamado");
        await AsyncStorage.setItem("isStateInProgress", "true");
        navigation.navigate("RequestDetails");
      }
    } catch (err) {
      ToastAndroid.show(err.message, ToastAndroid.SHORT);
    }
  };

  useEffect(() => {
    const socket = new WebSocket(WebSocketURL);

    socket.onopen = () => {
      console.log('Conectado ao servidor WebSocket');
      setLoading(false);
    };

    socket.onmessage = (event) => {
      if (event.data?.type == 'ping') {
          console.log('Recebido ping, enviando PONG');
          socket.send(JSON.stringify({ type: 'pong', time: (new Date()).getTime() }));
          return;
      }

      const chamado = typeof event.data == 'object' ? (event.data) : JSON.parse(event.data);
      
      if (chamado.type == 'new_call' || chamado.type == 'new_call_again') {
        Vibration.vibrate([500, 500]);
        handleNotifications();

        const chamadoResultId = chamado.result._id;
        const timeoutId = setTimeout(() => {
          setCalls((currentCalls) => 
            currentCalls.filter(c => c?._id !== chamadoResultId)
          );
        }, time_miliseconds);

        setCalls((prevCalls) => [
          ...prevCalls,
          { ...chamado.result, timeoutId }
        ]);
      }

      if (chamado.type === 'accept_call') {
        let requestToRemove = chamado.requestId;

        setCalls((currentCalls) => {
          const callToRemove = currentCalls.find(i => i._id === requestToRemove);
          if (callToRemove) {
            clearTimeout(callToRemove.timeoutId);
          }
          // Retornamos o array filtrado para remover a chamada
          return currentCalls.filter(call => call._id !== requestToRemove);
        });
      }

      if (chamado.type === 'cancel_call') {
        let requestToRemove = chamado.result.requestId;

        setCalls((currentCalls) => {
          const callToRemove = currentCalls.find(i => i._id === requestToRemove);
          if (callToRemove) {
            clearTimeout(callToRemove.timeoutId);
          }
          // Retornamos o array filtrado para remover a chamada
          return currentCalls.filter(call => call._id !== requestToRemove);
        });
      }
    };

    socket.onclose = () => {
      console.log('Desconectado do servidor WebSocket');
    };

    socket.onerror = (error) => {
      console.error('Erro no WebSocket:', error);
    };

    return () => {
      socket.close();
      setCalls((currentCalls) => {
        currentCalls.forEach(call => clearTimeout(call.timeoutId));
        return [];
      });
    };
  }, []);

  if (loading) {
    return (
      <View style={[styles.container, { alignSelf: 'center' }]}>
        <Image source={require('../../assets/spinner.gif')} style={{ width: 45, height: 45, alignSelf: 'center' }} />
        <Text>Conectando ao servidor...</Text>
      </View>
    );
  }

  return (
    <View style={[styles.container, { marginHorizontal: 10, backgroundColor: '#f3f3f3', borderTopLeftRadius: 20, borderTopRightRadius: 20 }]}>
      <Text style={styles.header}> {calls.length ?  'Chamados Recebidos' : '' } </Text>
      {calls.length > 0 ? (
        <FlatList
          data={calls}
          keyExtractor={(item,index) => index}
          renderItem={({ item }) => (
            <View style={[styles.item, {backgroundColor: '#FeFeFe'}]}>
              <View style={{ alignItems: 'flex-start'}}>
                <Text style={{paddingVertical: 2, marginHorizontal: 5,}}>Valor do serviço</Text>
                <Text style={styles.price}> {item.subtotal_price ? 'R$ ' + item.subtotal_price : ''}</Text>
              </View>

              <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                <TouchableOpacity style={styles.button} onPress={() => acceptRequest(item)}>
                  <Text style={styles.buttonText}>Aceitar chamado</Text>
                </TouchableOpacity>

                <CountdownTimer initialSeconds={(time_miliseconds / 1000)} />
              </View>
            </View>
          )}
        />
      ) : (
        <View style={styles.noCalls}>
          <Text>Aguardando chamados...</Text>
          <Image source={require('../../assets/spinner.gif')} style={{ width: 45, height: 45, alignSelf: 'center' }} />
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  item: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    marginBottom: 10,
    borderRadius: 7,
    backgroundColor: '#F1F1F1'
  },
  id: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  price: {
    fontSize: 25,
    color: '#555',
    fontWeight: '800'
  },
  code: {
    fontSize: 16,
    color: '#4682B4',
  },
  verificationCode: {
    fontSize: 16,
    color: '#FF6347',
  },
  button: {
    marginVertical: 20,
    backgroundColor: '#E42528',
    borderRadius: 7,
    padding: 10,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
  },
  noCalls: {
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
  },
});
