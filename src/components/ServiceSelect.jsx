iimport { useEffect, useState } from "react";
import { supabase } from "../lib/supabaseClient";

export default function ServiceSelect({ professionalId, onSelect }) {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  useEffect(() => {
    // Limpiar servicios si no hay profesional
    if (!professionalId) {
      setServices([]);
      return;
    }

    const fetchServices = async () => {
      setLoading(true);
      try {
        // Verificar que professionalId tenga formato UUID
        if (!/^[0-9a-fA-F-]{36}$/.test(professionalId)) {
          throw new Error("Professional ID inválido: " + professionalId);
        }

        const { data, error } = await supabase
          .from("services")
          .select("id, name, price, duration_minutes")
          .eq("professional_id", professionalId)
          .order("name");

        if (error) {
          setErrorMsg("Error al cargar servicios: " + error.message);
          setServices([]);
        } else {
          setServices(data || []);
          setErrorMsg("");
        }
      } catch (err) {
        setErrorMsg(err.message);
        setServices([]);
      }
      setLoading(false);
    };

    fetchServices();
  }, [professionalId]);

  if (!professionalId) return null;
  if (loading) return <p>Cargando servicios...</p>;
  if (errorMsg) return <p style={{ color: "red" }}>{errorMsg}</p>;
  if (services.length === 0) return <p>No hay servicios disponibles.</p>;

  return (
    <select onChange={(e) => onSelect(e.target.value)}>
      <option value="">-- Selecciona servicio --</option>
      {services.map((s) => (
        <option key={s.id} value={s.id}>
          {s.name} - ${s.price} CLP ({s.duration_minutes} min)
        </option>
      ))}
    </select>
  );
}
