"use client";

import { useState, useEffect } from "react";
import { Wallet, Package, Calendar } from "lucide-react";
import StaffNavbar from "../../../components/StaffNavbar";
import { toast } from "react-hot-toast";
import api from "../../../lib/api";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts";
import { useAuth } from "../../../hooks/useAuth";

export default function StaffDashboard() {
  const { user, loading } = useAuth();
  const [date, setDate] = useState(new Date().toISOString().slice(0, 10));
  const [totalSales, setTotalSales] = useState(0);
  const [transactionsCount, setTransactionsCount] = useState(0);
  const [dailySalesData, setDailySalesData] = useState([]);
  const [dataLoading, setDataLoading] = useState(true);
  const dailyTarget = 50000;

  useEffect(() => {
    if (!loading && user?.role === "staff") fetchDashboardData();
  }, [date, user]);

  const fetchDashboardData = async () => {
    try {
      setDataLoading(true);
      const salesRes = await api.get("/sales/day", {
        params: { date, staff_id: user.id },
      });
      const salesData = salesRes.data.items || salesRes.data;

      setTotalSales(salesData.reduce((sum, s) => sum + s.total, 0));
      setTransactionsCount(salesData.length);

      const last7Days = [];
      for (let i = 6; i >= 0; i--) {
        const d = new Date();
        d.setDate(d.getDate() - i);
        const dayStr = d.toISOString().slice(0, 10);
        const res = await api.get("/sales/day", {
          params: { date: dayStr, staff_id: user.id },
        });
        const daySales = res.data.items || res.data;
        last7Days.push({
          date: dayStr,
          sales: daySales.reduce((sum, s) => sum + s.total, 0),
        });
      }
      setDailySalesData(last7Days);
    } catch (err) {
      console.error(err);
      toast.error("Failed to fetch dashboard data");
    } finally {
      setDataLoading(false);
    }
  };

  if (loading || dataLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-950">
        <p className="text-gray-400 text-lg animate-pulse">
          Loading dashboard...
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-950 text-gray-100">
      <StaffNavbar />
      <main className="p-6 md:p-10 space-y-10">
        {/* Header */}
        <header className="bg-gray-900 rounded-xl p-6 shadow-lg border border-gray-800 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="flex items-center gap-3">
            <Package className="w-8 h-8 text-blue-500" />
            <div>
              <h1 className="text-3xl font-bold text-blue-500">Dashboard</h1>
              <p className="text-gray-400 mt-1">
                Your sales and performance metrics.
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Calendar className="w-5 h-5 text-gray-400" />
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="px-3 py-2 rounded-lg bg-gray-800 border border-gray-700 text-gray-100 focus:ring-2 focus:ring-blue-500 outline-none"
            />
          </div>
        </header>

        {/* Summary Cards */}
        <section className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div className="bg-gray-900 p-6 rounded-xl shadow-lg border border-gray-800 flex flex-col items-start">
            <Wallet className="w-6 h-6 text-orange-400 mb-2" />
            <span className="text-gray-300">Total Sales Today</span>
            <span className="text-2xl font-bold text-orange-400">
              Ksh {totalSales.toFixed(2)}
            </span>
          </div>
          <div className="bg-gray-900 p-6 rounded-xl shadow-lg border border-gray-800 flex flex-col items-start">
            <Wallet className="w-6 h-6 text-blue-500 mb-2" />
            <span className="text-gray-300">Transactions Today</span>
            <span className="text-2xl font-bold text-blue-500">
              {transactionsCount}
            </span>
          </div>
        </section>

        {/* Daily Sales Target */}
        <section className="bg-gray-900 rounded-xl p-6 shadow-lg border border-gray-800">
          <h2 className="text-2xl font-semibold text-blue-500 mb-6">
            Daily Sales Target
          </h2>
          <div className="flex justify-center">
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie
                  data={[
                    { name: "Achieved", value: totalSales },
                    {
                      name: "Remaining",
                      value: Math.max(dailyTarget - totalSales, 0),
                    },
                  ]}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={90}
                  innerRadius={40}
                  fill="#8884d8"
                  label={({ name, percent }) =>
                    `${name}: ${(percent * 100).toFixed(0)}%`
                  }
                >
                  <Cell fill="#FFA500" /> {/* Achieved */}
                  <Cell fill="#FF4D4F" /> {/* Remaining */}
                </Pie>
                <Tooltip
                  formatter={(value) => `Ksh ${value.toLocaleString()}`}
                />
                <Legend verticalAlign="bottom" height={36} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </section>

        {/* Sales Last 7 Days */}
        <section className="bg-gray-900 rounded-xl p-6 shadow-lg border border-gray-800">
          <h2 className="text-2xl font-semibold text-blue-500 mb-4">
            Sales Last 7 Days
          </h2>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart
              data={dailySalesData}
              margin={{ top: 5, right: 30, left: 0, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#2d2d2d" />
              <XAxis dataKey="date" stroke="#8884d8" />
              <YAxis stroke="#8884d8" />
              <Tooltip />
              <Legend />
              <Line
                type="monotone"
                dataKey="sales"
                stroke="#FFA500"
                strokeWidth={2}
              />
            </LineChart>
          </ResponsiveContainer>
        </section>
      </main>
    </div>
  );
}
