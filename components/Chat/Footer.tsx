import { View } from "react-native";
import TypingDot from "./TypingDot";

const renderFooter = (isTyping: boolean, isRTL: boolean) => (props: any) => {
  if (!isTyping) return null;

  return (
<View
  className={`flex flex-row justify-center items-center py-2 px-3 rounded-xl w-20 h-10 bg-gray-200 ${
    isRTL ? "mr-4" : "ml-4"
  }`}
  style={{ alignSelf: isRTL ? "flex-end" : "flex-start" }}
>
  <View className="flex flex-row justify-center items-center gap-1">
    <TypingDot delay={0} />
    <TypingDot delay={200} />
    <TypingDot delay={400} />
  </View>
</View>


  );
};

export default renderFooter;
