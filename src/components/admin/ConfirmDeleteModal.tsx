interface ConfirmDeleteModalProps {
  isOpen: boolean;
  title: string;
  message: string;
  itemName?: string;
  onConfirm: () => void;
  onCancel: () => void;
}

export function ConfirmDeleteModal({
  isOpen,
  title,
  message,
  itemName,
  onConfirm,
  onCancel,
}: ConfirmDeleteModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fadeIn">
      <div className="bg-white w-full max-w-md rounded-2xl shadow-2xl border border-[#EDE8DF] p-6 space-y-4">
        <div className="w-12 h-12 rounded-full bg-red-50 text-red-600 flex items-center justify-center text-xl font-bold">
          ⚠️
        </div>

        <div>
          <h3 className="font-serif text-xl font-medium text-[#1A1916]">{title}</h3>
          {itemName && (
            <p className="font-ui font-semibold text-sm text-[#1A1916] mt-1 bg-[#FAF7F2] p-2 rounded-lg border border-[#EDE8DF]">
              "{itemName}"
            </p>
          )}
          <p className="font-ui text-xs text-[#7A776F] mt-2 leading-relaxed">{message}</p>
        </div>

        <div className="flex items-center justify-end gap-3 pt-3 border-t border-[#EDE8DF]">
          <button
            onClick={onCancel}
            className="font-ui text-xs font-semibold px-4 py-2.5 rounded-full border border-[#EDE8DF] text-[#4A4845] hover:bg-[#FAF7F2] transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="font-ui text-xs font-semibold px-5 py-2.5 rounded-full bg-red-600 hover:bg-red-700 text-white transition-colors shadow-sm"
          >
            Yes, Delete Permanently
          </button>
        </div>
      </div>
    </div>
  );
}
