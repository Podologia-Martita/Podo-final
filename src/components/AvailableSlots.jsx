import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabaseClient';

export default function AvailableSlots({ professionalId, serviceName, date, onSelect }) {
  const [slots, setSlots] = useState([]);

  useEffect(() => {
    if (!professionalId || !serviceName || !date) return;

    const fetchSlots = async () => {
      // Simulación de horarios disponibles (puedes reemplazar con lógica real)
      const allSlots = [
        "10:00", "11:00", "12:00", "13:00", "14:00",
        "15:00", "16:00", "17:00"
      ];

      const { data: bookings } = await supabase
        .from('bookings')
        .select('time')
        .eq('professional_id', professionalId)
        .gte('time', date + ' 00:00:00')
        .lte('time', date + ' 23:59:59')
        .schema('public');

      const bookedTimes = bookings.map(b => new Date(b.time).toLocaleTimeString('es-CL', { hour: '2-digit', minute: '2-digit' }));

      const available = allSlots.filter(s => !bookedTimes.includes(s));
      setSlots(available);
    };

    fetchSlots();
  }, [professionalId, serviceName, date]);

  return (
    <select onChange={e => onSelect(e.target.value)}>
      <option value="">-- Selecciona horario --</option>
      {slots.map(time => (
        <option key={time} value={time}>{time}</option>
      ))}
    </select>
  );
}