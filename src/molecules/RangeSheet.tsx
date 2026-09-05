import Card from "@/atoms/Card";
import Divider from "@/atoms/Divider";
import Label from "@/atoms/Label";
import { Fragment } from "react";
import { Modal, Pressable, Text, View } from "react-native";
import type { RangeSheetProps } from "./rangePickerShared";

// Web fallback only. iOS renders RangeSheet.ios.tsx (SwiftUI bottom sheet
// with a List) and Android renders RangeSheet.android.tsx (Material modal
// bottom sheet); Metro picks by platform.
const RangeSheet = ({ visible, options, value, onSelect, onClose }: RangeSheetProps) => (
  <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
    <Pressable className="flex-1 justify-end bg-black/50 p-4" onPress={onClose}>
      <Card bordered>
        <Label>Range</Label>
        {options.map((option, i) => (
          <Fragment key={option.value}>
            {i > 0 ? <Divider /> : null}
            <Pressable className="py-3" onPress={() => onSelect(option.value)}>
              <View className="flex-row justify-between">
                <Text className="text-base text-foreground">{option.label}</Text>
                {option.value === value ? (
                  <Text className="text-base text-primary">✓</Text>
                ) : null}
              </View>
            </Pressable>
          </Fragment>
        ))}
      </Card>
    </Pressable>
  </Modal>
);

export default RangeSheet;
