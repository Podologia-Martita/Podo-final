// ProfessionalSelect.jsx
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
        .order("name");

      if (error) {
        setErrorMsg(error.message);
      } else {
        setProfessionals(data || []);
      }
      setLoading(false);
    };

    fetchProfessionals();
  }, []);

  if (loading) return <p>Cargando profesionales...</p>;
  if (errorMsg) return <p style={{ color: "red" }}>Error: {errorMsg}</p>;

  return (
    <select
      onChange={(e) => {
        const selected = professionals.find((p) => p.id === e.target.value);
        onSelect(selected ? { id: selected.id, name: selected.name } : null);
      }}
    >
      <option value="">-- Selecciona profesional --</option>
      {professionals.map((pro) => (
        <option key={pro.id} value={pro.id}>
          {pro.name}
        </option>
      ))}
    </select>
  );
}
