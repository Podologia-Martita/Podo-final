import { useState, useEffect } from "react";
import { supabase } from "../lib/supabaseClient";
import ProfessionalSelect from "./ProfessionalSelect";
import ServiceSelect from "./ServiceSelect";
import { FaClock } from "react-icons/fa"; // ícono de reloj

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
    <div style={{
      maxWidth: "520px",
      margin: "20px auto",
      padding: "20px",
      borderRadius: "12px",
      background: "#ffffff",
      boxShadow: "0 6px 18px rgba(0,0,0,0.1)",
      fontFamily: "Arial, sans-serif"
    }}>
      <h1 style={{ textAlign: "center", marginBottom: "24px", color: "#007bff" }}>
        Reserva tu cita
      </h1>

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
                    padding: "12px",
                    borderRadius: "10px",
                    border: selectedTime === h ? "2px solid #007bff" : "1px solid #ccc",
                    background: isBooked ? "#f8d7da" : "linear-gradient(135deg, #00c6ff, #0072ff)",
                    color: isBooked ? "#721c24" : "#fff",
                    cursor: isBooked ? "not-allowed" : "pointer",
                    fontWeight: selectedTime === h ? "bold" : "normal",
                    boxShadow: selectedTime === h ? "0 4px 10px rgba(0,0,0,0.2)" : "0 2px 6px rgba(0,0,0,0.1)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: "6px",
                    transition: "all 0.2s"
                  }}
                  onMouseOver={e => !isBooked && (e.currentTarget.style.transform = "scale(1.05)")}
                  onMouseOut={e => !isBooked && (e.currentTarget.style.transform = "scale(1)")}
                >
                  <FaClock />
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
              padding: "12px",
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
          background: "linear-gradient(135deg, #00c6ff, #0072ff)",
          color: "white",
          border: "none",
          fontWeight: "bold",
          fontSize: "16px",
          cursor: "pointer",
          transition: "all 0.2s",
        }}
        onMouseOver={e => e.currentTarget.style.transform = "scale(1.02)"}
        onMouseOut={e => e.currentTarget.style.transform = "scale(1)"}
        onMouseDown={e => e.currentTarget.style.transform = "scale(0.98)"}
        onMouseUp={e => e.currentTarget.style.transform = "scale(1)"}
      >
        Reservar
      </button>
    </div>
  );
}