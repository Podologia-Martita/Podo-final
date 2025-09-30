// src/components/TimeSelect.jsx
import { useEffect, useState } from "react";
import { supabase } from "../lib/supabaseClient";

export default function TimeSelect({ professionalId, date, onSelect }) {
  const [bookedTimes, setBookedTimes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  // ✅ Generar horarios de 10:00 a 18:00
  const generateTimeSlots = (startHour = 10, endHour = 18) => {
    const slots = [];
    for (let h = startHour; h <= endHour; h++) {
      slots.push(`${h.toString().padStart(2, "0")}:00`);
    }
    return slots;
  };

  const timeSlots = generateTimeSlots();

  useEffect(() => {
    if (!professionalId || !date) {
      setBookedTimes([]);
      return;
    }

    const fetchBookedTimes = async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from("appointments")
        .select("time")
        .eq("professional_id", professionalId)
        .eq("date", date);

      if (error) {
        console.error("Error al cargar horas:", error.message);
        setErrorMsg("Error al cargar horas: " + error.message);
        setBookedTimes([]);
      } else {
        setBookedTimes(data.map((a) => a.time));
        setErrorMsg("");
      }
      setLoading(false);
    };

    fetchBookedTimes();
  }, [professionalId, date]);

  if (!professionalId || !date) return null;
  if (loading) return <p>Cargando horas...</p>;
  if (errorMsg) return <p style={{ color: "red" }}>{errorMsg}</p>;

  return (
    <div style={{ display: "flex", flexWrap: "wrap", gap: "8px", marginTop: "8px" }}>
      {timeSlots.map((slot) => (
        <button
          key={slot}
          onClick={() => onSelect(slot)}
          disabled={bookedTimes.includes(slot)}
          style={{
            padding: "8px 12px",
            borderRadius: "6px",
            border: "1px solid #ccc",
            backgroundColor: bookedTimes.includes(slot) ? "#eee" : "#fff",
            cursor: bookedTimes.includes(slot) ? "not-allowed" : "pointer",
            minWidth: "70px",
          }}
        >
          {slot}
        </button>
      ))}
    </div>
  );
}
