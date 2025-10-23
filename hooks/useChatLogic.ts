import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { GiftedChat, IMessage } from "react-native-gifted-chat";
import { AI_ID, USER_ID } from "@/constants/chat";
import { LANGUAGE_STORAGE_KEY } from "@/constants/chat";
import { loadChatsFromStorage, saveChatsToStorage } from "@/services/storage";
import { createWelcomeMessage, generateNewChatId } from "@/utils/chatHelpers";
import { Chat } from "@/types/chat";
import { predefinedQuestionsAndAnswers } from "@/constants/predifinedQandA";

export const useChatLogic = () => {
  const { t, i18n } = useTranslation();
  const [chats, setChats] = useState<Chat[]>([]);
  const [activeChatId, setActiveChatId] = useState<string | null>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [isRTL, setIsRTL] = useState(i18n.language === "ar");
  const [isTyping, setIsTyping] = useState(false);
  const isTemporaryNewChatRef = useRef(false);

  useEffect(() => {
    setIsRTL(i18n.language === "ar");
  }, [i18n.language]);

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
        }
        onStartNewChat();
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

  const getBotAnswer = useCallback(
    (userMessage: string): string => {
      const lowerCaseMessage = userMessage.toLowerCase().trim();
      const currentLang = i18n.language;

      const questionsForLang = predefinedQuestionsAndAnswers.filter(
        (qa) => qa.language === currentLang
      );

      for (const qa of questionsForLang) {
        if (
          Array.isArray(qa.question)
            ? qa.question.some((q) =>
                lowerCaseMessage.includes(q.toLowerCase())
              )
            : lowerCaseMessage.includes(qa.question.toLowerCase())
        ) {
          return qa.answer;
        }
      }

      return t("cant_answer");
    },
    [i18n.language, t]
  );

  const getAutocompleteSuggestions = useCallback(
    (text: string): string[] => {
      if (!text) {
        return [];
      }
      const lowerCaseText = text.toLowerCase().trim();
      const currentLang = i18n.language;

      const matchingQuestions: string[] = [];

      predefinedQuestionsAndAnswers
        .filter((qa) => qa.language === currentLang)
        .forEach((qa) => {
          if (Array.isArray(qa.question)) {
            qa.question.forEach((q) => {
              if (
                q.toLowerCase().includes(lowerCaseText) &&
                !matchingQuestions.includes(q)
              ) {
                matchingQuestions.push(q);
              }
            });
          } else {
            if (
              qa.question.toLowerCase().includes(lowerCaseText) &&
              !matchingQuestions.includes(qa.question)
            ) {
              matchingQuestions.push(qa.question);
            }
          }
        });

      return matchingQuestions.slice(0, 5);
    },
    [i18n.language]
  );

  const onSendMessage = useCallback(
    async (newMessages: IMessage[] = []) => {
      if (!activeChatId) {
        return;
      }

      const userMessage = newMessages[0];

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

      setIsTyping(true);

      await new Promise((resolve) => setTimeout(resolve, 2000));

      const botAnswer = getBotAnswer(userMessage.text);

      const botMessage: IMessage = {
        _id: Math.random().toString(),
        text: botAnswer,
        createdAt: new Date(),
        user: {
          _id: AI_ID,
          name: "Bot",
        },
      };

      setChats((prevChats) => {
        const chatIndex = prevChats.findIndex(
          (chat) => chat.id === activeChatId
        );
        if (chatIndex !== -1) {
          const updatedChats = [...prevChats];
          updatedChats[chatIndex] = {
            ...updatedChats[chatIndex],
            messages: GiftedChat.append(updatedChats[chatIndex].messages, [
              botMessage,
            ]),
          };
          return updatedChats;
        }
        return prevChats;
      });

      setIsTyping(false);
    },
    [activeChatId, getBotAnswer, t]
  );

  const onDeleteChat = useCallback(
    async (chatId?: string) => {
      try {
        if (chatId) {
          const updatedChats = chats.filter((chat) => chat.id !== chatId);
          await saveChatsToStorage(updatedChats);
          setChats(updatedChats);

          if (activeChatId === chatId) {
            setActiveChatId(null);
            isTemporaryNewChatRef.current = false;
            onStartNewChat();
          }
        } else {
          await saveChatsToStorage([]);
          setChats([]);
          setActiveChatId(null);
          isTemporaryNewChatRef.current = false;
          onStartNewChat();
        }
      } catch (err) {
        console.error("Failed to delete chats:", err);
      }
    },
    [chats, activeChatId, onStartNewChat]
  );

  const onToggleLanguage = useCallback(async () => {
    const newLang = i18n.language === "en" ? "ar" : "en";
    i18n.changeLanguage(newLang);
    try {
      await AsyncStorage.setItem(LANGUAGE_STORAGE_KEY, newLang);
    } catch (e) {
      console.error("Failed to save language to storage:", e);
    }

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
    onDeleteChat,
    onToggleLanguage,
    onSendMessage,
    currentDisplayedChat,
    USER_ID,
    AI_ID,
    isTyping,
    direction: i18n.dir(),
    getAutocompleteSuggestions,
  };
};
