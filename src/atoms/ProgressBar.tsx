import { Canvas, RoundedRect } from "@shopify/react-native-skia";
import { useState } from "react";
import { View, type LayoutChangeEvent } from "react-native";

type Props = {
  /** Fill amount from 0 to 1. */
  value: number;
  /** Fill color. Canvas takes colors, not classes, so pass a resolved token. */
  color: string;
  /** Track color behind the fill. */
  trackColor: string;
  height?: number;
};

// A thin rounded track with a rounded fill, drawn on Skia. Fills the width of
// its parent; measure it the same way TrendChart does.
const ProgressBar = ({ value, color, trackColor, height = 8 }: Props) => {
  const [width, setWidth] = useState(0);
  const onLayout = (e: LayoutChangeEvent) =>
    setWidth(e.nativeEvent.layout.width);

  const clamped = Math.min(Math.max(value, 0), 1);
  const fillWidth = width * clamped;
  const radius = height / 2;

  return (
    <View onLayout={onLayout} style={{ height }}>
      {width > 0 && (
        <Canvas style={{ width, height }}>
          <RoundedRect x={0} y={0} width={width} height={height} r={radius} color={trackColor} />
          {fillWidth > 0 && (
            <RoundedRect x={0} y={0} width={fillWidth} height={height} r={radius} color={color} />
          )}
        </Canvas>
      )}
    </View>
  );
};

export default ProgressBar;
