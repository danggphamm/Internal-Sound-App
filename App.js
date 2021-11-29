import { createAppContainer } from "react-navigation";
import { createStackNavigator } from "react-navigation-stack";
import HomeScreen from "./src/screens/HomeScreen";
import RecordingScreen from "./src/screens/RecordingScreen";
import ListeningScreen from "./src/screens/ListeningScreen";
import EditingScreen from "./src/screens/EditingScreen";

const navigator = createStackNavigator(
  {
    Home: HomeScreen,
    Recording: RecordingScreen,
    Listening: ListeningScreen,
    Editing: EditingScreen,
  },
  {
    initialRouteName: "Home",
    defaultNavigationOptions: {
      title: "App",
    },
  }
);

export default createAppContainer(navigator);