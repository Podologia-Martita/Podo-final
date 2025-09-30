// src/components/TimeSelect.jsx
import { useState, useEffect } from "react";
import { supabase } from "../lib/supabaseClient";
import { generateAvailableHours } from "../utils/hours";

export default function TimeSelect({ professionalId, selectedDate, onSelect }) {
  const [availableHours, setAvailableHours] = useState([]);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [selectedHour, setSelectedHour] = useState("");

  useEffect(() => {
    if (!professionalId || !selectedDate) {
      setAvailableHours([]);
      return;
    }

    const fetchBookedHours = async () => {
      setLoading(true);
      setErrorMsg("");

      try {
        const { data, error } = await supabase
          .from("appointments")
          .select("time")
          .eq("professional_id", professionalId.id)
          .eq("date", selectedDate);

        if (error) throw error;

        const bookedHours = data.map((appt) => appt.time);

        // Generar todas las horas de 10:00 a 18:00
        const allHours = generateAvailableHours("10:00", "18:00", 60);

        // Filtrar las horas ocupadas
        const freeHours = allHours.filter((hour) => !bookedHours.includes(hour));

        setAvailableHours(freeHours);
        setSelectedHour("");
      } catch (err) {
        setErrorMsg("Error al cargar horas: " + err.message);
        setAvailableHours([]);
      } finally {
        setLoading(false);
      }
    };

    fetchBookedHours();
  }, [professionalId, selectedDate]);

  const handleSelect = (hour) => {
    setSelectedHour(hour);
    onSelect({ hour }); // ✅ Aquí pasamos un objeto con la hora
  };

  if (!professionalId || !selectedDate) return null;
  if (loading) return <p>Cargando horas...</p>;
  if (errorMsg) return <p style={{ color: "red" }}>{errorMsg}</p>;
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
            color: "black",
            fontWeight: "500",
            fontSize: "14px",
          }}
        >
          {hour} {/* ✅ Texto visible */}
        </button>
      ))}
    </div>
  );
}
