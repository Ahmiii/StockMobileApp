import Button from "@/atoms/Button";
import Card from "@/atoms/Card";
import Dot from "@/atoms/Dot";
import { Text, View } from "react-native";

type Props = {
  name: string; // "AHL eTrade"
  clientId: string; // "14203-8"
  lastSynced: string; // "just now"
  linked: boolean;
  onSync?: () => void;
};

const BrokerCard = ({ name, clientId, lastSynced, linked, onSync }: Props) => (
  <Card bordered className="gap-4">
    <View className="flex-row items-center justify-between gap-3">
      <View className="flex-1">
        <Text className="text-2xl font-bold text-foreground">{name}</Text>
        <Text className="text-base text-muted">
          Client {clientId} · Last synced {lastSynced}
        </Text>
      </View>

      <View className="flex-row items-center gap-2">
        <Dot tone={linked ? "success" : "danger"} />
        <Text
          className={`text-base font-semibold ${linked ? "text-success" : "text-danger"}`}
        >
          {linked ? "Linked" : "Not linked"}
        </Text>
      </View>
    </View>

    <Button label="Sync now" onPress={onSync} />
  </Card>
);

export default BrokerCard;
