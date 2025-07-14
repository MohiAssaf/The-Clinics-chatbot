import { Text, View } from "react-native";

export const renderChatAvatar =
  (isRTL: boolean, USER_ID: number) => (props: any) => {
    const isUser = props.currentMessage?.user._id === USER_ID;

    return (
      <View
        style={{
          width: 36,
          height: 36,
          borderRadius: 18,
          backgroundColor: isUser ? "#e5e7eb" : "#00827e",
          justifyContent: "center",
          alignItems: "center",
          marginRight: isRTL ? 0 : isUser ? 0 : 8,
          marginLeft: isRTL ? (isUser ? 0 : 8) : 0,
          alignSelf: "center",
        }}
      >
        <Text
          style={{
            color: isUser ? "#4b5563" : "#FFFFFF",
            fontSize: 12,
            fontWeight: "600",
          }}
        >
          {isUser ? "You" : "AI"}
        </Text>
      </View>
    );
  };
