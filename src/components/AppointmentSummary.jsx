// src/components/AppointmentSummary.jsx
export default function AppointmentSummary({ professional, service, date, time }) {
  if (!professional || !service || !date || !time) return null;

  return (
    <div style={{ marginTop: "16px", padding: "12px", border: "1px solid #ccc", borderRadius: "6px" }}>
      <h3>Resumen de cita</h3>
      <p><strong>Profesional:</strong> {professional.name}</p>
      <p><strong>Servicio:</strong> {service.name}</p>
      <p><strong>Fecha:</strong> {date}</p>
      <p><strong>Hora:</strong> {time.hour}</p>
    </div>
  );
}
