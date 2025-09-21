"use client";

import { useState, useEffect } from "react";
import { toast } from "react-hot-toast";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import { ClipboardList } from "lucide-react";
import api from "@/lib/api";
import "../styles/calendar.css";

export default function InventoryAudit() {
  const [auditDate, setAuditDate] = useState(new Date());
  const [auditData, setAuditData] = useState({ total: 0, by_action: {}, logs: [] });

  // ✅ Helper: format date in LOCAL timezone (YYYY-MM-DD)
  const formatDateLocal = (date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  // ✅ Helper: format timestamp to Kenya local time
  const formatTimeLocal = (timestamp) => {
    return new Date(timestamp).toLocaleTimeString("en-KE", { hour12: false });
  };

  const fetchAuditLogs = async (date) => {
    try {
      const formattedDate = formatDateLocal(date); // use local, not UTC
      const res = await api.get(`/settings/inventory-audit?date=${formattedDate}`);
      setAuditData(res.data);
    } catch (err) {
      console.error(err);
      toast.error("Failed to load audit logs");
    }
  };

  useEffect(() => {
    fetchAuditLogs(auditDate);
  }, [auditDate]);

  return (
    <section className="bg-gray-900 p-6 rounded-xl shadow-lg space-y-6">
      <h2 className="text-xl font-semibold text-blue-500 flex items-center gap-2">
        <ClipboardList /> Inventory Audit Trail
      </h2>

      {/* Calendar */}
      <div className="max-w-sm">
        <Calendar
          onChange={setAuditDate}
          value={auditDate}
          className="react-calendar"
          tileClassName={({ date, view }) => {
            if (view === "month") {
              if (date.toDateString() === auditDate.toDateString()) {
                return "selected-date"; // use CSS class
              }
              return "hover-date"; // use CSS class
            }
            return null;
          }}
        />
      </div>

      {/* Summary */}
      <div className="bg-gray-800 rounded-lg p-4 shadow-md">
        <p className="text-gray-200">
          <span className="font-semibold text-orange-400">Date:</span>{" "}
          {auditData.date || formatDateLocal(auditDate)}
        </p>
        <p className="text-gray-200">
          <span className="font-semibold text-orange-400">Total Actions:</span>{" "}
          {auditData.total}
        </p>
        <div className="flex gap-4 mt-2">
          {Object.entries(auditData.by_action).map(([action, count]) => (
            <span
              key={action}
              className="bg-gray-700 px-3 py-1 rounded-lg text-sm text-gray-200"
            >
              {action}: {count}
            </span>
          ))}
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        {/* Table - only visible on md+ screens */}
        <div className="hidden md:block overflow-x-auto">
          <table className="w-full table-auto border-collapse mt-4">
            <thead>
              <tr className="bg-gray-800 text-left text-gray-300">
                <th className="px-4 py-2">Time</th>
                <th className="px-4 py-2">User</th>
                <th className="px-4 py-2">Item</th>
                <th className="px-4 py-2">Action</th>
                <th className="px-4 py-2">Field</th>
                <th className="px-4 py-2">Old</th>
                <th className="px-4 py-2">New</th>
              </tr>
            </thead>
            <tbody>
              {auditData.logs.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-4 py-2 text-gray-400 text-center">
                    No audit logs for this date.
                  </td>
                </tr>
              ) : (
                auditData.logs.map((log) => (
                  <tr key={log.id} className="border-b border-gray-700">
                    <td className="px-4 py-2">{formatTimeLocal(log.timestamp)}</td>
                    <td className="px-4 py-2">{log.user_name}</td>
                    <td className="px-4 py-2 font-medium text-orange-300">
                      {log.inventory_name}
                    </td>
                    <td className="px-4 py-2">{log.action}</td>
                    <td className="px-4 py-2">{log.field_changed}</td>
                    <td className="px-4 py-2 text-red-400">{log.old_value}</td>
                    <td className="px-4 py-2 text-green-400">{log.new_value}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Mobile Card View - visible only on small screens */}
        <div className="md:hidden space-y-4">
          {auditData.logs.length === 0 ? (
            <p className="text-gray-400 text-center">No audit logs for this date.</p>
          ) : (
            auditData.logs.map((log) => (
              <div
                key={log.id}
                className="bg-gray-800 p-4 rounded-lg shadow border border-gray-700"
              >
                <p className="text-sm text-gray-400">{formatTimeLocal(log.timestamp)}</p>
                <p className="font-semibold text-orange-300">{log.inventory_name}</p>
                <p className="text-gray-200">
                  <span className="text-orange-400">User:</span> {log.user_name}
                </p>
                <p className="text-gray-200">
                  <span className="text-orange-400">Action:</span> {log.action}
                </p>
                <p className="text-gray-200">
                  <span className="text-orange-400">Field:</span> {log.field_changed}
                </p>
                <div className="flex justify-between text-sm mt-2">
                  <span className="text-red-400">Old: {log.old_value}</span>
                  <span className="text-green-400">New: {log.new_value}</span>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </section>
  );
}
