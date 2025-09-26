"use client";

import { useState, useEffect } from "react";
import { Plus, Trash2, Wallet, Calendar } from "lucide-react";
import StaffNavbar from "../../../components/StaffNavbar";
import { toast } from "react-hot-toast";
import api from "../../../lib/api";
import { useAuth } from "../../../hooks/useAuth";

export default function StaffSalesPage() {
  const { user, loading: authLoading } = useAuth();
  const [sales, setSales] = useState([]);
  const [inventory, setInventory] = useState([]);
  const [dataLoading, setDataLoading] = useState(true);
  const [saleItems, setSaleItems] = useState([{ inventory_id: "", quantity: 1 }]);
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split("T")[0]);
  const [page, setPage] = useState(1);
  const [perPage] = useState(10);
  const [totalPages, setTotalPages] = useState(1);
  const [totalSales, setTotalSales] = useState(0);
  const fetchInventory = async () => {
    try {
      const res = await api.get("/inventory/", { params: { page: 1, per_page: 100 } });
      setInventory(res.data.items || res.data);
    } catch (err) {
      console.error(err);
      toast.error("Failed to fetch inventory");
    }
  };
  const fetchSales = async (pageNum = 1, date = selectedDate) => {
    try {
      setDataLoading(true);
      if (!user) return;
      const res = await api.get("/sales/day", {
        params: { date, page: pageNum, per_page: perPage, staff_id: user.id },
      });
      const fetchedSales = res.data.items || res.data;
      setSales(fetchedSales);
      setPage(res.data.page || pageNum);
      setTotalPages(res.data.pages || 1);
      const total = fetchedSales.reduce((sum, sale) => sum + sale.total, 0);
      setTotalSales(total);
    } catch (err) {
      console.error(err);
      toast.error("Failed to fetch sales");
    } finally {
      setDataLoading(false);
    }
  };
  useEffect(() => {
    if (!authLoading && user) {
      fetchInventory();
      fetchSales(1, selectedDate);
    }
  }, [user]);
  useEffect(() => {
    if (user) fetchSales(1, selectedDate);
  }, [selectedDate, user]);
  const handleDateChange = (e) => setSelectedDate(e.target.value);
  const handleItemChange = (index, field, value) => {
    const newItems = [...saleItems];
    newItems[index][field] = field === "quantity" ? parseInt(value) : value;
    setSaleItems(newItems);
  };
  const addSaleItemRow = () => setSaleItems([...saleItems, { inventory_id: "", quantity: 1 }]);
  const removeSaleItemRow = (index) => setSaleItems(saleItems.filter((_, i) => i !== index));
  const handleSubmitSale = async (e) => {
    e.preventDefault();
    try {
      const payload = saleItems.map((item) => ({ ...item, staff_id: user.id }));
      await api.post("/sales/", payload);
      toast.success("Sale recorded!");
      setSaleItems([{ inventory_id: "", quantity: 1 }]);
      fetchSales(page, selectedDate); 
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.error || "Failed to create sale");
    }
  };
  const handlePageChange = (newPage) => {
    if (newPage < 1 || newPage > totalPages) return;
    fetchSales(newPage, selectedDate);
  };
  if (authLoading || dataLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-950">
        <p className="text-gray-400 text-lg animate-pulse">Loading sales...</p>
      </div>
    );
  }
  return (
    <div className="min-h-screen bg-gray-950 text-gray-100">
      <StaffNavbar />
      <main className="p-6 md:p-10 space-y-10">
        <header className="bg-gray-900 rounded-xl p-6 shadow-lg border border-gray-800 flex items-center gap-3">
          <Wallet className="w-8 h-8 text-orange-400" />
          <div>
            <h1 className="text-3xl font-bold text-blue-500">Sales</h1>
            <p className="text-gray-400 mt-1">Record and view your sales for a specific day.</p>
          </div>
        </header>
        <section className="flex items-center gap-3">
          <Calendar className="w-5 h-5 text-gray-400" />
          <input
            type="date"
            value={selectedDate}
            onChange={handleDateChange}
            className="px-3 py-2 rounded-lg bg-gray-800 border border-gray-700 text-gray-100"
          />
        </section>
        <section className="bg-gray-900 rounded-xl p-6 shadow-lg border border-gray-800 max-w-2xl flex justify-between items-center">
          <span className="text-gray-300">Total Sales for {selectedDate}:</span>
          <span className="text-2xl font-bold text-orange-400">Ksh {totalSales.toFixed(2)}</span>
        </section>
        <section className="bg-gray-900 rounded-xl p-6 shadow-lg border border-gray-800 max-w-2xl">
          <h2 className="text-2xl font-semibold text-orange-400 mb-6 flex items-center gap-2">
            <Plus className="w-5 h-5" /> Record New Sale
          </h2>
          <form className="space-y-4" onSubmit={handleSubmitSale}>
            {saleItems.map((item, index) => (
              <div key={index} className="flex gap-3 items-center">
                <select
                  value={item.inventory_id}
                  onChange={(e) => handleItemChange(index, "inventory_id", e.target.value)}
                  className="flex-1 px-4 py-2 rounded-lg bg-gray-800 border border-gray-700 text-gray-100"
                  required
                >
                  <option value="">Select item</option>
                  {inventory.map((inv) => (
                    <option key={inv.id} value={inv.id}>
                      {inv.name} (Stock: {inv.quantity})
                    </option>
                  ))}
                </select>
                <input
                  type="number"
                  min="1"
                  value={item.quantity}
                  onChange={(e) => handleItemChange(index, "quantity", e.target.value)}
                  className="w-24 px-4 py-2 rounded-lg bg-gray-800 border border-gray-700 text-gray-100"
                  required
                />
                {saleItems.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeSaleItemRow(index)}
                    className="p-2 rounded-lg hover:bg-red-900 text-red-500"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
              </div>
            ))}
            <div className="flex gap-2">
              <button type="button" onClick={addSaleItemRow} className="px-4 py-2 bg-blue-600 rounded-lg hover:bg-blue-700">
                Add Another Item
              </button>
              <button type="submit" className="px-4 py-2 bg-green-600 rounded-lg hover:bg-green-700">
                Submit Sale
              </button>
            </div>
          </form>
        </section>
        <section className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {sales.length === 0 && (
            <p className="text-gray-400 text-center col-span-full">No sales found for this date.</p>
          )}
          {sales.map((sale) => (
            <div key={sale.id} className="bg-gray-900 p-4 rounded-xl shadow-md border border-gray-800">
              <p className="text-gray-300 mb-1">
                Total: <span className="font-bold text-orange-400">Ksh {sale.total.toFixed(2)}</span>
              </p>
              <p className="text-gray-400 text-sm mb-2">
                Date: {new Date(sale.created_at).toLocaleString()}
              </p>
              <div>
                <h4 className="font-medium text-gray-300 mb-1">Items:</h4>
                <ul className="text-gray-400 text-sm list-disc ml-5">
                  {sale.items.map((item) => (
                    <li key={item.inventory_id}>
                      Inventory #{item.inventory_id}: {item.quantity} x Ksh {item.price.toFixed(2)}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </section>
        <div className="flex justify-center gap-2 mt-4">
          <button
            className="px-3 py-1 bg-gray-800 rounded"
            onClick={() => handlePageChange(page - 1)}
            disabled={page <= 1}
          >
            Prev
          </button>
          <span className="px-3 py-1">
            Page {page} of {totalPages}
          </span>
          <button
            className="px-3 py-1 bg-gray-800 rounded"
            onClick={() => handlePageChange(page + 1)}
            disabled={page >= totalPages}
          >
            Next
          </button>
        </div>
      </main>
    </div>
  );
}
