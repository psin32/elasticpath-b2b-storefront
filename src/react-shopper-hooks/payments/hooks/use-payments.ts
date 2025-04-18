import { useMutation, UseMutationOptions } from "@tanstack/react-query";
import { useElasticPath } from "../../elasticpath";
import { ConfirmPaymentResponse } from "@elasticpath/js-sdk";

export type UsePaymentsReq = {
  orderId: string;
  payment: any;
};

export const usePayments = (
  options?: UseMutationOptions<ConfirmPaymentResponse, Error, UsePaymentsReq>,
) => {
  const { client } = useElasticPath();
  return useMutation({
    mutationFn: async ({ orderId, payment }: UsePaymentsReq) => {
      return client.Orders.Payment(orderId, payment);
    },
    ...options,
  });
};
