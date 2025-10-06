export const ConfirmModel = ({ open, onCancel, onConfirm }) => {
    if (!open) return null;
  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center bg-black/40">
      <div className="w-[520px] rounded-xl border border-gray-200 bg-white p-5 shadow-xl">
        <div className="mb-4 text-sm font-semibold text-gray-700">Confirm</div>
        <div className="mb-6 text-sm text-gray-700">Do you really want to remove this item?</div>
        <div className="flex items-center justify-end gap-3">
          <button onClick={onCancel} className="rounded-lg border border-gray-300 px-4 py-2 text-sm hover:bg-gray-50">
            Cancel
          </button>
          <button onClick={onConfirm} className="rounded-lg bg-red-600 px-4 py-2 text-sm font-semibold text-white hover:bg-red-500">
            Confirm
          </button>
        </div>
      </div>
    </div>
  );
};