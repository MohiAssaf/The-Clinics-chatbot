import React, { useEffect, useState, useRef } from "react";
import { I18nManager, View } from "react-native";
import { SafeAreaView, SafeAreaProvider } from "react-native-safe-area-context";
import AsyncStorage from "@react-native-async-storage/async-storage";
import LottieView from "lottie-react-native";
import i18n from "./localization/index";

import "./global.css";
import ChatScreen from "./components/ChatScreen";
import { LANGUAGE_STORAGE_KEY } from "./constants/chat";

export default function App() {
  const [isAppReady, setIsAppReady] = useState(false);
  const [showLottie, setShowLottie] = useState(true);
  const lottieAnimation = useRef(null);

  useEffect(() => {
    const initializeLanguageAndApp = async () => {
      try {
        const storedLanguage = await AsyncStorage.getItem(LANGUAGE_STORAGE_KEY);
        let initialLang = "en";

        if (storedLanguage) {
          initialLang = storedLanguage;
        } else {
          initialLang = I18nManager.isRTL ? "ar" : "en";
        }

        I18nManager.forceRTL(initialLang === "ar");
        await i18n.changeLanguage(initialLang);
      } catch (e) {
        console.error("Failed to initialize app language:", e);
        I18nManager.forceRTL(false);
        await i18n.changeLanguage("en");
      } finally {
        setIsAppReady(true);
      }
    };

    initializeLanguageAndApp();
  }, []);

  useEffect(() => {
    if (isAppReady) {
      const lottieDuration = 4000;

      const timer = setTimeout(() => {
        setShowLottie(false);
      }, lottieDuration);

      return () => clearTimeout(timer);
    }
  }, [isAppReady]);

  return (
    <SafeAreaProvider>
      <SafeAreaView edges={["top"]} style={{ flex: 1 }}>
        {showLottie ? (
          <View className="flex-1 justify-center items-center bg-white">
            <LottieView
              ref={lottieAnimation}
              source={require("./assets/animation/doctor.json")}
              autoPlay
              loop
              onAnimationFinish={() => setShowLottie(false)}
              style={{
                width: 300,
                height: 300,
              }}
            />
          </View>
        ) : (
          <ChatScreen />
        )}
      </SafeAreaView>
    </SafeAreaProvider>
  );
}
