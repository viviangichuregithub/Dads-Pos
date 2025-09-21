"use client";
import { Edit, Trash2, Check, X } from "lucide-react";
import { useState } from "react";

export default function InventoryTable({ inventory, onEdit, onDelete, onInlineUpdate }) {
  const [editingId, setEditingId] = useState(null);
  const [tempData, setTempData] = useState({ name: "", price: "", quantity: "" });

  const startEditing = (item) => {
    setEditingId(item.id);
    setTempData({ name: item.name, price: item.price, quantity: item.quantity });
  };

  const cancelEditing = () => setEditingId(null);

  const handleChange = (e) => setTempData({ ...tempData, [e.target.name]: e.target.value });

  const saveEditing = async () => {
    await onInlineUpdate(editingId, tempData);
    setEditingId(null);
  };

  return (
    <section className="bg-gray-900 rounded-xl p-6 shadow-lg border border-gray-800 overflow-x-auto">
      <table className="w-full table-auto border-collapse">
        <thead>
          <tr className="bg-gray-800 text-left text-gray-300">
            <th className="px-4 py-3 border-b border-gray-700">Name</th>
            <th className="px-4 py-3 border-b border-gray-700">Price</th>
            <th className="px-4 py-3 border-b border-gray-700">Quantity</th>
            <th className="px-4 py-3 border-b border-gray-700">Actions</th>
          </tr>
        </thead>
        <tbody>
          {inventory.length > 0 ? (
            inventory.map((item) => (
              <tr
                key={item.id}
                className="hover:bg-gray-800 transition-colors border-b border-gray-700"
              >
                <td className="px-4 py-3">
                  {editingId === item.id ? (
                    <input
                      name="name"
                      value={tempData.name}
                      onChange={handleChange}
                      className="bg-gray-800 px-2 py-1 rounded border border-gray-700 text-gray-100 w-full"
                    />
                  ) : (
                    item.name
                  )}
                </td>
                <td className="px-4 py-3">
                  {editingId === item.id ? (
                    <input
                      name="price"
                      value={tempData.price}
                      type="number"
                      onChange={handleChange}
                      className="bg-gray-800 px-2 py-1 rounded border border-gray-700 text-gray-100 w-full"
                    />
                  ) : (
                    item.price
                  )}
                </td>
                <td className="px-4 py-3">
                  {editingId === item.id ? (
                    <input
                      name="quantity"
                      value={tempData.quantity}
                      type="number"
                      onChange={handleChange}
                      className="bg-gray-800 px-2 py-1 rounded border border-gray-700 text-gray-100 w-full"
                    />
                  ) : (
                    item.quantity
                  )}
                </td>
                <td className="px-4 py-3 space-x-2 flex">
                  {editingId === item.id ? (
                    <>
                      <button onClick={saveEditing} className="bg-green-500 text-white px-2 py-1 rounded-lg hover:bg-green-600 flex items-center gap-1">
                        <Check className="w-4 h-4" /> Save
                      </button>
                      <button onClick={cancelEditing} className="bg-red-600 text-white px-2 py-1 rounded-lg hover:bg-red-800 flex items-center gap-1">
                        <X className="w-4 h-4" /> Cancel
                      </button>
                    </>
                  ) : (
                    <>
                      <button onClick={() => startEditing(item)} className="bg-green-500 text-white px-2 py-1 rounded-lg hover:bg-green-600 flex items-center gap-1">
                        <Edit className="w-4 h-4" /> Edit
                      </button>
                      <button onClick={() => onDelete(item.id)} className="bg-red-600 text-white px-2 py-1 rounded-lg hover:bg-red-800 flex items-center gap-1">
                        <Trash2 className="w-4 h-4" /> Delete
                      </button>
                    </>
                  )}
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="4" className="text-center py-6 text-gray-500 italic">
                No shoes found.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </section>
  );
}
