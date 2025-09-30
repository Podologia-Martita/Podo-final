// src/utils/hours.js

/**
 * Genera un array de horas disponibles en formato "HH:MM"
 * @param {string} start - hora de inicio, ej: "10:00"
 * @param {string} end - hora de fin, ej: "18:00"
 * @param {number} stepMinutes - intervalo en minutos, normalmente 60
 * @returns {string[]} array de horas, ej: ["10:00", "11:00", "12:00", ...]
 */
export function generateAvailableHours(start = "10:00", end = "18:00", stepMinutes = 60) {
  const hours = [];
  let [hour, minute] = start.split(":").map(Number);
  const [endHour, endMinute] = end.split(":").map(Number);

  while (hour < endHour || (hour === endHour && minute < endMinute)) {
    const hh = String(hour).padStart(2, "0");
    const mm = String(minute).padStart(2, "0");
    hours.push(`${hh}:${mm}`);

    minute += stepMinutes;
    if (minute >= 60) {
      hour += Math.floor(minute / 60);
      minute = minute % 60;
    }
  }

  return hours;
}
