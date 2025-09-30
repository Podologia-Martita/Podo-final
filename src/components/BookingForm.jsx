import { useState } from 'react';
import { supabase } from '../lib/supabaseClient';

export default function BookingForm({ professionalId, serviceName, selectedSlot }) {
  const [clientName, setClientName] = useState('');

  const bookSlot = async () => {
    if (!clientName) return alert("Ingresa tu nombre");

    const { error } = await supabase.from('bookings').insert([
      {
        professional_id: professionalId,
        service: serviceName,
        client_name: clientName,
        time: selectedSlot,
      },
    ]);

    if (error) alert("Error al reservar: " + error.message);
    else alert("Reserva creada con éxito ✅");
  };

  return (
    <div>
      <input
        type="text"
        placeholder="Tu nombre"
        value={clientName}
        onChange={(e) => setClientName(e.target.value)}
      />
      <button onClick={bookSlot}>Reservar</button>
    </div>
  );
}
