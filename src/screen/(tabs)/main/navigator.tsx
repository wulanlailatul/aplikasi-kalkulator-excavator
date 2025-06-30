import { createNativeStackNavigator } from "@react-navigation/native-stack";
import Index from "./index";

export type MainStackParamList = {
    Home: undefined;
    };  

const  Main = createNativeStackNavigator<MainStackParamList>();

export const MainNavigator = () => {
  return (
    <Main.Navigator
      screenOptions={{headerShown: false,}}>
      <Main.Screen name="Home" component={Index} />
    </Main.Navigator>
  );
};

export default MainNavigator; 