// ServiceSelect.jsx
import { useEffect, useState } from "react";
import { supabase } from "../lib/supabaseClient";

export default function ServiceSelect({ professionalId, onSelect }) {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!professionalId) return;

    const fetchServices = async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from("services")
        .select("id, name, price, duration_minutes")
        .eq("professional_id", professionalId.id) // 👈 ahora usamos professionalId.id
        .order("name");

      if (!error) setServices(data || []);
      setLoading(false);
    };

    fetchServices();
  }, [professionalId]);

  if (!professionalId) return null;

  return (
    <select
      onChange={(e) => {
        const selected = services.find((s) => s.id === e.target.value);
        onSelect(selected ? { id: selected.id, name: selected.name } : null);
      }}
    >
      <option value="">-- Selecciona servicio --</option>
      {services.map((s) => (
        <option key={s.id} value={s.id}>
          {s.name} - ${s.price} CLP ({s.duration_minutes} min)
        </option>
      ))}
    </select>
  );
}
