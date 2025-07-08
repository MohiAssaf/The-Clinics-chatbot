import { useCallback, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { I18nManager, Text, TouchableOpacity, View } from "react-native";
import { GiftedChat, IMessage } from "react-native-gifted-chat";
import SideBar from "./SideBar";
import { Ionicons } from "@expo/vector-icons";

const ChatScreen = () => {
  const { t, i18n } = useTranslation();
  const [messages, setMessages] = useState<IMessage[]>([]);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const isRTL = i18n.language === "ar";

  useEffect(() => {
    setMessages([
      {
        _id: 1,
        text: t("welcome"),
        createdAt: new Date(),
        user: {
          _id: 2,
          name: "The Clinics",
        },
      },
    ]);
  }, [i18n.language]);

  const onSend = useCallback((newMesgs: IMessage[] = []) => {
    setMessages((prevMessages) => GiftedChat.append(prevMessages, newMesgs));
  }, []);

  const onToggleLanguage = () => {
    const newLang = i18n.language === "en" ? "ar" : "en";
    i18n.changeLanguage(newLang);
    I18nManager.forceRTL(newLang === "ar");
  };

  return (
    <View className={`flex-1 bg-white ${isRTL ? "rtl-dir" : ""}`}>
      <SideBar
        visible={sidebarOpen}
        onToggleLang={onToggleLanguage}
        onClose={() => setSidebarOpen(false)}
        isRTL={isRTL}
      />

      <View
        className={`flex-row items-center justify-between px-4 py-3 bg-gray-50 border-b border-gray-200 ${isRTL ? "flex-row-reverse" : ""}`}
      >
        <TouchableOpacity
          onPress={() => setSidebarOpen(!sidebarOpen)}
          className="p-2 rounded-lg"
        >
          <Ionicons name="menu" size={24} color="#3b82f6" />
        </TouchableOpacity>

        <Text className="text-lg font-semibold text-gray-900">
          {t("title")}
        </Text>

        <View className="w-10" />
      </View>

      <GiftedChat
        messages={messages}
        onSend={(messages) => onSend(messages)}
        user={{ _id: 1 }}
        placeholder={t("input_placeholder")}
        renderUsernameOnMessage={true}
        alwaysShowSend={true}
        messagesContainerStyle={{
          backgroundColor: "#f9fafb",
          paddingBottom: 25,
        }}
      />
    </View>
  );
};

export default ChatScreen;
