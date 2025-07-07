import { useState } from "react";
import { SafeAreaView } from "react-native";
import { GiftedChat, IMessage } from "react-native-gifted-chat";

const ChatBotUi = () => {
  const [messages, setMessages] = useState<IMessage[]>();

  const onSend = (newMessage: IMessage[] = []) => {
    setMessages((previousMessages = []) =>
      GiftedChat.append(previousMessages, newMessage)
    );
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      <GiftedChat
        messages={messages}
        onSend={(messages) => onSend(messages)}
        user={{ _id: 1 }}
      />
    </SafeAreaView>
  );
};

export default ChatBotUi;
