import "./global.css";
import "./localization/index";
import ChatScreen from "./components/ChatScreen";
import { SafeAreaView, SafeAreaProvider } from "react-native-safe-area-context";

export default function App() {
  return (
    <SafeAreaProvider>
      <SafeAreaView edges={["top"]} style={{ flex: 1 }}>
        <ChatScreen />
      </SafeAreaView>
    </SafeAreaProvider>
  );
}
