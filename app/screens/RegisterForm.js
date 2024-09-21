import { StatusBar } from 'expo-status-bar';
import { Text, View, Image, TextInput, TouchableOpacity, ToastAndroid, ScrollView } from 'react-native'
import React, { useState } from 'react'
import styles from '../styles.js';  
import {BASE_URL} from './config.js'
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function RegisterForm({navigation}) {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [phone, setPhone] = useState('');
    const [cpf, setCpf] = useState('');
    const [birthday, setBirthday] = useState('');
    

    const showToast = (value) => {
        ToastAndroid.show(value, ToastAndroid.SHORT);
    };
      
    const register = async () => {
        try {
            if(!name){  showToast('Informe o nome por favor.'); return; }
            if(!email) { showToast('Informe o e-mail por favor.'); return; }
            if(!phone) { showToast('Informe seu celular.'); return; }
            if(!cpf) { showToast('Informe seu CPF.'); return; }
            if(!birthday) { showToast('Informe sua data de nascimento.'); return; }
            if(!password) { showToast('Informe uma senha por favor.'); return; }
            
            let data = {name,email,password, phone, cpf, birthday};
            let result = await axios.post(BASE_URL + '/api/professionals', data);
            
            if( result.data ){
                console.log(result.data)
                showToast(result.data.msg);
                await AsyncStorage.setItem('professionalToken', result.data.token);
                await AsyncStorage.setItem('professionalId', result.data.id);
                navigation.navigate('Main');
            }
        } catch (error) {
            showToast(error.response.data.error);
        }
    }
  
    return (
        <View style={styles.container}>
            <Image source={require('../../assets/picture1.png')} style={{width: 200, height: 200}} />
            <Text style={styles.titlePage}>Torne-se um prestador!</Text>
            
            <ScrollView style={{width: '90%',}}>
                <View style={{margin: 20, paddingBottom: 30}}>
                    <Text style={styles.labelForm}>Seu nome</Text>
                    <View style={styles.inputContainer}>
                        <TextInput placeholder='Informe seu nome' style={styles.inputTextForm} value={name} onChangeText={text => setName(text)} />
                        <Image source={require('../../assets/user.png')} style={{width: 15, height: 18, marginRight: 10,}} />
                    </View>

                    <Text style={styles.labelForm}>E-mail</Text>
                    <View style={styles.inputContainer}>
                        <TextInput placeholder='Informe seu e-mail' style={styles.inputTextForm} keyboardType='email-address' value={email} onChangeText={text => setEmail(text)} />
                        <Image source={require('../../assets/mail.png')} style={{width: 18, height: 18, marginRight: 10,}} />
                    </View>

                    <Text style={styles.labelForm}>CPF</Text>
                    <View style={styles.inputContainer}>
                        <TextInput placeholder='Informe seu CPF' style={styles.inputTextForm} value={cpf} onChangeText={text => setCpf(text)} keyboardType='numeric' />
                        <Image source={require('../../assets/doc.png')} style={{width: 18, height: 18, marginRight: 10,}} />
                    </View>

                    <Text style={styles.labelForm}>Data de nascimento</Text>
                    <View style={styles.inputContainer}>
                        <TextInput placeholder='Informe sua data de nascimento' style={styles.inputTextForm} value={birthday} onChangeText={text => setBirthday(text)} />
                        <Image source={require('../../assets/birth.png')} style={{width: 18, height: 18, marginRight: 10,}} />
                    </View>

                    <Text style={styles.labelForm}>Telefone(celular)</Text>
                    <View style={styles.inputContainer}>
                        <TextInput placeholder='Informe seu número celular' style={styles.inputTextForm} value={phone} onChangeText={text => setPhone(text)} />
                        <Image source={require('../../assets/phone.png')} style={{width: 15, height: 18, marginRight: 10,}} />
                    </View>

                    <Text style={styles.labelForm}>Senha</Text>
                    <View style={styles.inputContainer}>
                        <TextInput placeholder='Informe uma senha' style={styles.inputTextForm} secureTextEntry={true} value={password} onChangeText={text => setPassword(text)} />
                        <Image source={require('../../assets/pass.png')} style={{width: 15, height: 14, marginRight: 10,}} />
                    </View>

                    <TouchableOpacity style={styles.buttonForm}  onPress={() => register()}>
                    <Text style={styles.buttonText}> Criar conta </Text>
                    </TouchableOpacity>

                    <View style={{flexDirection: 'row', alignItems: 'center', justifyContent: 'center'}}>
                        <Text style={{color: '#888'}}> Já tem uma conta? </Text>
                        <TouchableOpacity onPress={() => navigation.navigate('LoginForm')}>
                            <Text style={{color: '#E42528'}}> Entre agora. </Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </ScrollView>

            <StatusBar barStyle="light-content" backgroundColor="#FFF" />
        </View>
    )
  
}
