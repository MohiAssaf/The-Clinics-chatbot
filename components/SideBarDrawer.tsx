import { useTranslation } from "react-i18next";
import {
  Alert,
  Image,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import { SideBarDrawerProps } from "@/types/sideDrawer";
import ChatHistoryItem from "@/components/Chat/ChatHistoryItem";

const SideBarDrawer = ({
  onToggleLang,
  onClose,
  isRTL,
  chats,
  activeChatId,
  setActiveChatId,
  startNewChat,
  onDeleteChat,
}: SideBarDrawerProps) => {
  const { t } = useTranslation();

  return (
    <View className="flex-1 bg-white pt-6 px-4">
      <View
        className={`flex ${isRTL ? "flex-row-reverse" : "flex-row"} items-center justify-between mb-6`}
      >
        <Image
          source={require("../assets/logo.png")}
          className="w-20 h-10"
          resizeMode="contain"
        />
        <TouchableOpacity
          onPress={onClose}
          className="p-2 rounded-full bg-gray-100"
        >
          <Ionicons name="close" size={20} color="#6B7280" />
        </TouchableOpacity>
      </View>

      <View className="flex-1">
        <View
          className={`flex-row ${isRTL ? "flex-row-reverse" : "flex-row"}  justify-between items-center pb-4 mb-2`}
        >
          <View className="flex-row items-center gap-2">
            <MaterialIcons name="history" size={20} color="#4B5563" />
            <Text className="text-lg font-semibold text-gray-800">
              {t("recent_chats")}
            </Text>
          </View>
          <TouchableOpacity
            onPress={() => {
              Alert.alert(
                "Delete Chats",
                "Are you sure you want to delete all chats",
                [
                  { text: "Cancel", style: "cancel" },
                  {
                    text: "Delete",
                    style: "destructive",
                    onPress: () => {
                      onDeleteChat();
                    },
                  },
                ],
                { cancelable: true }
              );
            }}
            className="p-2 rounded-lg bg-gray-100"
          >
            <Ionicons name="trash-outline" size={18} color="#991B1B" />
          </TouchableOpacity>
        </View>

        <ScrollView
          className="flex-1"
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 16 }}
        >
          {chats?.length > 0 ? (
            chats.map((chat: any) => (
              <ChatHistoryItem 
                key={chat.id}
                chat={chat}
                activeChatId={activeChatId}
                setActiveChatId={setActiveChatId}
                onDelChat={onDeleteChat}
                onClose={onClose}
              />
            ))
          ) : (
            <View className="py-8 items-center justify-center">
              <MaterialIcons name="search-off" size={32} color="#9CA3AF" />
              <Text className="text-gray-500 mt-2">{t("no_recent_chats")}</Text>
            </View>
          )}
        </ScrollView>
      </View>

      <View className="mt-auto pb-10 flex-col gap-2">
        <TouchableOpacity
          onPress={startNewChat}
          className={`flex-row ${isRTL ? "flex-row-reverse" : "flex-row"}  items-center justify-center gap-2 p-4 bg-[#005796] rounded-lg`}
        >
          <Ionicons name="chatbubble" size={20} color="white" />
          <Text className="text-white font-medium">{t("new_chat")}</Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={onToggleLang}
          className={`flex-row ${isRTL ? "flex-row-reverse" : "flex-row"} items-center justify-center gap-2 bg-gray-300 rounded-lg p-4`}
        >
          <Ionicons name="language" size={18} color="#374151" />
          <Text className="text-gray-800 font-medium">{t("switch_lang")}</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default SideBarDrawer;
