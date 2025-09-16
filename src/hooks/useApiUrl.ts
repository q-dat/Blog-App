/**
 * Tạo full API URL không cần dùng biến môi trường
 * @param endpoint Đường dẫn API (VD: `/api/post`)
 */
export function getServerApiUrl(endpoint: string) {
  if (typeof window !== 'undefined') {
    // client side: dùng domain hiện tại
    return `${window.location.origin}${endpoint}`;
  }

  // server side: chạy trên Vercel hoặc local
  const vercelUrl = process.env.VERCEL_URL;
  if (vercelUrl) {
    return `https://${vercelUrl}${endpoint}`;
  }

  // fallback khi local dev
  return `http://localhost:3000${endpoint}`;
}
