import { IMessage } from "react-native-gifted-chat";

export const generateNewChatId = () => Date.now().toString();

export const createWelcomeMessage = (t: any, aiId: number): IMessage => {
  return {
    _id: `welcome-${Date.now()}`,
    text: t("welcome"),
    createdAt: new Date(),
    user: { _id: aiId, name: "AI" },
  };
};
