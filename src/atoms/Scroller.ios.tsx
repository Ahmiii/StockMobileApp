import { Host, RNHostView, ScrollView } from "@expo/ui/swift-ui";
import { useState } from "react";
import { View, type LayoutChangeEvent } from "react-native";
import type { ScrollerProps } from "./Scroller";

// iOS: a real SwiftUI ScrollView. The React Native rows are placed back inside
// it through RNHostView, so Uniwind classes and the Skia sparklines keep working.
//
// Sizing: SwiftUI can't ask Yoga how wide the rows want to be, so we measure the
// available width ourselves and pin the hosted View to it. RNHostView with
// matchContents then reports the content height back so SwiftUI can scroll it.
const Scroller = ({ height, contentClassName = "gap-2", children }: ScrollerProps) => {
  const [width, setWidth] = useState(0);
  const onLayout = (e: LayoutChangeEvent) =>
    setWidth(e.nativeEvent.layout.width);

  return (
    <View onLayout={onLayout} style={{ height }}>
      {width > 0 && (
        <Host style={{ width, height }}>
          <ScrollView showsIndicators={false}>
            <RNHostView matchContents>
              <View style={{ width }} className={contentClassName}>
                {children}
              </View>
            </RNHostView>
          </ScrollView>
        </Host>
      )}
    </View>
  );
};

export default Scroller;
