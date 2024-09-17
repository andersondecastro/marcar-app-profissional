import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function Timer({initialColor='#444'}) {
  const [seconds, setSeconds] = useState(0);
  const colorTimer  = initialColor;

  useEffect(() => {
    const interval = setInterval(() => {
      setSeconds(prevSeconds => prevSeconds + 1);
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const formatTime = (totalSeconds) => {
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;

    return {
      hours: String(hours).padStart(2, '0'),
      minutes: String(minutes).padStart(2, '0'),
      seconds: String(seconds).padStart(2, '0')
    };
  };

  const { hours, minutes, seconds: displaySeconds } = formatTime(seconds);

  return (
    <View style={styles.container}>
      <Text style={[styles.timer, {color: colorTimer}]}>
        {hours}:{minutes}:{displaySeconds}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  timer: {
    fontSize: 50,
    fontWeight: 'bold',
  },
});
