import React from "react";

function ConfirmModal({ title, message, onConfirm, onClose }) {
  return (
    <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50">
      <div className="bg-[#1a0f2e] p-5 rounded-xl w-[320px] text-center">

        <h2 className="font-semibold mb-2">{title}</h2>
        <p className="text-sm text-gray-400 mb-4">{message}</p>

        <div className="flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 py-2 rounded bg-gray-600"
          >
            Cancel
          </button>

          <button
            onClick={onConfirm}
            className="flex-1 py-2 rounded bg-red-600"
          >
            Confirm
          </button>
        </div>

      </div>
    </div>
  );
}

export default ConfirmModal;