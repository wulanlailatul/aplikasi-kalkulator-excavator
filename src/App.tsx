import { NavigationContainer } from "@react-navigation/native";
import React from "react";
import MainNavigator from "./screen/main-navigator";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { TabVisibilityProvider } from "@/components/TabVisibilityContext";


const App = () => {
  return (
    <SafeAreaProvider>
      <GestureHandlerRootView style={{ flex: 1 }}>
        <TabVisibilityProvider>
          {/* Wrap the main navigator with TabVisibilityProvider */}
        <NavigationContainer>
          <MainNavigator />
        </NavigationContainer>
        </TabVisibilityProvider>
      </GestureHandlerRootView>
    </SafeAreaProvider>
  );
};

export default App;
