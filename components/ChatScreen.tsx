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
      <View className="flex-1 bg-gray-100">
        <View
          className={`flex-row items-center justify-between px-4 py-2 bg-white border-b border-[#00827e] ${
            isRTL ? "flex-row-reverse" : "flex-row"
          } shadow-lg`}
        >
          <TouchableOpacity
            onPress={() => setDrawerOpen((prev) => !prev)}
            className="p-2 rounded-full active:bg-gray-100"
            accessibilityLabel="Menu button"
          >
            <Ionicons name="menu" size={26} color="#00827e" />
          </TouchableOpacity>

          <View className="flex-1 flex-row items-center justify-center gap-3">
            <Ionicons name="chatbubbles-outline" size={22} color="#00827e" />
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
            alwaysShowSend={true}
            showUserAvatar
            scrollToBottomComponent={() => (
              <View className="mb-4 mr-4 p-2 bg-white rounded-full shadow-md">
                <Ionicons name="chevron-down" size={20} color="#6B7280" />
              </View>
            )}
            messagesContainerStyle={{
              backgroundColor: "#f0fdfa",
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
            renderSend={(props) => (
              <Send
                {...props}
                containerStyle={{
                  justifyContent: "center",
                  alignItems: "center",
                  marginHorizontal: 8,
                  marginBottom: 2,
                }}
                disabled={!props.text}
              >
                <View
                  style={{
                    backgroundColor: props.text ? "#10B981" : "#A7F3D0",
                    borderRadius: 25,
                    width: 48,
                    height: 48,
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <Ionicons
                    name="paper-plane"
                    size={22}
                    color="white"
                    style={{
                      transform: [{ scaleX: isRTL ? -1 : 1 }],
                      opacity: props.text ? 1 : 0.8,
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
      </View>
    </Drawer>
  );
};

export default ChatScreen;
