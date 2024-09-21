import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Image, StyleSheet, Text } from 'react-native';

import Welcome from './app/screens/Welcome';
import Activities from './app/screens/Activities';
import Profile from './app/screens/Profile';
import Finance from './app/screens/Finance';

const Tab = createBottomTabNavigator();

const TabNavigator = () => {
  return (
    <Tab.Navigator 
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let icon;

          if (route.name === 'Welcome') {
            icon = require('./assets/icons/home.png');
          } else if (route.name === 'Activities') {
            icon = require('./assets/icons/list.png');
          } else if (route.name === 'Profile') {
            icon = require('./assets/icons/user.png');
          } else if (route.name === 'Finance') {
            icon = require('./assets/icons/finance.png');
          }

          return <Image source={icon} style={[styles.icon,  { tintColor: focused ? '#E42528' : '#888888' }]} />;
        },
        tabBarLabel: ({ focused, color }) => {
            let labelColor = focused ? '#E42528' : '#888888'; 
            let iconTitleLabel;

            if (route.name === 'Welcome') {
              iconTitleLabel = "Início";
            } else if (route.name === 'Activities') {
              iconTitleLabel = "Atividades";
            } else if (route.name === 'Profile') {
              iconTitleLabel = "Perfil";
            } else if (route.name === 'Finance') {
              iconTitleLabel = "Financeiro";
            }

            return (
              <Text style={[styles.label, { color: labelColor }]}>
                {iconTitleLabel}
              </Text>
            );
        },
      })}
    >
      <Tab.Screen options={{ headerShown: false }}  name="Welcome" component={Welcome} />
      <Tab.Screen options={{ title: "Atividades" }}  name="Activities" component={Activities} />
      <Tab.Screen options={{ title: "Financeiro" }}  name="Finance" component={Finance} />
      <Tab.Screen options={{ title: "Meu Perfil" }}  name="Profile" component={Profile} />
    </Tab.Navigator>
  );
};

const styles = StyleSheet.create({
  icon: {
    width: 15,
    height: 15,
    padding: 1,
  },
  label: {
    fontSize: 12,
  }
});

export default TabNavigator;
