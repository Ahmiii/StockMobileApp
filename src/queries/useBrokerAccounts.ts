import { getBrokerAccounts } from "@/apis/auth";
import { useQuery } from "@tanstack/react-query";

export const useBrokerAccounts = () =>
  useQuery({
    queryKey: ["brokerAccounts"],
    queryFn: getBrokerAccounts,
  });
