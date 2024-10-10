import { View, Text, TouchableOpacity, ToastAndroid } from 'react-native'
import React, { useEffect, useState } from 'react'
import styles from '../styles.js';  
import { TextInput } from 'react-native-gesture-handler';
import { StatusBar } from 'expo-status-bar';
import { Picker } from '@react-native-picker/picker';
const allTpeAccounts = [{label: 'Conta corrente', value: 'corrente'}, {label: 'Conta Poupança', value: 'poupanca'}]
import banksList from './banksList.js';
import axios from 'axios';
import { BASE_URL } from './config.js';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function BankingForm({navigation}) {
    const [bankname, setBankName] = useState('');
    const [agency, setAgency] = useState('');
    const [account, setAccount] = useState('');
    const [typeAccount, setTypeAccount] = useState('');
    const [existentAccount, setExistentAccount] = useState(false);
    const [accountId, setAccountId] = useState(null);

    const showToast = (value) => {
        ToastAndroid.show(value, ToastAndroid.SHORT);
    };

    useEffect(() => {
        const fetchBankAccount = async () => {
            let token = await AsyncStorage.getItem('professionalToken');
            const response = await axios.get(BASE_URL + '/api/accounts/me', {headers: { 'Authorization': 'Bearer ' + token }});

            if(response.data) {
                if(response.data.length <= 0) {
                    return;
                }
                setBankName(response.data.bank_name);
                setAgency(response.data.agency);
                setAccount(response.data.account);
                setTypeAccount(response.data.type_account);
                setAccountId(response.data._id);
                setExistentAccount(true);
            }
        };

        fetchBankAccount();
    }, [])

    const saveAccount = async () => {
        try {
            if(!bankname){ showToast('Informe qual o seu banco, por favor'); return; }
            if(!agency){ showToast('Informe a sua agência, por favor'); return; }
            if(!account){ showToast('Informe sua conta, por favor'); return; }
            if(!typeAccount){ showToast('Informe seu tipo de conta, por favor'); return; }
            let professionalId = await AsyncStorage.getItem('professionalId');
            
            let data = {bank_name: bankname, agency, account, type_account: typeAccount, professional_id: professionalId};
            
            let result;

            if(existentAccount) {
                let token = await AsyncStorage.getItem('professionalToken');
                result = await axios.put(BASE_URL + '/api/accounts/'+accountId, data, {headers: { 'Authorization': 'Bearer ' + token }});
            } else {
                result = await axios.post(BASE_URL + '/api/accounts', data);
                setAccountId(result.data.response?._id);
                setExistentAccount(true);
            }
            
            if( result.data ){
                showToast(result.data.msg);
            }
        } catch (error) {
            showToast("Operação não realizada. Tente em instantes");
            console.log(error.response.data?.error);
        }
    }

    return (
        <View style={[styles.container, {flex: 1}]}>
            
            <View style={{width: '80%', marginTop: -120}}>
                <Text style={styles.labelForm}>Banco</Text>
                <Picker
                    selectedValue={bankname}
                    onValueChange={(itemValue) => setBankName(itemValue)}
                    style={[ styles.inputContainer, {height: 50, width: '100%',  backgroundColor: '#EEE', borderRadius: 7, borderColor: '#222', borderWidth: 1} ]}
                >
                    <Picker.Item label="Selecione o banco" value="" />
                    {banksList.map((item) => (
                    <Picker.Item key={item.value} label={item.label} value={item.value} />
                    ))}
                </Picker>

                <Text style={styles.labelForm}>Agência</Text>
                <View style={styles.inputContainer}>
                    <TextInput placeholder='Informe sua Agência' style={styles.inputTextForm}  value={agency} onChangeText={text => setAgency(text)} keyboardType='numeric' />
                </View>

                <Text style={styles.labelForm}>Conta</Text>
                <View style={styles.inputContainer}>
                    <TextInput placeholder='Informe sua Conta' style={styles.inputTextForm}  value={account} onChangeText={text => setAccount(text)} keyboardType='numeric' />
                </View>

                <Text style={styles.labelForm}>Tipo de conta</Text>
                <Picker
                    selectedValue={typeAccount}
                    onValueChange={(itemValue) => setTypeAccount(itemValue)}
                    style={[ styles.inputContainer, {height: 50, width: '100%',  backgroundColor: '#EEE', borderRadius: 7, borderColor: '#222', borderWidth: 1} ]}
                >
                    <Picker.Item label="Selecione o tipo de conta" value="" />
                    {allTpeAccounts.map((item) => (
                    <Picker.Item key={item.value} label={item.label} value={item.value} />
                    ))}
                </Picker>

                <TouchableOpacity style={styles.buttonForm} onPress={() => saveAccount()}>
                    <Text style={styles.buttonText}> Salvar </Text>
                </TouchableOpacity>

            </View>

            <StatusBar barStyle="light-content" backgroundColor="#FFF" />
        </View>
    )
}