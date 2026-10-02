export default function CoachAvatar({ name, color, initials, size = 64 }) {
  return (
    <div
      className="rounded-full flex items-center justify-center font-display shrink-0"
      style={{
        width: size,
        height: size,
        backgroundColor: color || "#d9712e",
        fontSize: size * 0.38,
        color: "#0b0b0b",
      }}
    >
      {initials || name?.[0]?.toUpperCase() || "?"}
    </div>
  );
}
