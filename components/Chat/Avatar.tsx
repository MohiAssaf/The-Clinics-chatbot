import { Text, View } from "react-native";

export const renderChatAvatar =
  (isRTL: boolean, USER_ID: number) => (props: any) => {
    const isUser = props.currentMessage?.user._id === USER_ID;

    return (
      <View
        style={{
          width: 38,
          height: 38,
          borderRadius: 19,
          backgroundColor: isUser ? "#e5e7eb" : "#005796",
          justifyContent: "center",
          alignItems: "center",
          marginRight: isRTL ? 0 : isUser ? 0 : 12,
          marginLeft: isRTL ? (isUser ? 0 : 12) : 0,
          alignSelf: "flex-end",
          marginTop: 6,
        }}
      >
        <Text
          style={{
            color: isUser ? "#4b5563" : "#FFFFFF",
            fontSize: 13,
            fontWeight: "700",
          }}
        >
          {isUser ? "You" : "AI"}
        </Text>
      </View>
    );
  };
