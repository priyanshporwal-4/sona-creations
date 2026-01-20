import connectDB from "@/lib/db";
import Order from "@/models/Order";

export const revalidate = 0;

export default async function AdminOrdersPage() {
  await connectDB();

  const orders = await Order.find({})
    .sort({ createdAt: -1 })
    .lean();

  // ✅ STATUS BADGE STYLES (EDIT IS HERE)
  const getStatusStyle = (status = "pending") => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-700";
      case "processing":
        return "bg-blue-100 text-blue-700";
      case "shipped":
        return "bg-purple-100 text-purple-700";
      case "delivered":
        return "bg-green-100 text-green-700";
      case "cancelled":
        return "bg-red-100 text-red-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  return (
    <div>
      <h1 className="text-3xl font-semibold mb-6">Orders</h1>

      <div className="bg-white rounded-xl shadow overflow-hidden">
        <table className="w-full text-left text-sm">
          <thead className="bg-gray-50 border-b">
            <tr>
              <th className="p-4">Order ID</th>
              <th className="p-4">Customer</th>
              <th className="p-4">Total</th>
              <th className="p-4">Payment</th>
              <th className="p-4">Date</th>
              <th className="p-4">Status</th>
            </tr>
          </thead>

          <tbody>
            {orders.map((order) => {
              const status = order.status || "pending";

              return (
                <tr
                  key={order._id.toString()}
                  className="border-t hover:bg-gray-50 transition"
                >
                  <td className="p-4 text-blue-600 font-medium">
                    <a
                      href={`/admin/orders/${order._id}`}
                      className="hover:underline"
                    >
                      {order._id.toString().slice(-8).toUpperCase()}
                    </a>
                  </td>

                  <td className="p-4">{order.customer?.name || "—"}</td>

                  <td className="p-4 font-medium">₹{order.total || 0}</td>

                  <td className="p-4">
                    <span className="px-3 py-1 rounded-full bg-green-100 text-green-700 text-xs font-semibold">
                      Paid
                    </span>
                  </td>

                  <td className="p-4 text-gray-600">
                    {new Date(order.createdAt).toLocaleDateString()}
                  </td>

                  {/* ✅ STATUS BADGE */}
                  <td className="p-4">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-semibold capitalize ${getStatusStyle(
                        status
                      )}`}
                    >
                      {status}
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
