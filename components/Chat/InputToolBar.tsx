import { InputToolbar } from "react-native-gifted-chat";

export const renderInputToolbar = (isRTL: boolean) => (props: any) => {
  return (
    <InputToolbar
      {...props}
      containerStyle={{
        flexDirection: isRTL ? "row-reverse" : "row",
        backgroundColor: "#FFFFFF",
        borderTopWidth: 1,
        borderTopColor: "#E5E7EB",
        paddingHorizontal: 16,
        paddingVertical: 10,
        alignItems: "center",
      }}
      primaryStyle={{
        alignItems: "center",
        flexDirection: isRTL ? "row-reverse" : "row",
      }}
    />
  );
};
