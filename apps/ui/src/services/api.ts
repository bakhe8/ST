// Centralized API base URL for dynamic port detection
// Uses VITE_API_URL if set, otherwise falls back to window.location.origin + '/api'

export const API_BASE_URL =
  import.meta.env.VITE_API_URL || `${window.location.origin}/api`;

export function apiUrl(path: string) {
  // Ensure no double slashes
  if (path.startsWith('/')) path = path.slice(1);
  return `${API_BASE_URL}/${path}`;
}
