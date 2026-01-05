"use client";

import { useState } from "react";

export default function OrderStatus({ orderId, currentStatus }) {
  const [status, setStatus] = useState(currentStatus || "pending");
  const [loading, setLoading] = useState(false);

  async function updateStatus(newStatus) {
    setLoading(true);
    setStatus(newStatus);

    const res = await fetch(`/api/admin/orders/${orderId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: newStatus }),
    });

    if (!res.ok) {
      alert("Failed to update order status");
      setStatus(currentStatus);
    }

    setLoading(false);
  }

  return (
    <div className="bg-white p-6 rounded-xl shadow">
      <h2 className="text-xl mb-4 font-medium">Order Status</h2>

      <select
        value={status}
        disabled={loading}
        onChange={(e) => updateStatus(e.target.value)}
        className="border rounded px-4 py-2 text-sm"
      >
        <option value="pending">Pending</option>
        <option value="placed">Placed</option>
        <option value="shipped">Shipped</option>
        <option value="delivered">Delivered</option>
        <option value="cancelled">Cancelled</option>
      </select>

      {loading && (
        <p className="text-xs text-gray-500 mt-2">Updating status...</p>
      )}
    </div>
  );
}
