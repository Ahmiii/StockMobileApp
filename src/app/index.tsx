import { routeAfterLogin } from "@/apis/auth";
import { loadAuthToken } from "@/apis/client";
import { Redirect, type Href } from "expo-router";
import { useEffect, useState } from "react";

// First screen on launch. Restores the saved token, then goes to the tabs,
// to the broker link screen, or to sign-in. Shows nothing while deciding.
export default function Index() {
  const [href, setHref] = useState<Href | null>(null);

  useEffect(() => {
    const decide = async () => {
      try {
        const token = await loadAuthToken();
        setHref(token ? await routeAfterLogin() : "/welcome");
      } catch {
        setHref("/welcome");
      }
    };
    decide();
  }, []);

  return href ? <Redirect href={href} /> : null;
}
