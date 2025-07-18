import { View } from "react-native";
import TypingDot from "./TypingDot";

const renderFooter = (isTyping: boolean, isRTL: boolean) => (props: any) => {
  if (!isTyping) return null;

  return (
    <View
      className={`flex flex-row items-center py-2 px-3 rounded-xl w-20 h-10 ml-4 gap-1 bg-gray-200 ${
        isRTL ? "flex-row-reverse" : "flex-row"
      }`}
    >
      <View className="flex flex-row justify-center items-center ml-2 gap-1">
        <TypingDot delay={0} />
        <TypingDot delay={200} />
        <TypingDot delay={400} />
      </View>
    </View>
  );
};

export default renderFooter;
