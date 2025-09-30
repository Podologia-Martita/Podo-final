// src/components/TimeSelect.jsx
import { useState, useEffect } from "react";
import { generateAvailableHours } from "../utils/hours";

/**
 * Componente para mostrar y seleccionar horas disponibles
 * Props:
 * - serviceDuration: duración del servicio en minutos (opcional)
 * - bookedHours: array de horas ya reservadas, ej: ["10:00", "13:00"]
 * - onSelect: función que recibe la hora seleccionada
 */
export default function TimeSelect({ serviceDuration, bookedHours = [], onSelect }) {
  const [availableHours, setAvailableHours] = useState([]);
  const [selectedHour, setSelectedHour] = useState("");

  useEffect(() => {
    // Generar todas las horas entre 10:00 y 18:00, con bloqueos de 1 hora
    const allHours = generateAvailableHours("10:00", "18:00", 60);

    // Filtrar las horas ocupadas
    const freeHours = allHours.filter((hour) => !bookedHours.includes(hour));
    setAvailableHours(freeHours);

    // Limpiar selección si cambian las horas disponibles
    setSelectedHour("");
  }, [bookedHours, serviceDuration]);

  const handleSelect = (hour) => {
    setSelectedHour(hour);
    onSelect(hour);
  };

  if (availableHours.length === 0) return <p>No hay horas disponibles.</p>;

  return (
    <div style={{ display: "flex", flexWrap: "wrap", gap: "8px", marginTop: "8px" }}>
      {availableHours.map((hour) => (
        <button
          key={hour}
          onClick={() => handleSelect(hour)}
          style={{
            padding: "6px 12px",
            borderRadius: "6px",
            border: selectedHour === hour ? "2px solid #0070f3" : "1px solid #ccc",
            backgroundColor: selectedHour === hour ? "#e0f0ff" : "#fff",
            cursor: "pointer",
          }}
        >
          {hour}
        </button>
      ))}
    </div>
  );
}
