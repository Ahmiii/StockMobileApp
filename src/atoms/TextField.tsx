import { Text, TextInput, View, type TextInputProps } from "react-native";
import { useCSSVariable } from "uniwind";

type Props = {
  label: string;
  value: string;
  onChangeText: (text: string) => void;
  onBlur?: () => void;
  placeholder?: string;
  /** Validation message. When set, the border turns red and the text shows below. */
  error?: string;
  /** Hide the characters, e.g. for a PIN. */
  secure?: boolean;
  keyboardType?: TextInputProps["keyboardType"];
  autoCapitalize?: TextInputProps["autoCapitalize"];
};

// A labelled input in a bordered card, the same surface as Card.
const TextField = ({
  label,
  value,
  onChangeText,
  onBlur,
  placeholder,
  error,
  secure = false,
  keyboardType,
  autoCapitalize = "none",
}: Props) => {
  // placeholderTextColor is a prop, not a style, so read the token directly.
  const [muted] = useCSSVariable(["--color-muted"]);

  return (
    <View className="gap-1">
      <View
        className={`gap-1 rounded-2xl border bg-card px-4 py-3 ${error ? "border-danger" : "border-border"}`}
      >
        <Text className="text-base font-semibold text-muted">{label}</Text>
        <TextInput
          className="text-xl text-foreground"
          value={value}
          onChangeText={onChangeText}
          onBlur={onBlur}
          placeholder={placeholder}
          placeholderTextColor={String(muted)}
          secureTextEntry={secure}
          keyboardType={keyboardType}
          autoCapitalize={autoCapitalize}
          autoCorrect={false}
        />
      </View>
      {error ? <Text className="px-1 text-sm text-danger">{error}</Text> : null}
    </View>
  );
};

export default TextField;
