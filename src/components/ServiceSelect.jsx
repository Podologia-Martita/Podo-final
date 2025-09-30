// src/components/ServiceSelect.jsx
import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabaseClient';

export default function ServiceSelect({ professionalId, onSelect }) {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  useEffect(() => {
    if (!professionalId) {
      setServices([]);
      return;
    }

    const fetchServices = async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from('services')
        .select('id, name, price, duration_minutes')
        .eq('professional_id', professionalId.id)
        .order('name');

      if (error) {
        setErrorMsg("Error al cargar servicios: " + error.message);
        setServices([]);
      } else {
        setServices(data || []);
        setErrorMsg("");
      }
      setLoading(false);
    };

    fetchServices();
  }, [professionalId]);

  if (!professionalId) return null;
  if (loading) return <p>Cargando servicios...</p>;
  if (errorMsg) return <p style={{ color: 'red' }}>{errorMsg}</p>;
  if (services.length === 0) return <p>No hay servicios disponibles.</p>;

  return (
    <select
      onChange={(e) => {
        const selected = services.find((s) => s.id === e.target.value);
        onSelect(selected || null);
      }}
    >
      <option value="">-- Selecciona servicio --</option>
      {services.map(s => (
        <option key={s.id} value={s.id}>
          {s.name} - ${s.price} CLP ({s.duration_minutes} min)
        </option>
      ))}
    </select>
  );
}
