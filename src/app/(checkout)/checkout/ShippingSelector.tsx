"use client";
import { useAuthedAccountMember } from "../../../react-shopper-hooks";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../../components/select/Select";
import { useFormContext } from "react-hook-form";
import { CheckoutForm as CheckoutFormSchemaType } from "../../../components/checkout/form-schema/checkout-form-schema";
import { AccountAddress } from "@elasticpath/js-sdk";
import { useEffect, useState } from "react";
import { Skeleton } from "../../../components/skeleton/Skeleton";
import { Button } from "../../../components/button/Button";
import Link from "next/link";
import { getEpccImplicitClient } from "../../../lib/epcc-implicit-client";

export function ShippingSelector() {
  const [accountAddresses, setAccountAddresses] = useState<any>();
  const [selectedAddressId, setSelectedAddressId] = useState<string>("");
  const { selectedAccountToken } = useAuthedAccountMember();

  const client = getEpccImplicitClient();

  const { setValue, getValues } = useFormContext<CheckoutFormSchemaType>();

  function updateAddress(addressId: string, addresses: AccountAddress[]) {
    const address = addresses.find((address) => address.id === addressId);
    if (address) {
      const shippingAddress = {
        postcode: address.postcode,
        line_1: address.line_1,
        line_2: address.line_2,
        city: address.city,
        county: address.county,
        country: address.country,
        company_name: address.company_name,
        first_name: address.first_name,
        last_name: address.last_name,
        phone_number: address.phone_number,
        instructions: address.instructions,
        region: address.region || "",
      };
      setValue("shippingAddress", shippingAddress);
    }
  }

  useEffect(() => {
    const init = async () => {
      if (selectedAccountToken?.account_id) {
        try {
          const addresses = await client.AccountAddresses.All({
            account: selectedAccountToken.account_id,
          });
          if (addresses?.data?.length > 0) {
            setAccountAddresses(addresses.data);
            setSelectedAddressId(addresses.data[0].id);
            updateAddress(addresses.data[0].id, addresses.data);
          } else {
            setAccountAddresses([]);
            setSelectedAddressId("");
          }
        } catch (error) {
          console.error("Error fetching addresses:", error);
          setAccountAddresses([]);
          setSelectedAddressId("");
        }
      } else {
        setAccountAddresses([]);
        setSelectedAddressId("");
      }
    };
    init();
  }, [selectedAccountToken?.account_id]);

  const handleSelectChange = (value: string) => {
    setSelectedAddressId(value);
    updateAddress(value, accountAddresses ?? []);
  };

  return (
    <div>
      {accountAddresses ? (
        <Select value={selectedAddressId} onValueChange={handleSelectChange}>
          <SelectTrigger className="p-5">
            <SelectValue placeholder="Select address" />
          </SelectTrigger>
          <SelectContent>
            {accountAddresses?.map((address: any) => (
              <SelectItem key={address.id} value={address.id} className="py-5">
                <div className="flex flex-col items-start gap-2">
                  <span>{address.name}</span>
                  <span className="text-sm text-black/60">
                    {`${address.line_1}, ${address.city}, ${address.postcode}`}
                  </span>
                </div>
              </SelectItem>
            ))}
            <Button
              variant="link"
              asChild
              className="text-base font-normal"
              type="button"
            >
              <Link href="/account/addresses">Add new...</Link>
            </Button>
          </SelectContent>
        </Select>
      ) : (
        <Skeleton className="w-full h-20" />
      )}
    </div>
  );
}
