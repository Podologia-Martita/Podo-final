// src/utils/hours.js

/**
 * Genera un arreglo de horas en formato HH:MM
 * @param {string} start - hora inicial ("10:00")
 * @param {string} end - hora final ("18:00")
 * @param {number} stepMinutes - intervalo en minutos (ej: 60)
 * @returns {string[]} Ejemplo: ["10:00", "11:00", ..., "18:00"]
 */
export function generateAvailableHours(start, end, stepMinutes = 60) {
  const slots = [];

  // Convertir HH:MM a minutos desde medianoche
  const toMinutes = (time) => {
    const [h, m] = time.split(":").map(Number);
    return h * 60 + m;
  };

  const startMinutes = toMinutes(start);
  const endMinutes = toMinutes(end);

  for (let t = startMinutes; t <= endMinutes; t += stepMinutes) {
    const h = Math.floor(t / 60).toString().padStart(2, "0");
    const m = (t % 60).toString().padStart(2, "0");
    slots.push(`${h}:${m}`);
  }

  return slots;
}
