import Button from "@/atoms/Button";
import Label from "@/atoms/Label";
import LogoMark from "@/atoms/LogoMark";
import TextField from "@/atoms/TextField";
import { useLogin } from "@/queries/useLogin";
import { router } from "expo-router";
import { Controller, useForm } from "react-hook-form";
import { KeyboardAvoidingView, Platform, Text, View } from "react-native";

type Form = {
  email: string;
  password: string;
};

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const Welcome = () => {
  const { control, handleSubmit } = useForm<Form>({
    defaultValues: { email: "", password: "" },
    mode: "onBlur",
  });
  const loginMutation = useLogin();
  const signIn = (values: Form) => {
    loginMutation.mutate(values, {
      onSuccess: () => router.replace("/link-broker"),
    });
  };

  return (
    <KeyboardAvoidingView
      className="flex-1 justify-between"
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <View className="gap-8">
        <LogoMark />

        <View className="gap-2">
          <Label size="lg" color="foreground">
            Crest
          </Label>
          <Text className="text-xl text-muted">
            Your PSX portfolio, always current.
          </Text>
        </View>

        <View className="gap-3">
          <Controller
            control={control}
            name="email"
            rules={{
              required: "Email is required",
              pattern: { value: EMAIL_PATTERN, message: "Enter a valid email" },
            }}
            render={({ field, fieldState }) => (
              <TextField
                label="Email"
                value={field.value}
                onChangeText={field.onChange}
                onBlur={field.onBlur}
                placeholder="you@example.com"
                keyboardType="email-address"
                error={fieldState.error?.message}
              />
            )}
          />

          <Controller
            control={control}
            name="password"
            rules={{
              required: "Password is required",
              minLength: { value: 2, message: "At least 6 characters" },
            }}
            render={({ field, fieldState }) => (
              <TextField
                label="Password"
                value={field.value}
                onChangeText={field.onChange}
                onBlur={field.onBlur}
                placeholder="••••••••"
                secure
                error={fieldState.error?.message}
              />
            )}
          />

          {loginMutation.error ? (
            <Text className="px-1 text-sm text-danger">
              {loginMutation.error.message}
            </Text>
          ) : null}
        </View>
      </View>

      <Button
        label={loginMutation.isPending ? "Signing in…" : "Sign in"}
        variant="solid"
        disabled={loginMutation.isPending}
        onPress={handleSubmit(signIn)}
      />
    </KeyboardAvoidingView>
  );
};

export default Welcome;
