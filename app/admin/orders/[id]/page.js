import connectDB from "@/lib/db";
import Order from "@/models/Order";
import OrderStatus from "./OrderStatus";
import CreateShipmentButton from "./CreateShipmentButton";

export default async function AdminOrderDetailPage({ params }) {
  const { id } = await params;

  await connectDB();

  const order = await Order.findById(id).lean();

  if (!order) {
    return <p className="text-red-600 font-medium">Order not found</p>;
  }

  const address = order.customer?.address;
  const shipmentCreated = Boolean(order.shipment?.awb);

  return (
    <div className="max-w-4xl space-y-8">
      {/* HEADER */}
      <h1 className="text-3xl font-semibold">
        Order #{order._id.toString().slice(-8).toUpperCase()}
      </h1>

      {/* CUSTOMER DETAILS */}
      <div className="bg-white p-6 rounded-xl shadow">
        <h2 className="text-xl mb-4 font-medium">Customer Details</h2>

        <div className="space-y-2 text-sm">
          <p><b>Name:</b> {order.customer?.name}</p>
          <p><b>Email:</b> {order.customer?.email}</p>
          <p><b>Phone:</b> {order.customer?.phone}</p>

          <div className="pt-3">
            <p className="font-semibold mb-1">Shipping Address</p>

            {typeof address === "string" ? (
              <p>{address}</p>
            ) : (
              <p className="text-gray-700 leading-relaxed">
                {order.customer.address?.line1},<br />
                {order.customer.address?.city},{" "}
                {order.customer.address?.state} -{" "}
                {order.customer.address?.pincode}
                <br />
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
        <h2 className="text-xl mb-4 font-medium">Payment Details</h2>

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

          {/* 🔽 DOWNLOAD INVOICE (NEW) */}
          {order.payment?.status === "paid" && (
            <a
              href={`/api/admin/orders/${order._id}/invoice`}
              target="_blank"
              className="inline-block mt-4 px-4 py-2 bg-gray-900 text-white text-sm rounded hover:bg-gray-800"
            >
              Download Invoice
            </a>
          )}
        </div>
      </div>

      {/* ORDER STATUS + SHIPMENT */}
      <div className="bg-white p-6 rounded-xl shadow space-y-4">
        <OrderStatus
          orderId={order._id.toString()}
          currentStatus={order.status}
        />

        {shipmentCreated ? (
          <div className="text-sm space-y-1">
            <p><b>AWB:</b> {order.shipment.awb}</p>
            <p><b>Courier:</b> {order.shipment.courier}</p>

            {order.shipment.trackingUrl && (
              <a
                href={order.shipment.trackingUrl}
                target="_blank"
                className="inline-block mt-2 text-blue-600 hover:underline"
              >
                Track Shipment →
              </a>
            )}
          </div>
        ) : (
          order.payment?.status === "paid" && (
            <CreateShipmentButton orderId={order._id.toString()} />
          )
        )}
      </div>
    </div>
  );
}
