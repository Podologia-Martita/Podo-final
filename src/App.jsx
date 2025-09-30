import React, { useState } from "react";
import ProfessionalSelect from "./components/ProfessionalSelect";
import ServiceSelect from "./components/ServiceSelect";
import TimeSelect from "./components/TimeSelect";
import Summary from "./components/Summary";

export default function App() {
  const [professionalId, setProfessionalId] = useState("");
  const [professionalName, setProfessionalName] = useState("");
  const [serviceId, setServiceId] = useState("");
  const [serviceName, setServiceName] = useState("");
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedTime, setSelectedTime] = useState("");
  const [clientName, setClientName] = useState("");
  const [clientEmail, setClientEmail] = useState("");
  const [clientPhone, setClientPhone] = useState("");

  return (
    <div style={{ padding: "20px", fontFamily: "sans-serif" }}>
      <h1>Podología Marta</h1>

      <div>
        <label>Profesional:</label>
        <ProfessionalSelect
          onSelect={(id, name) => {
            setProfessionalId(id);
            setProfessionalName(name);
          }}
        />
      </div>

      {professionalId && (
        <div style={{ marginTop: "10px" }}>
          <label>Servicio:</label>
          <ServiceSelect
            professionalId={professionalId}
            onSelect={(id, name) => {
              setServiceId(id);
              setServiceName(name);
            }}
          />
        </div>
      )}

      {serviceId && (
        <div style={{ marginTop: "10px" }}>
          <label>Fecha:</label>
          <input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
          />
        </div>
      )}

      {serviceId && selectedDate && (
        <div style={{ marginTop: "10px" }}>
          <label>Hora:</label>
          <TimeSelect
            professionalId={professionalId}
            selectedDate={selectedDate}
            onSelect={(time) => setSelectedTime(time)}
          />
        </div>
      )}

      {selectedTime && (
        <div style={{ marginTop: "10px" }}>
          <label>Nombre:</label>
          <input
            type="text"
            value={clientName}
            onChange={(e) => setClientName(e.target.value)}
          />
          <label>Email:</label>
          <input
            type="email"
            value={clientEmail}
            onChange={(e) => setClientEmail(e.target.value)}
          />
          <label>Teléfono:</label>
          <input
            type="tel"
            value={clientPhone}
            onChange={(e) => setClientPhone(e.target.value)}
          />
        </div>
      )}

      {selectedTime && clientName && clientEmail && clientPhone && (
        <div style={{ marginTop: "20px" }}>
          <Summary
            professionalName={professionalName}
            serviceName={serviceName}
            date={selectedDate}
            time={selectedTime}
            clientName={clientName}
            clientEmail={clientEmail}
            clientPhone={clientPhone}
          />
        </div>
      )}
    </div>
  );
}
