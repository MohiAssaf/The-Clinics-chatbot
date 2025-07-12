import { useCallback, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { I18nManager, Text, TouchableOpacity, View } from "react-native";
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

const ChatScreen = () => {
  const { t, i18n } = useTranslation();
  const [messages, setMessages] = useState<IMessage[]>([]);
  const [open, setOpen] = useState(false);
  const isRTL = i18n.language === "ar";

  useEffect(() => {
    setMessages([
      {
        _id: 1,
        text: t("welcome"),
        createdAt: new Date(),
        user: {
          _id: 2,
          name: "AI",
        },
      },
    ]);
  }, [i18n.language]);

  const onSend = useCallback((newMessages: IMessage[] = []) => {
    const formattedMessages = newMessages.map((message) => ({
      ...message,
      user: {
        ...message.user,
        name: message.user._id === 1 ? "You" : "AI",
      },
    }));
    setMessages((prev) => GiftedChat.append(prev, formattedMessages));
  }, []);

  const onToggleLanguage = () => {
    const newLang = i18n.language === "en" ? "ar" : "en";
    i18n.changeLanguage(newLang);
    I18nManager.forceRTL(newLang === "ar");
  };

  const renderBubble = (props: any) => {
    const isUser = props.currentMessage?.user._id === 1;
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
  };

  const customMessage = (props: any) => {
    const isUser = props.currentMessage?.user._id === 1;

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
  };

  const renderAvatar = (props: any) => {
    const isUser = props.currentMessage?.user._id === 1;

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
  };

  return (
    <Drawer
      open={open}
      onOpen={() => setOpen(true)}
      onClose={() => setOpen(false)}
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
          onClose={() => setOpen(false)}
          isRTL={isRTL}
        />
      )}
    >
      <View className="flex-1">
        <View
          className={`flex-row items-center justify-between px-4 py-3 bg-[#fcfdfd] border-b border-gray-200 ${
            isRTL ? "flex-row-reverse" : ""
          }`}
        >
          <TouchableOpacity
            onPress={() => setOpen((prev) => !prev)}
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
          messages={messages}
          onSend={onSend}
          user={{ _id: 1, name: "You" }}
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
          renderMessage={(props) => customMessage(props)}
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
