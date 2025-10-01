<div style={{ display: "flex", flexWrap: "wrap", gap: "8px", marginTop: "8px" }}>
  {availableHours.map((hour) => (
    <button
      key={hour}
      onClick={() => handleSelect(hour)}
      style={{
        padding: "6px 12px",
        borderRadius: "6px",
        border: selectedHour === hour ? "2px solid #0070f3" : "1px solid #ccc",
        backgroundColor: selectedHour === hour ? "#0070f3" : "#f0f0f0", // 🔹 Cambio aquí
        color: "black", selectedHour === hour ? "#fff" : "#000",                 // 🔹 Texto visible
        cursor: "pointer",
      }}
    >
      {hour}
    </button>
  ))}
</div>
