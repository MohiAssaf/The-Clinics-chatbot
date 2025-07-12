import { useTranslation } from "react-i18next";
import { Text, TouchableOpacity, View } from "react-native";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";

const SideBarDrawer = ({ onToggleLang, onClose, isRTL }: any) => {
  const { t } = useTranslation();

  return (
    <View className="flex-1 bg-white p-3">
      <View
        className={`flex ${isRTL ? "flex-row-reverse" : "flex-row"} items-center justify-between mb-8`}
      >
        <Text className="text-xl font-semibold text-gray-900">
          {t("sidebar_title")}
        </Text>
        <TouchableOpacity
          onPress={onClose}
          className="p-2 rounded-full active:bg-gray-100"
        >
          <Ionicons name="close" size={24} className="text-gray-500" />
        </TouchableOpacity>
      </View>

      <View className="border-t border-gray-200 pt-4">
        <TouchableOpacity
          onPress={onToggleLang}
          className={`flex ${isRTL ? "flex-row-reverse" : "flex-row"} items-center rounded-xl p-4 mb-4 active:bg-gray-50`}
          activeOpacity={0.7}
        >
          <MaterialIcons
            name="history"
            size={24}
            className="text-gray-600 mx-3"
          />
          <Text className="text-gray-800">{t("history")}</Text>
        </TouchableOpacity>
      </View>

      <View className="mt-auto mb-4">
        <TouchableOpacity
          onPress={onToggleLang}
          className={`flex ${isRTL ? "flex-row-reverse" : "flex-row"} items-center justify-center bg-blue-500 rounded-xl p-4 active:bg-blue-600`}
          activeOpacity={0.7}
        >
          <Ionicons name="language" size={24} className="text-white mx-2" />
          <Text className="text-white font-medium">{t("switch_lang")}</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default SideBarDrawer;
