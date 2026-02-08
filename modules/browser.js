export function detectBrowser() {
  const ua = navigator.userAgent;
  const data = navigator.userAgentData;

  // Chromium-браузеры (Chrome, Edge, Opera, etc.)
  if (data?.brands) {
    const brands = data.brands.map((b) => b.brand).join(" ");

    if (brands.includes("Google Chrome")) return "Google Chrome";
    if (brands.includes("Microsoft Edge")) return "Microsoft Edge";
    if (brands.includes("Opera")) return "Opera";
    if (brands.includes("Brave")) return "Brave";
  }

  // Firefox
  if (ua.includes("Firefox")) return "Firefox";

  // Safari (ВАЖНО: проверка после Chrome)
  if (
    ua.includes("Safari") &&
    !ua.includes("Chrome") &&
    !ua.includes("Chromium")
  ) {
    return "Safari";
  }

  // Edge старый
  if (ua.includes("Edge") || ua.includes("Edg")) {
    return "Edge";
  }

  return "Unknown";
}

console.log("Браузер:", detectBrowser());
