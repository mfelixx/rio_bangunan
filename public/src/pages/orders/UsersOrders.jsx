import toast from "react-hot-toast";
import { useGetMyOrdersQuery } from "../../redux/api/apiSlice";
import moment from "moment";

const UsersOrders = () => {
  function formatHarga(harga) {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(harga);
  }

  moment.locale("id");
  const { data: orders, isLoading, error } = useGetMyOrdersQuery();

  return (
    <div className="container mx-auto">
      <h2 className="text-2xl font-semibold mb-2">
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
                      <p className="text-red-500 italic p-1 w-[6rem]">
                        Pending
                      </p>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </h2>
    </div>
  );
};

export default UsersOrders;
