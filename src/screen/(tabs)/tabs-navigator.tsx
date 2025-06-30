import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { MainNavigator } from './main/navigator';
//@ts-ignore
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { useTabVisibility } from '@/components/TabVisibilityContext';

export type TabsParamList = {
  Main: undefined;
  Summary: undefined;
};

const Tabs = createBottomTabNavigator<TabsParamList>();

export const TabsNavigator = () => {
  const { visible } = useTabVisibility();

  return (
    <Tabs.Navigator
      screenOptions={{
        headerShown: false,
        tabBarStyle: visible
          ? {
              position: 'absolute',
              bottom: 0,
              left: 0,
              right: 0,
              height: 60,
              backgroundColor: '#facc15',
              borderTopWidth: 0,
              elevation: 10,
            }
          : { display: 'none' },
        tabBarActiveTintColor: '#000',
        tabBarInactiveTintColor: '#666',
        tabBarLabelStyle: {
          fontSize: 12,
          marginBottom: 4,
        },
      }}
    >
      <Tabs.Screen
        name="Main"
        component={MainNavigator}
        options={{
          tabBarLabel: 'Home',
          tabBarStyle: {display: "none"},
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="home-outline" color={color} size={size} />
          ),
        }}
      />
    </Tabs.Navigator>
  );
};
