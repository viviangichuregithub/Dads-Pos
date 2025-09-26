"use client";

import { useState, useEffect } from "react";
import { Wallet, Package, Calendar, Box } from "lucide-react";
import { useAuth } from "../../../hooks/useAuth";
import { useRouter } from "next/navigation";
import AdminNavbar from "../../../components/AdminNavbar";
import { toast } from "react-hot-toast";
import api from "../../../lib/api";
import { PieChart, Pie, Cell, Tooltip, Legend, LineChart, Line, XAxis, YAxis, CartesianGrid, ResponsiveContainer } from "recharts";

export default function DashboardPage() {
  const { user, loading } = useAuth();
  const router = useRouter();

  const [date, setDate] = useState(new Date().toISOString().slice(0, 10));
  const [totalSales, setTotalSales] = useState(0);
  const [totalExpenses, setTotalExpenses] = useState(0);
  const [inventoryCount, setInventoryCount] = useState(0);
  const [itemsSoldToday, setItemsSoldToday] = useState(0);
  const [dailyData, setDailyData] = useState([]); 
  const [dataLoading, setDataLoading] = useState(true);

  
  useEffect(() => {
    if (!loading && (!user || user.role !== "admin")) {
      router.push("/auth/login");
    }
  }, [user, loading, router]);

  const fetchDashboardData = async () => {
    try {
      setDataLoading(true);

      // Inventory
      const invRes = await api.get("/inventory/");
      const inventoryData = invRes.data.items || invRes.data;
      setInventoryCount(inventoryData.reduce((sum, item) => sum + item.quantity, 0));

      // Today's sales
      const salesRes = await api.get("/sales/day", { params: { date } });
      const salesData = salesRes.data.items || salesRes.data;
      const totalSalesToday = salesData.reduce((sum, sale) => sum + sale.total, 0);
      setTotalSales(totalSalesToday);

      // Total items sold today
      const totalItemsSold = salesData.reduce((sum, sale) => {
        const saleItemsQty = sale.items?.reduce((s, item) => s + item.quantity, 0) || 0;
        return sum + saleItemsQty;
      }, 0);
      setItemsSoldToday(totalItemsSold);

      // Total expenses today
      const expRes = await api.get("/expenses/day", { params: { date } });
      const expData = expRes.data.expenses || expRes.data;
      const totalExpensesToday = expData.reduce((sum, exp) => sum + parseFloat(exp.amount), 0);
      setTotalExpenses(totalExpensesToday);

      // Last 7 days data
      const last7Days = [];
      for (let i = 6; i >= 0; i--) {
        const d = new Date();
        d.setDate(d.getDate() - i);
        const dayStr = d.toISOString().slice(0, 10);

        const salesRes = await api.get("/sales/day", { params: { date: dayStr } });
        const salesDay = salesRes.data.items || salesRes.data;
        const totalSalesDay = salesDay.reduce((sum, s) => sum + s.total, 0);

        const expRes = await api.get("/expenses/day", { params: { date: dayStr } });
        const expensesDay = expRes.data.expenses || expRes.data;
        const totalExpensesDay = expensesDay.reduce((sum, e) => sum + parseFloat(e.amount), 0);

        last7Days.push({
          date: dayStr,
          sales: totalSalesDay,
          expenses: totalExpensesDay,
        });
      }
      setDailyData(last7Days);

    } catch (err) {
      console.error(err);
      toast.error("Failed to fetch dashboard data");
    } finally {
      setDataLoading(false);
    }
  };

  useEffect(() => {
    if (user?.role === "admin") fetchDashboardData();
  }, [user, date]);

  if (loading || dataLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-950">
        <p className="text-gray-400 text-lg animate-pulse">Loading dashboard...</p>
      </div>
    );
  }

  const pieDataSales = [
    { name: "Sales", value: totalSales },
    { name: "Expenses", value: totalExpenses },
  ];
  const COLORS_SALES = ["#FB923C", "#FF4D4F"];

  const pieDataStock = [
    { name: "Items Sold Today", value: itemsSoldToday },
    { name: "Remaining Inventory", value: inventoryCount },
  ];
  const COLORS_STOCK = ["#FB923C ", "#3B82F6"];

  return (
    <div className="min-h-screen bg-gray-950 text-gray-100">
      <AdminNavbar />
      <main className="p-6 md:p-10 space-y-10">
        <header className="bg-gray-900 rounded-xl p-6 shadow-lg border border-gray-800 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="flex items-center gap-3">
            <Package className="w-8 h-8 text-blue-500" />
            <div>
              <h1 className="text-3xl font-bold text-blue-500">Dashboard</h1>
              <p className="text-gray-400 mt-1">Visualize your business metrics.</p>
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
        <section className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          <div className="bg-gray-900 p-6 rounded-xl shadow-lg border border-gray-800 flex flex-col items-start">
            <Wallet className="w-6 h-6 text-orange-400 mb-2" />
            <span className="text-gray-300">Total Sales Today</span>
            <span className="text-2xl font-bold text-orange-400">Ksh {totalSales.toFixed(2)}</span>
          </div>
          <div className="bg-gray-900 p-6 rounded-xl shadow-lg border border-gray-800 flex flex-col items-start">
            <Wallet className="w-6 h-6 text-red-500 mb-2" />
            <span className="text-gray-300">Total Expenses Today</span>
            <span className="text-2xl font-bold text-red-500">Ksh {totalExpenses.toFixed(2)}</span>
          </div>
          <div className="bg-gray-900 p-6 rounded-xl shadow-lg border border-gray-800 flex flex-col items-start">
            <Box className="w-6 h-6 text-blue-500 mb-2" />
            <span className="text-gray-300">Inventory Count</span>
            <span className="text-2xl font-bold text-blue-500">{inventoryCount}</span>
          </div>
        </section>
<section className="flex flex-col md:flex-row gap-6">
  {/* Sales vs Expenses */}
  <div className="flex-1 bg-gray-900 rounded-xl p-6 shadow-lg border border-gray-800">
    <h2 className="text-2xl font-semibold text-blue-500 mb-4">Sales vs Expenses Today</h2>
    <ResponsiveContainer width="100%" height={250}>
      <PieChart>
        <Pie
          data={pieDataSales}
          dataKey="value"
          nameKey="name"
          cx="50%"
          cy="50%"
          outerRadius={80}
          fill="#8884d8"
          label
        >
          {pieDataSales.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={COLORS_SALES[index % COLORS_SALES.length]} />
          ))}
        </Pie>
        <Tooltip />
        <Legend />
      </PieChart>
    </ResponsiveContainer>
  </div>
  <div className="flex-1 bg-gray-900 rounded-xl p-6 shadow-lg border border-gray-800">
    <h2 className="text-2xl font-semibold text-blue-500 mb-4">Stock Comparison</h2>
    <ResponsiveContainer width="100%" height={250}>
      <PieChart>
        <Pie
          data={pieDataStock}
          dataKey="value"
          nameKey="name"
          cx="50%"
          cy="50%"
          outerRadius={80}
          fill="#8884d8"
          label
        >
          {pieDataStock.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={COLORS_STOCK[index % COLORS_STOCK.length]} />
          ))}
        </Pie>
        <Tooltip />
        <Legend />
      </PieChart>
    </ResponsiveContainer>
  </div>
  <div className="flex-1 bg-gray-900 rounded-xl p-6 shadow-lg border border-gray-800">
    <h2 className="text-2xl font-semibold text-blue-500 mb-4">Daily Sales Target</h2>
    <ResponsiveContainer width="100%" height={250}>
      <PieChart>
        <Pie
          data={[
            { name: "Achieved", value: totalSales },
            { name: "Remaining", value: Math.max(70000 - totalSales, 0) }
          ]}
          dataKey="value"
          nameKey="name"
          cx="50%"
          cy="50%"
          outerRadius={80}  
          fill="#8884d8"
          label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
        >
          <Cell fill="#FB923C" /> 
          <Cell fill="#3B82F6" /> 
        </Pie>
        <Tooltip formatter={(value) => `Ksh ${value.toLocaleString()}`} />
        <Legend verticalAlign="bottom" height={36} />
      </PieChart>
    </ResponsiveContainer>
  </div>
</section>
        <section className="bg-gray-900 rounded-xl p-6 shadow-lg border border-gray-800">
          <h2 className="text-2xl font-semibold text-blue-500 mb-4">Sales & Expenses Last 7 Days</h2>
          <ResponsiveContainer width="100%" height={300}>
  <LineChart 
    data={dailyData} 
    margin={{ top: 5, right: 30, left: 0, bottom: 5 }}
  >
    <CartesianGrid 
      strokeDasharray="3 3" 
      stroke="#433b3bff" 
    />
    <XAxis dataKey="date" stroke="#3B82F6" />
    <YAxis stroke="#3B82F6" />
    <Tooltip 
      contentStyle={{ backgroundColor: "#111827" }}
      itemStyle={{ color: "#f9fafb" }}
      labelStyle={{ color: "#93c5fd" }}
    />
    <Legend wrapperStyle={{ color: "#f9fafb" }} />

    <Line type="monotone" dataKey="sales" stroke="#FB923C" strokeWidth={2} />
    <Line type="monotone" dataKey="expenses" stroke="#FF4D4F" strokeWidth={2} />
  </LineChart>
</ResponsiveContainer>
        </section>
      </main>
    </div>
  );
}
