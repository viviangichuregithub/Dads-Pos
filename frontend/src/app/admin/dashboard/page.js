"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "../../../hooks/useAuth";
import AdminNavbar from "../../../components/AdminNavbar";
import SummaryCard from "../../../components/SummaryCard";
import SalesChart from "../../../components/SalesChart";
import api from "@/lib/api";
import { Package, BarChart3 } from "lucide-react";

export default function AdminDashboard() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [sales, setSales] = useState([]);
  const [inventory, setInventory] = useState([]);
  const [dataLoading, setDataLoading] = useState(true);

  // Redirect non-admins
  useEffect(() => {
    if (!loading && (!user || user.role !== "admin")) {
      router.push("/auth/login");
    }
  }, [user, loading, router]);

  // Fetch sales and inventory data
  useEffect(() => {
    async function loadData() {
      try {
        const [salesRes, inventoryRes] = await Promise.all([
          api.get("/sales/today"),
          api.get("/inventory?page=1&per_page=100"), // get inventory summary
        ]);
        setSales(salesRes.data);
        setInventory(inventoryRes.data.items || []);
      } catch (err) {
        console.error("Error fetching dashboard data:", err);
      } finally {
        setDataLoading(false);
      }
    }

    if (user?.role === "admin") loadData();
  }, [user]);

  if (loading || dataLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-950">
        <p className="text-gray-400 text-lg animate-pulse">
          Loading dashboard...
        </p>
      </div>
    );
  }

  // Sales stats
  const totalSales = sales.reduce((sum, s) => sum + s.amount, 0);
  const cashSales = sales.filter((s) => s.payment_method === "cash").reduce((sum, s) => sum + s.amount, 0);
  const tillSales = sales.filter((s) => s.payment_method === "mpesa").reduce((sum, s) => sum + s.amount, 0);
  const paybillSales = sales.filter((s) => s.payment_method === "paybill").reduce((sum, s) => sum + s.amount, 0);

  // Inventory stats
  const totalInventory = inventory.reduce((sum, i) => sum + i.quantity, 0);

  return (
    <div className="min-h-screen bg-gray-950 text-gray-100">
      <AdminNavbar />

      <main className="p-6 md:p-10 space-y-10">
        {/* Welcome Header */}
        <header className="bg-gray-900 rounded-xl p-6 shadow-lg border border-gray-800 flex items-center gap-3 transition-transform duration-200 hover:scale-[1.01]">
          <div>
            <h1 className="text-3xl font-bold text-blue-500">
              Welcome, {user?.name}👋
            </h1>
            <p className="text-gray-400 mt-1">
              Here’s what’s happening in your store today.
            </p>
          </div>
        </header>

        {/* Summary Cards */}
        <section>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-6">
            <SummaryCard title="Total Sales" value={`KES ${totalSales}`} color="green" />
            <SummaryCard title="Cash Sales" value={`KES ${cashSales}`} color="orange" />
            <SummaryCard title="Till Sales" value={`KES ${tillSales}`} color="purple" />
            <SummaryCard title="Paybill Sales" value={`KES ${paybillSales}`} color="blue" />
            <SummaryCard title="Total Inventory" value={totalInventory} color="teal" />
          </div>
        </section>

        {/* Inventory Summary (Dashboard only) */}
        <section className="bg-gray-900 rounded-xl p-6 shadow-lg border border-gray-800">
          <div className="flex items-center gap-3 mb-4">
            <Package className="w-6 h-6 text-orange-400" />
            <h2 className="text-2xl font-semibold text-orange-400">
              Inventory Overview
            </h2>
          </div>

          <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {inventory.map((item) => (
              <div
                key={item.id}
                className={`bg-gray-800 p-3 rounded-lg border transition-colors duration-200 ${
                  item.quantity < 5
                    ? "border-red-500"
                    : "border-gray-700"
                }`}
              >
                <p className="font-medium text-gray-200">{item.name}</p>
                <p
                  className={`text-sm mt-1 ${
                    item.quantity < 5 ? "text-red-400" : "text-gray-400"
                  }`}
                >
                  Quantity: {item.quantity}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* Sales Chart */}
        <section className="bg-gray-900 rounded-xl p-6 shadow-lg border border-gray-800 transition-transform duration-200 hover:scale-[1.01]">
          <div className="flex items-center gap-3 mb-6">
            <BarChart3 className="w-6 h-6 text-orange-400" />
            <h2 className="text-2xl font-semibold text-orange-400">
              Sales Chart (Today)
            </h2>
          </div>
          <SalesChart sales={sales} />
        </section>
      </main>
    </div>
  );
}
