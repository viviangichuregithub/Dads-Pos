"use client";

export default function InventoryModal({ isOpen, onClose, form, setForm, onSubmit, editId }) {
  if (!isOpen) return null;

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });
  const handleFormSubmit = async (e) => {
    e.preventDefault();
    await onSubmit(e);
  };
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-gray-900 rounded-xl p-6 shadow-lg w-full max-w-md">
        <h2 className="text-2xl font-semibold text-orange-400 mb-4">
          {editId ? "Edit Shoe" : "Add Shoe"}
        </h2>
        <form onSubmit={handleFormSubmit} className="space-y-4">
          <input
            type="text"
            name="name"
            placeholder="Shoe Name"
            value={form.name}
            onChange={handleChange}
            required
            className="w-full px-3 py-2 rounded-lg bg-gray-800 border border-gray-700 text-gray-100 placeholder-gray-400 focus:ring-2 focus:ring-orange-400 outline-none"
          />
          <input
            type="number"
            name="price"
            placeholder="Price"
            value={form.price}
            onChange={handleChange}
            required
            className="w-full px-3 py-2 rounded-lg bg-gray-800 border border-gray-700 text-gray-100 placeholder-gray-400 focus:ring-2 focus:ring-orange-400 outline-none"
          />
          <input
            type="number"
            name="quantity"
            placeholder="Quantity"
            value={form.quantity}
            onChange={handleChange}
            required
            className="w-full px-3 py-2 rounded-lg bg-gray-800 border border-gray-700 text-gray-100 placeholder-gray-400 focus:ring-2 focus:ring-orange-400 outline-none"
          />
          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-lg bg-gray-700 hover:bg-gray-600"
            >
              Cancel
            </button>

            <button
              type="submit"
              className={`px-4 py-2 rounded-lg text-white ${
                editId ? "bg-green-500 hover:bg-green-600" : "bg-blue-600 hover:bg-blue-700"
              }`}
            >
              {editId ? "Update" : "Add"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
