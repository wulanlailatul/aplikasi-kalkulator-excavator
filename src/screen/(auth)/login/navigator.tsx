import { createNativeStackNavigator } from "@react-navigation/native-stack";
import index  from "./index";

export type LoginStackParamList = {
  Login: undefined; 
  };

  const LoginStack = createNativeStackNavigator<LoginStackParamList>();
  export const LoginNavigator = () => {
    return (
      <LoginStack.Navigator
        screenOptions={{
          headerShown: false,
        }}>
        <LoginStack.Screen name="Login" component={index} />
      </LoginStack.Navigator>
    );
  }
  