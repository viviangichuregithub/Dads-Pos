"use client";

import { useState, useEffect } from "react";
import { Plus, Trash2, Calendar, Wallet } from "lucide-react";
import axios from "axios";
import AdminNavbar from "../../../components/AdminNavbar";

export default function ExpensesPage() {
  const [expenses, setExpenses] = useState([]);
  const [date, setDate] = useState(new Date().toISOString().slice(0, 10));
  const [description, setDescription] = useState("");
  const [amount, setAmount] = useState("");
  const [total, setTotal] = useState(0);

  const fetchExpenses = async () => {
    try {
      const res = await axios.get(`/expenses/day?date=${date}`);
      setExpenses(res.data.expenses);
      setTotal(res.data.total);
    } catch (error) {
      console.error("Error fetching expenses:", error);
    }
  };

  useEffect(() => {
    fetchExpenses();
  }, [date]);

  const handleAddExpense = async () => {
    if (!description || !amount) {
      alert("Please enter both description and amount.");
      return;
    }
    try {
      await axios.post("/expenses/", { description, amount, date });
      setDescription("");
      setAmount("");
      fetchExpenses();
    } catch (error) {
      console.error("Error adding expense:", error);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to delete this expense?")) return;
    try {
      await axios.delete(`/expenses/${id}`);
      fetchExpenses();
    } catch (error) {
      console.error("Error deleting expense:", error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-950 text-gray-100">
      {/* Navbar */}
      <AdminNavbar />

      <main className="p-6 md:p-10 space-y-10">
        {/* Header */}
        <header className="bg-gray-900 rounded-xl p-6 shadow-lg border border-gray-800 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="flex items-center gap-3">
            <Wallet className="w-8 h-8 text-orange-400" />
            <div>
              <h1 className="text-3xl font-bold text-blue-500">Expenses</h1>
              <p className="text-gray-400 mt-1">Track and manage your daily expenses.</p>
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

        {/* Total */}
        <section className="bg-gray-900 rounded-xl p-6 shadow-lg border border-gray-800 flex items-center justify-between">
          <span className="text-lg font-medium text-gray-300">
            Total Expenses for {date}:
          </span>
          <span className="text-2xl font-bold text-orange-400">
            ${total.toFixed(2)}
          </span>
        </section>

        {/* Add Expense Form */}
        <section className="bg-gray-900 rounded-xl p-6 shadow-lg border border-gray-800 max-w-2xl">
          <h2 className="text-2xl font-semibold text-orange-400 mb-6">Add Expense</h2>
          <div className="flex flex-col md:flex-row gap-4 items-center">
            <input
              type="text"
              placeholder="Description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="flex-1 px-4 py-2 rounded-lg bg-gray-800 border border-gray-700 text-gray-100 placeholder-gray-400 focus:ring-2 focus:ring-blue-500 outline-none"
            />
            <input
              type="number"
              placeholder="Amount"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="w-32 px-4 py-2 rounded-lg bg-gray-800 border border-gray-700 text-gray-100 placeholder-gray-400 focus:ring-2 focus:ring-blue-500 outline-none"
            />
            <button
              onClick={handleAddExpense}
              className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-5 py-2 rounded-lg font-medium transition"
            >
              <Plus className="w-4 h-4" />
              Add
            </button>
          </div>
        </section>

        {/* Expenses List */}
        <section className="bg-gray-900 rounded-xl p-6 shadow-lg border border-gray-800">
          <h2 className="text-2xl font-semibold text-orange-400 mb-6">Expenses List</h2>
          <ul className="divide-y divide-gray-800">
            {expenses.length === 0 && (
              <li className="p-4 text-center text-gray-500 italic">
                No expenses for this day.
              </li>
            )}
            {expenses.map((exp) => (
              <li
                key={exp.id}
                className="flex justify-between items-center p-4 hover:bg-gray-800 transition-colors"
              >
                <div>
                  <p className="text-gray-100 font-medium">{exp.description}</p>
                  <p className="text-gray-500 text-sm">
                    {new Date(exp.created_at).toLocaleTimeString()}
                  </p>
                </div>
                <div className="flex items-center gap-4">
                  <span className="font-bold text-blue-500">
                    ${exp.amount.toFixed(2)}
                  </span>
                  <button
                    onClick={() => handleDelete(exp.id)}
                    className="p-2 rounded-lg hover:bg-red-900 text-red-500 transition"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              </li>
            ))}
          </ul>
        </section>
      </main>
    </div>
  );
}
