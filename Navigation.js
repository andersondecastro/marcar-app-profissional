import React, {useEffect} from 'react';
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
import BankingForm from './app/screens/BankingForm';
import FallbackTest from './app/screens/FallbackTest.js';
import PendingRequests from './app/screens/PendingRequests.js';
import TabNavigator from './TabNavigation'; 

const Stack = createStackNavigator();

const AppNavigator = ({ isLoggedIn }) => {
  const routeToStart = () => {
    if (isLoggedIn) {
      return "Main";
    } else {
      return "LoginForm";
    }
  };

  useEffect(() => {
    routeToStart();
  }, [isLoggedIn]);

  console.log("| STARTING SCREEN IN: ", routeToStart());
  
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName={routeToStart()}>
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
        <Stack.Screen options={{ title: "Dados bancários" }} name="BankingForm" component={BankingForm} />
        <Stack.Screen options={{ title: "Chamados em aberto" }} name="PendingRequests" component={PendingRequests} />
        <Stack.Screen options={{ headerShown: false }} name="FallbackTest" component={FallbackTest} />
        <Stack.Screen options={{ headerShown: false }} name="Main" component={TabNavigator} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;