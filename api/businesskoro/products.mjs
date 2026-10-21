import { verifyAdmin, getBusinessKoroProducts } from "../../lib/businesskoro.mjs";

export async function GET(request) {
  const headers = { "Cache-Control": "private, no-store" };
  try {
    const access = await verifyAdmin(request);
    if (!access.ok) return Response.json({ error: access.message }, { status: access.status, headers });
    const payload = await getBusinessKoroProducts();
    return Response.json({
      data: Array.isArray(payload?.data) ? payload.data : [],
      deliveryCharges: payload?.deliveryCharges || null
    }, { headers });
  } catch (error) {
    console.error("Business Koro product request failed:", error?.message || error);
    return Response.json({ error: error?.message || "Could not load products from Business Koro." }, { status: error?.status === 429 ? 429 : 502, headers });
  }
}
