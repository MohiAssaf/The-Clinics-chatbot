import { useTranslation } from "react-i18next";
import { ActivityIndicator, Text, TouchableOpacity, View } from "react-native";
import { GiftedChat } from "react-native-gifted-chat";
import { Ionicons } from "@expo/vector-icons";
import { Drawer } from "react-native-drawer-layout";
import SideBarDrawer from "./SideBarDrawer";
import { renderChatBubble } from "./Chat/Bubble";
import { renderChatAvatar } from "./Chat/Avatar";
import { renderChatMessage } from "./Chat/Message";
import { renderInputToolbar } from "./Chat/InputToolBar";
import { useChatLogic } from "../hooks/useChatLogic";
import { renderSendButton } from "./Chat/SendButton";
import renderFooter from "./Chat/Footer";

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
    isTyping,
    direction,
  } = useChatLogic();

  if (loading) {
    return (
      <View className="flex-1 justify-center items-center bg-gray-100">
        <ActivityIndicator size="large" color="#3B82F6" />
        <Text className="mt-4 text-lg font-medium text-gray-700">
          Loading your chat...
        </Text>
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
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.15,
        shadowRadius: 6,
        elevation: 8,
      }}
      renderDrawerContent={() => (
        <SideBarDrawer
          onToggleLang={onToggleLanguage}
          onClose={() => setDrawerOpen(false)}
          isRTL={isRTL}
          chats={chats}
          activeChatId={activeChatId}
          setActiveChatId={(id) => {
            setActiveChat(id);
            setDrawerOpen(false);
          }}
          startNewChat={startNewChat}
          deleteAllChats={onDeleteAllChats}
        />
      )}
    >
      <View className="flex-1 bg-white mb-6">
        <View
          className={`flex-row items-center justify-between px-4 py-2 bg-white border-b border-[#9fb9d5] ${
            isRTL ? "flex-row-reverse" : "flex-row"
          } shadow-lg`}
        >
          <TouchableOpacity
            onPress={() => setDrawerOpen((prev) => !prev)}
            className="p-2 rounded-full active:bg-gray-100"
            accessibilityLabel="Menu button"
          >
            <Ionicons name="menu" size={26} color="#005796" />
          </TouchableOpacity>

          <View className="flex-1 flex-row items-center justify-center gap-3">
            <Ionicons name="chatbubbles-outline" size={22} color="#005796" />
            <Text className="text-xl font-bold text-gray-800 tracking-tight">
              {t("title")}
            </Text>
          </View>

          <View className="w-10" />
        </View>
        <View className="flex-1">
          <GiftedChat
            messages={currentDisplayedChat?.messages || []}
            onSend={onSendMessage}
            user={{ _id: USER_ID, name: "You" }}
            placeholder={t("input_placeholder")}
            renderUsernameOnMessage={false}
            alwaysShowSend
            showUserAvatar
            isScrollToBottomEnabled
            scrollToBottomStyle={{
              position: "absolute",
              bottom: 30,
              left: "50%",
              transform: [{ translateX: -20 }],
              borderColor: "white",
              borderWidth: 2,
              borderRadius: 20,
              width: 40,
              height: 40,
              justifyContent: "center",
              alignItems: "center",
              zIndex: 10,
            }}
            scrollToBottomComponent={() => (
              <View className="w-10 h-10 bg-[#005796] rounded-full justify-center items-center shadow-md">
                <Ionicons name="arrow-down" size={20} color="white" />
              </View>
            )}
            messagesContainerStyle={{
              backgroundColor: "#E3F0FA",
              paddingBottom: 20,
              paddingTop: 10,
            }}
            renderMessage={renderChatMessage(isRTL, USER_ID)}
            renderAvatar={renderChatAvatar(isRTL, USER_ID)}
            renderInputToolbar={renderInputToolbar(isRTL)}
            renderBubble={renderChatBubble(isRTL, USER_ID)}
            textInputProps={{
              textAlign: isRTL ? "right" : "left",
              writingDirection: isRTL ? "rtl" : "ltr",
              style: {
                backgroundColor: "#FFFFFF",
                borderRadius: 25,
                paddingHorizontal: 18,
                paddingVertical: 10,
                fontSize: 16,
                borderWidth: 1,
                borderColor: "#D1D5DB",
                flex: 1,
                marginHorizontal: 8,
                color: "#1F2937",
                minHeight: 44,
                maxHeight: 120,
              },
            }}
            renderSend={renderSendButton(isRTL)}
            timeFormat="HH:mm"
            dateFormat="MMMM D, YYYY"
            infiniteScroll
            renderFooter={renderFooter(isTyping, isRTL)}
          />
        </View>
      </View>
    </Drawer>
  );
};

export default ChatScreen;
