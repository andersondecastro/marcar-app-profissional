import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#fff',
      alignItems: 'center',
      justifyContent: 'center',
    },
    titlePage: {
      color: '#000',
      fontSize: 21,
      fontWeight: 'bold',
      paddingBottom: 30,
    },
    labelForm: {
      fontSize: 12,
      color: '#888',
      marginBottom: 10,
      marginTop: 10,
    },
    inputTextForm: {
        flex: 1,
    },
    buttonForm: {
      backgroundColor: '#E42528',
      borderRadius: 7,
      padding: 12,
      marginTop: 35,
      marginBottom: 21,
    },
    buttonText: {
      color: '#FFF',
      fontSize: 16,
      textAlign: 'center'
    },
    buttonOffForm: {
      backgroundColor: '#E42528',
      borderRadius: 7,
      padding: 12,
      marginTop: 35,
      marginBottom: 21,
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        
        borderColor: '#CDCACA',
        borderWidth: 1,
        borderRadius: 7,
        backgroundColor: '#F6F6F6',
        padding: 15,
        color: '#555',
        fontWeight: 'bold',
        width: '100%',
    }
  });
  
  module.exports = styles;