import {
  Column,
  Host,
  LazyColumn,
  ListItem,
  Row,
  Text,
  TextButton,
  TextField,
} from "@expo/ui/jetpack-compose";
import { clickable, fillMaxWidth, paddingAll, weight } from "@expo/ui/jetpack-compose/modifiers";
import { Modal, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useCSSVariable, useUniwind } from "uniwind";
import { useAddStock, type AddStockModalProps } from "./addStockShared";

// Android: a full-screen Modal whose content is Jetpack Compose — a Material
// text field and a lazy list of results. Compose takes colors, not classes,
// so the tokens are read and passed in.
const AddStockModal = ({ visible, onClose }: AddStockModalProps) => {
  const { theme } = useUniwind();
  // A Modal opens in its own window, so a SafeAreaView inside it can read
  // zero insets. The hook reads them from the app's provider instead.
  const insets = useSafeAreaInsets();
  const [background, card, foreground, muted, primary] = useCSSVariable([
    "--color-background",
    "--color-card",
    "--color-foreground",
    "--color-muted",
    "--color-primary",
  ]);
  const { setQuery, results, status, add, close, addingId } = useAddStock(onClose);

  return (
    <Modal visible={visible} animationType="slide" onRequestClose={close}>
      {/* A Modal sits outside the navigator, so it gets no safe-area padding
          of its own. Without this the header lands under the status bar. */}
      <View
        style={{
          flex: 1,
          backgroundColor: String(background),
          paddingTop: insets.top + 8,
          paddingBottom: insets.bottom,
        }}
      >
      <Host style={{ flex: 1, backgroundColor: String(background) }} colorScheme={theme}>
        <Column verticalArrangement={{ spacedBy: 12 }} modifiers={[fillMaxWidth(), paddingAll(16)]}>
          <Row horizontalArrangement="spaceBetween" verticalAlignment="center" modifiers={[fillMaxWidth()]}>
            <Text color={String(foreground)} style={{ fontSize: 22, fontWeight: "bold" }}>
              Add to watchlist
            </Text>
            <TextButton onClick={close}>
              <Text color={String(primary)}>Close</Text>
            </TextButton>
          </Row>

          <TextField
            autoFocus
            singleLine
            onValueChange={setQuery}
            keyboardOptions={{
              capitalization: "characters",
              autoCorrectEnabled: false,
              imeAction: "search",
            }}
            modifiers={[fillMaxWidth()]}
          >
            <TextField.Placeholder>
              <Text color={String(muted)}>Symbol or company name</Text>
            </TextField.Placeholder>
          </TextField>

          {status ? (
            <Text color={String(muted)} style={{ fontSize: 14 }}>
              {status}
            </Text>
          ) : null}

          <LazyColumn verticalArrangement={{ spacedBy: 8 }} modifiers={[fillMaxWidth(), weight(1)]}>
            {results.map((security) => (
              <ListItem
                key={security.id}
                colors={{ containerColor: String(card), contentColor: String(foreground) }}
                modifiers={[fillMaxWidth(), clickable(() => add(security))]}
              >
                <ListItem.HeadlineContent>
                  <Text color={String(foreground)}>{security.symbol}</Text>
                </ListItem.HeadlineContent>
                <ListItem.SupportingContent>
                  <Text color={String(muted)}>{security.companyName}</Text>
                </ListItem.SupportingContent>
                <ListItem.TrailingContent>
                  <Text color={String(primary)}>
                    {security.id === addingId ? "Adding…" : "Add"}
                  </Text>
                </ListItem.TrailingContent>
              </ListItem>
            ))}
          </LazyColumn>
        </Column>
      </Host>
      </View>
    </Modal>
  );
};

export default AddStockModal;
