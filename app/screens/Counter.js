import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';

export default function CountdownTimer({ initialSeconds = 20 }) {
  const [seconds, setSeconds] = useState(initialSeconds);

  useEffect(() => {
    // Se os segundos chegarem a zero, não iniciar o timer
    if (seconds === 0) return;

    const intervalId = setInterval(() => {
      setSeconds((prevSeconds) => prevSeconds - 1);
    }, 1000);

    // Limpar o intervalo quando o componente for desmontado ou o contador chegar a zero
    return () => clearInterval(intervalId);
  }, [seconds]);

  return (
    <View style={[styles.container, {flexDirection: 'row', alignItems: 'center', justifyContent: 'center', width: '20%'}]}>
      <Image source={require('../../assets/icons/ampulheta.png')} style={{width: 15, height: 15, marginHorizontal: 5}} />
      <Text style={styles.timerText}>{seconds}</Text> 
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 7,
    width: 20,
  },
  timerText: {
    fontSize: 20,
    fontWeight: 'bold',
  },
});

