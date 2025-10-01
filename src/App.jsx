import { useState } from "react";
import ProfessionalSelect from "./components/ProfessionalSelect";
import ServiceSelect from "./components/ServiceSelect";
import TimeSelect from "./components/TimeSelect";

export default function App() {
  const [selectedProfessional, setSelectedProfessional] = useState("");
  const [selectedService, setSelectedService] = useState("");
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedHour, setSelectedHour] = useState("");

  return (
    <div style={{ padding: "16px", fontFamily: "Arial, sans-serif" }}>
      <h1>Podología Marta</h1>

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
      {selectedProfessional && selectedService && (
        <div style={{ marginBottom: "16px" }}>
          <label><strong>Fecha:</strong></label>
          <input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            min={new Date().toISOString().split("T")[0]} // no permitir fechas pasadas
          />
        </div>
      )}

      {/* Selección de hora */}
      {selectedProfessional && selectedService && selectedDate && (
        <div style={{ marginBottom: "16px" }}>
          <label><strong>Hora:</strong></label>
          <TimeSelect
            professionalId={selectedProfessional}
            selectedDate={selectedDate}
            onSelect={setSelectedHour}
          />
        </div>
      )}

      {/* Resumen de la cita seleccionada */}
      {selectedProfessional && selectedService && selectedDate && selectedHour && (
        <div style={{ marginTop: "24px", padding: "12px", border: "1px solid #ccc", borderRadius: "8px" }}>
          <h2>Resumen de cita</h2>
          <p><strong>Profesional:</strong> {selectedProfessional}</p>
          <p><strong>Servicio:</strong> {selectedService}</p>
          <p><strong>Fecha:</strong> {selectedDate}</p>
          <p><strong>Hora:</strong> {selectedHour}</p>
        </div>
      )}
    </div>
  );
}
