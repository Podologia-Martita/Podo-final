import { useState, useEffect } from "react";

export default function TimeSelect({ serviceDuration, bookedHours = [], onSelect }) {
  const [availableHours, setAvailableHours] = useState([]);
  const [selectedHour, setSelectedHour] = useState("");

  useEffect(() => {
    // Genera horas de 10:00 a 18:00
    const allHours = generateAvailableHours("10:00", "18:00", 60);

    // Filtra horas ocupadas
    const freeHours = allHours.filter((hour) => !bookedHours.includes(hour));
    setAvailableHours(freeHours);
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

// Necesitamos importar la función generateAvailableHours
import { generateAvailableHours } from "../utils/hours"; 
