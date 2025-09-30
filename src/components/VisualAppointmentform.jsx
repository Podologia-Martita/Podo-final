import { useState, useEffect } from "react";
import { supabase } from "../lib/supabaseClient";
import ProfessionalSelect from "./ProfessionalSelect";
import ServiceSelect from "./ServiceSelect";

export default function VisualAppointmentForm() {
  const [selectedProfessional, setSelectedProfessional] = useState("");
  const [selectedService, setSelectedService] = useState("");
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedTime, setSelectedTime] = useState("");
  const [hours, setHours] = useState([]);
  const [bookedHours, setBookedHours] = useState([]);

  // Genera horas de 10 a 18
  const generateHours = () => {
    const arr = [];
    for (let h = 10; h <= 18; h++) {
      arr.push(h.toString().padStart(2, "0") + ":00");
    }
    return arr;
  };

  // Carga horas disponibles / ocupadas
  useEffect(() => {
    const fetchAppointments = async () => {
      if (!selectedProfessional || !selectedDate) {
        setHours([]);
        setBookedHours([]);
        return;
      }

      const { data: appointments, error } = await supabase
        .from("appointments")
        .select("time")
        .eq("professional_id", selectedProfessional)
        .eq("date", selectedDate);

      if (error) {
        console.error("Error al cargar citas:", error.message);
        setHours(generateHours());
        setBookedHours([]);
        return;
      }

      setHours(generateHours());
      setBookedHours(appointments.map(a => a.time.slice(0, 2)));
    };

    fetchAppointments();
  }, [selectedProfessional, selectedDate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedProfessional || !selectedService || !selectedDate || !selectedTime) {
      alert("Completa todos los campos");
      return;
    }

    const { error } = await supabase.from("appointments").insert([
      {
        professional_id: selectedProfessional,
        service_id: selectedService,
        date: selectedDate,
        time: selectedTime,
      },
    ]);

    if (error) {
      alert("Error al agendar cita: " + error.message);
    } else {
      alert("Cita agendada correctamente");
      setSelectedProfessional("");
      setSelectedService("");
      setSelectedDate("");
      setSelectedTime("");
      setHours([]);
      setBookedHours([]);
    }
  };

  return (
    <form onSubmit={handleSubmit} style={{ maxWidth: "500px", margin: "0 auto", padding: "16px" }}>
      <div style={{ marginBottom: "12px" }}>
        <label>Profesional:</label>
        <ProfessionalSelect onSelect={setSelectedProfessional} />
      </div>

      {selectedProfessional && (
        <div style={{ marginBottom: "12px" }}>
          <label>Servicio:</label>
          <ServiceSelect
            professionalId={selectedProfessional}
            onSelect={setSelectedService}
          />
        </div>
      )}

      {selectedProfessional && selectedService && (
        <div style={{ marginBottom: "12px" }}>
          <label>Fecha:</label>
          <input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            style={{ width: "100%", padding: "8px", borderRadius: "6px", border: "1px solid #ccc" }}
          />
        </div>
      )}

      {selectedProfessional && selectedService && selectedDate && (
        <div style={{ marginBottom: "12px" }}>
          <label>Hora:</label>
          <div style={{ display: "flex", flexWrap: "wrap", gap: "8px", marginTop: "8px" }}>
            {hours.map((h) => {
              const hourNum = h.slice(0, 2);
              const isBooked = bookedHours.includes(hourNum);
              return (
                <button
                  key={h}
                  type="button"
                  disabled={isBooked}
                  onClick={() => setSelectedTime(h)}
                  style={{
                    flex: "1 1 30%",
                    padding: "12px 0",
                    borderRadius: "8px",
                    border: selectedTime === h ? "2px solid blue" : "1px solid #ccc",
                    backgroundColor: isBooked ? "#f8d7da" : "#d4edda",
                    color: isBooked ? "#721c24" : "#155724",
                    cursor: isBooked ? "not-allowed" : "pointer",
                    textAlign: "center",
                    fontWeight: selectedTime === h ? "bold" : "normal",
                  }}
                >
                  {h}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {selectedTime && (
        <p>Hora seleccionada: <strong>{selectedTime}</strong></p>
      )}

      <button
        type="submit"
        style={{
          width: "100%",
          padding: "12px",
          borderRadius: "8px",
          backgroundColor: "#007bff",
          color: "white",
          border: "none",
          fontWeight: "bold",
          cursor: "pointer",
        }}
      >
        Agendar cita
      </button>
    </form>
  );
}