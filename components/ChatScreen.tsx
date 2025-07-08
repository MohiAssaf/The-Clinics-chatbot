import { useCallback, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { GiftedChat, IMessage } from "react-native-gifted-chat";

const ChatScreen = () => {
  const { t, i18n } = useTranslation();
  const [messages, setMessages] = useState<IMessage[]>([]);

  useEffect(() => {
    setMessages([
      {
        _id: 1,
        text: t("welcome"),
        createdAt: new Date(),
        user: {
          _id: 2,
          name: "Bot",
        },
      },
    ]);
  }, [i18n.language]);

  const onSend = useCallback((newMesgs: IMessage[] = []) => {
    setMessages((prevMessages) => GiftedChat.append(prevMessages, newMesgs));
  }, []);

  return (
    <GiftedChat
      messages={messages}
      onSend={(messages) => onSend(messages)}
      user={{ _id: 1 }}
      placeholder={t("input_placeholder")}
    />
  );
};

export default ChatScreen;
