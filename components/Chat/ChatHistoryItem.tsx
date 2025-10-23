import React from "react";
import { TouchableOpacity, Text, View, Alert } from "react-native";
import { Chat, ChatHistoryItemProps } from "@/types/chat";
import { Ionicons } from "@expo/vector-icons";

const ChatHistoryItem = ({
  chat,
  activeChatId,
  setActiveChatId,
  onDelChat,
  onClose,
}: ChatHistoryItemProps) => {
  const isActive = chat.id === activeChatId;

  const onDeleteChat = (chat: Chat) => {
    Alert.alert(
        "Delete Chat",
        `Are you sure you want to delete ${chat.messages[1]?.text.slice(0, 15)}...`,
        [
            { text: "Cancel", style: "cancel" },
            {
            text: "Delete",
            style: "destructive",
            onPress: () => {
                onDelChat(chat.id);
            },
            },
        ],
        { cancelable: true }
    );
  }

  return (
    <View
      className={`flex-row justify-between items-center p-3 rounded-lg mb-2 ${
        isActive ? "bg-blue-50 border border-blue-200" : "bg-gray-50"
      }`}
    >
      <TouchableOpacity
        onPress={() => {
          setActiveChatId(chat.id);
          onClose();
        }}
        className="flex-1"
      >
        <Text
          className={`${isActive ? "text-blue-800" : "text-gray-800"}`}
          numberOfLines={1}
        >
          {`${chat.messages[1]?.text.slice(0, 15)}...` || "New Chat"}
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        onPress={() => {
          onDeleteChat(chat)
        }}
        className="ml-2"
      >
        <Ionicons name="trash-outline" size={18} color="#991B1B" />

      </TouchableOpacity>
    </View>
  );
};

export default ChatHistoryItem;
