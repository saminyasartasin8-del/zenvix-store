const SUPABASE_URL = "https://rqcjdmphaafnfblkyatm.supabase.co";
const SUPABASE_KEY = "sb_publishable__bAyNlDi1_1b70ezax5ksA_OS17CIuV";
const BUSINESSKORO_BASE_URL = "https://api.businesskoro.com/api/v1/storefront";
const BUSINESSKORO_DOMAIN = "zenvix-store-pi.vercel.app";

export async function verifyAdmin(request) {
  const authorization = String(request.headers.get("authorization") || "");
  const token = authorization.match(/^Bearer\s+(.+)$/i)?.[1];
  if (!token) return { ok: false, status: 401, message: "Sign in as an admin to continue." };

  const authResponse = await fetch(`${SUPABASE_URL}/auth/v1/user`, {
    headers: { apikey: SUPABASE_KEY, Authorization: `Bearer ${token}` }
  });
  if (!authResponse.ok) {
    const authError = await authResponse.json().catch(() => ({}));
    const reason = String(authError?.msg || authError?.message || authError?.error_description || "").replace(/[\r\n]+/g, " ").slice(0, 180);
    // Log only the upstream status and safe error text. Never log the API key or bearer token.
    console.error("Supabase admin session verification failed:", { status: authResponse.status, reason });
    const message = authResponse.status === 401
      ? `Supabase rejected the admin session${reason ? ` (${reason})` : ""}. Sign in again and retry.`
      : "Could not verify the admin session with Supabase. Try again later.";
    return { ok: false, status: authResponse.status === 401 ? 401 : 502, message };
  }
  const user = await authResponse.json();
  if (!user?.id) return { ok: false, status: 401, message: "Sign in as an admin to continue." };

  const adminResponse = await fetch(`${SUPABASE_URL}/rest/v1/zenvix_admin_users?user_id=eq.${encodeURIComponent(user.id)}&select=user_id`, {
    headers: { apikey: SUPABASE_KEY, Authorization: `Bearer ${token}` }
  });
  if (!adminResponse.ok) return { ok: false, status: 503, message: "Could not verify admin access." };
  const adminRows = await adminResponse.json();
  if (!Array.isArray(adminRows) || adminRows.length === 0) return { ok: false, status: 403, message: "Admin access is required." };
  return { ok: true, user };
}

export async function getBusinessKoroProducts() {
  const key = process.env.BUSINESSKORO_API_KEY;
  if (!key) throw new Error("Business Koro API key is missing from Vercel Environment Variables.");
  const response = await fetch(`${BUSINESSKORO_BASE_URL}/products`, {
    headers: {
      "x-api-key": key,
      "Content-Type": "application/json",
      "x-domain": BUSINESSKORO_DOMAIN
    }
  });
  const payload = await response.json().catch(() => ({}));
  if (!response.ok) {
    const message = payload?.message || payload?.error || `Business Koro returned status ${response.status}.`;
    const error = new Error(message);
    error.status = response.status;
    throw error;
  }
  return payload;
}
