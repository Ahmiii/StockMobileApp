import Label from "@/atoms/Label";
import AppFooter from "@/molecules/AppFooter";
import BrokerCard from "@/organisms/BrokerCard";
import ProfileCard from "@/organisms/ProfileCard";
import SettingsList from "@/organisms/SettingsList";
import Screen from "@/templates/Screen";

const Settings = () => (
  <Screen className="gap-4">
    <Label size="lg" color="foreground">
      Settings
    </Label>

    <ProfileCard name="A. Raza" email="a.raza@landscaling.com" />

    <BrokerCard
      name="AHL eTrade"
      clientId="14203-8"
      lastSynced="just now"
      linked
    />

    <SettingsList currency="PKR" />

    <AppFooter
      lines={["Market data · Arif Habib  |  Trades · AHL eTrade", "Crest 1.0 · PSX · PKR"]}
    />
  </Screen>
);

export default Settings;
