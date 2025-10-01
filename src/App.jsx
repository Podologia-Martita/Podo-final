// src/App.jsx
import { useState } from "react";
import { supabase } from "./lib/supabaseClient"; // ✅ importa supabase aquí
import ProfessionalSelect from "./components/ProfessionalSelect";
import ServiceSelect from "./components/ServiceSelect";
import TimeSelect from "./components/TimeSelect";
import AppointmentSummary from "./components/AppointmentSummary";

export default function App() {
  const [selectedProfessional, setSelectedProfessional] = useState(null);
  const [selectedService, setSelectedService] = useState(null);
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedTime, setSelectedTime] = useState(null);
  const [message, setMessage] = useState("");

  const handleConfirm = async () => {
    if (!selectedProfessional || !selectedService || !selectedDate || !selectedTime) return;

    try {
      const { data, error } = await supabase
        .from("appointments")
        .insert([
          {
            professional_id: selectedProfessional.id,
            service_id: selectedService.id,
            date: selectedDate,
            time: selectedTime.hour,
          },
        ]);

      if (error) throw error;

      setMessage("✅ Cita confirmada con éxito");
      // Resetear selección si quieres
      // setSelectedProfessional(null);
      // setSelectedService(null);
      // setSelectedDate("");
      // setSelectedTime(null);
    } catch (err) {
      setMessage("❌ Error al confirmar cita: " + err.message);
    }
  };

  return (
    <div style={{ maxWidth: "500px", margin: "40px auto", fontFamily: "Arial, sans-serif" }}>
      <h1>Reserva tu cita - Podología Marta</h1>

      {/* Selección de profesional */}
      <div style={{ marginBottom: "16px" }}>
        <label><strong>Profesional:</strong></label>
        <ProfessionalSelect onSelect={setSelectedProfessional} />
      </div>

      {/* Selección de servicio */}
      {selectedProfessional && (
        <div style={{ marginBottom: "16px" }}>
          <label><strong>Servicio:</strong></label>
          <ServiceSelect professionalId={selectedProfessional} onSelect={setSelectedService} />
        </div>
      )}

      {/* Selección de fecha */}
      {selectedService && (
        <div style={{ marginBottom: "16px" }}>
          <label><strong>Fecha:</strong></label>
          <input
            type="date"
            value={selectedDate}
            onChange={(e) => {
              setSelectedDate(e.target.value);
              setSelectedTime(null);
            }}
          />
        </div>
      )}

      {/* Selección de hora */}
      {selectedDate && selectedService && selectedProfessional && (
        <div style={{ marginBottom: "16px" }}>
          <label><strong>Hora:</strong></label>
          <TimeSelect
            professionalId={selectedProfessional}
            selectedDate={selectedDate}
            onSelect={setSelectedTime}
          />
        </div>
      )}

      {/* Resumen de cita */}
      {selectedTime && (
        <div style={{ marginBottom: "16px" }}>
          <AppointmentSummary
            professional={selectedProfessional}
            service={selectedService}
            date={selectedDate}
            time={selectedTime}
          />
          <button
            onClick={handleConfirm}
            style={{
              marginTop: "8px",
              padding: "8px 16px",
              borderRadius: "6px",
              backgroundColor: "#0070f3",
              color: "#fff",
              border: "none",
              cursor: "pointer",
            }}
          >
            Confirmar cita
          </button>
        </div>
      )}

      {/* Mensaje de éxito/error */}
      {message && <p style={{ marginTop: "16px", color: message.startsWith("✅") ? "green" : "red" }}>{message}</p>}
    </div>
  );
}
