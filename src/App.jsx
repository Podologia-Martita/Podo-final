import { useState } from "react";
import ProfessionalSelect from "./components/ProfessionalSelect";
import ServiceSelect from "./components/ServiceSelect";
import TimeSelect from "./components/TimeSelect";

export default function App() {
  const [selectedProfessional, setSelectedProfessional] = useState({ id: "", name: "" });
  const [selectedService, setSelectedService] = useState({ id: "", name: "" });
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedHour, setSelectedHour] = useState("");

  return (
    <div style={{ padding: "16px", fontFamily: "Arial, sans-serif" }}>
      <h1>Podología Marta</h1>

      {/* Profesional */}
      <div style={{ marginBottom: "16px" }}>
        <label><strong>Profesional:</strong></label>
        <ProfessionalSelect
          onSelect={(prof) => setSelectedProfessional(prof)} // prof = {id, name}
        />
      </div>

      {/* Servicio */}
      {selectedProfessional.id && (
        <div style={{ marginBottom: "16px" }}>
          <label><strong>Servicio:</strong></label>
          <ServiceSelect
            professionalId={selectedProfessional.id}
            onSelect={(srv) => setSelectedService(srv)} // srv = {id, name}
          />
        </div>
      )}

      {/* Fecha */}
      {selectedProfessional.id && selectedService.id && (
        <div style={{ marginBottom: "16px" }}>
          <label><strong>Fecha:</strong></label>
          <input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            min={new Date().toISOString().split("T")[0]}
          />
        </div>
      )}

      {/* Hora */}
      {selectedProfessional.id && selectedService.id && selectedDate && (
        <div style={{ marginBottom: "16px" }}>
          <label><strong>Hora:</strong></label>
          <TimeSelect
            professionalId={selectedProfessional.id}
            selectedDate={selectedDate}
            onSelect={setSelectedHour}
          />
        </div>
      )}

      {/* Resumen */}
      {selectedProfessional.id && selectedService.id && selectedDate && selectedHour && (
        <div style={{ marginTop: "24px", padding: "12px", border: "1px solid #ccc", borderRadius: "8px" }}>
          <h2>Resumen de cita</h2>
          <p><strong>Profesional:</strong> {selectedProfessional.name}</p>
          <p><strong>Servicio:</strong> {selectedService.name}</p>
          <p><strong>Fecha:</strong> {selectedDate}</p>
          <p><strong>Hora:</strong> {selectedHour}</p>
        </div>
      )}
    </div>
  );
}
