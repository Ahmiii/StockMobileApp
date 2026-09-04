import { linkBrokerAccount, login } from "@/apis/auth";
import { useMutation } from "@tanstack/react-query";

export const useLogin = () =>
  useMutation({
    mutationFn: login,
    retry: false,
  });

export const useLinkBroker = () =>
  useMutation({
    mutationFn: linkBrokerAccount,
    retry: false,
  });
