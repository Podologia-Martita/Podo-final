import { useEffect, useState } from "react";
import { supabase } from "../lib/supabaseClient";

export default function ProfessionalSelect({ onSelect }) {
  const [professionals, setProfessionals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState("");

  useEffect(() => {
    const fetchProfessionals = async () => {
      const { data, error } = await supabase
        .from("professionals")
        .select("id, name")
        .order("name"); // 👈 sin schema()

      if (error) {
        console.error("Error cargando profesionales:", error.message);
        setErrorMsg(error.message);
      } else {
        setProfessionals(data);
      }
      setLoading(false);
    };

    fetchProfessionals();
  }, []);

  if (loading) return <p>Cargando profesionales...</p>;
  if (errorMsg) return <p style={{ color: "red" }}>Error: {errorMsg}</p>;
  if (professionals.length === 0) return <p>No hay profesionales registrados.</p>;

  return (
    <select onChange={(e) => onSelect(e.target.value)}>
      <option value="">-- Selecciona profesional --</option>
      {professionals.map((p) => (
        <option key={p.id} value={p.id}>
          {p.name}
        </option>
      ))}
    </select>
  );
}