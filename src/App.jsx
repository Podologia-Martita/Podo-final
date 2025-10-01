import { useState } from "react";
import ProfessionalSelect from "./components/ProfessionalSelect";
import ServiceSelect from "./components/ServiceSelect";

export default function App() {
  const [professional, setProfessional] = useState(null); // objeto completo
  const [serviceId, setServiceId] = useState("");

  return (
    <div style={{ padding: "20px" }}>
      <h1>Agendar cita</h1>

      <label>Profesional:</label>
      <ProfessionalSelect
        onSelect={(selectedProfessional) => setProfessional(selectedProfessional)}
      />

      <label>Servicio:</label>
      <ServiceSelect
        professionalId={professional?.id || ""}
        onSelect={(id) => setServiceId(id)}
      />

      <div style={{ marginTop: "16px" }}>
        <h2>Resumen de cita</h2>
        <p>Profesional: {professional?.name || "—"}</p>
        <p>Servicio: {serviceId || "—"}</p>
      </div>
    </div>
  );
}
