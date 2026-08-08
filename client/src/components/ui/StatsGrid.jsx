function ConfirmModal({ open, title, message, onConfirm, onCancel }) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl shadow-2xl w-96 p-8">
        <h2 className="text-2xl font-bold">{title}</h2>

        <p className="text-gray-600 mt-4">{message}</p>

        <div className="flex justify-end gap-4 mt-8">
          <button onClick={onCancel} className="px-5 py-2 rounded-lg border">
            Cancel
          </button>

          <button
            onClick={onConfirm}
            className="px-5 py-2 rounded-lg bg-red-600 text-white"
          >
            Confirm
          </button>
        </div>
      </div>
    </div>
  );
}

export default ConfirmModal;
