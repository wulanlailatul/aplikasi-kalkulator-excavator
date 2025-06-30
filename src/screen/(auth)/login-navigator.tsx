import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { LoginNavigator } from "./login/navigator";

export type AuthStackParamList = {
  Login: undefined;
};

const AuthStack = createNativeStackNavigator<AuthStackParamList>();

export const AuthNavigator = () => {
  return (
    <AuthStack.Navigator screenOptions={{ headerShown: false }}>
      <AuthStack.Screen name="Login" component={LoginNavigator} />
    </AuthStack.Navigator>
  );
};
