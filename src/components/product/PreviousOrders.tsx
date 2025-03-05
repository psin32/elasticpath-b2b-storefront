import { useState, useEffect } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { Fragment } from "react";
import { getPurchaseHistoryByProductIdAndAccountId } from "../../services/custom-api";
import { Button } from "../button/Button";
import moment from "moment";

interface Order {
  date: string;
  quantity: number;
}

interface PreviousOrdersProps {
  productId: string;
}

export default function PreviousOrders({ productId }: PreviousOrdersProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchOrders() {
      try {
        setLoading(true);
        setOrders([]);
        const response =
          await getPurchaseHistoryByProductIdAndAccountId(productId);
        setOrders(response?.data);
        setLoading(false);
      } catch (error) {
        console.error("Failed to fetch orders", error);
      }
    }
    fetchOrders();
  }, [productId, isOpen]);

  return (
    <div>
      <Button
        onClick={(event) => {
          event.preventDefault();
          setIsOpen(true);
        }}
        variant="link"
        className="m-0 mb-4 p-0 text-md text-brand-primary underline"
      >
        Check Previous Orders
      </Button>
      <Transition show={isOpen} as={Fragment}>
        <Dialog
          as="div"
          className="fixed inset-0 z-50 overflow-hidden"
          onClose={() => setIsOpen(false)}
        >
          <div className="fixed inset-0 bg-black bg-opacity-30" />
          <div className="fixed inset-y-0 right-0 flex max-w-lg w-full p-6 bg-white shadow-lg">
            <div className="w-full">
              <Dialog.Title className="text-lg font-bold mb-4">
                Previous Orders
              </Dialog.Title>
              {!loading && orders.length > 0 && (
                <table className="w-full border-collapse border border-gray-300">
                  <thead>
                    <tr className="bg-gray-200">
                      <th className="border border-gray-300 px-4 py-2">
                        Purchase Date
                      </th>
                      <th className="border border-gray-300 px-4 py-2">
                        Quantity
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {orders.map((order: any, index) => (
                      <tr key={index} className="border border-gray-300">
                        <td className="border border-gray-300 px-4 py-2">
                          {moment(
                            order.meta.timestamps.created_at,
                            moment.ISO_8601,
                            true,
                          ).format("DD MMM YYYY HH:mm:ss")}
                        </td>
                        <td className="border border-gray-300 px-4 py-2">
                          {order.quantity}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
              {!loading && orders.length === 0 && (
                <p className="text-gray-500">No previous orders found.</p>
              )}
              {loading && <p className="text-gray-500">Loading....</p>}
              <Button className="mt-4 w-full" onClick={() => setIsOpen(false)}>
                Close
              </Button>
            </div>
          </div>
        </Dialog>
      </Transition>
    </div>
  );
}
