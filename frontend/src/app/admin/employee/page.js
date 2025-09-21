"use client";

import { useState, useEffect } from "react";
import { useAuth } from "../../../hooks/useAuth";
import { useRouter } from "next/navigation";
import Navbar from "../../../components/AdminNavbar";
import api from "../../../lib/api";
import { Users, ClipboardList } from "lucide-react"; 

export default function EmployeesPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [employees, setEmployees] = useState([]);
  const [dataLoading, setDataLoading] = useState(true);
  const [form, setForm] = useState({ name: "", phone_number: "", gender: "Male" });
  const [editId, setEditId] = useState(null);
  const [error, setError] = useState("");

  // Redirect non-admins
  useEffect(() => {
    if (!loading && (!user || user.role !== "admin")) {
      router.push("/auth/login");
    }
  }, [user, loading, router]);

  // Fetch employees
  const fetchEmployees = async () => {
    try {
      setDataLoading(true);
      const res = await api.get("/employees/");
      setEmployees(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setDataLoading(false);
    }
  };

  useEffect(() => {
    if (user?.role === "admin") fetchEmployees();
  }, [user]);

  // Handle form changes
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // Handle add or update employee
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      if (editId) {
        await api.put(`/employees/${editId}`, form);
        setEditId(null);
      } else {
        await api.post("/employees/", form);
      }
      setForm({ name: "", phone_number: "", gender: "Male" });
      fetchEmployees();
    } catch (err) {
      const msg = err.response?.data?.error || "Operation failed";
      setError(msg);
    }
  };

  // Edit employee
  const handleEdit = (employee) => {
    setForm({
      name: employee.name,
      phone_number: employee.phone_number,
      gender: employee.gender,
    });
    setEditId(employee.id);
  };

  // Delete employee
  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to delete this employee?")) return;
    try {
      await api.delete(`/employees/${id}`);
      fetchEmployees();
    } catch (err) {
      console.error(err);
    }
  };

  if (loading || dataLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-950">
        <p className="text-gray-400 text-lg animate-pulse">Loading employees...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-950 text-gray-100">
      <Navbar />

      <main className="p-6 md:p-10 space-y-10">
        {/* Page Header */}
        <header className="bg-gray-900 rounded-xl p-6 shadow-lg border border-gray-800 flex items-center gap-3">
          <Users className="w-8 h-8 text-blue-500" /> 
          <div>
            <h1 className="text-3xl font-bold text-blue-500">Employees</h1>
            <p className="text-gray-400 mt-1">Manage your staff records here.</p>
          </div>
        </header>

        {/* Form for Add / Edit */}
        <section className="bg-gray-900 rounded-xl p-6 shadow-lg border border-gray-800 max-w-lg">
          <h2 className="text-2xl font-semibold text-orange-400 mb-6">
            {editId ? "Update Employee" : "Add Employee"}
          </h2>
          {error && <p className="text-red-500 mb-4">{error}</p>}
          <form onSubmit={handleSubmit} className="space-y-4">
            <input
              type="text"
              name="name"
              placeholder="Full Name"
              value={form.name}
              onChange={handleChange}
              className="w-full px-3 py-2 rounded-lg bg-gray-800 border border-gray-700 text-gray-100 placeholder-gray-400 focus:ring-2 focus:ring-blue-500 outline-none"
              required
            />
            <input
              type="text"
              name="phone_number"
              placeholder="Phone Number"
              value={form.phone_number}
              onChange={handleChange}
              className="w-full px-3 py-2 rounded-lg bg-gray-800 border border-gray-700 text-gray-100 placeholder-gray-400 focus:ring-2 focus:ring-blue-500 outline-none"
              required
            />
            <select
              name="gender"
              value={form.gender}
              onChange={handleChange}
              className="w-full px-3 py-2 rounded-lg bg-gray-800 border border-gray-700 text-gray-100 focus:ring-2 focus:ring-blue-500 outline-none"
              required
            >
              <option value="Male">Male</option>
              <option value="Female">Female</option>
            </select>
            <button
              type="submit"
              className={`w-full px-4 py-2 rounded-lg text-white font-medium transition ${
                editId
                  ? "bg-yellow-500 hover:bg-yellow-600"
                  : "bg-blue-600 hover:bg-blue-700"
              }`}
            >
              {editId ? "Update Employee" : "Add Employee"}
            </button>
          </form>
        </section>

        {/* Employees Table */}
        <section className="bg-gray-900 rounded-xl p-6 shadow-lg border border-gray-800">
          <div className="flex items-center gap-3 mb-6">
            <ClipboardList className="w-6 h-6 text-orange-400" /> 
            <h2 className="text-2xl font-semibold text-orange-400">Employee List</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full table-auto border-collapse">
              <thead>
                <tr className="bg-gray-800 text-left text-gray-300">
                  <th className="px-4 py-3 border-b border-gray-700">Name</th>
                  <th className="px-4 py-3 border-b border-gray-700">Phone</th>
                  <th className="px-4 py-3 border-b border-gray-700">Gender</th>
                  <th className="px-4 py-3 border-b border-gray-700">Actions</th>
                </tr>
              </thead>
              <tbody>
                {employees.length > 0 ? (
                  employees.map((e) => (
                    <tr
                      key={e.id}
                      className="hover:bg-gray-800 transition-colors border-b border-gray-700"
                    >
                      <td className="px-4 py-3">{e.name}</td>
                      <td className="px-4 py-3">{e.phone_number}</td>
                      <td className="px-4 py-3">{e.gender}</td>
                      <td className="px-4 py-3 space-x-2">
                        <button
                          onClick={() => handleEdit(e)}
                          className="bg-green-500 text-white px-3 py-1 rounded-lg hover:bg-green-600 transition"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(e.id)}
                          className="bg-red-600 text-white px-3 py-1 rounded-lg hover:bg-red-800 transition"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan="4"
                      className="text-center py-6 text-gray-500 italic"
                    >
                      No employees found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </section>
      </main>
    </div>
  );
}
