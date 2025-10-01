import { useEffect, useState } from "react";
import { supabase } from "../lib/supabaseClient";

export default function ServiceSelect({ professionalId, onSelect }) {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  // acepta professionalId como string o como objeto {id, name}
  const resolveProfessionalId = (p) => {
    if (!p) return null;
    return typeof p === "object" ? p.id : p;
  };

  useEffect(() => {
    const profId = resolveProfessionalId(professionalId);
    if (!profId) {
      setServices([]);
      return;
    }

    let mounted = true;
    const fetchServices = async () => {
      setLoading(true);
      setErrorMsg("");
      const { data, error } = await supabase
        .from("services")
        .select("id, name, price, duration_minutes")
        .eq("professional_id", profId)
        .order("name");

      if (!mounted) return;
      if (error) {
        setErrorMsg("Error al cargar servicios: " + error.message);
        setServices([]);
      } else {
        setServices(data || []);
      }
      setLoading(false);
    };

    fetchServices();
    return () => { mounted = false; };
  }, [professionalId]);

  const profId = resolveProfessionalId(professionalId);
  if (!profId) return null;
  if (loading) return <p>Cargando servicios...</p>;
  if (errorMsg) return <p style={{ color: "red" }}>{errorMsg}</p>;
  if (services.length === 0) return <p>No hay servicios disponibles.</p>;

  return (
    <select
      onChange={(e) => {
        const s = services.find((x) => x.id === e.target.value) || null;
        // DEVUELVE EL OBJETO COMPLETO { id, name, price, duration_minutes }
        onSelect(s);
      }}
      defaultValue=""
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
