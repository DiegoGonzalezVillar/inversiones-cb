const API_URL = import.meta.env.VITE_API_URL;

export async function apiFetch(path, options = {}) {
  const token = localStorage.getItem("token");

  const res = await fetch(API_URL + path, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(options.headers || {}),
    },
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(text || "Error en la API");
  }

  // si es respuesta vacía
  const contentType = res.headers.get("content-type") || "";
  if (!contentType.includes("application/json")) return await res.text();

  return await res.json();
}
