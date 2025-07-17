import { View } from "react-native";
import { Send } from "react-native-gifted-chat";
import { Ionicons } from "@expo/vector-icons";

export const renderSendButton = (isRTL: boolean) => (props: any) => {
  return (
    <Send
      {...props}
      containerStyle={{
        justifyContent: "center",
        alignItems: "center",
        marginHorizontal: 8,
        marginBottom: 2,
      }}
      disabled={!props.text}
    >
      <View
        style={{
          backgroundColor: props.text ? "#10B981" : "#A7F3D0",
          borderRadius: 25,
          width: 48,
          height: 48,
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Ionicons
          name="paper-plane"
          size={22}
          color="white"
          style={{
            transform: [{ scaleX: isRTL ? -1 : 1 }],
            opacity: props.text ? 1 : 0.8,
          }}
        />
      </View>
    </Send>
  );
};
