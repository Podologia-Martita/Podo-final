// src/App.jsx
import { useState } from "react";
import ProfessionalSelect from "./components/ProfessionalSelect";
import ServiceSelect from "./components/ServiceSelect";
import TimeSelect from "./components/TimeSelect";
import { supabase } from "./lib/supabaseClient";

export default function App() {
  const [selectedProfessional, setSelectedProfessional] = useState("");
  const [selectedProfessionalName, setSelectedProfessionalName] = useState("");
  const [selectedService, setSelectedService] = useState("");
  const [selectedServiceName, setSelectedServiceName] = useState("");
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedHour, setSelectedHour] = useState("");

  // Datos del cliente
  const [clientName, setClientName] = useState("");
  const [clientEmail, setClientEmail] = useState("");
  const [clientPhone, setClientPhone] = useState("");

  const handleConfirm = async () => {
    if (
      !selectedProfessional ||
      !selectedService ||
      !selectedDate ||
      !selectedHour ||
      !clientName ||
      !clientEmail ||
      !clientPhone
    ) {
      alert("❌ Por favor completa todos los campos");
      return;
    }

    try {
      const { error } = await supabase.from("appointments").insert([
        {
          professional_id: selectedProfessional,
          service_id: selectedService,
          date: selectedDate,
          time: selectedHour,
          client_name: clientName,
          client_email: clientEmail,
          client_phone: clientPhone,
        },
      ]);

      if (error) throw error;

      alert("✅ Cita confirmada!");

      // Limpiar solo los campos de selección
      setSelectedProfessional("");
      setSelectedProfessionalName("");
      setSelectedService("");
      setSelectedServiceName("");
      setSelectedDate("");
      setSelectedHour("");
      setClientName("");
      setClientEmail("");
      setClientPhone("");
    } catch (err) {
      alert("❌ Error al confirmar cita: " + err.message);
    }
  };

  return (
    <div style={{ padding: "16px", fontFamily: "Arial, sans-serif" }}>
      <h1>Podología Marta</h1>

      {/* Selección de profesional */}
      <div style={{ marginBottom: "16px" }}>
        <label><strong>Profesional:</strong></label>
        <ProfessionalSelect
          onSelect={(prof) => {
            setSelectedProfessional(prof.id);
            setSelectedProfessionalName(prof.name);
          }}
        />
      </div>

      {/* Selección de servicio */}
      {selectedProfessional && (
        <div style={{ marginBottom: "16px" }}>
          <label><strong>Servicio:</strong></label>
          <ServiceSelect
            professionalId={selectedProfessional}
            onSelect={(srv) => {
              setSelectedService(srv.id);
              setSelectedServiceName(srv.name);
            }}
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
            min={new Date().toISOString().split("T")[0]}
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

      {/* Datos del cliente */}
      {selectedProfessional && selectedService && selectedDate && selectedHour && (
        <div style={{ marginBottom: "16px" }}>
          <h3>Datos del cliente</h3>
          <div>
            <label>Nombre:</label>
            <input
              type="text"
              value={clientName}
              onChange={(e) => setClientName(e.target.value)}
            />
          </div>
          <div>
            <label>Email:</label>
            <input
              type="email"
              value={clientEmail}
              onChange={(e) => setClientEmail(e.target.value)}
            />
          </div>
          <div>
            <label>Teléfono:</label>
            <input
              type="tel"
              value={clientPhone}
              onChange={(e) => setClientPhone(e.target.value)}
            />
          </div>
        </div>
      )}

      {/* Resumen de la cita */}
      {selectedProfessional && selectedService && selectedDate && selectedHour && (
        <div
          style={{
            marginTop: "24px",
            padding: "12px",
            border: "1px solid #ccc",
            borderRadius: "8px",
          }}
        >
          <h2>Resumen de cita</h2>
          <p><strong>Profesional:</strong> {selectedProfessionalName}</p>
          <p><strong>Servicio:</strong> {selectedServiceName}</p>
          <p><strong>Fecha:</strong> {selectedDate}</p>
          <p><strong>Hora:</strong> {selectedHour}</p>
          <p><strong>Nombre del cliente:</strong> {clientName}</p>
          <p><strong>Email:</strong> {clientEmail}</p>
          <p><strong>Teléfono:</strong> {clientPhone}</p>
        </div>
      )}

      {/* Botón de confirmación */}
      {selectedProfessional && selectedService && selectedDate && selectedHour && (
        <div style={{ marginTop: "16px" }}>
          <button
            onClick={handleConfirm}
            style={{ padding: "8px 16px", cursor: "pointer" }}
          >
            Confirmar cita
          </button>
        </div>
      )}
    </div>
  );
}
