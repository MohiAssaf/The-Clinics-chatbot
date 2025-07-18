import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withRepeat,
  withTiming,
} from "react-native-reanimated";

const TypingDot = ({ delay }: { delay: number }) => {
  const opacity = useSharedValue(0.3);

  opacity.value = withRepeat(
    withDelay(
      delay,
      withTiming(1, { duration: 400 }, () => {
        opacity.value = withTiming(0.2, { duration: 300 });
      })
    ),
    -1,
    true
  );

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
  }));

  return (
    <Animated.View
      className="w-2 h-2 rounded-full bg-gray-500"
      style={animatedStyle}
    />
  );
};

export default TypingDot;
