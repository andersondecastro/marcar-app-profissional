import { StatusBar } from 'expo-status-bar';
import { View, Button, Modal, Text, StyleSheet, ImageBackground, Image, TouchableOpacity } from 'react-native'
import React, {useState} from 'react'

export default function Activities() {
  const [modalVisible, setModalVisible] = useState(false);
  
  return (
    <ImageBackground
      source={require('../../assets/map-bg.png')} 
      style={styles.background}
    >
      <Text style={styles.titlePage}>Solicitações</Text>

      <Button title="Mostrar Modal" onPress={() => setModalVisible(true)} />

      <Modal
        transparent={true} 
        visible={modalVisible} 
        animationType="slide" 
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalBackground}>
          <View style={styles.modalContent}>
            <Text style={{fontSize:21, fontWeight:'bold'}}>Chamado recebido</Text>
            <Text style={{fontSize:12, textAlign: 'justify'}}>Detalhes do motorista</Text>

            <View style={{borderRadius:7, borderWidth:0.5, borderColor:'#ded8d8', width: '100%', padding: 8, backgroundColor: '#FeF8F9', marginTop: 10}}>
                <View style={{flexDirection: 'row', alignItems: 'center'}}>
                    <Image source={require('../../assets/picture-fallback.png')} style={{width: 56, height: 56, borderRadius: 7}} />
                    
                    <View style={{marginLeft: 10,}}>
                        <Text style={{fontWeight: 'bold'}}> Mario Jose </Text>
                        <View style={{flexDirection: 'row', alignItems: 'center'}}>
                            <Image source={require('../../assets/star.png')} style={{width: 15, height: 14,}} />
                            <Text> 4.9 </Text>
                        </View>
                    </View>
                </View>
            </View>

            <TouchableOpacity style={styles.buttonForm} onPress={() => setModalVisible(false)}>
                <Text style={styles.buttonText}> ACEITAR SOLICITAÇÃO  </Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.buttonOffForm} onPress={() => setModalVisible(false)}>
                <Text style={[styles.buttonText, {color: '#777', fontSize: 14}]}> RECUSAR  </Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

    </ImageBackground>
  )
}

const styles = StyleSheet.create({
    container: {
      flex: 1,
      marginTop: StatusBar.currentHeight || 0,
    },
    background: {
        flex: 1,
        resizeMode: 'contain',
    },
    item: {
      padding: 10,
      paddingBottom: 20,
      marginVertical: 8,
      marginHorizontal: 16,
      flexDirection: 'row',
      justifyContent: 'space-between',
      borderBottomWidth: 0.5,
      borderBottomColor: '#555',
      
    },
    title: {
      fontSize: 16,
      fontWeight: 'bold',
      color: '#555'
    },
    buttonForm: {
        backgroundColor: '#E42528',
        borderRadius: 7,
        padding: 12,
        marginTop: 20,
        marginBottom: 15,
        width: '100%',
    },
    buttonOffForm: {
        backgroundColor: '#d9d9d9',
        borderRadius: 7,
        padding: 12,
        marginTop: 0,
        width: '100%',
    },
    buttonText: {
        color: '#FFF',
        fontSize: 16,
        textAlign: 'center'
    },
    sutitle: {
        fontSize: 13,
        color: '#555'
    },
    titlePage: {
        color: '#FFF', 
        fontSize: 21, 
        fontWeight: 'bold',
        padding: 20
    },
    modalBackground: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0,0,0,0.5)',
      },
      modalContent: {
        width: 300,
        padding: 20,
        backgroundColor: 'white',
        borderRadius: 10,
        alignItems: 'center',
      },
  });
