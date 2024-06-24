import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import MainStack from "./navigators/MainStack";
import { ApolloProvider } from "@apollo/client";
import client from "./config/apolloClient";
import AuthProvider from "./context/AuthContext";

const Stack = createStackNavigator();

export default function App() {
  return (
    <ApolloProvider client={client}>
      <AuthProvider>
        <NavigationContainer>
          <Stack.Navigator screenOptions={{ headerShown: false }}>
            <Stack.Screen name="MainStack" component={MainStack} />
          </Stack.Navigator>
        </NavigationContainer>
      </AuthProvider>
    </ApolloProvider>
  );
}
