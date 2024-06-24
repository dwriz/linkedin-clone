import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import HomeScreen from "../screens/HomeScreen.js";
import AddPostScreen from "../screens/AddPostScreen.js";
import ProfileScreen from "../screens/ProfileScreen";
import { Ionicons } from "@expo/vector-icons";
import { TouchableOpacity, Alert } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext.js";
import LinkedInHeader from "../components/LinkedInHeader";
import client from "../config/apolloClient.js";

const Tab = createBottomTabNavigator();

export default function BottomTabNavigator({ navigation }) {
  const { setIsLoggedIn } = useContext(AuthContext);

  async function handleLogout() {
    try {
      await client.resetStore();

      await AsyncStorage.removeItem("access_token");

      setIsLoggedIn(false);
    } catch (error) {
      Alert.alert("Error", error.message);
    }
  }

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: true,
        headerTitle: () => <LinkedInHeader />,
        headerRight: () => (
          <TouchableOpacity onPress={handleLogout} style={{ marginRight: 10 }}>
            <Ionicons name="log-out-outline" size={24} color="#0077b5" />
          </TouchableOpacity>
        ),
        tabBarActiveTintColor: "#0077b5",
        tabBarInactiveTintColor: "#B1BEC4",
        tabBarIcon: ({ color, size }) => {
          let iconName;

          switch (route.name) {
            case "Home":
              iconName = "home";
              break;
            case "Post":
              iconName = "add-circle";
              break;
            case "Profile":
              iconName = "person";
              break;
          }

          return <Ionicons name={iconName} size={size} color={color} />;
        },
      })}
    >
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Post" component={AddPostScreen} />
      <Tab.Screen name="Profile" component={ProfileScreen} />
    </Tab.Navigator>
  );
}
