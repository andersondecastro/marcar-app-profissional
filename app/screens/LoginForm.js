import { StatusBar } from 'expo-status-bar';
import { Text, View, Image, TextInput, TouchableOpacity, ToastAndroid } from 'react-native'
import React, { useState } from 'react'
import styles from '../styles.js';  
import {BASE_URL} from './config';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function RegisterForm({navigation}) {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const showToast = (value) => {
        ToastAndroid.show(value, ToastAndroid.SHORT);
    };
      
    const login = async () => {
        try {
            if(!email) { showToast('Informe o e-mail por favor.'); return; }
            if(!password) { showToast('Informe uma senha por favor.'); return; }
            
            let data = {email,password};
            
            let result = await axios.post(BASE_URL + '/api/professionals/login', data);
            
            if( result.data ){
                showToast("Acesso realizado com sucesso!");
                AsyncStorage.setItem('professionalToken', result.data.token);
                AsyncStorage.setItem('professionalId', result.data.id);
                navigation.navigate('Main');
            }
        } catch (error) {
            showToast(error.response.data.error);
        }
    }
    
    return (
        <View style={styles.container}>
            <Image source={require('../../assets/picture2.png')} style={{width: 200, height: 200}} />
            <Text style={styles.titlePage}>Acesse sua conta</Text>
            
            <View style={{width: '80%'}}>
                <Text style={styles.labelForm}>E-mail</Text>
                <View style={styles.inputContainer}>
                    <TextInput placeholder='Informe seu e-mail' style={styles.inputTextForm} value={email} onChangeText={text => setEmail(text)} keyboardType='email-address' />
                    <Image source={require('../../assets/mail.png')} style={{width: 18, height: 18, marginRight: 10,}} />
                </View>

                <Text style={styles.labelForm}>Senha</Text>
                <View style={styles.inputContainer}>
                    <TextInput placeholder='Informe uma senha' style={styles.inputTextForm} secureTextEntry={true}  value={password} onChangeText={text => setPassword(text)} />
                    <Image source={require('../../assets/pass.png')} style={{width: 15, height: 14, marginRight: 10,}} />
                </View>

                <TouchableOpacity style={styles.buttonForm} onPress={() => login()}>
                    <Text style={styles.buttonText}> Entrar </Text>
                </TouchableOpacity>

                <View style={{flexDirection: 'row', alignItems: 'center', justifyContent: 'center'}}>
                    <Text style={{color: '#888'}}> Ainda não tem conta? </Text>
                    <TouchableOpacity onPress={() => navigation.navigate('RegisterForm')}>
                        <Text style={{color: '#E42528'}}> Cadastre grátis! </Text>
                    </TouchableOpacity>
                </View>
            </View>

            <StatusBar barStyle="light-content" backgroundColor="#FFF" />
        </View>
    )
  
}
