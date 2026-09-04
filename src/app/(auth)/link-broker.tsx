import Button from "@/atoms/Button";
import InfoNote from "@/atoms/InfoNote";
import Label from "@/atoms/Label";
import TextField from "@/atoms/TextField";
import { useLinkBroker } from "@/queries/useLogin";
import { router } from "expo-router";
import { Controller, useForm } from "react-hook-form";
import { KeyboardAvoidingView, Platform, Text, View } from "react-native";
type Form = {
  accountNumber: string;
  password: string;
};

const LinkBrokerAccount = () => {
  const { control, handleSubmit } = useForm<Form>({
    defaultValues: { accountNumber: "", password: "" },
    mode: "onBlur",
  });
  const linkMutation = useLinkBroker();

  const connect = (values: Form) => {
    linkMutation.mutate(values, {
      onSuccess: () => {
        // Let the user pick which portfolio on the account to track.
        router.replace("/portfolios");
      },
    });
  };

  return (
    // Lifts the Connect button above the keyboard while typing.
    <KeyboardAvoidingView
      className="flex-1 justify-between"
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <View className="gap-6">
        <View className="gap-2">
          <Label size="lg" color="foreground">
            Link your broker
          </Label>
          <Text className="text-xl leading-7 text-muted">
            Sign in with your AHL eTrade credentials to import your trade
            history.
          </Text>
        </View>

        <View className="gap-3">
          <Controller
            control={control}
            name="accountNumber"
            rules={{
              required: "Client code is required",
            }}
            render={({ field, fieldState }) => (
              <TextField
                label="Client code"
                value={field.value}
                onChangeText={field.onChange}
                onBlur={field.onBlur}
                placeholder="e.g. 14203-8"
                error={fieldState.error?.message}
              />
            )}
          />

          <Controller
            control={control}
            name="password"
            rules={{
              required: "PIN is required",
            }}
            render={({ field, fieldState }) => (
              <TextField
                label="PIN"
                value={field.value}
                onChangeText={field.onChange}
                onBlur={field.onBlur}
                placeholder="••••"
                secure
                error={fieldState.error?.message}
              />
            )}
          />
        </View>

        <InfoNote>
          Credentials are encrypted at rest and used only to sync your own
          trades. Nothing is ever logged in plain text.
        </InfoNote>
      </View>

      <Button label="Connect" variant="solid" onPress={handleSubmit(connect)} />
    </KeyboardAvoidingView>
  );
};

export default LinkBrokerAccount;
