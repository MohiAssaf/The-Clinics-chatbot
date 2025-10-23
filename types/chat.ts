import { IMessage } from "react-native-gifted-chat";

export type Chat = {
  id: string;
  messages: IMessage[];
  createdAt: number;
};

export interface ChatHistoryItemProps {
  chat: Chat;
  activeChatId: string | null;
  setActiveChatId: (id: string) => void;
  onDelChat: (chatId?: string) => void;
  onClose: () => void;
}