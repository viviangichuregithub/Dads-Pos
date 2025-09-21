"use client";

import { FileText, Download } from "lucide-react";

export default function InventoryHeader({ search, setSearch, onAdd, onImport, onExport }) {
  return (
    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-4">
      {/* Search Input */}
      <input
        type="text"
        placeholder="Search by name..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="px-3 py-2 rounded-lg bg-gray-800 border border-gray-700 text-gray-100 placeholder-gray-400 focus:ring-2 focus:ring-orange-400 outline-none w-full md:w-1/3"
      />

      {/* Action Buttons */}
      <div className="flex gap-2 flex-wrap items-center">
        <button
          onClick={onAdd}
          className="bg-blue-700 hover:bg-blue-900 px-4 py-2 rounded-lg"
        >
          Add Shoe
        </button>

        <button
          onClick={() => onExport("excel")}
          className="bg-green-700 hover:bg-green-900 px-4 py-2 rounded-lg flex items-center gap-1"
        >
          <Download className="w-4 h-4" /> Export Excel
        </button>

        {/* File Upload */}
       <label className="bg-purple-700 hover:bg-purple-900 px-4 py-2 rounded-lg cursor-pointer text-white">
  Import Excel
  <input
    type="file"
    accept=".xlsx, .xls"
    onChange={(e) => onImport(e.target.files[0])} 
    className="hidden"
  />
</label>

      </div>
    </div>
  );
}
