import { useState, useEffect } from "react";
import { supabase } from "../lib/supabaseClient";
import ProfessionalSelect from "./ProfessionalSelect";
import ServiceSelect from "./ServiceSelect";

export default function VisualAppointmentForm() {
  const [selectedProfessional, setSelectedProfessional] = useState("");
  const [selectedService, setSelectedService] = useState("");
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedTime, setSelectedTime] = useState("");
  const [clientName, setClientName] = useState("");
  const [availableHours, setAvailableHours] = useState([]);

  // Cargar horas libres cuando cambia profesional o fecha
  useEffect(() => {
    if (!selectedProfessional || !selectedDate) {
      setAvailableHours([]);
      return;
    }

    const fetchAvailableHours = async () => {
      const possibleHours = ['10:00','11:00','12:00','13:00','14:00','15:00','16:00','17:00','18:00'];

      const { data: booked, error } = await supabase
        .from("bookings")
        .select("time")
        .eq("professional_id", selectedProfessional)
        .eq("date", selectedDate);

      if (error) {
        console.error("Error cargando citas:", error.message);
        setAvailableHours(possibleHours);
        return;
      }

      const bookedTimes = booked.map(b => b.time);
      const freeTimes = possibleHours.filter(h => !bookedTimes.includes(h));
      setAvailableHours(freeTimes);
    };

    fetchAvailableHours();
  }, [selectedProfessional, selectedDate]);

  // Reservar cita
  const handleBooking = async () => {
    if (!selectedProfessional || !selectedService || !selectedDate || !selectedTime || !clientName) {
      alert("Completa todos los campos");
      return;
    }

    const { error } = await supabase
      .from("bookings")
      .insert([
        {
          professional_id: selectedProfessional,
          service_id: selectedService,
          date: selectedDate,
          time: selectedTime,
          client_name: clientName
        }
      ]);

    if (error) alert("Error al reservar: " + error.message);
    else {
      alert("Cita reservada correctamente");
      setSelectedTime("");
      setAvailableHours(prev => prev.filter(h => h !== selectedTime));
    }
  };

  return (
    <div style={{ maxWidth: 500, margin: "0 auto", padding: 16 }}>
      <h1>Reserva tu cita</h1>

      <ProfessionalSelect onSelect={setSelectedProfessional} />

      {selectedProfessional && (
        <ServiceSelect
          professionalId={selectedProfessional}
          onSelect={setSelectedService}
        />
      )}

      {selectedProfessional && selectedService && (
        <div style={{ margin: "12px 0" }}>
          <label>Fecha:</label>
          <input
            type="date"
            value={selectedDate}
            onChange={e => setSelectedDate(e.target.value)}
            style={{ width: "100%", padding: 8, borderRadius: 6, border: "1px solid #ccc" }}
          />
        </div>
      )}

      {availableHours.length > 0 && (
        <div style={{ margin: "12px 0" }}>
          <label>Hora:</label>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginTop: 8 }}>
            {availableHours.map(h => (
              <button
                key={h}
                type="button"
                onClick={() => setSelectedTime(h)}
                style={{
                  flex: "1 1 30%",
                  padding: "12px 0",
                  borderRadius: 8,
                  border: selectedTime === h ? "2px solid blue" : "1px solid #ccc",
                  backgroundColor: "#d4edda",
                  fontWeight: selectedTime === h ? "bold" : "normal",
                  cursor: "pointer",
                  textAlign: "center"
                }}
              >
                {h}
              </button>
            ))}
          </div>
        </div>
      )}

      {selectedTime && (
        <div style={{ margin: "12px 0" }}>
          <label>Nombre:</label>
          <input
            type="text"
            placeholder="Tu nombre"
            value={clientName}
            onChange={e => setClientName(e.target.value)}
            style={{ width: "100%", padding: 8, borderRadius: 6, border: "1px solid #ccc" }}
          />
        </div>
      )}

      <button
        onClick={handleBooking}
        style={{
          width: "100%",
          padding: 12,
          borderRadius: 8,
          backgroundColor: "#007bff",
          color: "white",
          border: "none",
          fontWeight: "bold",
          cursor: "pointer"
        }}
      >
        Reservar
      </button>
    </div>
  );
}