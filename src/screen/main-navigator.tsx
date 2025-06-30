import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { LoginNavigator } from './(auth)/login/navigator';
import { TabsNavigator } from './(tabs)/tabs-navigator';
import { usehandleLogin } from '@/hooks/use-store-login';

export type NavigationStackParamList = {
  Login: undefined;
  Home: undefined;
};

const Main = createNativeStackNavigator<NavigationStackParamList>();

const MainNavigator = () => {
  const isLoggedIn = usehandleLogin(state => state.isLoggedIn);

  return (
    <Main.Navigator
      initialRouteName={isLoggedIn ? 'Home' : 'Login'}
      screenOptions={{
      headerShown: false,
      }}
    >
      {!isLoggedIn && (
        <Main.Screen name="Login" component={LoginNavigator} />
      )}
      <Main.Screen name="Home" component={TabsNavigator} />
    </Main.Navigator>
  );
};

export default MainNavigator;
