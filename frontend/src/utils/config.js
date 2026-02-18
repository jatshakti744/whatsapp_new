export const base_url =
  window.location.hostname === "localhost"
    ? "http://localhost:5000/"
    : `${window.location.origin}/backend/`;
export const live_url = "https://bulkwhatsapp.tradestreet.in/backend/";
export const socket_url = "https://apiwhatsapp.tradestreet.in:1001";
