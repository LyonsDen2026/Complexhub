const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:8000";

async function request(path, options = {}) {
  const res = await fetch(`${BASE_URL}/api${path}`, {
    headers: { "Content-Type": "application/json" },
    ...options,
  });
  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error(body.error || `Request failed: ${res.status}`);
  }
  return res.json();
}

export const api = {
  getMember: () => request("/member"),
  connectWearable: (provider) =>
    request("/member/wearables/connect", { method: "POST", body: JSON.stringify({ provider }) }),
  disconnectWearable: (provider) =>
    request("/member/wearables/disconnect", { method: "POST", body: JSON.stringify({ provider }) }),

  getMemberships: () => request("/memberships"),
  selectMembership: (tierId) =>
    request("/memberships/select", { method: "POST", body: JSON.stringify({ tierId }) }),

  getClasses: () => request("/classes"),
  getBookings: () => request("/bookings"),
  bookClass: (classId) => request("/bookings", { method: "POST", body: JSON.stringify({ classId }) }),
  cancelBooking: (id) => request(`/bookings/${id}`, { method: "DELETE" }),

  getProducts: () => request("/products"),
  getOrders: () => request("/orders"),
  checkout: (items) => request("/orders", { method: "POST", body: JSON.stringify({ items }) }),

  getWorkouts: () => request("/workouts"),
  logWorkout: (workout) => request("/workouts", { method: "POST", body: JSON.stringify(workout) }),

  getRewards: () => request("/rewards"),

  getCoaches: () => request("/coaches"),
};
