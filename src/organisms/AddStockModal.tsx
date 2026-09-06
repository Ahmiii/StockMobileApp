import Card from "@/atoms/Card";
import Label from "@/atoms/Label";
import TextField from "@/atoms/TextField";
import { FlashList } from "@shopify/flash-list";
import { ActivityIndicator, Modal, Pressable, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useCSSVariable } from "uniwind";
import { useAddStock, type AddStockModalProps } from "./addStockShared";

const Separator = () => <View className="h-2" />;

// Web fallback only. iOS renders AddStockModal.ios.tsx (SwiftUI content) and
// Android renders AddStockModal.android.tsx (Jetpack Compose content); Metro
// picks by platform.
const AddStockModal = ({ visible, onClose }: AddStockModalProps) => {
  const [primary] = useCSSVariable(["--color-primary"]);
  // A Modal opens in its own window, so a SafeAreaView inside it can read
  // zero insets. The hook reads them from the app's provider instead.
  const insets = useSafeAreaInsets();
  const { query, setQuery, results, status, add, close, addingId } =
    useAddStock(onClose);

  return (
    <Modal visible={visible} animationType="slide" onRequestClose={close}>
      {/* A Modal sits outside the navigator, so it gets no safe-area padding
          of its own. Without this the header lands under the status bar. */}
      <View
        style={{ flex: 1, paddingTop: insets.top + 8, paddingBottom: insets.bottom }}
        className="bg-background"
      >
      <View className="flex-1 gap-4 bg-background p-4">
        <View className="flex-row items-center justify-between">
          <Label size="lg" color="foreground">
            Add to watchlist
          </Label>
          <Pressable onPress={close} hitSlop={12}>
            <Text className="text-base font-semibold text-primary">Close</Text>
          </Pressable>
        </View>

        <TextField
          label="Search"
          value={query}
          onChangeText={setQuery}
          placeholder="e.g. PSO or Pakistan State Oil"
          autoCapitalize="characters"
        />

        {status ? <Text className="text-sm text-muted">{status}</Text> : null}

        <View className="flex-1">
          <FlashList
            data={results}
            keyExtractor={(security) => security.id}
            keyboardShouldPersistTaps="handled"
            renderItem={({ item }) => (
              <Pressable onPress={() => add(item)} disabled={addingId !== null}>
                <Card bordered>
                  <View className="flex-row items-center gap-3">
                    <View className="flex-1">
                      <Text className="text-base font-bold text-foreground">
                        {item.symbol}
                      </Text>
                      <Text className="text-sm text-muted" numberOfLines={1}>
                        {item.companyName}
                      </Text>
                    </View>
                    {item.id === addingId ? (
                      <ActivityIndicator color={String(primary)} />
                    ) : (
                      <Text className="text-base font-semibold text-primary">
                        Add
                      </Text>
                    )}
                  </View>
                </Card>
              </Pressable>
            )}
            ItemSeparatorComponent={Separator}
            showsVerticalScrollIndicator={false}
          />
        </View>
      </View>
      </View>
    </Modal>
  );
};

export default AddStockModal;
