import Card from "@/atoms/Card";
import Skeleton from "@/atoms/Skeleton";
import { View } from "react-native";

// Same shapes as the loaded Portfolio screen, in grey: summary, range chips,
// performance card, the two stat cards, and three holding rows.
const PortfolioSkeleton = () => (
  <View className="gap-2">
    {/* Summary */}
    <View className="gap-2">
      <Skeleton className="mt-1 h-9 w-44" />
      <Skeleton className="h-7 w-36 rounded-full" />
    </View>

    {/* Range chips */}
    <View className="flex-row gap-2">
      <Skeleton className="h-11 w-14 rounded-xl" />
      <Skeleton className="h-11 w-14 rounded-xl" />
      <Skeleton className="h-11 w-14 rounded-xl" />
      <Skeleton className="h-11 w-14 rounded-xl" />
      <Skeleton className="h-11 w-14 rounded-xl" />
    </View>

    {/* Performance card */}
    <Card bordered className="gap-5">
      <View className="flex-row justify-between">
        <Skeleton className="h-4 w-24" />
        <Skeleton className="h-4 w-12" />
      </View>
      <Skeleton className="h-[120px] w-full" />
      <View className="flex-row justify-between">
        <Skeleton className="h-3 w-32" />
        <Skeleton className="h-3 w-24" />
      </View>
    </Card>

    {/* Invested / P&L */}
    <View className="flex-row gap-2">
      <Card bordered className="grow gap-2">
        <Skeleton className="h-3 w-16" />
        <Skeleton className="h-6 w-24" />
      </Card>
      <Card bordered className="grow gap-2">
        <Skeleton className="h-3 w-24" />
        <Skeleton className="h-6 w-24" />
      </Card>
    </View>

    {/* Holdings */}
    <View className="gap-2">
      <Skeleton className="h-4 w-20" />
      {[0, 1, 2].map((row) => (
        <Card key={row} bordered>
          <View className="flex-row items-center gap-4">
            <View className="gap-1.5">
              <Skeleton className="h-4 w-12" />
              <Skeleton className="h-3 w-16" />
            </View>
            <Skeleton className="h-7 flex-1" />
            <View className="items-end gap-1.5">
              <Skeleton className="h-4 w-20" />
              <Skeleton className="h-3 w-14" />
            </View>
          </View>
        </Card>
      ))}
    </View>
  </View>
);

export default PortfolioSkeleton;
