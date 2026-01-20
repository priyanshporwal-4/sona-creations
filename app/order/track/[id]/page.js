import connectDB from "@/lib/db";
import Order from "@/models/Order";

export default async function OrderTrackingPage({ params }) {
  const { id } = await params;

  await connectDB();

  const order = await Order.findById(id).lean();

  if (!order) {
    return (
      <div className="max-w-xl mx-auto py-20 text-center">
        <h1 className="text-2xl font-semibold mb-4">
          Order not found
        </h1>
        <p className="text-gray-600">
          Please check your tracking link.
        </p>
      </div>
    );
  }

  const shipment = order.shipment;

  return (
    <div className="max-w-xl mx-auto py-20 px-6">
      <h1 className="text-3xl font-semibold mb-8 text-center">
        Order Tracking
      </h1>

      {/* ORDER INFO */}
      <div className="bg-white rounded-xl shadow p-6 mb-6">
        <p className="text-sm text-gray-600 mb-1">Order ID</p>
        <p className="font-medium mb-4">
          #{order._id.toString().slice(-8).toUpperCase()}
        </p>

        <p className="text-sm text-gray-600 mb-1">Order Status</p>
        <p className="font-semibold capitalize">
          {order.status}
        </p>
      </div>

      {/* SHIPMENT INFO */}
      {shipment?.awb ? (
        <div className="bg-white rounded-xl shadow p-6">
          <h2 className="text-lg font-semibold mb-4">
            Shipment Details
          </h2>

          <div className="space-y-2 text-sm">
            <p>
              <b>Courier:</b> {shipment.courier}
            </p>
            <p>
              <b>AWB:</b> {shipment.awb}
            </p>

            {shipment.trackingUrl && (
              <a
                href={shipment.trackingUrl}
                target="_blank"
                className="inline-block mt-4 text-blue-600 hover:underline"
              >
                Track on Courier Website →
              </a>
            )}
          </div>
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow p-6 text-center">
          <p className="text-gray-600">
            Your order has not been shipped yet.
          </p>
        </div>
      )}
    </div>
  );
}
