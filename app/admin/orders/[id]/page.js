import connectDB from "@/lib/db";
import Order from "@/models/Order";
import OrderStatus from "./OrderStatus";


export default async function AdminOrderDetailPage({ params }) {
  // ✅ unwrap params (Next.js 15 fix)
  const { id } = await params;

  await connectDB();

  const order = await Order.findById(id).lean();

  if (!order) {
    return (
      <p className="text-red-600 font-medium">
        Order not found
      </p>
    );
  }

  const address = order.customer?.address;

  return (
    <div className="max-w-4xl space-y-8">
      {/* HEADER */}
      <h1 className="text-3xl font-semibold">
        Order #{order._id.toString().slice(-8).toUpperCase()}
      </h1>

      {/* CUSTOMER DETAILS */}
      <div className="bg-white p-6 rounded-xl shadow">
        <h2 className="text-xl mb-4 font-medium">
          Customer Details
        </h2>

        <div className="space-y-2 text-sm">
          <p><b>Name:</b> {order.customer?.name}</p>
          <p><b>Email:</b> {order.customer?.email}</p>
          <p><b>Phone:</b> {order.customer?.phone}</p>

          {/* ADDRESS */}
          <div className="pt-3">
            <p className="font-semibold mb-1">Shipping Address</p>

            {typeof address === "string" ? (
              <p>{address}</p>
            ) : (
              <p className="text-gray-700 leading-relaxed">
                {order.customer.address?.line1},<br />
                {order.customer.address?.city},{" "}
                {order.customer.address?.state} -{" "}
                {order.customer.address?.pincode}<br />
                {order.customer.address?.country}
              </p>
            )}
          </div>
        </div>
      </div>

      {/* ITEMS */}
      <div className="bg-white p-6 rounded-xl shadow">
        <h2 className="text-xl mb-4 font-medium">Items</h2>

        <table className="w-full text-left text-sm">
          <thead>
            <tr className="border-b">
              <th className="p-2">Product</th>
              <th className="p-2">Qty</th>
              <th className="p-2">Price</th>
              <th className="p-2">Subtotal</th>
            </tr>
          </thead>

          <tbody>
            {order.items.map((item, i) => (
              <tr key={i} className="border-b">
                <td className="p-2">{item.name}</td>
                <td className="p-2">{item.quantity}</td>
                <td className="p-2">₹{item.price}</td>
                <td className="p-2">
                  ₹{item.price * item.quantity}
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className="text-right font-semibold mt-4">
          Total: ₹{order.total}
        </div>
      </div>

      {/* PAYMENT */}
      <div className="bg-white p-6 rounded-xl shadow">
        <h2 className="text-xl mb-4 font-medium">
          Payment Details
        </h2>

        <div className="space-y-2 text-sm">
          <p>
            <b>Status:</b>{" "}
            <span className="text-green-600 font-semibold">
              {order.payment?.status}
            </span>
          </p>

          <p>
            <b>Razorpay Order ID:</b><br />
            {order.payment?.razorpayOrderId}
          </p>

          <p>
            <b>Payment ID:</b><br />
            {order.payment?.razorpayPaymentId}
          </p>
        </div>
      </div>

      {/* ORDER STATUS */}
        <OrderStatus
        orderId={order._id.toString()}
        currentStatus={order.status}
        />

    </div>
  );
}
