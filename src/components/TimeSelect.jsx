// src/components/TimeSelect.jsx
import { useState, useEffect } from "react";
import { supabase } from "../lib/supabaseClient";
import { generateAvailableHours } from "../utils/hours";

export default function TimeSelect({ professionalId, selectedDate, onSelect }) {
  const [availableHours, setAvailableHours] = useState([]);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [selectedHour, setSelectedHour] = useState("");

  const resolveProfessionalId = (p) => {
    if (!p) return null;
    return typeof p === "object" ? p.id : p;
  };

  useEffect(() => {
    const profId = resolveProfessionalId(professionalId);
    if (!profId || !selectedDate) {
      setAvailableHours([]);
      return;
    }

    let mounted = true;
    const fetchBookedHours = async () => {
      setLoading(true);
      setErrorMsg("");

      try {
        const { data, error } = await supabase
          .from("appointments")
          .select("time")
          .eq("professional_id", profId)
          .eq("date", selectedDate);

        if (!mounted) return;
        if (error) throw error;

        // Convertimos objetos {hour: "..."} a string para filtrar correctamente
        const bookedHours = (data || []).map((appt) =>
          typeof appt.time === "object" ? appt.time.hour : appt.time
        );

        const allHours = generateAvailableHours("10:00", "18:00", 60);
        const freeHours = allHours.filter((hour) => !bookedHours.includes(hour));

        setAvailableHours(freeHours);
        setSelectedHour("");
      } catch (err) {
        setErrorMsg("Error al cargar horas: " + err.message);
        setAvailableHours([]);
      } finally {
        if (mounted) setLoading(false);
      }
    };

    fetchBookedHours();
    return () => { mounted = false; };
  }, [professionalId, selectedDate]);

  const handleSelect = (hour) => {
    setSelectedHour(hour);
    onSelect({ hour }); // mantenemos el objeto {hour} para App.jsx
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
          }}
        >
          {hour}
        </button>
      ))}
    </div>
  );
}
