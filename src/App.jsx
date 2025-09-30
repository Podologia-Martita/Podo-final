// src/App.jsx
import { useState } from "react";
import ProfessionalSelect from "./components/ProfessionalSelect";
import ServiceSelect from "./components/ServiceSelect";
import TimeSelect from "./components/TimeSelect";
import AppointmentSummary from "./components/AppointmentSummary";

export default function App() {
  const [selectedProfessional, setSelectedProfessional] = useState(null);
  const [selectedService, setSelectedService] = useState(null);
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedTime, setSelectedTime] = useState(null);

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
          <ServiceSelect
            professionalId={selectedProfessional}
            onSelect={setSelectedService}
          />
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
              setSelectedTime(null); // resetear hora si cambia fecha
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
        <AppointmentSummary
          professional={selectedProfessional}
          service={selectedService}
          date={selectedDate}
          time={selectedTime}
        />
      )}
    </div>
  );
}
