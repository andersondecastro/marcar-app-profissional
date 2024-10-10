import { View, Text, Image, TouchableOpacity, TextInput, ScrollView, ActivityIndicator, ToastAndroid } from 'react-native';
import React, { useCallback, useEffect, useState } from 'react';
import {BASE_URL, _date, _hour, maskBirthday, maskCpf, maskPhone} from './config';
import styles from '../styles.js';  
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { useFocusEffect } from '@react-navigation/native';

export default function Profile({navigation}) {
    const [data, setData] = useState([]);
    const [reviews, setReviews] = useState(null);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);

    const [name, setName] = useState(null);
    const [email, setEmail] = useState(null);
    const [phone, setPhone] = useState(null);
    const [password, setPassword] = useState(null);
    const [cpf, setCpf] = useState(null);
    const [birthday, setBirthday] = useState(null);
    const [picture, setPicture] = useState(null);
    const [profileId, setProfileId] = useState(null);

    const showToast = (value) => {
        ToastAndroid.show(value, ToastAndroid.SHORT);
    };

    const updateAvailableStatus = async () => {
        let storedUnity = JSON.parse( await AsyncStorage.getItem('currentAddress') );
        let token = await AsyncStorage.getItem('professionalToken');

        try {
            let data = { available: false }
            let _currentUnitId = storedUnity._id;
            
            const response = await axios.put(BASE_URL + '/api/units/' + _currentUnitId + '?update_available=' + profileId, data, {headers: { 'Authorization': 'Bearer ' + token }});
            
            if(response.data) { AsyncStorage.removeItem('currentStatus'); }
        } catch (err) {
            console.log( err.message ); 
        } 
    };
    
    const logout = async () => {
      await updateAvailableStatus();
      await AsyncStorage.removeItem("professionalToken");
      await AsyncStorage.removeItem("professionalId");
      await AsyncStorage.removeItem("currentRequestInProgress");
      await AsyncStorage.removeItem("stateInProgress");
      await AsyncStorage.removeItem("isStateInProgress");
      await AsyncStorage.removeItem("currentAddress");
      await AsyncStorage.removeItem("currentStatus");
      
      showToast('Nos vemos em breve!');
      navigation.navigate("LoginForm");
    }

    const handleChangeCPF = (text) => {
      const cleanText = text.replace(/\D/g, '');
      const maskedCpf = maskCpf(cleanText);
      setCpf(maskedCpf);
    };

    const handleChangeBirth = (text) => {
      const cleanText = text.replace(/\D/g, '');
      const maskedBirth = maskBirthday(cleanText);
      setBirthday(maskedBirth);
    };

    const handleChangePhone = (text) => {
      const cleanText = text.replace(/\D/g, '');
      const maskedPhone = maskPhone(cleanText);
      setPhone(maskedPhone);
    };

    const fetchInfoData = async () => {
      setError('');
      let token = await AsyncStorage.getItem('professionalToken');
      
      try {
        const response = await axios.get(BASE_URL + '/api/professionals/me', {headers: { 'Authorization': 'Bearer ' + token }});

        if(response.data) {
          setData(response.data); 
          setName(response.data.name);
          setEmail(response.data.email);
          setPhone(response.data.phone);
          setCpf(response.data.cpf);
          setBirthday(response.data.birthday);
          setProfileId(response.data._id);
        }
      } catch (err) {
        setError(err.message); 
      } finally {
        setLoading(false); 
      }
    };

    useFocusEffect(
      useCallback(() => {
        fetchInfoData();
      }, [])
    );

    useEffect(() => {
      const fetchReviews = async () => {
        let token = await AsyncStorage.getItem('professionalToken');
        
        try {
          if(data) {
            const response = await axios.get(BASE_URL + '/api/professionals/'+data._id+'/reviews', {headers: { 'Authorization': 'Bearer ' + token }});
            setReviews(response.data); 
          }
        } catch (err) {
          console.log("[ERROR] ", err.message); 
        } finally {
          console.log("fim do carregamento das avaliações.")
        }
      };
  
      fetchReviews();
    }, [data]);

    const updateInfoData = async () => {
        let token = await AsyncStorage.getItem('professionalToken');
        
        try {
            let data = {name, email, phone, cpf, birthday, picture}
            if(password != '') data['password'] = password;

            const response = await axios.put(BASE_URL + '/api/professionals/me', data, {headers: { 'Authorization': 'Bearer ' + token }});
            showToast(response.data.msg);
        } catch (err) {
            showToast(err.response.data.error); 
        } 
    };

    if (loading) return <ActivityIndicator size="large" color="#555" />;
    if (error) return <Text style={{textAlign:'center', padding: 10}}>Erro: {error}</Text>;

  return (
    <ScrollView>
        <View style={[styles.container]}>
            <View style={{width: '80%'}}>

                <View style={{backgroundColor: '#E42528', maxHeight: 130, borderRadius: 7, marginBottom: 30}}>
                    <Text style={{fontSize: 16, marginTop: 15, fontWeight: 'bold', color: '#FFF', textAlign: 'center'}}> {data.name ? data.name.toUpperCase() : '-'} </Text>
                    <Text style={{fontSize: 13, color: '#FFF', textAlign: 'center', marginVertical: 5}}> Prestador desde {_date(data.createdAt)} </Text>

                    {reviews?.reviews.length <= 0 ? (
                      <Text style={{backgroundColor: 'yellow', fontSize: 12, width: 100, textAlign: 'center', alignSelf: 'center', margin: 20, borderRadius: 4}}>
                        Iniciante
                      </Text>
                    ) : (
                      <View style={{flexDirection: 'row', justifyContent: 'center', alignItems: 'center', margin: 15}}>
                          <Image source={require('../../assets/star.png')} style={{width: 18, height: 18,}} />
                          <View style={{flexDirection: 'column', alignItems: 'center'}}>
                            <Text style={{fontSize: 30, fontWeight: 'bold', color: '#FFF', textAlign: 'center'}}> {reviews?.averageRating} </Text>
                          </View>
                      </View>
                    )}
                </View>


                <Text style={styles.labelForm}>Seu nome</Text>
                <View style={styles.inputContainer}>
                    <TextInput placeholder='Informe seu nome' style={styles.inputTextForm} value={name} onChangeText={text => setName(text)} />
                    <Image source={require('../../assets/user.png')} style={{width: 15, height: 18, marginRight: 10,}} />
                </View>

                <Text style={styles.labelForm}>E-mail</Text>
                <View style={styles.inputContainer}>
                    <TextInput placeholder='Informe seu e-mail' style={styles.inputTextForm} value={email} onChangeText={text => setEmail(text)} keyboardType='email-address' />
                    <Image source={require('../../assets/mail.png')} style={{width: 18, height: 18, marginRight: 10,}} />
                </View>

                <Text style={styles.labelForm}>CPF</Text>
                <View style={styles.inputContainer}>
                    <TextInput placeholder='Informe seu CPF' style={styles.inputTextForm} value={cpf} onChangeText={handleChangeCPF} keyboardType='numeric' maxLength={14} />
                    <Image source={require('../../assets/doc.png')} style={{width: 18, height: 16, marginRight: 10,}} />
                </View>

                <Text style={styles.labelForm}>Data de nascimento</Text>
                <View style={styles.inputContainer}>
                    <TextInput placeholder='Informe sua data de nascimento' style={styles.inputTextForm} value={birthday} onChangeText={handleChangeBirth} maxLength={10} />
                    <Image source={require('../../assets/birth.png')} style={{width: 18, height: 18, marginRight: 10,}} />
                </View>

                <Text style={styles.labelForm}>Telefone</Text>
                <View style={styles.inputContainer}>
                    <TextInput placeholder='Informe seu número' style={styles.inputTextForm} value={phone} onChangeText={handleChangePhone} keyboardType='phone-pad' maxLength={15} />
                    <Image source={require('../../assets/phone.png')} style={{width: 16, height: 18, marginRight: 10,}} />
                </View>

                <Text style={styles.labelForm}>Senha</Text>
                <View style={styles.inputContainer}>
                    <TextInput placeholder='Informe uma senha' style={styles.inputTextForm} secureTextEntry={true} value={password} onChangeText={text => setPassword(text)} />
                    <Image source={require('../../assets/pass.png')} style={{width: 15, height: 14, marginRight: 10,}} />
                </View>

                <TouchableOpacity style={styles.buttonForm} onPress={() => updateInfoData()}>
                    <Text style={styles.buttonText}> Salvar alterações </Text>
                </TouchableOpacity>

                <View style={{flex: 1, paddingVertical: 15}}>
                  <TouchableOpacity onPress={() => logout()} style={{borderColor: '#ddd', borderWidth: 0.5, padding: 10, backgroundColor: '#eee', borderRadius: 7}}>
                    <Text style={{textAlign: 'center', color: '#555'}}>Sair</Text>
                  </TouchableOpacity>
                </View>

            </View>
        </View>
    </ScrollView>
  )
}

