// App.jsx (o donde confirmas la cita)
import { supabase } from "./lib/supabaseClient";

async function handleConfirm({
  clientName,
  clientEmail,
  clientPhone,
  selectedProfessional,
  selectedService,
  selectedDate,
  selectedTime,
  professionalEmail, // correo fijo del profesional
}) {
  try {
    // 1️⃣ Guardar la cita en Supabase
    const { data, error } = await supabase
      .from("appointments")
      .insert([
        {
          client_name: clientName,
          client_email: clientEmail,
          client_phone: clientPhone,
          professional_id: selectedProfessional.id,
          service_id: selectedService.id,
          date: selectedDate,
          time: selectedTime.hour,
        },
      ]);

    if (error) throw error;

    // 2️⃣ Enviar email al cliente
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

    // 3️⃣ Enviar email al profesional
    await fetch("/api/sendEmail", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        clientEmail: professionalEmail,
        clientName,
        professionalName: selectedProfessional.name,
        serviceName: selectedService.name,
        date: selectedDate,
        time: selectedTime.hour,
      }),
    });

    alert("Cita confirmada y emails enviados correctamente!");
  } catch (err) {
    console.error("Error al confirmar cita:", err);
    alert("❌ Error al confirmar cita: " + err.message);
  }
}
