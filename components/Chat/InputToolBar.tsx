import { FlatList, Text, TouchableOpacity, View } from "react-native";
import { InputToolbar } from "react-native-gifted-chat";

export const renderInputToolbar =
  (
    isRTL: boolean,
    suggestions: string[],
    handleSuggestionPress: (suggestion: string) => void
  ) =>
  (props: any) => {
    return (
      <View>
        {suggestions.length > 0 && (
          <View
            className="bg-white border-b border-[#E0E0E0] shadow-md z-10 px-4 py-2"
            style={{
              shadowColor: "#000",
              shadowOffset: { width: 0, height: 1 },
              shadowOpacity: 0.1,
              shadowRadius: 2,
              elevation: 3,
            }}
          >
            <FlatList
              data={suggestions}
              keyExtractor={(item) => item}
              renderItem={({ item }) => (
                <TouchableOpacity
                  onPress={() => handleSuggestionPress(item)}
                  className="py-2 px-4 active:bg-blue-50 rounded-lg border border-blue-200 bg-blue-100"
                >
                  <Text className="text-[#005796] text-base font-medium">
                    {item}
                  </Text>
                </TouchableOpacity>
              )}
              keyboardShouldPersistTaps="always"
              horizontal={true}
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={{
                paddingVertical: 4,
                flexDirection: isRTL ? "row-reverse" : "row",
                gap: 8,
              }}
            />
          </View>
        )}
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
      </View>
    );
  };
