import { useEffect, useRef } from "react";
import { Animated, View } from "react-native";

type Props = {
  /** Size and shape classes, e.g. "h-4 w-24" or "h-10 w-full rounded-xl". */
  className?: string;
};

// A grey block that pulses while content loads. Animated.View isn't patched
// by Uniwind, so the animation goes on the outer view and the classes on the
// inner one.
const Skeleton = ({ className = "" }: Props) => {
  const opacity = useRef(new Animated.Value(0.5)).current;

  useEffect(() => {
    const pulse = Animated.loop(
      Animated.sequence([
        Animated.timing(opacity, { toValue: 1, duration: 700, useNativeDriver: true }),
        Animated.timing(opacity, { toValue: 0.5, duration: 700, useNativeDriver: true }),
      ]),
    );
    pulse.start();
    return () => pulse.stop();
  }, [opacity]);

  return (
    <Animated.View style={{ opacity }}>
      <View className={`rounded-lg bg-secondary ${className}`} />
    </Animated.View>
  );
};

export default Skeleton;
