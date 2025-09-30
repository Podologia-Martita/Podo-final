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
  const [hours, setHours] = useState([]);
  const [bookedHours, setBookedHours] = useState([]);

  const generateHours = () => {
    const arr = [];
    for (let h = 10; h <= 18; h++) {
      arr.push(h.toString().padStart(2, "0") + ":00");
    }
    return arr;
  };

  useEffect(() => {
    const fetchBookedHours = async () => {
      if (!selectedProfessional || !selectedDate) {
        setHours([]);
        setBookedHours([]);
        return;
      }

      const { data, error } = await supabase
        .from("bookings")
        .select("time")
        .eq("professional_id", selectedProfessional)
        .eq("date", selectedDate);

      if (error) {
        console.error("Error al cargar citas:", error.message);
        setHours(generateHours());
        setBookedHours([]);
        return;
      }

      const booked = data.map(a => {
        const dateObj = new Date(a.time);
        return dateObj.getHours().toString().padStart(2, "0");
      });

      setHours(generateHours());
      setBookedHours(booked);
    };

    fetchBookedHours();
  }, [selectedProfessional, selectedDate]);

  const handleBooking = async () => {
    if (!selectedProfessional || !selectedService || !selectedDate || !selectedTime || !clientName) {
      alert("Completa todos los campos");
      return;
    }

    const { error } = await supabase.from("bookings").insert([
      {
        professional_id: selectedProfessional,
        service: selectedService,
        date: selectedDate,
        time: `${selectedDate} ${selectedTime}:00`,
        client_name: clientName
      },
    ]);

    if (error) {
      alert("Error al reservar cita: " + error.message);
    } else {
      alert("Cita reservada correctamente");
      setSelectedProfessional("");
      setSelectedService("");
      setSelectedDate("");
      setSelectedTime("");
      setClientName("");
      setHours([]);
      setBookedHours([]);
    }
  };

  return (
    <div style={{ maxWidth: "500px", margin: "0 auto", padding: "16px", fontFamily: "Arial, sans-serif" }}>
      <h1 style={{ textAlign: "center", marginBottom: "20px" }}>Reserva tu cita - Podología Marta</h1>

      <div style={{ marginBottom: "16px" }}>
        <label style={{ fontWeight: "bold" }}>Profesional:</label>
        <ProfessionalSelect onSelect={setSelectedProfessional} />
      </div>

      {selectedProfessional && (
        <div style={{ marginBottom: "16px" }}>
          <label style={{ fontWeight: "bold" }}>Servicio:</label>
          <ServiceSelect professionalId={selectedProfessional} onSelect={setSelectedService} />
        </div>
      )}

      {selectedProfessional && selectedService && (
        <div style={{ marginBottom: "16px" }}>
          <label style={{ fontWeight: "bold" }}>Fecha:</label>
          <input
            type="date"
            value={selectedDate}
            onChange={e => setSelectedDate(e.target.value)}
            style={{
              width: "100%",
              padding: "10px",
              borderRadius: "8px",
              border: "1px solid #ccc",
              fontSize: "16px"
            }}
          />
        </div>
      )}

      {selectedProfessional && selectedService && selectedDate && (
        <div style={{ marginBottom: "16px" }}>
          <label style={{ fontWeight: "bold" }}>Hora:</label>
          <div style={{ display: "flex", flexWrap: "wrap", gap: "10px", marginTop: "10px" }}>
            {hours.map(h => {
              const isBooked = bookedHours.includes(h.slice(0, 2));
              return (
                <button
                  key={h}
                  type="button"
                  disabled={isBooked}
                  onClick={() => setSelectedTime(h)}
                  style={{
                    flex: "1 1 30%",
                    padding: "12px 0",
                    borderRadius: "10px",
                    border: selectedTime === h ? "2px solid #007bff" : "1px solid #ccc",
                    backgroundColor: isBooked ? "#f8d7da" : "#e0f7fa",
                    color: isBooked ? "#721c24" : "#006064",
                    cursor: isBooked ? "not-allowed" : "pointer",
                    textAlign: "center",
                    fontWeight: selectedTime === h ? "bold" : "normal",
                    transition: "all 0.2s",
                    boxShadow: selectedTime === h ? "0 4px 8px rgba(0,0,0,0.2)" : "none"
                  }}
                  onMouseOver={e => !isBooked && (e.currentTarget.style.backgroundColor = "#b2ebf2")}
                  onMouseOut={e => !isBooked && (e.currentTarget.style.backgroundColor = "#e0f7fa")}
                >
                  {h}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {selectedTime && (
        <div style={{ marginBottom: "16px" }}>
          <label style={{ fontWeight: "bold" }}>Tu nombre:</label>
          <input
            type="text"
            placeholder="Nombre completo"
            value={clientName}
            onChange={e => setClientName(e.target.value)}
            style={{
              width: "100%",
              padding: "10px",
              borderRadius: "8px",
              border: "1px solid #ccc",
              fontSize: "16px"
            }}
          />
        </div>
      )}

      <button
        onClick={handleBooking}
        style={{
          width: "100%",
          padding: "14px",
          borderRadius: "10px",
          backgroundColor: "#007bff",
          color: "white",
          border: "none",
          fontWeight: "bold",
          fontSize: "16px",
          cursor: "pointer",
          transition: "background-color 0.2s, transform 0.1s"
        }}
        onMouseOver={e => e.currentTarget.style.backgroundColor = "#0056b3"}
        onMouseOut={e => e.currentTarget.style.backgroundColor = "#007bff"}
        onMouseDown={e => e.currentTarget.style.transform = "scale(0.98)"}
        onMouseUp={e => e.currentTarget.style.transform = "scale(1)"}
      >
        Reservar
      </button>
    </div>
  );
}