import { Chat } from "@/types/chat";

export type SideBarDrawerProps = {
  onToggleLang: () => void;
  onClose: () => void;
  isRTL: boolean;
  chats: Chat[];
  activeChatId: string | null;
  setActiveChatId: (id: string) => void;
  startNewChat: () => void;
  deleteAllChats: () => void;
};
