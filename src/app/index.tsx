import { routeAfterLogin } from "@/apis/auth";
import { hasAuthToken, loadAuthToken } from "@/apis/client";
import Button from "@/atoms/Button";
import { Redirect, type Href } from "expo-router";
import { useEffect, useState } from "react";
import { Text, View } from "react-native";

type Decision = { href: Href | null; problem: string };

// Where to go on launch: the tabs, the broker link screen, or sign-in.
// Returns a problem instead when the server cannot be reached.
const decide = async (): Promise<Decision> => {
  const token = await loadAuthToken();
  if (!token) {
    return { href: "/welcome", problem: "" };
  }
  try {
    return { href: await routeAfterLogin(), problem: "" };
  } catch (error) {
    // A rejected token was already cleared by the API client, so sign in
    // again. Anything else (server off, no network) is not a reason to sign
    // out: the token is still good, so offer to try again.
    if (!hasAuthToken()) {
      return { href: "/welcome", problem: "" };
    }
    const message = error instanceof Error ? error.message : "Could not reach the server.";
    return { href: null, problem: message };
  }
};

// First screen on launch. Shows nothing while deciding.
export default function Index() {
  const [decision, setDecision] = useState<Decision>({ href: null, problem: "" });

  useEffect(() => {
    const start = async () => {
      setDecision(await decide());
    };
    start();
  }, []);

  if (decision.href) {
    return <Redirect href={decision.href} />;
  }

  if (decision.problem) {
    return (
      <View className="flex-1 justify-center gap-4 bg-background px-6">
        <Text className="text-lg font-bold text-foreground">Cannot reach the server</Text>
        <Text className="text-base text-muted">{decision.problem}</Text>
        <Button
          label="Try again"
          variant="solid"
          onPress={async () => {
            setDecision({ href: null, problem: "" });
            setDecision(await decide());
          }}
        />
      </View>
    );
  }

  return null;
}
