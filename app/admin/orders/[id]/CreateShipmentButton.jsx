"use client";

export default function CreateShipmentButton({ orderId }) {
  async function handleCreateShipment() {
    try {
      const res = await fetch("/api/shiprocket/create-shipment", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ orderId }),
      });

      const data = await res.json();

      if (!res.ok) {
        alert(data.error || "Failed to create shipment");
        return;
      }

      alert("Shipment created successfully 🚚");
      location.reload(); // refresh admin page
    } catch (err) {
      alert("Something went wrong");
    }
  }

  return (
    <button
      onClick={handleCreateShipment}
      className="bg-black text-white px-4 py-2 rounded hover:bg-gray-800"
    >
      Create Shipment
    </button>
  );
}
