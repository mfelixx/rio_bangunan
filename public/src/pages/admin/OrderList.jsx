import { useGetAllOrdersQuery } from "../../redux/api/apiSlice";
import { useDeliverOrderMutation } from "../../redux/api/apiSlice";
import AdminMenu from "./AdminMenu";
import toast from "react-hot-toast";
import moment from "moment";
import { useEffect } from "react";
import { FaCheck } from "react-icons/fa";

const OrderList = () => {
  function formatHarga(harga) {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(harga);
  }

  moment.locale("id");

  const { data: orders, isLoading, error, refetch } = useGetAllOrdersQuery();
  const [deliverOrder] = useDeliverOrderMutation();

  useEffect(() => {
    refetch();
  }, [refetch]);

  const deliveredHandler = async (id) => {
    try {
      await deliverOrder(id);
      toast.success("Order delivered successfully");
    } catch (error) {
      toast.error(error.data?.error || error.message || "Order not delivered");
    }
  };
  return (
    <div className="container mx-auto">
      <AdminMenu />
      {isLoading ? (
        <div className="loader2 absolute top-1/2 left-1/2"></div>
      ) : error ? (
        toast.error(error.data?.error || error.message || "Terjadi error")
      ) : (
        <table className="table-auto border-separate border border-slate-500">
          <thead>
            <tr className="bg-slate-400 text-white">
              <th className="py-2 border border-slate-600">IMAGE</th>
              <th className="py-2 border border-slate-600">ID</th>
              <th className="py-2 border border-slate-600">DATE</th>
              <th className="py-2 border border-slate-600">TOTAL</th>
              <th className="py-2 border border-slate-600">PAID</th>
              <th className="py-2 border border-slate-600">DELIVERED</th>
              <th className="py-2 border border-slate-600">MARK DELIVERED</th>
            </tr>
          </thead>

          <tbody>
            {orders?.map((order) => (
              <tr key={order._id} className="bg-slate-100 text-center">
                <td className="px-5 py-2 mx-5 border border-slate-600">
                  <img
                    src={order?.orderItems[0].image}
                    alt={order?.orderItems[0].name}
                    className="w-[6rem] mb-4"
                  />
                </td>
                <td className="px-5 py-2 border border-slate-600">
                  {order._id}
                </td>
                <td className="py-2 px-5 border border-slate-600">
                  {moment.tz(order.createdAt, "Asia/Jakarta").format("LL")}
                </td>
                <td className="py-2 px-5 border border-slate-600">
                  {formatHarga(order.totalPrice)}
                </td>
                <td className="py-2 px-5 border border-slate-600">
                  {order.isPaid ? (
                    <p className="text-green-500 p-1 w-[6rem] italic">
                      Success
                    </p>
                  ) : (
                    <p className="text-red-500 p-1 w-[6rem] italic">Failed</p>
                  )}
                </td>
                <td className="py-2 px-5 border border-slate-600">
                  {order.isDelivered ? (
                    <p className="text-green-500 p-1 w-[6rem] italic">
                      Success
                    </p>
                  ) : (
                    <p className="text-red-500 italic p-1 w-[6rem]">Pending</p>
                  )}
                </td>
                <td className="py-2 px-5 border border-slate-600">
                  {!order.isDelivered ? (
                    <button
                      className=" text-blue-500 hover:underline font-bold py-2 px-4 rounded"
                      onClick={() => deliveredHandler(order._id)}
                    >
                      Mark Delivered?
                    </button>
                  ) : (
                    <FaCheck className="" />
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default OrderList;
