import { useTranslation } from "react-i18next";
import { ActivityIndicator, Text, TouchableOpacity, View } from "react-native";
import { GiftedChat, Send } from "react-native-gifted-chat";
import { Ionicons } from "@expo/vector-icons";
import { Drawer } from "react-native-drawer-layout";
import SideBarDrawer from "./SideBarDrawer";
import { renderChatBubble } from "./Chat/Bubble";
import { renderChatAvatar } from "./Chat/Avatar";
import { renderChatMessage } from "./Chat/Message";
import { renderInputToolbar } from "./Chat/InputToolBar";
import { useChatLogic } from "../hooks/useChatLogic";

const ChatScreen = () => {
  const { t } = useTranslation();
  const {
    loading,
    drawerOpen,
    setDrawerOpen,
    isRTL,
    chats,
    activeChatId,
    setActiveChat,
    startNewChat,
    onDeleteAllChats,
    onToggleLanguage,
    onSendMessage,
    currentDisplayedChat,
    USER_ID,
  } = useChatLogic();

  if (loading) {
    return (
      <View className="flex-1 justify-center items-center">
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <Drawer
      open={drawerOpen}
      onOpen={() => setDrawerOpen(true)}
      onClose={() => setDrawerOpen(false)}
      drawerPosition={isRTL ? "right" : "left"}
      drawerStyle={{
        width: 260,
        backgroundColor: "#ffffff",
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 5,
      }}
      renderDrawerContent={() => (
        <SideBarDrawer
          onToggleLang={onToggleLanguage}
          onClose={() => setDrawerOpen(false)}
          isRTL={isRTL}
          chats={chats}
          activeChatId={activeChatId}
          setActiveChatId={(id: string) => {
            setActiveChat(id);
            setDrawerOpen(false);
          }}
          startNewChat={startNewChat}
          deleteAllChats={onDeleteAllChats}
        />
      )}
    >
      <View className="flex-1">
        <View
          className={`flex-row items-center justify-between px-4 py-3 bg-[#fcfdfd] border-b border-gray-200 ${
            isRTL ? "flex-row-reverse" : "flex-row"
          }`}
        >
          <TouchableOpacity
            onPress={() => setDrawerOpen((prev) => !prev)}
            className="p-2 rounded-lg"
            accessibilityLabel="Menu button"
          >
            <Ionicons name="menu" size={24} color="#3B82F6" />
          </TouchableOpacity>

          <Text className="text-lg font-semibold text-gray-900">
            {t("title")}
          </Text>

          <View className="w-10" />
        </View>

        <GiftedChat
          messages={currentDisplayedChat?.messages || []}
          onSend={onSendMessage}
          user={{ _id: USER_ID, name: "You" }}
          placeholder={t("input_placeholder")}
          renderUsernameOnMessage={false}
          alwaysShowSend={true}
          showUserAvatar
          scrollToBottomComponent={() => (
            <Ionicons name="chevron-down" size={20} color="#6B7280" />
          )}
          messagesContainerStyle={{
            backgroundColor: "#F9FAFB",
            paddingBottom: 16,
          }}
          renderMessage={renderChatMessage(isRTL, USER_ID)}
          renderAvatar={renderChatAvatar(isRTL, USER_ID)}
          renderInputToolbar={renderInputToolbar(isRTL)}
          renderBubble={renderChatBubble(isRTL, USER_ID)}
          textInputProps={{
            textAlign: isRTL ? "right" : "left",
            writingDirection: isRTL ? "rtl" : "ltr",
            style: {
              backgroundColor: "#F9FAFB",
              borderRadius: 20,
              paddingHorizontal: 16,
              paddingVertical: 8,
              fontSize: 16,
              borderWidth: 1,
              borderColor: "#E5E7EB",
              flex: 1,
              marginHorizontal: 4,
              color: "#1F2937",
              minHeight: 40,
              maxHeight: 100,
            },
          }}
          renderSend={(props) => (
            <Send
              {...props}
              containerStyle={{
                justifyContent: "center",
                alignItems: "center",
                marginHorizontal: 4,
              }}
              disabled={!props.text}
            >
              <View
                style={{
                  backgroundColor: props.text ? "#10B981" : "#9CA3AF",
                  borderRadius: 20,
                  width: 40,
                  height: 40,
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <Ionicons
                  name="paper-plane"
                  size={20}
                  color="white"
                  style={{
                    transform: [{ scaleX: isRTL ? -1 : 1 }],
                    opacity: props.text ? 1 : 0.7,
                  }}
                />
              </View>
            </Send>
          )}
          timeFormat="HH:mm"
          dateFormat="MMMM D, YYYY"
          infiniteScroll
        />
      </View>
    </Drawer>
  );
};

export default ChatScreen;
