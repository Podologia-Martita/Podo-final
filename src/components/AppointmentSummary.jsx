// src/components/AppointmentSummary.jsx

export default function AppointmentSummary({ professional, service, date, time }) {
  // Si falta algún dato, no mostrar nada
  if (!professional || !service || !date || !time) return null;

  return (
    <div
      style={{
        marginTop: "16px",
        padding: "12px",
        border: "1px solid #ccc",
        borderRadius: "8px",
        maxWidth: "400px",
        backgroundColor: "#f9f9f9",
      }}
    >
      <h3 style={{ marginBottom: "12px" }}>Resumen de cita</h3>
      <p>
        <strong>Profesional:</strong> {professional.name}
      </p>
      <p>
        <strong>Servicio:</strong> {service.name}
      </p>
      <p>
        <strong>Fecha:</strong> {date}
      </p>
      <p>
        <strong>Hora:</strong> {time.hour}
      </p>
    </div>
  );
}
