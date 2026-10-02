export default function Card({ children, className = "", highlight = false }) {
  return (
    <div
      className={`bg-den-card border ${
        highlight ? "border-den-orange" : "border-white/10"
      } rounded-lg p-5 ${className}`}
    >
      {children}
    </div>
  );
}
