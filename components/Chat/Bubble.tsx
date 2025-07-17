import { Bubble } from "react-native-gifted-chat";

export const renderChatBubble =
  (isRTL: boolean, USER_ID: number) => (props: any) => {
    const isUser = props.currentMessage?.user._id === USER_ID;
    const position = isRTL
      ? isUser
        ? "left"
        : "right"
      : isUser
        ? "right"
        : "left";

    return (
      <Bubble
        {...props}
        position={position}
        wrapperStyle={{
          right: {
            backgroundColor: "#01827e",
            paddingVertical: 8,
            paddingHorizontal: 14,
            borderTopRightRadius: 18,
            borderTopLeftRadius: 18,
            borderBottomRightRadius: 6,
            borderBottomLeftRadius: 18,
            marginRight: isRTL ? 10 : 0,
            marginBottom: 8,
            marginTop: 8,

            shadowColor: "#000",
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.15,
            shadowRadius: 3,
            elevation: 4,
          },
          left: {
            backgroundColor: "#FFFFFF",
            marginLeft: isRTL ? 10 : 0,
            paddingVertical: 8,
            paddingHorizontal: 14,
            borderWidth: 1,
            borderColor: "#E5E7EB",
            borderTopRightRadius: 18,
            borderTopLeftRadius: 18,
            borderBottomRightRadius: 18,
            borderBottomLeftRadius: 6,
            marginBottom: 8,
            marginTop: 8,

            shadowColor: "#000",
            shadowOffset: { width: 0, height: 1 },
            shadowOpacity: 0.08,
            shadowRadius: 2,
            elevation: 2,
          },
        }}
        textStyle={{
          right: {
            color: "#ffffff",
            fontSize: 16,
            lineHeight: 22,
          },
          left: {
            color: "#1F2937",
            fontSize: 16,
            lineHeight: 22,
          },
        }}
        timeTextStyle={{
          right: {
            color: "rgba(255,255,255,0.7)",
            fontSize: 10,
          },
          left: {
            color: "#6B7280",
            fontSize: 10,
          },
        }}
      />
    );
  };
