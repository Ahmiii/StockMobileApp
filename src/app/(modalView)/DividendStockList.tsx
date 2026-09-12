import Skeleton from "@/atoms/Skeleton";
import DividendStockList from "@/organisms/DividendStockList";
import { useDividends, usePortfolioId } from "@/queries/usePortfolios";
import { Text, View } from "react-native";

// Modal listing what each stock has paid. The layout already pads the safe
// area, and the list is the only scroller, so no Screen wrapper here.
const DividendStockListScreen = () => {
  const { data, isPending, error } = useDividends(usePortfolioId());
  console.log({ data });
  if (isPending) {
    return (
      <View className="gap-3">
        <Skeleton className="h-9 w-48" />
        <Skeleton className="h-16 w-full rounded-2xl" />
        <Skeleton className="h-16 w-full rounded-2xl" />
        <Skeleton className="h-16 w-full rounded-2xl" />
      </View>
    );
  }

  if (error) {
    return <Text className="text-danger">{error.message}</Text>;
  }

  return <DividendStockList dividends={data?.dividends} items={data.byStock} />;
};

export default DividendStockListScreen;
