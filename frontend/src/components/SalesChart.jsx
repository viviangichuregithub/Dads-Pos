// components/SalesChart.jsx
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

export default function SalesChart({ sales }) {
  const data = {
    labels: sales.map((s) => s.time),
    datasets: [
      {
        label: "Sales (KES)",
        data: sales.map((s) => s.amount),
        borderColor: "#3b82f6", // Tailwind blue-500
        backgroundColor: "rgba(59, 130, 246, 0.2)", // soft blue fill
        pointBackgroundColor: "#f59e0b", // amber-500 for points
        pointBorderColor: "#1f2937", // gray-900 (blend with bg)
        pointRadius: 5,
        pointHoverRadius: 7,
        tension: 0.4, // smooth curves
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        labels: {
          color: "#d1d5db", // text-gray-300
          font: {
            size: 14,
          },
        },
      },
      title: {
        display: true,
        text: "Daily Sales Trend",
        color: "#f59e0b", // orange-400
        font: {
          size: 18,
          weight: "bold",
        },
      },
      tooltip: {
        backgroundColor: "#111827", // gray-900
        titleColor: "#f3f4f6", // gray-100
        bodyColor: "#d1d5db", // gray-300
        borderColor: "#374151", // gray-700
        borderWidth: 1,
      },
    },
    scales: {
      x: {
        ticks: {
          color: "#9ca3af", // gray-400
        },
        grid: {
          color: "rgba(75, 85, 99, 0.2)", // gray-600 with opacity
        },
      },
      y: {
        ticks: {
          color: "#9ca3af",
        },
        grid: {
          color: "rgba(75, 85, 99, 0.2)",
        },
      },
    },
  };

  return (
    <div className="h-96">
      <Line data={data} options={options} />
    </div>
  );
}
