import { IMessage } from "react-native-gifted-chat";

export type Chat = {
  id: string;
  messages: IMessage[];
  createdAt: number;
};
