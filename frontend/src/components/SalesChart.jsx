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
        borderColor: "#3b82f6", 
        backgroundColor: "rgba(59, 130, 246, 0.2)", 
        pointBackgroundColor: "#f59e0b", 
        pointBorderColor: "#1f2937", 
        pointRadius: 5,
        pointHoverRadius: 7,
        tension: 0.4, 
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        labels: {
          color: "#d1d5db",
          font: {
            size: 14,
          },
        },
      },
      title: {
        display: true,
        text: "Daily Sales Trend",
        color: "#f59e0b", 
        font: {
          size: 18,
          weight: "bold",
        },
      },
      tooltip: {
        backgroundColor: "#111827",
        titleColor: "#f3f4f6",
        bodyColor: "#d1d5db", 
        borderColor: "#374151", 
        borderWidth: 1,
      },
    },
    scales: {
      x: {
        ticks: {
          color: "#9ca3af", 
        },
        grid: {
          color: "rgba(75, 85, 99, 0.2)", 
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
