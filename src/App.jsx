import { useState } from "react";
import ProfessionalSelect from "./components/ProfessionalSelect";
import ServiceSelect from "./components/ServiceSelect";

export default function App() {
  const [professionalId, setProfessionalId] = useState("");
  const [professionalName, setProfessionalName] = useState("");
  const [serviceId, setServiceId] = useState("");

  return (
    <div>
      <h1>Agendar cita</h1>

      <label>Profesional:</label>
      <ProfessionalSelect
        onSelect={(selectedProfessional) => {
          // selectedProfessional será un objeto { id, name }
          setProfessionalId(selectedProfessional.id);
          setProfessionalName(selectedProfessional.name);
        }}
      />

      <label>Servicio:</label>
      <ServiceSelect
        professionalId={professionalId}
        onSelect={(id) => setServiceId(id)}
      />

      <div style={{ marginTop: "16px" }}>
        <h2>Resumen de cita</h2>
        <p>Profesional: {professionalName || "—"}</p>
        <p>Servicio: {serviceId || "—"}</p>
      </div>
    </div>
  );
}
