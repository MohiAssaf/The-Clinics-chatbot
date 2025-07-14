import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { Chat } from "../types/chat";
import { I18nManager } from "react-native";
import { createWelcomeMessage, generateNewChatId } from "../utils/chatHelpers";
import { loadChatsFromStorage, saveChatsToStorage } from "../services/storage";
import { GiftedChat, IMessage } from "react-native-gifted-chat";
import { AI_ID, USER_ID } from "../constants/chat";

export const useChatLogic = () => {
  const { t, i18n } = useTranslation();
  const [chats, setChats] = useState<Chat[]>([]);
  const [activeChatId, setActiveChatId] = useState<string | null>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [isRTL, setIsRTL] = useState(I18nManager.isRTL);
  const isTemporaryNewChatRef = useRef(false);

  const onStartNewChat = useCallback(() => {
    const newId = generateNewChatId();
    setActiveChatId(newId);
    setDrawerOpen(false);
    isTemporaryNewChatRef.current = true;
  }, []);

  useEffect(() => {
    const loadData = async () => {
      try {
        const stored = await loadChatsFromStorage();
        if (stored && stored.length > 0) {
          setChats(stored);
          setActiveChatId(stored[0].id);
          isTemporaryNewChatRef.current = false;
        } else {
          onStartNewChat();
        }
      } catch (err) {
        console.error("Failed to load chats:", err);
        onStartNewChat();
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, [onStartNewChat]);

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
  }, [chats, activeChatId]);

  const onSendMessage = useCallback(
    (newMessages: IMessage[] = []) => {
      if (!activeChatId) {
        return;
      }

      setChats((prevChats) => {
        const chatIndex = prevChats.findIndex(
          (chat) => chat.id === activeChatId
        );
        let updatedChats = [...prevChats];
        let chatToUpdate: Chat;

        if (isTemporaryNewChatRef.current) {
          const welcomeMsg = createWelcomeMessage(t, AI_ID);
          chatToUpdate = {
            id: activeChatId,
            messages: GiftedChat.append([welcomeMsg], newMessages),
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
          const welcomeMsg = createWelcomeMessage(t, AI_ID);
          chatToUpdate = {
            id: activeChatId,
            messages: GiftedChat.append([welcomeMsg], newMessages),
            createdAt: Date.now(),
          };
          updatedChats = [chatToUpdate, ...updatedChats];
        }

        return updatedChats;
      });
    },
    [activeChatId, t]
  );

  const onDeleteAllChats = useCallback(async () => {
    try {
      await saveChatsToStorage([]);
      setChats([]);
      setActiveChatId(null);
      isTemporaryNewChatRef.current = false;
      onStartNewChat();
    } catch (err) {
      console.error("Failed to delete chats:", err);
    }
  }, [onStartNewChat]);

  const onToggleLanguage = useCallback(() => {
    const newLang = i18n.language === "en" ? "ar" : "en";
    i18n.changeLanguage(newLang);
    I18nManager.forceRTL(newLang === "ar");
    setIsRTL(newLang === "ar");
    onStartNewChat();
  }, [i18n, onStartNewChat]);

  const currentDisplayedChat = useMemo(() => {
    if (isTemporaryNewChatRef.current && activeChatId) {
      return {
        id: activeChatId,
        messages: [createWelcomeMessage(t, AI_ID)],
        createdAt: Date.now(),
      };
    }
    return chats.find((c) => c.id === activeChatId);
  }, [activeChatId, chats, t]);

  const onSetActiveChat = useCallback(
    (id: string) => {
      if (activeChatId !== id) {
        setActiveChatId(id);
        const isExistingChat = chats.some((chat) => chat.id === id);
        isTemporaryNewChatRef.current = !isExistingChat;
      }
    },
    [activeChatId, chats]
  );

  return {
    loading,
    drawerOpen,
    setDrawerOpen,
    isRTL,
    chats,
    activeChatId,
    setActiveChat: onSetActiveChat,
    startNewChat: onStartNewChat,
    onDeleteAllChats,
    onToggleLanguage,
    onSendMessage,
    currentDisplayedChat,
    USER_ID,
    AI_ID,
  };
};
