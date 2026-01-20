import { NextResponse } from "next/server";

export async function POST() {
  try {
    const res = await fetch(
      "https://apiv2.shiprocket.in/v1/external/auth/login",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: process.env.SHIPROCKET_API_EMAIL,
          password: process.env.SHIPROCKET_API_PASSWORD,
        }),
      }
    );

    const data = await res.json();

    if (!res.ok) {
      console.error("Shiprocket auth error:", data);
      return NextResponse.json(
        { error: "Shiprocket auth failed", details: data },
        { status: 401 }
      );
    }

    return NextResponse.json({ token: data.token });
  } catch (err) {
    console.error("Shiprocket auth exception:", err);
    return NextResponse.json(
      { error: "Server error" },
      { status: 500 }
    );
  }
}
