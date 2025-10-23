import AsyncStorage from "@react-native-async-storage/async-storage";
import { Chat } from "@/types/chat";
import { STORAGE_KEY } from "@/constants/chat";

export const loadChatsFromStorage = async (): Promise<Chat[]> => {
  try {
    const stored = await AsyncStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch (error) {
    console.error("Failed to load chats from AsyncStorage:", error);
    return [];
  }
};

export const saveChatsToStorage = async (chats: Chat[]): Promise<void> => {
  try {
    const chatsToSave = chats.filter((chat) => chat.messages.length > 1);
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(chatsToSave));
  } catch (error) {
    console.error("Failed to save chats to AsyncStorage:", error);
  }
};

export const clearAllChatsFromStorage = async (): Promise<void> => {
  try {
    await AsyncStorage.removeItem(STORAGE_KEY);
  } catch (error) {
    console.error("Failed to delete chats from AsyncStorage:", error);
  }
};
