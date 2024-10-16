"use client";

interface PopupProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
}

const Popup: React.FC<PopupProps> = ({ isOpen, onClose, children }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center text-black bg-white bg-opacity-60 z-50">
      <div className="bg-white p-6 rounded-xl shadow-2xl relative border border-gray-300">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-600 hover:text-gray-800 transition-transform transform hover:scale-125"
          aria-label="Close"
        >
          &times;
        </button>
        <div className="p-4 rounded-lg transition-all duration-300">
          {children}
        </div>
      </div>
    </div>
  );
};

export default Popup;
