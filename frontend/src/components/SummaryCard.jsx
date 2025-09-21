// components/SummaryCard.jsx

export default function SummaryCard({ title, value, color }) {
  // Predefined color classes
  const presetColors = {
    blue: "text-blue-400 border-blue-500/30",
    green: "text-green-400 border-green-500/30",
    orange: "text-orange-400 border-orange-500/30",
    purple: "text-purple-400 border-purple-500/30",
    red: "text-red-400 border-red-500/30",
  };

  // Determine if the color is a preset or a custom hex
  const colorClass = presetColors[color] || "";

  const customStyle = /^#/.test(color)
    ? { borderColor: `${color}4D`, color } 
    : {};

  return (
    <div
      className={`bg-gray-900 border rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow duration-300 ${colorClass}`}
      style={customStyle}
    >
      <p className="text-sm font-medium text-gray-400">{title}</p>
      <p className="text-2xl font-bold mt-2">{value}</p>
    </div>
  );
}
