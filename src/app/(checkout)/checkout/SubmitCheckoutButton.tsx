"use client";

import { useCheckout } from "./checkout-provider";
import { useCart } from "../../../react-shopper-hooks";
import { StatusButton } from "../../../components/button/StatusButton";

type SubmitCheckoutButtonProps = {
  cart?: any;
};

export function SubmitCheckoutButton({ cart }: SubmitCheckoutButtonProps) {
  const { handleSubmit, completePayment, isCompleting } = useCheckout();
  const { state } = useCart();

  const { meta } = cart?.data ? cart?.data : (state as any);

  if (!state) {
    return null;
  }

  return (
    <StatusButton
      type="button"
      className="w-full h-16"
      status={isCompleting ? "loading" : "idle"}
      onClick={handleSubmit((values) => {
        completePayment.mutate({ data: values });
      })}
    >
      {`Pay ${meta?.display_price?.with_tax?.formatted}`}
    </StatusButton>
  );
}
