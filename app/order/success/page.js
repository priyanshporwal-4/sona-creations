export default async function OrderSuccessPage({ searchParams }) {
  const { orderId } = await searchParams;

  return (
    <div className="min-h-screen flex items-center justify-center bg-ivory px-4">
      <div className="bg-white p-10 rounded-xl shadow max-w-md text-center">
        <h1 className="text-3xl text-green-600 mb-4">Payment Successful 🎉</h1>

        <p className="mb-4">Your order has been placed successfully.</p>

        {orderId ? (
          <p className="font-semibold">
            Order ID: #{orderId.slice(-8).toUpperCase()}
          </p>
        ) : (
          <p className="text-red-500">Order ID not found</p>
        )}
      </div>
    </div>
  );
}
