import React from "react";

const Watermark: React.FC = () => {
  const copies = Array.from({ length: 6 });
  return (
    <div
      aria-hidden
      style={{ pointerEvents: "none" }}
      className="fixed inset-0 z-[60] flex items-center justify-center overflow-hidden"
    >
      {copies.map((_, i) => (
        <span
          key={i}
          style={{
            position: "absolute",
            left: `${(i % 3) * 33 + 5}%`,
            top: `${Math.floor(i / 3) * 45 + 5}%`,
            transform: "rotate(-30deg)",
            fontSize: "4.5rem",
            color: "#111",
            opacity: 0.06,
            fontWeight: 700,
            whiteSpace: "nowrap",
            userSelect: "none",
          }}
        >
          Kase Brothers
        </span>
      ))}
    </div>
  );
};

export default Watermark;
