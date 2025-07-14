import { Message } from "react-native-gifted-chat";

export const renderChatMessage =
  (isRTL: boolean, USER_ID: number) => (props: any) => {
    const isUser = props.currentMessage?.user._id === USER_ID;
    const position = isRTL
      ? isUser
        ? "left"
        : "right"
      : isUser
        ? "right"
        : "left";
    const isLeft = position === "left";

    return (
      <Message
        {...props}
        containerStyle={{
          left: {
            flexDirection: isLeft ? "row" : "row-reverse",
          },
          right: {
            flexDirection: isLeft ? "row-reverse" : "row",
          },
        }}
      />
    );
  };
