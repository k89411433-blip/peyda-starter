const API = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api/v1';
export async function api<T>(path: string, options: RequestInit = {}, token?: string): Promise<T> {
  const response = await fetch(`${API}${path}`, { ...options, headers: { 'Content-Type': 'application/json', ...(token ? { Authorization: `Bearer ${token}` } : {}), ...options.headers }, cache: 'no-store' });
  const payload = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(payload.message || `خطا در ارتباط با سرور (${response.status})`);
  return payload as T;
}
