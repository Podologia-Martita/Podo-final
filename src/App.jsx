import { useState } from "react";
import ProfessionalSelect from "./components/ProfessionalSelect";
import ServiceSelect from "./components/ServiceSelect";
import TimeSelect from "./components/TimeSelect";

export default function App() {
  const [clientName, setClientName] = useState("");
  const [clientEmail, setClientEmail] = useState("");
  const [clientPhone, setClientPhone] = useState("");
  const [selectedProfessional, setSelectedProfessional] = useState(null);
  const [selectedService, setSelectedService] = useState(null);
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedTime, setSelectedTime] = useState(null);

  const handleConfirm = async () => {
    if (!clientName || !clientEmail || !clientPhone || !selectedProfessional || !selectedService || !selectedDate || !selectedTime) {
      alert("Completa todos los campos antes de confirmar.");
      return;
    }

    try {
      // Guardar cita en Supabase
      const { data, error } = await supabase
        .from("appointments")
        .insert([{
          client_name: clientName,
          client_email: clientEmail,
          client_phone: clientPhone,
          professional_id: selectedProfessional.id,
          service_id: selectedService.id,
          date: selectedDate,
          time: selectedTime.hour,
        }]);
      if (error) throw error;

      // Email al cliente
      await fetch("/api/sendEmail", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          clientEmail,
          clientName,
          professionalName: selectedProfessional.name,
          serviceName: selectedService.name,
          date: selectedDate,
          time: selectedTime.hour,
        }),
      });

      // Email al profesional
      await fetch("/api/sendEmail", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          clientEmail: selectedProfessional.email,
          clientName,
          professionalName: selectedProfessional.name,
          serviceName: selectedService.name,
          date: selectedDate,
          time: selectedTime.hour,
        }),
      });

      alert("✅ Cita confirmada y emails enviados correctamente!");
    } catch (err) {
      console.error(err);
      alert("❌ Error al confirmar cita: " + err.message);
    }
  };

  return (
    <div style={{ padding: "16px" }}>
      <h2>Agendar Cita</h2>

      <div>
        <label>Nombre:</label>
        <input value={clientName} onChange={e => setClientName(e.target.value)} />
      </div>

      <div>
        <label>Email:</label>
        <input value={clientEmail} onChange={e => setClientEmail(e.target.value)} />
      </div>

      <div>
        <label>Teléfono:</label>
        <input value={clientPhone} onChange={e => setClientPhone(e.target.value)} />
      </div>

      <div>
        <label>Profesional:</label>
        <ProfessionalSelect onSelect={setSelectedProfessional} />
      </div>

      <div>
        <label>Servicio:</label>
        <ServiceSelect professionalId={selectedProfessional?.id} onSelect={setSelectedService} />
      </div>

      <div>
        <label>Fecha:</label>
        <input type="date" value={selectedDate} onChange={e => setSelectedDate(e.target.value)} />
      </div>

      <div>
        <label>Hora:</label>
        <TimeSelect professionalId={selectedProfessional?.id} selectedDate={selectedDate} onSelect={setSelectedTime} />
      </div>

      <button onClick={handleConfirm} style={{ marginTop: "16px", padding: "8px 16px" }}>Confirmar Cita</button>

      {selectedProfessional && selectedService && selectedDate && selectedTime && (
        <div style={{ marginTop: "16px", border: "1px solid #ccc", padding: "8px" }}>
          <h3>Resumen de cita</h3>
          <p>Profesional: {selectedProfessional.name}</p>
          <p>Servicio: {selectedService.name}</p>
          <p>Fecha: {selectedDate}</p>
          <p>Hora: {selectedTime.hour}</p>
        </div>
      )}
    </div>
  );
}
