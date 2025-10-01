export default function AppointmentSummary({ professional, service, date, time }) {
  // soporta professional/service como objeto o string, time como objeto {hour} o string
  const professionalName = professional ? (typeof professional === "object" ? professional.name : professional) : "";
  const serviceName = service ? (typeof service === "object" ? service.name : service) : "";
  const timeLabel = time ? (typeof time === "object" ? time.hour : time) : "";

  return (
    <div style={{ padding: "12px", border: "1px solid #ccc", borderRadius: "6px" }}>
      <h2>Resumen de cita</h2>
      <p><strong>Profesional:</strong> {professionalName}</p>
      <p><strong>Servicio:</strong> {serviceName}</p>
      <p><strong>Fecha:</strong> {date}</p>
      <p><strong>Hora:</strong> {timeLabel}</p>
    </div>
  );
}
