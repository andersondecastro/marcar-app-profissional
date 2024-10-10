import { View, Text, FlatList } from 'react-native'
import React, {useState, useEffect} from 'react'
import { TouchableOpacity } from 'react-native-gesture-handler';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function PendingRequests({route, navigation}) {
    const data = route.params.data;
    const [pendingRequests, setPendingRequests] = useState([]);
    
    useEffect(() => {
        const getData = async () => {
            setPendingRequests(data);
        }
        getData()
    }, [data]);

    const goToScreen = async item => {
        AsyncStorage.setItem('currentRequestInProgress', JSON.stringify(item._id));
        
        if(item.status == 'aceito') {
            navigation.navigate('RequestDetails');
        } else if(item.status == 'andamento') {
            navigation.navigate('ServiceInProgress');
        }
    }
    

    const renderItem = (data) => {
        let item = data.item;
        return (
            <View style={{backgroundColor: '#FeFeFe', marginVertical: 10, marginHorizontal: 10, borderRadius: 7, padding: 10, paddingBottom: 20}}>
                <TouchableOpacity style={{}} onPress={() => goToScreen(item)}>
                    <Text>Cód.: {item.code.toUpperCase()}</Text>
                    <Text>Situação: {item.status.toUpperCase()}</Text>
                    <Text style={{fontSize: 20}}>R$ {item.subtotal_price}</Text>
                </TouchableOpacity>
            </View>
        )
    }
    
    return (
        <View>
            <FlatList
                data={pendingRequests} 
                renderItem={renderItem} 
                keyExtractor={item => item._id} 
            />
        </View>
    )
}