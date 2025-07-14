import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import {
  ActivityIndicator,
  I18nManager,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import {
  Bubble,
  GiftedChat,
  IMessage,
  InputToolbar,
  Message,
  Send,
} from "react-native-gifted-chat";
import { Ionicons } from "@expo/vector-icons";
import { Drawer } from "react-native-drawer-layout";
import SideBarDrawer from "./SideBarDrawer";
import AsyncStorage from "@react-native-async-storage/async-storage";

type Chat = {
  id: string;
  messages: IMessage[];
  createdAt: number;
};

const STORAGE_KEY = "CHAT_HISTORY";
const USER_ID = 1;
const AI_ID = 2;

const ChatScreen = () => {
  const { t, i18n } = useTranslation();
  const [chats, setChats] = useState<Chat[]>([]);
  const [activeChatId, setActiveChatId] = useState<string | null>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [isRTL, setIsRTL] = useState(I18nManager.isRTL);

  const isTemporaryNewChatRef = useRef(false);

  const createWelcomeMessage = useCallback((): IMessage => {
    return {
      _id: `welcome-${Date.now()}`,
      text: t("welcome"),
      createdAt: new Date(),
      user: { _id: AI_ID, name: "AI" },
    };
  }, [t]);

  const generateNewChatId = useCallback(() => Date.now().toString(), []);

  const startNewChat = useCallback(() => {
    const newId = generateNewChatId();
    setActiveChatId(newId);
    setDrawerOpen(false);
    isTemporaryNewChatRef.current = true;
  }, [generateNewChatId]);

  const saveChatsToStorage = useCallback(async (currentChats: Chat[]) => {
    try {
      const chatsToSave = currentChats.filter(
        (chat) => chat.messages.length > 1
      );
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(chatsToSave));
    } catch (error) {
      console.error("Failed to save chats to AsyncStorage:", error);
    }
  }, []);

  useEffect(() => {
    const loadChats = async () => {
      try {
        const stored = await AsyncStorage.getItem(STORAGE_KEY);
        if (stored) {
          const parsed: Chat[] = JSON.parse(stored);
          setChats(parsed);
          if (parsed.length > 0) {
            setActiveChatId(parsed[0].id);
            isTemporaryNewChatRef.current = false;
          } else {
            startNewChat();
          }
        } else {
          startNewChat();
        }
      } catch (err) {
        console.error("Failed to load chats:", err);

        startNewChat();
      } finally {
        setLoading(false);
      }
    };
    loadChats();
  }, [startNewChat]);

  useEffect(() => {
    if (chats.length > 0 && !isTemporaryNewChatRef.current) {
      saveChatsToStorage(chats);
    } else if (
      chats.length === 0 &&
      !isTemporaryNewChatRef.current &&
      activeChatId === null
    ) {
      saveChatsToStorage([]);
    }
  }, [chats, activeChatId, saveChatsToStorage]);

  const onSendMessage = useCallback(
    (newMessages: IMessage[] = []) => {
      if (!activeChatId) {
        console.warn("No active chat ID to send messages to.");
        return;
      }

      setChats((prevChats) => {
        const chatIndex = prevChats.findIndex(
          (chat) => chat.id === activeChatId
        );
        let updatedChats = [...prevChats];
        let chatToUpdate: Chat;

        if (isTemporaryNewChatRef.current) {
          const welcomeMessage = createWelcomeMessage();
          chatToUpdate = {
            id: activeChatId,
            messages: GiftedChat.append([welcomeMessage], newMessages),
            createdAt: Date.now(),
          };
          updatedChats = [chatToUpdate, ...updatedChats];
          isTemporaryNewChatRef.current = false;
        } else if (chatIndex !== -1) {
          chatToUpdate = {
            ...updatedChats[chatIndex],
            messages: GiftedChat.append(
              updatedChats[chatIndex].messages,
              newMessages
            ),
          };
          updatedChats[chatIndex] = chatToUpdate;
        } else {
          console.warn(
            "Active chat not found, creating new chat with message."
          );
          const welcomeMessage = createWelcomeMessage();
          chatToUpdate = {
            id: activeChatId,
            messages: GiftedChat.append([welcomeMessage], newMessages),
            createdAt: Date.now(),
          };
          updatedChats = [chatToUpdate, ...updatedChats];
        }

        return updatedChats;
      });
    },
    [activeChatId, createWelcomeMessage]
  );

  const onDeleteAllChats = useCallback(async () => {
    try {
      await AsyncStorage.removeItem(STORAGE_KEY);
      setChats([]);
      setActiveChatId(null);
      isTemporaryNewChatRef.current = false;
      saveChatsToStorage([]);
      startNewChat();
    } catch (err) {
      console.error("Failed to delete chats:", err);
    }
  }, [saveChatsToStorage, startNewChat]);

  const onToggleLanguage = useCallback(() => {
    const newLang = i18n.language === "en" ? "ar" : "en";
    i18n.changeLanguage(newLang);
    I18nManager.forceRTL(newLang === "ar");
    setIsRTL(newLang === "ar");
  }, [i18n]);

  const currentDisplayedChat = useMemo(() => {
    if (isTemporaryNewChatRef.current && activeChatId) {
      return {
        id: activeChatId,
        messages: [createWelcomeMessage()],
        createdAt: Date.now(),
      };
    }

    return chats.find((c) => c.id === activeChatId);
  }, [activeChatId, chats, isTemporaryNewChatRef, createWelcomeMessage]);

  const renderBubble = useCallback(
    (props: any) => {
      const isUser = props.currentMessage?.user._id === USER_ID;
      const position = isRTL
        ? isUser
          ? "left"
          : "right"
        : isUser
          ? "right"
          : "left";
      return (
        <Bubble
          {...props}
          position={position}
          wrapperStyle={{
            right: {
              backgroundColor: isUser ? "#00827e" : "#FFFFFF",
              paddingVertical: 6,
              paddingHorizontal: 10,
              borderTopRightRadius: 12,
              borderTopLeftRadius: 12,
              marginRight: isRTL ? 10 : 0,
              borderBottomRightRadius: 0,
              borderBottomLeftRadius: 12,
            },
            left: {
              backgroundColor: isUser ? "#00827e" : "#FFFFFF",
              marginLeft: isRTL ? 10 : 0,
              paddingVertical: 6,
              paddingHorizontal: 10,
              borderWidth: 1,
              borderColor: "#E5E7EB",
              borderTopRightRadius: 12,
              borderTopLeftRadius: 12,
              borderBottomRightRadius: 12,
              borderBottomLeftRadius: 0,
            },
          }}
          textStyle={{
            right: {
              color: isUser ? "#ffffff" : "#1f2937",
              fontSize: 15,
              lineHeight: 20,
            },
            left: {
              color: isUser ? "#ffffff" : "#1f2937",
              fontSize: 15,
              lineHeight: 20,
            },
          }}
          timeTextStyle={{
            right: {
              color: isUser ? "#ffffff" : "#1f2937",
            },
            left: {
              color: isUser ? "#ffffff" : "#1f2937",
            },
          }}
        />
      );
    },
    [isRTL]
  );

  const customMessage = useCallback(
    (props: any) => {
      const isUser = props.currentMessage?.user._id === USER_ID;
      const position = isRTL
        ? isUser
          ? "left"
          : "right"
        : isUser
          ? "right"
          : "left";
      const isLeft = position === "left";

      return (
        <Message
          {...props}
          containerStyle={{
            left: {
              flexDirection: isLeft ? "row" : "row-reverse",
            },
            right: {
              flexDirection: isLeft ? "row-reverse" : "row",
            },
          }}
        />
      );
    },
    [isRTL]
  );

  const renderAvatar = useCallback(
    (props: any) => {
      const isUser = props.currentMessage?.user._id === USER_ID;

      return (
        <View
          style={{
            width: 36,
            height: 36,
            borderRadius: 18,
            backgroundColor: isUser ? "#e5e7eb" : "#00827e",
            justifyContent: "center",
            alignItems: "center",
            marginRight: isRTL ? 0 : isUser ? 0 : 8,
            marginLeft: isRTL ? (isUser ? 0 : 8) : 0,
            alignSelf: "center",
          }}
        >
          <Text
            style={{
              color: isUser ? "#4b5563" : "#FFFFFF",
              fontSize: 12,
              fontWeight: "600",
            }}
          >
            {isUser ? "You" : "AI"}
          </Text>
        </View>
      );
    },
    [isRTL]
  );

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
            if (activeChatId !== id) {
              setActiveChatId(id);

              const isExistingChat = chats.some((chat) => chat.id === id);
              isTemporaryNewChatRef.current = !isExistingChat;
            }
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
          renderMessage={customMessage}
          renderAvatar={renderAvatar}
          renderInputToolbar={(props) => (
            <InputToolbar
              {...props}
              containerStyle={{
                flexDirection: isRTL ? "row-reverse" : "row",
                backgroundColor: "#FFFFFF",
                borderTopWidth: 1,
                borderTopColor: "#E5E7EB",
                paddingHorizontal: 12,
                paddingVertical: 8,
                alignItems: "center",
              }}
              primaryStyle={{
                alignItems: "center",
                flexDirection: isRTL ? "row-reverse" : "row",
              }}
            />
          )}
          renderBubble={renderBubble}
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
