import "./global.css";
import "./localization/index";
import ChatScreen from "./components/ChatScreen";
import { SafeAreaView } from "react-native";

export default function App() {
  return (
    <SafeAreaView className="flex-1">
      <ChatScreen />
    </SafeAreaView>
  );
}
