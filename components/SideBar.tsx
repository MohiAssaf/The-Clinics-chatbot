import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { Text, TouchableOpacity, View } from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";

const SIDEBAR_WIDTH = 250;

const SideBar = ({ visible, onToggleLang, onClose, isRTL }: any) => {
  const { t } = useTranslation();

  const translateX = useSharedValue(isRTL ? SIDEBAR_WIDTH : -SIDEBAR_WIDTH);

  useEffect(() => {
    translateX.value = withTiming(
      visible ? 0 : isRTL ? SIDEBAR_WIDTH : -SIDEBAR_WIDTH,
      {
        duration: 300,
      }
    );
  }, [visible, isRTL]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: translateX.value }],
  }));

  return (
    <Animated.View
      className={`absolute top-0 bottom-0 w-[${SIDEBAR_WIDTH}px] bg-white shadow-xl z-50`}
      style={[
        animatedStyle,
        isRTL ? { right: 0 } : { left: 0 },
        {
          borderLeftWidth: isRTL ? 0 : 1,
          borderRightWidth: isRTL ? 1 : 0,
          borderColor: "#e5e7eb",
        },
      ]}
    >
      <View className="p-6 flex-1">
        <View
          className={`flex-row items-center justify-between mb-8 ${isRTL ? "flex-row-reverse" : ""}`}
        >
          <Text className="text-xl font-semibold mb-4">
            {t("sidebar_title")}
          </Text>
          <TouchableOpacity onPress={onClose} className="p-2">
            <Ionicons name="close" size={24} color="#6b7280" />
          </TouchableOpacity>
        </View>

        <View className="border-t border-gray-200 pt-4">
          <TouchableOpacity
            onPress={onToggleLang}
            className={`flex-row items-center rounded-lg p-4 mb-4 ${isRTL ? "flex-row-reverse" : ""}`}
            activeOpacity={0.7}
          >
            <MaterialIcons
              name="history"
              size={24}
              color="#4b5563"
              style={isRTL ? { marginLeft: 12 } : { marginRight: 12 }}
            />
            <Text>{t("history")}</Text>
          </TouchableOpacity>
        </View>

        <View className="mt-auto">
          <TouchableOpacity
            onPress={onToggleLang}
            className={`flex-row items-center justify-center bg-blue-500 rounded-lg p-4 ${isRTL ? "flex-row-reverse" : ""}`}
            activeOpacity={0.7}
          >
            <Ionicons
              name="language"
              size={24}
              color="white"
              style={isRTL ? { marginLeft: 8 } : { marginRight: 8 }}
            />
            <Text className="text-white"> {t("switch_lang")}</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Animated.View>
  );
};

export default SideBar;
