import {
  Button,
  Host,
  HStack,
  List,
  Section,
  Spacer,
  Text,
  TextField,
  VStack,
} from "@expo/ui/swift-ui";
import {
  autocorrectionDisabled,
  font,
  foregroundStyle,
  listStyle,
  padding,
  scrollContentBackground,
  textFieldStyle,
  textInputAutocapitalization,
} from "@expo/ui/swift-ui/modifiers";
import { Modal, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useCSSVariable, useUniwind } from "uniwind";
import { useAddStock, type AddStockModalProps } from "./addStockShared";

// iOS: a native page sheet (React Native's Modal) whose content is SwiftUI —
// a search field and a List of results. SwiftUI takes colors, not classes,
// so the tokens are read and passed in.
const AddStockModal = ({ visible, onClose }: AddStockModalProps) => {
  const { theme } = useUniwind();
  // A Modal opens in its own window, so a SafeAreaView inside it can read
  // zero insets. The hook reads them from the app's provider instead.
  const insets = useSafeAreaInsets();
  const [muted, primary, background] = useCSSVariable([
    "--color-muted",
    "--color-primary",
    "--color-background",
  ]);
  const { setQuery, results, status, add, close, addingId } =
    useAddStock(onClose);

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={close}
    >
      {/* A Modal sits outside the navigator, so it gets no safe-area padding
          of its own. Without this the header lands under the status bar. */}
      {/* The sheet is white by default; paint it like the Android modal does,
          or dark-theme text lands on a white background. */}
      <View
        style={{
          flex: 1,
          paddingTop: insets.top + 8,
          paddingBottom: insets.bottom,
          backgroundColor: String(background),
        }}
      >
        <Host
          style={{ flex: 1, backgroundColor: String(background) }}
          colorScheme={theme}
        >
          {/* Side padding goes on the header and search field, not the stack,
              so the list below can run edge to edge. */}
          <VStack spacing={12} modifiers={[padding({ top: 16 })]}>
            <HStack modifiers={[padding({ horizontal: 16 })]}>
              <Text modifiers={[font({ size: 22, weight: "bold" })]}>
                Add to watchlist
              </Text>
              <Spacer />
              <Button
                label="Close"
                onPress={close}
                modifiers={[foregroundStyle(String(primary))]}
              />
            </HStack>

            <TextField
              placeholder="Symbol or company name"
              autoFocus
              onTextChange={setQuery}
              modifiers={[
                textFieldStyle("roundedBorder"),
                textInputAutocapitalization("characters"),
                autocorrectionDisabled(),
                padding({ horizontal: 16 }),
              ]}
            />

            {status ? (
              <Text
                modifiers={[
                  font({ size: 14 }),
                  foregroundStyle(String(muted)),
                  padding({ horizontal: 16 }),
                ]}
              >
                {status}
              </Text>
            ) : null}

            {/* "plain" drops the inset-grouped side margins so rows run full
                width; the hidden background lets the sheet colour through. */}
            <List modifiers={[listStyle("plain"), scrollContentBackground("hidden")]}>
              <Section>
                {results.map((security) => (
                  <Button
                    key={security.id}
                    label={
                      security.id === addingId
                        ? `Adding ${security.symbol}…`
                        : `${security.symbol} · ${security.companyName}`
                    }
                    onPress={() => add(security)}
                  />
                ))}
              </Section>
            </List>
          </VStack>
        </Host>
      </View>
    </Modal>
  );
};

export default AddStockModal;
