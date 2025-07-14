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
            backgroundColor: isUser ? "#00827e" : "#FFFFFF",
            paddingVertical: 6,
            paddingHorizontal: 10,
            borderTopRightRadius: 12,
            borderTopLeftRadius: 12,
            marginRight: isRTL ? 10 : 0,
            borderBottomRightRadius: 0,
            borderBottomLeftRadius: 12,
          },
          left: {
            backgroundColor: isUser ? "#00827e" : "#FFFFFF",
            marginLeft: isRTL ? 10 : 0,
            paddingVertical: 6,
            paddingHorizontal: 10,
            borderWidth: 1,
            borderColor: "#E5E7EB",
            borderTopRightRadius: 12,
            borderTopLeftRadius: 12,
            borderBottomRightRadius: 12,
            borderBottomLeftRadius: 0,
          },
        }}
        textStyle={{
          right: {
            color: isUser ? "#ffffff" : "#1f2937",
            fontSize: 15,
            lineHeight: 20,
          },
          left: {
            color: isUser ? "#ffffff" : "#1f2937",
            fontSize: 15,
            lineHeight: 20,
          },
        }}
        timeTextStyle={{
          right: {
            color: isUser ? "#ffffff" : "#1f2937",
          },
          left: {
            color: isUser ? "#ffffff" : "#1f2937",
          },
        }}
      />
    );
  };
