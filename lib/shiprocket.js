let shiprocketToken = null;
let tokenExpiry = null;

export async function getShiprocketToken() {
  if (shiprocketToken && tokenExpiry > Date.now()) {
    return shiprocketToken;
  }

  const res = await fetch("https://apiv2.shiprocket.in/v1/external/auth/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      email: process.env.SHIPROCKET_API_EMAIL,
      password: process.env.SHIPROCKET_API_PASSWORD,
    }),
  });

  const data = await res.json();

  shiprocketToken = data.token;
  tokenExpiry = Date.now() + 9 * 24 * 60 * 60 * 1000; // ~9 days

  return shiprocketToken;
}
