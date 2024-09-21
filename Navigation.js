import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { NavigationContainer } from '@react-navigation/native';

import RegisterForm from './app/screens/RegisterForm';
import LoginForm from './app/screens/LoginForm';
import Profile from './app/screens/Profile';
import Activities from './app/screens/Activities';
import Requests from './app/screens/Requests';
import Welcome from './app/screens/Welcome';
import ChangeUnity from './app/screens/ChangeUnity';
import AddUnity from './app/screens/AddUnity';
import RequestDetails from './app/screens/RequestDetails';
import ServiceInProgress from './app/screens/ServiceInProgress';
import Finance from './app/screens/Finance';
import FallbackTest from './app/screens/FallbackTest.js';
import TabNavigator from './TabNavigation'; 

const Stack = createStackNavigator();

const AppNavigator = ({ isLoggedIn, stateInProgress }) => {
  let routeToStart;
  if( isLoggedIn ){
    if(stateInProgress == 'aceitou_chamado')
      routeToStart = 'RequestDetails';
    else if(stateInProgress == 'aguardando_motorista')
      routeToStart = 'RequestDetails';
    else if(stateInProgress == 'comecou_servico')
      routeToStart = 'ServiceInProgress';
    else 
      routeToStart = "Main";
  } else {
      routeToStart = "RegisterForm";
  }
  console.log("Iniciar na rota: " , routeToStart, " .... <<< estado atual: >>> ", stateInProgress);

  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName={routeToStart}>
        <Stack.Screen options={{ headerShown: false }} name="RegisterForm" component={RegisterForm} /> 
        <Stack.Screen options={{ headerShown: false }} name="LoginForm" component={LoginForm} />         
        <Stack.Screen options={{ title: "Editar meus dados" }} name="Profile" component={Profile} />         
        <Stack.Screen options={{ title: "Minhas atividades" }} name="Activities" component={Activities} />         
        <Stack.Screen options={{ title: "Endereço de atendimento" }} name="ChangeUnity" component={ChangeUnity} />         
        <Stack.Screen options={{ title: "Adicionar nova unidade" }} name="AddUnity" component={AddUnity} />         
        <Stack.Screen options={{ headerShown: false }} name="Welcome" component={Welcome} />
        <Stack.Screen options={{ headerShown: false }} name="Requests" component={Requests} />
        <Stack.Screen options={{ headerShown: false }} name="RequestDetails" component={RequestDetails} />
        <Stack.Screen options={{ headerShown: false }} name="ServiceInProgress" component={ServiceInProgress} />
        <Stack.Screen options={{ headerShown: false }} name="Finance" component={Finance} />
        <Stack.Screen options={{ headerShown: false }} name="FallbackTest" component={FallbackTest} />
        <Stack.Screen options={{ headerShown: false }} name="Main" component={TabNavigator} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;