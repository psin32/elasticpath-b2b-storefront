"use client";
import React, { useState } from "react";
import { PaymentElement } from "@stripe/react-stripe-js";
import { ChevronDownIcon, ChevronUpIcon } from "@heroicons/react/20/solid";

export function PaymentForm() {
  const [openTab, setOpenTab] = useState(1);
  const toggleTab = (tab: number) => {
    setOpenTab(openTab === tab ? 0 : tab);
  };

  const plpView = process.env.NEXT_PUBLIC_DEFAULT_PLP_VIEW || "grid";

  return (
    <fieldset className="flex flex-col gap-6 self-stretch">
      <div>
        <legend className="text-2xl font-medium">Payment</legend>
      </div>
      <div className="w-full mx-auto mt-2">
        <div className="space-y-4">
          <div className="border rounded-lg overflow-hidden shadow-md">
            <div
              className="cursor-pointer p-4 flex justify-between items-center bg-white hover:bg-gray-50 transition"
              onClick={() => toggleTab(1)}
            >
              <h2 className="text-lg font-medium text-gray-800">
                Card Payment
              </h2>
              {openTab === 1 ? (
                <ChevronUpIcon className="h-5 w-5 text-gray-800" />
              ) : (
                <ChevronDownIcon className="h-5 w-5 text-gray-800" />
              )}
            </div>
            {openTab === 1 && (
              <PaymentElement id="payment-element" className="p-4 bg-gray-50" />
            )}
          </div>

          {/* <div className="border rounded-lg overflow-hidden shadow-md">
            <div
              className="cursor-pointer p-4 flex justify-between items-center bg-white hover:bg-gray-50 transition"
              onClick={() => toggleTab(2)}
            >
              <h2 className="text-lg font-medium text-gray-800">PayPal</h2>
              {openTab === 2 ? (
                <ChevronUpIcon className="h-5 w-5 text-gray-800" />
              ) : (
                <ChevronDownIcon className="h-5 w-5 text-gray-800" />
              )}
            </div>
            {openTab === 2 && (
              <div className="p-4 bg-gray-50">
                <p className="text-sm">
                  You will be redirected to PayPal to complete your payment.
                </p>
                <button className="mt-4 px-4 py-2 bg-yellow-500 text-white rounded-md hover:bg-yellow-600 transition">
                  Pay with PayPal
                </button>
              </div>
            )}
          </div> */}
          {plpView === "list" && (
            <div className="border rounded-lg overflow-hidden shadow-md">
              <div
                className="cursor-pointer p-4 flex justify-between items-center bg-white hover:bg-gray-50 transition"
                onClick={() => toggleTab(3)}
              >
                <h2 className="text-lg font-medium text-gray-800">
                  Purchase Order
                </h2>
                {openTab === 3 ? (
                  <ChevronUpIcon className="h-5 w-5 text-gray-800" />
                ) : (
                  <ChevronDownIcon className="h-5 w-5 text-gray-800" />
                )}
              </div>
              {openTab === 3 && (
                <div className="p-4 bg-gray-50">
                  <form>
                    <div className="mb-4">
                      <label className="block text-sm font-medium text-gray-700">
                        Purchase Order Number
                      </label>
                      <input
                        type="text"
                        className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
                      />
                    </div>
                    {/* <button
                    type="submit"
                    className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition"
                  >
                    Submit
                  </button> */}
                  </form>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </fieldset>
  );
}
