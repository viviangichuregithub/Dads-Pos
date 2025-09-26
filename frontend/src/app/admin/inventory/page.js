"use client";

import { useState, useEffect } from "react";
import { useAuth } from "../../../hooks/useAuth";
import { useRouter } from "next/navigation";
import AdminNavbar from "../../../components/AdminNavbar";
import InventoryHeader from "../../../components/InventoryHeader";
import InventoryTable from "../../../components/InventoryTable";
import InventoryModal from "../../../components/InventoryModal";
import api from "../../../lib/api";
import { toast } from "react-hot-toast";
import { Package } from "lucide-react";

export default function InventoryPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [inventory, setInventory] = useState([]);
  const [dataLoading, setDataLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [form, setForm] = useState({ name: "", price: "", quantity: "" });
  const [editId, setEditId] = useState(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    if (!loading && (!user || user.role !== "admin")) {
      router.push("/auth/login");
    }
  }, [user, loading, router]);
  const fetchInventory = async (pageNum = 1) => {
    try {
      setDataLoading(true);
      const res = await api.get("/inventory/", {
        params: { name: search || undefined, page: pageNum, per_page: 10 },
      });
      setInventory(res.data.items);
      setPage(res.data.page);
      setTotalPages(res.data.pages);
    } catch (err) {
      console.error(err);
      toast.error("Failed to fetch inventory");
    } finally {
      setDataLoading(false);
    }
  };
  useEffect(() => {
    if (user?.role === "admin") fetchInventory(1);
  }, [user, search]);

  const handleAdd = () => {
    setForm({ name: "", price: "", quantity: "" });
    setEditId(null);
    setModalOpen(true);
  };

  const handleEdit = (item) => {
    setForm({ name: item.name, price: item.price, quantity: item.quantity });
    setEditId(item.id);
    setModalOpen(true);
  };
  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to delete this item?")) return;
    try {
      await api.delete(`/inventory/${id}`);
      toast.success("Item deleted successfully");
      fetchInventory(page);
    } catch (err) {
      console.error(err);
      toast.error("Failed to delete item");
    }
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editId) {
        await api.patch(`/inventory/${editId}`, form);
        toast.success("Item updated successfully");
      } else {
        await api.post("/inventory/", form);
        toast.success("Item added successfully");
      }
      setModalOpen(false);
      setForm({ name: "", price: "", quantity: "" });
      setEditId(null);
      fetchInventory(page);
    } catch (err) {
      console.error(err);
      toast.error("Operation failed");
    }
  };
  const handleInlineUpdate = async (id, data) => {
    try {
      await api.patch(`/inventory/${id}`, data);
      toast.success("Inventory updated");
      fetchInventory(page);
    } catch (err) {
      console.error(err);
      toast.error("Inline update failed");
    }
  };
  const handlePageChange = (newPage) => {
    if (newPage < 1 || newPage > totalPages) return;
    fetchInventory(newPage);
  };
  const handleImport = async (file) => {
    if (!file) return toast.error("Please select a file");
    const formData = new FormData();
    formData.append("file", file);
    try {
      await api.post("/inventory/import/excel", formData);
      toast.success("Inventory imported successfully");
      fetchInventory(page);
    } catch (err) {
      console.error(err);
      toast.error("Failed to import Excel");
    }
  };
  const handleExport = async (type) => {
    try {
      const res = await api.get(`/inventory/export/${type}`, { responseType: "blob" });
      const url = window.URL.createObjectURL(new Blob([res.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `inventory.${type === "excel" ? "xlsx" : "pdf"}`);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (err) {
      console.error(err);
      toast.error("Export failed");
    }
  };
  if (loading || dataLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-950">
        <p className="text-gray-400 text-lg animate-pulse">Loading inventory...</p>
      </div>
    );
  }
  return (
    <div className="min-h-screen bg-gray-950 text-gray-100">
      <AdminNavbar />
      <main className="p-6 md:p-10 space-y-6">
        <header className="bg-gray-900 rounded-xl p-6 shadow-lg border border-gray-800 flex items-center gap-3">
          <Package className="w-8 h-8 text-blue-500" />
          <div>
            <h1 className="text-3xl font-bold text-blue-500">Inventory Management</h1>
            <p className="text-gray-400 mt-1">Manage all your shoes here.</p>
          </div>
        </header>
        <InventoryHeader
          search={search}
          setSearch={setSearch}
          onAdd={handleAdd}
          onImport={handleImport}
          onExport={handleExport}
        />
        <div className="overflow-x-auto">
          <table className="min-w-full text-left border-collapse border border-gray-700">
            <thead className="bg-gray-800 text-gray-100">
              <tr>
                <th className="px-4 py-2 border border-gray-700">Name</th>
                <th className="px-4 py-2 border border-gray-700">Price</th>
                <th className="px-4 py-2 border border-gray-700">Quantity</th>
                <th className="px-4 py-2 border border-gray-700">Actions</th>
              </tr>
            </thead>
            <tbody className="text-gray-300">
              {inventory.map((item) => (
                <tr key={item.id} className="hover:bg-gray-800">
                  <td className="px-4 py-2 border border-gray-700">{item.name}</td>
                  <td className="px-4 py-2 border border-gray-700">Ksh {item.price}</td>
                  <td className="px-4 py-2 border border-gray-700">{item.quantity}</td>
                  <td className="px-4 py-2 border border-gray-700 flex flex-col sm:flex-row gap-2">
                    <button
                      className="px-2 py-1 bg-blue-600 hover:bg-blue-700 rounded text-white w-full sm:w-auto"
                      onClick={() => handleEdit(item)}
                    >
                      Edit
                    </button>
                    <button
                      className="px-2 py-1 bg-red-600 hover:bg-red-700 rounded text-white w-full sm:w-auto"
                      onClick={() => handleDelete(item.id)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="flex justify-center gap-2 mt-4 flex-wrap">
          <button
            className="px-3 py-1 bg-gray-800 rounded disabled:opacity-50"
            onClick={() => handlePageChange(page - 1)}
            disabled={page <= 1}
          >
            Prev
          </button>
          <span className="px-3 py-1">
            Page {page} of {totalPages}
          </span>
          <button
            className="px-3 py-1 bg-gray-800 rounded disabled:opacity-50"
            onClick={() => handlePageChange(page + 1)}
            disabled={page >= totalPages}
          >
            Next
          </button>
        </div>
        <InventoryModal
          isOpen={modalOpen}
          onClose={() => setModalOpen(false)}
          form={form}
          setForm={setForm}
          onSubmit={handleSubmit}
          editId={editId}
        />
      </main>
    </div>
  );
}
